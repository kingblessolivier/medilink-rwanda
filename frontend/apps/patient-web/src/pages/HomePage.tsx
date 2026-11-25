import type { Booking, PatientVisit } from "@medilink/api-client";
import {
  BellSimpleRinging,
  CalendarCheck,
  CalendarPlus,
  ChatCircleDots,
  CheckCircle,
  Clock,
  FileText,
  Heartbeat,
  MagnifyingGlass,
  MapPin,
  PersonSimpleWalk,
  Pill,
  Stethoscope,
  TestTube,
  UsersThree,
  WarningCircle,
  type Icon,
  Receipt,
  Scales,
} from "@phosphor-icons/react";
import { Alert, Button, buttonClassName, cx, Skeleton } from "@medilink/ui";
import { dateFormat, kigaliHour } from "@medilink/ui/i18n";
import { useQuery } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import { paths } from "../app/paths";
import { useApi } from "../app/services";
import { usePatientMe } from "../auth/queries";
import { PageHeading } from "../components/PageHeading";
import { day, directionsUrl, pick, time } from "../features/booking/discovery";
import { useUpcoming } from "../features/booking/Upcoming";
import { AppointmentMenu, AppointmentRow } from "../features/dashboard/AppointmentsPages";
import { useUnpaidBills, useRwf } from "../features/bills/shared";
import { useMyDisputes } from "../features/disputes/shared";
import { useComingUp } from "../features/dashboard/ComingUp";
import {
  AppointmentBadge,
  Avatar,
  DateBlock,
  ErrorBlock,
  isCancelled,
  panelClass,
  RowIcon,
  RowLink,
  RowList,
  StatCard,
  useFacilityProfile,
  WidgetCard,
  firstName,
} from "../features/dashboard/kit";
import { arrivalKey, QueueTicketCard } from "../features/dashboard/visits";
import { medicinesKeys } from "../features/medicines/shared";
import { PushOffBanner } from "../features/notifications";
import { useUnreadCount } from "../features/notifications/api";
import { useProfiles } from "../features/profile/ProfileLayout";
import { recordsKeys } from "../features/records/RecordsPages";
import { useActiveVisits } from "../features/tracker/TrackerPage";
import { EmergencyNotice } from "../layout/EmergencyNotice";

/*
 * Patient overview `/dashboard` (upgrade 12 §5, overview redesign 2026-11-02). What a patient needs
 * when they open the app, in that order:
 *  1. greeting and the two main actions (find care, book);
 *  2. what is happening now (live ticket > next appointment > welcome), beside what needs an answer;
 *  3. four real counts at a glance (upcoming, active medicines, records, unread messages);
 *  4. upcoming appointments and recent visits (signed records), with latest measurements, current
 *     medicines, family and the emergency notice beside.
 * Only server data is shown. There are no charts: the API has no history of measurements across
 * visits, and a trend drawn from one or two visits would mislead.
 */

/** Morning before 12:00, afternoon before 18:00, evening after, in Kigali time. */
function partOfDay(now: Date): "morning" | "afternoon" | "evening" {
  const hour = kigaliHour(now);
  return hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
}

const live = (b: Booking) => !isCancelled(b) && b.status !== "superseded";

/** "2 Nov" in Kigali time; date-only values ("2026-11-02") are read at midday. */
function useShortDate() {
  const { i18n } = useTranslation();
  const lang = i18n.resolvedLanguage ?? "rw";
  return (iso: string) => {
    try {
      return dateFormat(lang, { day: "numeric", month: "short", timeZone: "Africa/Kigali" }).format(
        new Date(iso.length === 10 ? `${iso}T12:00:00Z` : iso),
      );
    } catch {
      return iso;
    }
  };
}

/** Same cache as the Records and Medicines pages (everyone the account cares for). */
function useRecords() {
  const api = useApi();
  return useQuery({
    queryKey: recordsKeys.list(""),
    queryFn: () => api.clinical.patient.records({}),
  });
}

function useActiveMedicines() {
  const api = useApi();
  return useQuery({
    queryKey: medicinesKeys.list("", "active"),
    queryFn: () => api.pharmacy.patient.list({ status: "active" }),
  });
}

