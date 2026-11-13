import type { FacilityResult, FacilitySearchInput } from "@medilink/api-client";
import {
  ArrowRight,
  Baby,
  Buildings,
  Crosshair,
  Eye,
  Flask,
  HandHeart,
  Hourglass,
  MagnifyingGlass,
  Sparkle,
  Stethoscope,
  Syringe,
  Tooth,
  UsersThree,
  type Icon,
} from "@phosphor-icons/react";
import { Button, cx, ImigongoPattern } from "@medilink/ui";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";

import { useApi } from "../app/services";
import { PageHeading } from "../components/PageHeading";
import {
  day,
  DISTRICT_CODES,
  SERVICE_CODES,
  type DistrictKey,
  type ServiceKey,
} from "../features/booking/discovery";
import { FILTER, sortResults, useNearMe, type Sort } from "../features/booking/Places";
import { kigaliNow, nextOpening, useAllFacilities, useProfiles } from "../features/site/data";
import { FacilityExplorer } from "../features/site/FacilityDirectory";
import { HillsideCareIllustration } from "../features/site/illustrations";
import { LocationSelector, PageContainer, SearchBar } from "../features/site/kit";
import { PublicLayout } from "../layout/PublicLayout";

const COMMON_NEEDS: { key: string; to: string; icon: Icon }[] = [
  { key: "general", to: "/find-care?service=general", icon: Stethoscope },
  { key: "maternal", to: "/find-care?service=antenatal", icon: HandHeart },
  { key: "lab", to: "/find-care?q=lab", icon: Flask },
  { key: "dental", to: "/find-care?service=dental", icon: Tooth },
];

const CARE: { key: ServiceKey; icon: Icon }[] = [
  { key: "general", icon: Stethoscope },
  { key: "antenatal", icon: HandHeart },
  { key: "pediatrics", icon: Baby },
  { key: "dental", icon: Tooth },
  { key: "eye", icon: Eye },
  { key: "vaccination", icon: Syringe },
];

/** How many open places the live panel shows. */

/** Section heading with its lead and one link: the same rhythm on every section. */
function SectionHead({
  id,
  title,
  lead,
  action,
}: {
  id: string;
  title: string;
  /** Only when it carries state (e.g. "sorted by distance"); titles speak for themselves. */
  lead?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
      <div className="flex max-w-[40rem] flex-col gap-2">
        <h2 id={id} className="m-0 font-heading text-section font-bold text-fg">
          {title}
        </h2>
        {lead && <p className="m-0 text-[1.0625rem] leading-relaxed text-fg-secondary">{lead}</p>}
      </div>
      {action}
    </div>
  );
}

function MoreLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      viewTransition
      className="group inline-flex min-h-target items-center gap-1.5 font-semibold text-link no-underline"
    >
      {children}
      <ArrowRight
        aria-hidden="true"
        className="size-4 transition-transform duration-200 ease-out-quint group-hover:translate-x-0.5"
      />
    </Link>
  );
}

/** One row per facility (the listing has one row per service). */
function unique(rows: FacilityResult[]): FacilityResult[] {
  const seen = new Set<string>();
  return rows.filter((r) => (seen.has(r.slug) ? false : (seen.add(r.slug), true)));
}

/** The middle of today's live waits, from the facilities' own ranges; null without any. */
function typicalWait(rows: FacilityResult[]): number | null {
  const mids = rows
    .filter((r) => r.open_now && r.wait_range)
    .map((r) => (r.wait_range!.min + r.wait_range!.max) / 2)
    .sort((a, b) => a - b);
  if (!mids.length) return null;
  return Math.round(mids[Math.floor(mids.length / 2)]! / 5) * 5;
}

/**
 * Nothing open anywhere (nights, weekends): one plain line instead of zeros as headlines, with the
 * next place to open when the hours are published.
 */
