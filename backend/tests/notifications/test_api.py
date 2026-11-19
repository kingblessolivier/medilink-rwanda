"""S9 endpoints (contract sprint-09 §3.3): authorisation, inboxes, preferences, push allowlist,
announcements, templates, delivery log (S9-B1, B2, B7, B9, B10, B13, B17)."""

from __future__ import annotations

import base64
import os
import uuid
from typing import Any

import pytest
from django.db import transaction
from django.test import override_settings
from django.urls import reverse
from rest_framework.test import APIClient

from medilink.audit.models import AuditEntry
from medilink.notifications import hooks
from medilink.notifications.models import (
    Announcement,
    DeliveryAttempt,
    Notification,
    PushSubscription,
    Template,
)
from medilink.notifications.recipients import Recipients
from medilink.notifications.service import notify
from medilink.patients.models import Patient, PatientLink, Relationship
from medilink.tenancy.context import rls_context
from tests.conftest import error_code, login_patient, login_staff
from tests.factories import make_patient_user, make_staff

pytestmark = pytest.mark.django_db
VAPID = {
    "WEB_PUSH_VAPID_PUBLIC_KEY": "BPublicKeyForTestsOnly",
    "WEB_PUSH_VAPID_PRIVATE_KEY": "private-key-for-tests-only",
}


def _b64(n: int) -> str:
    return base64.urlsafe_b64encode(os.urandom(n)).decode().rstrip("=")


def _keys() -> dict[str, str]:
    return {"p256dh": _b64(65), "auth": _b64(16)}


def _client(user: Any, staff: bool) -> APIClient:
    client = APIClient()
    (login_staff if staff else login_patient)(client, user)
    return client


def _send(user: Any, audience: str, **kw: Any) -> Any:
    with transaction.atomic():
        return notify(
            "system.test",
            Recipients.users(user.pk, audience=audience),
            {"test_id": uuid.uuid4()},
            **kw,
        ).created[0]


@pytest.fixture
def world(facility: Any, other_facility: Any) -> dict[str, Any]:
    admin = make_staff(facility, roles=("facility_admin",))
    reception = make_staff(facility, roles=("receptionist",))
    other_admin = make_staff(other_facility, roles=("facility_admin",))
    platform = make_staff(None, email="plat.s9@example.test", is_platform_admin=True)
    patient = make_patient_user(preferred_language="en")
    stranger = make_patient_user()
    return {
        "facility": facility,
        "other": other_facility,
        "admin": admin,
        "reception": reception,
        "other_admin": other_admin,
        "platform": platform,
        "patient": patient,
        "stranger": stranger,
    }


def test_public_key_reports_push_state(api: APIClient) -> None:
    assert api.get("/api/v1/public/web-push-key/").json() == {
        "public_key": None,
        "is_enabled": False,
    }
    with override_settings(**VAPID):
        assert api.get("/api/v1/public/web-push-key/").json()["is_enabled"] is True


def test_inboxes_are_own_and_audience_scoped(world: dict[str, Any]) -> None:
    patient, stranger, reception = world["patient"], world["stranger"], world["reception"]
    mine = _send(patient, "patient")
    _send(stranger, "patient")
    client = _client(patient, staff=False)
    body = client.get("/api/v1/patient/notifications/").json()
    assert [r["id"] for r in body["results"]] == [str(mine)]
    assert client.get("/api/v1/patient/notifications/unread-count/").json() == {"unread": 1}
    theirs = Notification.objects.get(recipient_user=stranger)
    assert client.get(f"/api/v1/patient/notifications/{theirs.pk}/").status_code == 404
    assert client.post(f"/api/v1/patient/notifications/{theirs.pk}/read/").status_code == 404
    # staff session can't read the patient inbox, and vice versa
    staff = _client(reception, staff=True)
    assert staff.get("/api/v1/patient/notifications/").status_code in (401, 403)
    assert client.get("/api/v1/staff/notifications/").status_code in (401, 403)
    # mark read, idempotent; attempts become read
    first = client.post(f"/api/v1/patient/notifications/{mine}/read/").json()
    again = client.post(f"/api/v1/patient/notifications/{mine}/read/").json()
    assert first["is_read"] and again["read_at"] == first["read_at"]
    assert (
        DeliveryAttempt.objects.filter(notification_id=mine, channel="in_app").get().status
        == "read"
    )
    assert client.post("/api/v1/patient/notifications/read-all/", {}, format="json").json() == {
        "marked": 0
    }


