import type { PublicSlot } from "@medilink/api-client";
import {
  ArrowRight,
  Buildings,
  CalendarBlank,
  CalendarCheck,
  CaretRight,
  Crosshair,
  Stethoscope,
  Sun,
  SunHorizon,
  Translate,
} from "@phosphor-icons/react";
import { Button, buttonClassName, cx, StatusPill } from "@medilink/ui";
import { dateFormat, formatDate, kigaliDate } from "@medilink/ui/i18n";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router";

import { useApi } from "../../app/services";
import { PublicLayout } from "../../layout/PublicLayout";
import { DISTRICT_CODES, day, isMorning, pick, time, type DistrictKey } from "../booking/discovery";
import {
  FILTER,
  FilterSelect,
  sortResults,
  SortSelect,
  TYPES,
  useNearMe,
  type Sort,
} from "../booking/Places";
import { FacilityEntries, FacilityExplorer } from "./FacilityDirectory";
import {
  categoryOf,
  doctorsOf,
  parseDoctorSlug,
  SERVICE_CATEGORIES,
  type CatalogueService,
  serviceCode,
  serviceSlug,
  useCatalogue,
  useDoctors,
  useFacilitiesOffering,
  useFacilityPages,
} from "./data";
import {
  type ActiveFilter,
  EmptyState,
  ErrorState,
  FilterBar,
  LoadingRows,
  LocationSelector,
  NotFoundState,
  PageContainer,
  PageHeader,
  Panel,
  SearchBar,
  SectionTitle,
} from "./kit";
import { canonicalUrl, siteOrigin } from "./seo";

const WEEKDAY_BASE = Date.UTC(2024, 0, 1); // a Monday

function weekday(index: number, language: string, style: "short" | "long" = "short") {
  // dateFormat: Kinyarwanda day names in every browser (#9)
  return dateFormat(language, { weekday: style, timeZone: "UTC" }).format(
    new Date(WEEKDAY_BASE + index * 86_400_000),
  );
}

/** "Mon–Fri", "Mon–Wed · Sat": consecutive days read as a range. */
const daysText = (days: number[], language: string) => {
  const sorted = [...new Set(days)].sort((a, b) => a - b);
  const runs: number[][] = [];
  for (const day of sorted) {
    const last = runs.at(-1);
    if (last && day === last[last.length - 1]! + 1) last.push(day);
    else runs.push([day]);
  }
  return runs
    .map((run) =>
      run.length >= 3
        ? `${weekday(run[0]!, language)}–${weekday(run[run.length - 1]!, language)}`
        : run.map((d) => weekday(d, language)).join(" · "),
    )
    .join(" · ");
};

// ---- /facilities ----

