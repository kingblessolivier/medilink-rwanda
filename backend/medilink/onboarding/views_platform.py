"""Super admin console endpoints (contract §3.5). Every view: PlatformAdmin; step-up where the
contract marks it."""

from __future__ import annotations

from typing import Any

from django.db.models import Q, QuerySet
from django.http import Http404
from drf_spectacular.utils import OpenApiParameter, OpenApiResponse, extend_schema
from rest_framework import exceptions, status
from rest_framework.generics import GenericAPIView
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from medilink.audit.services import record
from medilink.authz.permissions import get_principal
from medilink.authz.platform import PlatformAdmin
from medilink.authz.stepup import RecentAuthRequired
from medilink.core.exceptions import BusinessRuleViolation, CurrentOnConflict, error_response
from medilink.core.idempotency import IDEMPOTENCY, idempotency_key
from medilink.core.pagination import DefaultPagination
from medilink.core.serializers import ErrorSerializer
from medilink.core.throttling import BurstRateThrottle
from medilink.masterdata.serializers import request_language
from medilink.onboarding import serializers as s
from medilink.onboarding import services
from medilink.onboarding.flags import PLATFORM_ONLY
from medilink.onboarding.models import (
    Application,
    ApplicationDocument,
    ApplicationEvent,
    ApplicationStatus,
    EventKind,
    FacilityFeatureFlag,
    FacilityLicence,
    FacilityStatusEvent,
    FeatureFlag,
)
from medilink.onboarding.views_public import add_document
from medilink.tenancy.models import Facility
from medilink.uploads.serializers import DownloadLinkRequestSerializer, DownloadLinkSerializer
from medilink.uploads.services import NotClean, download_link
from medilink.uploads.throttling import UploadRateThrottle

TAG = ["platform"]
STEP_UP = RecentAuthRequired()


def _err(description: str) -> OpenApiResponse:
    return OpenApiResponse(response=ErrorSerializer, description=description)


def _actor(request: Request) -> Any:
    principal = get_principal(request)
    if principal is None or principal.user is None:
        raise exceptions.NotAuthenticated()
    return principal.user


def _application(application_id: Any, lock: bool = False) -> Application:
    qs = Application.objects.select_related("reviewer")
    if lock:
        qs = qs.select_for_update(of=("self",))
    application = qs.filter(pk=application_id).first()
    if application is None:
        raise Http404
    return application


def _platform_data(request: Request, application: Application) -> dict[str, Any]:
    application.refresh_from_db()
    return s.application_data(application, platform=True, language=request_language(request))


class _Platform(CurrentOnConflict, APIView):
    permission_classes = [PlatformAdmin]
    parser_classes = [JSONParser]

    def conflict_current(self, request: Request, *args: Any, **kwargs: Any) -> Any:
        """`error.current` on 409: the view's own resource, else the application or facility the
        action is on."""
        current = super().conflict_current(request, *args, **kwargs)
        if current is not None:
            return current
        if "licence_id" in kwargs:
            licence = FacilityLicence.objects.filter(
                pk=kwargs["licence_id"], facility_id=kwargs["facility_id"]
            ).first()
            return s.licence_data(licence) if licence else None
        if "code" in kwargs and "facility_id" not in kwargs:
            flag = FeatureFlag.objects.filter(code=kwargs["code"]).first()
            return s.flag_data(flag) if flag else None
        if "application_id" in kwargs:
            return _platform_data(request, _application(kwargs["application_id"]))
        if "facility_id" in kwargs and "code" not in kwargs:
            return s.facility_data(_facility(kwargs["facility_id"]))
        return None


class _StepUp(_Platform):
    permission_classes = [PlatformAdmin, STEP_UP]


# ---- overview and applications ------------------------------------------------------------------


class OverviewView(_Platform):
    @extend_schema(
        tags=TAG, operation_id="platform_overview", responses={200: s.OverviewSerializer}
    )
    def get(self, request: Request) -> Response:
        return Response(s.overview_data())