def test_staff_inbox_shows_active_facility_and_counts_others(world: dict[str, Any]) -> None:
    reception, facility, other = world["reception"], world["facility"], world["other"]
    from tests.factories import make_membership

    make_membership(reception, other, roles=("receptionist",))
    here = _send(reception, "staff", facility_id=facility.pk)
    there = _send(reception, "staff", facility_id=other.pk)
    everywhere = _send(reception, "staff")
    client = _client(reception, staff=True)
    client.post(
        "/api/v1/staff/auth/active-facility/", {"facility_id": str(facility.pk)}, format="json"
    )
    ids = {r["id"] for r in client.get("/api/v1/staff/notifications/").json()["results"]}
    assert ids == {str(here), str(everywhere)}
    assert client.get(f"/api/v1/staff/notifications/{there}/").status_code == 404
    count = client.get("/api/v1/staff/notifications/unread-count/").json()
    assert count == {"unread": 2, "other_facilities": [{"facility_id": str(other.pk), "unread": 1}]}


def test_patient_preferences_defaults_version_and_rules(world: dict[str, Any]) -> None:
    patient = world["patient"]
    child = Patient.objects.create(full_name="Keza Umutoni")
    PatientLink.objects.create(account=patient, patient=child, relationship=Relationship.GUARDIAN)
    client = _client(patient, staff=False)
    prefs = client.get("/api/v1/patient/notification-preferences/").json()
    assert prefs["version"] == 0
    assert prefs["quiet_hours"] == {"is_enabled": True, "start": "21:00", "end": "06:00"}
    assert prefs["channels"]["routine"] == ["email"]  # push disabled without keys
    assert prefs["dependents"][0]["display_name"] == "Keza"
    patch = {
        "version": 0,
        "channels": {"critical": ["email"], "important": [], "routine": []},
        "quiet_hours": {"is_enabled": False, "start": "22:00", "end": "07:00"},
        "dependents": [{"patient_id": str(child.pk), "receive_alerts": False}],
        "language": "fr",
    }
    saved = client.patch("/api/v1/patient/notification-preferences/", patch, format="json")
    assert saved.status_code == 200, saved.content
    assert saved.json()["version"] == 1 and saved.json()["language"] == "fr"
    assert saved.json()["dependents"][0]["receive_alerts"] is False
    stale = client.patch("/api/v1/patient/notification-preferences/", patch, format="json")
    assert stale.status_code == 409
    bad = {**patch, "version": 1, "channels": {"critical": ["sms"], "important": [], "routine": []}}
    assert (
        client.patch("/api/v1/patient/notification-preferences/", bad, format="json").status_code
        == 400
    )
    assert AuditEntry.objects.filter(action="notifications.preferences.updated").exists()

    hooks.register_active_ticket_check(lambda user: True)
    try:
        locked = {
            **patch,
            "version": 1,
            "channels": {"critical": [], "important": [], "routine": []},
        }
        response = client.patch("/api/v1/patient/notification-preferences/", locked, format="json")
        assert response.status_code == 422 and error_code(response) == "business_rule_violation"
    finally:
        hooks._ticket_checks.clear()


