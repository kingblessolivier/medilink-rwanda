"""S9 endpoints (contract sprint-09 §3.3): inboxes, preferences, push subscriptions,
announcements, templates and the delivery log."""

from __future__ import annotations

import base64
import datetime as dt
from collections import Counter
from typing import Any, cast

from django.db import transaction
from django.db.models import Count, Prefetch
from django.utils import timezone
from drf_spectacular.utils import OpenApiParameter, extend_schema
from rest_framework import exceptions, status
from rest_framework.request import Request
from rest_framework.response import Response

from medilink.accounts.models import User
from medilink.audit.services import record
from medilink.authz.permissions import (
    IsPatientAuthenticated,
    IsPlatformAdmin,
    IsStaffAuthenticated,
    PublicEndpoint,
    get_principal,
)
from medilink.core.exceptions import BusinessRuleViolation, Conflict
from medilink.core.net import user_agent
from medilink.core.pagination import DefaultPagination
from medilink.facilities.views_base import Needs, err
from medilink.notifications import (
    announcements as ann,
)
from medilink.notifications import (
    conf,
    hooks,
    observers,
    preferences,
    registry,
    templates,
)
from medilink.notifications import serializers as s
from medilink.notifications.channels.in_app import publish as socket_publish
from medilink.notifications.models import (
    FACILITY_AUDIENCES,
    PLATFORM_AUDIENCES,
    Announcement,
    AnnouncementAudience,
    AnnouncementStatus,
    AttemptStatus,
    Audience,
    DeliveryAttempt,
    Notification,
    Preference,
    PushKind,
    PushSubscription,
    RevokedReason,
    Template,
    TemplateSource,
)
from medilink.notifications.throttling import PushSubscribeThrottle
from medilink.patients.errors import FieldRule, PatientsAPIView

TAGS = ["notifications"]
MAX_ACTIVE_SUBSCRIPTIONS = 10


def _user(request: Request) -> User:
    """The signed-in account (every view here requires authentication)."""
    return cast(User, request.user)


def _bad(field: str, message: str) -> exceptions.ValidationError:
    return exceptions.ValidationError({field: [message]})


def _uuid_param(request: Request, name: str) -> str | None:
    import uuid

    value = request.query_params.get(name)
    if not value:
        return None
    try:
        return str(uuid.UUID(value))
    except ValueError:
        raise _bad(name, "Not a valid ID.") from None


def _since(request: Request, default: dt.datetime | None = None) -> dt.datetime | None:
    value = request.query_params.get("since")
    if not value:
        return default
    try:
        parsed = dt.datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        raise _bad("since", "Use an ISO 8601 timestamp with a time zone.") from None
    if parsed.tzinfo is None:
        raise _bad("since", "Use an ISO 8601 timestamp with a time zone.")
    return parsed


# ---------------------------------------------------------------------------------------------
# Inboxes (patient and staff)
# ---------------------------------------------------------------------------------------------


class _Inbox(PatientsAPIView):
    audience: str = Audience.PATIENT

    def principal(self) -> Any:
        principal = get_principal(self.request)
        if principal is None:
            raise exceptions.NotAuthenticated()
        return principal

    def facility_id(self) -> Any:
        return self.principal().active_facility_id if self.audience == Audience.STAFF else None

    def inbox(self) -> Any:
        return Notification.objects.for_inbox(
            _user(self.request), self.audience, facility_id=self.facility_id()
        )

    def facility_names(self, rows: list[Notification]) -> dict[Any, str]:
        from medilink.tenancy.models import Facility

        ids = {r.facility_id for r in rows if r.facility_id}
        return dict(Facility.objects.filter(pk__in=ids).values_list("pk", "name")) if ids else {}

    def serialize(self, rows: list[Notification]) -> Any:
        return s.NotificationSerializer(
            rows, many=True, context={"facility_names": self.facility_names(rows)}
        ).data

    def own(self, notification_id: Any) -> Notification:
        row = self.inbox().filter(pk=notification_id).first()
        if row is None:
            raise exceptions.NotFound()
        return row


def _linked_patient_ids(user: Any) -> set[str]:
    from medilink.patients.models import PatientLink

    return {
        str(pid)
        for pid in PatientLink.objects.for_account(user)
        .active()
        .values_list("patient_id", flat=True)
    }


class _ListView(_Inbox):
    @extend_schema(
        tags=TAGS,
        parameters=[
            OpenApiParameter("is_read", bool),
            OpenApiParameter("patient_id", str),
        ],
        responses={200: s.NotificationSerializer(many=True)},
    )
    def get(self, request: Request) -> Response:
        rows = self.inbox().order_by("-created_at")
        is_read = request.query_params.get("is_read")
        if is_read in ("true", "false"):
            rows = rows.filter(read_at__isnull=is_read == "false")
        patient_id = _uuid_param(request, "patient_id")
        if patient_id:
            if self.audience != Audience.PATIENT or patient_id not in _linked_patient_ids(
                _user(request)
            ):
                raise exceptions.NotFound()
            rows = rows.filter(patient_id=patient_id)
        paginator = DefaultPagination()
        page: list[Any] = paginator.paginate_queryset(rows, request, view=self) or []
        return paginator.get_paginated_response(self.serialize(list(page)))


