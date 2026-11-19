"""Notification settings (contract sprint-09 §3.2), read from Django settings so tests can
override them. Push is disabled without VAPID keys (`is_enabled: false`, warning W001)."""

from __future__ import annotations

import datetime as dt
import ipaddress
import json
import os
from typing import Any
from urllib.parse import urlsplit

from django.conf import settings


def _setting(name: str, default: Any = "") -> Any:
    """Django settings first (tests override them), then the environment (.env.example)."""
    if hasattr(settings, name):
        return getattr(settings, name)
    return os.environ.get(name, default)


DEFAULT_ALLOWED_HOSTS = (
    "fcm.googleapis.com",
    "updates.push.services.mozilla.com",
    "*.push.apple.com",
    "*.notify.windows.com",
)
MAX_ENDPOINT_LENGTH = 2048


def vapid_public_key() -> str:
    return str(_setting("WEB_PUSH_VAPID_PUBLIC_KEY") or "")


def vapid_private_key() -> str:
    return str(_setting("WEB_PUSH_VAPID_PRIVATE_KEY") or "")


def vapid_subject() -> str:
    return str(_setting("WEB_PUSH_VAPID_SUBJECT") or "mailto:no-reply@medilink.rw")


def push_enabled() -> bool:
    return bool(vapid_public_key() and vapid_private_key())


FCM_ACCOUNT_KEYS = ("project_id", "client_email", "private_key")


def firebase_service_account() -> dict[str, str] | None:
    """The Firebase service account (FIREBASE_SERVICE_ACCOUNT, the JSON key file's content) that
    sends push to the phone app, or None when unset or unreadable. Never logged."""
    raw = _setting("FIREBASE_SERVICE_ACCOUNT", "")
    if isinstance(raw, dict):
        account = raw
    else:
        try:
            account = json.loads(str(raw or "").strip() or "null")
        except ValueError:
            return None
    if not isinstance(account, dict) or not all(
        isinstance(account.get(k), str) and account.get(k) for k in FCM_ACCOUNT_KEYS
    ):
        return None
    return {k: str(v) for k, v in account.items() if isinstance(v, str)}


def fcm_enabled() -> bool:
    return firebase_service_account() is not None


def allowed_hosts() -> tuple[str, ...]:
    hosts = _setting("WEB_PUSH_ALLOWED_HOSTS", None)
    if isinstance(hosts, str):
        hosts = [h.strip() for h in hosts.split(",") if h.strip()]
    return tuple(hosts) if hosts else DEFAULT_ALLOWED_HOSTS


def push_proxy_url() -> str | None:
    return _setting("WEB_PUSH_PROXY_URL", None) or None


def allow_test_send() -> bool:
    flag = _setting("NOTIFICATIONS_ALLOW_TEST_SEND", False)
    return bool(settings.DEBUG or str(flag).lower() in ("1", "true", "yes"))


def default_quiet_hours() -> tuple[dt.time, dt.time]:
    raw = str(_setting("NOTIFICATIONS_DEFAULT_QUIET_HOURS", "21:00-06:00"))
    start, end = raw.split("-")
    return dt.time.fromisoformat(start.strip()), dt.time.fromisoformat(end.strip())


def host_allowed(host: str, allowlist: tuple[str, ...] | None = None) -> bool:
    host = host.lower().rstrip(".")
    for entry in allowlist or allowed_hosts():
        entry = entry.lower()
        if entry.startswith("*."):
            if host.endswith(entry[1:]) and host != entry[2:]:
                return True
        elif host == entry:
            return True
    return False


def endpoint_host(endpoint: str) -> str | None:
    """The endpoint's host when the URL passes the allowlist (SSRF control), else None.

    https only, no user info, port 443 or none, a DNS name (never an IP literal) that equals an
    allowlisted host or ends with `.` + a `*.` entry, at most 2,048 characters.
    """
    if not isinstance(endpoint, str) or len(endpoint) > MAX_ENDPOINT_LENGTH:
        return None
    try:
        parts = urlsplit(endpoint)
        port = parts.port
    except ValueError:
        return None
    if parts.scheme != "https" or parts.username or parts.password or "@" in parts.netloc:
        return None
    if port not in (None, 443):
        return None
    host = (parts.hostname or "").lower()
    if not host:
        return None
    try:
        ipaddress.ip_address(host)
        return None  # IP literal
    except ValueError:
        pass
    return host if host_allowed(host) else None