/** Released lab results, the Records page's cache (W7: a new one shows under Attention). */
function useLabResults() {
  const api = useApi();
  return useQuery({
    queryKey: recordsKeys.labResults(""),
    queryFn: () => api.clinical.patient.labResults({}),
  });
}

/** A released result counts as new for a week. */
const RESULT_IS_NEW_MS = 7 * 24 * 3_600_000;

// ---- small pieces inside cards ----------------------------------------------------------------

function CardEmpty({
  icon,
  title,
  body,
  action,
}: {
  icon: Icon;
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col items-start gap-3 p-5">
      <RowIcon icon={icon} tone="neutral" />
      <div className="flex flex-col gap-0.5">
        <p className="m-0 font-semibold text-pretty text-fg">{title}</p>
        {body && <p className="m-0 text-body-sm text-pretty text-fg-secondary">{body}</p>}
      </div>
      {action}
    </div>
  );
}

function CardError({ message, onRetry }: { message: string; onRetry: () => void }) {
  const { t } = useTranslation();
  return (
    <div role="alert" className="flex flex-col items-start gap-3 p-5">
      <p className="m-0 flex items-start gap-2 font-semibold text-fg">
        <WarningCircle
          aria-hidden="true"
          weight="duotone"
          className="size-6 shrink-0 text-danger"
        />
        {message}
      </p>
      <Button variant="secondary" size="sm" onClick={onRetry}>
        {t("dashboard.retry")}
      </Button>
    </div>
  );
}

function CardSkeleton({ rows = 2 }: { rows?: number }) {
  return (
    <div className="flex flex-col divide-y divide-border">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="flex items-center gap-4 px-5 py-3">
          <Skeleton width="3.5rem" height="3.5rem" className="rounded-xl" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton height="1rem" width="55%" />
            <Skeleton height="0.875rem" width="35%" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ---- 2. now: the active healthcare journey ----------------------------------------------------

/** Small pin-over-clinic drawing for the welcome state (brand tokens only). */
function StartIllustration() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 160 120"
      fill="none"
      className="h-28 w-auto shrink-0"
    >
      <ellipse cx="80" cy="104" rx="64" ry="10" className="fill-brand-subtle" />
      <rect
        x="38"
        y="52"
        width="84"
        height="52"
        rx="6"
        className="fill-surface stroke-border"
        strokeWidth="2"
      />
      <path
        d="M30 56 80 26l50 30"
        className="stroke-border"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <rect x="70" y="76" width="20" height="28" rx="3" className="fill-brand-subtle" />
      <path d="M80 60v12M74 66h12" className="stroke-brand" strokeWidth="4" strokeLinecap="round" />
      <path
        d="M118 8c-9 0-16 7-16 16 0 12 16 28 16 28s16-16 16-28c0-9-7-16-16-16Z"
        className="fill-brand"
      />
      <circle cx="118" cy="24" r="6" className="fill-surface" />
    </svg>
  );
}

function WelcomePanel() {
  const { t } = useTranslation();
  return (
    <section
      aria-labelledby="journey"
      className={cx(
        panelClass,
        "flex h-full flex-col-reverse gap-6 rounded-[20px] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8",
      )}
    >
      <div className="flex max-w-[32rem] flex-col gap-3">
        <h2 id="journey" className="m-0 font-heading text-h2 font-bold text-fg">
          {t("dashboard.overview.startTitle")}
        </h2>
        <div className="mt-2 flex flex-wrap gap-2">
          <Link to={paths.findCare} className={buttonClassName({})}>
            <MagnifyingGlass aria-hidden="true" className="size-icon" />
            {t("dashboard.findCare")}
          </Link>
          <Link to={paths.facilities} className={buttonClassName({ variant: "secondary" })}>
            {t("dashboard.overview.explore")}
          </Link>
        </div>
      </div>
      <StartIllustration />
    </section>
  );
}

