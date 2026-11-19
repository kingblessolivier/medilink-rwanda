"""Project-specific system checks. `check --deploy` runs the deploy ones in CI (B13)."""

from __future__ import annotations

from typing import Any

from django.conf import settings
from django.core.checks import CheckMessage, Error, Tags, Warning, register


@register(Tags.security)
def check_session_audiences(app_configs: Any = None, **kwargs: Any) -> list[CheckMessage]:
    messages: list[CheckMessage] = []
    names = [cfg["COOKIE_NAME"] for cfg in settings.SESSION_AUDIENCES.values()]
    if len(set(names)) != len(names):
        messages.append(
            Error("Each session audience needs its own cookie name.", id="medilink.E001")
        )
    if getattr(settings, "CORS_ALLOW_ALL_ORIGINS", False):
        messages.append(Error("CORS_ALLOW_ALL_ORIGINS must stay False.", id="medilink.E002"))
    if getattr(settings, "DEV_SKIP_STAFF_MFA", False) and not settings.DEBUG:
        messages.append(
            Error("DEV_SKIP_STAFF_MFA is for local development only (DEBUG).", id="medilink.E003")
        )
    return messages


@register(Tags.security, deploy=True)
def check_deploy_cookies(app_configs: Any = None, **kwargs: Any) -> list[CheckMessage]:
    messages: list[CheckMessage] = []
    for audience, cfg in settings.SESSION_AUDIENCES.items():
        if not cfg["COOKIE_NAME"].startswith("__Host-"):
            messages.append(
                Warning(
                    f"The {audience} session cookie should use the __Host- prefix in production.",
                    id="medilink.W001",
                )
            )
    if not settings.CSRF_COOKIE_NAME.startswith("__Host-"):
        messages.append(
            Warning(
                "CSRF_COOKIE_NAME should use the __Host- prefix in production.", id="medilink.W002"
            )
        )
    if not settings.SECURE_CSP:
        messages.append(Warning("SECURE_CSP must be configured.", id="medilink.W003"))
    if settings.CELERY_TASK_ALWAYS_EAGER:
        messages.append(
            Warning("CELERY_TASK_ALWAYS_EAGER must be off in production.", id="medilink.W004")
        )
    return messages


@register(Tags.security, deploy=True)
def check_deploy_bootstrap_url(app_configs: Any = None, **kwargs: Any) -> list[CheckMessage]:
    """The Railway role bootstrap needs the Postgres superuser URL once; left on the running
    service, any code execution in the app gets a role that bypasses RLS."""
    import os

    if os.environ.get("BOOTSTRAP_DATABASE_URL"):
        return [
            Warning(
                "Remove BOOTSTRAP_DATABASE_URL from the service once the database roles exist.",
                id="medilink.W005",
            )
        ]
    return []


@register(Tags.security, deploy=True)
def check_deploy_mfa(app_configs: Any = None, **kwargs: Any) -> list[CheckMessage]:
    if getattr(settings, "DEV_SKIP_STAFF_MFA", False):
        return [
            Error(
                "DEV_SKIP_STAFF_MFA must be off in deployments: staff MFA is mandatory.",
                id="medilink.E004",
            )
        ]
    return []


@register(deploy=True)
def check_deploy_email(app_configs: Any = None, **kwargs: Any) -> list[CheckMessage]:
    """Emails (sign-up links, password resets, invitations) need a real mail server (upgrade 17).
    The development default (Mailpit on 127.0.0.1:1025) silently delivers nowhere in production."""
    mailer = settings.MAILERS.get("default", {})
    if str(mailer.get("BACKEND", "")).endswith("BrevoBackend"):
        return []  # HTTPS API: the sender is checked by Brevo (send_test_email shows its answer)
    options = mailer.get("OPTIONS", {})
    host = str(options.get("host", ""))
    messages: list[CheckMessage] = []
    if host in {"", "localhost", "127.0.0.1", "mailpit"}:
        messages.append(
            Warning(
                "EMAIL_URL points at a local mail catcher: no email reaches anyone. Set "
                "BREVO_API_KEY (Railway blocks outgoing SMTP), or EMAIL_URL where SMTP is allowed.",
                id="medilink.W006",
            )
        )
    sender = str(settings.DEFAULT_FROM_EMAIL).lower()
    if host == "smtp.gmail.com" and str(options.get("username", "")).lower() not in sender:
        messages.append(
            Warning(
                "Gmail sends only from the signed-in address: set DEFAULT_FROM_EMAIL to "
                "'MediLink Rwanda <that address>'.",
                id="medilink.W007",
            )
        )
    return messages
