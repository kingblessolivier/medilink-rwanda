import type { PublicFacility, PublicService } from "@medilink/api-client";
import {
  CalendarPlus,
  CaretRight,
  CheckCircle,
  EnvelopeSimple,
  Globe,
  MapPin,
  MinusCircle,
  NavigationArrow,
  PersonSimpleWalk,
  Phone,
  SealCheck,
  ShieldCheck,
  Siren,
} from "@phosphor-icons/react";
import {
  buttonClassName,
  cx,
  Lightbox,
  Skeleton,
  StatusPill,
  StickyActionBar,
  StickyActionBarSpacer,
} from "@medilink/ui";
import { dateFormat, kigaliDate } from "@medilink/ui/i18n";
import { useQuery } from "@tanstack/react-query";
import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams, useSearchParams } from "react-router";

import { useApi } from "../../app/services";
import { env } from "../../env";
import { PublicLayout } from "../../layout/PublicLayout";
import { FacilityBuilding } from "../site/buildings";
import { doctorSlug, EMERGENCY, isHospital, serviceSlug } from "../site/data";
import {
  EmptyState,
  FacilityStatus,
  InsuranceList,
  NotFoundState,
  HEADER_PRIMARY,
  HEADER_SECONDARY,
  PageContainer,
  PageHeader,
  Panel,
  WaitingTime,
} from "../site/kit";
import { canonicalUrl, facilityJsonLd, siteOrigin } from "../site/seo";
import { day, directionsUrl, pick, pinKind, time } from "./discovery";
import { insurerNames } from "./Places";
import { rememberPlace } from "./recent";

const FacilityMap = lazy(() => import("@medilink/ui/map"));

const WEEKDAYS = [0, 1, 2, 3, 4, 5, 6];

function weekdayName(index: number, language: string): string {
  // 2024-01-01 was a Monday
  return dateFormat(language, { weekday: "short", timeZone: "UTC" }).format(
    new Date(Date.UTC(2024, 0, 1 + index)),
  );
}

/** Join today's queue while open where a service allows it, otherwise book; nothing if neither. */
function primaryAction(f: PublicFacility, wanted: string | null) {
  const ordered = [...f.services].sort(
    (a, b) =>
      Number(b.code === wanted || b.id === wanted) - Number(a.code === wanted || a.id === wanted),
  );
  // today's queue only while the facility is open; otherwise a time can still be booked
  const join = f.open_now ? ordered.find((s) => s.remote_join) : undefined;
  if (join) return { kind: "join" as const, to: `/book/${f.slug}?service=${join.id}&today=1` };
  const book = ordered.find((s) => s.bookable);
  if (book) return { kind: "book" as const, to: `/book/${f.slug}?service=${book.id}` };
  return null;
}

/**
 * Facility profile (upgrade 11 §5): header with type, place, verified (only when true), open
 * status and directions; **Today** as a summary list (hours, live wait, queue and booking,
 * insurers, hospital note); then services, doctors, about and photos on one page, with the
 * location, the week and what to bring beside. The primary action follows real availability.
 * No prices (U-01). Public.
 */