function NextAppointmentPanel({ booking }: { booking: Booking }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage ?? "rw";
  const facility = useFacilityProfile(booking.facility_slug);
  const f = facility.data;
  return (
    <section
      aria-labelledby="journey"
      className={cx(panelClass, "flex h-full flex-col overflow-hidden rounded-[20px] shadow-card")}
    >
      <div className="flex flex-1 flex-col gap-5 p-5 sm:flex-row sm:items-start sm:p-7">
        <DateBlock iso={booking.starts_at} size="lg" />
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-caption font-semibold tracking-[0.14em] text-brand uppercase">
              {t("dashboard.overview.nextAppointment")}
            </span>
            <AppointmentBadge booking={booking} />
          </div>
          <h2 id="journey" className="m-0 font-heading text-h2 font-bold text-fg">
            {pick(booking.service_name_i18n, lang)}
          </h2>
          <p className="m-0 inline-flex items-center gap-2 self-start rounded-full bg-attention-bg px-3 py-1 font-semibold text-attention tabular-nums">
            <Clock aria-hidden="true" weight="bold" className="size-4" />
            {day(booking.starts_at, lang)} · {time(booking.starts_at, lang)}
          </p>
          <ul className="m-0 flex list-none flex-col gap-1.5 p-0 text-fg-secondary">
            <li className="flex items-center gap-2">
              <MapPin aria-hidden="true" className="size-5 shrink-0 text-fg-muted" />
              <span className="truncate">
                {[booking.facility_name, f?.sector, f?.district].filter(Boolean).join(", ")}
              </span>
            </li>
            {booking.doctor && (
              <li className="flex items-center gap-2">
                <Stethoscope aria-hidden="true" className="size-5 shrink-0 text-fg-muted" />
                {booking.doctor}
              </li>
            )}
            <li className="flex items-center gap-2 text-body-sm">
              <span className="text-fg-muted">{t("dashboard.appointments.reference")}</span>
              <span className="font-mono font-semibold tracking-wider text-fg">
                {booking.booking_code}
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 border-t border-border bg-subtle/60 px-5 py-3 sm:px-7">
        <Link to={paths.appointment(booking.id)} className={buttonClassName({})}>
          {t("dashboard.overview.viewDetails")}
        </Link>
        {f?.lat != null && f.lng != null && (
          <a
            href={directionsUrl(f.lat, f.lng)}
            target="_blank"
            rel="noreferrer"
            className={buttonClassName({ variant: "ghost" })}
          >
            {t("dashboard.appointments.directions")}
          </a>
        )}
        <span className="ml-auto">
          <AppointmentMenu booking={booking} trigger="button" />
        </span>
      </div>
    </section>
  );
}

function CurrentVisitPanel({ visit, more }: { visit: PatientVisit; more: number }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-2">
      <QueueTicketCard
        visit={visit}
        headingLevel={2}
        label={t("dashboard.overview.currentVisit")}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link to={paths.ticket(visit.visit_id)} className={buttonClassName({})}>
              {t("dashboard.queue.viewLive")}
            </Link>
            <Link to={paths.queue} className={buttonClassName({ variant: "ghost" })}>
              {t("dashboard.overview.allTickets")}
            </Link>
          </div>
        }
      />
      {more > 0 && (
        <Link to={paths.queue} className="self-start text-body-sm font-semibold text-link">
          {t("dashboard.overview.moreTickets", { count: more })}
        </Link>
      )}
    </div>
  );
}

/** A live ticket wins, then the next appointment, otherwise a calm welcome. Nothing is estimated. */
function Journey() {
  const { t } = useTranslation();
  const visits = useActiveVisits();
  const upcoming = useUpcoming();
  const active = visits.data?.results ?? [];
  const next = (upcoming.data?.results ?? []).filter(live)[0];
  if (active[0]) return <CurrentVisitPanel visit={active[0]} more={active.length - 1} />;
  if (visits.isPending || upcoming.isPending)
    return <Skeleton height="16rem" className="rounded-[20px]" />;
  if (next) return <NextAppointmentPanel booking={next} />;
  if (upcoming.isError)
    return (
      <ErrorBlock
        message={t("dashboard.appointments.failed")}
        onRetry={() => void upcoming.refetch()}
      />
    );
  return <WelcomePanel />;
}

// ---- 2b. needs your attention -----------------------------------------------------------------

interface Reminder {
  id: string;
  icon: Icon;
  title: string;
  when: string;
  who: string;
  to: string;
  action: string;
}

