"""Notification jobs (contract sprint-09 §5). JSON arguments (IDs only), time limits, acks_late,
no result backend. Logs carry IDs, channel, status and failure code, never text or addresses."""

from __future__ import annotations

import datetime as dt
import logging
import random
from typing import Any

from celery import shared_task
from django.conf import settings
from django.db import transaction
from django.db.models import Q
from django.utils import timezone

from medilink.notifications import channels, content_policy, registry, templates
from medilink.notifications.channels import Message, Target
from medilink.notifications.channels.web_push import topic
from medilink.notifications.models import (
    AttemptStatus,
    DeliveryAttempt,
    FailureReason,
    Notification,
    Priority,
    PushSubscription,
    RevokedReason,
)

logger = logging.getLogger("medilink.notifications")

MAX_ATTEMPTS = 4
BACKOFF = {
    Priority.CRITICAL: (10, 30, 90),
    Priority.IMPORTANT: (60, 300, 900),
    Priority.ROUTINE: (60, 300, 900),
}
STALE_QUEUED = dt.timedelta(minutes=2)
UNREAD_FALLBACK_AFTER = dt.timedelta(minutes=15)
# Older than this, a message is news no longer: cancelled, not sent (a worker that was down for
# days must not send a backlog of stale alerts when it starts).
MAX_QUEUE_AGE = dt.timedelta(hours=24)
BATCH = 500


def app_url(audience: str) -> str:
    base = settings.STAFF_APP_URL if audience == "staff" else settings.PATIENT_APP_URL
    return str(base).rstrip("/")


def inbox_url(audience: str, notification_id: Any) -> str:
    """Link to one inbox item; the patient app keeps it under /dashboard (upgrade 12 §2)."""
    inbox = "/notifications" if audience == "staff" else "/dashboard/notifications"
    return f"{app_url(audience)}{inbox}/{notification_id}"


def _log(attempt: DeliveryAttempt, event_type: str) -> None:
    logger.info(
        "notifications.attempt",
        extra={
            "attempt_id": str(attempt.pk),
            "notification_id": str(attempt.notification_id),
            "event_type": event_type,
            "channel": attempt.channel,
            "status": attempt.status,
            "failure_reason": attempt.failure_reason,
        },
    )


def _finish(attempt: DeliveryAttempt, status: str, reason: str | None, now: dt.datetime) -> None:
    attempt.status = status
    attempt.failure_reason = reason
    attempt.finished_at = now
    if status in (AttemptStatus.SENT, AttemptStatus.DELIVERED):
        attempt.sent_at = now
    attempt.save(update_fields=["status", "failure_reason", "finished_at", "sent_at", "updated_at"])


def _backoff(priority: str, attempt_no: int) -> dt.timedelta:
    steps = BACKOFF.get(Priority(priority), BACKOFF[Priority.ROUTINE])
    base = steps[min(attempt_no - 1, len(steps) - 1)]
    return dt.timedelta(seconds=base * random.uniform(0.8, 1.2))  # noqa: S311  (jitter)


def _primary_failed(notification: Notification) -> bool:
    """Critical rule: no primary interrupting attempt ended sent, and none is still pending."""
    primary = DeliveryAttempt.objects.filter(notification=notification, is_fallback=False).exclude(
        channel="in_app"
    )
    if not primary.exists():
        return False
    if primary.filter(
        status__in=[AttemptStatus.SENT, AttemptStatus.DELIVERED, AttemptStatus.READ]
    ).exists():
        return False
    return not primary.filter(status__in=[AttemptStatus.QUEUED, AttemptStatus.HELD]).exists()


def _enqueue_on_commit(attempts: list[DeliveryAttempt]) -> None:
    ids = [str(a.pk) for a in attempts if a.status == AttemptStatus.QUEUED]
    if ids:
        transaction.on_commit(lambda: [send_attempt.delay(i) for i in ids])


