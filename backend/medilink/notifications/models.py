"""Notification engine tables (contract sprint-09 §2.1, database design §5.12).

Notifications, attempts, preferences, push subscriptions and known devices are user-owned and
platform-wide (no facility RLS, §2.3): fan-out and retry jobs work across accounts, so every API
read goes through the scoped querysets below. Announcements have facility RLS plus a policy for
platform rows (migration 0001).
"""

from __future__ import annotations

from typing import Any

from django.conf import settings
from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.db.models import Q

from medilink.core.models import TimeStampedModel


class Audience(models.TextChoices):
    PATIENT = "patient", "Patient"
    STAFF = "staff", "Staff"


class Priority(models.TextChoices):
    CRITICAL = "critical", "Critical"
    IMPORTANT = "important", "Important"
    ROUTINE = "routine", "Routine"


class Variant(models.TextChoices):
    SELF = "self", "Self"
    DEPENDENT = "dependent", "Dependent"


class Channel(models.TextChoices):
    IN_APP = "in_app", "In-app"
    WEB_PUSH = "web_push", "Web push"
    EMAIL = "email", "Email"


class AttemptStatus(models.TextChoices):
    QUEUED = "queued", "Queued"
    HELD = "held", "Held (quiet hours)"
    SKIPPED = "skipped", "Skipped"
    SENT = "sent", "Sent"
    DELIVERED = "delivered", "Delivered"
    READ = "read", "Read"
    FAILED = "failed", "Failed"
    CANCELLED = "cancelled", "Cancelled"


class FailureReason(models.TextChoices):
    PREFERENCE_OFF = "preference_off", "Turned off by the recipient"
    NO_TARGET = "no_target", "No address or subscription"
    NO_TEMPLATE = "no_template", "No template"
    PUSH_GONE = "push_gone", "Push subscription gone"
    PROVIDER_ERROR = "provider_error", "Provider error"
    TIMEOUT = "timeout", "Timeout"
    CONTENT_POLICY = "content_policy", "Blocked by the content policy"
    EXPIRED = "expired", "Expired"
    WITHDRAWN = "withdrawn", "Withdrawn"


class NotificationQuerySet(models.QuerySet["Notification"]):
    def for_inbox(self, user: Any, audience: str, facility_id: Any = None) -> NotificationQuerySet:
        """The recipient's own inbox for the session audience (§2.3)."""
        qs = self.filter(recipient_user=user, audience=audience)
        if audience == Audience.STAFF:
            qs = qs.filter(Q(facility_id__isnull=True) | Q(facility_id=facility_id))
        return qs

    def unread(self) -> NotificationQuerySet:
        return self.filter(read_at__isnull=True)


class Notification(TimeStampedModel):
    recipient_user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="+"
    )
    audience = models.CharField(max_length=8, choices=Audience.choices)
    facility_id = models.UUIDField(null=True, blank=True)
    patient_id = models.UUIDField(null=True, blank=True)
    announcement = models.ForeignKey(
        "notifications.Announcement",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="notifications",
    )
    event_type = models.CharField(max_length=60)
    priority = models.CharField(max_length=10, choices=Priority.choices)
    template_code = models.CharField(max_length=60)
    template_version = models.PositiveIntegerField()
    variant = models.CharField(max_length=10, choices=Variant.choices, default=Variant.SELF)
    language = models.CharField(max_length=2)
    title = models.CharField(max_length=120)
    body = models.CharField(max_length=1000)
    action_path = models.CharField(max_length=200, null=True, blank=True)  # noqa: DJ001
    data = models.JSONField(default=dict)
    # Formatted placeholder values (C0-C2, like title/body), so retries, quiet-hours releases and
    # template revisions render each channel at send time (contract decision S9-D1).
    placeholder_values = models.JSONField(default=dict)
    dedupe_key = models.CharField(max_length=120)
    is_for_today = models.BooleanField(default=False)
    is_withdrawn = models.BooleanField(default=False)
    expires_at = models.DateTimeField(null=True, blank=True)
    fallback_done_at = models.DateTimeField(null=True, blank=True)
    read_at = models.DateTimeField(null=True, blank=True)

    objects = NotificationQuerySet.as_manager()

    class Meta:
        db_table = "notifications_notification"
        constraints = [
            models.UniqueConstraint(
                fields=["recipient_user", "dedupe_key"], name="notifications_dedupe_unique"
            ),
            models.CheckConstraint(
                condition=Q(audience__in=["patient", "staff"]), name="notifications_audience_valid"
            ),
        ]
        indexes = [
            models.Index(
                fields=["recipient_user", "audience", "-created_at"], name="notif_inbox_idx"
            ),
            models.Index(
                fields=["recipient_user", "audience"],
                condition=Q(read_at__isnull=True),
                name="notif_unread_idx",
            ),
            models.Index(fields=["facility_id", "-created_at"], name="notif_facility_idx"),
            models.Index(fields=["patient_id", "-created_at"], name="notif_patient_idx"),
            models.Index(
                fields=["recipient_user", "event_type", "-created_at"], name="notif_rate_idx"
            ),
        ]


