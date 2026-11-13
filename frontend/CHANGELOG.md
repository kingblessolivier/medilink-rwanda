# Changelog

All notable changes to the MediLink frontend (`frontend/`) are documented here.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html). Releases are tagged
`frontend-vX.Y.Z` ([ADR 0006](../docs/decisions/0006-separate-frontend-and-backend-hosting.md)).

## [Unreleased]

<!-- Wave 1: each sprint writes ONLY under its own heading; consolidated into Added/Changed/Fixed at release. -->

### Cleaner public site: one header, one spine, calmer motion (2026-11-13)

- Changed: every public page uses the same light page header (breadcrumb, title, one line); the
  dark green band with a rounded foot is gone. Header actions are the standard primary and
  secondary buttons (`HEADER_PRIMARY` / `HEADER_SECONDARY` replace `ON_FOREST_*` in the site kit).
- Changed: reading pages (About, Help, legal) start at the same left edge as every other page;
  only their text column is narrower.
- Changed: the home page leads with the search; under it one strip of three live figures instead
  of five competing tiles. The symptom checker is one link under the search; the duplicate
  "open near you" panel is gone (the facilities list below shows the same).
- Added: Home in the desktop navigation bar (it was only in the phone menu).
- Fixed: in light mode cards blended into the page. The site ground is a step below white
  (#edf2ef) and cards carry a soft forest-tinted shadow under the hairline.
- Fixed: the AI assistant button is a round icon on the public site, so it no longer covers
  list rows; facility names in the live list no longer cut off on phones; the About page links
  are all the same button; the resume form's email field has room under its paragraph.
- Changed: the facility page's services read in tiers (name, how to get it as tags, insurers; the
  wait and next time on the right; real buttons to join or book). Insurance and About sit in
  cards; doctor rows use dark names and a caret.
- Changed: the doctor page has a profile card (initials, here today, facts with icons) and an
  availability calendar: a week strip with the date large and a count per day, the chosen day
  filled, full days stepped back, and free times grouped into morning and afternoon.
- Changed: the services index is one card per category (its own icon and count) packed in two
  columns; the symptom checker uses the shared page header; a page header with only a title is
  shorter.
- Changed (motion): dialogs, sheets and the side panel animate out (quicker than in) instead of
  snapping shut; select menus grow from their field; Tailwind's `ease-out` uses the site curve;
  card hovers are 200–300 ms; with reduced motion, page changes still cross-fade (no movement).

### Assistant back, all 30 districts, sidebar groups you can hide (2026-11-08)

- Fixed: the AI assistant is back on the public site (the floating button, `/assistant` and the
  link on the symptom checker). It is on by default; `VITE_PUBLIC_ASSISTANT=false` hides it.
- Fixed: the district choice on the home page, Find care and the directories listed 6 districts;
  it lists all 30 (NISR codes, A to Z).
- Added: the patient and staff sidebars are in groups (patient: Care, My health, Account; staff:
  Work, Practice, Manage, Platform). Each group's title hides or shows its links; the choice is
  kept on the device (`medilink.navHidden`), and a hidden group opens again when its page is
  opened. `NavGroup` in `@medilink/ui`.

### Dark mode like the app, cards that read as cards (2026-11-07)