class ApplicationsView(GenericAPIView):
    permission_classes = [PlatformAdmin]
    parser_classes = [JSONParser]
    pagination_class = DefaultPagination

    def get_queryset(self) -> QuerySet[Application]:
        params = self.request.query_params
        qs = Application.objects.select_related("reviewer")
        statuses = params.getlist("status")
        if statuses:
            qs = qs.filter(status__in=statuses)
        else:
            qs = qs.exclude(status=ApplicationStatus.DRAFT)  # drafts only when asked for
        if params.get("district"):
            qs = qs.filter(district_code=params["district"])
        if params.get("facility_type"):
            qs = qs.filter(facility_type=params["facility_type"])
        if params.get("created_by_platform") in ("true", "false"):
            qs = qs.filter(
                created_by_platform_admin__isnull=params["created_by_platform"] == "false"
            )
        q = params.get("q", "").strip()[:100]
        if q:
            qs = qs.filter(Q(facility_name__icontains=q) | Q(applicant_name__icontains=q))
        ordering = params.get("ordering", "submitted_at")
        allowed = {"submitted_at", "-submitted_at", "last_activity_at", "-last_activity_at"}
        return qs.order_by(ordering if ordering in allowed else "submitted_at", "created_at")

    @extend_schema(
        tags=TAG,
        operation_id="platform_facility_applications_list",
        parameters=[
            OpenApiParameter("status", str, many=True, enum=ApplicationStatus.values),
            OpenApiParameter("district", str),
            OpenApiParameter("facility_type", str),
            OpenApiParameter("created_by_platform", bool),
            OpenApiParameter("q", str),
            OpenApiParameter(
                "ordering",
                str,
                enum=["submitted_at", "-submitted_at", "last_activity_at", "-last_activity_at"],
            ),
        ],
        responses={200: s.ApplicationSummarySerializer(many=True)},
    )
    def get(self, request: Request) -> Response:
        page = self.paginate_queryset(self.get_queryset()) or []
        return self.get_paginated_response([s.summary_data(a) for a in page])

    @extend_schema(
        tags=TAG,
        operation_id="platform_facility_applications_create",
        request=s.PlatformCreateInput,
        responses={201: s.PlatformApplicationSerializer, 400: _err("Validation error")},
        summary="Create an application on the facility's behalf",
    )
    def post(self, request: Request) -> Response:
        body = s.PlatformCreateInput(data=request.data)
        body.is_valid(raise_exception=True)
        data = dict(body.validated_data)
        send_link = data.pop("send_link")
        application = services.create_by_platform(
            data=data, actor=_actor(request), send_link=send_link, request=request
        )
        return Response(_platform_data(request, application), status=status.HTTP_201_CREATED)


class ApplicationView(_Platform):
    @extend_schema(
        tags=TAG,
        operation_id="platform_facility_application_retrieve",
        responses={200: s.PlatformApplicationSerializer, 404: _err("Not found")},
    )
    def get(self, request: Request, application_id: Any) -> Response:
        return Response(_platform_data(request, _application(application_id)))

    @extend_schema(
        tags=TAG,
        operation_id="platform_facility_application_update",
        request=s.ApplicationPatchInput,
        responses={
            200: s.PlatformApplicationSerializer,
            400: _err("Validation error"),
            409: _err("Version conflict"),
            422: _err("Not editable"),
        },
    )
    def patch(self, request: Request, application_id: Any) -> Response:
        body = s.ApplicationPatchInput(data=request.data)
        body.is_valid(raise_exception=True)
        application = _application(application_id, lock=True)
        data = dict(body.validated_data)
        version = data.pop("version")
        services.update_application(
            application, data, version=version, actor=_actor(request), request=request
        )
        return Response(_platform_data(request, application))


class DocumentsView(_Platform):
    parser_classes = [MultiPartParser, FormParser]
    throttle_classes = [BurstRateThrottle, UploadRateThrottle]

    @extend_schema(
        tags=TAG,
        operation_id="platform_facility_application_document_create",
        request={"multipart/form-data": s.DocumentInput},
        parameters=[IDEMPOTENCY],
        responses={201: s.ApplicationDocumentSerializer, 400: _err("Type, size or kind")},
    )
    def post(self, request: Request, application_id: Any) -> Response:
        application = _application(application_id, lock=True)
        return Response(
            add_document(request, application, actor=_actor(request)),
            status=status.HTTP_201_CREATED,
        )


class SendResumeLinkView(_Platform):
    @extend_schema(
        tags=TAG,
        operation_id="platform_facility_application_send_resume_link",
        request=None,
        responses={
            202: OpenApiResponse(description="Sent"),
            422: _err("Not draft or changes requested"),
        },
    )
    def post(self, request: Request, application_id: Any) -> Response:
        services.send_resume_link(
            _application(application_id), actor=_actor(request), request=request
        )
        return Response(status=status.HTTP_202_ACCEPTED)


class StartReviewView(_Platform):
    @extend_schema(
        tags=TAG,
        operation_id="platform_facility_application_start_review",
        request=s.VersionInput,
        responses={
            200: s.PlatformApplicationSerializer,
            409: _err("Conflict"),
            422: _err("Status"),
        },
    )
    def post(self, request: Request, application_id: Any) -> Response:
        body = s.VersionInput(data=request.data)
        body.is_valid(raise_exception=True)
        application = _application(application_id, lock=True)
        services.start_review(
            application,
            version=body.validated_data["version"],
            actor=_actor(request),
            request=request,
        )
        return Response(_platform_data(request, application))


