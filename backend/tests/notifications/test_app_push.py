"""Phone app push through Firebase Cloud Messaging: registering the app's token, which
notifications reach the phone, and how FCM's answers are handled."""

from __future__ import annotations

import json
import uuid
from types import SimpleNamespace
from typing import Any
from unittest import mock

import jwt
import pytest
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from django.core.cache import cache
from django.test import override_settings
from rest_framework.test import APIClient

from medilink.notifications import conf
from medilink.notifications.channels import Message, Target, fcm, get
from medilink.notifications.models import PushKind, PushSubscription
from tests.conftest import login_patient
from tests.factories import make_patient_user

pytestmark = pytest.mark.django_db


def _account() -> dict[str, str]:
    key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    pem = key.private_bytes(
        serialization.Encoding.PEM,
        serialization.PrivateFormat.PKCS8,
        serialization.NoEncryption(),
    ).decode()
    return {
        "type": "service_account",
        "project_id": "medilink-test",
        "client_email": "push@medilink-test.iam.gserviceaccount.com",
        "private_key": pem,
    }


ACCOUNT = _account()
FIREBASE = {"FIREBASE_SERVICE_ACCOUNT": json.dumps(ACCOUNT)}
TOKEN = "fGx1:APA91b" + "x" * 40


def _client(user: Any) -> APIClient:
    client = APIClient()
    login_patient(client, user)
    return client


def _message(**kw: Any) -> Message:
    return Message(
        notification_id=uuid.uuid4(),
        subject="Visit confirmed",
        body="Gisozi Clinic, Monday 10:30",
        priority=kw.get("priority", "important"),
        language="en",
        url="https://app.example/dashboard/notifications/1",
        ttl_seconds=3600,
        topic="t" * 32,
        action_path="/dashboard/appointments/7b1c2d3e-0000-4000-8000-000000000000",
    )


def _response(status: int, body: dict[str, Any]) -> mock.Mock:
    return mock.Mock(status_code=status, json=mock.Mock(return_value=body))


@pytest.fixture(autouse=True)
def _no_cached_token() -> Any:
    cache.delete(fcm.CACHE_KEY)
    yield
    cache.delete(fcm.CACHE_KEY)


@pytest.mark.parametrize(
    ("raw", "ok"),
    [
        ("", False),
        ("not json", False),
        (json.dumps({"project_id": "p"}), False),
        (json.dumps(ACCOUNT), True),
    ],
)
def test_service_account_is_read_only_when_complete(raw: str, ok: bool) -> None:
    with override_settings(FIREBASE_SERVICE_ACCOUNT=raw):
        assert (conf.firebase_service_account() is not None) is ok
        assert conf.fcm_enabled() is ok


def test_app_registers_its_token_and_another_account_takes_it_over() -> None:
    patient, other = make_patient_user(), make_patient_user()
    client = _client(patient)
    off = client.post("/api/v1/patient/app-devices/", {"token": TOKEN}, format="json")
    assert off.status_code == 422  # phone push not configured
    with override_settings(**FIREBASE):
        bad = client.post("/api/v1/patient/app-devices/", {"token": "a b"}, format="json")
        assert bad.status_code == 400
        first = client.post("/api/v1/patient/app-devices/", {"token": TOKEN}, format="json")
        assert first.status_code == 201
        assert first.json()["kind"] == "app"
        again = client.post("/api/v1/patient/app-devices/", {"token": TOKEN}, format="json")
        assert again.status_code == 200
        taken = _client(other).post("/api/v1/patient/app-devices/", {"token": TOKEN}, format="json")
        assert taken.status_code == 201
    sub = PushSubscription.objects.get(endpoint=TOKEN)
    assert sub.user_id == other.pk and sub.kind == PushKind.APP and sub.p256dh == ""
    mine = _client(other)
    assert mine.delete(f"/api/v1/patient/push-subscriptions/{sub.pk}/").status_code == 204