/**
 * Only real, actionable items: an offer waiting for an answer, a remote ticket that still needs
 * "I'm here", an appointment within a day, a result released in the last week, and a date the
 * clinic planned (W7) within two days. No medical reminders are invented (medication reminders
 * have no backend yet).
 */
function useReminders(): Reminder[] {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage ?? "rw";
  const upcoming = useUpcoming();
  const visits = useActiveVisits();
  const results = useLabResults();
  const coming = useComingUp();
  const unpaid = useUnpaidBills();
  const disputes = useMyDisputes();
  const rwf = useRwf();
  const profiles = useProfiles();
  const nameOf = (id: string) =>
    profiles.data?.results.find((p) => p.patient_id === id)?.display_name ?? "";
  const short = useShortDate();
  // read the clock once per mount, not on every render
  const [now] = useState(() => Date.now());
  const soon = now + 24 * 3_600_000;
  const reminders: Reminder[] = [];
  for (const r of results.data ?? [])
    if (Date.parse(r.released_at) >= now - RESULT_IS_NEW_MS)
      reminders.push({
        id: `result-${r.id}`,
        icon: TestTube,
        title: t("dashboard.reminders.result"),
        when: `${short(r.released_at)} · ${r.facility_name}`,
        who: nameOf(r.patient_id),
        to: paths.records,
        action: t("dashboard.reminders.readResult"),
      });
  for (const c of coming.data?.results ?? [])
    if (Date.parse(`${c.due_on}T23:59:00+02:00`) <= now + 2 * 24 * 3_600_000)
      reminders.push({
        id: `planned-${c.type}-${c.id}`,
        icon: CalendarCheck,
        title: t("dashboard.reminders.planned", {
          what: t(`dashboard.comingUp.types.${c.type}`),
        }),
        when: `${short(c.due_on)} · ${c.facility_name}`,
        who: nameOf(c.patient_id),
        to: c.type === "follow_up" ? `${paths.findCare}?mode=booking` : paths.appointments,
        action: c.type === "follow_up" ? t("dashboard.comingUp.book") : t("dashboard.viewDetails"),
      });
  for (const b of (upcoming.data?.results ?? []).filter(live)) {
    const service = pick(b.service_name_i18n, lang);
    if (b.pending_change)
      reminders.push({
        id: `offer-${b.id}`,
        icon: BellSimpleRinging,
        title: t("dashboard.reminders.answer", { service }),
        when: `${day(b.starts_at, lang, "short")} · ${time(b.starts_at, lang)}`,
        who: b.patient_display_name,
        to: paths.appointment(b.id),
        action: t("dashboard.reminders.reply"),
      });
    else if (Date.parse(b.starts_at) <= soon)
      reminders.push({
        id: `soon-${b.id}`,
        icon: Clock,
        title: t("dashboard.reminders.soon", { service }),
        when: `${day(b.starts_at, lang, "short")} · ${time(b.starts_at, lang)}`,
        who: b.patient_display_name,
        to: paths.appointment(b.id),
        action: t("dashboard.viewDetails"),
      });
  }
  // a bill with something left to pay (S8-F6): the facility's reception takes the payment
  for (const b of (unpaid.data?.results ?? []).slice(0, 3))
    reminders.push({
      id: `bill-${b.id}`,
      icon: Receipt,
      title: t("dashboard.reminders.bill", { amount: rwf(b.balance_rwf) }),
      when: `${short(b.service_date)} · ${b.facility_name}`,
      who: nameOf(b.patient_id),
      to: paths.bill(b.id),
      action: t("dashboard.reminders.seeBill"),
    });
  // a dispute that waits for my answer (S10b): a question from the facility, or its decision
  for (const d of disputes.data?.results ?? [])
    if (d.status === "info_requested" || d.status === "resolved" || d.status === "final_decision")
      reminders.push({
        id: `dispute-${d.id}`,
        icon: Scales,
        title: t(
          d.status === "info_requested"
            ? "dashboard.reminders.disputeQuestion"
            : "dashboard.reminders.disputeAnswer",
        ),
        when: `${short(d.created_at)} · ${d.facility_name}`,
        who: d.patient_display_name,
        to: paths.dispute(d.id),
        action: t("dashboard.reminders.openDispute"),
      });
  for (const v of visits.data?.results ?? [])
    if (arrivalKey(v) === "notYet" && v.state === "waiting")
      reminders.push({
        id: `arrive-${v.visit_id}`,
        icon: PersonSimpleWalk,
        title: t("dashboard.reminders.arrive", { ticket: v.ticket_number }),
        when: v.facility_name,
        who: v.patient_display_name,
        to: paths.ticket(v.visit_id),
        action: t("dashboard.reminders.open"),
      });
  return reminders;
}

