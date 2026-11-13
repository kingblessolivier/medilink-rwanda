import { ApiError } from "@medilink/api-client";
import {
  ArrowRight,
  CalendarCheck,
  CaretRight,
  ChatCircleText,
  CheckCircle,
  Crosshair,
  DeviceMobile,
  FileText,
  Lifebuoy,
  MagnifyingGlass,
  MapPin,
  NavigationArrow,
  Phone,
  ShieldCheck,
  Siren,
  UserCircle,
  UsersThree,
  WarningCircle,
  type Icon,
} from "@phosphor-icons/react";
import { Alert, Button, buttonClassName, cx, TextareaField, TextField } from "@medilink/ui";
import { dateFormat } from "@medilink/ui/i18n";
import { useQuery } from "@tanstack/react-query";
import { useState, type FormEvent, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import { useApi } from "../../app/services";
import { PublicLayout } from "../../layout/PublicLayout";
import { directionsUrl, pick } from "../booking/discovery";
import { sortResults, useNearMe } from "../booking/Places";
import { EMERGENCY, isHospital, mapSearchUrl, REFERRAL_HOSPITALS, useAllFacilities } from "./data";
import { StepIllustration } from "./illustrations";
import {
  EmptyState,
  Faq,
  LinkRow,
  LoadingRows,
  PageContainer,
  PageHeader,
  Panel,
  SearchBar,
} from "./kit";

/** Date shown on the legal and information documents (upgrade 11 §5). */
const DOCS_UPDATED = "2026-11-02";

/**
 * Legal text still carries "[To confirm]" markers for the legal review in the locale files; the
 * public page never shows draft markers (redesign: no draft content on public pages), nor the
 * holes they leave: a marker in brackets goes with its brackets, one opening a sentence goes
 * alone, and a sentence that only makes sense with the missing fact (a contact "at [To confirm]")
 * is left out until the fact is confirmed.
 */
function Confirm({ children }: { children: string }) {
  return <>{withoutDraftMarkers(children)}</>;
}

const MARKER = "[To confirm]";

function withoutDraftMarkers(text: string): string {
  return text
    .replaceAll(` (${MARKER})`, "")
    .split(/(?<=[.!?;])\s+/)
    .map((sentence) => (sentence.startsWith(MARKER) ? sentence.slice(MARKER.length) : sentence))
    .filter((sentence) => !sentence.includes(MARKER))
    .join(" ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function Updated() {
  const { t, i18n } = useTranslation();
  const date = dateFormat(i18n.resolvedLanguage ?? "rw", { dateStyle: "long" }).format(
    new Date(`${DOCS_UPDATED}T12:00:00Z`),
  );
  return <p className="m-0 text-body-sm text-fg-muted">{t("site.lastUpdated", { date })}</p>;
}

/** A reading page: narrow column, sections with headings, one quiet document surface. */
function Document({ children }: { children: ReactNode }) {
  return (
    <Panel as="div" className="flex flex-col gap-8 p-6 sm:p-10">
      {children}
    </Panel>
  );
}

function DocSection({
  title,
  id,
  children,
}: {
  title: string;
  /** Anchor for the "On this page" list. */
  id?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="flex scroll-mt-28 flex-col gap-2">
      <h2 className="m-0 text-h3">{title}</h2>
      <div className="max-w-[68ch] text-fg">{children}</div>
    </section>
  );
}

// ---- /how-it-works ----

const JOURNEY = ["search", "join", "follow", "arrive"] as const;
const GOOD = ["noAccount", "walkIn", "noPhone"] as const;

/**
 * How it works: the one place for the patient journey (audit 2026-11-07, said once on the site).
 * Four steps, each a small drawing, a title and one line; then "Good to know" and one action.
 */
export function HowItWorksPage() {
  const { t } = useTranslation();
  return (
    <PublicLayout>
      <PageContainer className="pb-16">
        <PageHeader crumbs={[{ label: t("nav.howItWorks") }]} title={t("site.how.title")} />
        <div className="flex flex-col gap-10">
          <ol className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {JOURNEY.map((key, index) => (
              <li
                key={key}
                className="relative flex flex-col gap-3 rounded-panel bg-surface p-5 shadow-e2"
              >
                {/* the step number as a badge on the card's corner */}
                <span
                  aria-hidden="true"
                  className="absolute top-4 right-4 grid size-8 place-items-center rounded-full bg-primary font-heading text-body-sm font-bold text-on-primary tabular-nums"
                >
                  {index + 1}
                </span>
                <StepIllustration step={key} className="h-28 w-auto self-start" />
                <h2 className="m-0 font-heading text-h3 font-bold">
                  <span className="sr-only">{t("site.home2.stepLabel", { n: index + 1 })}: </span>
                  {t(`site.how.steps.${key}.title`)}
                </h2>
                <p className="m-0 text-fg-secondary">{t(`site.how.steps.${key}.body`)}</p>
              </li>
            ))}
          </ol>
          <section aria-labelledby="good" className="flex flex-col gap-4">
            <h2 id="good" className="m-0 font-heading text-title font-bold">
              {t("site.how.goodTitle")}
            </h2>
            <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-3">
              {GOOD.map((key) => (
                <li
                  key={key}
                  className="flex items-start gap-2.5 rounded-panel bg-surface p-4 text-fg shadow-e1"
                >
                  <CheckCircle
                    aria-hidden="true"
                    weight="fill"
                    className="mt-0.5 size-5 shrink-0 text-primary"
                  />
                  {t(`site.how.good.${key}`)}
                </li>
              ))}
            </ul>
          </section>
          <Link
            to="/find-care"
            viewTransition
            className={buttonClassName({
              size: "lg",
              pill: true,
              className: "ml-press self-start px-7",
            })}
          >
            {t("site.how.start")}
            <ArrowRight aria-hidden="true" className="size-5" />
          </Link>
        </div>
      </PageContainer>
    </PublicLayout>
  );
}

// ---- /emergency ----

const SIGNS = [
  "chest",
  "breathing",
  "bleeding",
  "unconscious",
  "stroke",
  "pregnancy",
  "baby",
  "injury",
] as const;

/** The static referral list: shown when live hospitals fail to load or none are listed yet. */
function ReferralFallback({ failed, onRetry }: { failed: boolean; onRetry: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col">
      {failed && (
        <div
          role="status"
          className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline bg-attention-bg/50 px-5 py-3 text-body-sm"
        >
          <span>{t("site.emergency.loadFailed", { number: EMERGENCY.number })}</span>
          <Button variant="ghost" pill onClick={onRetry}>
            {t("site.retry")}
          </Button>
        </div>
      )}
      <p className="m-0 px-5 pt-4 text-body-sm font-semibold text-fg-secondary">
        {t("site.emergency.referral")}
      </p>
      <ul className="m-0 list-none p-0">
        {REFERRAL_HOSPITALS.map((h) => (
          <li
            key={h.name}
            className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-hairline px-5 py-3.5 last:border-b-0"
          >
            <span className="min-w-0 flex-1 font-semibold text-fg">
              {h.name}
              <span className="block text-body-sm font-normal text-fg-secondary">{h.district}</span>
            </span>
            {h.phone && (
              <a
                href={`tel:${h.phone.replace(/\s/g, "")}`}
                className={buttonClassName({ variant: "secondary", pill: true })}
              >
                <Phone aria-hidden="true" className="size-4" />
                {h.phone}
              </a>
            )}
            <a
              href={mapSearchUrl(h.name)}
              target="_blank"
              rel="noreferrer"
              aria-label={`${t("site.facility.directions")}: ${h.name}`}
              className={buttonClassName({ variant: "secondary", pill: true })}
            >
              <NavigationArrow aria-hidden="true" className="size-4" />
              {t("site.facility.directions")}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Emergency (upgrade 11 §5; public design brief 2026-11-04): an urgent care card first (NHS
 * pattern: a red heading bar over the signs as a plain list and the call), then the nearest
 * places with directions. Facilities whose admin declares a 24-hour emergency department come
 * first; other hospitals follow, listed as hospitals only. Only the configured national number is
 * shown. Nothing on this page moves.
 */
export function EmergencyPage() {
  const { t } = useTranslation();
  const api = useApi();
  const { near, locating, locate } = useNearMe();
  const hospitals = useQuery({
    queryKey: ["discovery", "emergency-page", near],
    queryFn: () => api.booking.search({ near }),
    select: (page) => {
      const sorted = sortResults(
        page.results.filter((r) => r.emergency_department || isHospital(r.type)),
        near ? "nearest" : "name",
      );
      // a declared emergency department first; the order within each group is kept
      return [
        ...sorted.filter((r) => r.emergency_department),
        ...sorted.filter((r) => !r.emergency_department),
      ];
    },
  });
  return (
    <PublicLayout>
      <PageContainer className="pb-16">
        <PageHeader
          crumbs={[{ label: t("nav.emergencyShort") }]}
          title={t("site.emergency.title")}
          lead={t("site.emergency.lead")}
        />
        <div className="grid gap-x-10 gap-y-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="flex min-w-0 flex-col gap-8">
            {/* the call first and largest on the page (audit 2026-11-07) */}
            <div className="flex flex-col gap-2">
              <a
                href={`tel:${EMERGENCY.number}`}
                className="ml-press inline-flex min-h-20 w-full items-center justify-center gap-3 rounded-shell bg-danger-solid px-6 font-heading text-[1.75rem] leading-tight font-extrabold whitespace-nowrap sm:gap-4 sm:px-8 sm:text-display text-on-danger-solid no-underline tabular-nums transition-[filter] duration-150 hover:brightness-110 sm:w-auto sm:self-start"
              >
                <Phone aria-hidden="true" weight="fill" className="size-9 shrink-0" />
                {t("site.emergency.callNow", { number: EMERGENCY.number })}
              </a>
              <span className="text-body-sm text-fg-secondary">{t("site.emergency.callNote")}</span>
            </div>
            {/* the urgent care card: what to look for */}
            <section
              aria-labelledby="signs"
              className="overflow-hidden rounded-panel bg-surface shadow-[0_0_0_1px_color-mix(in_srgb,var(--color-danger)_30%,transparent),var(--shadow-e2)]"
            >
              <h2
                id="signs"
                className="m-0 flex items-center gap-2.5 border-b border-[color-mix(in_srgb,var(--color-danger)_18%,transparent)] bg-danger-bg px-5 py-4 text-h3 text-danger sm:px-6"
              >
                <Siren aria-hidden="true" weight="bold" className="size-5 shrink-0" />
                {t("site.emergency.signsTitle")}
              </h2>
              <ul className="m-0 grid list-none gap-x-8 gap-y-3 p-5 sm:grid-cols-2 sm:px-6">
                {SIGNS.map((sign) => (
                  <li key={sign} className="flex items-start gap-2.5 text-fg">
                    <WarningCircle
                      aria-hidden="true"
                      weight="fill"
                      className="mt-0.5 size-5 shrink-0 text-danger"
                    />
                    {t(`public.emergency.signs.${sign}`)}
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="hospitals" className="flex flex-col gap-3">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <h2 id="hospitals" className="m-0 text-h2">
                    {t("site.emergency.nearest")}
                  </h2>
                  <p className="m-0 text-body-sm text-fg-secondary">
                    {t("site.emergency.nearestNote")}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  pill
                  onClick={locate}
                  loading={locating === "busy"}
                  iconStart={<Crosshair aria-hidden="true" className="size-4" />}
                >
                  {near ? t("home.nearYou") : t("site.emergency.nearMe")}
                </Button>
              </div>
              <Panel as="div" className="overflow-hidden">
                {hospitals.isPending ? (
                  <LoadingRows rows={3} />
                ) : hospitals.isError || !hospitals.data?.length ? (
                  <ReferralFallback
                    failed={hospitals.isError}
                    onRetry={() => void hospitals.refetch()}
                  />
                ) : (
                  <ul className="m-0 list-none p-0">
                    {hospitals.data.map((h) => (
                      <li
                        key={h.slug}
                        className="flex flex-col items-start gap-x-6 gap-y-3 border-b border-hairline px-5 py-4 last:border-b-0 sm:flex-row sm:items-center sm:px-6"
                      >
                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                          <Link
                            to={`/facilities/${h.slug}`}
                            viewTransition
                            className="group inline-flex items-center gap-1 self-start font-semibold text-fg no-underline hover:text-primary"
                          >
                            {h.name}
                            <CaretRight aria-hidden="true" className="size-3.5 text-fg-muted" />
                          </Link>
                          <span className="text-body-sm text-fg-secondary">
                            {t(`booking.types.${h.type}`, { defaultValue: h.type })} · {h.district}
                            {h.distance_km !== null && (
                              <span className="font-semibold text-fg tabular-nums">
                                {" · "}
                                {t("booking.search.km", { km: h.distance_km })}
                              </span>
                            )}
                          </span>
                          {h.emergency_department && (
                            <span className="inline-flex items-center gap-1.5 text-body-sm font-semibold text-danger">
                              <Siren aria-hidden="true" weight="bold" className="size-4" />
                              {t("site.emergency.department")}
                            </span>
                          )}
                        </div>
                        {h.lat !== null && h.lng !== null && (
                          <a
                            href={directionsUrl(h.lat, h.lng)}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`${t("site.facility.directions")}: ${h.name}`}
                            className={buttonClassName({ variant: "secondary", pill: true })}
                          >
                            <NavigationArrow aria-hidden="true" className="size-4" />
                            {t("site.facility.directions")}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </Panel>
            </section>
          </div>

          {/* what to do, in order: numbered steps on one card, kept in view on wide screens */}
          <Panel
            as="aside"
            aria-labelledby="guidance"
            className="flex flex-col gap-4 self-start p-5 lg:sticky lg:top-24"
          >
            <h2 id="guidance" className="m-0 text-h3">
              {t("site.emergency.guidanceTitle")}
            </h2>
            <ol className="m-0 flex list-none flex-col gap-4 p-0">
              {[
                t("site.emergency.guidance.call", { number: EMERGENCY.number }),
                t("site.emergency.guidance.nearest"),
                t("site.emergency.guidance.bring"),
              ].map((line, index) => (
                <li key={line} className="flex items-start gap-3 text-fg">
                  <span
                    aria-hidden="true"
                    className="grid size-7 shrink-0 place-items-center rounded-full bg-danger-bg font-heading text-body-sm font-bold text-danger tabular-nums"
                  >
                    {index + 1}
                  </span>
                  <span className="pt-0.5 leading-relaxed">{line}</span>
                </li>
              ))}
            </ol>
          </Panel>
        </div>
      </PageContainer>
    </PublicLayout>
  );
}

// ---- /help ----

const HELP_CATEGORIES = [
  "finding",
  "queue",
  "booking",
  "arrival",
  "insurance",
  "accounts",
  "documents",
  "technical",
] as const;

/** The emergency line as one tap, beside help and contact: red only here, always with words. */
function EmergencyCallCard({ note }: { note?: string }) {
  const { t } = useTranslation();
  const call = (
    <a
      href={`tel:${EMERGENCY.number}`}
      className="ml-press group flex items-center gap-3 rounded-panel bg-danger-bg p-4 no-underline shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-danger)_18%,transparent)]"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-danger-solid text-on-danger-solid">
        <Phone aria-hidden="true" weight="fill" className="size-4" />
      </span>
      <span className="flex flex-col">
        <span className="text-body-sm text-fg-secondary">{t("nav.strip.long")}</span>
        <span className="font-bold text-danger">{t("nav.strip.call")}</span>
      </span>
    </a>
  );
  if (!note) return call;
  return (
    <div className="flex flex-col gap-2">
      {call}
      <p className="m-0 px-1 text-caption leading-relaxed text-fg-secondary">{note}</p>
    </div>
  );
}

/** Each help topic's own mark, as the services index has one per category. */
const HELP_ICONS: Record<(typeof HELP_CATEGORIES)[number], Icon> = {
  finding: MagnifyingGlass,
  queue: UsersThree,
  booking: CalendarCheck,
  arrival: MapPin,
  insurance: ShieldCheck,
  accounts: UserCircle,
  documents: FileText,
  technical: DeviceMobile,
};

/**
 * Help centre (audit 2026-11-07): the search first; the five questions people ask most with their
 * answers in view; the rest grouped by topic and folded; published articles; then Contact. While
 * searching, every match shows its answer.
 */
export function HelpPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage ?? "rw";
  const api = useApi();
  const [text, setText] = useState("");
  const words = text.trim().toLowerCase();
  const articles = useQuery({
    queryKey: ["discovery", "help-articles", words],
    queryFn: () => api.help.public.articles(words ? { q: words } : {}),
  });
  const all = HELP_CATEGORIES.map((key) => ({
    key,
    title: t(`site.help.categories.${key}.title`),
    items: ([1, 2] as const).map((n) => ({
      q: t(`site.help.categories.${key}.q${n}`),
      a: t(`site.help.categories.${key}.a${n}`),
    })),
  }));
  // the first question of the first five topics: finding, queue, booking, arrival, insurance
  const top = all.slice(0, 5).map((group) => group.items[0]!);
  const rest = all
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !top.includes(item)),
    }))
    .filter((group) => group.items.length);
  const matches = words
    ? all.flatMap((group) =>
        group.items.filter((item) => `${item.q} ${item.a}`.toLowerCase().includes(words)),
      )
    : [];

  const answers = (items: { q: string; a: string }[]) => (
    <dl className="m-0 flex flex-col overflow-hidden rounded-panel bg-surface shadow-e1">
      {items.map((item) => (
        <div
          key={item.q}
          className="flex flex-col gap-1.5 border-b border-hairline px-5 py-4 last:border-b-0"
        >
          <dt className="font-semibold text-fg">{item.q}</dt>
          <dd className="ml-measure m-0 leading-relaxed text-fg-secondary">{item.a}</dd>
        </div>
      ))}
    </dl>
  );

  return (
    <PublicLayout>
      <PageContainer className="pb-16">
        <PageHeader crumbs={[{ label: t("footer.help") }]} title={t("site.help.title")} />
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="flex min-w-0 flex-col gap-10">
            <SearchBar
              id="help-search"
              label={t("site.help.search")}
              value={text}
              onChange={setText}
              placeholder={t("site.help.search")}
            />
            {words ? (
              <section aria-labelledby="help-results" className="flex flex-col gap-4">
                <h2 id="help-results" className="m-0 font-heading text-title font-bold">
                  {t("site.help.results", { count: matches.length })}
                </h2>
                {matches.length ? (
                  answers(matches)
                ) : (
                  <Panel as="div">
                    <EmptyState title={t("site.help.none")} />
                  </Panel>
                )}
              </section>
            ) : (
              <>
                <section aria-labelledby="help-top" className="flex flex-col gap-4">
                  <h2 id="help-top" className="m-0 font-heading text-title font-bold">
                    {t("site.help.top")}
                  </h2>
                  {answers(top)}
                </section>
                <section aria-labelledby="help-more" className="flex flex-col gap-4">
                  <h2 id="help-more" className="m-0 font-heading text-title font-bold">
                    {t("site.help.more")}
                  </h2>
                  <div className="gap-4 md:columns-2 [&>*]:mb-4 [&>*]:break-inside-avoid">
                    {rest.map((group) => {
                      const TopicIcon = HELP_ICONS[group.key];
                      return (
                        <Panel
                          key={group.key}
                          aria-labelledby={`help-${group.key}`}
                          className="overflow-hidden"
                        >
                          <div className="flex items-center gap-3 border-b border-hairline px-5 py-3.5">
                            <span
                              aria-hidden="true"
                              className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-subtle text-on-brand-subtle"
                            >
                              <TopicIcon weight="duotone" className="size-5" />
                            </span>
                            <h3 id={`help-${group.key}`} className="m-0 text-h3">
                              {group.title}
                            </h3>
                          </div>
                          {group.items.map((item) => (
                            <Faq key={item.q} question={item.q}>
                              {item.a}
                            </Faq>
                          ))}
                        </Panel>
                      );
                    })}
                  </div>
                </section>
              </>
            )}
            {articles.isSuccess && articles.data.results.length > 0 && (
              <Panel aria-labelledby="articles" className="overflow-hidden">
                <h2 id="articles" className="m-0 border-b border-hairline px-5 py-4 text-h3">
                  {t("site.help.articles")}
                </h2>
                <ul className="m-0 list-none p-0">
                  {articles.data.results.slice(0, 8).map((article) => (
                    <LinkRow
                      key={article.id}
                      to={`/support/articles/${article.slug}`}
                      title={pick(article.title_i18n, lang)}
                      detail={pick(article.summary_i18n, lang)}
                    />
                  ))}
                </ul>
              </Panel>
            )}
          </div>

          {/* beside the questions: a person to ask, and the emergency line, always in reach */}
          <aside className="flex flex-col gap-4 lg:sticky lg:top-24">
            <Panel as="div" className="flex flex-col items-start gap-3 p-5">
              <span
                aria-hidden="true"
                className="grid size-10 place-items-center rounded-xl bg-brand-subtle text-on-brand-subtle"
              >
                <ChatCircleText weight="duotone" className="size-5" />
              </span>
              <h2 className="m-0 text-h3">{t("site.help.contactTitle")}</h2>
              <Link
                to="/contact"
                viewTransition
                className={buttonClassName({ pill: true, className: "ml-press w-full" })}
              >
                {t("site.help.contactAction")}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </Panel>
            <EmergencyCallCard />
          </aside>
        </div>
      </PageContainer>
    </PublicLayout>
  );
}

// ---- /about ----

const ABOUT_FACTS = ["languages", "data", "account"] as const;

/**
 * About: one short paragraph and the facts (audit 2026-11-07). The journey lives on How it works;
 * it is not told again here.
 */
export function AboutPage() {
  const { t } = useTranslation();
  const all = useAllFacilities();
  const count = new Set((all.data ?? []).map((r) => r.slug)).size;
  return (
    <PublicLayout>
      <PageContainer narrow className="pb-20">
        <PageHeader crumbs={[{ label: t("footer.about") }]} title={t("site.about.title")} />
        <div className="flex flex-col gap-8">
          <p className="ml-measure m-0 text-body leading-relaxed text-fg">{t("site.about.body")}</p>
          <dl className="m-0 grid gap-px overflow-hidden rounded-panel bg-[var(--site-hairline)] shadow-e1 sm:grid-cols-2">
            <div className="flex flex-col gap-1 bg-surface p-5">
              <dt className="text-body-sm text-fg-secondary">{t("site.about.facts.facilities")}</dt>
              <dd className="m-0 font-heading text-kpi font-bold tabular-nums">
                {all.data ? count : "–"}
              </dd>
            </div>
            {ABOUT_FACTS.map((key) => (
              <div key={key} className="flex flex-col gap-1 bg-surface p-5">
                <dt className="text-body-sm text-fg-secondary">
                  {t(`site.about.facts.${key}.label`)}
                </dt>
                <dd className="m-0 font-semibold text-fg">{t(`site.about.facts.${key}.value`)}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/how-it-works"
              viewTransition
              className={buttonClassName({ variant: "secondary", pill: true })}
            >
              {t("nav.howItWorks")}
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
            <Link
              to="/for-facilities"
              viewTransition
              className={buttonClassName({ variant: "secondary", pill: true })}
            >
              {t("public.about.forFacilities")}
            </Link>
            <Link
              to="/privacy"
              viewTransition
              className={buttonClassName({ variant: "secondary", pill: true })}
            >
              {t("public.about.privacy")}
            </Link>
          </div>
        </div>
      </PageContainer>
    </PublicLayout>
  );
}

// ---- /contact ----

type ContactField = "name" | "reach" | "subject" | "message";
const CONTACT_FIELDS: ContactField[] = ["name", "reach", "subject", "message"];

/**
 * Contact (upgrade 11 §5): support information and a form with validation, sending, success and
 * error. Sends to the public contact endpoint (upgrade 11 §13): the message reaches the MediLink
 * team's inbox and the visitor gets a reference. Health details are refused, field by field.
 */
export function ContactPage() {
  const { t } = useTranslation();
  const api = useApi();
  const [values, setValues] = useState<Record<ContactField, string>>({
    name: "",
    reach: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<ContactField, string>>>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [reference, setReference] = useState("");

  const update = (field: ContactField) => (value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const found: Partial<Record<ContactField, string>> = {};
    if (!values.name.trim()) found.name = t("site.contact.errors.name");
    const reach = values.reach.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reach) && !/^\+?[\d\s]{9,15}$/.test(reach))
      found.reach = t("site.contact.errors.reach");
    if (!values.subject.trim()) found.subject = t("site.contact.errors.subject");
    if (values.message.trim().length < 10) found.message = t("site.contact.errors.message");
    setErrors(found);
    const first = (Object.keys(found) as ContactField[])[0];
    if (first) {
      document.getElementById(`contact-${first}`)?.focus();
      return;
    }
    setState("sending");
    try {
      const receipt = await api.help.public.contact({
        name: values.name.trim(),
        reach: reach,
        subject: values.subject.trim(),
        message: values.message.trim(),
      });
      setReference(receipt.reference);
      setState("sent");
      setValues({ name: "", reach: "", subject: "", message: "" });
    } catch (error) {
      // the server's own words per field (e.g. "no health details here"), else the general error
      const server: Partial<Record<ContactField, string>> = {};
      if (error instanceof ApiError && error.status === 400) {
        for (const field of CONTACT_FIELDS) {
          const message = error.fields[field]?.[0];
          if (message) server[field] = message;
        }
      }
      const field = CONTACT_FIELDS.find((f) => server[f]);
      setErrors(server);
      setState(field ? "idle" : "failed");
      if (field) document.getElementById(`contact-${field}`)?.focus();
    }
  };

  return (
    <PublicLayout>
      <PageContainer className="pb-16">
        <PageHeader crumbs={[{ label: t("footer.contact") }]} title={t("site.contact.title")} />
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <Panel as="div" className="p-6 sm:p-8">
            {state === "sent" ? (
              <Alert tone="success" role="status" title={t("site.contact.sent")}>
                {reference && t("site.contact.reference", { reference })}
              </Alert>
            ) : (
              <form noValidate onSubmit={(e) => void submit(e)} className="flex flex-col gap-5">
                {state === "failed" && (
                  <Alert tone="danger" role="alert" title={t("site.contact.failed")} />
                )}
                <div className="grid gap-5 sm:grid-cols-2">
                  <TextField
                    id="contact-name"
                    label={t("site.contact.name")}
                    autoComplete="name"
                    value={values.name}
                    onChange={(e) => update("name")(e.target.value)}
                    error={errors.name}
                  />
                  <TextField
                    id="contact-reach"
                    label={t("site.contact.reach")}
                    hint={t("site.contact.reachHint")}
                    autoComplete="email"
                    value={values.reach}
                    onChange={(e) => update("reach")(e.target.value)}
                    error={errors.reach}
                  />
                </div>
                <TextField
                  id="contact-subject"
                  label={t("site.contact.subject")}
                  value={values.subject}
                  onChange={(e) => update("subject")(e.target.value)}
                  error={errors.subject}
                />
                <TextareaField
                  id="contact-message"
                  label={t("site.contact.message")}
                  rows={6}
                  maxLength={2000}
                  value={values.message}
                  onChange={(e) => update("message")(e.target.value)}
                  error={errors.message}
                />
                <Button
                  type="submit"
                  size="lg"
                  pill
                  loading={state === "sending"}
                  className={cx("self-start px-7")}
                >
                  {state === "sending" ? t("site.contact.sending") : t("site.contact.send")}
                </Button>
              </form>
            )}
          </Panel>
          {/* beside the form: where answers may already be, and the emergency line */}
          <aside className="flex flex-col gap-4 lg:sticky lg:top-24">
            <Panel as="div" className="flex flex-col items-start gap-3 p-5">
              <span
                aria-hidden="true"
                className="grid size-10 place-items-center rounded-xl bg-brand-subtle text-on-brand-subtle"
              >
                <Lifebuoy weight="duotone" className="size-5" />
              </span>
              <h2 className="m-0 text-h3">{t("site.contact.infoTitle")}</h2>
              <p className="m-0 text-body-sm leading-relaxed text-fg-secondary">
                {t("site.contact.infoBody")}
              </p>
              <Link
                to="/help"
                viewTransition
                className={buttonClassName({
                  variant: "secondary",
                  pill: true,
                  className: "ml-press w-full",
                })}
              >
                {t("footer.help")}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </Panel>
            <EmergencyCallCard note={t("site.contact.emergency", { number: EMERGENCY.number })} />
          </aside>
        </div>
      </PageContainer>
    </PublicLayout>
  );
}

// ---- /accessibility, /privacy, /terms ----

export function AccessibilityPage() {
  const { t } = useTranslation();
  return (
    <PublicLayout>
      <PageContainer narrow className="pb-16">
        <PageHeader
          crumbs={[{ label: t("footer.accessibility") }]}
          title={t("site.accessibility.title")}
        />
        <Document>
          <Updated />
          {(["standard", "features", "offline", "limits", "feedback"] as const).map((key) => (
            <DocSection key={key} title={t(`site.accessibility.sections.${key}.title`)}>
              <p className="m-0">
                <Confirm>{t(`site.accessibility.sections.${key}.body`)}</Confirm>
              </p>
            </DocSection>
          ))}
        </Document>
      </PageContainer>
    </PublicLayout>
  );
}

const LEGAL_SECTIONS = {
  privacy: ["who", "what", "why", "where", "rights", "retention", "contact"],
  terms: ["account", "bookings", "emergencies", "guidance", "facilities", "fairUse", "law"],
} as const;

/** Privacy policy and terms: plain summary, then the sections; draft text is marked. */
function LegalPage({ doc }: { doc: "privacy" | "terms" }) {
  const { t } = useTranslation();
  return (
    <PublicLayout>
      <PageContainer className="pb-20">
        {/* the breadcrumb always matches the H1 */}
        <PageHeader
          crumbs={[{ label: t(`public.${doc}.title`) }]}
          title={t(`public.${doc}.title`)}
        />
        {/* the text beside a contents list that stays in view on wide screens */}
        <div className="grid items-start gap-8 lg:grid-cols-[15rem_minmax(0,1fr)]">
          <nav aria-label={t("site.onThisPage")} className="hidden lg:sticky lg:top-24 lg:block">
            <p className="m-0 mb-2 text-body-sm font-semibold text-fg">{t("site.onThisPage")}</p>
            <ol className="m-0 flex list-none flex-col border-l border-border p-0">
              {LEGAL_SECTIONS[doc].map((key) => (
                <li key={key}>
                  <a
                    href={`#${doc}-${key}`}
                    className="-ml-px block border-l border-transparent py-1.5 pl-4 text-body-sm text-link no-underline hover:border-fg-muted hover:underline"
                  >
                    {t(`public.${doc}.sections.${key}.title`)}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="mx-auto w-full max-w-[48rem]">
            <Document>
              <Updated />
              <DocSection title={t("public.legal.summaryTitle")}>
                <p className="m-0">
                  <Confirm>{t(`public.${doc}.summary`)}</Confirm>
                </p>
              </DocSection>
              {LEGAL_SECTIONS[doc].map((key) => (
                <DocSection
                  key={key}
                  id={`${doc}-${key}`}
                  title={t(`public.${doc}.sections.${key}.title`)}
                >
                  <p className="m-0">
                    <Confirm>{t(`public.${doc}.sections.${key}.body`)}</Confirm>
                  </p>
                </DocSection>
              ))}
            </Document>
          </div>
        </div>
      </PageContainer>
    </PublicLayout>
  );
}

export function PrivacyPage() {
  return <LegalPage doc="privacy" />;
}

export function TermsPage() {
  return <LegalPage doc="terms" />;
}