function ClosedNotice({ rows, className }: { rows: FacilityResult[]; className?: string }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage ?? "rw";
  const profiles = useProfiles(rows.map((r) => r.slug));
  const next = nextOpening(profiles.data);
  const today = kigaliNow().slice(0, 10);
  return (
    <div
      role="status"
      className={cx(
        "flex flex-wrap items-center gap-x-3 gap-y-1 rounded-panel bg-surface px-6 py-5 shadow-e2",
        className,
      )}
    >
      <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-fg-muted" />
      <span className="font-semibold text-fg">{t("site.home3.allClosed")}</span>
      {next && (
        <span className="text-fg-secondary tabular-nums">
          {"· "}
          <Link to={`/facilities/${next.slug}`} viewTransition className="text-link">
            {next.date === today
              ? t("site.home3.nextOpeningToday", { time: next.time, name: next.name })
              : t("site.home3.nextOpening", {
                  day: day(next.date, lang, "short"),
                  time: next.time,
                  name: next.name,
                })}
          </Link>
        </span>
      )}
    </div>
  );
}

/** One live figure in the strip under the hero: a label, one number, and what it counts. */
function Figure({
  icon: FigureIcon,
  label,
  value,
  hint,
}: {
  icon: Icon;
  label: string;
  value: string;
  hint?: string | undefined;
}) {
  return (
    <div className="flex flex-col gap-2 px-6 py-5">
      <dt className="inline-flex items-center gap-2 text-body-sm font-semibold text-fg-secondary">
        <FigureIcon aria-hidden="true" weight="duotone" className="size-5 text-primary" />
        {label}
      </dt>
      <dd className="m-0 flex flex-col gap-1">
        <span className="font-heading text-h1 leading-none font-bold text-fg tabular-nums">
          {value}
        </span>
        {hint && <span className="text-body-sm text-fg-secondary">{hint}</span>}
      </dd>
    </div>
  );
}

/**
 * Home `/`: the hero with the search and what is open (or one honest line when nothing is), the
 * kinds of care, the facilities near you on a list or a map, one line to How it works, and a slim
 * forest band for facilities. The journey is told once, on How it works (audit 2026-11-07).
 * Every number is real or not shown.
 */