function Attention() {
  const { t } = useTranslation();
  const reminders = useReminders();
  // the three most pressing first; the rest one tap away, so the card stays short (audit 2026-11-16)
  const [all, setAll] = useState(false);
  const shown = all ? reminders : reminders.slice(0, 3);
  const hidden = reminders.length - shown.length;
  return (
    <WidgetCard id="attention" title={t("dashboard.overview.attention.title")} className="h-full">
      {reminders.length ? (
        <>
          <ul className="m-0 flex list-none flex-col divide-y divide-border p-0">
            {shown.map((r) => (
              <li key={r.id} className="flex items-center gap-3 px-4 py-3.5 sm:px-5">
                <span
                  aria-hidden="true"
                  className="grid size-9 shrink-0 place-items-center rounded-lg bg-attention-bg text-attention"
                >
                  <r.icon weight="bold" className="size-5" />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <p className="m-0 text-body-sm font-semibold text-pretty text-fg">{r.title}</p>
                  <p className="m-0 text-caption text-fg-secondary tabular-nums">
                    {[r.when, r.who].filter(Boolean).join(" · ")}
                  </p>
                </div>
                {/* one small button per row, not an underlined link under the text */}
                <Link
                  to={r.to}
                  className={buttonClassName({
                    variant: "secondary",
                    size: "sm",
                    className: "shrink-0",
                  })}
                >
                  {r.action}
                </Link>
              </li>
            ))}
          </ul>
          {hidden > 0 && (
            <button
              type="button"
              onClick={() => setAll(true)}
              className="m-0 cursor-pointer border-0 border-t border-border bg-transparent px-5 py-3 text-left text-body-sm font-semibold text-link hover:bg-subtle"
            >
              {t("dashboard.overview.attention.more", { count: hidden })}
            </button>
          )}
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-5 py-8 text-center">
          <span
            aria-hidden="true"
            className="grid size-12 place-items-center rounded-full bg-success-bg text-success"
          >
            <CheckCircle weight="duotone" className="size-7" />
          </span>
          <p className="m-0 font-semibold text-fg">{t("dashboard.overview.attention.allSet")}</p>
        </div>
      )}
    </WidgetCard>
  );
}

// ---- 3. at a glance ---------------------------------------------------------------------------

function AtAGlance() {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage ?? "rw";
  const short = useShortDate();
  const upcoming = useUpcoming();
  const medicines = useActiveMedicines();
  const records = useRecords();
  const unread = useUnreadCount();
  const rows = (upcoming.data?.results ?? []).filter(live);
  const next = rows[0];
  const lastRecord = records.data?.results[0];
  const firstMedicine = medicines.data?.results[0];
  const unreadCount = unread.data?.unread;
  // a failed count reads as a dash, never as a false zero
  const value = (count: number | undefined, isError: boolean) => (isError ? null : count);
  return (
    <nav aria-label={t("dashboard.overview.glance.label")}>
      <ul
        className={cx(
          panelClass,
          "m-0 grid list-none grid-cols-2 overflow-hidden p-0 lg:grid-cols-4",
          "[&>li]:border-border [&>li:nth-child(odd)]:border-r [&>li:nth-child(-n+2)]:border-b",
          "lg:[&>li]:border-r lg:[&>li:last-child]:border-r-0 lg:[&>li:nth-child(-n+2)]:border-b-0",
        )}
      >
        <li>
          <StatCard
            to={paths.appointments}
            icon={CalendarCheck}
            tone="brand"
            label={t("dashboard.overview.glance.upcoming")}
            value={value(upcoming.data ? rows.length : undefined, upcoming.isError)}
            hint={
              next
                ? `${day(next.starts_at, lang, "short")} · ${time(next.starts_at, lang)}`
                : undefined
            }
          />
        </li>
        <li>
          <StatCard
            to={paths.medications}
            icon={Pill}
            tone="violet"
            label={t("dashboard.overview.glance.medicines")}
            value={value(medicines.data?.count, medicines.isError)}
            hint={firstMedicine?.facility_name}
          />
        </li>
        <li>
          <StatCard
            to={paths.records}
            icon={FileText}
            tone="info"
            label={t("dashboard.overview.glance.records")}
            value={value(records.data?.count, records.isError)}
            hint={lastRecord ? short(lastRecord.service_date) : undefined}
          />
        </li>
        <li>
          <StatCard
            to={paths.notifications}
            icon={ChatCircleDots}
            tone="attention"
            label={t("dashboard.overview.glance.unread")}
            value={value(unreadCount, unread.isError)}
          />
        </li>
      </ul>
    </nav>
  );
}

