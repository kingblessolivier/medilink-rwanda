import type {
  Symptom,
  TriageAgeGroup,
  TriageDuration,
  TriageResult,
  TriageUrgency,
} from "@medilink/api-client";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  FirstAidKit,
  House,
  MagnifyingGlass,
  Phone,
  Siren,
  Sparkle,
  WarningOctagon,
  type Icon,
} from "@phosphor-icons/react";
import { Alert, Button, buttonClassName, cx, LoadingState } from "@medilink/ui";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import { useApi } from "../../app/services";
import { env } from "../../env";
import { PublicLayout } from "../../layout/PublicLayout";
import { PageContainer, PageHeader } from "../site/kit";
import { pick, SERVICE_CODES } from "../booking/discovery";

const AGE_GROUPS: TriageAgeGroup[] = ["infant", "child", "teen", "adult", "older"];
const DURATIONS: TriageDuration[] = ["today", "days", "week"];
const EMERGENCY_NUMBER = "912";

type Step = "danger" | "who" | "what" | "how-long" | "result";

const URGENCY: Record<TriageUrgency, { icon: Icon; card: string; badge: string }> = {
  emergency: { icon: Siren, card: "bg-danger-bg", badge: "text-danger" },
  today: { icon: Clock, card: "bg-attention-bg", badge: "text-attention" },
  soon: { icon: FirstAidKit, card: "bg-brand-subtle", badge: "text-on-brand-subtle" },
  self_care: { icon: House, card: "bg-success-bg", badge: "text-success" },
};

/** Search accepts a few service keys (design 06 H1); anything else searches general care. */
function searchKey(serviceCode: string): string {
  const found = Object.entries(SERVICE_CODES).find(([, code]) => code === serviceCode);
  return found ? found[0] : "general";
}

function Choice({
  selected,
  onClick,
  children,
  danger = false,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  /** A danger sign: red tint and an alert icon, never a harmless-looking grey card. */
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cx(
        "flex min-h-target cursor-pointer items-center gap-2 rounded-lg px-4 py-3 text-left font-semibold",
        "transition-[background-color,box-shadow,transform] duration-150 active:scale-[0.98] motion-reduce:active:scale-100",
        danger
          ? selected
            ? "bg-danger-solid text-on-danger-solid shadow-card"
            : "bg-danger-bg text-fg shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--ml-danger)_30%,transparent)] hover:shadow-[inset_0_0_0_2px_var(--ml-danger)]"
          : selected
            ? "bg-brand-subtle text-on-brand-subtle shadow-[inset_0_0_0_2px_var(--ml-brand)]"
            : "bg-surface text-fg shadow-card hover:bg-raised",
      )}
    >
      {danger ? (
        <WarningOctagon
          aria-hidden="true"
          weight={selected ? "fill" : "bold"}
          className={cx("size-5 shrink-0", !selected && "text-danger")}
        />
      ) : (
        selected && <CheckCircle aria-hidden="true" weight="fill" className="size-5 shrink-0" />
      )}
      {children}
    </button>
  );
}

function Progress({ step }: { step: Step }) {
  const order: Step[] = ["danger", "who", "what", "how-long"];
  const at = step === "result" ? order.length : order.indexOf(step);
  return (
    <div aria-hidden="true" className="flex gap-1.5">
      {order.map((s, i) => (
        <span
          key={s}
          className={cx("h-1.5 flex-1 rounded-full", i <= at ? "bg-brand" : "bg-subtle")}
        />
      ))}
    </div>
  );
}

/**
 * Symptom checker (contract public-pages-and-triage §3, analysis 11): the emergency check comes
 * first, then who it is for, what they feel and for how long; the answer is an urgency, the kind of
 * care and places nearby. Guidance, never a diagnosis.
 */
