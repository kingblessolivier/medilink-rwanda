import type { FacilityResult } from "@medilink/api-client";
import {
  Eye,
  FirstAidKit,
  Flask,
  Hospital,
  List as ListIcon,
  MapPin,
  MapTrifold,
  Siren,
  Stethoscope,
  Tooth,
} from "@phosphor-icons/react";
import { Button, cx, SegmentedControl, Skeleton, StatusPill, type MapPoint } from "@medilink/ui";
import { lazy, Suspense, useRef, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import { FacilityBuilding } from "./buildings";
import { day, pinKind, time } from "../booking/discovery";
import { env } from "../../env";
import { insurerNames, MapCard, useWide, waitText } from "../booking/Places";

/**
 * Facilities as places, not a shop (upgrade 14 §4): one card per place with a drawing of its kind
 * of building, then what it is, where, open or busy with the live wait as a bar, the tags that
 * matter (24-hour emergency, insurers) and one next step. No photos, no prices (U-01).
 */

/** The kind of place as a quiet mark: hospital, health centre, dental, eye, lab or clinic. */
function TypeMark({ type }: { type: string }) {
  const props = { weight: "duotone", className: "size-4" } as const;
  if (type.includes("hospital")) return <Hospital {...props} />;
  if (type.startsWith("health_")) return <FirstAidKit {...props} />;
  if (type.includes("dental")) return <Tooth {...props} />;
  if (type.includes("eye")) return <Eye {...props} />;
  if (type.includes("diagnostic")) return <Flask {...props} />;
  return <Stethoscope {...props} />;
}

/** A wait this long fills the meter (minutes). */
const FULL_WAIT = 180;

/** The live wait as a short bar: emerald when short, ochre when long; words carry the number. */
export function WaitMeter({ result, className }: { result: FacilityResult; className?: string }) {
  const max = result.wait_range?.max ?? (result.waiting === 0 ? 0 : null);
  if (max === null) return null;
  return (
    <span
      aria-hidden="true"
      className={cx("block h-1.5 w-full overflow-hidden rounded-full bg-subtle", className)}
    >
      <span
        className={cx(
          "block h-full rounded-full transition-[width] duration-700 ease-out-quint",
          max > 60 ? "bg-attention-solid" : "bg-primary",
        )}
        style={{ width: `${Math.max(6, Math.min(100, (max / FULL_WAIT) * 100))}%` }}
      />
    </span>
  );
}

/** Open, busy or closed: the shared status pill, a word and a dot, never colour alone. */
function Status({ result }: { result: FacilityResult }) {
  const { t } = useTranslation();
  const busy = result.open_now && result.queue_load === "high";
  return (
    <StatusPill
      tone={!result.open_now ? "closed" : busy ? "busy" : "open"}
      live={result.open_now && !busy}
      className="bg-surface"
    >
      {!result.open_now ? t("site.card.closed") : busy ? t("site.card.busy") : t("site.card.open")}
    </StatusPill>
  );
}

/** Insurers shown as small tags; more than three fold into "+n". */
const SHOWN_INSURERS = 3;

/**
 * One facility card: the building drawing with the status on it, the name (the link to the
 * facility page; the whole card answers the pointer), where, the live wait, the tags and the next
 * step. The drawing and the name carry a view-transition name, so they flow into the facility page.
 */
export function FacilityEntry({
  result,
  selected = false,
  onActivate,
  headingLevel = 3,
  compact = false,
}: {
  result: FacilityResult;
  /** No drawing (the home page, under the photo hero): the status sits beside the type. */
  compact?: boolean;
  /** 2 when the list sits right under the page's <h1>, so no heading level is skipped. */
  headingLevel?: 2 | 3;
  /** Its pin is selected on the map beside. */
  selected?: boolean;
  /** Pointer or focus on the row: the map highlights the pin. */
  onActivate?: () => void;
}) {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage ?? "rw";
  const wait = result.open_now ? waitText(result, t, lang) : "";
  const insurers = insurerNames(result.insurers, t);
  const place = [result.sector, result.district].filter(Boolean).join(", ");
  const join = result.allows_remote_join && result.open_now;
  // closed now: no "Book a time" on the card, the next free time instead (the facility page books)
  const book = Boolean(result.next_slot_at) && result.open_now;
  const nextTime =
    !result.open_now && result.next_slot_at
      ? t("site.card.nextTime", {
          day: day(result.next_slot_at, lang, "short"),
          time: time(result.next_slot_at, lang),
        })
      : "";
  const more = insurers.length - SHOWN_INSURERS;
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    // Pointer and focus only highlight the map pin; the links and buttons inside are the controls.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <li
      onMouseEnter={onActivate}
      onFocus={onActivate}
      className={cx(
        "ml-card group/row relative flex min-w-0 flex-col overflow-hidden rounded-panel bg-surface",
        selected && "ml-card-selected",
      )}
    >
      {!compact && (
        <div className="relative aspect-[16/7] overflow-hidden border-b border-hairline">
          {/* the facility's own cover photo; the drawing for one without a photo */}
          {result.cover_url ? (
            <img
              src={result.cover_url}
              alt=""
              loading="lazy"
              decoding="async"
              className="ml-card-art size-full object-cover"
              style={{ viewTransitionName: `facility-art-${result.slug}` }}
            />
          ) : (
            <FacilityBuilding
              type={result.type}
              emergency={result.emergency_department}
              className="ml-card-art size-full"
              style={{ viewTransitionName: `facility-art-${result.slug}` }}
            />
          )}
          <span className="absolute top-3 left-3">
            <Status result={result} />
          </span>
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="m-0 inline-flex items-center gap-1.5 text-caption font-semibold tracking-[0.06em] text-fg-muted uppercase">
            <span aria-hidden="true" className="text-primary">
              <TypeMark type={result.type} />
            </span>
            {t(`booking.types.${result.type}`, { defaultValue: result.type })}
          </p>
          {compact && <Status result={result} />}
        </div>
        <div className="flex items-center gap-3">
          {result.logo_url && (
            <img
              src={result.logo_url}
              alt=""
              loading="lazy"
              decoding="async"
              className="size-11 shrink-0 rounded-full bg-white object-contain p-0.5 ring-1 ring-hairline"
            />
          )}
          <Heading
            id={`place-${result.slug}`}
            className="m-0 min-w-0 font-heading text-[1.1875rem] leading-snug font-bold text-balance"
          >
            <Link
              to={`/facilities/${result.slug}`}
              viewTransition
              className="text-fg no-underline decoration-2 underline-offset-4 transition-colors duration-150 after:absolute after:inset-0 after:content-[''] hover:text-link"
              style={{ viewTransitionName: `facility-name-${result.slug}` }}
            >
              {result.name}
            </Link>
          </Heading>
        </div>
        {(place || result.distance_km !== null) && (
          <p className="m-0 -mt-1 inline-flex flex-wrap items-center gap-x-1.5 text-body-sm text-fg-secondary">
            <MapPin aria-hidden="true" weight="duotone" className="size-4 shrink-0 text-fg-muted" />
            {place}
            {result.distance_km !== null && (
              <span className="font-semibold text-fg tabular-nums">
                {place && "· "}
                {t("site.home.away", { km: result.distance_km })}
              </span>
            )}
          </p>
        )}
        {wait && (
          <div className="flex flex-col gap-1.5">
            <span className="text-body-sm font-semibold text-fg tabular-nums">{wait}</span>
            <WaitMeter result={result} />
          </div>
        )}
        <p className="m-0 flex flex-wrap items-center gap-1.5">
          {result.emergency_department && (
            <span className="inline-flex items-center gap-1 rounded-md bg-danger-bg px-2 py-0.5 text-caption font-semibold text-danger">
              <Siren aria-hidden="true" weight="bold" className="size-3.5" />
              {t("site.emergency.department")}
            </span>
          )}
          {insurers.length === 0 ? (
            <span className="text-caption text-fg-muted">{t("site.card.noInsurance")}</span>
          ) : (
            <>
              <span className="sr-only">{t("site.card.accepted")}</span>
              {insurers.slice(0, SHOWN_INSURERS).map((name) => (
                <span
                  key={name}
                  className="rounded-md bg-surface px-2 py-0.5 text-caption font-medium text-fg-secondary shadow-e1"
                >
                  {name}
                </span>
              ))}
              {more > 0 && <span className="text-caption text-fg-muted">+{more}</span>}
            </>
          )}
        </p>
      </div>

      {/*
       * one next step: the whole card opens the facility; the one button above the card's link
       * layer joins or books while it is open, or the next free time says when it can
       */}
      {(join || book || nextTime) && (
        <div className="relative z-10 flex min-h-14 items-center gap-3 border-t border-hairline px-5 py-2.5">
          {join || book ? (
            <Link
              to={`/book/${result.slug}`}
              viewTransition
              className="ml-press inline-flex min-h-11 items-center rounded-full bg-primary px-4 text-body-sm font-semibold whitespace-nowrap text-on-primary no-underline transition-colors duration-150 hover:bg-primary-hover"
            >
              {join ? t("booking.facility.join") : t("booking.facility.book")}
            </Link>
          ) : (
            <span className="text-body-sm text-fg-secondary tabular-nums">{nextTime}</span>
          )}
        </div>
      )}
    </li>
  );
}

/** The directory: every place on one surface, hairlines between them, grey rows while loading. */
export function FacilityEntries({
  label,
  rows,
  loading,
  selected,
  onSelect,
  className,
  headingLevel,
  compact = false,
  rail = false,
}: {
  label: string;
  rows: FacilityResult[];
  loading: boolean;
  headingLevel?: 2 | 3;
  compact?: boolean;
  /** Phones: the cards side by side in a row that scrolls sideways (home), not a long column. */
  rail?: boolean;
  selected?: string | null;
  onSelect?: (slug: string) => void;
  className?: string;
}) {
  const { t } = useTranslation();
  // cards: one column on phones, two from 36 rem of list width, three from 64 rem
  const surface = cx("@container", className);
  const grid = rail
    ? cx(
        // phones: a row that scrolls sideways and stops on each card, the next one peeking in;
        // the vertical padding leaves the cards' shadows uncut. From 36 rem: the usual grid
        "m-0 flex list-none snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain p-0 py-2 [scrollbar-width:none]",
        "[&>*]:w-[85%] [&>*]:max-w-80 [&>*]:shrink-0 [&>*]:snap-start",
        "@xl:grid @xl:grid-cols-2 @xl:gap-5 @xl:overflow-visible @xl:py-0 @xl:[&>*]:w-auto @xl:[&>*]:max-w-none @5xl:grid-cols-3",
      )
    : "m-0 grid list-none gap-5 p-0 @xl:grid-cols-2 @5xl:grid-cols-3";
  if (loading)
    return (
      <div role="status" aria-label={t("site.loading")} className={surface}>
        <div className={grid}>
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="ml-card flex flex-col overflow-hidden rounded-panel bg-surface">
              {!compact && <Skeleton className="aspect-[16/7] h-auto w-full rounded-none" />}
              <div className="flex flex-col gap-2.5 p-5">
                <Skeleton className="h-3 w-1/3 rounded-sm" />
                <Skeleton className="h-5 w-3/5 rounded-sm" />
                <Skeleton className="h-4 w-4/5 rounded-sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  return (
    <div className={surface}>
      <ul aria-label={label} className={cx(grid, "ml-stagger")}>
        {rows.map((result) => (
          <FacilityEntry
            key={result.slug}
            result={result}
            headingLevel={headingLevel}
            compact={compact}
            selected={selected === result.slug}
            onActivate={onSelect && (() => onSelect(result.slug))}
          />
        ))}
      </ul>
    </div>
  );
}

// Leaflet and the tiles load only when the map is on screen (upgrade 03 §2, < 100 KB JS budget)
const FacilityMap = lazy(() => import("@medilink/ui/map"));

/**
 * The directory with its map (home, /facilities): on wide screens the map stays beside the list
 * and each highlights the other; on phones List / Map switch, and "Show on map" opens the pin.
 * Loading, failure and empty states are part of it, so every page shows them the same way.
 */
export function FacilityExplorer({
  label,
  rows,
  loading,
  fetching = false,
  failed = false,
  onRetry,
  near = null,
  empty,
  switchable = false,
  headingLevel,
  compact = false,
  rail = false,
}: {
  /** Cards without the drawing (home). */
  compact?: boolean;
  /** See FacilityEntries: a sideways row on phones (home). */
  rail?: boolean;
  /** See FacilityEntry: 2 right under the page's <h1>. */
  headingLevel?: 2 | 3;
  label: string;
  rows: FacilityResult[];
  loading: boolean;
  /** A new page of results is on its way: the list dims instead of jumping. */
  fetching?: boolean;
  failed?: boolean;
  onRetry?: () => void;
  /** The visitor's position, drawn on the map when shared. */
  near?: { lat: number; lng: number } | null;
  empty: ReactNode;
  /** List / Map switch at every width (home), instead of a map always beside the list. */
  switchable?: boolean;
}) {
  const { t } = useTranslation();
  const [view, setView] = useState<"list" | "map">("list");
  const besides = !switchable;
  const [selected, setSelected] = useState<string | null>(null);
  const map = useRef<HTMLDivElement>(null);
  // false while the pre-rendered page hydrates (Leaflet needs the browser), then true
  const inBrowser = useWide("all");
  const points: MapPoint[] = rows.flatMap((r) =>
    r.lat !== null && r.lng !== null
      ? [
          {
            id: r.slug,
            lat: r.lat,
            lng: r.lng,
            kind: pinKind(r.type),
            load: r.queue_load,
            label: r.name,
          },
        ]
      : [],
  );
  const chosen = rows.find((r) => r.slug === selected);

  if (failed)
    return (
      <p
        role="alert"
        className="m-0 flex items-center gap-3 rounded-panel bg-surface p-5 shadow-e2"
      >
        {t("home.failed")}
        {onRetry && (
          <Button variant="secondary" onClick={onRetry}>
            {t("home.retry")}
          </Button>
        )}
      </p>
    );
  if (!loading && rows.length === 0)
    return <div className="rounded-panel bg-surface shadow-e2">{empty}</div>;

  return (
    <div className="flex flex-col gap-4">
      {/* phones and tablets: one view at a time */}
      <SegmentedControl
        label={t("home.view.label")}
        value={view}
        onChange={setView}
        className={cx("self-start", besides && "lg:hidden")}
        options={[
          {
            value: "list",
            label: t("home.view.list"),
            icon: <ListIcon aria-hidden="true" className="size-4" />,
          },
          {
            value: "map",
            label: t("home.view.map"),
            icon: <MapTrifold aria-hidden="true" className="size-4" />,
          },
        ]}
      />
      {/* wide screens: the list beside a map that stays in view */}
      <div
        className={cx(
          "grid items-start gap-6",
          besides &&
            "lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] xl:grid-cols-[minmax(0,1fr)_minmax(0,32rem)]",
        )}
      >
        <div
          className={cx(
            "min-w-0 transition-opacity duration-200 ease-out-quint",
            fetching && !loading && "opacity-60",
            view === "map" && (besides ? "hidden lg:block" : "hidden"),
          )}
        >
          <FacilityEntries
            label={label}
            rows={rows}
            loading={loading}
            headingLevel={headingLevel}
            compact={compact}
            rail={rail}
            selected={selected}
            onSelect={setSelected}
          />
        </div>
        <div
          ref={map}
          className={cx(
            "scroll-mt-24",
            besides && "lg:sticky lg:top-24",
            view === "list" && (besides ? "hidden lg:block" : "hidden"),
          )}
        >
          {inBrowser ? (
            <Suspense
              fallback={
                <Skeleton className="h-[28rem] rounded-panel lg:h-[calc(100dvh-7rem)] lg:max-h-[52rem]" />
              }
            >
              <FacilityMap
                points={points}
                selectedId={selected}
                onSelect={setSelected}
                you={near}
                tilesUrl={env.mapTilesUrl}
                attribution={t("home.mapAttribution")}
                label={t("home.mapLabel")}
                className="h-[28rem] overflow-hidden rounded-panel shadow-e2 lg:h-[calc(100dvh-7rem)] lg:max-h-[52rem]"
                card={chosen ? <MapCard result={chosen} /> : undefined}
              />
            </Suspense>
          ) : (
            <Skeleton className="h-[28rem] rounded-panel lg:h-[calc(100dvh-7rem)] lg:max-h-[52rem]" />
          )}
        </div>
      </div>
    </div>
  );
}
