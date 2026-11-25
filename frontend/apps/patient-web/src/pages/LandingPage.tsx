import type { FacilityResult, FacilitySearchInput } from "@medilink/api-client";
import {
  ArrowRight,
  Baby,
  Buildings,
  Crosshair,
  Eye,
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
import { Button, buttonClassName, cx, ImigongoPattern } from "@medilink/ui";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
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
import { sortResults, useNearMe, waitText, type Sort } from "../features/booking/Places";
import { kigaliNow, nextOpening, useAllFacilities, useProfiles } from "../features/site/data";
import { FacilityExplorer } from "../features/site/FacilityDirectory";
import { Faq, LocationSelector, PageContainer, SearchBar } from "../features/site/kit";
import { PublicLayout } from "../layout/PublicLayout";

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

/**
 * The hero's second line: one phrase at a time, each telling another reason to use MediLink
 * (2026-11-16). Every phrase sits in the same grid cell, so the line keeps the height of the
 * longest and nothing below jumps. Screen readers and reduced motion get the first phrase only;
 * the change pauses while the tab is hidden.
 */
/** A hand-drawn mint stroke under the hero's green phrase, drawn once (still under reduced motion). */
function BrushStroke() {
  return (
    <svg
      viewBox="0 0 300 14"
      preserveAspectRatio="none"
      className="ml-brush pointer-events-none absolute inset-x-0 -bottom-[0.06em] h-[0.22em] w-full overflow-visible"
    >
      <path
        d="M3 9.5C48 4.5 96 3 150 4.6c48 1.4 94 3.6 147 1.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.3"
        pathLength={1}
      />
    </svg>
  );
}

function RotatingWords({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  const [still] = useState(
    () =>
      typeof window === "undefined" ||
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true,
  );
  useEffect(() => {
    if (still || words.length < 2) return;
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") setIndex((i) => (i + 1) % words.length);
    }, 3200);
    return () => window.clearInterval(timer);
  }, [still, words.length]);
  return (
    <>
      <span className="sr-only">{words[0]}</span>
      {/* phones and tablets: the first phrase only (a wrapped longer one left a gap) */}
      <span aria-hidden="true" className="relative inline-block pb-[0.12em] text-primary xl:hidden">
        {words[0]}
        <BrushStroke />
      </span>
      <span aria-hidden="true" className="relative hidden pb-[0.12em] text-primary xl:grid">
        {words.map((word, i) => (
          <span
            key={word}
            className={cx(
              "relative col-start-1 row-start-1 w-fit transition-[opacity,translate,filter] duration-500 ease-out-quint xl:whitespace-nowrap",
              i === index
                ? "translate-y-0 opacity-100 blur-0"
                : "pointer-events-none translate-y-3 opacity-0 blur-[2px]",
            )}
          >
            {word}
            <BrushStroke />
          </span>
        ))}
      </span>
    </>
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

/**
 * The home FAQ: the help centre's most asked questions, as `category.n` (question qn, answer an),
 * so the answers stay one text, already translated (audit 2026-11-16).
 */
const HOME_FAQ = ["finding.1", "finding.2", "insurance.1", "booking.2", "arrival.2"] as const;

/** The hero photo, served from /public in three widths (WebP, with a JPEG fallback). */
const HERO = `${import.meta.env.BASE_URL}images/hero/health-centre`;

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
    // phones: one row per figure, the label left and the number right; from 640 px three columns
    <div className="flex min-w-0 items-center justify-between gap-4 px-4 py-3 sm:flex-col sm:items-start sm:justify-start sm:gap-2 sm:px-6 sm:py-5">
      <dt className="inline-flex min-w-0 items-center gap-2 text-body-sm font-semibold text-fg-secondary">
        <FigureIcon
          aria-hidden="true"
          weight="duotone"
          className="hidden size-5 shrink-0 text-primary sm:block"
        />
        {label}
      </dt>
      <dd className="m-0 flex shrink-0 flex-col items-end gap-1 sm:items-start">
        <span className="font-heading text-h3 leading-none font-bold whitespace-nowrap text-fg tabular-nums sm:text-h1">
          {value}
        </span>
        {hint && <span className="hidden text-body-sm text-fg-secondary sm:block">{hint}</span>}
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
  const { t, i18n } = useTranslation();
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
  // the hero's callout: the open facility with the shortest wait, from the live listing
  const spotlight = everywhere
    .filter((r) => r.open_now && r.waiting !== null && r.waiting !== undefined)
    .sort((a, b) => (a.waiting ?? 0) - (b.waiting ?? 0))[0];
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
      {/* 1 · The question, the search, and what is open right now, over a health centre scene */}
      <section aria-labelledby="hero-title" className="relative isolate">
        <PageContainer className="pt-4 sm:pt-6">
          <div className="relative isolate overflow-hidden rounded-shell border border-hairline bg-surface shadow-e2">
            {/*
             * An illustrative, AI-generated scene (a health centre on Rwanda's hills): not a real
             * MediLink facility, staff or patients. Owner-supplied, 2026-11-16.
             */}
            <picture>
              <source
                type="image/webp"
                srcSet={`${HERO}-960.webp 960w, ${HERO}-1672.webp 1672w`}
                sizes="(min-width: 88rem) 86rem, 100vw"
              />
              <img
                src={`${HERO}-1672.jpg`}
                alt=""
                width={1672}
                height={941}
                fetchPriority="high"
                decoding="async"
                // phones and tablets: a banner at the top in the photo's own shape; computers:
                // from 1280 px the right part of the card, beside the words, never under them
                className="ml-hero-photo absolute inset-x-0 top-0 -z-20 aspect-[16/10] w-full object-cover object-[68%_60%] md:aspect-[2/1] xl:inset-y-0 xl:right-0 xl:left-auto xl:aspect-auto xl:h-full xl:w-[66%] xl:object-[64%_50%]"
              />
            </picture>
            {/* the poster's atmosphere: one soft brand haze behind the headline; decoration only */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-[38vw] -left-24 -z-[5] size-[30rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--color-primary)_16%,transparent)_0%,color-mix(in_oklab,var(--color-primary)_6%,transparent)_45%,transparent_70%)] blur-2xl md:top-[34vw] xl:top-0 xl:-left-16 xl:size-[38rem]"
            />
            {/* computers: one real facility's live wait, floating on the photo like a poster's
                callout; shows only with live data */}
            {spotlight && (
              <div
                aria-hidden="true"
                className="absolute right-10 bottom-24 z-10 hidden w-72 animate-rise flex-col gap-2.5 rounded-2xl border border-[color-mix(in_oklab,var(--color-surface)_55%,transparent)] bg-[color-mix(in_oklab,var(--color-surface)_80%,transparent)] p-4 shadow-e3 backdrop-blur-xl [animation-delay:400ms] xl:flex"
              >
                <span className="inline-flex items-center gap-2 text-caption font-semibold text-success">
                  <span className="size-1.5 rounded-full bg-success" />
                  {t("site.card.open")}
                </span>
                <span className="font-heading text-[1.0625rem] leading-tight font-bold text-fg">
                  {spotlight.name}
                </span>
                <span className="text-body-sm font-semibold text-fg-secondary tabular-nums">
                  {waitText(spotlight, t, i18n.resolvedLanguage ?? "rw")}
                </span>
                <span className="h-1.5 overflow-hidden rounded-full bg-subtle">
                  <span
                    className="block h-full rounded-full bg-primary"
                    style={{
                      width: `${Math.min(100, Math.max(12, (spotlight.waiting ?? 0) * 9))}%`,
                    }}
                  />
                </span>
              </div>
            )}
            {/* a dark wash, deepest under the words, so white text reads on any part of the photo */}
            <div
              aria-hidden="true"
              // the photo fades into the page colour, where dark words sit calm (light and dark theme)
              className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,transparent_0%,transparent_26vw,var(--color-surface)_58vw)] md:bg-[linear-gradient(180deg,transparent_0%,transparent_20vw,var(--color-surface)_46vw)] xl:bg-[linear-gradient(90deg,var(--color-surface)_0%,var(--color-surface)_34%,color-mix(in_oklab,var(--color-surface)_70%,transparent)_46%,transparent_64%)]"
            />
            <div className="flex animate-rise flex-col items-start justify-center gap-6 px-5 pt-[44vw] pb-12 sm:px-10 md:pt-[40vw] lg:px-14 xl:min-h-[36rem] xl:w-[50%] xl:py-16">
              {/* a live label, the way a poster names its subject before the headline */}
              {openNow > 0 && (
                <p className="m-0 inline-flex items-center gap-2 rounded-full border border-hairline bg-[color-mix(in_oklab,var(--color-surface)_80%,transparent)] py-1.5 pr-3.5 pl-2.5 text-caption font-semibold tracking-wide text-fg-secondary shadow-e1 backdrop-blur-md">
                  <span aria-hidden="true" className="relative grid size-2 place-items-center">
                    <span className="absolute inline-flex size-2 animate-ping rounded-full bg-primary opacity-50 motion-reduce:hidden" />
                    <span className="relative inline-flex size-2 rounded-full bg-primary" />
                  </span>
                  {t("site.home3.openNow", { count: openNow })}
                </p>
              )}
              <PageHeading
                id="hero-title"
                title={`${t("site.home3.titleA")} ${t("site.home3.titleB")}`}
                className="m-0 max-w-[20ch] font-heading text-[clamp(1.875rem,4.6vw,3.5rem)] leading-[1.05] font-bold tracking-[-0.028em] text-balance text-fg"
              >
                {t("site.home3.titleA")}{" "}
                <RotatingWords
                  words={[
                    t("site.home3.titleB"),
                    t("site.home3.rotate2"),
                    t("site.home3.rotate3"),
                    t("site.home3.rotate4"),
                  ]}
                />
              </PageHeading>
              <p className="m-0 max-w-[34rem] text-[1.0625rem] leading-[1.65] text-fg-secondary sm:text-[1.1875rem]">
                {/* phones: the short line keeps the search in the first screen */}
                <span className="sm:hidden">{t("site.home2.lead")}</span>
                <span className="hidden sm:inline">{t("site.home3.leadLong")}</span>
              </p>
              <form
                onSubmit={onSearch}
                role="search"
                className="grid w-full max-w-[40rem] grid-cols-[minmax(0,1fr)] gap-2 rounded-shell border border-hairline bg-surface p-2 shadow-e3 sm:grid-cols-[minmax(0,1fr)_auto] [&>*]:min-w-0 [&>:first-child]:sm:col-span-2"
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
              {/* the second way in, quieter than the search */}
              <Link
                to="/check-symptoms"
                viewTransition
                className="group inline-flex items-center gap-2 text-body-sm font-semibold text-link no-underline hover:underline sm:text-body"
              >
                <Sparkle aria-hidden="true" weight="duotone" className="size-5" />
                {t("site.home3.symptoms.title")} {t("site.home3.symptoms.action")}
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-200 ease-out-quint group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </div>

          {/*
           * one strip of live figures, read left to right, lifted over the photo's foot. Numbers
           * only while something is open; when everything is closed, one honest line says so.
           */}
          <div className="relative z-10 -mt-10 px-3 sm:px-8 lg:px-12">
            {allClosed ? (
              <ClosedNotice rows={everywhere} />
            ) : (
              <dl className="m-0 grid animate-rise divide-y divide-hairline rounded-panel bg-surface shadow-e3 [animation-delay:120ms] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
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
                  hint={t("site.home3.kpi.waitingHint")}
                />
                <Figure
                  icon={Hourglass}
                  label={t("site.home3.kpi.typical")}
                  value={typical !== null ? t("site.home3.kpi.minutes", { count: typical }) : "–"}
                  hint={t("site.home3.kpi.typicalHint")}
                />
              </dl>
            )}
          </div>
        </PageContainer>
      </section>

      <PageContainer className="flex flex-col gap-20 pt-16 pb-20 lg:gap-24 lg:pt-20 lg:pb-24">
        {/* 2 · The services */}
        <section aria-labelledby="care-title" className="site-reveal flex flex-col gap-8">
          <SectionHead
            id="care-title"
            title={t("site.home2.careTitle")}
            action={<MoreLink to="/services">{t("site.home2.allServices")}</MoreLink>}
          />
          {/* two columns on phones too: six full-width rows were a long scroll */}
          <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 sm:gap-4 lg:grid-cols-3">
            {CARE.map(({ key, icon: CareIcon }) => (
              <li key={key} className="flex">
                <Link
                  to={`/find-care?service=${key}`}
                  viewTransition
                  className="group flex w-full flex-col items-start gap-3 rounded-panel bg-surface p-4 no-underline shadow-e1 transition-[box-shadow,transform] duration-200 ease-out-quint hover:-translate-y-0.5 hover:shadow-e3 motion-reduce:hover:translate-y-0 sm:flex-row sm:items-center sm:gap-4 sm:p-5"
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
                    className="hidden size-5 text-fg-muted transition-[transform,color] duration-200 ease-out-quint group-hover:translate-x-1 group-hover:text-primary sm:block"
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
              // the same quiet link style as "All services"; Near me sorts, View all leaves
              <div className="flex flex-wrap items-center gap-x-6">
                <button
                  type="button"
                  aria-pressed={near !== null}
                  onClick={locate}
                  disabled={locating === "busy"}
                  className="inline-flex min-h-target cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 font-semibold text-link aria-pressed:text-fg"
                >
                  <Crosshair
                    aria-hidden="true"
                    className={cx("size-4", locating === "busy" && "animate-spin")}
                  />
                  {near ? t("home.nearYou") : t("home.nearMe")}
                </button>
                <MoreLink to="/facilities">{t("site.home.viewAll")}</MoreLink>
              </div>
            }
          />
          <FacilityExplorer
            label={t("site.home3.openTitle")}
            rows={listed.slice(0, 3)}
            loading={results.isPending}
            fetching={results.isFetching}
            failed={results.isError}
            onRetry={() => void results.refetch()}
            near={near}
            empty={<p className="m-0 px-5 py-8 text-fg-secondary">{t("site.home.nearEmpty")}</p>}
            switchable
            rail
          />
        </section>

        {/* 3 · The questions people ask first, answered on the page (the help centre's own answers) */}
        <section
          aria-labelledby="faq-title"
          className="site-reveal grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-16"
        >
          <div className="flex flex-col items-start gap-4">
            <h2 id="faq-title" className="m-0 font-heading text-section font-bold text-balance">
              {t("site.help.top")}
            </h2>
            <Link
              to="/help"
              viewTransition
              className="group inline-flex items-center gap-2 font-semibold text-link no-underline hover:underline"
            >
              {t("site.help.more")}
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform duration-200 ease-out-quint group-hover:translate-x-0.5"
              />
            </Link>
            {/* the journey is told once, on How it works: one line here, with the questions */}
            <p className="m-0 text-body text-fg-secondary">
              {t("site.home3.howLine")}{" "}
              <Link to="/how-it-works" viewTransition className="font-semibold text-link">
                {t("site.home.how")}
              </Link>
            </p>
          </div>
          <div className="overflow-hidden rounded-panel bg-surface shadow-e1">
            {HOME_FAQ.map((entry, index) => {
              const [category, n] = entry.split(".");
              return (
                <Faq
                  key={entry}
                  question={t(`site.help.categories.${category}.q${n}`)}
                  open={index === 0}
                >
                  {t(`site.help.categories.${category}.a${n}`)}
                </Faq>
              );
            })}
          </div>
        </section>

        {/* 4 · One last invitation before the footer, with one way in and one way to stay */}
        <section
          aria-labelledby="cta-title"
          className="site-reveal relative isolate overflow-hidden rounded-shell bg-surface px-6 py-14 text-center shadow-e2 sm:px-10 lg:py-20"
        >
          <div aria-hidden="true" className="absolute inset-0 -z-10 text-primary">
            <ImigongoPattern opacity={0.05} />
          </div>
          <div className="mx-auto flex max-w-[40rem] flex-col items-center gap-5">
            <h2
              id="cta-title"
              className="m-0 font-heading text-[clamp(2rem,4vw,3.25rem)] leading-[1.08] font-bold tracking-[-0.02em] text-balance text-fg"
            >
              {t("site.home.readyTitle")}
            </h2>
            <p className="m-0 text-body text-fg-secondary">{t("site.home.accountLead")}</p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Link
                to="/find-care"
                viewTransition
                className={buttonClassName({ pill: true, size: "lg", className: "ml-press px-8" })}
              >
                <MagnifyingGlass aria-hidden="true" weight="bold" />
                {t("nav.findCare")}
              </Link>
              <Link
                to="/signup"
                viewTransition
                className={buttonClassName({
                  variant: "secondary",
                  pill: true,
                  size: "lg",
                  className: "ml-press px-8",
                })}
              >
                {t("signup.submit")}
              </Link>
            </div>
            {/* the facilities' own invitation, one quiet line instead of a second band */}
            <p className="m-0 mt-4 border-t border-hairline pt-5 text-body-sm text-fg-secondary">
              {t("site.home2.facilitiesTitle")}{" "}
              <Link
                to="/for-facilities"
                viewTransition
                className="font-semibold text-link no-underline hover:underline"
              >
                {t("site.home2.facilitiesAction")} →
              </Link>
            </p>
          </div>
        </section>
      </PageContainer>
    </PublicLayout>
  );
}
