"""W7 (upgrade 13, #206) patient follow-through: reminders before booked visits and planned dates,
the care schedule, and "almost your turn" from every queue move, each sent once."""

from __future__ import annotations

import datetime as dt
from typing import Any

import pytest
from rest_framework.test import APIClient

from medilink.facilities.calendar import KIGALI
from medilink.notifications import reminders
from medilink.notifications import wiring_events as ev
from medilink.notifications.models import Notification
from medilink.tenancy.context import rls_context
from tests.conftest import login_patient
from tests.s4.conftest import (  # noqa: F401
    S,
    act,
    call_next,
    check_in,
    on_duty,
    patient_account,
    register,
)
from tests.s5.conftest import (  # noqa: F401
    Clock,
    admin,
    book,
    bookable,
    catalogue,
    clinic,
    clock,
    desk,
    doctor,
    first_slot,
    patient_client,
)
from tests.s6.conftest import patient_keys  # noqa: F401

pytestmark = pytest.mark.django_db
CARE = "/api/v1/patient/care-schedule/"


def notices(user: Any, event: str) -> list[Notification]:
    return list(Notification.objects.filter(recipient_user=user, event_type=event))


def at(fixed: Clock, days: int, hour: int, minute: int = 0) -> dt.datetime:
    """A Kigali time `days` after the test clock's Monday; the clock moves there."""
    local = fixed.now.astimezone(KIGALI)
    monday = local.date() - dt.timedelta(days=local.weekday())
    fixed.now = dt.datetime.combine(monday + dt.timedelta(days=days), dt.time(hour, minute), KIGALI)
    return fixed.now


def run(facility: Any, now: dt.datetime) -> int:
    with rls_context(facility_id=facility.pk):
        return reminders.facility_reminders(facility.pk, now)


def test_latest_due_skips_moments_before_the_item_existed() -> None:
    t = dt.datetime(2026, 11, 10, 8, 0, tzinfo=dt.UTC)
    moments = [("1440", t - dt.timedelta(days=1)), ("120", t - dt.timedelta(hours=2))]
    made = t - dt.timedelta(hours=3)
    assert reminders.latest_due(moments, made, t - dt.timedelta(hours=2, minutes=30)) is None
    assert reminders.latest_due(moments, made, t - dt.timedelta(hours=1)) == "120"
    # down for a day: only the latest passed moment
    assert reminders.latest_due(moments, t - dt.timedelta(days=2), t) == "120"


def test_booked_visit_reminders_go_once_per_offset(
    clock: Clock,  # noqa: F811
    clinic: Any,  # noqa: F811
    bookable: dict[str, Any],  # noqa: F811
) -> None:
    client, user = patient_client("remind@example.test", "Uwase Remind")
    slot = first_slot(clinic, bookable["service_id"], after=at(clock, 2, 7))  # Wednesday 08:00
    at(clock, 0, 9)
    made = book(client, user, slot)
    assert made.status_code == 201, made.content

    assert run(clinic, at(clock, 0, 10)) == 0
    assert run(clinic, at(clock, 1, 8, 5)) == 1  # 24 hours before
    assert run(clinic, at(clock, 1, 8, 10)) == 0  # never twice
    assert run(clinic, at(clock, 2, 6, 1)) == 1  # 2 hours before
    assert run(clinic, at(clock, 2, 6, 6)) == 0
    sent = notices(user, ev.BOOKING_REMINDER)
    assert len(sent) == 2
    assert all("Gisozi Clinic" in n.body for n in sent)
    assert {n.action_path for n in sent} == {f"/dashboard/appointments/{made.json()['id']}"}


def test_it_is_time_15_minutes_before_and_at_the_start(
    clock: Clock,  # noqa: F811
    clinic: Any,  # noqa: F811
    bookable: dict[str, Any],  # noqa: F811
) -> None:
    client, user = patient_client("on-time@example.test", "Uwase Ontime")
    slot = first_slot(clinic, bookable["service_id"], after=at(clock, 2, 7))  # Wednesday 08:00
    at(clock, 0, 9)
    assert book(client, user, slot).status_code == 201

    assert run(clinic, at(clock, 2, 6, 1)) == 1  # 2 hours before (the usual reminder)
    assert run(clinic, at(clock, 2, 7, 44)) == 0
    assert run(clinic, at(clock, 2, 7, 45)) == 1  # 15 minutes before
    assert run(clinic, at(clock, 2, 7, 50)) == 0
    assert run(clinic, at(clock, 2, 8, 0)) == 1  # at the start
    assert run(clinic, at(clock, 2, 8, 1)) == 0  # never twice
    soon, now = notices(user, ev.BOOKING_SOON), notices(user, ev.BOOKING_NOW)
    assert len(soon) == len(now) == 1
    assert "Gisozi Clinic" in now[0].body
    assert soon[0].title != now[0].title


def test_it_is_time_goes_late_only_within_the_grace(
    clock: Clock,  # noqa: F811
    clinic: Any,  # noqa: F811
    bookable: dict[str, Any],  # noqa: F811
) -> None:
    client, user = patient_client("late-job@example.test", "Uwase Late")
    slot = first_slot(clinic, bookable["service_id"], after=at(clock, 2, 7))  # Wednesday 08:00
    at(clock, 0, 9)
    assert book(client, user, slot).status_code == 201

    # the job was down from before the 15-minute moment: only "it's time" goes, a few minutes late
    assert run(clinic, at(clock, 2, 8, 4)) == 1
    assert len(notices(user, ev.BOOKING_NOW)) == 1
    assert notices(user, ev.BOOKING_SOON) == []
    # well past the start nothing more goes out
    assert run(clinic, at(clock, 2, 8, 30)) == 0