export function SymptomCheckerPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage ?? "rw";
  const api = useApi();
  const symptoms = useQuery({
    queryKey: ["public", "symptoms"],
    queryFn: () => api.booking.symptoms(),
    staleTime: 3_600_000,
  });
  const [step, setStep] = useState<Step>("danger");
  // Each step replaces the last: move focus to its heading so keyboard and screen-reader users
  // hear where they are (WCAG 2.4.3); not on first load
  const stepHeading = useRef<HTMLElement | null>(null);
  const firstStep = useRef(true);
  useEffect(() => {
    if (firstStep.current) {
      firstStep.current = false;
      return;
    }
    if (step === "result") document.getElementById("checker-answer")?.focus();
    else stepHeading.current?.focus();
  }, [step]);
  const headingRef = (el: HTMLElement | null) => {
    stepHeading.current = el;
  };
  const [danger, setDanger] = useState<string[]>([]);
  const [age, setAge] = useState<TriageAgeGroup | null>(null);
  const [pregnant, setPregnant] = useState(false);
  const [picked, setPicked] = useState<string[]>([]);
  const [duration, setDuration] = useState<TriageDuration | null>(null);
  const triage = useMutation({
    mutationFn: (body: Parameters<typeof api.triage.run>[0]) => api.triage.run(body),
    onSuccess: () => setStep("result"),
  });

  const list: Symptom[] = symptoms.data ?? [];
  const redFlags = list.filter((s) => s.is_red_flag);
  const others = list.filter((s) => !s.is_red_flag && s.code !== "other");
  const toggle = (code: string, set: (v: string[]) => void, current: string[]) =>
    set(
      current.includes(code) ? current.filter((c) => c !== code) : [...current, code].slice(0, 8),
    );
  const title = t("public.checker.title");
  const restart = () => {
    setStep("danger");
    setDanger([]);
    setAge(null);
    setPregnant(false);
    setPicked([]);
    setDuration(null);
    triage.reset();
  };

  return (
    <PublicLayout>
      {/* the shared page header and left edge, as every public page */}
      <PageContainer>
        <PageHeader
          crumbs={[{ label: t("public.checker.eyebrow") }]}
          title={title}
          lead={t("public.checker.intro")}
        />
      </PageContainer>
      <PageContainer narrow className="flex flex-col gap-6 pb-16">
        <div className="flex flex-col gap-2">
          {env.publicAssistant && (
            <Link
              to="/assistant"
              viewTransition
              className="group inline-flex items-center gap-2 self-start rounded-full border border-violet/30 bg-violet-bg px-4 py-2 text-body-sm font-semibold text-violet no-underline transition-colors duration-150 hover:border-violet"
            >
              <Sparkle aria-hidden="true" weight="fill" className="size-4" />
              {t("public.assistant.tryIt")}
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
          )}
        </div>
        <Progress step={step} />

        {symptoms.isPending && <LoadingState />}
        {symptoms.isError && <Alert tone="danger">{t("public.checker.loadFailed")}</Alert>}

        {symptoms.data && step === "danger" && (
          <section aria-labelledby="checker-danger" className="flex flex-col gap-4">
            <h2
              id="checker-danger"
              ref={headingRef}
              tabIndex={-1}
              className="m-0 font-heading text-h2 font-bold focus:outline-none"
            >
              {t("public.checker.dangerTitle")}
            </h2>
            <p className="m-0 text-fg-muted">{t("public.checker.dangerIntro")}</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {redFlags.map((s) => (
                <Choice
                  key={s.code}
                  danger
                  selected={danger.includes(s.code)}
                  onClick={() => toggle(s.code, setDanger, danger)}
                >
                  {pick(s.name_i18n, lang)}
                </Choice>
              ))}
              <Choice
                danger
                selected={danger.includes("unconscious")}
                onClick={() => toggle("unconscious", setDanger, danger)}
              >
                {t("public.checker.unconscious")}
              </Choice>
            </div>
            {danger.length > 0 ? (
              <EmergencyAnswer />
            ) : (
              <Button variant="secondary" size="lg" onClick={() => setStep("who")}>
                {t("public.checker.noneOfThese")}
                <ArrowRight aria-hidden="true" weight="bold" />
              </Button>
            )}
          </section>
        )}

        {step === "who" && (
          <section aria-labelledby="checker-who" className="flex flex-col gap-4">
            <h2
              id="checker-who"
              ref={headingRef}
              tabIndex={-1}
              className="m-0 font-heading text-h2 font-bold focus:outline-none"
            >
              {t("public.checker.whoTitle")}
            </h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {AGE_GROUPS.map((g) => (
                <Choice key={g} selected={age === g} onClick={() => setAge(g)}>
                  {t(`public.checker.age.${g}`)}
                </Choice>
              ))}
            </div>
            {(age === "teen" || age === "adult") && (
              <Choice selected={pregnant} onClick={() => setPregnant(!pregnant)}>
                {t("public.checker.pregnant")}
              </Choice>
            )}
            <StepButtons
              onBack={() => setStep("danger")}
              onNext={() => setStep("what")}
              canNext={age !== null}
            />
          </section>
        )}

        {step === "what" && (
          <section aria-labelledby="checker-what" className="flex flex-col gap-4">
            <h2
              id="checker-what"
              ref={headingRef}
              tabIndex={-1}
              className="m-0 font-heading text-h2 font-bold focus:outline-none"
            >
              {t("public.checker.whatTitle")}
            </h2>
            <p className="m-0 text-fg-muted">{t("public.checker.whatHint")}</p>
            <div className="flex flex-wrap gap-2">
              {others.map((s) => (
                <Choice
                  key={s.code}
                  selected={picked.includes(s.code)}
                  onClick={() => toggle(s.code, setPicked, picked)}
                >
                  {pick(s.name_i18n, lang)}
                </Choice>
              ))}
            </div>
            <StepButtons
              onBack={() => setStep("who")}
              onNext={() => setStep("how-long")}
              canNext={picked.length > 0}
            />
          </section>
        )}

        {step === "how-long" && (
          <section aria-labelledby="checker-long" className="flex flex-col gap-4">
            <h2
              id="checker-long"
              ref={headingRef}
              tabIndex={-1}
              className="m-0 font-heading text-h2 font-bold focus:outline-none"
            >
              {t("public.checker.longTitle")}
            </h2>
            <div className="grid gap-2 sm:grid-cols-3">
              {DURATIONS.map((d) => (
                <Choice key={d} selected={duration === d} onClick={() => setDuration(d)}>
                  {t(`public.checker.duration.${d}`)}
                </Choice>
              ))}
            </div>
            {triage.isError && <Alert tone="danger">{t("public.checker.failed")}</Alert>}
            <StepButtons
              onBack={() => setStep("what")}
              onNext={() =>
                triage.mutate({
                  symptoms: picked,
                  duration: duration!,
                  age_group: age!,
                  pregnant,
                })
              }
              canNext={duration !== null}
              nextLabel={t("public.checker.seeAdvice")}
              loading={triage.isPending}
            />
          </section>
        )}

        {step === "result" && triage.data && <Answer result={triage.data} onRestart={restart} />}

        <p className="m-0 text-body-sm text-fg-muted">{t("public.checker.disclaimer")}</p>
      </PageContainer>
    </PublicLayout>
  );
}