/** Facility directory (upgrade 11 §5): search, location, type, service, open now, load more. */
export function FacilitiesPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage ?? "rw";
  const [text, setText] = useState("");
  const [where, setWhere] = useState<DistrictKey | "">("");
  const [type, setType] = useState("");
  const [service, setService] = useState("");
  const [openNow, setOpenNow] = useState(false);
  const [sort, setSort] = useState<Sort>("open");
  const { near, setNear, locating, locate } = useNearMe(() => setSort("nearest"));
  const catalogue = useCatalogue(lang);
  const pages = useFacilityPages({
    district_code: !near && where ? DISTRICT_CODES[where] : undefined,
    service_code: service || undefined,
    open_now: openNow || undefined,
    near,
  });
  const words = text.trim().toLowerCase();
  const rows = sortResults(
    (pages.data?.pages.flatMap((p) => p.results) ?? []).filter(
      (r) => (!type || r.type === type) && (!words || r.name.toLowerCase().includes(words)),
    ),
    sort === "nearest" && !near ? "open" : sort,
  );
  const total = pages.data?.pages[0]?.count ?? 0;
  const clear = () => {
    setText("");
    setWhere("");
    setType("");
    setService("");
    setOpenNow(false);
    setNear(null);
  };
  const serviceName = catalogue.data?.find((s) => s.code === service)?.name ?? service;
  // what is filtering the list now, each removable on its own
  const active: ActiveFilter[] = [
    ...(near ? [{ key: "near", label: t("home.nearYou"), onRemove: () => setNear(null) }] : []),
    ...(where
      ? [{ key: "where", label: t(`landing.districts.${where}`), onRemove: () => setWhere("") }]
      : []),
    ...(type
      ? [{ key: "type", label: t(`booking.types.${type}`), onRemove: () => setType("") }]
      : []),
    ...(service ? [{ key: "service", label: serviceName, onRemove: () => setService("") }] : []),
    ...(openNow
      ? [{ key: "open", label: t("home.openNow"), onRemove: () => setOpenNow(false) }]
      : []),
  ];

  return (
    <PublicLayout>
      <PageContainer className="pb-20">
        <PageHeader crumbs={[{ label: t("nav.facilities") }]} title={t("site.facilities.title")} />
        <div className="flex flex-col gap-6">
          <FilterBar
            search={
              <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_14rem]">
                <SearchBar
                  id="facility-search"
                  label={t("site.searchLabel")}
                  value={text}
                  onChange={setText}
                  placeholder={t("site.searchPlaceholder")}
                />
                <LocationSelector id="facility-location" value={where} onChange={setWhere} />
              </div>
            }
            filters={
              <>
                <button
                  type="button"
                  aria-pressed={near !== null}
                  onClick={locate}
                  disabled={locating === "busy"}
                  className={cx(FILTER, "inline-flex items-center gap-1.5")}
                >
                  <Crosshair
                    aria-hidden="true"
                    className={cx("size-4", locating === "busy" && "animate-spin")}
                  />
                  {near ? t("home.nearYou") : t("home.nearMe")}
                </button>
                <FilterSelect
                  id="facility-type"
                  label={t("site.facilities.type")}
                  value={type}
                  onChange={setType}
                >
                  <option value="">{t("home.anyType")}</option>
                  {TYPES.map((key) => (
                    <option key={key} value={key}>
                      {t(`booking.types.${key}`)}
                    </option>
                  ))}
                </FilterSelect>
                <FilterSelect
                  id="facility-service"
                  label={t("site.facilities.service")}
                  value={service}
                  onChange={setService}
                >
                  <option value="">{t("site.facilities.anyService")}</option>
                  {(catalogue.data ?? []).map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.name}
                    </option>
                  ))}
                </FilterSelect>
                <button
                  type="button"
                  aria-pressed={openNow}
                  onClick={() => setOpenNow((on) => !on)}
                  className={FILTER}
                >
                  {t("home.openNow")}
                </button>
              </>
            }
            active={active}
            onClear={clear}
            count={
              pages.isSuccess
                ? t("site.facilities.count", { count: type || words ? rows.length : total })
                : undefined
            }
            sort={
              <SortSelect id="facility-sort" value={sort} onChange={setSort} near={near !== null} />
            }
          />
          {locating === "denied" && (
            <p role="status" className="m-0 text-body-sm text-fg-secondary">
              {t("home.locationDenied")}
            </p>
          )}

          <FacilityExplorer
            headingLevel={2}
            label={t("site.facilities.title")}
            rows={rows}
            loading={pages.isPending}
            fetching={pages.isFetching && !pages.isFetchingNextPage}
            failed={pages.isError}
            onRetry={() => void pages.refetch()}
            near={near}
            empty={
              <EmptyState
                title={t("site.facilities.none")}
                action={
                  <Button variant="secondary" pill onClick={clear}>
                    {t("site.facilities.clear")}
                  </Button>
                }
              />
            }
          />
          {pages.hasNextPage && !type && !words && (
            <Button
              variant="secondary"
              pill
              className="self-center"
              loading={pages.isFetchingNextPage}
              onClick={() => void pages.fetchNextPage()}
            >
              {t("site.facilities.loadMore")}
            </Button>
          )}
        </div>
      </PageContainer>
    </PublicLayout>
  );
}

// ---- /doctors ----

/**
 * One doctor in the directory (public design brief 2026-11-04): the name as a link, what they do,
 * where they work, and the days they are there in words. No avatar, no day chips: a list a person
 * reads down, like a hospital's own staff directory.
 */
