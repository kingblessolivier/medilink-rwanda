import {
  isApiError,
  type Booking,
  type Hold,
  type PatientVisit,
  type PublicFacility,
  type PublicService,
  type PublicSlot,
  type Symptom,
} from "@medilink/api-client";
import {
  ArrowLeft,
  Buildings,
  CalendarCheck,
  CalendarPlus,
  Check,
  Clock,
  NavigationArrow,
  PersonSimpleWalk,
  Siren,
  Timer,
} from "@phosphor-icons/react";
import {
  Alert,
  BODY_SYSTEM_ORDER,
  Button,
  buttonClassName,
  Card,
  cx,
  EmptyState,
  LoadingState,
  SelectField,
  Skeleton,
  SymptomPicker as SharedSymptomPicker,
  TextareaField,
} from "@medilink/ui";
import { dateFormat, kigaliDate } from "@medilink/ui/i18n";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";

import { paths } from "../../app/paths";
import { useApi } from "../../app/services";
import { PageHeading } from "../../components/PageHeading";
import { EmergencyNotice } from "../../layout/EmergencyNotice";
import { Avatar } from "../dashboard/kit";
import { useProfiles, useRelationshipLabel } from "../profile/ProfileLayout";
import { trackerKey } from "../tracker/TrackerPage";
import { day, isMorning, pick, time } from "./discovery";

type Step = "who" | "what" | "when" | "reason" | "review";
export const bookingsKey = ["booking", "mine"] as const;

