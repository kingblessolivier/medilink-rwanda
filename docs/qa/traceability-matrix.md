# Requirements traceability matrix

Status: v0.1 · updated 2026-11-01 (S2, S4, S5a, S6a, S9 in progress until staging; S6b not started) · Every `FR-*` and `NFR-*` requirement in the [system analysis](../README.md), with its planned sprint, the side that implements it, how it is verified, and its status. How to keep it up to date: [QA README](README.md).

Built from the requirement tables in `docs/analysis/` (titles shortened; the analysis documents are authoritative) and the sprint plans in the [backend](../roadmap/backend.md) and [frontend](../roadmap/frontend.md) roadmaps.

## How to read it

| Column | Meaning |
|---|---|
| **Phase** | P1–P4 as in the analysis ([16 · Roadmap and phasing](../analysis/16-roadmap-and-phasing.md)) |
| **Sprint** | M1 sprint(s) from the roadmaps. The first sprint builds it; later ones extend or verify it at scale. `*` = inferred from the roadmap build lists (the requirement isn't named in a sprint's "Requirements" line; confirm in the sprint contract). `—` = later phase. |
| **Side** | Backend, Frontend, Both, or Ops (infrastructure and process outside the two codebases) |
| **Verification** | How acceptance is shown (codes below; details in the [testing strategy](../development/testing-strategy.md)) |
| **Status** | Not started · In progress · Implemented · Verified · Accepted (definitions in the [QA README](README.md) §3) |

| Code | Verification method |
|---|---|
| UT | Unit test |
| API | Backend integration test against PostgreSQL |
| AZ | Authorisation matrix test (role × own / other facility / other patient) |
| RLS | Cross-tenant and row-level security test |
| BR | Business-rule test (state machines, ordering, money, concurrency) |
| CMP | Frontend component test with axe |
| E2E | End-to-end test (Playwright) |
| CON | Contract test (OpenAPI schema vs generated types and MSW mocks) |
| PERF | Load or performance test |
| SEC | Security test or scan (CI gates, ZAP, penetration test) |
| A11Y | Manual accessibility audit (keyboard, screen readers) |
| USA | Usability test with real users (timed where the requirement has a time) |
| INS | Inspection: review of configuration, documents, outputs or evidence |
| DRL | Drill or exercise (restore test, incident tabletop, paper fallback) |

## Summary

| Prefix | Module | Total | P1 | P2 | P3 | P4 | Verified | In progress | Not started |
|---|---|---|---|---|---|---|---|---|---|
| `FR-ACC` | [Users, roles, access](../analysis/02-users-roles-and-permissions.md) | 10 | 10 | 0 | 0 | 0 | 5 | 5 | 0 |
| `FR-ONB` | [Tenancy, onboarding, master data](../analysis/03-tenancy-onboarding-and-master-data.md) | 11 | 10 | 1 | 0 | 0 | 0 | 10 | 1 |
| `FR-PAT` | [Patient identity and medical history](../analysis/04-patient-identity-and-medical-history.md) | 17 | 14 | 2 | 0 | 1 | 0 | 13 | 4 |
| `FR-SCH` | [Discovery, calendars, scheduling, booking](../analysis/05-discovery-scheduling-and-booking.md) | 18 | 15 | 3 | 0 | 0 | 0 | 16 | 2 |
| `FR-QUE` | [Visit lifecycle and live queue](../analysis/06-visit-lifecycle-and-queue.md) | 21 | 18 | 3 | 0 | 0 | 0 | 18 | 3 |
| `FR-CLN` | [Clinical record](../analysis/07-clinical-documentation-and-pharmacy.md) | 11 | 10 | 1 | 0 | 0 | 0 | 11 | 0 |
| `FR-PHA` | [Pharmacy](../analysis/07-clinical-documentation-and-pharmacy.md) | 7 | 5 | 2 | 0 | 0 | 0 | 6 | 1 |
| `FR-DOC` | [Documents](../analysis/07-clinical-documentation-and-pharmacy.md) | 7 | 7 | 0 | 0 | 0 | 0 | 7 | 0 |
| `FR-BIL` | [Billing, payments, insurance](../analysis/08-billing-payments-and-insurance.md) | 18 | 13 | 2 | 1 | 2 | 0 | 14 | 4 |
| `FR-NOT` | [Notifications](../analysis/09-notifications-and-communication.md) | 14 | 12 | 0 | 1 | 1 | 0 | 12 | 2 |
| `FR-DSP` | [Disputes, complaints, support](../analysis/10-disputes-complaints-and-support.md) | 14 | 11 | 3 | 0 | 0 | 0 | 11 | 3 |
| `FR-AI` | [AI symptom checker](../analysis/11-ai-symptom-checker.md) | 13 | 2 | 5 | 3 | 3 | 1 | 5 | 7 |
| `FR-SEC` | [Security, privacy, compliance](../analysis/12-security-privacy-and-compliance.md) | 17 | 16 | 1 | 0 | 0 | 5 | 5 | 7 |
| `FR-RPT` | [Reporting and analytics](../analysis/13-reporting-and-analytics.md) | 8 | 5 | 2 | 0 | 1 | 0 | 4 | 4 |
| `NFR-PERF` | [Performance and capacity](../analysis/14-non-functional-requirements.md) | 7 | 7 | 0 | 0 | 0 | 0 | 3 | 4 |
| `NFR-REL` | [Availability and reliability](../analysis/14-non-functional-requirements.md) | 5 | 5 | 0 | 0 | 0 | 0 | 3 | 2 |
| `NFR-NET` | [Low connectivity and devices](../analysis/14-non-functional-requirements.md) | 6 | 6 | 0 | 0 | 0 | 0 | 2 | 4 |
| `NFR-UX` | [Usability, accessibility, languages](../analysis/14-non-functional-requirements.md) | 7 | 7 | 0 | 0 | 0 | 1 | 6 | 0 |
| `NFR-OPS` | [Maintainability and operations](../analysis/14-non-functional-requirements.md) | 8 | 8 | 0 | 0 | 0 | 4 | 4 | 0 |
| `NFR-INT` | [Interoperability](../analysis/14-non-functional-requirements.md) | 3 | 1 | 0 | 2 | 0 | 0 | 0 | 3 |
| **All** | | **222** | **182** | **25** | **7** | **8** | **16** | **155** | **51** |