def test_care_schedule_entries_reach_the_patient_without_clinical_words(
    clock: Clock,  # noqa: F811
    clinic: Any,  # noqa: F811
    desk: tuple[APIClient, Any],  # noqa: F811
    doctor: tuple[APIClient, Any],  # noqa: F811
    patient_account: tuple[Any, Any],  # noqa: F811
) -> None:
    user, record = patient_account
    url = f"{S}care-schedule/patients/{record.pk}/"
    monday = at(clock, 0, 9).date()
    due = (monday + dt.timedelta(days=2)).isoformat()
    body = {"kind": "antenatal", "due_on": due, "note": "Second visit"}

    assert desk[0].post(url, body, format="json").status_code == 403  # reception can't
    assert doctor[0].post(url, {**body, "due_on": "2020-01-01"}, format="json").status_code == 422
    made = doctor[0].post(url, body, format="json")
    assert made.status_code == 201, made.content
    entry = made.json()
    assert entry["note"] == "Second visit" and entry["status"] == "due"
    listed = doctor[0].get(url)
    assert listed.status_code == 200 and [e["id"] for e in listed.json()["results"]] == [
        entry["id"]
    ]

    patient = APIClient()
    login_patient(patient, user)
    coming = patient.get(CARE)
    assert coming.status_code == 200, coming.content
    [item] = coming.json()["results"]
    assert item["type"] == "antenatal" and item["due_on"] == due
    assert item["facility_name"] == "Gisozi Clinic" and item["note"] == "Second visit"

    # a cancelled entry: gone from both lists, no reminders; a stale version is refused
    other = doctor[0].post(url, {"kind": "vaccination", "due_on": due}, format="json").json()
    cancel = f"{S}care-schedule/{other['id']}/cancel/"
    done = doctor[0].post(cancel, {"version": other["version"]}, format="json")
    assert done.status_code == 200 and done.json()["status"] == "cancelled"
    assert doctor[0].post(cancel, {"version": other["version"]}, format="json").status_code == 409
    assert [i["id"] for i in patient.get(CARE).json()["results"]] == [entry["id"]]
    assert [e["id"] for e in doctor[0].get(url).json()["results"]] == [entry["id"]]

    assert run(clinic, at(clock, 1, 7)) == 0
    assert run(clinic, at(clock, 1, 8, 1)) == 1  # the day before
    assert run(clinic, at(clock, 1, 9)) == 0
    assert run(clinic, at(clock, 2, 7, 1)) == 1  # on the morning
    sent = notices(user, ev.CARE_SCHEDULE_DUE)
    assert len(sent) == 2
    assert {n.data["entry_id"] for n in sent} == {entry["id"]}
    for n in sent:
        text = f"{n.title} {n.body}".lower()
        assert "antenatal" not in text and "second visit" not in text


def test_almost_your_turn_follows_every_move_once(
    catalogue: dict[str, Any],  # noqa: F811
    clinic: Any,  # noqa: F811
    desk: tuple[APIClient, Any],  # noqa: F811
    doctor: tuple[APIClient, Any],  # noqa: F811
    patient_account: tuple[Any, Any],  # noqa: F811
    django_capture_on_commit_callbacks: Any,
) -> None:
    user, record = patient_account
    service_id = catalogue["service"]["id"]
    others = [
        check_in(desk[0], register(clinic, desk[1], f"Other {n}"), service_id).json()["ticket"]
        for n in range(5)
    ]
    assert check_in(desk[0], record, service_id).status_code == 201  # 5 people ahead
    on_duty(doctor[0], None)  # no room: the counter call (W7)

    with django_capture_on_commit_callbacks(execute=True):
        assert call_next(doctor[0], service_id).status_code == 200  # 4 ahead
    assert notices(user, ev.TICKET_ALMOST) == []
    with django_capture_on_commit_callbacks(execute=True):
        left = act(desk[0], others[1], "cancel", reason_code="patient_left")  # 3 ahead
    assert left.status_code == 200, left.content
    [almost] = notices(user, ev.TICKET_ALMOST)
    assert almost.priority == "critical" and "3" in almost.title

    # the next moves (2 ahead, then 1) send nothing more
    for _ in range(2):
        with django_capture_on_commit_callbacks(execute=True):
            mine = doctor[0].get(f"{S}queue/mine/").json()["current"]
            assert act(doctor[0], mine, "start").status_code == 200
            mine = doctor[0].get(f"{S}queue/mine/").json()["current"]
            assert act(doctor[0], mine, "complete").status_code == 200
            assert call_next(doctor[0], service_id).status_code == 200
    assert len(notices(user, ev.TICKET_ALMOST)) == 1

    # called with no room to name: the plain "it's your turn"
    while not notices(user, ev.TICKET_CALLED_DESK):
        with django_capture_on_commit_callbacks(execute=True):
            mine = doctor[0].get(f"{S}queue/mine/").json()["current"]
            assert act(doctor[0], mine, "start").status_code == 200
            mine = doctor[0].get(f"{S}queue/mine/").json()["current"]
            assert act(doctor[0], mine, "complete").status_code == 200
            assert call_next(doctor[0], service_id).status_code == 200
    [called] = notices(user, ev.TICKET_CALLED_DESK)
    assert "Gisozi Clinic" in called.body and called.priority == "critical"