function useCountdown(until: string | null): number {
  const [left, setLeft] = useState(() => (until ? Date.parse(until) - Date.now() : 0));
  useEffect(() => {
    if (!until) return;
    const tick = () => setLeft(Date.parse(until) - Date.now());
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [until]);
  return Math.max(0, left);
}

/** "We're holding this time for 4:32" (design 07 §3.2). The live region speaks once a minute. */
function HoldTimer({ hold, onExpired }: { hold: Hold; onExpired: () => void }) {
  const { t } = useTranslation();
  const left = useCountdown(hold.expires_at);
  const minutes = Math.floor(left / 60_000);
  const seconds = Math.floor((left % 60_000) / 1000);
  const expired = left <= 0;
  useEffect(() => {
    if (expired) onExpired();
  }, [expired, onExpired]);
  return (
    <p
      className={cx(
        "m-0 flex items-center gap-2 rounded-md px-3 py-2 font-semibold",
        minutes < 1 ? "bg-warning-bg text-fg" : "bg-brand-subtle text-on-brand-subtle",
      )}
    >
      <Timer aria-hidden="true" weight="bold" className="size-5 shrink-0" />
      <span aria-hidden="true" className="tabular-nums">
        {t("booking.flow.holding", { time: `${minutes}:${String(seconds).padStart(2, "0")}` })}
      </span>
      <span className="sr-only" role="status">
        {t("booking.flow.holdingMinutes", { count: Math.max(minutes, 1) })}
      </span>
    </p>
  );
}

/** Labelled stepper: done steps show a check, the current one is filled; words, not colour alone. */
function Stepper({ steps, step }: { steps: Step[]; step: number }) {
  const { t } = useTranslation();
  return (
    <ol
      aria-label={t("booking.flow.steps.label")}
      className="m-0 flex list-none items-center gap-1 overflow-x-auto p-0 [scrollbar-width:none]"
    >
      {steps.map((key, i) => {
        const n = i + 1;
        const state = n < step ? "done" : n === step ? "current" : "next";
        return (
          <li
            key={key}
            aria-current={state === "current" ? "step" : undefined}
            className="flex shrink-0 items-center gap-1"
          >
            {i > 0 && (
              <span
                aria-hidden="true"
                className={cx("h-px w-4 sm:w-8", n <= step ? "bg-primary" : "bg-border")}
              />
            )}
            <span
              className={cx(
                "inline-flex items-center gap-2 rounded-full py-1 pr-3 pl-1 text-body-sm font-semibold whitespace-nowrap",
                state === "current" ? "bg-brand-subtle text-on-brand-subtle" : "text-fg-muted",
                state === "done" && "text-fg-secondary",
              )}
            >
              <span
                aria-hidden="true"
                className={cx(
                  "grid size-6 place-items-center rounded-full text-caption font-bold tabular-nums",
                  state === "next"
                    ? "border border-border bg-surface"
                    : "bg-primary text-on-primary",
                )}
              >
                {state === "done" ? <Check weight="bold" className="size-3.5" /> : n}
              </span>
              {t(`booking.flow.steps.${key}`)}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function StepFrame({
  steps,
  step,
  title,
  onBack,
  children,
}: {
  steps: Step[];
  step: number;
  title: string;
  onBack?: () => void;
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, [title]);
  return (
    <section aria-labelledby="book-step" className="flex flex-col gap-5">
      <Stepper steps={steps} step={step} />
      <div className="flex flex-col gap-5 rounded-2xl border border-border bg-surface p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-caption font-semibold text-fg-muted">
              {t("booking.flow.step", { step, total: steps.length })}
            </span>
            <h2 id="book-step" ref={heading} tabIndex={-1} className="m-0 text-h2 outline-none">
              {title}
            </h2>
          </div>
          {onBack && (
            <Button
              variant="ghost"

              onClick={onBack}
              iconStart={<ArrowLeft aria-hidden="true" className="size-4" />}
            >
              {t("common.back")}
            </Button>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}

/** Wide screens: what has been chosen so far, beside the step (filled in as the person goes). */
function Summary({
  facility,
  rows,
}: {
  facility: PublicFacility;
  rows: [label: string, value: string | null][];
}) {
  const { t } = useTranslation();
  const place = [facility.sector, facility.district].filter(Boolean).join(", ");
  return (
    <aside
      aria-labelledby="book-summary"
      className="hidden self-start overflow-hidden rounded-2xl border border-border bg-surface lg:sticky lg:top-24 lg:block"
    >
      <div className="flex items-center gap-3 border-b border-border px-5 py-4">
        <span
          aria-hidden="true"
          className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-subtle text-brand"
        >
          <Buildings weight="duotone" className="size-5" />
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="truncate font-semibold text-fg">{facility.name}</span>
          {place && <span className="truncate text-caption text-fg-muted">{place}</span>}
        </span>
      </div>
      <h2 id="book-summary" className="sr-only">
        {t("booking.flow.summary")}
      </h2>
      <dl className="m-0 flex flex-col divide-y divide-border">
        {rows.map(([label, value]) => (
          <div key={label} className="flex flex-col gap-0.5 px-5 py-3">
            <dt className="text-caption font-semibold text-fg-muted">{label}</dt>
            <dd
              className={cx(
                "m-0 text-body-sm first-letter:uppercase",
                value ? "font-semibold text-fg" : "text-fg-muted",
              )}
            >
              {value ?? t("booking.flow.notChosen")}
            </dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}

function ChoiceCard({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cx(
        "flex min-h-16 w-full cursor-pointer items-center gap-4 rounded-xl border bg-surface p-4 text-left text-fg",
        "transition-[border-color,background-color,box-shadow] duration-150 ease-out-quint",
        selected
          ? "border-primary bg-brand-subtle shadow-[inset_0_0_0_1px_var(--color-primary)]"
          : "border-border hover:border-border-input hover:bg-subtle/50",
      )}
    >
      {children}
      <span
        aria-hidden="true"
        className={cx(
          "ml-auto grid size-6 shrink-0 place-items-center rounded-full border transition-colors duration-150",
          selected ? "border-primary bg-primary text-on-primary" : "border-border-input",
        )}
      >
        {selected && <Check weight="bold" className="size-3.5" />}
      </span>
    </button>
  );
}

function WhenStep({
  facility,
  service,
  doctor,
  onAnyDoctor,
  onHeld,
  onJoinToday,
  joining,
  preferred = null,
}: {
  facility: PublicFacility;
  service: PublicService;
  /** "Book this doctor" from the facility page: only this doctor's times. */
  doctor: { membership_id: string; name: string } | null;
  onAnyDoctor: () => void;
  onHeld: (slot: PublicSlot, hold: Hold) => void;
  onJoinToday: () => void;
  joining: boolean;
  /** A time tapped on the doctor's page: its day opens, and one tap keeps it. */
  preferred?: { date: string; slotId: string } | null;
}) {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage ?? "rw";
  const api = useApi();
  const [start, setStart] = useState(0);
  const [now] = useState(() => Date.now());
  const date = kigaliDate(new Date(now + start * 86_400_000));
  const week = useQuery({
    queryKey: [
      "discovery",
      "slots",
      facility.slug,
      service.id,
      date,
      doctor?.membership_id ?? null,
    ],
    queryFn: () =>
      api.booking.slots(facility.slug, {
        service_id: service.id,
        date,
        membership_id: doctor?.membership_id ?? null,
      }),
  });
  const days = week.data?.days ?? [];
  const [chosenDay, setChosenDay] = useState<string | null>(preferred?.date ?? null);
  const activeDay =
    days.find((d) => d.date === chosenDay) ?? days.find((d) => d.slots.length) ?? days[0];
  const [taken, setTaken] = useState<PublicSlot[] | null>(null);
  const hold = useMutation({
    mutationFn: (slot: PublicSlot) => api.booking.hold(slot.id).then((h) => ({ slot, h })),
    onSuccess: ({ slot, h }) => onHeld(slot, h),
    onError: (error) => {
      if (isApiError(error) && error.status === 409) {
        setTaken((error.extra.alternatives as PublicSlot[] | undefined) ?? []);
        void week.refetch();
      }
    },
  });

  const groups = activeDay
    ? [
        { key: "morning", slots: activeDay.slots.filter((s) => isMorning(s.starts_at)) },
        { key: "afternoon", slots: activeDay.slots.filter((s) => !isMorning(s.starts_at)) },
      ].filter((g) => g.slots.length)
    : [];

  const doctors = [...new Set((activeDay?.slots ?? []).map((s) => s.doctor).filter(Boolean))];
  // the time tapped on the doctor's page, if it is still free once the week has loaded
  const wanted = preferred
    ? days.flatMap((d) => d.slots).find((s) => s.id === preferred.slotId && s.open_places > 0)
    : undefined;
  const chip = (slot: PublicSlot) => (
    <li key={slot.id}>
      <button
        type="button"
        onClick={() => hold.mutate(slot)}
        disabled={hold.isPending}
        className={cx(
          "flex min-h-target min-w-24 cursor-pointer flex-col items-center justify-center rounded-md border bg-surface px-3 py-1.5 font-semibold tabular-nums text-fg hover:border-brand hover:bg-brand-subtle disabled:cursor-wait disabled:opacity-60",
          slot.id === wanted?.id
            ? "border-primary shadow-[0_0_0_1px_var(--color-primary)]"
            : "border-border-input",
        )}
      >
        {time(slot.starts_at, lang)}
        {slot.doctor && doctors.length > 1 && (
          <span className="max-w-28 truncate text-caption font-normal text-fg-muted">
            {slot.doctor}
          </span>
        )}
      </button>
    </li>
  );

  return (
    <div className="flex flex-col gap-5">
      {doctor && (
        <p className="m-0 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg bg-brand-subtle px-4 py-3 text-on-brand-subtle">
          <span className="font-semibold">{t("booking.flow.with", { doctor: doctor.name })}</span>
          <button
            type="button"
            onClick={onAnyDoctor}
            className="cursor-pointer font-semibold text-link underline underline-offset-4"
          >
            {t("booking.flow.anyDoctor")}
          </button>
        </p>
      )}
      {/* the time chosen on the doctor's page: kept in one tap, or said plainly when it is gone */}
      {preferred &&
        !taken &&
        week.isSuccess &&
        (wanted ? (
          <div className="flex flex-col gap-3 rounded-lg bg-brand-subtle px-4 py-3 text-on-brand-subtle sm:flex-row sm:items-center sm:justify-between">
            <p className="m-0 flex flex-col">
              <span className="text-body-sm">{t("booking.flow.pickedTitle")}</span>
              <span className="font-heading text-h3 font-bold tabular-nums">
                {day(wanted.starts_at, lang)} · {time(wanted.starts_at, lang)}
              </span>
            </p>
            <Button onClick={() => hold.mutate(wanted)} loading={hold.isPending}>
              {t("booking.flow.pickedKeep")}
            </Button>
          </div>
        ) : (
          <Alert tone="warning" role="status" title={t("booking.flow.takenTitle")}>
            {t("booking.flow.takenNone")}
          </Alert>
        ))}
      {service.remote_join && (
        <Card className="flex flex-col gap-3 border-2 border-brand sm:flex-row sm:items-center">
          <PersonSimpleWalk
            aria-hidden="true"
            weight="duotone"
            className="size-10 shrink-0 text-brand"
          />
          <div className="flex flex-1 flex-col gap-1">
            <h3 className="m-0 text-h3">{t("booking.flow.joinTitle")}</h3>
            <p className="m-0 text-fg-secondary">{t("booking.flow.joinBody")}</p>
          </div>
          <Button onClick={onJoinToday} loading={joining}>
            {t("booking.facility.join")}
          </Button>
        </Card>
      )}
      {taken && (
        <Alert tone="warning" role="alert" title={t("booking.flow.takenTitle")}>
          {taken.length > 0 ? (
            <div className="mt-2 flex flex-col gap-2">
              <span>{t("booking.flow.takenBody")}</span>
              <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                {taken.map((s) => (
                  <li key={s.id}>
                    <Button variant="secondary" size="md" onClick={() => hold.mutate(s)}>
                      {day(s.starts_at, lang, "short")} · {time(s.starts_at, lang)}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            t("booking.flow.takenNone")
          )}
        </Alert>
      )}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="md"
          disabled={start === 0}
          onClick={() => setStart(Math.max(0, start - 7))}
          aria-label={t("booking.flow.earlier")}
          iconStart={<ArrowLeft aria-hidden="true" className="size-icon" />}
        />
        <ul
          aria-label={t("booking.flow.days")}
          className="m-0 grid flex-1 list-none grid-cols-7 gap-1 p-0"
        >
          {week.isPending
            ? Array.from({ length: 7 }, (_, i) => (
                <li key={i}>
                  <Skeleton height="4.5rem" className="rounded-md" />
                </li>
              ))
            : days.map((d) => {
                const active = d.date === activeDay?.date;
                const empty = d.slots.length === 0;
                return (
                  <li key={d.date}>
                    <button
                      type="button"
                      aria-pressed={active}
                      disabled={empty}
                      onClick={() => setChosenDay(d.date)}
                      className={cx(
                        "flex min-h-[4.5rem] w-full cursor-pointer flex-col items-center justify-center gap-0.5 rounded-md border text-center",
                        active
                          ? "border-brand bg-brand text-on-primary"
                          : "border-border bg-surface text-fg hover:border-brand",
                        empty && "cursor-not-allowed border-dashed opacity-50",
                      )}
                    >
                      <span className="text-caption font-semibold uppercase">
                        {dateFormat(lang, {
                          weekday: "short",
                          timeZone: "Africa/Kigali",
                        }).format(new Date(`${d.date}T12:00:00+02:00`))}
                      </span>
                      <span className="font-heading text-h3 tabular-nums">
                        {Number(d.date.slice(8))}
                      </span>
                      <span
                        className={cx("text-caption", active ? "text-on-primary" : "text-fg-muted")}
                      >
                        {empty ? "–" : t("booking.flow.free", { count: d.slots.length })}
                      </span>
                    </button>
                  </li>
                );
              })}
        </ul>
        <Button
          variant="ghost"
          size="md"
          disabled={start >= 21}
          onClick={() => setStart(start + 7)}
          aria-label={t("booking.flow.later")}
          iconStart={<ArrowLeft aria-hidden="true" className="size-icon rotate-180" />}
        />
      </div>
      {activeDay && (
        <div className="flex flex-col gap-4">
          <p className="m-0 font-semibold first-letter:uppercase">
            {day(activeDay.date, lang)}
            {doctors.length === 1 && (
              <span className="font-normal text-fg-secondary">
                {" · "}
                {t("booking.flow.with", { doctor: doctors[0] })}
              </span>
            )}
          </p>
          {groups.length === 0 ? (
            <p className="m-0 text-fg-secondary">{t("booking.flow.noTimes")}</p>
          ) : (
            groups.map((g) => (
              <div key={g.key} className="flex flex-col gap-2">
                <h3 className="m-0 text-body font-semibold text-fg-secondary">
                  {t(`booking.flow.${g.key}`)}
                </h3>
                <ul className="m-0 flex list-none flex-wrap gap-2 p-0">{g.slots.map(chip)}</ul>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function SymptomPicker({
  symptoms,
  chosen,
  onToggle,
}: {
  symptoms: Symptom[];
  chosen: Set<string>;
  onToggle: (code: string) => void;
}) {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage ?? "rw";
  return (
    <SharedSymptomPicker
      size="lg"
      legend={t("booking.flow.symptoms")}
      items={symptoms.map((s) => ({
        code: s.code,
        label: pick(s.name_i18n, lang),
        group: s.body_system,
        redFlag: s.is_red_flag,
      }))}
      groups={BODY_SYSTEM_ORDER.map((key) => ({
        key,
        label: t(`booking.body.${key}`, { defaultValue: key }),
      }))}
      chosen={chosen}
      onToggle={onToggle}
    />
  );
}

function Success({ booking }: { booking: Booking }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage ?? "rw";
  const api = useApi();
  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <span className="inline-flex size-20 items-center justify-center rounded-full bg-brand-subtle text-brand">
        <CalendarCheck aria-hidden="true" weight="duotone" className="size-11" />
      </span>
      <PageHeading title={t("booking.flow.doneTitle")}>{t("booking.flow.doneTitle")}</PageHeading>
      <p className="m-0 max-w-[30rem] text-fg-secondary">
        {t("booking.flow.doneBody", {
          facility: booking.facility_name,
          day: day(booking.starts_at, lang),
          time: time(booking.starts_at, lang),
        })}
      </p>
      <div className="flex flex-col items-center gap-1 rounded-lg border-2 border-dashed border-brand px-8 py-4">
        <span className="text-body-sm font-semibold text-fg-muted">{t("booking.flow.code")}</span>
        <span className="font-mono text-display font-bold tracking-[0.2em] tabular-nums">
          {booking.booking_code}
        </span>
      </div>
      <div className="flex w-full max-w-[30rem] flex-col gap-3">
        <a
          href={api.booking.icsUrl(booking.id)}
          download
          className={buttonClassName({ variant: "secondary", size: "lg", fullWidth: true })}
        >
          <CalendarPlus aria-hidden="true" className="size-icon" />
          {t("booking.flow.addToCalendar")}
        </a>
        <Link
          to={paths.facility(booking.facility_slug)}
          className={buttonClassName({ variant: "ghost", fullWidth: true })}
        >
          <NavigationArrow aria-hidden="true" className="size-icon" />
          {t("booking.flow.directions")}
        </Link>
        <Link
          to={paths.appointment(booking.id)}
          className={buttonClassName({ size: "lg", fullWidth: true })}
        >
          {t("dashboard.appointments.view")}
        </Link>
      </div>
    </div>
  );
}

/**
 * Booking flow (design 07 §3.2): one decision per screen. Who → What (when the facility has more
 * than one service) → When (day strip and time chips, or join today's queue) → Reason (symptom
 * chips; a red flag shows the emergency notice) → Review (insurance, your share, cancellation
 * rule) → Success. The step, the person and the service are in the URL (`step`, `who`, `what`),
 * so browser Back goes to the previous step and a refresh keeps the place; symptoms and the
 * reason stay in memory only (health data never goes in a URL). The chosen time is held for 5
 * minutes; without a hold (after a refresh) the flow returns to choosing a time.
 */
export function BookPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage ?? "rw";
  const api = useApi();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { slug = "" } = useParams();
  const [params, setParams] = useSearchParams();
  /** Update the draft in the URL; a new step is a new history entry, so Back works. */
  const setDraft = (changes: Record<string, string | null>, push = false) =>
    setParams(
      (current) => {
        const next = new URLSearchParams(current);
        for (const [name, value] of Object.entries(changes))
          if (value === null) next.delete(name);
          else next.set(name, value);
        return next;
      },
      { replace: !push },
    );
  const facility = useQuery({
    queryKey: ["discovery", "facility", slug],
    queryFn: () => api.booking.facility(slug),
  });
  const symptoms = useQuery({
    queryKey: ["discovery", "symptoms"],
    queryFn: () => api.booking.symptoms(),
  });
  const profiles = useProfiles();
  const relationship = useRelationshipLabel();
  const own = (profiles.data?.results ?? []).filter((p) => p.relationship !== "delegate");
  const requested = params.get("step") as Step | null;
  const setStep = (next: Step) => setDraft({ step: next }, true);
  const chosenPatient = own.some((p) => p.patient_id === params.get("who"))
    ? params.get("who")
    : null;
  const setPatientId = (id: string) => setDraft({ who: id });
  // one profile: chosen for you (no extra tap)
  const patientId = chosenPatient ?? (own.length === 1 ? own[0]!.patient_id : null);
  const serviceId = params.get("what") ?? params.get("service");
  const setServiceId = (id: string) => setDraft({ what: id });
  const [slot, setSlot] = useState<PublicSlot | null>(null);
  const [hold, setHold] = useState<Hold | null>(null);
  const [expired, setExpired] = useState(false);
  const [chosen, setChosen] = useState<Set<string>>(new Set());
  const [reason, setReason] = useState("");
  const [insurance, setInsurance] = useState("");
  const [done, setDone] = useState<Booking | null>(null);
  const key = useRef(crypto.randomUUID());

  const insurances = useQuery({
    queryKey: ["profile", "insurance", patientId],
    queryFn: () => api.profile.insurance(patientId!),
    enabled: Boolean(patientId),
  });

  const book = useMutation({
    mutationFn: () =>
      api.booking.book(
        {
          hold_id: hold!.hold_id,
          patient_id: patientId!,
          insurance_profile_id: insurance || null,
          symptoms: [...chosen].map((code) => ({ code })),
          reason_text: reason.trim(),
        },
        key.current,
      ),
    onSuccess: (booking) => {
      setDone(booking);
      void queryClient.invalidateQueries({ queryKey: bookingsKey });
    },
  });
  const join = useMutation({
    mutationFn: () =>
      api.booking.remoteJoin(
        { facility_slug: slug, service_id: serviceId!, patient_id: patientId! },
        key.current,
      ),
    onSuccess: (visit) => {
      // the tracker reads today's visits from the cache: add the new ticket before opening it
      queryClient.setQueryData<{ results: PatientVisit[] }>(trackerKey, (old) => ({
        results: [...(old?.results ?? []).filter((v) => v.visit_id !== visit.visit_id), visit],
      }));
      void queryClient.invalidateQueries({ queryKey: trackerKey });
      void navigate(paths.ticket(visit.visit_id));
    },
  });

  if (facility.isPending || profiles.isPending) return <LoadingState className="min-h-[50vh]" />;
  if (facility.isError || !facility.data)
    return (
      <EmptyState
        icon={Clock}
        title={t("booking.facility.notFound")}
        action={
          <Link to="/find-care" className={buttonClassName({})}>
            {t("booking.facility.backToSearch")}
          </Link>
        }
      />
    );
  if (done)
    return (
      <div className="mx-auto w-full max-w-[40rem] py-4">
        <Success booking={done} />
      </div>
    );

  const f = facility.data;
  const bookable = f.services.filter((s) => s.bookable || s.remote_join);
  const service =
    bookable.find((s) => s.id === serviceId) ?? (bookable.length === 1 ? bookable[0] : undefined);
  const steps: Step[] = [
    "who",
    ...(bookable.length > 1 && !params.get("service") ? (["what"] as const) : []),
    "when",
    "reason",
    "review",
  ];
  // a step whose earlier answers are missing (refresh, shared link) falls back to the first gap
  const ready: Record<Step, boolean> = {
    who: true,
    what: Boolean(patientId),
    when: Boolean(patientId && service),
    reason: Boolean(patientId && service && hold),
    review: Boolean(patientId && service && hold && chosen.size),
  };
  const wanted = requested && steps.includes(requested) ? requested : "who";
  let step: Step = "who";
  for (const s of steps.slice(0, steps.indexOf(wanted) + 1)) {
    if (!ready[s]) break;
    step = s;
  }
  const index = steps.indexOf(step) + 1;
  const back = index > 1 ? () => setStep(steps[index - 2]!) : undefined;
  const patient = own.find((p) => p.patient_id === patientId);
  const redFlag = (symptoms.data ?? []).some((s) => s.is_red_flag && chosen.has(s.code));
  const card = (insurances.data?.results ?? []).find((c) => c.id === insurance);
  // U-01: only whether the insurer is accepted; amounts appear on the bill after the visit
  const accepted = card ? service?.insurers.includes(card.insurer_code) : null;

  const header = (
    <div className="flex flex-col gap-1">
      <p className="m-0 text-body-sm font-semibold text-fg-muted">{f.name}</p>
      <PageHeading title={t("booking.flow.title")}>{t("booking.flow.title")}</PageHeading>
    </div>
  );
  const summary: [string, string | null][] = [
    [t("booking.flow.forWho"), patient?.display_name ?? null],
    [t("booking.flow.service"), service ? pick(service.name_i18n, lang) : null],
    [
      t("booking.flow.whenLabel"),
      slot ? `${day(slot.starts_at, lang)} · ${time(slot.starts_at, lang)}` : null,
    ],
    ...(slot?.doctor ? [[t("booking.flow.doctor"), slot.doctor] as [string, string]] : []),
  ];

  return (
    // the steps, with what has been chosen beside them on wide screens
    <div className="mx-auto grid w-full max-w-[64rem] items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="flex min-w-0 flex-col gap-6">
        {header}
        {hold && step !== "when" && !expired && (
          <HoldTimer hold={hold} onExpired={() => setExpired(true)} />
        )}
        {expired && (
          <Alert tone="warning" role="alert" title={t("booking.flow.expiredTitle")}>
            <Button
              variant="secondary"
              onClick={() => {
                setExpired(false);
                setHold(null);
                setSlot(null);
                setStep("when");
              }}
            >
              {t("booking.flow.chooseAgain")}
            </Button>
          </Alert>
        )}

        {step === "who" && (
          <StepFrame steps={steps} step={index} title={t("booking.flow.who")}>
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {own.map((p) => (
                <li key={p.patient_id}>
                  <ChoiceCard
                    selected={patientId === p.patient_id}
                    onClick={() => setPatientId(p.patient_id)}
                  >
                    <Avatar name={p.display_name} />
                    <span className="flex flex-col">
                      <span className="font-semibold">{p.display_name}</span>
                      <span className="text-body-sm text-fg-muted">
                        {relationship(p.relationship)}
                      </span>
                    </span>
                  </ChoiceCard>
                </li>
              ))}
            </ul>
            <Link to={paths.family} className="font-semibold">
              {t("booking.flow.addPerson")}
            </Link>
            <Button
              size="lg"
              fullWidth
              disabled={!patientId}
              onClick={() => setStep(steps[index]!)}
            >
              {t("common.continue")}
            </Button>
          </StepFrame>
        )}

        {step === "what" && (
          <StepFrame steps={steps} step={index} title={t("booking.flow.what")} onBack={back}>
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {bookable.map((s) => (
                <li key={s.id}>
                  <ChoiceCard selected={serviceId === s.id} onClick={() => setServiceId(s.id)}>
                    <span className="flex flex-1 flex-col">
                      <span className="font-semibold">{pick(s.name_i18n, lang)}</span>
                    </span>
                  </ChoiceCard>
                </li>
              ))}
            </ul>
            <Button size="lg" fullWidth disabled={!service} onClick={() => setStep("when")}>
              {t("common.continue")}
            </Button>
          </StepFrame>
        )}

        {step === "when" && service && (
          <StepFrame steps={steps} step={index} title={t("booking.flow.when")} onBack={back}>
            <WhenStep
              facility={f}
              service={service}
              doctor={f.doctors.find((d) => d.membership_id === params.get("doctor")) ?? null}
              onAnyDoctor={() => {
                const next = new URLSearchParams(params);
                next.delete("doctor");
                setParams(next, { replace: true });
              }}
              joining={join.isPending}
              onJoinToday={() => join.mutate()}
              preferred={
                params.get("slot") && params.get("date")
                  ? { date: params.get("date")!, slotId: params.get("slot")! }
                  : null
              }
              onHeld={(s, h) => {
                if (hold && hold.hold_id !== h.hold_id)
                  void api.booking.release(hold.hold_id).catch(() => undefined);
                setSlot(s);
                setHold(h);
                setExpired(false);
                setStep("reason");
              }}
            />
            {join.isError && (
              <Alert tone="danger" role="alert">
                {isApiError(join.error) ? join.error.message : t("booking.flow.failed")}
              </Alert>
            )}
          </StepFrame>
        )}

        {step === "reason" && (
          <StepFrame steps={steps} step={index} title={t("booking.flow.reason")} onBack={back}>
            <p className="m-0 text-fg-secondary">{t("booking.flow.reasonHint")}</p>
            {symptoms.data ? (
              <SymptomPicker
                symptoms={symptoms.data}
                chosen={chosen}
                onToggle={(code) =>
                  setChosen((current) => {
                    const next = new Set(current);
                    if (next.has(code)) next.delete(code);
                    else if (next.size < 5) next.add(code);
                    return next;
                  })
                }
              />
            ) : (
              <Skeleton height="10rem" className="rounded-lg" />
            )}
            {redFlag && (
              <div role="alert" className="flex items-start gap-3 rounded-md bg-danger-bg p-4">
                <Siren
                  aria-hidden="true"
                  weight="bold"
                  className="mt-0.5 size-6 shrink-0 text-danger"
                />
                <p className="m-0">
                  <strong className="text-danger">{t("booking.flow.redFlagTitle")}</strong>{" "}
                  {t("booking.flow.redFlagBody")}
                </p>
              </div>
            )}
            <TextareaField
              label={t("booking.flow.more")}
              hint={t("booking.flow.moreHint")}
              maxLength={500}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <Button
              size="lg"
              fullWidth
              disabled={chosen.size === 0}
              onClick={() => setStep("review")}
            >
              {t("common.continue")}
            </Button>
          </StepFrame>
        )}

        {step === "review" && slot && service && (
          <StepFrame steps={steps} step={index} title={t("booking.flow.review")} onBack={back}>
            <Card className="flex flex-col gap-0 divide-y divide-border p-0">
              {[
                [t("booking.flow.forWho"), patient?.display_name ?? ""],
                [t("booking.flow.where"), f.name],
                [t("booking.flow.service"), pick(service.name_i18n, lang)],
                [
                  t("booking.flow.whenLabel"),
                  `${day(slot.starts_at, lang)} · ${time(slot.starts_at, lang)}`,
                ],
                ...(slot.doctor ? [[t("booking.flow.doctor"), slot.doctor]] : []),
              ].map(([label, value]) => (
                <div key={label} className="flex flex-wrap justify-between gap-2 px-5 py-3">
                  <span className="text-fg-secondary">{label}</span>
                  <span className="font-semibold first-letter:uppercase">{value}</span>
                </div>
              ))}
            </Card>
            <SelectField
              label={t("booking.flow.insurance")}
              value={insurance}
              onChange={(e) => setInsurance(e.target.value)}
            >
              <option value="">{t("booking.flow.noInsurance")}</option>
              {(insurances.data?.results ?? [])
                .filter((c) => c.is_active)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.insurer_display}
                  </option>
                ))}
            </SelectField>
            {card && accepted === false && (
              <Alert tone="warning">
                {t("booking.flow.notAccepted", { insurer: card.insurer_display })}
              </Alert>
            )}
            <p className="m-0 text-body-sm text-fg-secondary">{t("booking.flow.cancelRule")}</p>
            {book.isError && (
              <Alert tone="danger" role="alert" title={t("booking.flow.failed")}>
                {isApiError(book.error) ? book.error.message : null}
              </Alert>
            )}
            <Button
              size="lg"
              fullWidth
              loading={book.isPending}
              disabled={expired}
              onClick={() => book.mutate()}
            >
              {t("booking.flow.confirm")}
            </Button>
            <EmergencyNotice />
          </StepFrame>
        )}
      </div>
      <Summary facility={f} rows={summary} />
    </div>
  );
}
