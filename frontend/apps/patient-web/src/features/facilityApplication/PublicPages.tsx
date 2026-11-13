import { isApiError } from "@medilink/api-client";
import { Alert, Button, buttonClassName, Card, ErrorSummary, TextField } from "@medilink/ui";
import { isLanguage } from "@medilink/ui/i18n";
import { ChartLineUp, Stethoscope, Users, type Icon } from "@phosphor-icons/react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router";

import { useApi } from "../../app/services";
import { PageHeading } from "../../components/PageHeading";
import { describeApiError } from "../../forms/api-errors";
import { EMAIL_PATTERN } from "../../forms/validation";
import { PublicLayout } from "../../layout/PublicLayout";
import { FacilityBoardIllustration } from "../site/illustrations";
import {
  Faq,
  HEADER_PRIMARY,
  HEADER_SECONDARY,
  PageContainer,
  PageHeader,
  Panel,
} from "../site/kit";
import { applicationKey, firstIncompleteStep, useApplication } from "./data";

const BENEFITS: { key: string; icon: Icon }[] = [
  { key: "queue", icon: Users },
  { key: "day", icon: ChartLineUp },
  { key: "records", icon: Stethoscope },
];
const PHASES = ["apply", "verify", "setup", "live"] as const;
const FAQ = ["cost", "documents", "time", "data"] as const;