// ---- 4. main column ---------------------------------------------------------------------------

function UpcomingCard() {
  const { t } = useTranslation();
  const upcoming = useUpcoming();
  const profiles = useProfiles();
  const rows = (upcoming.data?.results ?? []).filter(live).slice(0, 3);
  return (
    <WidgetCard
      id="upcoming"
      title={t("dashboard.overview.upcoming")}
      action={{ to: paths.appointments, label: t("dashboard.viewAll") }}
    >
      {upcoming.isPending ? (
        <CardSkeleton />
      ) : upcoming.isError ? (
        <CardError
          message={t("dashboard.appointments.failed")}
          onRetry={() => void upcoming.refetch()}
        />
      ) : rows.length ? (
        <RowList bare label={t("dashboard.overview.upcoming")}>
          {rows.map((b) => (
            <AppointmentRow
              key={b.id}
              booking={b}
              showWho={(profiles.data?.results.length ?? 0) > 1}
            />
          ))}
        </RowList>
      ) : (
        <CardEmpty
          icon={CalendarCheck}
          title={t("dashboard.appointments.empty.upcoming")}
          action={
            <Link
              to={`${paths.findCare}?mode=booking`}
              className={buttonClassName({ variant: "secondary", size: "sm" })}
            >
              {t("dashboard.overview.actions.book")}
            </Link>
          }
        />
      )}
    </WidgetCard>
  );
}