def test_staff_preferences(world: dict[str, Any]) -> None:
    client = _client(world["reception"], staff=True)
    prefs = client.get("/api/v1/staff/notification-preferences/").json()
    assert prefs == {
        "language": "rw",
        "sound_enabled": False,
        "approvals_digest": "immediate",
        "version": 0,
    }
    saved = client.patch(
        "/api/v1/staff/notification-preferences/",
        {"version": 0, "sound_enabled": True},
        format="json",
    ).json()
    assert saved["sound_enabled"] is True and saved["version"] == 1


@override_settings(**VAPID)
@pytest.mark.parametrize(
    "endpoint",
    [
        "https://evil.example/x",
        "https://fcm.googleapis.com.evil.example/x",
        "https://169.254.169.254/x",
        "https://[::1]/x",
        "http://fcm.googleapis.com/x",
        "https://user@fcm.googleapis.com/x",
        "https://fcm.googleapis.com:8443/x",
    ],
)
def test_push_allowlist_rejects(world: dict[str, Any], endpoint: str) -> None:
    client = _client(world["patient"], staff=False)
    response = client.post(
        "/api/v1/patient/push-subscriptions/",
        {"endpoint": endpoint, "keys": _keys()},
        format="json",
    )
    assert response.status_code == 400, endpoint
    assert "endpoint" in response.json()["error"]["fields"]


@override_settings(**VAPID)
def test_push_subscribe_take_over_limit_and_remove(world: dict[str, Any]) -> None:
    patient, stranger = world["patient"], world["stranger"]
    client = _client(patient, staff=False)
    for host in (
        "https://fcm.googleapis.com/fcm/send/a",
        "https://updates.push.services.mozilla.com/wpush/v2/a",
        "https://web.push.apple.com/a",
        "https://wns2-par02p.notify.windows.com/w/?token=a",
    ):
        response = client.post(
            "/api/v1/patient/push-subscriptions/",
            {"endpoint": host, "keys": _keys()},
            format="json",
        )
        assert response.status_code == 201, (host, response.content)
    same = client.post(
        "/api/v1/patient/push-subscriptions/",
        {"endpoint": "https://fcm.googleapis.com/fcm/send/a", "keys": _keys()},
        format="json",
    )
    assert same.status_code == 200
    other = _client(stranger, staff=False)
    taken = other.post(
        "/api/v1/patient/push-subscriptions/",
        {"endpoint": "https://fcm.googleapis.com/fcm/send/a", "keys": _keys()},
        format="json",
    )
    assert taken.status_code == 201
    assert PushSubscription.objects.get(endpoint__endswith="/send/a").user_id == stranger.pk
    for i in range(10):
        other.post(
            "/api/v1/patient/push-subscriptions/",
            {"endpoint": f"https://fcm.googleapis.com/fcm/send/b{i}", "keys": _keys()},
            format="json",
        )
    assert PushSubscription.objects.filter(user=stranger, revoked_at__isnull=True).count() == 10
    assert PushSubscription.objects.filter(user=stranger, revoked_reason="limit").count() == 1
    sub = client.get("/api/v1/patient/push-subscriptions/").json()[0]
    assert client.delete(f"/api/v1/patient/push-subscriptions/{sub['id']}/").status_code == 204
    assert client.delete(f"/api/v1/patient/push-subscriptions/{sub['id']}/").status_code == 404


def _announcement(client: APIClient, base: str, **extra: Any) -> Any:
    body = {
        "audience": "patients_in_range",
        "range_starts_on": "2026-11-02",
        "range_ends_on": "2026-11-02",
        "priority": "important",
        "title_i18n": {"en": "Pediatrics closed Friday afternoon"},
        "body_i18n": {"en": "Please come on Monday instead."},
        **extra,
    }
    return client.post(base, body, format="json")


