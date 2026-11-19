# Changelog

All notable changes to the MediLink API (`backend/`) are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[Semantic Versioning](https://semver.org/) (tags `backend-vX.Y.Z`).

## [Unreleased]

<!-- Wave 1: each sprint writes ONLY under its own heading; consolidated into Added/Changed/Fixed at release. -->

### Emails with the MediLink logo and website links (2026-11-19)

- Changed: every email (account, invitation, notification) has the white MediLink logo in its
  green header, linking to the website. A footer gives Find care, Help and Privacy links,
  "Emergency 912" and Kigali, Rwanda, in the reader's language. The inbox preview shows the
  first sentence. The logo is one fixed file on the website (`PATIENT_APP_URL` +
  `/brand/medilink-logo-horizontal-white-120.png`, or `EMAIL_LOGO_URL`), https only, so it tracks
  nothing. Without it the name stays as text.

### Concurrent saves no longer fail (2026-11-19)

- Fixed: the same push endpoint or app token sent twice at once answered 500 (unique endpoint) for
  the second; saves of one endpoint now take turns, so the second updates the first's row.
- Fixed: two listing refreshes of one facility at once (a save and the 10-minute job) failed on
  `facilities_listing_once`; refreshes of one facility now take turns.

### Push to the phone app (2026-11-19)

- Added: the phone app gets push notifications through Firebase Cloud Messaging. The app sends
  its token to `POST /api/v1/patient/app-devices/`; it is stored as a push subscription of kind
  `app` and removed like any other (`DELETE push-subscriptions/{id}/`). Every notification that
  goes out as web push now also reaches the phone, with the same texts and preferences. The visit
  reminders the app schedules itself (24 h, 2 h, 15 minutes, at the start) are not pushed, so they
  never ring twice. Set `FIREBASE_SERVICE_ACCOUNT` (the service account JSON) to turn it on.

### Background jobs run on a one-service deploy (2026-11-19)

- Fixed: on Railway no notification email, push or reminder ever went out. Only the API ran;
  there was no Celery worker or beat, so every job waited in Redis. The API container now also
  runs the worker with beat inside it (`scripts/railway_start.sh`); `EMBEDDED_WORKER=0` turns this
  off once separate `worker` and `beat` services exist.
- Changed: a delivery still queued 24 hours after it was queued is cancelled (`expired`), not
  sent, and the unread fallback skips notifications older than a day. A worker that was down
  does not send a backlog of stale alerts when it starts.

### Email over Brevo, "it's time" reminders (2026-11-19)

- Fixed: no email left production. Railway blocks outgoing SMTP below its Pro plan, so Gmail over
  SMTP never connected. With `BREVO_API_KEY` set, every email (accounts, invitations,
  notifications) goes through Brevo's HTTPS API with the same branded layout. `EMAIL_URL` (SMTP)
  stays for Mailpit and hosts that allow SMTP. `send_test_email` shows Brevo's reason when it
  refuses (for example an unverified sender). A notification email retries only when Brevo says
  it may pass later (429, 5xx).
- Added: two visit reminders on top of each patient's chosen ones: "Your visit is in 15 minutes"
  and "It's time for your visit" at the start (`scheduling.booking.soon` and
  `scheduling.booking.now`; in-app, push, email). The reminder job runs every minute instead of
  every 5, and "it's time" still goes out up to 10 minutes late if the job was down.

### Logos load again (2026-11-19)

- Fixed: every logo showed as a broken image. Logo links asked Cloudinary for "pad" with auto
  gravity, which it refuses (400); auto gravity is now sent only with the cropping modes.

### No past times on the cards (2026-11-18)

- Fixed: a card could say "Next time Fri, Nov 6" on Nov 18 when the background jobs (beat and
  worker) had not rebuilt the listing. Search never returns a time that has passed, and "available
  today" ignores one. `refresh_listing` (run on every deploy) now also creates the coming weeks'
  appointment times before rebuilding the listing.

### Logos and covers on every facility card (2026-11-18)

- Added: search results carry the facility's `logo_url` (listing field `logo_public_id`,
  migration `facilities 0008`).
- Fixed: a card could stay on the drawing when its photo was saved before the listing was rebuilt.
  Opening the facility's page now corrects that facility's card, and every Railway deploy runs
  `refresh_listing` after `migrate` (a failure there does not stop the deploy).

### Search by insurance (2026-11-18)

- Added: facility search takes `q` (name, sector, district, type, service) and `insured_only`. An
  insurer named in `q` in any language (mutuelle, mituweli, cbhi, rama, rssb, mmi, military,
  private, privé) becomes the insurer filter and narrows to places that take it; places that take
  the chosen insurer always come first. The page echoes `insurer_code`.

### Platform management of facilities and people (2026-11-18)

- Fixed: facility photos didn't show on the public search cards. The listing's cover is now the
  first Cloudinary photo, else the first clean scanned photo (`cover_url` may be the public photo
  path on this host); saving or removing photos rebuilds that facility's listing at once instead of
  waiting for the background refresh. New `manage.py refresh_listing` rebuilds every live facility
  now.

- Added: `GET /api/v1/platform/facilities/summary/` (counts by status, without a facility admin,
  licences expiring, expired or missing, without a FOSA ID) and the list filter `no_admin=true`;
  facility rows give `cover_url` and `logo_url`.
- Added: `GET /platform/facilities/{id}/staff/` (everyone with access, active or removed, with
  roles, two-step state and last sign-in, plus pending invitations);
  `POST /platform/facilities/{id}/invitations/` (invite by email with roles; step-up and a reason;
  audit `facility.staff_invited`) and `DELETE .../invitations/{invitation_id}/`.
- Added: `PATCH /platform/facilities/{id}/details/` corrects the platform-managed facts (name,
  type, ownership, level of care; never the slug); step-up and a reason; audit
  `facility.details_updated` (field names only); the public listing is rebuilt.
