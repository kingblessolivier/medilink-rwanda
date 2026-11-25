import type { Booking } from "@medilink/api-client";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CaretRight,
  WarningCircle,
  type Icon,
} from "@phosphor-icons/react";
import { Badge, Button, cx, SelectField, Skeleton, type BadgeTone } from "@medilink/ui";
import { formatDate } from "@medilink/ui/i18n";
import { useQuery } from "@tanstack/react-query";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import { useApi } from "../../app/services";
import { PageHeading } from "../../components/PageHeading";

/*
 * Dashboard surfaces (upgrade 12 §6). One small set, used by every patient page:
 *  - Panel: white, 1px border, 16px radius, 20-24px padding, no heavy shadow
 *  - visit panels (journey, ticket) are larger, 20px radius, light green or white with emerald
 *  - RowList: related rows split by hairlines inside one surface, never a card per row
 *  - QuickActionTile: compact white tile, icon + title + one line
 */

/** A card: white on the grey page, a hairline and the soft card shadow (as the app). */
export const panelClass = "rounded-2xl border border-border bg-surface shadow-card";

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

export function firstName(name: string): string {
  return name.split(/\s+/).find(Boolean) ?? name;
}

export function Avatar({
  name,
  src,
  size = "md",
  className,
}: {
  name: string;
  /** The person's photo (Cloudinary); the initials show without one. */
  src?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-subtle font-heading font-bold text-on-brand-subtle",
        size === "sm" && "size-8 text-caption",
        size === "md" && "size-10 text-body-sm",
        size === "lg" && "size-14 text-h3",
        className,
      )}
    >
      {src ? (
        <img src={src} alt="" loading="lazy" className="size-full object-cover" />
      ) : (
        initials(name)
      )}
    </span>
  );
}

/** The signed-in person's own photo (their "self" profile), if any. */
export function ownAvatar(me: {
  profiles: { relationship: string; avatar_url?: string | null }[];
}): string | null {
  return me.profiles.find((p) => p.relationship === "self")?.avatar_url ?? null;
}

