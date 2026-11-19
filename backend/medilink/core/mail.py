"""MediLink emails: one branded layout for every message (upgrade 17).

Every email has a plain-text body (what the code writes) and a branded HTML version made from it:
the MediLink name on a forest band, the text in short paragraphs, the first link as an emerald
button, other links as plain links, and a footer in the reader's language. Table layout and inline
styles only, so Gmail, Outlook and phone mail apps show it the same; no images, scripts, tracking
pixels or remote fonts (security 02 §4), and every value is escaped.

- `send_branded()` builds and sends a message with both parts (account emails).
- `brand_html()` turns any plain text into the HTML part (the notification channel uses it).
- `BrandedSMTPBackend` adds the HTML part to any plain-only message on the way out, so emails
  written with Django's `send_mail()` (staff invitations, licence reminders, applications) get the
  same look without each sender changing.
- `BrandedBrevoBackend` does the same and sends over Brevo's HTTPS API (production on Railway,
  where outgoing SMTP is blocked).
"""

from __future__ import annotations

import base64
import json
import logging
import re
import urllib.error
import urllib.request
from collections.abc import Iterable, Sequence
from email.utils import parseaddr
from html import escape
from typing import Any

from django.conf import settings
from django.core.mail import EmailMessage, EmailMultiAlternatives
from django.core.mail.backends.base import BaseEmailBackend
from django.core.mail.backends.smtp import EmailBackend as SMTPBackend

logger = logging.getLogger("medilink.mail")

FOREST = "#123d2b"
EMERALD = "#168451"
INK = "#17231d"
MUTED = "#5d6a62"
PAGE = "#f7f9f7"
LINE = "#e1e8e3"

LANGUAGE_HEADER = "Content-Language"
FOOTER = {
    "rw": "Iyi imeyili yoherejwe na MediLink Rwanda. Ntusubize kuri iyi imeyili.",
    "en": "This email was sent by MediLink Rwanda. Please don't reply to it.",
    "fr": "Cet e-mail a été envoyé par MediLink Rwanda. Merci de ne pas y répondre.",
}
BUTTON = {"rw": "Fungura", "en": "Open", "fr": "Ouvrir"}

_URL = re.compile(r"https?://[^\s<>\"']+")


def _language(value: str | None) -> str:
    code = (value or "").split("-")[0].lower()
    return code if code in FOOTER else "en"


def _linkify(line: str) -> str:
    """Escape a line and turn its URLs into links (the link text is the URL itself)."""
    out, last = [], 0
    for match in _URL.finditer(line):
        url = match.group(0).rstrip(".,;:)")
        end = match.start() + len(url)
        out.append(escape(line[last : match.start()]))
        out.append(
            f'<a href="{escape(url)}" style="color:{EMERALD};word-break:break-all">'
            f"{escape(url)}</a>"
        )
        last = end
    out.append(escape(line[last:]))
    return "".join(out)


def _button(url: str, label: str) -> str:
    return (
        '<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 20px">'
        f'<tr><td style="border-radius:10px;background:{EMERALD}">'
        f'<a href="{escape(url)}" style="display:inline-block;padding:12px 22px;color:#ffffff;'
        f'font-weight:600;text-decoration:none;border-radius:10px">{escape(label)}</a>'
        "</td></tr></table>"
    )


