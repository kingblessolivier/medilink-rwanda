"""S9 schemas (contract sprint-09 §3.3)."""

from __future__ import annotations

from typing import Any

from rest_framework import serializers

from medilink.accounts.models import Language
from medilink.notifications.models import (
    Announcement,
    AnnouncementAudience,
    AttemptStatus,
    Notification,
    Priority,
    PushSubscription,
    Template,
)

LANGS = Language.choices


class FacilityRefSerializer(serializers.Serializer[Any]):
    id = serializers.UUIDField()
    name = serializers.CharField()


class NotificationSerializer(serializers.ModelSerializer[Notification]):
    is_read = serializers.SerializerMethodField()
    facility = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = [
            "id",
            "event_type",
            "priority",
            "language",
            "title",
            "body",
            "action_path",
            "patient_id",
            "facility",
            "data",
            "is_read",
            "read_at",
            "is_withdrawn",
            "created_at",
        ]

    def get_is_read(self, obj: Notification) -> bool:
        return obj.read_at is not None

    def get_facility(self, obj: Notification) -> dict[str, Any] | None:
        names: dict[Any, str] = self.context.get("facility_names", {})
        if obj.facility_id is None:
            return None
        return {"id": obj.facility_id, "name": names.get(obj.facility_id, "")}


class OtherFacilityCountSerializer(serializers.Serializer[Any]):
    facility_id = serializers.UUIDField()
    unread = serializers.IntegerField()


class UnreadCountSerializer(serializers.Serializer[Any]):
    unread = serializers.IntegerField()
    other_facilities = OtherFacilityCountSerializer(many=True, required=False)


class ReadAllSerializer(serializers.Serializer[Any]):
    before = serializers.DateTimeField(required=False)


class MarkedSerializer(serializers.Serializer[Any]):
    marked = serializers.IntegerField()


class QuietHoursSerializer(serializers.Serializer[Any]):
    is_enabled = serializers.BooleanField()
    start = serializers.TimeField(format="%H:%M")
    end = serializers.TimeField(format="%H:%M")


class ChannelsSerializer(serializers.Serializer[Any]):
    critical = serializers.ListField(child=serializers.CharField())
    important = serializers.ListField(child=serializers.CharField())
    routine = serializers.ListField(child=serializers.CharField())


class DependentAlertSerializer(serializers.Serializer[Any]):
    patient_id = serializers.UUIDField()
    display_name = serializers.CharField(read_only=True)
    relationship = serializers.CharField(read_only=True)
    receive_alerts = serializers.BooleanField()


class PatientPreferencesSerializer(serializers.Serializer[Any]):
    language = serializers.ChoiceField(choices=LANGS)
    available_channels = serializers.ListField(child=serializers.CharField(), read_only=True)
    channels = ChannelsSerializer()
    quiet_hours = QuietHoursSerializer()
    reminder_offsets_minutes = serializers.ListField(
        child=serializers.IntegerField(min_value=5, max_value=10_080), max_length=5
    )
    dependents = DependentAlertSerializer(many=True)
    is_critical_locked = serializers.BooleanField(read_only=True)
    version = serializers.IntegerField()


class PatientPreferencesPatchSerializer(serializers.Serializer[Any]):
    version = serializers.IntegerField(min_value=0)
    language = serializers.ChoiceField(choices=LANGS, required=False)
    channels = ChannelsSerializer(required=False)
    quiet_hours = QuietHoursSerializer(required=False)
    reminder_offsets_minutes = serializers.ListField(
        child=serializers.IntegerField(min_value=5, max_value=10_080), max_length=5, required=False
    )
    dependents = DependentAlertSerializer(many=True, required=False)


class StaffPreferencesSerializer(serializers.Serializer[Any]):
    language = serializers.ChoiceField(choices=LANGS)
    sound_enabled = serializers.BooleanField()
    approvals_digest = serializers.ChoiceField(choices=["immediate", "daily"])
    version = serializers.IntegerField()


class StaffPreferencesPatchSerializer(serializers.Serializer[Any]):
    version = serializers.IntegerField(min_value=0)
    language = serializers.ChoiceField(choices=LANGS, required=False)
    sound_enabled = serializers.BooleanField(required=False)
    approvals_digest = serializers.ChoiceField(choices=["immediate", "daily"], required=False)


class PushKeysSerializer(serializers.Serializer[Any]):
    p256dh = serializers.CharField(max_length=100)
    auth = serializers.CharField(max_length=40)


class PushSubscriptionRequestSerializer(serializers.Serializer[Any]):
    endpoint = serializers.CharField(max_length=2048)
    expiration_time = serializers.IntegerField(required=False, allow_null=True)
    keys = PushKeysSerializer()


class PushSubscriptionSerializer(serializers.ModelSerializer[PushSubscription]):
    class Meta:
        model = PushSubscription
        fields = ["id", "kind", "label", "endpoint_host", "created_at", "last_success_at"]


class AppDeviceRequestSerializer(serializers.Serializer[Any]):
    token = serializers.RegexField(r"^[A-Za-z0-9_:\-]+$", min_length=20, max_length=4096)
    name = serializers.CharField(max_length=60, required=False, allow_blank=True)


class WebPushKeySerializer(serializers.Serializer[Any]):
    public_key = serializers.CharField(allow_null=True)
    is_enabled = serializers.BooleanField()


ANNOUNCEMENT_PRIORITIES = [(Priority.ROUTINE, "Routine"), (Priority.IMPORTANT, "Important")]


class PersonRefSerializer(serializers.Serializer[Any]):
    id = serializers.UUIDField()
    full_name = serializers.CharField()