def test_facility_announcement_lifecycle(
    world: dict[str, Any], django_capture_on_commit_callbacks: Any
) -> None:
    admin, reception, other_admin = world["admin"], world["reception"], world["other_admin"]
    patient = world["patient"]
    self_link = PatientLink.objects.get(account=patient, relationship="self")
    base = "/api/v1/staff/announcements/"
    staff = _client(admin, staff=True)
    assert _client(reception, staff=True).get(base).status_code == 403
    for text in ({"en": "Your HIV results"}, {"en": "See https://bad.example"}):
        bad = _announcement(staff, base, body_i18n=text)
        assert bad.status_code == 400, text
    created = _announcement(staff, base)
    assert created.status_code == 201, created.content
    row = created.json()
    assert row["status"] == "draft"
    assert _client(other_admin, staff=True).get(f"{base}{row['id']}/").status_code == 404
    with rls_context(facility_id=world["other"].pk):
        assert not Announcement.objects.filter(pk=row["id"]).exists()  # RLS as the app role
    assert staff.post(f"{base}{row['id']}/withdraw/").status_code == 422

    def resolver(facility_id: Any, start: Any, end: Any) -> list[Any]:
        return [self_link.patient_id]

    hooks.register_audience_resolver("patients_in_range", resolver)
    try:
        with django_capture_on_commit_callbacks(execute=True):
            published = staff.post(f"{base}{row['id']}/publish/")
        assert published.status_code == 200, published.content
        assert staff.post(f"{base}{row['id']}/publish/").status_code == 409
    finally:
        hooks.unregister_audience_resolver("patients_in_range", resolver)
    note = Notification.objects.get(recipient_user=patient, announcement_id=row["id"])
    assert note.title == "Pediatrics closed Friday afternoon"
    with rls_context(facility_id=world["facility"].pk):
        assert Announcement.objects.get(pk=row["id"]).recipient_count == 1
    withdrawn = staff.post(f"{base}{row['id']}/withdraw/")
    assert withdrawn.json()["status"] == "withdrawn"
    note.refresh_from_db()
    assert note.is_withdrawn
    assert AuditEntry.objects.filter(action="announcement.published").exists()


def test_daily_publish_limit(world: dict[str, Any]) -> None:
    staff = _client(world["admin"], staff=True)
    base = "/api/v1/staff/announcements/"
    for i in range(11):
        row = _announcement(
            staff, base, audience="display", range_starts_on=None, range_ends_on=None
        ).json()
        response = staff.post(f"{base}{row['id']}/publish/")
        assert response.status_code == (429 if i == 10 else 200), i


def test_platform_announcement_reaches_members_and_admin_email(
    world: dict[str, Any], django_capture_on_commit_callbacks: Any
) -> None:
    from django.core import mail

    from medilink.tenancy.models import FacilityStatus

    for f in (world["facility"], world["other"]):
        f.status = FacilityStatus.LIVE
        f.save(update_fields=["status"])
    platform = _client(world["platform"], staff=True)
    base = "/api/v1/platform/announcements/"
    assert _client(world["admin"], staff=True).get(base).status_code == 403
    assert (
        platform.post(
            base,
            {"audience": "patients_in_range", "title_i18n": {"en": "x"}, "body_i18n": {"en": "y"}},
            format="json",
        ).status_code
        == 400
    )
    row = platform.post(
        base,
        {
            "audience": "all_facilities",
            "title_i18n": {"en": "Maintenance tonight"},
            "body_i18n": {"en": "MediLink is down 22:00-23:00."},
        },
        format="json",
    ).json()
    with django_capture_on_commit_callbacks(execute=True):
        assert platform.post(f"{base}{row['id']}/publish/").status_code == 200
    reached = set(
        Notification.objects.filter(announcement_id=row["id"]).values_list(
            "recipient_user_id", flat=True
        )
    )
    assert reached == {world["admin"].pk, world["reception"].pk, world["other_admin"].pk}
    assert sorted(m.to[0] for m in mail.outbox) == sorted(
        [world["admin"].email, world["other_admin"].email]
    )


