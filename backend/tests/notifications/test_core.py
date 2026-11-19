"""S9 notification core: notify() contract, recipients, delivery rules, retries and fallback
(contract sprint-09 S9-B3..B8, B12, B13)."""

from __future__ import annotations

import datetime as dt
import uuid
import zoneinfo
from typing import Any
from unittest import mock

import pytest
from django.core import mail
from django.db import transaction
from django.utils import timezone

from medilink.notifications import channels, registry, tasks, templates
from medilink.notifications.channels import SendResult
from medilink.notifications.models import (
    AttemptStatus,
    DeliveryAttempt,
    Notification,
    Preference,
    PushSubscription,
)
from medilink.notifications.recipients import Recipients
from medilink.notifications.registry import EventDefinition, Placeholder, Text
from medilink.notifications.service import NotifyError, notify
from medilink.patients.models import Patient, PatientLink, Relationship
from tests.factories import UserFactory, make_patient_user

pytestmark = pytest.mark.django_db
KIGALI = zoneinfo.ZoneInfo("Africa/Kigali")


def _texts(channels_: tuple[str, ...], subject: str, body: str) -> dict[Any, Text]:
    return {
        (c, lang, "self"): Text(subject, body) for c in channels_ for lang in ("rw", "en", "fr")
    }


@pytest.fixture
def event() -> Any:
    """A test event with in_app + email (+ web_push), synced into templates."""
    definition = EventDefinition(
        type="test.item.ready",
        audience="patient",
        priority="routine",
        channels=("in_app", "email", "web_push"),
        fallback=("email",),
        placeholders={"facility_name": Placeholder.FACILITY_NAME, "time": Placeholder.TIME},
        data_keys=frozenset({"item_id"}),
        dedupe="{type}:{item_id}",
        templates={
            **_texts(("in_app", "email"), "Ready at $facility_name", "Come at $time."),
            **_texts(("web_push",), "Ready", "Come at $time."),
        },
    )
    registry.register(definition)
    templates.sync_defaults()
    yield definition
    registry._EVENTS.pop(definition.type, None)


def _push(user: Any) -> PushSubscription:
    return PushSubscription.objects.create(
        user=user,
        endpoint=f"https://fcm.googleapis.com/fcm/send/{uuid.uuid4()}",
        endpoint_host="fcm.googleapis.com",
        p256dh="p" * 20,
        auth_secret="a" * 16,
    )


def _ctx(item: Any = None) -> dict[str, Any]:
    return {
        "facility_name": "Kigali Clinic",
        "time": timezone.now(),
        "item_id": item or uuid.uuid4(),
    }


def test_in_app_and_email_on_commit(event: Any, django_capture_on_commit_callbacks: Any) -> None:
    user = UserFactory(preferred_language="en")
    with django_capture_on_commit_callbacks(execute=True), transaction.atomic():
        result = notify(event.type, Recipients.users(user.pk, audience="patient"), _ctx())
    assert len(result.created) == 1
    n = Notification.objects.get(pk=result.created[0])
    assert n.title == "Ready at Kigali Clinic" and n.language == "en"
    statuses = dict(DeliveryAttempt.objects.filter(notification=n).values_list("channel", "status"))
    assert statuses["in_app"] == AttemptStatus.SENT
    assert statuses["email"] == AttemptStatus.SENT  # eager task on commit
    assert statuses["web_push"] == AttemptStatus.SKIPPED  # no VAPID keys in tests
    assert len(mail.outbox) == 1 and mail.outbox[0].to == [user.email]
    assert f"/notifications/{n.pk}" in mail.outbox[0].body


def test_contract_errors_and_rollback(event: Any, django_capture_on_commit_callbacks: Any) -> None:
    user = UserFactory()
    spec = Recipients.users(user.pk, audience="patient")
    outside = mock.Mock(in_atomic_block=False)  # tests always run inside a transaction
    with (
        mock.patch(
            "medilink.notifications.service.transaction.get_connection", return_value=outside
        ),
        pytest.raises(NotifyError),
    ):
        notify(event.type, spec, _ctx())
    with transaction.atomic():
        with pytest.raises(NotifyError):
            notify("no.such.event", spec, _ctx())
        with pytest.raises(NotifyError):
            notify(event.type, spec, {**_ctx(), "diagnosis": "x"})
        with pytest.raises(NotifyError):
            notify(event.type, spec, {**_ctx(), "item_id": "Mukamana"})
    with django_capture_on_commit_callbacks(execute=True) as callbacks:
        try:
            with transaction.atomic():
                notify(event.type, spec, _ctx())
                raise RuntimeError("business action failed")
        except RuntimeError:
            pass
    assert callbacks == [] and not Notification.objects.filter(recipient_user=user).exists()
    assert mail.outbox == []