def brand_html(subject: str, text: str, language: str | None = "en", *, action: str = "") -> str:
    """The HTML part for a plain-text email. A line that is only a URL becomes the button
    (the first one; `action` is its label, default "Open"); other URLs stay inline links."""
    lang = _language(language)
    label = action or BUTTON[lang]
    blocks: list[str] = []
    button_used = False
    for paragraph in re.split(r"\n\s*\n", text.strip()):
        lines = [line.rstrip() for line in paragraph.splitlines() if line.strip()]
        rendered: list[str] = []
        for line in lines:
            only_url = _URL.fullmatch(line.strip())
            if only_url and not button_used:
                if rendered:
                    blocks.append(_paragraph(rendered))
                    rendered = []
                blocks.append(_button(line.strip(), label))
                button_used = True
            else:
                rendered.append(_linkify(line))
        if rendered:
            blocks.append(_paragraph(rendered))
    body = "".join(blocks)
    return (
        "<!doctype html>"
        f'<html lang="{lang}"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1">'
        f"<title>{escape(subject)}</title></head>"
        f'<body style="margin:0;padding:0;background:{PAGE}">'
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" '
        f'style="background:{PAGE}"><tr><td align="center" style="padding:24px 12px">'
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" '
        'style="max-width:560px;border-collapse:separate">'
        f'<tr><td style="background:{FOREST};border-radius:16px 16px 0 0;padding:20px 28px;'
        "font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#ffffff;font-size:18px;"
        'font-weight:700;letter-spacing:.2px">MediLink '
        '<span style="font-weight:400;opacity:.75">Rwanda</span></td></tr>'
        f'<tr><td style="background:#ffffff;border:1px solid {LINE};border-top:0;'
        "border-radius:0 0 16px 16px;padding:28px;font-family:Segoe UI,Roboto,Helvetica,Arial,"
        f'sans-serif;color:{INK};font-size:15px;line-height:1.6">'
        f'<h1 style="margin:0 0 16px;font-size:20px;line-height:1.3;color:{INK}">'
        f"{escape(subject)}</h1>{body}</td></tr>"
        f'<tr><td style="padding:16px 8px;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;'
        f'color:{MUTED};font-size:12px;line-height:1.5;text-align:center">'
        f"{escape(FOOTER[lang])}</td></tr>"
        "</table></td></tr></table></body></html>"
    )


def _paragraph(lines: list[str]) -> str:
    return f'<p style="margin:0 0 14px">{"<br>".join(lines)}</p>'


def send_branded(
    *,
    subject: str,
    text: str,
    to: Sequence[str],
    language: str | None,
    action: str = "",
) -> int:
    """Send one email with its plain-text and branded HTML parts."""
    lang = _language(language)
    mail = EmailMultiAlternatives(
        subject=subject, body=text, to=list(to), headers={LANGUAGE_HEADER: lang}
    )
    mail.attach_alternative(brand_html(subject, text, lang, action=action), "text/html")
    return mail.send()


def _has_html(message: EmailMessage) -> bool:
    alternatives: Iterable[Any] = getattr(message, "alternatives", None) or []
    for alternative in alternatives:
        mimetype = getattr(alternative, "mimetype", None)
        if mimetype is None and isinstance(alternative, tuple):
            mimetype = alternative[1]
        if mimetype == "text/html":
            return True
    return getattr(message, "content_subtype", "plain") == "html"


def add_branding(message: EmailMessage) -> None:
    """Give a plain-only message the branded HTML part (in place)."""
    if _has_html(message) or not isinstance(message, EmailMultiAlternatives):
        return
    language = (message.extra_headers or {}).get(LANGUAGE_HEADER)
    html = brand_html(str(message.subject), str(message.body), language)
    message.attach_alternative(html, "text/html")


class BrandingMixin:
    def send_messages(self, email_messages: Sequence[EmailMessage]) -> int:
        for message in email_messages or []:
            add_branding(message)
        return super().send_messages(email_messages)  # type: ignore[misc]


class BrandedSMTPBackend(BrandingMixin, SMTPBackend):
    """Django's SMTP backend that adds the branded HTML part to plain-only messages."""


# --------------------------------------------------------------------------------------------
# Brevo: email over HTTPS. Railway blocks outgoing SMTP below its Pro plan, so Gmail over SMTP
# never connects there; Brevo's API is plain HTTPS (decision 2026-11-19).
# https://developers.brevo.com/reference/sendtransacemail
# --------------------------------------------------------------------------------------------
BREVO_URL = "https://api.brevo.com/v3/smtp/email"
# Headers Brevo builds itself; passing them as custom headers is refused or ignored.
_BREVO_OWN_HEADERS = {"from", "to", "cc", "bcc", "reply-to", "subject", "content-type"}