def test_templates_revise_activate(world: dict[str, Any]) -> None:
    platform = _client(world["platform"], staff=True)
    row = Template.objects.get(
        code="account.login.new_device", channel="email", language="en", variant="self"
    )
    base = "/api/v1/platform/notification-templates/"
    listed = platform.get(base, {"code": row.code, "channel": "email", "language": "en"}).json()
    assert listed["results"][0]["allowed_placeholders"] == ["date", "device_label", "time"]
    for body in ("Your HIV test", "VIH", "SIDA", "Your diagnosis", "$diagnosis is ready"):
        response = platform.post(
            f"{base}{row.pk}/revise/",
            {"subject": "s", "body": body, "based_on_version": 1},
            format="json",
        )
        assert response.status_code == 400, body
    revised = platform.post(
        f"{base}{row.pk}/revise/",
        {"subject": "New sign-in", "body": "Sign-in from $device_label.", "based_on_version": 1},
        format="json",
    )
    assert revised.status_code == 201 and revised.json()["template_version"] == 2
    assert (
        platform.post(
            f"{base}{row.pk}/revise/",
            {"subject": "a", "body": "b", "based_on_version": 1},
            format="json",
        ).status_code
        == 409
    )
    assert platform.post(f"{base}{row.pk}/activate/").status_code == 200
    row.refresh_from_db()
    assert row.is_active
    assert platform.post(f"{base}{row.pk}/activate/").status_code == 409
    # the post_migrate sync never overwrites edited rows
    from medilink.notifications import templates as tpl

    tpl.sync_defaults()
    assert Template.objects.filter(code=row.code, channel="email", language="en").count() == 2


def test_delivery_log_and_stats(world: dict[str, Any]) -> None:
    patient, facility = world["patient"], world["facility"]
    self_patient = PatientLink.objects.get(account=patient, relationship="self").patient_id
    with transaction.atomic():
        notify(
            "system.test",
            Recipients.users(patient.pk, audience="patient"),
            {"test_id": uuid.uuid4()},
            facility_id=facility.pk,
            patient_id=self_patient,
        )
    staff = _client(world["admin"], staff=True)
    log = staff.get(
        "/api/v1/staff/notification-deliveries/", {"patient_id": str(self_patient)}
    ).json()
    assert len(log["results"]) == 1
    channels = {a["channel"]: a["status"] for a in log["results"][0]["attempts"]}
    assert channels["in_app"] == "sent" and channels["web_push"] == "skipped"
    assert AuditEntry.objects.filter(action="notifications.deliveries.viewed").count() == 1
    assert (
        _client(world["reception"], staff=True)
        .get("/api/v1/staff/notification-deliveries/")
        .status_code
        == 403
    )
    other = _client(world["other_admin"], staff=True)
    assert other.get("/api/v1/staff/notification-deliveries/").json()["results"] == []
    platform = _client(world["platform"], staff=True)
    stats = platform.get("/api/v1/platform/notification-deliveries/stats/").json()
    assert {c["channel"] for c in stats["by_channel"]} >= {"in_app", "email"}
    assert (
        platform.get(
            "/api/v1/platform/notification-deliveries/", {"recipient_user_id": str(patient.pk)}
        ).json()["count"]
        == 1
    )


def test_every_endpoint_is_routed() -> None:
    names = [
        "notifications-web-push-key",
        "patient-notifications",
        "patient-notifications-unread-count",
        "patient-notifications-read-all",
        "patient-notification-preferences",
        "patient-push-subscriptions",
        "patient-app-devices",
        "staff-notifications",
        "staff-notifications-unread-count",
        "staff-notifications-read-all",
        "staff-notification-preferences",
        "staff-announcements",
        "staff-notification-deliveries",
        "platform-announcements",
        "platform-notification-templates",
        "platform-notification-deliveries",
        "platform-notification-delivery-stats",
    ]
    for name in names:
        assert reverse(name)