function DoctorEntry({
  doctor,
  today,
}: {
  doctor: ReturnType<typeof useDoctors>["doctors"][number];
  today: number;
}) {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage ?? "rw";
  const here = doctor.days.includes(today);
  const work = [doctor.specialty, ...doctor.services.map((s) => pick(s.name, lang))]
    .filter(Boolean)
    .join(" · ");
  const initials = initialsOf(doctor.name);
  return (
    // a profile card (upgrade 14 §3): the initials in a ring, who, where, the days; the whole card
    // answers the pointer, the name is the link
    // phones: a compact row (initials, who, where, "here today"); wider: a card with the days
    <li className="ml-card group/row relative flex min-w-0 flex-row items-center gap-3 rounded-panel bg-surface p-4 sm:flex-col sm:items-stretch sm:gap-4 sm:p-5">
      <span
        aria-hidden="true"
        className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-subtle font-heading text-body-sm font-bold text-on-brand-subtle sm:size-14 sm:text-body"
      >
        {initials}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5 sm:gap-1">
        {/* h2: the list sits right under the page's <h1> */}
        <h2 className="m-0 font-heading text-[1.125rem] leading-snug font-bold">
          <Link
            to={`/doctors/${doctor.slug}`}
            viewTransition
            className="text-fg no-underline transition-colors duration-150 after:absolute after:inset-0 after:content-[''] group-hover/row:text-link"
          >
            {doctor.name}
          </Link>
        </h2>
        {work && <p className="m-0 truncate text-body-sm text-fg sm:whitespace-normal">{work}</p>}
        <p className="m-0 truncate text-body-sm text-fg-secondary sm:whitespace-normal">
          {doctor.facilities.length > 1
            ? t("site.doctors.places", {
                name: doctor.facility.name,
                count: doctor.facilities.length - 1,
              })
            : doctor.facility.name}
          {doctor.facility.district && ` · ${doctor.facility.district}`}
        </p>
      </div>
      {here && (
        <span className="shrink-0 sm:hidden">
          <StatusPill tone="open">{t("site.doctors.today")}</StatusPill>
        </span>
      )}
      <div className="hidden flex-wrap items-center gap-2 border-t border-hairline pt-4 text-body-sm sm:flex">
        <span className="rounded-md bg-page px-2 py-0.5 font-semibold text-fg tabular-nums shadow-e1">
          <span className="sr-only">{t("site.doctors.days")}: </span>
          {daysText(doctor.days, lang)}
        </span>
        {here && <StatusPill tone="open">{t("site.doctors.today")}</StatusPill>}
      </div>
    </li>
  );
}

/**
 * Doctor directory (upgrade 11 §5). Public doctor data comes from facility profiles until a
 * directory endpoint exists (upgrade 11 §13): name, facility, services and the days present.
 * Never patients or bookings.
 */
export function DoctorsPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage ?? "rw";
  const { doctors, facilities, isPending, isError, refetch } = useDoctors();
  const [text, setText] = useState("");
  const [service, setService] = useState("");
  const [facility, setFacility] = useState("");
  const [todayOnly, setTodayOnly] = useState(false);
  const todayIndex = (new Date(`${kigaliDate()}T00:00:00Z`).getUTCDay() + 6) % 7;

  const services = useMemo(() => {
    const map = new Map<string, string>();
    for (const doctor of doctors)
      for (const s of doctor.services) map.set(s.code, pick(s.name, lang));
    return [...map].sort((a, b) => a[1].localeCompare(b[1]));
  }, [doctors, lang]);

  const words = text.trim().toLowerCase();
  const rows = doctors.filter(
    (d) =>
      (!words || d.name.toLowerCase().includes(words)) &&
      (!service || d.services.some((s) => s.code === service)) &&
      (!facility || d.facilities.some((f) => f.slug === facility)) &&
      (!todayOnly || d.days.includes(todayIndex)),
  );

  return (
    <PublicLayout>
      <PageContainer className="pb-16">
        <PageHeader crumbs={[{ label: t("nav.doctors") }]} title={t("site.doctors.title")} />
        <div className="flex flex-col gap-6">
          <FilterBar
            search={
              <SearchBar
                id="doctor-search"
                label={t("site.doctors.searchName")}
                value={text}
                onChange={setText}
                placeholder={t("site.doctors.searchName")}
              />
            }
            filters={
              <>
                <FilterSelect
                  id="doctor-service"
                  label={t("site.doctors.specialty")}
                  value={service}
                  onChange={setService}
                >
                  <option value="">{t("site.doctors.anySpecialty")}</option>
                  {services.map(([code, name]) => (
                    <option key={code} value={code}>
                      {name}
                    </option>
                  ))}
                </FilterSelect>
                <FilterSelect
                  id="doctor-facility"
                  label={t("site.doctors.facility")}
                  value={facility}
                  onChange={setFacility}
                >
                  <option value="">{t("site.doctors.anyFacility")}</option>
                  {facilities.map((f) => (
                    <option key={f.slug} value={f.slug}>
                      {f.name}
                    </option>
                  ))}
                </FilterSelect>
                <button
                  type="button"
                  aria-pressed={todayOnly}
                  onClick={() => setTodayOnly((on) => !on)}
                  className={FILTER}
                >
                  {t("site.doctors.today")}
                </button>
              </>
            }
            active={[
              ...(service
                ? [
                    {
                      key: "service",
                      label: services.find(([c]) => c === service)?.[1] ?? service,
                      onRemove: () => setService(""),
                    },
                  ]
                : []),
              ...(facility
                ? [
                    {
                      key: "facility",
                      label: facilities.find((x) => x.slug === facility)?.name ?? facility,
                      onRemove: () => setFacility(""),
                    },
                  ]
                : []),
              ...(todayOnly
                ? [
                    {
                      key: "today",
                      label: t("site.doctors.today"),
                      onRemove: () => setTodayOnly(false),
                    },
                  ]
                : []),
            ]}
            onClear={() => {
              setText("");
              setService("");
              setFacility("");
              setTodayOnly(false);
            }}
            count={isPending ? undefined : t("site.doctors.count", { count: rows.length })}
          />
          {isPending || isError || rows.length === 0 ? (
            <Panel as="div" className="overflow-hidden">
              {isPending ? (
                <LoadingRows rows={6} />
              ) : isError ? (
                <ErrorState onRetry={refetch} />
              ) : (
                <EmptyState title={t("site.doctors.none")} />
              )}
            </Panel>
          ) : (
            <div className="@container">
              <ul
                aria-label={t("site.doctors.title")}
                className="ml-stagger m-0 grid list-none gap-3 p-0 sm:gap-5 @xl:grid-cols-2 @5xl:grid-cols-3 @7xl:grid-cols-4"
              >
                {rows.map((d) => (
                  <DoctorEntry key={d.slug} doctor={d} today={todayIndex} />
                ))}
              </ul>
            </div>
          )}
          <p className="m-0 text-caption text-fg-muted">{t("site.doctors.source")}</p>
        </div>
      </PageContainer>
    </PublicLayout>
  );
}