def _app_document(application_id: Any, document_id: Any) -> ApplicationDocument:
    document = (
        ApplicationDocument.objects.current()
        .select_related("file", "application")
        .filter(application_id=application_id, pk=document_id)
        .first()
    )
    if document is None:
        raise Http404
    return document


class DocumentReviewView(_Platform):
    @extend_schema(
        tags=TAG,
        operation_id="platform_facility_application_document_review",
        request=s.DocumentReviewInput,
        responses={200: s.ApplicationDocumentSerializer, 422: _err("Not under review")},
    )
    def post(self, request: Request, application_id: Any, document_id: Any) -> Response:
        body = s.DocumentReviewInput(data=request.data)
        body.is_valid(raise_exception=True)
        document = services.review_document(
            _app_document(application_id, document_id),
            review_status=body.validated_data["review_status"],
            comment=body.validated_data.get("comment", ""),
            actor=_actor(request),
            request=request,
        )
        return Response(s.document_data(document))


class DocumentLinkView(_Platform):
    @extend_schema(
        tags=TAG,
        operation_id="platform_facility_application_document_download_link",
        request=DownloadLinkRequestSerializer,
        responses={200: DownloadLinkSerializer, 404: _err("Not found"), 422: _err("Not clean")},
    )
    def post(self, request: Request, application_id: Any, document_id: Any) -> Response:
        body = DownloadLinkRequestSerializer(data=request.data)
        body.is_valid(raise_exception=True)
        document = _app_document(application_id, document_id)
        actor = _actor(request)
        try:
            link = download_link(
                document.file,
                disposition=body.validated_data["disposition"],
                request=request,
                actor=actor,
            )
        except NotClean:
            raise BusinessRuleViolation() from None
        record(
            "facility_application.document_viewed",
            request=request,
            actor=actor,
            object_type="facility_application",
            object_id=document.application_id,
            metadata={"document_id": document.pk},
        )
        return Response(DownloadLinkSerializer(link).data)


class RequestChangesView(_Platform):
    @extend_schema(
        tags=TAG,
        operation_id="platform_facility_application_request_changes",
        request=s.RequestChangesInput,
        parameters=[IDEMPOTENCY],
        responses={
            200: s.PlatformApplicationSerializer,
            409: _err("Conflict"),
            422: _err("Status"),
        },
    )
    def post(self, request: Request, application_id: Any) -> Response:
        body = s.RequestChangesInput(data=request.data)
        body.is_valid(raise_exception=True)
        application = _application(application_id, lock=True)
        services.request_changes(
            application,
            version=body.validated_data["version"],
            general_comment=body.validated_data.get("general_comment", ""),
            items=[dict(item) for item in body.validated_data["items"]],
            actor=_actor(request),
            idempotency_key=idempotency_key(request),
            request=request,
        )
        return Response(_platform_data(request, application))


class ApproveView(_StepUp):
    @extend_schema(
        tags=TAG,
        operation_id="platform_facility_application_approve",
        request=s.ApproveInput,
        parameters=[IDEMPOTENCY],
        responses={
            200: s.ApproveResultSerializer,
            400: _err("fields.slug taken"),
            403: _err("step_up_required"),
            409: _err("Conflict"),
            422: _err("Approval gate"),
        },
    )
    def post(self, request: Request, application_id: Any) -> Response:
        body = s.ApproveInput(data=request.data)
        body.is_valid(raise_exception=True)
        data = body.validated_data
        application = _application(application_id, lock=True)
        application, facility = services.approve(
            application,
            version=data["version"],
            slug=data["slug"],
            organization_name=data["organization_name"],
            facility_type=data["facility_type"],
            ownership=data["ownership"],
            licences=[dict(lic) for lic in data["licences"]],
            actor=_actor(request),
            idempotency_key=idempotency_key(request),
            request=request,
        )
        return Response(
            {
                "application": _platform_data(request, application),
                "facility": s.facility_data(facility),
            }
        )


class RejectView(_StepUp):
    @extend_schema(
        tags=TAG,
        operation_id="platform_facility_application_reject",
        request=s.ReasonInput,
        parameters=[IDEMPOTENCY],
        responses={
            200: s.PlatformApplicationSerializer,
            400: _err("Reason"),
            403: _err("step_up_required"),
            409: _err("Conflict"),
            422: _err("Status"),
        },
    )
    def post(self, request: Request, application_id: Any) -> Response:
        body = s.ReasonInput(data=request.data)
        body.is_valid(raise_exception=True)
        application = _application(application_id, lock=True)
        services.reject(
            application,
            version=body.validated_data["version"],
            reason_code=body.validated_data["reason_code"],
            reason_text=body.validated_data.get("reason_text", ""),
            actor=_actor(request),
            idempotency_key=idempotency_key(request),
            request=request,
        )
        return Response(_platform_data(request, application))