class AnnouncementSerializer(serializers.ModelSerializer[Announcement]):
    created_by = serializers.SerializerMethodField()

    class Meta:
        model = Announcement
        fields = [
            "id",
            "facility_id",
            "audience",
            "target_facility_ids",
            "range_starts_on",
            "range_ends_on",
            "priority",
            "title_i18n",
            "body_i18n",
            "starts_at",
            "ends_at",
            "status",
            "recipient_count",
            "created_by",
            "published_at",
            "withdrawn_at",
            "version",
            "created_at",
        ]

    def get_created_by(self, obj: Announcement) -> dict[str, Any]:
        return {"id": obj.created_by_id, "full_name": obj.created_by.full_name}


class I18nTextSerializer(serializers.Serializer[Any]):
    rw = serializers.CharField(required=False, allow_blank=True)
    en = serializers.CharField(required=False, allow_blank=True)
    fr = serializers.CharField(required=False, allow_blank=True)


class AnnouncementWriteSerializer(serializers.Serializer[Any]):
    version = serializers.IntegerField(required=False)
    audience = serializers.ChoiceField(choices=AnnouncementAudience.choices)
    target_facility_ids = serializers.ListField(
        child=serializers.UUIDField(), required=False, allow_null=True, max_length=200
    )
    range_starts_on = serializers.DateField(required=False, allow_null=True)
    range_ends_on = serializers.DateField(required=False, allow_null=True)
    priority = serializers.ChoiceField(choices=ANNOUNCEMENT_PRIORITIES, default=Priority.ROUTINE)
    title_i18n = I18nTextSerializer()
    body_i18n = I18nTextSerializer()
    starts_at = serializers.DateTimeField(required=False, allow_null=True)
    ends_at = serializers.DateTimeField(required=False, allow_null=True)


class AnnouncementPatchSerializer(AnnouncementWriteSerializer):
    version = serializers.IntegerField()
    audience = serializers.ChoiceField(choices=AnnouncementAudience.choices, required=False)
    title_i18n = I18nTextSerializer(required=False)
    body_i18n = I18nTextSerializer(required=False)


class AttemptLogSerializer(serializers.Serializer[Any]):
    channel = serializers.CharField()
    attempt_no = serializers.IntegerField()
    is_fallback = serializers.BooleanField()
    status = serializers.ChoiceField(choices=AttemptStatus.choices)
    failure_reason = serializers.CharField(allow_null=True)
    queued_at = serializers.DateTimeField()
    sent_at = serializers.DateTimeField(allow_null=True)


class TemplateRefSerializer(serializers.Serializer[Any]):
    code = serializers.CharField()
    version = serializers.IntegerField()
    language = serializers.CharField()


class DeliveryLogEntrySerializer(serializers.Serializer[Any]):
    notification_id = serializers.UUIDField()
    event_type = serializers.CharField()
    priority = serializers.CharField()
    recipient_user_id = serializers.UUIDField()
    patient_id = serializers.UUIDField(allow_null=True)
    template = TemplateRefSerializer()
    title = serializers.CharField()
    created_at = serializers.DateTimeField()
    read_at = serializers.DateTimeField(allow_null=True)
    attempts = AttemptLogSerializer(many=True)


class NotificationTemplateSerializer(serializers.ModelSerializer[Template]):
    allowed_placeholders = serializers.SerializerMethodField()
    limits = serializers.SerializerMethodField()
    created_by = serializers.SerializerMethodField()

    class Meta:
        model = Template
        fields = [
            "id",
            "code",
            "channel",
            "language",
            "variant",
            "template_version",
            "subject",
            "body",
            "placeholders",
            "allowed_placeholders",
            "limits",
            "is_active",
            "source",
            "created_by",
            "created_at",
        ]

    def get_allowed_placeholders(self, obj: Template) -> list[str]:
        from medilink.notifications import registry
        from medilink.notifications.registry import FORBIDDEN_KINDS

        try:
            definition = registry.get(obj.code)
        except Exception:
            return []
        forbidden = FORBIDDEN_KINDS.get(obj.channel, frozenset())
        return sorted(n for n, k in definition.placeholders.items() if k not in forbidden)

    def get_limits(self, obj: Template) -> dict[str, int]:
        from medilink.notifications.templates import LIMITS

        limits = LIMITS.get(obj.channel)
        return {"subject": limits.subject, "body": limits.body} if limits else {}

    def get_created_by(self, obj: Template) -> dict[str, Any] | None:
        if obj.created_by is None:
            return None
        return {"id": obj.created_by_id, "full_name": obj.created_by.full_name}


class TemplateReviseSerializer(serializers.Serializer[Any]):
    subject = serializers.CharField(max_length=120)
    body = serializers.CharField(max_length=4000)
    based_on_version = serializers.IntegerField(min_value=1)


class ChannelStatSerializer(serializers.Serializer[Any]):
    channel = serializers.CharField()
    sent = serializers.IntegerField()
    failed = serializers.IntegerField()
    skipped = serializers.IntegerField()
    held = serializers.IntegerField()
    cancelled = serializers.IntegerField()


class ReasonCountSerializer(serializers.Serializer[Any]):
    reason = serializers.CharField()
    count = serializers.IntegerField()


class PushOptInSerializer(serializers.Serializer[Any]):
    patient_accounts = serializers.IntegerField()
    with_active_subscription = serializers.IntegerField()


class DeliveryStatsSerializer(serializers.Serializer[Any]):
    since = serializers.DateTimeField()
    by_channel = ChannelStatSerializer(many=True)
    failure_reasons = ReasonCountSerializer(many=True)
    push_opt_in = PushOptInSerializer()
