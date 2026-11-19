"""Public discovery read model and search (contract sprint-05 §2.3, P1-P3, FR-SCH-01..04).

`refresh(facility_id)` runs inside that facility's RLS context and copies only C0 data into
`facilities_public_listing`. Search reads only that table, never a facility table."""

from __future__ import annotations

import datetime as dt
import math
import re
from dataclasses import dataclass
from decimal import Decimal
from typing import Any

from django.db import connection, transaction
from django.db.models import Q
from django.utils import timezone

from medilink.billing.models import InsurerRule
from medilink.billing.services import current_q, price
from medilink.facilities.calendar import KIGALI, effective_calendar
from medilink.facilities.models import Profile, PublicListing, Service
from medilink.images.services import image_url
from medilink.masterdata.models import Location, LocationLevel
from medilink.scheduling.booking import cover
from medilink.scheduling.slots import bookable
from medilink.tenancy.models import Facility, FacilityStatus, FacilityType
from medilink.visits.models import DutyState, Stage, Ticket, TicketState
from medilink.visits.services import doctors_for

# pg_advisory_xact_lock(class, key) class for listing refreshes (int4; the key is the facility)
LISTING_LOCK = 7310

LEVEL_BY_TYPE: dict[str, str] = {
    FacilityType.HEALTH_POST: "primary",
    FacilityType.HEALTH_CENTER: "primary",
    FacilityType.PRIVATE_CLINIC: "primary",
    FacilityType.DISTRICT_HOSPITAL: "secondary",
    FacilityType.PROVINCIAL_HOSPITAL: "secondary",
    FacilityType.REFERRAL_HOSPITAL: "tertiary",
}
MUTUELLE = "mutuelle"
PAGE_SIZE = 20


def queue_load(waiting: int, doctors: int) -> str:
    """People waiting per doctor on duty: < 4 low, < 8 medium, else high (as the S4 dashboard)."""
    if waiting == 0:
        return "low"
    if doctors == 0:
        return "high"
    per_doctor = waiting / doctors
    return "low" if per_doctor < 4 else "medium" if per_doctor < 8 else "high"


@dataclass(frozen=True)
class LiveQueue:
    """Public queue figures for one service: counts only, never a person (contract PT §2.1)."""

    # None: the service has no queue to publish (no doctor on duty and nobody waiting)
    waiting: int | None
    wait_min: int | None
    wait_max: int | None


def _round5(value: float, up: bool) -> int:
    return int((math.ceil if up else math.floor)(value / 5) * 5)


def live_queue(facility_id: Any, services: list[Service]) -> dict[Any, LiveQueue]:
    """People waiting before the consultation, and the wait a new arrival can expect (the same
    rule as reception's estimate, S4 §2.4: waiting x average consultation / doctors on duty,
    shown as -20 % to +25 %, rounded to 5 minutes). No doctor on duty: the range is unknown."""
    today = timezone.localdate()
    waiting: dict[Any, int] = {}
    for service_id in Ticket.objects.filter(
        facility_id=facility_id,
        service_date=today,
        state=TicketState.WAITING,
        # PAYMENT is left out: it comes before and after the consultation (visits STAGE_ORDER), so
        # a ticket there cannot be counted as still waiting for the doctor
        stage__in=[Stage.RECEPTION, Stage.CONSULTATION],
    ).values_list("service_id", flat=True):
        waiting[service_id] = waiting.get(service_id, 0) + 1
    result: dict[Any, LiveQueue] = {}
    for service in services:
        count = waiting.get(service.pk, 0)
        doctors = doctors_for(facility_id, service.pk).filter(state=DutyState.ON_DUTY).count()
        if not doctors:
            # nobody on duty: publish the count only when people are already waiting
            result[service.pk] = LiveQueue(count or None, None, None)
            continue
        done = Ticket.objects.filter(
            facility_id=facility_id,
            service_id=service.pk,
            stage=Stage.CONSULTATION,
            service_date=today,
            started_at__isnull=False,
            ended_at__isnull=False,
        ).values_list("started_at", "ended_at")[:200]
        durations = [(end - start).total_seconds() / 60 for start, end in done if start and end]
        average = (
            max(sum(durations) / len(durations), 1.0)
            if len(durations) >= 3
            else float(service.duration_minutes or 15)
        )
        minutes = count * average / doctors
        result[service.pk] = LiveQueue(
            count, _round5(minutes * 0.8, up=False), max(_round5(minutes * 1.25, up=True), 5)
        )
    return result


