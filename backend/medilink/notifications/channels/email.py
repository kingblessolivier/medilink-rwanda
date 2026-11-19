"""Email (contract sprint-09 §3.2): Django mail (Mailpit in dev), plain text + autoescaped HTML in
the recipient's language, a link to the right app's /notifications/<id>; no attachments, no
tracking pixels (security 02 §4)."""

from __future__ import annotations

import logging
import smtplib
from typing import Any, ClassVar

from django.core.mail import EmailMultiAlternatives

from medilink.core.mail import LANGUAGE_HEADER, BrevoError, brand_html
from medilink.notifications.channels import Message, SendResult, Target
from medilink.notifications.templates import LIMITS, TextLimits

logger = logging.getLogger(__name__)

FOOTER = {
    "rw": "Fungura ubutumwa kuri MediLink",
    "en": "Open the message in MediLink",
    "fr": "Ouvrir le message dans MediLink",
}
BUTTON = {"rw": "Fungura ubutumwa", "en": "Open the message", "fr": "Ouvrir le message"}


class EmailAdapter:
    channel: ClassVar[str] = "email"
    interrupts: ClassVar[bool] = True
    limits: ClassVar[TextLimits] = LIMITS["email"]

    def is_enabled(self) -> bool:
        return True

    def targets(self, notification: Any) -> list[Target]:
        email = getattr(notification.recipient_user, "email", "")
        return [Target(address=email)] if email else []

    def send(self, message: Message, target: Target) -> SendResult:
        footer = FOOTER.get(message.language, FOOTER["en"])
        text = f"{message.body}\n\n{footer}: {message.url}\n"
        # the branded layout (upgrade 17); the link on its own line becomes the button
        html = brand_html(
            message.subject,
            f"{message.body}\n\n{message.url}",
            message.language,
            action=BUTTON.get(message.language, BUTTON["en"]),
        )
        mail = EmailMultiAlternatives(
            subject=message.subject,
            body=text,
            to=[target.address],
            headers={LANGUAGE_HEADER: message.language},
        )
        mail.attach_alternative(html, "text/html")
        try:
            mail.send()
        except (smtplib.SMTPServerDisconnected, smtplib.SMTPConnectError, TimeoutError):
            return SendResult(status="failed", retryable=True, failure_reason="timeout")
        except smtplib.SMTPResponseException as exc:
            retryable = 400 <= exc.smtp_code < 500
            return SendResult(status="failed", retryable=retryable, failure_reason="provider_error")
        except BrevoError as exc:
            # 429 and 5xx pass; other 4xx (bad key, unverified sender, bad address) won't
            retryable = exc.status == 429 or exc.status >= 500
            return SendResult(status="failed", retryable=retryable, failure_reason="provider_error")
        except (smtplib.SMTPException, OSError):
            return SendResult(status="failed", retryable=True, failure_reason="provider_error")
        return SendResult(status="sent")