- Added: `POST /platform/users/{id}/facilities/{facility_id}/roles/` sets a person's roles at a
  facility (step-up, reason, the facility keeps one active facility admin; audit
  `platform.user.roles_changed`), and `POST /platform/users/{id}/platform-admin/{grant|revoke}/`
  (step-up, reason; never yourself, never the last platform admin, never a patient account;
  revoking ends the person's sessions; audit `platform.user.platform_admin_granted` / `_revoked`).

### Images on Cloudinary and the staff two-step switch (2026-11-18)

- Added: `medilink.images`: signed direct image uploads to Cloudinary (official `cloudinary` SDK,
  new dependency). `POST /api/v1/staff/uploads/signature/` (kinds `facility_photo` and
  `facility_logo` need `facility.configure`; `provider_avatar` any staff) and
  `POST /api/v1/patient/uploads/signature/` (`patient_avatar`); 503 `uploads_unavailable` without
  credentials, throttle 30/hour (`THROTTLE_RATE_UPLOAD_SIGNATURE`). Settings `CLOUDINARY_CLOUD_NAME`,
  `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_UPLOAD_PRESET`,
  `CLOUDINARY_ROOT_FOLDER`; deploy check `medilink.images.E001` wants all three credentials.
- Added: public ids are checked with the Admin API (the asset exists and sits in the kind's
  folder) and only they are stored: facility `photo_public_ids` (up to 6 with the scanned photos)
  and `logo_public_id` on `PATCH /staff/facility/` (migration `facilities.0006`), the doctor's
  `avatar_public_id` on `PATCH /staff/clinician-profile/public/` (`accounts.0011`; a PATCH with the
  photo changes only what it sends), the patient's photo on `PUT`/`DELETE
  /patient/profiles/{id}/avatar/` (`patients.0007`). Delivery URLs are built when read:
  `photo_images`, `logo_url`, `photo_url`, `avatar_url`; the public facility profile lists the
  Cloudinary photos first and gives `logo_url` and each doctor's `photo_url`; search results give
  `cover_url` (listing column, `facilities.0007`); StaffMe gives `photo_url` and the active
  facility's `logo_url`; PatientMe and profile summaries give `avatar_url`.
- Added: `UPLOADS_STORAGE=cloudinary`: the scanned upload pipeline can keep its files on Cloudinary
  as private (authenticated) raw assets with signed, expiring download links (`CLOUDINARY_URL` or
  the credentials above).
- Fixed: a Cloudinary error while checking an uploaded photo (credentials, rate limit, outage)
  answered 500; it is now a field error ("Try again in a moment") and is logged with Cloudinary's
  message. `CLOUDINARY_URL` fills the `CLOUDINARY_*` credentials left empty. New
  `manage.py cloudinary_check` (credentials, API reachable, preset signed).
- Added: Sign in with Google brings the Google profile photo (`picture`, only from
  `*.googleusercontent.com`, asked at 400 px): after the sign-in commits, a Celery task copies it
  to Cloudinary (patient avatars folder) and sets it as the patient's own photo, only while they
  have none; a failure never affects the sign-in.
- Added: feature flag `security.staff_mfa` (on, platform-wide, no facility overrides, migration
  `onboarding.0004`). A platform admin can turn it off for testing: staff then sign in and step up
  with the password alone; the login audit entry says `mfa_method: off_by_admin`.

### API image vulnerabilities (2026-11-07, #106)

- Fixed: the runtime image no longer carries pip (its vendored msgpack, urllib3 and setuptools had
  fixable high CVEs); the venv's pip is removed after the hash-checked install. the base's
  Debian packages take their pending security updates (apt, zlib). The image scan in `security.yml` blocks again.

### Email and Sign in with Google (2026-11-06, upgrade 17)

- Fixed: `GOOGLE_OAUTH_WEB_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_IDS`, `EMAIL_URL` and
  `DEFAULT_FROM_EMAIL` are trimmed, so a trailing newline pasted into the host's variable editor
  no longer breaks Google sign-in (wrong audience) or email headers.

- Added: `GET`/`POST /api/v1/patient/auth/google/` (patients only). The ID token is verified with
  PyJWT (new dependency: RS256 against Google's keys, issuer, audience, expiry); `GoogleIdentity`
  keeps Google's account ID (migration `accounts.0010`). A verified matching email links the
  patient account; a new person gets 409 `consent_required`, then an account without a password;
  staff accounts get 403 `staff_account`. Audit actions `auth.google.linked`, `auth.google.refused`.
  Settings `GOOGLE_OAUTH_WEB_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_IDS`, `GOOGLE_JWKS_URL`.
- Added: one branded email layout (`medilink.core.mail`); account emails in rw/en/fr by the
  account language; notification emails use it; `BrandedSMTPBackend` adds it to plain
  `send_mail()` messages. `manage.py send_test_email <address>` checks the mail settings.
  Deploy checks `medilink.W006` (EMAIL_URL is the local catcher) and `medilink.W007` (Gmail sender
  differs from the login). `.env.example` documents Gmail.

### Patient profile photo (2026-11-05)

- Added: `Patient.photo_file` (migration `patients.0006`) and upload purpose `patient_photo`
  (JPEG/PNG/HEIC, 5 MB, data class C3, scanned before use).
- Added: `POST`/`DELETE /api/v1/patient/profiles/{id}/photo/` and
  `POST .../photo/download-links/` for the patient (self or guardian); profiles show `has_photo`.
- Added: `POST /api/v1/staff/patients/{fp_id}/photo/download-links/` (`patients.view`, record at
  this facility) and `has_photo` on the facility patient record. Each staff view is audited.

### Patient passwords (2026-11-05)

- Changed: patient passwords need at least 8 characters (was 15; product decision, security 03
  §2). Staff and platform admins stay at 12. A patient who turns on two-step verification keeps 8.
- Added: `POST /api/v1/patient/auth/password/` changes the password while signed in. The current
  password is checked like a login (a wrong one counts towards lockout); success ends every
  other session, rotates this one, emails the owner and audits `auth.password.changed`.

### Sign-up email switch for testing (2026-11-05)

- Added: `PATIENT_SIGNUP_EMAIL_VERIFICATION` (default `true`). Set to `false` on a test
  deployment only: patient sign-up sends no email, the account can sign in straight away, and
  accounts still waiting for their link can sign in too. The `202` sign-up body gains
  `email_verification` (`false` while the switch is off) so the web and app show "account ready".

### Patient mobile app sessions (2026-11-05, upgrade 15)

- Added: the patient mobile app carries its patient session in a header. Requests with
  `X-MediLink-Client: app` send `Authorization: Bearer <session key>` and never read or set a
  cookie, so CSRF does not apply to them; login, rotation and logout return the new key (empty
  when ended) in `X-Session-Token`. Patients only: staff and admin paths stay anonymous for app
  requests. App sessions idle out after `PATIENT_APP_SESSION_IDLE_TIMEOUT` (default 30 days; the
  app locks itself with a PIN). Security 03 §5 records the decision.

### Railway deployment (2026-11-04)

- Fixed: `railway.json` runs `migrate` as the owner role (`MEDILINK_DB_ROLE=owner`); the app
  role cannot create tables. The pre-deploy and start commands run through `/bin/sh -c`, so
  `&&` and `${PORT}` work.
- Fixed: Railway's healthcheck host `healthcheck.railway.app` is allowed when
  `RAILWAY_ENVIRONMENT_NAME` is set.
- Fixed: `scripts/railway_bootstrap_db.py` refuses when `DATABASE_URL` or `DATABASE_OWNER_URL`
  uses the Postgres admin user (it would have demoted it) or both use one role, and says to
  remove `BOOTSTRAP_DATABASE_URL` afterwards; `check --deploy` warns while it is set
  (`medilink.W005`).
- Added: `railway.worker.json` and `railway.beat.json` for the Celery worker and beat (beat keeps
  its schedule file in `/tmp`; the app directory is read-only). Runbook:
  `docs/operations/railway.md`.

### National aggregate report (2026-11-04, #208)

- Added: `GET /api/v1/platform/reports/national/` for platform admins: load by facility and
  district (visits, median and 90th-percentile wait to the doctor, medicines out now), the wait
  trend by day, week or month, top diagnoses by district and stock-outs now. Each facility is read
  in its own RLS context with the W6 report helpers; aggregates only, never a patient.
- Added: small-group protection (k = 10, `platform_admin/national_report.py`). Visits of 1-9 are
  suppressed; inside a district the next smallest facilities are suppressed too until the hidden
  ones add up to 10, so the district total can't give a small facility away; a district of 1-9
  is suppressed, and the national total when the suppressed districts add up to 1-9. Waits are
  hidden below 10 patients called; diagnoses are listed only at 10 or more visits per district,
  sensitive ones never.
- Added: `GET /api/v1/platform/reports/national/export/?table=` (facilities, districts, waits,
  diagnoses, stockouts) as CSV, hidden cells reading `suppressed`; audit
  `platform.report.exported`.
- Changed: the W6 report shares its period parsing (`report.parse_period`), wait samples
  (`report.wait_samples`) and CSV writer (`report.csv_text`) with the national report; behaviour
  unchanged.

### Patient follow-through (2026-11-04, #206)

- Added: reminders through the notification engine (`notifications/reminders.py`, beat task
  `notifications.send_reminders` every 5 minutes). Booked visits at each recipient's reminder
  offsets (default 24 hours and 2 hours before); follow-up dates without a booking and planned
  care-schedule dates the day before at 08:00 and on the morning at 07:00 (Kigali). One dedupe key
  per item and moment, so nothing is sent twice; a moment from before the item existed is skipped,
  and after a gap only the latest passed moment goes out. Channel choices, quiet hours and alerts
  switched off for a dependant are the engine's.
- Added: the care schedule. `scheduling_care_schedule_entry` (forced facility RLS, encrypted
  optional note; scheduling migrations 0008 and 0009), permission `care_schedule.manage` for
  doctors, `GET`/`POST /api/v1/staff/care-schedule/patients/{facility_patient_id}/`, `POST
  /api/v1/staff/care-schedule/{id}/cancel/` (audit `scheduling.care_schedule.create` and
  `.cancel`) and `GET /api/v1/patient/care-schedule/` (planned dates and follow-up dates without a
  booking; SECURITY DEFINER `scheduling_patient_care_schedule`, self and guardian only).
- Added: events `clinical.lab_result.ready` (sent after a doctor releases a result; one per visit
  and hour; never the test name; delegates hear nothing of a restricted consultation),
  `scheduling.booking.reminder`, `scheduling.follow_up.due`, `scheduling.care_schedule.due` and
  `queue.ticket.called_desk` (a call with no room to name), each in rw, en and fr. Texts are
  generic: no test, vaccine or visit-type names on lock screens.
- Changed: "almost your turn" (`queue.ticket.almost`) now follows every queue move that brings a
  ticket forward (call, cancel, left, transfer, no response, reorder, priority, emergency,
  pass-over), not only a call, and reaches each ticket with 2 or 3 people ahead once.

### Patients without a phone (2026-11-04, #207)

- Added: `meal_timing` on prescription items (`before_food`, `with_food`, `after_food` or blank;
  pharmacy migration 0005). The item lock trigger also locks it once the prescription is issued.
- Added: dosing labels carry `frequency_code`, `times` (morning, noon, evening, night from the
  frequency) and `meal_timing` with `meal` in the label language, for the pictograms.
- Added: the staff visit (`GET /api/v1/staff/visits/{id}/`) carries `follow_up`: the date the
  doctor set, the booked time and booking code when it was booked, and the doctor, for the
  printed next-visit card.

### Facility reports (2026-11-04, #205)

- Added: `GET /api/v1/staff/reports/facility/` for `reports.view`: the facility report for a
  period (`from`, `to`, at most 366 days; `group=day|week|month`). Patients per period
  (completed, left without service, emergencies, no-shows), by source and service; waits per
  stage (median and 90th percentile, from joining the stage on site to the first `call` event);
  top ICD-10 diagnoses from signed notes and referrals out; money by payment method and insurer,
  exemptions, voids, credit notes and refunds; laboratory tests done and turnaround by test;
  stock out and low now, units received and dispensed, expiring batches. Built from existing
  tables (`medilink/visits/report.py`); aggregates only, never a patient name; sensitive
  diagnoses are counted, never named.
- Added: `GET /api/v1/staff/reports/facility/export/?table=…` returns one table as CSV (UTF-8
  with BOM, formula-safe cells, `no-store`) and records the audit action
  `visits.report.exported`.

### Pharmacy stock, lite (2026-11-04, #204)

- Added: stock per medicine, batch and expiry at each facility: `pharmacy_stock_item` (one card
  per medicine, with a low-stock threshold), `pharmacy_stock_batch` (batch number, expiry, units
  on hand, optional supplier; never below zero) and the append-only `pharmacy_stock_movement`
  ledger (received, dispensed, adjusted with a reason). Forced facility RLS on all three
  (pharmacy migrations 0003 and 0004).
- Added: permission `pharmacy.stock` for pharmacists and facility admins, and endpoints under
  `/api/v1/staff/pharmacy/stock/`: the list (`q`, `level=low|out|short`), `receive/`, one
  medicine's batches and last 50 movements (`{drug_code}/`; `PUT` sets the threshold),
  `batches/{id}/adjust/` (count correction, damaged or expired), `expiring/` (60 days by
  default, expired first) and `movements/`. Audit `pharmacy.stock.received`, `.adjusted` and
  `.threshold_changed`.
- Changed: dispensing takes the units from the earliest-expiring usable batches, in the same
  transaction and under a row lock on the stock card. When the usable stock is short, the whole
  dispensing is refused (`422`, "Only N left"): give that many as part, or correct the count
  first. There is no override. Expired batches are never dispensed. Medicines without stock are
  dispensed as before.
- Changed: once a medicine has stock, its availability follows the count: out of stock at zero
  usable units, `stock_level` `low` below the threshold. Drug search, prescription items and
  availability rows carry `stock_level` (null when the medicine has no stock card); availability
  rows also carry `follows_stock`, and the manual switch returns `422` for such a medicine.
  Pharmacist Today adds `low_stock` and `expiring_soon`; `out_of_stock` counts both kinds. Drug
  search is also open to `pharmacy.stock`.

### Cashier and insurance finish (2026-11-04, #203)

- Added: the monthly claim list per insurer. `GET /staff/insurance-claims/?insurer=&month=YYYY-MM`
  lists the month's bills whose insurance was verified and where the insurer owes something (not
  void): member number, visit date, ICD-10 codes of the signed notes (primary first), lines,
  insurer and patient shares, and the claim status, with totals. `GET .../insurers/` lists the
  insurers to choose from; `GET .../export/?kind=csv|pdf` downloads it (CSV UTF-8 with BOM and
  formula-safe cells; PDF A4 landscape with reportlab). Viewing needs `billing.approve` or
  `reports.view`; lists and downloads are audited (`billing.claims.listed`,
  `billing.claims.exported`).
- Added: `POST /staff/bills/{id}/claim/` marks a claim `paid` (optional payment reference) or
  `rejected` with the insurer's reason (`billing.approve`; optimistic `version`, 0 for the first
  mark; audit `billing.claim.marked` with the from and to status). New table
  `billing_insurance_claim` (billing migrations 0006–0007): forced facility RLS, never deleted,
  keeps its bill.
- Added: `by_method` on every cash shift: payments, received, refunds paid back, expected (cash
  with the opening float), counted and difference per payment method; `GET /staff/cash-shifts/`
  takes `mine=true`.
- Added: `billing.bills.add_tariff_line(visit, tariff_code=…)` and `remove_tariff_line(line_id,
  reason=…)`, the one way for other apps (lab tests, procedures) to put a priced item on a visit's
  bill and take it off again before payment.

### Doctor's quick note: order sets and favourites (2026-11-04, #202)

- Added: `GET /staff/clinical/favourites/`: the doctor's most used diagnoses and medicines at this
  facility, derived from their own signed consultations and issued prescriptions (last 180 days,
  used twice or more, 8 each; cancelled lines left out; sensitive diagnoses never listed). Each
  medicine carries the dosing of its latest use and `available_here`. Nothing is stored.
- Added: templates (order sets) return `diagnoses`, each code labelled in the request language
  with `is_sensitive` and `is_known` (an inactive or unknown code is flagged so applying skips it
  instead of failing the autosave).
- Added: `tests` on templates (`[{code, name}]`, max 10; accounts migration 0009), the extension
  point for W2 lab orders: stored and returned, not ordered yet.

### Laboratory loop and the lab technician (2026-11-04, #201)

- Added: role `lab_technician` with the new permissions `lab.operate` and `lab.result.enter`
  (plus `disputes.comment`, `reports.view_own`); never diagnoses, notes, bills or the release of a
  result (tenancy migration 0012). Seeded demo technician `lab@demo.medilink.test`.
- Added: `LabOrder` (`clinical_lab_order`, clinical migrations 0005 and 0006), one row per test:
  `ordered → sample_taken → resulted → reviewed → released` (`cancelled` before the sample). The
  request reason, the result and the doctor's note are field-encrypted (C3); forced facility RLS;
  never deleted; a result never changes once entered; released rows are locked. A constant
  catalogue of eight outpatient tests (malaria RDT, full blood count, urinalysis, blood glucose,
  HIV, pregnancy, stool, typhoid) with ranges and expected answers.
- Added: queue stage `lab` (visits migration 0007) and ticket action `send-to-lab`: the doctor's
  patient goes to the lab while the consultation stays a draft. The visit's last sample puts the
  lab ticket on hold; its last result sends the patient back to the ordering doctor with return
  priority, assigned to that doctor.
- Added: `GET /staff/lab/tests/`, `GET|POST /staff/consultations/{id}/lab-orders/`,
  `GET /staff/lab/queue/`, `POST /staff/lab-orders/{id}/sample|result|review|release|cancel/`,
  `GET /staff/lab/results/` (the doctor's lab inbox) and `GET /patient/results/` (released only,
  through the SECURITY DEFINER function `clinical_patient_lab_results`). Audit
  `clinical.lab_order.*` with a patient link.
- Added: a test whose code has a tariff item (`procedure` or `other`) adds a line to the visit's
  bill; cancelling it removes the line while nothing is paid. The lab sees whether the bill is
  paid.
- Changed: `GET /queue/mine/?stage=lab` is the technician's queue; a technician's board shows lab
  queues only; lab ticket rows carry no patient words or symptoms.

### Triage nurse and the triage stage (2026-11-04, #200)

- Added: role `triage_nurse` with the new permission `triage.operate` (plus `vitals.record`,
  `visit.reason.view`, `disputes.comment`, `reports.view_own`); never diagnoses, notes,
  prescriptions or bills (tenancy migration 0011). Seeded demo nurse `triage@demo.medilink.test`.
- Added: queue stage `triage` and queue setting `triage_enabled` (off by default). With it on,
  check-in and remote joiners start at triage instead of the doctor; emergencies skip it; moving a
  ticket forward offers triage until the patient was triaged.
- Added: ticket action `triage` (urgency `normal`, `priority` with a class, `emergency` with a
  reason; a short note; vitals first or `no_vitals_reason`), which moves the patient to the
  doctor's queue; the visit keeps `triaged_at`, `triaged_by`, `triage_urgency` and the encrypted
  note (visits migration 0006); audit `visits.ticket.triage`.
- Changed: `GET /queue/mine/?stage=triage` is the nurse's queue; a nurse's board shows triage
  queues only; triage ticket rows carry the patient's `allergies`; the consultation's
  `reason_for_visit.nurse_triage` gives the doctor the nurse's decision.

### Super admin user management (2026-11-04, #198)

- Changed: `GET /platform/users/` filters in the database (the list no longer loads every account)
  and takes `facility`, `role` and `verification=pending`; `q` also finds a phone (0788… finds
  +250788…); `mfa=off` lists staff and platform admins only.
- Added: `GET /platform/users/summary/` (counts and the facilities that have staff) and
  `GET /platform/users/export/` (staff and platform accounts as CSV, never patients; audit
  `platform.user.list_exported`).
- Changed: `GET /platform/users/{id}/` adds `verification_pending`, `preferred_language`,
  `sign_in_blocked_for`, pending `invitations` and admin `changes`; memberships carry
  `deactivated_at` and `deactivation_reason`.
- Added: `PATCH /platform/users/{id}/` corrects the name, work phone or language (never the email
  or password; no phone for patients); `send-password-reset/`, `resend-verification/` and
  `clear-sign-in-block/`; `facilities/{facility_id}/remove/` and `restore/`, which keep the last
  facility admin. All need a step-up and a reason, never on yourself, and are audited.
- Changed: facility admins on the platform facility rows carry `user_id`; restoring a membership
  records the reason when one is given.

### Super admin pages show what MediLink holds (2026-11-03)

- Changed: `POST /platform/facility-applications/` also takes `proposed_admin` and
  `claimed_insurer_codes`, so an application created on a facility's behalf holds everything known.
- Changed: application rows carry `district_name`, `proposed_admin_name`, `documents_count` and
  `missing_count`.
- Changed: facility rows and detail carry the profile (phone, email, address, map pin, photo count,
  level of care), the place (province to village), the facility admins, staff, doctor and
  attested-doctor counts, and staff by profession. New filters `ownership` and `missing_code`.
- Added: `GET /api/v1/platform/facilities/export/`: the facility list as CSV for the Ministry of
  Health (same filters, UTF-8 with BOM, formula-safe; audit `facility.list_exported`).
- Changed: platform user rows carry `phone`, `profession` and `licence_state`.

### Clinician profile: full professional details (2026-11-03)

- Added: on `ClinicianProfile`, `profession` (13 cadres), `specialty_code` (a fixed list of 21; `specialty`
  keeps the English name), `licence_valid_until`, the licence scan (upload purpose
  `clinician_licence`, C1), a photo (`clinician_photo`, C0), `sex` and up to 5 `qualifications`
  (migration accounts/0008). The RAHPC council joins the list.
- Changed: attesting a licence needs its scan and an end date that has not passed. New action
  `POST /staff/memberships/{id}/refuse-licence/` (reason required) removes the attestation and
  emails the clinician; a new licence number, council or scan clears every attestation.
- Added: daily `facilities.check_clinician_licences` (06:00): reminders 60 and 30 days before the
  end to the clinician and the facility admins; the day after, attestations are cleared ("The
  licence ended."). Scheduling refuses a clinician whose licence has ended.
- Added: `department_id` and `employment_type` (full time, part time, visiting, locum) on the
  membership (migration tenancy/0010), set with `PATCH /staff/memberships/{id}/`.
- Changed: OpenAPI names the patients' sex enum `PatientSexEnum`.

### Upgrade U2 · Public facility page ↔ facility admin

- Added: the public facility profile carries the admin's `email`, `website` and `photos` (stable
  public URLs, only clean photos, in the admin's order).
- Added: `GET /public/facilities/{slug}/photos/{upload_id}/` redirects to a short-lived signed
  link to one public photo (C0; 404 once the admin removes it).

### Upgrade U2 · Cashier role (upgrade 06 §4)

- Added: the `cashier` role (`billing.record_payment`, `disputes.comment`, `reports.view_own`;
  no queue, clinical or approval rights), seeded by `tenancy/0009_cashier_role`; a demo cashier
  in `seed_dev`.

### Upgrade U2 · Emergency department flag

- Added: `emergency_department` on the facility profile (admin PATCH), the public listing, search
  results and the public profile; `POST /public/facilities/search/` takes `emergency: true`
  (migration `facilities/0005`).

### Upgrade U2 · Service descriptions in master data

- Added: optional `description_i18n` on service catalogue items (migration `masterdata/0005`);
  public reads return it as `description`, and it never counts as a missing language.
- Fixed: master data search without trigram ranking is ordered, so pages no longer repeat or
  skip rows.

### Upgrade U2 · Public Contact page inbox (upgrade 11 §13)

- Added: `POST /public/contact/` stores a visitor's message (10/h per IP, health details refused)
  and returns its `CM-` reference; `support.ContactMessage` (migration `support/0003`).
- Added: `GET /platform/contact-messages/` and `POST /platform/contact-messages/{id}/handled/`
  for the MediLink team; audit actions `support.contact.received` and `support.contact.handled`.

### Facility onboarding: map pin, government identifiers, photos (2026-11-03)

- Changed: an application can be submitted only with its map pin (`location.latitude` is listed in
  `missing_for_submit`).
- Added: `moh_facility_code` (MoH facility code, the FOSA ID) and `tin` (9 digits) on the
  application's facility block and on `tenancy.Facility` (migrations onboarding/0003,
  tenancy/0008); approval copies them. `PATCH /api/v1/platform/facilities/{id}/` sets them
  later (step-up, audit `facility.identifiers_updated`).
- Added: document kind `facility_photo` (images only, up to 6). At approval the accepted photos
  become the facility profile's photos: each file turns into a `facility_photo` upload owned by
  the facility (C0), logged as a config change.

### Upgrade U2 · Pharmacist (upgrade 05 §4)

- Added: `GET /staff/pharmacy/my-day/` (ready, partly given, questions, dispensed, out of stock)
  and `GET /staff/pharmacy/history/?days=1|7|30&mine=&q=` (dispensings with line outcomes).

### Facility onboarding: approval keeps the application (2026-11-03)

- Changed: approving a facility application copies its phone, email, address, village, map pin
  and level of care (or the facility type's) into the facility profile, so the facility admin
  doesn't retype them. Only empty fields are filled; each one is logged as a config change by
  the reviewer.
- Changed: the facility admin's invitation carries the proposed admin's name, phone and
  language. Their new account starts with them; the accept page prefills the name
  (`suggested_name` on the lookup) and `full_name` may be left out.
- Added: `User.phone` (staff work phone, E.164) and `Invitation.full_name`, `phone`,
  `preferred_language` (migrations accounts/0007, tenancy/0007). `POST /staff/invitations/`
  takes optional `full_name` and `phone`; memberships, invitations and `StaffMe` return them.
- Added: `PATCH /api/v1/staff/auth/me/` for my own name, work phone and language (audit
  `staff.account.updated`). Phones must be Rwandan mobile numbers.

### Rwanda locations, NISR codes (issue #48)

- Added: migration `masterdata/0004_nisr_locations` loads Rwanda's 416 sectors, 2,148 cells and
  14,816 villages with NISR codes (NISR List of Villages 2019, via a CC BY 4.0 copy) from
  `masterdata/data/locations_nisr_2019.csv`. It adds only missing codes and reverses cleanly.
- Added: `scripts/convert_nisr_villages.py`, which rebuilds the CSV from the source and checks it
  against the NISR PDF. `masterdata/data/SOURCE.md` records the source, licence, every repair
  (merged I/II cells, glued and capitalised names) and the 3 rows where the PDF is incomplete.
- Changed: the onboarding test village is the real Abatuje (12090101, Bibare, Kimironko).

### Upgrade U2 · Reception (upgrade 05 §2)

- Added: `GET /staff/bookings/?code=` (check-in by booking code); ticket action `emergency`
  (reason required, audited `visits.ticket.emergency`); board rows carry `reason_text`, `symptoms`
  and the flags `red_flag`, `unpaid`, `insurance_unverified`, `no_phone`.

### AI symptom assistant, test phase (issue #159)

- Added: `POST /api/v1/public/assistant/`, one chat turn of the AI symptom assistant. The person's
  words become dataset symptoms (LLM); red flags answer 912 with no model; a local naive Bayes
  matcher (`triage/matcher.py`, model `nb-2026.11-1`, 773 conditions, held-out top-1 85 %, top-3
  94.7 %) asks the most useful follow-up question until it has 3 symptoms and 50 % confidence; the
  LLM then writes a hedged reply ("you may have X; see a doctor") and picks the service to book.
- Added: `train_symptom_matcher` command (the dataset CSV stays out of git) and the append-only,
  de-identified `triage_assistant_log` (symptom names and outcome, never the person's words).
- Added: `ASSISTANT_ENABLED`, `NVIDIA_API_KEY`, `NVIDIA_API_BASE`, `NVIDIA_MODEL`,
  `NVIDIA_TIMEOUT_SECONDS`, `THROTTLE_RATE_ASSISTANT` (15/min). Off by default. Test phase only:
  the hosted NVIDIA API sends symptom text abroad; production must use a NIM hosted in Rwanda.

### Upgrade U2 · Doctor tools (upgrade 05 §3)

- Added: `GET /staff/clinical/questions/` and `POST .../questions/{id}/reply/` (signed addendum
  linked as the answer in one step; step-up; prescriber only); `GET /staff/clinical/my-follow-ups/`;
  `GET /staff/clinical/my-activity/?days=7|30` (counts only); `/staff/clinical/templates/`
  (private to the clinician, across facilities; migration `accounts.0006`).
- Added: `GET/PATCH /staff/clinician-profile/public/` (bio in rw/en/fr, languages, visibility;
  audit `staff.clinician_profile.public_updated`). Public facility profiles show specialty, bio and
  languages of doctors who opted in; never the licence.

### Upgrade U12 · Patient dashboard links (upgrade 12 §2)

- Changed: patient notification targets follow the `/dashboard` app: bookings open
  `/dashboard/appointments/{booking_id}` (was `/visits`), tickets `/dashboard/queue/{visit_id}`,
  prescriptions `/dashboard/medications/{prescription_id}`, documents
  `/dashboard/documents/{document_id}`. Email and push links to a patient inbox item use
  `/dashboard/notifications/{id}` (`notifications.tasks.inbox_url`); staff links are unchanged.
  Older links already sent keep working through the frontend redirects. No API or schema change.
### Upgrade U2 · Doctor workspace (upgrade 05 §3)

- Added: `GET /staff/clinical/my-day/`: the clinician's own day (patients seen with a 7-day
  trend, average consult time, signed and unsigned records, results waiting, follow-ups today,
  open pharmacy questions).
- Changed: the consultation carries `reason_for_visit` (the patient's words from check-in or
  booking, structured symptoms, and the triage navigation hint, flagged while the rules are not
  signed off); every vitals row carries `flags` for dangerous numbers (low oxygen, very high or
  low blood pressure, high fever, low temperature, fast or slow pulse, fast breathing).

### Upgrade U2 · Facility admin command centre (upgrade 05 §5)

- Changed: `GET /staff/reports/operations/` adds `attention` counts (approvals pending, closed
  cash shifts, unsigned consultations, open disputes, pending invitations, staff without two-step
  sign-in, licence days left), `finance` (collected today, payments, bills, open balances),
  `bookings` (expected, arrived, no-shows, no-show rate) and `on_duty`. Aggregates only.
- Changed: staff memberships carry `last_login`.

### Upgrade U2 · No prices in discovery or booking (U-01, contract sprint-05 D-14)

- Changed: P1 search results drop `fee_rwf` and `patient_share_rwf`; P2 profile services drop
  `fee_rwf`, `insurer_shares` and `insurer_share_rwf`; `Booking.cost` keeps only `insurer_code`
  and `insurer_accepted`. Tariffs and insurer rules still drive the bill (S8).

### Sprint 9b · Catalogue wiring (contract sprint-09 §11)

- `medilink.notifications.wiring`: domain signals now reach patients and staff through
  `notify()`: booking confirmed, cancelled by the facility, changed, missed; called to a room;
  3 people before you; confirm you are here (pass-over); medicines ready and recorded; new
  prescription for the pharmacy; pharmacist question for the prescriber; new document ready;
  new facility application and merge request for platform admins. Texts in rw/en/fr without
  clinical words; receivers never break the change that triggered them.
- New after-commit signals: `pharmacy.signals` (`prescription_ready`, `prescription_dispensed`,
  `query_raised`), `documents.services.document_generated`, `patients.merge_requests.merge_requested`;
  S1's `dispatch()` also notifies platform admins in-app when an application is submitted (S1-I6).

### Sprint 10 part 2a · Disputes (contract sprint-10b)

- `medilink.disputes`: patients, guardians and reception (at the counter) raise a dispute from a
  visit, ticket, booking, missed-visit strike, prescription, bill or document. The subject's
  snapshot and its audit trail are frozen as evidence. Thread, internal notes, comment requests
  and staff comments; acknowledge (72 h) and decide (10 days) deadlines escalate to the platform
  on their own (hourly job); one-person facilities go straight to the platform; involved staff
  comment but never decide. Outcomes create actions: a missed-visit strike is reversed at once;
  refunds, bill corrections, record corrections and rebookings are recorded as pending actions.
  Patients accept, disagree within 14 days or reopen once within 30 days, and file a
  disagreement statement after a refused correction. Platform final decision with step-up.
- Text encrypted at rest; forced RLS on all seven tables; S9 notices without dispute text.

### Public pages and symptom triage (contract public-pages-and-triage)

- `medilink.triage`: `POST /public/triage/` turns structured answers (symptoms, how long, age group,
  pregnancy) into an urgency, a service and a level of care. Rules version `2026.11-p1` (red flags
  first, R2-R12, a safety layer that only raises urgency) are code with one test per rule and ship
  `signed_off: false` until clinical sign-off (#93). Each answer is logged in the append-only
  `triage_log` without account, IP or device. Throttle `triage` (20/min, `THROTTLE_RATE_TRIAGE`).
- Public facility profile and search: each service carries `waiting` (people before the
  consultation) and `wait_range` (the new-arrival estimate reception sees). The profile computes
  them live; search reads the listing (refreshed every 10 minutes). Counts only, never a person.
- Search results also list the accepted `insurers` codes, so the home page shows them per facility.


### Sprint 5b · Disruptions, follow-ups and the calendar feed

- Disruptions (FR-SCH-14): staff mark a doctor, service or the whole facility unavailable for a
  period; the affected confirmed bookings and today's remote tickets are listed; per item or in
  bulk, move to another doctor or time, offer a choice or cancel. Patients keep, choose another
  time or cancel (never a late cancellation and never a strike); an unanswered offer more than a
  day ahead is accepted automatically. Slot generation opens a disruption when booked slots no
  longer fit the schedule.
- Follow-ups (FR-SCH-15): the doctor books the same doctor for a later date or, when no slot is
  free, stores a reminder.
- Calendar feed (FR-SCH-11): a private `.ics` subscription per account, dependants included; the
  32-byte token is shown once and stored as SHA-256, revocable, served `no-store`.
- Reception calendar (day and week, per doctor) and the doctor's own calendar.
- New tables `scheduling_disruption`, `scheduling_disruption_item`, `scheduling_follow_up`,
  `scheduling_calendar_feed` with forced row-level security (facility; the feed by account); a
  periodic job accepts unanswered offers after the reply window.

### Security

- pypdf 6.21.2 → 6.21.4 in the hash-pinned locks (CVE-2026-119203 to CVE-2026-119209, reported by
  `pip-audit`).

### R7 · CI gates (#90)

- `post_migrate` grant and revoke receivers (`core.db`, `masterdata.db`) skip tables that don't
  exist, so migrating an app backwards no longer fails; `scripts/check_migrations_reversible.py`
  reverses and re-applies each app's latest migration in CI (NFR-OPS-08).
- Two platform-admin querysets (`masterdata` platform lists, `onboarding` facilities list) carry the
  Semgrep review tag for `.objects.all()` in views.

### Sprint 1 · Platform and onboarding

- Upload pipeline v1 (`medilink.uploads`, contract §2.4, §3.6): `uploads_file` with forced RLS
  (`facility_isolation` + `unowned_rows`); magic-byte sniffing (PDF, JPEG, PNG, HEIC/HEIF; CSV only
  for CSV purposes); size limit; UUID keys in a quarantine bucket; `scan_file` task with the
  `Scanner` interface (`ClamdScanner` over INSTREAM, `FakeScanner` for EICAR), 5 retries, then
  `failed`; images re-encoded without EXIF/XMP/GPS (40 MP limit, 3,000 px side, animations refused,
  HEIC to JPEG); PDFs refused when encrypted, scripted, with embedded files, launch actions, XFA or
  rich media, or over 100 pages; `ObjectStorage` with local (dev/test, `/api/v1/files/{token}/`)
  and S3-compatible (boto3, SSE, presigned) implementations; 5-minute signed download links with
  `nosniff`, sandbox CSP, `no-store` and CORP headers; hourly `purge_files`.
- Endpoints `POST /staff|patient/uploads/`, `GET …/{id}/`, `POST …/{id}/download-links/` with
  `Idempotency-Key` and the `upload` rate limit (60/h, `THROTTLE_RATE_UPLOAD`).
- Reusable interface for later sprints: `uploads.purposes.register(UploadPurpose(...))`,
  `services.receive/attach/download_link/soft_delete`, signal `upload_scanned`.
- Deploy checks `medilink.uploads.E001`–`E003` refuse the fake scanner, local storage and a
  non-https files origin.
- S1 audit actions registered through `extend_actions()` (`medilink.onboarding.audit_actions`).
- Master data (`medilink.masterdata`, contract §2.2, §2.6, §3.5): locations, facility types,
  service catalogue, insurers, drugs, ICD-10 codes, symptoms, public holidays and reason codes
  with rw/en/fr translations, `version` and an append-only `masterdata_change` log. Only
  `masterdata.services` writes them (pre-save guard); the runtime role has no `DELETE`/`TRUNCATE`
  (retire instead) and no `UPDATE`/`DELETE` on the change log (`post_migrate` revokes). Trigram
  indexes (`pg_trgm`) for drug and diagnosis search.
- Endpoints `/public/master-data/{kind}/` (5 kinds, localised, `Cache-Control` + `ETag`),
  `/staff/master-data/{kind}/` (9 kinds, search) and `/platform/master-data/{kind}/` (create,
  update, retire/restore, change history, CSV imports with preview and confirm; step-up on writes).
- `PlatformAdmin` permission (staff session, `is_platform_admin`, `PLATFORM_ALLOWED_NETWORKS`
  allowlist, deploy warning `medilink.W100` when empty) and `RecentAuthRequired` /
  `@requires_recent_auth()` (step-up or the login's MFA within 5 minutes, else
  `403 step_up_required`).
- Seeds: 5 provinces and 30 districts, 11 facility types, insurers, 26 services, an ICD-10 subset,
  symptoms, public holidays 2026–2027 and reason codes for every kind. Commands
  `import_locations`, `import_drugs`, `import_diagnosis_codes`, `import_symptoms` (dry run unless
  `--apply`) and the dev-only `seed_masterdata_dev` (sample sectors, cells and villages, `DEV-`
  codes).
- Dependencies: pillow, pillow-heif, pypdf, boto3.

- Staff idle lock (contract §2.5, S1-D13): sessions lock after `STAFF_SESSION_LOCK_AFTER`
  (default 900 s, check `medilink.E101` keeps it within 300–1,800 s) and end after
  `STAFF_SESSION_IDLE_TIMEOUT` (default now **4 h**, check `medilink.E102`) or 12 h. Locked
  sessions answer `401 session_locked` everywhere except lock state, lock, unlock and logout;
  their sockets are closed. `PrincipalState.LOCKED`.
- `GET|POST /staff/auth/lock/`, `POST /staff/auth/unlock/` (PIN or password; 5 failures end the
  session; 10 wrong PINs an hour disable PIN unlock and email the user; facility flag
  `security.pin_unlock`), `PUT|DELETE /staff/auth/pin/` (4–6 digits, no repeats, sequences or
  common PINs; Argon2id; setting needs step-up) and `POST /staff/auth/step-up/` (password + TOTP,
  5-minute window, 5 failures end the session).
- `StaffMe` gains `feature_flags` and `security` (`pin_set`, `lock_after_seconds`,
  `step_up_valid_until`).
- Feature flag catalogue and per-facility overrides (`onboarding_feature_flag`,
  `onboarding_facility_feature_flag`), `RequiresFeatureFlag`; onboarding tables and the
  notification email stub (`onboarding.notifications.dispatch`).

- Facility onboarding (`medilink.onboarding`, contract §2.3, §3.2, §3.5): public application
  wizard API with an emailed single-use resume link (7 days) exchanged for an HttpOnly applicant
  cookie (8 h sliding), autosave with `version`, documents through the upload pipeline (≤ 20,
  ≤ 100 MB), submit gate with dotted `fields`; super admin pipeline, review with per-document
  verdicts and item comments, notes, history and duplicate hints; approve (creates organisation,
  facility `approved`, licences, status event, signal `application_approved`) and reject, both
  with step-up and `Idempotency-Key`.
- Facility lifecycle `approved → setup → live → suspended / deactivated` with reasons, status
  events, go-live check registry (`licence.moh_operating_valid`), `is_publicly_listed()` and
  `accepts_new_bookings()`; licences with renewal (supersede) and corrections; daily 60/30-day and
  expiry reminders; stale draft reminder (83 days) and purge (90 days); per-facility and default
  feature flag administration; `GET /platform/overview/`.
- Notification email stub for application, licence, facility and security events (until S9).

### Sprint 3 · Patients and identity

- Patient identity (`medilink.patients`, contract §2): MediLink numbers (`ML-XXXX-XXXX`, Crockford
  alphabet with a Luhn mod 32 check character; backfilled for existing patients, assigned at
  sign-up); demographics, contacts and emergency contact; identifiers in `patients_identifier`
  stored only as AES-256-GCM ciphertext (bound to table, column and row), an HMAC-SHA256 blind
  index and the last four characters. Keys come from `MEDILINK_FIELD_KEYS` /
  `MEDILINK_BLIND_INDEX_KEYS`, with key ids so they can rotate (`patients_rotate_keys --data |
  --index`). Checks: `patients.W001` (derived development keys), `patients.E001` (deploy, keys
  missing), `patients.E002` (invalid keys).
- Facility records (`patients_facility_patient`, forced RLS) with file numbers. SECURITY DEFINER
  helpers `patients_known_elsewhere()` and `patients_facilities_of()` count other facilities
  without exposing them; `patients_audit_link` records which audit entries are about which
  patient, and is append-only along with `patients_merge_event`.
- Staff endpoints `/staff/patients/…`:
  - search by name, phone, ID, file number or MediLink number, with criteria in the body;
  - duplicate check (exact identifier, fuzzy name, date of birth and phone);
  - walk-in registration with care consent, and adding a patient who is already on MediLink;
  - record detail and edit, with versions;
  - identifiers, and an audited reveal with a reason;
  - insurance cards (S1 insurers; card photos through the S1 upload pipeline) and verification;
  - health profile (allergies, conditions, medicines with provenance and review);
  - desk consents and record-claim confirmation.
- Merges (`/staff/merge-requests/`, `/platform/merge-requests/`):
  - four-eyes approval with step-up; escalation for single-approver clinics;
  - execution re-points every row and records it, and undo restores the rows still at their merged value;
  - `merge.register_mover()` lets later sprints include their tables.
- Patient endpoints `/patient/…`: profiles through account links with per-link rights,
  dependents, delegation invites (one-time codes), identifiers, insurance, health items, record
  claims (emailed code or a reception ID check), consents and access history.
- Permissions `patients.view`, `patients.identifier_reveal`, `patients.insurance_verify`,
  `patients.merge_approve`; receptionists gain `patients.merge_request`. Rate limits `search`
  (60/min), `verification` (10/h), `reveal` (30/h). Jobs `expire_claims` (15 min) and
  `expire_delegation_invites` (daily); dev seed `seed_patients_dev`.
- Dependency: cryptography.

### Remediation R1 · Security core (#83)

- Security: patient sign-up no longer reveals existing accounts (#14). `POST /patient/auth/register/`
  always answers `202` "check your email"; a new account can't sign in until the emailed link is
  confirmed with the new `POST /patient/auth/verify-email/` (single use, 3 days); an existing
  email gets an "account exists" email instead. A password reset also confirms a pending sign-up.
  **Breaking** for clients that expected `201 PatientMe` and an immediate session.
- Security: TOTP secrets are encrypted at rest (AES-256-GCM, `MFA_SECRET_KEYS`), existing devices
  migrated (accounts 0005, reversible), `manage.py rotate_mfa_secrets` for rotation; deploy check
  `medilink.E110`/`E111` (#12).
- Security: field keys can be data keys wrapped by an OpenBao/Vault Transit KEK
  (`MEDILINK_KEYSTORE=transit`, `medilink.core.keystore_transit`).
- Security: the account owner is emailed (and `auth.account.locked` audited) when a login or MFA
  lock starts.
- Security: platform MFA reset and patient merge-request views use `PlatformAdmin`, so the
  `PLATFORM_ALLOWED_NETWORKS` allowlist applies; refused requests keep path and IP in the log.
- Security: daily audit anchor (`audit.export_audit_anchor`, sink `AUDIT_ANCHOR_SINK` = log, email
  or file); migration audit 0003 revokes `UPDATE`/`DELETE`/`TRUNCATE` on the audit table from the
  runtime role; the runtime role can't write `tenancy_role`, `tenancy_permission` or
  `tenancy_role_permissions`.
- Security: uploads are always served as attachments (the `disposition` request field is kept for
  compatibility and audited); `UPLOADS_S3_REGION` is required with S3 storage (no `af-south-1`
  default, check `medilink.uploads.E004`); optional SSE-KMS with `UPLOADS_S3_SSE_KMS_KEY_ID`.
- Security: a tripped onboarding honeypot gets the normal success-shaped `201`.
- Changed: `asgi`, `wsgi`, `celery` and `manage.py` refuse to start without
  `DJANGO_SETTINGS_MODULE` (environment or `backend/.env`) instead of defaulting to dev settings;
  `SECURE_HSTS_PRELOAD` is opt-in (default off); stray S3 enum overrides removed from
  `DEFAULT_THROTTLE_RATES`; the API image and compose services are pinned by digest.

### Remediation R2 · Patients (#84)

- Security: staff reads of a facility patient record (ST5) and its health profile (ST13) need a
  care relationship (open visit, visit in the last 30 days, or registered today) or a reason
  given first with the new `POST /staff/patients/{fp_id}/access-reasons/` (ST28); otherwise
  `403 access_reason_required`. Records of staff members always need a reason. Reasons are
  audited when given and on every read (FR-SEC-03).
- Security: record claims answer every refusal after the lookup with the same generic message;
  merge undo follows the approver rule (not the requester, not escalated merges at the facility).
- Merge request bodies reject unknown fields. PA7 dependents honour `Idempotency-Key`; ST17 claim
  confirmations are idempotent.
- Every consent is checked against the current version (`422`, field named); PA23 accepts the
  `notifications` and `location` account toggles; `PATIENTS_DEPENDENT_MAX_AGE` replaces the
  literal 18.
- File numbers are trimmed and uppercased, member numbers lose all spaces; unique violations on
  facility records map to the right `409` by constraint name.
- Access history shows each action only for the actor kinds that can perform it; `can_revoke`
  in delegations matches what revoke allows.
- OpenAPI: list responses describe the `{results}` wrapper or the paginated page; `/patient/`
  operations declare only `patientSession`, staff patient operations only `staffSession`.

### Sprint 9 · Notifications

- New app `medilink.notifications` (contract sprint-09): notifications, delivery attempts,
  preferences, push subscriptions, versioned templates, announcements (facility RLS plus a
  platform-rows policy) and known devices. Permission `announcements.manage` (facility admins).
- `notify(event, recipients, context, …)` for every later sprint: event registry autodiscovered
  from `<app>/notification_events.py`; recipients (users, a patient's self/guardian/delegate
  accounts with the `dependent` template variant, facility staff by permission or role, platform
  admins); dedupe key, rate limit, channel preferences, quiet hours 21:00–06:00 (critical,
  mandatory and important-for-today bypass them); rows written in the caller's transaction,
  sockets and sends on commit; `NotifyError` for programming errors.
- Content policy: clinical denylist (rw/en/fr, accent-insensitive) and no URLs in announcements,
  checked at template sync, revision, announcement save/publish and every render.
- Adapters: in-app (socket `notification.created`), web push (pywebpush: aes128gcm, VAPID,
  allowlisted hosts re-checked before every send, no redirects, 404/410 revokes) and email
  (plain text + autoescaped HTML in the recipient's language, no attachments or tracking).
- Jobs: `send_attempt` (`SKIP LOCKED`), `dispatch_due` (quiet-hours release, retries, lost
  tasks, expiry), `unread_fallback`, `cleanup` (2 years, 30 days, 180 days); retries with
  backoff (critical 10/30/90 s, others 1/5/15 min, 4 attempts) then the critical fallback.
- Security notices: new-device login (in-app + email; not the first device), MFA enrolled,
  password changed (also revokes push subscriptions); patient logout revokes that session's
  subscriptions; MFA reset and role changed are registered for S2 to call.
- Endpoints: public web-push key; patient and staff inboxes (list, detail, unread count with
  other facilities, read, read-all), preferences, push subscriptions; facility and platform
  announcements (draft, edit, publish with fan-out by language, withdraw, 10 a day); platform
  templates (revise, activate) and delivery log and stats; staff delivery log (`audit.view`).
- WebSockets `/ws/v1/patient/notifications/` and `/ws/v1/staff/notifications/` (IDs only,
  4401, 4429 above 30 client messages a minute).
- Commands `generate_vapid_keys`, `send_test_notification`, `notifications_tick`; system checks
  `notifications.E001`–`E004`, `W001`, `E010` (deploy). Dependency: pywebpush.
- Fix: an invalid `?since=` on the delivery log answers 400 (not 500).

### Sprint 2 · Facility setup and staff

- New apps `medilink.facilities`, `medilink.scheduling`, `medilink.billing`, all with forced
  facility RLS:
  - `facilities`: profile, departments, services, service points, opening hours, calendar events,
    settings sections, branding, and an append-only configuration change log.
  - `scheduling`: doctor schedule templates and exceptions.
  - `billing`: tariff items and insurer rules with effective dates (`btree_gist` exclusion
    constraints).
- Staff:
  - `tenancy_invitation` (hashed single-use tokens, 7 days) and membership service points.
  - Licence attestation and deactivation details on memberships; `accounts_clinician_profile`.
- Endpoints under `/staff/facility/` (profile, photos, hours, calendar events, effective calendar,
  settings, branding, change log, setup checklist, go-live) and under `/staff/`:
  - catalogue: departments, services, service points;
  - schedules: templates, exceptions, overview;
  - billing setup: tariff items, insurer rules;
  - team: roles, memberships, invitations, clinician profile.
- Invitation acceptance: `/staff/auth/invitations/lookup/` and `accept/`. New accounts set a
  password and then MFA; existing accounts confirm with their password.
- Platform: `/platform/memberships/{id}/mfa-reset/`.
- Database functions:
  - `scheduling_busy_ranges()` returns the times a doctor works at other facilities, never which
    facility (FR-ONB-06).
  - `tenancy_find_invitation()` looks up an invitation before login.
- S1 hooks:
  - `application_approved` invites the proposed facility admin and moves the facility to setup.
  - `setup.checklist_complete` is registered as a go-live check.
- Settings-section registry `register_settings_fields()`, plus interfaces for S5 and S8:
  - `effective_calendar()` and `blocks()` (S5);
  - `price()` and `insurer_rule()` (S8).
- Signal `scheduling.exception_approved`.
- Jobs and commands: `expire_invitations` (daily) and dev seed `seed_setup_dev`.
- Fixes from the S0–S5 audit (R3, #85):
  - Go-live no longer always answers `409`: `FacilityProfile` and the setup checklist expose
    `status_version`, the version go-live expects (not the profile `version`).
  - Checklist: `schedules` is done when no service is bookable; `insurers` is done when the
    application claimed no insurer.
  - Invitation accept for an existing account needs a signed-in staff session and returns
    `StaffMe`; the `{token, password}` path is gone (`401 not_authenticated` instead), so
    passwords are only checked by login (lockout, MFA, audit).
  - `POST /staff/invitations/` honours `Idempotency-Key` (same key: same invitation, one email).
  - `GET /staff/memberships/`, `/staff/invitations/` (no more silent 200 cap) and
    `/staff/schedule-templates/` are paginated (`{count, next, previous, results}`).
  - `409 conflict` on a versioned resource carries the resource as it is now in `error.current`
    (S1 onboarding, master data, S2 facility setup and staff).
  - `Idempotency-Key` must be a UUID (`400` otherwise), as architecture 02 says.
  - The membership-role join is an explicit model with `facility_id` and forced RLS (migration
    `tenancy.0006`); users still read their own roles in every facility.
  - Expired invitations are marked `expired` (new `expired_at`), not revoked, and no longer
    block a re-invite; resending one revives it.
  - Staff writes (invite, resend, accept, edit, reactivate, attest) are refused with `422` in a
    deactivated facility.
  - Celery beat hours are Kigali time (`CELERY_TIMEZONE`): invitation expiry 02:30, licence
    reminders 07:00, stale drafts 03:00, delegation invites 02:00.

### Remediation R4 · Queue and booking fixes (#86)

- A booked patient later than `slot + grace_after` checks in as a walk-in all day: the visit is
  flagged `is_late_arrival`, the check-in response and ticket rows carry `late`. A booking becomes
  `no_show` (with a strike) only after the facility has closed that day (FR-QUE-06, FR-SCH-13).
- "I'm here" (`POST /patient/visits/{id}/arrived/`) records the patient's claim only
  (`remote_arrival_claimed_at`); reception confirms with the new ticket action
  `POST /staff/tickets/{id}/confirm-arrival/` (`remote_arrival_confirmed_at`, visit `on_site`).
  Pass-over applies until then. Self check-in stays P2 (FR-QUE-07, FR-QUE-18). The ticket column
  `remote_checked_in_at` is renamed `remote_arrival_confirmed_at`.
- Pass-over warns first (event `pass_over_warning`, signal `ticket_pass_over_warning` with
  `final`) and moves the ticket `queue.pass_over_warning_minutes` (new, default 5) later.
- Manual queue places (no response, reorder, pass-over) use the new `visits_ticket.order_at` and
  the S5 calling order; `arrival_at` stays the real arrival.
- Ticket rows add `slot_starts_at`, `late`, `is_remote`, `remote_arrival_claimed_at`,
  `remote_arrival_confirmed_at` (flags `late`, `remote`, `remote_claimed`); the tracker (PT1) adds
  `is_remote` and both remote times. The board computes one calling order per queue; My queue and
  the display "next" numbers follow the calling order.
- Call next locks the doctor's duty row; partial unique index `visits_one_serving_ticket` (one
  called or in-service ticket per staff member and day).
- `next-stage` only from `in_service` and only forward.
- Signal `visits.services.on_ticket_event` sent on commit for every ticket event (sprint-04 §7).
- A booking for a patient already in today's queue joins that visit (same service, no booking
  yet), otherwise `422`.
- Optional `symptoms` at walk-in check-in and remote join (`captured_at_stage = check_in`).
- Service schedules: `ScheduleTemplate.membership` is nullable; their slots have no doctor.
- One patient-share rule (`booking.cover`: ceiling, excluded tariff codes, covered services) for
  search, profile and booking; the profile adds `insurer_share_rwf`.
- No-show strikes are a platform policy (`NO_SHOW_STRIKE_WARNING` 3, `NO_SHOW_STRIKE_LIMIT` 4,
  `NO_SHOW_STRIKE_WINDOW_DAYS` 90, `NO_SHOW_LIMIT_DAYS` 30); `limits()` returns `limited_until`.
- One open slot hold per account across facilities (`scheduling_account_holds`).
- Wait metrics run from check-in (or confirmed remote arrival) to the first `call` event.
- Revoking a display link closes its sockets.
- Every socket answers `ping` with the same flat `{"type": "pong", "sent_at"}`.

### Sprint 4 · Visits and the live queue

- New app `medilink.visits` (contract §2.1, [#73](https://github.com/B-Pine/medilink-rwanda/pull/73)):
  visits, tickets, ticket events, daily ticket counters, duty status, reorder reviews, display
  links, travel times and the transactional outbox (`core_outbox_event`, created by `visits`
  until `core` has migrations, D-8). Forced RLS on every facility table; the database rejects
  updates and deletes on the event tables.
- Rules (§2.2): idempotent check-in (also for two racing requests); emergency needs a reason and
  priority a reason code; ordering emergency → return → priority → arrival, own assigned tickets
  first only at equal rank, stepped-out patients skipped; atomic call next with
  `SELECT … FOR UPDATE SKIP LOCKED`; versioned ticket actions (`409` stale, `422` illegal);
  no-response re-insertion with a limit; transfer keeps the arrival time; reorder needs a reason
  and is listed for review; wait estimate as a range with status messages; end-of-day job and
  step-out expiry.
- Endpoints Q1–Q9 (staff board, My queue, call next, ticket actions, visit timeline, duty
  status, reorders, display links), D1 (public display: hashed token, `no-store`, never names)
  and PT1–PT3 (patient tracker, cancel, travel time).
- WebSockets for the staff queue, patient visits and the display: notify-then-fetch with IDs
  only, published after commit from the outbox.
- The patient tracker reads through a SECURITY DEFINER lookup scoped to the account's own and
  guarded profiles (D-7).
- Commands `seed_queue_dev` and `queue_concurrency_check` (DEBUG only; concurrency is proven on
  the dev database because the test suite runs in one transaction, D-9).
- Operations figures for facility admins: `GET /staff/reports/operations/` (today against the
  same day last week, 14-day trend, live load per service, 28-day arrivals heat map, attention
  counts; aggregates only, analysis 13 §1–2). `seed_queue_dev` backfills 13 days of synthetic
  visits.
- `GET /platform/overview/` adds `applications.approved` and `facilities_by_district`.

### Sprint 5a · Booking core

- Discovery (contract §3.1): `POST /public/facilities/search/` over the public read model
  `facilities_public_listing` (live facilities only, location never in URLs), facility profiles,
  a week of slots and symptoms with red flags; services carry `insurer_shares` for the patient
  share.
- Slots generated from the S2 templates minus closures, holidays, Umuganda and leave;
  5-minute holds under a row lock; `409 slot_taken` with nearby alternatives.
- Bookings: confirm rules with error codes, cost estimate, idempotent confirm, cancel and late
  cancel, reschedule, `.ics` without the reason; the reason is encrypted and symptoms are
  append-only.
- Queue: booked check-in with the grace window, booked/walk-in ratio in call next, remote join
  with cutoff, "I'm here" and pass-over.
- Reception (§3.3): staff bookings list, slots, phone booking, cancel, reschedule and no-show
  reversal with a reason (`patient_was_present`, `facility_delay`, `other`).
- No-show job with strikes; jobs and the dev seed; `booking_concurrency_check` (DEBUG only).
- `TIME_ZONE` is `Africa/Kigali` (was UTC; contract D-8).

### Sprint 6b · Legacy register import (part 2)

- Import a facility's paper register from CSV (contract sprint-06 §3.3 L1, FR-PAT-10): upload
  (`patient_import`), suggested column mapping (English, Kinyarwanda and French headers), preview
  with per-row problems (name, sex, dates, Rwandan phone numbers, 16-digit national IDs, file
  numbers already used) and likely duplicates from the S3 matching; nothing is created before
  confirm (step-up). Confirm creates patients and facility records in one transaction; rollback
  within 7 days unless an imported patient has a visit. No patient is notified.
- Raw rows are encrypted and purged daily after the rollback window (`purge_import_rows`, through
  the SECURITY DEFINER `patients_import_purge_facilities()`); the preview never holds a national
  ID. Tables `patients_import_batch` and `patients_import_row` with forced facility RLS.

### Sprint 6b · Results inbox, scans, back-entry and break-glass (part 1)

- Scans and outside results (contract sprint-06 §3.3 L2, R1): staff attach a `clinical_document`
  upload with a type and document date; an outside result opens a results inbox item for the
  uploading doctor (or the doctor of the patient's latest consultation), reviewed once with an
  encrypted comment. Scans download through an audited 5-minute link under the relationship rule.
- Back-entry (L3): past diagnoses (ICD-10), conditions, allergies, medicines and procedures from
  paper, always labelled historical; a back-entered allergy also becomes an unverified allergy for
  the prescribing alerts. Scans and back-entries appear in the history timeline (`scan`, `legacy`).
- Blood group and pregnancy status (`patients_health_attribute`, latest wins) in the consultation
  and the problem summary.
- Break-glass (G1, G2): a super admin gives a reason and re-authenticates for 60 minutes of
  read-only access to one patient at one facility; every opening and read is in the patient's
  access history; another super admin reviews it; a weekly S9 reminder counts sessions to review.
- New tables `clinical_scan`, `clinical_result_review`, `clinical_history_entry` (forced RLS),
  `patients_health_attribute` and `authz_break_glass_session` (platform, RLS exception); append-only
  and lock triggers.

### Sprint 6a · Consultation and history

- New app `medilink.clinical` ([contract](../docs/architecture/contracts/sprint-06-clinical.md)):
  `clinical_consultation`, `clinical_diagnosis`, `clinical_addendum`, `clinical_vitals` and
  `authz_access_reason`, all with forced facility RLS.
- Consultation per visit (C1–C7): idempotent open, draft autosave with `version` (`409` when
  stale), ICD-10 diagnoses from master data (one primary, provisional or confirmed; sensitive codes
  suggest a restricted record), sign with recent re-authentication and a SHA-256 content hash
  (late entry after 24 h, `integrity` recomputed on read), signed addenda by the author or another
  clinician, entered in error with a reason, and the unsigned records list without content.
- All consultation text, private notes and addendum bodies are field-encrypted (contract D-2).
  Database triggers lock signed records, their diagnoses and vitals, make addenda and access
  reasons append-only, and refuse every delete.
- A consultation-stage ticket cannot complete or move on while its visit has a draft
  (`pre_save` guard, D-6).
- Vitals (V1–V2) with plausible ranges; reception reads only the rows it recorded.
- Treatment-relationship rule (FR-SEC-03): an open visit today or care by the clinician in the
  last 30 days; otherwise, and always for staff-as-patient records, `403 access_reason_required`
  until a reason is given (A1, 120 minutes). Clinical reads and reasons are audited with patient
  links.
- History timeline with filters and problem summary (H1–H2); allergy, duplicate and dose alerts
  (AL1) for S7 prescribing.
- Patients read their own and dependants' signed records (PR1–PR2) through
  `clinical_patient_records(account)`: no private notes, no examination; delegates never see
  restricted records.
- New permission `clinical.unsigned_list` (doctor, facility admin), seeded by `clinical.0002`.
- Patient-scoped clinical routes live under `/staff/clinical/patients/…` because S3's
  `/staff/patients/{id}/{kind}/` matches any word (D-12). `ReasonCodeEnum` (S3 reveal) keeps
  its schema name through an `ENUM_NAME_OVERRIDES` entry in the `[S6]` block.

### Tests

- `tests/test_rls_coverage.py`: every table with `facility_id` has forced RLS with the
  `facility_isolation` policy, or is listed in `RLS_EXCEPTIONS` with the document that allows it;
  an exception that is no longer needed fails too (database design §1).

### Sprint 8 · Billing, payments and insurance

- Bills ([contract](../docs/architecture/contracts/sprint-08-billing.md)): one bill per visit,
  opened at check-in (S4 `on_ticket_event`) or on first read; the consultation from the tariff,
  procedures and other charges added by the cashier, medicines synced from the issued
  prescription (tariff code = drug code). Each line is split between insurer and patient by the
  S2 insurer rule (patient share, exclusions, service list, ceiling per visit) once the insurance
  is verified for the visit; a rejection (with a reason) means self-pay.
- Payments (cash, MTN MoMo, Airtel Money, card) with references and an optional EBM receipt
  number, partial, never above the balance, idempotent, in the cashier's open shift; gapless
  receipts (`RC-2026-000001`, prefix setting) sent to the patient through S9.
- Exemptions with reasons and a waiver approval threshold; voids and refunds through approval
  requests (step-up, decider other than the requester; a one-person clinic may self-approve,
  flagged), credit notes (`CN-`) and payouts; cash shifts with expected and counted totals per
  method, difference note and review; unpaid balances per patient at the facility; patient
  My bills. When nothing is left to pay, prescriptions waiting for payment move to the pharmacy.
- Eleven new `billing_*` tables with forced facility RLS; append-only events, verifications,
  credit notes and payouts; triggers lock payments, receipts, exemptions, bill lines and bills;
  SECURITY DEFINER `billing_patient_bills(uuid)`.

### Sprint 7a · Prescriptions and pharmacy

- New apps `medilink.pharmacy` and `medilink.documents` ([contract](../docs/architecture/contracts/sprint-07-pharmacy-documents.md)):
  prescriptions and items (catalogue drug or flagged free text, default quantity, encrypted
  instructions), issued in S6's signing transaction through the new `consultation_signed` signal
  (number `RX-{year}-{000001}` from a gapless per-facility counter, expiry from
  `documents.prescription_valid_days`, `awaiting_payment` with `billing.pay_before_dispensing`).
  Signing is refused (`422 alert_override_required`) while an allergy alert has no override.
- After issue: cancel an item or the whole prescription with a reason; change = cancel + new item
  (step-up). Pharmacy queue, identity check, dispensing per item (full, partial, generic
  substitution with the same ingredient and strength, not available), controlled-medicine
  confirmation, signed immutable dispense records, dosing labels in rw/en/fr (Kinyarwanda by
  default), queries answered by an S6 addendum, per-facility availability toggle
  (`pharmacy.availability`) and drug search with "not in stock here".
- Patient My medicines (`/patient/prescriptions/`): own and dependants' prescriptions; delegates
  don't see restricted consultations; no alert overrides or consultation text.
- Seven `pharmacy_*` tables and `documents_number_counter` with forced facility RLS; events,
  dispense records and lines append-only; triggers lock issued prescriptions and items; SECURITY
  DEFINER `pharmacy_patient_prescriptions(uuid)` and `pharmacy_expiry_facilities()`; hourly
  `pharmacy.expire_prescriptions` job. `pharmacy` and `documents` join the CI coverage gate.
- Follow-ups (#134): the pharmacy queue search `q` also matches the visit's active ticket number
  (exact, any case); prescription items carry the catalogue `generic_name` and `strength` (blank off
  catalogue) for the substitute search.


### Sprint 10 · Help center and support (part 1)

- New app `medilink.support` (contract sprint-10): help articles for patients and staff (rw/en/fr
  plain text, categories, search across languages, draft and publish with step-up and all three
  languages) and support requests (patients and staff open, reply and close; platform admins
  triage, reply and close with a reason; facility admins see their staff's requests read-only).
- No clinical data: subjects and messages are checked against the S9 clinical-terms list; at most
  5 open requests per account; `support_write` rate limit; messages are append-only.
- S9 notifications for created, followed up, answered and closed requests; audit actions with IDs
  and codes only; permission `support.view_facility`; `support_request` listed as an RLS
  exception (platform queue, sprint-10 §2.5); `support` in the CI coverage gate; dev seed.

### Added

- `DEV_SKIP_STAFF_MFA` (development only): staff log in without the second factor for local
  testing. Requires `DEBUG`; system check `medilink.E003` refuses it otherwise and the deploy check
  `medilink.E004` always refuses it. Logins record `mfa_method: dev_skip` in the audit log.

## [0.1.0] - 2026-10-17

Sprint 0 (Foundations), see [docs/architecture/03-sprint-0-contract.md](../docs/architecture/03-sprint-0-contract.md).

### Added

- Django 6.1 project with settings per environment (dev, test, prod) from environment variables,
  DRF with JSON-only rendering and parsing, drf-spectacular OpenAPI schema (non-production) with a
  committed copy in `openapi/openapi.yaml`.
- Custom `User` (UUIDv7, case-insensitive email login, Argon2id), `Organization`, `Facility`,
  `Role`, `Permission`, `FacilityMembership`, `Patient`, `PatientLink`, `ConsentRecord`,
  `AuditEntry`, TOTP devices (django-otp) and hashed MFA recovery codes.
- Roles and permissions seeded by data migration from the permission matrix (FR-ACC-01/03).
- Audience-scoped server-side sessions: separate staff and patient cookies (`__Host-ml_staff`,
  `__Host-ml_patient` in production), idle and absolute timeouts per audience, rotation on login,
  MFA success and facility switch.
- Staff sign-in with mandatory TOTP (setup, confirm with 10 single-use recovery codes, verify),
  active-facility switching, logout and `me` (FR-ACC-02/04, FR-SEC-06).
- Patient registration (account, self profile, link, terms/privacy/research consents), login,
  logout and `me` (FR-PAT-02, FR-SEC-04/05).
- Password reset (always `202`, single-use 30-minute link by email, all sessions revoked,
  notification email).
- Password policy: 15 characters for password-only accounts, 12 with MFA, common/breached/context
  blocklists, user-attribute similarity, no composition rules.
- Login protection: per-IP throttles, per-account progressive delay and 15-minute lock, MFA
  attempt lock, generic errors without account enumeration.
- Authorisation: global deny-by-default DRF permission, explicit permission classes per view,
  policy layer (`authorize`, scoped querysets, other-facility objects are `404`).
- PostgreSQL row-level security: reusable `EnableFacilityRLS` / `CreatePolicy` migration
  operations, per-request tenant context (`set_config(..., true)` in the request transaction),
  separate owner and runtime roles (FR-SEC-01/02).
- Append-only audit log with SHA-256 hash chain, DB trigger and revoked privileges,
  `verify_audit_chain` command and the Sprint 0 auth events (FR-SEC-07).
- Error envelope `{error: {code, message, fields, request_id}}` for every error, `X-Request-ID`
  on every response, structured logs with personal-data scrubbing.
- Security settings: CSP via Django's built-in `SECURE_CSP`, HSTS, secure cookies, COOP,
  Permissions-Policy, CORS allowlist with credentials, CSRF enforced on all unsafe API requests
  (token from `GET /api/v1/csrf/`, cookie `__Host-ml_csrf` in production); `check --deploy`
  passes on production settings.
- Channels ASGI app with origin validation and an authenticated placeholder consumer
  (`/ws/v1/staff/ping/`); sockets close on logout and password reset.
- Celery app (JSON only, no result backend, time limits); email tasks take IDs only.
- `seed_dev` command (DEBUG only), docker compose (PostgreSQL 17, Redis 7, Mailpit), database
  role init script, multi-stage non-root Dockerfile, hash-pinned requirements (pip-tools).
- CI workflow `ci-backend.yml`: ruff, mypy (non-blocking), pytest on PostgreSQL as the app role
  with a 90% coverage gate for accounts/authz/tenancy/audit, OpenAPI drift check, deploy check,
  pip-audit, image build.

[Unreleased]: https://github.com/B-Pine/medilink-rwanda/compare/backend-v0.1.0...HEAD
[0.1.0]: https://github.com/B-Pine/medilink-rwanda/releases/tag/backend-v0.1.0