class NotesView(_Platform):
    @extend_schema(
        tags=TAG,
        operation_id="platform_facility_application_notes_list",
        responses={200: s.ApplicationEventSerializer(many=True)},
    )
    def get(self, request: Request, application_id: Any) -> Response:
        application = _application(application_id)
        notes = ApplicationEvent.objects.filter(application=application, kind=EventKind.NOTE)
        return Response(
            [s.event_data(e) for e in notes.select_related("actor").order_by("occurred_at")]
        )

    @extend_schema(
        tags=TAG,
        operation_id="platform_facility_application_notes_create",
        request=s.NoteInput,
        responses={201: s.ApplicationEventSerializer, 400: _err("Validation error")},
    )
    def post(self, request: Request, application_id: Any) -> Response:
        body = s.NoteInput(data=request.data)
        body.is_valid(raise_exception=True)
        event = services.add_note(
            _application(application_id),
            note_kind=body.validated_data["note_kind"],
            text=body.validated_data["text"],
            occurred_on=body.validated_data.get("occurred_on"),
            actor=_actor(request),
            request=request,
        )
        return Response(s.event_data(event), status=status.HTTP_201_CREATED)


class EventsView(_Platform):
    @extend_schema(
        tags=TAG,
        operation_id="platform_facility_application_events",
        responses={200: s.ApplicationEventSerializer(many=True)},
    )
    def get(self, request: Request, application_id: Any) -> Response:
        application = _application(application_id)
        events = ApplicationEvent.objects.filter(application=application).select_related("actor")
        return Response([s.event_data(e) for e in events.order_by("occurred_at")])


# ---- facilities ----------------------------------------------------------------------------------


def _facility(facility_id: Any) -> Facility:
    facility = Facility.objects.filter(pk=facility_id).first()
    if facility is None:
        raise Http404
    return facility


class FacilitiesView(GenericAPIView):
    permission_classes = [PlatformAdmin]
    pagination_class = DefaultPagination

    def get_queryset(self) -> QuerySet[Facility]:
        params = self.request.query_params
        # Reviewed: the platform admin list covers every facility by design.
        qs = Facility.objects.all()  # nosemgrep: medilink-objects-all-in-view
        if params.get("status"):
            qs = qs.filter(status=params["status"])
        if params.get("facility_type"):
            qs = qs.filter(facility_type=params["facility_type"])
        if params.get("ownership"):
            qs = qs.filter(ownership=params["ownership"])
        if params.get("missing_code") == "true":  # no MoH facility code yet
            qs = qs.filter(moh_facility_code="")
        if params.get("district"):
            ids = Application.objects.filter(district_code=params["district"]).values("facility_id")
            qs = qs.filter(pk__in=ids)
        q = params.get("q", "").strip()[:100]
        if q:
            qs = qs.filter(Q(name__icontains=q) | Q(slug__icontains=q))
        ordering = params.get("ordering", "name")
        return qs.order_by(
            ordering if ordering in {"name", "-name", "created_at", "-created_at"} else "name"
        )

    def rows(self, request: Request) -> list[dict[str, Any]]:
        rows = [s.facility_data(f) for f in self.get_queryset()]
        state = request.query_params.get("licence_state")
        if state:
            rows = [r for r in rows if r["licence_state"] == state]
        if request.query_params.get("no_admin") == "true":  # nobody to run the facility
            rows = [r for r in rows if not r["admins"]]
        if request.query_params.get("ordering") == "next_licence_expiry":
            rows.sort(
                key=lambda r: (r["next_licence_expiry"] is None, r["next_licence_expiry"] or "")
            )
        return rows

    @extend_schema(
        tags=TAG,
        operation_id="platform_facilities_list",
        parameters=[
            OpenApiParameter("status", str),
            OpenApiParameter("facility_type", str),
            OpenApiParameter("ownership", str),
            OpenApiParameter("missing_code", bool, description="Only facilities without a FOSA ID"),
            OpenApiParameter("no_admin", bool, description="Only facilities without an admin"),
            OpenApiParameter("district", str),
            OpenApiParameter(
                "licence_state", str, enum=["valid", "expiring", "expired", "missing"]
            ),
            OpenApiParameter("q", str),
            OpenApiParameter(
                "ordering",
                str,
                enum=["name", "-name", "created_at", "-created_at", "next_licence_expiry"],
            ),
        ],
        responses={200: s.PlatformFacilitySerializer(many=True)},
    )
    def get(self, request: Request) -> Response:
        page = self.paginate_queryset(self.rows(request))
        return self.get_paginated_response(page)


