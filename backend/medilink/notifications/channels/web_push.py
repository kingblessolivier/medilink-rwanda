"""Web push (contract sprint-09 §3.2): payload encrypted (aes128gcm, RFC 8291) and VAPID-signed
(RFC 8292) by pywebpush; endpoint host re-checked against the allowlist before every send;
redirects not followed; 404/410 revokes the subscription. Keys and endpoints are never logged.

The same channel reaches the phone app: an `app` subscription holds the app's FCM token and is
sent through Firebase Cloud Messaging (channels/fcm.py), with the same texts and preferences."""

from __future__ import annotations

import hashlib
import json
import logging
from typing import Any, ClassVar

import requests

from medilink.notifications import conf
from medilink.notifications.channels import Message, SendResult, Target
from medilink.notifications.templates import LIMITS, TextLimits

logger = logging.getLogger(__name__)

MAX_PAYLOAD = 3 * 1024
URGENCY = {"critical": "high", "important": "normal", "routine": "low"}
# The app schedules these on the phone itself (mobile/lib/data/reminders.dart), offline too; a
# push for them would ring twice.
PHONE_SCHEDULED = frozenset(
    {"scheduling.booking.reminder", "scheduling.booking.soon", "scheduling.booking.now"}
)


def payload(message: Message) -> bytes:
    body = {
        "v": 1,
        "id": str(message.notification_id),
        "title": message.subject,
        "body": message.body,
        "url": message.url,
        "tag": message.topic,
        "priority": message.priority,
    }
    data = json.dumps(body, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
    if len(data) > MAX_PAYLOAD:  # templates are limited to 60/160 chars; this is a backstop
        body["body"] = message.body[:80]
        data = json.dumps(body, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
    return data


def topic(dedupe_key: str) -> str:
    """Push `Topic` header: ≤ 32 URL-safe characters, so a device keeps one copy per item."""
    return hashlib.sha256(dedupe_key.encode("utf-8")).hexdigest()[:32]


class _NoRedirectSession(requests.Session):
    def __init__(self) -> None:
        super().__init__()
        self.max_redirects = 0
        proxy = conf.push_proxy_url()
        if proxy:
            self.proxies = {"https": proxy}


class WebPushAdapter:
    channel: ClassVar[str] = "web_push"
    interrupts: ClassVar[bool] = True
    limits: ClassVar[TextLimits] = LIMITS["web_push"]

    def is_enabled(self) -> bool:
        return conf.push_enabled() or conf.fcm_enabled()

    def targets(self, notification: Any) -> list[Target]:
        from medilink.notifications.models import PushKind, PushSubscription

        kinds = []
        if conf.push_enabled():
            kinds.append(PushKind.WEB)
        if conf.fcm_enabled() and notification.event_type not in PHONE_SCHEDULED:
            kinds.append(PushKind.APP)
        if not kinds:
            return []
        return [
            Target(address=sub.endpoint, subscription_id=sub.pk)
            for sub in PushSubscription.objects.filter(
                user_id=notification.recipient_user_id, revoked_at__isnull=True, kind__in=kinds
            ).order_by("created_at")
        ]

    def send(self, message: Message, target: Target) -> SendResult:
        from pywebpush import WebPushException, webpush

        from medilink.notifications.channels import fcm
        from medilink.notifications.models import PushKind, PushSubscription

        sub = PushSubscription.objects.filter(pk=target.subscription_id).first()
        if sub is None or sub.revoked_at is not None:
            return SendResult(status="failed", failure_reason="no_target")
        if sub.kind == PushKind.APP:
            return fcm.send(message, sub.endpoint)
        if conf.endpoint_host(sub.endpoint) is None:  # host changed in the database
            return SendResult(status="failed", failure_reason="no_target", revoke_target=True)
        try:
            webpush(
                subscription_info={
                    "endpoint": sub.endpoint,
                    "keys": {"p256dh": sub.p256dh, "auth": sub.auth_secret},
                },
                data=payload(message),
                vapid_private_key=conf.vapid_private_key(),
                vapid_claims={"sub": conf.vapid_subject()},
                content_encoding="aes128gcm",
                ttl=max(0, min(message.ttl_seconds, 86_400)),
                headers={
                    "Urgency": URGENCY.get(message.priority, "normal"),
                    "Topic": message.topic,
                },
                timeout=10,
                requests_session=_NoRedirectSession(),
            )
        except WebPushException as exc:
            status = getattr(exc.response, "status_code", None)
            if status in (404, 410):
                return SendResult(status="failed", failure_reason="push_gone", revoke_target=True)
            retryable = status is None or status == 429 or status >= 500
            return SendResult(status="failed", retryable=retryable, failure_reason="provider_error")
        except requests.Timeout:
            return SendResult(status="failed", retryable=True, failure_reason="timeout")
        except requests.TooManyRedirects:
            return SendResult(status="failed", failure_reason="provider_error")
        except requests.RequestException:
            return SendResult(status="failed", retryable=True, failure_reason="provider_error")
        return SendResult(status="sent")