`NFR-INT-03` is phased "P3–P4" in the analysis and is counted under P3.

## FR-ACC · Users, roles, access

Source: [02 · Users, roles, access](../analysis/02-users-roles-and-permissions.md)

| ID | Requirement (short) | Phase | Sprint | Side | Verification | Status |
|---|---|---|---|---|---|---|
| FR-ACC-01 | Roles are permission sets; several roles per membership | P1 | S0 | Backend | AZ, API | Verified (S0, v0.1.0) |
| FR-ACC-02 | Several facility memberships; switch active facility | P1 | S0 | Both | API, E2E | Verified (S0, v0.1.0) |
| FR-ACC-03 | Six phase-1 roles with the matrix permissions | P1 | S0 | Both | AZ | Verified (S0, v0.1.0) |
| FR-ACC-04 | Staff two-factor login | P1 | S0 | Both | API, E2E | Verified (S0, v0.1.0) |
| FR-ACC-05 | Staff invitations by email, expiring, single use | P1 | S0, S2 (R3 #85) | Both | API, E2E | In progress |
| FR-ACC-06 | Deactivation removes access and ends sessions at once (also by the platform admin per facility, #198) | P1 | S0, S2 | Both | API, E2E, CMP | In progress |
| FR-ACC-07 | Clinician licence number; admin attests the check | P1 | S0, S2 | Both | API, CMP | In progress |
| FR-ACC-08 | Server-side, logged permission checks on patient data | P1 | S0 | Backend | AZ, API | Verified (S0, v0.1.0) |
| FR-ACC-09 | Super admin emergency access with reason, logged, reviewable | P1 | S6b | Both | AZ, API | In progress |
| FR-ACC-10 | New roles without changing existing roles (cashier, triage nurse and laboratory technician done; community health worker and others in P2) | P1 | U2, U8 (#200, #201) | Both | AZ, INS | In progress |

## FR-ONB · Tenancy, onboarding, master data

Source: [03 · Tenancy, onboarding, master data](../analysis/03-tenancy-onboarding-and-master-data.md)

| ID | Requirement (short) | Phase | Sprint | Side | Verification | Status |
|---|---|---|---|---|---|---|
| FR-ONB-01 | Self-registration with documents; super admin-created applications | P1 | S1 | Both | API, E2E | In progress |
| FR-ONB-02 | Verification: approve, request changes, reject, with history | P1 | S1 | Both | API, BR, E2E | In progress |
| FR-ONB-03 | Setup checklist; searchable only when Live | P1 | S1, S2* (R3 #85) | Both | API, BR, E2E | In progress |
| FR-ONB-04 | Facility configuration with change log | P1 | S2 | Both | API, E2E | In progress |
| FR-ONB-05 | Invitation adds a membership to an existing account | P1 | S2 | Backend | API | In progress |
| FR-ONB-06 | Cross-facility schedule conflict warning without details | P1 | S2 | Both | API, RLS | In progress |
| FR-ONB-07 | Suspension hides facility, keeps today running | P1 | S2 | Backend | BR, API | In progress |
| FR-ONB-08 | Licence expiry tracking and reminders | P1 | S1 | Backend | UT, API | In progress |
| FR-ONB-09 | Full facility data export | P1 | S2, S11 | Both | API, INS | In progress |
| FR-ONB-10 | Master data with versioning and translations | P1 | S1 | Both | API, E2E | In progress |
| FR-ONB-11 | Organisation with several facilities | P2 | — | Both | API, E2E | Not started |

## FR-PAT · Patient identity and medical history

Source: [04 · Patient identity and medical history](../analysis/04-patient-identity-and-medical-history.md)

| ID | Requirement (short) | Phase | Sprint | Side | Verification | Status |
|---|---|---|---|---|---|---|
| FR-PAT-01 | Account, patient and facility patient record are separate | P1 | S3; patient profile photo, seen by staff where the patient has a record (2026-11-05) | Backend | UT, API | In progress |
| FR-PAT-02 | Patient self sign-up (email/password; phone OTP in P3) | P1 | S0, S3, R1 #83 (verify-email, no enumeration); test-only switch `PATIENT_SIGNUP_EMAIL_VERIFICATION` (2026-11-05); password ≥ 8 and change password while signed in (2026-11-05); Sign in with Google and branded rw/en/fr account emails (upgrade 17, 2026-11-06, `test_google_signin.py`, `test_mail_branding.py`) | Both | API, E2E | In progress |
| FR-PAT-03 | Dependents, delegated access, profile switching | P1 | S3, U12 (dashboard: family rows, "whose profile" banner, switcher in the top bar and More drawer) | Both | AZ, E2E | In progress |
| FR-PAT-04 | Walk-in registration in under one minute | P1 | S3 | Both | API, USA | In progress |
| FR-PAT-05 | Duplicate detection; reversible merge with approval | P1 | S3 | Both | BR, API | In progress |
| FR-PAT-06 | Claim an existing record with proof | P1 | S3 | Both | API, SEC | In progress |
| FR-PAT-07 | Identifiers: national ID, passport, insurance, file no., MediLink no. | P1 | S3 | Backend | UT, API | In progress |
| FR-PAT-08 | Health profile with verified / unverified status | P1 | S3 | Both | API, CMP | In progress |
| FR-PAT-09 | History timeline, filters, problem summary, search | P1 | S3, S6* | Both | API, PERF, E2E | In progress |
| FR-PAT-10 | Legacy register import: preview, validation, duplicates, rollback | P1 | S6b | Both | BR, API, E2E | In progress (backend L1 with `test_s6b_import.py`; staff import wizard `imports.test.tsx`; staging open) |
| FR-PAT-11 | Scanned legacy records attached to patients | P1 | S6b | Both | API | In progress |
| FR-PAT-12 | Structured back-entry labelled as historical | P1 | S6b | Both | API, CMP | In progress |
| FR-PAT-13 | Patient sees own and dependents' records except private notes | P1 | S3, S6* | Both | AZ, E2E | In progress |
| FR-PAT-14 | Patient access history | P1 | S3 | Both | API, E2E | In progress |
| FR-PAT-15 | Cross-facility sharing, emergency access, revocation | P2 | — | Both | AZ, E2E | Not started |
| FR-PAT-16 | Dependent reaching majority: notification and handover | P2 | — | Both | BR | Not started |
| FR-PAT-17 | Electronic import from existing record systems | P4 | — | Backend | API | Not started |

## FR-SCH · Discovery, calendars, scheduling, booking

Source: [05 · Discovery, calendars, scheduling, booking](../analysis/05-discovery-scheduling-and-booking.md)

| ID | Requirement (short) | Phase | Sprint | Side | Verification | Status |
|---|---|---|---|---|---|---|
| FR-SCH-01 | Facility search with filters; list and map | P1 | S5 | Both | API, E2E | In progress (public audit 2026-11-07: e2e search → facility → book signed out → sign in → back on the booking, `public-pages.spec.ts`) |
| FR-SCH-02 | Facility profile: services, insurers, hours, doctors, load, admin photos and contacts (no fees, U-01) | P1 | S5 | Both | API, E2E | In progress (public audit 2026-11-07: every doctor and service link opens its page, e2e `public-pages.spec.ts`; photos in a lightbox) |
| FR-SCH-03 | Public facility pages indexable by search engines | P1 | S5 | Frontend | INS, E2E | In progress (R8: pre-rendered at build time, ADR 0008; public audit 2026-11-07: per-page description, canonical, Open Graph, schema.org Hospital/MedicalClinic/Physician, `prerender.test.tsx`) |
| FR-SCH-04 | Referral pathway hint for Mutuelle patients | P1 | S5 | Both | BR, CMP | In progress |
| FR-SCH-05 | Facility calendar: hours, closures, holidays, Umuganda | P1 | S2, S5 | Both | UT, API | In progress |
| FR-SCH-06 | Doctor weekly templates and exceptions | P1 | S2, S5 | Both | API, CMP | In progress |
| FR-SCH-07 | Slot generation: capacity, bookable share, walk-in reserve | P1 | S5 | Backend | BR | In progress |
| FR-SCH-08 | Book, reschedule, cancel with atomic slot hold | P1 | S5, U12 (patient reschedule with held-slot countdown, cancel dialog, `/dashboard/appointments`) | Both | BR, E2E, CMP (`shell.test.tsx`) | In progress |
| FR-SCH-09 | Remote queue join for today, with cut-off | P1 | S5 | Both | BR, E2E, CMP (frontend `s5.test.ts`, tracker test) | In progress |
| FR-SCH-10 | Reason for visit with the structured symptom picker | P1 | S5 | Both | API, CMP | In progress |
| FR-SCH-11 | Patient calendar with dependents; .ics export and feed | P1 | S5 | Both | API, E2E | In progress |
| FR-SCH-12 | Reception and doctor calendars (day, week) | P1 | S5 | Both | CMP, E2E | In progress |
| FR-SCH-13 | No-show detection, reversal with reason, strikes | P1 | S5 | Both | BR | In progress (R4 #86) |
| FR-SCH-14 | Disruption flow: bulk rebooking and notification | P1 | S5 | Both | BR, E2E | In progress |
| FR-SCH-15 | Follow-up booking from the consultation | P1 | S5, U8 W7 (#206: a follow-up date without a booking reminds the patient the day before and on the morning, and shows under "Planned by your clinic" with "Book a time") | Both | API, BR (`test_follow_through.py`), CMP (`follow-through.test.tsx`) | In progress |
| FR-SCH-16 | Recurring care plans | P2 | U8 W7 (#206), part | Both | BR | In progress (W7: a doctor plans single dated vaccinations and antenatal visits with reminders; no recurrence rules) |
| FR-SCH-17 | Waitlist with timed offers | P2 | — | Both | BR | Not started |
| FR-SCH-18 | Medicine schedule in the patient calendar | P2 | — | Both | CMP | Not started |

## FR-QUE · Visit lifecycle and live queue

Source: [06 · Visit lifecycle and live queue](../analysis/06-visit-lifecycle-and-queue.md)

| ID | Requirement (short) | Phase | Sprint | Side | Verification | Status |
|---|---|---|---|---|---|---|
| FR-QUE-01 | Visit as the central record | P1 | S4 | Backend | UT, API | In progress |
| FR-QUE-02 | Expected list separate from the live queue | P1 | S5 | Both | API, E2E | In progress |
| FR-QUE-03 | Check-in and walk-in produce one ticket (idempotent) | P1 | S4 (walk-ins), S5 (booked) | Backend | BR | In progress |
| FR-QUE-04 | Configurable stages incl. payment and pharmacy | P1 | S4 | Both | BR | In progress |
| FR-QUE-05 | Ordering rules: emergency, return, priority, ratio, FIFO | P1 | S4 | Backend | BR | In progress |
| FR-QUE-06 | Grace window; late arrivals become walk-ins | P1 | S5 | Both | BR, API (mocks `s5.test.ts`) | In progress (R4 #86, R5 #87) |
| FR-QUE-07 | Remote joiners hold a place; pass-over rule | P1 | S5 | Both | BR, CMP (board and tracker tests) | In progress (R4 #86, R5 #87) |
| FR-QUE-08 | Atomic Call next; versioned state changes | P1 | S4 | Backend | BR | In progress |
| FR-QUE-09 | Ticket state machine with recorded transitions | P1 | S4 | Backend | BR | In progress |
| FR-QUE-10 | Manual reorder only with reason; logged; reported | P1 | S4 | Both | BR, API | In progress |
| FR-QUE-11 | Wait estimate as a range; status messages; time to leave | P1 | S4, U12 (ticket card shows the server range or its status, never a made-up number, with "Updated hh:mm") | Both | UT, CMP | In progress |
| FR-QUE-12 | Real-time updates to boards, trackers, display (< 2 s) | P1 | S4 | Both | PERF, E2E | In progress |
| FR-QUE-13 | Waiting-room display: ticket numbers only, chime | P1 | S4 | Both | E2E, INS | In progress |
| FR-QUE-14 | Doctor status: on duty, break, emergency, off | P1 | S4 | Both | API | In progress |
| FR-QUE-15 | End-of-day auto-close rules | P1 | S4 | Backend | BR | In progress |
| FR-QUE-16 | Offline banner, action retry, paper fallback | P1 | S4 | Both | E2E, DRL | In progress (R8: live indicator stale after 30 s) |
| FR-QUE-17 | Transfer keeps the original arrival time | P1 | S4 | Backend | BR | In progress |
| FR-QUE-18 | Self check-in by QR at the facility | P2 | — | Both | E2E | Not started |
| FR-QUE-19 | Travel time from location for time to leave | P2 | — | Both | UT | Not started |
| FR-QUE-20 | Family grouping of tickets | P2 | — | Both | BR | Not started |
| FR-QUE-22 | Optional triage stage and triage nurse (vitals, urgency, note for the doctor) | P1 | U8 (#200) | Both | API, AZ, CMP | Implemented (#200) |

## FR-CLN · Clinical record

Source: [07 · Clinical record](../analysis/07-clinical-documentation-and-pharmacy.md)

| ID | Requirement (short) | Phase | Sprint | Side | Verification | Status |
|---|---|---|---|---|---|---|
| FR-CLN-01 | Consultation record; private notes never shown to patients | P1 | S6 | Both | AZ, API | In progress |
| FR-CLN-02 | Autosave; sign with re-authentication; lock; content hash | P1 | S6 | Both | BR, E2E | In progress |
| FR-CLN-03 | Addenda with reason; originals never edited | P1 | S6 | Both | BR | In progress |
| FR-CLN-04 | Entered in error; no deletion | P1 | S6 | Both | BR | In progress |
| FR-CLN-05 | No completion without signature; Unsigned records list | P1 | S6 | Both | BR | In progress |
| FR-CLN-06 | ICD-10 diagnoses, provisional or confirmed | P1 | S6 | Both | API, CMP | In progress |
| FR-CLN-07 | Allergy, duplicate, dose alerts; override with reason | P1 | S6 | Both | BR, CMP | In progress |
| FR-CLN-08 | Restricted (sensitive) records | P1 | S6 | Both | AZ | In progress |
| FR-CLN-09 | Results inbox with review sign-off | P1 | S6b | Both | API, E2E | In progress |
| FR-CLN-10 | Consultation templates as order sets (diagnosis, plan, instructions, prescription in one click; lab tests kept for W2) and the doctor's favourites first in the diagnosis and medicine search | P2 | W3 (#202) | Both | API, CMP | Implemented (#202) |
| FR-CLN-11 | Laboratory loop: order, sample, result, back to the same doctor, review, release; patient sees released results only | P1 | U8 (#201, W7 #206: "a result is ready" notice on release, results first on Records, new results under Needs your attention) | Both | API, AZ, CMP | Implemented (#201, #206) |

## FR-PHA · Pharmacy

Source: [07 · Pharmacy](../analysis/07-clinical-documentation-and-pharmacy.md)

| ID | Requirement (short) | Phase | Sprint | Side | Verification | Status |
|---|---|---|---|---|---|---|
| FR-PHA-01 | Prescription items from the catalogue, with states | P1 | S7 | Both | BR | In progress (backend and frontend on mocks; staging S7-I1 pending) |
| FR-PHA-02 | Pharmacy queue, identity check, full/partial, substitution, not available | P1 | S7 | Both | BR, E2E | In progress (backend and frontend on mocks; staging S7-I1 pending) |
| FR-PHA-03 | Signed dispensing record; status visible to the patient | P1 | S7 | Both | API, E2E | In progress (backend and frontend on mocks; staging S7-I1 pending) |
| FR-PHA-04 | Drug availability toggle visible to prescribers | P1 | S7 | Both | API | In progress (backend and frontend on mocks; staging S7-I1 pending; W5: follows the stock count once a medicine has stock, "low stock" shown to prescribers) |
| FR-PHA-05 | Dosing labels | P1 | S7, W8 | Both | INS | In progress (backend and frontend on mocks; staging S7-I1 pending; W8 pictograms for times of day and food, #207) |
| FR-PHA-06 | Simple stock (quantity, expiry) | P2 | W5 (#204) | Both | BR | In progress (backend and frontend on mocks: batches with expiry, FEFO deduction on dispense, adjustments with a reason, low-stock threshold, availability follows stock, expiring soon; `tests/s7/test_stock.py`, `stock.test.tsx`; staging pending) |
| FR-PHA-07 | Controlled medicines register | P2 | — | Both | BR | Not started |

## FR-DOC · Documents

Source: [07 · Documents](../analysis/07-clinical-documentation-and-pharmacy.md)

| ID | Requirement (short) | Phase | Sprint | Side | Verification | Status |
|---|---|---|---|---|---|---|
| FR-DOC-01 | Generated PDFs: letterhead, licence, number, QR, language | P1 | S7 | Backend | API, INS, PERF | In progress (S7b) |
| FR-DOC-02 | New version on amendment; superseded versions kept | P1 | S7 | Backend | BR | In progress (S7b) |
| FR-DOC-03 | Uploads: type, date, virus scan, fingerprint, compression | P1 | S1, S7 | Both | API, SEC | In progress |
| FR-DOC-04 | Public verification page with minimal data; logged | P1 | S7 | Both | API, SEC | In progress (S7b) |
| FR-DOC-05 | Encrypted storage in Rwanda; signed links; access logged | P1 | S7 | Backend | SEC, INS | In progress (S7b) |
| FR-DOC-06 | Patient download (single / all) and expiring share link | P1 | S7 | Both | API, E2E | In progress (S7b) |
| FR-DOC-07 | Reception prints released documents | P1 | S7 | Both | E2E | In progress (S7b) |

## FR-BIL · Billing, payments, insurance

Source: [08 · Billing, payments, insurance](../analysis/08-billing-payments-and-insurance.md)

| ID | Requirement (short) | Phase | Sprint | Side | Verification | Status |
|---|---|---|---|---|---|---|
| FR-BIL-01 | Insurance profiles with card photos, validity, status | P1 | S3 | Both | API | In progress |
| FR-BIL-02 | Facility insurer acceptance rules | P1 | S2, S8 | Both | BR | In progress |
| FR-BIL-03 | Insurers accepted and referral need in discovery and booking; no amounts (U-01) | P1 | S5 | Both | BR | In progress |
| FR-BIL-04 | Manual insurance verification per visit; rejection reason | P1 | S8 | Both | API | In progress |
| FR-BIL-05 | Facility tariff with effective dates | P1 | S2, S8 | Both | BR | In progress |
| FR-BIL-06 | One bill per visit with insurer / patient split | P1 | S8 | Both | BR | In progress |
| FR-BIL-07 | Payment recording with references; partial payments | P1 | S8 | Both | BR, API | In progress |
| FR-BIL-08 | Gapless receipts; to app, email and print | P1 | S8 | Both | BR | In progress |
| FR-BIL-09 | Voids, refunds, credit notes with approval and separation of duties | P1 | S8 | Both | BR, AZ | In progress |
| FR-BIL-10 | Shift open/close with expected vs counted totals | P1 | S8, W4 | Both | BR | In progress (W4: end-of-shift summary by payment method) |
| FR-BIL-11 | Exemptions and waivers with approval thresholds | P1 | S8 | Both | BR | In progress |
| FR-BIL-12 | Unpaid balances per patient per facility | P1 | S8 | Both | API, RLS | In progress (patient My bills and overview reminder, `bills.test.tsx`; staging S8-I1 open) |
| FR-BIL-13 | Optional EBM receipt number on payments | P1 | S8 | Both | API | In progress |
| FR-BIL-14 | Monthly insurance claim list with claim status | P2 | W4 (#203) | Both | API | In progress (CSV and PDF; paid or rejected with a reason; electronic submission stays FR-BIL-18) |
| FR-BIL-15 | Platform subscriptions, invoices, grace and listing rules | P2 | — | Both | BR | Not started |
| FR-BIL-16 | Mobile money payment requests and confirmation | P3 | — | Both | API, SEC | Not started |
| FR-BIL-17 | Live insurance eligibility checks | P4 | — | Backend | API | Not started |
| FR-BIL-18 | Electronic insurance claims; EBM integration | P4 | — | Backend | API | Not started |

## FR-NOT · Notifications

Source: [09 · Notifications](../analysis/09-notifications-and-communication.md)

| ID | Requirement (short) | Phase | Sprint | Side | Verification | Status |
|---|---|---|---|---|---|---|
| FR-NOT-01 | Event-driven notification service with channel adapters | P1 | S9 | Backend | UT, API | In progress |
| FR-NOT-02 | In-app inbox and live updates | P1 | S9 | Both | API, E2E | In progress |
| FR-NOT-03 | Web push: timely permission prompt, push-off banner | P1 | S9; phone app push over FCM (`app-devices/`, 2026-11-19) | Both | CMP, E2E, SEC, API (`test_app_push.py`) | In progress |
| FR-NOT-04 | Email notifications with documents and calendar files | P1 | S9, Brevo HTTPS API in production (2026-11-19: Railway blocks SMTP) | Backend | API, UT (`test_mail_brevo.py`) | In progress |
| FR-NOT-05 | Priority levels, quiet hours, fallback rules | P1 | S9 | Backend | BR | In progress |
| FR-NOT-06 | Patient, staff and facility preferences | P1 | S9 | Both | API, CMP | In progress |
| FR-NOT-07 | Notification catalogue (analysis 09 §4) | P1 | S9, S9b, U8 W7 (#206: visit reminders at the patient's offsets plus "15 minutes" and "it's time" at the start, follow-up and care-schedule reminders, result ready, "almost your turn" from every queue move, counter call) | Both | API, INS, BR (`test_follow_through.py`) | In progress |
| FR-NOT-08 | Guardians receive dependents' notifications | P1 | S9 | Backend | BR | In progress |
| FR-NOT-09 | Trilingual versioned templates; no clinical details | P1 | S9 | Backend | UT, INS | In progress |
| FR-NOT-10 | Delivery log with status and failures; retries | P1 | S9; a delivery queued over 24 h is cancelled, not sent (2026-11-19) | Backend | API, BR (`test_core.py`) | In progress |
| FR-NOT-11 | Facility and platform announcements | P1 | S9 | Both | API, E2E | In progress |
| FR-NOT-12 | Tracker keeps screen awake; sound and vibration on call | P1 | S4*, S9 | Frontend | E2E, INS | In progress |
| FR-NOT-13 | SMS and mobile push adapters | P3 | — | Backend | API | Not started |
| FR-NOT-14 | WhatsApp adapter (approved templates) | P4 | — | Backend | API | Not started |

## FR-DSP · Disputes, complaints, support

Source: [10 · Disputes, complaints, support](../analysis/10-disputes-complaints-and-support.md)

| ID | Requirement (short) | Phase | Sprint | Side | Verification | Status |
|---|---|---|---|---|---|---|
| FR-DSP-01 | Raise a dispute from an item, with context and audit events | P1 | S10 | Both | API, E2E | In progress (S10b backend and screens on mocks; staging open) |
| FR-DSP-02 | Dispute types, routing and escalation | P1 | S10 | Backend | BR | In progress (S10b backend and screens on mocks; staging open) |
| FR-DSP-03 | Lifecycle with deadlines and auto-escalation | P1 | S10 | Backend | BR | In progress (S10b backend and screens on mocks; staging open) |
| FR-DSP-04 | Thread, internal notes, staff comments | P1 | S10 | Both | AZ, API | In progress (S10b backend and screens on mocks; staging open) |
| FR-DSP-05 | Evidence view of the audit trail | P1 | S10 | Both | API | In progress (S10b backend and screens on mocks; staging open) |
| FR-DSP-06 | Outcomes create linked actions | P1 | S10 | Backend | BR | In progress (S10b backend and screens on mocks; staging open) |
| FR-DSP-07 | Disagreement statement attached when correction is refused | P1 | S10 | Both | API | In progress (S10b backend and screens on mocks; staging open) |
| FR-DSP-08 | Conflict of interest; one-person facility to super admin | P1 | S10 | Backend | BR | In progress (S10b backend and screens on mocks; staging open) |
| FR-DSP-09 | Disputes raised by guardians and at the counter | P1 | S10 | Both | AZ, API | In progress (S10b backend and screens on mocks; staging open) |
| FR-DSP-10 | Abuse protection: limits, duplicates, flags | P1 | S10 | Backend | BR | In progress (S10b backend and screens on mocks; staging open) |
| FR-DSP-11 | Help center, support requests and the public Contact page inbox | P1 | S10 (part 1) | Both | API, E2E | In progress |
| FR-DSP-12 | Ratings with one reply, moderation, completed-visit rule | P2 | — | Both | BR | Not started |
| FR-DSP-13 | Complaints flow | P2 | — | Both | API | Not started |
| FR-DSP-14 | Facility quality score | P2 | — | Backend | UT | Not started |

## FR-AI · AI symptom checker

Source: [11 · AI symptom checker](../analysis/11-ai-symptom-checker.md)

| ID | Requirement (short) | Phase | Sprint | Side | Verification | Status |
|---|---|---|---|---|---|---|
| FR-AI-01 | Structured symptom list (3 languages) for reason for visit | P1 | S5 | Both | API, INS | In progress |
| FR-AI-02 | Research consent separate from care consent | P1 | S0* | Both | API, E2E | Verified (S0, v0.1.0) |
| FR-AI-03 | De-identified export of intake + diagnosis pairs | P2 | — | Backend | INS | Not started |
| FR-AI-04 | Red-flag rules engine with clinician sign-off | P2 | PT | Backend | BR, INS | In progress (rules shipped, sign-off pending #93) |
| FR-AI-05 | Symptom → service → level-of-care routing | P2 | PT | Both | BR | In progress |
| FR-AI-06 | Safety layer: low confidence → safe default | P2 | PT | Backend | BR | In progress |
| FR-AI-07 | Prediction log with model version, inputs, outputs | P2 | PT | Backend | API | In progress |
| FR-AI-08 | ML model in shadow mode, doctors only | P3 | — | Both | AZ, INS | Not started |
| FR-AI-09 | Vignette evaluation suite; under-triage release gate | P3 | — | Backend | INS | Not started |
| FR-AI-10 | Model cards and model registry | P3 | — | Backend | INS | Not started |
| FR-AI-11 | Patient-facing ML triage after validation | P4 | — | Both | INS, USA | Not started |
| FR-AI-12 | Adaptive questioning by information gain | P4 | — | Backend | UT | Not started |
| FR-AI-13 | Kinyarwanda free text to symptom codes | P4 | — | Backend | INS | Not started |

## FR-SEC · Security, privacy, compliance

Source: [12 · Security, privacy, compliance](../analysis/12-security-privacy-and-compliance.md)

| ID | Requirement (short) | Phase | Sprint | Side | Verification | Status |
|---|---|---|---|---|---|---|
| FR-SEC-01 | Server-side RBAC and facility scoping on every request | P1 | S0 | Backend | AZ, RLS | Verified (S0, v0.1.0) |
| FR-SEC-02 | PostgreSQL row-level security for tenant isolation | P1 | S0 | Backend | RLS | Verified (S0, v0.1.0) |
| FR-SEC-03 | Treatment-relationship rule for clinical data | P1 | S3 (R2 #84), S6 | Backend | AZ | In progress |
| FR-SEC-04 | Versioned consent records | P1 | S0 | Both | API | Verified (S0, v0.1.0) |
| FR-SEC-05 | Separate optional research consent | P1 | S0 | Both | API, E2E | Verified (S0, v0.1.0) |
| FR-SEC-06 | Staff 2FA; re-authentication to sign; idle lock with PIN | P1 | S0 (MFA), S1 (PIN lock, step-up) | Both | API, E2E, SEC | In progress |
| FR-SEC-07 | Append-only, hash-chained audit log | P1 | S0 | Backend | API, SEC | Verified (S0, v0.1.0) |
| FR-SEC-08 | Patient access history in plain language | P1 | S3 | Both | API, E2E | In progress |
| FR-SEC-09 | Break-glass with reason, time limit, review, patient visibility | P1 | S6b | Both | AZ, API | In progress |
| FR-SEC-10 | Encryption in transit and at rest; field-level encryption | P1 | S3, R1 #83 (TOTP secrets, Transit keystore) | Backend | UT, INS | In progress |
| FR-SEC-11 | Patient data processed and stored in Rwanda | P1 | S11* | Ops | INS | Not started |
| FR-SEC-12 | Data subject rights: access, download, rectification, erasure, portability | P1 | S10 | Both | API, E2E | Not started |
| FR-SEC-13 | Retention rules per data type | P1 | S10 | Backend | UT, INS | Not started |
| FR-SEC-14 | Encrypted backups, point-in-time recovery, tested restores | P1 | S11 | Ops | DRL | Not started |
| FR-SEC-15 | Incident response and breach notification procedure | P1 | S11 | Ops | DRL, INS | Not started |
| FR-SEC-16 | Penetration test before go-live | P1 | S11 | Ops | SEC | Not started |
| FR-SEC-17 | De-identification pipeline for analytics and research | P2 | — | Backend | INS | Not started |

## FR-RPT · Reporting and analytics

Source: [13 · Reporting and analytics](../analysis/13-reporting-and-analytics.md)

| ID | Requirement (short) | Phase | Sprint | Side | Verification | Status |
|---|---|---|---|---|---|---|
| FR-RPT-01 | Metric definitions from event timestamps | P1 | S10, W6 | Backend | UT | In progress (W6: wait per stage from the first call event, #205) |
| FR-RPT-02 | Live operations board | P1 | S10 | Both | API, E2E | Not started |
| FR-RPT-03 | Facility reports (daily, waits, doctors, bookings, finance, staff) | P1 | S10, W6 | Both | API, CMP | In progress (W6 `/reports`: patients, sources, no-shows, waits by stage, money, lab, stock; doctors and staff not yet, #205) |
| FR-RPT-04 | Export to Excel and PDF | P1 | S10, W6 | Both | API, SEC | In progress (W6: CSV per table, formula-safe, audit-logged; PDF not yet, #205) |
| FR-RPT-05 | Platform network, adoption, quality and system reports | P1 | S10, U8 W9 (#208: national report `/platform/reports`: load by facility and district, wait trend, top diagnoses by district, stock-outs; groups under 10 suppressed) | Both | API, BR (`test_national_report.py`), CMP (`national-report.test.tsx`) | In progress (adoption and system reports not yet) |
| FR-RPT-06 | Peak-hours heat map, diagnoses and pharmacy reports | P2 | W6 | Both | API | In progress (W6: top ICD-10, referrals out, stock-outs and expiring stock; heat map from S4, #205) |
| FR-RPT-07 | Pilot impact report support | P2 | — | Both | INS | Not started |
| FR-RPT-08 | Aggregated Ministry / district analytics | P4 | — | Both | INS | Not started |

## NFR-PERF · Performance and capacity

Source: [14 · Performance and capacity](../analysis/14-non-functional-requirements.md)

| ID | Requirement (short) | Phase | Sprint | Side | Verification | Status |
|---|---|---|---|---|---|---|
| NFR-PERF-01 | 06:00–10:00 peak: 50 check-ins/15 min, 20 staff per facility | P1 | S4, S11 | Backend | PERF | In progress |
| NFR-PERF-02 | Launch capacity: 50 facilities, 5,000 visits/day; scale ×10 | P1 | S11 | Backend | PERF | Not started |
| NFR-PERF-03 | Staff actions < 500 ms p95 on the server | P1 | S4*, S11 | Backend | PERF | In progress |
| NFR-PERF-04 | Queue changes reach all screens in < 2 s | P1 | S4, S11 | Both | PERF, E2E | In progress |
| NFR-PERF-05 | Patient history < 2 s for 200 visits | P1 | S6*, S11 | Backend | PERF | Not started |
| NFR-PERF-06 | Patient app first load < 3 s on 3G | P1 | S11 | Frontend | PERF | Not started |
| NFR-PERF-07 | PDF generated in < 5 s | P1 | S7*, S11 | Backend | PERF | Not started |

## NFR-REL · Availability and reliability

Source: [14 · Availability and reliability](../analysis/14-non-functional-requirements.md)

| ID | Requirement (short) | Phase | Sprint | Side | Verification | Status |
|---|---|---|---|---|---|---|
| NFR-REL-01 | 99.5 % availability during facility hours | P1 | S11 | Ops | INS | Not started |
| NFR-REL-02 | RPO ≤ 15 min, RTO ≤ 4 h | P1 | S11 | Ops | DRL | Not started |
| NFR-REL-03 | No lost actions during brief network loss | P1 | S4*, S11 | Both | E2E | In progress |
| NFR-REL-04 | Idempotent check-in, payment and dispensing | P1 | S4*, S7*, S8*, S11 | Backend | BR | In progress |
| NFR-REL-05 | Background jobs retried and monitored | P1 | S9*, S11 | Backend | API, INS | In progress |

## NFR-NET · Low connectivity and devices

Source: [14 · Low connectivity and devices](../analysis/14-non-functional-requirements.md)

| ID | Requirement (short) | Phase | Sprint | Side | Verification | Status |
|---|---|---|---|---|---|---|
| NFR-NET-01 | Installable PWA; booking, ticket, documents offline | P1 | S0*, S4*, S11* | Frontend | E2E, INS | In progress |
| NFR-NET-02 | Small pages and payloads; data-saver mode | P1 | S11* | Both | PERF, INS | Not started |
| NFR-NET-03 | Staff app on low-end PCs and 10" tablets | P1 | S11* | Frontend | USA, INS | Not started |
| NFR-NET-04 | Patient app on Android 8+ and iOS 16.4+ | P1 | S11* | Frontend | INS | Not started |
| NFR-NET-05 | Display on a TV with a cheap stick or mini PC | P1 | S4* | Frontend | INS | In progress |
| NFR-NET-06 | Thermal receipt and ticket printing (58/80 mm) | P1 | S7* | Frontend | INS | Not started |

## NFR-UX · Usability, accessibility, languages

Source: [14 · Usability, accessibility, languages](../analysis/14-non-functional-requirements.md)

| ID | Requirement (short) | Phase | Sprint | Side | Verification | Status |
|---|---|---|---|---|---|---|
| NFR-UX-01 | Kinyarwanda first; no hard-coded text; language switch | P1 | S0 | Both | UT, INS | Verified (S0, v0.1.0) |
| NFR-UX-02 | Elderly and low-literacy friendly; booking ≤ 5 steps | P1 | S5*, S11*, W8 | Frontend | USA | In progress (W8: spoken call in chosen languages, label pictograms, next-visit card, #207) |
| NFR-UX-03 | WCAG 2.2 AA for patient and staff apps | P1 | S0*–S11 | Frontend | CMP, A11Y | In progress |
| NFR-UX-04 | Walk-in + ticket < 60 s; booked check-in < 15 s | P1 | S3*, S4* | Both | USA, E2E | In progress (R8: Playwright walk-in journey) |
| NFR-UX-05 | Keyboard shortcuts for reception and doctors | P1 | S4* | Frontend | CMP, E2E | In progress |
| NFR-UX-06 | Local date and number formats; RWF without decimals | P1 | S0* | Frontend | UT | In progress |
| NFR-UX-07 | Plain-language errors with what to do next | P1 | S0* | Both | CMP, INS | In progress |

## NFR-OPS · Maintainability and operations

Source: [14 · Maintainability and operations](../analysis/14-non-functional-requirements.md)

| ID | Requirement (short) | Phase | Sprint | Side | Verification | Status |
|---|---|---|---|---|---|---|
| NFR-OPS-01 | Automated tests for domain rules; e2e for core flows | P1 | S0 | Both | INS | In progress |
| NFR-OPS-02 | CI: lint, types, tests, dependency and secret scanning | P1 | S0 | Both | INS | Verified (S0, v0.1.0); blocking mypy, Semgrep, osv-scanner, hadolint, image scan, SBOM and PR title gates added in #90 |
| NFR-OPS-03 | Container deployments; separate dev, staging, production | P1 | S0 | Ops | INS | In progress |
| NFR-OPS-04 | Monitoring and alerts (scrubbed of personal data) | P1 | S0, S11* | Ops | INS, DRL | In progress |
| NFR-OPS-05 | Structured logs without personal data | P1 | S0 | Backend | UT, INS | Verified (S0, v0.1.0) |
| NFR-OPS-06 | API documented (OpenAPI) and versioned | P1 | S0 | Backend | CON | Verified (S0, v0.1.0) |
| NFR-OPS-07 | Feature flags per facility | P1 | S1* | Both | API | In progress |
| NFR-OPS-08 | Database migrations reviewed and reversible | P1 | S0 | Backend | INS | Verified (S0, v0.1.0); CI reverses and re-applies each app's latest migration (#90) |

## NFR-INT · Interoperability

Source: [14 · Interoperability](../analysis/14-non-functional-requirements.md)

| ID | Requirement (short) | Phase | Sprint | Side | Verification | Status |
|---|---|---|---|---|---|---|
| NFR-INT-01 | Standard codes (ICD-10, catalogue medicines) ready for FHIR | P1 | S6* | Backend | INS | Not started |
| NFR-INT-02 | Channel adapters plug in without core changes | P3 | — | Backend | INS | Not started |
| NFR-INT-03 | Insurer, mobile money and EMR adapters | P3–P4 | — | Backend | INS | Not started |

## Findings from building this matrix

These need a decision in the analysis or the roadmaps; the requirement meanings were not changed here.

| # | Finding | Where |
|---|---|---|
| 1 | 220 requirement IDs, no duplicate IDs and no gaps in any numbering sequence. | All module documents |
| 2 | Some IDs are planned in two sprints: FR-ACC-05..07 (S0 and S2), FR-PAT-02 (S0 contract and S3), FR-SCH-05..06 (S2 and S5), FR-BIL-02 and FR-BIL-05 (S2 and S8), FR-DOC-03 (S1 and S7), FR-ONB-09 (S2 and S11). The sprint contracts should state which part each sprint delivers. | [Backend roadmap](../roadmap/backend.md) |
| 3 | P1 requirements not named in any sprint's requirement line (assigned here with `*`): FR-AI-02, FR-SEC-11, NFR-NET-01..06, NFR-UX-02..07, NFR-INT-01; NFR-PERF and NFR-REL are named only as groups in S11. | Roadmaps |
| 4 | The S4 queue sprint includes check-in of booked patients and the Expected list (FR-QUE-02, 03, 06), but bookings arrive in S5. | [API catalogue](../api/catalogue.md#s4--visits-and-the-live-queue)  **Resolved** (roadmaps, permission matrix, NFR-UX-03 and security docs aligned). |
| 5 | FR-ACC-09 (super admin emergency access) is listed in S0, but break-glass (FR-SEC-09) is built in S6. FR-SEC-06 (S0) includes the idle lock with PIN unlock, which the Sprint 0 contract doesn't cover. | Backend roadmap, Sprint 0 contract  **Resolved** (roadmaps, permission matrix, NFR-UX-03 and security docs aligned). |
| 6 | The permission matrix (analysis 02 §3) gives merge requests to the facility admin and nothing to the receptionist; analysis 04 §3.2 and security 11 §6 say the receptionist requests and the facility admin approves. | Analysis 02, 04  **Resolved** (roadmaps, permission matrix, NFR-UX-03 and security docs aligned). |
| 7 | The permission matrix gives the receptionist no right to raise a dispute; analysis 10 §3 and FR-DSP-09 let the receptionist raise one at the counter. | Analysis 02, 10  **Resolved** (roadmaps, permission matrix, NFR-UX-03 and security docs aligned). |
| 8 | NFR-UX-03 says WCAG 2.1 AA; design research 10 and the security compliance mapping use WCAG 2.2 AA (which includes 2.1). | Analysis 14, design research 10  **Resolved** (roadmaps, permission matrix, NFR-UX-03 and security docs aligned). |