def test_dedupe_and_rate_limit(event: Any) -> None:
    user = UserFactory()
    spec = Recipients.users(user.pk, audience="patient")
    item = uuid.uuid4()
    with transaction.atomic():
        first = notify(event.type, spec, _ctx(item))
        again = notify(event.type, spec, _ctx(item))
    assert len(first.created) == 1 and again.duplicates == 1
    with transaction.atomic():
        results = [notify(event.type, spec, _ctx()) for _ in range(12)]
    assert sum(r.rate_limited for r in results) == 3  # 10 per hour, one already sent


def test_guardians_get_dependent_variant_and_can_mute(event: Any) -> None:
    owner = make_patient_user()
    child = Patient.objects.create(full_name="Keza Umutoni")
    PatientLink.objects.create(account=owner, patient=child, relationship=Relationship.GUARDIAN)
    delegate = UserFactory()
    PatientLink.objects.create(account=delegate, patient=child, relationship=Relationship.DELEGATE)
    revoked = UserFactory()
    PatientLink.objects.create(
        account=revoked,
        patient=child,
        relationship=Relationship.DELEGATE,
        revoked_at=timezone.now(),
    )
    resolved = Recipients.patient(child.pk).resolve()
    assert {r.user_id for r in resolved} == {owner.pk, delegate.pk}
    assert {r.variant for r in resolved} == {"dependent"}
    Preference.objects.create(
        user=delegate, audience="patient", patient_id=child.pk, receive_alerts=False
    )
    assert {r.user_id for r in Recipients.patient(child.pk).resolve()} == {owner.pk}


def test_preference_off_is_skipped_but_in_app_stays(event: Any) -> None:
    user = UserFactory()
    Preference.objects.create(
        user=user,
        audience="patient",
        channels={"critical": ["email"], "important": ["email"], "routine": []},
    )
    with transaction.atomic():
        result = notify(event.type, Recipients.users(user.pk, audience="patient"), _ctx())
    attempts = dict(
        DeliveryAttempt.objects.filter(notification_id=result.created[0]).values_list(
            "channel", "failure_reason"
        )
    )
    assert attempts["email"] == "preference_off" and "in_app" in attempts


@pytest.mark.real_clock
@pytest.mark.parametrize(
    ("priority", "for_today", "held"),
    [
        ("routine", False, True),
        ("important", False, True),
        ("important", True, False),
        ("critical", False, False),
    ],
)
def test_quiet_hours(event: Any, priority: str, for_today: bool, held: bool) -> None:
    user = UserFactory()
    night = dt.datetime(2026, 11, 2, 22, 30, tzinfo=KIGALI)
    with mock.patch("django.utils.timezone.now", return_value=night), transaction.atomic():
        result = notify(
            event.type,
            Recipients.users(user.pk, audience="patient"),
            _ctx(),
            priority=priority,
            is_for_today=for_today,
        )
    email = DeliveryAttempt.objects.get(notification_id=result.created[0], channel="email")
    assert (email.status == AttemptStatus.HELD) is held
    if held:
        assert email.scheduled_for == dt.datetime(2026, 11, 3, 6, 0, tzinfo=KIGALI)
        later = dt.datetime(2026, 11, 3, 6, 1, tzinfo=KIGALI)
        with mock.patch("django.utils.timezone.now", return_value=later):
            tasks.dispatch_due()
        email.refresh_from_db()
        assert email.status == AttemptStatus.SENT


def _fake_push(results: list[SendResult]) -> Any:
    adapter = channels.get("web_push")
    calls = iter(results)
    return (
        mock.patch("medilink.notifications.conf.push_enabled", return_value=True),
        mock.patch.object(adapter, "send", side_effect=lambda *a, **k: next(calls)),
    )


