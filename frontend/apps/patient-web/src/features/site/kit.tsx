import type { FacilityResult } from "@medilink/api-client";
import {
  CaretDown,
  CaretRight,
  MagnifyingGlass,
  MapPin,
  SlidersHorizontal,
  X,
} from "@phosphor-icons/react";
import { Button, buttonClassName, cx, Select, Sheet, Skeleton, StatusPill } from "@medilink/ui";
import { useState, type FormEvent, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import { PageHeading } from "../../components/PageHeading";
import { useInDashboard } from "../../layout/DashboardContext";
import { DISTRICT_KEYS, type DistrictKey } from "../booking/discovery";
import { FILTER, insurerNames, useWide } from "../booking/Places";
import { EmptyIllustration } from "./illustrations";

/**
 * Shared building blocks of the public site (upgrade 11 §10). Every public page composes these,
 * so widths, headings, states and facility facts look the same everywhere.
 */

/** The page header's actions: one filled main action, an outlined second one. */
export const HEADER_PRIMARY = buttonClassName({ pill: true, className: "ml-press min-h-11 px-5" });
export const HEADER_SECONDARY = buttonClassName({
  variant: "secondary",
  pill: true,
  className: "ml-press min-h-11 px-5",
});

/**
 * Page width and side gutters. `narrow` for reading pages (help, legal, about): the text column is
 * narrower, but it starts at the same left edge as every other page, so the site has one spine.
 */
export function PageContainer({
  children,
  narrow = false,
  className,
}: {
  children: ReactNode;
  narrow?: boolean;
  className?: string;
}) {
  // The dashboard shell already sets the width and gutters
  const inDashboard = useInDashboard();
  // one template for every public page: 1408 px wide, 24 px gutters (16 px on phones)
  const outer = inDashboard ? "w-full" : "mx-auto w-full max-w-[88rem] px-4 sm:px-6";
  if (!narrow) return <div className={cx(outer, className)}>{children}</div>;
  return (
    <div className={outer}>
      <div className={cx("w-full max-w-[48rem]", className)}>{children}</div>
    </div>
  );
}

export interface Crumb {
  to?: string;
  label: string;
}

export function Breadcrumbs({ items, onForest = false }: { items: Crumb[]; onForest?: boolean }) {
  const { t } = useTranslation();
  return (
    <nav aria-label={t("site.breadcrumb")}>
      <ol
        className={cx(
          "m-0 flex list-none flex-wrap items-center gap-1 p-0 text-body-sm",
          onForest ? "text-on-forest-muted" : "text-fg-muted",
        )}
      >
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-1">
            {index > 0 && <CaretRight aria-hidden="true" className="size-3.5" />}
            {item.to ? (
              <Link
                to={item.to}
                viewTransition
                className={cx(
                  "no-underline hover:underline",
                  onForest
                    ? "text-on-forest-muted hover:text-on-forest"
                    : "text-fg-muted hover:text-fg",
                )}
              >
                {item.label}
              </Link>
            ) : (
              <span
                aria-current="page"
                className={onForest ? "text-on-forest" : "text-fg-secondary"}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * Breadcrumb, the page <h1> (document title, focus after navigation), at most one short line, and
 * one optional action. Every public page uses the same light band, so moving between pages never
 * feels like changing sites.
 */
export function PageHeader({
  title,
  lead,
  crumbs,
  actions,
  art,
  titleTransition,
  description,
  jsonLd,
}: {
  title: string;
  lead?: ReactNode;
  /** Search description; defaults to the page's own (`site.meta`), else the site's. */
  description?: string;
  /** Structured data for search engines (schema.org), e.g. a facility. */
  jsonLd?: Record<string, unknown> | null;
  crumbs?: Crumb[];
  actions?: ReactNode;
  /** A decorative drawing on the right of the band (wide screens), e.g. the facility building. */
  art?: ReactNode;
  /** View-transition name of the title, so a card's name flows into it. */
  titleTransition?: string;
}) {
  const { t } = useTranslation();
  // Inside the dashboard the shell shows the breadcrumb and the top spacing
  const inDashboard = useInDashboard();
  if (inDashboard)
    return (
      <div className="flex flex-col gap-3 pb-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex max-w-[44rem] flex-col gap-2">
            <PageHeading
              title={title}
              description={description}
              jsonLd={jsonLd}
              className="text-h1 tracking-tight text-fg"
            >
              {title}
            </PageHeading>
            {lead && <p className="m-0 text-body text-fg-secondary">{lead}</p>}
          </div>
          {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
        </div>
      </div>
    );
  // public pages: breadcrumb → H1 → one short line, on a band the width of the screen
  return (
    <div
      className={cx(
        "ml-page-band mb-8 sm:mb-10 grid gap-x-10",
        // a title on its own needs less band than a title with a line and actions
        lead || actions || art ? "pt-8 pb-9 sm:pt-12 sm:pb-12" : "pt-7 pb-7 sm:pt-9 sm:pb-9",
        Boolean(art) && "lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end",
      )}
    >
      <div className="flex min-w-0 flex-col gap-4">
        {crumbs && <Breadcrumbs items={[{ to: "/", label: t("nav.home") }, ...crumbs]} />}
        <div className="flex animate-enter flex-wrap items-end justify-between gap-6">
          <div className="flex max-w-[48rem] flex-col gap-3">
            <PageHeading
              title={title}
              description={description}
              jsonLd={jsonLd}
              className="font-heading text-page-title font-bold text-balance text-fg"
            >
              <span style={titleTransition ? { viewTransitionName: titleTransition } : undefined}>
                {title}
              </span>
            </PageHeading>
            {lead && (
              <p className="ml-measure m-0 text-body leading-relaxed text-pretty text-fg-secondary">
                {lead}
              </p>
            )}
          </div>
          {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
        </div>
      </div>
      {art && (
        <div aria-hidden="true" className="hidden overflow-hidden rounded-shell shadow-e2 lg:block">
          {art}
        </div>
      )}
    </div>
  );
}

/** One quiet surface for a block of content (lists, panels); never nested. */
export function Panel({
  children,
  className,
  as: Tag = "section",
  ...rest
}: {
  children: ReactNode;
  className?: string;
  as?: "section" | "div" | "aside";
  "aria-labelledby"?: string;
}) {
  // the site elevation: a hairline ring and a soft layered shadow (e2), no hard border
  return (
    <Tag
      className={cx(
        "rounded-panel bg-surface shadow-[var(--site-edge),var(--shadow-e2)]",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Rows that load: grey bars the size of real rows, so nothing shifts (upgrade 11 §8). */
export function LoadingRows({ rows = 4, className }: { rows?: number; className?: string }) {
  const { t } = useTranslation();
  return (
    <div role="status" aria-label={t("site.loading")} className={cx("flex flex-col", className)}>
      {Array.from({ length: rows }, (_, i) => (
        <div
          key={i}
          className="flex flex-col gap-2 border-b border-hairline px-5 py-4 last:border-b-0"
        >
          <Skeleton className="h-5 w-1/3 rounded-md" />
          <Skeleton className="h-4 w-2/3 rounded-md" />
        </div>
      ))}
    </div>
  );
}

/** Something failed: what happened and one way to try again. */
export function ErrorState({ onRetry, message }: { onRetry?: () => void; message?: string }) {
  const { t } = useTranslation();
  return (
    <div role="alert" className="flex flex-col items-center gap-3 px-6 py-10 text-center">
      <p className="m-0 font-semibold text-fg">{message ?? t("site.error")}</p>
      {onRetry && (
        <Button variant="secondary" pill onClick={onRetry}>
          {t("site.retry")}
        </Button>
      )}
    </div>
  );
}

/** Nothing to show: a small illustration, one line and one action (upgrade 02 §8). */
export function EmptyState({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
      <EmptyIllustration className="h-24 w-auto" />
      <p className="m-0 max-w-sm font-semibold text-fg">{title}</p>
      {action}
    </div>
  );
}

/**
 * A page whose record does not exist (a doctor, service or facility link gone stale): the page
 * still has its <h1>, one line why, and a way back to the list.
 */
export function NotFoundState({
  title,
  reason,
  back,
}: {
  title: string;
  reason: string;
  back: { to: string; label: string };
}) {
  return (
    <div className="flex flex-col items-center gap-4 px-6 py-16 text-center">
      <EmptyIllustration className="h-24 w-auto" />
      <PageHeading title={title} className="font-heading text-h1 font-bold text-balance text-fg">
        {title}
      </PageHeading>
      <p className="m-0 max-w-sm text-fg-secondary">{reason}</p>
      <Link
        to={back.to}
        viewTransition
        className={buttonClassName({ variant: "secondary", pill: true })}
      >
        {back.label}
      </Link>
    </div>
  );
}

/** Open or closed: the shared status pill, always with a word. */
export function FacilityStatus({ open }: { open: boolean }) {
  const { t } = useTranslation();
  return (
    <StatusPill tone={open ? "open" : "closed"} live={open}>
      {open ? t("site.open") : t("site.closed")}
    </StatusPill>
  );
}

/** Live wait in the ochre time colour; nothing at all when no live figure exists. */
export function WaitingTime({
  result,
}: {
  result: Pick<FacilityResult, "waiting" | "wait_range">;
}) {
  const { t } = useTranslation();
  if (result.waiting === null || result.waiting === undefined) return null;
  return (
    <span className="inline-flex items-center gap-1 text-body-sm font-semibold text-attention tabular-nums">
      {result.waiting === 0
        ? t("home.noWait")
        : result.wait_range
          ? t("home.wait", {
              count: result.waiting,
              min: result.wait_range.min,
              max: result.wait_range.max,
            })
          : t("home.waiting", { count: result.waiting })}
    </span>
  );
}

export function InsuranceList({ codes, className }: { codes: string[]; className?: string }) {
  const { t } = useTranslation();
  if (!codes.length)
    return <span className="text-body-sm text-fg-muted">{t("site.noInsurers")}</span>;
  return (
    <ul className={cx("m-0 flex list-none flex-wrap gap-1.5 p-0", className)}>
      {insurerNames(codes, t).map((name) => (
        <li
          key={name}
          className="rounded-md bg-surface px-2 py-0.5 text-caption font-medium text-fg-secondary shadow-e1"
        >
          {name}
        </li>
      ))}
    </ul>
  );
}

/** Search field with a leading icon; the label is visible to screen readers. */
export function SearchBar({
  id,
  label,
  value,
  onChange,
  placeholder,
  className,
  onSubmit,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  /** Standalone search: Enter submits (a search landmark of its own). */
  onSubmit?: () => void;
}) {
  const Wrapper = onSubmit ? "form" : "div";
  return (
    <Wrapper
      {...(onSubmit
        ? {
            role: "search",
            onSubmit: (event: FormEvent) => {
              event.preventDefault();
              onSubmit();
            },
          }
        : {})}
      className={cx(
        "flex min-h-12 items-center gap-2 rounded-full bg-surface pr-1.5 pl-4 shadow-e1",
        "transition-[box-shadow] duration-200 ease-out-quint hover:shadow-e2",
        "focus-within:shadow-[0_0_0_1px_var(--color-primary),0_0_0_4px_color-mix(in_srgb,var(--color-primary)_16%,transparent)]",
        className,
      )}
    >
      <MagnifyingGlass aria-hidden="true" className="size-5 shrink-0 text-fg-muted" />
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        maxLength={120}
        className="min-h-11 min-w-0 flex-1 border-0 bg-transparent text-body text-fg outline-none placeholder:text-fg-muted"
      />
    </Wrapper>
  );
}

/** District choice (NISR districts in the listing); "" = all of Rwanda. */
export function LocationSelector({
  id,
  value,
  onChange,
  className,
}: {
  id: string;
  value: DistrictKey | "";
  onChange: (value: DistrictKey | "") => void;
  className?: string;
}) {
  const { t } = useTranslation();
  // the shared select: the same look in every browser (the native one did not match the site)
  return (
    <Select<DistrictKey | "">
      id={id}
      label={t("site.location")}
      hideLabel
      shape="pill"
      icon={<MapPin className="size-5" />}
      value={value}
      onChange={onChange}
      options={[
        { value: "", label: t("site.allRwanda") },
        ...DISTRICT_KEYS.map((key) => ({ value: key, label: t(`landing.districts.${key}`) })),
      ]}
      className={cx("[&>button]:min-h-12", className)}
    />
  );
}

/** One row in a list of links: an icon, a name, one line and a caret. */
export function LinkRow({
  to,
  icon,
  title,
  detail,
  meta,
}: {
  to: string;
  icon?: ReactNode;
  title: string;
  detail?: ReactNode;
  meta?: ReactNode;
}) {
  return (
    <li className="border-b border-hairline last:border-b-0">
      <Link
        to={to}
        viewTransition
        className="ml-press group flex min-h-14 items-center gap-4 px-5 py-3.5 text-fg no-underline transition-colors duration-150 ease-out-quint hover:bg-page"
      >
        {/* a plain brand icon, no tile on every row */}
        {icon && <span className="flex shrink-0 text-brand [&_svg]:size-6">{icon}</span>}
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate font-semibold">{title}</span>
          {detail && <span className="text-body-sm text-fg-secondary">{detail}</span>}
        </span>
        {meta && (
          <span className="hidden shrink-0 text-body-sm text-fg-muted sm:block">{meta}</span>
        )}
        <CaretRight
          aria-hidden="true"
          className="size-4 shrink-0 text-fg-muted transition-transform duration-200 ease-out-quint group-hover:translate-x-0.5"
        />
      </Link>
    </li>
  );
}

/**
 * Expandable question (native details: keyboard and screen readers for free), the look of the
 * shared Accordion. `open` for the first one of a list, so a list never reads as a wall.
 */
export function Faq({
  question,
  children,
  open,
}: {
  question: string;
  children: ReactNode;
  open?: boolean;
}) {
  return (
    <details open={open} className="ml-faq group border-b border-hairline last:border-b-0">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-3 font-semibold text-fg transition-colors duration-150 hover:bg-page focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus [&::-webkit-details-marker]:hidden">
        {question}
        <CaretDown
          aria-hidden="true"
          className="size-4 shrink-0 text-fg-muted transition-transform duration-200 ease-out-quint group-open:rotate-180"
        />
      </summary>
      <div className="ml-measure px-5 pb-5 leading-relaxed text-fg-secondary">{children}</div>
    </details>
  );
}

/** A labelled section heading inside a page. */
export function SectionTitle({
  id,
  children,
  action,
}: {
  id: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <h2 id={id} className="m-0 font-heading text-title font-bold text-balance">
        {children}
      </h2>
      {action}
    </div>
  );
}

export interface ActiveFilter {
  key: string;
  label: string;
  onRemove: () => void;
}

/**
 * The one filter bar of the directories (Find care, Facilities, Doctors): the search and the place
 * on top; the filters inline on wide screens, behind one "Filters" button (a bottom sheet) on
 * phones; the active filters as chips that remove themselves; the result count and the sort.
 * The filters are rendered once at a time, so their ids never repeat.
 */
export function FilterBar({
  search,
  filters,
  active,
  onClear,
  count,
  sort,
}: {
  search: ReactNode;
  /** The filter controls (selects, toggles). */
  filters: ReactNode;
  active: ActiveFilter[];
  onClear: () => void;
  /** "6 facilities", once loaded. */
  count?: string;
  sort?: ReactNode;
}) {
  const { t } = useTranslation();
  const wide = useWide("(min-width: 48rem)");
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col gap-3 rounded-panel bg-surface p-3 shadow-e1 sm:p-4">
      {search}
      <div className="flex flex-wrap items-center gap-2">
        {wide ? (
          <div role="group" aria-label={t("care.filters")} className="contents">
            {filters}
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className={cx(FILTER, "inline-flex items-center gap-1.5")}
            >
              <SlidersHorizontal aria-hidden="true" className="size-4" />
              {t("site.filters.button")}
              {active.length > 0 && (
                <span className="grid size-5 place-items-center rounded-full bg-primary text-caption font-bold text-on-primary tabular-nums">
                  {active.length}
                </span>
              )}
            </button>
            <Sheet
              open={open}
              onOpenChange={setOpen}
              title={t("site.filters.button")}
              closeLabel={t("common.close")}
              footer={
                <Button fullWidth size="lg" onClick={() => setOpen(false)}>
                  {count ?? t("site.filters.show")}
                </Button>
              }
            >
              <div
                role="group"
                aria-label={t("care.filters")}
                className="flex flex-col gap-3 [&>*]:w-full [&_button]:w-full"
              >
                {filters}
              </div>
            </Sheet>
          </>
        )}
        <div className="ml-auto flex flex-wrap items-center gap-3">
          {count && (
            <span role="status" className="text-body-sm text-fg-muted tabular-nums">
              {count}
            </span>
          )}
          {sort}
        </div>
      </div>
      {active.length > 0 && (
        <ul
          aria-label={t("site.filters.active")}
          className="m-0 flex list-none flex-wrap items-center gap-2 p-0"
        >
          {active.map((filter) => (
            <li key={filter.key}>
              <button
                type="button"
                onClick={filter.onRemove}
                aria-label={t("site.filters.remove", { name: filter.label })}
                className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full bg-brand-subtle pr-2.5 pl-3 text-body-sm font-semibold text-on-brand-subtle transition-colors duration-150 hover:bg-[color-mix(in_srgb,var(--color-primary)_18%,var(--color-surface))]"
              >
                {filter.label}
                <X aria-hidden="true" weight="bold" className="size-3.5" />
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={onClear}
              className="min-h-9 cursor-pointer rounded-full px-2 text-body-sm font-semibold text-link hover:underline"
            >
              {t("site.facilities.clear")}
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