/** The last signed visit records, plain-language diagnosis first (as on the Records page). */
function RecentVisitsCard() {
  const { t } = useTranslation();
  const records = useRecords();
  const profiles = useProfiles();
  const people = profiles.data?.results ?? [];
  const nameOf = (id: string) => people.find((p) => p.patient_id === id)?.display_name;
  const rows = (records.data?.results ?? []).slice(0, 3);
  return (
    <WidgetCard
      id="visits"
      title={t("dashboard.overview.visits.title")}
      action={{ to: paths.records, label: t("dashboard.viewAll") }}
    >
      {records.isPending ? (
        <CardSkeleton />
      ) : records.isError ? (
        <CardError message={t("records.loadFailed")} onRetry={() => void records.refetch()} />
      ) : rows.length ? (
        <RowList bare label={t("dashboard.overview.visits.title")}>
          {rows.map((r) => {
            const main = r.diagnoses[0];
            return (
              <RowLink
                key={r.id}
                to={paths.record(r.id)}
                leading={<DateBlock iso={r.service_date} />}
                title={main ? main.plain_language || main.display : r.facility_name}
                meta={[
                  main ? r.facility_name : null,
                  t("records.doctor", { name: r.doctor_name }),
                  people.length > 1 ? nameOf(r.patient_id) : null,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              />
            );
          })}
        </RowList>
      ) : (
        <CardEmpty icon={FileText} title={t("dashboard.overview.visits.empty")} />
      )}
    </WidgetCard>
  );
}

// ---- 4. side column ---------------------------------------------------------------------------

/**
 * The measurements from the account holder's latest signed record, as recorded. No value is
 * judged high or low here; the doctor explains them.
 */
function LatestMeasurementsCard() {
  const { t } = useTranslation();
  const api = useApi();
  const short = useShortDate();
  const profiles = useProfiles();
  const records = useRecords();
  const selfId = profiles.data?.results.find((p) => p.relationship === "self")?.patient_id;
  const latest = (records.data?.results ?? []).find((r) => r.patient_id === selfId);
  const record = useQuery({
    queryKey: recordsKeys.detail(latest?.id ?? ""),
    queryFn: () => api.clinical.patient.record(latest!.id),
    enabled: Boolean(latest),
  });
  const reading = [...(record.data?.vitals ?? [])].sort((a, b) =>
    b.recorded_at.localeCompare(a.recorded_at),
  )[0];
  const tiles = reading
    ? [
        {
          key: "bp",
          value:
            reading.systolic_mmhg != null && reading.diastolic_mmhg != null
              ? `${reading.systolic_mmhg}/${reading.diastolic_mmhg}`
              : null,
          unit: "mmHg",
        },
        { key: "pulse", value: reading.pulse_bpm, unit: "bpm" },
        { key: "temperature", value: reading.temperature_c, unit: "°C" },
        { key: "spo2", value: reading.spo2_pct, unit: "%" },
        { key: "weight", value: reading.weight_kg, unit: "kg" },
        { key: "respiratory", value: reading.respiratory_rate, unit: "/min" },
      ].filter((tile) => tile.value != null && tile.value !== "")
    : [];
  const loading = profiles.isPending || records.isPending || (Boolean(latest) && record.isPending);
  // nothing measured yet: no card on the overview (an empty "No measurements yet" took the space)
  if (!loading && !records.isError && !record.isError && !(tiles.length && latest)) return null;

  return (
    <WidgetCard
      id="measurements"
      title={t("dashboard.overview.vitals.title")}
      action={
        latest ? { to: paths.record(latest.id), label: t("dashboard.viewDetails") } : undefined
      }
    >
      {loading ? (
        <div className="grid grid-cols-2 gap-3 p-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} height="4rem" className="rounded-xl" />
          ))}
        </div>
      ) : records.isError || record.isError ? (
        <CardError
          message={t("records.loadFailed")}
          onRetry={() => void (records.isError ? records.refetch() : record.refetch())}
        />
      ) : tiles.length && latest ? (
        <>
          <dl className="m-0 grid grid-cols-2 gap-px bg-border">
            {tiles.map((tile) => (
              <div key={tile.key} className="flex flex-col gap-1 bg-surface px-4 py-3.5">
                <dt className="text-caption font-semibold text-fg-muted">
                  {t(`dashboard.overview.vitals.${tile.key}`)}
                </dt>
                <dd className="m-0 flex items-baseline gap-1">
                  <span className="font-heading text-h3 leading-none font-bold text-fg tabular-nums">
                    {tile.value}
                  </span>
                  <span className="text-caption text-fg-muted">{tile.unit}</span>
                </dd>
              </div>
            ))}
          </dl>
          <div className="flex items-start gap-2 border-t border-border bg-subtle/50 px-4 py-3 text-caption text-fg-secondary">
            <Heartbeat
              aria-hidden="true"
              weight="duotone"
              className="mt-px size-4 shrink-0 text-brand"
            />
            <span className="tabular-nums">
              {short(latest.service_date)} · {latest.facility_name}
            </span>
          </div>
        </>
      ) : (
        <CardEmpty icon={Heartbeat} title={t("dashboard.overview.vitals.empty")} />
      )}
    </WidgetCard>
  );
}