class FacilitiesExportView(FacilitiesView):
    """The facility list for the Ministry of Health, as CSV, with the list's filters."""

    pagination_class = None  # type: ignore[assignment]

    @extend_schema(
        tags=TAG,
        operation_id="platform_facilities_export",
        parameters=[
            OpenApiParameter("status", str),
            OpenApiParameter("facility_type", str),
            OpenApiParameter("ownership", str),
            OpenApiParameter("district", str),
            OpenApiParameter(
                "licence_state", str, enum=["valid", "expiring", "expired", "missing"]
            ),
            OpenApiParameter("q", str),
        ],
        responses={(200, "text/csv"): OpenApiResponse(description="One row per facility")},
        summary="Export the facility list (CSV, UTF-8); audit-logged",
    )
    def get(self, request: Request) -> Response:
        from django.http import HttpResponse
        from django.utils import timezone

        from medilink.onboarding.facility_report import export_csv

        rows = self.rows(request)
        record(
            "facility.list_exported",
            request=request,
            object_type="facility",
            metadata={"rows": len(rows)},
        )
        response = HttpResponse(export_csv(rows), content_type="text/csv; charset=utf-8")
        name = f"medilink-facilities-{timezone.localdate().isoformat()}.csv"
        response["Content-Disposition"] = f'attachment; filename="{name}"'
        response["Cache-Control"] = "no-store"
        return response  # type: ignore[return-value]


class FacilityView(_Platform):
    permission_classes = [PlatformAdmin, RecentAuthRequired(methods=("PATCH",))]

    @extend_schema(
        tags=TAG,
        operation_id="platform_facility_retrieve",
        responses={200: s.PlatformFacilityDetailSerializer, 404: _err("Not found")},
    )
    def get(self, request: Request, facility_id: Any) -> Response:
        return Response(s.facility_data(_facility(facility_id), detail=True))

    @extend_schema(
        tags=TAG,
        operation_id="platform_facility_identifiers_update",
        request=s.FacilityIdentifiersInput,
        responses={
            200: s.PlatformFacilityDetailSerializer,
            400: _err("Invalid input"),
            403: _err("step_up_required"),
            404: _err("Not found"),
        },
        summary="Set the facility's MoH facility code (FOSA ID) and TIN; audit-logged",
    )
    def patch(self, request: Request, facility_id: Any) -> Response:
        body = s.FacilityIdentifiersInput(data=request.data)
        body.is_valid(raise_exception=True)
        facility = _facility(facility_id)
        changed = [k for k, v in body.validated_data.items() if getattr(facility, k) != v]
        if changed:
            for name in changed:
                setattr(facility, name, body.validated_data[name])
            facility.save(update_fields=[*changed, "updated_at"])
            record(
                "facility.identifiers_updated",
                request=request,
                facility_id=facility.pk,
                object_type="facility",
                object_id=facility.pk,
                metadata={"fields": changed},
            )
        return Response(s.facility_data(facility, detail=True))


class FacilitiesSummaryView(_Platform):
    """Counts for the "needs attention" strip above the facility list."""

    @extend_schema(
        tags=TAG,
        operation_id="platform_facilities_summary",
        responses={200: s.FacilityAttentionSerializer},
    )
    def get(self, request: Request) -> Response:
        # Reviewed: the platform admin summary covers every facility by design.
        facilities = Facility.objects.all()  # nosemgrep: medilink-objects-all-in-view
        rows = [s.facility_data(f) for f in facilities]
        by_status: dict[str, int] = {}
        for r in rows:
            by_status[r["status"]] = by_status.get(r["status"], 0) + 1
        open_rows = [r for r in rows if r["status"] != "deactivated"]
        return Response(
            {
                "total": len(rows),
                "by_status": by_status,
                "no_admin": sum(1 for r in open_rows if not r["admins"]),
                "licence_expiring": sum(1 for r in open_rows if r["licence_state"] == "expiring"),
                "licence_expired": sum(1 for r in open_rows if r["licence_state"] == "expired"),
                "licence_missing": sum(1 for r in open_rows if r["licence_state"] == "missing"),
                "missing_code": sum(1 for r in open_rows if not r["moh_facility_code"]),
            }
        )