def wait_range(value: LiveQueue | None) -> dict[str, int] | None:
    if value is None or value.wait_min is None or value.wait_max is None:
        return None
    return {"min": value.wait_min, "max": value.wait_max}


def _place(facility: Facility, profile: Profile | None) -> dict[str, str]:
    code = profile.village_code if profile else ""
    node = Location.objects.filter(code=code).select_related("parent__parent__parent").first()
    if node is None:
        from medilink.onboarding.models import Application

        application = (
            Application.objects.filter(facility=facility)
            .select_related("village__parent__parent__parent")
            .first()
        )
        node = application.village if application else None
    out = {"district_code": "", "district": "", "sector_code": "", "sector": ""}
    while node is not None:
        if node.level == LocationLevel.SECTOR:
            out["sector_code"], out["sector"] = node.code, node.name
        if node.level == LocationLevel.DISTRICT:
            out["district_code"], out["district"] = node.code, node.name
            break
        node = node.parent
    return out


def _hours(facility_id: Any, start: dt.date) -> list[list[Any]]:
    days = effective_calendar(facility_id, start, start + dt.timedelta(days=6))
    return [
        [d.date.isoformat(), a.strftime("%H:%M"), b.strftime("%H:%M")]
        for d in days
        for a, b in d.open
    ]


UPLOAD_COVER = "upload:"


def cover_of(facility_id: Any, profile: Profile | None) -> str:
    """The card's cover: the first Cloudinary photo, else the first clean scanned photo (stored as
    "upload:<id>"), else "" (the card draws the facility)."""
    if profile is None:
        return ""
    if profile.photo_public_ids:
        return str(profile.photo_public_ids[0])
    if profile.photo_file_ids:
        from medilink.uploads.models import ScanStatus, UploadedFile

        clean = set(
            UploadedFile.objects.filter(
                pk__in=profile.photo_file_ids,
                facility_id=facility_id,
                purpose="facility_photo",
                scan_status=ScanStatus.CLEAN,
                deleted_at__isnull=True,
            ).values_list("pk", flat=True)
        )
        for pk in profile.photo_file_ids:
            if pk in clean:
                return f"{UPLOAD_COVER}{pk}"
    return ""


def _upcoming(row: PublicListing, now: dt.datetime) -> dt.datetime | None:
    """The row's next free time, or None once it has passed (a listing the background refresh has
    not rebuilt since; a time in the past is never shown)."""
    return row.next_slot_at if row.next_slot_at and row.next_slot_at > now else None


def cover_url(slug: str, cover: str) -> str | None:
    """A delivery URL for a listing cover: Cloudinary, or the public photo redirect (same host)."""
    if not cover:
        return None
    if cover.startswith(UPLOAD_COVER):
        return f"/api/v1/public/facilities/{slug}/photos/{cover[len(UPLOAD_COVER) :]}/"
    return image_url(cover, w=800, h=350)