class _DetailView(_Inbox):
    @extend_schema(tags=TAGS, responses={200: s.NotificationSerializer, 404: err("Not yours")})
    def get(self, request: Request, notification_id: Any) -> Response:
        return Response(self.serialize([self.own(notification_id)])[0])


class _CountView(_Inbox):
    @extend_schema(tags=TAGS, responses={200: s.UnreadCountSerializer})
    def get(self, request: Request) -> Response:
        body: dict[str, Any] = {"unread": self.inbox().unread().count()}
        if self.audience == Audience.STAFF:
            others = (
                Notification.objects.filter(
                    recipient_user=_user(request),
                    audience=Audience.STAFF,
                    read_at__isnull=True,
                    facility_id__isnull=False,
                )
                .exclude(facility_id=self.facility_id())
                .values("facility_id")
                .annotate(unread=Count("id"))
                .order_by("facility_id")
            )
            body["other_facilities"] = [
                {"facility_id": o["facility_id"], "unread": o["unread"]} for o in others
            ]
        return Response(body)


def _mark_read(rows: Any, now: dt.datetime) -> list[Any]:
    ids = list(rows.filter(read_at__isnull=True).values_list("pk", flat=True))
    if ids:
        Notification.objects.filter(pk__in=ids).update(read_at=now, updated_at=now)
        DeliveryAttempt.objects.filter(
            notification_id__in=ids,
            status__in=[AttemptStatus.SENT, AttemptStatus.DELIVERED],
        ).update(status=AttemptStatus.READ, updated_at=now)
    return ids


class _ReadView(_Inbox):
    @extend_schema(
        tags=TAGS, request=None, responses={200: s.NotificationSerializer, 404: err("Not yours")}
    )
    def post(self, request: Request, notification_id: Any) -> Response:
        row = self.own(notification_id)
        with transaction.atomic():
            ids = _mark_read(self.inbox().filter(pk=row.pk), timezone.now())
        if ids:
            user_id, audience = _user(request).pk, self.audience
            transaction.on_commit(
                lambda: socket_publish(
                    audience, user_id, "notification.read", {"ids": [str(i) for i in ids]}
                )
            )
        row.refresh_from_db()
        return Response(self.serialize([row])[0])


class _ReadAllView(_Inbox):
    @extend_schema(tags=TAGS, request=s.ReadAllSerializer, responses={200: s.MarkedSerializer})
    def post(self, request: Request) -> Response:
        body = s.ReadAllSerializer(data=request.data or {})
        body.is_valid(raise_exception=True)
        rows = self.inbox()
        before = body.validated_data.get("before")
        if before:
            rows = rows.filter(created_at__lte=before)
        with transaction.atomic():
            ids = _mark_read(rows, timezone.now())
        if ids:
            user_id, audience = _user(request).pk, self.audience
            transaction.on_commit(
                lambda: socket_publish(audience, user_id, "notification.read", {"all": True})
            )
        return Response({"marked": len(ids)})


def _inbox_views(audience: str, permission: Any) -> dict[str, type[_Inbox]]:
    out: dict[str, type[_Inbox]] = {}
    for name, base in (
        ("list", _ListView),
        ("detail", _DetailView),
        ("count", _CountView),
        ("read", _ReadView),
        ("read_all", _ReadAllView),
    ):
        view = type(
            f"{audience.title()}Notification{name.title().replace('_', '')}View",
            (base,),
            {"audience": audience, "permission_classes": [permission]},
        )
        out[name] = view
    return out


PATIENT_INBOX = _inbox_views(Audience.PATIENT, IsPatientAuthenticated)
STAFF_INBOX = _inbox_views(Audience.STAFF, IsStaffAuthenticated)


# ---------------------------------------------------------------------------------------------
# Preferences
# ---------------------------------------------------------------------------------------------


def _hhmm(value: dt.time) -> str:
    return value.strftime("%H:%M")


