"""Reminders (upgrade 13 W7) through the S9 engine: `notify()` with one dedupe key per item and
moment, so each reminder goes out once however often the job runs.

- Booked visits: each patient's reminder offsets (preferences, default 24 hours and 2 hours
  before), and always "15 minutes" and "it's time" at the start (decision 2026-11-19). The start
  one still goes out up to NOW_GRACE after the start (the job runs every minute).
- Follow-up dates the doctor set without a booking, and planned vaccinations and antenatal
  visits (the care schedule): the day before at 08:00 and on the morning at 07:00 (Kigali).

Rules for every item: a moment counts only after it has passed and only if the item already
existed then (a visit booked an hour ahead gets no "24 hours before"). When the job was down and
several moments passed, only the latest goes out. Channel choices, quiet hours and alerts switched
off for a dependant are the engine's (preferences.py, recipients.py). The texts are generic: no
service, test, vaccine or visit-type names.
"""

from __future__ import annotations

import datetime as dt
import logging
from collections.abc import Iterable
from typing import Any

from django.db import transaction
from django.utils import timezone

from medilink.notifications import preferences
from medilink.notifications import wiring_events as ev
from medilink.notifications.models import Audience
from medilink.notifications.recipients import Recipient, Recipients
from medilink.notifications.service import notify
from medilink.tenancy.context import rls_context

logger = logging.getLogger("medilink.notifications")

KIGALI = preferences.conf_tz()
MAX_OFFSET = dt.timedelta(minutes=10_080)  # the largest offset a patient may choose (7 days)
SOON = dt.timedelta(minutes=15)
NOW_GRACE = dt.timedelta(minutes=10)  # a late "it's time" still helps; later than this it doesn't
TIME_EVENTS = {"soon": ev.BOOKING_SOON, "now": ev.BOOKING_NOW}
DAY_BEFORE_AT = dt.time(8, 0)
ON_THE_DAY_AT = dt.time(7, 0)


def latest_due(
    moments: Iterable[tuple[str, dt.datetime]], created_at: dt.datetime, now: dt.datetime
) -> str | None:
    """The key of the latest moment that has passed and came after the item was made."""
    passed = [(when, key) for key, when in moments if created_at <= when <= now]
    return max(passed)[1] if passed else None


def day_moments(due_on: dt.date) -> list[tuple[str, dt.datetime]]:
    return [
        ("day_before", dt.datetime.combine(due_on - dt.timedelta(days=1), DAY_BEFORE_AT, KIGALI)),
        ("on_the_day", dt.datetime.combine(due_on, ON_THE_DAY_AT, KIGALI)),
    ]


class _Offsets:
    """Each recipient's reminder offsets, read once per run."""

    def __init__(self) -> None:
        self._cache: dict[str, list[int]] = {}

    def __call__(self, user_id: Any) -> list[int]:
        key = str(user_id)
        if key not in self._cache:
            from medilink.accounts.models import User

            user = User.objects.filter(pk=user_id).first()
            self._cache[key] = (
                preferences.effective(user, Audience.PATIENT).reminder_offsets_minutes
                if user is not None
                else []
            )
        return self._cache[key]


def _bookings(facility_id: Any, name: str, now: dt.datetime, offsets: _Offsets) -> int:
    from medilink.scheduling.models import Booking, BookingStatus

    sent = 0
    rows = Booking.objects.filter(
        facility_id=facility_id,
        status=BookingStatus.CONFIRMED,
        starts_at__gt=now - NOW_GRACE,
        starts_at__lte=now + MAX_OFFSET,
    ).order_by("starts_at")
    for booking in rows:
        for recipient in Recipients.patient(booking.patient_id).resolve():
            moments = [
                (str(m), booking.starts_at - dt.timedelta(minutes=m))
                for m in offsets(recipient.user_id)
            ] + [("soon", booking.starts_at - SOON), ("now", booking.starts_at)]
            key = latest_due(moments, booking.created_at, now)
            if key is None:
                continue
            sent += _send(
                TIME_EVENTS.get(key, ev.BOOKING_REMINDER),
                recipient,
                {
                    "facility_name": name,
                    "date": booking.starts_at,
                    "time": booking.starts_at,
                    "booking_id": booking.pk,
                },
                facility_id=facility_id,
                patient_id=booking.patient_id,
                # a moved visit is a new booking row; the start time keeps keys apart anyway
                key=f"{ev.BOOKING_REMINDER}:{booking.pk}:{key}:{booking.starts_at:%Y%m%d%H%M}",
                today=timezone.localtime(booking.starts_at, KIGALI).date()
                == timezone.localtime(now, KIGALI).date(),
            )
    return sent


def _dated(
    event: str,
    rows: Iterable[Any],
    id_key: str,
    *,
    facility_id: Any,
    name: str,
    now: dt.datetime,
) -> int:
    from medilink.notifications.wiring import close_family

    sent = 0
    for item in rows:
        key = latest_due(day_moments(item.due_on), item.created_at, now)
        if key is None:
            continue
        for recipient in close_family(item.patient_id).resolve():
            sent += _send(
                event,
                recipient,
                {"facility_name": name, "date": item.due_on, id_key: item.pk},
                facility_id=facility_id,
                patient_id=item.patient_id,
                key=f"{event}:{item.pk}:{key}:{item.due_on:%Y%m%d}",
                today=key == "on_the_day",
            )
    return sent


def _send(
    event: str,
    recipient: Recipient,
    context: dict[str, Any],
    *,
    facility_id: Any,
    patient_id: Any,
    key: str,
    today: bool,
) -> int:
    with transaction.atomic():
        result = notify(
            event,
            Recipients.explicit(recipient),
            context,
            facility_id=facility_id,
            patient_id=patient_id,
            dedupe_key=key,
            is_for_today=today,
        )
    return len(result.created)


def facility_reminders(facility_id: Any, now: dt.datetime | None = None) -> int:
    """Every reminder due at one facility. Runs in the facility's RLS context."""
    from medilink.scheduling.models import (
        CareScheduleEntry,
        CareScheduleStatus,
        FollowUp,
        FollowUpStatus,
    )
    from medilink.tenancy.models import Facility

    now = now or timezone.now()
    today = timezone.localtime(now, KIGALI).date()
    window = (today, today + dt.timedelta(days=1))
    name = str(Facility.objects.values_list("name", flat=True).get(pk=facility_id))
    offsets = _Offsets()
    sent = _bookings(facility_id, name, now, offsets)
    sent += _dated(
        ev.FOLLOW_UP_DUE,
        FollowUp.objects.filter(
            facility_id=facility_id,
            status__in=(FollowUpStatus.DUE, FollowUpStatus.NO_SLOT),
            due_on__range=window,
        ),
        "follow_up_id",
        facility_id=facility_id,
        name=name,
        now=now,
    )
    sent += _dated(
        ev.CARE_SCHEDULE_DUE,
        CareScheduleEntry.objects.filter(
            facility_id=facility_id, status=CareScheduleStatus.DUE, due_on__range=window
        ),
        "entry_id",
        facility_id=facility_id,
        name=name,
        now=now,
    )
    return sent


def run(now: dt.datetime | None = None) -> int:
    """Every live facility, each in its own RLS context; one facility failing never stops the
    others."""
    from medilink.scheduling.listing import live_facilities

    total = 0
    for facility_id in live_facilities():
        try:
            with rls_context(facility_id=facility_id):
                total += facility_reminders(facility_id, now)
        except Exception:
            logger.exception("notifications.reminders_failed", extra={"facility_id": facility_id})
    return total