/** /for-facilities (design 06 §4): what MediLink does for a facility, how onboarding works. */
export function ForFacilitiesPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const ended = (location.state as { ended?: boolean } | null)?.ended;
  return (
    <PublicLayout>
      <PageContainer className="flex flex-col gap-12 pb-16">
        {ended && (
          <Alert tone="success" role="status">
            {t("facilityApplication.public.sessionEnded")}
          </Alert>
        )}
        <section className="flex flex-col gap-4">
          {/* the one public page template: breadcrumb → H1 → lead, the two first steps and the
              facility board drawing on the band (upgrade 14 §3) */}
          <PageHeader
            crumbs={[{ label: t("facilityApplication.public.title") }]}
            title={t("facilityApplication.public.title")}
            lead={t("facilityApplication.public.problem")}
            art={
              // the board is drawn for the forest ground
              <div className="bg-forest p-5">
                <FacilityBoardIllustration className="block aspect-[16/10] w-full" />
              </div>
            }
            actions={
              <>
                <Link to="/for-facilities/apply" className={HEADER_PRIMARY}>
                  {t("facilityApplication.public.register")}
                </Link>
                <a href="#continue" className={HEADER_SECONDARY}>
                  {t("facilityApplication.public.continue")}
                </a>
              </>
            }
          />
        </section>

        {/* three benefits, a word each, no paragraph */}
        <section aria-labelledby="benefits-title" className="flex flex-col gap-4">
          <h2 id="benefits-title" className="m-0 font-heading text-h2">
            {t("facilityApplication.public.benefitsTitle")}
          </h2>
          <ul className="m-0 grid list-none gap-3 p-0 md:grid-cols-3">
            {BENEFITS.map(({ key, icon: BenefitIcon }) => (
              <li
                key={key}
                className="flex items-start gap-3 rounded-panel bg-surface p-5 shadow-e1"
              >
                <BenefitIcon
                  aria-hidden="true"
                  weight="duotone"
                  className="size-6 shrink-0 text-brand"
                />
                <span className="font-semibold text-fg">
                  {t(`facilityApplication.public.benefits.${key}`)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="how-title" className="flex flex-col gap-4">
          <h2 id="how-title" className="m-0 font-heading text-h2">
            {t("facilityApplication.public.howTitle")}
          </h2>
          <ol className="relative m-0 grid list-none gap-4 p-0 sm:grid-cols-4">
            <span
              aria-hidden="true"
              className="absolute top-[1.75rem] right-[12%] left-[12%] -z-10 hidden border-t-2 border-dashed border-primary/25 sm:block"
            />
            {PHASES.map((phase, index) => (
              <li key={phase} className="ml-card flex flex-col gap-2 rounded-panel bg-surface p-5">
                <span
                  aria-hidden="true"
                  className="inline-flex size-8 items-center justify-center rounded-full bg-forest font-heading text-body-sm font-bold text-on-forest tabular-nums"
                >
                  {index + 1}
                </span>
                <h3 className="m-0 font-heading text-h3">
                  {t(`facilityApplication.public.phases.${phase}.title`)}
                </h3>
                <p className="m-0 text-fg-secondary">
                  {t(`facilityApplication.public.phases.${phase}.body`)}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* the questions and "continue an application" side by side on wide screens */}
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <section aria-labelledby="faq-title" className="flex flex-col gap-3">
            <h2 id="faq-title" className="m-0 font-heading text-h2">
              {t("facilityApplication.public.faqTitle")}
            </h2>
            <Panel as="div" className="overflow-hidden">
              {FAQ.map((item, index) => (
                <Faq
                  key={item}
                  open={index === 0}
                  question={t(`facilityApplication.public.faq.${item}.q`)}
                >
                  {t(`facilityApplication.public.faq.${item}.a`)}
                </Faq>
              ))}
            </Panel>
          </section>

          <section id="continue" aria-labelledby="continue-title" className="lg:mt-11">
            <ResumeLinkForm headingId="continue-title" />
          </section>
        </div>
      </PageContainer>
    </PublicLayout>
  );
}

/** "Send me a link" form: always the same answer, whether the email is known or not. */
function ResumeLinkForm({ headingId }: { headingId: string }) {
  const { t } = useTranslation();
  const api = useApi();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError(t("facilityApplication.validation.email"));
      return;
    }
    setError(undefined);
    setBusy(true);
    try {
      await api.onboarding.applicant.requestResumeLinks(email.trim());
      setSent(true);
    } catch (failure) {
      setError(describeApiError(failure, t));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="rounded-panel border-0 shadow-e2">
      <h2 id={headingId} className="m-0 font-heading text-h3 font-bold">
        {t("facilityApplication.resume.linkTitle")}
      </h2>
      <p className="mt-2 mb-5 text-fg-secondary">{t("facilityApplication.resume.linkBody")}</p>
      {sent ? (
        <Alert tone="success" role="status">
          {t("facilityApplication.resume.linkSent")}
        </Alert>
      ) : (
        <form onSubmit={(e) => void submit(e)} className="flex flex-col gap-4" noValidate>
          <TextField
            label={t("facilityApplication.fields.email")}
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
          />
          <div>
            <Button type="submit" loading={busy}>
              {t("facilityApplication.resume.send")}
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
}

/** /for-facilities/apply: applicant and facility name; explains the resume email. */
export function StartPage() {
  const { t, i18n } = useTranslation();
  const api = useApi();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    facility_name: "",
    website: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [failure, setFailure] = useState<string | undefined>();
  const [attempt, setAttempt] = useState(0);
  const [busy, setBusy] = useState(false);
  const set = (key: keyof typeof values) => (e: { target: { value: string } }) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  async function submit(event: FormEvent) {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!values.facility_name.trim())
      next.facility_name = t("facilityApplication.validation.required");
    if (!values.name.trim()) next.name = t("facilityApplication.validation.required");
    if (!EMAIL_PATTERN.test(values.email.trim()))
      next.email = t("facilityApplication.validation.email");
    setErrors(next);
    setAttempt((n) => n + 1);
    if (Object.keys(next).length) return;
    setBusy(true);
    setFailure(undefined);
    try {
      const language = i18n.resolvedLanguage ?? i18n.language;
      const app = await api.onboarding.applicant.start({
        applicant: {
          name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          position: values.position.trim(),
        },
        facility_name: values.facility_name.trim(),
        preferred_language: isLanguage(language) ? language : "rw",
        ...(values.website ? { website: values.website } : {}),
      });
      queryClient.setQueryData(applicationKey(app.id), app);
      void navigate(`/for-facilities/apply/${app.id}/facility`);
    } catch (error) {
      setFailure(describeApiError(error, t));
    } finally {
      setBusy(false);
    }
  }

  const ids: Record<string, string> = {
    facility_name: "start-facility",
    name: "start-name",
    email: "start-email",
  };
  return (
    <PublicLayout narrow>
      <div className="flex flex-col gap-6">
        <PageHeading title={t("facilityApplication.start.title")}>
          {t("facilityApplication.start.title")}
        </PageHeading>
        <p className="m-0 text-fg-secondary">{t("facilityApplication.start.intro")}</p>
        <ErrorSummary
          focusKey={attempt}
          items={Object.entries(errors).map(([key, message]) => ({ fieldId: ids[key], message }))}
        />
        {failure && (
          <Alert tone="danger" role="alert">
            {failure}
          </Alert>
        )}
        <form onSubmit={(e) => void submit(e)} className="flex flex-col gap-5" noValidate>
          <TextField
            id="start-facility"
            label={t("facilityApplication.fields.facilityName")}
            value={values.facility_name}
            onChange={set("facility_name")}
            error={errors.facility_name}
          />
          <TextField
            id="start-name"
            label={t("facilityApplication.fields.yourName")}
            autoComplete="name"
            value={values.name}
            onChange={set("name")}
            error={errors.name}
          />
          <TextField
            id="start-email"
            label={t("facilityApplication.fields.email")}
            hint={t("facilityApplication.start.emailHint")}
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={set("email")}
            error={errors.email}
          />
          <TextField
            label={t("facilityApplication.fields.phone")}
            type="tel"
            autoComplete="tel"
            optional
            value={values.phone}
            onChange={set("phone")}
          />
          <TextField
            label={t("facilityApplication.fields.position")}
            optional
            value={values.position}
            onChange={set("position")}
          />
          {/* Honeypot: hidden from people, filled by bots. */}
          <div aria-hidden="true" className="sr-only">
            <label>
              {t("facilityApplication.start.honeypot")}
              <input
                tabIndex={-1}
                autoComplete="off"
                value={values.website}
                onChange={set("website")}
              />
            </label>
          </div>
          <Button type="submit" size="lg" loading={busy}>
            {t("facilityApplication.start.submit")}
          </Button>
        </form>
      </div>
    </PublicLayout>
  );
}

/** /for-facilities/apply/resume?token=…: exchanges the token, removes it from the address bar. */
export function ResumePage() {
  const { t } = useTranslation();
  const api = useApi();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [params] = useSearchParams();
  const token = useRef(params.get("token"));
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    const value = token.current;
    window.history.replaceState(window.history.state, "", window.location.pathname);
    if (!value) {
      setInvalid(true);
      return;
    }
    let cancelled = false;
    api.onboarding.applicant
      .resume(value)
      .then((app) => {
        if (cancelled) return;
        queryClient.setQueryData(applicationKey(app.id), app);
        void navigate(`/for-facilities/apply/${app.id}/${firstIncompleteStep(app)}`, {
          replace: true,
        });
      })
      .catch(() => !cancelled && setInvalid(true));
    return () => {
      cancelled = true;
    };
  }, [api, navigate, queryClient]);

  return (
    <PublicLayout narrow>
      <div className="flex flex-col gap-6">
        <PageHeading title={t("facilityApplication.resume.title")}>
          {t("facilityApplication.resume.title")}
        </PageHeading>
        {invalid ? (
          <>
            <Alert tone="warning" role="alert">
              {t("facilityApplication.resume.invalid")}
            </Alert>
            <ResumeLinkForm headingId="resume-again" />
          </>
        ) : (
          <p className="m-0 text-fg-secondary" role="status">
            {t("facilityApplication.resume.opening")}
          </p>
        )}
      </div>
    </PublicLayout>
  );
}

/** /for-facilities/apply/:id/submitted */
export function SubmittedPage() {
  const { t } = useTranslation();
  const { id = "" } = useParams();
  const app = useApplication(id);
  const status = app.data?.status;
  return (
    <PublicLayout narrow>
      <div className="flex flex-col gap-6">
        <PageHeading title={t("facilityApplication.submitted.title")}>
          {t("facilityApplication.submitted.title")}
        </PageHeading>
        {app.isError && isApiError(app.error) && app.error.status === 404 ? (
          <Alert tone="info">{t("facilityApplication.submitted.sessionOver")}</Alert>
        ) : (
          status && (
            <Alert tone="success" role="status">
              {t("facilityApplication.submitted.status", {
                status: t(`facilityApplication.status.${status}`),
              })}
            </Alert>
          )
        )}
        <ol className="m-0 flex flex-col gap-3 pl-5">
          <li>{t("facilityApplication.submitted.next1")}</li>
          <li>{t("facilityApplication.submitted.next2")}</li>
          <li>{t("facilityApplication.submitted.next3")}</li>
        </ol>
        <Link to="/" className={buttonClassName({ variant: "secondary" })}>
          {t("facilityApplication.submitted.home")}
        </Link>
      </div>
    </PublicLayout>
  );
}