// ---- /doctors/:slug ----

/** Doctor profile (upgrade 11 §5): who, where, services and a day-by-day picker of free times. */
/** Initials as a quiet mark, never a photo (no faces published). */
function initialsOf(name: string): string {
  return name
    .replace(/^(Dr|Midwife)\.?\s+/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

/** One fact on the doctor's profile card: an icon, a small label, the value. */
function ProfileFact({
  icon: FactIcon,
  label,
  children,
}: {
  icon: typeof Buildings;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-3 py-3.5">
      <FactIcon
        aria-hidden="true"
        weight="duotone"
        className="mt-0.5 size-5 shrink-0 text-primary"
      />
      <div className="flex min-w-0 flex-col gap-0.5">
        <dt className="text-caption font-semibold tracking-wide text-fg-muted uppercase">
          {label}
        </dt>
        <dd className="m-0 text-fg">{children}</dd>
      </div>
    </div>
  );
}

/** A link inside the profile card: dark text, a caret, the brand colour only on hover. */
const FACT_LINK =
  "group inline-flex items-center gap-1 font-semibold text-fg no-underline transition-colors duration-150 hover:text-primary";

export function DoctorPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage ?? "rw";
  const api = useApi();
  const { slug = "" } = useParams();
  const parsed = parseDoctorSlug(slug);
  const profile = useQuery({
    queryKey: ["discovery", "facility", parsed?.facility ?? ""],
    queryFn: () => api.booking.facility(parsed!.facility),
    enabled: parsed !== null,
  });
  const doctor = profile.data
    ? doctorsOf(profile.data).find((d) => d.membershipId === parsed?.membership)
    : undefined;
  const firstService = doctor?.services[0];
  const slots = useQuery({
    queryKey: ["discovery", "doctor-slots", slug, firstService?.code],
    queryFn: () =>
      api.booking.slots(parsed!.facility, {
        service_id: firstService!.id,
        date: kigaliDate(),
        membership_id: parsed!.membership,
      }),
    enabled: Boolean(doctor && firstService),
  });
  const [picked, setPicked] = useState<string | null>(null);
  const strip = useRef<HTMLDivElement>(null);
  const days = slots.data?.days ?? [];
  const activeDay =
    days.find((d) => d.date === picked) ?? days.find((d) => d.slots.length > 0) ?? days[0];
  // phones: the strip scrolls sideways, so bring the chosen day into view (past full days first)
  useEffect(() => {
    const row = strip.current;
    const chosen = row?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (row && chosen && row.scrollWidth > row.clientWidth)
      row.scrollTo({ left: chosen.offsetLeft - row.offsetLeft - 8, behavior: "smooth" });
  }, [activeDay?.date]);

  if (parsed === null || profile.isError || (profile.isSuccess && !doctor)) {
    return (
      <PublicLayout>
        <PageContainer narrow>
          <NotFoundState
            title={t("site.doctor.notFound")}
            reason={t("site.doctor.notFoundReason")}
            back={{ to: "/doctors", label: t("site.doctor.allDoctors") }}
          />
        </PageContainer>
      </PublicLayout>
    );
  }

  const free = (list: PublicSlot[]) => list.filter((s) => s.open_places > 0);
  const lead = doctor
    ? [doctor.specialty, ...doctor.services.map((s) => pick(s.name, lang))]
        .filter(Boolean)
        .join(" · ")
    : undefined;
  const at = profile.data;

  return (
    <PublicLayout>
      <PageContainer className="pb-16">
        <PageHeader
          crumbs={[{ to: "/doctors", label: t("nav.doctors") }, { label: doctor?.name ?? "…" }]}
          title={doctor?.name ?? "…"}
          lead={lead}
          description={doctor && at ? `${lead ? `${lead} · ` : ""}${at.name}` : undefined}
          jsonLd={
            doctor && at
              ? {
                  "@context": "https://schema.org",
                  "@type": "Physician",
                  name: doctor.name,
                  ...(doctor.specialty && { medicalSpecialty: doctor.specialty }),
                  url: canonicalUrl(siteOrigin(), `/doctors/${slug}`),
                  worksFor: { "@type": "MedicalOrganization", name: at.name },
                }
              : null
          }
        />
        {profile.isPending || !doctor ? (
          <Panel as="div">
            <LoadingRows rows={3} />
          </Panel>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)]">
            <Panel as="aside" className="self-start overflow-hidden">
              {/* who: the initials, the name, what they do */}
              <div className="flex items-center gap-4 border-b border-hairline bg-[linear-gradient(160deg,var(--color-brand-subtle),var(--color-surface)_70%)] p-6">
                <span
                  aria-hidden="true"
                  className="grid size-16 shrink-0 place-items-center rounded-full bg-surface font-heading text-h3 font-bold text-on-brand-subtle shadow-e1"
                >
                  {initialsOf(doctor.name)}
                </span>
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="m-0 font-heading text-h3 leading-tight font-bold text-fg">
                    {doctor.name}
                  </p>
                  {doctor.days.includes(
                    (new Date(`${kigaliDate()}T00:00:00Z`).getUTCDay() + 6) % 7,
                  ) && (
                    <StatusPill tone="open" live>
                      {t("site.doctors.today")}
                    </StatusPill>
                  )}
                </div>
              </div>
              <dl className="m-0 flex flex-col divide-y divide-hairline px-6 py-2">
                <ProfileFact icon={Buildings} label={t("site.doctors.facility")}>
                  <Link
                    to={`/facilities/${doctor.facility.slug}`}
                    viewTransition
                    className={FACT_LINK}
                  >
                    {doctor.facility.name}
                    <CaretRight aria-hidden="true" className="size-3.5 text-fg-muted" />
                  </Link>
                  <span className="block text-body-sm text-fg-secondary">
                    {doctor.facility.district}
                  </span>
                </ProfileFact>
                <ProfileFact icon={Stethoscope} label={t("site.doctor.worksIn")}>
                  <ul className="m-0 flex list-none flex-col gap-1 p-0">
                    {doctor.services.map((s) => (
                      <li key={s.code}>
                        <Link
                          to={`/services/${serviceSlug(s.code)}`}
                          viewTransition
                          className={FACT_LINK}
                        >
                          {pick(s.name, lang)}
                          <CaretRight aria-hidden="true" className="size-3.5 text-fg-muted" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </ProfileFact>
                <ProfileFact icon={CalendarBlank} label={t("site.doctor.presentDays")}>
                  <span className="font-semibold">{daysText(doctor.days, lang)}</span>
                </ProfileFact>
                {doctor.languages.length > 0 && (
                  <ProfileFact icon={Translate} label={t("site.doctor.languages")}>
                    <span className="font-semibold">
                      {doctor.languages
                        .map((code) => t(`site.doctor.spoken.${code}`, { defaultValue: code }))
                        .join(" · ")}
                    </span>
                  </ProfileFact>
                )}
              </dl>
            </Panel>

            <div className="flex min-w-0 flex-col gap-6">
              {pick(doctor.bio, lang) && (
                <Panel aria-labelledby="about-doctor" className="flex flex-col gap-3 p-6">
                  <SectionTitle id="about-doctor">{t("site.doctor.about")}</SectionTitle>
                  <p className="m-0 whitespace-pre-line text-fg">{pick(doctor.bio, lang)}</p>
                </Panel>
              )}
              <Panel aria-labelledby="availability" className="flex flex-col gap-5 p-6">
                <SectionTitle id="availability">{t("site.doctor.availability")}</SectionTitle>
                {!firstService ? (
                  <p className="m-0 text-fg-secondary">{t("site.doctor.noTimes")}</p>
                ) : slots.isPending ? (
                  <LoadingRows rows={2} />
                ) : slots.isError ? (
                  <ErrorState onRetry={() => void slots.refetch()} />
                ) : (
                  <>
                    {/*
                     * the week as a calendar strip: weekday, the date large, the month; a dot and
                     * the count under it. The chosen day is filled; full days step back.
                     */}
                    <div
                      ref={strip}
                      role="group"
                      aria-label={t("site.doctor.pickDay")}
                      className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-1 sm:grid sm:grid-cols-7 sm:overflow-visible"
                    >
                      {days.map((d) => {
                        const count = free(d.slots).length;
                        const selected = d.date === activeDay?.date;
                        const part = (o: Intl.DateTimeFormatOptions) =>
                          formatDate(`${d.date}T12:00:00Z`, lang, o);
                        return (
                          <button
                            key={d.date}
                            type="button"
                            aria-pressed={selected}
                            aria-label={`${day(d.date, lang, "long")}: ${
                              count ? t("site.doctor.free", { count }) : t("site.doctor.full")
                            }`}
                            onClick={() => setPicked(d.date)}
                            className={cx(
                              "group/day flex min-w-[4.75rem] shrink-0 snap-start cursor-pointer flex-col items-center gap-0.5 rounded-xl px-2 pt-2.5 pb-2 transition-[background-color,box-shadow,color,transform] duration-200 ease-out active:scale-[0.97] sm:min-w-0",
                              selected
                                ? "bg-primary text-on-primary shadow-e2"
                                : count
                                  ? "bg-surface text-fg shadow-[inset_0_0_0_1px_var(--site-hairline)] hover:shadow-[inset_0_0_0_1px_var(--color-primary)]"
                                  : "bg-page text-fg-muted shadow-[inset_0_0_0_1px_transparent]",
                            )}
                          >
                            <span
                              className={cx(
                                "text-caption font-semibold tracking-wide uppercase",
                                selected ? "text-on-primary/80" : "text-fg-muted",
                              )}
                            >
                              {part({ weekday: "short" })}
                            </span>
                            <span className="font-heading text-h2 leading-none font-bold tabular-nums">
                              {part({ day: "numeric" })}
                            </span>
                            <span
                              className={cx(
                                "text-caption",
                                selected ? "text-on-primary/80" : "text-fg-muted",
                              )}
                            >
                              {part({ month: "short" })}
                            </span>
                            <span
                              aria-hidden="true"
                              className={cx(
                                "mt-1.5 inline-flex items-center gap-1 text-caption font-semibold tabular-nums",
                                selected
                                  ? "text-on-primary"
                                  : count
                                    ? "text-primary"
                                    : "text-fg-muted",
                              )}
                            >
                              <span
                                className={cx(
                                  "size-1.5 rounded-full",
                                  selected
                                    ? "bg-on-primary"
                                    : count
                                      ? "bg-primary"
                                      : "bg-fg-muted/40",
                                )}
                              />
                              {count ? count : t("site.doctor.full")}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    {activeDay && free(activeDay.slots).length > 0 ? (
                      <div key={activeDay.date} className="flex animate-enter flex-col gap-4">
                        <p className="m-0 text-body-sm text-fg-secondary">
                          <span className="font-semibold text-fg">
                            {day(activeDay.date, lang, "long")}
                          </span>
                          {" · "}
                          {t("site.doctor.free", { count: free(activeDay.slots).length })}
                        </p>
                        {/* free times by part of day; tap one to book it */}
                        <div className="grid gap-4 sm:grid-cols-2">
                          {(
                            [
                              { key: "morning", icon: SunHorizon, morning: true },
                              { key: "afternoon", icon: Sun, morning: false },
                            ] as const
                          ).map((group) => {
                            const list = free(activeDay.slots).filter(
                              (slot) => isMorning(slot.starts_at) === group.morning,
                            );
                            if (list.length === 0) return null;
                            return (
                              <section
                                key={group.key}
                                aria-label={t(`booking.flow.${group.key}`)}
                                className="flex flex-col gap-2.5 rounded-xl bg-page p-3.5"
                              >
                                <h3 className="m-0 inline-flex items-center gap-1.5 text-caption font-semibold tracking-wide text-fg-secondary uppercase">
                                  <group.icon
                                    aria-hidden="true"
                                    className="size-4 text-attention"
                                  />
                                  {t(`booking.flow.${group.key}`)}
                                  <span className="font-normal text-fg-muted tabular-nums">
                                    · {list.length}
                                  </span>
                                </h3>
                                <ul className="m-0 grid list-none grid-cols-3 gap-1.5 p-0 lg:grid-cols-4">
                                  {list.map((slot) => (
                                    <li key={slot.id}>
                                      {/* a time is a way in: booking opens on it, one tap keeps it */}
                                      <Link
                                        to={`/book/${doctor.facility.slug}?doctor=${doctor.membershipId}&service=${firstService.id}&date=${activeDay.date}&slot=${slot.id}`}
                                        viewTransition
                                        aria-label={`${t("site.doctor.bookAt", {
                                          time: time(slot.starts_at, lang),
                                        })}`}
                                        className="ml-press flex min-h-10 items-center justify-center rounded-lg bg-surface text-body-sm font-semibold text-fg no-underline tabular-nums shadow-e1 transition-[background-color,color,box-shadow] duration-150 ease-out hover:bg-primary hover:text-on-primary hover:shadow-e2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                                      >
                                        {time(slot.starts_at, lang)}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </section>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <p className="m-0 rounded-xl bg-page px-4 py-6 text-center text-fg-secondary">
                        {t("site.doctor.noTimes")}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-4">
                      <p className="m-0 text-caption text-fg-muted">{t("site.doctor.privacy")}</p>
                      <Link
                        to={`/book/${doctor.facility.slug}?doctor=${doctor.membershipId}&service=${firstService.id}`}
                        viewTransition
                        className={buttonClassName({
                          pill: true,
                          className: "ml-press w-full sm:w-auto",
                        })}
                      >
                        <CalendarCheck aria-hidden="true" className="size-5" />
                        {t("site.doctor.book")}
                      </Link>
                    </div>
                  </>
                )}
              </Panel>
            </div>
          </div>
        )}
      </PageContainer>
    </PublicLayout>
  );
}

// ---- /services ----

/**
 * Services directory (upgrade 11 §5; public design brief 2026-11-04): the public catalogue as an
 * index, the way a hospital lists its departments. Categories in a column on the left to jump
 * to; each category a heading over its services as links on one surface with hairlines.
 */
export function ServicesPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage ?? "rw";
  const catalogue = useCatalogue(lang);
  const [text, setText] = useState("");
  const words = text.trim().toLowerCase();
  const items = (catalogue.data ?? []).filter(
    (s) => !words || s.name.toLowerCase().includes(words),
  );
  const categories = SERVICE_CATEGORIES.map(({ key }) => ({
    key,
    services: items.filter((s) => s.category === key),
  })).filter((c) => c.services.length > 0);

  return (
    <PublicLayout>
      <PageContainer className="pb-16">
        <PageHeader crumbs={[{ label: t("nav.services") }]} title={t("site.services.title")} />
        <div className="grid gap-x-12 gap-y-8 lg:grid-cols-[15rem_minmax(0,1fr)]">
          <div className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
            <SearchBar
              id="service-search"
              label={t("site.services.search")}
              value={text}
              onChange={setText}
              placeholder={t("site.services.search")}
            />
            {/* jump to a category; the page glides there (base.css smooth scrolling) */}
            {categories.length > 0 && (
              <nav aria-label={t("site.services.jump")}>
                <ul className="m-0 flex list-none flex-wrap gap-x-5 p-0 lg:flex-col lg:border-l lg:border-border">
                  {categories.map(({ key, services }) => (
                    <li key={key}>
                      <a
                        href={`#cat-${key}`}
                        className="flex min-h-target items-center justify-between gap-3 text-body-sm font-semibold text-link no-underline hover:underline lg:-ml-px lg:border-l lg:border-transparent lg:pl-4 lg:hover:border-fg-muted"
                      >
                        {t(`site.services.categories.${key}`)}
                        <span className="font-normal text-fg-muted tabular-nums">
                          {services.length}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>

          <div className="flex min-w-0 flex-col gap-10">
            {catalogue.isPending ? (
              <Panel as="div">
                <LoadingRows rows={5} />
              </Panel>
            ) : catalogue.isError ? (
              <Panel as="div">
                <ErrorState onRetry={() => void catalogue.refetch()} />
              </Panel>
            ) : categories.length === 0 ? (
              <Panel as="div">
                <EmptyState title={t("site.services.none")} />
              </Panel>
            ) : (
              // one card per category, packed in two columns (no gaps under short cards): the category's own icon on
              // the card, its services as quiet rows (no repeated generic icon on every row)
              <div className="gap-5 md:columns-2 [&>*]:mb-5 [&>*]:break-inside-avoid">
                {categories.map(({ key, services }) => {
                  const CategoryIcon =
                    SERVICE_CATEGORIES.find((c) => c.key === key)?.icon ?? Stethoscope;
                  return (
                    <Panel
                      key={key}
                      aria-labelledby={`cat-${key}`}
                      className="scroll-mt-28 overflow-hidden"
                    >
                      <div className="flex items-center gap-3 border-b border-hairline px-5 py-4">
                        <span
                          aria-hidden="true"
                          className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-subtle text-on-brand-subtle"
                        >
                          <CategoryIcon weight="duotone" className="size-5" />
                        </span>
                        <h2
                          id={`cat-${key}`}
                          className="m-0 min-w-0 flex-1 font-heading text-h3 leading-tight font-bold"
                        >
                          {t(`site.services.categories.${key}`)}
                        </h2>
                        <span className="rounded-full bg-subtle px-2 py-0.5 text-caption font-semibold text-fg-secondary tabular-nums">
                          {services.length}
                        </span>
                      </div>
                      <ul className="m-0 list-none p-0">
                        {services.map((s) => (
                          <li key={s.code} className="border-b border-hairline last:border-b-0">
                            <Link
                              to={`/services/${serviceSlug(s.code)}`}
                              viewTransition
                              className="group flex min-h-13 items-center gap-3 px-5 py-3 text-fg no-underline transition-colors duration-150 ease-out hover:bg-page"
                            >
                              <span className="min-w-0 flex-1 font-semibold">{s.name}</span>
                              <CaretRight
                                aria-hidden="true"
                                className="size-4 shrink-0 text-fg-muted transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:text-primary"
                              />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </Panel>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </PageContainer>
    </PublicLayout>
  );
}

// ---- /services/:slug ----

/** One service (upgrade 11 §5): plain-language explanation, where it is offered, what to bring. */
export function ServicePage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage ?? "rw";
  const { slug = "" } = useParams();
  const code = serviceCode(slug);
  const catalogue = useCatalogue(lang);
  const offering = useFacilitiesOffering(code);
  // a service facilities offer but the catalogue has not caught up with still gets its page, named
  // from the facility's own service
  const offered = offering.data?.find((f) => f.service_code === code);
  const service: CatalogueService | undefined =
    catalogue.data?.find((s) => s.code === code) ??
    (offered
      ? {
          code,
          name: pick(offered.service_name_i18n, lang) || code,
          category: categoryOf(code),
          description: "",
        }
      : undefined);

  if (catalogue.isSuccess && offering.isSuccess && !service) {
    return (
      <PublicLayout>
        <PageContainer narrow>
          <NotFoundState
            title={t("site.service.notFound")}
            reason={t("site.service.notFoundReason")}
            back={{ to: "/services", label: t("site.service.allServices") }}
          />
        </PageContainer>
      </PublicLayout>
    );
  }

  // the platform's own words first, then the built-in text for the common services
  const explain =
    service?.description ||
    t(`site.service.explain.${code}`, { defaultValue: "" }) ||
    t("site.service.aboutGeneric");

  return (
    <PublicLayout>
      <PageContainer className="pb-16">
        <PageHeader
          crumbs={[
            { to: "/services", label: t("nav.services") },
            ...(service
              ? [
                  {
                    to: `/services#cat-${service.category}`,
                    label: t(`site.services.categories.${service.category}`),
                  },
                ]
              : []),
            { label: service?.name ?? "…" },
          ]}
          title={service?.name ?? "…"}
          lead={explain}
          actions={
            <Link
              to={`/find-care?q=${encodeURIComponent(service?.name ?? "")}`}
              viewTransition
              className={buttonClassName({ pill: true })}
            >
              {t("site.service.find")}
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          }
        />
        <div className="grid gap-x-10 gap-y-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <section aria-labelledby="offering" className="flex min-w-0 flex-col gap-3">
            <h2 id="offering" className="m-0 font-heading text-h2">
              {t("site.service.offering")}
            </h2>
            {offering.isPending ? (
              <FacilityEntries label={t("site.service.offering")} rows={[]} loading />
            ) : offering.isError ? (
              <Panel as="div">
                <ErrorState onRetry={() => void offering.refetch()} />
              </Panel>
            ) : !offering.data?.length ? (
              <Panel as="div">
                <EmptyState
                  title={t("site.service.noneOffering")}
                  action={
                    <Link
                      to="/services"
                      viewTransition
                      className={buttonClassName({ variant: "secondary", pill: true })}
                    >
                      {t("site.service.allServices")}
                    </Link>
                  }
                />
              </Panel>
            ) : (
              <FacilityEntries
                label={t("site.service.offering")}
                rows={offering.data}
                loading={false}
              />
            )}
          </section>
          <aside aria-labelledby="bring" className="flex flex-col gap-3 lg:pt-11">
            <Panel as="div" className="p-6">
              <h2 id="bring" className="m-0 text-h3">
                {t("site.facility.bring.title")}
              </h2>
              <ul className="m-0 mt-3 flex list-disc flex-col gap-2 pl-5 text-fg-secondary">
                <li>{t("site.facility.bring.insurance")}</li>
                <li>{t("site.facility.bring.id")}</li>
                <li>{t("site.facility.bring.documents")}</li>
              </ul>
            </Panel>
          </aside>
        </div>
      </PageContainer>
    </PublicLayout>
  );
}