def refresh(facility_id: Any) -> int:
    """Rebuild the listing rows of one facility (inside its RLS context). Facilities that are not
    live lose their rows."""
    facility = Facility.objects.filter(pk=facility_id).first()
    if facility is None or facility.status != FacilityStatus.LIVE:
        PublicListing.objects.filter(facility_id=facility_id).delete()
        return 0
    profile = Profile.objects.filter(facility_id=facility_id).first()
    place = _place(facility, profile)
    today = timezone.localdate()
    now = timezone.now()
    hours = _hours(facility_id, today)
    rules = list(InsurerRule.objects.filter(current_q(today), facility_id=facility_id))
    active = list(Service.objects.filter(facility_id=facility_id, is_active=True))
    live = live_queue(facility_id, active)
    rows = []
    for service in active:
        item = price(facility_id, service_id=service.pk, on=today)
        fee = item.amount_rwf if item else None
        insurers: dict[str, dict[str, Any]] = {}
        for r in rules:
            if not r.applies_to_all_services and str(service.pk) not in {
                str(x) for x in r.service_ids
            }:
                continue
            share, covered = cover(fee, r, item.code if item else None)
            if covered:  # an excluded tariff is not accepted for this service
                insurers[r.insurer_code] = {"bp": r.patient_share_bp, "share_rwf": share}
        next_slot = None
        if service.is_bookable:
            first = bookable(
                facility_id, service.pk, start=now, end=now + dt.timedelta(days=60)
            ).first()
            next_slot = first.starts_at if first else None
        doctors = doctors_for(facility_id, service.pk).filter(state=DutyState.ON_DUTY).count()
        rows.append(
            PublicListing(
                facility_id=facility.pk,
                facility_slug=facility.slug,
                facility_name=facility.name,
                facility_type=facility.facility_type,
                ownership=facility.ownership,
                level_of_care=(profile.level_of_care if profile else "")
                or LEVEL_BY_TYPE.get(str(facility.facility_type), ""),
                emergency_department=bool(profile and profile.emergency_department),
                cover_public_id=cover_of(facility_id, profile),
                logo_public_id=profile.logo_public_id if profile else "",
                latitude=profile.latitude if profile else None,
                longitude=profile.longitude if profile else None,
                service_id=service.pk,
                service_code=service.catalogue_item_code,
                service_name_i18n=service.name_i18n,
                is_bookable=service.is_bookable,
                allows_remote_join=service.allows_remote_join,
                allows_walk_in=service.allows_walk_in,
                fee_rwf=item.amount_rwf if item else None,
                insurers=insurers,
                hours=hours,
                next_slot_at=next_slot,
                queue_load=queue_load(live[service.pk].waiting or 0, doctors),
                waiting=live[service.pk].waiting,
                wait_min=live[service.pk].wait_min,
                wait_max=live[service.pk].wait_max,
                updated_at=now,
                **place,
            )
        )
    with transaction.atomic():
        # Two refreshes of one facility at once (a save and the 10-minute job) take turns: each
        # one's delete would miss the other's new rows and the second insert would break
        # `facilities_listing_once`.
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT pg_advisory_xact_lock(%s, hashtext(%s))", [LISTING_LOCK, str(facility_id)]
            )
        PublicListing.objects.filter(facility_id=facility_id).delete()
        PublicListing.objects.bulk_create(rows)
    return len(rows)


# ---- search --------------------------------------------------------------------------------------


@dataclass(frozen=True)
class Query:
    service_code: str | None = None
    district_code: str | None = None
    sector_code: str | None = None
    near: tuple[float, float] | None = None
    insurer_code: str | None = None
    open_now: bool = False
    level_of_care: str | None = None
    available_today: bool = False
    emergency: bool = False
    page: int = 1
    # free text: facility name, place, service names, or an insurer ("rama", "mutuelle")
    q: str | None = None
    # with an insurer: only facilities that accept it (else they come after those that do)
    insured_only: bool = False


# Words people type for an insurer (any language), to its code. Master data adds each code.
INSURER_WORDS = {
    "mutuelle": "mutuelle",
    "mituweli": "mutuelle",
    "cbhi": "mutuelle",
    "rama": "rama",
    "rssb": "rama",
    "mmi": "mmi",
    "military": "mmi",
    "private": "private_other",
    "prive": "private_other",
    "privé": "private_other",
}


def parse_text(q: str | None) -> tuple[str | None, str]:
    """An insurer named in the search, and the remaining words (lowercase)."""
    if not q:
        return None, ""
    words = [w for w in re.split(r"[\s,;/]+", q.strip().lower()) if w][:12]
    insurer = None
    rest = []
    for word in words:
        code = INSURER_WORDS.get(word)
        if code and insurer is None:
            insurer = code
        else:
            rest.append(word)
    return insurer, " ".join(rest)[:100]


def _km(a: tuple[float, float], lat: Decimal | None, lng: Decimal | None) -> float | None:
    if lat is None or lng is None:
        return None
    p1, p2 = math.radians(a[0]), math.radians(float(lat))
    dp, dl = p2 - p1, math.radians(float(lng) - a[1])
    h = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return round(6371 * 2 * math.asin(math.sqrt(h)), 1)


def _accepts(row: PublicListing, insurer_code: str | None) -> str:
    if not insurer_code:
        return "unknown"
    return "yes" if insurer_code in (row.insurers or {}) else "no"


def is_open(hours: list[list[Any]], now: dt.datetime) -> bool:
    local = now.astimezone(KIGALI)
    day, time = local.date().isoformat(), local.strftime("%H:%M")
    return any(d == day and a <= time < b for d, a, b in hours)