class PatientPreferencesView(_Inbox):
    permission_classes = [IsPatientAuthenticated]

    def build(self, user: Any) -> dict[str, Any]:
        from medilink.patients.models import PatientLink, Relationship

        prefs = preferences.effective(user, Audience.PATIENT)
        start, end = prefs.quiet_hours or conf.default_quiet_hours()
        saved = preferences.row(user, Audience.PATIENT)
        links = (
            PatientLink.objects.for_account(user)
            .active()
            .exclude(relationship=Relationship.SELF)
            .select_related("patient")
            .order_by("created_at")
        )
        return {
            "language": user.preferred_language or "rw",
            "available_channels": preferences.available_channels(),
            "channels": prefs.channels,
            "quiet_hours": {
                "is_enabled": prefs.quiet_hours is not None,
                "start": _hhmm(start),
                "end": _hhmm(end),
            },
            "reminder_offsets_minutes": prefs.reminder_offsets_minutes,
            "dependents": [
                {
                    "patient_id": link.patient_id,
                    "display_name": (link.patient.preferred_name or link.patient.full_name).split()[
                        0
                    ],
                    "relationship": link.relationship,
                    "receive_alerts": str(link.patient_id) not in prefs.dependents_off,
                }
                for link in links
            ],
            "is_critical_locked": hooks.has_active_ticket(user),
            "version": saved.version if saved else 0,
        }

    @extend_schema(tags=TAGS, responses={200: s.PatientPreferencesSerializer})
    def get(self, request: Request) -> Response:
        return Response(self.build(_user(request)))

    @extend_schema(
        tags=TAGS,
        request=s.PatientPreferencesPatchSerializer,
        responses={
            200: s.PatientPreferencesSerializer,
            409: err("Stale version"),
            422: err("Critical is locked while a ticket is active"),
        },
    )
    def patch(self, request: Request) -> Response:
        body = s.PatientPreferencesPatchSerializer(data=request.data)
        body.is_valid(raise_exception=True)
        data = body.validated_data
        user = _user(request)
        with transaction.atomic():
            saved = (
                Preference.objects.select_for_update()
                .filter(user=user, audience=Audience.PATIENT, patient_id__isnull=True)
                .first()
            )
            current = saved.version if saved else 0
            if data["version"] != current:
                raise Conflict()
            fields: list[str] = []
            row = saved or Preference(user=user, audience=Audience.PATIENT, version=0)
            if "channels" in data:
                allowed = set(preferences.available_channels())
                chosen = {
                    level: list(dict.fromkeys(data["channels"][level]))
                    for level in preferences.PRIORITIES
                }
                for level, values in chosen.items():
                    unknown = set(values) - allowed
                    if unknown:
                        raise _bad(f"channels.{level}", f"Unknown channel: {sorted(unknown)[0]}.")
                if not chosen["critical"] and hooks.has_active_ticket(user):
                    raise FieldRule(
                        "channels.critical",
                        "Critical alerts stay on while you have a ticket in a queue.",
                    )
                row.channels = chosen
                fields.append("channels")
            if "quiet_hours" in data:
                quiet = data["quiet_hours"]
                row.quiet_hours_enabled = quiet["is_enabled"]
                row.quiet_hours_start = quiet["start"]
                row.quiet_hours_end = quiet["end"]
                fields.append("quiet_hours")
            if "reminder_offsets_minutes" in data:
                row.reminder_offsets_minutes = sorted(
                    set(data["reminder_offsets_minutes"]), reverse=True
                )
                fields.append("reminder_offsets_minutes")
            row.version = current + 1
            row.save()
            if "language" in data:
                user.preferred_language = data["language"]
                user.save(update_fields=["preferred_language", "updated_at"])
                fields.append("language")
            if "dependents" in data:
                linked = _linked_patient_ids(user)
                for item in data["dependents"]:
                    pid = str(item["patient_id"])
                    if pid not in linked:
                        raise exceptions.NotFound()
                    Preference.objects.update_or_create(
                        user=user,
                        audience=Audience.PATIENT,
                        patient_id=pid,
                        defaults={"receive_alerts": item["receive_alerts"]},
                    )
                fields.append("dependents")
            record(
                "notifications.preferences.updated",
                request=request,
                object_type="notifications.preference",
                object_id=row.pk,
                metadata={"audience": "patient", "fields": sorted(fields)},
            )
        return Response(self.build(user))


class StaffPreferencesView(_Inbox):
    permission_classes = [IsStaffAuthenticated]
    audience = Audience.STAFF

    def build(self, user: Any) -> dict[str, Any]:
        prefs = preferences.effective(user, Audience.STAFF)
        return {
            "language": user.preferred_language or "rw",
            "sound_enabled": prefs.sound_enabled,
            "approvals_digest": prefs.approvals_digest,
            "version": prefs.version,
        }

    @extend_schema(tags=TAGS, responses={200: s.StaffPreferencesSerializer})
    def get(self, request: Request) -> Response:
        return Response(self.build(_user(request)))

    @extend_schema(
        tags=TAGS,
        request=s.StaffPreferencesPatchSerializer,
        responses={200: s.StaffPreferencesSerializer, 409: err("Stale version")},
    )
    def patch(self, request: Request) -> Response:
        body = s.StaffPreferencesPatchSerializer(data=request.data)
        body.is_valid(raise_exception=True)
        data = body.validated_data
        user = _user(request)
        with transaction.atomic():
            saved = (
                Preference.objects.select_for_update()
                .filter(user=user, audience=Audience.STAFF, patient_id__isnull=True)
                .first()
            )
            current = saved.version if saved else 0
            if data["version"] != current:
                raise Conflict()
            row = saved or Preference(user=user, audience=Audience.STAFF, version=0)
            fields = []
            if "sound_enabled" in data:
                row.sound_enabled = data["sound_enabled"]
                fields.append("sound_enabled")
            if "approvals_digest" in data:
                row.approvals_digest = data["approvals_digest"]
                fields.append("approvals_digest")
            row.version = current + 1
            row.save()
            if "language" in data:
                user.preferred_language = data["language"]
                user.save(update_fields=["preferred_language", "updated_at"])
                fields.append("language")
            record(
                "notifications.preferences.updated",
                request=request,
                object_type="notifications.preference",
                object_id=row.pk,
                metadata={"audience": "staff", "fields": sorted(fields)},
            )
        return Response(self.build(user))


# ---------------------------------------------------------------------------------------------
# Push subscriptions
# ---------------------------------------------------------------------------------------------