def test_retries_then_critical_fallback(
    event: Any, django_capture_on_commit_callbacks: Any
) -> None:
    user = UserFactory()
    sub = _push(user)
    failure = SendResult(status="failed", retryable=True, failure_reason="provider_error")
    enabled, send = _fake_push([failure] * 4)
    with enabled, send:
        with django_capture_on_commit_callbacks(execute=True), transaction.atomic():
            result = notify(
                event.type,
                Recipients.users(user.pk, audience="patient"),
                _ctx(),
                priority="critical",
                channels=("web_push",),
            )
        n = result.created[0]
        for _ in range(3):
            DeliveryAttempt.objects.filter(
                notification_id=n, status=AttemptStatus.QUEUED
            ).update(  # the backoff has passed
                queued_at=timezone.now() - dt.timedelta(minutes=5),
                scheduled_for=timezone.now() - dt.timedelta(seconds=1),
            )
            with django_capture_on_commit_callbacks(execute=True):
                tasks.dispatch_due()
    push = DeliveryAttempt.objects.filter(notification_id=n, channel="web_push").order_by(
        "attempt_no"
    )
    assert [a.attempt_no for a in push] == [1, 2, 3, 4]
    assert all(a.status == AttemptStatus.FAILED for a in push)
    fallback = DeliveryAttempt.objects.get(notification_id=n, channel="email", is_fallback=True)
    assert fallback.status == AttemptStatus.SENT
    sub.refresh_from_db()
    assert sub.revoked_at is None


def test_push_gone_revokes_without_retry(
    event: Any, django_capture_on_commit_callbacks: Any
) -> None:
    user = UserFactory()
    sub = _push(user)
    enabled, send = _fake_push(
        [SendResult(status="failed", failure_reason="push_gone", revoke_target=True)]
    )
    with enabled, send, django_capture_on_commit_callbacks(execute=True), transaction.atomic():
        result = notify(
            event.type,
            Recipients.users(user.pk, audience="patient"),
            _ctx(),
            channels=("web_push",),
        )
    attempts = DeliveryAttempt.objects.filter(notification_id=result.created[0], channel="web_push")
    assert attempts.count() == 1 and attempts.get().failure_reason == "push_gone"
    sub.refresh_from_db()
    assert sub.revoked_reason == "gone"


def test_unread_important_for_today_falls_back_once(event: Any) -> None:
    user = UserFactory()
    with transaction.atomic():
        result = notify(
            event.type,
            Recipients.users(user.pk, audience="patient"),
            _ctx(),
            priority="important",
            is_for_today=True,
            channels=(),
        )
    n = Notification.objects.get(pk=result.created[0])
    Notification.objects.filter(pk=n.pk).update(
        created_at=timezone.now() - dt.timedelta(minutes=16)
    )
    assert tasks.unread_fallback() == 1
    assert tasks.unread_fallback() == 0
    assert DeliveryAttempt.objects.filter(
        notification=n, is_fallback=True, channel="email"
    ).exists()


def test_a_day_old_backlog_is_cancelled_not_sent(event: Any) -> None:
    """A worker that was down must not send stale alerts when it starts."""
    user = UserFactory()
    with transaction.atomic():
        result = notify(event.type, Recipients.users(user.pk, audience="patient"), _ctx())
    email = DeliveryAttempt.objects.get(notification_id=result.created[0], channel="email")
    old = timezone.now() - dt.timedelta(days=3)
    DeliveryAttempt.objects.filter(pk=email.pk).update(
        status=AttemptStatus.QUEUED, queued_at=old, scheduled_for=old
    )
    tasks.send_attempt(str(email.pk))
    email.refresh_from_db()
    assert email.status == AttemptStatus.CANCELLED and email.failure_reason == "expired"
    DeliveryAttempt.objects.filter(pk=email.pk).update(status=AttemptStatus.QUEUED)
    assert tasks.dispatch_due() == 0
    email.refresh_from_db()
    assert email.status == AttemptStatus.CANCELLED
    assert mail.outbox == []
    Notification.objects.filter(pk=result.created[0]).update(
        priority="important", is_for_today=True, created_at=old
    )
    assert tasks.unread_fallback() == 0


def test_every_registered_template_is_clean() -> None:
    """S9-B12: no denylisted term and only declared placeholders, for every event x channel x
    language x variant."""
    for definition in registry.all_events():
        for (channel, _language, _variant), text in definition.templates.items():
            templates.validate(definition, channel, text.subject, text.body)


def test_render_time_content_policy(event: Any) -> None:
    user = UserFactory(preferred_language="en")
    with transaction.atomic():
        result = notify(event.type, Recipients.users(user.pk, audience="patient"), _ctx())
    templates_qs = templates.Template.objects.filter(
        code=event.type, channel="email", language="en"
    )
    templates_qs.update(body="Your HIV test")  # edited behind the API's back
    attempt = DeliveryAttempt.objects.get(notification_id=result.created[0], channel="email")
    DeliveryAttempt.objects.filter(pk=attempt.pk).update(status=AttemptStatus.QUEUED)
    tasks.send_attempt(str(attempt.pk))
    attempt.refresh_from_db()
    assert attempt.failure_reason == "content_policy"