def test_phone_gets_every_push_except_the_reminders_it_schedules_itself() -> None:
    patient = make_patient_user()
    app = PushSubscription.objects.create(
        user=patient, kind=PushKind.APP, endpoint=TOKEN, endpoint_host="fcm.googleapis.com"
    )
    adapter = get("web_push")
    assert adapter is not None

    def targets(event_type: str) -> list[Any]:
        n = SimpleNamespace(recipient_user_id=patient.pk, event_type=event_type)
        return [t.subscription_id for t in adapter.targets(n)]

    assert targets("scheduling.booking.confirmed") == []  # Firebase not configured
    with override_settings(**FIREBASE):
        assert adapter.is_enabled()
        assert targets("scheduling.booking.confirmed") == [app.pk]
        for reminder in sorted(fcm_scheduled()):
            assert targets(reminder) == [], reminder


def fcm_scheduled() -> frozenset[str]:
    from medilink.notifications.channels.web_push import PHONE_SCHEDULED

    return PHONE_SCHEDULED


def test_message_carries_texts_link_and_android_settings() -> None:
    body = fcm.fcm_message(_message(priority="routine"), TOKEN)["message"]
    assert body["token"] == TOKEN
    assert body["notification"] == {
        "title": "Visit confirmed",
        "body": "Gisozi Clinic, Monday 10:30",
    }
    assert body["data"]["action_path"].startswith("/dashboard/appointments/")
    assert body["android"]["priority"] == "NORMAL" and body["android"]["ttl"] == "3600s"
    assert body["android"]["notification"]["channel_id"] == fcm.CHANNEL_ID


@override_settings(**FIREBASE)
def test_send_signs_in_once_and_posts_to_the_project() -> None:
    token_reply = _response(200, {"access_token": "ya29.test", "expires_in": 3600})
    sent = _response(200, {"name": "projects/medilink-test/messages/0:123"})
    with mock.patch.object(fcm.requests, "post", side_effect=[token_reply, sent, sent]) as post:
        assert fcm.send(_message(), TOKEN).status == "sent"
        result = fcm.send(_message(), TOKEN)
    assert result.provider_message_id == "0:123"
    assert post.call_count == 3  # one token exchange, then the cached token
    assertion = post.call_args_list[0].kwargs["data"]["assertion"]
    claims = jwt.decode(assertion, options={"verify_signature": False})
    assert claims["iss"] == ACCOUNT["client_email"] and claims["scope"] == fcm.SCOPE
    url = post.call_args_list[1].args[0]
    assert url == "https://fcm.googleapis.com/v1/projects/medilink-test/messages:send"
    assert post.call_args_list[1].kwargs["headers"]["Authorization"] == "Bearer ya29.test"


@override_settings(**FIREBASE)
@pytest.mark.parametrize(
    ("status", "body", "gone", "retry"),
    [
        (404, {"error": {"status": "NOT_FOUND"}}, True, False),
        (
            400,
            {"error": {"details": [{"errorCode": "UNREGISTERED"}]}},
            True,
            False,
        ),
        (400, {"error": {"status": "INVALID_ARGUMENT"}}, False, False),
        (401, {}, False, True),
        (429, {}, False, True),
        (503, {}, False, True),
    ],
)
def test_send_failures(status: int, body: dict[str, Any], gone: bool, retry: bool) -> None:
    cache.set(fcm.CACHE_KEY, "ya29.cached", 600)
    with mock.patch.object(fcm.requests, "post", return_value=_response(status, body)):
        result = fcm.send(_message(), TOKEN)
    assert result.status == "failed"
    assert result.revoke_target is gone and result.retryable is retry
    if status == 401:
        assert cache.get(fcm.CACHE_KEY) is None


@override_settings(**FIREBASE)
def test_refused_service_account_is_not_retried() -> None:
    with mock.patch.object(fcm.requests, "post", return_value=_response(400, {})):
        result = fcm.send(_message(), TOKEN)
    assert result.status == "failed" and not result.retryable and not result.revoke_target


@override_settings(**FIREBASE)
def test_adapter_sends_app_subscriptions_through_fcm() -> None:
    patient = make_patient_user()
    app = PushSubscription.objects.create(
        user=patient, kind=PushKind.APP, endpoint=TOKEN, endpoint_host="fcm.googleapis.com"
    )
    adapter = get("web_push")
    assert adapter is not None
    with mock.patch.object(fcm, "send", return_value=mock.Mock(status="sent")) as send:
        adapter.send(_message(), Target(address=TOKEN, subscription_id=app.pk))
    assert send.call_args.args[1] == TOKEN