def _b64url_len(value: str) -> int | None:
    try:
        return len(base64.urlsafe_b64decode(value + "=" * (-len(value) % 4)))
    except (ValueError, TypeError):
        return None


class WebPushKeyView(PatientsAPIView):
    permission_classes = [PublicEndpoint]
    authentication_classes: list[Any] = []

    @extend_schema(tags=TAGS, responses={200: s.WebPushKeySerializer})
    def get(self, request: Request) -> Response:
        enabled = conf.push_enabled()
        return Response(
            {"public_key": conf.vapid_public_key() if enabled else None, "is_enabled": enabled}
        )


def _save_subscription(
    request: Request,
    *,
    endpoint: str,
    kind: str,
    host: str,
    label: str,
    p256dh: str = "",
    auth: str = "",
) -> Response:
    """Create or take over the push subscription for `endpoint` (a web push URL or the app's
    FCM token), keeping the newest MAX_ACTIVE_SUBSCRIPTIONS per account."""
    user = _user(request)
    session_key = getattr(request.session, "session_key", None)
    now = timezone.now()
    created = True
    with transaction.atomic():
        sub = PushSubscription.objects.select_for_update().filter(endpoint=endpoint).first()
        if sub is not None and sub.user_id == user.pk and sub.revoked_at is None:
            created = False
        elif sub is not None and sub.user_id != user.pk and sub.revoked_at is None:
            record(
                "notifications.push.unsubscribed",
                request=request,
                object_type="notifications.push_subscription",
                object_id=sub.pk,
                metadata={
                    "subscription_id": str(sub.pk),
                    "endpoint_host": sub.endpoint_host,
                    "reason": RevokedReason.REPLACED,
                },
            )
        if sub is None:
            sub = PushSubscription(endpoint=endpoint)
        sub.user = user
        sub.kind = kind
        sub.endpoint_host = host
        sub.p256dh = p256dh
        sub.auth_secret = auth
        sub.label = label
        sub.session_key_hash = observers.session_hash(session_key) if session_key else None
        sub.revoked_at = None
        sub.revoked_reason = None
        sub.failure_count = 0
        sub.save()
        active = list(
            PushSubscription.objects.filter(user=user, revoked_at__isnull=True)
            .exclude(pk=sub.pk)
            .order_by("created_at")
        )
        for old in active[: max(0, len(active) - (MAX_ACTIVE_SUBSCRIPTIONS - 1))]:
            old.revoked_at = now
            old.revoked_reason = RevokedReason.LIMIT
            old.save(update_fields=["revoked_at", "revoked_reason", "updated_at"])
        if created:
            record(
                "notifications.push.subscribed",
                request=request,
                object_type="notifications.push_subscription",
                object_id=sub.pk,
                metadata={
                    "subscription_id": str(sub.pk),
                    "endpoint_host": host,
                    "reason": "user",
                },
            )
    return Response(
        s.PushSubscriptionSerializer(sub).data,
        status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
    )


class PushSubscriptionsView(_Inbox):
    permission_classes = [IsPatientAuthenticated]

    def get_throttles(self) -> list[Any]:
        throttles = super().get_throttles()
        if self.request.method == "POST":
            throttles.append(PushSubscribeThrottle())
        return throttles

    @extend_schema(tags=TAGS, responses={200: s.PushSubscriptionSerializer(many=True)})
    def get(self, request: Request) -> Response:
        rows = PushSubscription.objects.filter(
            user=_user(request), revoked_at__isnull=True
        ).order_by("created_at")
        return Response(s.PushSubscriptionSerializer(rows, many=True).data)

    @extend_schema(
        tags=TAGS,
        request=s.PushSubscriptionRequestSerializer,
        responses={
            200: s.PushSubscriptionSerializer,
            201: s.PushSubscriptionSerializer,
            400: err("Endpoint not allowed or invalid keys"),
        },
    )
    def post(self, request: Request) -> Response:
        if not conf.push_enabled():
            raise BusinessRuleViolation("Push notifications are not available.")
        body = s.PushSubscriptionRequestSerializer(data=request.data)
        body.is_valid(raise_exception=True)
        data = body.validated_data
        host = conf.endpoint_host(data["endpoint"])
        if host is None:
            raise _bad("endpoint", "This push service is not allowed.")
        if _b64url_len(data["keys"]["p256dh"]) != 65:
            raise _bad("keys.p256dh", "Invalid key.")
        if _b64url_len(data["keys"]["auth"]) != 16:
            raise _bad("keys.auth", "Invalid key.")
        return _save_subscription(
            request,
            endpoint=data["endpoint"],
            kind=PushKind.WEB,
            host=host,
            label=observers.device_label(user_agent(request)),
            p256dh=data["keys"]["p256dh"],
            auth=data["keys"]["auth"],
        )