class BrevoError(Exception):
    """Brevo refused a message: `status` is the HTTP status, the text is Brevo's reason."""

    def __init__(self, status: int, reason: str) -> None:
        super().__init__(f"Brevo answered {status}: {reason}")
        self.status = status


def _contact(address: str) -> dict[str, str]:
    name, email = parseaddr(address)
    return {"email": email, "name": name} if name else {"email": email}


def _attachment(item: Any) -> dict[str, str] | None:
    """A Django attachment as Brevo wants it (name + base64 content); MIME parts are skipped."""
    if not isinstance(item, tuple) or len(item) < 2:
        return None
    filename, content = item[0], item[1]
    raw = content.encode() if isinstance(content, str) else bytes(content)
    return {"name": str(filename or "attachment"), "content": base64.b64encode(raw).decode()}


def brevo_payload(message: EmailMessage) -> dict[str, Any]:
    """The JSON body of Brevo's "send a transactional email" call for one Django message."""
    sender = message.from_email or str(settings.DEFAULT_FROM_EMAIL)
    to, bcc = list(message.to), list(message.bcc)
    if not to:  # Brevo needs at least one "to"
        to, bcc = bcc, []
    payload: dict[str, Any] = {
        "sender": _contact(sender),
        "to": [_contact(a) for a in to],
        "subject": str(message.subject),
    }
    if message.cc:
        payload["cc"] = [_contact(a) for a in message.cc]
    if bcc:
        payload["bcc"] = [_contact(a) for a in bcc]
    if message.reply_to:
        payload["replyTo"] = _contact(message.reply_to[0])
    if getattr(message, "content_subtype", "plain") == "html":
        payload["htmlContent"] = str(message.body)
    else:
        payload["textContent"] = str(message.body)
    for alternative in getattr(message, "alternatives", None) or []:
        content, mimetype = (
            (alternative.content, alternative.mimetype)
            if hasattr(alternative, "mimetype")
            else (alternative[0], alternative[1])
        )
        if mimetype == "text/html":
            payload["htmlContent"] = str(content)
    headers = {
        k: str(v)
        for k, v in (message.extra_headers or {}).items()
        if k.lower() not in _BREVO_OWN_HEADERS
    }
    if headers:
        payload["headers"] = headers
    attachments = [a for a in map(_attachment, message.attachments or []) if a]
    if attachments:
        payload["attachment"] = attachments
    return payload


class BrevoBackend(BaseEmailBackend):
    """Sends each message with one HTTPS call to Brevo (standard library only, no SDK)."""

    def __init__(
        self, api_key: str = "", timeout: float = 10, fail_silently: bool = False, **kwargs: Any
    ) -> None:
        # Django 6.1: the backend keeps fail_silently itself (like the SMTP backend)
        super().__init__(**kwargs)
        self.fail_silently = fail_silently
        self.api_key = api_key
        self.timeout = timeout

    def _post(self, payload: dict[str, Any]) -> None:
        request = urllib.request.Request(
            BREVO_URL,
            data=json.dumps(payload).encode(),
            method="POST",
            headers={
                "api-key": self.api_key,
                "accept": "application/json",
                "content-type": "application/json",
            },
        )
        try:
            with urllib.request.urlopen(request, timeout=self.timeout):  # noqa: S310
                return
        except urllib.error.HTTPError as exc:
            # Brevo's error body says why (unverified sender, bad key, ...); it holds no secrets.
            try:
                reason = json.loads(exc.read() or b"{}").get("message") or exc.reason
            except ValueError:
                reason = exc.reason
            raise BrevoError(exc.code, str(reason)) from exc

    def send_messages(self, email_messages: Sequence[EmailMessage]) -> int:
        sent = 0
        for message in email_messages or []:
            if not message.recipients():
                continue
            try:
                self._post(brevo_payload(message))
            except (BrevoError, OSError):
                logger.warning("email.brevo_failed", exc_info=True)
                if not self.fail_silently:
                    raise
                continue
            sent += 1
        return sent


class BrandedBrevoBackend(BrandingMixin, BrevoBackend):
    """The Brevo backend that adds the branded HTML part to plain-only messages."""