@shared_task(ignore_result=True, acks_late=True, time_limit=30, soft_time_limit=25)
def send_attempt(attempt_id: str) -> None:
    from medilink.notifications.service import queue_fallback

    now = timezone.now()
    with transaction.atomic():
        attempt = (
            DeliveryAttempt.objects.select_for_update(skip_locked=True, of=("self",))
            .select_related("notification", "notification__recipient_user")
            .filter(pk=attempt_id, status=AttemptStatus.QUEUED)
            .first()
        )
        if attempt is None or attempt.scheduled_for > now + dt.timedelta(seconds=1):
            return
        notification = attempt.notification
        if notification.is_withdrawn:
            _finish(attempt, AttemptStatus.CANCELLED, FailureReason.WITHDRAWN, now)
            return
        if (notification.expires_at and notification.expires_at <= now) or (
            attempt.queued_at and attempt.queued_at <= now - MAX_QUEUE_AGE
        ):
            _finish(attempt, AttemptStatus.CANCELLED, FailureReason.EXPIRED, now)
            return
        adapter = channels.get(attempt.channel)
        template = templates.active(
            notification.event_type, attempt.channel, notification.language, notification.variant
        )
        if adapter is None or template is None:
            _finish(attempt, AttemptStatus.FAILED, FailureReason.NO_TEMPLATE, now)
            _log(attempt, notification.event_type)
            return
        subject, body = templates.render_text(template, notification.placeholder_values)
        limits = templates.LIMITS.get(attempt.channel)
        if limits:
            subject, body = subject[: limits.subject], body[: limits.body]
        if content_policy.clinical_terms(f"{subject}\n{body}"):
            _finish(attempt, AttemptStatus.FAILED, FailureReason.CONTENT_POLICY, now)
            _log(attempt, notification.event_type)
            return
        ttl = (
            int((notification.expires_at - now).total_seconds())
            if notification.expires_at
            else 86_400
        )
        message = Message(
            notification_id=notification.pk,
            subject=subject,
            body=body,
            priority=notification.priority,
            language=notification.language,
            url=inbox_url(notification.audience, notification.pk),
            ttl_seconds=ttl,
            topic=topic(notification.dedupe_key),
            action_path=notification.action_path or "",
        )
        address = (
            notification.recipient_user.email
            if attempt.channel == "email"
            else str(notification.recipient_user_id)
        )
        result = adapter.send(
            message, Target(address=address, subscription_id=attempt.push_subscription_id)
        )
        attempt.provider_message_id = result.provider_message_id
        if result.status in ("sent", "delivered"):
            _finish(attempt, result.status, None, now)
            if attempt.push_subscription_id:
                PushSubscription.objects.filter(pk=attempt.push_subscription_id).update(
                    last_success_at=now, failure_count=0
                )
            _log(attempt, notification.event_type)
            return
        _finish(attempt, AttemptStatus.FAILED, result.failure_reason, now)
        _log(attempt, notification.event_type)
        if attempt.push_subscription_id:
            sub = PushSubscription.objects.filter(pk=attempt.push_subscription_id).first()
            if sub is not None:
                sub.failure_count = min(sub.failure_count + 1, 32_000)
                fields = ["failure_count", "updated_at"]
                if result.revoke_target and sub.revoked_at is None:
                    sub.revoked_at = now
                    sub.revoked_reason = RevokedReason.GONE
                    fields += ["revoked_at", "revoked_reason"]
                sub.save(update_fields=fields)
        new: list[DeliveryAttempt] = []
        if result.retryable and attempt.attempt_no < MAX_ATTEMPTS:
            new.append(
                DeliveryAttempt.objects.create(
                    notification=notification,
                    channel=attempt.channel,
                    attempt_no=attempt.attempt_no + 1,
                    is_fallback=attempt.is_fallback,
                    push_subscription_id=attempt.push_subscription_id,
                    status=AttemptStatus.QUEUED,
                    scheduled_for=now + _backoff(notification.priority, attempt.attempt_no),
                    queued_at=now,
                )
            )
        elif (
            notification.priority == Priority.CRITICAL
            and not attempt.is_fallback
            and _primary_failed(notification)
        ):
            definition = registry.get(notification.event_type)
            new.extend(queue_fallback(notification, definition, notification.recipient_user, now))
            _enqueue_on_commit(new)