export function LandingPage() {
  const { t } = useTranslation();
  const api = useApi();
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [where, setWhere] = useState<DistrictKey | "">("");
  const [sort, setSort] = useState<Sort>("soonest");
  const { near, locating, locate } = useNearMe(() => setSort("nearest"));
  const body: FacilitySearchInput = {
    district_code: near ? undefined : where ? DISTRICT_CODES[where] : undefined,
    near,
  };
  const results = useQuery({
    queryKey: ["discovery", "home", body],
    queryFn: () => api.booking.search(body),
  });
  const all = useAllFacilities();
  const listed = useMemo(
    () =>
      sortResults(unique(results.data?.results ?? []), sort).sort(
        (a, b) => Number(b.open_now) - Number(a.open_now),
      ),
    [results.data, sort],
  );
  // real numbers only, from the live listing
  const everywhere = unique(all.data ?? []);
  const openNow = everywhere.filter((r) => r.open_now).length;
  const waitingNow = everywhere.reduce((sum, r) => sum + (r.open_now ? (r.waiting ?? 0) : 0), 0);
  const typical = typicalWait(everywhere);
  const allClosed = Boolean(all.data) && everywhere.length > 0 && openNow === 0;
  const countFor = (key: ServiceKey) =>
    new Set(
      (all.data ?? []).filter((r) => r.service_code === SERVICE_CODES[key]).map((r) => r.slug),
    ).size;

  const onSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (text.trim()) params.set("q", text.trim());
    if (where) params.set("district", where);
    const query = params.toString();
    void navigate(query ? `/find-care?${query}` : "/find-care", { viewTransition: true });
  };

  return (
    <PublicLayout>
      {/* 1 · The question, the search, and what is open right now */}
      <section aria-labelledby="hero-title" className="site-glow relative isolate overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 text-primary"
          style={{ maskImage: "radial-gradient(60% 70% at 90% 10%, black, transparent 75%)" }}
        >
          <ImigongoPattern opacity={0.05} />
        </div>
        <PageContainer className="flex flex-col gap-12 pt-12 pb-16 lg:gap-16 lg:pt-20 lg:pb-24">
          <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16">
            <div className="flex min-w-0 animate-rise flex-col items-start gap-7">
              <PageHeading
                id="hero-title"
                title={`${t("site.home3.titleA")} ${t("site.home3.titleB")}`}
                className="m-0 max-w-[24ch] font-heading text-hero font-bold text-balance text-fg"
              >
                {t("site.home3.titleA")}{" "}
                <span className="bg-[linear-gradient(100deg,var(--site-hero-ink),var(--color-primary))] bg-clip-text text-transparent">
                  {t("site.home3.titleB")}
                </span>
              </PageHeading>
              <p className="m-0 max-w-[32rem] text-[1.1875rem] leading-relaxed text-fg-secondary">
                {t("site.home2.lead")}
              </p>
              <form
                onSubmit={onSearch}
                role="search"
                className="grid w-full max-w-[40rem] gap-2 rounded-shell bg-surface p-2 shadow-e3 sm:grid-cols-[minmax(0,1fr)_auto] [&>:first-child]:sm:col-span-2"
              >
                <SearchBar
                  id="home-search"
                  label={t("site.searchLabel")}
                  value={text}
                  onChange={setText}
                  placeholder={t("site.home2.searchPlaceholder")}
                />
                <LocationSelector id="home-location" value={where} onChange={setWhere} />
                <Button type="submit" size="lg" pill className="min-h-12 px-8">
                  <MagnifyingGlass aria-hidden="true" weight="bold" />
                  {t("site.home2.search")}
                </Button>
              </form>
              <nav aria-labelledby="needs-title" className="flex flex-wrap items-center gap-2">
                <p id="needs-title" className="m-0 me-1 text-body-sm text-fg-muted">
                  {t("home.chipsLabel")}
                </p>
                <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                  {COMMON_NEEDS.map(({ key, to, icon: NeedIcon }) => (
                    <li key={key}>
                      <Link
                        to={to}
                        viewTransition
                        className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-surface px-3 text-body-sm font-medium text-fg no-underline shadow-e1 transition-shadow duration-200 hover:shadow-e2"
                      >
                        <NeedIcon aria-hidden="true" className="size-4 text-primary" />
                        {t(`site.home2.chips.${key}`)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              {/* the second way in, quieter than the search */}
              <Link
                to="/check-symptoms"
                viewTransition
                className="group inline-flex items-center gap-2 font-semibold text-link no-underline hover:underline"
              >
                <Sparkle aria-hidden="true" weight="duotone" className="size-5" />
                {t("site.home3.symptoms.title")} {t("site.home3.symptoms.action")}
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-200 ease-out-quint group-hover:translate-x-0.5"
                />
              </Link>
            </div>

            <div className="relative min-w-0 animate-rise [animation-delay:80ms]">
              <div className="overflow-hidden rounded-shell shadow-e3">
                <HillsideCareIllustration className="block aspect-[5/4] h-auto w-full" />
              </div>
            </div>
          </div>

          {/*
           * one strip of live figures, read left to right. Numbers only while something is open;
           * when everything is closed, one honest line says so instead.
           */}
          {allClosed ? (
            <ClosedNotice rows={everywhere} />
          ) : (
            <dl className="m-0 grid animate-rise divide-y divide-hairline rounded-panel bg-surface shadow-e2 sm:grid-cols-3 sm:divide-x sm:divide-y-0 [animation-delay:120ms]">
              <Figure
                icon={Buildings}
                label={t("site.home3.kpi.open")}
                value={all.data ? String(openNow) : "–"}
                hint={t("site.home3.kpi.openHint", { count: everywhere.length })}
              />
              <Figure
                icon={UsersThree}
                label={t("site.home3.kpi.waiting")}
                value={all.data ? String(waitingNow) : "–"}
              />
              <Figure
                icon={Hourglass}
                label={t("site.home3.kpi.typical")}
                value={typical !== null ? t("site.home3.kpi.minutes", { count: typical }) : "–"}
              />
            </dl>
          )}
        </PageContainer>
      </section>

      <PageContainer className="flex flex-col gap-24 py-20 lg:gap-28 lg:py-24">
        {/* 2 · The services */}
        <section aria-labelledby="care-title" className="site-reveal flex flex-col gap-8">
          <SectionHead
            id="care-title"
            title={t("site.home2.careTitle")}
            action={<MoreLink to="/services">{t("site.home2.allServices")}</MoreLink>}
          />
          <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {CARE.map(({ key, icon: CareIcon }) => (
              <li key={key}>
                <Link
                  to={`/find-care?service=${key}`}
                  viewTransition
                  className="group flex items-center gap-4 rounded-panel bg-surface p-5 no-underline shadow-e1 transition-[box-shadow,transform] duration-200 ease-out-quint hover:-translate-y-0.5 hover:shadow-e3 motion-reduce:hover:translate-y-0"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[linear-gradient(140deg,var(--color-brand-subtle),var(--color-surface))] text-on-brand-subtle shadow-e1">
                    <CareIcon aria-hidden="true" weight="duotone" className="size-6" />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="font-semibold text-fg">{t(`landing.services.${key}`)}</span>
                    <span className="text-body-sm text-fg-secondary tabular-nums">
                      {all.data && countFor(key) > 0
                        ? t("site.home2.facilityCount", { count: countFor(key) })
                        : t("site.home3.seePlaces")}
                    </span>
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    className="size-5 text-fg-muted transition-[transform,color] duration-200 ease-out-quint group-hover:translate-x-1 group-hover:text-primary"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* 3 · Everything open, on a list or a map */}
        <section aria-labelledby="open-title" className="site-reveal flex flex-col gap-8">
          <SectionHead
            id="open-title"
            title={t("site.home3.openTitle")}
            lead={
              locating === "denied" || near ? (
                <span role="status">
                  {locating === "denied"
                    ? t("home.locationDenied")
                    : t("site.home.sortedByDistance")}
                </span>
              ) : undefined
            }
            action={
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
            }
          />
          <FacilityExplorer
            label={t("site.home3.openTitle")}
            rows={listed.slice(0, 6)}
            loading={results.isPending}
            fetching={results.isFetching}
            failed={results.isError}
            onRetry={() => void results.refetch()}
            near={near}
            empty={<p className="m-0 px-5 py-8 text-fg-secondary">{t("site.home.nearEmpty")}</p>}
            switchable
          />
        </section>

        {/* the journey is told once, on How it works: one line here */}
        <p className="m-0 text-body text-fg-secondary">
          {t("site.home3.howLine")}{" "}
          <Link to="/how-it-works" viewTransition className="font-semibold text-link">
            {t("site.home.how")}
          </Link>
        </p>
      </PageContainer>

      {/* 4 · For facilities: one slim forest band, one line and one button */}
      <section
        aria-labelledby="facilities-title"
        className="relative isolate overflow-hidden bg-forest text-on-forest"
      >
        <div aria-hidden="true" className="absolute inset-0 -z-10 text-on-forest-accent">
          <ImigongoPattern opacity={0.06} />
        </div>
        <PageContainer className="flex flex-wrap items-center justify-between gap-6 py-12">
          <div className="flex max-w-[40rem] flex-col gap-2">
            <h2
              id="facilities-title"
              className="m-0 font-heading text-section font-bold text-on-forest"
            >
              {t("site.home2.facilitiesTitle")}
            </h2>
            <p className="m-0 text-body text-on-forest-muted">{t("site.home2.facilitiesLead")}</p>
          </div>
          <Link
            to="/for-facilities"
            viewTransition
            className="ml-press group inline-flex min-h-12 items-center gap-2 rounded-full bg-on-forest px-6 font-semibold text-forest no-underline transition-[filter] duration-150 hover:brightness-95"
          >
            {t("site.home2.facilitiesAction")}
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform duration-200 ease-out-quint group-hover:translate-x-0.5"
            />
          </Link>
        </PageContainer>
      </section>
    </PublicLayout>
  );
}