export function FacilityPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage ?? "rw";
  const api = useApi();
  const { slug = "" } = useParams();
  const [params] = useSearchParams();
  const [now] = useState(() => Date.now());
  const facility = useQuery({
    queryKey: ["discovery", "facility", slug],
    queryFn: () => api.booking.facility(slug),
  });
  const name = facility.data?.name;
  useEffect(() => {
    if (name) rememberPlace({ slug, name });
  }, [slug, name]);

  if (facility.isPending)
    return (
      <PublicLayout>
        <PageContainer className="flex flex-col gap-4 py-10">
          <Skeleton className="h-6 w-48 rounded-md" />
          <Skeleton className="h-10 w-2/3 rounded-lg" />
          <Skeleton className="h-48 rounded-3xl" />
        </PageContainer>
      </PublicLayout>
    );
  if (facility.isError || !facility.data)
    return (
      <PublicLayout>
        <PageContainer narrow>
          <NotFoundState
            title={t("site.facility.notFound")}
            reason={t("site.facility.notFoundReason")}
            back={{ to: "/facilities", label: t("site.facility.back") }}
          />
        </PageContainer>
      </PublicLayout>
    );

  const f = facility.data;
  const action = primaryAction(f, params.get("service"));
  const directions = f.lat !== null && f.lng !== null ? directionsUrl(f.lat, f.lng) : null;
  const byDay = new Map(f.hours.map(([date, open, close]) => [date, `${open}–${close}`]));
  const week = Array.from({ length: 7 }, (_, i) => {
    const iso = kigaliDate(new Date(now + i * 86_400_000));
    return { iso, hours: byDay.get(iso) ?? null };
  });
  const todayHours = week[0]?.hours ?? null;
  const live = f.services.filter((s) => s.waiting !== null && s.waiting !== undefined);
  const insurers = [...new Set(f.services.flatMap((s) => s.insurers))].sort();
  const hospital = isHospital(f.type);
  const place = [f.sector, f.district].filter(Boolean).join(", ");
  const about = pick(f.description_i18n, lang);
  const summary =
    about ||
    [t(`booking.types.${f.type}`, { defaultValue: f.type }), place].filter(Boolean).join(" · ");

  return (
    <PublicLayout>
      <PageContainer className="pb-16">
        <PageHeader
          crumbs={[{ to: "/facilities", label: t("nav.facilities") }, { label: f.name }]}
          title={f.name}
          description={summary}
          jsonLd={facilityJsonLd(f, canonicalUrl(siteOrigin(), `/facilities/${f.slug}`), summary)}
          titleTransition={`facility-name-${f.slug}`}
          art={
            <FacilityBuilding
              type={f.type}
              emergency={f.emergency_department}
              className="block aspect-[16/7] w-full"
              style={{ viewTransitionName: `facility-art-${f.slug}` }}
            />
          }
          lead={
            <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <span>{t(`booking.types.${f.type}`, { defaultValue: f.type })}</span>
              {place && (
                <span className="inline-flex items-center gap-1">
                  <MapPin aria-hidden="true" className="size-4" />
                  {place}
                </span>
              )}
              <FacilityStatus open={f.open_now} />
              {f.emergency_department && (
                <StatusPill tone="emergency">{t("site.emergency.department")}</StatusPill>
              )}
              {f.verified && (
                <span className="inline-flex items-center gap-1 font-semibold text-brand">
                  <SealCheck aria-hidden="true" weight="fill" className="size-4" />
                  {t("site.facility.verified")}
                </span>
              )}
            </span>
          }
          actions={
            <>
              {directions && (
                <a href={directions} target="_blank" rel="noreferrer" className={HEADER_SECONDARY}>
                  <NavigationArrow aria-hidden="true" className="size-4" />
                  {t("site.facility.directions")}
                  <span className="sr-only"> {t("common.opensInNewTab")}</span>
                </a>
              )}
              {/* phones have it in the sticky bar at the bottom instead */}
              {action && (
                <span className="hidden md:contents">
                  <Link to={action.to} viewTransition className={HEADER_PRIMARY}>
                    {action.kind === "join" ? (
                      <PersonSimpleWalk aria-hidden="true" className="size-4" />
                    ) : (
                      <CalendarPlus aria-hidden="true" className="size-4" />
                    )}
                    {action.kind === "join"
                      ? t("site.facility.joinQueue")
                      : t("site.facility.bookAppointment")}
                  </Link>
                </span>
              )}
            </>
          }
        />

        {/*
         * One page, no tabs (public design brief 2026-11-04): today's facts as a summary list,
         * then the services with their live waits, the doctors and the facility's own words; the
         * place, the week's hours and what to bring beside. Photos, when the facility has added
         * them, come after the facts, never as a hero.
         */}
        <div className="grid gap-x-10 gap-y-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="flex min-w-0 flex-col gap-10">
            <section aria-labelledby="today" className="flex flex-col gap-3">
              <h2 id="today" className="m-0 font-heading text-h2">
                {t("site.facility.today")}
              </h2>
              <Panel as="div" className="overflow-hidden">
                <dl className="m-0">
                  <Summary label={t("site.facility.hoursToday")}>
                    <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1">
                      <FacilityStatus open={f.open_now} />
                      <span className="tabular-nums">
                        {todayHours ?? t("site.facility.closedToday")}
                      </span>
                    </span>
                  </Summary>
                  <Summary label={t("site.facility.liveWait")}>
                    {live.length === 0 ? (
                      <span className="text-fg-secondary">{t("site.facility.waitUnknown")}</span>
                    ) : (
                      <table className="w-full border-collapse text-body-sm">
                        <caption className="sr-only">{t("site.facility.liveWait")}</caption>
                        <tbody>
                          {live.map((s) => (
                            <tr key={s.id} className="border-b border-hairline last:border-b-0">
                              <th scope="row" className="py-1.5 pr-4 text-left font-normal">
                                {pick(s.name_i18n, lang)}
                              </th>
                              <td className="py-1.5 text-right tabular-nums">
                                <WaitingTime result={s} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </Summary>
                  <Summary label={t("site.facility.queue")}>
                    <Availability on={f.services.some((s) => s.remote_join || s.walk_in)} />
                  </Summary>
                  <Summary label={t("site.facility.booking")}>
                    <Availability on={f.services.some((s) => s.bookable)} />
                  </Summary>
                </dl>
                {(hospital || f.emergency_department) && (
                  <p className="m-0 flex items-start gap-2 border-t border-hairline bg-danger-bg px-5 py-4 text-body-sm text-fg sm:px-6">
                    <Siren
                      aria-hidden="true"
                      weight="bold"
                      className="mt-0.5 size-4 shrink-0 text-danger"
                    />
                    {f.emergency_department
                      ? t("site.facility.emergencyOpen", { number: EMERGENCY.number })
                      : t("site.facility.emergencyNote", { number: EMERGENCY.number })}
                  </p>
                )}
              </Panel>
            </section>

            <section aria-labelledby="services" className="flex flex-col gap-3">
              <h2 id="services" className="m-0 font-heading text-h2">
                {t("site.facility.tabs.services")}
              </h2>
              <Panel as="div" className="overflow-hidden">
                {f.services.length === 0 ? (
                  <EmptyState title={t("site.facility.noServices")} />
                ) : (
                  <ul className="m-0 list-none p-0">
                    {f.services.map((s) => (
                      <ServiceRow key={s.id} slug={f.slug} service={s} />
                    ))}
                  </ul>
                )}
              </Panel>
            </section>

            <section aria-labelledby="doctors" className="flex flex-col gap-3">
              <h2 id="doctors" className="m-0 font-heading text-h2">
                {t("site.facility.tabs.doctors")}
              </h2>
              <Panel as="div" className="overflow-hidden">
                {f.doctors.length === 0 ? (
                  <p className="m-0 px-5 py-4 text-fg-secondary sm:px-6">
                    {t("site.facility.noDoctors")}
                  </p>
                ) : (
                  <ul className="m-0 list-none p-0">
                    {f.doctors.map((d) => (
                      <li
                        key={d.membership_id}
                        className="border-b border-hairline last:border-b-0"
                      >
                        <Link
                          to={`/doctors/${doctorSlug(f.slug, d.membership_id)}`}
                          viewTransition
                          className="ml-press flex min-h-14 flex-col gap-1 px-5 py-3.5 text-fg no-underline transition-colors duration-150 hover:bg-page sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6"
                        >
                          <span className="flex min-w-0 flex-col gap-0.5">
                            <span className="font-semibold text-fg">{d.name}</span>
                            <span className="text-body-sm text-fg-secondary">
                              {f.services
                                .filter((s) => d.service_ids.includes(s.id))
                                .map((s) => pick(s.name_i18n, lang))
                                .join(" · ")}
                            </span>
                          </span>
                          <span className="inline-flex items-center gap-3 text-body-sm text-fg-secondary tabular-nums">
                            {WEEKDAYS.filter((w) => d.days.includes(w))
                              .map((w) => weekdayName(w, lang))
                              .join(" · ")}
                            <CaretRight aria-hidden="true" className="size-4 text-fg-muted" />
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </Panel>
            </section>

            <section aria-labelledby="insurance" className="flex flex-col gap-3">
              <h2 id="insurance" className="m-0 font-heading text-h2">
                {t("site.facility.insurance")}
              </h2>
              <Panel as="div" className="flex flex-col gap-3 px-5 py-4 sm:px-6">
                <InsuranceList codes={insurers} />
                {f.level_of_care !== "primary" && (
                  <p className="m-0 text-body-sm text-fg-secondary">
                    {t("site.facility.referral")}
                  </p>
                )}
              </Panel>
            </section>

            <section aria-labelledby="about" className="flex flex-col gap-3">
              <h2 id="about" className="m-0 font-heading text-h2">
                {t("site.facility.about")}
              </h2>
              <Panel as="div" className="px-5 py-4 sm:px-6">
                <p className="m-0 max-w-[68ch] leading-relaxed whitespace-pre-line text-fg">
                  {about || (
                    <span className="text-fg-secondary">{t("site.facility.noDescription")}</span>
                  )}
                </p>
              </Panel>
            </section>

            <Photos name={f.name} photos={f.photos} />
          </div>

          <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start lg:pt-11">
            <Panel aria-labelledby="location" className="overflow-hidden">
              {f.lat !== null && f.lng !== null && (
                <Suspense fallback={<Skeleton className="h-44 rounded-none" />}>
                  <FacilityMap
                    points={[
                      {
                        id: f.slug,
                        lat: f.lat,
                        lng: f.lng,
                        kind: pinKind(f.type),
                        load: null,
                        label: f.name,
                      },
                    ]}
                    selectedId={f.slug}
                    tilesUrl={env.mapTilesUrl}
                    attribution={t("home.mapAttribution")}
                    label={t("site.facility.map")}
                    // flush with the card's top edge (the map's own radius and shadow are dropped)
                    className="h-44 rounded-none! shadow-none!"
                  />
                </Suspense>
              )}
              <div className="flex flex-col gap-4 p-5">
                <Contact f={f} />
                {directions && (
                  <a
                    href={directions}
                    target="_blank"
                    rel="noreferrer"
                    className={buttonClassName({ variant: "secondary", fullWidth: true })}
                  >
                    <NavigationArrow aria-hidden="true" className="size-4" />
                    {t("site.facility.directions")}
                    <span className="sr-only"> {t("common.opensInNewTab")}</span>
                  </a>
                )}
              </div>
            </Panel>

            <Panel aria-labelledby="week" className="p-5">
              <h2 id="week" className="m-0 text-h3">
                {t("site.facility.week")}
              </h2>
              <dl className="m-0 mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-body-sm">
                {week.map(({ iso, hours }, index) => (
                  <div key={iso} className="contents">
                    <dt className={cx("first-letter:uppercase", index === 0 && "font-semibold")}>
                      {day(iso, lang, "short")}
                    </dt>
                    <dd
                      className={cx(
                        "m-0 text-right tabular-nums",
                        index === 0 && "font-semibold",
                        !hours && "text-fg-muted",
                      )}
                    >
                      {hours ?? t("site.closed")}
                    </dd>
                  </div>
                ))}
              </dl>
              <h3 className="m-0 mt-4 text-body-sm font-semibold text-fg">
                {t("site.facility.closures")}
              </h3>
              <p className="m-0 mt-1 text-body-sm text-fg-secondary">
                {f.closures.length
                  ? f.closures.map((c) => day(c.date, lang, "short")).join(", ")
                  : t("site.facility.noClosures")}
              </p>
            </Panel>

            <Panel aria-labelledby="bring" className="p-5">
              <h2 id="bring" className="m-0 text-h3">
                {t("site.facility.bring.title")}
              </h2>
              <ul className="m-0 mt-3 flex list-disc flex-col gap-2 pl-5 text-body-sm text-fg-secondary">
                {[
                  t("site.facility.bring.insurance"),
                  t("site.facility.bring.id"),
                  f.level_of_care !== "primary" ? t("site.facility.bring.referral") : null,
                  t("site.facility.bring.documents"),
                ]
                  .filter((item): item is string => Boolean(item))
                  .map((item) => (
                    <li key={item}>{item}</li>
                  ))}
              </ul>
            </Panel>
          </aside>
        </div>
        {action && <StickyActionBarSpacer />}
      </PageContainer>
      {action && (
        <StickyActionBar
          summary={
            <span className="flex flex-col">
              <span className="truncate font-semibold text-fg">{f.name}</span>
              <span className="tabular-nums">
                {f.open_now ? t("site.open") : t("site.closed")}
                {todayHours ? ` · ${todayHours}` : ""}
              </span>
            </span>
          }
        >
          <Link to={action.to} viewTransition className={buttonClassName({ pill: true })}>
            {action.kind === "join"
              ? t("site.facility.joinQueue")
              : t("site.facility.bookAppointment")}
          </Link>
        </StickyActionBar>
      )}
    </PublicLayout>
  );
}

/** One fact of today's summary: the label on the left, the answer on the right (NHS summary list). */
function Summary({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-hairline px-5 py-3.5 last:border-b-0 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-6 sm:px-6">
      <dt className="font-semibold text-fg">{label}</dt>
      <dd className="m-0 text-fg">{children}</dd>
    </div>
  );
}

/** Available or not, with a word and a mark, never colour alone. */
function Availability({ on }: { on: boolean }) {
  const { t } = useTranslation();
  return (
    <span className={cx("inline-flex items-center gap-1.5", on ? "text-success" : "text-fg-muted")}>
      {on ? (
        <CheckCircle aria-hidden="true" weight="fill" className="size-4" />
      ) : (
        <MinusCircle aria-hidden="true" className="size-4" />
      )}
      {on ? t("site.facility.available") : t("site.facility.notAvailable")}
    </span>
  );
}

function Contact({ f }: { f: PublicFacility }) {
  const { t } = useTranslation();
  const website = f.website ? webLink(f.website) : null;
  return (
    <div>
      <h2 id="location" className="m-0 text-h3 font-bold">
        {t("site.facility.contact")}
      </h2>
      <dl className="m-0 mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-body-sm">
        <dt className="text-fg-muted">{t("site.facility.address")}</dt>
        <dd className="m-0">{f.address || t("site.facility.notListed")}</dd>
        <dt className="text-fg-muted">{t("site.facility.phone")}</dt>
        <dd className="m-0">
          {f.phone ? (
            <a href={`tel:${f.phone}`} className="inline-flex items-center gap-1.5 font-semibold">
              <Phone aria-hidden="true" className="size-4" />
              {f.phone}
            </a>
          ) : (
            t("site.facility.notListed")
          )}
        </dd>
        {f.email && (
          <>
            <dt className="text-fg-muted">{t("site.facility.email")}</dt>
            <dd className="m-0 min-w-0">
              <a
                href={`mailto:${f.email}`}
                className="inline-flex max-w-full items-center gap-1.5 font-semibold break-all"
              >
                <EnvelopeSimple aria-hidden="true" className="size-4 shrink-0" />
                {f.email}
              </a>
            </dd>
          </>
        )}
        {website && (
          <>
            <dt className="text-fg-muted">{t("site.facility.website")}</dt>
            <dd className="m-0 min-w-0">
              <a
                href={website.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex max-w-full items-center gap-1.5 font-semibold break-all"
              >
                <Globe aria-hidden="true" className="size-4 shrink-0" />
                {website.host}
                <span className="sr-only"> {t("common.opensInNewTab")}</span>
              </a>
            </dd>
          </>
        )}
      </dl>
    </div>
  );
}

/** Only http(s) links are shown; the host alone reads cleaner than the whole URL. */
function webLink(value: string): { href: string; host: string } | null {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return { href: url.href, host: url.host.replace(/^www\./, "") };
  } catch {
    return null;
  }
}

/**
 * The facility's own photos, after the facts: a plain row of up to four, each opening full size in
 * a lightbox (never a bare image file). A photo that fails to load is left out, so no grey tile
 * stays behind. A place is described, not merchandised (public design brief 2026-11-04).
 */
function Photos({ name, photos }: { name: string; photos: string[] }) {
  const { t } = useTranslation();
  const [broken, setBroken] = useState<string[]>([]);
  const [open, setOpen] = useState<number | null>(null);
  const shown = photos.filter((src) => !broken.includes(src)).slice(0, 4);
  if (shown.length === 0) return null;
  const images = shown.map((src, index) => ({
    src,
    alt: t("site.facility.photoAlt", { name, n: index + 1, total: shown.length }),
  }));
  return (
    <section aria-labelledby="photos" className="flex flex-col gap-3">
      <h2 id="photos" className="m-0 font-heading text-h2">
        {t("site.facility.photos")}
      </h2>
      <ul className="m-0 grid list-none grid-cols-2 gap-2 p-0 sm:grid-cols-4">
        {images.map((image, index) => (
          <li key={image.src} className="overflow-hidden rounded-md bg-subtle">
            <button
              type="button"
              onClick={() => setOpen(index)}
              aria-label={t("site.facility.openPhoto", { n: index + 1, total: images.length })}
              className="block w-full cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              <img
                src={image.src}
                alt={image.alt}
                // the first two are near the fold on phones; the rest wait for the scroll
                loading={index < 2 ? "eager" : "lazy"}
                decoding="async"
                width={400}
                height={300}
                onError={() => setBroken((list) => [...list, image.src])}
                className="block aspect-[4/3] size-full object-cover transition-transform duration-200 ease-out hover:scale-[1.03] motion-reduce:hover:scale-100"
              />
            </button>
          </li>
        ))}
      </ul>
      <Lightbox
        images={images}
        index={open}
        onIndexChange={setOpen}
        labels={{
          close: t("common.close"),
          previous: t("site.facility.previousPhoto"),
          next: t("site.facility.nextPhoto"),
        }}
      />
    </section>
  );
}

/**
 * A service, in three tiers: the name with how to get it (tags) and the insurers; the live wait and
 * the next free time on the right; then the next step as real buttons, the main one filled.
 */
function ServiceRow({ slug, service }: { slug: string; service: PublicService }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage ?? "rw";
  const modes = [
    service.walk_in && t("site.facility.walkIn"),
    service.bookable && t("site.facility.appointment"),
    service.remote_join && t("site.facility.remote"),
  ].filter((mode): mode is string => Boolean(mode));
  const insurers = insurerNames(service.insurers, t);
  const actions = [
    service.remote_join && {
      to: `/book/${slug}?service=${service.id}&today=1`,
      label: t("booking.facility.join"),
      icon: PersonSimpleWalk,
    },
    service.bookable && {
      to: `/book/${slug}?service=${service.id}`,
      label: t("booking.facility.book"),
      icon: CalendarPlus,
    },
  ].filter((action): action is { to: string; label: string; icon: typeof CalendarPlus } =>
    Boolean(action),
  );
  return (
    <li className="flex flex-col gap-4 border-b border-hairline px-5 py-5 last:border-b-0 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="flex min-w-0 flex-col gap-2">
          <Link
            to={`/services/${serviceSlug(service.code)}`}
            viewTransition
            className="group inline-flex items-center gap-1 self-start font-heading text-h3 font-bold text-fg no-underline"
          >
            {pick(service.name_i18n, lang)}
            <CaretRight
              aria-hidden="true"
              className="size-4 text-fg-muted transition-transform duration-200 ease-out group-hover:translate-x-0.5"
            />
          </Link>
          {modes.length > 0 && (
            <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
              {modes.map((mode) => (
                <li
                  key={mode}
                  className="rounded-full bg-subtle px-2.5 py-0.5 text-caption font-semibold text-fg-secondary"
                >
                  {mode}
                </li>
              ))}
            </ul>
          )}
          {insurers.length > 0 && (
            <p className="m-0 inline-flex items-center gap-1.5 text-body-sm text-fg-secondary">
              <ShieldCheck aria-hidden="true" className="size-4 shrink-0 text-fg-muted" />
              {t("site.card.accepted")} {insurers.join(", ")}
            </p>
          )}
        </div>
        {/* the live figures: the wait, and under it the next free time */}
        <div className="flex shrink-0 flex-col gap-0.5 text-body-sm sm:items-end sm:text-right">
          <WaitingTime result={service} />
          {service.next_slot_at && (
            <span className="text-fg-secondary tabular-nums">
              {t("site.facility.nextTime", {
                day: day(service.next_slot_at, lang, "short"),
                time: time(service.next_slot_at, lang),
              })}
            </span>
          )}
        </div>
      </div>
      {actions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {actions.map((action, index) => (
            <Link
              key={action.to}
              to={action.to}
              viewTransition
              className={buttonClassName({
                variant: index === 0 ? "primary" : "secondary",
                size: "sm",
                pill: true,
                className: "ml-press min-h-10 px-4",
              })}
            >
              <action.icon aria-hidden="true" className="size-4" />
              {action.label}
            </Link>
          ))}
        </div>
      )}
    </li>
  );
}
