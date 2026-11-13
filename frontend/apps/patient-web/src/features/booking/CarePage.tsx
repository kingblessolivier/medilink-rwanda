import type { FacilitySearchInput, LevelOfCare } from "@medilink/api-client";
import { Crosshair, Faders, X } from "@phosphor-icons/react";
import { Button, cx, Dialog, SelectField } from "@medilink/ui";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router";

import { useApi } from "../../app/services";
import { useInDashboard } from "../../layout/DashboardContext";
import { PublicLayout } from "../../layout/PublicLayout";
import { isHospital } from "../site/data";
import { FacilityExplorer } from "../site/FacilityDirectory";
import {
  type ActiveFilter,
  EmptyState,
  FilterBar,
  PageContainer,
  PageHeader,
  SearchBar,
} from "../site/kit";
import {
  DISTRICT_CODES,
  DISTRICT_KEYS,
  INSURER_CODES,
  INSURER_KEYS,
  SERVICE_CODES,
  SERVICE_KEYS,
  type ServiceKey,
} from "./discovery";
import {
  FILTER,
  FilterSelect,
  PlacesView,
  sortResults,
  SortSelect,
  TYPES,
  useNearMe,
  type Sort,
} from "./Places";

const LEVELS: LevelOfCare[] = ["primary", "secondary", "tertiary"];
const DISTANCES = [2, 5, 10, 25] as const;
const AVAILABILITY = ["today", "remote"] as const;
type Availability = (typeof AVAILABILITY)[number];

/**
 * Find care `/find-care` (upgrade 11 §5): one search for a facility, service, specialty or
 * symptom, the location, and every filter in a panel (a dialog on phones); the list and map below.
 * Active filters are removable chips with "Clear all" and the count. No prices (U-01). The
 * emergency filter shows hospitals until listings carry `has_emergency_24h` (upgrade 11 §13).
 */