class AppDevicesView(_Inbox):
    """The phone app registers its Firebase Cloud Messaging token here after sign-in; it removes
    it with DELETE push-subscriptions/{id}/ at sign-out."""

    permission_classes = [IsPatientAuthenticated]

    def get_throttles(self) -> list[Any]:
        return [*super().get_throttles(), PushSubscribeThrottle()]

    @extend_schema(
        tags=TAGS,
        request=s.AppDeviceRequestSerializer,
        responses={
            200: s.PushSubscriptionSerializer,
            201: s.PushSubscriptionSerializer,
            400: err("Invalid token"),
            422: err("Phone push not configured"),
        },
    )
    def post(self, request: Request) -> Response:
        if not conf.fcm_enabled():
            raise BusinessRuleViolation("Phone notifications are not available.")
        body = s.AppDeviceRequestSerializer(data=request.data)
        body.is_valid(raise_exception=True)
        data = body.validated_data
        return _save_subscription(
            request,
            endpoint=data["token"],
            kind=PushKind.APP,
            host="fcm.googleapis.com",
            label=data.get("name") or "MediLink app",
        )


class PushSubscriptionDetailView(_Inbox):
    permission_classes = [IsPatientAuthenticated]

    @extend_schema(tags=TAGS, responses={204: None, 404: err("Not yours")})
    def delete(self, request: Request, subscription_id: Any) -> Response:
        with transaction.atomic():
            sub = (
                PushSubscription.objects.select_for_update()
                .filter(pk=subscription_id, user=_user(request), revoked_at__isnull=True)
                .first()
            )
            if sub is None:
                raise exceptions.NotFound()
            sub.revoked_at = timezone.now()
            sub.revoked_reason = RevokedReason.USER
            sub.save(update_fields=["revoked_at", "revoked_reason", "updated_at"])
            record(
                "notifications.push.unsubscribed",
                request=request,
                object_type="notifications.push_subscription",
                object_id=sub.pk,
                metadata={
                    "subscription_id": str(sub.pk),
                    "endpoint_host": sub.endpoint_host,
                    "reason": RevokedReason.USER,
                },
            )
        return Response(status=status.HTTP_204_NO_CONTENT)


# ---------------------------------------------------------------------------------------------
# Announcements (facility and platform)
# ---------------------------------------------------------------------------------------------

MANAGE = "announcements.manage"


class _Announcements(PatientsAPIView):
    platform = False

    def principal(self) -> Any:
        principal = get_principal(self.request)
        if principal is None:
            raise exceptions.NotAuthenticated()
        return principal

    def scope(self) -> Any:
        rows = Announcement.objects.select_related("created_by")
        if self.platform:
            return rows.filter(facility__isnull=True)
        return rows.filter(facility_id=self.principal().active_facility_id)

    def get_row(self, announcement_id: Any, *, lock: bool = False) -> Announcement:
        rows = self.scope()
        if lock:
            rows = rows.select_for_update(of=("self",))
        row = rows.filter(pk=announcement_id).first()
        if row is None:
            raise exceptions.NotFound()
        return row

    def validate(self, data: dict[str, Any], row: Announcement | None = None) -> dict[str, Any]:
        merged = {
            "audience": row.audience if row else None,
            "target_facility_ids": row.target_facility_ids if row else None,
            "range_starts_on": row.range_starts_on if row else None,
            "range_ends_on": row.range_ends_on if row else None,
            "title_i18n": row.title_i18n if row else {},
            "body_i18n": row.body_i18n if row else {},
            "starts_at": row.starts_at if row else None,
            "ends_at": row.ends_at if row else None,
            "priority": row.priority if row else "routine",
        }
        merged.update({k: v for k, v in data.items() if k != "version"})
        allowed = PLATFORM_AUDIENCES if self.platform else FACILITY_AUDIENCES
        if merged["audience"] not in allowed:
            raise _bad("audience", "This audience is not available here.")
        if merged["audience"] == AnnouncementAudience.PATIENTS_IN_RANGE and (
            not merged["range_starts_on"] or not merged["range_ends_on"]
        ):
            raise _bad("range_starts_on", "Choose the visit dates.")
        if (
            merged["range_starts_on"]
            and merged["range_ends_on"]
            and merged["range_ends_on"] < merged["range_starts_on"]
        ):
            raise _bad("range_ends_on", "The end date is before the start.")
        if merged["starts_at"] and merged["ends_at"] and merged["ends_at"] <= merged["starts_at"]:
            raise _bad("ends_at", "The end is before the start.")
        if merged["audience"] == AnnouncementAudience.SELECTED_FACILITIES:
            ids = merged["target_facility_ids"] or []
            if not 1 <= len(ids) <= 200:
                raise _bad("target_facility_ids", "Choose between 1 and 200 facilities.")
            from medilink.tenancy.models import Facility

            known = set(Facility.objects.filter(pk__in=ids).values_list("pk", flat=True))
            if len(known) != len(set(ids)):
                raise exceptions.NotFound()
        else:
            merged["target_facility_ids"] = None
        merged["title_i18n"] = {k: v for k, v in (merged["title_i18n"] or {}).items() if v}
        merged["body_i18n"] = {k: v for k, v in (merged["body_i18n"] or {}).items() if v}
        try:
            ann.validate_texts(merged["title_i18n"], merged["body_i18n"])
        except ann.AnnouncementError as exc:
            raise _bad(exc.field, exc.message) from None
        return merged