class DeliveryAttempt(TimeStampedModel):
    notification = models.ForeignKey(
        Notification, on_delete=models.CASCADE, related_name="attempts"
    )
    channel = models.CharField(max_length=16)
    attempt_no = models.PositiveSmallIntegerField(default=1)
    is_fallback = models.BooleanField(default=False)
    push_subscription = models.ForeignKey(
        "notifications.PushSubscription",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="+",
    )
    status = models.CharField(max_length=10, choices=AttemptStatus.choices)
    scheduled_for = models.DateTimeField()
    queued_at = models.DateTimeField()
    sent_at = models.DateTimeField(null=True, blank=True)
    finished_at = models.DateTimeField(null=True, blank=True)
    provider_message_id = models.CharField(max_length=200, null=True, blank=True)  # noqa: DJ001
    failure_reason = models.CharField(  # noqa: DJ001
        max_length=40, choices=FailureReason.choices, null=True, blank=True
    )

    class Meta:
        db_table = "notifications_delivery_attempt"
        indexes = [
            models.Index(fields=["notification"], name="notif_attempt_notif_idx"),
            models.Index(
                fields=["status", "scheduled_for"],
                condition=Q(status__in=["held", "queued"]),
                name="notif_attempt_due_idx",
            ),
        ]


class Digest(models.TextChoices):
    IMMEDIATE = "immediate", "Immediate"
    DAILY = "daily", "Daily"


class Preference(TimeStampedModel):
    """Saved preferences. Defaults live in code (preferences.py): rows exist only after a change."""

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="+")
    audience = models.CharField(max_length=8, choices=Audience.choices)
    patient_id = models.UUIDField(null=True, blank=True)  # a dependent's row
    channels = models.JSONField(default=dict)
    quiet_hours_start = models.TimeField(null=True, blank=True)
    quiet_hours_end = models.TimeField(null=True, blank=True)
    quiet_hours_enabled = models.BooleanField(default=True)
    receive_alerts = models.BooleanField(default=True)
    reminder_offsets_minutes = ArrayField(models.IntegerField(), null=True, blank=True)
    sound_enabled = models.BooleanField(null=True, blank=True)
    approvals_digest = models.CharField(  # noqa: DJ001
        max_length=10, choices=Digest.choices, null=True, blank=True
    )
    version = models.PositiveIntegerField(default=1)

    class Meta:
        db_table = "notifications_preference"
        constraints = [
            models.UniqueConstraint(
                fields=["user", "audience", "patient_id"],
                name="notifications_preference_unique",
                nulls_distinct=False,
            )
        ]


class RevokedReason(models.TextChoices):
    USER = "user", "Removed by the user"
    LOGOUT = "logout", "Logged out"
    GONE = "gone", "Gone at the push service"
    PASSWORD_RESET = "password_reset", "Password reset"
    REPLACED = "replaced", "Taken over by another account"
    LIMIT = "limit", "Over the limit"


class PushKind(models.TextChoices):
    WEB = "web", "Browser (Web Push)"
    APP = "app", "Phone app (Firebase Cloud Messaging)"


class PushSubscription(TimeStampedModel):
    """A browser (web push endpoint and keys) or the phone app (its FCM registration token in
    `endpoint`, no keys)."""

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="+")
    kind = models.CharField(max_length=3, choices=PushKind.choices, default=PushKind.WEB)
    endpoint = models.TextField(unique=True)
    endpoint_host = models.CharField(max_length=255)
    p256dh = models.CharField(max_length=100, blank=True)
    auth_secret = models.CharField(max_length=40, blank=True)
    label = models.CharField(max_length=60, blank=True)
    session_key_hash = models.BinaryField(null=True, blank=True)
    last_success_at = models.DateTimeField(null=True, blank=True)
    failure_count = models.PositiveSmallIntegerField(default=0)
    revoked_at = models.DateTimeField(null=True, blank=True)
    revoked_reason = models.CharField(  # noqa: DJ001
        max_length=16, choices=RevokedReason.choices, null=True, blank=True
    )

    class Meta:
        db_table = "notifications_push_subscription"
        indexes = [
            models.Index(
                fields=["user"], condition=Q(revoked_at__isnull=True), name="notif_push_active_idx"
            )
        ]