export function CarePage() {
  const { t } = useTranslation();
  const api = useApi();
  const inDashboard = useInDashboard();
  const [params, setParams] = useSearchParams();
  const [sort, setSort] = useState<Sort>("open");
  const { near, setNear, locating, locate } = useNearMe(() => setSort("nearest"));
  const [panel, setPanel] = useState(false);
  // what is typed before Enter; the URL keeps the submitted search
  const [draft, setDraft] = useState<string | null>(null);

  const service = valid(params.get("service"), SERVICE_KEYS);
  const district = valid(params.get("district"), DISTRICT_KEYS);
  const insurer = valid(params.get("insurer"), INSURER_KEYS);
  const type = valid(params.get("type"), TYPES);
  const level = valid(params.get("level"), LEVELS);
  const openNow = params.get("open") === "1";
  const today = params.get("today") === "1";
  const remote = params.get("remote") === "1";
  const km = Number(params.get("km")) || 0;
  const emergency = params.get("emergency") === "1";
  const q = params.get("q") ?? "";
  // A service word in the search ("dentist", "pregnancy") selects that service; other words
  // match facility and service names.
  const words = q.trim().toLowerCase();
  const keywordService =
    !service && words
      ? SERVICE_KEYS.find((key) =>
          t(`home.keywords.${key}`)
            .split("|")
            .some((word) => word && words.includes(word)),
        )
      : undefined;
  const activeService = service || keywordService || "";

  // Choices live in the URL so a search can be shared; never the location (S5 D-2).
  const set = (key: string, value: string) =>
    setParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true },
    );
  const clearAll = () => {
    setParams(new URLSearchParams(), { replace: true });
    setNear(null);
  };

  const body: FacilitySearchInput = {
    service_code: activeService ? SERVICE_CODES[activeService] : undefined,
    district_code: near ? undefined : district ? DISTRICT_CODES[district] : undefined,
    insurer_code: insurer ? INSURER_CODES[insurer] || undefined : undefined,
    open_now: openNow || undefined,
    level_of_care: level || undefined,
    available_today: today || undefined,
    near,
  };
  const results = useQuery({
    queryKey: ["discovery", "care", body],
    queryFn: () => api.booking.search(body),
    placeholderData: keepPreviousData,
  });
  const rows = (() => {
    const all = (results.data?.results ?? []).filter(
      (r) =>
        (!type || r.type === type) &&
        (!emergency || isHospital(r.type)) &&
        (!words ||
          keywordService !== undefined ||
          r.name.toLowerCase().includes(words) ||
          Object.values(r.service_name_i18n).some((name) => name?.toLowerCase().includes(words))) &&
        (!remote || r.allows_remote_join) &&
        (!km || !near || (r.distance_km !== null && r.distance_km <= km)),
    );
    return sortResults(all, sort);
  })();

  const chips: { key: string; label: string; remove: () => void }[] = [
    service && { key: "service", label: t(`landing.services.${service}`) },
    district && !near && { key: "district", label: t(`landing.districts.${district}`) },
    insurer && { key: "insurer", label: t(`landing.insurersShort.${insurer}`) },
    type && { key: "type", label: t(`booking.types.${type}`) },
    level && { key: "level", label: t(`care.levels.${level}`) },
    openNow && { key: "open", label: t("home.openNow") },
    today && { key: "today", label: t("care.availability.today") },
    remote && { key: "remote", label: t("care.availability.remote") },
    km > 0 && near && { key: "km", label: t("care.withinKm", { km }) },
    emergency && { key: "emergency", label: t("site.care.emergencyFilter") },
    q && { key: "q", label: `“${q}”` },
  ]
    .filter((chip): chip is { key: string; label: string } => Boolean(chip))
    .map((chip) => ({ ...chip, remove: () => set(chip.key, "") }));
  if (near) chips.push({ key: "near", label: t("home.nearYou"), remove: () => setNear(null) });

  const filters = (
    <div className="flex flex-col gap-4">
      <SelectField
        id="care-service"
        label={t("care.service")}
        value={service}
        onChange={(event) => set("service", event.target.value)}
      >
        <option value="">{t("care.anyService")}</option>
        {SERVICE_KEYS.map((key) => (
          <option key={key} value={key}>
            {t(`landing.services.${key}`)}
          </option>
        ))}
      </SelectField>
      <SelectField
        id="care-insurer"
        label={t("home.insurance")}
        value={insurer}
        onChange={(event) => set("insurer", event.target.value)}
      >
        <option value="">{t("home.anyInsurance")}</option>
        {INSURER_KEYS.filter((key) => INSURER_CODES[key]).map((key) => (
          <option key={key} value={key}>
            {t(`landing.insurersShort.${key}`)}
          </option>
        ))}
      </SelectField>
      <SelectField
        id="care-district"
        label={t("home.district")}
        value={near ? "" : district}
        disabled={near !== null}
        onChange={(event) => set("district", event.target.value)}
      >
        <option value="">{near ? t("home.nearYou") : t("home.anyDistrict")}</option>
        {DISTRICT_KEYS.map((key) => (
          <option key={key} value={key}>
            {t(`landing.districts.${key}`)}
          </option>
        ))}
      </SelectField>
      <SelectField
        id="care-type"
        label={t("home.type")}
        value={type}
        onChange={(event) => set("type", event.target.value)}
      >
        <option value="">{t("home.anyType")}</option>
        {TYPES.map((key) => (
          <option key={key} value={key}>
            {t(`booking.types.${key}`)}
          </option>
        ))}
      </SelectField>
      <SelectField
        id="care-level"
        label={t("care.level")}
        value={level}
        onChange={(event) => set("level", event.target.value)}
      >
        <option value="">{t("care.anyLevel")}</option>
        {LEVELS.map((key) => (
          <option key={key} value={key}>
            {t(`care.levels.${key}`)}
          </option>
        ))}
      </SelectField>
      {level && level !== "primary" && insurer === "mutuelle" && (
        <p className="m-0 text-body-sm text-fg-secondary">{t("care.transferHint")}</p>
      )}
      <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
        <legend className="mb-2 p-0 font-semibold">{t("care.when")}</legend>
        <Toggle on={openNow} onChange={(on) => set("open", on ? "1" : "")}>
          {t("home.openNow")}
        </Toggle>
        <Toggle on={emergency} onChange={(on) => set("emergency", on ? "1" : "")}>
          {t("site.care.emergencyFilter")}
        </Toggle>
        {AVAILABILITY.map((key: Availability) => (
          <Toggle
            key={key}
            on={key === "today" ? today : remote}
            onChange={(on) => set(key, on ? "1" : "")}
          >
            {t(`care.availability.${key}`)}
          </Toggle>
        ))}
      </fieldset>
      <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
        <legend className="mb-2 p-0 font-semibold">{t("care.distance")}</legend>
        {near ? (
          <div className="flex flex-wrap gap-2">
            {DISTANCES.map((value) => (
              <Toggle
                key={value}
                on={km === value}
                onChange={(on) => set("km", on ? String(value) : "")}
              >
                {t("care.km", { km: value })}
              </Toggle>
            ))}
          </div>
        ) : (
          <Button
            variant="secondary"
            onClick={locate}
            loading={locating === "busy"}
            iconStart={<Crosshair aria-hidden="true" className="size-icon" />}
          >
            {t("home.nearMe")}
          </Button>
        )}
        {locating === "denied" && (
          <p role="status" className="m-0 text-body-sm text-fg-secondary">
            {t("home.locationDenied")}
          </p>
        )}
      </fieldset>
    </div>
  );

  const searchBox = (className: string) => (
    <SearchBar
      id="care-search"
      label={t("site.searchLabel")}
      value={draft ?? q}
      onChange={setDraft}
      placeholder={t("site.searchPlaceholder")}
      className={className}
      onSubmit={() => {
        set("q", (draft ?? q).trim());
        setDraft(null);
      }}
    />
  );

  if (!inDashboard) {
    // Find care searches by need (Facilities browses them all): the same filter bar, cards and map
    const active: ActiveFilter[] = chips.map((chip) => ({
      key: chip.key,
      label: chip.label,
      onRemove: chip.remove,
    }));
    const insurers = INSURER_KEYS.filter((key) => INSURER_CODES[key]);
    return (
      <PublicLayout>
        <PageContainer className="pb-16">
          <PageHeader crumbs={[{ label: t("nav.findCare") }]} title={t("site.care.title")} />
          <div className="flex flex-col gap-6">
            <FilterBar
              search={searchBox("w-full")}
              filters={
                <>
                  <button
                    type="button"
                    aria-pressed={near !== null}
                    onClick={near ? () => setNear(null) : locate}
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
                    id="care-service"
                    label={t("care.service")}
                    value={service}
                    onChange={(value) => set("service", value)}
                  >
                    <option value="">{t("care.anyService")}</option>
                    {SERVICE_KEYS.map((key) => (
                      <option key={key} value={key}>
                        {t(`landing.services.${key}`)}
                      </option>
                    ))}
                  </FilterSelect>
                  <FilterSelect
                    id="care-insurer"
                    label={t("home.insurance")}
                    value={insurer}
                    onChange={(value) => set("insurer", value)}
                  >
                    <option value="">{t("home.anyInsurance")}</option>
                    {insurers.map((key) => (
                      <option key={key} value={key}>
                        {t(`landing.insurersShort.${key}`)}
                      </option>
                    ))}
                  </FilterSelect>
                  <FilterSelect
                    id="care-district"
                    label={t("home.district")}
                    value={near ? "" : district}
                    disabled={near !== null}
                    onChange={(value) => set("district", value)}
                  >
                    <option value="">{near ? t("home.nearYou") : t("home.anyDistrict")}</option>
                    {DISTRICT_KEYS.map((key) => (
                      <option key={key} value={key}>
                        {t(`landing.districts.${key}`)}
                      </option>
                    ))}
                  </FilterSelect>
                  <FilterSelect
                    id="care-type"
                    label={t("home.type")}
                    value={type}
                    onChange={(value) => set("type", value)}
                  >
                    <option value="">{t("home.anyType")}</option>
                    {TYPES.map((key) => (
                      <option key={key} value={key}>
                        {t(`booking.types.${key}`)}
                      </option>
                    ))}
                  </FilterSelect>
                  <Toggle on={openNow} onChange={(on) => set("open", on ? "1" : "")}>
                    {t("home.openNow")}
                  </Toggle>
                  <Toggle on={today} onChange={(on) => set("today", on ? "1" : "")}>
                    {t("care.availability.today")}
                  </Toggle>
                  <Toggle on={emergency} onChange={(on) => set("emergency", on ? "1" : "")}>
                    {t("site.care.emergencyFilter")}
                  </Toggle>
                </>
              }
              active={active}
              onClear={clearAll}
              count={results.isSuccess ? t("home.count", { count: rows.length }) : undefined}
              sort={
                <SortSelect id="care-sort" value={sort} onChange={setSort} near={near !== null} />
              }
            />
            {locating === "denied" && (
              <p role="status" className="m-0 text-body-sm text-fg-secondary">
                {t("home.locationDenied")}
              </p>
            )}
            {level && level !== "primary" && insurer === "mutuelle" && (
              <p className="m-0 text-body-sm text-fg-secondary">{t("care.transferHint")}</p>
            )}
            <section aria-labelledby="care-results" className="flex flex-col gap-4">
              <h2 id="care-results" className="sr-only">
                {t("site.care.results")}
              </h2>
              <FacilityExplorer
                headingLevel={3}
                label={t("site.care.results")}
                rows={rows}
                loading={results.isPending}
                fetching={results.isPlaceholderData}
                failed={results.isError}
                onRetry={() => void results.refetch()}
                near={near}
                empty={<NoMatch service={activeService} query={q} onClear={clearAll} />}
              />
            </section>
          </div>
        </PageContainer>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <PageContainer>
        <PageHeader crumbs={[{ label: t("nav.findCare") }]} title={t("site.care.title")} />
        {/* Dashboard: one search card (search, near me, filters, then the one-tap filters),
            since the sidebar leaves no room for a filter column (upgrade 12 §7) */}
        <div className="flex flex-col gap-3 rounded-panel bg-surface shadow-e2 p-3 sm:p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            {searchBox("flex-1")}
            <div className="flex shrink-0 gap-2">
              {!near && (
                <Button
                  variant="secondary"
                  pill
                  onClick={locate}
                  loading={locating === "busy"}
                  iconStart={<Crosshair aria-hidden="true" className="size-4" />}
                >
                  {t("home.nearMe")}
                </Button>
              )}
              <Button
                variant="secondary"
                pill
                onClick={() => setPanel(true)}
                iconStart={<Faders aria-hidden="true" className="size-4" />}
              >
                {chips.length ? t("care.filtersCount", { count: chips.length }) : t("care.filters")}
              </Button>
            </div>
          </div>
          <div
            role="group"
            aria-label={t("care.quick")}
            className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-0.5 [scrollbar-width:none]"
          >
            <Toggle on={openNow} onChange={(on) => set("open", on ? "1" : "")}>
              {t("home.openNow")}
            </Toggle>
            <Toggle on={emergency} onChange={(on) => set("emergency", on ? "1" : "")}>
              {t("site.care.emergencyFilter")}
            </Toggle>
            <Toggle on={today} onChange={(on) => set("today", on ? "1" : "")}>
              {t("care.availability.today")}
            </Toggle>
            <Toggle on={remote} onChange={(on) => set("remote", on ? "1" : "")}>
              {t("care.availability.remote")}
            </Toggle>
          </div>
          {locating === "denied" && (
            <p role="status" className="m-0 text-body-sm text-fg-secondary">
              {t("home.locationDenied")}
            </p>
          )}
        </div>
      </PageContainer>
      <div className="ml-stagger grid gap-6 pt-6">
        <div className="flex min-w-0 flex-col gap-3">
          {chips.length > 0 && (
            <ul
              aria-label={t("care.active")}
              className="m-0 flex list-none flex-wrap items-center gap-2 p-0"
            >
              {chips.map((chip) => (
                <li key={chip.key} className="animate-enter">
                  <button
                    type="button"
                    onClick={chip.remove}
                    aria-label={t("care.remove", { label: chip.label })}
                    className="inline-flex min-h-target cursor-pointer items-center gap-1.5 rounded-full bg-brand-subtle px-3 text-body-sm font-semibold text-on-brand-subtle transition-[background-color,transform] duration-150 ease-out-quint hover:bg-subtle active:scale-[0.97] motion-reduce:active:scale-100"
                  >
                    {chip.label}
                    <X aria-hidden="true" weight="bold" className="size-4" />
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={clearAll}
                  className="inline-flex min-h-target cursor-pointer items-center px-2 text-body-sm font-semibold text-link"
                >
                  {t("care.clearAll")}
                </button>
              </li>
            </ul>
          )}
          <PlacesView
            heading={t("site.care.results")}
            headingId="care-results"
            rows={rows}
            state={results.status}
            busy={results.isPlaceholderData}
            onRetry={() => void results.refetch()}
            near={near}
            sort={sort}
            onSort={setSort}
            empty={<NoMatch service={activeService} query={q} onClear={clearAll} />}
            directory
          />
        </div>
      </div>

      <Dialog
        open={panel}
        onOpenChange={setPanel}
        title={t("care.filters")}
        closeLabel={t("care.close")}
        footer={
          <Button fullWidth onClick={() => setPanel(false)}>
            {t("care.show", { count: rows.length })}
          </Button>
        }
      >
        {filters}
      </Dialog>
    </PublicLayout>
  );
}

function valid<T extends string>(value: string | null, allowed: readonly T[]): T | "" {
  return value && (allowed as readonly string[]).includes(value) ? (value as T) : "";
}

function Toggle({
  on,
  onChange,
  children,
}: {
  on: boolean;
  onChange: (on: boolean) => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => onChange(!on)}
      className={cx(FILTER, "inline-flex shrink-0 items-center text-left whitespace-nowrap")}
    >
      {children}
    </button>
  );
}

/**
 * No results: one line with the reason and, when a service was chosen, the nearest health centre
 * offering it (upgrade 03 §3).
 */
function NoMatch({
  service,
  query,
  onClear,
}: {
  service: ServiceKey | "";
  query: string;
  onClear: () => void;
}) {
  const { t } = useTranslation();
  const api = useApi();
  const fallback = useQuery({
    queryKey: ["discovery", "care-fallback", service],
    queryFn: () => api.booking.search({ service_code: SERVICE_CODES[service as ServiceKey] }),
    enabled: service !== "",
    select: (page) => page.results.find((r) => r.type === "health_center") ?? page.results[0],
  });
  return (
    <EmptyState
      title={t("care.none")}
      action={
        <div className="flex flex-wrap items-center justify-center gap-3">
          {fallback.data && (
            <Link to={`/facilities/${fallback.data.slug}`} viewTransition className="font-semibold">
              {t("care.tryInstead", { name: fallback.data.name })}
            </Link>
          )}
          {query && (
            <Link
              to={`/check-symptoms?q=${encodeURIComponent(query)}`}
              viewTransition
              className="font-semibold"
            >
              {t("site.care.checkSymptoms")}
            </Link>
          )}
          <Button variant="secondary" pill onClick={onClear}>
            {t("care.clearAll")}
          </Button>
        </div>
      }
    />
  );
}
