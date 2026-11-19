"""Push to the phone app through Firebase Cloud Messaging (HTTP v1 API).

The service account (FIREBASE_SERVICE_ACCOUNT) signs a short JWT (RS256) that Google exchanges
for an access token (one hour, cached). Each send carries the same title and body as web push
(templates allow no clinical detail) plus the notification id and its app link. Tokens, keys and
texts are never logged."""

from __future__ import annotations

import contextlib
import logging
import time
from typing import Any

import jwt
import requests
from django.core.cache import cache

from medilink.notifications import conf
from medilink.notifications.channels import Message, SendResult

logger = logging.getLogger(__name__)

TOKEN_URL = "https://oauth2.googleapis.com/token"  # noqa: S105 (a URL, not a password)
SEND_URL = "https://fcm.googleapis.com/v1/projects/{project}/messages:send"
SCOPE = "https://www.googleapis.com/auth/firebase.messaging"
CHANNEL_ID = "medilink_alerts"  # the app creates this Android channel (mobile/lib/data/push.dart)
CACHE_KEY = "notifications:fcm:access-token"
PRIORITY = {"critical": "HIGH", "important": "HIGH", "routine": "NORMAL"}
GONE_CODES = frozenset({"UNREGISTERED", "NOT_FOUND"})
MAX_TOKEN_LENGTH = 4096


class FcmAuthError(Exception):
    """Google refused the service account (wrong or revoked key)."""


def access_token(account: dict[str, str]) -> str:
    cached = cache.get(CACHE_KEY)
    if isinstance(cached, str) and cached:
        return cached
    now = int(time.time())
    assertion = jwt.encode(
        {
            "iss": account["client_email"],
            "scope": SCOPE,
            "aud": account.get("token_uri") or TOKEN_URL,
            "iat": now,
            "exp": now + 3600,
        },
        account["private_key"],
        algorithm="RS256",
    )
    response = requests.post(
        TOKEN_URL,
        data={"grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer", "assertion": assertion},
        timeout=10,
        allow_redirects=False,
    )
    if response.status_code != 200:
        raise FcmAuthError(str(response.status_code))
    body = response.json()
    token = str(body.get("access_token") or "")
    if not token:
        raise FcmAuthError("no access_token")
    ttl = max(60, int(body.get("expires_in") or 3600) - 300)
    cache.set(CACHE_KEY, token, ttl)
    return token


def fcm_message(message: Message, token: str) -> dict[str, Any]:
    ttl = max(0, min(message.ttl_seconds, 86_400))
    return {
        "message": {
            "token": token,
            "notification": {"title": message.subject, "body": message.body},
            "data": {
                "id": str(message.notification_id),
                "action_path": message.action_path,
                "priority": message.priority,
            },
            "android": {
                "priority": PRIORITY.get(message.priority, "NORMAL"),
                "ttl": f"{ttl}s",
                "collapse_key": message.topic,
                "notification": {"channel_id": CHANNEL_ID, "tag": message.topic},
            },
        }
    }


def _error_code(response: requests.Response) -> str:
    try:
        error = response.json().get("error") or {}
    except ValueError:
        return ""
    for detail in error.get("details") or []:
        if isinstance(detail, dict) and detail.get("errorCode"):
            return str(detail["errorCode"])
    return str(error.get("status") or "")


def send(message: Message, token: str) -> SendResult:
    account = conf.firebase_service_account()
    if account is None:
        return SendResult(status="failed", failure_reason="no_target")
    if not token or len(token) > MAX_TOKEN_LENGTH:
        return SendResult(status="failed", failure_reason="push_gone", revoke_target=True)
    try:
        bearer = access_token(account)
        response = requests.post(
            SEND_URL.format(project=account["project_id"]),
            json=fcm_message(message, token),
            headers={"Authorization": f"Bearer {bearer}"},
            timeout=10,
            allow_redirects=False,
        )
    except FcmAuthError:
        logger.warning("notifications.fcm_auth_failed")
        return SendResult(status="failed", failure_reason="provider_error")
    except requests.Timeout:
        return SendResult(status="failed", retryable=True, failure_reason="timeout")
    except requests.RequestException:
        return SendResult(status="failed", retryable=True, failure_reason="provider_error")
    status = response.status_code
    if status == 200:
        name = ""
        with contextlib.suppress(ValueError):
            name = str(response.json().get("name") or "")
        return SendResult(status="sent", provider_message_id=name.rsplit("/", 1)[-1] or None)
    code = _error_code(response)
    if status == 404 or code in GONE_CODES:
        return SendResult(status="failed", failure_reason="push_gone", revoke_target=True)
    if status == 401:
        cache.delete(CACHE_KEY)  # an expired access token: the retry signs a new one
        return SendResult(status="failed", retryable=True, failure_reason="provider_error")
    retryable = status == 429 or status >= 500
    logger.warning("notifications.fcm_failed", extra={"status": status, "code": code})
    return SendResult(status="failed", retryable=retryable, failure_reason="provider_error")
