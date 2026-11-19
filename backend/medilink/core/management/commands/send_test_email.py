"""manage.py send_test_email <address> [--language rw|en|fr]: check the mail settings (upgrade 17).

Sends one branded email straight away (no Celery) and reports the SMTP error if it fails, e.g.
on Railway after setting EMAIL_URL for Gmail:  railway run python manage.py send_test_email me@x
"""

from __future__ import annotations

import smtplib
from typing import Any

from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.management.base import BaseCommand, CommandError, CommandParser
from django.core.validators import validate_email

from medilink.core.mail import BrevoError, send_branded

TEXT = {
    "en": (
        "MediLink email test",
        "This is a test from MediLink Rwanda. If you can read it, emails work.\n\n{url}",
    ),
    "fr": (
        "Test d'e-mail MediLink",
        "Ceci est un test de MediLink Rwanda. Si vous le lisez, les e-mails fonctionnent.\n\n{url}",
    ),
    "rw": (
        "Igerageza rya imeyili ya MediLink",
        "Iyi ni imeyili yo kugerageza ya MediLink Rwanda. Niba uyisoma, imeyili zirakora.\n\n{url}",
    ),
}


class Command(BaseCommand):
    help = "Send one branded test email to check EMAIL_URL and DEFAULT_FROM_EMAIL."

    def add_arguments(self, parser: CommandParser) -> None:
        parser.add_argument("address")
        parser.add_argument("--language", choices=sorted(TEXT), default="en")

    def handle(self, *args: Any, **options: Any) -> None:
        address = options["address"].strip()
        try:
            validate_email(address)
        except ValidationError as exc:
            raise CommandError("Give a valid email address.") from exc
        subject, body = TEXT[options["language"]]
        mailer = settings.MAILERS.get("default", {})
        host = (
            "Brevo (HTTPS)"
            if str(mailer.get("BACKEND", "")).endswith("BrevoBackend")
            else mailer.get("OPTIONS", {}).get("host", "?")
        )
        self.stdout.write(f"Sending through {host} as {settings.DEFAULT_FROM_EMAIL} ...")
        try:
            send_branded(
                subject=subject,
                text=body.format(url=str(settings.PATIENT_APP_URL).rstrip("/")),
                to=[address],
                language=options["language"],
            )
        except smtplib.SMTPAuthenticationError as exc:
            raise CommandError(
                "The mail server refused the login. For Gmail use a 16-letter app password "
                "(Google account > Security > 2-Step Verification > App passwords), not the "
                "normal password, and write @ in the address as %40 in EMAIL_URL."
            ) from exc
        except BrevoError as exc:
            raise CommandError(
                f"{exc}. Check BREVO_API_KEY, and that DEFAULT_FROM_EMAIL is a sender verified "
                "in Brevo (Senders, domains & IPs)."
            ) from exc
        except (smtplib.SMTPException, OSError) as exc:
            raise CommandError(f"Sending failed: {type(exc).__name__}: {exc}") from exc
        self.stdout.write(self.style.SUCCESS(f"Sent to {address}. Check the inbox (and spam)."))