class _AnnouncementList(_Announcements):
    @extend_schema(
        tags=TAGS,
        parameters=[OpenApiParameter("status", str)],
        responses={200: s.AnnouncementSerializer(many=True)},
    )
    def get(self, request: Request) -> Response:
        rows = self.scope().order_by("-created_at")
        wanted = request.query_params.get("status")
        if wanted:
            rows = rows.filter(status=wanted)
        paginator = DefaultPagination()
        page: list[Any] = paginator.paginate_queryset(rows, request, view=self) or []
        return paginator.get_paginated_response(s.AnnouncementSerializer(page, many=True).data)

    @extend_schema(
        tags=TAGS,
        request=s.AnnouncementWriteSerializer,
        responses={201: s.AnnouncementSerializer, 400: err("Invalid")},
    )
    def post(self, request: Request) -> Response:
        body = s.AnnouncementWriteSerializer(data=request.data)
        body.is_valid(raise_exception=True)
        merged = self.validate(dict(body.validated_data))
        with transaction.atomic():
            row = Announcement.objects.create(
                facility_id=None if self.platform else self.principal().active_facility_id,
                created_by=_user(request),
                **merged,
            )
            record(
                "announcement.created",
                request=request,
                object_type="notifications.announcement",
                object_id=row.pk,
                metadata={"announcement_id": str(row.pk), "audience": row.audience},
            )
        row = self.scope().get(pk=row.pk)
        return Response(s.AnnouncementSerializer(row).data, status=status.HTTP_201_CREATED)


class _AnnouncementDetail(_Announcements):
    @extend_schema(tags=TAGS, responses={200: s.AnnouncementSerializer, 404: err("Not found")})
    def get(self, request: Request, announcement_id: Any) -> Response:
        return Response(s.AnnouncementSerializer(self.get_row(announcement_id)).data)

    @extend_schema(
        tags=TAGS,
        request=s.AnnouncementPatchSerializer,
        responses={
            200: s.AnnouncementSerializer,
            409: err("Stale version"),
            422: err("Not a draft"),
        },
    )
    def patch(self, request: Request, announcement_id: Any) -> Response:
        body = s.AnnouncementPatchSerializer(data=request.data, partial=True)
        body.is_valid(raise_exception=True)
        with transaction.atomic():
            row = self.get_row(announcement_id, lock=True)
            if body.validated_data.get("version") != row.version:
                raise Conflict()
            if row.status != AnnouncementStatus.DRAFT:
                raise BusinessRuleViolation("Only drafts can be edited.")
            merged = self.validate(dict(body.validated_data), row)
            for key, value in merged.items():
                setattr(row, key, value)
            row.version += 1
            row.save()
            record(
                "announcement.updated",
                request=request,
                object_type="notifications.announcement",
                object_id=row.pk,
                metadata={"announcement_id": str(row.pk), "audience": row.audience},
            )
        return Response(s.AnnouncementSerializer(self.get_row(row.pk)).data)


class _AnnouncementPublish(_Announcements):
    @extend_schema(
        tags=TAGS,
        request=None,
        responses={
            200: s.AnnouncementSerializer,
            409: err("Not a draft"),
            429: err("Daily limit"),
        },
    )
    def post(self, request: Request, announcement_id: Any) -> Response:
        with transaction.atomic():
            row = self.get_row(announcement_id, lock=True)
            if row.status != AnnouncementStatus.DRAFT:
                raise Conflict("This announcement was already published.")
            self.validate({}, row)
            if (
                not self.platform
                and ann.published_today(row.facility_id) >= ann.DAILY_PUBLISH_LIMIT
            ):
                raise exceptions.Throttled(detail="At most 10 announcements a day.")
            ann.publish(row, _user(request))
            record(
                "announcement.published",
                request=request,
                object_type="notifications.announcement",
                object_id=row.pk,
                metadata={
                    "announcement_id": str(row.pk),
                    "audience": row.audience,
                    "priority": row.priority,
                },
            )
        return Response(s.AnnouncementSerializer(self.get_row(row.pk)).data)


class _AnnouncementWithdraw(_Announcements):
    @extend_schema(
        tags=TAGS,
        request=None,
        responses={200: s.AnnouncementSerializer, 422: err("Not published")},
    )
    def post(self, request: Request, announcement_id: Any) -> Response:
        with transaction.atomic():
            row = self.get_row(announcement_id, lock=True)
            if row.status != AnnouncementStatus.PUBLISHED:
                raise BusinessRuleViolation("Only published announcements can be withdrawn.")
            ann.withdraw(row)
            record(
                "announcement.withdrawn",
                request=request,
                object_type="notifications.announcement",
                object_id=row.pk,
                metadata={
                    "announcement_id": str(row.pk),
                    "audience": row.audience,
                    "recipient_count": row.recipient_count or 0,
                },
            )
        return Response(s.AnnouncementSerializer(self.get_row(row.pk)).data)


def _announcement_views(platform: bool) -> dict[str, type[_Announcements]]:
    permission = IsPlatformAdmin if platform else Needs(MANAGE)
    prefix = "Platform" if platform else "Facility"
    return {
        name: type(
            f"{prefix}Announcement{name.title()}View",
            (base,),
            {"platform": platform, "permission_classes": [permission]},
        )
        for name, base in (
            ("list", _AnnouncementList),
            ("detail", _AnnouncementDetail),
            ("publish", _AnnouncementPublish),
            ("withdraw", _AnnouncementWithdraw),
        )
    }


