# Phase-1 endpoint catalogue

Status: v0.1 · 2026-10-17 · **Plan only.** Implemented endpoints are defined by the generated OpenAPI schema (`GET /api/v1/schema/`); see [README](README.md) §1 for how the two relate, the status values, the permission codes († = proposed) and the note abbreviations (Idem, Ver, Step-up, RL, Audit, Async).

Sprints and requirements follow the [backend](../roadmap/backend.md) and [frontend](../roadmap/frontend.md) roadmaps. Conventions: [architecture 02](../architecture/02-api-conventions.md).

## Contents

| Sprint | Theme | Status |
|---|---|---|
| [S0](#s0--foundations) | Foundations | Implemented (backend-v0.1.0) |
| [S1](#s1--platform-and-onboarding) | Platform and onboarding | Implemented (#47); frontend #49, #55 |
| [S2](#s2--facility-setup-and-staff) | Facility setup and staff | Implemented: backend #63, frontend #69. The [contract](../architecture/contracts/sprint-02-facility-setup.md) and the OpenAPI schema win over the rows below |
| [S3](#s3--patients-and-identity) | Patients and identity | Implemented: backend #57, frontend #59 |
| [S4](#s4--visits-and-the-live-queue) | Visits and the live queue | Implemented: backend #73, frontend #74. The [contract](../architecture/contracts/sprint-04-queue.md) and the OpenAPI schema win over the rows below |
| [S5](#s5--booking-remote-join-and-calendars) | Booking, remote join and calendars | S5a implemented (#80 and the Phase 1 PR); S5b planned. The [contract](../architecture/contracts/sprint-05-booking.md) and the OpenAPI schema win over the rows below |
| [S6](#s6--clinical-record-and-history) | Clinical record and history | Planned |
| [S7](#s7--pharmacy-and-documents) | Pharmacy and documents | S7a implemented (backend); S7b planned. The [contract](../architecture/contracts/sprint-07-pharmacy-documents.md) and the OpenAPI schema win over the rows below |
| [S8](#s8--billing-and-payments) | Billing and payments | Backend implemented; frontend next |
| [S9](#s9--notifications) | Notifications | Backend implemented (S9 pull request); the [contract](../architecture/contracts/sprint-09-notifications.md) §3.3 and the OpenAPI schema win over the rows below |
| [S10](#s10--disputes-help-and-reports) | Disputes, help and reports | Part 1 (help center, support requests) backend implemented; disputes and reports planned |
| [S11](#s11--hardening-and-pilot-readiness) | Hardening and pilot readiness | Planned |
| [—](#not-yet-scheduled) | Not yet scheduled | Planned |

---

## S0 · Foundations

Copied from the [Sprint 0 contract](../architecture/03-sprint-0-contract.md) §2. Schemas (`StaffMe`, `PatientMe`, `LoginResult`) and audit events are defined there.

### Audience-neutral

| Method | Path | Purpose | Permission | Requirements | Notes | Status |
|---|---|---|---|---|---|---|
| `GET` | `/api/v1/health/` | Liveness and API version | Public | NFR-OPS-06 | `200 {"status":"ok","version":"0.1.0"}` | Implemented (backend-v0.1.0) |
| `GET` | `/api/v1/csrf/` | CSRF token for frontends on other hosts | Public | FR-SEC-01 | Sets the CSRF cookie ([ADR 0006](../decisions/0006-separate-frontend-and-backend-hosting.md)) | Implemented (backend-v0.1.0) |
| `POST` | `/api/v1/auth/password-reset/` | Request a reset email | Public | FR-PAT-02 | Always `202`; RL: auth; email via Mailpit in dev; Audit `auth.password_reset.requested` | Implemented (backend-v0.1.0) |
| `POST` | `/api/v1/auth/password-reset/confirm/` | Set a new password | Reset token (body) | FR-PAT-02 | `204`; revokes all sessions of the user; Audit `auth.password_reset.completed` | Implemented (backend-v0.1.0) |
| `GET` | `/api/v1/schema/` | OpenAPI 3 schema | Public (non-production) | NFR-OPS-06 | Staff-only in production | Implemented (backend-v0.1.0) |

### Patient

| Method | Path | Purpose | Permission | Requirements | Notes | Status |
|---|---|---|---|---|---|---|
| `POST` | `/api/v1/patient/auth/register/` | Sign up: user + self patient + link + consents | Public | FR-PAT-02, FR-SEC-04, FR-SEC-05, FR-AI-02 | Always `202 {detail, email_verification}` "check your email", also for an existing email (that owner gets an "account exists" email; R1 #83, #14); not signed in until the email is confirmed; password ≥ 8 (2026-11-05, was 15); Audit `patient.registered`. With `PATIENT_SIGNUP_EMAIL_VERIFICATION=false` (testing only): no email, `email_verification: false`, sign in straight away | Implemented (R1 #83) |
| `POST` | `/api/v1/patient/auth/verify-email/` | Confirm the sign-up email | Token (body) | FR-PAT-02 | `{token}` → `200 PatientMe` and signs in; single use, 3 days; `400` on `token`; Audit `auth.email.verified` | Implemented (R1 #83) |
| `POST` | `/api/v1/patient/auth/login/` | Log in | Public | FR-PAT-02 | Generic `401`; RL: auth; rotates session. Mobile app (`X-MediLink-Client: app`): no cookie, the session key comes back in `X-Session-Token` and is sent as `Authorization: Bearer` on every `/api/v1/patient/*` call; no CSRF ([security 03 §5](../security/03-identity-authentication-sessions.md)) | Implemented (backend-v0.1.0; app transport upgrade 15) |
| `POST` | `/api/v1/patient/auth/logout/` | Log out | Patient session | FR-SEC-06 | `204`; deletes the patient session only | Implemented (backend-v0.1.0) |
| `GET` | `/api/v1/patient/auth/me/` | Current patient account and profiles | Patient session | FR-PAT-03 | `PatientMe` | Implemented (backend-v0.1.0) |
| `POST` | `/api/v1/patient/auth/password/` | Change password while signed in | Patient session | FR-PAT-02 | `{current_password, new_password}` → `200 PatientMe`; wrong current = `400` field error and a failed-login count (lockout); ends other sessions, rotates this one, "password changed" email; Audit `auth.password.changed` | Implemented (2026-11-05) |
| `GET` | `/api/v1/patient/auth/google/` | Sign in with Google: on/off and public client ID | Public | FR-PAT-02 | `{enabled, client_id}`; `client_id` is "" when off (upgrade 17) | Implemented (2026-11-06) |
| `POST` | `/api/v1/patient/auth/google/` | Sign in or sign up with Google | Public | FR-PAT-02 | `{id_token, preferred_language?, accepted_terms_version?, accepted_privacy_version?, research_consent?}` → `200 PatientMe`, rotates session (app: `X-Session-Token`). `409 consent_required` (`error.current = {email, full_name}`) for a new person; `403 staff_account`; `401` invalid token; `400 google_unverified_email`; `404` when off. RL: auth. Audit `auth.google.linked` / `auth.google.refused` ([security 03 §1a](../security/03-identity-authentication-sessions.md)) | Implemented (2026-11-06) |

### Staff

| Method | Path | Purpose | Permission | Requirements | Notes | Status |
|---|---|---|---|---|---|---|
| `POST` | `/api/v1/staff/auth/login/` | Staff login | Active membership or platform admin | FR-ACC-04 | `LoginResult`; generic `401`; RL: auth; rotates session; Audit `auth.login.*` | Implemented (backend-v0.1.0) |
| `POST` | `/api/v1/staff/auth/mfa/setup/` | Start TOTP enrolment | `mfa_setup_required` state | FR-ACC-04, FR-SEC-06 | Returns `otpauth_uri` and secret | Implemented (backend-v0.1.0) |
| `POST` | `/api/v1/staff/auth/mfa/confirm/` | Confirm TOTP; get 10 recovery codes | `mfa_setup_required` state | FR-ACC-04, FR-SEC-06 | Codes shown once, stored hashed; Audit `auth.mfa.enrolled` | Implemented (backend-v0.1.0) |
| `POST` | `/api/v1/staff/auth/mfa/verify/` | Second factor at login (code or recovery code) | `mfa_required` state | FR-ACC-04, FR-SEC-06 | RL: auth; rotates session; Audit `auth.mfa.*` | Implemented (backend-v0.1.0) |
| `POST` | `/api/v1/staff/auth/logout/` | Log out | Staff session | FR-SEC-06 | `204`; deletes the staff session only; Audit `auth.logout` | Implemented (backend-v0.1.0) |
| `GET` | `/api/v1/staff/auth/me/` | Current user, memberships, permissions for the active facility | Staff session | FR-ACC-01, FR-ACC-02, FR-ACC-03 | `StaffMe` | Implemented (backend-v0.1.0) |
| `PATCH` | `/api/v1/staff/auth/me/` | Update my own name, work phone (Rwandan mobile, stored E.164) and language | Staff session | FR-ACC-01 | Answers `StaffMe` (now with `phone`); Audit `staff.account.updated` | Implemented (onboarding carry-over, 2026-11-03) |
| `POST` | `/api/v1/staff/auth/active-facility/` | Switch the active facility | Member of that facility | FR-ACC-02 | `404` if not a member; rotates session; Audit `staff.facility.switched` | Implemented (backend-v0.1.0) |

### WebSockets

Sprint 0 only needs a placeholder authenticated consumer with origin validation (check B14). Its path is not contracted.

---

## S1 · Platform and onboarding

Requirements: FR-ONB-01..03, 07, 08, 10; FR-DOC-03, 05 (uploads); FR-SEC-06 (lock, step-up); NFR-OPS-07 (feature flags). Security: upload pipeline v1, platform step-up. Built from the [S1 contract](../architecture/contracts/sprint-01-platform-onboarding.md) §3, which wins over these summaries.

### Public

"Applicant" = the applicant cookie matches the application (contract §3.2).

| Method | Path | Purpose | Permission | Requirements | Notes | Status |
|---|---|---|---|---|---|---|
| `POST` | `/api/v1/public/facility-applications/` | Start an application; emails a resume link | Public | FR-ONB-01 | Honeypot; RL: application; Audit | Implemented (#47) |
| `POST` | `/api/v1/public/facility-applications/resume-links/` | Email a resume link for each open application of an address | Public | FR-ONB-01 | Always `202`; RL: resume | Implemented (#47) |
| `POST` | `/api/v1/public/facility-applications/resume/` | Exchange a resume token for an applicant session | Token (body) | FR-ONB-01 | Single use; RL: resume; Audit | Implemented (#47) |
| `GET` | `/api/v1/public/facility-applications/{id}/` | Read the draft | Applicant | FR-ONB-01 | | Implemented (#47) |
| `PATCH` | `/api/v1/public/facility-applications/{id}/` | Autosave wizard steps, including the MoH facility code (FOSA ID) and 9-digit TIN; submit needs the map pin (`location.latitude` in `missing_for_submit`) | Applicant | FR-ONB-01 | Ver; only in `draft` or `changes_requested` | Implemented (#47) |
| `POST` | `/api/v1/public/facility-applications/{id}/documents/` | Upload licence, RDB registration, TIN, accreditation, insurer contracts, and up to 6 facility photos (`facility_photo`, images only; they become the profile's photos at approval) | Applicant | FR-ONB-01, FR-DOC-03 | `multipart`; upload pipeline; Idem; RL: upload | Implemented (#47) |
| `PATCH`, `DELETE` | `/api/v1/public/facility-applications/{id}/documents/{document_id}/` | Edit document details or remove an upload | Applicant | FR-ONB-01 | Editable statuses only | Implemented (#47) |
| `POST` | `/api/v1/public/facility-applications/{id}/submit/` | Submit or resubmit | Applicant | FR-ONB-01, FR-ONB-02 | → `submitted`; Idem; super admins notified | Implemented (#47) |
| `POST` | `/api/v1/public/facility-applications/{id}/end-session/` | "Continue later" on shared computers | Applicant | FR-ONB-01 | Cookie cleared | Implemented (#47) |
| `GET` | `/api/v1/public/master-data/{kind}/` | Locations, facility types, insurers, service catalogue, public holidays | Public | FR-ONB-10 | Localised; `Cache-Control` + ETag | Implemented (#47) |

### Staff

| Method | Path | Purpose | Permission | Requirements | Notes | Status |
|---|---|---|---|---|---|---|
| `POST` | `/api/v1/staff/auth/step-up/` | Re-authenticate for sensitive actions | Staff session | FR-SEC-06 | Password + second factor (password alone while `security.staff_mfa` is off); 5-minute window; RL: mfa | Implemented (#47) |
| `GET`, `POST` | `/api/v1/staff/auth/lock/` | Lock state; lock now | Staff session (locked or not) | FR-SEC-06 | Audit | Implemented (#47) |
| `POST` | `/api/v1/staff/auth/unlock/` | Unlock with PIN or password | Locked staff session | FR-SEC-06 | 5 failures end the session; RL: unlock | Implemented (#47) |
| `PUT`, `DELETE` | `/api/v1/staff/auth/pin/` | Set, change or remove the unlock PIN | Staff (`PUT`: step-up) | FR-SEC-06 | Argon2id; Audit | Implemented (#47) |
| `GET` | `/api/v1/staff/master-data/{kind}/` | All nine kinds, read-only, searchable | Staff | FR-ONB-10 | Trigram search for drugs and diagnosis codes | Implemented (#47) |
| `POST` | `/api/v1/staff/uploads/` | Upload a file for a purpose | Staff + purpose `can_upload` | FR-DOC-03 | Idem; RL: upload | Implemented (#47) |
| `POST` | `/api/v1/staff/uploads/signature/` | Sign a direct image upload to Cloudinary (`facility_photo`, `facility_logo`, `provider_avatar`) | Staff (facility kinds: `facility.configure`) | Images 2026-11-18 | Kinds are a whitelist, folder chosen by the server; 503 without credentials; RL: 30/hour | Implemented |
| `GET` | `/api/v1/staff/uploads/{id}/` | Upload and scan status | Uploader or purpose `can_read` | FR-DOC-03 | | Implemented (#47) |
| `POST` | `/api/v1/staff/uploads/{id}/download-links/` | 5-minute signed link | As above | FR-DOC-05 | Clean files only; always served as `attachment` (R1 #83); Audit | Implemented (#47) |

### Patient

| Method | Path | Purpose | Permission | Requirements | Notes | Status |
|---|---|---|---|---|---|---|
| `POST` | `/api/v1/patient/uploads/` | Upload a file for a purpose (S3: `insurance_card`) | Patient + purpose `can_upload` | FR-DOC-03 | As the staff version | Implemented (#47) |
| `POST` | `/api/v1/patient/uploads/signature/` | Sign a direct image upload to Cloudinary (`patient_avatar`) | Patient session | Images 2026-11-18 | As the staff version | Implemented |
| `PUT`, `DELETE` | `/api/v1/patient/profiles/{id}/avatar/` | Set or remove the profile photo from a Cloudinary upload (`{public_id}`) | Self or guardian (`edit_contacts`) | Images 2026-11-18 | Public id checked with the Admin API; audit `patients.photo.updated` / `removed` | Implemented |
| `GET` | `/api/v1/patient/uploads/{id}/` | Upload and scan status | Uploader or purpose `can_read` | FR-DOC-03 | | Implemented (#47) |
| `POST` | `/api/v1/patient/uploads/{id}/download-links/` | 5-minute signed link | As above | FR-DOC-05 | | Implemented (#47) |

### Platform

| Method | Path | Purpose | Permission | Requirements | Notes | Status |
|---|---|---|---|---|---|---|
| `GET` | `/api/v1/platform/overview/` | Console overview | Platform admin | FR-ONB-02 | | Implemented (#47) |
| `GET` | `/api/v1/platform/command-center/` | Command centre: map points, live facilities, people waiting, needs-action counts, security summary, recent activity | Platform admin | Upgrade 05 §6 | Aggregates only; memberships and disputes read per facility under RLS | Implemented (#154) |
| `GET` | `/api/v1/platform/users/` | Every account: kind (platform, staff, patient), facilities and roles, MFA, status, last sign-in (`?q` name, email or phone, `kind`, `status`, `mfa`, `facility`, `role`, `verification=pending`) | Platform admin | Upgrade 05 §6 | Patients as accounts only, never health data; filtered in the database (#198); `mfa=off` lists staff and platform admins only | Implemented (#154, #198) |
| `GET` | `/api/v1/platform/users/summary/` | Account counts by kind; locked, without MFA, email not confirmed; the facilities that have staff (for the filter) | Platform admin | Upgrade 05 §6 | | Implemented (#198) |
| `GET` | `/api/v1/platform/users/export/` | Staff and platform accounts as CSV, with the list's filters (access review) | Platform admin | Upgrade 05 §6 | Never patients; UTF-8 BOM, formula-safe; audit `platform.user.list_exported` | Implemented (#198) |
| `GET` | `/api/v1/platform/reports/national/` | National aggregate report for a period (`from`, `to`, `group`): load by facility and district, wait trend to the doctor, top diagnoses by district, stock-outs now | Platform admin | FR-RPT-05, FR-RPT-08 (part) | W9 (#208). Read one facility at a time in its own RLS context (W6 helpers); aggregates only, never a patient; groups of 1-9 patients or visits suppressed (`value: null, suppressed: true`), with complementary suppression inside a district and of the national total; waits hidden below 10 called; diagnoses listed only at 10+ and never sensitive | Implemented (#208) |
| `GET` | `/api/v1/platform/reports/national/export/` | One table as CSV (`table`: facilities, districts, waits, diagnoses, stockouts) | Platform admin | FR-RPT-04, FR-RPT-05 | UTF-8 BOM, formula-safe; hidden cells read `suppressed`; audit `platform.report.exported` | Implemented (#208) |
| `GET` | `/api/v1/platform/facilities/summary/` | Counts for the list's "needs attention" line | Platform admin | Management 2026-11-18 | | Implemented |
| `GET` | `/api/v1/platform/facilities/{id}/staff/` | People with access (active and removed) and pending invitations | Platform admin | Management 2026-11-18 | | Implemented |
| `POST`, `DELETE` | `/api/v1/platform/facilities/{id}/invitations/[{invitation_id}/]` | Invite a person with roles; cancel a pending invitation | Platform admin | Management 2026-11-18 | Step-up; `{reason}`; audit `facility.staff_invited` | Implemented |
| `PATCH` | `/api/v1/platform/facilities/{id}/details/` | Correct name, type, ownership, level of care | Platform admin | Management 2026-11-18 | Step-up; `{reason}`; audit `facility.details_updated` | Implemented |
| `POST` | `/api/v1/platform/users/{id}/facilities/{facility_id}/roles/` | Set a person's roles at a facility | Platform admin | Management 2026-11-18 | Step-up; `{reason}`; keeps one facility admin (`422`); audit `platform.user.roles_changed` | Implemented |
| `POST` | `/api/v1/platform/users/{id}/platform-admin/{grant\|revoke}/` | Add to or remove from the platform team | Platform admin | Management 2026-11-18 | Step-up; `{reason}`; never yourself, the last admin or a patient account (`422`); revoke ends sessions | Implemented |
| `GET`, `PATCH` | `/api/v1/platform/users/{id}/` | Account profile: sessions (short non-secret refs), recent security events, language, email confirmation, sign-in block, facility access with removal date and reason, pending invitations, admin changes; `PATCH` corrects `full_name`, `phone`, `preferred_language` | Platform admin | Upgrade 05 §6 | Audit `platform.user.viewed`; `PATCH`: step-up, `{reason}` ≥ 5, never yourself (`422`), no phone for patients (`400`), never the email or password; audit `platform.user.updated` | Implemented (#154, #198) |
| `POST` | `/api/v1/platform/users/{id}/lock/`, `unlock/`, `reset-mfa/`, `revoke-sessions/` | Account actions | Platform admin | Upgrade 05 §6 | Up; `{reason}` ≥ 5; never on yourself (`422`); audit `platform.user.*` | Implemented (#154) |
| `POST` | `/api/v1/platform/users/{id}/send-password-reset/`, `resend-verification/`, `clear-sign-in-block/` | Help for someone who calls: a reset link or the sign-up confirmation emailed to their own address; end the block after failed passwords or MFA codes | Platform admin | Upgrade 05 §6, security 03 §6 | Up; `{reason}` ≥ 5; never yourself; 3 emails per address per hour (`422`); a reset needs an unlocked account; audit `platform.user.password_reset_sent`, `verification_resent`, `sign_in_unblocked` | Implemented (#198) |
| `POST` | `/api/v1/platform/users/{id}/facilities/{facility_id}/remove/`, `restore/` | Remove or restore a person's access to one facility | Platform admin | FR-ACC-06 | Up; `{reason}` ≥ 5; never yourself; keeps the last facility admin (`422`); ends live connections; audit `staff.membership.deactivated` / `updated` with the reason | Implemented (#198) |
| `GET` | `/api/v1/platform/security-events/` | Security log (auth, account actions, MFA resets) (`?q`, `action`, `outcome=failure`) | Platform admin | Upgrade 05 §6, FR-SEC | Read-only view of the audit chain | Implemented (#154) |
| `GET` | `/api/v1/platform/access-events/` | Record access log (records opened, access reasons, break-glass) | Platform admin | Upgrade 05 §6 | Record shown by short reference only | Implemented (#154) |
| `GET` | `/api/v1/platform/facility-applications/` | Applications pipeline | Platform admin | FR-ONB-02 | Filters `status`, `district`, `facility_type`, `q` | Implemented (#47) |
| `POST` | `/api/v1/platform/facility-applications/` | Create an application on behalf of a facility | Platform admin | FR-ONB-01 | Audit | Implemented (#47) |
| `GET`, `PATCH` | `/api/v1/platform/facility-applications/{id}/` | Application, documents, checks; edit on behalf of the facility | Platform admin | FR-ONB-02 | Ver | Implemented (#47) |
| `POST` | `/api/v1/platform/facility-applications/{id}/documents/` | Upload on behalf of the facility | Platform admin | FR-ONB-01, FR-DOC-03 | Idem; RL: upload | Implemented (#47) |
| `POST` | `/api/v1/platform/facility-applications/{id}/send-resume-link/` | Email the applicant a resume link | Platform admin | FR-ONB-01 | | Implemented (#47) |
| `POST` | `/api/v1/platform/facility-applications/{id}/start-review/` | Open for review | Platform admin | FR-ONB-02 | `submitted` → `under_review` | Implemented (#47) |
| `POST` | `/api/v1/platform/facility-applications/{id}/documents/{document_id}/review/` | Accept a document or ask for a change | Platform admin | FR-ONB-02 | | Implemented (#47) |
| `POST` | `/api/v1/platform/facility-applications/{id}/documents/{document_id}/download-links/` | Link to view a verification document | Platform admin | FR-ONB-02, FR-DOC-05 | 5-minute signed URL; Audit | Implemented (#47) |
| `POST` | `/api/v1/platform/facility-applications/{id}/request-changes/` | Request changes, one comment per item | Platform admin | FR-ONB-02 | Idem; applicant notified | Implemented (#47) |
| `POST` | `/api/v1/platform/facility-applications/{id}/approve/` | Approve; creates the organisation and facility | Platform admin | FR-ONB-02, FR-ONB-08 | Step-up; Idem; Audit | Implemented (#47) |
| `POST` | `/api/v1/platform/facility-applications/{id}/reject/` | Reject with reasons | Platform admin | FR-ONB-02 | Step-up; applicant notified | Implemented (#47) |
| `GET`, `POST` | `/api/v1/platform/facility-applications/{id}/notes/` | Verification notes | Platform admin | FR-ONB-02 | Append-only | Implemented (#47) |
| `GET` | `/api/v1/platform/facility-applications/{id}/events/` | Verification history | Platform admin | FR-ONB-02 | Append-only | Implemented (#47) |
| `GET` | `/api/v1/platform/facilities/` | Facilities by status, type, district, licence state | Platform admin | FR-ONB-02 | No clinical data | Implemented (#47) |
| `GET` | `/api/v1/platform/facilities/{id}/` | Facility profile, status, licences | Platform admin | FR-ONB-02 | Facility admins carry `user_id` (link to the user directory, #198) | Implemented (#47) |
| `PATCH` | `/api/v1/platform/facilities/{id}/` | Set the MoH facility code (FOSA ID) and TIN | Platform admin | FR-ONB-09 | Step-up; Audit `facility.identifiers_updated`; the list and detail return both | Implemented (onboarding, 2026-11-03) |
| `GET` | `/api/v1/platform/facilities/export/` | The facility list as CSV for the Ministry of Health (FOSA ID, place, contacts, licence, admins, staff) | Platform admin | FR-ONB-09 | Same filters as the list; formula-safe; Audit `facility.list_exported` | Implemented (2026-11-03) |
| `GET` | `/api/v1/platform/facilities/{id}/status-events/` | Status history | Platform admin | FR-ONB-07 | | Implemented (#47) |
| `POST` | `/api/v1/platform/facilities/{id}/start-setup/` | `approved` → `setup` | Platform admin | FR-ONB-03 | Audit | Implemented (#47) |
| `POST` | `/api/v1/platform/facilities/{id}/go-live/` | `setup` → `live` when the checks pass | Platform admin | FR-ONB-03 | Step-up; Idem; failing checks in `fields` | Implemented (#47) |
| `POST` | `/api/v1/platform/facilities/{id}/suspend/`, `/reactivate/`, `/deactivate/` | Suspend, lift, or close a facility | Platform admin | FR-ONB-07, FR-ONB-09 | Step-up; Idem; reason required (planned under S2, built in S1) | Implemented (#47) |
| `GET`, `POST` | `/api/v1/platform/facilities/{id}/licences/` | Operating licences with expiry dates | Platform admin | FR-ONB-08 | Step-up (POST); reminders at 60 and 30 days | Implemented (#47) |
| `PATCH` | `/api/v1/platform/facilities/{id}/licences/{licence_id}/` | Correct a licence | Platform admin | FR-ONB-08 | Step-up; Ver | Implemented (#47) |
| `GET` | `/api/v1/platform/facilities/{id}/feature-flags/` | Feature flags for a facility | Platform admin | NFR-OPS-07 | | Implemented (#47) |
| `PUT`, `DELETE` | `/api/v1/platform/facilities/{id}/feature-flags/{code}/` | Override a flag, or return to the default | Platform admin | NFR-OPS-07 | Step-up; Audit | Implemented (#47) |
| `GET`, `PATCH` | `/api/v1/platform/feature-flags/` and `{code}/` | Flag defaults | Platform admin | NFR-OPS-07 | Step-up (PATCH) | Implemented (#47) |
| `GET`, `POST` | `/api/v1/platform/master-data/{kind}/` | List and create master data (kinds below) | Platform admin | FR-ONB-10 | Step-up (POST); rw/en/fr where shown to patients | Implemented (#47) |
| `GET`, `PATCH` | `/api/v1/platform/master-data/{kind}/{id}/` | Read, edit, retire or restore | Platform admin | FR-ONB-10 | Step-up (PATCH); Ver; no `DELETE` | Implemented (#47) |
| `GET` | `/api/v1/platform/master-data/{kind}/{id}/changes/` | Change history | Platform admin | FR-ONB-10 | | Implemented (#47) |
| `POST`, `GET` | `/api/v1/platform/master-data/{kind}/imports/` and `{import_id}/` | Upload a CSV import and poll its preview | Platform admin | FR-ONB-10 | Async; kinds with imports below | Implemented (#47) |
| `POST` | `/api/v1/platform/master-data/{kind}/imports/{import_id}/confirm/` | Apply a previewed import | Platform admin | FR-ONB-10 | Step-up; Idem; Async; Audit | Implemented (#47) |

Master data kinds (`{kind}`):

| Kind | Content | Imports |
|---|---|---|
| `locations` | Provinces, districts, sectors, cells, villages | Yes (national list; official codes: #48) |
| `facility-types` | Facility types, level of care | — |
| `service-catalogue-items` | Standard service names; optional `description_i18n` (public `description`) for the public service page | — |
| `insurers` | Insurers and schemes | — |
| `drugs` | Drug catalogue (Essential Medicines List: generic name, strength, form; controlled flag) | Yes |
| `diagnosis-codes` | ICD-10 subset with plain-language names | Yes |
| `symptoms` | Structured symptom list (FR-AI-01) | Yes |
| `public-holidays` | Yearly holidays | — |
| `reason-codes` | Dispute categories; reasons for no-show reversal, void, reorder, priority, exemption, access, break-glass | — |
| `document-templates` | Default templates for prescriptions, sick notes, receipts, referral letters | Not built in S1 (planned with S7) |

---

## S2 · Facility setup and staff

Requirements: FR-ONB-04..07, 09; FR-SCH-05..06; FR-BIL-02, 05; FR-ACC-05..07.

### Staff

| Method | Path | Purpose | Permission | Requirements | Notes | Status |
|---|---|---|---|---|---|---|
| `GET`, `PATCH` | `/api/v1/staff/facility/` | Active facility profile: description, contacts, address, map pin | Read: any member · Write: `facility.configure` | FR-ONB-04 | Singleton; Ver; every change goes to the change log | Planned |
| `POST` | `/api/v1/staff/facility/photos/` | Upload profile photos | `facility.configure` | FR-ONB-04, FR-DOC-03 | `multipart`; re-encoded, EXIF stripped | Planned |
| `GET`, `PUT` | `/api/v1/staff/facility/opening-hours/` | Weekly hours, service hours, breaks | `facility.configure` | FR-ONB-04, FR-SCH-05 | `PUT` replaces the week; Ver | Planned |
| `GET`, `PATCH` | `/api/v1/staff/facility/settings/` | Queue, booking, billing, document and notification settings | `facility.configure` | FR-ONB-04, FR-QUE-04 | Sections validated server-side; Ver; Step-up for billing | Planned |
| `GET`, `PUT` | `/api/v1/staff/facility/branding/` | Letterhead, logo, stamp image, document footer | `facility.configure` | FR-ONB-04, FR-DOC-01 | `multipart` images through the upload pipeline | Planned |
| `GET` | `/api/v1/staff/facility/config-changes/` | Configuration change log (old value, new value, who, when) | `facility.configure` | FR-ONB-04 | Append-only | Planned |
| `GET` | `/api/v1/staff/facility/setup-checklist/` | Setup checklist and what is missing | `facility.configure` | FR-ONB-03 | Computed from the configuration; returns `status_version` | Implemented (#85) |
| `POST` | `/api/v1/staff/facility/go-live/` | Publish: `setup` → `live` | `facility.configure` | FR-ONB-03 | Sends `version` = `status_version`; `422 business_rule_violation` lists missing steps; `409` with `error.current`; Step-up; Idem; Audit | Implemented (#85) |
| `GET`, `POST` | `/api/v1/staff/departments/` | Departments | `facility.configure` | FR-ONB-04 | Names rw/en/fr | Planned |
| `GET`, `PATCH` | `/api/v1/staff/departments/{id}/` | Edit or retire a department | `facility.configure` | FR-ONB-04 | Ver | Planned |
| `GET`, `POST` | `/api/v1/staff/services/` | Services: names, department, duration, bookable, walk-in, remote join, ticket prefix, level of care, age and sex rules, catalogue mapping | `facility.configure` | FR-ONB-04 | Ticket prefix unique per facility | Planned |
| `GET`, `PATCH` | `/api/v1/staff/services/{id}/` | Edit or retire a service | `facility.configure` | FR-ONB-04 | Ver | Planned |
| `GET`, `POST` | `/api/v1/staff/service-points/` | Rooms, desks, pharmacy windows | `facility.configure` | FR-ONB-04 | | Planned |
| `GET`, `PATCH` | `/api/v1/staff/service-points/{id}/` | Edit or retire a service point | `facility.configure` | FR-ONB-04 | Ver | Planned |
| `GET`, `POST` | `/api/v1/staff/calendar-events/` | Closures, holiday overrides, Umuganda behaviour, special days | `facility.configure` | FR-SCH-05 | Closures that hit bookings start the disruption flow (S5) | Planned |
| `PATCH`, `DELETE` | `/api/v1/staff/calendar-events/{id}/` | Edit or remove a future event | `facility.configure` | FR-SCH-05 | Soft delete; past events kept | Planned |
| `GET`, `POST` | `/api/v1/staff/schedule-templates/` | Doctor or service weekly blocks: service, service point, slot length, capacity, bookable share | `schedule.manage` (receptionist: read) | FR-SCH-06, FR-ONB-06 | Response lists cross-facility conflicts as time ranges only, never the other facility; list paginated | Implemented (#85) |
| `GET`, `PATCH`, `DELETE` | `/api/v1/staff/schedule-templates/{id}/` | Edit or end a block | `schedule.manage` | FR-SCH-06 | Ver; affects future unbooked slots only | Planned |
| `GET`, `POST` | `/api/v1/staff/schedule-exceptions/` | Leave, training, extra sessions | `schedule.manage`; doctors: own leave requests | FR-SCH-06 | Doctor requests start as `requested` | Planned |
| `PATCH` | `/api/v1/staff/schedule-exceptions/{id}/` | Edit an exception | `schedule.manage` | FR-SCH-06 | Ver | Planned |
| `POST` | `/api/v1/staff/schedule-exceptions/{id}/approve/` | Approve a leave request | `schedule.manage` | FR-SCH-06 | Approved leave in the future feeds the disruption flow | Planned |
| `GET`, `POST` | `/api/v1/staff/tariff-items/` | Price list: services, procedures, medicines, other charges | `facility.configure` | FR-BIL-05 | Step-up; amounts as `*_rwf` | Planned |
| `GET`, `PATCH` | `/api/v1/staff/tariff-items/{id}/` | Change a price from a date | `facility.configure` | FR-BIL-05 | Step-up; new version with `valid_from`; existing bills never change | Planned |
| `GET`, `POST` | `/api/v1/staff/insurer-rules/` | Accepted insurers: services, patient share, referral required, exclusions, ceiling | `facility.configure` | FR-BIL-02 | Step-up | Planned |
| `GET`, `PATCH` | `/api/v1/staff/insurer-rules/{id}/` | Change a rule from a date | `facility.configure` | FR-BIL-02 | Step-up; versioned with `valid_from` | Planned |
| `GET` | `/api/v1/staff/roles/` | Roles and their permissions | Any staff | FR-ACC-03 | Seeded data | Planned |
| `GET` | `/api/v1/staff/memberships/` | Staff list with two-step status and `last_login` and work `phone` | `staff.manage` | FR-ACC-01 | Paginated | Implemented (#85, upgrade 05 §5) |
| `GET`, `PATCH` | `/api/v1/staff/memberships/{id}/` | Roles and service points of a member | `staff.manage` | FR-ACC-01, FR-ACC-03 | Step-up; rotates the member's sessions; Audit | Planned |
| `POST` | `/api/v1/staff/memberships/{id}/deactivate/` | Remove access now | `staff.manage` | FR-ACC-06 | Ends sessions, closes sockets; Audit | Planned |
| `POST` | `/api/v1/staff/memberships/{id}/attest-licence/` | Attest that the clinician licence was checked | `staff.manage` | FR-ACC-07 | Needs the scan and a valid end date; required before a clinician can be scheduled or sign; Audit | Implemented |
| `POST` | `/api/v1/staff/memberships/{id}/refuse-licence/` | The licence could not be confirmed (reason) | `staff.manage` | FR-ACC-07 | Removes the attestation, emails the clinician; Audit `staff.membership.licence_refused` | Implemented (2026-11-03) |
| `POST` | `/api/v1/staff/memberships/{id}/mfa-reset/` | Reset a member's second factor | `staff.manage` | FR-ACC-04 | Step-up; the member is notified | Planned |
| `GET`, `POST` | `/api/v1/staff/invitations/` | Invite by email with roles and service points, and optionally the person's name and work phone | `staff.manage` | FR-ACC-05, FR-ONB-05 | Step-up; Idem; 7-day expiry (an expired one doesn't block a re-invite); list paginated; refused when deactivated; the name and phone prefill the new account | Implemented (#85) |
| `POST` | `/api/v1/staff/invitations/{id}/resend/` | Send the invitation again | `staff.manage` | FR-ACC-05 | New token, old one invalidated | Planned |
| `POST` | `/api/v1/staff/invitations/{id}/revoke/` | Cancel an invitation | `staff.manage` | FR-ACC-05 | | Planned |
| `POST` | `/api/v1/staff/auth/invitations/lookup/` | Show facility, inviter and roles for an invitation token, and `suggested_name` (the inviter's name for the person) | Invitee (token in body) | FR-ACC-05 | RL: auth | Planned |
| `POST` | `/api/v1/staff/auth/invitations/accept/` | Accept: set a password (new account, then MFA setup) or confirm while signed in (existing account) | Invitee (token in body); existing account: signed-in staff session | FR-ACC-05, FR-ACC-04 | Single use; new: `LoginResult`; existing: `StaffMe`, `401` when not signed in | Implemented (#85) |
| `GET`, `PATCH` | `/api/v1/staff/clinician-profile/` | Own council, licence number and end date, licence scan, profession, specialty (list), sex, qualifications, photo | Staff (self) | FR-ACC-07 | Uploads by id (`clinician_licence`, `clinician_photo`); a new licence clears attestations; Audit | Implemented (2026-11-03) |

### Platform

| Method | Path | Purpose | Permission | Requirements | Notes | Status |
|---|---|---|---|---|---|---|
| `POST` | `/api/v1/platform/facilities/{id}/suspend/` | Suspend with a reason | Platform admin | FR-ONB-07 | Step-up; hidden from search, new bookings blocked, today keeps working; patients with future bookings notified | Implemented in S1 (#47) |
| `POST` | `/api/v1/platform/facilities/{id}/reactivate/` | Lift a suspension | Platform admin | FR-ONB-07 | Step-up | Implemented in S1 (#47) |
| `POST` | `/api/v1/platform/facilities/{id}/deactivate/` | Facility leaves or closes | Platform admin | FR-ONB-07, FR-ONB-09 | Step-up; starts the full data export (S11) | Implemented in S1 (#47) |
| `POST` | `/api/v1/platform/memberships/{id}/mfa-reset/` | Reset a facility admin's second factor | Platform admin | FR-ACC-04 | Step-up; the user is notified | Planned |

---

## S3 · Patients and identity

Requirements: FR-PAT-01..09, 13, 14; FR-BIL-01; FR-SEC-04, 05, 08, 10, 12. Security: identifiers stored as AES-256-GCM ciphertext with a blind index; masked values; audited reveal. Built from the [S3 contract](../architecture/contracts/sprint-03-patients.md) §3 (row numbers PA, ST, PL), which wins over these summaries. "Linked account" = an active account link to the profile; rights per link (self, guardian, delegate) in contract §2.5.

### Patient

| Method | Path | Purpose | Permission | Requirements | Notes | Status |
|---|---|---|---|---|---|---|
| `POST` | `/api/v1/patient/auth/email-verification/` | Send a verification email | Patient session | FR-PAT-02 | Not in the S3 contract (D-12); not yet scheduled | Planned |
| `POST` | `/api/v1/patient/auth/email-verification/confirm/` | Confirm with the emailed token | Token (body) | FR-PAT-02 | As above | Planned |
| `POST` | `/api/v1/patient/auth/magic-link/` | Email a one-time login link | Public | FR-PAT-02 | As above | Planned |
| `POST` | `/api/v1/patient/auth/magic-link/confirm/` | Log in with the link token | Token (body) | FR-PAT-02 | As above | Planned |
| `POST` | `/api/v1/patient/auth/step-up/` | Re-authenticate for sensitive actions | Patient session | FR-SEC-06 | As above; delegation invites re-check the password inline | Planned |
| `GET` | `/api/v1/patient/profiles/` | Profiles the account can act for (self first) | Patient session | FR-PAT-03 | PA1 | Implemented (#57) |
| `GET`, `PATCH` | `/api/v1/patient/profiles/{patient_id}/` | Profile, completion; edit names, birth date, sex, contacts | Linked account (names, birth date, sex: self or guardian) | FR-PAT-01, 02, 13, FR-SEC-12 | PA2–3; Ver | Implemented (#57) |
| `GET`, `POST` | `/api/v1/patient/profiles/{patient_id}/identifiers/` | National ID, passport, refugee ID, birth certificate | Linked account (`POST`: self or guardian) | FR-PAT-07, FR-SEC-10 | PA4–5; masked; a checked document changes only at reception; RL: verification | Implemented (#57) |
| `POST` | `/api/v1/patient/profiles/{patient_id}/identifiers/{identifier_id}/reveal/` | Show the full number | Self or guardian | FR-SEC-10 | PA6; `no-store`; RL: reveal; Audit | Implemented (#57) |
| `POST` | `/api/v1/patient/dependents/` | Add a child (guardian) or a consenting adult (delegate) | Patient session | FR-PAT-03, FR-SEC-04 | PA7; records the consent (current version); max 10 profiles; Idem (`Idempotency-Key`) | Implemented (#57, R2 #84) |
| `GET`, `POST` | `/api/v1/patient/delegations/` | Access granted and received; create a one-time code | Patient session (`POST`: self or guardian + password) | FR-PAT-03 | PA8–9; RL: verification; Audit | Implemented (#57) |
| `POST` | `/api/v1/patient/delegations/accept/` | Accept a shared code | Patient session | FR-PAT-03 | PA10; RL: verification | Implemented (#57) |
| `POST` | `/api/v1/patient/delegations/{id}/revoke/` | End a link or cancel an invite | Grantor, or the holder leaving | FR-PAT-03 | PA11; immediate | Implemented (#57) |
| `GET`, `POST` | `/api/v1/patient/profiles/{patient_id}/insurance-profiles/` | Insurance cards | Linked account | FR-BIL-01 | PA12–13 | Implemented (#57) |
| `PATCH` | `/api/v1/patient/insurance-profiles/{id}/` | Update a card | Linked account | FR-BIL-01 | PA14; Ver; identity changes reset the status | Implemented (#57) |
| `POST` | `/api/v1/patient/insurance-profiles/{id}/deactivate/` | Stop using a card | Linked account | FR-BIL-01 | PA15; kept for history | Implemented (#57) |
| `POST` | `/api/v1/patient/insurance-profiles/{id}/card-images/` | Card photo, front or back | Linked account | FR-BIL-01, FR-DOC-03 | PA25; S1 upload pipeline; RL: upload | Implemented (#57) |
| `POST` | `/api/v1/patient/insurance-profiles/{id}/card-images/{side}/download-links/` | 5-minute link to a card photo | Linked account | FR-BIL-01, FR-DOC-05 | PA26 | Implemented (#57) |
| `POST`, `DELETE` | `/api/v1/patient/profiles/{patient_id}/photo/` | Add/replace (multipart `file`, JPEG/PNG/HEIC ≤ 5 MB) or remove the profile photo | Linked account with `edit_contacts` (self or guardian) | FR-PAT-01 | `201`/`200 PatientProfileDetail` (`has_photo`); S1 upload pipeline (scanned, then attached); RL: upload; Audit `patients.photo.updated` / `.removed` | Implemented (2026-11-05) |
| `POST` | `/api/v1/patient/profiles/{patient_id}/photo/download-links/` | 5-minute link to the profile photo | Linked account | FR-PAT-01 | `{url, expires_at}`; `404` when none; `422 file_not_clean` while scanning | Implemented (2026-11-05) |
| `GET` | `/api/v1/patient/profiles/{patient_id}/health-profile/` | Allergies, conditions, medicines | Linked account | FR-PAT-08, 13 | PA16 | Implemented (#57) |
| `POST` | `/api/v1/patient/profiles/{patient_id}/{kind}/` | Add an allergy, condition or medicine (`allergies`, `conditions`, `medications`) | Linked account | FR-PAT-08 | PA17; unverified until a clinician checks | Implemented (#57) |
| `POST` | `/api/v1/patient/profiles/{patient_id}/{kind}/{item_id}/entered-in-error/` | Remove an own unverified item | Linked account | FR-PAT-08 | PA18 | Implemented (#57) |
| `POST` | `/api/v1/patient/record-claims/` | Claim a record a facility created | Patient session (self) | FR-PAT-06 | PA19; code to the contact email, or ID check at reception; every refusal after the lookup is the same generic `422`; RL: verification; Audit | Implemented (#57, R2 #84) |
| `GET` | `/api/v1/patient/record-claims/{id}/` | Claim status | Claim owner | FR-PAT-06 | PA20 | Implemented (#57) |
| `POST` | `/api/v1/patient/record-claims/{id}/verify/` | Confirm with the emailed code | Claim owner | FR-PAT-06 | PA21; 5 attempts, 15 minutes | Implemented (#57) |
| `GET`, `POST` | `/api/v1/patient/consents/` | Consents by kind and version; grant or withdraw | Patient session | FR-SEC-04, FR-SEC-05 | PA22–23; append-only; current version only (`422`, `fields.version`); account toggles `notifications`, `location` | Implemented (#57, R2 #84) |
| `GET` | `/api/v1/patient/profiles/{patient_id}/access-history/` | Who opened or changed the profile | Self or guardian | FR-PAT-14, FR-SEC-08 | PA24; codes, the client writes the sentence | Implemented (#57) |

### Staff

`{fp_id}` is the facility patient record of the active facility.

| Method | Path | Purpose | Permission | Requirements | Notes | Status |
|---|---|---|---|---|---|---|
| `POST` | `/api/v1/staff/patients/search/` | Find by name, phone, national ID, other document, file number, MediLink number | `patients.view` | FR-PAT-09, FR-PAT-04 | ST1; criteria in the body; RL: search; Audit | Implemented (#57) |
| `POST` | `/api/v1/staff/patients/duplicate-checks/` | Likely matches before registering | `patient.register` | FR-PAT-05 | ST2; RL: search; Audit | Implemented (#57) |
| `POST` | `/api/v1/staff/patients/` | Register a walk-in with minimum fields and spoken consent | `patient.register` | FR-PAT-04, 01, 05, 07, FR-SEC-04 | ST3; Idem; possible duplicates need confirmation | Implemented (#57) |
| `POST` | `/api/v1/staff/patients/add-existing/` | Add a patient already on MediLink | `patient.register` | FR-PAT-01, 05 | ST4; proof = MediLink number or document; Idem | Implemented (#57) |
| `GET`, `PATCH` | `/api/v1/staff/patients/{fp_id}/` | Facility patient record | `GET`: `patients.view` · `PATCH`: `patient.register` | FR-PAT-01, 07, FR-SEC-03 | ST5–6; Ver; `GET` needs a care relationship or a given reason (`403 access_reason_required`, then ST28); staff-as-patient always needs a reason; every read audited | Implemented (#57, R2 #84) |
| `POST` | `/api/v1/staff/patients/{fp_id}/access-reasons/` | Give a reason to open a record outside a care relationship | `patients.view`, `clinical.view` or `prescription.view` | FR-SEC-03 | ST28; `{reason_code, reason_text}` → `201 {expires_at}`; kept in the staff session for 15 min; Audit | Implemented (R2 #84) |
| `POST` | `/api/v1/staff/patients/{fp_id}/identifiers/` | Add or replace a document; mark it checked | `patient.register` | FR-PAT-07, FR-SEC-10 | ST7 | Implemented (#57) |
| `POST` | `/api/v1/staff/patients/{fp_id}/reveal/` | Show a full identifier or phone number, with a reason | Identifier: `patients.identifier_reveal` · phone: `patients.view` | FR-SEC-10 | ST8; `no-store`; RL: reveal; Audit | Implemented (#57) |
| `GET`, `POST` | `/api/v1/staff/patients/{fp_id}/insurance-profiles/` | Insurance cards | `GET`: `patients.view` · `POST`: `patient.register` | FR-BIL-01 | ST9–10 | Implemented (#57) |
| `PATCH` | `/api/v1/staff/patients/{fp_id}/insurance-profiles/{profile_id}/` | Edit a card | `patient.register` | FR-BIL-01 | ST11; Ver | Implemented (#57) |
| `POST` | `/api/v1/staff/patients/{fp_id}/insurance-profiles/{profile_id}/verify/` | Mark verified or rejected | `patients.insurance_verify` | FR-BIL-01 | ST12; Audit | Implemented (#57) |
| `POST` | `/api/v1/staff/patients/{fp_id}/insurance-profiles/{profile_id}/card-images/` | Capture a card photo at the desk | `patient.register` | FR-BIL-01, FR-DOC-03 | ST26; S1 upload pipeline | Implemented (#57) |
| `POST` | `/api/v1/staff/patients/{fp_id}/insurance-profiles/{profile_id}/card-images/{side}/download-links/` | 5-minute link to a card photo | `patients.view` | FR-BIL-01, FR-DOC-05 | ST27 | Implemented (#57) |
| `POST` | `/api/v1/staff/patients/{fp_id}/photo/download-links/` | 5-minute link to the patient's own profile photo (recognise them at the desk) | `patients.view` (record at this facility) | FR-PAT-01 | `{url, expires_at}`; `404` when none; the detail shows `has_photo`; Audit `patients.photo.viewed` | Implemented (2026-11-05) |
| `GET` | `/api/v1/staff/patients/{fp_id}/health-profile/` | Allergies, conditions, medicines | `clinical.view` (all) or `prescription.view` (allergies only) | FR-PAT-08, FR-SEC-03 | ST13; care relationship or a given reason (as ST5); Audit | Implemented (#57, R2 #84) |
| `POST` | `/api/v1/staff/patients/{fp_id}/{kind}/` | Add a verified allergy, condition or medicine | `clinical.write` | FR-PAT-08 | ST14 | Implemented (#57) |
| `POST` | `/api/v1/staff/patients/{fp_id}/{kind}/{item_id}/review/` | Verify, refute or mark entered in error | `clinical.write` | FR-PAT-08 | ST15; note required except to verify; Audit | Implemented (#57) |
| `POST` | `/api/v1/staff/patients/{fp_id}/consents/` | Care or research consent given at the desk | `patient.register` | FR-SEC-04 | ST16; channel `staff_assisted` | Implemented (#57) |
| `POST` | `/api/v1/staff/patients/{fp_id}/claim-confirmations/` | Confirm a record claim after an ID check | `patient.register` | FR-PAT-06 | ST17; idempotent (a replay at the same facility returns the completed claim); Audit | Implemented (#57, R2 #84) |
| `GET`, `POST` | `/api/v1/staff/merge-requests/` | Merge requests of this facility; request a merge | `patients.merge_request` or `patients.merge_approve` (`POST`: `merge_request`) | FR-PAT-05 | ST18–19; Idem; Audit | Implemented (#57) |
| `GET` | `/api/v1/staff/merge-requests/{id}/` | Request with preview | As above | FR-PAT-05 | ST20 | Implemented (#57) |
| `POST` | `/api/v1/staff/merge-requests/{id}/approve/` | Approve and run the merge | `patients.merge_approve` | FR-PAT-05 | ST21; step-up; requester ≠ approver; facility scope only | Implemented (#57) |
| `POST` | `/api/v1/staff/merge-requests/{id}/reject/` | Reject | `patients.merge_approve` | FR-PAT-05 | ST22; reason required | Implemented (#57) |
| `POST` | `/api/v1/staff/merge-requests/{id}/cancel/` | Cancel own request | Requester | FR-PAT-05 | ST23 | Implemented (#57) |
| `POST` | `/api/v1/staff/merge-requests/{id}/escalate/` | Send to the platform team (no other approver here) | Requester | FR-PAT-05 | ST24 | Implemented (#57) |
| `POST` | `/api/v1/staff/merge-requests/{id}/undo/` | Reverse a facility merge | `patients.merge_approve` | FR-PAT-05 | ST25; step-up; approver rule (not the requester; not escalated); reports skipped rows | Implemented (#57, R2 #84) |

### Platform

| Method | Path | Purpose | Permission | Requirements | Notes | Status |
|---|---|---|---|---|---|---|
| `GET` | `/api/v1/platform/merge-requests/` | Cross-facility, escalated and claim merges | Platform admin | FR-PAT-05 | PL1; never health items | Implemented (#57) |
| `GET` | `/api/v1/platform/merge-requests/{id}/` | Request with preview counts | Platform admin | FR-PAT-05 | PL2 | Implemented (#57) |
| `POST` | `/api/v1/platform/merge-requests/{id}/approve/` | Approve and run | Platform admin | FR-PAT-05 | PL3; step-up | Implemented (#57) |
| `POST` | `/api/v1/platform/merge-requests/{id}/reject/` | Reject | Platform admin | FR-PAT-05 | PL4; reason required | Implemented (#57) |
| `POST` | `/api/v1/platform/merge-requests/{id}/undo/` | Undo any merge, including claims | Platform admin | FR-PAT-05 | PL5; step-up | Implemented (#57) |

---

## S4 · Visits and the live queue

Requirements: FR-QUE-01..17. Tests: concurrency (parallel call next and check-in) and the 06:00–10:00 peak (NFR-PERF-01, 04).

Dependency: the roadmap puts check-in of booked patients and the Expected list (FR-QUE-02, 03, 06) in S4, but bookings arrive in S5. The booked check-in and remote-join endpoints are listed in S5; S4 builds the queue with walk-ins plus seeded bookings and remote tickets. The S4 contract must confirm this split.

### Staff

| Method | Path | Purpose | Permission | Requirements | Notes | Status |
|---|---|---|---|---|---|---|
| `GET` | `/api/v1/staff/visits/` | Today board: on-site visits by service and stage, with flags | `queue.operate`; doctors read | FR-QUE-01, FR-QUE-02 | Filters `date`, `service`, `stage`, `status`; Expected list comes from bookings (S5) | Planned |
| `POST` | `/api/v1/staff/visits/` | Walk-in: create the visit and check in → first ticket | `queue.operate` | FR-QUE-01, FR-QUE-03 | Idem; one ticket even if pressed twice | Planned |
| `GET` | `/api/v1/staff/visits/{id}/` | Visit with stages, tickets and timeline; `follow_up` (date, booked time and code, doctor) for the next-visit card (#207) | `queue.operate` or `queue.call` | FR-QUE-01, FR-DOC-08 (proposed) | No clinical fields | Implemented (S4; `follow_up` W8) |
| `POST` | `/api/v1/staff/visits/{id}/complete/` | End the visit | `queue.call` or `queue.operate` | FR-QUE-01, FR-CLN-05 | `422` if the consultation is unsigned (from S6) | Planned |
| `GET` | `/api/v1/staff/tickets/` | Queue of a service and stage in calling order | `queue.operate`, `queue.call` | FR-QUE-05 | Filters `service`, `stage`, `state`, `assigned_to=me` | Planned |
| `GET` | `/api/v1/staff/tickets/{id}/` | One ticket | `queue.operate`, `queue.call` | FR-QUE-09 | | Planned |
| `GET` | `/api/v1/staff/tickets/{id}/events/` | Ticket state history (who, when, reason, device) | `queue.operate`, `queue.call` | FR-QUE-09 | Append-only; evidence for disputes | Planned |
| `POST` | `/api/v1/staff/services/{id}/call-next/` | Call the next patient by the ordering rules | `queue.call` | FR-QUE-05, FR-QUE-06, FR-QUE-07, FR-QUE-08 | Atomic (`SELECT … FOR UPDATE SKIP LOCKED`); Idem; body: stage, service point | Planned |
| `POST` | `/api/v1/staff/tickets/{id}/call/` | Call a specific ticket | `queue.call` | FR-QUE-08 | Ver | Planned |
| `POST` | `/api/v1/staff/tickets/{id}/recall/` | Call again | `queue.call` | FR-QUE-09 | Ver | Planned |
| `POST` | `/api/v1/staff/tickets/{id}/no-response/` | Mark no response; re-insert N places back (max 2), then left | `queue.call`, `queue.operate` | FR-QUE-09 | Ver | Planned |
| `POST` | `/api/v1/staff/tickets/{id}/start/` | Start service (creates the consultation draft from S6) | `queue.call` | FR-QUE-09 | Ver; Idem | Planned |
| `POST` | `/api/v1/staff/tickets/{id}/hold/` | On hold, awaiting results | `queue.call` | FR-QUE-09 | Ver | Planned |
| `POST` | `/api/v1/staff/tickets/{id}/return/` | Back from results with return priority | `queue.operate`, `queue.call` | FR-QUE-05 | Ver | Planned |
| `POST` | `/api/v1/staff/tickets/{id}/next-stage/` | Done here; ticket for the next stage (payment, pharmacy) | `queue.call`, `queue.operate` | FR-QUE-04 | Ver; Idem | Planned |
| `POST` | `/api/v1/staff/tickets/{id}/transfer/` | Move to another service, keeping the arrival time | `queue.operate`, `queue.call` | FR-QUE-17 | Ver; reason | Planned |
| `POST` | `/api/v1/staff/tickets/{id}/set-priority/` | Priority or emergency flag with a reason | `queue.operate`; doctors for emergency | FR-QUE-05 | Ver; reason code required; Audit | Planned |
| `POST` | `/api/v1/staff/tickets/{id}/reorder/` | Move in the queue with a reason | `queue.operate` | FR-QUE-10 | Ver; reason code + note; counted per staff member; Audit | Planned |
| `POST` | `/api/v1/staff/tickets/{id}/step-out/` | Patient steps out (up to 30 min) | `queue.operate` | FR-QUE-09 | Ver | Planned |
| `POST` | `/api/v1/staff/tickets/{id}/cancel/` | Cancel a waiting ticket | `queue.operate` | FR-QUE-09 | Ver; reason | Planned |
| `POST` | `/api/v1/staff/tickets/{id}/mark-left/` | Patient left without service | `queue.operate` | FR-QUE-09 | Ver | Planned |
| `POST` | `/api/v1/staff/tickets/{id}/confirm-arrival/` | Reception confirms a remote joiner is on site (the ticket can then be called) | `queue.operate` | FR-QUE-07 | Ver; `422` when not remote or already confirmed; "I'm here" alone is a claim (sprint-05 R10) | Implemented (R4, #86) |
| `POST` | `/api/v1/staff/tickets/{id}/triage/` | The triage nurse sets the urgency (`normal`, `priority` with class, `emergency` with a reason), a short note, and sends the patient to the doctor | `triage.operate` | FR-QUE-22 (proposed) | Ver; triage stage, in service; vitals first through `visits/{id}/vitals/` or `no_vitals_reason` (`422`); note encrypted (C3); audit `visits.ticket.triage`; the doctor reads it as `reason_for_visit.nurse_triage` | Implemented (#200) |
| `GET` | `/api/v1/staff/queue/mine/?stage=triage` | The triage nurse's current patient and the triage queue of every service | `triage.operate` | FR-QUE-22 (proposed) | Queue setting `triage_enabled` (off by default): check-in starts at `triage` instead of the doctor; emergencies skip it; triage rows carry `allergies`; a nurse's board shows triage queues only | Implemented (#200) |
| `POST` | `/api/v1/staff/tickets/{id}/send-to-lab/` | The doctor sends the patient in service to the lab; the consultation stays a draft | `queue.call` | FR-CLN-11 (proposed) | Ver; consultation stage, in service; `422` without an ordered test; opens a `lab` ticket; the completion guard (FR-CLN-05) lets this one move pass | Implemented (#201) |
| `GET` | `/api/v1/staff/queue/mine/?stage=lab` | The lab technician's current patient and the lab queue of every service | `lab.operate` | FR-CLN-11 (proposed) | Lab rows carry no patient words or symptoms (the lab reads the request reason); a technician's board shows lab queues only; when every test is resulted the patient returns to the ordering doctor's queue with return priority, assigned to that doctor | Implemented (#201) |
| `GET` | `/api/v1/staff/queue-reorders/` | Reorders to review | `facility.configure` | FR-QUE-10 | Filters `reviewed`, `staff` | Planned |
| `POST` | `/api/v1/staff/queue-reorders/{id}/review/` | Mark a reorder as reviewed, with a comment | `facility.configure` | FR-QUE-10 | Audit | Planned |
| `GET`, `PUT` | `/api/v1/staff/duty-status/` | Own status: on duty at a service point, break until, emergency, off | Doctor (self) | FR-QUE-14 | Singleton; updates estimates | Planned |
| `GET` | `/api/v1/staff/duty-statuses/` | Who is on duty and their state | Any staff | FR-QUE-14 | | Planned |
| `GET` | `/api/v1/staff/services/{id}/wait-estimate/` | Current estimate range and status message | Any staff | FR-QUE-11 | Rounded to 5 minutes | Planned |
| `GET`, `POST` | `/api/v1/staff/display-links/` | Waiting-room display links per facility or service | `facility.configure` | FR-QUE-13 | Token shown once; stored hashed | Planned |
| `POST` | `/api/v1/staff/display-links/{id}/revoke/` | Revoke a display link | `facility.configure` | FR-QUE-13 | Closes the display socket | Planned |

### Patient

| Method | Path | Purpose | Permission | Requirements | Notes | Status |
|---|---|---|---|---|---|---|
| `GET` | `/api/v1/patient/tickets/` | Active tickets of the account's profiles | Patient session | FR-QUE-11 | Filter `patient_id` | Planned |
| `GET` | `/api/v1/patient/tickets/{id}/` | Live tracker: number, stage, people ahead, wait range, time to leave, status message | Linked account | FR-QUE-11 | Small payload for weak networks | Planned |
| `POST` | `/api/v1/patient/tickets/{id}/running-late/` | Tell the facility "I'm running late" | Linked account | FR-QUE-07 | | Planned |
| `POST` | `/api/v1/patient/tickets/{id}/cancel/` | Give up the place | Linked account | FR-QUE-09 | Ver | Planned |
| `GET`, `POST` | `/api/v1/patient/travel-times/` | Travel time per facility for time-to-leave | Patient session | FR-QUE-11 | | Planned |
| `PATCH` | `/api/v1/patient/travel-times/{id}/` | Change a travel time | Patient session | FR-QUE-11 | | Planned |

### Public (display)

| Method | Path | Purpose | Permission | Requirements | Notes | Status |
|---|---|---|---|---|---|---|
| `GET` | `/api/v1/public/displays/{token}/` | Now serving, next 5 tickets per service, announcements | Display token | FR-QUE-13 | Ticket numbers and rooms only, never names; README §6 item 5 | Planned |

### WebSockets

| Path | Events | Requirements | Status |
|---|---|---|---|
| `/ws/v1/staff/facilities/{facility_id}/queue/` | `ticket.updated`, `visit.updated`, `duty_status.updated` | FR-QUE-12 | Planned |
| `/ws/v1/patient/tickets/{ticket_id}/` | `ticket.updated`, `ticket.called` | FR-QUE-12, FR-NOT-12 | Planned |
| `/ws/v1/display/{token}/` | `display.updated`, `ticket.called` (chime) | FR-QUE-13 | Planned |

Group joins use the same policy as the REST equivalent; the server closes sockets on logout, deactivation, loss of permission and display-link revocation.

---

## S5 · Booking, remote join and calendars

Requirements: FR-SCH-01..15; FR-BIL-03; FR-AI-01.

### Public

| Method | Path | Purpose | Permission | Requirements | Notes | Status |
|---|---|---|---|---|---|---|
| `GET` | `/api/v1/public/facilities/` | Search: location, service, insurance, open now/today, level of care, availability, type, ownership, declared 24-hour emergency department (`emergency`) | Public | FR-SCH-01, FR-SCH-04, FR-BIL-03 | Live facilities only; distance, open status, accepts insurance, fee, estimated share, next slot, queue load, live `waiting` and `wait_range`, accepted `insurers` (contract PT §2.1), referral hint; RL: search | Planned |
| `POST` | `/api/v1/public/facilities/search/` | Search by text and insurance: `q` matches name, sector, district, type and service; an insurer word in `q` (mutuelle, mituweli, cbhi, rama, rssb, mmi, military, private, privé) or `insurer_code` puts places that take it first | Public | FR-SCH-01, FR-BIL-03 | `insured_only` keeps only those (implied when the insurer is only typed); the page echoes `insurer_code`; each result has `cover_url` and `logo_url` (null without one); RL: search | Implemented (2026-11-18) |
| `GET` | `/api/v1/public/facilities/{slug}/` | Facility profile | Public | FR-SCH-02, FR-SCH-03 | Pre-rendered by patient-web at build time; each service carries the live `waiting` count and `wait_range` (contract PT §2.1) | Planned |
| `GET` | `/api/v1/public/facilities/{slug}/photos/{upload_id}/` | One of the facility's public photos | Public | FR-SCH-02 | 302 to a short-lived signed link; only clean photos the admin still lists. The profile also carries `email`, `website` and `photos` | Built |
| `GET` | `/api/v1/public/facilities/{slug}/services/` | Services with fees, insurers and estimated share | Public | FR-SCH-02, FR-BIL-03 | `?insurer=` for the share | Planned |
| `GET` | `/api/v1/public/facilities/{slug}/doctors/` | Doctors: name, specialty, days present | Public | FR-SCH-02 | No other personal data | Planned |
| `GET` | `/api/v1/public/facilities/{slug}/queue-load/` | Queue load (low/medium/high) and walk-in wait estimate | Public | FR-SCH-02 | Cached a few seconds | Planned |
| `GET` | `/api/v1/public/facilities/{slug}/slots/` | Bookable slots for a service, doctor and date range | Public | FR-SCH-07 | Server recomputes at hold time | Planned |
| `GET` | `/api/v1/public/symptoms/` | Structured symptom list | Public | FR-AI-01, FR-SCH-10 | rw/en/fr | Planned |
| `POST` | `/api/v1/public/triage/` | Rules-based symptom triage: urgency, service, level of care | Public | FR-AI-04, FR-AI-05, FR-AI-06, FR-AI-07 | [Contract PT §2.2](../architecture/contracts/public-pages-and-triage.md); rules `2026.11-p1`, not signed off (#93); logged without personal data; 20/min | Implemented |
| `POST` | `/api/v1/public/assistant/` | AI symptom assistant, one chat turn: follow-up question, hedged answer ("you may have…, see a doctor") or 912 | Public | FR-AI-04, FR-AI-05, FR-AI-07 | Issue #159; **test phase**: NVIDIA hosted API, off unless `ASSISTANT_ENABLED` and `NVIDIA_API_KEY`; naive Bayes matcher `nb-2026.11-1` runs locally; red flags answer 912 without the model; logged without the person's words; 15/min; 503 `assistant_unavailable` | Implemented (test phase) |
| `GET` | `/api/v1/public/calendar-feeds/{token}/` | Private `.ics` subscription feed | Feed token | FR-SCH-11 | `text/calendar`; no clinical details; revocable; README §6 item 6 | Planned |

### Patient

| Method | Path | Purpose | Permission | Requirements | Notes | Status |
|---|---|---|---|---|---|---|
| `POST` | `/api/v1/patient/slot-holds/` | Hold a slot for 5 minutes | Patient session | FR-SCH-08 | Atomic; `409 conflict` with nearby alternatives when just taken | Planned |
| `DELETE` | `/api/v1/patient/slot-holds/{id}/` | Release a hold | Patient session | FR-SCH-08 | | Planned |
| `GET` | `/api/v1/patient/bookings/` | Bookings of the account's profiles | Patient session | FR-SCH-08, FR-SCH-11 | Filter `patient_id`, `status` | Planned |
| `POST` | `/api/v1/patient/bookings/` | Confirm a booking from a hold: who, insurance, reason for visit | Linked account | FR-SCH-08, FR-SCH-10, FR-BIL-03 | Idem; caps: 3 active, 1 per service per day; strike limits | Planned |
| `GET` | `/api/v1/patient/bookings/{id}/` | Booking with code, cost estimate, status | Linked account | FR-SCH-08 | | Planned |
| `POST` | `/api/v1/patient/bookings/{id}/cancel/` | Cancel (late if within the cut-off) | Linked account | FR-SCH-08 | Ver | Planned |
| `POST` | `/api/v1/patient/bookings/{id}/reschedule/` | Move to a held slot | Linked account | FR-SCH-08 | Ver; Idem; keeps history | Planned |
| `POST` | `/api/v1/patient/bookings/{id}/accept-change/` | Accept or decline a facility disruption proposal | Linked account | FR-SCH-14 | Never counts as a patient cancellation | Planned |
| `POST` | `/api/v1/patient/bookings/{id}/calendar-file/` | Get an `.ics` file for one booking | Linked account | FR-SCH-11 | Returns a short-lived link | Planned |
| `POST` | `/api/v1/patient/remote-joins/` | Join today's queue remotely → ticket | Linked account | FR-SCH-09, FR-QUE-07 | Idem; before the cut-off; service must allow it | Planned |
| `POST` | `/api/v1/patient/visits/{id}/arrived/` | "I'm here" for a remote ticket: records the claim only | Linked account (`self`, `guardian`) | FR-QUE-07 | Sets `remote_arrival_claimed_at`; reception confirms; self check-in is P2 (FR-QUE-18) (sprint-05 B9) | Implemented (R4, #86) |
| `GET` | `/api/v1/patient/calendar-entries/` | Own and dependents' appointments and follow-ups | Patient session | FR-SCH-11 | `from`, `to` | Planned |
| `GET`, `POST` | `/api/v1/patient/calendar-feeds/` | Create the private subscription link | Patient session | FR-SCH-11 | Token shown once | Planned |
| `POST` | `/api/v1/patient/calendar-feeds/{id}/revoke/` | Revoke the subscription link | Patient session | FR-SCH-11 | | Planned |
| `GET` | `/api/v1/patient/no-show-strikes/` | Strikes and any booking limit | Patient session | FR-SCH-13 | | Planned |

### Staff

| Method | Path | Purpose | Permission | Requirements | Notes | Status |
|---|---|---|---|---|---|---|
| `GET` | `/api/v1/staff/bookings/` | Reception calendar (day/week) and the Expected list | `queue.operate`; doctors: own | FR-SCH-12, FR-QUE-02 | Filters `date`, `from`, `to`, `service`, `doctor`, `status` | Planned |
| `GET` | `/api/v1/staff/slots/` | Availability for phone booking | `queue.operate` | FR-SCH-07, FR-SCH-12 | | Planned |
| `POST` | `/api/v1/staff/slot-holds/` | Hold a slot while on the phone | `queue.operate` | FR-SCH-08 | Atomic | Planned |
| `POST` | `/api/v1/staff/bookings/` | Phone booking, also for patients without an account | `queue.operate` | FR-SCH-08 | Idem | Planned |
| `POST` | `/api/v1/staff/bookings/{id}/check-in/` | Check in a booked patient → visit + ticket | `queue.operate` | FR-QUE-03, FR-QUE-06 | Idem; late beyond the grace window → walk-in ordering | Planned |
| `POST` | `/api/v1/staff/bookings/{id}/cancel/` | Cancel for the patient | `queue.operate` | FR-SCH-08 | Ver; reason | Planned |
| `POST` | `/api/v1/staff/bookings/{id}/reschedule/` | Move to a held slot | `queue.operate` | FR-SCH-08 | Ver; Idem | Planned |
| `POST` | `/api/v1/staff/bookings/{id}/reverse-no-show/` | Reverse an automatic no-show | `queue.operate` | FR-SCH-13 | Reason required; recalculates strikes; Audit | Planned |
| `POST` | `/api/v1/staff/tickets/{id}/check-in/` | Check in a remote joiner who arrived | `queue.operate` | FR-QUE-07 | Idem | Planned |
| `GET` | `/api/v1/staff/calendar-entries/` | Doctor calendar: schedule, leave, booked load | Doctor (own) or `schedule.manage` | FR-SCH-12 | Own schedule only at the active facility; cross-facility view is an open point | Planned |
| `GET`, `POST` | `/api/v1/staff/disruptions/` | Declare a disruption → affected bookings and remote tickets | `queue.operate`, `facility.configure` | FR-SCH-14 | | Planned |
| `GET` | `/api/v1/staff/disruptions/{id}/` | Disruption with affected items and patient responses | `queue.operate`, `facility.configure` | FR-SCH-14 | | Planned |
| `POST` | `/api/v1/staff/disruptions/{id}/resolve/` | Bulk actions: another doctor, next slot, cancel | `queue.operate`, `facility.configure` | FR-SCH-14 | Idem; patients notified at once | Planned |
| `POST` | `/api/v1/staff/visits/{id}/follow-ups/` | Set a follow-up (booking or reminder) from the consultation | `clinical.write` | FR-SCH-15 | | Planned |
| `GET`, `POST` | `/api/v1/staff/care-schedule/patients/{facility_patient_id}/` | A patient's planned vaccinations and antenatal visits at this facility; `POST` plans one (`kind` vaccination or antenatal, `due_on` today to 2 years ahead, optional `note` up to 80 characters) | `care_schedule.manage` (doctor) | FR-SCH-16 (part) | W7 (#206). Note encrypted; reminders the day before (08:00) and on the morning (07:00) never name the kind or the note; audit `scheduling.care_schedule.create` | Implemented (#206) |
| `POST` | `/api/v1/staff/care-schedule/{id}/cancel/` | Cancel a planned date; no more reminders for it | `care_schedule.manage` | FR-SCH-16 (part) | `version` (409 when stale, 422 when already cancelled); audit `scheduling.care_schedule.cancel` | Implemented (#206) |

### Platform

| Method | Path | Purpose | Permission | Requirements | Notes | Status |
|---|---|---|---|---|---|---|
| `GET`, `PATCH` | `/api/v1/platform/settings/` | Platform rules: no-show strikes; later dispute deadlines | Platform admin | FR-SCH-13 | Step-up; Ver | Planned |

---

## S6 · Clinical record and history

Requirements: FR-CLN-01..09; FR-PAT-10..12; FR-SEC-03, 09. Prescription drafting with safety alerts is here because FR-CLN-07 is in S6; issuing and dispensing are in S7.

### Staff

| Method | Path | Purpose | Permission | Requirements | Notes | Status |
|---|---|---|---|---|---|---|
| `POST` | `/api/v1/staff/visits/{id}/vitals/` | Record vitals | `vitals.record` | FR-CLN-01 | Append-only; corrections are new entries | Planned |
| `GET` | `/api/v1/staff/clinical/my-day/` | Doctor Today: patients seen with a 7-day trend, average consult time, signed and unsigned records, results waiting, follow-ups today, open pharmacy questions | `clinical.write` (own work only) | FR-CLN-05 | Counts only, plus the patient name on open questions | Implemented (upgrade 05 §3) |
| `GET` | `/api/v1/staff/clinical/questions/` | Pharmacy questions on my prescriptions (`status=open\|answered`) | `prescription.issue` (prescriber only) | FR-RX-07 | Names the patient; open oldest first | Implemented (upgrade 05 §3) |
| `POST` | `/api/v1/staff/clinical/questions/{id}/reply/` | Answer in one step: signed addendum linked as the answer | `prescription.issue` (prescriber); step-up | FR-RX-07, FR-CLN-03 | Audit (addendum + answer) | Implemented (upgrade 05 §3) |
| `GET` | `/api/v1/staff/clinical/my-follow-ups/` | Follow-ups I set: missed (30 days), today, next 14 days, attended | `clinical.write` | FR-SCH-15 | Own only | Implemented (upgrade 05 §3) |
| `GET` | `/api/v1/staff/clinical/my-activity/` | My seen, signed, consult time, late signatures, top diagnoses (`days=7\|30`) | `clinical.write` | FR-RPT-03 | Counts only; own only | Implemented (upgrade 05 §3) |
| `GET`, `POST` | `/api/v1/staff/clinical/templates/` | My note templates, used as order sets: diagnoses, plan, instructions and a prescription applied in one click. W3 adds `diagnoses` (each code labelled, `is_sensitive`, `is_known`: an unknown code is skipped with a message) and `tests` (`[{code, name}]`, max 10: the extension point for W2 lab orders, stored and returned, not ordered yet) | `clinical.write` | FR-CLN-01, FR-CLN-10 | Private to the clinician, across facilities; name unique | Implemented (upgrade 05 §3, W3 #202) |
| `PUT`, `DELETE` | `/api/v1/staff/clinical/templates/{id}/` | Replace or delete one of my templates (`PUT` replaces `tests` too) | `clinical.write` (owner) | FR-CLN-01, FR-CLN-10 | 404 for another user's template | Implemented (upgrade 05 §3) |
| `POST` | `/api/v1/staff/clinical/templates/{id}/used/` | Count a use (most used first) | `clinical.write` (owner) | FR-CLN-01 | | Implemented (upgrade 05 §3) |
| `GET` | `/api/v1/staff/clinical/favourites/` | My most used diagnoses and medicines here, shown first in the diagnosis picker and the medicine search. Derived (nothing stored) from my signed consultations and issued prescriptions (cancelled lines left out), last 180 days, used twice or more, 8 each; each medicine carries the dosing of its latest use and `available_here` | `clinical.write` | FR-CLN-10 | Own only, this facility; sensitive diagnoses never listed | Implemented (W3 #202) |
| `GET`, `PATCH` | `/api/v1/staff/clinician-profile/public/` | My public bio (rw/en/fr), languages and visibility | staff | FR-PUB-03 | The licence is never public; Audit | Implemented (upgrade 05 §3) |
| `POST` | `/api/v1/staff/visits/{id}/consultations/` | Start a consultation (also done by ticket `start`) | `clinical.write` | FR-CLN-01 | Idem | Planned |
| `GET` | `/api/v1/staff/consultations/{id}/` | Consultation with addenda, `reason_for_visit` (patient's words, symptoms, triage navigation hint) and vitals `flags` for dangerous numbers | `clinical.write`; treatment relationship | FR-CLN-01, FR-SEC-03, FR-AI-01 | `403 access_reason_required` outside the relationship; the hint is never a diagnosis; Audit | Implemented (S6a, upgrade 05 §3) |
| `PATCH` | `/api/v1/staff/consultations/{id}/` | Autosave the draft | `clinical.write` (author) | FR-CLN-02 | Ver; draft only | Planned |
| `POST`, `DELETE` | `/api/v1/staff/consultations/{id}/diagnoses/` | Add or remove ICD-10 diagnoses (primary/secondary, provisional/confirmed) | `clinical.write` (author) | FR-CLN-06 | Draft only; code and display text snapshotted | Planned |
| `POST` | `/api/v1/staff/consultations/{id}/prescription/items/` | Add a prescription item → safety alerts | `prescription.issue` (author) | FR-CLN-07, FR-PHA-01 | Moved to [S7](#s7--pharmacy-and-documents) (P2) | Implemented (S7a) |
| `POST` | `/api/v1/staff/consultations/{id}/sign/` | Sign: re-enter PIN or password; lock; content hash | `clinical.sign` (author) | FR-CLN-02, FR-SEC-06 | Idem; late entry flagged after 24 h; issues prescriptions and documents (S7); Audit | Planned |
| `POST` | `/api/v1/staff/consultations/{id}/addenda/` | Signed addendum with a reason | `clinical.sign` | FR-CLN-03 | Step-up; original never changes | Planned |
| `POST` | `/api/v1/staff/consultations/{id}/entered-in-error/` | Mark entered in error with a reason | `clinical.sign` (author) | FR-CLN-04 | Step-up; hidden from normal views, never deleted | Planned |
| `POST` | `/api/v1/staff/consultations/{id}/restrict/` | Mark a record restricted (sensitive) | `clinical.sign` | FR-CLN-08 | Restricted fields field-encrypted | Planned |
| `GET` | `/api/v1/staff/unsigned-records/` | Unsigned drafts (own; all for the facility admin, without content) | `clinical.write`, `facility.configure` | FR-CLN-05 | | Planned |
| `GET` | `/api/v1/staff/diagnosis-codes/` | ICD-10 type-ahead | `clinical.write` | FR-CLN-06 | `?q=` (a medical term, not personal data) | Planned |
| `GET` | `/api/v1/staff/drugs/` | Drug search with "available here" marker | `clinical.write`, `pharmacy.dispense` | FR-PHA-01, FR-PHA-04 | | Planned |
| `POST` | `/api/v1/staff/access-reasons/` | State a reason for opening a record outside the treatment relationship | `clinical.write` | FR-SEC-03 | Time-limited grant; feeds snooping analytics; Audit | Planned |
| `GET` | `/api/v1/staff/patients/{id}/history/` | History timeline with filters (type, diagnosis, dates) | `clinical.write`; treatment relationship | FR-PAT-09, FR-SEC-03 | < 2 s for 200 visits (NFR-PERF-05); Audit | Planned |
| `GET` | `/api/v1/staff/patients/{id}/problem-summary/` | Active diagnoses, conditions, allergies, current medicines | `clinical.write`; pharmacist: allergies only | FR-PAT-09 | | Planned |
| `GET`, `POST` | `/api/v1/staff/clinical/patients/{id}/history-entries/` | Structured back-entry from paper, labelled historical (L3) | `GET`: `clinical.view` · `POST`: `records.import_clinical` | FR-PAT-12 | Relationship rule; in the timeline as `legacy`; a back-entered allergy also becomes an unverified allergy | Implemented (S6b) |
| `GET`, `POST` | `/api/v1/staff/clinical/patients/{id}/scans/` | Attach an uploaded scan or outside result with type and document date (L2) | `GET`: `clinical.view` · `POST`: `documents.upload` or `records.import_clinical` | FR-PAT-11, FR-CLN-09 | S1 upload (`clinical_document`); outside results open an inbox item; in the timeline as `scan` | Implemented (S6b) |
| `POST` | `/api/v1/staff/clinical/scans/{id}/download-link/` | 5-minute link to a scan | `clinical.view`; relationship rule | FR-PAT-11 | Audit (access history) | Implemented (S6b) |
| `GET`, `POST` | `/api/v1/staff/clinical/patients/{id}/health-attributes/` | Blood group and pregnancy status | `GET`: `clinical.view` · `POST`: `clinical.write` | FR-CLN-07 | Latest wins; pregnancy flag in the consultation and problem summary | Implemented (S6b) |
| `GET` | `/api/v1/staff/results-inbox/` | Results inbox: items assigned to me (R1) | `clinical.view` | FR-CLN-09 | `status` | Implemented (S6b) |
| `POST` | `/api/v1/staff/results-inbox/{id}/review/` | Mark reviewed with an optional comment (R1) | `clinical.view` (assigned doctor) | FR-CLN-09 | Ver; comment encrypted; locked after review | Implemented (S6b) |
| `GET` | `/api/v1/staff/lab/tests/` | The lab test catalogue: eight outpatient tests, each with result items (a number with unit and adult range, or fixed answers with the expected one) | `clinical.write`, `lab.operate`, `lab.result.enter` | FR-CLN-11 (proposed) | A constant list for now; codes are stable (a tariff item with the same code prices the test) | Implemented (#201) |
| `GET`, `POST` | `/api/v1/staff/consultations/{id}/lab-orders/` | The visit's tests and results; order tests (`tests`, `reason`) in my draft consultation | `GET`: `clinical.view` · `POST`: `clinical.write` (author); treatment relationship | FR-CLN-11 (proposed) | `422` unknown, already open or not a draft; one `LabOrder` per test; reason encrypted (C3); a priced test adds a bill line; Audit `clinical.lab_order.ordered` | Implemented (#201) |
| `GET` | `/api/v1/staff/lab/queue/` | Lab requests by visit: `waiting` (a sample to take), `in_progress` (results to enter), `done_today` | `lab.operate`, `lab.result.enter` | FR-CLN-11 (proposed) | Per visit: the lab ticket (null until sent), the patient's identity (name, date of birth, MediLink number), `unpaid`, the tests with the request reason; never diagnoses, notes or the doctor's note | Implemented (#201) |
| `POST` | `/api/v1/staff/lab-orders/{id}/sample/` | Record that the sample was taken | `lab.operate` | FR-CLN-11 (proposed) | Ver; `422` unless ordered; the visit's last sample puts the lab ticket on hold (the technician calls the next patient); Audit | Implemented (#201) |
| `POST` | `/api/v1/staff/lab-orders/{id}/result/` | Enter the result (`values` per item, `comment`) | `lab.result.enter` | FR-CLN-11 (proposed) | Ver; `400` names the item (`values.<code>`); `422` before the sample; result encrypted (C3) and never changed after; `is_abnormal` from the ranges; the visit's last result sends the patient back to the ordering doctor (return priority, assigned); Audit | Implemented (#201) |
| `POST` | `/api/v1/staff/lab-orders/{id}/review/` | Review a result, with a note for the patient | `clinical.write`; treatment relationship | FR-CLN-11 (proposed) | Ver; `422` unless resulted; note encrypted; Audit | Implemented (#201) |
| `POST` | `/api/v1/staff/lab-orders/{id}/release/` | Release a reviewed result to the patient | `clinical.write`; treatment relationship | FR-CLN-11 (proposed) | Ver; `422` unless reviewed; locked afterwards (trigger); Audit | Implemented (#201) |
| `POST` | `/api/v1/staff/lab-orders/{id}/cancel/` | Take back a test the lab has not sampled | `clinical.write` (ordering doctor) | FR-CLN-11 (proposed) | Ver; its bill line goes while nothing is paid; Audit | Implemented (#201) |
| `GET` | `/api/v1/staff/lab/results/` | Results of the tests I ordered, waiting for my review or release (out of range first) | `clinical.write` | FR-CLN-11 (proposed), FR-CLN-09 | Shown above the outside results on `/clinical/results` | Implemented (#201) |
| `GET`, `POST` | `/api/v1/staff/patient-imports/` | List imports; start one from an uploaded CSV with a suggested column mapping (L1) | `records.import` | FR-PAT-10 | S1 upload (`patient_import`, CSV ≤ 5 MB, ≤ 5,000 rows); raw rows encrypted | Implemented (S6b) |
| `GET` | `/api/v1/staff/patient-imports/{id}/` | Import with its counts (L1) | `records.import` | FR-PAT-10 | | Implemented (S6b) |
| `PUT` | `/api/v1/staff/patient-imports/{id}/mapping/` | Map columns → preview: validation errors and likely duplicates (L1) | `records.import` | FR-PAT-10 | Ver; nothing saved before confirm; S3 matching | Implemented (S6b) |
| `GET` | `/api/v1/staff/patient-imports/{id}/rows/` | Preview rows with problems and matches (L1) | `records.import` | FR-PAT-10 | `status` | Implemented (S6b) |
| `POST` | `/api/v1/staff/patient-imports/{id}/confirm/` | Create patients and facility records for the valid rows (L1) | `records.import` | FR-PAT-10 | Step-up; Ver; one transaction; no patient notified; Audit | Implemented (S6b) |
| `POST` | `/api/v1/staff/patient-imports/{id}/rollback/` | Roll back within 7 days if no visit is attached (L1) | `records.import` | FR-PAT-10 | Step-up; Ver; Audit; raw rows purged daily after the window | Implemented (S6b) |

### Patient

| Method | Path | Purpose | Permission | Requirements | Notes | Status |
|---|---|---|---|---|---|---|
| `GET` | `/api/v1/patient/visits/` | My visits timeline | Patient session | FR-PAT-13 | Filter `patient_id`; email must be verified | Planned |
| `GET` | `/api/v1/patient/visits/{id}/` | Visit detail: plain-language diagnoses, instructions, addenda | Linked account | FR-PAT-13, FR-CLN-01 | Never private notes; restricted records hidden from delegates | Planned |
| `GET` | `/api/v1/patient/results/` | Lab results the doctor released, with the doctor's note, newest first | Linked account | FR-CLN-11 (proposed) | Filter `patient_id`; released only (SECURITY DEFINER `clinical_patient_lab_results`); delegates never see results of restricted consultations; never the lab's comment | Implemented (#201) |
| `GET` | `/api/v1/patient/care-schedule/` | Coming up: planned vaccinations and antenatal visits, and follow-up dates the doctor set without a booking, soonest first | Linked account (self and guardian only) | FR-SCH-15, FR-SCH-16 (part) | W7 (#206). SECURITY DEFINER `scheduling_patient_care_schedule`; never a delegate's; today and later; at most 100 | Implemented (#206) |

### Platform

| Method | Path | Purpose | Permission | Requirements | Notes | Status |
|---|---|---|---|---|---|---|
| `POST` | `/api/v1/platform/break-glass/` | Emergency access to one patient at one facility with a reason (G1) | Platform admin | FR-ACC-09, FR-SEC-09 | Step-up; read-only; 60 minutes; access history | Implemented (S6b) |
| `GET` | `/api/v1/platform/break-glass/{id}/patients/{patient_id}/history/` | Read-only timeline and summary during the session (G2) | Platform admin (session owner) | FR-ACC-09 | Each read in the access history | Implemented (S6b) |
| `POST` | `/api/v1/platform/break-glass/{id}/end/` | End my session early | Platform admin (session owner) | FR-SEC-09 | | Implemented (S6b) |
| `GET` | `/api/v1/platform/break-glass/` | Break-glass log; weekly review list (G1) | Platform admin | FR-SEC-09 | `needs_review`; weekly S9 reminder (counts) | Implemented (S6b) |
| `POST` | `/api/v1/platform/break-glass/{id}/review/` | Record the review outcome (G1) | Platform admin (not the user) | FR-SEC-09 | Step-up; reviewer ≠ user | Implemented (S6b) |

---

## S7 · Pharmacy and documents

Requirements: FR-PHA-01..05; FR-DOC-01..07. Visit summaries, prescriptions, sick notes, referral letters and lab requests are generated as PDFs by a background job when the consultation is signed, and as a new version when an addendum is signed (no create endpoint).

### Staff

| Method | Path | Purpose | Permission | Requirements | Notes | Status |
|---|---|---|---|---|---|---|
| `GET` | `/api/v1/staff/consultations/{id}/prescription/` | The consultation's prescription with items and alerts (P1) | `clinical.view`; Rel | FR-PHA-01, FR-CLN-07 | `404` when none; Audit (access history) | Implemented (S7a) |
| `POST` | `/api/v1/staff/consultations/{id}/prescription/items/` | Add an item; creates the prescription on the first item (P2) | `prescription.issue` (author while draft) | FR-PHA-01, FR-CLN-07 | Catalogue drug or flagged free text; quantity default; optional `meal_timing` (`before_food`, `with_food`, `after_food`; #207), locked once issued; after issue: Up and `replaces_item_id` | Implemented (S7a) |
| `PATCH`, `DELETE` | `/api/v1/staff/prescription-items/{id}/` | Edit or remove a draft item (P3, P4) | `prescription.issue` (author) | FR-PHA-01 | Ver (`?version=` on delete); `422` after issue | Implemented (S7a) |
| `POST` | `/api/v1/staff/prescription-items/{id}/cancel/` | Cancel an issued item with a reason (P5) | `prescription.issue` | FR-PHA-01 | Ver; `422` when dispensed; event | Implemented (S7a) |
| `GET` | `/api/v1/staff/prescriptions/{id}/` | Prescription with dispense records and queries (P7) | `prescription.view` or `clinical.view` | FR-PHA-02 | Pharmacist: own facility, no Rel (D-5); doctor: Rel; no consultation text; Audit | Implemented (S7a) |
| `POST` | `/api/v1/staff/prescriptions/{id}/cancel/` | Cancel the whole prescription with a reason (P6) | `prescription.issue` | FR-PHA-01 | Ver; `422` when anything was dispensed | Implemented (S7a) |
| `GET` | `/api/v1/staff/pharmacy/queue/` | Pharmacy queue: ready, partly dispensed, queried (PQ1) | `pharmacy.dispense` | FR-PHA-02 | `status`, `q` (name, number or active ticket); oldest issue first; flags | Implemented (S7a) |
| `POST` | `/api/v1/staff/prescriptions/{id}/dispense/` | Identity check and dispensing per item: full, partial, generic substitution, not available; signed (PD1) | `pharmacy.dispense` | FR-PHA-02, FR-PHA-03 | Ver; row lock; controlled confirmation; never more than prescribed; Audit | Implemented (S7a) |
| `GET` | `/api/v1/staff/prescriptions/{id}/labels/` | Dosing labels for dispensed lines (PD2), with `frequency_code`, `times` (morning, noon, evening, night) and `meal_timing`/`meal` for the pictograms (#207) | `pharmacy.dispense` | FR-PHA-05 | `?language=`; default `documents.label_language` (`rw`) | Implemented (S7a; pictograms W8) |
| `POST` | `/api/v1/staff/prescriptions/{id}/queries/` | Send back to the doctor with a question (PQ2) | `pharmacy.dispense` | FR-PHA-02 | One open at a time (`409`); message encrypted | Implemented (S7a) |
| `POST` | `/api/v1/staff/prescription-queries/{id}/answer/` | Link the addendum that answers (PQ3) | `prescription.issue` | FR-PHA-02 | Addendum on the same consultation | Implemented (S7a) |
| `POST` | `/api/v1/staff/prescription-queries/{id}/close/` | Close an answered question (PQ4) | `pharmacy.dispense` | FR-PHA-02 | | Implemented (S7a) |
| `GET` | `/api/v1/staff/pharmacy/availability/` | Catalogue drugs with availability here (PA1) | `pharmacy.dispense` or `pharmacy.availability` | FR-PHA-04 | `q`, `available` | Implemented (S7a) |
| `PUT` | `/api/v1/staff/pharmacy/availability/{drug_code}/` | Mark available or not (PA2) | `pharmacy.availability` | FR-PHA-04 | Audit; `422` once the medicine has stock (it follows the count, W5) | Implemented (S7a, W5) |
| `GET` | `/api/v1/staff/drugs/` | Drug search with "not in stock here" and `stock_level` (PS1) | `prescription.issue`, `pharmacy.dispense` or `pharmacy.stock` | FR-PHA-01, FR-PHA-04, FR-PHA-06 | `q` ≥ 2 characters; 25 rows; `stock_level` null without stock | Implemented (S7a, W5) |
| `GET` | `/api/v1/staff/pharmacy/stock/` | Medicines with stock here: usable units, level, next expiry (W5) | `pharmacy.dispense` or `pharmacy.stock` | FR-PHA-06 | `q`, `level=low\|out\|short`; paginated; expired batches not counted | Implemented (W5, #204) |
| `POST` | `/api/v1/staff/pharmacy/stock/receive/` | Receive a batch: number, expiry, units, optional supplier and threshold (W5) | `pharmacy.stock` | FR-PHA-06 | Same batch and expiry adds to it; `422` when already expired; Audit | Implemented (W5, #204) |
| `GET`, `PUT` | `/api/v1/staff/pharmacy/stock/{drug_code}/` | One medicine: batches on the shelf and the last 50 movements; `PUT` sets the low-stock threshold (W5) | read: `pharmacy.dispense` or `pharmacy.stock`; `PUT`: `pharmacy.stock` | FR-PHA-06 | `404` without stock; Audit on threshold change | Implemented (W5, #204) |
| `POST` | `/api/v1/staff/pharmacy/stock/batches/{id}/adjust/` | Adjust a batch with a reason: count correction, damaged, expired (W5) | `pharmacy.stock` | FR-PHA-06 | Signed change; damaged/expired only remove; never below zero (`422`); row lock; append-only movement; Audit | Implemented (W5, #204) |
| `GET` | `/api/v1/staff/pharmacy/stock/expiring/` | Batches with units left expiring soon, expired first (W5) | `pharmacy.dispense` or `pharmacy.stock` | FR-PHA-06 | `days=30\|60\|90` (default 60); 200 rows | Implemented (W5, #204) |
| `GET` | `/api/v1/staff/pharmacy/stock/movements/` | Stock movements, newest first (W5) | `pharmacy.dispense` or `pharmacy.stock` | FR-PHA-06 | `kind`; paginated; dispensed movements link the prescription | Implemented (W5, #204) |
| `GET`, `POST` | `/api/v1/staff/consultations/{id}/referrals/` · `…/lab-requests/` · `…/sick-notes/` | Letters and requests (CR1) | `clinical.view` read; `clinical.write` (author) write | FR-DOC-01 | Draft: signed with the consultation; after signing: signed at once (Up); reason encrypted | Implemented (S7b) |
| `GET` | `/api/v1/staff/documents/` | Documents of a patient or visit (D1) | `clinical.view` (Rel) or `documents.print` (released) | FR-DOC-01, FR-DOC-07 | `facility_patient_id` or `visit_id`, `kind` (D-12) | Implemented (S7b) |
| `GET` | `/api/v1/staff/documents/{id}/` | Metadata, verification code and versions (D1) | as above | FR-DOC-02 | Superseded versions kept | Implemented (S7b) |
| `POST` | `/api/v1/staff/documents/{id}/download-link/` | Signed link to the current version (D2) | as above | FR-DOC-05 | 5 minutes; Audit `documents.downloaded` (access history) | Implemented (S7b) |
| `POST` | `/api/v1/staff/documents/{id}/print/` | Print a released document (D3) | `documents.print` | FR-DOC-07 | Returns a link; Audit `documents.printed` | Implemented (S7b) |
| `POST` | `/api/v1/staff/tickets/{id}/slips/` | Printable ticket slip (80 mm) | `queue.operate` | NFR-NET-06 | No names beyond what the patient needs | Planned |

### Patient

| Method | Path | Purpose | Permission | Requirements | Notes | Status |
|---|---|---|---|---|---|---|
| `GET` | `/api/v1/patient/prescriptions/` | My medicines: prescriptions of my profiles (M1) | Patient session | FR-PHA-03 | `patient_id`, `status=active\|past`; delegates don't see restricted consultations | Implemented (S7a) |
| `GET` | `/api/v1/patient/prescriptions/{id}/` | One prescription with items and what was dispensed (M2) | Linked account | FR-PHA-03 | No alert overrides, no consultation text | Implemented (S7a) |
| `GET` | `/api/v1/patient/documents/` | My documents (D4) | Patient session | FR-DOC-06 | `patient_id`, `kind`; delegates don't see restricted consultations | Implemented (S7b) |
| `GET` | `/api/v1/patient/documents/{id}/` | Metadata, verification code, versions, my share links (D4) | Linked account | FR-DOC-06 | | Implemented (S7b) |
| `POST` | `/api/v1/patient/documents/{id}/download-link/` | Signed link (D4) | Linked account | FR-DOC-05, FR-DOC-06 | Audit | Implemented (S7b) |
| `POST` | `/api/v1/patient/documents/archive/` | All my documents as a ZIP (D4) | Patient session | FR-DOC-06 | 5-minute link, 100 documents at most (D-12) | Implemented (S7b) |
| `POST` | `/api/v1/patient/documents/{id}/share-links/` | Expiring share link (D5) | Linked account | FR-DOC-06 | 1–30 days; token shown once, SHA-256 stored | Implemented (S7b) |
| `DELETE` | `/api/v1/patient/documents/{id}/share-links/{link_id}/` | Stop a share link (D5) | Account that made it | FR-DOC-06 | | Implemented (S7b) |
| `POST` | `/api/v1/patient/documents/` | Upload ID, insurance card, previous results, outside prescriptions | Linked account | FR-DOC-03 | `multipart`; RL: upload | Planned |
| `DELETE` | `/api/v1/patient/documents/{id}/` | Delete own non-clinical upload | Linked account (uploader) | FR-DOC-06 | Clinical documents can't be deleted | Planned |
| `POST` | `/api/v1/patient/documents/{id}/facility-shares/` | Share an own upload with a facility | Linked account | FR-DOC-03 | D-13 | Planned |

### Public

| Method | Path | Purpose | Permission | Requirements | Notes | Status |
|---|---|---|---|---|---|---|
| `POST` | `/api/v1/public/document-verifications/` | Verify a document by code; details only with the patient's date of birth | Public | FR-DOC-04 | Minimal data; RL: verification; every check logged | Planned |
| `GET` | `/api/v1/public/verify/{code}/` | Check a document by the code under its QR code (V1) | Public | FR-DOC-04 | Minimal projection; every attempt logged (`documents_verification_log`); RL `verify` 30/min | Implemented (S7b) |
| `POST` | `/api/v1/public/verify/{code}/details/` | The document's content after a date-of-birth match (V1) | Public | FR-DOC-04 | `{date_of_birth}`; `422` mismatch, logged | Implemented (S7b) |
| `GET` | `/api/v1/public/shared-documents/{token}/` | Open a document shared by a patient (D5) | Share token | FR-DOC-06 | Expiring; returns a 5-minute link; counts opens | Implemented (S7b) |

---

## S8 · Billing and payments

Requirements: FR-BIL-04..13. Tests: money invariants (no negative amounts, server-side totals, no self-approval). The [contract](../architecture/contracts/sprint-08-billing.md) and the OpenAPI schema win over the rows below.

### Staff

| Method | Path | Purpose | Permission | Requirements | Notes | Status |
|---|---|---|---|---|---|---|
| `GET` | `/api/v1/staff/visits/{id}/bill/` | The visit's bill, opened on first use (B1) | `billing.record_payment` or `billing.approve` | FR-BIL-06 | Lines, split, payments, corrections; Audit | Implemented (S8) |
| `POST` | `/api/v1/staff/visits/{id}/insurance-verifications/` | Verify insurance for this visit, or reject with a reason (B6) | `patients.insurance_verify` | FR-BIL-04 | Referral letter where the rule needs it; after payment only if it lowers the patient share | Implemented (S8) |
| `GET` | `/api/v1/staff/bills/` | Bills of a day, unpaid first (B2) | as B1 | FR-BIL-06, FR-BIL-12 | `status`, `has_balance`, `date`, `q` | Implemented (S8) |
| `GET` | `/api/v1/staff/bills/{id}/` | Bill detail (B3) | as B1 | FR-BIL-06 | Audit | Implemented (S8) |
| `POST` | `/api/v1/staff/bills/{id}/lines/` | Add a procedure or other charge from the tariff (B4) | `billing.record_payment` | FR-BIL-06 | Ver; server prices and splits | Implemented (S8) |
| `POST` | `/api/v1/staff/bill-lines/{id}/remove/` | Remove a line with a reason (B5) | `billing.record_payment` | FR-BIL-06 | Ver; only before any payment (D-8) | Implemented (S8) |
| `POST` | `/api/v1/staff/bills/{id}/payments/` | Record a payment → receipt (B7) | `billing.record_payment` | FR-BIL-07, FR-BIL-08, FR-BIL-13 | Idem; open shift; ≤ balance; reference for MoMo, Airtel, card; optional EBM number | Implemented (S8) |
| `POST` | `/api/v1/staff/bills/{id}/exemptions/` | Apply an exemption or waiver (B8) | `billing.record_payment` | FR-BIL-11 | `allow_exemptions`; waiver above the threshold → approval request | Implemented (S8) |
| `POST` | `/api/v1/staff/payments/{id}/void-requests/` | Request a void of a payment and its receipt (B9) | `billing.record_payment` | FR-BIL-09 | One pending per payment | Implemented (S8) |
| `POST` | `/api/v1/staff/bills/{id}/refund-requests/` | Request a refund (B10) | `billing.record_payment` | FR-BIL-09 | Approval → credit note | Implemented (S8) |
| `GET` | `/api/v1/staff/approval-requests/` | Approvals inbox: voids, refunds, waivers (B11) | `billing.approve` | FR-BIL-09, FR-BIL-11 | | Implemented (S8) |
| `POST` | `/api/v1/staff/approval-requests/{id}/approve/` | Approve (B12) | `billing.approve` | FR-BIL-09, FR-BIL-11 | Step-up; requester ≠ approver (one-person clinic: allowed and flagged); Audit | Implemented (S8) |
| `POST` | `/api/v1/staff/approval-requests/{id}/reject/` | Reject with a note (B13) | `billing.approve` | FR-BIL-09 | Step-up | Implemented (S8) |
| `POST` | `/api/v1/staff/approval-requests/{id}/cancel/` | Cancel my pending request (B14) | `billing.record_payment` | FR-BIL-09 | Requester only | Implemented (S8) |
| `POST` | `/api/v1/staff/credit-notes/{id}/payouts/` | Record the refund payout (B15) | `billing.record_payment` | FR-BIL-09 | Idem; cash needs an open shift | Implemented (S8) |
| `GET` | `/api/v1/staff/receipts/{id}/` | Receipt for printing (B16) | as B1 | FR-BIL-08 | PDF with S7b | Implemented (S8) |
| `POST` | `/api/v1/staff/receipts/{id}/send/` | Send the receipt to the patient again (B17) | `billing.record_payment` | FR-BIL-08 | S9 in-app and email | Implemented (S8) |
| `GET`, `POST` | `/api/v1/staff/cash-shifts/` | List shifts; open my shift with a float (B18, B20) | `billing.record_payment` (own) or `billing.approve` (all) | FR-BIL-10 | One open shift per person; `mine=true` keeps only my own (#203) | Implemented (S8) |
| `GET` | `/api/v1/staff/cash-shifts/current/` | My open shift with running totals (B19) | `billing.record_payment` | FR-BIL-10 | Every shift carries `by_method`: payments, received, refunds paid, expected (cash with the float), counted and difference per method (#203) | Implemented (S8) |
| `POST` | `/api/v1/staff/cash-shifts/{id}/close/` | Close: counted per method, note (B21) | owner | FR-BIL-10 | Expected vs counted | Implemented (S8) |
| `POST` | `/api/v1/staff/cash-shifts/{id}/review/` | Accept a closed shift (B22) | `billing.approve` | FR-BIL-10 | Not the owner unless one-person clinic; Audit | Implemented (S8) |
| `GET` | `/api/v1/staff/billing/patients/{id}/balances/` | Unpaid balances of a patient at this facility (B23) | `billing.record_payment` | FR-BIL-12 | Never other facilities | Implemented (S8) |
| `GET` | `/api/v1/staff/insurance-claims/insurers/` | Insurers to list claims for: accepted here or verified on a bill (#203) | `billing.approve` or `reports.view` | FR-BIL-14 | | Implemented (W4) |
| `GET` | `/api/v1/staff/insurance-claims/` | Monthly claim list for one insurer, with totals (#203) | `billing.approve` or `reports.view` | FR-BIL-14 | `insurer`, `month=YYYY-MM` (visit dates); verified bills with an insurer share, not void; member number, ICD-10 of signed notes, lines, shares, claim status; Audit | Implemented (W4) |
| `GET` | `/api/v1/staff/insurance-claims/export/` | Download the claim list (#203) | `billing.approve` or `reports.view` | FR-BIL-14 | `kind=csv` (UTF-8 with BOM, formula-safe; default) or `kind=pdf` (A4 landscape); Audit | Implemented (W4) |
| `POST` | `/api/v1/staff/bills/{id}/claim/` | Mark the bill's claim paid, or rejected with the insurer's reason (#203) | `billing.approve` | FR-BIL-14 | Ver (`0` for a first mark); a rejection needs a reason; may be marked again; Audit with from/to | Implemented (W4) |

### Patient

| Method | Path | Purpose | Permission | Requirements | Notes | Status |
|---|---|---|---|---|---|---|
| `GET` | `/api/v1/patient/bills/` | Bills and unpaid balances (PB1) | Patient session | FR-BIL-12 | `patient_id`, `has_balance`; delegates don't see visits with a restricted consultation | Implemented (S8) |
| `GET` | `/api/v1/patient/bills/{id}/` | Bill with lines and receipts (PB2) | Linked account | FR-BIL-06, FR-BIL-08 | | Implemented (S8) |

---

## S9 · Notifications

Requirements: FR-NOT-01..12. Facility notification settings (reminder timings, "you are next" threshold, signature) are a section of `/api/v1/staff/facility/settings/` (S2).

### Public

| Method | Path | Purpose | Permission | Requirements | Notes | Status |
|---|---|---|---|---|---|---|
| `GET` | `/api/v1/public/web-push-key/` | VAPID public key | Public | FR-NOT-03 | | Planned |

### Patient

| Method | Path | Purpose | Permission | Requirements | Notes | Status |
|---|---|---|---|---|---|---|
| `GET` | `/api/v1/patient/notifications/` | Inbox | Patient session | FR-NOT-02, FR-NOT-08 | Includes dependents' notifications | Planned |
| `GET` | `/api/v1/patient/notifications/unread-count/` | Count for the bell | Patient session | FR-NOT-02 | | Planned |
| `POST` | `/api/v1/patient/notifications/{id}/read/` | Mark read | Patient session | FR-NOT-02 | | Planned |
| `POST` | `/api/v1/patient/notifications/read-all/` | Mark all read | Patient session | FR-NOT-02 | | Planned |
| `GET`, `PATCH` | `/api/v1/patient/notification-preferences/` | Channels per level, quiet hours, reminder timing, dependents' alerts, language | Patient session | FR-NOT-05, FR-NOT-06, FR-NOT-08 | Critical alerts can't be fully disabled while a ticket is active | Planned |
| `POST` | `/api/v1/patient/push-subscriptions/` | Register a browser for web push | Patient session | FR-NOT-03 | Endpoint host must be on the push-service allowlist | Planned |
| `DELETE` | `/api/v1/patient/push-subscriptions/{id}/` | Remove a browser or the phone app | Patient session | FR-NOT-03 | | Planned |
| `POST` | `/api/v1/patient/app-devices/` | Register the phone app's Firebase Cloud Messaging token (`{token, name?}`); answers like `POST push-subscriptions/` with `kind: "app"` | Patient session | FR-NOT-03 | `422` while `FIREBASE_SERVICE_ACCOUNT` is unset; an account takes over a token another account held; 20 per hour | Implemented (2026-11-19) |

### Staff

| Method | Path | Purpose | Permission | Requirements | Notes | Status |
|---|---|---|---|---|---|---|
| `GET` | `/api/v1/staff/notifications/` | Staff inbox | Staff session | FR-NOT-02, FR-NOT-07 | | Planned |
| `GET` | `/api/v1/staff/notifications/unread-count/` | Count for the bell | Staff session | FR-NOT-02 | | Planned |
| `POST` | `/api/v1/staff/notifications/{id}/read/` | Mark read | Staff session | FR-NOT-02 | | Planned |
| `POST` | `/api/v1/staff/notifications/read-all/` | Mark all read | Staff session | FR-NOT-02 | | Planned |
| `GET`, `PATCH` | `/api/v1/staff/notification-preferences/` | Sound on/off, approvals digest | Staff session | FR-NOT-06 | | Planned |
| `GET`, `POST` | `/api/v1/staff/announcements/` | Facility announcements (patients in a date range, display) | `facility.configure` | FR-NOT-11 | rw/en/fr | Planned |
| `POST` | `/api/v1/staff/announcements/{id}/publish/` | Publish | `facility.configure` | FR-NOT-11 | | Planned |
| `POST` | `/api/v1/staff/announcements/{id}/withdraw/` | Withdraw | `facility.configure` | FR-NOT-11 | | Planned |
| `GET` | `/api/v1/staff/notification-deliveries/` | Delivery log for a patient or visit ("was the patient told?") | `audit.view` (dispute handlers from S10) | FR-NOT-10 | Read-only | Planned |

### Platform

| Method | Path | Purpose | Permission | Requirements | Notes | Status |
|---|---|---|---|---|---|---|
| `GET`, `POST` | `/api/v1/platform/announcements/` | Announcements to all or selected facilities | Platform admin | FR-NOT-11 | | Planned |
| `POST` | `/api/v1/platform/announcements/{id}/publish/` | Publish | Platform admin | FR-NOT-11 | | Planned |
| `GET`, `POST` | `/api/v1/platform/notification-templates/` | Versioned templates in rw/en/fr | Platform admin | FR-NOT-07, FR-NOT-09 | Lint: no clinical placeholders in push and email bodies | Planned |
| `GET`, `PATCH` | `/api/v1/platform/notification-templates/{id}/` | Edit → new version | Platform admin | FR-NOT-09 | Ver | Planned |
| `GET` | `/api/v1/platform/notification-deliveries/` | Delivery log and failure rates | Platform admin | FR-NOT-10 | | Planned |

### WebSockets

| Path | Events | Requirements | Status |
|---|---|---|---|
| `/ws/v1/patient/notifications/` | `notification.created` | FR-NOT-02 | Planned |
| `/ws/v1/staff/notifications/` | `notification.created` | FR-NOT-02 | Planned |

---

## S10 · Disputes, help and reports

Requirements: FR-DSP-01..11; FR-RPT-01..05; FR-SEC-12, 13. Retention jobs (FR-SEC-13) have no endpoint. The weekly unusual-access report comes from [security 08](../security/08-logging-monitoring-and-detection.md) §4.

### Public

| Method | Path | Purpose | Permission | Requirements | Notes | Status |
|---|---|---|---|---|---|---|
| `GET` | `/api/v1/public/help-articles/` | Help center articles (`?q`, `?category`) | Public | FR-DSP-11 | rw/en/fr; RL: burst | Implemented (S10 part 1 backend) |
| `POST` | `/api/v1/public/contact/` | Public contact form: name, email or phone, subject, message; returns `{reference}` | Public | Upgrade 11 §5 | 10/h per IP (`THROTTLE_RATE_CONTACT_IP`); health details refused (400); audit holds the reference only | Implemented (upgrade U2) |
| `GET` | `/api/v1/public/doctors/`, `/api/v1/public/doctors/{id}/` | Doctor directory and profile (name, specialty, facility, days, verified qualifications) | Public | FR-SCH-19 (proposed) | Never patients or bookings | Proposed (upgrade 11 §13; built from facility profiles meanwhile) |
| `GET` | `/api/v1/public/help-articles/{slug}/` | One article | Public | FR-DSP-11 | Plain text, never HTML | Implemented (S10 part 1 backend) |
| `POST` | `/api/v1/public/support-requests/` | Ask for help without logging in ("I can't log in") | Public | FR-DSP-11 | No clinical data; RL: auth | Deferred (sprint-10 S10-D2: needs a bot check) |

### Patient

| Method | Path | Purpose | Permission | Requirements | Notes | Status |
|---|---|---|---|---|---|---|
| `POST` | `/api/v1/patient/disputes/` | Raise a dispute from a visit, bill, receipt, prescription, ticket, record entry or strike | Linked account (incl. guardians) | FR-DSP-01, FR-DSP-09, FR-DSP-10 | Context and audit events attached automatically; max 5 open; duplicate check | Implemented (S10b; screens in patient-web and staff-web) |
| `GET` | `/api/v1/patient/disputes/` | My disputes | Patient session | FR-DSP-03 | Filter `patient_id` | Implemented (S10b; screens in patient-web and staff-web) |
| `GET` | `/api/v1/patient/disputes/{id}/` | Dispute with timeline and deadlines | Linked account | FR-DSP-03 | No internal notes | Implemented (S10b; screens in patient-web and staff-web) |
| `GET`, `POST` | `/api/v1/patient/disputes/{id}/messages/` | Conversation thread | Linked account | FR-DSP-04 | | Implemented (S10b; screens in patient-web and staff-web) |
| `POST` | `/api/v1/patient/disputes/{id}/evidence/` | Add photos or receipts | Linked account | FR-DSP-01 | `multipart`; append-only | Planned |
| `POST` | `/api/v1/patient/disputes/{id}/accept/` | Accept the resolution → closed | Linked account | FR-DSP-03 | | Implemented (S10b; screens in patient-web and staff-web) |
| `POST` | `/api/v1/patient/disputes/{id}/escalate/` | Disagree within 14 days → super admin | Linked account | FR-DSP-02, FR-DSP-03 | | Implemented (S10b; screens in patient-web and staff-web) |
| `POST` | `/api/v1/patient/disputes/{id}/reopen/` | Reopen with new evidence (within 30 days, once) | Linked account | FR-DSP-03 | | Implemented (S10b; screens in patient-web and staff-web) |
| `GET`, `POST` | `/api/v1/patient/support-requests/` | Own support requests (`?status`); open one | Patient session | FR-DSP-11 | No clinical words; 5 open at most; RL: support_write | Implemented (S10 part 1 backend) |
| `GET` | `/api/v1/patient/support-requests/{id}/` | One request with its messages | Patient session (own) | FR-DSP-11 | Support shown as "MediLink support" | Implemented (S10 part 1 backend) |
| `POST` | `/api/v1/patient/support-requests/{id}/messages/` | Reply | Patient session (own) | FR-DSP-11 | 422 when closed | Implemented (S10 part 1 backend) |
| `POST` | `/api/v1/patient/support-requests/{id}/close/` | Close (withdrawn) | Patient session (own) | FR-DSP-11 | 409 when closed | Implemented (S10 part 1 backend) |
| `POST` | `/api/v1/patient/data-exports/` | Download all my data (PDF + machine-readable) | Patient session | FR-SEC-12 | Step-up; Async | Planned |
| `GET` | `/api/v1/patient/data-exports/{id}/` | Export status and link | Patient session | FR-SEC-12 | Link valid 15 minutes | Planned |
| `POST` | `/api/v1/patient/auth/close-account/` | Close the account after the retention explanation | Patient session | FR-SEC-12, FR-SEC-13 | Step-up; non-clinical data deleted after 30 days | Planned |

Rectification of personal details uses `PATCH /api/v1/patient/profiles/{patient_id}/` (S3). Clinical corrections and privacy requests are disputes of type `record_correction` and `privacy`.

### Staff

| Method | Path | Purpose | Permission | Requirements | Notes | Status |
|---|---|---|---|---|---|---|
| `GET` | `/api/v1/staff/help-articles/`, `…/{slug}/` | Staff help articles | Any member | FR-DSP-11 | | Implemented (S10 part 1 backend) |
| `GET`, `POST` | `/api/v1/staff/support-requests/` | Own requests, or the facility's with `?scope=facility`; open one | Member; facility scope needs `support.view_facility` | FR-DSP-11 | Carries the active facility | Implemented (S10 part 1 backend) |
| `GET` | `/api/v1/staff/support-requests/{id}/` | One request | Own, or `support.view_facility` | FR-DSP-11 | Facility admin: read-only | Implemented (S10 part 1 backend) |
| `POST` | `/api/v1/staff/support-requests/{id}/messages/`, `…/close/` | Reply; close | Own only | FR-DSP-11 | | Implemented (S10 part 1 backend) |
| `GET` | `/api/v1/staff/disputes/` | Facility disputes by status, type, deadline | `disputes.handle`; others: assigned for comment | FR-DSP-02, FR-DSP-03 | Filter `overdue=true` | Implemented (S10b; screens in patient-web and staff-web) |
| `POST` | `/api/v1/staff/disputes/` | Raise a dispute at the counter for a patient | `queue.operate` | FR-DSP-09 | Marked "raised at the counter"; see note below | Implemented (S10b; screens in patient-web and staff-web) |
| `GET` | `/api/v1/staff/disputes/{id}/` | Dispute with thread and internal notes | `disputes.handle` | FR-DSP-04 | | Implemented (S10b; screens in patient-web and staff-web) |
| `GET` | `/api/v1/staff/disputes/{id}/evidence/` | Audit trail of the disputed item, in order | `disputes.handle` | FR-DSP-05 | Frozen copy with hash | Planned |
| `POST` | `/api/v1/staff/disputes/{id}/acknowledge/` | Acknowledge (starts the decision deadline) | `disputes.handle` | FR-DSP-03 | | Implemented (S10b; screens in patient-web and staff-web) |
| `POST` | `/api/v1/staff/disputes/{id}/messages/` | Reply to the patient | `disputes.handle` | FR-DSP-04 | | Implemented (S10b; screens in patient-web and staff-web) |
| `POST` | `/api/v1/staff/disputes/{id}/internal-notes/` | Note visible to handlers only | `disputes.handle` | FR-DSP-04 | | Implemented (S10b; screens in patient-web and staff-web) |
| `POST` | `/api/v1/staff/disputes/{id}/comment-requests/` | Ask involved staff for comments | `disputes.handle` | FR-DSP-04 | | Implemented (S10b; screens in patient-web and staff-web) |
| `POST` | `/api/v1/staff/disputes/{id}/comments/` | Involved staff member responds | `disputes.comment` | FR-DSP-04, FR-DSP-08 | Involved staff can comment, never decide | Implemented (S10b; screens in patient-web and staff-web) |
| `POST` | `/api/v1/staff/disputes/{id}/request-info/` | Ask the patient for more information | `disputes.handle` | FR-DSP-03 | | Implemented (S10b; screens in patient-web and staff-web) |
| `POST` | `/api/v1/staff/disputes/{id}/resolve/` | Decide and create linked actions (refund, bill correction, addendum request, strike removal, rebooking, disagreement statement) | `disputes.handle` | FR-DSP-06, FR-DSP-07, FR-DSP-08 | Step-up; conflict-of-interest check; Audit | Implemented (S10b; screens in patient-web and staff-web) |
| `POST` | `/api/v1/staff/platform-disputes/` | Facility raises a dispute against the platform | `facility.configure` | FR-DSP-02 | Verification, suspension, subscription | Planned |
| `GET` | `/api/v1/staff/reports/operations/` | Facility command centre: today vs same day last week, 14-day trend, live load by service, arrivals heatmap; `attention` (approvals, closed shifts, queue moves, unsigned records, open disputes, pending invitations, staff without two-step sign-in, licence days left), `finance` (collected today, payments, bills, open balances), `bookings` (expected, arrived, no-shows, rate) and `on_duty` (staff names, state, room) | `reports.view` + `facility.configure` | FR-RPT-02 | Aggregates only, never a patient name; polled or pushed via the queue socket | Implemented (S4, upgrade 05 §5) |
| `GET` | `/api/v1/staff/reports/facility/` | Facility report for a period (`from`, `to`, at most 366 days; `group=day\|week\|month`): patients per period (completed, left without service, emergencies, no-shows), by source and service; waits per stage (median, 90th percentile, from joining the stage on site to the first call); top ICD-10 diagnoses from signed notes and referrals out; money (collected by method, insured visits by insurer, exemptions, voids, credit notes, refunds); laboratory (tests done, turnaround by test); stock (out and low now, units received and dispensed, expiring batches) | `reports.view` | FR-RPT-01, FR-RPT-03, FR-RPT-06 | Aggregates only, never a patient name; sensitive diagnoses counted, never named; 400 on bad dates | Implemented (W6, #205) |
| `GET` | `/api/v1/staff/reports/facility/export/` | One table of the facility report as CSV (`table=visits\|sources\|services\|waits\|diagnoses\|money\|lab\|stock`, same period parameters) | `reports.view` | FR-RPT-04 | UTF-8 with BOM; formula-safe cells; audit `visits.report.exported`; `no-store` | Implemented (W6, #205) |
| `GET` | `/api/v1/staff/reports/daily-summary/` | Visits by source and service, waits (median, p90), no-shows, left without service | `reports.view` | FR-RPT-01, FR-RPT-03 | Filters date range, service, doctor | Superseded by `reports/facility/` (W6); service and doctor filters not yet |
| `GET` | `/api/v1/staff/reports/wait-times/` | Wait trends and estimate accuracy | `reports.view` | FR-RPT-01, FR-RPT-03 | | Planned |
| `GET` | `/api/v1/staff/reports/doctor-activity/` | Patients seen, consultation time, unsigned and late records | `reports.view` | FR-RPT-03 | | Planned |
| `GET` | `/api/v1/staff/reports/bookings/` | Booked vs capacity, no-shows, cancellations, strikes | `reports.view` | FR-RPT-03 | | Planned |
| `GET` | `/api/v1/staff/reports/finance/` | Billed, collected, insurer share, waivers, voids, refunds, shift differences | `reports.view` | FR-RPT-03 | | Planned |
| `GET` | `/api/v1/staff/reports/staff-accountability/` | Reorders, voids, overrides, waivers per staff member | `reports.view` | FR-RPT-03 | | Planned |
| `GET` | `/api/v1/staff/reports/disputes/` | Open, overdue, by type, outcomes | `reports.view` | FR-RPT-03 | | Planned |
| `GET` | `/api/v1/staff/reports/my-activity/` | Own shift or own activity | `reports.view_own` | FR-RPT-03 | | Planned |
| `POST` | `/api/v1/staff/report-exports/` | Export a report to Excel or PDF | `reports.view` | FR-RPT-04 | Step-up; watermark; CSV-injection safe; Async; Audit | Planned |
| `GET` | `/api/v1/staff/report-exports/{id}/` | Export status and link | `reports.view` (requester) | FR-RPT-04 | Link valid 15 minutes | Planned |
| `GET` | `/api/v1/staff/audit-entries/` | Facility audit log | `audit.view` | FR-SEC-07 | Filters actor, object, action, dates | Planned |
| `GET` | `/api/v1/staff/access-reviews/` | Weekly unusual-access reports | `audit.view` | FR-SEC-07 | Security 08 §4 | Planned |
| `POST` | `/api/v1/staff/access-reviews/{id}/sign-off/` | Sign off the weekly review | `audit.view` | FR-SEC-07 | Audit | Planned |

Note: the permission matrix in analysis 02 §3 gives the receptionist no "raise dispute" right, but analysis 10 §3 lets a receptionist raise one at the counter (FR-DSP-09). The S10 contract must align the matrix.

### Platform

| Method | Path | Purpose | Permission | Requirements | Notes | Status |
|---|---|---|---|---|---|---|
| `GET` | `/api/v1/platform/disputes/` | Escalated and platform-level disputes | Platform admin | FR-DSP-02 | | Implemented (S10b; screens in patient-web and staff-web) |
| `GET` | `/api/v1/platform/disputes/{id}/` | Dispute with attached evidence | Platform admin | FR-DSP-05 | Clinical data only as attached evidence | Implemented (S10b; screens in patient-web and staff-web) |
| `POST` | `/api/v1/platform/disputes/{id}/messages/` | Ask the facility or patient for information | Platform admin | FR-DSP-04 | | Implemented (S10b; screens in patient-web and staff-web) |
| `POST` | `/api/v1/platform/disputes/{id}/final-decision/` | Final decision with written reasons | Platform admin | FR-DSP-02, FR-DSP-06 | Step-up; corrections are still made by the facility | Implemented (S10b; screens in patient-web and staff-web) |
| `POST` | `/api/v1/platform/facilities/{id}/warnings/` | Record a warning on a facility | Platform admin | FR-DSP-06 | | Planned |
| `GET` | `/api/v1/platform/contact-messages/` | Contact page inbox (`status=new|handled`, `q` reference, name or subject) | Platform admin | Upgrade 11 §13 | Newest first | Implemented (upgrade U2) |
| `POST` | `/api/v1/platform/contact-messages/{id}/handled/` | Mark a Contact page message handled, with an optional note | Platform admin | Upgrade 11 §13 | 409 when already handled | Implemented (upgrade U2) |
| `GET` | `/api/v1/platform/support-requests/` | Support queue (status, topic, audience, priority, facility, assigned, search) | Platform admin | FR-DSP-11 | High first, then oldest activity | Implemented (S10 part 1 backend) |
| `GET`, `PATCH` | `/api/v1/platform/support-requests/{id}/` | Request with messages; triage (priority, topic, assignee) | Platform admin | FR-DSP-11 | 409 stale version, 422 closed | Implemented (S10 part 1 backend) |
| `POST` | `/api/v1/platform/support-requests/{id}/close/` | Close with a reason and an optional message | Platform admin | FR-DSP-11 | | Implemented (S10 part 1 backend) |
| `GET`, `POST` | `/api/v1/platform/help-articles/` | Help articles (all states); create a draft | Platform admin | FR-DSP-11 | rw/en/fr keys only | Implemented (S10 part 1 backend) |
| `GET`, `PATCH` | `/api/v1/platform/help-articles/{id}/` | One article; edit | Platform admin | FR-DSP-11 | 409 stale version | Implemented (S10 part 1 backend) |
| `POST` | `/api/v1/platform/help-articles/{id}/publish/`, `…/unpublish/` | Publish (all three languages, step-up) or back to draft | Platform admin | FR-DSP-11 | | Implemented (S10 part 1 backend) |
| `POST` | `/api/v1/platform/support-requests/{id}/replies/` | Reply | Platform admin | FR-DSP-11 | Notifies the requester | Implemented (S10 part 1 backend) |
| `POST` | `/api/v1/platform/support-requests/{id}/close/` | Close | Platform admin | FR-DSP-11 | | Planned |
| `GET`, `POST` | `/api/v1/platform/help-articles/` | Help center content | Platform admin | FR-DSP-11 | | Planned |
| `GET`, `PATCH` | `/api/v1/platform/help-articles/{id}/` | Edit an article | Platform admin | FR-DSP-11 | Ver | Planned |
| `GET` | `/api/v1/platform/reports/network/` | Facilities by status, type, district; applications pipeline | Platform admin | FR-RPT-05 | Aggregated only | Planned |
| `GET` | `/api/v1/platform/reports/adoption/` | Active facilities, visits recorded | Platform admin | FR-RPT-05 | Aggregated only | Planned |
| `GET` | `/api/v1/platform/reports/quality/` | Disputes per 1,000 visits, escalation rate, estimate accuracy | Platform admin | FR-RPT-05 | Aggregated only | Planned |
| `GET` | `/api/v1/platform/reports/system/` | Usage, errors, notification delivery, push opt-in | Platform admin | FR-RPT-05 | | Planned |
| `POST` | `/api/v1/platform/report-exports/` | Export a platform report | Platform admin | FR-RPT-04 | Step-up; watermark; Async | Planned |
| `GET` | `/api/v1/platform/audit-entries/` | Platform audit log | Platform admin | FR-SEC-07 | | Planned |

---

## S11 · Hardening and pilot readiness

Requirements: NFR-PERF, NFR-REL, FR-SEC-14..16, FR-ONB-09. Most S11 work (load tests, backups, monitoring, pen-test fixes) has no endpoint.

### Staff

| Method | Path | Purpose | Permission | Requirements | Notes | Status |
|---|---|---|---|---|---|---|
| `POST` | `/api/v1/staff/facility/data-exports/` | Full facility data export | `facility.configure` | FR-ONB-09 | Step-up; Async; alert to the platform; Audit | Planned |
| `GET` | `/api/v1/staff/facility/data-exports/{id}/` | Export status and link | `facility.configure` | FR-ONB-09 | Link valid 15 minutes | Planned |

### Platform

| Method | Path | Purpose | Permission | Requirements | Notes | Status |
|---|---|---|---|---|---|---|
| `POST` | `/api/v1/platform/facilities/{id}/data-exports/` | Export for a deactivated facility | Platform admin | FR-ONB-09 | Step-up; Async; handed to the facility | Planned |

---

## Not yet scheduled

Required by the analysis or the security documents, but not yet in a sprint plan. Place them in a sprint contract before go-live.

| Method | Path | Purpose | Permission | Requirements / source | Status |
|---|---|---|---|---|---|
| `GET` | `/api/v1/staff/auth/sessions/` | Own active sessions | Staff session | FR-SEC-06; analysis 12 §5 | Planned |
| `POST` | `/api/v1/staff/auth/sessions/{id}/revoke/` | End one session | Staff session | FR-SEC-06 | Planned |
| `GET` | `/api/v1/patient/auth/sessions/` | Own active sessions | Patient session | FR-SEC-06 | Planned |
| `POST` | `/api/v1/patient/auth/sessions/{id}/revoke/` | End one session | Patient session | FR-SEC-06 | Planned |
| `PUT` | `/api/v1/staff/auth/pin/` | Set the unlock PIN | Staff session + step-up | FR-SEC-06; security 03 §5 | Contracted in S1 |
| `POST` | `/api/v1/staff/auth/unlock/` | Unlock an idle-locked session with the PIN | Staff session (locked) | FR-SEC-06 | Contracted in S1 |
| `POST` | `/api/v1/staff/auth/password-change/` | Change own password | Staff session + step-up | security 03 §4 | Planned |
| `POST` | `/api/v1/patient/auth/password-change/` | Change own password | Patient session + step-up | security 03 §4 | Planned |
| `POST` | `/api/v1/staff/auth/passkeys/` | Register a passkey (mandatory for super admins before go-live) | Staff session + step-up | security 03 §1, security 14 | Planned |
| `GET`, `POST` | `/api/v1/staff/devices/` | Register reception PCs as shared devices (no "trust this device") | `facility.configure` | security 03 §3, security 11 §3 | Planned |
| `GET`, `POST` | `/api/v1/staff/staff-access-reviews/` | Quarterly confirmation of the staff list and roles | `staff.manage` | security 03 §7 | Planned |
| `GET`, `PATCH` | `/api/v1/platform/feature-flags/` | Feature flags per facility | Platform admin | NFR-OPS-07 | Contracted in S1 (`/platform/feature-flags/{code}/`, `/platform/facilities/{id}/feature-flags/{code}/`) |