def _staff_data(facility: Facility) -> dict[str, Any]:
    from django.utils import timezone

    from medilink.accounts.mfa import has_confirmed_mfa
    from medilink.tenancy.context import rls_context
    from medilink.tenancy.models import FacilityMembership, Invitation

    with rls_context(facility_id=facility.pk):
        memberships = list(
            FacilityMembership.objects.filter(facility=facility)
            .select_related("user")
            .prefetch_related("roles")
            .order_by("-is_active", "user__full_name")
        )
        invitations = list(
            Invitation.objects.filter(
                facility=facility,
                accepted_at__isnull=True,
                revoked_at__isnull=True,
                expired_at__isnull=True,
                expires_at__gt=timezone.now(),
            )
            .select_related("invited_by")
            .order_by("-created_at")
        )
    return {
        "members": [
            {
                "membership_id": m.pk,
                "user_id": m.user_id,
                "name": m.user.full_name,
                "email": m.user.email,
                "roles": sorted(r.code for r in m.roles.all()),
                "is_active": m.is_active,
                "mfa_enabled": has_confirmed_mfa(m.user),
                "last_login": m.user.last_login,
                "joined_at": m.created_at,
            }
            for m in memberships
        ],
        "invitations": [
            {
                "id": i.pk,
                "email": i.email,
                "full_name": i.full_name,
                "role_codes": list(i.role_codes or []),
                "status": "pending",
                "invited_by": i.invited_by.full_name if i.invited_by else "",
                "created_at": i.created_at,
                "expires_at": i.expires_at,
            }
            for i in invitations
        ],
    }


class FacilityStaffView(_Platform):
    """Everyone with access to the facility (active and removed) and pending invitations."""

    @extend_schema(
        tags=TAG,
        operation_id="platform_facility_staff",
        responses={200: s.FacilityStaffSerializer, 404: _err("Not found")},
    )
    def get(self, request: Request, facility_id: Any) -> Response:
        return Response(s.FacilityStaffSerializer(_staff_data(_facility(facility_id))).data)


class FacilityInvitationsView(_Platform):
    """Invite someone to the facility, typically a new facility admin when the last one left."""

    permission_classes = [PlatformAdmin, RecentAuthRequired()]

    @extend_schema(
        tags=TAG,
        operation_id="platform_facility_invite",
        request=s.FacilityInviteInput,
        responses={
            201: s.FacilityStaffSerializer,
            400: _err("Invalid input"),
            403: _err("step_up_required"),
            409: _err("Already a member or invited"),
            422: _err("Deactivated facility"),
        },
        summary="Invite a person to the facility (email link); step-up, reason, audit-logged",
    )
    def post(self, request: Request, facility_id: Any) -> Response:
        from medilink.facilities import staff
        from medilink.tenancy.context import rls_context

        body = s.FacilityInviteInput(data=request.data)
        body.is_valid(raise_exception=True)
        data = body.validated_data
        facility = _facility(facility_id)
        with rls_context(facility_id=facility.pk):
            invitation = staff.invite(
                facility,
                email=data["email"],
                full_name=data.get("full_name", ""),
                role_codes=sorted(set(data["role_codes"])),
                service_point_ids=[],
                actor=request.user,
                request=request,
                source_ref="platform",
            )
        record(
            "facility.staff_invited",
            request=request,
            facility_id=facility.pk,
            object_type="invitation",
            object_id=invitation.pk,
            reason=data["reason"],
            metadata={"role_codes": sorted(set(data["role_codes"]))},
        )
        return Response(
            s.FacilityStaffSerializer(_staff_data(facility)).data, status=status.HTTP_201_CREATED
        )


class FacilityInvitationView(_Platform):
    permission_classes = [PlatformAdmin, RecentAuthRequired()]

    @extend_schema(
        tags=TAG,
        operation_id="platform_facility_invitation_revoke",
        request=None,
        responses={200: s.FacilityStaffSerializer, 404: _err("Not found")},
        summary="Cancel a pending invitation; audit-logged",
    )
    def delete(self, request: Request, facility_id: Any, invitation_id: Any) -> Response:
        from medilink.facilities import staff
        from medilink.tenancy.context import rls_context
        from medilink.tenancy.models import Invitation

        facility = _facility(facility_id)
        with rls_context(facility_id=facility.pk):
            invitation = Invitation.objects.filter(
                pk=invitation_id,
                facility=facility,
                accepted_at__isnull=True,
                revoked_at__isnull=True,
                expired_at__isnull=True,
            ).first()
            if invitation is None:
                raise Http404
            staff.revoke(invitation, actor=request.user, request=request)
        return Response(s.FacilityStaffSerializer(_staff_data(facility)).data)


