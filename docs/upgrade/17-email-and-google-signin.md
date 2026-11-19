# 17 · Email and Sign in with Google

Status: Implemented · 2026-11-06 · Decisions 2026-11-05 (product owner)

## 1. What this adds

- **Every email looks like MediLink.** One branded layout (forest header with the white MediLink logo, white card, emerald button, footer in the reader's language with Find care, Help, Privacy, Emergency 912 and Kigali), with a plain-text part beside it. The only image is the logo, one fixed file on the website for every reader, so it tracks nothing (2026-11-19). No scripts, tracking pixels or remote fonts.
- **Account emails in the account's language** (rw, en, fr): sign-up confirmation, password reset, password changed, "someone tried to sign up with your email", sign-in locked. Notification emails use the same layout. Emails written with Django's `send_mail()` (staff invitations, licence reminders, facility applications) get the layout automatically through `BrandedSMTPBackend`.
- **Real delivery with Gmail** (decision 2026-11-05): an app password on a Gmail account; a deploy check warns when `EMAIL_URL` still points at the local mail catcher, or when the Gmail sender address doesn't match.
- **Sign in with Google for patients** on the website and the app (decision 2026-11-05): staff keep password + MFA; a verified Google email that matches a patient account opens it. Rules: [security 03 §1a](../security/03-identity-authentication-sessions.md).

## 2. Set up Gmail (about 5 minutes)

1. Use (or create) the Gmail account MediLink will send from. Turn on **2-Step Verification**: Google Account → Security.
2. Google Account → Security → **App passwords** → create one named "MediLink". Copy the 16 letters (spaces don't matter; leave them out).
3. In Railway, on the **API** service and the **worker** service (the worker sends the emails), set:

   ```text
   EMAIL_URL=smtp+tls://you%40gmail.com:abcdefghijklmnop@smtp.gmail.com:587
   DEFAULT_FROM_EMAIL=MediLink Rwanda <you@gmail.com>
   ```

   Write the `@` of the address as `%40`. The sender must be the same Gmail address.
4. Check it: `railway run python manage.py send_test_email you@example.com` (or run it in the service shell). It says what is wrong if the login fails.
5. When it works, set `PATIENT_SIGNUP_EMAIL_VERIFICATION=true` on the API again so new patients confirm their email.

The worker service (`railway.worker.json`) must be running: emails are sent by Celery, not by the web process.

Gmail limit: about 500 emails a day. Moving to a domain later only changes `EMAIL_URL` and `DEFAULT_FROM_EMAIL`.

## 3. Set up Google sign-in (about 15 minutes)

In [Google Cloud Console](https://console.cloud.google.com/) with any Google account:

1. Create a project "MediLink Rwanda".
2. **APIs & Services → OAuth consent screen**: External, app name "MediLink Rwanda", support email, the website (`https://medilink-rwanda.vercel.app`), privacy and terms pages (`/privacy`, `/terms`). Scopes: only `openid`, `email`, `profile`. While the app is in "Testing", add the testers' Gmail addresses; "Publish" when ready.
3. **Credentials → Create credentials → OAuth client ID → Web application**:
   - Authorised JavaScript origins: `https://medilink-rwanda.vercel.app` and `http://localhost:5174`.
   - No redirect URIs are needed.
   - Copy the client ID (`….apps.googleusercontent.com`).
4. **Credentials → Create credentials → OAuth client ID → Android** (once for the shared app, once for development builds):

   | Client | Package name | SHA-1 certificate fingerprint |
   |---|---|---|
   | Release APK | `rw.medilink` | `11:43:C7:BF:83:7C:33:6E:8C:4F:D5:F1:32:57:1D:A0:74:48:25:6C` |
   | Debug builds (this PC) | `rw.medilink` | `FF:D6:1D:7F:C8:BD:62:D7:41:A6:50:27:9F:0C:31:48:19:1F:89:EA` |

   The Android clients need no further setting: the app asks Google with the **web** client ID.
5. In Railway (API service): `GOOGLE_OAUTH_WEB_CLIENT_ID=<the web client ID>`.

That's all: the website and the app read the client ID from the API (`GET /api/v1/patient/auth/google/`), so neither needs a rebuild when it changes. With the variable empty, the buttons stay hidden.

## 4. Open items

| Item | Note |
|---|---|
| Kinyarwanda and French email texts | Drafts; need native-speaker review (as all rw/fr texts) |
| Google consent screen verification | Not needed for the basic `openid email profile` scopes beyond the brand check Google does when publishing |
| iOS app | Not built; would need an iOS client ID in `GOOGLE_OAUTH_CLIENT_IDS` |
| Unlinking Google from an account | Not built; deleting the `GoogleIdentity` row in the admin unlinks it |