def search(query: Query) -> dict[str, Any]:
    """One result per facility (its best matching service), sorted by distance when a location is
    given, else by open now, then next slot, then name."""
    rows = PublicListing.objects.all()
    if query.service_code:
        rows = rows.filter(service_code=query.service_code)
    if query.district_code:
        rows = rows.filter(district_code=query.district_code)
    if query.sector_code:
        rows = rows.filter(sector_code=query.sector_code)
    if query.level_of_care:
        rows = rows.filter(level_of_care=query.level_of_care)
    if query.emergency:
        rows = rows.filter(emergency_department=True)
    now = timezone.now()
    if query.available_today:
        end_of_day = dt.datetime.combine(
            now.astimezone(KIGALI).date() + dt.timedelta(days=1), dt.time.min, KIGALI
        )
        rows = rows.filter(
            Q(next_slot_at__gte=now, next_slot_at__lt=end_of_day)
            | Q(allows_remote_join=True)
            | Q(allows_walk_in=True)
        )
    typed_insurer, text = parse_text(query.q)
    insurer_code = query.insurer_code or typed_insurer
    # typing an insurer's name means "places that take it"
    insured_only = query.insured_only or (typed_insurer is not None and not query.insurer_code)
    best: dict[Any, PublicListing] = {}
    haystack: dict[Any, list[str]] = {}
    accepted: set[Any] = set()
    # An insurer that is not accepted does not hide a facility unless asked (insured_only): the
    # result says "no" and the patient may still choose to pay (analysis 05 §4)
    for row in rows.order_by("facility_name", "service_code"):
        if query.open_now and not is_open(row.hours, now):
            continue
        if insurer_code and insurer_code in (row.insurers or {}):
            accepted.add(row.facility_id)
        if text:
            haystack.setdefault(
                row.facility_id, [row.facility_name, row.sector, row.district, row.facility_type]
            ).extend(str(v) for v in (row.service_name_i18n or {}).values())
        current = best.get(row.facility_id)
        if current is None or (_upcoming(row, now) and not _upcoming(current, now)):
            best[row.facility_id] = row
    if text:
        words = text.split()
        best = {
            fid: row
            for fid, row in best.items()
            if all(w in " ".join(haystack.get(fid, [])).lower() for w in words)
        }
    if insurer_code and insured_only:
        best = {fid: row for fid, row in best.items() if fid in accepted}
    results = []
    for row in best.values():
        distance = _km(query.near, row.latitude, row.longitude) if query.near else None
        results.append(
            {
                "slug": row.facility_slug,
                "name": row.facility_name,
                "type": row.facility_type,
                "ownership": row.ownership,
                "level_of_care": row.level_of_care,
                "emergency_department": row.emergency_department,
                "district": row.district,
                "sector": row.sector,
                "distance_km": distance,
                "open_now": is_open(row.hours, now),
                "service_code": row.service_code,
                "service_name_i18n": row.service_name_i18n,
                "accepts_insurance": (
                    "unknown"
                    if not insurer_code
                    else "yes"
                    if row.facility_id in accepted
                    else "no"
                ),
                # U-01 (S5 D-14): accepted insurers only, never an amount
                "insurers": sorted(row.insurers or {}),
                "next_slot_at": _upcoming(row, now),
                "queue_load": row.queue_load or None,
                "waiting": row.waiting,
                "wait_range": wait_range(LiveQueue(row.waiting, row.wait_min, row.wait_max)),
                "allows_remote_join": row.allows_remote_join,
                "referral_hint": insurer_code == MUTUELLE
                and row.level_of_care in ("secondary", "tertiary"),
                "lat": float(row.latitude) if row.latitude is not None else None,
                "lng": float(row.longitude) if row.longitude is not None else None,
                # the facility's own cover photo (Cloudinary); the cards draw one without it
                "cover_url": cover_url(row.facility_slug, row.cover_public_id),
                "logo_url": image_url(row.logo_public_id, w=160, h=160, crop="pad"),
            }
        )
    if query.near:
        results.sort(key=lambda r: (r["distance_km"] is None, r["distance_km"] or 0, r["name"]))
    else:
        far = dt.datetime.max.replace(tzinfo=dt.UTC)
        results.sort(key=lambda r: (not r["open_now"], r["next_slot_at"] or far, r["name"]))
    if insurer_code:  # places that take the insurance first (a stable sort keeps the rest)
        results.sort(key=lambda r: r["accepts_insurance"] != "yes")
    page = max(query.page, 1)
    start = (page - 1) * PAGE_SIZE
    return {
        "count": len(results),
        "page": page,
        "results": results[start : start + PAGE_SIZE],
        "insurer_code": insurer_code,
    }


def live_facilities() -> list[Any]:
    return list(Facility.objects.filter(status=FacilityStatus.LIVE).values_list("pk", flat=True))