class FacilityDetailsView(_Platform):
    """Correct the platform-managed facts (name, type, ownership, level of care)."""

    permission_classes = [PlatformAdmin, RecentAuthRequired()]

    @extend_schema(
        tags=TAG,
        operation_id="platform_facility_details_update",
        request=s.FacilityDetailsInput,
        responses={
            200: s.PlatformFacilityDetailSerializer,
            400: _err("Invalid input"),
            403: _err("step_up_required"),
            404: _err("Not found"),
        },
        summary="Correct name, type, ownership or level of care; step-up, reason, audit-logged",
    )
    def patch(self, request: Request, facility_id: Any) -> Response:
        from django.db import transaction

        from medilink.facilities.models import Profile
        from medilink.tenancy.context import rls_context

        body = s.FacilityDetailsInput(data=request.data)
        body.is_valid(raise_exception=True)
        data = dict(body.validated_data)
        reason = data.pop("reason")
        facility = _facility(facility_id)
        before: dict[str, Any] = {}
        after: dict[str, Any] = {}
        for name in ("name", "facility_type", "ownership"):
            if name in data and getattr(facility, name) != data[name]:
                before[name], after[name] = getattr(facility, name), data[name]
                setattr(facility, name, data[name])
        if after:
            facility.save(update_fields=[*after, "updated_at"])
        if "level_of_care" in data:
            with rls_context(facility_id=facility.pk):
                profile, _ = Profile.objects.get_or_create(facility=facility)
                if profile.level_of_care != data["level_of_care"]:
                    before["level_of_care"] = profile.level_of_care
                    after["level_of_care"] = data["level_of_care"]
                    profile.level_of_care = data["level_of_care"]
                    profile.save(update_fields=["level_of_care", "updated_at"])
        if after:
            record(
                "facility.details_updated",
                request=request,
                facility_id=facility.pk,
                object_type="facility",
                object_id=facility.pk,
                reason=reason,
                metadata={"fields": sorted(after)},
            )
            from medilink.scheduling.tasks import refresh_facility

            # the public listing shows the name and type: rebuild it
            fid = str(facility.pk)
            transaction.on_commit(lambda: refresh_facility.delay(fid))
        return Response(s.facility_data(facility, detail=True))


class StatusEventsView(_Platform):
    @extend_schema(
        tags=TAG,
        operation_id="platform_facility_status_events",
        responses={200: s.StatusEventSerializer(many=True)},
    )
    def get(self, request: Request, facility_id: Any) -> Response:
        facility = _facility(facility_id)
        events = FacilityStatusEvent.objects.filter(facility=facility).select_related("actor")
        language = request_language(request)
        return Response([s.status_event_data(e, language) for e in events.order_by("occurred_at")])


def _status_view(action: str, needs_step_up: bool, body_class: type) -> type[APIView]:
    def post(self: Any, request: Request, facility_id: Any) -> Response:
        body = body_class(data=request.data)
        body.is_valid(raise_exception=True)
        data = body.validated_data
        try:
            facility = services.change_facility_status(
                _facility(facility_id),
                action,
                version=data["version"],
                actor=_actor(request),
                reason_code=data.get("reason_code", ""),
                reason_text=data.get("reason_text", ""),
                confirm_slug=data.get("confirm_slug"),
                idempotency_key=idempotency_key(request),
                request=request,
            )
        except services.GoLiveFailed as exc:
            fields = {
                f"checks.{code}": [p["message"] for p in problems]
                for code, problems in exc.failing.items()
            }
            return error_response(422, "business_rule_violation", exc.detail, fields)
        return Response(s.facility_data(facility))

    name = "".join(part.title() for part in action.split("_")) + "View"
    view = type(
        name,
        (_StepUp if needs_step_up else _Platform,),
        {
            "post": extend_schema(
                tags=TAG,
                operation_id=f"platform_facility_{action}",
                request=body_class,
                parameters=[IDEMPOTENCY],
                responses={
                    200: s.PlatformFacilitySerializer,
                    400: _err("Reason or confirmation"),
                    403: _err("step_up_required"),
                    409: _err("Conflict"),
                    422: _err("Status or failing go-live checks"),
                },
            )(post)
        },
    )
    return view


StartSetupView = _status_view("start_setup", False, s.VersionInput)
GoLiveView = _status_view("go_live", True, s.VersionInput)
SuspendView = _status_view("suspend", True, s.ReasonInput)
ReactivateView = _status_view("reactivate", True, s.ReasonInput)
DeactivateView = _status_view("deactivate", True, s.DeactivateInput)


class LicencesView(_Platform):
    permission_classes = [PlatformAdmin, RecentAuthRequired(methods=("POST",))]

    @extend_schema(
        tags=TAG,
        operation_id="platform_facility_licences_list",
        responses={200: s.LicenceSerializer(many=True)},
    )
    def get(self, request: Request, facility_id: Any) -> Response:
        facility = _facility(facility_id)
        licences = FacilityLicence.objects.filter(facility=facility).select_related("verified_by")
        return Response([s.licence_data(lic) for lic in licences.order_by("-created_at")])

    @extend_schema(
        tags=TAG,
        operation_id="platform_facility_licences_create",
        request=s.NewLicenceInput,
        responses={
            201: s.LicenceSerializer,
            400: _err("Validation error"),
            403: _err("step_up_required"),
            422: _err("Renewing a superseded licence"),
        },
    )
    def post(self, request: Request, facility_id: Any) -> Response:
        body = s.NewLicenceInput(data=request.data)
        body.is_valid(raise_exception=True)
        licence = services.add_licence(
            _facility(facility_id), data=body.validated_data, actor=_actor(request), request=request
        )
        return Response(s.licence_data(licence), status=status.HTTP_201_CREATED)