FACILITY_ANNOUNCEMENTS = _announcement_views(platform=False)
PLATFORM_ANNOUNCEMENTS = _announcement_views(platform=True)


# ---------------------------------------------------------------------------------------------
# Delivery log and stats
# ---------------------------------------------------------------------------------------------


def _log_entries(rows: list[Notification]) -> list[dict[str, Any]]:
    return [
        {
            "notification_id": n.pk,
            "event_type": n.event_type,
            "priority": n.priority,
            "recipient_user_id": n.recipient_user_id,
            "patient_id": n.patient_id,
            "template": {
                "code": n.template_code,
                "version": n.template_version,
                "language": n.language,
            },
            "title": n.title,
            "created_at": n.created_at,
            "read_at": n.read_at,
            "attempts": [
                {
                    "channel": a.channel,
                    "attempt_no": a.attempt_no,
                    "is_fallback": a.is_fallback,
                    "status": a.status,
                    "failure_reason": a.failure_reason,
                    "queued_at": a.queued_at,
                    "sent_at": a.sent_at,
                }
                for a in n.attempts.all()
            ],
        }
        for n in rows
    ]


class _Deliveries(PatientsAPIView):
    platform = False

    def rows(self, request: Request) -> Any:
        rows = Notification.objects.prefetch_related(
            Prefetch(
                "attempts", queryset=DeliveryAttempt.objects.order_by("queued_at", "attempt_no")
            )
        ).order_by("-created_at")
        if not self.platform:
            principal = get_principal(request)
            rows = rows.filter(facility_id=principal.active_facility_id if principal else None)
        for param, field in (("event_type", "event_type"),):
            value = request.query_params.get(param)
            if value:
                rows = rows.filter(**{field: value})
        status_ = request.query_params.get("status")
        if status_:
            rows = rows.filter(attempts__status=status_).distinct()
        channel = request.query_params.get("channel")
        if channel:
            rows = rows.filter(attempts__channel=channel).distinct()
        since = _since(request)
        if since:
            rows = rows.filter(created_at__gte=since)
        return rows

    def respond(self, request: Request, rows: Any, audit: tuple[str, Any] | None) -> Response:
        paginator = DefaultPagination()
        page: list[Any] = paginator.paginate_queryset(rows, request, view=self) or []
        if audit:
            key, value = audit
            record(
                "notifications.deliveries.viewed",
                request=request,
                object_type="patient" if key == "patient_id" else "user",
                object_id=value,
                metadata={"filters": sorted(k for k in request.query_params if k != "page")},
            )
        return paginator.get_paginated_response(_log_entries(list(page)))


class StaffDeliveriesView(_Deliveries):
    permission_classes = [Needs("audit.view")]

    @extend_schema(
        tags=TAGS,
        parameters=[
            OpenApiParameter(p, str)
            for p in ("patient_id", "announcement_id", "event_type", "status", "since")
        ],
        responses={200: s.DeliveryLogEntrySerializer(many=True)},
    )
    def get(self, request: Request) -> Response:
        rows = self.rows(request)
        patient_id = _uuid_param(request, "patient_id")
        if patient_id:
            rows = rows.filter(patient_id=patient_id)
        announcement_id = _uuid_param(request, "announcement_id")
        if announcement_id:
            rows = rows.filter(announcement_id=announcement_id)
        return self.respond(request, rows, ("patient_id", patient_id) if patient_id else None)


class PlatformDeliveriesView(_Deliveries):
    permission_classes = [IsPlatformAdmin]
    platform = True

    @extend_schema(
        tags=TAGS,
        parameters=[
            OpenApiParameter(p, str)
            for p in ("recipient_user_id", "event_type", "channel", "status", "since")
        ],
        responses={200: s.DeliveryLogEntrySerializer(many=True)},
    )
    def get(self, request: Request) -> Response:
        rows = self.rows(request)
        recipient = _uuid_param(request, "recipient_user_id")
        if recipient:
            rows = rows.filter(recipient_user_id=recipient)
        return self.respond(request, rows, ("recipient_user_id", recipient) if recipient else None)


class PlatformDeliveryStatsView(PatientsAPIView):
    permission_classes = [IsPlatformAdmin]

    @extend_schema(
        tags=TAGS,
        parameters=[OpenApiParameter("since", str)],
        responses={200: s.DeliveryStatsSerializer},
    )
    def get(self, request: Request) -> Response:
        from medilink.patients.models import PatientLink

        since = _since(request, timezone.now() - dt.timedelta(hours=24))
        attempts = DeliveryAttempt.objects.filter(queued_at__gte=since)
        by: dict[str, Counter[str]] = {}
        for channel, status_, count in attempts.values_list("channel", "status").annotate(
            n=Count("id")
        ):
            by.setdefault(channel, Counter())[status_] += count
        reasons = (
            attempts.exclude(failure_reason__isnull=True)
            .values("failure_reason")
            .annotate(count=Count("id"))
            .order_by("-count")
        )
        patient_accounts = User.objects.filter(
            is_active=True,
            pk__in=PatientLink.objects.active().filter(relationship="self").values("account_id"),
        ).count()
        with_push = (
            PushSubscription.objects.filter(revoked_at__isnull=True)
            .values("user_id")
            .distinct()
            .count()
        )
        return Response(
            {
                "since": since,
                "by_channel": [
                    {
                        "channel": channel,
                        "sent": c["sent"] + c["delivered"] + c["read"],
                        "failed": c["failed"],
                        "skipped": c["skipped"],
                        "held": c["held"],
                        "cancelled": c["cancelled"],
                    }
                    for channel, c in sorted(by.items())
                ],
                "failure_reasons": [
                    {"reason": r["failure_reason"], "count": r["count"]} for r in reasons
                ],
                "push_opt_in": {
                    "patient_accounts": patient_accounts,
                    "with_active_subscription": with_push,
                },
            }
        )