class TemplateSource(models.TextChoices):
    SEED = "seed", "Seed"
    PLATFORM = "platform", "Platform"


class Template(TimeStampedModel):
    code = models.CharField(max_length=60)
    channel = models.CharField(max_length=16)
    language = models.CharField(max_length=2)
    variant = models.CharField(max_length=10, choices=Variant.choices, default=Variant.SELF)
    template_version = models.PositiveIntegerField()
    subject = models.CharField(max_length=120)
    body = models.TextField()
    placeholders = ArrayField(models.CharField(max_length=40), default=list)
    is_active = models.BooleanField(default=True)
    source = models.CharField(max_length=10, choices=TemplateSource.choices)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="+",
    )

    class Meta:
        db_table = "notifications_template"
        constraints = [
            models.UniqueConstraint(
                fields=["code", "channel", "language", "variant", "template_version"],
                name="notifications_template_version_unique",
            ),
            models.UniqueConstraint(
                fields=["code", "channel", "language", "variant"],
                condition=Q(is_active=True),
                name="notifications_template_active_unique",
            ),
        ]


class AnnouncementAudience(models.TextChoices):
    PATIENTS_IN_RANGE = "patients_in_range", "Patients with visits in a date range"
    DISPLAY = "display", "Waiting-room display"
    ALL_FACILITIES = "all_facilities", "All facilities"
    SELECTED_FACILITIES = "selected_facilities", "Selected facilities"


FACILITY_AUDIENCES = (AnnouncementAudience.PATIENTS_IN_RANGE, AnnouncementAudience.DISPLAY)
PLATFORM_AUDIENCES = (
    AnnouncementAudience.ALL_FACILITIES,
    AnnouncementAudience.SELECTED_FACILITIES,
)


class AnnouncementStatus(models.TextChoices):
    DRAFT = "draft", "Draft"
    PUBLISHED = "published", "Published"
    WITHDRAWN = "withdrawn", "Withdrawn"


class Announcement(TimeStampedModel):
    facility = models.ForeignKey(
        "tenancy.Facility", on_delete=models.PROTECT, null=True, blank=True, related_name="+"
    )
    audience = models.CharField(max_length=24, choices=AnnouncementAudience.choices)
    target_facility_ids = ArrayField(models.UUIDField(), null=True, blank=True)
    range_starts_on = models.DateField(null=True, blank=True)
    range_ends_on = models.DateField(null=True, blank=True)
    priority = models.CharField(max_length=10, choices=Priority.choices, default=Priority.ROUTINE)
    title_i18n = models.JSONField(default=dict)
    body_i18n = models.JSONField(default=dict)
    status = models.CharField(
        max_length=10, choices=AnnouncementStatus.choices, default=AnnouncementStatus.DRAFT
    )
    starts_at = models.DateTimeField(null=True, blank=True)
    ends_at = models.DateTimeField(null=True, blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="+"
    )
    published_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT, null=True, blank=True, related_name="+"
    )
    published_at = models.DateTimeField(null=True, blank=True)
    withdrawn_at = models.DateTimeField(null=True, blank=True)
    recipient_count = models.IntegerField(null=True, blank=True)
    version = models.PositiveIntegerField(default=1)

    class Meta:
        db_table = "notifications_announcement"
        constraints = [
            models.CheckConstraint(
                condition=(
                    Q(facility__isnull=False, audience__in=["patients_in_range", "display"])
                    | Q(
                        facility__isnull=True,
                        audience__in=["all_facilities", "selected_facilities"],
                    )
                ),
                name="notifications_announcement_audience_owner",
            ),
            models.CheckConstraint(
                condition=Q(range_starts_on__isnull=True)
                | Q(range_ends_on__isnull=True)
                | Q(range_ends_on__gte=models.F("range_starts_on")),
                name="notifications_announcement_range_order",
            ),
            models.CheckConstraint(
                condition=Q(priority__in=["routine", "important"]),
                name="notifications_announcement_priority",
            ),
        ]
        indexes = [
            models.Index(fields=["facility", "status", "created_at"], name="notif_ann_idx"),
        ]


class KnownDevice(TimeStampedModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="+")
    device_hash = models.BinaryField()
    label = models.CharField(max_length=60, blank=True)
    last_seen_at = models.DateTimeField()

    class Meta:
        db_table = "notifications_known_device"
        constraints = [
            models.UniqueConstraint(
                fields=["user", "device_hash"], name="notifications_known_device_unique"
            )
        ]