class LicenceView(_StepUp):
    @extend_schema(
        tags=TAG,
        operation_id="platform_facility_licence_update",
        request=s.LicencePatchInput,
        responses={200: s.LicenceSerializer, 409: _err("Conflict"), 422: _err("Superseded")},
        summary="Correct a licence (a renewal is a new licence)",
    )
    def patch(self, request: Request, facility_id: Any, licence_id: Any) -> Response:
        body = s.LicencePatchInput(data=request.data)
        body.is_valid(raise_exception=True)
        licence = FacilityLicence.objects.filter(pk=licence_id, facility_id=facility_id).first()
        if licence is None:
            raise Http404
        data = dict(body.validated_data)
        version = data.pop("version")
        licence = services.correct_licence(
            licence, data=data, version=version, actor=_actor(request), request=request
        )
        return Response(s.licence_data(licence))


def _flag(code: str) -> FeatureFlag:
    """A flag a facility may override (platform-wide flags such as staff two-step have none)."""
    flag = (
        FeatureFlag.objects.filter(code=code, is_active=True)
        .exclude(code__in=PLATFORM_ONLY)
        .first()
    )
    if flag is None:
        raise Http404
    return flag


class FacilityFlagsView(_Platform):
    @extend_schema(
        tags=TAG,
        operation_id="platform_facility_feature_flags",
        responses={200: s.FacilityFeatureFlagSerializer(many=True)},
    )
    def get(self, request: Request, facility_id: Any) -> Response:
        facility = _facility(facility_id)
        overrides = {
            o.flag_id: o
            for o in FacilityFeatureFlag.objects.filter(facility=facility).select_related("set_by")
        }
        flags = (
            FeatureFlag.objects.filter(is_active=True)
            .exclude(code__in=PLATFORM_ONLY)
            .order_by("code")
        )
        return Response([s.facility_flag_data(f, overrides.get(f.pk)) for f in flags])


class FacilityFlagView(_StepUp):
    @extend_schema(
        tags=TAG,
        operation_id="platform_facility_feature_flag_set",
        request=s.FacilityFlagInput,
        responses={200: s.FacilityFeatureFlagSerializer, 404: _err("Unknown flag")},
    )
    def put(self, request: Request, facility_id: Any, code: str) -> Response:
        body = s.FacilityFlagInput(data=request.data)
        body.is_valid(raise_exception=True)
        flag = _flag(code)
        override = services.set_facility_flag(
            _facility(facility_id),
            flag,
            is_enabled=body.validated_data["is_enabled"],
            note=body.validated_data.get("note", ""),
            actor=_actor(request),
            request=request,
        )
        return Response(s.facility_flag_data(flag, override))

    @extend_schema(
        tags=TAG,
        operation_id="platform_facility_feature_flag_clear",
        responses={
            204: OpenApiResponse(description="Back to the default"),
            404: _err("Unknown flag"),
        },
    )
    def delete(self, request: Request, facility_id: Any, code: str) -> Response:
        services.clear_facility_flag(
            _facility(facility_id), _flag(code), actor=_actor(request), request=request
        )
        return Response(status=status.HTTP_204_NO_CONTENT)


class FlagsView(_Platform):
    @extend_schema(
        tags=TAG,
        operation_id="platform_feature_flags_list",
        responses={200: s.FeatureFlagSerializer(many=True)},
    )
    def get(self, request: Request) -> Response:
        return Response([s.flag_data(f) for f in FeatureFlag.objects.order_by("code")])


class FlagView(_Platform):
    permission_classes = [PlatformAdmin, RecentAuthRequired(methods=("PATCH",))]

    @extend_schema(
        tags=TAG,
        operation_id="platform_feature_flag_update",
        request=s.FlagPatchInput,
        responses={200: s.FeatureFlagSerializer, 404: _err("Unknown flag"), 409: _err("Conflict")},
    )
    def patch(self, request: Request, code: str) -> Response:
        body = s.FlagPatchInput(data=request.data)
        body.is_valid(raise_exception=True)
        flag = FeatureFlag.objects.filter(code=code).first()
        if flag is None:
            raise Http404
        data = dict(body.validated_data)
        version = data.pop("version")
        flag = services.update_flag(
            flag, data=data, version=version, actor=_actor(request), request=request
        )
        return Response(s.flag_data(flag))