- Changed: dark mode on both web apps uses the patient app's palette (`mobile/lib/app/theme.dart`):
  neutral charcoal (page #111315, cards #1b1e21, lines #2d3135) instead of green-tinted
  charcoal; green only for actions and accents. Browser theme colour follows.
- Fixed: in light mode the dashboards' cards blended into the page. The page is now a clear step
  below white (#eef2ef), card edges are stronger, and the patient dashboard's panels take the
  soft card shadow (as the staff app's).
- Fixed: the overview's dispute reminder said "Open ticket"; it says "Open".

### Pre-launch cleanup (2026-11-07)

- Added: **disputes** screens (S10b-F1..F3, FR-DSP-01..10). Patients: Disputes list; "Report a
  problem" on a bill and a prescription; the thread (never the facility's internal notes);
  accept, disagree (sent to MediLink) and reopen once; a statement after a refused correction; an
  overview reminder when a dispute waits for an answer. Staff (`disputes.handle`): the queue (Open,
  Overdue, All) with flagged patients; a dispute with its audit trail, history, internal notes,
  comment requests, acknowledge, ask the patient, and resolve with only the outcomes that fit the
  subject; a colleague asked for a comment answers in place. Platform: escalated cases and the
  final decision (step-up). The Command centre's "Escalated disputes" and the facility Operations
  "disputes open" now open these screens (were a dead counter and the Help page). API client
  `disputes` module and MSW mocks with the backend's state machine.
- Added: **Import patients** (S6-F7, FR-PAT-10) at `/settings/patient-import` for members with
  `records.import`: upload a register CSV (scanned), columns suggested from the header row, check
  every row (problems per field, likely duplicates; nothing created), import the ready rows
  (step-up), undo within 7 days while no imported patient has a visit; earlier imports listed.
  API client `patientImports` and MSW mocks that parse the real file with the backend's rules.

- Added: patient **Bills** (S8-F6, FR-BIL-12) at `/dashboard/bills`: what is left to pay across
  facilities, bills with a balance first, then the newest; the bill with its lines (insurer and
  patient share), payments and receipt numbers; an overview reminder for each unpaid bill. In the
  sidebar, the phone More menu and search; `/bills` redirects. API client `billing.patient` and
  mocks for PB1 and PB2 (stable ids, two earlier bills at other facilities).
- Fixed: eight screens showed English day and month names on Kinyarwanda screens (doctor days,
  legal page date, receipt, payment times, claims, shift summary, doctor's day, console); they use
  `dateFormat()` now (#9).

### Public site audit, phase 5: quality bar (2026-11-07)

- Changed: the public pages and the patient dashboard follow the system dark mode (as the staff
  app); Settings can still pin light or dark. The map credit and the hero words read in both.
- Added: each page has its own search description (rw/en/fr), a canonical address and Open Graph
  tags; facility pages carry schema.org `Hospital` or `MedicalClinic` data and doctor pages
  `Physician` (static facts only, no waits or times). `VITE_SITE_URL` sets the canonical origin.
- Added: How it works, Help, Privacy, Terms and Accessibility are pre-rendered with their tags.
- Added: an offline line on the public pages, as in the dashboard.
- Fixed: the document check said nothing when sent empty; it now shows an inline error, and the
  details request can't be sent twice.
- Changed: the assistant button's code loads only when the public assistant is on (108 kB less
  on every public page).
- Tests: e2e search → facility → book signed out → sign in → back on the booking; the home page
  when everything is closed; the phone menu (Escape, focus return, no sideways scroll).

### Public site audit, phase 4: page by page (2026-11-07)

- Changed: Find care and Facilities share one filter bar: search and place; filters inline on wide
  screens and in a Filters sheet on phones; removable active-filter chips; the count; sort by open
  first, shortest wait or nearest. Both show the same cards beside a full-height map.
- Changed: the facility page opens on the forest band (drawing, status, Directions, Join or Book;
  Join only while open). Today is a compact table; insurance has its own section of chips; doctors
  are whole-row links; on phones Join or Book sits in a bar at the bottom.
- Changed: doctors are compact rows on phones; services fill the width in three columns; For
  facilities has a short hero, three benefits, four steps and the first answer open; Emergency puts
  "Call 912" first and largest; the home headline fits two lines.
- Changed: the header shows the emergency strip on wide screens and one emergency button on phones;
  the menu is a full-height sheet with a focus trap. Sign-in pages use the RW / EN / FR code select,
  so nothing is cut off at 390 px.
- Changed: "facility" instead of "place" in counts and labels (en, fr, rw).

### Public site audit, phase 3: say each thing once (2026-11-07)

- Changed: the patient journey is told once, on How it works: four steps with drawings (search,
  join or book, follow your place, arrive), then three "Good to know" points. Home drops its
  three-step band and trust strip for one line ("New here? How MediLink works"); About is one
  paragraph and the facts (live facility count, languages, data in Rwanda, when an account is
  needed).
- Changed: home is four bands: hero, kinds of care, facilities near you, and a slim For facilities
  band with one line and one button.
- Changed: Help opens with the search, then the five most asked questions with their answers in
  view; the rest are grouped and folded. While searching, every match shows its answer.
- Changed: the footer has three short groups (Explore, Information, Help); legal links sit in the
  bottom bar; no hover arrows. "Check symptoms" is named "Not sure where to go?" everywhere.
- Changed: the AI assistant is off the public site (`VITE_PUBLIC_ASSISTANT`, off by default): it
  runs on a test model. `/assistant` opens the guided questions; the floating button and the
  "Try the AI assistant" link are hidden. Signed-in patients keep it in the dashboard.
- Changed: shorter leads on For facilities and the symptom checker.

### Public site audit, phase 2: one design system with the app (2026-11-07)

- Changed: the public site uses the patient app's system. Radii are 8 / 12 / 20; cards are white
  with a hairline and no shadow, and only floating things (menus, sheets, the map card) cast one
  soft shadow; the type scale has six steps (body 16 px, h1 32 px) with tabular figures for
  numbers. Pre-rendered pages carry the site scale, so nothing shifts on load.
- Added (`@medilink/ui`): `StatusPill`, `SegmentedControl`, `Select` (replaces native selects),
  `Sheet`, `Accordion` (first answer open), `GroupedList`, `StickyActionBar`.
- Changed: Find care, Facilities, Doctors, Services and How it works open on the app's forest band
  (Imigongo texture, rounded foot). Facility cards have one action (Join or Book while open, else
  the next free time); the map icon and arrow are gone, the whole card opens the facility. District,
  type, service and facility filters use the shared select. List / Map is a segmented control.
- Removed: the hero gradient glow, the lit card edges and the icon tiles on link rows.
- Docs: `apps/patient-web/DESIGN.md` rewritten for the system.

### Public site audit, phase 1: what was broken (2026-11-07)

- Fixed: doctor links from facility, service and Doctors pages open the doctor (15 of 17 said
  "not listed"). The mock gave doctors, services and slots new random ids on every page load;
  they are now derived from the facility and service, so a link survives a reload.
- Fixed: dental care, eye care and the other services facilities offer open their page. The mock
  catalogue had 4 of the 16 seeded services; it now mirrors the backend seed, and a service page
  still opens from facility data when the catalogue lags.
- Fixed: home no longer shows "Open now 0", "People waiting 0" and "Typical wait —" at night. When
  every facility is closed, one line says so with the next opening; the list below is now
  "Facilities near you", open ones first.
- Fixed: facility cards hide "Book a time" while the facility is closed and show the next free
  time instead.
- Added: signing in from a booking says what was being booked ("Sign in to book General
  consultation at Kigali Clinic") and returns there after sign-in, Google sign-in, sign-up and the
  email link, with the service, doctor and day kept. A browser known to be signed out goes
  straight to sign-in, so no 401 is logged.
- Added: facility photos open in a lightbox (`Lightbox` in `@medilink/ui`: Esc, arrow keys, alt
  text, focus back to the thumbnail). Photos that fail to load are left out, no grey tiles.
- Fixed: doctor, service and facility "not found" pages have an `<h1>`, a reason and a link back.
- Fixed (accessibility): the footer's faint giant wordmark is gone (contrast 1.13:1); the
  emergency strip and the sign-in brand panel are `<aside>` landmarks; facility and doctor cards
  on Facilities and Doctors are `<h2>` under the page `<h1>`; map credit links are underlined.

### Dashboards · work screens (#262)

- Changed: the doctor's current patient shows three main actions (Open record, Finish and call
  next, Complete visit); sending to pharmacy or payment and waiting for results are under "More"
  (there were seven buttons of equal weight).
- Added: `ChoiceGroup` (a short list of choices as pills, a native radio group). Lab results with
  up to six choices (Negative, Trace, +, ++, +++) are one tap each instead of a drop-down.
- Added: `DateParts` (Day / Month / Year in every language). The walk-in date of birth uses it; a
  native date input showed the browser's region order (mm/dd/yyyy), easy to swap at the desk.
- Changed: Patients opens with what to search by, the "N" walk-in shortcut and a link to today's
  queue instead of an empty page.
- Changed: patient dashboard: the AI assistant button is icon-only so it covers less, and the
  account button is avatar-only (the sidebar card already shows whose portal it is).

### Dashboards · fixes and accessibility (#262)

- Fixed: mock records keep the same id on every page load (`mocks/ids.ts`), so refreshing or
  opening a link to a bill, consultation, appointment, application or queue ticket works in mock
  mode and e2e.
- Fixed: the platform Command centre no longer links "Escalated disputes" to a missing page (the
  disputes screens are #263).
- Fixed (WCAG 2.5.3): the search button, account menu and profile switcher are named by their
  visible text; tabs used as filters no longer point `aria-controls` at missing panels; the year
  on patient date badges meets contrast; map credit links are underlined.
- Changed: the signed-in apps load into an outline of the dashboard (`ShellSkeleton`) instead of a
  blank page with "Loading…".
- Fixed: `Skeleton` no longer forces `height: 1em` over height classes, so sized placeholders
  (cards, lists) show at their real size.
- Fixed: on phones the staff top bar fits: the "Live" chip shows its icon only (its own
  `inline-flex` beat `hidden`, so it wrapped over three lines), and the menu button is icon-only.
- Changed: staff Today opens with a calm header (date, greeting, neutral role chips) instead of
  the green banner; at most three actions are in view (one primary) and the rest are under
  "More" (the facility admin had 12 pills).
- Changed: patient overview: the alerts prompt is a full-width bar (it wrapped one word per line
  in the side column); "Confirm your email" uses the attention style; the measurements card is
  left out until there is something measured.

### Fewer words on the staff dashboards (2026-11-06)

- Changed: staff pages read like the app. The 45 page-header subtitles and the report section
  intros are gone (rw, en, fr; unused keys removed), as is the queue board intro. Today drops
  the "You are working at…" line; reception Today drops the "Waiting now" and "Still expected"
  tiles that repeated the flow strip (and could show a different number). The sidebar card shows
  the facility's initials and no platform-admin sentence.
- Changed: staff dark mode follows the device setting. The top-bar light/dark switch and the
  theme choice in the account menu are gone.
- Fixed: the doctor's "In your room" card no longer squeezes the patient's name; the Open record
  button drops below it. Today's quick actions no longer repeat a page (pharmacist saw
  "Pharmacy" twice), and the pharmacy counter tiles sit three per row so their labels are not
  cut off.

### Fewer words on the public site (2026-11-06)

- Changed: the public pages read like the app. Page-header intros are gone on facilities,
  doctors, services, find care, how it works, help, contact and accessibility (the emergency
  warning stays). Home drops the section intros, figure hints and trust-strip sentences; the hero,
  steps and facilities lines are shorter. About, "Good to know" and accessibility text is cut to
  short lines, and the "[To confirm]" marker is gone. Document verification intro is one line.
  All in rw, en and fr; unused keys removed.

### Fewer words on the patient dashboard (2026-11-05)

- Changed: the signed-in pages read like the patient app: labels and data, no explaining
  sentences. Page subtitles and intros are gone (overview, appointments, queue, family, records,
  medications, documents, help, settings, privacy, access history), as are empty-state bodies,
  settings section blurbs, quick-action descriptions and the "How the queue works" panel. Stat
  hints show data only (next date, last visit, facility). Remaining messages are shorter in rw, en
  and fr; the safety lines stay (late cancellation, reception confirms a remote arrival).

### Sign in with Google (2026-11-06, upgrade 17)

- Added: "Continue with Google" on login and sign-up (patient site), shown only when the API has it
  on; a first Google sign-in shows the sign-up consents before the account exists. API client
  `patientAuth.googleConfig()` / `google()`, `ApiError.current`; mocks keep it off. The patient
  site's CSP allows Google Identity Services under `https://accounts.google.com/gsi/` only.
- Fixed: on a Kinyarwanda page the Google button showed in French (Google has no Kinyarwanda);
  it shows in English now.

### Patient profile photo (2026-11-05)

- Added (patient web): a "Profile photo" card at the top of a profile (self and guardian): add,
  change or remove a JPEG/PNG/HEIC photo up to 5 MB, with who can see it.
- Added (staff web): the patient record shows "Show photo" when the patient added one; the photo
  loads only on request (each view is audited server-side).
- API client: `profile.uploadPhoto/removePhoto/photoLink`, `patients.photoLink`, `has_photo`.

### Patient passwords (2026-11-05)

- Changed: patient forms ask for at least 8 characters (was 15).
- Added: Settings → Security changes the password in place (current + new) instead of sending a
  reset email; "Forgot your current password?" still links to the reset flow.
  `patientAuth.changePassword` in the API client, with a mock handler.

### Sign-up without email on test servers (2026-11-05)

- Added: patient sign-up shows "Your account is ready" with a sign-in button when the API answers
  `email_verification: false` (test servers with `PATIENT_SIGNUP_EMAIL_VERIFICATION=false`).
  `patientAuth.register` now returns `SignupResponse`.

### Patient app updates on phones (2026-11-05)

- Fixed: a phone that resumed the patient app from the background kept the old version, because
  the browser only checks for a new service worker on a page load. The app now checks when it
  comes back into view and every hour; the new version then reloads the page as before.

### Vercel staging without a custom domain (2026-11-05)

- Fixed: on `*.vercel.app` every API `POST` failed with `403 csrf_failed`, because the browser
  does not send the API's `SameSite=Lax` cookies from `*.vercel.app` to `*.up.railway.app`.
  `frontend/vercel.json` now forwards `/api/*` to the Railway API, so the apps call the API on
  their own origin (`VITE_API_BASE_URL` = the Vercel URL). Live updates over WebSockets do not
  pass through Vercel, so they stop until the API has a custom domain
  ([docs/operations/railway.md](../docs/operations/railway.md) §4).

### Public site look (2026-11-04, upgrade 14)

- Changed: facilities show as cards with a drawing of their kind of building (referral hospital,
  district hospital, health centre, polyclinic, clinic; a red cross sign for a 24-hour emergency
  department) on home, `/facilities`, find care and search; same facts, links and buttons. The
  drawing and the name flow into the facility page, which shows the same building in its header.
- Changed: every inner page header sits on a white band the width of the screen with a hairline
  and a faint drawn pattern; one type scale for page and block titles (`text-page-title`,
  `text-title`).
- Changed: doctors as profile cards; how it works as numbered cards on a line; About as five
  numbered cards; help topics as chips; for facilities with the board drawing and the first steps
  in the header, questions and "continue" side by side.
- Changed: the current page's pill in the header glides between items; the emergency line and the
  footer stay still while a page changes; FAQ answers open smoothly; loading shapes shimmer; the
  footer wordmark is one flat tint. Reduced motion and data saver keep everything still.
- Audit and plan: `docs/upgrade/14-public-site-look.md`.

### National aggregate report (2026-11-04, #208)

- Added: **National report** in the platform console (`/platform/reports`, menu item for platform
  admins): headline figures, load by district and by facility, the wait trend, top diagnoses by
  district and stock-outs now, each table with a CSV download. Suppressed figures read
  **Hidden** with the reason on hover and for screen readers. Same period controls as the
  facility report (shared `PeriodControls`).
- Added: API client `console.nationalReport()` and `consolePaths.nationalExport()` with MSW
  mocks (seven facilities in four districts, small ones hidden as the server does). Strings in en
  and fr with draft rw.

### Patient follow-through (2026-11-04, #206)

- Added: **Planned by your clinic** on My appointments (upcoming): planned vaccinations and
  antenatal visits with their note, and the return visit a doctor asked for with **Book a time**.
- Added: **Needs your attention** on the overview shows a result released in the last week (**Read
  it**) and a planned date within two days.
- Changed: on My health records the released lab results come first, with an error state when
  they fail to load.
- Added: **Care schedule** tab on the staff patient record (`care_schedule.manage`, doctors): plan
  a vaccination or antenatal visit with a date and optional note, cancel with a confirmation.
- Added: API client `booking.comingUp()`, `booking.staff.careSchedule()`,
  `addCareSchedule()` and `cancelCareSchedule()` with MSW mocks (one planned vaccination and one
  follow-up date for patient@medilink.test). Strings in en and fr with draft rw.

### Close the books (2026-11-04, #209)

- Added: the **full-visit** end-to-end test (`e2e/full-visit.spec.ts`) on the staff-web mock
  build, in one session: reception checks in a walk-in; the triage nurse records vitals and sends
  the next patient to the doctor; the doctor orders a malaria test and sends the patient to the
  lab; the lab technician takes the sample and enters the result; the patient comes back to the
  same doctor first (after emergencies), who reviews and releases the result; the pharmacist
  gives a prescription and prints the labels with their pictograms.

### Patients without a phone (2026-11-04, #207)

- Added: **label pictograms**. Each dosing label shows the four times of the day (morning, noon,
  evening, night) with the ones to take marked and the dose, and before, with or after food as
  a picture with its word, in the label language. Black on white for thermal printers.
- Added: the doctor picks **with food?** (any time, before, with or after food) when
  prescribing.
- Changed: the **spoken call** on the waiting-room display reads each call in the languages set
  on the screen link (`?voice=rw,fr`), twice by default (`?repeat=1..3`), skips a language this
  device has no voice for, and falls back to English or French so a call is never silent. A
  **Test sound** button plays a sample call once sound is on.
- Added: **next-visit card** (`/queue/visits/:visitId/card`): when the doctor set a follow-up,
  reception prints the date (and booked time and code), service and doctor on the 80 mm slip,
  from a button on the queue panel.

### Facility reports (2026-11-04, #205)

- Changed: **Reports** (`/reports`, `reports.view`) is now the facility report for a period.
  Pick last 7, 30 or 90 days, this or last month, or your own dates, and show it by day, week
  or month (kept in the URL). Figures for patients, the doctor wait, money collected and
  no-shows; patients over the period; how patients came and by service; waiting time per stage
  (median and 9 in 10); top diagnoses and referrals; the laboratory; money by method and
  insurer, exemptions and voids; pharmacy stock and expiring batches. Each section downloads
  its table as CSV. Arrivals by hour and the 14-day wait trend stay below.
- Added: `api.queue.report()`, `queuePaths.report` and `queuePaths.reportExport` with the
  `FacilityReport` types, and MSW mocks with the server's period rules.

### Pharmacy stock, lite (2026-11-04, #204)

- Added: **Stock** for the pharmacist (`/pharmacy/stock`, menu item for `pharmacy.stock` or
  `pharmacy.dispense`): every medicine with stock, its usable units, level (in stock, low, out)
  and next expiry, with search; tabs for low or out, batches expiring within 60 days (expired
  first) and all movements. **Receive stock** takes the medicine, batch number, expiry date,
  units, an optional supplier and an optional low-stock threshold.
- Added: one medicine's page (`/pharmacy/stock/:drugCode`): usable units, a warning for expired
  units still on the shelf, the threshold, batches with **Adjust** (count correction by the number
  counted, or damaged/expired by the units taken off, with a note) and the last movements.
- Changed: doctors see "Low stock here" next to "Not in stock here" when they choose a medicine;
  Medicine availability shows the stock level for medicines with stock and locks their switch;
  Pharmacist Today adds "Low on stock" with the batches expiring soon.
- Added: api-client `pharmacy.stock.*`, the stock types and `stock_level` on drug rows,
  prescription items and availability rows; MSW mocks for every stock endpoint, with FEFO
  deduction and the "only N left" refusal in the dispense mock.

### Cashier and insurance finish (2026-11-04, #203)

- Added: **Insurance claims** (`/claims`, menu for `billing.approve` or `reports.view`): choose an
  insurer and a month, see the totals (to claim, not settled, paid, rejected), each insured visit
  with member number, ICD-10 codes, services and shares, download the list as CSV or PDF, and mark
  each claim paid (optional reference) or rejected with the insurer's reason.
- Added: the end-of-shift summary by payment method: on Payments under the open shift, on the
  cash desk card, as "Your last shift" on Payments once the shift is closed (expected, counted,
  difference per method, and whether it was accepted), and on the shift review in Approvals.
- Fixed: the opening float was counted twice: the shift's expected cash already holds it, so the
  close dialog pre-filled and compared cash with the float added again, and "Collected" included
  the float. Collected is now the payments only (`shiftCollected`).
- Changed: api-client `CashShift.by_method`, `billing.claimInsurers`, `claims`, `markClaim`,
  `billingPaths.claimsExport`, `shifts({ mine })`; MSW mocks for all of them (the mock's expected
  cash now holds the float, as the API does).

### Doctor's quick note: order sets and favourites (2026-11-04, #202)

- Changed: **Use a template** applies an order set in one click: diagnoses (provisional, with
  their names and the sensitive flag), plan, instructions and medicines. The panel then lists
  what was added, what was already there (never added twice) and what needs the doctor (unknown
  codes, medicines that failed, lab tests to order by hand). The note stays a draft until signed.
- Changed: **Save as template** keeps the draft prescription's medicines too, so a finished
  visit becomes an order set.
- Added: **Your frequent diagnoses** as one-click chips under the ICD-10 search, and **your
  frequent medicines** above the drug search (one click fills the dose, frequency, route and days
  of the latest use); both also come first in search results (`clinical.favourites()`).
- Added: lab tests on templates show as chips; the editor keeps them (no editor for them yet).
- Fixed: applying a template refreshes the prescription section straight away.

### Public site: every page on the new tokens (2026-11-04)

- Changed: the shared page kit: a larger fluid page heading with no rule under it; panels on
  the site elevation (`rounded-panel`, `shadow-e2`) instead of hard borders; hairline dividers;
  search and location fields, link rows, FAQ rows and insurer tags in the same style.
- Changed: **Doctors** rows have an initials mark, the days as a tag and "Here today" as a pill;
  **Services** are icon tiles; **For facilities** has icons per team, numbered step cards and
  the "Continue an application" form on a raised panel. The facility, emergency, help, about,
  legal, find care, symptom checker, assistant and verify pages follow the same surfaces.

### Laboratory loop (2026-11-04, #201)

- Added: **Tests** in the consultation: the doctor picks tests from the catalogue with a reason,
  sends the patient to the lab, and later reads each result with its flags, writes a note for
  the patient, marks it reviewed and releases it. A test not yet sampled can be cancelled.
- Added: **Laboratory** for the lab technician (`/lab`): call the next patient, check who they
  are (full name, date of birth, MediLink number) and whether the visit is paid, record each
  sample, then enter each result with out-of-range values flagged as they are typed. The last
  result sends the patient back to the doctor. The technician's Today shows waiting, results to
  enter and done today; the menu shows Laboratory and nothing of the desk, clinical work or
  payments.
- Added: **Lab results** at the top of the doctor's Results page.
- Added: patient-web **Lab results** in My health records, once the doctor released them, with
  the doctor's note.
- Changed: staff invitations and the user directory know the lab technician role; the queue
  board names the laboratory stage.

### Public site: a richer, cleaner second pass (2026-11-04)

- Added: public site tokens in `apps/patient-web/src/styles.css`: elevation `shadow-e1`–`e3`,
  hairlines (`border-hairline`), `rounded-panel` and `rounded-shell`, fluid `text-hero`,
  `text-section` and `text-kpi`, a brand glow and scroll reveal (off with reduced motion).
- Changed: **Home** has a two-column hero (headline, command search, common needs with icons,
  an illustration of a health centre on Rwanda's hills) and a bento of live figures (open now,
  people waiting, typical wait), the places open now with a wait bar each, and "Not sure where
  to go?"; services as icon tiles; the three steps as small illustrations; a trust row; a forest
  band for facilities with an abstract live-board illustration. Every number is real.
- Changed: **facility rows** everywhere: a type mark, insurers as tags, a status pill with the
  live wait bar, one action button and a round map button, aligned in columns.
- Changed: the **header** is a translucent bar with the pages as one segmented group and a solid
  Sign in; the **footer** has quiet columns, a slim bottom bar and a large faint wordmark.

### Triage nurse (2026-11-04, #200)

- Added: **Triage** for the triage nurse (`/triage`): call the next patient, see their words,
  symptoms and allergies, record vitals, choose normal, priority or emergency, add a note for the
  doctor and send them on. The nurse's Today shows who waits for triage; the menu shows Triage and
  nothing of the desk, clinical work or payments.
- Changed: the consultation shows the nurse's urgency and note above the patient's words.
- Changed: staff invitations and the user directory know the triage nurse role; facility rules
  have the switch "Patients see a triage nurse before the doctor".

### Super admin user management (2026-11-04, #198)

- Changed: **Users** shows the number of accounts of each type, links to the accounts that need
  attention (locked, staff without two-step login, email not confirmed), filters by facility,
  role and email confirmation, searches by phone, and keeps the filters in the address.
- Added: **Export staff accounts**: a CSV of staff and the platform team (never patients) for an
  access review.
- Added: a page for each person (`/platform/users/:id`) instead of the side panel: what needs
  attention with the action that fixes it, account facts, facility access with **Remove access**
  and **Restore access**, invitations not accepted yet, changes by admins and sign-in activity.
  Account actions add **Send password reset link**, **Resend confirmation email** and **Clear
  sign-in block**; **Correct details** fixes the name, work phone or language. Each asks for a
  reason and a re-confirmed identity.
- Changed: the platform facility page links its facility admins to their account and its staff to
  the filtered user list.

### Public site: finishing pass and design record (2026-11-04)

- Changed: **For facilities** shows the four teams on one surface with hairlines, the questions as
  the site's FAQ rows (no native ▶ markers) and pill buttons like the rest of the site; onboarding
  steps use outlined numbers.
- Changed: **Check symptoms** and the **AI assistant** have a breadcrumb instead of an uppercase
  eyebrow or badge above the title; the assistant's chat sits on a bordered surface. The sign-in
  side panel loses its uppercase eyebrow (`authAside.eyebrow` removed).
- Changed: on phones, Emergency's hospital rows stack the name above Directions.
- Added: `apps/patient-web/DESIGN.md` (the public site's design rules) and the audit record
  `docs/design/public-site-audit-2026-11-04.md`.

### Public site: reading pages and the emergency page (2026-11-04)

- Changed: **Emergency** opens with an urgent care card (NHS pattern): a red heading bar, the
  danger signs as a plain list and one "Call 912 now" button; then hospitals near you (directions,
  24-hour emergency marked in words) and the steps to take as a numbered list. The illustration,
  the pulsing icon and the decorative circle are gone.
- Changed: **How it works** is a step-by-step list in one reading column (numbered circles joined
  by a hairline) and "Good to know" is a plain bulleted list; **About** is one document with five
  sections instead of icon cards; legal pages' "On this page" is a plain list with a hairline.
- Changed: **Help** jump links are text links and "Still need help?" is a bordered row; document
  body text is the primary text colour at a 68-character measure; footer column headings are in
  sentence case.
- Fixed: legal pages no longer show "()" or "at ." where a draft "[To confirm]" marker was hidden:
  a bracketed marker goes with its brackets and a sentence that needs the missing fact is left out.

### Public site: a facility page that reads as a record (2026-11-04)

- Changed: the facility page has no tabs: **Today** is a summary list (hours and status, live
  wait per service, queue, appointments, insurance, the referral note, the hospital emergency
  note), then **Services** (ways in, live wait or next time, insurance, "Join today's queue" and
  "Book a time" as links), **Doctors**, **About** and **Photos**; the location and contact, the
  week's hours and what to bring sit beside.
- Changed: facility photos come after the facts as a row of up to four, not a product-style
  gallery under the name; no icon tiles in the facts or doctor rows.
- Removed: unused strings `site.facility.tabs.label|overview|insurance|hours` and
  `site.facility.insuranceLead`.

### Public site: doctors and services as directories (2026-11-04)

- Changed: **Doctors** lists each doctor as a row on one surface (name link, specialty and
  services, facility and district, days in words, "Here today") instead of cards with initials
  avatars and a seven-day chip strip.
- Changed: the doctor page's facts are a summary list (no avatar tile, no uppercase labels;
  services as links, not chips); day buttons are in sentence case.
- Changed: **Services** is an index: search and the categories (with counts) in a column on the
  left, each category a heading over its services as a list of links. No icon tiles, no boxed
  links. A service page lists where it is offered with the facility directory rows, and "What to
  bring" without an icon tile.

### Public site: a landing page for a public service (2026-11-04)

- Changed: the home page's first view is the question and the answer: the heading, one search and
  the common needs as links on the left; on the right the places open near the visitor, live
  (status, wait, type, district, accepted insurance) with Near me and "View all facilities".
- Changed: "What care do you need?" is an index of service links with real facility counts (no
  icon tiles); the three steps are a numbered list in words (no phone mock-ups); facilities get
  one quiet row with a link (the dark band and its sample dashboard numbers are gone).
- Removed: the illustrated hero and its unused strings (`site.home2.tag`, `float`, `trust`,
  `phone`, `dash`, `photos`, `popular`). Added `site.home2.allServices`.

### Public site: facilities as a directory, not products (2026-11-04)

- Changed: **Facilities**, **Find care**, the home page list and the assistant's suggestions show
  facilities as directory rows on one bordered surface (name link, type and place, emergency
  department, insurance in words, open/busy/closed, the live wait, and "Join today's queue" or
  "Book a time" as a link) instead of product cards with chips and Book pills.
  `FacilityCards.tsx` is now `FacilityDirectory.tsx` (`FacilityEntry`, `FacilityEntries`,
  `FacilityExplorer`); `PlacesView`'s `cards` prop is now `directory`.
- Changed: public page headings are Figtree 700 at 40 px (was 800 at 44 px); the eyebrow label
  above a page title is gone (the service page shows its category in the breadcrumb); filter
  panels and panels use a hairline border instead of a shadow.
- Removed: the scroll reveal (`.ml-reveal`): content is visible from the first paint.
- Changed: the floating AI assistant button is smaller (48 px).

### Super admin pages show what MediLink holds (2026-11-03)

- Added: **Register a facility** (`/platform/applications/new`) replaces the three-field dialog:
  facility, identifiers, province-to-village picker, map pin, applicant, facility admin and
  insurers. `/platform/applications/:id/edit` completes a draft; the review page has **Edit
  details** and adds documents for the facility while editable.
- Changed: the applications table shows type, district, the proposed admin and progress; the
  facilities table shows the FOSA ID, ownership, place, who is in charge and staff, with type,
  ownership, licence and "without a FOSA ID" filters and **Export CSV**; the facility page shows
  identity, contact and place, the people in charge and staff by profession.
- Changed: users show phone, profession and licence; master data Locations shows level and parent
  with a level filter.
- Fixed: badges break between words only, never inside one (they split as "Liv e" in tables).

### Clinician profile: full professional details (2026-11-03)

- Changed: **My clinician profile** (`/profile/clinician`) holds profession, specialty (list), sex,
  the licence end date and scan (camera or file, virus-checked), qualifications and a photo.
- Changed: the team panel shows the licence check: details, state, the scan to open, and Attest
  or **Cannot confirm** with a reason (the clinician is emailed); attesting is offered only with a
  scan and a valid end date. A new **Work at this facility** block sets department and employment.
- Added: `PROFESSIONS`, `SPECIALTY_CODES`, `EMPLOYMENT_TYPES` and the full clinician types in the
  API client, with the mocks.

### Public site · Facilities as products (#180)

- Changed: facility cards are product cards (tinted cover with the facility's monogram, type and
  24-hour emergency badges, insurer chips, the whole card clickable, one action row with a map
  icon button). The facility profile opens with its photo gallery under the name.
- Added: public site motion and surface tokens (`--ml-motion-*`, `--ml-ease-*`, `--ml-glass-*`,
  `--ml-hero-mesh`, `--ml-band-mesh`) and utilities (`.ml-glass`, `.ml-nav-indicator`, `.ml-lift`,
  `.ml-float`, `.ml-hero-seq`, `.ml-band`); all off with reduced motion or data saver.
- Changed: frosted public header; nav links with hover pills and an active underline that glides
  between pages (view transition); compact EN / RW / FR select. Navbar pages open on a branded
  header band (mesh and Imigongo pattern). Landing: mesh hero, staged entrance, drifting live
  cards, a raised search, a divided trust strip, cards and tiles that lift on hover.
- Changed: calmer public footer (one compact "Call 912" block instead of the red card, secondary
  link colour, compact language select). Landing search: the field has its own row, so the
  placeholder and the place are no longer cut off.
- Changed: the floating assistant button folds to its icon once the page scrolls.
- Changed: a firmer, less generic public look. Smaller corners (site-scoped `--radius-xl/2xl/3xl`),
  hairline borders instead of glowing shadows, no tinted glow, flat hero and page headers (an
  editorial heading with a rule), no floating UI cards over the hero photos, and facility cards
  with a plain header row (type icon, type, emergency) instead of an illustrated cover.
- Changed: public pages use more of wide screens (container 1200 → 1408 px, header, footer and
  Find Care aligned to it); Find Care keeps one card per row until 1792 px so actions never clip.
- Removed: the landing page's "Live waiting times at verified facilities" tag and the trust strip
  (verified facilities, districts, languages, free) under the hero.
- Changed: a cleaner sign-in side panel: no pattern or glow, the three benefits as plain lines
  between hairlines instead of icon tiles, and a narrower panel so the form leads.
- Changed: the landing hero shows a flat SVG illustration (a health centre on terraced hills with
  an Imigongo frieze, a tree and people waiting) in theme colours instead of the generated photo
  collage.
- Fixed: home service tiles no longer show "0 facilities".
- Fixed: sign-in, sign-up and password screens use the public site's palette (the button green
  matches the site), the logo no longer squashes on phones, and the top bar fits 360 px (the
  theme switch moves to wider screens; the theme follows the system on phones).

### Vercel services (ADR 0009)

- Added: `frontend/vercel.json`: one Vercel project, `patient-web` at `/` and `staff-web` at
  `/staff` (built with `--base /staff/`); security and cache headers per service.
- Changed: staff-web router basename and the display link follow `import.meta.env.BASE_URL`;
  the patient service worker never serves its shell for `/staff`.

### Upgrade U2 · Cashier role (upgrade 06 §4)

- Added: Cashier in the staff invite roles; Cash desk on Today (shift, bills to pay, partly
  paid, payments and amount collected this shift, next bills to pay). The cashier sees Payments,
  not the queue or approvals.

### Upgrade U2 · Emergency department flag

- Added: "24-hour emergency department" switch in Settings › Facility profile.
- Changed: /emergency lists declared emergency departments first with a "24-hour emergency"
  badge, then other hospitals; the facility page shows the badge and an open-day-and-night note.

### Upgrade U2 · Service descriptions in master data

- Added: platform admins write a public description per service in Master data (optional, in
  each language); the public service page shows it before the built-in text.

### Upgrade U2 · Public Contact page inbox (upgrade 11 §13)

- Fixed: the public Contact form now reaches the MediLink team (it posted to an endpoint that did
  not exist); the visitor sees a reference, and the server's own field errors inline.
- Added: Website messages (`/platform/contact-messages`) for platform admins: new / handled /
  all, search, reply by email or call, mark handled with a note.

### Upgrade U2 · Public facility page ↔ facility admin

- Added: the public facility page shows the admin's photos (first one large, each opens full
  size), email and website.
- Changed: Settings › Facility profile shows real photo thumbnails (the first marked as cover),
  the level of care, and a "View public page" link once live (`VITE_PATIENT_WEB_URL`).

### Facility onboarding: map pin, government identifiers, photos (2026-11-03)

- Added: `@medilink/ui/map-picker` (`LocationPicker`): tap or drag one pin on a Leaflet map.
- Changed: the application wizard's location step requires the map pin: use my location, tap the
  map at the entrance, or type latitude and longitude (checked to be inside Rwanda).
- Added: the facility step asks for the MoH facility code (FOSA ID) and the 9-digit TIN
  (optional); the documents step takes up to 6 facility photos; the review step lists them.
- Changed: the super admin's application review shows every field: level of care, government
  identifiers, map pin (opens OpenStreetMap), applicant phone, language, agreements and NCSA;
  type and ownership as words. The facility page shows and edits the identifiers (step-up).
- Fixed: the location coordinates text used `lng` as an i18next value, which i18next reads as
  the language and fails on.

### Upgrade U2 · Pharmacist (upgrade 05 §4)

- Added: Pharmacy counter on Today (numbers and the next prescriptions to give), Dispensing
  history (`/pharmacy/history`: today, 7 or 30 days, only mine, search) and Verify a prescription
  from another facility (`/pharmacy/verify`: code, then the medicines with the date of birth).

### Upgrade U2 · Reception (upgrade 05 §2)

- Added: Reception Today (desk bar, flow, today's numbers, check-in by code, arrivals to confirm,
  next arrivals); check-in by booking code on Today and the board.
- Changed: the board shows the patient's words and Danger sign / Not paid / Insurance to verify /
  No phone chips, "Raise to emergency" with a reason, "I'm here" claims above Expected, and intake
  done or missing on each expected booking.
- Added: insurance card photos (front and back) with verify or reject on the patient record,
  and "Check insurance" from the board; `?tab=` opens a record tab.
- Added: contact person for a patient without a phone (FR-PAT-18) on the record; printed ticket
  slip (`/queue/visits/:visitId/slip`) and appointment card (`/bookings/card/:code`), 80 mm,
  from check-in, the ticket panel and phone booking (upgrade 08 §3).

### Facility onboarding: staff contact details (2026-11-03)

- Added: staff-web **My details** (`/account`, from the user menu): my name, work phone and
  language (also switches the app language).
- Changed: the invite dialog takes optional names and work phone; the invitation list shows the
  name; the member panel shows email and phone as links. The invitation accept page prefills
  the name the inviter gave (for a new facility, the application's proposed admin).
- Added: `api.staffAuth.updateMe()`, `phone` on `StaffMe` and `StaffMembership`, `full_name` and
  `phone` on `Invitation`, `suggested_name` on `InvitationLookup`, and the matching mocks.

### AI symptom assistant, test phase (issue #159)

- Added: `/assistant`, a chat where the person describes symptoms in their own words. It asks
  yes/no follow-ups (Yes · No · I am not sure buttons), then may name a possible cause, says how
  soon to see a doctor, and lists facilities for the suggested service; red flags show the 912
  card. A test-phase and privacy notice comes first (do not type a name or ID); Kinyarwanda is
  marked experimental. Linked from Check symptoms.
- Added: `api.triage.assistant()` with `AssistantTurn` types, the `assistant_unavailable` error
  code and a scripted MSW mock.
- Added: a floating "AI assistant" button on every public page and in the patient dashboard
  (above the phone tab bar). It opens the same chat in a side panel, full screen on phones; the
  conversation carries across pages and continues on `/assistant`, where the button is hidden.
  Following a facility from the answer closes the panel; in the dashboard it opens the in-app
  page.

### Upgrade U2 · Doctor tools (upgrade 05 §3)

- Added: Pharmacy questions `/clinical/questions`: questions on my prescriptions, answered in
  one step (a signed note on the record).
- Added: Follow-ups `/clinical/follow-ups`: missed, today, next 14 days and came back.
- Added: My activity `/clinical/activity` and Templates `/clinical/templates` under a new
  "My practice" menu section; in the consultation, "Use a template" fills empty sections, adds
  provisional diagnoses and the usual medicines, and "Save as template" keeps the current note.
- Added: My doctor profile in the user menu: licence plus a public bio in rw/en/fr, languages
  and visibility; public doctor pages show specialty, bio and languages.

### Upgrade U12 · Patient dashboard (upgrade 12)

- Changed: every signed-in patient page moves under `/dashboard` (`app/paths.ts`); the old
  addresses (`/home`, `/visits`, `/records`, `/medicines`, `/documents`, `/family`, `/profile`,
  `/privacy/settings`, `/claim`, `/notifications`, `/support`, `/settings`, `/book`) redirect with
  the rest of the path and the query. Sign-in and email verification land on `/dashboard`.
- Changed: new patient shell: fixed sidebar from 1024 px (collapsible, remembered), icon rail on
  tablets, compact header with a five-tab bar and a More drawer on phones; top bar with
  breadcrumb, profile switcher, search, notification menu, language and account menu; toasts.
- Added: global search (Ctrl/Cmd + K or `/`) over pages, own appointments and documents, public
  facilities and doctors; the bell opens the five latest notifications with "Mark all as read".
- Added: overview with the active journey (live ticket, next appointment or welcome), quick
  actions, upcoming appointments, recent activity, reminders from real booking and queue data,
  family and the emergency notice.
- Added: My appointments (Upcoming, Past, Cancelled) and appointment detail with reschedule
  (held time with countdown, confirmed by the server) and cancel; My queue with ticket cards.
- Changed: records, medications, documents, family, settings and help use the shared dashboard
  surfaces (`features/dashboard/kit.tsx`); records gain search; documents gain a type switch;
  family members get a "whose profile" banner; settings is sectioned.
- Changed: Find care and facility pages render inside the shell at `/dashboard/find-care`,
  `/dashboard/facilities` and `/dashboard/facilities/:slug` (`InDashboardContext`).
- Removed: the home-page feature slots (`homeTop`, `homeMain`, `homeCards`) and their cards.
- Changed (redesign 2026-11-02): the patient sidebar and top bar follow the staff shell (identity
  card, Care / Account sections, icon-tile items with an accent bar, Help and collapse at the
  foot; centred search, theme switch, alerts, account menu with the language).
- Changed: the signed-in app uses a calmer type scale (`data-surface="app"` in `tokens.css`: body
  16 px, targets 44 px); public pages keep patient density.
- Changed: overview rebuilt from real data only: the journey beside "Needs your attention", four
  counts at a glance, upcoming appointments, recent visits, latest measurements (as recorded,
  never judged), current medicines and family (`WidgetCard`, `StatCard`). Recent activity and the
  quick-action tiles are gone (the bell and the sidebar cover them).
- Changed: Find care in the dashboard has one search card with quick filters; `FacilityRow`
  columns follow the list's width (container query); the facility page has a Today strip and a
  location card; the booking flow has a labelled stepper and a "Your booking" summary.
- Changed: public header (segmented nav, live emergency pill, theme switch; How it works moved to
  the footer), footer (call-to-action card, tap-to-call 912, all site links) and the sign-in shell
  (split screen with the brand panel).
- Added: `ThemeSwitch` (`@medilink/ui`, `outline` / `ghost`) and `LanguageSwitcher` `pill`.

### Upgrade U2 · Doctor workspace (upgrade 05 §3)

- Added: Doctor Today: my day in numbers, the patient in the room with Open record, and what
  waits for me (overdue records, pharmacy questions, results, records to sign, follow-ups).
- Added: Results inbox `/clinical/results`: outside results assigned to me, opened through a
  5-minute link, marked reviewed with a comment.
- Changed: My queue opens the record directly and can finish and call next in one step; the
  consultation opens with why the patient came, uses icon section cards, a glass action bar,
  diagnosis chips and a "signed, back to my queue" callout; vitals are tiles with red, named
  flags; patient history shows a four-card summary, paper records and scans, and a card
  timeline; unsigned records are a table.

### Upgrade U2 · Facility admin command centre (upgrade 05 §5)

- Changed: the facility admin's Today is a command centre: four live KPIs (patients, median
  wait, no-show rate, collected today), queue load by service, needs your attention (licence,
  approvals, cash shifts, queue moves, unsigned records, disputes, two-step sign-in, invitations;
  urgent first), bookings today, money today and the team on duty.
- Added: Approvals has a Cash shifts tab (`/approvals?tab=shifts`): expected against counted per
  method, the gap, the cashier's note, and accept with step-up (a note is needed when the drawer
  does not balance). `api.billing.shifts()` and `api.billing.reviewShift()` with mocks.
- Changed: Staff shows coverage bars for attestation and two-step sign-in, a warning when active
  members lack a second factor, and a Last active column. `StatTile` takes a `caption`.

### Upgrade U2 · Public website (upgrade 11)

- Added: every public route of the brief: `/find-care`, `/facilities`, `/facilities/:slug`,
  `/doctors`, `/doctors/:slug`, `/services`, `/services/:slug`, `/how-it-works`, `/emergency`,
  `/help`, `/about`, `/contact`, `/privacy`, `/terms`, `/accessibility` (new `site` feature with
  locales in rw, en and fr; Kinyarwanda and French are drafts for native review). `/care` and
  `/search` redirect to `/find-care`.
- Changed: home follows the brief (hero with a custom SVG illustration, search, facilities near
  you with list and map, emergency access, how it works, sign-in band, final call). Navbar: Home ·
  Find Care · Facilities · Doctors · Services · How It Works with a sliding indicator, Emergency,
  language, Sign In and a Find Care button; 80 px; a slide-down menu under 1024 px that locks the
  page. Footer: deep forest with Explore, Information and Legal columns.
- Changed: facility profile with a Today panel (hours, live wait, queue and booking, insurers,
  hospital note), tabs (Overview, Services, Doctors, Insurance, Hours & Location with a map) and
  What to bring; the primary action follows real availability.
- Changed: light palette from the brief (forest `#123D2B`, emerald `#168451`, link `#11744A`,
  text `#17231D`, page `#F7F9F7`, light green `#EDF5EF`); token tests updated.
- Added: shared public kit (`PageContainer`, `PageHeader`, `Breadcrumbs`, `SearchBar`,
  `LocationSelector`, `FacilityStatus`, `WaitingTime`, `InsuranceList`, `LinkRow`, `Faq`,
  `EmptyState` with an illustration, `LoadingRows`, `ErrorState`), the `help.public.contact` API
  call with a development mock, and pre-rendering of how-it-works, about, privacy, terms and
  accessibility. Pre-rendered facility snapshots no longer carry live waits.
- Known gaps (upgrade 11 §13): doctors come from facility profiles (no directory endpoint yet);
  the emergency filter and list show hospitals; `POST /public/contact/` is not on the API yet.

### Upgrade U2 · Soft public look

- Changed: public pages use `.ml-soft`: wide, diffuse shadows tinted toward the brand green (a
  dark-theme variant too) and a faint emerald light at the top of the page. Cards and the list
  are 24 px round, the hero is a forest gradient with a pill search bar, filters and the main
  buttons are pills, hairlines are lighter and sections have more space. `Button` gains `pill`.

### Upgrade U2 · Header and page transitions

- Changed: the public header is sticky (64 px) and lifts with a shadow once the page scrolls
  (scroll-driven animation where supported). A pill slides between Find care, Check symptoms and
  For facilities under the pointer or focus and rests on the current page. Emergency · 912 is a red
  pill; Sign in is a primary pill. On phones the links open in a panel (Escape and navigation
  close it).
- Added: page changes from header, footer and list links cross-fade with view transitions while
  the header stays still (no animation where unsupported or with reduced motion); a thin emerald
  bar shows while the next page loads.

### Upgrade U2 · Sign-in and sign-up shell

- Changed: log in, sign up, check email, forgot and reset password and email verification use one
  `AuthLayout`: a full-height deep-forest band (Imigongo pattern, soft emerald light), a centred
  card that rises in with the MediLink mark and a centred title, a two-bar step indicator on sign-up,
  and "Continue without an account" under the card. Top bar: logo, Emergency · 912, language. Form
  logic, validation, error summaries and consent are unchanged.

### Upgrade U2 · Public pages polish and motion (upgrade 02 §2–6)

- Changed: the home hero is a deep-forest band (Imigongo at 6 %) holding the search, chips and
  filters, with a "Right now" ticket stub of live facts (places open, people waiting, shortest
  wait) and a heartbeat line; numbers show dashes until the data arrives. Filters are compact
  pills; service tiles, alerts, verify and for-facilities blocks share one card style.
- Changed: the footer has three link groups (Care, MediLink, Trust), one emergency line, the
  language switch and copyright, on a hairline instead of the boxed notice.
- Added: motion tokens (`ease-out-quint`, `animate-enter`, `animate-rise`, `animate-fade`) and
  `.ml-stagger`; dialogs and the map card rise in; list rows ease on hover and show the selected
  place with an emerald edge; a changed live wait glows once; the list dims while new results load.
  All of it is off with reduced motion or data saver.

### Upgrade U2 · Find care `/care` (upgrade 03 §3)

- Added: `/care` with the same list and map at full width and every filter in a panel (a dialog
  on phones): service, insurance, district, type, level of care (Mutuelle transfer hint), open
  now, free time today, join remotely, distance after Near me. Active filters are removable chips
  with "Clear all" and the count; choices live in the URL, never the location. No results: one
  line, the nearest place offering the service, and Clear all.
- Changed: `/search` and `/find-care` redirect to `/care`; links, the header and the patient menu
  point there. The "how to get care" explainer page (with a "Coming soon" card) and the old search
  cards are removed. The list and map are one shared module (`features/booking/Places.tsx`) used
  by Home and Find care.

### Upgrade U2 · Home with list and map (U-04, upgrade 03 §1–2)

- Changed: `/` leads with "What are you feeling?" (symptom words go to the checker, service words
  filter), chips, district · insurance · type · open now · Near me, then the live list
  (`FacilityRow`) with a map (`@medilink/ui/map`, Leaflet, lazy) beside it on desktop and a
  List | Map toggle on phones; sort soonest seen · nearest · A–Z. Then Emergency 24h, By service,
  Recent places, alerts (install, turn on alerts), Verify a document and For facilities. The hero,
  how-it-works, trust, tracker, records and FAQ sections are removed.
- Changed: public header is Find care · Check symptoms · For facilities · language · Sign in, with
  "Emergency · 912" always visible.
- Added: `VITE_MAP_TILES_URL` (tile origin added to `img-src`; provider is open decision OD-3,
  OpenStreetMap default for development only). District and insurer choice and recent places are
  remembered on the device through the UI preferences store.

### Upgrade U2 · No prices in discovery or booking (U-01, contract sprint-05 D-14)

- Changed: search results, facility services, the booking flow and booking cards no longer show a
  fee or patient share; the review keeps the "insurer not accepted" warning. API types and mocks
  follow the contract; the unused `rwf` helper and price strings are removed.

### Remediation R8 · UI kit, charts, pre-rendering and Playwright (#91)

- ui: violet queue tokens (`#6D28D9` on `#F5F3FF`; priority solid, 7.10:1) and `Badge`
  `variant` (`tint`, `outline`, `solid`): on hold violet tint, priority violet solid, no response
  and left red outline, completed slate (design 02 §4). Badges wrap in narrow containers.
- ui: sequential emerald ramp per design 02 §6 (4 steps, light and dark); charts draw up to six
  series, have a keyboard readout (arrow keys, Home, End, Escape), a visible "Show table" toggle
  and caption-size axis text; `LoadMeter` shows a gauge icon. New `CHART_SERIES`,
  `SEQUENTIAL_STEPS`, `badgeToneClassName` exports.
- ui: `DataTable` search input id from `useId`, column `meta.align` / `meta.label`, 16 px cell
  padding (design 08). Staff sidebar collapses to 4rem (`--spacing-sidebar-collapsed`).
- staff-web: the live indicator turns yellow ("Reconnecting") once data is older than 30 s, also
  with the socket open (pongs and successful queue fetches count as fresh); only the header badge
  announces, and only state changes.
- patient-web: `/`, `/for-facilities` and `/facilities/<slug>` are pre-rendered at build time with
  `vite-prerender-plugin` 0.5.14 ([ADR 0008](../docs/decisions/0008-prerender-public-pages.md)).
  Static pages hydrate; facility snapshots hold no fees, queue load or next times. The service
  worker falls back to `app-shell.html`. `scripts/check-prerender.mjs` runs after every build
  (pages present, public data only, no email or national ID).
- Playwright (`@playwright/test` 1.64.1): `pnpm e2e` runs the S4 walk-in journey (check-in, call,
  complete) and the pre-rendered pages' checks against the mock builds; new `e2e` CI job.
- HeroIllustration uses brand tokens; a workspace test forbids raw hex colours in components.

### Sprint 7b · Documents (frontend, #123)

- staff-web consultation: a Letters and requests section (referral letter, lab request, sick note)
  signed with the consultation, or at once after it; the visit's documents with Download.
- staff-web patient record: a Documents tab; clinicians download, reception and the pharmacy print.
- patient-web `/documents` and a Home card: my documents with Download, a ZIP of all of them, the
  verification code, and share links shown once that can be stopped.
- patient-web public `/verify` (replaces the placeholder) and `/verify/:code`: genuine or not, then
  the content after the patient's date of birth; `/shared/:token` opens a shared document.

### Sprint 7a · Pharmacy (frontend, #123)

- staff-web consultation: a Prescription section (anchor) to add medicines from the catalogue with
  "Not in stock here", dose, how often, route, days and the calculated quantity; S6 alerts sit on
  the item and an allergy needs a reason before Sign. After signing, items are read-only with
  Change (cancel + new item, step-up) and Cancel with a reason.
- staff-web `/pharmacy`: the queue in three tabs (Ready, Partly given, Questions) with search by
  name, prescription number or ticket and flags; `/pharmacy/prescriptions/:id` confirms who is at the counter
  first, then an outcome per item (give all, part, a same-ingredient substitute with a reason, not
  available), the controlled-medicine confirmation and one signature; a question to the doctor;
  `/pharmacy/prescriptions/:id/labels` prints 62 mm dosing labels (Kinyarwanda by default);
  `/pharmacy/availability` switches stock on and off.
- Follow-ups (#134): the doctor answers a pharmacist's question on the consultation's Prescription
  section with a new or an existing addendum (PQ3); a substitute can cover part of what is left;
  substitutes are looked up by the item's generic name and strength.
- patient-web `/medicines` and a Home card: active and past prescriptions with plain-language
  states ("Ready at the pharmacy", "Partly given: 10 of 21", "Not available here: buy outside
  before …") and the prescription code to show at any pharmacy.
- api-client `pharmacy` module and MSW mocks for §3.1–3.2 (409, 422, step-up, issue on sign);
  `pharmacy` and `medicines` namespaces in rw/en/fr.

### Public pages and symptom checker (contract public-pages-and-triage, #131)

- Home: "Care near you" asks for the location in a card (or a district), then shows the six nearest
  verified facilities with open status, the live queue (people waiting and the wait range) and the
  insurers they accept. The location stays in memory and goes in the POST body only. The hero links
  to the symptom checker.
- Facility page: "Queue right now" per service (counts and a wait range, never a person) and a
  "Book" button per doctor that opens the booking flow with that doctor chosen ("Any doctor" undoes
  it).
- `/check-symptoms`: danger signs first (straight to 912 and the emergency page), then who it is
  for, what they feel and how long; the answer is an urgency, the kind of care and a search for
  places nearby. It says the rules are not yet signed off and that it is guidance, not a diagnosis.
- New `/about` and `/emergency`; `/privacy` and `/terms` are rewritten as plain drafts. Facts not yet
  confirmed (operator, address, contacts, retention) show a visible "To confirm" tag. The footer
  links About, Check symptoms and Emergency.
- api-client: `triage` feature and mock (the backend rules ported), `waiting`, `wait_range` and
  `insurers` on search results.

### Redesign · Patient app (#129)

- patient-web: on phones the four destinations are a real bottom tab bar (the header's backdrop
  blur had pinned the "fixed" bar under the header); tablets and up keep them in the header. The
  header stays one row on phones (language moves to Settings; the profile switcher drops its badge).
- Home: the live ticket leads as a deep-forest card (notched ticket, people ahead, wait, "leave home
  by" in the attention tint); the alerts prompt moves below; find care is a search field on the
  forest card with "Not sure? Describe your symptoms" beside it; account shortcuts are one list.
- Tracker: the large notched ticket; the page no longer shows "Home" twice at the top.

### Redesign · Facility admin and card polish (#127)

- staff-web Today (facility admin): the patient-flow strip and a plain-language callout of the slow
  step ("Waiting for a doctor is the slow step right now. 8 people, up to 31 min.") above the
  figures; "Needs your attention" items are tinted rows.
- Every card in staff-web and patient-web lifts with `shadow-card` instead of a hard border, and
  coloured side-bar accents are gone: `Alert`, the leave card, platform overview tiles and the
  emergency notices use tinted surfaces.
- Fixed: the operations card showed the raw key `queue.ops.liveSummary` (the plural needed
  `count`); the platform menu says "Facility applications" like the page.
- Test: "moves an expected booking" no longer depends on the weekday.

### Redesign · Doctor (#124)

- staff-web My queue: the patient in the room is the focal card (large ticket stub, name, state,
  actions behind a quiet divider); the duty switch is a segmented control with a coloured dot for
  the current state and the room picker beside it; with nobody in the room, Call next sits on the
  deep-forest band and names who is next; Up next uses ticket stubs (emergency red, next ochre).

### Redesign · Front desk (#121)

- staff-web queue board: a check-in bar on the deep-forest band (find a patient `/`, check in `N`,
  book by phone), the live patient-flow strip (expected, waiting, with a doctor, payment, pharmacy;
  the slowest stage over 15 minutes is highlighted), a segmented service filter, ticket stubs
  tinted by state (emergency red, next up ochre, remote not yet seen grey), skeleton loading, and
  softer Expected, remote-joiner and missed lists with compact actions.
- staff-web Today: a quiet greeting with role chips, the most-used actions as one row of pills
  (utilities like the inbox stay in their own places), and the patient flow as the focal card.
- ui: `Button` presses (scale 0.97), a softer secondary style and a new `sm` size.
- A full reload no longer flashes every queue row as "changed".

### Redesign · Foundation (#119)

- Design system: neutrals lean toward the forest green (re-measured, WCAG AA in both themes); new
  ochre `attention-*` tokens for "your turn" and work waiting for someone; cards lift with
  `shadow-card` instead of a border. Recorded in `.interface-design/system.md`.
- ui: `TicketNumber` gains the notched `stub` variant with `brand`, `attention`, `danger` and
  `neutral` tones; new `FlowStrip` (patient flow by stage, bottleneck highlighted).
- staff-web: the sidebar sits on the page colour and groups daily work, "Manage", the MediLink
  platform and help; only permitted sections with a built page appear (no placeholder dead ends,
  also in the command palette and Today shortcuts). `/platform/facilities` is labelled
  "Facilities" (it was "Facility applications", a duplicate).
- staff-web: a platform admin without a facility starts on the platform overview; one `homePath`
  rule serves login, the facility picker and `/`.
- staff-web: a facility page outside the person's role says "You don't have access to this page"
  instead of "Page not found"; platform pages stay hidden from facility staff (S1 §6.1).
- Mocks: one cast for Kigali Clinic (Dr Uwimana Keza, Dr Niyonsenga Paul) across booking, setup
  and queue; "open now" follows the mock opening hours instead of always being true.

### Remediation R1 · Security core (#83)

- patient-web: sign-up shows "check your email" for every request (no account enumeration) and the
  new `/verify-email` page confirms the emailed link and signs in. api-client:
  `patientAuth.register` returns `{detail}` (`202`), new `patientAuth.verifyEmail`; mocks follow
  (`MOCK_VERIFY_TOKEN`).
- CSP: `style-src` keeps `'unsafe-inline'` (Radix scroll lock and pdf.js inject `<style>` at
  runtime; a static-host meta CSP can't carry a nonce), documented in `@medilink/config`.

### Sprint 1 · Platform and onboarding

- api-client: `masterData`, `onboarding`, `security` and `uploads` modules (XHR uploads with
  progress, fetch fallback); `StaffMe.feature_flags` and `security`; `session_locked` error code;
  a `headers` request option for `Idempotency-Key`. MSW mocks for every S1 endpoint (uploads clean
  after two polls, `eicar` infected, 10 MB limit, mock PIN `4826`, `mock-resume-token`).
- ui: DataTable (server sorting and pagination, `aria-sort`, filter chips, densities remembered,
  states, card list under 640 px), SidePanel, Dialog and ConfirmDialog, Tabs, SwitchField,
  TextareaField, Stepper, FileUpload, DocumentViewer (images and lazily loaded pdf.js) and Timeline.
- staff-web `lock`: idle lock after `lock_after_seconds` with a 60 s warning, lock screen (PIN or
  password, attempts left, switch user, cross-tab sync, shown alone on reload), step-up dialog
  that retries the action once, `/account/security` (PIN), Lock and Security in the user menu.
- patient-web `facilityApplication`: `/for-facilities`, start form, five-step wizard with
  autosave, location cascade, document uploads with scan status, reviewer feedback, "continue
  later", resume links and the submitted page.
- staff-web `platform`: overview, applications pipeline and review (documents, verdicts, notes,
  history, request changes, approve, reject), facilities (status actions with reasons, licences,
  history, feature flags), master data (tables, rw/en/fr editor, retire and restore, history, CSV
  import preview and confirm) and feature flags. Navigation entries for platform admins only.
- Dependencies: Radix dialog, tabs and switch; `@tanstack/react-table` 8; `pdfjs-dist` 6.

### Sprint 3 · Patients and identity

- api-client: `createPatientsApi` (staff ST1–ST27, platform PL1–PL5) and `createProfileApi`
  (patient PA1–PA26) with the contract types, `hasPermission()`, and the S3 permission codes added
  to `PermissionCodes`. MSW mocks share a synthetic store: 26+ patients, the duplicate pair, a
  staff member as patient, an open reception claim, and a mock account with a child and a
  delegated parent.
- ui: `PersonSearch` (type detection, listbox keyboard navigation, `/` shortcut), `MaskedValue`
  (re-masks after 30 s and on unmount), `ProfileSwitcher`, `CameraCapture` (file fallback),
  `PhoneField` with `toE164()` and `formatPhone()`.
- staff-web `patients`:
  - `/patients`: search, results, and the external match with add-existing.
  - `/patients/register`: walk-in form with live duplicate suggestions and the MediLink number on
    success. The form is exported for S4.
  - `/patients/:fpId`: details, identifiers with reveal-with-reason, insurance verify/reject, the
    health profile by role, consents and claim confirmation, report duplicate.
  - `/patients/merge-requests` and `/platform/merge-requests`: comparison panel, step-up on
    approve and undo.
- patient-web `profile`:
  - `/profile` hub: completion checklist and next step.
  - Profile pages: details, identity documents, insurance, health, access history.
  - `/family`: dependents, one-time sharing codes, accept, revoke.
  - `/privacy/settings`: consents.
  - `/claim`: claim wizard.
  - `ProfileSwitcher` in the header; "My profile" and "Family" links on home.
- Translations: `patients` and `profile` namespaces in rw/en/fr (Kinyarwanda flagged for native
  review).
- R2 fixes ([#84](https://github.com/B-Pine/medilink-rwanda/issues/84)):
  - patient-web access history loads older entries page by page ("Show older entries", PA24).
  - The claim wizard polls the claim (PA20) every 10 s while it waits for reception, shows the
    confirmation, and offers a fresh start when a claim fails or expires.
  - Mocks follow the real API: strict request bodies (`Unknown field.`) and a required `version`
    on PA3; consent kind, version and scope rules (PA22/PA23) and the latest care consent
    decides; shortened holder names and `can_revoke` as `revoke()` allows; dependents replay on
    `Idempotency-Key`, record their consent, check age and the 10-profile limit; the 5th wrong
    claim code and expired claims have their own messages; walk-in care consent carries the
    `patient_id`; reception confirmation moves the claimant's `self` link.

### Sprint 9 · Notifications

- api-client `notifications`: inboxes, preferences, push subscriptions, announcements, templates
  and delivery log, with MSW mocks for every contract §3.3 endpoint (CSRF, sessions, permission,
  error envelopes, push allowlist, 409) and `notification.created` / `notification.read` on both
  sockets.
- staff-web `notifications`: header bell (count with 99+, latest 10, Mark all as read, other
  facilities' count, live across tabs, 60 s polling while the socket is down); inbox with
  All/Unread; settings (sound off by default with a test sound, digest, version conflicts keep
  the input); facility announcement composer (audiences, dates, priority, rw/en/fr with counters
  and a missing-language warning, preview, draft, publish and withdraw with confirmation) behind
  `announcements.manage`; platform announcements for super admins.
- patient-web `notifications`: header bell, inbox with 18 px cards and the "About <name>" chip
  for dependents, detail page that marks read; settings (language, channels per level with
  in-app always on, quiet hours 21:00–06:00, dependents, locked critical level, browsers);
  `PushOptIn` (asks only on a button press, reason first; denied, unsupported and
  iOS-not-installed states; re-syncs on start; Turn off unsubscribes) and the push-off banner on
  Home and the inbox (Not now hides it for 7 days); `public/push-sw.js` push and click handlers
  (critical notifications stay on screen; clicks open only same-origin `/notifications` paths;
  no requests, no caching).
- ui: `CountBadge`, `Switch` and `useWakeLock`.
- A new announcement shows "Draft saved" or "Published" only on its own page, after the move
  from `/new`, so nothing is clicked on the page being replaced.

### Sprint 2 · Facility setup and staff

- Fixes from the S0–S5 audit (R3, #85): go-live sends the checklist's `status_version`; the
  invitation page accepts an existing account only when signed in (`acceptInvitation(token)` →
  `StaffMe`, new accounts use `acceptNewAccount`); staff, invitation and template lists read
  every page of the now paginated API; the MSW mocks paginate, check the go-live version and
  replay invitation `Idempotency-Key`s.
- api-client `setup` ([#69](https://github.com/B-Pine/medilink-rwanda/pull/69)): profile,
  catalogue, schedules, billing setup, team and invitation endpoints with MSW mocks.
- ui: `WeekGrid` (sessions to scale, leave hatched, list view alternative), `TimeRangeField`,
  `MoneyField` and `formatRwf`.
- staff-web `setup`: `/setup` checklist with go-live behind step-up; `/settings` (profile,
  services and rooms, hours with closures and a 4-week preview, rules generated from the section
  schema, change history); doctor schedules with licence and cross-facility warnings, leave
  approval and `/schedule/mine`; tariffs and insurer rules; staff invitations, roles, licence
  attestation, MFA reset and deactivation; `/profile/clinician`; `/invite/:token`.
- Today dashboard (design 04 §3) with feature cards (`FeatureRoutes.todayCards`); landing
  sections (tracker showcase, records, trust points, FAQ).

### Sprint 4 · Visits and the live queue

- staff-web `queue` ([#74](https://github.com/B-Pine/medilink-rwanda/pull/74)): reception board
  `/queue` (service chips, Now serving, On site in calling order with flags, side panel actions
  with reasons, `N` check-in with the S3 walk-in form); doctor's My queue (duty status, Call next
  on Space, current patient actions); queue reviews; display links with a QR code; waiting-room
  display `/display/:token` (numbers and rooms, never names; highlight and chime; reduced
  motion); one socket per tab with notify-then-fetch, live badge and an offline action queue
  (FR-QUE-16); Today "On site now" card.
- patient-web `tracker`: `/visits/:id` live tracker (ticket, progress dots, wait range, leave-by
  time, stages, full-screen call with sound and vibration, wake lock, last known state offline)
  and a home card.
- ui: `TicketNumber`, `QueueStateBadge`, `QueueFlagChip`, `ProgressDots`.

### Sprint 5a · Booking

- patient-web `booking` ([#80](https://github.com/B-Pine/medilink-rwanda/pull/80)): facility
  search with filters and the patient share by insurer, facility pages, the one-decision-per-screen
  booking flow (who, what, when with hold timer and alternatives, reason, review) or joining
  today's queue, upcoming visits with cancel and `.ics`; the landing search opens the results.
- staff-web: the board's Expected list shows today's bookings with symptoms, booked check-in,
  Late badges and a New time action; Missed today lists no-shows with a reasoned undo; phone
  booking (`bookings` feature: side panel from the board, `/bookings/new` and the command
  palette; find or register the patient, 7-day slot grid with doctor filter, hold countdown,
  symptoms, contact phone, booking code).
- ui: shared `SymptomPicker` (red-flag chips named for screen readers); `PatientPicker` shared by
  check-in and phone booking.
- api-client: booking module and mocks; `staff.reschedule()`, `NO_SHOW_REVERSAL_REASONS`; mocks
  honour the slots `date` and enforce the reversal rules.
- S0–S5 audit, R5 ([#87](https://github.com/B-Pine/medilink-rwanda/issues/87)), following the
  2026-10-31 decisions (S5 D-10):
  - Remote joiners: the tracker shows "I'm here", which only tells reception the patient says
    they arrived, and a pass-over warning near the front. The board lists remote joiners not yet
    confirmed (those who tapped "I'm here" first) with Confirm arrival, also in the ticket panel.
  - A booked patient checked in after the grace window is queued as a walk-in: the board says so
    and offers a new time. Ticket rows show the booked slot time, "Late: walk-in" and remote
    status.
  - Booking flow: the step, person and service are in the URL, so browser Back and refresh keep
    the place; symptoms and the reason never go in the URL.
  - Board: `/` opens the check-in search, shortcuts are ignored while a dialog is open, and
    changed rows highlight briefly (design 04 §5).
  - Tracker: one AudioContext per call alert, closed when it ends.
  - ui: shared `formatTime`, `formatDate`, `formatMoney`, `kigaliDate`, `kigaliHour` (24-hour,
    Africa/Kigali) replace ad-hoc formatters.
  - api-client, matching R4 ([#102](https://github.com/B-Pine/medilink-rwanda/pull/102)): field
    names `is_remote`, `remote_arrival_claimed_at`, `remote_arrival_confirmed_at`,
    `slot_starts_at`, `late`; flags `late`, `remote`, `remote_claimed`;
    `queue.confirmArrival(ticket)` (ticket action `confirm-arrival` with `version`);
    `booking.arrived(visitId, version)`; optional `symptoms` at check-in and remote join; the
    booking review uses the server's `insurer_share_rwf`. Mocks: remote join, "I'm here", confirm arrival,
    `calendar.ics`, Idempotency-Key replay for bookings, reschedule checks in the backend's
    order, and a delegate gets `403` on remote join and "I'm here".

### Sprint 10 · Help center and support (part 1)

- api-client `help`: articles (public, staff, platform), support requests (patient, staff,
  platform triage, replies and closing), `pickText()` (UI language, then rw → en → fr) and
  `articleBlocks()` (plain text to paragraphs and lists); MSW mocks for every contract §3.2
  endpoint (sessions, CSRF, `support.view_facility`, the open limit, clinical words, the state
  machine, 409 and step-up on publish).
- patient-web: the Help tab's `[S10]` block replaces the static questions with searchable articles
  (category chips, fallback-language note) and a "Still need help?" card; article pages render
  text only, never HTML; Contact support with topic cards where "My health or treatment" sends
  nothing and points to the facility; My requests and the thread (reply, close, open a new one).
- staff-web: Help and support (Guides, My requests, Facility requests with
  `support.view_facility`, read-only colleague view, the "facility admin can see this" notice);
  the platform support queue (status tabs, filters, search) and request page (details, triage
  with assign to me, reply, close with a reason); the help article editor (rw/en/fr tabs with
  counters, missing languages, preview, save, publish with step-up, unpublish).

### Sprint 5b · Disruptions, follow-ups and the calendar feed

- staff-web `bookings`: reception calendar (week and day, doctor filter; doctors see their own),
  disruption wizard (who or what, period and reason, affected bookings, one action for all or per
  booking, patient answers) and the follow-up action on My queue.
- patient-web `booking`: the "Your booking has changed" offer on My visits (keep the new time,
  choose another time, cancel; auto-accept deadline explained) and the private calendar feed
  card (link shown once, `webcal:` link, turn off to revoke).
- api-client booking module and mocks for disruptions, offers, follow-ups and the feed.

### Sprint 6a · Clinical record

- staff-web `clinical`: consultation page on one scroll with section anchors, an always-visible
  autosave status (409 reloads with a conflict note), a permanent allergy banner, private notes
  marked "Never shown to the patient", ICD-10 type-ahead in plain language with primary and
  certainty (a sensitive code suggests a restricted record), sign and lock behind step-up,
  addenda and entered-in-error; vitals panel with plausible ranges; history drawer and page with
  filters and the problem summary; reason-for-access prompt; Unsigned records list; nav and
  command palette entries by permission.
- patient-web `records`: my and my dependants' signed records in plain language, a Home card,
  never private notes or examination.
- api-client `clinical` module and MSW mocks; ui `AllergyBanner`, `AutosaveStatus`,
  `SectionAnchors`.

### Design v2

- patient-web app shell (design 07 §2): one header with profile switcher, language and account
  menu; Home / Find care / My visits / Help as a bottom bar on phones; offline banner; Home,
  Find care, My visits, Help and Settings (text size Normal / Large / Extra large, theme).
- Chart kit in ui (`Sparkline`, `StatTile`, `TrendChart`, `HeatMap`, `LoadMeter`, each with a
  screen-reader table); "Operations today" on Today and a `/reports` page for facility admins.
- Platform overview with the applications pipeline and facilities by district; hero
  illustration on the public home.

### Fixed

- Kinyarwanda day and month names in every browser: Chrome has no Kinyarwanda calendar data and
  showed English names; all UI dates now go through `dateFormat()` in `@medilink/ui/i18n`.
- Tests: React 19 builds `new FormData(form)` on submit; the test setup's Node FormData now
  accepts a form (removes an unhandled error that failed the suite).

## [0.1.0] - 2026-10-17

Sprint 0 (Foundations), built against MSW mocks of the
[Sprint 0 contract](../docs/architecture/03-sprint-0-contract.md). Requires API `/api/v1` 0.1.0.

### Added

- pnpm workspace (`apps/*`, `packages/*`) with shared TypeScript (strict), ESLint and Prettier
  configuration; scripts `dev`, `dev:mock`, `build`, `build:mock`, `test`, `lint`, `typecheck`,
  `format`, `icons`, `i18n:review`, `generate-types`.
- `@medilink/ui`: design tokens from design research 02 (light and dark, system preference plus
  `data-theme` override), staff and patient density, Tailwind CSS v4 theme on the tokens,
  self-hosted Figtree and Inter, focus ring and reduced-motion base styles, and the components
  Button, Field, TextField, PasswordField, CheckboxField, SelectField, ErrorSummary, Alert, Badge,
  Card, Spinner, Skeleton, Logo, LanguageSwitcher, ThemeToggle, VisuallyHidden, SkipLink, Menu
  and an Imigongo-inspired pattern.
- i18n with i18next: Kinyarwanda (default), English and French; `<html lang>` follows the
  language; Kinyarwanda drafts listed for native-speaker review in `i18n-review.md`.
- `@medilink/api-client`: typed fetch client (credentials, CSRF bootstrap and refresh,
  `Accept-Language`, typed `ApiError`, 401 hook), typed functions for every Sprint 0 endpoint,
  `generate-types` stub for openapi-typescript.
- MSW handlers for the Sprint 0 contract, including the MFA flows and error cases, with
  documented mock accounts.
- Staff web: split-screen login, MFA setup (QR, manual key, recovery codes) and verify (code or
  recovery code), facility picker, app shell (sidebar by permissions, facility switcher,
  connection indicator, user menu with theme, language and logout), Today placeholder, section
  placeholders, password reset, 404, session route guard.
- Patient web: public landing skeleton, email-first login, sign-up with consent step, patient
  home placeholder, logout, password reset, placeholder public pages, 404, installable PWA that
  never caches `/api/`.
- Favicons, PWA icons and web logos generated from `brand/logo/source/` by `scripts/generate-icons.mjs`.
- Tests: Vitest + Testing Library + vitest-axe (flows against the mocks, accessibility on key
  pages, token values and contrast, i18n parity, security guards, lint rule).
- CI workflow `.github/workflows/ci-frontend.yml` (install, lint, format, typecheck, test, build).

### Security

- No tokens in browser storage; `dangerouslySetInnerHTML` and `innerHTML` banned by lint; no
  third-party scripts, fonts or CDNs; CSP meta tag in builds; mocks excluded from production
  builds; service worker never caches API responses; caches cleared on patient logout.

[Unreleased]: https://github.com/B-Pine/medilink-rwanda/compare/frontend-v0.1.0...HEAD
[0.1.0]: https://github.com/B-Pine/medilink-rwanda/releases/tag/frontend-v0.1.0