@shared_task(ignore_result=True, acks_late=True, time_limit=60, soft_time_limit=55)
def dispatch_due() -> int:
    """Release held attempts after quiet hours, enqueue due retries and lost tasks, cancel the
    expired ones."""
    now = timezone.now()
    with transaction.atomic():
        expired = DeliveryAttempt.objects.filter(
            Q(notification__expires_at__lte=now) | Q(queued_at__lte=now - MAX_QUEUE_AGE),
            status__in=[AttemptStatus.HELD, AttemptStatus.QUEUED],
        )
        expired.update(
            status=AttemptStatus.CANCELLED,
            failure_reason=FailureReason.EXPIRED,
            finished_at=now,
            updated_at=now,
        )
        DeliveryAttempt.objects.filter(status=AttemptStatus.HELD, scheduled_for__lte=now).update(
            status=AttemptStatus.QUEUED, updated_at=now
        )
    due = list(
        DeliveryAttempt.objects.filter(status=AttemptStatus.QUEUED, scheduled_for__lte=now)
        .order_by("scheduled_for")
        .values_list("pk", "queued_at", "scheduled_for")[:BATCH]
    )
    count = 0
    for pk, queued_at, scheduled_for in due:
        if scheduled_for > queued_at or queued_at <= now - STALE_QUEUED:
            send_attempt.delay(str(pk))
            count += 1
    return count


@shared_task(ignore_result=True, acks_late=True, time_limit=60, soft_time_limit=55)
def unread_fallback() -> int:
    """important + is_for_today, still unread 15 minutes after creation -> fallback once."""
    from medilink.notifications.service import queue_fallback

    now = timezone.now()
    count = 0
    ids = list(
        Notification.objects.filter(
            priority=Priority.IMPORTANT,
            is_for_today=True,
            read_at__isnull=True,
            is_withdrawn=False,
            fallback_done_at__isnull=True,
            created_at__lte=now - UNREAD_FALLBACK_AFTER,
            created_at__gt=now - MAX_QUEUE_AGE,
        ).values_list("pk", flat=True)[:BATCH]
    )
    for pk in ids:
        with transaction.atomic():
            notification = (
                Notification.objects.select_for_update(skip_locked=True)
                .select_related("recipient_user")
                .filter(pk=pk, fallback_done_at__isnull=True)
                .first()
            )
            if notification is None:
                continue
            definition = registry.get(notification.event_type)
            attempts = queue_fallback(notification, definition, notification.recipient_user, now)
            _enqueue_on_commit(attempts)
            count += 1
    return count


@shared_task(ignore_result=True, acks_late=True, time_limit=600, soft_time_limit=590)
def cleanup() -> dict[str, int]:
    """Retention (analysis 12 §9): notifications 2 years, revoked subscriptions 30 days, known
    devices unseen for 180 days. Logs counts only."""
    from medilink.notifications.models import KnownDevice

    now = timezone.now()
    counts = {
        "notifications": Notification.objects.filter(
            created_at__lt=now - dt.timedelta(days=730)
        ).delete()[0],
        "subscriptions": PushSubscription.objects.filter(
            revoked_at__lt=now - dt.timedelta(days=30)
        ).delete()[0],
        "devices": KnownDevice.objects.filter(
            last_seen_at__lt=now - dt.timedelta(days=180)
        ).delete()[0],
    }
    logger.info("notifications.cleanup", extra=counts)
    return counts


@shared_task(ignore_result=True, acks_late=True, time_limit=120, soft_time_limit=115)
def fan_out_announcement(announcement_id: str, facility_id: str | None = None) -> int:
    from medilink.notifications import announcements

    return announcements.fan_out(announcement_id, facility_id)


@shared_task(ignore_result=True, acks_late=True, time_limit=30, soft_time_limit=25)
def observe_login(user_id: str, audience: str, device_hash_hex: str, label: str) -> None:
    from medilink.notifications import observers

    observers.handle_login(user_id, audience, bytes.fromhex(device_hash_hex), label)


@shared_task(ignore_result=True, acks_late=True, time_limit=30, soft_time_limit=25)
def observe_audit_entry(entry_id: Any) -> None:
    from medilink.notifications import observers

    observers.handle_audit_entry(entry_id)


@shared_task(ignore_result=True, acks_late=True, time_limit=240, soft_time_limit=230)
def send_reminders() -> int:
    """W7 (upgrade 13): booked visits, follow-up dates and the care schedule. Each reminder has
    its own dedupe key, so a run that overlaps another sends nothing twice."""
    from medilink.notifications import reminders

    return reminders.run()