/** Page title block: a modest h1, one line of context, the page's main action on the right. */
export function PageHeader({
  title,
  subtitle,
  actions,
  back,
}: {
  title: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
  back?: { to: string; label: string };
}) {
  return (
    <header className="flex flex-col gap-3">
      {back && (
        <Link
          to={back.to}
          className="group inline-flex min-h-target items-center gap-2 self-start text-body-sm font-semibold text-fg-secondary no-underline hover:text-fg"
        >
          <ArrowLeft
            aria-hidden="true"
            className="size-4 transition-transform duration-150 group-hover:-translate-x-0.5"
          />
          {back.label}
        </Link>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex min-w-0 flex-col gap-1">
          <PageHeading
            title={title}
            className="font-heading text-h1 font-bold tracking-tight text-fg"
          >
            {title}
          </PageHeading>
          {subtitle && <p className="m-0 max-w-[42rem] text-fg-secondary">{subtitle}</p>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
      </div>
    </header>
  );
}

/** A titled block of a page; `action` is usually a "View all" link. */
export function Section({
  id,
  title,
  action,
  children,
  className,
}: {
  id: string;
  title: string;
  action?: { to: string; label: string };
  children: ReactNode;
  className?: string;
}) {
  return (
    <section aria-labelledby={id} className={cx("flex flex-col gap-3", className)}>
      <div className="flex min-h-target items-center justify-between gap-3">
        <h2 id={id} className="m-0 font-heading text-h3 font-bold tracking-tight text-fg">
          {title}
        </h2>
        {action && (
          <Link
            to={action.to}
            className="group inline-flex items-center gap-1 text-body-sm font-semibold text-link no-underline hover:underline"
          >
            {action.label}
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform duration-150 group-hover:translate-x-0.5"
            />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

/** Standard information card. */
export function Panel({
  as: Component = "div",
  className,
  children,
  ...props
}: { as?: "div" | "section" | "article" | "aside"; children: ReactNode; className?: string } & Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "className"
>) {
  return (
    <Component className={cx(panelClass, "p-5 sm:p-6", className)} {...props}>
      {children}
    </Component>
  );
}

/**
 * Segmented switch for a list's views (Upcoming / Past, Active / Past). Pressed buttons, not a
 * tablist: the list below is one region whose rows change.
 */
export function SegmentedTabs<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string; count?: number | undefined }[];
}) {
  return (
    <div className="-mx-1 max-w-full overflow-x-auto px-1">
      <div
        role="group"
        aria-label={label}
        className="inline-flex gap-1 rounded-xl border border-border bg-subtle p-1"
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
            className={cx(
              "inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-[10px] px-4 text-body-sm font-semibold whitespace-nowrap",
              "text-fg-secondary transition-[background-color,color,box-shadow] duration-200 hover:text-fg",
              "aria-pressed:bg-surface aria-pressed:text-fg aria-pressed:shadow-card",
            )}
          >
            {option.label}
            {option.count !== undefined && option.count > 0 && (
              <span className="rounded-full bg-brand-subtle px-1.5 text-caption tabular-nums text-on-brand-subtle">
                {option.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Overview card (patient overview, 2026-11-02): one surface with its own title row (h2 and an
 * optional "View all") above the body, so a widget reads as one object.
 */
export function WidgetCard({
  id,
  title,
  action,
  children,
  className,
}: {
  id: string;
  title: string;
  action?: { to: string; label: string } | undefined;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      aria-labelledby={id}
      className={cx(panelClass, "flex flex-col overflow-hidden", className)}
    >
      <div className="flex min-h-14 items-center justify-between gap-3 border-b border-border px-4 sm:px-5">
        <h2 id={id} className="m-0 font-heading text-body font-bold tracking-tight text-fg">
          {title}
        </h2>
        {action && (
          <Link
            to={action.to}
            className="group inline-flex min-h-target items-center gap-1 text-body-sm font-semibold text-link no-underline hover:underline"
          >
            {action.label}
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform duration-150 group-hover:translate-x-0.5"
            />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

export type StatTone = "brand" | "violet" | "info" | "attention";

const STAT_TONE: Record<StatTone, string> = {
  brand: "bg-brand-subtle text-brand",
  violet: "bg-violet-bg text-violet",
  info: "bg-info-bg text-info",
  attention: "bg-attention-bg text-attention",
};

/** At-a-glance figure: a real count from the server, its place, and one line of context. */
export function StatCard({
  to,
  icon: IconComponent,
  label,
  value,
  hint,
  tone = "brand",
}: {
  to: string;
  icon: Icon;
  label: string;
  /** Undefined while loading; null when the count could not be loaded (shown as a dash). */
  value: number | null | undefined;
  /** Data only (the next date, the last visit); no explaining words. */
  hint?: string | undefined;
  tone?: StatTone;
}) {
  return (
    <Link
      to={to}
      className={cx(
        "group relative flex h-full flex-col gap-3 p-4 text-fg no-underline sm:p-5",
        "transition-colors duration-200 ease-out-quint hover:bg-subtle motion-reduce:transition-none",
      )}
    >
      <span className="flex items-start gap-2.5 pr-5">
        <span
          aria-hidden="true"
          className={cx("grid size-8 shrink-0 place-items-center rounded-lg", STAT_TONE[tone])}
        >
          <IconComponent weight="duotone" className="size-[1.125rem]" />
        </span>
        <span className="min-w-0 pt-1 text-body-sm leading-snug font-semibold text-fg-secondary">
          {label}
        </span>
      </span>
      <span className="flex flex-col gap-1">
        {value === undefined ? (
          <Skeleton height="2.25rem" width="3rem" />
        ) : (
          <span className="font-heading text-h1 leading-none font-bold tracking-tight tabular-nums">
            {value ?? "—"}
          </span>
        )}
        {hint && <span className="truncate text-caption text-fg-muted">{hint}</span>}
      </span>
      <ArrowUpRight
        aria-hidden="true"
        weight="bold"
        className="absolute top-4 right-4 size-4 text-fg-muted opacity-0 transition-[opacity,translate] duration-200 ease-out-quint group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 motion-reduce:transition-none sm:top-5 sm:right-5"
      />
    </Link>
  );
}

/** Rows that belong together, split by hairlines inside one surface (`bare`: inside a card). */
export function RowList({
  children,
  label,
  bare = false,
}: {
  children: ReactNode;
  label?: string;
  bare?: boolean;
}) {
  return (
    <ul
      aria-label={label}
      className={cx(
        !bare && panelClass,
        "m-0 flex list-none flex-col divide-y divide-border overflow-hidden p-0",
      )}
    >
      {children}
    </ul>
  );
}

/**
 * One row of a RowList: leading (date block or icon), body, trailing (status, action). The whole
 * row is the link; extra actions go in `after`, outside the link.
 */
export function RowLink({
  to,
  leading,
  title,
  meta,
  trailing,
  after,
  unread = false,
  onClick,
}: {
  to: string;
  leading: ReactNode;
  title: ReactNode;
  meta?: ReactNode;
  trailing?: ReactNode;
  after?: ReactNode;
  unread?: boolean;
  onClick?: () => void;
}) {
  return (
    <li className="relative flex items-center">
      {unread && (
        <span
          aria-hidden="true"
          className="absolute top-1/2 left-1.5 size-2 -translate-y-1/2 rounded-full bg-brand"
        />
      )}
      <Link
        to={to}
        onClick={onClick}
        className="group flex min-h-16 min-w-0 flex-1 items-center gap-4 px-4 py-3 text-fg no-underline transition-colors duration-150 hover:bg-subtle/70 sm:px-5"
      >
        {leading}
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className={cx("truncate", unread ? "font-bold" : "font-semibold")}>{title}</span>
          {meta && <span className="truncate text-body-sm text-fg-secondary">{meta}</span>}
        </span>
        {trailing && <span className="hidden shrink-0 items-center gap-2 sm:flex">{trailing}</span>}
        <CaretRight
          aria-hidden="true"
          className="size-5 shrink-0 text-fg-muted transition-transform duration-150 group-hover:translate-x-0.5"
        />
      </Link>
      {after && <div className="shrink-0 pr-3">{after}</div>}
    </li>
  );
}

/** Leading icon of a row: soft square, brand icon. */
export function RowIcon({
  icon: IconComponent,
  tone = "brand",
}: {
  icon: Icon;
  tone?: "brand" | "neutral";
}) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        "grid size-11 shrink-0 place-items-center rounded-xl",
        tone === "brand" ? "bg-brand-subtle text-brand" : "bg-subtle text-fg-secondary",
      )}
    >
      <IconComponent weight="duotone" className="size-6" />
    </span>
  );
}

/** Date tile: month, the day emphasised, then the year or weekday. */
function sameYear(iso: string): boolean {
  const year = (value: Date | string) =>
    new Intl.DateTimeFormat("en", { year: "numeric", timeZone: "Africa/Kigali" }).format(
      new Date(value),
    );
  return year(iso) === year(new Date());
}

export function DateBlock({ iso, size = "md" }: { iso: string; size?: "md" | "lg" }) {
  const { i18n } = useTranslation();
  const lang = i18n.resolvedLanguage ?? "rw";
  const part = (options: Intl.DateTimeFormatOptions) => formatDate(iso, lang, options);
  return (
    <span
      aria-hidden="true"
      className={cx(
        "flex shrink-0 flex-col items-center justify-center rounded-xl bg-brand-subtle text-center text-on-brand-subtle",
        size === "md" ? "w-14 py-1.5" : "w-20 py-3",
      )}
    >
      <span className="text-caption font-semibold tracking-wide uppercase">
        {part({ month: "short" })}
      </span>
      <span
        className={cx(
          "font-heading leading-none font-extrabold tabular-nums text-fg",
          size === "md" ? "text-h2" : "text-display",
        )}
      >
        {part({ day: "numeric" })}
      </span>
      <span className="text-caption tabular-nums">
        {/* the year only when it is not this year; otherwise the weekday, which a patient plans by */}
        {size === "md" && !sameYear(iso) ? part({ year: "numeric" }) : part({ weekday: "short" })}
      </span>
    </span>
  );
}

export type AppointmentState =
  | "confirmed"
  | "checked_in"
  | "cancelled"
  | "late_cancelled"
  | "no_show"
  | "rescheduled"
  | "answer";

/** What the patient should read for a booking: an open offer outranks the stored status. */
export function appointmentState(booking: Booking): AppointmentState {
  if (booking.pending_change) return "answer";
  if (booking.status === "superseded") return "rescheduled";
  return booking.status;
}

const STATE_TONE: Record<AppointmentState, BadgeTone> = {
  confirmed: "success",
  checked_in: "brand",
  cancelled: "danger",
  late_cancelled: "danger",
  no_show: "neutral",
  rescheduled: "info",
  answer: "warning",
};

/** Small, restrained status: icon + word, never colour alone. */
export function AppointmentBadge({ booking }: { booking: Booking }) {
  const { t } = useTranslation();
  const state = appointmentState(booking);
  return <Badge tone={STATE_TONE[state]}>{t(`dashboard.status.${state}`)}</Badge>;
}

export const isCancelled = (booking: Booking) =>
  booking.status === "cancelled" || booking.status === "late_cancelled";

/** Concise error with a retry; the page around it keeps whatever the patient typed. */
export function ErrorBlock({ message, onRetry }: { message: string; onRetry: () => void }) {
  const { t } = useTranslation();
  return (
    <div
      role="alert"
      className={cx(panelClass, "flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center")}
    >
      <WarningCircle aria-hidden="true" weight="duotone" className="size-7 shrink-0 text-danger" />
      <p className="m-0 flex-1 font-semibold text-fg">{message}</p>
      <Button variant="secondary" onClick={onRetry}>
        {t("dashboard.retry")}
      </Button>
    </div>
  );
}

/** Skeleton rows shaped like a RowList. */
export function RowsSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className={cx(panelClass, "flex flex-col divide-y divide-border overflow-hidden")}>
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

/** Quiet empty block for a section (pages use the shared EmptyState). */
export function EmptyRow({
  icon: IconComponent,
  title,
  body,
  action,
}: {
  icon: Icon;
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  // laid out by its own width, not the window's: a narrow side column stacks it
  return (
    <div className={cx(panelClass, "@container")}>
      <div className="flex flex-col items-start gap-3 p-5 @md:flex-row @md:items-center">
        <RowIcon icon={IconComponent} tone="neutral" />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="m-0 font-semibold text-pretty text-fg">{title}</p>
          {body && <p className="m-0 text-body-sm text-fg-secondary">{body}</p>}
        </div>
        {action}
      </div>
    </div>
  );
}

/** Quick action tile: compact, icon beside the words, an arrow on hover; same size everywhere. */
export function QuickActionTile({
  to,
  icon: IconComponent,
  title,
  description,
}: {
  to: string;
  icon: Icon;
  title: string;
  /** Optional; the patient app shows the label alone, and so does the overview. */
  description?: string | undefined;
}) {
  return (
    <Link
      to={to}
      className={cx(
        panelClass,
        "group relative flex h-full items-center gap-3 p-3.5 pr-9 text-fg no-underline",
        "transition-[border-color,box-shadow,transform] duration-200 ease-out-quint hover:border-brand/40 hover:shadow-card active:scale-[0.98] motion-reduce:active:scale-100",
      )}
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-subtle text-brand transition-colors duration-200 group-hover:bg-primary group-hover:text-on-primary">
        <IconComponent aria-hidden="true" weight="duotone" className="size-5" />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="truncate text-body-sm font-semibold">{title}</span>
        {description && <span className="truncate text-caption text-fg-muted">{description}</span>}
      </span>
      <ArrowUpRight
        aria-hidden="true"
        weight="bold"
        className="absolute top-3 right-3 size-3.5 text-fg-muted opacity-0 transition-[opacity,translate] duration-200 ease-out-quint group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 motion-reduce:transition-none"
      />
    </Link>
  );
}

/** Public facility profile; same cache key as the public pages, so it is fetched once. */
export function useFacilityProfile(slug: string | undefined) {
  const api = useApi();
  return useQuery({
    queryKey: ["discovery", "facility", slug],
    queryFn: () => api.booking.facility(slug!),
    enabled: Boolean(slug),
    staleTime: 60_000,
  });
}

/**
 * "Whose …" for families (audit 2026-11-16): one compact picker, always beside the page title,
 * instead of a labelled select in a different place on every page. The label stays for screen
 * readers; the first option reads "Everyone".
 */
export function WhoseFilter({
  label,
  everyone,
  value,
  onChange,
  people,
}: {
  label: string;
  everyone: string;
  value: string;
  onChange: (patientId: string) => void;
  people: { patient_id: string; display_name: string }[];
}) {
  if (people.length < 2) return null;
  return (
    <SelectField
      label={label}
      hideLabel
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full sm:w-60"
    >
      <option value="">{everyone}</option>
      {people.map((p) => (
        <option key={p.patient_id} value={p.patient_id}>
          {p.display_name}
        </option>
      ))}
    </SelectField>
  );
}