function MedicinesCard() {
  const { t } = useTranslation();
  const short = useShortDate();
  const medicines = useActiveMedicines();
  const rows = (medicines.data?.results ?? []).slice(0, 3);
  return (
    <WidgetCard
      id="medicines"
      title={t("dashboard.overview.medicines.title")}
      action={{ to: paths.medications, label: t("dashboard.viewAll") }}
    >
      {medicines.isPending ? (
        <CardSkeleton rows={1} />
      ) : medicines.isError ? (
        <CardError message={t("medicines.failed")} onRetry={() => void medicines.refetch()} />
      ) : rows.length ? (
        <RowList bare label={t("dashboard.overview.medicines.title")}>
          {rows.map((row) => (
            <RowLink
              key={row.id}
              to={paths.medication(row.id)}
              leading={<RowIcon icon={Pill} />}
              title={t("dashboard.overview.medicines.items", { count: row.item_count })}
              meta={[
                row.facility_name,
                t("dashboard.overview.medicines.until", { date: short(row.expires_at) }),
              ].join(" · ")}
            />
          ))}
        </RowList>
      ) : (
        <CardEmpty icon={Pill} title={t("dashboard.overview.medicines.empty")} />
      )}
    </WidgetCard>
  );
}

function FamilyCard() {
  const { t } = useTranslation();
  const profiles = useProfiles();
  const list = profiles.data?.results ?? [];
  return (
    <WidgetCard
      id="family"
      title={t("dashboard.overview.family")}
      action={{ to: paths.family, label: t("dashboard.overview.manage") }}
    >
      {profiles.isPending ? (
        <CardSkeleton rows={1} />
      ) : list.length < 2 ? (
        <CardEmpty
          icon={UsersThree}
          title={t("dashboard.overview.familyEmpty")}
          action={
            <Link
              to={paths.family}
              className={buttonClassName({ variant: "secondary", size: "sm" })}
            >
              {t("dashboard.family.add")}
            </Link>
          }
        />
      ) : (
        <RowList bare label={t("dashboard.overview.family")}>
          {list.map((p) => (
            <RowLink
              key={p.patient_id}
              to={
                p.relationship === "self"
                  ? paths.profileOf(p.patient_id)
                  : paths.member(p.patient_id)
              }
              leading={<Avatar name={p.display_name} src={p.avatar_url} />}
              title={p.display_name}
              meta={t(`profile.relationship.${p.relationship}`)}
            />
          ))}
        </RowList>
      )}
    </WidgetCard>
  );
}

export function HomePage() {
  const { t, i18n } = useTranslation();
  const { data: me } = usePatientMe();
  if (!me) return null;
  const now = new Date();
  const today = dateFormat(i18n.resolvedLanguage ?? "rw", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Africa/Kigali",
  }).format(now);

  return (
    <div className="ml-stagger flex flex-col gap-6 lg:gap-8">
      <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="flex min-w-0 flex-col gap-2">
          {/* the same date line as the staff Today (audit 2026-11-16) */}
          <p className="m-0 text-caption font-semibold tracking-wider text-fg-muted uppercase">
            {today}
          </p>
          <PageHeading
            title={t("dashboard.nav.overview")}
            className="font-heading text-h1 font-bold tracking-tight text-balance text-fg"
          >
            {t(`dashboard.overview.greeting_${partOfDay(now)}`, { name: firstName(me.full_name) })}
          </PageHeading>
        </div>
        {/* Find care is in the menu; the header keeps the one action people come for */}
        <div className="hidden shrink-0 gap-2 md:flex">
          <Link
            to={`${paths.findCare}?mode=booking`}
            className={buttonClassName({ className: "shadow-card" })}
          >
            <CalendarPlus aria-hidden="true" weight="bold" className="size-4" />
            {t("dashboard.overview.actions.book")}
          </Link>
        </div>
      </header>

      {!me.email_verified && (
        <Alert tone="warning" title={t("dashboard.overview.verifyTitle")}>
          {t("dashboard.overview.verifyBody", { email: me.email })}
        </Alert>
      )}

      {/* one banner at a time: confirm the email first, then the alerts (audit 2026-11-16) */}
      {me.email_verified && <PushOffBanner />}

      <div className="grid items-stretch gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <Journey />
        <Attention />
      </div>

      <AtAGlance />

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="flex min-w-0 flex-col gap-6">
          <UpcomingCard />
          <RecentVisitsCard />
        </div>
        <aside className="flex min-w-0 flex-col gap-6" aria-label={t("dashboard.overview.aside")}>
          <LatestMeasurementsCard />
          <MedicinesCard />
          <FamilyCard />
          <EmergencyNotice />
        </aside>
      </div>
    </div>
  );
}