# ---------------------------------------------------------------------------------------------
# Templates (platform)
# ---------------------------------------------------------------------------------------------


class TemplatesView(PatientsAPIView):
    permission_classes = [IsPlatformAdmin]

    @extend_schema(
        tags=TAGS,
        parameters=[OpenApiParameter(p, str) for p in ("code", "channel", "language", "is_active")],
        responses={200: s.NotificationTemplateSerializer(many=True)},
    )
    def get(self, request: Request) -> Response:
        rows = Template.objects.select_related("created_by").order_by(
            "code", "channel", "language", "variant", "-template_version"
        )
        for param in ("code", "channel", "language"):
            value = request.query_params.get(param)
            if value:
                rows = rows.filter(**{param: value})
        is_active = request.query_params.get("is_active", "true")
        if is_active in ("true", "false"):
            rows = rows.filter(is_active=is_active == "true")
        paginator = DefaultPagination()
        page: list[Any] = paginator.paginate_queryset(rows, request, view=self) or []
        return paginator.get_paginated_response(
            s.NotificationTemplateSerializer(page, many=True).data
        )


class TemplateDetailView(PatientsAPIView):
    permission_classes = [IsPlatformAdmin]

    @extend_schema(
        tags=TAGS, responses={200: s.NotificationTemplateSerializer, 404: err("Not found")}
    )
    def get(self, request: Request, template_id: Any) -> Response:
        row = Template.objects.select_related("created_by").filter(pk=template_id).first()
        if row is None:
            raise exceptions.NotFound()
        return Response(s.NotificationTemplateSerializer(row).data)


def _family(row: Template) -> Any:
    return Template.objects.filter(
        code=row.code, channel=row.channel, language=row.language, variant=row.variant
    )


class TemplateReviseView(PatientsAPIView):
    permission_classes = [IsPlatformAdmin]

    @extend_schema(
        tags=TAGS,
        request=s.TemplateReviseSerializer,
        responses={
            201: s.NotificationTemplateSerializer,
            400: err("Invalid text"),
            409: err("Not the latest version"),
        },
    )
    def post(self, request: Request, template_id: Any) -> Response:
        body = s.TemplateReviseSerializer(data=request.data)
        body.is_valid(raise_exception=True)
        data = body.validated_data
        with transaction.atomic():
            row = Template.objects.filter(pk=template_id).first()
            if row is None:
                raise exceptions.NotFound()
            family = _family(row).select_for_update()
            latest = max(family.values_list("template_version", flat=True))
            if data["based_on_version"] != latest:
                raise Conflict("A newer version exists.")
            try:
                definition = registry.get(row.code)
            except Exception:
                raise exceptions.NotFound() from None
            try:
                used = templates.validate(definition, row.channel, data["subject"], data["body"])
            except templates.TemplateError as exc:
                raise _bad(exc.field, exc.message) from None
            family.filter(is_active=True).update(is_active=False, updated_at=timezone.now())
            new = Template.objects.create(
                code=row.code,
                channel=row.channel,
                language=row.language,
                variant=row.variant,
                template_version=latest + 1,
                subject=data["subject"],
                body=data["body"],
                placeholders=used,
                is_active=True,
                source=TemplateSource.PLATFORM,
                created_by=_user(request),
            )
            record(
                "notifications.template.revised",
                request=request,
                object_type="notifications.template",
                object_id=new.pk,
                metadata={
                    "template_code": new.code,
                    "channel": new.channel,
                    "language": new.language,
                    "template_version": new.template_version,
                },
            )
        return Response(s.NotificationTemplateSerializer(new).data, status=status.HTTP_201_CREATED)


class TemplateActivateView(PatientsAPIView):
    permission_classes = [IsPlatformAdmin]

    @extend_schema(
        tags=TAGS,
        request=None,
        responses={
            200: s.NotificationTemplateSerializer,
            404: err("Not found"),
            409: err("Already active"),
        },
    )
    def post(self, request: Request, template_id: Any) -> Response:
        with transaction.atomic():
            row = Template.objects.select_for_update().filter(pk=template_id).first()
            if row is None:
                raise exceptions.NotFound()
            if row.is_active:
                raise Conflict("This version is already active.")
            _family(row).filter(is_active=True).update(is_active=False, updated_at=timezone.now())
            row.is_active = True
            row.save(update_fields=["is_active", "updated_at"])
            record(
                "notifications.template.activated",
                request=request,
                object_type="notifications.template",
                object_id=row.pk,
                metadata={
                    "template_code": row.code,
                    "channel": row.channel,
                    "language": row.language,
                    "template_version": row.template_version,
                },
            )
        return Response(s.NotificationTemplateSerializer(row).data)
