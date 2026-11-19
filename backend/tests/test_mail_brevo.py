"""Email over Brevo's HTTPS API (decision 2026-11-19): Railway blocks outgoing SMTP below its Pro
plan, so production mail goes as one JSON call per message, with the branded HTML part."""

from __future__ import annotations

import io
import json
import urllib.error
from typing import Any

import pytest
from django.core.mail import EmailMessage, EmailMultiAlternatives

from config.settings.base import brevo_config
from medilink.core import mail as core_mail
from medilink.core.mail import BrandedBrevoBackend, BrevoError, brevo_payload
from medilink.notifications.channels import Message, Target
from medilink.notifications.channels.email import EmailAdapter


class FakeResponse:
    def __enter__(self) -> FakeResponse:
        return self

    def __exit__(self, *exc: object) -> None:
        return None


@pytest.fixture
def calls(monkeypatch: pytest.MonkeyPatch) -> list[Any]:
    sent: list[Any] = []

    def urlopen(request: Any, timeout: float) -> FakeResponse:
        sent.append(request)
        return FakeResponse()

    monkeypatch.setattr(core_mail.urllib.request, "urlopen", urlopen)
    return sent


def _refuse(monkeypatch: pytest.MonkeyPatch, status: int, message: str) -> None:
    def urlopen(request: Any, timeout: float) -> FakeResponse:
        body = io.BytesIO(json.dumps({"code": "x", "message": message}).encode())
        raise urllib.error.HTTPError(request.full_url, status, "refused", {}, body)  # type: ignore[arg-type]

    monkeypatch.setattr(core_mail.urllib.request, "urlopen", urlopen)


def test_brevo_api_key_selects_the_brevo_backend() -> None:
    config = brevo_config("xkeysib-test")["default"]
    assert config["BACKEND"] == "medilink.core.mail.BrandedBrevoBackend"
    assert config["OPTIONS"]["api_key"] == "xkeysib-test"


def test_payload_has_sender_recipients_both_parts_and_language() -> None:
    message = EmailMultiAlternatives(
        subject="Visit reminder",
        body="Plain text",
        from_email="MediLink Rwanda <medilink@gmail.example>",
        to=["Uwase <uwase@example.test>"],
        cc=["cc@example.test"],
        reply_to=["help@example.test"],
        headers={"Content-Language": "rw"},
    )
    message.attach_alternative("<p>HTML</p>", "text/html")
    message.attach("note.txt", "hello", "text/plain")
    payload = brevo_payload(message)
    assert payload["sender"] == {"email": "medilink@gmail.example", "name": "MediLink Rwanda"}
    assert payload["to"] == [{"email": "uwase@example.test", "name": "Uwase"}]
    assert payload["cc"] == [{"email": "cc@example.test"}]
    assert payload["replyTo"] == {"email": "help@example.test"}
    assert payload["textContent"] == "Plain text" and payload["htmlContent"] == "<p>HTML</p>"
    assert payload["headers"] == {"Content-Language": "rw"}
    assert payload["attachment"] == [{"name": "note.txt", "content": "aGVsbG8="}]


def test_bcc_only_messages_still_have_a_to() -> None:
    payload = brevo_payload(EmailMessage(subject="s", body="b", bcc=["a@example.test"]))
    assert payload["to"] == [{"email": "a@example.test"}] and "bcc" not in payload


def test_backend_posts_json_with_the_key_and_brands_plain_messages(calls: list[Any]) -> None:
    backend = BrandedBrevoBackend(api_key="xkeysib-test")
    plain = EmailMultiAlternatives(
        subject="Hello", body="Open https://medilink.example/x", to=["a@example.test"]
    )
    assert backend.send_messages([plain, EmailMessage(subject="none", body="no one")]) == 1
    (request,) = calls
    assert request.full_url == "https://api.brevo.com/v3/smtp/email"
    assert request.get_method() == "POST"
    assert request.get_header("Api-key") == "xkeysib-test"
    body = json.loads(request.data)
    assert body["subject"] == "Hello" and "MediLink" in body["htmlContent"]


def test_brevo_refusal_raises_with_its_reason(monkeypatch: pytest.MonkeyPatch) -> None:
    _refuse(monkeypatch, 400, "Sender not verified")
    backend = BrandedBrevoBackend(api_key="k")
    with pytest.raises(BrevoError, match="400: Sender not verified"):
        backend.send_messages([EmailMessage(subject="s", body="b", to=["a@example.test"])])
    quiet = BrandedBrevoBackend(api_key="k", fail_silently=True)
    assert quiet.send_messages([EmailMessage(subject="s", body="b", to=["a@example.test"])]) == 0


@pytest.mark.parametrize(
    ("status", "retryable"), [(400, False), (401, False), (429, True), (502, True)]
)
def test_notification_email_retries_only_what_can_pass(
    settings: Any, monkeypatch: pytest.MonkeyPatch, status: int, retryable: bool
) -> None:
    settings.MAILERS = brevo_config("k")
    _refuse(monkeypatch, status, "nope")
    message = Message(
        notification_id=1,
        subject="s",
        body="b",
        priority="important",
        language="en",
        url="https://medilink.example/n/1",
        ttl_seconds=60,
        topic="t",
    )
    result = EmailAdapter().send(message, Target(address="a@example.test"))
    assert result.status == "failed" and result.retryable is retryable