function StepButtons({
  onBack,
  onNext,
  canNext,
  nextLabel,
  loading = false,
}: {
  onBack: () => void;
  onNext: () => void;
  canNext: boolean;
  nextLabel?: string;
  loading?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeft aria-hidden="true" weight="bold" />
        {t("public.checker.back")}
      </Button>
      <Button size="lg" disabled={!canNext} loading={loading} onClick={onNext}>
        {nextLabel ?? t("public.checker.next")}
        <ArrowRight aria-hidden="true" weight="bold" />
      </Button>
    </div>
  );
}

export function EmergencyAnswer() {
  const { t } = useTranslation();
  return (
    <div role="alert" className="flex flex-col gap-3 rounded-xl bg-danger-bg p-5">
      <p className="m-0 flex items-center gap-2 font-heading text-h2 font-bold text-danger">
        <Siren aria-hidden="true" weight="fill" className="size-7" />
        {t("public.checker.emergencyTitle")}
      </p>
      <a
        href={`tel:${EMERGENCY_NUMBER}`}
        className="inline-flex min-h-14 items-center gap-3 self-start rounded-2xl bg-danger-solid px-6 font-heading text-h1 font-extrabold text-on-danger-solid no-underline tabular-nums shadow-card transition-[filter] duration-150 hover:brightness-105"
      >
        <Phone aria-hidden="true" weight="fill" className="size-7" />
        {t("public.checker.callNumber", { number: EMERGENCY_NUMBER })}
      </a>
      <p className="m-0 text-fg">
        {t("public.checker.emergencyBody", { number: EMERGENCY_NUMBER })}
      </p>
      <Link to="/emergency" className="self-start font-semibold">
        {t("public.checker.emergencyMore")}
      </Link>
    </div>
  );
}

function Answer({ result, onRestart }: { result: TriageResult; onRestart: () => void }) {
  const { t } = useTranslation();
  if (result.urgency === "emergency") return <EmergencyAnswer />;
  const look = URGENCY[result.urgency];
  const UrgencyIcon = look.icon;
  const reason = result.reasons[0] ?? "see_clinician";
  return (
    <section aria-labelledby="checker-answer" className="flex flex-col gap-4">
      <div className={cx("flex flex-col gap-3 rounded-xl p-5 sm:p-6", look.card)}>
        <p className="m-0 text-caption font-semibold tracking-wide text-fg-muted uppercase">
          {t("public.checker.answerEyebrow")}
        </p>
        <h2
          id="checker-answer"
          tabIndex={-1}
          className={cx(
            "m-0 flex items-center focus:outline-none gap-2.5 font-heading text-h1 font-bold",
            look.badge,
          )}
        >
          <UrgencyIcon aria-hidden="true" weight="fill" className="size-8 shrink-0" />
          {t(`public.checker.urgency.${result.urgency}`)}
        </h2>
        <p className="m-0 text-body text-fg">
          {t(`public.checker.service.${result.service_code}`, {
            defaultValue: t("public.checker.service.general_consultation"),
          })}
        </p>
        <p className="m-0 text-fg-muted">{t(`public.checker.reason.${reason}`)}</p>
      </div>
      {result.urgency !== "self_care" ? (
        <Link
          to={`/find-care?service=${searchKey(result.service_code)}`}
          className={buttonClassName({ size: "lg", fullWidth: true })}
        >
          <MagnifyingGlass aria-hidden="true" weight="bold" />
          {t("public.checker.findPlaces")}
        </Link>
      ) : (
        <p className="m-0 rounded-lg bg-surface p-4 shadow-card">
          {t("public.checker.selfCareWhen")}
        </p>
      )}
      {!result.signed_off && (
        <p className="m-0 text-body-sm text-fg-muted">{t("public.checker.notSignedOff")}</p>
      )}
      <Button variant="secondary" onClick={onRestart}>
        {t("public.checker.restart")}
      </Button>
    </section>
  );
}
