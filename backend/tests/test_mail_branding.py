"""Branded emails (upgrade 17): one layout for every email, in the reader's language, escaped,
no tracking (the only image is the website's fixed logo), and the HTML part added to plain
`send_mail()` messages too."""

from __future__ import annotations

from typing import Any

import pytest
from django.core import mail
from django.core.mail import EmailMultiAlternatives, send_mail
from django.core.mail.backends.locmem import EmailBackend as LocmemBackend
from django.core.management import call_command

from medilink.accounts.tasks import TEXTS, send_password_reset_email
from medilink.core.mail import BrandingMixin, brand_html, send_branded
from tests.factories import UserFactory

pytestmark = pytest.mark.django_db


def _html(message: Any) -> str:
    return next(alt[0] for alt in message.alternatives if alt[1] == "text/html")


def test_layout_escapes_and_turns_the_link_line_into_a_button() -> None:
    html = brand_html(
        "Hello <b>",
        "Line <script>x</script>\n\nOpen:\nhttps://medilink.example/reset?a=1&b=2\n\n"
        "More at https://medilink.example/help.",
        "fr",
        action="Choisir",
    )
    assert '<html lang="fr">' in html
    assert "<script>" not in html and "&lt;script&gt;" in html and "Hello &lt;b&gt;" in html
    assert 'href="https://medilink.example/reset?a=1&amp;b=2"' in html and ">Choisir</a>" in html
    # the inline link keeps its sentence and loses the full stop
    assert 'href="https://medilink.example/help"' in html
    assert "<img" not in html and "Merci de ne pas y répondre" in html


def test_logo_footer_links_and_preview_come_from_the_website(settings: Any) -> None:
    settings.PATIENT_APP_URL = "https://medilink.example/"
    html = brand_html("Booking confirmed", "A visit is booked.\n\nhttps://medilink.example/b", "rw")
    logo = '<img src="https://medilink.example/brand/medilink-logo-horizontal-white-120.png"'
    assert logo in html and 'alt="MediLink Rwanda"' in html
    assert 'href="https://medilink.example/find-care"' in html and ">Shaka ubuvuzi</a>" in html
    assert 'href="tel:912"' in html and "Kigali, Rwanda" in html
    # the inbox preview is the first sentence, hidden in the body
    assert "display:none" in html and "A visit is booked." in html.split("</div>")[0]
    settings.EMAIL_LOGO_URL = "http://not-https.example/logo.png"
    assert "<img" not in brand_html("S", "Body", "en")  # never a plain-http image


def test_send_branded_sends_text_and_html_in_the_language() -> None:
    send_branded(subject="S", text="Body\n\nhttps://x.example/a", to=["a@x.example"], language="rw")
    message = mail.outbox[-1]
    assert message.body.startswith("Body") and message.extra_headers["Content-Language"] == "rw"
    assert 'lang="rw"' in _html(message) and ">Fungura</a>" in _html(message)


def test_account_emails_follow_the_account_language(
    django_capture_on_commit_callbacks: Any,
) -> None:
    for lang in ("rw", "en", "fr"):
        user = UserFactory(preferred_language=lang)
        send_password_reset_email(str(user.pk))
        message = mail.outbox[-1]
        assert message.subject == TEXTS["reset"][lang][0]
        assert "/reset-password?uid=" in message.body
        assert f'lang="{lang}"' in _html(message)


class _BrandedLocmem(BrandingMixin, LocmemBackend):
    pass


def test_plain_send_mail_messages_get_the_html_part(settings: Any) -> None:
    settings.MAILERS = {"default": {"BACKEND": f"{__name__}._BrandedLocmem"}}
    send_mail("Invitation", "Join here:\nhttps://x.example/invite/1", None, ["b@x.example"])
    message = mail.outbox[-1]
    assert isinstance(message, EmailMultiAlternatives)
    assert 'href="https://x.example/invite/1"' in _html(message) and 'lang="en"' in _html(message)


def test_test_email_command(capsys: Any) -> None:
    call_command("send_test_email", "c@x.example", "--language", "fr")
    assert mail.outbox[-1].subject == "Test d'e-mail MediLink"
    assert "Sent to c@x.example" in capsys.readouterr().out
