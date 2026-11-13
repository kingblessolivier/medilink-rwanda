# Kinyarwanda strings: native-speaker review

Keys: 6272.

Status: **every Kinyarwanda string below is a draft that needs native-speaker review.** None of
them is final (docs/design/research/10-accessibility-and-localization.md §3, NFR-UX-01). Medical
terms must also be checked with clinicians. Review with real users (elderly patients, reception
staff) before the pilot.

How to review: correct the text in the `rw.json` file named in each section, then run
`pnpm i18n:review` to regenerate this list. Change a row's status only in the review tracker
agreed with the team; this file is generated.

Also to confirm:

- The emergency number shown to patients (`emergency.body`, currently **912**).
- Facility type and role names (`facility.types.*`, `facility.roles.*`).
- The mock API messages in `packages/api-client/src/mocks/messages.ts` (development only).

## Shared components (namespace ui)

File: `packages/ui/src/i18n/locales/rw.json`

| Key | Kinyarwanda (draft) | English source | Status |
|---|---|---|---|
| `skipLink` | Simbuka ujye ku bikubiyemo by’ingenzi | Skip to main content | needs native-speaker review |
| `loading` | Birimo gufunguka… | Loading… | needs native-speaker review |
| `close` | Funga | Close | needs native-speaker review |
| `errorSummary.title` | Hari ikibazo | There is a problem | needs native-speaker review |
| `field.optional` | (si ngombwa) | (optional) | needs native-speaker review |
| `field.errorPrefix` | Ikosa: | Error: | needs native-speaker review |
| `password.show` | Erekana | Show | needs native-speaker review |
| `password.hide` | Hisha | Hide | needs native-speaker review |
| `password.showLabel` | Erekana ijambo ry’ibanga | Show password | needs native-speaker review |
| `password.hideLabel` | Hisha ijambo ry’ibanga | Hide password | needs native-speaker review |
| `language.label` | Ururimi | Language | needs native-speaker review |
| `language.names.rw` | Ikinyarwanda | Ikinyarwanda | needs native-speaker review |
| `language.names.en` | English | English | needs native-speaker review |
| `language.names.fr` | Français | Français | needs native-speaker review |
| `theme.label` | Imigaragarire | Theme | needs native-speaker review |
| `theme.light` | Urumuri | Light | needs native-speaker review |
| `theme.dark` | Umwijima | Dark | needs native-speaker review |
| `theme.system` | Nk’igikoresho | System | needs native-speaker review |
| `logo.alt` | MediLink Rwanda | MediLink Rwanda | needs native-speaker review |
| `alert.info` | Amakuru: | Information: | needs native-speaker review |
| `alert.success` | Byagenze neza: | Success: | needs native-speaker review |
| `alert.warning` | Icyitonderwa: | Warning: | needs native-speaker review |
| `alert.danger` | Ikosa: | Error: | needs native-speaker review |
| `textSize.label` | Ingano y’inyandiko | Text size | needs native-speaker review |
| `textSize.normal` | Isanzwe | Normal | needs native-speaker review |
| `textSize.large` | Nini | Large | needs native-speaker review |
| `textSize.xlarge` | Nini cyane | Extra large | needs native-speaker review |
| `chart.showTable` | Erekana imbonerahamwe | Show table | needs native-speaker review |
| `chart.hideTable` | Hisha imbonerahamwe | Hide table | needs native-speaker review |
| `chart.keyboardHint` | Koresha utubuto tw’imyambi y’ibumoso n’iburyo kugira ngo usome agaciro kamwe kamwe. | Use the left and right arrow keys to read each value. | needs native-speaker review |
| `chart.tableOf` | Imibare y’igishushanyo: {{title}} | Data of the chart: {{title}} | needs native-speaker review |
| `dateParts.day` | Umunsi | Day | needs native-speaker review |
| `dateParts.month` | Ukwezi | Month | needs native-speaker review |
| `dateParts.year` | Umwaka | Year | needs native-speaker review |

## Staff app

File: `apps/staff-web/src/i18n/locales/rw.json`

| Key | Kinyarwanda (draft) | English source | Status |
|---|---|---|---|
| `app.name` | MediLink Abakozi | MediLink Staff | needs native-speaker review |
| `app.titleSuffix` | MediLink Abakozi | MediLink Staff | needs native-speaker review |
| `common.back` | Subira inyuma | Back | needs native-speaker review |
| `common.continue` | Komeza | Continue | needs native-speaker review |
| `common.retry` | Ongera ugerageze | Try again | needs native-speaker review |
| `common.logout` | Sohoka | Log out | needs native-speaker review |
| `common.copy` | Koporora | Copy | needs native-speaker review |
| `common.copied` | Byakoporowe | Copied | needs native-speaker review |
| `errors.generic` | Hari ikitagenze neza. Ongera ugerageze. | Something went wrong. Try again. | needs native-speaker review |
| `errors.network` | Ntitwashoboye kugera kuri MediLink. Reba niba murandasi ikora, wongere ugerageze. | We could not reach MediLink. Check your connection and try again. | needs native-speaker review |
| `errors.rateLimited` | Wagerageje inshuro nyinshi. Tegereza amasegonda {{seconds}}, wongere ugerageze. | Too many attempts. Wait {{seconds}} seconds, then try again. | needs native-speaker review |
| `errors.rateLimitedNoTime` | Wagerageje inshuro nyinshi. Tegereza umunota umwe, wongere ugerageze. | Too many attempts. Wait a minute, then try again. | needs native-speaker review |
| `errors.sessionExpired` | Igihe cyawe cyarangiye. Ongera winjire kugira ngo ukomeze. | Your session ended. Log in again to continue. | needs native-speaker review |
| `errors.loadFailed` | Ntitwashoboye gufungura konti yawe. | We could not load your account. | needs native-speaker review |
| `validation.emailRequired` | Andika imeyili yawe | Enter your email address | needs native-speaker review |
| `validation.emailInvalid` | Andika imeyili yanditse neza, urugero: izina@example.rw | Enter an email address in the correct format, like name@example.rw | needs native-speaker review |
| `validation.passwordRequired` | Andika ijambo ry’ibanga | Enter your password | needs native-speaker review |
| `validation.newPasswordLength` | Koresha nibura inyuguti 12 | Use at least 12 characters | needs native-speaker review |
| `validation.codeRequired` | Andika kode y’imibare 6 iri muri porogaramu yawe yo kwemeza | Enter the 6-digit code from your authenticator app | needs native-speaker review |
| `validation.codeFormat` | Kode igomba kuba imibare 6 | The code must be 6 digits | needs native-speaker review |
| `validation.recoveryCodeRequired` | Andika imwe muri kode zawe zo kugarura konti | Enter one of your recovery codes | needs native-speaker review |
| `validation.recoveryCodesSaved` | Emeza ko wabitse kode zawe zo kugarura konti | Confirm that you saved your recovery codes | needs native-speaker review |
| `brand.tagline` | Buri ruzinduko, ku gihe. | Every visit, on time. | needs native-speaker review |
| `brand.description` | Kwakira abarwayi, kwisuzumisha, farumasi no kwishyura mu kigo cyawe, ahantu hamwe hatuje. | Reception, consultations, pharmacy and billing for your facility, in one calm workspace. | needs native-speaker review |
| `brand.trust` | Byarinzwe · Amakuru abikwa mu Rwanda | Encrypted · Data stays in Rwanda | needs native-speaker review |
| `login.title` | Injira muri MediLink | Log in to MediLink | needs native-speaker review |
| `login.intro` | Ku bakozi b’ibigo by’ubuvuzi byemejwe. | For staff of verified health facilities. | needs native-speaker review |
| `login.email` | Imeyili | Email | needs native-speaker review |
| `login.password` | Ijambo ry’ibanga | Password | needs native-speaker review |
| `login.forgot` | Wibagiwe ijambo ry’ibanga? | Forgot password? | needs native-speaker review |
| `login.submit` | Injira | Log in | needs native-speaker review |
| `login.invalidCredentials` | Imeyili cyangwa ijambo ry’ibanga si byo. Bisuzume wongere ugerageze. | The email or password is not right. Check them and try again. | needs native-speaker review |
| `login.patientHint` | Urashaka kwivuza? Abarwayi bakoresha porogaramu ya MediLink. | Looking for care? Patients use the MediLink app instead. | needs native-speaker review |
| `mfaSetup.title` | Shyiraho kwinjira mu ntambwe ebyiri | Set up two-step login | needs native-speaker review |
| `mfaSetup.intro` | Konti z’abakozi zisaba intambwe ya kabiri mu kwinjira kugira ngo amakuru y’abarwayi arindwe. | Staff accounts need a second step at login to protect patient data. | needs native-speaker review |
| `mfaSetup.preparing` | Turimo gutegura… | Preparing your setup… | needs native-speaker review |
| `mfaSetup.setupFailed` | Ntitwashoboye gutangira. Ongera winjire. | We could not start the setup. Log in again. | needs native-speaker review |
| `mfaSetup.step1Title` | 1. Shyira porogaramu yo kwemeza muri telefoni | 1. Install an authenticator app | needs native-speaker review |
| `mfaSetup.step1Body` | Urugero Google Authenticator, Microsoft Authenticator cyangwa indi porogaramu ya TOTP, kuri telefoni ukoresha wenyine. | For example Google Authenticator, Microsoft Authenticator or another TOTP app, on a phone only you use. | needs native-speaker review |
| `mfaSetup.step2Title` | 2. Sikana iyi QR kode ukoresheje iyo porogaramu | 2. Scan this QR code with the app | needs native-speaker review |
| `mfaSetup.qrLabel` | QR kode yo kongera konti yawe ya MediLink muri porogaramu yo kwemeza | QR code to add your MediLink account to an authenticator app | needs native-speaker review |
| `mfaSetup.manualKeyLabel` | Ntushoboye gusikana? Andika uru rufunguzo muri porogaramu | Can’t scan? Enter this key in the app | needs native-speaker review |
| `mfaSetup.copyKey` | Koporora urufunguzo | Copy key | needs native-speaker review |
| `mfaSetup.step3Title` | 3. Andika kode y’imibare 6 porogaramu ikwereka | 3. Enter the 6-digit code the app shows | needs native-speaker review |
| `mfaSetup.code` | Kode y’imibare 6 | 6-digit code | needs native-speaker review |
| `mfaSetup.codeHint` | Kode ihinduka buri masegonda 30. | The code changes every 30 seconds. | needs native-speaker review |
| `mfaSetup.submit` | Emeza ukomeze | Confirm and continue | needs native-speaker review |
| `mfaSetup.codesTitle` | Bika kode zawe zo kugarura konti | Save your recovery codes | needs native-speaker review |
| `mfaSetup.codesIntro` | Niwatakaza telefoni, buri kode igufasha kwinjira rimwe. Zibike ahantu hizewe, kure ya telefoni yawe. Ntituzongera kuzikwereka. | If you lose your phone, each code lets you log in once. Keep them somewhere safe, away from your phone. We will not show them again. | needs native-speaker review |
| `mfaSetup.codesListLabel` | Kode zawe 10 zo kugarura konti | Your 10 recovery codes | needs native-speaker review |
| `mfaSetup.print` | Capa kode | Print codes | needs native-speaker review |
| `mfaSetup.copyCodes` | Koporora kode | Copy codes | needs native-speaker review |
| `mfaSetup.codesCopied` | Kode zakoporowe | Recovery codes copied | needs native-speaker review |
| `mfaSetup.savedConfirm` | Nabitse kode zanjye zo kugarura konti ahantu hizewe | I have saved my recovery codes in a safe place | needs native-speaker review |
| `mfaSetup.finish` | Komeza muri MediLink | Continue to MediLink | needs native-speaker review |
| `mfaSetup.printTitle` | Kode zo kugarura konti ya MediLink za {{email}} | MediLink recovery codes for {{email}} | needs native-speaker review |
| `mfaVerify.title` | Andika kode yo kwinjira | Enter your login code | needs native-speaker review |
| `mfaVerify.intro` | Fungura porogaramu yawe yo kwemeza, wandike kode y’imibare 6 ya MediLink. | Open your authenticator app and enter the 6-digit code for MediLink. | needs native-speaker review |
| `mfaVerify.code` | Kode y’imibare 6 | 6-digit code | needs native-speaker review |
| `mfaVerify.codeHint` | Shyiramo cyangwa wandike kode. Imyanya irimo nta kibazo. | Paste or type the code. Spaces are fine. | needs native-speaker review |
| `mfaVerify.submit` | Emeza winjire | Verify and log in | needs native-speaker review |
| `mfaVerify.useRecovery` | Koresha kode yo kugarura konti | Use a recovery code instead | needs native-speaker review |
| `mfaVerify.useApp` | Koresha kode iri muri porogaramu yanjye | Use the code from my app | needs native-speaker review |
| `mfaVerify.recoveryTitle` | Koresha kode yo kugarura konti | Use a recovery code | needs native-speaker review |
| `mfaVerify.recoveryIntro` | Andika imwe muri kode zo kugarura konti wabitse igihe washyiragaho kwinjira mu ntambwe ebyiri. | Enter one of the recovery codes you saved when you set up two-step login. | needs native-speaker review |
| `mfaVerify.recoveryCode` | Kode yo kugarura konti | Recovery code | needs native-speaker review |
| `mfaVerify.recoveryHint` | Urugero abcd-1234. Buri kode ikora rimwe gusa. | For example abcd-1234. Each code works once. | needs native-speaker review |
| `mfaVerify.backToLogin` | Subira ku kwinjira | Back to log in | needs native-speaker review |
| `facility.title` | Hitamo ikigo cyawe | Choose your facility | needs native-speaker review |
| `facility.intro` | Ukora mu bigo birenze kimwe. Hitamo aho ukorera ubu. Ushobora guhindura igihe icyo ari cyo cyose uhereye hejuru. | You work at more than one facility. Choose where you are working now. You can switch at any time from the top bar. | needs native-speaker review |
| `facility.choose` | Korera kuri {{name}} | Work at {{name}} | needs native-speaker review |
| `facility.rolesLabel` | Inshingano zawe | Your roles | needs native-speaker review |
| `facility.switcherLabel` | Ikigo urimo: {{name}}. Hindura ikigo | Current facility: {{name}}. Switch facility | needs native-speaker review |
| `facility.switchHeading` | Hindura ikigo | Switch facility | needs native-speaker review |
| `facility.current` | Ubu | Current | needs native-speaker review |
| `facility.switchFailed` | Ntitwashoboye guhindura ikigo. Ongera ugerageze. | We could not switch facility. Try again. | needs native-speaker review |
| `facility.noFacility` | Nta kigo cyatoranyijwe | No facility selected | needs native-speaker review |
| `facility.types.health_post` | Ivuriro ry’ibanze | Health post | needs native-speaker review |
| `facility.types.health_center` | Ikigo nderabuzima | Health center | needs native-speaker review |
| `facility.types.district_hospital` | Ibitaro by’akarere | District hospital | needs native-speaker review |
| `facility.types.provincial_hospital` | Ibitaro by’intara | Provincial hospital | needs native-speaker review |
| `facility.types.referral_hospital` | Ibitaro bikuru | Referral hospital | needs native-speaker review |
| `facility.types.private_clinic` | Ivuriro ryigenga | Private clinic | needs native-speaker review |
| `facility.types.polyclinic` | Polikilinike | Polyclinic | needs native-speaker review |
| `facility.types.private_hospital` | Ibitaro byigenga | Private hospital | needs native-speaker review |
| `facility.types.dental_clinic` | Ivuriro ry’amenyo | Dental clinic | needs native-speaker review |
| `facility.types.eye_clinic` | Ivuriro ry’amaso | Eye clinic | needs native-speaker review |
| `facility.types.diagnostic_center` | Ikigo cy’isuzuma | Diagnostic center | needs native-speaker review |
| `facility.types.other` | Ikigo cy’ubuvuzi | Health facility | needs native-speaker review |
| `facility.roles.facility_admin` | Umuyobozi w’ikigo | Facility admin | needs native-speaker review |
| `facility.roles.receptionist` | Ushinzwe kwakira abarwayi | Receptionist | needs native-speaker review |
| `facility.roles.doctor` | Muganga | Doctor | needs native-speaker review |
| `facility.roles.pharmacist` | Umufarumasiye | Pharmacist | needs native-speaker review |
| `facility.roles.cashier` | Ushinzwe kwishyuza | Cashier | needs native-speaker review |
| `facility.roles.triage_nurse` | Umuforomo w’isuzuma ry’ibanze | Triage nurse | needs native-speaker review |
| `facility.roles.lab_technician` | Umutekinisiye wa laboratwari | Lab technician | needs native-speaker review |
| `shell.navLabel` | Menu nyamukuru | Main menu | needs native-speaker review |
| `shell.openMenu` | Fungura menu | Open menu | needs native-speaker review |
| `shell.closeMenu` | Funga menu | Close menu | needs native-speaker review |
| `shell.platformAdmin` | Umuyobozi w’urubuga | Platform admin | needs native-speaker review |
| `shell.nav.today` | Uyu munsi | Today | needs native-speaker review |
| `shell.nav.queue` | Umurongo | Queue | needs native-speaker review |
| `shell.nav.calendar` | Kalendari | Calendar | needs native-speaker review |
| `shell.nav.patients` | Abarwayi | Patients | needs native-speaker review |
| `shell.nav.pharmacy` | Farumasi | Pharmacy | needs native-speaker review |
| `shell.nav.payments` | Kwishyura | Payments | needs native-speaker review |
| `shell.nav.approvals` | Ibyemezo | Approvals | needs native-speaker review |
| `shell.nav.reports` | Raporo | Reports | needs native-speaker review |
| `shell.nav.staff` | Abakozi | Staff | needs native-speaker review |
| `shell.nav.settings` | Igenamiterere | Settings | needs native-speaker review |
| `shell.nav.audit` | Igitabo cy’ibikorwa | Audit log | needs native-speaker review |
| `shell.nav.platformFacilities` | Ibigo | Facilities | needs native-speaker review |
| `shell.connection.label` | Murandasi | Connection | needs native-speaker review |
| `shell.connection.online` | Kuri murandasi | Online | needs native-speaker review |
| `shell.connection.offline` | Nta murandasi | Offline | needs native-speaker review |
| `shell.userMenu.label` | Menu ya konti | Account menu | needs native-speaker review |
| `shell.userMenu.signedInAs` | Winjiye nka | Signed in as | needs native-speaker review |
| `shell.userMenu.language` | Ururimi | Language | needs native-speaker review |
| `shell.userMenu.logout` | Sohoka | Log out | needs native-speaker review |
| `shell.userMenu.loggingOut` | Urasohoka… | Logging out… | needs native-speaker review |
| `shell.palette.title` | Shakisha cyangwa ujye kuri | Search or jump to | needs native-speaker review |
| `shell.palette.open` | Shakisha cyangwa ujye kuri… | Search or jump to… | needs native-speaker review |
| `shell.palette.placeholder` | Andika urupapuro, igikorwa cyangwa umurwayi | Type a page, an action or a patient | needs native-speaker review |
| `shell.palette.empty` | Nta kibonetse. Gerageza irindi jambo. | Nothing matches. Try another word. | needs native-speaker review |
| `shell.palette.hints` | ↑ ↓ kwimuka · Enter gufungura · Esc gufunga | ↑ ↓ to move · Enter to open · Esc to close | needs native-speaker review |
| `shell.palette.search` | Gushakisha | Search | needs native-speaker review |
| `shell.palette.actions` | Ibikorwa | Actions | needs native-speaker review |
| `shell.palette.pages` | Jya kuri | Go to | needs native-speaker review |
| `shell.palette.noResults` | Nta murwayi uhuye na byo kuri iki kigo | No match at this facility | needs native-speaker review |
| `shell.palette.searchFailed` | Gushakisha ntibyakunze. Ongera ugerageze. | The search did not work. Try again. | needs native-speaker review |
| `shell.palette.shortcut` | Ctrl K | Ctrl K | needs native-speaker review |
| `shell.collapse` | Gabanya menyu | Collapse menu | needs native-speaker review |
| `shell.expand` | Agura menyu | Expand menu | needs native-speaker review |
| `shell.section.work` | Akazi k’umunsi | Daily work | needs native-speaker review |
| `shell.section.manage` | Gucunga ikigo | Manage | needs native-speaker review |
| `shell.section.practice` | Akazi kanjye | My practice | needs native-speaker review |
| `today.title` | Uyu munsi | Today | needs native-speaker review |
| `today.greeting` | Muraho, {{name}} | Hello, {{name}} | needs native-speaker review |
| `today.rolesLabel` | Inshingano zawe hano | Your roles here | needs native-speaker review |
| `today.greeting_morning` | Mwaramutse, {{name}} | Good morning, {{name}} | needs native-speaker review |
| `today.greeting_afternoon` | Mwiriwe, {{name}} | Good afternoon, {{name}} | needs native-speaker review |
| `today.greeting_evening` | Muraho, {{name}} | Good evening, {{name}} | needs native-speaker review |
| `today.quickActions` | Ibikorwa byihuse | Quick actions | needs native-speaker review |
| `today.moreActions` | Ibindi ({{count}}) | More ({{count}}) | needs native-speaker review |
| `placeholder.title` | {{section}} | {{section}} | needs native-speaker review |
| `placeholder.body` | Iki gice kizakorwa mu cyiciro gikurikira. | This workspace is planned for a later sprint. | needs native-speaker review |
| `placeholder.back` | Subira ku Uyu munsi | Back to Today | needs native-speaker review |
| `placeholder.heading` | {{section}} biraje vuba | {{section}} is on its way | needs native-speaker review |
| `notFound.title` | Iyi paji ntibonetse | Page not found | needs native-speaker review |
| `notFound.body` | Reba aderesi, cyangwa usubire kuri paji y’Uyu munsi. | Check the address, or go back to your start page. | needs native-speaker review |
| `notFound.home` | Jya ku ipaji yanjye ibanza | Go to my start page | needs native-speaker review |
| `forgot.title` | Hindura ijambo ry’ibanga | Reset your password | needs native-speaker review |
| `forgot.intro` | Andika imeyili y’akazi. Niba ifite konti, tuzakoherereza ihuriro ryo gushyiraho ijambo ry’ibanga rishya. | Enter your work email. If it belongs to an account, we will send a link to set a new password. | needs native-speaker review |
| `forgot.email` | Imeyili | Email | needs native-speaker review |
| `forgot.submit` | Ohereza ihuriro | Send reset link | needs native-speaker review |
| `forgot.sentTitle` | Reba imeyili yawe | Check your email | needs native-speaker review |
| `forgot.sentBody` | Niba hari konti ya {{email}}, ihuriro ryo guhindura riroherejwe. Rikora iminota 30. | If an account exists for {{email}}, a reset link is on its way. The link works for 30 minutes. | needs native-speaker review |
| `forgot.back` | Subira ku kwinjira | Back to log in | needs native-speaker review |
| `reset.title` | Shyiraho ijambo ry’ibanga rishya | Set a new password | needs native-speaker review |
| `reset.newPassword` | Ijambo ry’ibanga rishya | New password | needs native-speaker review |
| `reset.hint` | Nibura inyuguti 12. Interuro ngufi yoroshye kwibuka kandi igoye gukeka. | At least 12 characters. A short phrase is easy to remember and hard to guess. | needs native-speaker review |
| `reset.submit` | Bika ijambo ry’ibanga rishya | Save new password | needs native-speaker review |
| `reset.doneTitle` | Ijambo ry’ibanga ryahinduwe | Password changed | needs native-speaker review |
| `reset.doneBody` | Ijambo ry’ibanga ryahinduwe kandi wasohowe ahantu hose. Injira ukoresheje ijambo ry’ibanga rishya. | Your password was changed and you were logged out everywhere. Log in with your new password. | needs native-speaker review |
| `reset.invalidLink` | Iri huriro ntiryuzuye. Ongera ufungure ihuriro riri muri imeyili, cyangwa usabe irindi. | This link is incomplete. Open the link from the email again, or ask for a new one. | needs native-speaker review |
| `reset.toLogin` | Jya ku kwinjira | Go to log in | needs native-speaker review |
| `noAccess.title` | Nta burenganzira ufite kuri iyi paji | You don't have access to this page | needs native-speaker review |
| `noAccess.body` | Inshingano zawe muri iki kigo ntizirimo iyi paji. Niba uyikeneye, baza umuyobozi w'ikigo. | Your role at this facility doesn't include it. If you need it, ask your facility admin. | needs native-speaker review |
| `noAccess.home` | Subira ku kazi kanjye | Back to my work | needs native-speaker review |

## Patient app

File: `apps/patient-web/src/i18n/locales/rw.json`

| Key | Kinyarwanda (draft) | English source | Status |
|---|---|---|---|
| `app.name` | MediLink | MediLink | needs native-speaker review |
| `app.titleSuffix` | MediLink Rwanda | MediLink Rwanda | needs native-speaker review |
| `common.back` | Subira inyuma | Back | needs native-speaker review |
| `common.continue` | Komeza | Continue | needs native-speaker review |
| `common.retry` | Ongera ugerageze | Try again | needs native-speaker review |
| `common.logout` | Sohoka | Log out | needs native-speaker review |
| `common.loggingOut` | Urasohoka… | Logging out… | needs native-speaker review |
| `common.opensInNewTab` | (bifungukira mu idirishya rishya) | (opens in a new tab) | needs native-speaker review |
| `common.comingSoon` | Biraza vuba | Coming soon | needs native-speaker review |
| `common.close` | Funga | Close | needs native-speaker review |
| `errors.generic` | Hari ikitagenze neza. Ongera ugerageze. | Something went wrong. Try again. | needs native-speaker review |
| `errors.network` | Ntitwashoboye kugera kuri MediLink. Reba niba murandasi ikora, wongere ugerageze. | We could not reach MediLink. Check your connection and try again. | needs native-speaker review |
| `errors.rateLimited` | Wagerageje inshuro nyinshi. Tegereza amasegonda {{seconds}}, wongere ugerageze. | Too many attempts. Wait {{seconds}} seconds, then try again. | needs native-speaker review |
| `errors.rateLimitedNoTime` | Wagerageje inshuro nyinshi. Tegereza umunota umwe, wongere ugerageze. | Too many attempts. Wait a minute, then try again. | needs native-speaker review |
| `errors.sessionExpired` | Wasohowe. Ongera winjire kugira ngo ukomeze. | You were logged out. Log in again to continue. | needs native-speaker review |
| `errors.loadFailed` | Ntitwashoboye gufungura konti yawe. | We could not load your account. | needs native-speaker review |
| `validation.emailRequired` | Andika imeyili yawe | Enter your email address | needs native-speaker review |
| `validation.emailInvalid` | Andika imeyili yanditse neza, urugero: izina@example.rw | Enter an email address in the correct format, like name@example.rw | needs native-speaker review |
| `validation.passwordRequired` | Andika ijambo ry’ibanga | Enter your password | needs native-speaker review |
| `validation.passwordLength` | Koresha nibura inyuguti 8 | Use at least 8 characters | needs native-speaker review |
| `validation.nameRequired` | Andika amazina yawe | Enter your names | needs native-speaker review |
| `validation.termsRequired` | Emera amabwiriza yo gukoresha kugira ngo ufungure konti | Accept the terms of use to create an account | needs native-speaker review |
| `validation.privacyRequired` | Emera itangazo ry’ibanga kugira ngo ufungure konti | Accept the privacy notice to create an account | needs native-speaker review |
| `nav.label` | Ibikubiyemo | Main | needs native-speaker review |
| `nav.findCare` | Shaka ubuvuzi | Find Care | needs native-speaker review |
| `nav.forFacilities` | Ku bigo by’ubuvuzi | For facilities | needs native-speaker review |
| `nav.login` | Injira | Sign In | needs native-speaker review |
| `nav.home` | Ahabanza | Home | needs native-speaker review |
| `nav.checkSymptoms` | Isuzume ibimenyetso | Check symptoms | needs native-speaker review |
| `nav.emergency` | Ubutabazi bwihuse | Emergency help | needs native-speaker review |
| `nav.menu` | Ibikubiyemo | Menu | needs native-speaker review |
| `nav.facilities` | Ibigo | Facilities | needs native-speaker review |
| `nav.doctors` | Abaganga | Doctors | needs native-speaker review |
| `nav.services` | Serivisi | Services | needs native-speaker review |
| `nav.howItWorks` | Uko bikora | How It Works | needs native-speaker review |
| `nav.emergencyShort` | Ubutabazi | Emergency | needs native-speaker review |
| `nav.closeMenu` | Funga ibikubiyemo | Close menu | needs native-speaker review |
| `nav.homeLabel` | Ahabanza ha MediLink Rwanda | MediLink Rwanda home | needs native-speaker review |
| `nav.strip.label` | Ubutabazi bwihuse | Emergency | needs native-speaker review |
| `nav.strip.long` | Ubuzima buri mu kaga? | Life-threatening emergency? | needs native-speaker review |
| `nav.strip.short` | Byihutirwa? | Emergency? | needs native-speaker review |
| `nav.strip.call` | Hamagara 912 | Call 912 | needs native-speaker review |
| `nav.strip.free` | SAMU · ni ubuntu, amasaha 24 | SAMU · free, 24 hours | needs native-speaker review |
| `nav.strip.guide` | Icyo wakora mu byihutirwa | Emergency guide | needs native-speaker review |
| `landing.search.title` | Shaka ubuvuzi | Find care | needs native-speaker review |
| `landing.search.service` | Ukeneye iki? | What do you need? | needs native-speaker review |
| `landing.search.serviceAny` | Serivisi zose | Any service | needs native-speaker review |
| `landing.search.location` | Hehe? | Where? | needs native-speaker review |
| `landing.search.locationAny` | Ahantu hose mu Rwanda | Anywhere in Rwanda | needs native-speaker review |
| `landing.search.insurance` | Ubwishingizi bwawe | Your insurance | needs native-speaker review |
| `landing.search.insuranceAny` | Ubwishingizi bwose | Any insurance | needs native-speaker review |
| `landing.search.submit` | Shakisha | Search | needs native-speaker review |
| `landing.search.popular` | Bikunzwe | Popular | needs native-speaker review |
| `landing.services.general` | Kwisuzumisha muri rusange | General consultation | needs native-speaker review |
| `landing.services.pediatrics` | Ubuvuzi bw’abana | Pediatrics | needs native-speaker review |
| `landing.services.dental` | Ubuvuzi bw’amenyo | Dental care | needs native-speaker review |
| `landing.services.antenatal` | Kwipimisha utwite | Antenatal care | needs native-speaker review |
| `landing.services.eye` | Ubuvuzi bw’amaso | Eye care | needs native-speaker review |
| `landing.services.women` | Ubuzima bw’abagore | Women’s health | needs native-speaker review |
| `landing.services.chronic` | Indwara zidakira | Chronic care | needs native-speaker review |
| `landing.services.vaccination` | Inkingo | Vaccination | needs native-speaker review |
| `landing.districts.bugesera` | Bugesera | Bugesera | needs native-speaker review |
| `landing.districts.burera` | Burera | Burera | needs native-speaker review |
| `landing.districts.gakenke` | Gakenke | Gakenke | needs native-speaker review |
| `landing.districts.gasabo` | Gasabo | Gasabo | needs native-speaker review |
| `landing.districts.gatsibo` | Gatsibo | Gatsibo | needs native-speaker review |
| `landing.districts.gicumbi` | Gicumbi | Gicumbi | needs native-speaker review |
| `landing.districts.gisagara` | Gisagara | Gisagara | needs native-speaker review |
| `landing.districts.huye` | Huye | Huye | needs native-speaker review |
| `landing.districts.kamonyi` | Kamonyi | Kamonyi | needs native-speaker review |
| `landing.districts.karongi` | Karongi | Karongi | needs native-speaker review |
| `landing.districts.kayonza` | Kayonza | Kayonza | needs native-speaker review |
| `landing.districts.kicukiro` | Kicukiro | Kicukiro | needs native-speaker review |
| `landing.districts.kirehe` | Kirehe | Kirehe | needs native-speaker review |
| `landing.districts.muhanga` | Muhanga | Muhanga | needs native-speaker review |
| `landing.districts.musanze` | Musanze | Musanze | needs native-speaker review |
| `landing.districts.ngoma` | Ngoma | Ngoma | needs native-speaker review |
| `landing.districts.ngororero` | Ngororero | Ngororero | needs native-speaker review |
| `landing.districts.nyabihu` | Nyabihu | Nyabihu | needs native-speaker review |
| `landing.districts.nyagatare` | Nyagatare | Nyagatare | needs native-speaker review |
| `landing.districts.nyamagabe` | Nyamagabe | Nyamagabe | needs native-speaker review |
| `landing.districts.nyamasheke` | Nyamasheke | Nyamasheke | needs native-speaker review |
| `landing.districts.nyanza` | Nyanza | Nyanza | needs native-speaker review |
| `landing.districts.nyarugenge` | Nyarugenge | Nyarugenge | needs native-speaker review |
| `landing.districts.nyaruguru` | Nyaruguru | Nyaruguru | needs native-speaker review |
| `landing.districts.rubavu` | Rubavu | Rubavu | needs native-speaker review |
| `landing.districts.ruhango` | Ruhango | Ruhango | needs native-speaker review |
| `landing.districts.rulindo` | Rulindo | Rulindo | needs native-speaker review |
| `landing.districts.rusizi` | Rusizi | Rusizi | needs native-speaker review |
| `landing.districts.rutsiro` | Rutsiro | Rutsiro | needs native-speaker review |
| `landing.districts.rwamagana` | Rwamagana | Rwamagana | needs native-speaker review |
| `landing.insurers.mutuelle` | Mituweli (Mutuelle de Santé) | Mutuelle de Santé (CBHI) | needs native-speaker review |
| `landing.insurers.rama` | RAMA (RSSB) | RAMA (RSSB) | needs native-speaker review |
| `landing.insurers.mmi` | MMI | MMI | needs native-speaker review |
| `landing.insurers.private` | Ubwishingizi bwigenga | Private insurance | needs native-speaker review |
| `landing.insurers.none` | Nta bwishingizi (ndiyishyurira) | No insurance (I pay) | needs native-speaker review |
| `landing.insurersShort.mutuelle` | Mutuelle | Mutuelle | needs native-speaker review |
| `landing.insurersShort.rama` | RAMA | RAMA | needs native-speaker review |
| `landing.insurersShort.mmi` | MMI | MMI | needs native-speaker review |
| `landing.insurersShort.private` | Ubwishingizi bwigenga | Private | needs native-speaker review |
| `emergency.title` | Ubutabazi bwihuse? | Emergency? | needs native-speaker review |
| `emergency.body` | Jya ku ishami ry’ubutabazi bwihuse rikwegereye cyangwa uhamagare 912. MediLink si iy’ubutabazi bwihuse. | Go to the nearest emergency department or call 912. MediLink is not for emergencies. | needs native-speaker review |
| `footer.privacy` | Politiki y’ibanga | Privacy Policy | needs native-speaker review |
| `footer.terms` | Amabwiriza yo gukoresha | Terms of Service | needs native-speaker review |
| `footer.verify` | Genzura inyandiko | Verify a document | needs native-speaker review |
| `footer.forFacilities` | Ku bigo by’ubuvuzi | For facilities | needs native-speaker review |
| `footer.help` | Ubufasha | Help & Support | needs native-speaker review |
| `footer.copyright` | © {{year}} MediLink Rwanda | © {{year}} MediLink Rwanda | needs native-speaker review |
| `footer.about` | Ibyerekeye MediLink | About MediLink | needs native-speaker review |
| `footer.emergency` | Ibyihutirwa | Emergency | needs native-speaker review |
| `footer.checkSymptoms` | Ntuzi aho wajya? | Not sure where to go? | needs native-speaker review |
| `footer.groups.explore` | Shakisha | Explore | needs native-speaker review |
| `footer.groups.information` | Amakuru | Information | needs native-speaker review |
| `footer.groups.legal` | Amategeko | Legal | needs native-speaker review |
| `footer.groups.support` | Ubufasha | Help | needs native-speaker review |
| `footer.tagline` | Duhuza abantu n’ibigo by’ubuvuzi mu Rwanda hose. | Connecting people to healthcare facilities across Rwanda. | needs native-speaker review |
| `footer.trust` | Shakisha udafite konti. Aho uri bikoreshwa mu gushakisha gusa kandi ntibibikwa. | Search without an account. Your location is used only for your search and never stored. | needs native-speaker review |
| `footer.contact` | Twandikire | Contact | needs native-speaker review |
| `footer.accessibility` | Kugerwaho na bose | Accessibility | needs native-speaker review |
| `footer.label` | Imiyoboro y’urubuga | Site links | needs native-speaker review |
| `footer.hotlineNote` | Umurongo w’imbangukiragutabara ni ubuntu, amasaha 24 | Free ambulance line, open 24 hours | needs native-speaker review |
| `footer.cta.title` | Ukeneye kuvurwa uyu munsi? | Need care today? | needs native-speaker review |
| `footer.cta.body` | Shaka ikigo cy’ubuvuzi gifunguye hafi yawe, urebe uko cyuzuye kandi ufate umwanya mbere yo kuva mu rugo. | Find an open facility near you, see how busy it is and book ahead before you leave home. | needs native-speaker review |
| `footer.cta.symptoms` | Ntuzi aho wajya? | Not sure where to go? | needs native-speaker review |
| `footer.cta.call` | Ibyihutirwa · hamagara 912 | Emergency · call 912 | needs native-speaker review |
| `footer.dataInRwanda` | Amakuru y'ubuzima abikwa mu Rwanda | Health data stored in Rwanda | needs native-speaker review |
| `authAside.label` | Akamaro ka konti | Why an account | needs native-speaker review |
| `authAside.title` | Tegereza igihe gito, ubone umwanya wo gukira. | Spend less time waiting and more time getting better. | needs native-speaker review |
| `authAside.lead` | Konti imwe yawe n’umuryango wawe, mu kigo cyose kiri kuri MediLink. | One account for you and your family, at every facility on MediLink. | needs native-speaker review |
| `authAside.points.book.title` | Fata umwanya mbere | Book ahead | needs native-speaker review |
| `authAside.points.book.body` | Hitamo ikigo, serivisi n’igihe kikubereye. | Choose a facility, a service and a time that suits you. | needs native-speaker review |
| `authAside.points.queue.title` | Kurikirana umwanya wawe ku murongo | Follow your place in the queue | needs native-speaker review |
| `authAside.points.queue.body` | Va mu rugo igihe cyawe cyegereje, aho kujya amasaha menshi mbere. | Leave home when it is nearly your turn, not hours before. | needs native-speaker review |
| `authAside.points.records.title` | Amakuru yawe y’ubuzima ahantu hamwe | Your records in one place | needs native-speaker review |
| `authAside.points.records.body` | Imiti wandikiwe, ibisubizo n’inyandiko ushobora gusangiza mu mutekano. | Prescriptions, results and documents you can share safely. | needs native-speaker review |
| `authAside.trust` | Amakuru yawe y’ubuzima arinzwe n’itegeko ry’u Rwanda rirengera amakuru bwite, kandi asangizwa gusa ubyemeye. | Your health data is protected under Rwanda’s data protection law and is only shared when you allow it. | needs native-speaker review |
| `login.intent.book` | Injira ufate igihe cya {{service}} kuri {{facility}} | Sign in to book {{service}} at {{facility}} | needs native-speaker review |
| `login.intent.bookAt` | Injira ufate igihe kuri {{facility}} | Sign in to book at {{facility}} | needs native-speaker review |
| `login.intent.bookAny` | Injira ufate igihe | Sign in to book | needs native-speaker review |
| `login.intent.join` | Injira ujye ku murongo wa {{service}} kuri {{facility}} | Sign in to join the queue for {{service}} at {{facility}} | needs native-speaker review |
| `login.intent.joinAt` | Injira ujye ku murongo kuri {{facility}} | Sign in to join the queue at {{facility}} | needs native-speaker review |
| `login.intent.joinAny` | Injira ujye ku murongo | Sign in to join the queue | needs native-speaker review |
| `login.title` | Injira cyangwa ufungure konti | Log in or create an account | needs native-speaker review |
| `login.intro` | Fata igihe cyo kwivuza wirinde gutegereza igihe kirekire. | Book care and skip the long wait. | needs native-speaker review |
| `login.email` | Imeyili | Email | needs native-speaker review |
| `login.continue` | Komeza | Continue | needs native-speaker review |
| `login.passwordTitle` | Andika ijambo ry’ibanga | Enter your password | needs native-speaker review |
| `login.loggingInAs` | Winjira nka {{email}} | Logging in as {{email}} | needs native-speaker review |
| `login.changeEmail` | Hindura imeyili | Change email | needs native-speaker review |
| `login.password` | Ijambo ry’ibanga | Password | needs native-speaker review |
| `login.forgot` | Wibagiwe ijambo ry’ibanga? | Forgot password? | needs native-speaker review |
| `login.submit` | Injira | Log in | needs native-speaker review |
| `login.newHere` | Ni ubwa mbere ukoresha MediLink? | First time on MediLink? | needs native-speaker review |
| `login.createAccount` | Fungura konti ukoresheje iyi meyili | Create an account with this email | needs native-speaker review |
| `login.invalidCredentials` | Imeyili cyangwa ijambo ry’ibanga si byo. Bisuzume wongere ugerageze. | The email or password is not right. Check them and try again. | needs native-speaker review |
| `login.guest` | Shaka ubuvuzi nta konti | Find care without an account | needs native-speaker review |
| `google.or` | cyangwa | or | needs native-speaker review |
| `google.failed` | Kwinjira ukoresheje Google ntibyakunze. Ongera ugerageze. | Google sign-in didn't work. Try again. | needs native-speaker review |
| `google.consentTitle` | Fungura konti yawe ukoresheje Google | Create your account with Google | needs native-speaker review |
| `google.create` | Fungura konti yanjye | Create my account | needs native-speaker review |
| `google.cancel` | Reka | Cancel | needs native-speaker review |
| `signup.title` | Fungura konti yawe | Create your account | needs native-speaker review |
| `signup.intro` | Bifata nk’umunota umwe. Ubwishingizi n’abagize umuryango wabyongeraho nyuma. | It takes about a minute. You can add insurance and family members later. | needs native-speaker review |
| `signup.step` | Intambwe ya {{current}} kuri {{total}} | Step {{current}} of {{total}} | needs native-speaker review |
| `signup.fullName` | Amazina yawe | Your names | needs native-speaker review |
| `signup.fullNameHint` | Nk’uko yanditse ku ndangamuntu yawe. | As written on your ID. | needs native-speaker review |
| `signup.email` | Imeyili | Email | needs native-speaker review |
| `signup.password` | Ijambo ry’ibanga | Password | needs native-speaker review |
| `signup.passwordHint` | Koresha nibura inyuguti 8. Interuro ngufi yoroshye kwibuka kandi igoye gukeka. | Use at least 8 characters. A short sentence is easy to remember and hard to guess. | needs native-speaker review |
| `signup.passwordRule` | Nibura inyuguti 8 | At least 8 characters | needs native-speaker review |
| `signup.passwordRuleMet` | byuzuye | done | needs native-speaker review |
| `signup.passwordRuleNotMet` | ntibiruzura | not yet | needs native-speaker review |
| `signup.language` | Ururimi rw’ubutumwa | Language for messages | needs native-speaker review |
| `signup.languageHint` | Twohereza ubutumwa n’ibyibutsa muri uru rurimi. | We send reminders and messages in this language. | needs native-speaker review |
| `signup.continue` | Komeza | Continue | needs native-speaker review |
| `signup.consentTitle` | Ibanga ryawe n’uburenganzira utanga | Your privacy and consent | needs native-speaker review |
| `signup.consentIntro` | Mbere yo gufungura konti yawe, soma ibi: | Before we create your account, please read this: | needs native-speaker review |
| `signup.consentPoint1` | Amakuru y’ubuzima bwawe arinzwe kandi abikwa mu Rwanda. | Your health information is encrypted and stored in Rwanda. | needs native-speaker review |
| `signup.consentPoint2` | Ibigo bikuvura gusa ni byo bishobora kubona amadosiye yawe. | Only the facilities that care for you can see your records. | needs native-speaker review |
| `signup.consentPoint3` | Ushobora gukuramo amakuru yawe cyangwa gusiba konti yawe igihe icyo ari cyo cyose. | You can download your data or delete your account at any time. | needs native-speaker review |
| `signup.readPrivacy` | Soma itangazo ry’ibanga ryose | Read the full privacy notice | needs native-speaker review |
| `signup.readTerms` | Soma amabwiriza yo gukoresha | Read the terms of use | needs native-speaker review |
| `signup.terms` | Nemeye amabwiriza yo gukoresha | I accept the terms of use | needs native-speaker review |
| `signup.privacy` | Nasomye itangazo ry’ibanga kandi nemeye uko MediLink ikoresha amakuru yanjye | I have read the privacy notice and agree to how MediLink uses my information | needs native-speaker review |
| `signup.research` | Nemeye ko amakuru yanjye atagaragaza uwo ndi we yakoreshwa mu bushakashatsi ku buzima | I agree that my anonymised data may be used for health research | needs native-speaker review |
| `signup.researchHint` | Si ngombwa. Kwanga nta cyo bihindura ku buvuzi bwawe. Ushobora kubihindura nyuma. | Optional. Saying no changes nothing about your care. You can change this later. | needs native-speaker review |
| `signup.submit` | Fungura konti | Create account | needs native-speaker review |
| `signup.haveAccount` | Usanzwe ufite konti? | Already have an account? | needs native-speaker review |
| `signup.login` | Injira | Log in | needs native-speaker review |
| `signup.checkEmailTitle` | Reba imeyili yawe | Check your email | needs native-speaker review |
| `signup.checkEmailBody` | Twohereje ubutumwa kuri {{email}}. Fungura ihuriro riri muri ubwo butumwa kugira ngo urangize gufungura konti. Iryo huriro rimara iminsi 3. | We sent a message to {{email}}. Open the link in it to finish creating your account. The link works for 3 days. | needs native-speaker review |
| `signup.checkEmailHint` | Nta meyili wabonye nyuma y’iminota mike? Reba mu butumwa bwa spam, cyangwa wongere wiyandikishe ubone irindi huriro. | No email after a few minutes? Check your spam folder, or sign up again to get a new link. | needs native-speaker review |
| `signup.readyTitle` | Konti yawe yiteguye | Your account is ready | needs native-speaker review |
| `signup.readyBody` | Injira ukoresheje {{email}} n’ijambo ry’ibanga ryawe. | Sign in with {{email}} and your password. | needs native-speaker review |
| `verifyEmail.title` | Emeza imeyili yawe | Confirm your email | needs native-speaker review |
| `verifyEmail.working` | Turimo kwemeza imeyili yawe… | Confirming your email… | needs native-speaker review |
| `verifyEmail.failedTitle` | Ntitwashoboye kwemeza imeyili yawe | We couldn't confirm your email | needs native-speaker review |
| `verifyEmail.invalidLink` | Iri huriro ntiryuzuye. Ongera ufungure ihuriro riri muri imeyili. | This link is incomplete. Open the link from the email again. | needs native-speaker review |
| `verifyEmail.signUpAgain` | Ongera wiyandikishe | Sign up again | needs native-speaker review |
| `home.description` | Shaka aho wavurirwa hafi yawe mu Rwanda: igihe cyo gutegereza, ahafunguye ubu, ubwishingizi bwawe. Jya ku murongo cyangwa ufate igihe. | Find care near you in Rwanda: live waits, open now, your insurance. Join the queue or book. | needs native-speaker review |
| `home.ask` | Urumva umerewe ute? | What are you feeling? | needs native-speaker review |
| `home.placeholder` | urugero: umwana afite umuriro, amenyo, kwipimisha utwite | e.g. child has fever, dentist, pregnancy check | needs native-speaker review |
| `home.search` | Shakisha | Search | needs native-speaker review |
| `home.chipsLabel` | Ibikenewe kenshi | Common needs | needs native-speaker review |
| `home.chips.sick` | Ndarwaye uyu munsi | Sick today | needs native-speaker review |
| `home.chips.child` | Umwana | Child | needs native-speaker review |
| `home.chips.pregnancy` | Inda | Pregnancy | needs native-speaker review |
| `home.chips.teeth` | Amenyo | Teeth | needs native-speaker review |
| `home.chips.eyes` | Amaso | Eyes | needs native-speaker review |
| `home.chips.chronic` | Indwara zidakira | Chronic care | needs native-speaker review |
| `home.chips.unsure` | Simbizi neza | Not sure | needs native-speaker review |
| `home.keywords.general` | muganga\|kwisuzumisha | general\|doctor\|consultation | needs native-speaker review |
| `home.keywords.pediatrics` | umwana\|abana\|uruhinja | child\|children\|baby\|paediatric\|pediatric | needs native-speaker review |
| `home.keywords.dental` | amenyo\|iryinyo | dentist\|dental\|teeth\|tooth | needs native-speaker review |
| `home.keywords.antenatal` | utwite\|kwipimisha inda | pregnan\|antenatal\|prenatal | needs native-speaker review |
| `home.keywords.eye` | amaso\|ijisho | eye\|eyes\|vision | needs native-speaker review |
| `home.keywords.women` | abagore | gynaecolog\|gynecolog\|women | needs native-speaker review |
| `home.keywords.chronic` | zidakira | chronic | needs native-speaker review |
| `home.keywords.vaccination` | urukingo\|inkingo\|gukingira | vaccin\|immuni | needs native-speaker review |
| `home.district` | Akarere | District | needs native-speaker review |
| `home.anyDistrict` | Uturere twose | All districts | needs native-speaker review |
| `home.insurance` | Ubwishingizi | Insurance | needs native-speaker review |
| `home.anyInsurance` | Ubwishingizi bwose | Any insurance | needs native-speaker review |
| `home.type` | Ubwoko | Type | needs native-speaker review |
| `home.anyType` | Ubwoko bwose | All types | needs native-speaker review |
| `home.openNow` | Hafunguye ubu | Open now | needs native-speaker review |
| `home.nearMe` | Hafi yanjye | Near me | needs native-speaker review |
| `home.nearYou` | Hafi yawe | Near you | needs native-speaker review |
| `home.locationDenied` | Aho uri ntibibonetse · Hitamo akarere | Location unavailable · Pick a district | needs native-speaker review |
| `home.places` | Aho wavurirwa | Places | needs native-speaker review |
| `home.count_one` | Ikigo {{count}} | {{count}} facility | needs native-speaker review |
| `home.count_other` | Ibigo {{count}} | {{count}} facilities | needs native-speaker review |
| `home.sort.label` | Tondeka | Sort | needs native-speaker review |
| `home.sort.soonest` | Uzakirwa vuba | Soonest seen | needs native-speaker review |
| `home.sort.nearest` | Hafi cyane | Nearest | needs native-speaker review |
| `home.sort.name` | A–Z | A–Z | needs native-speaker review |
| `home.view.label` | Uko bigaragara | View | needs native-speaker review |
| `home.view.list` | Urutonde | List | needs native-speaker review |
| `home.view.map` | Ikarita | Map | needs native-speaker review |
| `home.columns.name` | Ahantu | Place | needs native-speaker review |
| `home.columns.type` | Ubwoko | Type | needs native-speaker review |
| `home.columns.distance` | Intera | Distance | needs native-speaker review |
| `home.columns.status` | Uko bimeze | Status | needs native-speaker review |
| `home.columns.wait` | Gutegereza | Wait | needs native-speaker review |
| `home.open` | Harafunguye | Open | needs native-speaker review |
| `home.closed` | Harafunze | Closed | needs native-speaker review |
| `home.wait_one` | {{count}} bategereje · iminota {{min}}–{{max}} | {{count}} waiting · {{min}}–{{max}} min | needs native-speaker review |
| `home.wait_other` | {{count}} bategereje · iminota {{min}}–{{max}} | {{count}} waiting · {{min}}–{{max}} min | needs native-speaker review |
| `home.waiting_one` | {{count}} bategereje | {{count}} waiting | needs native-speaker review |
| `home.waiting_other` | {{count}} bategereje | {{count}} waiting | needs native-speaker review |
| `home.noWait` | Nta gutegereza | No wait | needs native-speaker review |
| `home.next` | Igikurikira {{time}} | Next {{time}} | needs native-speaker review |
| `home.join` | Jya ku murongo | Join | needs native-speaker review |
| `home.book` | Fata igihe | Book | needs native-speaker review |
| `home.viewLink` | Reba | View | needs native-speaker review |
| `home.empty` | Nta hantu hahuye n’ibyo washatse | No places match | needs native-speaker review |
| `home.clear` | Kuraho ibyatoranyijwe | Clear filters | needs native-speaker review |
| `home.failed` | Ntibyashobotse kuzana aho wavurirwa | Couldn't load places | needs native-speaker review |
| `home.retry` | Ongera ugerageze | Retry | needs native-speaker review |
| `home.mapLabel` | Ikarita y’aho wavurirwa | Map of places | needs native-speaker review |
| `home.mapAttribution` | © abaterankunga ba OpenStreetMap | © OpenStreetMap contributors | needs native-speaker review |
| `home.emergency` | Ubutabazi 24/24 | Emergency 24h | needs native-speaker review |
| `home.call912` | Hamagara 912 | Call 912 | needs native-speaker review |
| `home.directions` | Inzira | Directions | needs native-speaker review |
| `home.byService` | Ukurikije serivisi | By service | needs native-speaker review |
| `home.recent` | Aho uherutse kureba | Recent places | needs native-speaker review |
| `home.alerts` | Kumenyeshwa igihe cyawe | Alerts for your turn | needs native-speaker review |
| `home.install` | Shyira porogaramu muri telefoni | Install the app | needs native-speaker review |
| `home.turnOnAlerts` | Fungura imenyesha | Turn on alerts | needs native-speaker review |
| `home.verify` | Genzura inyandiko | Verify a document | needs native-speaker review |
| `home.verifyCode` | Kode y’inyandiko | Document code | needs native-speaker review |
| `home.check` | Genzura | Check | needs native-speaker review |
| `home.scan` | Soma QR | Scan QR | needs native-speaker review |
| `home.forFacilities` | Ku bigo by’ubuvuzi | For facilities | needs native-speaker review |
| `home.register` | Iyandikishe | Register | needs native-speaker review |
| `home.now.title` | Ubu nonaha | Right now | needs native-speaker review |
| `home.now.open` | ahantu hafunguye | places open | needs native-speaker review |
| `home.now.waiting` | Abategereje | People waiting | needs native-speaker review |
| `home.now.shortest` | Igihe gito cyo gutegereza | Shortest wait | needs native-speaker review |
| `home.now.minutes` | ≤ iminota {{max}} | ≤ {{max}} min | needs native-speaker review |
| `info.back` | Subira ahabanza | Back to the home page | needs native-speaker review |
| `info.forFacilities.title` | MediLink ku bigo by’ubuvuzi | MediLink for health facilities | needs native-speaker review |
| `info.forFacilities.body` | Kwiyandikisha kw’ibigo kuzatangira mu gice gikurikira. Muzashobora gusaba kuri interineti mugatangira nyuma yo kugenzurwa. | Facility registration opens in the next release. You will be able to apply online and go live after verification. | needs native-speaker review |
| `info.terms.title` | Amabwiriza yo gukoresha | Terms of use | needs native-speaker review |
| `info.terms.body` | Amabwiriza yose yo gukoresha azashyirwa hano mbere yo gutangira, mu Kinyarwanda, Icyongereza n’Igifaransa. | The full terms of use will be published here before launch, in Kinyarwanda, English and French. | needs native-speaker review |
| `info.privacy.title` | Itangazo ry’ibanga | Privacy notice | needs native-speaker review |
| `info.privacy.body` | Itangazo ry’ibanga ryose rizashyirwa hano mbere yo gutangira, mu Kinyarwanda, Icyongereza n’Igifaransa. | The full privacy notice will be published here before launch, in Kinyarwanda, English and French. | needs native-speaker review |
| `info.help.title` | Ubufasha | Help | needs native-speaker review |
| `info.help.body` | Inyobora z’abarwayi n’ababitaho ziraza. Nta telefoni igezweho ufite? Baza ku kwakira abarwayi. | Guides for patients and caregivers are coming. No smartphone? Ask at reception. | needs native-speaker review |
| `notFound.title` | Iyi paji ntibonetse | Page not found | needs native-speaker review |
| `notFound.body` | Reba aderesi, cyangwa usubire ahabanza. | Check the address, or go back to the home page. | needs native-speaker review |
| `notFound.home` | Jya ahabanza | Go to the home page | needs native-speaker review |
| `forgot.title` | Hindura ijambo ry’ibanga | Reset your password | needs native-speaker review |
| `forgot.intro` | Andika imeyili yawe. Niba ifite konti, tuzakoherereza ihuriro ryo gushyiraho ijambo ry’ibanga rishya. | Enter your email. If it belongs to an account, we will send a link to set a new password. | needs native-speaker review |
| `forgot.email` | Imeyili | Email | needs native-speaker review |
| `forgot.submit` | Ohereza ihuriro | Send reset link | needs native-speaker review |
| `forgot.sentTitle` | Reba imeyili yawe | Check your email | needs native-speaker review |
| `forgot.sentBody` | Niba hari konti ya {{email}}, ihuriro ryo guhindura riroherejwe. Rikora iminota 30. | If an account exists for {{email}}, a reset link is on its way. The link works for 30 minutes. | needs native-speaker review |
| `forgot.back` | Subira ku kwinjira | Back to log in | needs native-speaker review |
| `reset.title` | Shyiraho ijambo ry’ibanga rishya | Set a new password | needs native-speaker review |
| `reset.newPassword` | Ijambo ry’ibanga rishya | New password | needs native-speaker review |
| `reset.hint` | Nibura inyuguti 8. Interuro ngufi yoroshye kwibuka kandi igoye gukeka. | At least 8 characters. A short sentence is easy to remember and hard to guess. | needs native-speaker review |
| `reset.submit` | Bika ijambo ry’ibanga rishya | Save new password | needs native-speaker review |
| `reset.doneTitle` | Ijambo ry’ibanga ryahinduwe | Password changed | needs native-speaker review |
| `reset.doneBody` | Ijambo ry’ibanga ryahinduwe kandi wasohowe ahantu hose. Injira ukoresheje ijambo ry’ibanga rishya. | Your password was changed and you were logged out everywhere. Log in with your new password. | needs native-speaker review |
| `reset.invalidLink` | Iri huriro ntiryuzuye. Ongera ufungure ihuriro riri muri imeyili, cyangwa usabe irindi. | This link is incomplete. Open the link from the email again, or ask for a new one. | needs native-speaker review |
| `reset.toLogin` | Jya ku kwinjira | Go to log in | needs native-speaker review |
| `shell.nav` | Menyu nyamukuru | Main menu | needs native-speaker review |
| `shell.items.home` | Ahabanza | Home | needs native-speaker review |
| `shell.items.findCare` | Shaka ubuvuzi | Find care | needs native-speaker review |
| `shell.items.visits` | Gahunda zanjye | My visits | needs native-speaker review |
| `shell.items.help` | Ubufasha | Help | needs native-speaker review |
| `shell.offline` | Nta murandasi ufite. Urabona ibyabitswe bwa nyuma kuri iyi telefoni. | You're offline. You're seeing what was last saved on this phone. | needs native-speaker review |
| `shell.account.label` | Menyu ya konti ya {{name}} | Account menu for {{name}} | needs native-speaker review |
| `shell.account.signedIn` | Winjiye nka {{name}} | Signed in as {{name}} | needs native-speaker review |
| `shell.account.profile` | Umwirondoro wanjye | My profile | needs native-speaker review |
| `shell.account.family` | Umuryango | Family | needs native-speaker review |
| `shell.account.privacy` | Ibanga | Privacy | needs native-speaker review |
| `shell.account.settings` | Igenamiterere | Settings | needs native-speaker review |
| `support.title` | Ubufasha | Help | needs native-speaker review |
| `support.faqTitle` | Ibibazo bikunze kubazwa | Common questions | needs native-speaker review |
| `support.faq.ticket.q` | Nakurikirana nte igihe cyanjye? | How do I follow my turn? | needs native-speaker review |
| `support.faq.ticket.a` | Abakira abarwayi bamaze kukwandika, fungura Gahunda zanjye. Uhabona nimero ya tike, umubare w’abakuri imbere n’igihe uzategereza. Tukumenyesha igihe ugiye kugerwaho. | After reception checks you in, open My visits. Your ticket number, how many people are ahead and the expected wait are there. We tell you when you're next. | needs native-speaker review |
| `support.faq.family.q` | Nshobora gucunga gahunda z’umwana wanjye? | Can I manage my child's visits? | needs native-speaker review |
| `support.faq.family.a` | Yego. Ongeraho umwana wawe muri Umuryango. Uzajya uhinduranya ujya ku mwirondoro we hejuru kuri ecran. | Yes. Add your child under Family. You can then switch to their profile from the top of the screen. | needs native-speaker review |
| `support.faq.language.q` | Nahindura nte ururimi cyangwa nkongera ingano y’inyandiko? | How do I change the language or make the text bigger? | needs native-speaker review |
| `support.faq.language.a` | Fungura Igenamiterere muri menyu ya konti. Ushobora guhitamo Ikinyarwanda, Icyongereza cyangwa Igifaransa n’inyandiko nini. | Open Settings from the account menu. You can choose Kinyarwanda, English or French and a larger text size. | needs native-speaker review |
| `support.faq.data.q` | Ni nde ushobora kubona dosiye yanjye y’ubuzima? | Who can see my health records? | needs native-speaker review |
| `support.faq.data.a` | Abakozi b’ikigo kikuvura gusa. Buri gihe umuntu afunguye dosiye yawe birandikwa, kandi ushobora kubona urutonde muri Ibanga. | Only staff at a facility where you are being cared for. Every time someone opens your record it is logged, and you can see the list under Privacy. | needs native-speaker review |
| `support.deskTitle` | Baza abakira abarwayi | Ask at reception | needs native-speaker review |
| `support.deskBody` | Nta telefoni igezweho ufite cyangwa wagize ikibazo? Abakira abarwayi ku kigo cyose gikoresha MediLink bashobora kukwandika no gusubiza ibibazo byawe. | No smartphone, or stuck? Reception staff at any MediLink facility can check you in and answer questions. | needs native-speaker review |
| `support.reportTitle` | Tanga ikibazo | Report a problem | needs native-speaker review |
| `support.reportBody` | Vuba uzashobora gutangira hano ikibazo ku isura kwa muganga, ku kwishyura cyangwa ku nyandiko ukakurikirana. | Soon you can report a problem with a visit, a payment or a document here and follow what happens. | needs native-speaker review |
| `support.more` | Ubundi bufasha | More help | needs native-speaker review |
| `support.guides` | Amabwiriza y’abarwayi n’ababitaho | Guides for patients and caregivers | needs native-speaker review |
| `support.privacy` | Itangazo ry’ibanga | Privacy notice | needs native-speaker review |
| `support.terms` | Amabwiriza yo gukoresha | Terms of use | needs native-speaker review |
| `settings.title` | Igenamiterere | Settings | needs native-speaker review |
| `settings.intro` | Ibyo uhisemo bihita bikora kandi bibikwa kuri iki gikoresho. | These choices apply right away and are kept on this device. | needs native-speaker review |
| `settings.display` | Imigaragarire | Display | needs native-speaker review |
| `settings.textSizeHint` | Inyandiko nini zituma buri ecran isomeka byoroshye. Utubuto natwo turakura. | Larger text makes every screen easier to read. Buttons grow with it. | needs native-speaker review |
| `settings.travelTitle` | Igihe cy’urugendo | Travel time | needs native-speaker review |
| `settings.travelBody` | Iyo ufite tike, tubwire igihe bigutwara kugera ku kigo. Tukifashisha tukubwira igihe cyo kuva mu rugo. | When you have a ticket, tell us how long it takes you to reach the facility. We use it to tell you when to leave home. | needs native-speaker review |
| `settings.alertsTitle` | Imenyesha | Alerts | needs native-speaker review |
| `settings.alertsBody` | Vuba uzashobora guhitamo uko tukugeraho: kuri iyi telefoni, kuri SMS cyangwa kuri imeri. | Soon you can choose how we reach you: on this phone, by SMS or by email. | needs native-speaker review |
| `care.title` | Shaka ubuvuzi | Find care | needs native-speaker review |
| `care.filters` | Muyunguruzi | Filters | needs native-speaker review |
| `care.quick` | Muyunguruzi yihuse | Quick filters | needs native-speaker review |
| `care.filtersCount_one` | Muyunguruzi · {{count}} | Filters · {{count}} | needs native-speaker review |
| `care.filtersCount_other` | Muyunguruzi · {{count}} | Filters · {{count}} | needs native-speaker review |
| `care.active` | Ibyatoranyijwe | Active filters | needs native-speaker review |
| `care.remove` | Kuraho {{label}} | Remove {{label}} | needs native-speaker review |
| `care.clearAll` | Kuraho byose | Clear all | needs native-speaker review |
| `care.show_one` | Erekana ahantu {{count}} | Show {{count}} place | needs native-speaker review |
| `care.show_other` | Erekana ahantu {{count}} | Show {{count}} places | needs native-speaker review |
| `care.service` | Serivisi | Service | needs native-speaker review |
| `care.anyService` | Serivisi yose | Any service | needs native-speaker review |
| `care.level` | Urwego rw’ubuvuzi | Level of care | needs native-speaker review |
| `care.anyLevel` | Urwego urwo ari rwo rwose | Any level | needs native-speaker review |
| `care.levels.primary` | Ibanze | Primary | needs native-speaker review |
| `care.levels.secondary` | Akarere | District | needs native-speaker review |
| `care.levels.tertiary` | Ibitaro bikuru | Referral | needs native-speaker review |
| `care.transferHint` | Mutuelle: zana urupapuro rwo kohereza | Mutuelle: bring a transfer letter | needs native-speaker review |
| `care.when` | Igihe | When | needs native-speaker review |
| `care.availability.today` | Igihe kiboneka uyu munsi | Free time today | needs native-speaker review |
| `care.availability.remote` | Jya ku murongo uri kure | Join remotely | needs native-speaker review |
| `care.distance` | Intera | Distance | needs native-speaker review |
| `care.km` | km {{km}} | {{km}} km | needs native-speaker review |
| `care.withinKm` | Muri km {{km}} | Within {{km}} km | needs native-speaker review |
| `care.none` | Nta hantu hahuye n’ibi byatoranyijwe | No places match these filters | needs native-speaker review |
| `care.tryInstead` | Hafi cyane: {{name}} | Nearest: {{name}} | needs native-speaker review |
| `care.close` | Funga | Close | needs native-speaker review |

## staff-web feature: billing (namespace billing)

File: `apps/staff-web/src/features/billing/locales/rw.json`

| Key | Kinyarwanda (draft) | English source | Status |
|---|---|---|---|
| `title` | Kwishyura | Payments | needs native-speaker review |
| `tabsLabel` | Fagitire ukurikije uko zimeze | Bills by status | needs native-speaker review |
| `tab.unpaid` | Zitishyuwe | Unpaid | needs native-speaker review |
| `tab.partly` | Zishyuwe igice | Partly paid | needs native-speaker review |
| `tab.paid` | Zishyuwe | Paid | needs native-speaker review |
| `tab.all` | Zose z’uyu munsi | All today | needs native-speaker review |
| `search` | Shakisha izina, itike cyangwa inyemezabwishyu | Search name, ticket or receipt | needs native-speaker review |
| `empty` | Nta fagitire ziri hano | No bills here | needs native-speaker review |
| `failed` | Habaye ikibazo. Ongera ugerageze. | Something went wrong. Try again. | needs native-speaker review |
| `cancel` | Reka | Cancel | needs native-speaker review |
| `balance` | Asigaye | Balance | needs native-speaker review |
| `status.open` | Itishyuwe | Unpaid | needs native-speaker review |
| `status.partly_paid` | Yishyuwe igice | Partly paid | needs native-speaker review |
| `status.paid` | Yishyuwe | Paid | needs native-speaker review |
| `status.voided` | Yahagaritswe | Voided | needs native-speaker review |
| `status.credited` | Yasubijwe | Credited | needs native-speaker review |
| `insurance.none` | Nta bwishingizi | No insurance | needs native-speaker review |
| `insurance.unverified` | Ubwishingizi butaragenzurwa | Insurance not verified | needs native-speaker review |
| `insurance.verified` | Bwagenzuwe | Verified | needs native-speaker review |
| `insurance.rejected` | Ubwishingizi bwanzwe | Insurance rejected | needs native-speaker review |
| `method.cash` | Amafaranga mu ntoki | Cash | needs native-speaker review |
| `method.mtn_momo` | MTN MoMo | MTN MoMo | needs native-speaker review |
| `method.airtel_money` | Airtel Money | Airtel Money | needs native-speaker review |
| `method.card` | Ikarita | Card | needs native-speaker review |
| `methodLabel` | Uburyo | Method | needs native-speaker review |
| `exemption.indigent` | Utishoboye | Indigent | needs native-speaker review |
| `exemption.staff` | Umukozi | Staff | needs native-speaker review |
| `exemption.public_programme` | Gahunda ya Leta | Public programme | needs native-speaker review |
| `exemption.waiver` | Gusonerwa | Waiver | needs native-speaker review |
| `exemption.other` | Ikindi | Other | needs native-speaker review |
| `lines` | Ibigize fagitire | Bill lines | needs native-speaker review |
| `item` | Igicuruzwa | Item | needs native-speaker review |
| `qty` | Umubare | Qty | needs native-speaker review |
| `total` | Igiteranyo | Total | needs native-speaker review |
| `insurer` | Ubwishingizi | Insurer | needs native-speaker review |
| `patient` | Umurwayi | Patient | needs native-speaker review |
| `totals` | Ibiteranyo | Totals | needs native-speaker review |
| `insurerPays` | Ubwishingizi bwishyura | Insurer pays | needs native-speaker review |
| `patientPays` | Umurwayi yishyura | Patient pays | needs native-speaker review |
| `exempted` | Byasonewe | Exempted | needs native-speaker review |
| `paid` | Byishyuwe | Paid | needs native-speaker review |
| `payments` | Ubwishyu n’inyemezabwishyu | Payments and receipts | needs native-speaker review |
| `noPayments` | Nta bwishyu buraba | No payment yet | needs native-speaker review |
| `voided` | Byahagaritswe | Voided | needs native-speaker review |
| `voidPending` | Gusiba byasabwe | Void requested | needs native-speaker review |
| `awaitingApproval` | Bitegereje kwemezwa | Awaiting approval | needs native-speaker review |
| `requestVoid` | Saba gusiba | Request void | needs native-speaker review |
| `voidHint` | Umuyobozi w’ikigo ni we wemeza gusiba. Inyemezabwishyu irahagarikwa iyo byemejwe. | The facility admin approves voids. The receipt is cancelled once approved. | needs native-speaker review |
| `sendRequest` | Ohereza ubusabe | Send request | needs native-speaker review |
| `recordPayment` | Andika ubwishyu | Record payment | needs native-speaker review |
| `amount` | Amafaranga (RWF) | Amount (RWF) | needs native-speaker review |
| `reference` | Nimero y’icyakozwe | Reference | needs native-speaker review |
| `referenceHint` | Nimero y’ubucuruzi kuri telefoni cyangwa ku mashini y’ikarita | Transaction ID from the phone or card terminal | needs native-speaker review |
| `exempt` | Shyiraho gusonerwa | Apply exemption | needs native-speaker review |
| `reason` | Impamvu | Reason | needs native-speaker review |
| `note` | Icyitonderwa | Note | needs native-speaker review |
| `receiptTitle` | Inyemezabwishyu | Payment receipt | needs native-speaker review |
| `receiptNo` | Inyemezabwishyu | Receipt | needs native-speaker review |
| `date` | Itariki | Date | needs native-speaker review |
| `cashier` | Umubitsi | Cashier | needs native-speaker review |
| `thanks` | Murakoze. Mubike iyi nyemezabwishyu. | Thank you. Keep this receipt. | needs native-speaker review |
| `print` | Capa | Print | needs native-speaker review |
| `backToBill` | Subira kuri fagitire | Back to the bill | needs native-speaker review |
| `shift.open` | Igihe cy’akazi kirafunguye | Shift open | needs native-speaker review |
| `shift.none` | Nta gihe cy’akazi gifunguye | No shift open | needs native-speaker review |
| `shift.noneHint` | Fungura igihe cy’akazi kugira ngo wandike ubwishyu. | Open a shift to record payments. | needs native-speaker review |
| `shift.summary_one` | Ubwishyu {{count}} · {{cashier}} | {{count}} payment · {{cashier}} | needs native-speaker review |
| `shift.summary_other` | Ubwishyu {{count}} · {{cashier}} | {{count}} payments · {{cashier}} | needs native-speaker review |
| `shift.collected` | Byakiriwe | Collected | needs native-speaker review |
| `shift.float` | Amafaranga yo gutangiriraho | Opening float | needs native-speaker review |
| `shift.floatHint` | Amafaranga ari mu isanduku utangira. | Cash in the drawer at the start. | needs native-speaker review |
| `shift.openAction` | Fungura igihe cy’akazi | Open shift | needs native-speaker review |
| `shift.closeAction` | Funga igihe cy’akazi | Close shift | needs native-speaker review |
| `shift.openTitle` | Fungura igihe cy’akazi ku mafaranga | Open a cash shift | needs native-speaker review |
| `shift.closeTitle` | Funga igihe cy’akazi | Close the shift | needs native-speaker review |
| `shift.expected` | Byari byitezwe {{amount}} | Expected {{amount}} | needs native-speaker review |
| `shift.difference` | Itandukaniro {{amount}} | Difference {{amount}} | needs native-speaker review |
| `shift.note` | Icyitonderwa | Note | needs native-speaker review |
| `shift.needed` | Banza ufungure igihe cy’akazi mbere yo kwandika ubwishyu. | Open a cash shift before recording payments. | needs native-speaker review |
| `shift.byMethod.title` | Ukurikije uburyo bwo kwishyura | By payment method | needs native-speaker review |
| `shift.byMethod.method` | Uburyo | Method | needs native-speaker review |
| `shift.byMethod.payments` | Ubwishyu | Payments | needs native-speaker review |
| `shift.byMethod.received` | Byakiriwe | Received | needs native-speaker review |
| `shift.byMethod.paidOut` | Ayasubijwe | Refunds paid | needs native-speaker review |
| `shift.byMethod.expected` | Biri mu isanduku | In the drawer | needs native-speaker review |
| `shift.byMethod.counted` | Byabaruwe | Counted | needs native-speaker review |
| `shift.byMethod.difference` | Itandukaniro | Difference | needs native-speaker review |
| `shift.byMethod.total` | Igiteranyo | Total | needs native-speaker review |
| `shift.last.title` | Igihe cy’akazi giheruka | Your last shift | needs native-speaker review |
| `shift.last.waiting` | Gitegereje kugenzurwa | Waiting for review | needs native-speaker review |
| `shift.last.accepted` | Cyemejwe na {{name}} | Accepted by {{name}} | needs native-speaker review |
| `approvals.title` | Kwemeza | Approvals | needs native-speaker review |
| `approvals.empty` | Nta bitegereje kwemezwa | Nothing waiting for approval | needs native-speaker review |
| `approvals.by` | Byasabwe na {{name}} | Requested by {{name}} | needs native-speaker review |
| `approvals.kind.void_payment` | Gusiba ubwishyu | Void payment | needs native-speaker review |
| `approvals.kind.refund` | Gusubiza amafaranga | Refund | needs native-speaker review |
| `approvals.kind.waiver` | Gusonerwa | Waiver | needs native-speaker review |
| `approvals.approve` | Emeza | Approve | needs native-speaker review |
| `approvals.reject` | Anga | Reject | needs native-speaker review |
| `approvals.rejectNote` | Kuki wanze? | Why reject? | needs native-speaker review |
| `approvals.viewBill` | Reba fagitire | View bill | needs native-speaker review |
| `approvals.tabs.requests` | Ibyifuzo | Requests | needs native-speaker review |
| `approvals.tabs.shifts` | Amasanduku | Cash shifts | needs native-speaker review |
| `approvals.shifts.empty` | Nta sanduku yafunzwe ikeneye kugenzurwa | No closed shifts to review | needs native-speaker review |
| `approvals.shifts.payments_one` | Ubwishyu {{count}} | {{count}} payment | needs native-speaker review |
| `approvals.shifts.payments_other` | Ubwishyu {{count}} | {{count}} payments | needs native-speaker review |
| `approvals.shifts.balanced` | Biringaniye | Balanced | needs native-speaker review |
| `approvals.shifts.short` | Habuze {{amount}} | Short {{amount}} | needs native-speaker review |
| `approvals.shifts.over` | Harenze {{amount}} | Over {{amount}} | needs native-speaker review |
| `approvals.shifts.method` | Uburyo | Method | needs native-speaker review |
| `approvals.shifts.expected` | Byari byitezwe | Expected | needs native-speaker review |
| `approvals.shifts.counted` | Byabaruwe | Counted | needs native-speaker review |
| `approvals.shifts.float` | Amafaranga yitezwe arimo ayo gutangiza angana na {{amount}}. | Expected cash includes the opening float of {{amount}}. | needs native-speaker review |
| `approvals.shifts.cashierNote` | Icyo umubitsi yanditse | Cashier's note | needs native-speaker review |
| `approvals.shifts.reviewNote` | Icyo ugenzura yanditse (gikenewe iyo isanduku itaringaniye) | Review note (needed when the drawer does not balance) | needs native-speaker review |
| `approvals.shifts.accept` | Emeza isanduku | Accept shift | needs native-speaker review |
| `today.title` | Aho bishyurira | Cash desk | needs native-speaker review |
| `today.openPayments` | Fungura ubwishyu | Open Payments | needs native-speaker review |
| `today.openShift` | Fungura igihe cy'akazi | Open your shift | needs native-speaker review |
| `today.shiftSince_one` | Ubwishyu {{count}} bwakiriwe muri iki gihe | {{count}} payment taken in this shift | needs native-speaker review |
| `today.shiftSince_other` | Ubwishyu {{count}} bwakiriwe muri iki gihe | {{count}} payments taken in this shift | needs native-speaker review |
| `today.numbers` | Uyu munsi aho bishyurira | Today at the cash desk | needs native-speaker review |
| `today.toPay` | Inyemezabuguzi zo kwishyura | Bills to pay | needs native-speaker review |
| `today.partly` | Zishyuwe igice | Partly paid | needs native-speaker review |
| `today.payments` | Ubwishyu bw'iki gihe | Payments this shift | needs native-speaker review |
| `today.collected` | Ayakiriwe muri iki gihe | Collected this shift | needs native-speaker review |
| `today.next` | Izikurikira kwishyurwa | Next to pay | needs native-speaker review |
| `today.nothing` | Nta nyemezabuguzi itegereje kwishyurwa. Inshya ziza hano nyuma yo kwivuza. | No bill waits for payment. New bills appear here after the visit. | needs native-speaker review |
| `today.inDrawer` | {{amount}} mu isanduku | {{amount}} in the drawer | needs native-speaker review |
| `nav.claims` | Ibisabwa abishingizi | Insurance claims | needs native-speaker review |
| `claims.title` | Ibisabwa abishingizi | Insurance claims | needs native-speaker review |
| `claims.insurer` | Umwishingizi | Insurer | needs native-speaker review |
| `claims.month` | Ukwezi kwo kwivuza | Month of the visits | needs native-speaker review |
| `claims.totals` | Ibisabwa by’uku kwezi | Claims this month | needs native-speaker review |
| `claims.visits_one` | Kwivuza {{count}} kwo gusaba | {{count}} visit to claim | needs native-speaker review |
| `claims.visits_other` | Kwivuza {{count}} kwo gusaba | {{count}} visits to claim | needs native-speaker review |
| `claims.toClaim` | Umugabane w’umwishingizi | Insurer share | needs native-speaker review |
| `claims.claimsCount_one` | Igisabwa {{count}} | {{count}} claim | needs native-speaker review |
| `claims.claimsCount_other` | Ibisabwa {{count}} | {{count}} claims | needs native-speaker review |
| `claims.status.pending` | Ntikirishyurwa | Not settled | needs native-speaker review |
| `claims.status.paid` | Cyishyuwe | Paid | needs native-speaker review |
| `claims.status.rejected` | Cyanzwe | Rejected | needs native-speaker review |
| `claims.all` | Byose | All | needs native-speaker review |
| `claims.filter` | Ibisabwa ukurikije uko bihagaze | Claims by status | needs native-speaker review |
| `claims.empty` | Nta bivuje bafite ubwishingizi bw’uyu mwishingizi muri uku kwezi | No insured visits for this insurer in this month | needs native-speaker review |
| `claims.downloadCsv` | Kuramo CSV | Download CSV | needs native-speaker review |
| `claims.downloadPdf` | Kuramo PDF | Download PDF | needs native-speaker review |
| `claims.downloadFailed` | Gukuramo ntibyakunze. Ongera ugerageze. | The download did not work. Try again. | needs native-speaker review |
| `claims.member` | Nimero y’umunyamuryango {{number}} | Member number {{number}} | needs native-speaker review |
| `claims.icd10` | ICD-10 | ICD-10 | needs native-speaker review |
| `claims.noDiagnosis` | Nta isuzuma ryashyizweho umukono | No signed diagnosis | needs native-speaker review |
| `claims.lines_one` | Serivisi cyangwa ikintu {{count}} | {{count}} service or item | needs native-speaker review |
| `claims.lines_other` | Serivisi n’ibintu {{count}} | {{count}} services and items | needs native-speaker review |
| `claims.notCovered` | Ntibyishingiwe | Not covered | needs native-speaker review |
| `claims.markedBy` | Byanditswe na {{name}} | Marked by {{name}} | needs native-speaker review |
| `claims.referenceIs` | Nimero {{reference}} | Reference {{reference}} | needs native-speaker review |
| `claims.reason` | Impamvu y’umwishingizi | The insurer's reason | needs native-speaker review |
| `claims.reference` | Nimero y’ubwishyu | Payment reference | needs native-speaker review |
| `claims.referenceHint` | Si ngombwa: nimero y’iyohereza cyangwa y’icyiciro by’umwishingizi | Optional: the insurer's transfer or batch number | needs native-speaker review |
| `claims.confirmPaid` | Andika ko cyishyuwe | Mark paid | needs native-speaker review |
| `claims.confirmRejected` | Andika ko cyanzwe | Mark rejected | needs native-speaker review |
| `claims.markPaid` | Cyishyuwe | Paid | needs native-speaker review |
| `claims.markRejected` | Cyanzwe | Rejected | needs native-speaker review |

## staff-web feature: bookings (namespace bookings)

File: `apps/staff-web/src/features/bookings/locales/rw.json`

| Key | Kinyarwanda (draft) | English source | Status |
|---|---|---|---|
| `phone.open` | Fata gahunda kuri telefone | Book by phone | needs native-speaker review |
| `phone.title` | Fata gahunda kuri telefone | Book by phone | needs native-speaker review |
| `phone.rescheduleTitle` | Igihe gishya cya {{name}} | New time for {{name}} | needs native-speaker review |
| `phone.close` | Funga | Close | needs native-speaker review |
| `steps.progress` | Intambwe ya {{step}} kuri {{total}} | Step {{step}} of {{total}} | needs native-speaker review |
| `steps.patient` | Umurwayi | Patient | needs native-speaker review |
| `steps.slot` | Igihe | Time | needs native-speaker review |
| `steps.reason` | Impamvu | Reason | needs native-speaker review |
| `steps.review` | Genzura wemeze | Check and confirm | needs native-speaker review |
| `slot.service` | Serivisi | Service | needs native-speaker review |
| `slot.doctor` | Muganga | Doctor | needs native-speaker review |
| `slot.anyDoctor` | Muganga uwo ari we wese | Any doctor | needs native-speaker review |
| `slot.days` | Umunsi | Day | needs native-speaker review |
| `slot.times` | Igihe kiboneka | Free times | needs native-speaker review |
| `slot.morning` | Mu gitondo | Morning | needs native-speaker review |
| `slot.afternoon` | Nyuma ya saa sita | Afternoon | needs native-speaker review |
| `slot.noTimes` | Nta gihe kiboneka uyu munsi. Hitamo undi munsi. | No free time on this day. Pick another day. | needs native-speaker review |
| `slot.earlier` | Iminsi ibanza | Earlier days | needs native-speaker review |
| `slot.later` | Iminsi ikurikira | Later days | needs native-speaker review |
| `slot.taken` | Undi muntu amaze gufata iki gihe. Hitamo ikindi. | Someone just took this time. Choose another one. | needs native-speaker review |
| `slot.alternatives` | Ibihe biboneka hafi | Nearby free times | needs native-speaker review |
| `slot.loadError` | Ntibyashobotse kubona ibihe biboneka. | Could not load free times. | needs native-speaker review |
| `slot.retry` | Ongera ugerageze | Try again | needs native-speaker review |
| `slot.places_one` | Umwanya {{count}} | {{count}} place | needs native-speaker review |
| `slot.places_other` | Imyanya {{count}} | {{count}} places | needs native-speaker review |
| `slot.holdFailed` | Ntibyashobotse kubika iki gihe. Ongera ugerageze. | Could not hold this time. Try again. | needs native-speaker review |
| `slot.noServices` | Nta serivisi irakira gahunda. Umuyobozi w’ivuriro ashobora kubifungura muri Igenamiterere, Serivisi. | No service takes bookings yet. A facility admin can turn on booking in Settings, Services. | needs native-speaker review |
| `hold.holding` | Iki gihe kibitswe mu gihe cya {{time}} | Holding this time for {{time}} | needs native-speaker review |
| `hold.expired` | Igihe cyarekuwe. Ongera uhitemo igihe. | The time was released. Choose a time again. | needs native-speaker review |
| `hold.holdingMinutes_one` | Iki gihe kibitswe mu gihe cy’umunota {{count}}. | Holding this time for about {{count}} minute. | needs native-speaker review |
| `hold.holdingMinutes_other` | Iki gihe kibitswe mu minota {{count}}. | Holding this time for {{count}} minutes. | needs native-speaker review |
| `reason.symptoms` | Ikibazo ni ikihe? | What is the problem? | needs native-speaker review |
| `reason.symptomsHint` | Hitamo kugeza kuri 5. Bifasha muganga kwitegura. | Choose up to 5. They help the doctor prepare. | needs native-speaker review |
| `reason.redFlag` | Byihutirwa | Urgent | needs native-speaker review |
| `reason.redFlagAlert` | Bishobora kuba ibyihutirwa. Bwira umurwayi aze ubu cyangwa ahamagare 912. | This may be an emergency. Tell the patient to come now or call 912. | needs native-speaker review |
| `reason.text` | Ibisobanuro kuri muganga | Notes for the doctor | needs native-speaker review |
| `reason.phone` | Telefone yo kuvugana | Contact phone | needs native-speaker review |
| `reason.phoneHint` | Yo kwibutsa no guhindura. Siga ubusa ukoreshe nimero iri mu idosiye. | For reminders and changes. Leave empty to use the number on file. | needs native-speaker review |
| `reason.phoneInvalid` | Andika nimero ya telefone yo mu Rwanda, urugero 0788 123 456. | Enter a Rwandan mobile number, for example 0788 123 456. | needs native-speaker review |
| `review.patient` | Umurwayi | Patient | needs native-speaker review |
| `review.service` | Serivisi | Service | needs native-speaker review |
| `review.when` | Ryari | When | needs native-speaker review |
| `review.doctor` | Muganga | Doctor | needs native-speaker review |
| `review.symptoms` | Ibimenyetso | Symptoms | needs native-speaker review |
| `review.phone` | Telefone yo kuvugana | Contact phone | needs native-speaker review |
| `review.confirm` | Emeza gahunda | Confirm booking | needs native-speaker review |
| `review.confirmReschedule` | Imura gahunda | Move booking | needs native-speaker review |
| `review.failed` | Ntibyashobotse kubika gahunda. | Could not save the booking. | needs native-speaker review |
| `review.stale` | Iyi gahunda yahinduwe n’undi muntu. Funga iki gice wongere ugifungure. | This booking was changed by someone else. Close this panel and open it again. | needs native-speaker review |
| `done.title` | Gahunda yemejwe | Booking confirmed | needs native-speaker review |
| `done.moved` | Gahunda yimuwe | Booking moved | needs native-speaker review |
| `done.code` | Kode ya gahunda | Booking code | needs native-speaker review |
| `done.tell` | Soma kode ubwire umurwayi. Ayerekana iyo ageze. | Read the code to the patient. They show it when they arrive. | needs native-speaker review |
| `done.another` | Fatira undi murwayi gahunda | Book another patient | needs native-speaker review |
| `done.finish` | Byarangiye | Done | needs native-speaker review |
| `nav.back` | Subira inyuma | Back | needs native-speaker review |
| `nav.next` | Komeza | Continue | needs native-speaker review |
| `nav.change` | Hindura umurwayi | Change patient | needs native-speaker review |
| `nav.disruptions` | Impinduka | Disruptions | needs native-speaker review |
| `body.general` | Rusange | General | needs native-speaker review |
| `body.respiratory` | Guhumeka | Breathing | needs native-speaker review |
| `body.digestive` | Inda | Stomach | needs native-speaker review |
| `body.nervous` | Umutwe | Head | needs native-speaker review |
| `body.circulatory` | Umutima n’igituza | Heart and chest | needs native-speaker review |
| `body.skin` | Uruhu | Skin | needs native-speaker review |
| `body.musculoskeletal` | Ingingo n’umugongo | Joints and back | needs native-speaker review |
| `body.dental` | Amenyo | Teeth | needs native-speaker review |
| `body.eye` | Amaso | Eyes | needs native-speaker review |
| `body.urinary` | Inkari | Urine | needs native-speaker review |
| `expected.newTime` | Igihe gishya | New time | needs native-speaker review |
| `status.confirmed` | Yafashe umwanya | Booked | needs native-speaker review |
| `status.checked_in` | Yageze | Checked in | needs native-speaker review |
| `status.no_show` | Ntiyaje | No-show | needs native-speaker review |
| `status.cancelled` | Byahagaritswe | Cancelled | needs native-speaker review |
| `status.late_cancelled` | Byahagaritswe bitinze | Late cancel | needs native-speaker review |
| `status.superseded` | Byimuwe | Moved | needs native-speaker review |
| `calendar.title` | Kalendari | Calendar | needs native-speaker review |
| `calendar.mineTitle` | Kalendari yanjye | My calendar | needs native-speaker review |
| `calendar.view` | Uko bigaragara | View | needs native-speaker review |
| `calendar.dayView` | Umunsi | Day | needs native-speaker review |
| `calendar.weekView` | Icyumweru | Week | needs native-speaker review |
| `calendar.previous` | Ibibanza | Previous | needs native-speaker review |
| `calendar.next` | Ibikurikira | Next | needs native-speaker review |
| `calendar.today` | Uyu munsi | Today | needs native-speaker review |
| `calendar.weekOf` | Icyumweru cya {{date}} | Week of {{date}} | needs native-speaker review |
| `calendar.allServices` | Serivisi zose | All services | needs native-speaker review |
| `calendar.booked` | {{booked}} kuri {{capacity}} bafashe umwanya | {{booked}} of {{capacity}} booked | needs native-speaker review |
| `calendar.serviceSchedule` | Gahunda ya serivisi | Service schedule | needs native-speaker review |
| `calendar.noBookings` | Nta wafashe umwanya kugeza ubu. | No bookings yet. | needs native-speaker review |
| `calendar.noSessions` | Nta masaha y'akazi kuri uyu munsi. | No sessions on this day. | needs native-speaker review |
| `calendar.outside` | Bafashe umwanya hanze y'amasaha y'akazi | Booked outside a session | needs native-speaker review |
| `calendar.awaitingAnswer` | Dutegereje igisubizo cy'umurwayi | Waiting for the patient | needs native-speaker review |
| `calendar.disrupted` | Hari impinduka itararangira | A disruption is open | needs native-speaker review |
| `calendar.disruptedBody_one` | Impinduka {{count}} iracyategereje ibikorwa cyangwa ibisubizo. | {{count}} disruption still waits for actions or answers. | needs native-speaker review |
| `calendar.disruptedBody_other` | Impinduka {{count}} ziracyategereje ibikorwa cyangwa ibisubizo. | {{count}} disruptions still wait for actions or answers. | needs native-speaker review |
| `calendar.failed` | Ntibishobotse gufungura kalendari. | Could not load the calendar. | needs native-speaker review |
| `calendar.emptyTitle` | Nta giteganyijwe | Nothing scheduled | needs native-speaker review |
| `calendar.empty` | Nta masaha y'akazi cyangwa abafashe imyanya muri iki gihe. | No sessions or bookings in this period. | needs native-speaker review |
| `calendar.ownOnly` | Urabona amasaha yawe n'abagufatiyeho umwanya gusa. | You see your own sessions and bookings. | needs native-speaker review |
| `calendar.gridView` | Imbonerahamwe y'amasaha | Grid | needs native-speaker review |
| `calendar.tableView` | Urutonde | Table | needs native-speaker review |
| `calendar.day` | Umunsi | Day | needs native-speaker review |
| `calendar.time` | Isaha | Time | needs native-speaker review |
| `calendar.session` | Igihe cy'akazi | Session | needs native-speaker review |
| `calendar.actions` | Ibikorwa | Actions | needs native-speaker review |
| `calendar.openDay` | Fungura umunsi | Open the day | needs native-speaker review |
| `disruptions.title` | Impinduka | Disruptions | needs native-speaker review |
| `disruptions.new` | Impinduka nshya | New disruption | needs native-speaker review |
| `disruptions.wizardTitle` | Impinduka | Disruption | needs native-speaker review |
| `disruptions.back` | Impinduka zose | All disruptions | needs native-speaker review |
| `disruptions.progress` | Intambwe z'impinduka | Disruption steps | needs native-speaker review |
| `disruptions.steps.what` | Nde n'igihe | Who and when | needs native-speaker review |
| `disruptions.steps.affected` | Abafashe imyanya bibagiraho ingaruka | Affected bookings | needs native-speaker review |
| `disruptions.steps.answers` | Ibisubizo by'abarwayi | Patient answers | needs native-speaker review |
| `disruptions.failed` | Ntibishobotse gufungura cyangwa kubika impinduka. | Could not load or save the disruption. | needs native-speaker review |
| `disruptions.noneTitle` | Nta mpinduka | No disruptions | needs native-speaker review |
| `disruptions.none` | Nta kibazo gihari. Kora impinduka iyo umuganga adahari cyangwa ikigo gifunze. | Nothing is disrupted. Create one when a doctor is away or the facility closes. | needs native-speaker review |
| `disruptions.summary` | {{total}} bibagiraho ingaruka, {{pending}} bategereje | {{total}} affected, {{pending}} waiting | needs native-speaker review |
| `disruptions.kindLabel` | Icyabaye | What happened | needs native-speaker review |
| `disruptions.kind.doctor_absent` | Umuganga ntahari | Doctor absent | needs native-speaker review |
| `disruptions.kind.closure` | Ikigo kirafunze | Closure | needs native-speaker review |
| `disruptions.kind.schedule_change` | Gahunda yahindutse | Schedule change | needs native-speaker review |
| `disruptions.status.open` | Irakomeje | Open | needs native-speaker review |
| `disruptions.status.resolved` | Yarangiye | Resolved | needs native-speaker review |
| `disruptions.anyDoctor` | Nta muganga wihariye | No specific doctor | needs native-speaker review |
| `disruptions.from` | Kuva | From | needs native-speaker review |
| `disruptions.to` | Kugeza | To | needs native-speaker review |
| `disruptions.reason` | Impamvu (y'abakozi) | Reason (for staff) | needs native-speaker review |
| `disruptions.reasonHint` | Abarwayi ntibabona iyi nyandiko. | Patients never see this note. | needs native-speaker review |
| `disruptions.findAffected` | Shaka abo bibagiraho ingaruka | Find affected bookings | needs native-speaker review |
| `disruptions.affectedCount_one` | Umwanya {{count}} cyangwa itike bibagiraho ingaruka. | {{count}} booking or ticket is affected. | needs native-speaker review |
| `disruptions.affectedCount_other` | Imyanya {{count}} cyangwa amatike bibagiraho ingaruka. | {{count}} bookings or tickets are affected. | needs native-speaker review |
| `disruptions.forAll` | Igikorwa ku basigaye bose | Action for everyone not done yet | needs native-speaker review |
| `disruptions.applyAll` | Kora kuri bose | Apply to all | needs native-speaker review |
| `disruptions.choose` | Hitamo igikorwa | Choose an action | needs native-speaker review |
| `disruptions.actionFor` | Igikorwa kuri {{name}} | Action for {{name}} | needs native-speaker review |
| `disruptions.action.move_doctor` | Mwimurire ku wundi muganga | Move to another doctor | needs native-speaker review |
| `disruptions.action.next_slot` | Mwimurire ku mwanya ukurikira | Move to the next free time | needs native-speaker review |
| `disruptions.action.cancel` | Hagarika | Cancel | needs native-speaker review |
| `disruptions.apply` | Kora ibikorwa wahisemo | Apply chosen actions | needs native-speaker review |
| `disruptions.someLeft_one` | Ikintu {{count}} nticyahinduwe. Hitamo ikindi gikorwa. | {{count}} item could not be changed. Choose another action. | needs native-speaker review |
| `disruptions.someLeft_other` | Ibintu {{count}} ntibyahinduwe. Hitamo ikindi gikorwa. | {{count}} items could not be changed. Choose another action. | needs native-speaker review |
| `disruptions.problem.no_slot` | Nta mwanya uhari: hitamo ikindi gikorwa. | No free time: choose another action. | needs native-speaker review |
| `disruptions.problem.same_day_service` | Umurwayi asanzwe afite iyi serivisi uwo munsi. | The patient already has this service that day. | needs native-speaker review |
| `disruptions.problem.not_for_ticket` | Ntibishoboka ku matike y'umurongo w'uyu munsi. | Not possible for today's queue tickets. | needs native-speaker review |
| `disruptions.problem.booking_closed` | Uyu mwanya wari usanzwe warafunzwe. | This booking was already closed. | needs native-speaker review |
| `disruptions.problem.ticket_closed` | Iyi tike ntikiri ku murongo. | This ticket is no longer waiting. | needs native-speaker review |
| `disruptions.problem.already_applied` | Byarakozwe. | Already done. | needs native-speaker review |
| `disruptions.problem.not_found` | Ntibibonetse. | Not found. | needs native-speaker review |
| `disruptions.remoteTicket` | Itike ya kure {{number}} | Remote ticket {{number}} | needs native-speaker review |
| `disruptions.nothingTitle` | Nta cyo kwimura | Nothing to move | needs native-speaker review |
| `disruptions.nothing` | Nta mwanya wemejwe cyangwa itike ya kure muri iki gihe. | No confirmed booking or remote ticket falls in this period. | needs native-speaker review |
| `disruptions.resolved` | Abarwayi bose basubije. Iyi mpinduka yarangiye. | All patients have answered. This disruption is resolved. | needs native-speaker review |
| `disruptions.waiting_one` | Umurwayi {{count}} ntarasubiza. | {{count}} patient has not answered yet. | needs native-speaker review |
| `disruptions.waiting_other` | Abarwayi {{count}} ntibarasubiza. | {{count}} patients have not answered yet. | needs native-speaker review |
| `disruptions.noAction` | Nta gikorwa | No action | needs native-speaker review |
| `disruptions.was` | byari {{when}} | was {{when}} | needs native-speaker review |
| `disruptions.response.pending` | Dutegereje | Waiting | needs native-speaker review |
| `disruptions.response.accepted` | Yemeye | Accepted | needs native-speaker review |
| `disruptions.response.declined` | Ntiyasubije | No answer | needs native-speaker review |
| `disruptions.response.rebooked_other` | Yahisemo ikindi gihe | Chose another time | needs native-speaker review |
| `disruptions.response.cancelled` | Byahagaritswe | Cancelled | needs native-speaker review |
| `disruptions.call` | Hamagara umurwayi | Call the patient | needs native-speaker review |
| `disruptions.callAt` | Hamagara {{phone}} | Call {{phone}} | needs native-speaker review |
| `followUp.open` | Gukurikirana | Follow-up | needs native-speaker review |
| `followUp.title` | Gukurikirana {{name}} | Follow-up for {{name}} | needs native-speaker review |
| `followUp.in` | Azagaruke nyuma ya | Come back in | needs native-speaker review |
| `followUp.unit` | Igipimo | Unit | needs native-speaker review |
| `followUp.days` | Iminsi | Days | needs native-speaker review |
| `followUp.weeks` | Ibyumweru | Weeks | needs native-speaker review |
| `followUp.how` | Uko bikorwa | How | needs native-speaker review |
| `followUp.mode.booking` | Mufatire umwanya wa mbere uboneka | Book the first free time | needs native-speaker review |
| `followUp.mode.reminder` | Kwibutsa umurwayi gusa | Only remind the patient | needs native-speaker review |
| `followUp.save` | Bika gukurikirana | Save follow-up | needs native-speaker review |
| `followUp.cancel` | Reka | Cancel | needs native-speaker review |
| `followUp.booked` | Umwanya wo gukurikirana wafashwe | Follow-up booked | needs native-speaker review |
| `followUp.bookedBody` | {{day}} saa {{time}} kwa {{doctor}}. Kode y'umwanya {{code}}. | {{day}} at {{time}} with {{doctor}}. Booking code {{code}}. | needs native-speaker review |
| `followUp.reminder` | Umurwayi azibutswa kugaruka ku itariki {{day}}. | The patient will be reminded to come back on {{day}}. | needs native-speaker review |
| `followUp.noSlot` | Nta mwanya uboneka guhera {{day}}. Abakira abarwayi bazahamagara umurwayi. | No free time from {{day}}. Reception will call the patient to book. | needs native-speaker review |

## staff-web feature: clinical (namespace clinical)

File: `apps/staff-web/src/features/clinical/locales/rw.json`

| Key | Kinyarwanda (draft) | English source | Status |
|---|---|---|---|
| `lab.title` | Ibizamini | Tests | needs native-speaker review |
| `lab.none` | Nta kizamini cyasabwe muri uru ruzinduko. | No test ordered for this visit. | needs native-speaker review |
| `lab.order` | Saba ibizamini | Order tests | needs native-speaker review |
| `lab.choose` | Ibizamini byo gusaba | Tests to order | needs native-speaker review |
| `lab.chooseOne` | Hitamo nibura ikizamini kimwe. | Choose at least one test. | needs native-speaker review |
| `lab.reason` | Kubera iki? (laboratwari irabibona) | Why these tests? (the lab sees this) | needs native-speaker review |
| `lab.reasonHint` | Urugero: umuriro iminsi 3, kureba niba atari malariya. | For example: fever for 3 days, rule out malaria. | needs native-speaker review |
| `lab.reasonShort` | Impamvu: | Why: | needs native-speaker review |
| `lab.submit` | Saba | Order | needs native-speaker review |
| `lab.send` | Ohereza muri laboratwari | Send to lab | needs native-speaker review |
| `lab.sendHint` | Umurwayi ajya muri laboratwari. Inyandiko zawe zikomeza gufunguye, umurwayi akagaruka ku murongo wawe ibisubizo byose nibimara kuboneka. | The patient goes to the lab. Your notes stay open, and the patient comes back to your queue when every result is in. | needs native-speaker review |
| `lab.sent` | {{name}} agiye muri laboratwari; azagaruka ku murongo wawe ibisubizo nibimara kuboneka. | {{name}} is on the way to the lab and comes back to your queue when the results are in. | needs native-speaker review |
| `lab.orderedBy` | Byasabwe na {{name}} saa {{time}} | Ordered by {{name}} at {{time}} | needs native-speaker review |
| `lab.resultedBy` | Igisubizo cyatanzwe na {{name}} saa {{time}} | Result by {{name}} at {{time}} | needs native-speaker review |
| `lab.labComment` | Icyo laboratwari ivuga: | Lab comment: | needs native-speaker review |
| `lab.note` | Ubutumwa ku murwayi | Note for the patient | needs native-speaker review |
| `lab.noteHint` | Umurwayi abusoma hamwe n’igisubizo. | The patient reads it with the result. | needs native-speaker review |
| `lab.review` | Byasomwe | Mark reviewed | needs native-speaker review |
| `lab.release` | Ohereza ku murwayi | Release to the patient | needs native-speaker review |
| `lab.releaseHint` | Guhera ubu umurwayi abona iki gisubizo muri dosiye ye. | From now on the patient sees this result in their record. | needs native-speaker review |
| `lab.cancel` | Hagarika ikizamini | Cancel test | needs native-speaker review |
| `lab.range` | {{low}}–{{high}} {{unit}} | {{low}}–{{high}} {{unit}} | needs native-speaker review |
| `lab.table.item` | Ikizamini | Test | needs native-speaker review |
| `lab.table.value` | Igisubizo | Result | needs native-speaker review |
| `lab.table.reference` | Ibisanzwe | Normal range | needs native-speaker review |
| `lab.states.ordered` | Cyasabwe | Ordered | needs native-speaker review |
| `lab.states.sample_taken` | Igipimo cyafashwe | Sample taken | needs native-speaker review |
| `lab.states.resulted` | Igisubizo cyabonetse | Result ready | needs native-speaker review |
| `lab.states.reviewed` | Cyasomwe | Reviewed | needs native-speaker review |
| `lab.states.released` | Cyoherejwe | Released | needs native-speaker review |
| `lab.states.cancelled` | Cyahagaritswe | Cancelled | needs native-speaker review |
| `lab.specimens.blood` | Amaraso | Blood | needs native-speaker review |
| `lab.specimens.urine` | Inkari | Urine | needs native-speaker review |
| `lab.specimens.stool` | Umwanda | Stool | needs native-speaker review |
| `lab.flags.low` | Biri hasi | Low | needs native-speaker review |
| `lab.flags.high` | Biri hejuru | High | needs native-speaker review |
| `lab.flags.abnormal` | Ntibisanzwe | Abnormal | needs native-speaker review |
| `lab.choices.negative` | Nta bwandu | Negative | needs native-speaker review |
| `lab.choices.positive` | Afite ubwandu | Positive | needs native-speaker review |
| `lab.choices.invalid` | Ntibyasomwe | Invalid | needs native-speaker review |
| `lab.choices.trace` | Bike cyane | Trace | needs native-speaker review |
| `lab.choices.none_seen` | Nta byabonetse | None seen | needs native-speaker review |
| `lab.choices.seen` | Byabonetse | Seen | needs native-speaker review |
| `lab.inbox.title` | Ibisubizo bya laboratwari | Lab results | needs native-speaker review |
| `lab.inbox.lead` | Ibisubizo by’ibizamini wasabye. Soma buri gisubizo, hanyuma ucyohereze ku murwayi. | Results of the tests you ordered. Review each one, then release it to the patient. | needs native-speaker review |
| `lab.inbox.open` | Fungura isuzuma | Open the consultation | needs native-speaker review |
| `nav.consultation` | Isuzuma | Consultation | needs native-speaker review |
| `nav.unsigned` | Dosiye zitarasinywa | Unsigned records | needs native-speaker review |
| `nav.results` | Ibisubizo | Results | needs native-speaker review |
| `nav.questions` | Ibibazo bya farumasi | Pharmacy questions | needs native-speaker review |
| `nav.followUps` | Gusubira kwa muganga | Follow-ups | needs native-speaker review |
| `nav.activity` | Ibikorwa byanjye | My activity | needs native-speaker review |
| `nav.templates` | Inyandiko ngenderwaho | Templates | needs native-speaker review |
| `nav.profile` | Umwirondoro wanjye wa muganga | My doctor profile | needs native-speaker review |
| `title` | Isuzuma | Consultation | needs native-speaker review |
| `headerTitle` | Isuzuma · {{name}} | Consultation · {{name}} | needs native-speaker review |
| `loading` | Dosiye irimo gufunguka… | Loading the record… | needs native-speaker review |
| `empty` | Nta cyanditswe. | Nothing written. | needs native-speaker review |
| `reason` | Impamvu | Reason | needs native-speaker review |
| `reasonRequired` | Tanga impamvu. | Give a reason. | needs native-speaker review |
| `cancel` | Hagarika | Cancel | needs native-speaker review |
| `close` | Funga | Close | needs native-speaker review |
| `previous` | Ibibanjirije | Previous | needs native-speaker review |
| `next` | Ibikurikira | Next | needs native-speaker review |
| `lateEntry` | Yanditswe bitinze | Late entry | needs native-speaker review |
| `age_one` | Umwaka {{count}} | {{count}} year | needs native-speaker review |
| `age_other` | Imyaka {{count}} | {{count}} years | needs native-speaker review |
| `sex.female` | Gore | Female | needs native-speaker review |
| `sex.male` | Gabo | Male | needs native-speaker review |
| `sex.other` | Ikindi | Other | needs native-speaker review |
| `status.draft` | Agateganyo | Draft | needs native-speaker review |
| `status.signed` | Yasinywe | Signed | needs native-speaker review |
| `status.entered_in_error` | Yanditswe ku makosa | Entered in error | needs native-speaker review |
| `start.title` | Isuzuma | Consultation | needs native-speaker review |
| `start.open` | Fungura isuzuma | Open consultation | needs native-speaker review |
| `start.none` | Nta murwayi uri kumwe nawe ubu | No patient with you right now | needs native-speaker review |
| `start.noneBody` | Hamagara umurwayi ukurikira ku murongo wawe, hanyuma ufungure isuzuma hano. | Call the next patient from My queue, then open the consultation here. | needs native-speaker review |
| `start.toQueue` | Jya ku murongo wanjye | Go to My queue | needs native-speaker review |
| `start.state.called` | Yahamagawe | Called | needs native-speaker review |
| `start.state.in_service` | Ari mu isuzuma | In consultation | needs native-speaker review |
| `allergy.title` | Allerijiya | Allergies | needs native-speaker review |
| `allergy.none` | Nta allerijiya izwi | No known allergies | needs native-speaker review |
| `allergy.unknown` | Allerijiya ntizanditswe. Baza umurwayi. | Allergies not recorded. Ask the patient. | needs native-speaker review |
| `allergy.unverified` | yavuzwe n'umurwayi, ntiremezwa | reported by the patient, not verified | needs native-speaker review |
| `allergy.severity.mild` | Yoroheje | Mild | needs native-speaker review |
| `allergy.severity.moderate` | Iringaniye | Moderate | needs native-speaker review |
| `allergy.severity.severe` | Ikomeye | Severe | needs native-speaker review |
| `allergy.severity.unknown` | Uburemere butazwi | Severity unknown | needs native-speaker review |
| `autosave.idle` | Agateganyo | Draft | needs native-speaker review |
| `autosave.dirty` | Agateganyo · impinduka ntirabikwa | Draft · changes not saved yet | needs native-speaker review |
| `autosave.saving` | Birimo kubikwa… | Saving… | needs native-speaker review |
| `autosave.saved` | Agateganyo · byabitswe saa {{time}} | Draft · saved {{time}} | needs native-speaker review |
| `autosave.error` | Ntibyabitswe | Not saved | needs native-speaker review |
| `autosave.conflict` | Undi muntu yahinduye iyi dosiye. Yongeye gufunguka n'impinduka ze; yisuzume mbere yo gukomeza. | Someone else changed this record. It was reloaded with their changes; check it before you continue. | needs native-speaker review |
| `sections.nav` | Ibice by'isuzuma | Consultation sections | needs native-speaker review |
| `sections.vitals` | Ibipimo by'ingenzi | Vitals | needs native-speaker review |
| `sections.history` | Amateka y'uburwayi | History | needs native-speaker review |
| `sections.examination` | Isuzuma ry'umubiri | Examination | needs native-speaker review |
| `sections.diagnosis` | Indwara yasuzumwe | Diagnosis | needs native-speaker review |
| `sections.plan` | Gahunda y'ubuvuzi | Plan | needs native-speaker review |
| `sections.instructions` | Amabwiriza ku murwayi | Patient instructions | needs native-speaker review |
| `sections.instructionsHint` | Umurwayi azabibona mu magambo yoroshye: icyo gukora n'igihe cyo kugaruka. | Shown to the patient in plain language: what to do and when to come back. | needs native-speaker review |
| `sections.private-notes` | Inyandiko bwite | Private notes | needs native-speaker review |
| `sections.addenda` | Inyongera | Addenda | needs native-speaker review |
| `privateNotes.never` | Ntizigera zerekwa umurwayi | Never shown to the patient | needs native-speaker review |
| `diagnosis.search` | Shakisha indwara (ICD-10) | Find an ICD-10 diagnosis | needs native-speaker review |
| `diagnosis.placeholder` | Andika izina cyangwa kode, urugero malariya | Type a name or code, e.g. malaria | needs native-speaker review |
| `diagnosis.results` | Indwara zabonetse | Diagnoses found | needs native-speaker review |
| `diagnosis.searching` | Birimo gushakishwa… | Searching… | needs native-speaker review |
| `diagnosis.noResults` | Nta ndwara yabonetse. Gerageza irindi jambo. | No diagnosis found. Try another word. | needs native-speaker review |
| `diagnosis.chosen` | Indwara zatoranyijwe | Chosen diagnoses | needs native-speaker review |
| `diagnosis.rank` | Urwego | Rank | needs native-speaker review |
| `diagnosis.primary` | Iy'ingenzi | Primary | needs native-speaker review |
| `diagnosis.secondary` | Iy'inyongera | Secondary | needs native-speaker review |
| `diagnosis.certainty` | Icyizere | Certainty | needs native-speaker review |
| `diagnosis.provisional` | By'agateganyo | Provisional | needs native-speaker review |
| `diagnosis.confirmed` | Byemejwe | Confirmed | needs native-speaker review |
| `diagnosis.sensitive` | Ibanga | Sensitive | needs native-speaker review |
| `diagnosis.remove` | Kuramo {{code}} | Remove {{code}} | needs native-speaker review |
| `restricted.label` | Dosiye y'ibanga | Restricted record | needs native-speaker review |
| `restricted.hint` | Ihishwa abarwaza b'umurwayi kandi ntisangizwa ibindi bigo. | Hidden from the patient's caregivers and never shared with other facilities. | needs native-speaker review |
| `restricted.suggest` | Hari indwara y'ibanga. Tekereza kugira iyi dosiye iy'ibanga. | A diagnosis is sensitive. Consider marking this record restricted. | needs native-speaker review |
| `restricted.on` | Bifunguye | On | needs native-speaker review |
| `restricted.off` | Bifunze | Off | needs native-speaker review |
| `restricted.badge` | Ibanga | Restricted | needs native-speaker review |
| `sign.action` | Sinya kandi ufunge | Sign and lock | needs native-speaker review |
| `sign.needPrimary` | Ongeraho indwara y'ingenzi kugira ngo usinye. | Add a primary diagnosis to sign. | needs native-speaker review |
| `sign.signedBy` | Yasinywe na {{name}} ku wa {{time}} | Signed by {{name}} on {{time}} | needs native-speaker review |
| `sign.fingerprint` | Igikumwe {{hash}}… | Fingerprint {{hash}}… | needs native-speaker review |
| `sign.doneTitle` | Dosiye yasinywe | Record signed | needs native-speaker review |
| `sign.doneBody` | Urupapuro rw'imiti n'amabaruwa byoherejwe. Soza uruzinduko uvuye ku murongo wawe. | The prescription and letters went out. Finish the visit from your queue. | needs native-speaker review |
| `sign.backToQueue` | Subira ku murongo wanjye | Back to my queue | needs native-speaker review |
| `integrity.mismatch` | Iyi dosiye ntigihura n'igikumwe cyayo. Bimenyeshe umuyobozi w'ikigo. | This record no longer matches its fingerprint. Report it to the facility admin. | needs native-speaker review |
| `addendum.none` | Nta nyongera. | No addenda. | needs native-speaker review |
| `addendum.add` | Ongeraho inyongera | Add addendum | needs native-speaker review |
| `addendum.reason` | Impamvu y'inyongera | Reason for the addendum | needs native-speaker review |
| `addendum.body` | Inyongera | Addendum | needs native-speaker review |
| `addendum.bodyRequired` | Andika inyongera. | Write the addendum. | needs native-speaker review |
| `addendum.by` | {{name}} · {{time}} | {{name}} · {{time}} | needs native-speaker review |
| `addendum.notAuthor` | yanditswe n'undi muganga | by another clinician | needs native-speaker review |
| `enteredInError.action` | Shyiraho ko yanditswe ku makosa | Mark entered in error | needs native-speaker review |
| `enteredInError.title` | Kwemeza ko iyi dosiye yanditswe ku makosa? | Mark this record entered in error? | needs native-speaker review |
| `enteredInError.consequences` | Bikoreshwa ku dosiye yanditswe ku murwayi utari we. Ihishwa mu mateka no ku murwayi, ikabikwa kubera igenzura. Ntisibwa na rimwe. | Use this for a record on the wrong patient. It is hidden from the history and from the patient, and kept for audit. It is never deleted. | needs native-speaker review |
| `enteredInError.banner` | Yanditswe ku makosa | Entered in error | needs native-speaker review |
| `enteredInError.detail` | {{reason}} · {{name}} · {{time}} | {{reason}} · {{name}} · {{time}} | needs native-speaker review |
| `vitals.recorded` | Ibipimo byanditswe | Vitals recorded | needs native-speaker review |
| `vitals.none` | Nta bipimo byanditswe kuri uru ruzinduko. | No vitals recorded for this visit. | needs native-speaker review |
| `vitals.form` | Andika ibipimo | Record vitals | needs native-speaker review |
| `vitals.save` | Bika ibipimo | Save vitals | needs native-speaker review |
| `vitals.by` | {{name}} · {{time}} | {{name}} · {{time}} | needs native-speaker review |
| `vitals.range` | {{low}}–{{high}} | {{low}}–{{high}} | needs native-speaker review |
| `vitals.outOfRange` | Andika umubare uri hagati ya {{low}} na {{high}}. | Enter a value between {{low}} and {{high}}. | needs native-speaker review |
| `vitals.enterOne` | Andika nibura umubare umwe. | Enter at least one value. | needs native-speaker review |
| `vitals.markWrong` | Shyiraho ko byanditswe ku makosa | Mark entered in error | needs native-speaker review |
| `vitals.markWrongTitle` | Kwemeza ko ibi bipimo byanditswe ku makosa? | Mark these vitals entered in error? | needs native-speaker review |
| `vitals.fields.temperature_c` | Ubushyuhe (°C) | Temperature (°C) | needs native-speaker review |
| `vitals.fields.systolic_mmhg` | Umuvuduko wo hejuru (mmHg) | Systolic (mmHg) | needs native-speaker review |
| `vitals.fields.diastolic_mmhg` | Umuvuduko wo hasi (mmHg) | Diastolic (mmHg) | needs native-speaker review |
| `vitals.fields.pulse_bpm` | Gutera k'umutima (/umunota) | Pulse (/min) | needs native-speaker review |
| `vitals.fields.respiratory_rate` | Guhumeka (/umunota) | Breathing (/min) | needs native-speaker review |
| `vitals.fields.spo2_pct` | Umwuka mu maraso SpO₂ (%) | SpO₂ (%) | needs native-speaker review |
| `vitals.fields.weight_kg` | Ibiro (kg) | Weight (kg) | needs native-speaker review |
| `vitals.fields.height_cm` | Uburebure (cm) | Height (cm) | needs native-speaker review |
| `vitals.fields.muac_mm` | Umuzenguruko w'akaboko (mm) | MUAC (mm) | needs native-speaker review |
| `vitals.short.temperature` | T {{value}} | T {{value}} | needs native-speaker review |
| `vitals.short.bp` | BP {{sys}}/{{dia}} | BP {{sys}}/{{dia}} | needs native-speaker review |
| `vitals.short.pulse` | P {{value}} | P {{value}} | needs native-speaker review |
| `vitals.short.respiratory` | RR {{value}} | RR {{value}} | needs native-speaker review |
| `vitals.short.spo2` | SpO₂ {{value}} | SpO₂ {{value}} | needs native-speaker review |
| `vitals.short.weight` | {{value}} kg | {{value}} kg | needs native-speaker review |
| `vitals.short.height` | {{value}} cm | {{value}} cm | needs native-speaker review |
| `vitals.short.muac` | MUAC {{value}} | MUAC {{value}} | needs native-speaker review |
| `vitals.tiles.temperature` | Ubushyuhe | Temperature | needs native-speaker review |
| `vitals.tiles.bp` | Umuvuduko w'amaraso | Blood pressure | needs native-speaker review |
| `vitals.tiles.pulse` | Umutima | Pulse | needs native-speaker review |
| `vitals.tiles.respiratory` | Guhumeka | Breathing | needs native-speaker review |
| `vitals.tiles.spo2` | Umwuka (oxygène) | Oxygen | needs native-speaker review |
| `vitals.tiles.weight` | Ibiro | Weight | needs native-speaker review |
| `vitals.tiles.height` | Uburebure | Height | needs native-speaker review |
| `vitals.tiles.muac` | MUAC | MUAC | needs native-speaker review |
| `vitals.flags.spo2_low` | Umwuka muke | Low oxygen | needs native-speaker review |
| `vitals.flags.bp_high` | Umuvuduko w'amaraso uri hejuru cyane | Very high blood pressure | needs native-speaker review |
| `vitals.flags.bp_low` | Umuvuduko w'amaraso uri hasi | Low blood pressure | needs native-speaker review |
| `vitals.flags.temp_high` | Umuriro mwinshi | High fever | needs native-speaker review |
| `vitals.flags.temp_low` | Ubushyuhe buri hasi | Low temperature | needs native-speaker review |
| `vitals.flags.pulse_high` | Umutima wihuta | Fast pulse | needs native-speaker review |
| `vitals.flags.pulse_low` | Umutima utera buhoro | Slow pulse | needs native-speaker review |
| `vitals.flags.rr_high` | Guhumeka vuba | Fast breathing | needs native-speaker review |
| `history.title` | Amateka y'umurwayi | Patient history | needs native-speaker review |
| `history.drawerTitle` | Amateka · {{name}} | History · {{name}} | needs native-speaker review |
| `history.open` | Amateka | History | needs native-speaker review |
| `history.backToRecord` | Dosiye y'umurwayi | Patient record | needs native-speaker review |
| `history.filters` | Shungura amateka | Filter the history | needs native-speaker review |
| `history.type` | Erekana | Show | needs native-speaker review |
| `history.all` | Byose | Everything | needs native-speaker review |
| `history.consultations` | Amasuzuma | Consultations | needs native-speaker review |
| `history.vitals` | Ibipimo | Vitals | needs native-speaker review |
| `history.code` | Kode y'indwara | Diagnosis code | needs native-speaker review |
| `history.codeHint` | Intangiriro ya kode ya ICD-10, urugero B5 | Start of an ICD-10 code, e.g. B5 | needs native-speaker review |
| `history.from` | Kuva | From | needs native-speaker review |
| `history.to` | Kugeza | To | needs native-speaker review |
| `history.items` | Amateka, uhereye ku bya vuba | History, newest first | needs native-speaker review |
| `history.empty` | Nta kiri mu mateka gihuye n'aya mashungura. | Nothing in the history for these filters. | needs native-speaker review |
| `history.noDiagnosis` | Nta ndwara yasuzumwe | No diagnosis | needs native-speaker review |
| `history.addenda_one` | Inyongera {{count}} | {{count}} addendum | needs native-speaker review |
| `history.addenda_other` | Inyongera {{count}} | {{count}} addenda | needs native-speaker review |
| `summary.title` | Incamake y'uburwayi | Problem summary | needs native-speaker review |
| `summary.allergies` | Allerijiya | Allergies | needs native-speaker review |
| `summary.conditions` | Indwara zidakira | Long-term conditions | needs native-speaker review |
| `summary.medications` | Imiti afata ubu | Current medicines | needs native-speaker review |
| `summary.recentDiagnoses` | Indwara zasuzumwe vuba | Recent diagnoses | needs native-speaker review |
| `summary.none` | Nta cyanditswe | None recorded | needs native-speaker review |
| `summary.staffMember` | Uyu murwayi akora hano. Buri gufungura dosiye kwandikwa kandi kugenzurwa. | This patient works here. Every access is recorded and reviewed. | needs native-speaker review |
| `access.title` | Kuki urimo gufungura iyi dosiye? | Why are you opening this record? | needs native-speaker review |
| `access.description` | Uyu murwayi ntari mu bo wita ku buzima uyu munsi, cyangwa akora hano. Impamvu yawe yandikwa mu mateka y'abafunguye dosiye ye. | This patient is not in your care today, or works here. Your reason is recorded in their access history. | needs native-speaker review |
| `access.reason` | Impamvu | Reason | needs native-speaker review |
| `access.reasons.care_continuity` | Gukomeza kumuvura | Continuing their care | needs native-speaker review |
| `access.reasons.results_review` | Gusuzuma ibisubizo | Reviewing results | needs native-speaker review |
| `access.reasons.admin_request` | Ubusabe bw'ubuyobozi | Administrative request | needs native-speaker review |
| `access.reasons.other` | Ikindi | Other | needs native-speaker review |
| `access.reasonText` | Sobanura impamvu | Explain the reason | needs native-speaker review |
| `access.textRequired` | Sobanura impamvu ukeneye iyi dosiye. | Explain why you need this record. | needs native-speaker review |
| `access.open` | Fungura dosiye | Open record | needs native-speaker review |
| `unsigned.title` | Dosiye zitarasinywa | Unsigned records | needs native-speaker review |
| `unsigned.mineOnly` | Izanjye gusa | Only my drafts | needs native-speaker review |
| `unsigned.started` | {{name}} · yatangiye {{time}} | {{name}} · started {{time}} | needs native-speaker review |
| `unsigned.overdue` | Zirengeje amasaha 24 | Over 24 hours | needs native-speaker review |
| `unsigned.open` | Fungura inyandiko ya {{name}} | Open the draft for {{name}} | needs native-speaker review |
| `unsigned.empty` | Nta dosiye itarasinywa | No unsigned records | needs native-speaker review |
| `unsigned.emptyBody` | Amasuzuma yose yasinywe. | Every consultation is signed. | needs native-speaker review |
| `unsigned.columns.patient` | Umurwayi | Patient | needs native-speaker review |
| `unsigned.columns.author` | Yatangijwe na | Started by | needs native-speaker review |
| `unsigned.columns.age` | Imaze | Waiting | needs native-speaker review |
| `unsigned.columns.action` | Igikorwa | Action | needs native-speaker review |
| `unsigned.openShort` | Fungura | Open | needs native-speaker review |
| `today.title` | Umunsi wawe | Your day | needs native-speaker review |
| `today.seen` | Abo wakiriye uyu munsi | Seen today | needs native-speaker review |
| `today.avg` | Igihe cyo gusuzuma (hagati) | Average consult | needs native-speaker review |
| `today.min` | min | min | needs native-speaker review |
| `today.signed` | Byasinywe uyu munsi | Signed today | needs native-speaker review |
| `today.unsigned` | Bitarasinywa | Not signed | needs native-speaker review |
| `today.needsYou` | Ibigutegereje | Waiting for you | needs native-speaker review |
| `today.allClear` | Nta kigutegereje. Ni byiza. | Nothing waits for you. Well done. | needs native-speaker review |
| `today.overdue_one` | Dosiye {{count}} imaze amasaha arenga 24 idasinywe | {{count}} record unsigned for more than 24 h | needs native-speaker review |
| `today.overdue_other` | Dosiye {{count}} zimaze amasaha arenga 24 zidasinywe | {{count}} records unsigned for more than 24 h | needs native-speaker review |
| `today.question` | Ikibazo cya farumasi kuri {{name}} | Pharmacy question about {{name}} | needs native-speaker review |
| `today.askedAt` | Cyabajijwe saa {{time}} | Asked at {{time}} | needs native-speaker review |
| `today.toSign_one` | Dosiye {{count}} yo gusinya | {{count}} record to sign | needs native-speaker review |
| `today.toSign_other` | Dosiye {{count}} zo gusinya | {{count}} records to sign | needs native-speaker review |
| `today.followUps_one` | Isubiramo {{count}} riteganyijwe uyu munsi | {{count}} follow-up due today | needs native-speaker review |
| `today.followUps_other` | Amasubiramo {{count}} ateganyijwe uyu munsi | {{count}} follow-ups due today | needs native-speaker review |
| `today.inRoom` | Mu cyumba cyawe | In your room | needs native-speaker review |
| `today.upNext` | Abakurikira | Up next | needs native-speaker review |
| `today.waiting_one` | {{count}} arategereje | {{count}} waiting | needs native-speaker review |
| `today.waiting_other` | {{count}} barategereje | {{count}} waiting | needs native-speaker review |
| `today.openRecord` | Fungura dosiye | Open record | needs native-speaker review |
| `today.openQueue` | Fungura umurongo wanjye | Open my queue | needs native-speaker review |
| `today.nobody` | Nta muntu ugutegereje ubu. | No one is waiting for you right now. | needs native-speaker review |
| `today.week` | Abarwayi b'iki cyumweru | Patients this week | needs native-speaker review |
| `today.weekCaption` | Iminsi 7 ishize | Last 7 days | needs native-speaker review |
| `today.results_one` | Igisubizo {{count}} cyo hanze cyo gusuzuma | {{count}} outside result to review | needs native-speaker review |
| `today.results_other` | Ibisubizo {{count}} byo hanze byo gusuzuma | {{count}} outside results to review | needs native-speaker review |
| `reasonForVisit.nurse` | Isuzuma ry’ibanze: {{urgency}} | Triage: {{urgency}} | needs native-speaker review |
| `reasonForVisit.nurseBy` | na {{name}} saa {{time}} | by {{name}} at {{time}} | needs native-speaker review |
| `reasonForVisit.nurseUrgency.normal` | bisanzwe | normal | needs native-speaker review |
| `reasonForVisit.nurseUrgency.priority` | yihutishwa | priority | needs native-speaker review |
| `reasonForVisit.nurseUrgency.emergency` | byihutirwa | emergency | needs native-speaker review |
| `reasonForVisit.title` | Icyazanye umurwayi | Why the patient came | needs native-speaker review |
| `reasonForVisit.short` | Impamvu | Reason | needs native-speaker review |
| `reasonForVisit.none` | Nta mpamvu yanditswe igihe cyo gufata gahunda cyangwa kwakirwa. Baza umurwayi. | No reason was recorded at booking or check-in. Ask the patient. | needs native-speaker review |
| `reasonForVisit.symptoms` | Ibimenyetso | Symptoms | needs native-speaker review |
| `reasonForVisit.days_one` | Umunsi {{count}} | {{count}} day | needs native-speaker review |
| `reasonForVisit.days_other` | Iminsi {{count}} | {{count}} days | needs native-speaker review |
| `reasonForVisit.severity.mild` | byoroheje | mild | needs native-speaker review |
| `reasonForVisit.severity.moderate` | biringaniye | moderate | needs native-speaker review |
| `reasonForVisit.severity.severe` | bikabije | severe | needs native-speaker review |
| `reasonForVisit.urgency.emergency` | Byihutirwa | Emergency | needs native-speaker review |
| `reasonForVisit.urgency.today` | Abonwe uyu munsi | Be seen today | needs native-speaker review |
| `reasonForVisit.urgency.soon` | Mu minsi mike | Within a few days | needs native-speaker review |
| `reasonForVisit.urgency.self_care` | Kwivurira mu rugo | Care at home | needs native-speaker review |
| `reasonForVisit.hint` | Inama yo kuyobora umurwayi, si isuzuma. | Triage navigation hint, not a diagnosis. | needs native-speaker review |
| `reasonForVisit.redFlags_one` | Ikimenyetso {{count}} gikomeye | {{count}} red flag | needs native-speaker review |
| `reasonForVisit.redFlags_other` | Ibimenyetso {{count}} bikomeye | {{count}} red flags | needs native-speaker review |
| `reasonForVisit.provisional` | Amategeko {{version}} ategereje kwemezwa n'abaganga | Rules {{version}} awaiting clinical sign-off | needs native-speaker review |
| `toQueue` | Umurongo wanjye | My queue | needs native-speaker review |
| `results.title` | Ibisubizo | Results | needs native-speaker review |
| `results.tabs.pending` | Ibyo gusuzuma | To review | needs native-speaker review |
| `results.tabs.reviewed` | Byasuzumwe | Reviewed | needs native-speaker review |
| `results.untitled` | Igisubizo cyo hanze | Outside result | needs native-speaker review |
| `results.dated` | cyo ku wa {{date}} | dated {{date}} | needs native-speaker review |
| `results.uploaded` | Cyongewemo na {{name}} · {{time}} | Added by {{name}} · {{time}} | needs native-speaker review |
| `results.status.pending` | Cyo gusuzuma | To review | needs native-speaker review |
| `results.status.reviewed` | Cyasuzumwe | Reviewed | needs native-speaker review |
| `results.view` | Reba inyandiko | View document | needs native-speaker review |
| `results.history` | Amateka y'umurwayi | Patient history | needs native-speaker review |
| `results.comment` | Icyo uvuga (si ngombwa) | Comment (optional) | needs native-speaker review |
| `results.markReviewed` | Emeza ko wasuzumye | Mark reviewed | needs native-speaker review |
| `results.reviewedBy` | Cyasuzumwe na {{name}} · {{time}} | Reviewed by {{name}} · {{time}} | needs native-speaker review |
| `results.empty.pending` | Nta gisubizo gitegereje | No results waiting | needs native-speaker review |
| `results.empty.reviewed` | Nta cyasuzumwe kugeza ubu | Nothing reviewed yet | needs native-speaker review |
| `results.emptyBody` | Ibisubizo by'abarwayi bawe byashyizwe muri sisitemu ku kwakira biza hano. | Results scanned at reception for your patients appear here. | needs native-speaker review |
| `paper.title` | Dosiye zo ku mpapuro n'inyandiko zafotowe | Paper records and scans | needs native-speaker review |
| `paper.entries` | Amateka yinjijwe | Back-entered history | needs native-speaker review |
| `paper.scans` | Inyandiko zafotowe | Scanned documents | needs native-speaker review |
| `paper.historical` | Byavuye ku mpapuro | From paper | needs native-speaker review |
| `paper.enteredBy` | byinjijwe na {{name}} | entered by {{name}} | needs native-speaker review |
| `paper.view` | Reba | View | needs native-speaker review |
| `paper.kind.diagnosis` | Isuzuma | Diagnosis | needs native-speaker review |
| `paper.kind.condition` | Indwara | Condition | needs native-speaker review |
| `paper.kind.allergy` | Allerijiya | Allergy | needs native-speaker review |
| `paper.kind.medication` | Umuti | Medicine | needs native-speaker review |
| `paper.kind.procedure` | Igikorwa cy'ubuvuzi | Procedure | needs native-speaker review |
| `paper.type.outside_result` | Igisubizo cyo hanze | Outside result | needs native-speaker review |
| `paper.type.legacy_record` | Dosiye yo ku mpapuro | Paper record | needs native-speaker review |
| `paper.type.referral_letter` | Ibaruwa yo kohereza | Referral letter | needs native-speaker review |
| `paper.type.other` | Inyandiko | Document | needs native-speaker review |
| `questions.title` | Ibibazo bya farumasi | Pharmacy questions | needs native-speaker review |
| `questions.tabs.open` | Bigutegereje | Waiting for you | needs native-speaker review |
| `questions.tabs.answered` | Byasubijwe | Answered | needs native-speaker review |
| `questions.status.open` | Gitegereje | Waiting | needs native-speaker review |
| `questions.status.answered` | Cyasubijwe | Answered | needs native-speaker review |
| `questions.status.closed` | Cyafunzwe | Closed | needs native-speaker review |
| `questions.from` | Kivuye kuri {{name}} · {{time}} | From {{name}} · {{time}} | needs native-speaker review |
| `questions.medicines` | Imiti iri kuri uru rupapuro | Medicines on this prescription | needs native-speaker review |
| `questions.answer` | Igisubizo cyawe | Your answer | needs native-speaker review |
| `questions.answerHint` | Gisobanutse kandi kigufi. Kiba inyandiko isinywe muri dosiye. | Clear and short. It becomes a signed note on the record. | needs native-speaker review |
| `questions.answerRequired` | Banza wandike igisubizo. | Write an answer first. | needs native-speaker review |
| `questions.send` | Ohereza igisubizo | Send answer | needs native-speaker review |
| `questions.openRecord` | Fungura dosiye | Open record | needs native-speaker review |
| `questions.answeredAt` | Cyasubijwe {{time}} | Answered {{time}} | needs native-speaker review |
| `questions.empty.open` | Nta kibazo gitegereje | No questions waiting | needs native-speaker review |
| `questions.empty.answered` | Nta kibazo cyasubijwe | No answered questions yet | needs native-speaker review |
| `questions.emptyBody` | Iyo farumasi ibajije ku rupapuro rw'imiti wanditse, kiza hano. | When the pharmacy asks about one of your prescriptions, it shows here. | needs native-speaker review |
| `followUps.title` | Gusubira kwa muganga | Follow-ups | needs native-speaker review |
| `followUps.state.missed` | Ntibagarutse | Missed | needs native-speaker review |
| `followUps.state.today` | Uyu munsi | Today | needs native-speaker review |
| `followUps.state.upcoming` | Iminsi 14 iri imbere | Next 14 days | needs native-speaker review |
| `followUps.state.attended` | Bagarutse | Came back | needs native-speaker review |
| `followUps.columns.patient` | Umurwayi | Patient | needs native-speaker review |
| `followUps.columns.service` | Serivisi | Service | needs native-speaker review |
| `followUps.columns.due` | Itariki | Due | needs native-speaker review |
| `followUps.columns.how` | Uburyo | How | needs native-speaker review |
| `followUps.columns.action` | Igikorwa | Action | needs native-speaker review |
| `followUps.mode.booking` | Gahunda | Booked | needs native-speaker review |
| `followUps.mode.reminder` | Kwibutsa | Reminder | needs native-speaker review |
| `followUps.history` | Amateka | History | needs native-speaker review |
| `followUps.empty.missed` | Nta watagarutse | No missed follow-ups | needs native-speaker review |
| `followUps.empty.today` | Nta usubira kwa muganga uyu munsi | No follow-ups today | needs native-speaker review |
| `followUps.empty.upcoming` | Nta giteganyijwe mu minsi 14 | Nothing planned in the next 14 days | needs native-speaker review |
| `followUps.empty.attended` | Nta muntu uragaruka | No one has come back yet | needs native-speaker review |
| `followUps.emptyBody` | Shyiraho isubiramo uvuye ku Murongo wanjye urangije n'umurwayi. | Set a follow-up from My queue when you finish with a patient. | needs native-speaker review |
| `activity.title` | Ibikorwa byanjye | My activity | needs native-speaker review |
| `activity.period` | Igihe | Period | needs native-speaker review |
| `activity.days_one` | Umunsi {{count}} | {{count}} day | needs native-speaker review |
| `activity.days_other` | Iminsi {{count}} | {{count}} days | needs native-speaker review |
| `activity.seen` | Abarwayi wakiriye | Patients seen | needs native-speaker review |
| `activity.signed` | Dosiye wasinye | Records signed | needs native-speaker review |
| `activity.perDay` | {{value}} ku munsi | {{value}} per day | needs native-speaker review |
| `activity.late_one` | {{count}} yasinywe nyuma y'amasaha 24 | {{count}} signed after 24 h | needs native-speaker review |
| `activity.late_other` | {{count}} zasinywe nyuma y'amasaha 24 | {{count}} signed after 24 h | needs native-speaker review |
| `activity.avg` | Igihe cyo gusuzuma (hagati) | Average consultation | needs native-speaker review |
| `activity.avgCaption` | Kuva utangiye kugeza urangije | From start to finish | needs native-speaker review |
| `activity.followUps` | Amasubiramo washyizeho | Follow-ups set | needs native-speaker review |
| `activity.unsignedNow_one` | Dosiye {{count}} idasinywe ubu | {{count}} record not signed now | needs native-speaker review |
| `activity.unsignedNow_other` | Dosiye {{count}} zidasinywe ubu | {{count}} records not signed now | needs native-speaker review |
| `activity.chart` | Abakiriwe n'izasinywe ku munsi | Seen and signed per day | needs native-speaker review |
| `activity.topDiagnoses` | Indwara zigaruka kenshi | Most frequent diagnoses | needs native-speaker review |
| `activity.noDiagnoses` | Nta suzuma muri iki gihe. | No diagnoses in this period. | needs native-speaker review |
| `activity.privacy` | Ni wowe wenyine ubona iyi paji. Ikigo kibona imibare rusange, ntikibona urutonde rw'umuganga umwe. | Only you see this page. The facility sees totals, never one doctor's list. | needs native-speaker review |
| `templates.title` | Inyandiko ngenderwaho | Templates | needs native-speaker review |
| `templates.new` | Inyandiko nshya | New template | needs native-speaker review |
| `templates.edit` | Hindura inyandiko | Edit template | needs native-speaker review |
| `templates.delete` | Siba | Delete | needs native-speaker review |
| `templates.deleteTitle` | Gusiba “{{name}}”? | Delete “{{name}}”? | needs native-speaker review |
| `templates.deleteBody` | Dosiye zanditswe n'iyi nyandiko ntizihinduka. | Records already written with it do not change. | needs native-speaker review |
| `templates.used_one` | Yakoreshejwe inshuro {{count}} | Used {{count}} time | needs native-speaker review |
| `templates.used_other` | Yakoreshejwe inshuro {{count}} | Used {{count}} times | needs native-speaker review |
| `templates.name` | Izina | Name | needs native-speaker review |
| `templates.nameHint` | Urugero: Umuriro (umuntu mukuru), Gusuzuma umubyeyi utwite, Gukurikirana umuvuduko w'amaraso | For example: Fever (adult), Antenatal visit, Hypertension review | needs native-speaker review |
| `templates.nameRequired` | Ha izina iyi nyandiko. | Give the template a name. | needs native-speaker review |
| `templates.sections.history_text` | Amateka | History | needs native-speaker review |
| `templates.sections.examination_text` | Isuzuma | Examination | needs native-speaker review |
| `templates.sections.plan_text` | Gahunda | Plan | needs native-speaker review |
| `templates.sections.patient_instructions_text` | Amabwiriza ku murwayi | Instructions for the patient | needs native-speaker review |
| `templates.codes` | Kode z'indwara (ICD-10) | Diagnosis codes (ICD-10) | needs native-speaker review |
| `templates.codesHint` | Zitandukanywa n'akitso, urugero B54, J06.9 | Separated by commas, for example B54, J06.9 | needs native-speaker review |
| `templates.medicines` | Imiti usanzwe utanga | Usual prescription | needs native-speaker review |
| `templates.drug` | Umuti | Medicine | needs native-speaker review |
| `templates.drugHint` | Shakira mu rutonde, cyangwa wandike izina | Search the catalogue, or type a name | needs native-speaker review |
| `templates.drugRequired` | Hitamo cyangwa wandike umuti. | Choose or type a medicine. | needs native-speaker review |
| `templates.change` | Hindura | Change | needs native-speaker review |
| `templates.addMedicine` | Ongeraho umuti | Add medicine | needs native-speaker review |
| `templates.remove` | Kuramo | Remove | needs native-speaker review |
| `templates.save` | Bika inyandiko | Save template | needs native-speaker review |
| `templates.duplicate` | Usanzwe ufite inyandiko ifite iri zina. | You already have a template with this name. | needs native-speaker review |
| `templates.emptyTitle` | Nta nyandiko ngenderwaho uragira | No templates yet | needs native-speaker review |
| `templates.empty` | Yikore hano, cyangwa ubike isuzuma nk'inyandiko ngenderwaho uri kuryandika. | Create one here, or save a consultation as a template while you write it. | needs native-speaker review |
| `templates.use` | Koresha inyandiko ngenderwaho | Use a template | needs native-speaker review |
| `templates.useHint` | Gukanda rimwe byongeramo isuzuma, gahunda, amabwiriza n'imiti. Inyandiko ijya mu bice birimo ubusa cyangwa nyuma y'ibyo wanditse; amasuzuma yongerwamo nk'ay'agateganyo. Ushobora guhindura byose mbere yo gusinya. | One click adds the diagnosis, plan, instructions and medicines. Text goes into empty sections or after what you wrote; diagnoses are added as provisional. You can still change everything before you sign. | needs native-speaker review |
| `templates.saveAs` | Bika nk'inyandiko ngenderwaho | Save as template | needs native-speaker review |
| `orderSet.applied` | “{{name}}” yongewe mu nyandiko | “{{name}}” added to the note | needs native-speaker review |
| `orderSet.review` | Bisuzume kuri uyu murwayi, hanyuma usinye. | Check it for this patient, then sign. | needs native-speaker review |
| `orderSet.listLabel` | Ibyo inyandiko ngenderwaho yahinduye | What the template changed | needs native-speaker review |
| `orderSet.diagnosesAdded` | Isuzuma ryongewemo nk'iry'agateganyo: {{names}} | Diagnosis added as provisional: {{names}} | needs native-speaker review |
| `orderSet.diagnosesAlready` | Byari bisanzwe mu nyandiko, ntibyongewe kabiri: {{names}} | Already in the note, not added twice: {{names}} | needs native-speaker review |
| `orderSet.diagnosesSkipped` | Ntibyongewemo, si kode ya ICD-10 izwi cyangwa amasuzuma ni menshi: {{names}}. Shaka kode nyayo. | Not added, not a known ICD-10 code or too many diagnoses: {{names}}. Search for the right code. | needs native-speaker review |
| `orderSet.sections` | Inyandiko yongewe muri: {{names}} | Text added to: {{names}} | needs native-speaker review |
| `orderSet.medicinesAdded` | Byongewe ku rupapuro rw'imiti: {{names}} | Added to the prescription: {{names}} | needs native-speaker review |
| `orderSet.medicinesAlready` | Byari bisanzwe ku rupapuro rw'imiti, ntibyongewe kabiri: {{names}} | Already on the prescription, not added twice: {{names}} | needs native-speaker review |
| `orderSet.medicinesFailed` | Ntibyongewemo, ubyongere ubwawe ku rupapuro rw'imiti: {{names}} | Not added, add them in the prescription yourself: {{names}} | needs native-speaker review |
| `orderSet.tests` | Ibizamini bya laboratwari ntibirasabwa binyuze mu nyandiko ngenderwaho. Bisabe ubwawe: {{names}} | Lab tests are not ordered from templates yet. Order them yourself: {{names}} | needs native-speaker review |
| `orderSet.adding` | Turimo kongeramo imiti… | Adding the medicines… | needs native-speaker review |
| `orderSet.needsYou` | Hari ibikeneye ko ubireba. Inyandiko ntisinywa utayisinye. | Some items need you. The note is not signed until you sign it. | needs native-speaker review |
| `orderSet.stillSign` | Nta na kimwe cyasimbutswe. Inyandiko ntisinywa utayisinye. | Nothing was skipped. The note is not signed until you sign it. | needs native-speaker review |
| `orderSet.done` | Garuka ku nyandiko | Back to the note | needs native-speaker review |
| `orderSet.another` | Koresha indi nyandiko ngenderwaho | Use another template | needs native-speaker review |
| `favourites.diagnoses` | Amasuzuma ukunze gukoresha | Your frequent diagnoses | needs native-speaker review |
| `favourites.add` | Ongeramo {{name}} | Add {{name}} | needs native-speaker review |

## staff-web feature: console (namespace console)

File: `apps/staff-web/src/features/console/locales/rw.json`

| Key | Kinyarwanda (draft) | English source | Status |
|---|---|---|---|
| `nav.users` | Abakoresha | Users | needs native-speaker review |
| `nav.breakGlass` | Isuzuma ry’uburenganzira bwihutirwa | Break-glass reviews | needs native-speaker review |
| `nav.securityLog` | Igitabo cy’umutekano | Security log | needs native-speaker review |
| `nav.accessLog` | Igitabo cyo gufungura amadosiye | Record access log | needs native-speaker review |
| `nav.nationalReport` | Raporo y'igihugu | National report | needs native-speaker review |
| `failed` | Ntibyashobotse. Ongera ugerageze. | Could not load. Try again. | needs native-speaker review |
| `refresh` | Vugurura | Refresh | needs native-speaker review |
| `open` | Fungura | Open | needs native-speaker review |
| `close` | Funga | Close | needs native-speaker review |
| `all` | Byose | All | needs native-speaker review |
| `empty` | Nta kintu kiraboneka | Nothing yet | needs native-speaker review |
| `system` | Sisitemu | System | needs native-speaker review |
| `kind.all` | Bose | All | needs native-speaker review |
| `kind.platform` | Itsinda rya MediLink | Platform team | needs native-speaker review |
| `kind.staff` | Abakozi b’ibigo | Facility staff | needs native-speaker review |
| `kind.patient` | Abarwayi | Patients | needs native-speaker review |
| `audience.staff` | Staff app | Staff app | needs native-speaker review |
| `audience.patient` | Patient app | Patient app | needs native-speaker review |
| `audience.platform` | Console | Console | needs native-speaker review |
| `actions.auth_login_success` | Signed in | Signed in | needs native-speaker review |
| `actions.auth_login_failure` | Sign-in failed | Sign-in failed | needs native-speaker review |
| `actions.auth_mfa_success` | Second factor passed | Second factor passed | needs native-speaker review |
| `actions.auth_mfa_failure` | Second factor failed | Second factor failed | needs native-speaker review |
| `actions.auth_mfa_enrolled` | Second factor set up | Second factor set up | needs native-speaker review |
| `actions.auth_logout` | Signed out | Signed out | needs native-speaker review |
| `actions.auth_step_up_success` | Re-confirmed identity | Re-confirmed identity | needs native-speaker review |
| `actions.auth_step_up_failure` | Re-confirmation failed | Re-confirmation failed | needs native-speaker review |
| `actions.auth_account_locked` | Account locked after failures | Account locked after failures | needs native-speaker review |
| `actions.auth_password_reset_requested` | Password reset requested | Password reset requested | needs native-speaker review |
| `actions.auth_password_reset_completed` | Password reset | Password reset | needs native-speaker review |
| `actions.auth_session_locked` | Screen locked | Screen locked | needs native-speaker review |
| `actions.auth_session_unlocked` | Screen unlocked | Screen unlocked | needs native-speaker review |
| `actions.platform_user_locked` | Account locked by admin | Account locked by admin | needs native-speaker review |
| `actions.platform_user_unlocked` | Account unlocked by admin | Account unlocked by admin | needs native-speaker review |
| `actions.platform_user_mfa_reset` | Second factor reset by admin | Second factor reset by admin | needs native-speaker review |
| `actions.platform_user_sessions_revoked` | Sessions ended by admin | Sessions ended by admin | needs native-speaker review |
| `actions.platform_user_viewed` | Profile viewed by admin | Profile viewed by admin | needs native-speaker review |
| `actions.platform_user_updated` | Details corrected by admin | Details corrected by admin | needs native-speaker review |
| `actions.platform_user_password_reset_sent` | Password reset link sent by admin | Password reset link sent by admin | needs native-speaker review |
| `actions.platform_user_verification_resent` | Confirmation email sent again by admin | Confirmation email sent again by admin | needs native-speaker review |
| `actions.platform_user_sign_in_unblocked` | Sign-in block cleared by admin | Sign-in block cleared by admin | needs native-speaker review |
| `actions.platform_user_list_exported` | Account list exported | Account list exported | needs native-speaker review |
| `actions.staff_membership_deactivated` | Facility access removed | Facility access removed | needs native-speaker review |
| `actions.staff_membership_updated` | Facility access changed | Facility access changed | needs native-speaker review |
| `actions.staff_mfa_reset` | Second factor reset | Second factor reset | needs native-speaker review |
| `actions.patients_record_viewed` | Record opened | Record opened | needs native-speaker review |
| `actions.clinical_access_reason_given` | Reason given to open a record | Reason given to open a record | needs native-speaker review |
| `actions.patients_access_reason_given` | Reason given to open a record | Reason given to open a record | needs native-speaker review |
| `actions.authz_break_glass_opened` | Break-glass access opened | Break-glass access opened | needs native-speaker review |
| `actions.authz_break_glass_ended` | Break-glass access ended | Break-glass access ended | needs native-speaker review |
| `actions.authz_break_glass_reviewed` | Break-glass reviewed | Break-glass reviewed | needs native-speaker review |
| `actions.authz_break_glass_viewed` | Record read under break-glass | Record read under break-glass | needs native-speaker review |
| `cc.title` | Ihuriro ry’igenzura | Command centre | needs native-speaker review |
| `cc.updated` | Ako kanya · byavuguruwe {{time}} | Live · updated {{time}} | needs native-speaker review |
| `cc.live` | Ibigo bikora | Live facilities | needs native-speaker review |
| `cc.liveDetail` | {{setup}} biri gutegurwa | {{setup}} more in setup | needs native-speaker review |
| `cc.waiting` | Abategereje ubu | People waiting now | needs native-speaker review |
| `cc.waitingDetail` | Ku mirongo yose ikora | Across every live queue | needs native-speaker review |
| `cc.mfa` | Abakozi bafite kwinjira kw’intambwe ebyiri | Staff with two-step login | needs native-speaker review |
| `cc.mfaDetail` | {{with}} kuri {{total}} | {{with}} of {{total}} staff | needs native-speaker review |
| `cc.failed` | Kwinjira kwanze · amasaha 24 | Failed sign-ins · 24 h | needs native-speaker review |
| `cc.failedDetail` | Kwinjira kwagenze neza {{ok}} | {{ok}} successful sign-ins | needs native-speaker review |
| `cc.map` | Ikarita y’ibigo | Network map | needs native-speaker review |
| `cc.waitingCount_one` | {{count}} waiting | {{count}} waiting | needs native-speaker review |
| `cc.waitingCount_other` | {{count}} waiting | {{count}} waiting | needs native-speaker review |
| `cc.legend.low` | Calm | Calm | needs native-speaker review |
| `cc.legend.medium` | Busy | Busy | needs native-speaker review |
| `cc.legend.high` | Very busy | Very busy | needs native-speaker review |
| `cc.legend.stale` | No live data | No live data | needs native-speaker review |
| `cc.inbox` | Ibikeneye igikorwa cyawe | Needs your action | needs native-speaker review |
| `cc.items.breakGlass_one` | Break-glass access to review | Break-glass access to review | needs native-speaker review |
| `cc.items.breakGlass_other` | Break-glass accesses to review | Break-glass accesses to review | needs native-speaker review |
| `cc.items.disputes_one` | Escalated dispute | Escalated dispute | needs native-speaker review |
| `cc.items.disputes_other` | Escalated disputes | Escalated disputes | needs native-speaker review |
| `cc.items.licencesExpired_one` | Licence expired | Licence expired | needs native-speaker review |
| `cc.items.licencesExpired_other` | Licences expired | Licences expired | needs native-speaker review |
| `cc.items.applications_one` | Application waiting | Application waiting | needs native-speaker review |
| `cc.items.applications_other` | Applications waiting | Applications waiting | needs native-speaker review |
| `cc.items.licencesExpiring_one` | Licence expiring in 30 days | Licence expiring in 30 days | needs native-speaker review |
| `cc.items.licencesExpiring_other` | Licences expiring in 30 days | Licences expiring in 30 days | needs native-speaker review |
| `cc.items.stale_one` | Facility with stale live data | Facility with stale live data | needs native-speaker review |
| `cc.items.stale_other` | Facilities with stale live data | Facilities with stale live data | needs native-speaker review |
| `cc.items.locked_one` | Locked account | Locked account | needs native-speaker review |
| `cc.items.locked_other` | Locked accounts | Locked accounts | needs native-speaker review |
| `cc.pipeline` | Ubusabe bw’ibigo | Facility applications | needs native-speaker review |
| `cc.oldest` | The oldest application has waited more than 5 days. | The oldest application has waited more than 5 days. | needs native-speaker review |
| `cc.districts` | Ibigo ku karere | Facilities by district | needs native-speaker review |
| `cc.activity` | Ibikorwa biheruka | Recent activity | needs native-speaker review |
| `users.title` | Abakoresha | Users | needs native-speaker review |
| `users.noun` | users | users | needs native-speaker review |
| `users.person` | Umuntu | Person | needs native-speaker review |
| `users.kind` | Ubwoko | Type | needs native-speaker review |
| `users.facilities` | Ibigo n’inshingano | Facilities and roles | needs native-speaker review |
| `users.mfa` | Kwinjira kw’intambwe ebyiri | Two-step login | needs native-speaker review |
| `users.mfaOn` | Birakora | On | needs native-speaker review |
| `users.mfaOff` | Ntibikora | Off | needs native-speaker review |
| `users.status` | Uko bimeze | Status | needs native-speaker review |
| `users.active` | Arakora | Active | needs native-speaker review |
| `users.locked` | Yafunzwe | Locked | needs native-speaker review |
| `users.lastLogin` | Aheruka kwinjira | Last sign-in | needs native-speaker review |
| `users.never` | Ntarinjira | Never | needs native-speaker review |
| `users.search` | Shakisha izina, imeri cyangwa telefoni | Search by name, email or phone | needs native-speaker review |
| `users.facility` | Ikigo | Facility | needs native-speaker review |
| `users.oneFacility` | Ikigo kimwe | One facility | needs native-speaker review |
| `users.role` | Inshingano | Role | needs native-speaker review |
| `users.emailState` | Imeri | Email | needs native-speaker review |
| `users.pending` | Ntiyemejwe | Not confirmed yet | needs native-speaker review |
| `users.confirmed` | Yemejwe | Confirmed | needs native-speaker review |
| `users.pendingFilter` | Imeri itaremezwa | Email not confirmed | needs native-speaker review |
| `users.mfaOnFilter` | Kwinjira kw’intambwe ebyiri birakora | Two-step login on | needs native-speaker review |
| `users.mfaOffFilter` | Kwinjira kw’intambwe ebyiri ntibikora | Two-step login off | needs native-speaker review |
| `users.noActiveAccess` | Nta kigo akorera ubu | No active access | needs native-speaker review |
| `users.attention` | Ibikeneye kwitabwaho: | Needs attention: | needs native-speaker review |
| `users.attentionItems.locked_one` | Konti {{count}} yafunzwe | {{count}} locked account | needs native-speaker review |
| `users.attentionItems.locked_other` | Konti {{count}} zafunzwe | {{count}} locked accounts | needs native-speaker review |
| `users.attentionItems.withoutMfa_one` | {{count}} staff account without two-step login | {{count}} staff account without two-step login | needs native-speaker review |
| `users.attentionItems.withoutMfa_other` | {{count}} staff accounts without two-step login | {{count}} staff accounts without two-step login | needs native-speaker review |
| `users.attentionItems.pending_one` | Imeri {{count}} itaremezwa | {{count}} email not confirmed | needs native-speaker review |
| `users.attentionItems.pending_other` | Imeri {{count}} zitaremezwa | {{count}} emails not confirmed | needs native-speaker review |
| `users.export` | Kuramo konti z’abakozi | Export staff accounts | needs native-speaker review |
| `users.exportHint` | CSV of staff and the platform team, never patients. | CSV of staff and the platform team, never patients. | needs native-speaker review |
| `users.exportFailed` | The export did not download. Try again. | The export did not download. Try again. | needs native-speaker review |
| `users.back` | Abakoresha bose | All users | needs native-speaker review |
| `users.account` | Konti | Account | needs native-speaker review |
| `users.facts.email` | Imeri | Email | needs native-speaker review |
| `users.facts.emailState` | Imeri yemejwe | Email confirmed | needs native-speaker review |
| `users.facts.phone` | Telefoni y’akazi | Work phone | needs native-speaker review |
| `users.facts.mfa` | Kwinjira kw’intambwe ebyiri | Two-step login | needs native-speaker review |
| `users.facts.profession` | Umwuga | Profession | needs native-speaker review |
| `users.facts.licence` | Uruhushya rwo gukora | Practising licence | needs native-speaker review |
| `users.facts.language` | Ururimi | Language | needs native-speaker review |
| `users.facts.lastLogin` | Aheruka kwinjira | Last sign-in | needs native-speaker review |
| `users.facts.since` | Konti yafunguwe | Account created | needs native-speaker review |
| `users.patientNote` | This is a patient account. MediLink shows only the account here: the patient's records stay with the facilities that care for them. | This is a patient account. MediLink shows only the account here: the patient's records stay with the facilities that care for them. | needs native-speaker review |
| `users.access.title` | Uburenganzira ku bigo | Facility access | needs native-speaker review |
| `users.access.lead` | Where this person works and what they can do there. Facility admins manage roles; you can remove or restore access. | Where this person works and what they can do there. Facility admins manage roles; you can remove or restore access. | needs native-speaker review |
| `users.access.none` | Nta kigo afitiye uburenganzira. | No facility access. | needs native-speaker review |
| `users.access.active` | Arakora | Active | needs native-speaker review |
| `users.access.removed` | Uburenganzira bwakuweho | Access removed | needs native-speaker review |
| `users.access.removedOn` | Uburenganzira bwakuweho {{date}} | Access removed {{date}} | needs native-speaker review |
| `users.access.remove` | Kuraho uburenganzira | Remove access | needs native-speaker review |
| `users.access.restore` | Subizaho uburenganzira | Restore access | needs native-speaker review |
| `users.access.removeConfirm` | {{name}} can no longer work at {{facility}}. Their other facilities and their account stay as they are. | {{name}} can no longer work at {{facility}}. Their other facilities and their account stay as they are. | needs native-speaker review |
| `users.access.restoreConfirm` | {{name}} can work at {{facility}} again, with the roles they had. | {{name}} can work at {{facility}} again, with the roles they had. | needs native-speaker review |
| `users.invitations` | Ubutumire butaremezwa | Invitations not accepted yet | needs native-speaker review |
| `users.invited` | Bwoherejwe {{sent}} · buzarangira {{expires}} | Sent {{sent}} · expires {{expires}} | needs native-speaker review |
| `users.changes` | Ibyahinduwe n’abayobozi | Changes by admins | needs native-speaker review |
| `users.noChanges` | Nta muyobozi wahinduye iyi konti. | No admin has changed this account. | needs native-speaker review |
| `users.activity` | Kwinjira guheruka | Sign-in activity | needs native-speaker review |
| `users.sessions_one` | {{count}} active session | {{count}} active session | needs native-speaker review |
| `users.sessions_other` | {{count}} active sessions | {{count}} active sessions | needs native-speaker review |
| `users.noSessions` | No active session | No active session | needs native-speaker review |
| `users.started` | Started {{time}} | Started {{time}} | needs native-speaker review |
| `users.events` | Recent security events | Recent security events | needs native-speaker review |
| `users.edit` | Kosora amakuru | Correct details | needs native-speaker review |
| `users.editLead` | Correct the name, work phone or language. The email address and the password can't be changed here. | Correct the name, work phone or language. The email address and the password can't be changed here. | needs native-speaker review |
| `users.fullName` | Amazina yose | Full name | needs native-speaker review |
| `users.phoneHint` | Nimero ya telefoni yo mu Rwanda, urugero 0788 123 456. | A Rwandan mobile number, for example 0788 123 456. | needs native-speaker review |
| `users.save` | Bika | Save | needs native-speaker review |
| `users.reason` | Impamvu | Reason | needs native-speaker review |
| `users.reasonHint` | Recorded in the audit log. At least 5 characters. | Recorded in the audit log. At least 5 characters. | needs native-speaker review |
| `users.actionsTitle` | Ibikorwa kuri konti | Account actions | needs native-speaker review |
| `users.actionsNote` | Each action asks you to confirm your identity again and is recorded with your reason. | Each action asks you to confirm your identity again and is recorded with your reason. | needs native-speaker review |
| `users.notice.self` | This is your own account. Change your details and security from your profile. | This is your own account. Change your details and security from your profile. | needs native-speaker review |
| `users.notice.locked` | This account is locked: the person can't sign in. | This account is locked: the person can't sign in. | needs native-speaker review |
| `users.notice.blocked_one` | Sign-in is blocked for {{count}} more minute after too many failed attempts. | Sign-in is blocked for {{count}} more minute after too many failed attempts. | needs native-speaker review |
| `users.notice.blocked_other` | Sign-in is blocked for {{count}} more minutes after too many failed attempts. | Sign-in is blocked for {{count}} more minutes after too many failed attempts. | needs native-speaker review |
| `users.notice.pending` | The person signed up but hasn't opened the confirmation link, so they can't sign in yet. | The person signed up but hasn't opened the confirmation link, so they can't sign in yet. | needs native-speaker review |
| `users.notice.mfa` | Two-step login isn't set up. The person is asked to set it up at the next sign-in. | Two-step login isn't set up. The person is asked to set it up at the next sign-in. | needs native-speaker review |
| `users.actions.lock` | Funga konti | Lock account | needs native-speaker review |
| `users.actions.unlock` | Fungura konti | Unlock account | needs native-speaker review |
| `users.actions.reset-mfa` | Subiramo kwinjira kw’intambwe ebyiri | Reset two-step login | needs native-speaker review |
| `users.actions.revoke-sessions` | Sohora ahantu hose | Sign out everywhere | needs native-speaker review |
| `users.actions.send-password-reset` | Ohereza umurongo wo guhindura ijambo ry’ibanga | Send password reset link | needs native-speaker review |
| `users.actions.resend-verification` | Ongera wohereze imeri yo kwemeza | Resend confirmation email | needs native-speaker review |
| `users.actions.clear-sign-in-block` | Kuraho ihagarikwa ryo kwinjira | Clear sign-in block | needs native-speaker review |
| `users.hints.lock` | Stops every sign-in until you unlock it. | Stops every sign-in until you unlock it. | needs native-speaker review |
| `users.hints.unlock` | Lets the person sign in again. | Lets the person sign in again. | needs native-speaker review |
| `users.hints.reset-mfa` | For a lost or new phone: they set it up again at the next sign-in. | For a lost or new phone: they set it up again at the next sign-in. | needs native-speaker review |
| `users.hints.revoke-sessions` | Ends every session on every device. | Ends every session on every device. | needs native-speaker review |
| `users.hints.send-password-reset` | Emails a one-time link to their own address. You never see the password. | Emails a one-time link to their own address. You never see the password. | needs native-speaker review |
| `users.hints.resend-verification` | Sends the sign-up confirmation link again. | Sends the sign-up confirmation link again. | needs native-speaker review |
| `users.hints.clear-sign-in-block` | Lets them try again now instead of waiting. | Lets them try again now instead of waiting. | needs native-speaker review |
| `users.confirm.lock` | {{name}} can't sign in until the account is unlocked. Every session ends now. | {{name}} can't sign in until the account is unlocked. Every session ends now. | needs native-speaker review |
| `users.confirm.unlock` | {{name}} can sign in again. | {{name}} can sign in again. | needs native-speaker review |
| `users.confirm.reset-mfa` | {{name}} sets up two-step login again at the next sign-in. Every session ends now. | {{name}} sets up two-step login again at the next sign-in. Every session ends now. | needs native-speaker review |
| `users.confirm.revoke-sessions` | {{name}} is signed out on every device. | {{name}} is signed out on every device. | needs native-speaker review |
| `users.confirm.send-password-reset` | {{name}} gets an email with a link to choose a new password. The link works once. | {{name}} gets an email with a link to choose a new password. The link works once. | needs native-speaker review |
| `users.confirm.resend-verification` | {{name}} gets the sign-up confirmation email again. | {{name}} gets the sign-up confirmation email again. | needs native-speaker review |
| `users.confirm.clear-sign-in-block` | {{name}} can try to sign in again now. Confirm it is really them who asked. | {{name}} can try to sign in again now. Confirm it is really them who asked. | needs native-speaker review |
| `users.done.send-password-reset` | Sent to {{email}}. Ask the person to check their inbox and spam folder. | Sent to {{email}}. Ask the person to check their inbox and spam folder. | needs native-speaker review |
| `users.done.resend-verification` | Sent to {{email}}. Ask the person to check their inbox and spam folder. | Sent to {{email}}. Ask the person to check their inbox and spam folder. | needs native-speaker review |
| `users.clinician` | Umuvuzi | Clinician | needs native-speaker review |
| `logs.event` | Event | Event | needs native-speaker review |
| `logs.who` | Who | Who | needs native-speaker review |
| `logs.device` | Device and IP | Device and IP | needs native-speaker review |
| `logs.record` | Record | Record | needs native-speaker review |
| `logs.when` | When | When | needs native-speaker review |
| `logs.type` | Type | Type | needs native-speaker review |
| `logs.failures` | Failures only | Failures only | needs native-speaker review |
| `logs.immutable` | Log entries are chained and can't be changed or deleted. | Log entries are chained and can't be changed or deleted. | needs native-speaker review |
| `logs.fields.when` | When | When | needs native-speaker review |
| `logs.fields.who` | Who | Who | needs native-speaker review |
| `logs.fields.role` | Role | Role | needs native-speaker review |
| `logs.fields.facility` | Facility | Facility | needs native-speaker review |
| `logs.fields.record` | Record | Record | needs native-speaker review |
| `logs.fields.reason` | Reason | Reason | needs native-speaker review |
| `logs.fields.ip` | IP address | IP address | needs native-speaker review |
| `logs.fields.device` | Device | Device | needs native-speaker review |
| `logs.prefix.auth_login` | Sign-ins | Sign-ins | needs native-speaker review |
| `logs.prefix.auth_mfa` | Two-step login | Two-step login | needs native-speaker review |
| `logs.prefix.auth_step_up` | Re-confirmation | Re-confirmation | needs native-speaker review |
| `logs.prefix.auth_password_reset` | Password resets | Password resets | needs native-speaker review |
| `logs.prefix.auth_account` | Lockouts | Lockouts | needs native-speaker review |
| `logs.prefix.platform_user` | Admin actions on accounts | Admin actions on accounts | needs native-speaker review |
| `logs.prefix.patients_record` | Records opened | Records opened | needs native-speaker review |
| `logs.prefix.clinical_access_reason` | Access reasons (clinical) | Access reasons (clinical) | needs native-speaker review |
| `logs.prefix.patients_access_reason` | Access reasons (patients) | Access reasons (patients) | needs native-speaker review |
| `logs.prefix.authz_break_glass` | Break-glass | Break-glass | needs native-speaker review |
| `logs.security.title` | Igitabo cy’umutekano | Security log | needs native-speaker review |
| `logs.security.lead` | Sign-ins, two-step login, lockouts and admin actions on accounts. | Sign-ins, two-step login, lockouts and admin actions on accounts. | needs native-speaker review |
| `logs.security.noun` | events | events | needs native-speaker review |
| `logs.access.title` | Igitabo cyo gufungura amadosiye | Record access log | needs native-speaker review |
| `logs.access.lead` | Who opened which record, with the reason given. Records are shown by reference only. | Who opened which record, with the reason given. Records are shown by reference only. | needs native-speaker review |
| `logs.access.noun` | accesses | accesses | needs native-speaker review |
| `bg.title` | Isuzuma ry’uburenganzira bwihutirwa | Break-glass reviews | needs native-speaker review |
| `bg.tab.review` | Ibyo gusuzuma | To review | needs native-speaker review |
| `bg.tab.all` | Byose | All | needs native-speaker review |
| `bg.none` | No break-glass access to review | No break-glass access to review | needs native-speaker review |
| `bg.duration` | {{minutes}} min | {{minutes}} min | needs native-speaker review |
| `bg.note` | Review note | Review note | needs native-speaker review |
| `bg.appropriate` | Byari bikwiye | Appropriate | needs native-speaker review |
| `bg.inappropriate` | Ntibyari bikwiye | Not appropriate | needs native-speaker review |
| `bg.reason.emergency` | Emergency | Emergency | needs native-speaker review |
| `bg.reason.continuity` | Continuity of care | Continuity of care | needs native-speaker review |
| `bg.reason.other` | Other | Other | needs native-speaker review |
| `bg.outcome.appropriate` | Judged appropriate | Judged appropriate | needs native-speaker review |
| `bg.outcome.inappropriate` | Judged not appropriate | Judged not appropriate | needs native-speaker review |
| `national.title` | Raporo y'igihugu | National report | needs native-speaker review |
| `national.smallGroups` | Amatsinda ari munsi ya 10 arahishwa | Groups under 10 hidden | needs native-speaker review |
| `national.failed` | Raporo ntiyabonetse. Ongera ugerageze. | The report could not load. Try again. | needs native-speaker review |
| `national.hidden` | Byahishwe | Hidden | needs native-speaker review |
| `national.hiddenWhy` | Abarwayi bari munsi ya 10, cyangwa umubare wagaragaza itsinda nk'iryo. | Fewer than 10 patients, or a figure that would reveal such a group. | needs native-speaker review |
| `national.minutes_one` | Umunota {{count}} | {{count}} min | needs native-speaker review |
| `national.minutes_other` | Iminota {{count}} | {{count}} min | needs native-speaker review |
| `national.unknownDistrict` | Akarere ntikanditswe | District not recorded | needs native-speaker review |
| `national.district` | Akarere | District | needs native-speaker review |
| `national.facility` | Ivuriro | Facility | needs native-speaker review |
| `national.facilities` | Amavuriro | Facilities | needs native-speaker review |
| `national.visits` | Abaje kwivuza | Visits | needs native-speaker review |
| `national.median` | Igihe cyo hagati cyo gutegereza muganga | Median wait to the doctor | needs native-speaker review |
| `national.p90` | Ijanisha rya 90 | 90th percentile | needs native-speaker review |
| `national.medicinesOut` | Imiti yashize ubu | Medicines out now | needs native-speaker review |
| `national.kpi.visits` | Abaje kwivuza | Visits | needs native-speaker review |
| `national.kpi.facilities_one` | Ivuriro {{count}} mu turere {{districts}} | {{count}} facility in {{districts}} districts | needs native-speaker review |
| `national.kpi.facilities_other` | Amavuriro {{count}} mu turere {{districts}} | {{count}} facilities in {{districts}} districts | needs native-speaker review |
| `national.kpi.wait` | Igihe cyo hagati cyo gutegereza muganga | Median wait to the doctor | needs native-speaker review |
| `national.kpi.districts` | Uturere | Districts | needs native-speaker review |
| `national.kpi.stockouts` | Amavuriro yashizemo umuti | Facilities with a stock-out | needs native-speaker review |
| `national.kpi.medicines_one` | Umuti {{count}} washize ahantu | {{count}} medicine out somewhere | needs native-speaker review |
| `national.kpi.medicines_other` | Imiti {{count}} yashize ahantu | {{count}} medicines out somewhere | needs native-speaker review |
| `national.districts.title` | Abarwayi mu karere | Load by district | needs native-speaker review |
| `national.facilitiesTable.title` | Abarwayi mu ivuriro | Load by facility | needs native-speaker review |
| `national.trend.title` | Uko gutegereza guhinduka | Wait trend | needs native-speaker review |
| `national.trend.hiddenPeriods_one` | Igihe {{count}} cyahishwe: abahamagawe bari munsi ya 10. | {{count}} period is hidden: fewer than 10 patients were called. | needs native-speaker review |
| `national.trend.hiddenPeriods_other` | Ibihe {{count}} byahishwe: abahamagawe bari munsi ya 10. | {{count}} periods are hidden: fewer than 10 patients were called. | needs native-speaker review |
| `national.diagnoses.title` | Indwara zikunze kuboneka mu karere | Top diagnoses by district | needs native-speaker review |
| `national.stockouts.title` | Imiti yashize ubu | Stock-outs now | needs native-speaker review |
| `national.stockouts.facilities` | Amavuriro yashizemo umuti | Facilities with a stock-out | needs native-speaker review |
| `national.stockouts.medicines` | Imiti yashize | Medicines out | needs native-speaker review |
| `national.stockouts.medicine` | Umuti | Medicine | needs native-speaker review |
| `national.stockouts.where` | Uturere | Districts | needs native-speaker review |

## staff-web feature: disputes (namespace disputes)

File: `apps/staff-web/src/features/disputes/locales/rw.json`

| Key | Kinyarwanda (draft) | English source | Status |
|---|---|---|---|
| `nav.disputes` | Ibirego | Disputes | needs native-speaker review |
| `nav.platform` | Ibirego | Disputes | needs native-speaker review |
| `title` | Ibirego | Disputes | needs native-speaker review |
| `platformTitle` | Ibirego byazamuwe | Escalated disputes | needs native-speaker review |
| `failed` | Ntitwashoboye kubona ibirego. | We couldn't load the disputes. | needs native-speaker review |
| `retry` | Ongera ugerageze | Try again | needs native-speaker review |
| `notFound` | Ikirego ntikibonetse | Dispute not found | needs native-speaker review |
| `flagged` | Akenshi byanzwe | Often rejected | needs native-speaker review |
| `overdue` | Byarengeje igihe | Overdue | needs native-speaker review |
| `system` | Sisitemu | System | needs native-speaker review |
| `tabs.label` | Erekana | Show | needs native-speaker review |
| `tabs.open` | Bifunguye | Open | needs native-speaker review |
| `tabs.overdue` | Byarengeje igihe | Overdue | needs native-speaker review |
| `tabs.all` | Byose | All | needs native-speaker review |
| `empty.open` | Nta kirego gifunguye | No open disputes | needs native-speaker review |
| `empty.overdue` | Nta cyarengeje igihe | Nothing overdue | needs native-speaker review |
| `empty.all` | Nta kirego | No disputes yet | needs native-speaker review |
| `empty.platform` | Nta kirego cyazamuwe | No escalated disputes | needs native-speaker review |
| `channel.app` | Porogaramu | App | needs native-speaker review |
| `channel.counter` | Ku kwakira | Counter | needs native-speaker review |
| `facts.title` | Amakuru | Facts | needs native-speaker review |
| `facts.patient` | Umurwayi | Patient | needs native-speaker review |
| `facts.facility` | Ivuriro | Facility | needs native-speaker review |
| `facts.channel` | Cyatangiwe | Raised at | needs native-speaker review |
| `facts.raised` | Cyatanzwe | Raised | needs native-speaker review |
| `facts.answerBy` | Kwakira bitarenze | Acknowledge by | needs native-speaker review |
| `facts.decideBy` | Gufata icyemezo bitarenze | Decide by | needs native-speaker review |
| `facts.what` | Ibyo umurwayi yanditse | What the patient wrote | needs native-speaker review |
| `snapshot.status` | Imiterere | Status | needs native-speaker review |
| `snapshot.total_rwf` | Igiteranyo (RWF) | Total (RWF) | needs native-speaker review |
| `snapshot.patient_share_rwf` | Uruhare rw’umurwayi (RWF) | Patient share (RWF) | needs native-speaker review |
| `snapshot.paid_rwf` | Byishyuwe (RWF) | Paid (RWF) | needs native-speaker review |
| `snapshot.balance_rwf` | Ibisigaye (RWF) | Balance (RWF) | needs native-speaker review |
| `snapshot.number` | Nimero | Number | needs native-speaker review |
| `snapshot.booking_code` | Kode ya gahunda | Booking code | needs native-speaker review |
| `snapshot.starts_at` | Gahunda | Appointment | needs native-speaker review |
| `snapshot.occurred_at` | Yanditswe ko atitabiriye | Marked missed | needs native-speaker review |
| `snapshot.reversed_at` | Byavanyweho | Reversed | needs native-speaker review |
| `snapshot.ticket_number` | Itike | Ticket | needs native-speaker review |
| `snapshot.state` | Imiterere | State | needs native-speaker review |
| `snapshot.service_date` | Itariki ya serivisi | Service date | needs native-speaker review |
| `snapshot.issued_at` | Yatanzwe | Issued | needs native-speaker review |
| `snapshot.kind` | Ubwoko | Kind | needs native-speaker review |
| `snapshot.document_date` | Itariki y’inyandiko | Document date | needs native-speaker review |
| `evidence` | Ibyanditswe mu igenzura | Audit trail | needs native-speaker review |
| `history` | Amateka | History | needs native-speaker review |
| `thread` | Ubutumwa | Thread | needs native-speaker review |
| `noMessages` | Nta butumwa buraza | No messages yet | needs native-speaker review |
| `visibility.internal` | Icyitonderwa cy’imbere | Internal note | needs native-speaker review |
| `visibility.staff_comment` | Igitekerezo cy’umukozi | Staff comment | needs native-speaker review |
| `action.pending` | Ibisigaye gukorwa: {{what}} | To do: {{what}} | needs native-speaker review |
| `action.done` | Byakozwe: {{what}} | Done: {{what}} | needs native-speaker review |
| `statement` | Ibisobanuro by’umurwayi | Patient's statement | needs native-speaker review |
| `closedNote` | Iki kirego cyafunzwe. | This dispute is closed. | needs native-speaker review |
| `involved` | Uri muri iki kirego: ushobora gutanga igitekerezo, ntushobora gufata icyemezo. | You are involved in this dispute: you can comment, not decide. | needs native-speaker review |
| `acknowledgeHint` | Emeza ko wakiriye kugira ngo iminsi 10 yo gufata icyemezo itangire. | Acknowledge to start the 10-day decision time. | needs native-speaker review |
| `acknowledge` | Emeza ko wakiriye | Acknowledge | needs native-speaker review |
| `messageKind.label` | Ubwoko bw’ubutumwa | Message type | needs native-speaker review |
| `messageKind.thread` | Subiza umurwayi | Reply to the patient | needs native-speaker review |
| `messageKind.internal` | Icyitonderwa cy’imbere | Internal note | needs native-speaker review |
| `messageKind.ask` | Baza umurwayi amakuru | Ask the patient for information | needs native-speaker review |
| `message` | Ubutumwa | Message | needs native-speaker review |
| `internalHint` | Abakozi b’ivuriro ni bo bonyine babibona. | Only the facility's staff see it. | needs native-speaker review |
| `send` | Ohereza | Send | needs native-speaker review |
| `toPatient` | Ubutumwa ku murwayi | Message to the patient | needs native-speaker review |
| `colleague.title` | Baza mugenzi wawe | Ask a colleague | needs native-speaker review |
| `colleague.who` | Mugenzi wawe | Colleague | needs native-speaker review |
| `colleague.choose` | Hitamo… | Choose… | needs native-speaker review |
| `colleague.ask` | Saba igitekerezo | Ask for a comment | needs native-speaker review |
| `colleague.answered` | yasubije | answered | needs native-speaker review |
| `colleague.waiting` | aracyategerejwe | waiting | needs native-speaker review |
| `colleague.yourComment` | Igitekerezo cyawe | Your comment | needs native-speaker review |
| `colleague.commentHint` | Wasabwe igitekerezo. Abakozi ni bo bonyine bakibona. | You were asked for a comment. Only staff see it. | needs native-speaker review |
| `decide.title` | Icyemezo | Decision | needs native-speaker review |
| `decide.finalTitle` | Icyemezo cya nyuma | Final decision | needs native-speaker review |
| `decide.outcome` | Icyemezo | Outcome | needs native-speaker review |
| `decide.choose` | Hitamo… | Choose… | needs native-speaker review |
| `decide.reason` | Impamvu | Reason | needs native-speaker review |
| `decide.reasonHint` | Umurwayi arabisoma. | The patient reads this. | needs native-speaker review |
| `decide.submit` | Kemura | Resolve | needs native-speaker review |
| `decide.finalSubmit` | Andika icyemezo cya nyuma | Record final decision | needs native-speaker review |
| `done.acknowledged` | Cyakiriwe. | Acknowledged. | needs native-speaker review |
| `done.message` | Byoherejwe. | Sent. | needs native-speaker review |
| `done.asked` | Ikibazo cyoherejwe ku murwayi. | Question sent to the patient. | needs native-speaker review |
| `done.commentAsked` | Igitekerezo cyasabwe. | Comment requested. | needs native-speaker review |
| `done.commented` | Igitekerezo cyongeweho. | Comment added. | needs native-speaker review |
| `done.decided` | Icyemezo cyanditswe. | Decision recorded. | needs native-speaker review |
| `subject.visit` | Uruzinduko | Visit | needs native-speaker review |
| `subject.ticket` | Itike y’umurongo | Queue ticket | needs native-speaker review |
| `subject.booking` | Gahunda | Booking | needs native-speaker review |
| `subject.no_show_strike` | Kutitabira | Missed visit | needs native-speaker review |
| `subject.prescription` | Urupapuro rw’imiti | Prescription | needs native-speaker review |
| `subject.bill` | Inyemezabuguzi | Bill | needs native-speaker review |
| `subject.document` | Inyandiko | Document | needs native-speaker review |
| `status.open` | Gishya | New | needs native-speaker review |
| `status.acknowledged` | Cyakiriwe | Acknowledged | needs native-speaker review |
| `status.under_review` | Kirasuzumwa | Under review | needs native-speaker review |
| `status.info_requested` | Gitegereje umurwayi | Waiting for patient | needs native-speaker review |
| `status.resolved` | Cyakemuwe | Resolved | needs native-speaker review |
| `status.escalated` | Cyazamuwe | Escalated | needs native-speaker review |
| `status.final_decision` | Icyemezo cya nyuma | Final decision | needs native-speaker review |
| `status.closed` | Cyafunzwe | Closed | needs native-speaker review |
| `status.reopened` | Cyongeye gufungurwa | Reopened | needs native-speaker review |
| `outcome.no_show_reversed` | Kutitabira kwavanyweho | Missed visit reversed | needs native-speaker review |
| `outcome.record_corrected` | Idosiye izakosorwa | Record to be corrected | needs native-speaker review |
| `outcome.correction_refused` | Gukosora byanzwe | Correction refused | needs native-speaker review |
| `outcome.refund` | Gusubiza amafaranga | Refund | needs native-speaker review |
| `outcome.bill_correction` | Gukosora inyemezabuguzi | Bill correction | needs native-speaker review |
| `outcome.rebooking` | Gahunda nshya | Rebooking | needs native-speaker review |
| `outcome.rejected` | Cyanzwe | Rejected | needs native-speaker review |

## staff-web feature: documents (namespace documents)

File: `apps/staff-web/src/features/documents/locales/rw.json`

| Key | Kinyarwanda (draft) | English source | Status |
|---|---|---|---|
| `loading` | Turimo gushaka inyandiko | Loading documents | needs native-speaker review |
| `download` | Kuramo | Download | needs native-speaker review |
| `print` | Gucapa | Print | needs native-speaker review |
| `preparing` | Iracyategurwa | Preparing | needs native-speaker review |
| `version` | verisiyo ya {{n}} | version {{n}} | needs native-speaker review |
| `kind.prescription` | Resept | Prescription | needs native-speaker review |
| `kind.referral` | Urwandiko rwohereza umurwayi | Referral letter | needs native-speaker review |
| `kind.lab_request` | Gusaba ibizamini | Lab or imaging request | needs native-speaker review |
| `kind.sick_note` | Icyemezo cy'uburwayi | Sick note | needs native-speaker review |
| `status.active` | Iremewe | Valid | needs native-speaker review |
| `status.dispensed` | Yatanzwe | Dispensed | needs native-speaker review |
| `status.cancelled` | Yahagaritswe | Cancelled | needs native-speaker review |
| `status.expired` | Yarangiye | Expired | needs native-speaker review |
| `urgency.routine` | Bisanzwe | Routine | needs native-speaker review |
| `urgency.urgent` | Byihutirwa | Urgent | needs native-speaker review |
| `urgency.emergency` | Byihutirwa cyane | Emergency | needs native-speaker review |
| `letters.title` | Amabaruwa n'ibisabwa | Letters and requests | needs native-speaker review |
| `letters.draftHint` | Bisinywa hamwe n'isuzuma kandi bigacapwa bifite kode ya QR. | They are signed with the consultation and printed with a QR code. | needs native-speaker review |
| `letters.signedHint` | Igishya gisinywa iyo ukibitse; bazongera kugusaba ijambo ry'ibanga. | A new one is signed when you save it; it asks for your password again. | needs native-speaker review |
| `letters.none` | Nta baruwa cyangwa icyasabwe kirahari. | No letter or request yet. | needs native-speaker review |
| `letters.add.referral` | Urwandiko rwohereza | Referral letter | needs native-speaker review |
| `letters.add.lab_request` | Gusaba ibizamini | Lab request | needs native-speaker review |
| `letters.add.sick_note` | Icyemezo cy'uburwayi | Sick note | needs native-speaker review |
| `letters.referralLine` | Kuri {{to}}, {{specialty}} · {{urgency}} | To {{to}}, {{specialty}} · {{urgency}} | needs native-speaker review |
| `letters.sickLine` | Kuruhuka kuva {{from}} kugeza {{to}} | Rest from {{from}} to {{to}} | needs native-speaker review |
| `letters.signedAt` | Byasinywe {{time}} | Signed {{time}} | needs native-speaker review |
| `letters.signsWith` | Bizasinywa hamwe n'isuzuma | Signs with the consultation | needs native-speaker review |
| `letters.visitDocuments` | Inyandiko z'uru ruzinduko | Documents of this visit | needs native-speaker review |
| `form.to` | Ohereza kuri (ivuriro) | Refer to (facility) | needs native-speaker review |
| `form.specialty` | Ubuhanga | Specialty | needs native-speaker review |
| `form.urgency` | Byihutirwa | Urgency | needs native-speaker review |
| `form.reason` | Impamvu | Reason | needs native-speaker review |
| `form.tests` | Ibizamini | Tests | needs native-speaker review |
| `form.testsHint` | Kimwe ku murongo, cyangwa ubitandukanyishije akitso. | One per line, or separated by commas. | needs native-speaker review |
| `form.testsRequired` | Ongeraho nibura ikizamini kimwe. | Add at least one test. | needs native-speaker review |
| `form.from` | Umunsi wa mbere wo kuruhuka | First day of rest | needs native-speaker review |
| `form.until` | Umunsi wa nyuma wo kuruhuka | Last day of rest | needs native-speaker review |
| `form.datesOrder` | Umunsi wa nyuma uri mbere y'uwa mbere. | The last day is before the first. | needs native-speaker review |
| `form.showDiagnosis` | Erekana indwara ku cyemezo | Show the diagnosis on the sick note | needs native-speaker review |
| `form.showDiagnosisHint` | Ntibigaragara bisanzwe: umukoresha cyangwa ishuri bakeneye amatariki gusa. | Off by default: an employer or school only needs the dates. | needs native-speaker review |
| `form.required` | Uzuza aha. | Fill this in. | needs native-speaker review |
| `form.save` | Ongeraho | Add | needs native-speaker review |
| `form.signNow` | Sinya kandi wongereho | Sign and add | needs native-speaker review |
| `form.cancel` | Reka | Cancel | needs native-speaker review |
| `patient.title` | Inyandiko | Documents | needs native-speaker review |
| `patient.clinicalHint` | Resept, amabaruwa n'ibisabwa byasinywe muri iri vuriro. | Prescriptions, letters and requests signed at this facility. | needs native-speaker review |
| `patient.printHint` | Capa ibyo umurwayi asaba. Buri gucapa kurandikwa. | Print what the patient asks for. Each print is recorded. | needs native-speaker review |
| `patient.none` | Nta nyandiko irahari. | No documents yet. | needs native-speaker review |

## staff-web feature: help (namespace help)

File: `apps/staff-web/src/features/help/locales/rw.json`

| Key | Kinyarwanda (draft) | English source | Status |
|---|---|---|---|
| `nav.help` | Ubufasha | Help and support | needs native-speaker review |
| `nav.platformSupport` | Ibibazo by'ubufasha | Support queue | needs native-speaker review |
| `nav.platformHelpArticles` | Inyandiko z'ubufasha | Help articles | needs native-speaker review |
| `nav.platformContact` | Ubutumwa bwo ku rubuga | Website messages | needs native-speaker review |
| `loadFailed` | Ntibyashobotse kubifungura. Reba interineti wongere ugerageze. | We couldn't load this. Check your connection and try again. | needs native-speaker review |
| `retry` | Ongera ugerageze | Try again | needs native-speaker review |
| `notFound` | Ntibibonetse | Not found | needs native-speaker review |
| `categories.all` | Ingingo zose | All topics | needs native-speaker review |
| `categories.getting_started` | Gutangira | Getting started | needs native-speaker review |
| `categories.account_security` | Konti n'umutekano | Account and security | needs native-speaker review |
| `categories.booking_visits` | Gahunda no kwivuza | Bookings and visits | needs native-speaker review |
| `categories.family_profile` | Umuryango n'umwirondoro | Family and profile | needs native-speaker review |
| `categories.notifications` | Kumenyeshwa | Notifications | needs native-speaker review |
| `categories.privacy` | Ibanga | Privacy | needs native-speaker review |
| `categories.facility_work` | Gukora ku ivuriro | Working at a facility | needs native-speaker review |
| `categories.other` | Ibindi | Other | needs native-speaker review |
| `topics.account_access` | Kwinjira na konti | Logging in and my account | needs native-speaker review |
| `topics.booking_visits` | Gahunda no kwivuza | Bookings and visits | needs native-speaker review |
| `topics.family_profile` | Umuryango n'umwirondoro | Family and profile | needs native-speaker review |
| `topics.notifications` | Kumenyeshwa | Notifications | needs native-speaker review |
| `topics.privacy` | Ibanga n'amakuru | Privacy and data | needs native-speaker review |
| `topics.facility_setup` | Gutegura ivuriro | Facility setup | needs native-speaker review |
| `topics.technical` | Hari ikitakora | Something isn't working | needs native-speaker review |
| `topics.other` | Ikindi kintu | Something else | needs native-speaker review |
| `status.open` | Bitegereje MediLink | Waiting for MediLink | needs native-speaker review |
| `status.answered` | MediLink yasubije | Reply from MediLink | needs native-speaker review |
| `status.closed` | Byafunzwe | Closed | needs native-speaker review |
| `platformStatus.open` | Gifunguye | Open | needs native-speaker review |
| `platformStatus.answered` | Cyasubijwe | Answered | needs native-speaker review |
| `platformStatus.closed` | Cyafunzwe | Closed | needs native-speaker review |
| `priority.normal` | Bisanzwe | Normal | needs native-speaker review |
| `priority.high` | Byihutirwa | High | needs native-speaker review |
| `audience.patient` | Umurwayi | Patient | needs native-speaker review |
| `audience.staff` | Umukozi | Staff | needs native-speaker review |
| `closeReasons.resolved` | Byakemutse | Resolved | needs native-speaker review |
| `closeReasons.no_response` | Nta gisubizo | No response | needs native-speaker review |
| `closeReasons.duplicate` | Cyisubiyemo | Duplicate | needs native-speaker review |
| `closeReasons.redirected_to_facility` | Cyoherejwe ku ivuriro | Sent to the facility | needs native-speaker review |
| `closeReasons.withdrawn` | Cyafunzwe n'uwakibajije | Closed by the requester | needs native-speaker review |
| `languages.rw` | Kinyarwanda | Kinyarwanda | needs native-speaker review |
| `languages.en` | Cyongereza | English | needs native-speaker review |
| `languages.fr` | Gifaransa | French | needs native-speaker review |
| `shownIn` | Byerekanywe mu {{language}}: ntibirandikwa mu rurimi rwawe. | Shown in {{language}}: not written in your language yet. | needs native-speaker review |
| `support.title` | Ubufasha | Help and support | needs native-speaker review |
| `support.guides` | Amabwiriza | Guides | needs native-speaker review |
| `support.mine` | Ibibazo byanjye | My requests | needs native-speaker review |
| `support.facility` | Ibibazo by'ivuriro | Facility requests | needs native-speaker review |
| `support.search` | Shakisha amabwiriza | Search guides | needs native-speaker review |
| `support.category` | Ingingo | Topic | needs native-speaker review |
| `support.noGuides` | Nta mabwiriza ahuye. | No guide matches. | needs native-speaker review |
| `support.noRequests` | Nta bibazo | No requests | needs native-speaker review |
| `support.noRequestsBody` | Ibibazo woherereje ubufasha bwa MediLink bigaragara hano. | Questions you send to MediLink support appear here. | needs native-speaker review |
| `support.noFacilityRequests` | Nta bibazo by'abakozi b'ivuriro ryawe. | No requests from your facility's staff. | needs native-speaker review |
| `support.new` | Vugana n'ubufasha | Contact support | needs native-speaker review |
| `support.lastActivity` | Igikorwa giheruka {{time}} | Last activity {{time}} | needs native-speaker review |
| `support.openedBy` | Cyafunguwe na {{name}} | Opened by {{name}} | needs native-speaker review |
| `article.back` | Ubufasha | Help and support | needs native-speaker review |
| `article.notFoundBody` | Ishobora kuba yarimuwe cyangwa yarakuweho. | It may have been moved or removed. | needs native-speaker review |
| `new.title` | Vugana n'ubufasha bwa MediLink | Contact MediLink support | needs native-speaker review |
| `new.topic` | Ingingo | Topic | needs native-speaker review |
| `new.subject` | Umutwe | Subject | needs native-speaker review |
| `new.body` | Byagenze bite? | What happened? | needs native-speaker review |
| `new.adminNotice` | Umuyobozi w'ivuriro ryawe ashobora kubona iki kibazo. | Your facility admin can see this request. | needs native-speaker review |
| `new.noHealth` | Ntushyiremo amakuru y'ubuzima bw'abarwayi: ubufasha bufasha kuri sisitemu, si ku kuvura. | Don't include patient health details: support helps with the system, not with care. | needs native-speaker review |
| `new.counter` | Inyuguti {{count}} kuri {{max}} | {{count}} of {{max}} characters | needs native-speaker review |
| `new.send` | Ohereza | Send | needs native-speaker review |
| `new.fixErrors` | Banza ukosore ibi mbere yo kohereza | Please fix these before sending | needs native-speaker review |
| `new.sent` | Ikibazo {{reference}} cyoherejwe. | Request {{reference}} sent. | needs native-speaker review |
| `thread.title` | Ikibazo {{reference}} | Request {{reference}} | needs native-speaker review |
| `thread.reply` | Igisubizo cyawe | Your reply | needs native-speaker review |
| `thread.send` | Ohereza igisubizo | Send reply | needs native-speaker review |
| `thread.close` | Funga ikibazo | Close request | needs native-speaker review |
| `thread.closeConfirm` | Ufunge iki kibazo? | Close this request? | needs native-speaker review |
| `thread.closeYes` | Gifunge | Close it | needs native-speaker review |
| `thread.cancel` | Reka | Cancel | needs native-speaker review |
| `thread.readOnly` | {{name}} ni we wafunguye iki kibazo. Ushobora kugisoma, ariko ni we wenyine ushobora gusubiza. | {{name}} opened this request. You can read it, but only they can reply. | needs native-speaker review |
| `thread.closedTitle` | Iki kibazo cyafunzwe | This request is closed | needs native-speaker review |
| `thread.openNew` | Fungura ikindi kibazo | Open a new request | needs native-speaker review |
| `thread.replySent` | Igisubizo cyoherejwe. | Reply sent. | needs native-speaker review |
| `thread.closedNotice` | Ikibazo cyafunzwe. | Request closed. | needs native-speaker review |
| `thread.you` | Wowe | You | needs native-speaker review |
| `queue.title` | Ibibazo by'ubufasha | Support queue | needs native-speaker review |
| `queue.noun` | ibibazo | requests | needs native-speaker review |
| `queue.reference` | Nimero | Reference | needs native-speaker review |
| `queue.subject` | Umutwe | Subject | needs native-speaker review |
| `queue.requester` | Uwabajije | Requester | needs native-speaker review |
| `queue.facility` | Ivuriro | Facility | needs native-speaker review |
| `queue.topic` | Ingingo | Topic | needs native-speaker review |
| `queue.priority` | Ikihutirwa | Priority | needs native-speaker review |
| `queue.status` | Uko bimeze | Status | needs native-speaker review |
| `queue.assignee` | Ushinzwe | Assigned to | needs native-speaker review |
| `queue.lastActivity` | Igikorwa giheruka | Last activity | needs native-speaker review |
| `queue.tabs.active` | Bikiri gukorwaho | Active | needs native-speaker review |
| `queue.tabs.open` | Bifunguye | Open | needs native-speaker review |
| `queue.tabs.answered` | Byasubijwe | Answered | needs native-speaker review |
| `queue.tabs.closed` | Byafunzwe | Closed | needs native-speaker review |
| `queue.statusTabs` | Uko bimeze | Status | needs native-speaker review |
| `queue.allTopics` | Ingingo zose | All topics | needs native-speaker review |
| `queue.allAudiences` | Abarwayi n'abakozi | Patients and staff | needs native-speaker review |
| `queue.audienceFilter` | Uwabajije | Requester | needs native-speaker review |
| `queue.assigned` | Ushinzwe | Assignment | needs native-speaker review |
| `queue.anyone` | Bose | Anyone | needs native-speaker review |
| `queue.me` | Ibyo nshinzwe | Assigned to me | needs native-speaker review |
| `queue.none` | Nta ushinzwe | Unassigned | needs native-speaker review |
| `queue.open` | Fungura {{reference}} | Open {{reference}} | needs native-speaker review |
| `queue.unassigned` | — | — | needs native-speaker review |
| `triage.title` | Ibisobanuro | Details | needs native-speaker review |
| `triage.requester` | Uwabajije | Requester | needs native-speaker review |
| `triage.audience` | Ubwoko | Type | needs native-speaker review |
| `triage.facility` | Ivuriro | Facility | needs native-speaker review |
| `triage.language` | Ururimi | Language | needs native-speaker review |
| `triage.device` | Igikoresho | Device | needs native-speaker review |
| `triage.path` | Cyafunguwe kuri | Opened from | needs native-speaker review |
| `triage.priority` | Ikihutirwa | Priority | needs native-speaker review |
| `triage.topic` | Ingingo | Topic | needs native-speaker review |
| `triage.assignee` | Ushinzwe | Assigned to | needs native-speaker review |
| `triage.assignMe` | Mbishinzwe | Assign to me | needs native-speaker review |
| `triage.unassign` | Kuraho ushinzwe | Unassign | needs native-speaker review |
| `triage.save` | Bika ibisobanuro | Save details | needs native-speaker review |
| `triage.saved` | Ibisobanuro byabitswe. | Details saved. | needs native-speaker review |
| `triage.stale` | Undi muntu yahinduye iki kibazo. Cyongeye gufunguka: kigenzure wongere ugerageze. | Someone else changed this request. It was reloaded: check it and try again. | needs native-speaker review |
| `reply.label` | Subiza uwabajije | Reply to the requester | needs native-speaker review |
| `reply.send` | Ohereza igisubizo | Send reply | needs native-speaker review |
| `reply.closeTitle` | Funga ikibazo | Close the request | needs native-speaker review |
| `reply.reason` | Impamvu | Reason | needs native-speaker review |
| `reply.closingMessage` | Ubutumwa bwo gusoza (si ngombwa) | Closing message (optional) | needs native-speaker review |
| `reply.close` | Funga ikibazo | Close request | needs native-speaker review |
| `reply.closed` | Ikibazo cyafunzwe. | Request closed. | needs native-speaker review |
| `articles.title` | Inyandiko z'ubufasha | Help articles | needs native-speaker review |
| `articles.noun` | inyandiko | articles | needs native-speaker review |
| `articles.new` | Inyandiko nshya | New article | needs native-speaker review |
| `articles.slug` | Aderesi | Address | needs native-speaker review |
| `articles.titleCol` | Umutwe | Title | needs native-speaker review |
| `articles.audience` | Ni iya | For | needs native-speaker review |
| `articles.category` | Ingingo | Topic | needs native-speaker review |
| `articles.status` | Uko imeze | Status | needs native-speaker review |
| `articles.missing` | Indimi zibura | Missing languages | needs native-speaker review |
| `articles.complete` | Yuzuye | Complete | needs native-speaker review |
| `articles.draft` | Umushinga | Draft | needs native-speaker review |
| `articles.published` | Yatangajwe | Published | needs native-speaker review |
| `articles.allAudiences` | Abarwayi n'abakozi | Patients and staff | needs native-speaker review |
| `articles.allStatuses` | Uko imeze kose | Any status | needs native-speaker review |
| `articles.edit` | Hindura {{title}} | Edit {{title}} | needs native-speaker review |
| `editor.newTitle` | Inyandiko nshya y'ubufasha | New help article | needs native-speaker review |
| `editor.editTitle` | Hindura inyandiko | Edit article | needs native-speaker review |
| `editor.slug` | Aderesi | Address | needs native-speaker review |
| `editor.slugHint` | Inyuguti nto, imibare n'akamenyetso kamwe, urugero: ongeramo-umwana | Lowercase letters, numbers and single hyphens, e.g. add-a-child | needs native-speaker review |
| `editor.audience` | Ni iya | For | needs native-speaker review |
| `editor.category` | Ingingo | Topic | needs native-speaker review |
| `editor.sortOrder` | Umwanya | Order | needs native-speaker review |
| `editor.languages` | Indimi | Languages | needs native-speaker review |
| `editor.fieldTitle` | Umutwe ({{language}}) | Title ({{language}}) | needs native-speaker review |
| `editor.fieldSummary` | Incamake ({{language}}) | Summary ({{language}}) | needs native-speaker review |
| `editor.fieldBody` | Inyandiko ({{language}}) | Text ({{language}}) | needs native-speaker review |
| `editor.bodyHint` | Inyandiko isanzwe: umurongo wuzuye ubusa utangira igika gishya, umurongo utangirwa na "- " ni urutonde. | Plain text: a blank line starts a new paragraph, a line starting with "- " is a list item. | needs native-speaker review |
| `editor.counter` | {{count}} kuri {{max}} | {{count}} of {{max}} | needs native-speaker review |
| `editor.missing` | Hibura: {{languages}}. Andika indimi zose mbere yo gutangaza. | Missing: {{languages}}. Write every language before publishing. | needs native-speaker review |
| `editor.preview` | Uko izagaragara ({{language}}) | Preview ({{language}}) | needs native-speaker review |
| `editor.save` | Bika | Save | needs native-speaker review |
| `editor.saved` | Byabitswe. | Saved. | needs native-speaker review |
| `editor.publish` | Tangaza | Publish | needs native-speaker review |
| `editor.published` | Yatangajwe: abantu bashobora kuyisoma. | Published: people can read it now. | needs native-speaker review |
| `editor.unpublish` | Kuraho itangazwa | Unpublish | needs native-speaker review |
| `editor.unpublished` | Yasubijwe mu mushinga: ntikigaragara. | Back to draft: people can no longer see it. | needs native-speaker review |
| `editor.stale` | Undi muntu yahinduye iyi nyandiko. Yongeye gufunguka: yigenzure wongere ubike. | Someone else changed this article. It was reloaded: check it and save again. | needs native-speaker review |
| `editor.fixErrors` | Banza ukosore ibi mbere yo kubika | Please fix these before saving | needs native-speaker review |
| `editor.statusDraft` | Umushinga | Draft | needs native-speaker review |
| `editor.statusPublished` | Yatangajwe | Published | needs native-speaker review |
| `contact.title` | Ubutumwa bwo ku rubuga | Website messages | needs native-speaker review |
| `contact.tabs.label` | Uko ubutumwa buhagaze | Message status | needs native-speaker review |
| `contact.tabs.new` | Bushya | New | needs native-speaker review |
| `contact.tabs.handled` | Bwakozweho | Handled | needs native-speaker review |
| `contact.tabs.all` | Bwose | All | needs native-speaker review |
| `contact.search` | Nimero, izina cyangwa umutwe | Reference, name or subject | needs native-speaker review |
| `contact.searchGo` | Shakisha | Search | needs native-speaker review |
| `contact.empty` | Nta butumwa buri hano | No messages here | needs native-speaker review |
| `contact.emptyNew` | Nta butumwa bushya. Ubutumwa bw'abasura urubuga buza hano. | No new messages. Visitors' messages appear here. | needs native-speaker review |
| `contact.new` | Bushya | New | needs native-speaker review |
| `contact.handled` | Bwakozweho | Handled | needs native-speaker review |
| `contact.handledBy` | Bwakozweho na {{name}}, {{when}} | Handled by {{name}}, {{when}} | needs native-speaker review |
| `contact.note` | Icyakozwe | What was done | needs native-speaker review |
| `contact.noteHint` | Ku itsinda: urugero "Nasubije kuri imeyili". | For the team: for example "Replied by email". | needs native-speaker review |
| `contact.markHandled` | Emeza ko byakozwe | Mark as handled | needs native-speaker review |
| `contact.cancel` | Reka | Cancel | needs native-speaker review |
| `contact.replyEmail` | Subiza {{reach}} | Reply to {{reach}} | needs native-speaker review |
| `contact.call` | Hamagara {{reach}} | Call {{reach}} | needs native-speaker review |

## staff-web feature: imports (namespace imports)

File: `apps/staff-web/src/features/imports/locales/rw.json`

| Key | Kinyarwanda (draft) | English source | Status |
|---|---|---|---|
| `nav` | Kwinjiza abarwayi | Import patients | needs native-speaker review |
| `title` | Kwinjiza abarwayi | Import patients | needs native-speaker review |
| `failed` | Hari ikitagenze neza. Ongera ugerageze. | Something went wrong. Try again. | needs native-speaker review |
| `retry` | Ongera ugerageze | Try again | needs native-speaker review |
| `notFound` | Iyinjiza ntiribonetse | Import not found | needs native-speaker review |
| `earlier` | Ibyinjijwe mbere | Earlier imports | needs native-speaker review |
| `none` | Nta byinjijwe biraba | No imports yet | needs native-speaker review |
| `rows_one` | Umurongo {{count}} | {{count}} row | needs native-speaker review |
| `rows_other` | Imirongo {{count}} | {{count}} rows | needs native-speaker review |
| `upload.label` | Dosiye y’igitabo (CSV) | Register file (CSV) | needs native-speaker review |
| `upload.drop` | Shyira CSV hano | Drop the CSV here | needs native-speaker review |
| `upload.browse` | Hitamo dosiye | Choose a file | needs native-speaker review |
| `upload.hint` | Umurwayi umwe ku murongo, umurongo w’imitwe ubanza. Ntirenze MB 5 n’imirongo 5,000. | One patient per row, a header row first. At most 5 MB and 5,000 rows. | needs native-speaker review |
| `upload.remove` | Kuraho | Remove | needs native-speaker review |
| `upload.working` | Birohereza… | Uploading… | needs native-speaker review |
| `upload.scanning` | Dosiye irasuzumwa… | Checking the file… | needs native-speaker review |
| `upload.infected` | Dosiye yahagaritswe. | The file was blocked. | needs native-speaker review |
| `upload.rejected` | Dosiye yanzwe. | The file was refused. | needs native-speaker review |
| `upload.tooLarge` | Dosiye irarenze MB 5. | The file is larger than 5 MB. | needs native-speaker review |
| `upload.wrongType` | Hitamo dosiye ya CSV. | Choose a CSV file. | needs native-speaker review |
| `status.uploaded` | Huza inkingi | Columns to map | needs native-speaker review |
| `status.previewed` | Byasuzumwe | Checked | needs native-speaker review |
| `status.confirmed` | Byinjijwe | Imported | needs native-speaker review |
| `status.rolled_back` | Byakuweho | Rolled back | needs native-speaker review |
| `status.failed` | Byanze | Failed | needs native-speaker review |
| `mapping.title` | Inkingi irimo iki? | Which column holds what? | needs native-speaker review |
| `mapping.required` | Birakenewe | Required | needs native-speaker review |
| `mapping.none` | Ntibiri muri dosiye | Not in the file | needs native-speaker review |
| `mapping.check` | Suzuma imirongo | Check the rows | needs native-speaker review |
| `field.full_name` | Amazina yose | Full name | needs native-speaker review |
| `field.sex` | Igitsina | Sex | needs native-speaker review |
| `field.date_of_birth` | Itariki y’amavuko | Date of birth | needs native-speaker review |
| `field.phone` | Telefoni | Phone | needs native-speaker review |
| `field.file_number` | Nimero ya dosiye | File number | needs native-speaker review |
| `field.national_id` | Indangamuntu | National ID | needs native-speaker review |
| `count.rows` | Imirongo | Rows | needs native-speaker review |
| `count.valid` | Byiteguye | Ready | needs native-speaker review |
| `count.error` | Bifite ibibazo | With problems | needs native-speaker review |
| `count.duplicate` | Bishobora kuba bisanzwe | Likely duplicates | needs native-speaker review |
| `count.created` | Byinjijwe | Imported | needs native-speaker review |
| `confirmHint_one` | Umurwayi {{count}} ariteguye. Imirongo ifite ibibazo n’ishobora kuba isanzwe ntiyinjizwa. | {{count}} patient is ready. Rows with problems and likely duplicates are left out. | needs native-speaker review |
| `confirmHint_other` | Abarwayi {{count}} biteguye. Imirongo ifite ibibazo n’ishobora kuba isanzwe ntiyinjizwa. | {{count}} patients are ready. Rows with problems and likely duplicates are left out. | needs native-speaker review |
| `nothingReady` | Nta murongo witeguye. Kosora dosiye cyangwa inkingi wongere wohereze. | No row is ready. Fix the file or the columns and upload again. | needs native-speaker review |
| `confirm_one` | Injiza umurwayi {{count}} | Import {{count}} patient | needs native-speaker review |
| `confirm_other` | Injiza abarwayi {{count}} | Import {{count}} patients | needs native-speaker review |
| `rollbackHint` | Ushobora gukuraho iri yinjiza kugeza {{date}}, igihe nta murwayi winjijwe ufite uruzinduko. | You can undo this import until {{date}}, while no imported patient has a visit. | needs native-speaker review |
| `rollbackClosed` | Iri yinjiza ntirigishobora gukurwaho. | This import can no longer be undone. | needs native-speaker review |
| `rollback` | Kuraho iri yinjiza | Undo this import | needs native-speaker review |
| `rolledBackOn` | Ryakuweho ku wa {{date}}. | Undone on {{date}}. | needs native-speaker review |
| `done.checked` | Imirongo yasuzumwe. | Rows checked. | needs native-speaker review |
| `done.confirmed_one` | Umurwayi {{count}} yinjijwe. | {{count}} patient imported. | needs native-speaker review |
| `done.confirmed_other` | Abarwayi {{count}} binjijwe. | {{count}} patients imported. | needs native-speaker review |
| `done.rolledBack` | Iyinjiza ryakuweho. | Import undone. | needs native-speaker review |
| `rowsTitle` | Imirongo | Rows | needs native-speaker review |
| `filter` | Erekana imirongo | Show rows | needs native-speaker review |
| `filters.all` | Yose | All | needs native-speaker review |
| `filters.error` | Ibibazo | Problems | needs native-speaker review |
| `filters.duplicate` | Bisanzwe | Duplicates | needs native-speaker review |
| `filters.valid` | Byiteguye | Ready | needs native-speaker review |
| `col.row` | Umurongo | Row | needs native-speaker review |
| `col.status` | Imiterere | Status | needs native-speaker review |
| `rowStatus.pending` | Ntirasuzumwa | Not checked | needs native-speaker review |
| `rowStatus.valid` | Uriteguye | Ready | needs native-speaker review |
| `rowStatus.error` | Ikibazo | Problem | needs native-speaker review |
| `rowStatus.duplicate` | Ashobora kuba asanzwe | Likely duplicate | needs native-speaker review |
| `rowStatus.created` | Yinjijwe | Imported | needs native-speaker review |
| `rowStatus.rolled_back` | Yakuweho | Undone | needs native-speaker review |
| `problem.required` | kirabura | missing | needs native-speaker review |
| `problem.invalid` | ntibyemewe | not valid | needs native-speaker review |
| `problem.out_of_range` | ntibishoboka | not possible | needs native-speaker review |
| `problem.taken` | byakoreshejwe kabiri | used twice | needs native-speaker review |
| `sex.male` | Gabo | Male | needs native-speaker review |
| `sex.female` | Gore | Female | needs native-speaker review |
| `noRows` | Nta mirongo ihari. | No rows here. | needs native-speaker review |

## staff-web feature: lock (namespace lock)

File: `apps/staff-web/src/features/lock/locales/rw.json`

| Key | Kinyarwanda (draft) | English source | Status |
|---|---|---|---|
| `close` | Funga | Close | needs native-speaker review |
| `cancel` | Reka | Cancel | needs native-speaker review |
| `lockNow` | Funga ubu | Lock now | needs native-speaker review |
| `menuLock` | Funga ecran | Lock screen | needs native-speaker review |
| `menuSecurity` | Umutekano | Security | needs native-speaker review |
| `warning.title` | Uracyahari? | Are you still there? | needs native-speaker review |
| `warning.body` | Kubera ibanga ry'abarwayi, ecran yawe irafunga mu masegonda {{seconds}}. | For patients' privacy, your screen locks in {{seconds}} seconds. | needs native-speaker review |
| `warning.stay` | Komeza winjiye | Stay signed in | needs native-speaker review |
| `screen.title` | Ecran irafunze | Screen locked | needs native-speaker review |
| `screen.who` | Winjiye nka {{name}} | Signed in as {{name}} | needs native-speaker review |
| `screen.pin` | PIN | PIN | needs native-speaker review |
| `screen.password` | Ijambo ry'ibanga | Password | needs native-speaker review |
| `screen.unlock` | Fungura | Unlock | needs native-speaker review |
| `screen.usePassword` | Koresha ijambo ry'ibanga | Use password instead | needs native-speaker review |
| `screen.usePin` | Koresha PIN | Use PIN instead | needs native-speaker review |
| `screen.switchUser` | Si wowe? Hindura ukoresha | Not you? Switch user | needs native-speaker review |
| `screen.pinRequired` | Andika PIN yawe. | Enter your PIN. | needs native-speaker review |
| `screen.passwordRequired` | Andika ijambo ry'ibanga. | Enter your password. | needs native-speaker review |
| `screen.attempts_one` | Hasigaye igerageza {{count}} mbere y'uko usohoka. | {{count}} attempt left before you are signed out. | needs native-speaker review |
| `screen.attempts_other` | Hasigaye amagerageza {{count}} mbere y'uko usohoka. | {{count}} attempts left before you are signed out. | needs native-speaker review |
| `stepUp.title` | Emeza ko ari wowe | Confirm it's you | needs native-speaker review |
| `stepUp.description` | Iki gikorwa gisaba ijambo ry'ibanga na kode iva muri porogaramu yawe y'umutekano. | This action needs your password and a code from your authenticator app. | needs native-speaker review |
| `stepUp.password` | Ijambo ry'ibanga | Password | needs native-speaker review |
| `stepUp.code` | Kode y'umutekano | Authenticator code | needs native-speaker review |
| `stepUp.codeHint` | Imibare 6 iva muri porogaramu yawe y'umutekano | 6 digits from your authenticator app | needs native-speaker review |
| `stepUp.confirm` | Emeza | Confirm | needs native-speaker review |
| `stepUp.required` | Andika ijambo ry'ibanga na kode. | Enter your password and the code. | needs native-speaker review |
| `security.title` | Umutekano | Security | needs native-speaker review |
| `security.pinTitle` | PIN yo gufungura | Unlock PIN | needs native-speaker review |
| `security.pinIsSet` | Ufite PIN. Yikoreshe ufungure ecran vuba. | You have a PIN. Use it to unlock your screen quickly. | needs native-speaker review |
| `security.pinNotSet` | Shyiraho PIN y'imibare 4 kugeza kuri 6 kugira ngo ufungure ecran vuba. Ijambo ry'ibanga rihora rikora. | Set a 4 to 6 digit PIN to unlock your screen quickly. Your password always works too. | needs native-speaker review |
| `security.pin` | PIN | PIN | needs native-speaker review |
| `security.newPin` | PIN nshya | New PIN | needs native-speaker review |
| `security.pinHint` | Imibare 4 kugeza kuri 6. Irinde imibare isubiramo cyangwa ikurikiranye nka 1234. | 4 to 6 digits. Avoid repeated digits and sequences such as 1234. | needs native-speaker review |
| `security.setPin` | Shyiraho PIN | Set PIN | needs native-speaker review |
| `security.changePin` | Hindura PIN | Change PIN | needs native-speaker review |
| `security.removePin` | Kuraho PIN | Remove PIN | needs native-speaker review |
| `security.pinFormat` | Koresha imibare 4 kugeza kuri 6. | Use 4 to 6 digits. | needs native-speaker review |
| `security.pinSaved` | PIN yawe yabitswe. | Your PIN is saved. | needs native-speaker review |
| `security.pinRemoved` | PIN yawe yakuweho. | Your PIN is removed. | needs native-speaker review |
| `security.lockTitle` | Gufunga ecran | Screen lock | needs native-speaker review |
| `security.lockBody` | Ecran yawe irafunga nyuma y'iminota {{minutes}} udakoresha. Yifunge ubwawe igihe ugiye. | Your screen locks after {{minutes}} minutes without activity. Lock it yourself when you step away. | needs native-speaker review |

## staff-web feature: notifications (namespace notifications)

File: `apps/staff-web/src/features/notifications/locales/rw.json`

| Key | Kinyarwanda (draft) | English source | Status |
|---|---|---|---|
| `offline` | Nta murandasi ufite. Ubutumwa buzavugururwa niwongera kugira murandasi. | You're offline. Notifications will update when you're back online. | needs native-speaker review |
| `loadError` | Ntibyashobotse gufungura | We couldn't load this | needs native-speaker review |
| `retry` | Ongera ugerageze | Try again | needs native-speaker review |
| `loading` | Turimo gufungura ubutumwa | Loading notifications | needs native-speaker review |
| `on` | Birakora | On | needs native-speaker review |
| `off` | Ntibikora | Off | needs native-speaker review |
| `unreadMark` | Butarasomwa: | Unread: | needs native-speaker review |
| `priority.critical` | Byihutirwa cyane | Critical | needs native-speaker review |
| `priority.important` | Ingenzi | Important | needs native-speaker review |
| `priority.routine` | Bisanzwe | Routine | needs native-speaker review |
| `languages.rw` | Ikinyarwanda | Ikinyarwanda | needs native-speaker review |
| `languages.en` | English | English | needs native-speaker review |
| `languages.fr` | Français | Français | needs native-speaker review |
| `nav.announcements` | Amatangazo | Announcements | needs native-speaker review |
| `nav.platformAnnouncements` | Amatangazo ya MediLink | Platform announcements | needs native-speaker review |
| `bell.label_one` | Ubutumwa, {{count}} butarasomwa | Notifications, {{count}} unread | needs native-speaker review |
| `bell.label_other` | Ubutumwa, {{count}} butarasomwa | Notifications, {{count}} unread | needs native-speaker review |
| `bell.labelNone` | Ubutumwa, nta butarasomwa | Notifications, none unread | needs native-speaker review |
| `bell.title` | Ubutumwa | Notifications | needs native-speaker review |
| `bell.unread_one` | {{count}} butarasomwa | {{count}} unread | needs native-speaker review |
| `bell.unread_other` | {{count}} butarasomwa | {{count}} unread | needs native-speaker review |
| `bell.newArrived` | Ubutumwa bushya | New notification | needs native-speaker review |
| `bell.newArrivedAgain` | Ubundi butumwa bushya | Another new notification | needs native-speaker review |
| `bell.loadFailed` | Ntibyashobotse gufungura ubutumwa. Kanda wongere ugerageze. | Couldn't load notifications. Select to try again. | needs native-speaker review |
| `bell.empty` | Nta butumwa buraza. | No notifications yet. | needs native-speaker review |
| `bell.otherFacilities_one` | Ibindi bigo: {{count}} butarasomwa | Other facilities: {{count}} unread | needs native-speaker review |
| `bell.otherFacilities_other` | Ibindi bigo: {{count}} butarasomwa | Other facilities: {{count}} unread | needs native-speaker review |
| `bell.markAll` | Byose byasomwe | Mark all as read | needs native-speaker review |
| `bell.seeAll` | Reba ubutumwa bwose | See all notifications | needs native-speaker review |
| `inbox.title` | Ubutumwa | Notifications | needs native-speaker review |
| `inbox.unreadSummary_one` | Ubutumwa {{count}} butarasomwa bwawe n'ubw'iki kigo. | {{count}} unread notification for you and this facility. | needs native-speaker review |
| `inbox.unreadSummary_other` | Ubutumwa {{count}} butarasomwa bwawe n'ubw'iki kigo. | {{count}} unread notifications for you and this facility. | needs native-speaker review |
| `inbox.filter` | Erekana | Show | needs native-speaker review |
| `inbox.all` | Byose | All | needs native-speaker review |
| `inbox.unreadTab_one` | Butarasomwa ({{count}}) | Unread ({{count}}) | needs native-speaker review |
| `inbox.unreadTab_other` | Butarasomwa ({{count}}) | Unread ({{count}}) | needs native-speaker review |
| `inbox.empty` | Nta butumwa buraza | No notifications yet | needs native-speaker review |
| `inbox.emptyUnread` | Wasomye byose | You're all caught up | needs native-speaker review |
| `inbox.emptyBody` | Imenyesha ry'umutekano, amatangazo n'amakuru y'iki kigo bigaragara hano. | Security notices, announcements and updates for this facility appear here. | needs native-speaker review |
| `inbox.pages` | Impapuro | Pages | needs native-speaker review |
| `inbox.previous` | Ibibanza | Previous | needs native-speaker review |
| `inbox.next` | Ibikurikira | Next | needs native-speaker review |
| `inbox.page` | Urupapuro {{page}} kuri {{pages}} | Page {{page}} of {{pages}} | needs native-speaker review |
| `inbox.back` | Ubutumwa | Notifications | needs native-speaker review |
| `inbox.unreadBadge` | Butarasomwa | Unread | needs native-speaker review |
| `inbox.withdrawn` | Bwakuweho | Withdrawn | needs native-speaker review |
| `inbox.markRead` | Byasomwe | Mark as read | needs native-speaker review |
| `inbox.markReadOne` | Shyira “{{title}}” mu byasomwe | Mark “{{title}}” as read | needs native-speaker review |
| `inbox.open` | Fungura | Open | needs native-speaker review |
| `settings.link` | Igenamiterere | Settings | needs native-speaker review |
| `settings.title` | Igenamiterere ry'ubutumwa | Notification settings | needs native-speaker review |
| `settings.conflictTitle` | Iri genamiterere ryahinduriwe ahandi | These settings changed somewhere else | needs native-speaker review |
| `settings.conflict` | Ibyo wahisemo biracyahari. Fungura verisiyo nshya, hanyuma wongere ubike. | Your choices are still here. Load the latest version, then save again. | needs native-speaker review |
| `settings.reload` | Fungura verisiyo nshya | Load the latest version | needs native-speaker review |
| `settings.saved` | Igenamiterere ryabitswe. | Settings saved. | needs native-speaker review |
| `settings.soundTitle` | Ijwi | Sound | needs native-speaker review |
| `settings.sound` | Vuza ijwi ku butumwa bushya | Play a sound for new notifications | needs native-speaker review |
| `settings.soundHint` | Ntirivuga mu buryo busanzwe. Rivuga gusa umaze gukanda cyangwa kwandika kuri paji. | Off by default. The sound plays only after you have clicked or typed on the page. | needs native-speaker review |
| `settings.testSound` | Gerageza ijwi | Play test sound | needs native-speaker review |
| `settings.testPlayed` | Ijwi ry'igerageza ryavuze. | Test sound played. | needs native-speaker review |
| `settings.testBlocked` | Mushakisha yawe yahagaritse ijwi. Reba ko iyi tab idacecekeshejwe. | Your browser blocked the sound. Check that this tab isn't muted. | needs native-speaker review |
| `settings.generalTitle` | Ururimi n'incamake | Language and summaries | needs native-speaker review |
| `settings.language` | Ururimi rw'ubutumwa | Language of notifications | needs native-speaker review |
| `settings.languageHint` | Rukoreshwa mu butumwa, imeyili n'iyi porogaramu. | Used for notifications, emails and this app. | needs native-speaker review |
| `settings.digest` | Ibisabwa kwemezwa | Approval requests | needs native-speaker review |
| `settings.digestHint` | Akira buri busabe bukiza, cyangwa incamake imwe ku munsi. | Get each request as it arrives, or one summary a day. | needs native-speaker review |
| `settings.digestImmediate` | Bikiza | As they arrive | needs native-speaker review |
| `settings.digestDaily` | Incamake imwe ku munsi | One daily summary | needs native-speaker review |
| `settings.save` | Bika igenamiterere | Save settings | needs native-speaker review |
| `announcements.facilityTitle` | Amatangazo | Announcements | needs native-speaker review |
| `announcements.facilityIntro` | Menyesha abarwayi ko hafunzwe cyangwa hari impinduka, cyangwa ushyire itangazo kuri ekarani y'icyumba cyo gutegereza. | Tell patients about closures and changes, or show a notice on the waiting-room screen. | needs native-speaker review |
| `announcements.platformTitle` | Amatangazo ya MediLink | Platform announcements | needs native-speaker review |
| `announcements.platformIntro` | Ubutumwa bwa MediLink ku bakozi b'ibigo byose. | Messages from MediLink to the staff of every facility. | needs native-speaker review |
| `announcements.new` | Itangazo rishya | New announcement | needs native-speaker review |
| `announcements.filterStatus` | Uko rihagaze | Status | needs native-speaker review |
| `announcements.allStatuses` | Uko ahagaze kose | All statuses | needs native-speaker review |
| `announcements.status.draft` | Umushinga | Draft | needs native-speaker review |
| `announcements.status.published` | Ryatangajwe | Published | needs native-speaker review |
| `announcements.status.withdrawn` | Ryakuweho | Withdrawn | needs native-speaker review |
| `announcements.emptyTitle` | Nta tangazo rirabaho | No announcements yet | needs native-speaker review |
| `announcements.empty` | Andika itangazo, ubike nk'umushinga, hanyuma uritangaze ryiteguye. | Write an announcement, save it as a draft, then publish it when it's ready. | needs native-speaker review |
| `announcements.columns.title` | Umutwe | Title | needs native-speaker review |
| `announcements.columns.audience` | Abo rigenewe | Audience | needs native-speaker review |
| `announcements.columns.priority` | Uburemere | Priority | needs native-speaker review |
| `announcements.columns.status` | Uko rihagaze | Status | needs native-speaker review |
| `announcements.columns.updated` | Impinduka iheruka | Last change | needs native-speaker review |
| `announcements.audience.patients_in_range` | Abarwayi bafite gahunda kuri aya matariki | Patients with visits on these dates | needs native-speaker review |
| `announcements.audience.display` | Ekarani y'icyumba cyo gutegereza | Waiting-room display | needs native-speaker review |
| `announcements.audience.all_facilities` | Ibigo byose | All facilities | needs native-speaker review |
| `announcements.audience.selected_facilities` | Ibigo byatoranyijwe | Selected facilities | needs native-speaker review |
| `announcements.audienceHint.patients_in_range` | Abafite gahunda cyangwa itike kuri iki kigo muri ayo matariki, n'ababarera. | Everyone with a booking or ticket at this facility in the date range, and their guardians. | needs native-speaker review |
| `announcements.audienceHint.display` | Rigaragara kuri ekarani y'icyumba cyo gutegereza. Nta muntu umenyeshwa. | Shown on the waiting-room screen. No one is notified. | needs native-speaker review |
| `announcements.audienceHint.all_facilities` | Buri mukozi ukora mu bigo byose. Abayobozi b'ibigo nabo bakira imeyili. | Every active member of every facility. Facility admins also get an email. | needs native-speaker review |
| `announcements.counter` | {{count}} / {{max}} | {{count}} / {{max}} | needs native-speaker review |
| `announcements.savedDraft` | Umushinga wabitswe. | Draft saved. | needs native-speaker review |
| `announcements.publishedNotice` | Ryatangajwe. Abarigenewe barimo kumenyeshwa. | Published. Recipients are notified in the background. | needs native-speaker review |
| `announcements.withdrawnNotice` | Ryakuweho. Ubutumwa butaroherezwa bwahagaritswe. | Withdrawn. Messages not yet sent were cancelled. | needs native-speaker review |
| `announcements.untitled` | Itangazo ritagira umutwe | Untitled announcement | needs native-speaker review |
| `announcements.recipients_one` | Ryoherejwe ku muntu {{count}}. | Sent to {{count}} person. | needs native-speaker review |
| `announcements.recipients_other` | Ryoherejwe ku bantu {{count}}. | Sent to {{count}} people. | needs native-speaker review |
| `announcements.composerIntro` | Andika muri buri rurimi abarwayi bawe bakoresha. Nta makuru y'ubuvuzi, nta miyoboro. | Write in each language your patients use. No clinical details and no links. | needs native-speaker review |
| `announcements.fixErrors` | Banza ukosore ibi mbere yo kubika | Please fix these before saving | needs native-speaker review |
| `announcements.conflict` | Hari undi wahinduye iri tangazo. Ongera ufungure paji urebe verisiyo ye. | Someone else changed this announcement. Reload the page to see their version. | needs native-speaker review |
| `announcements.audienceLabel` | Ni nde ugomba kuribona? | Who should see it? | needs native-speaker review |
| `announcements.selectedLater` | Guhitamo ibigo bimwe bizaza hamwe n'urutonde rw'ibigo. | Choosing individual facilities comes with the facility list. | needs native-speaker review |
| `announcements.from` | Kuva | From | needs native-speaker review |
| `announcements.to` | Kugeza | To | needs native-speaker review |
| `announcements.priorityLabel` | Uburemere | Priority | needs native-speaker review |
| `announcements.priorityHint.routine` | Mu butumwa; push n'imeyili hanze y'amasaha y'ituze. | In the inbox; push and email outside quiet hours. | needs native-speaker review |
| `announcements.priorityHint.important` | Ku mpinduka zireba gahunda z'uyu munsi cyangwa ejo. | For changes that affect today's or tomorrow's visits. | needs native-speaker review |
| `announcements.textTitle` | Ubutumwa | Message | needs native-speaker review |
| `announcements.textHint` | Umutwe ugeze ku nyuguti 120, ubutumwa bugeze ku 1.000, muri buri rurimi. | Title up to 120 characters, message up to 1,000, in each language. | needs native-speaker review |
| `announcements.missingTitle` | Hari indimi zibura | Some languages are missing | needs native-speaker review |
| `announcements.missing` | Ntiryanditse mu {{languages}}. Abakoresha izo ndimi bazabona inyandiko yo mu {{fallback}}. | Not written in {{languages}}. People who use these languages will see the {{fallback}} text. | needs native-speaker review |
| `announcements.languagesLabel` | Indimi | Languages | needs native-speaker review |
| `announcements.tabError` | (harimo ikosa) | (has an error) | needs native-speaker review |
| `announcements.tabMissing` | (ntiryanditse) | (not written) | needs native-speaker review |
| `announcements.titleField` | Umutwe ({{language}}) | Title ({{language}}) | needs native-speaker review |
| `announcements.bodyField` | Ubutumwa ({{language}}) | Message ({{language}}) | needs native-speaker review |
| `announcements.bodyHint` | Nta ndwara, amazina y'ibizamini cyangwa imiyoboro. | No diagnoses, test names or links. | needs native-speaker review |
| `announcements.saveDraft` | Bika umushinga | Save draft | needs native-speaker review |
| `announcements.publish` | Tangaza… | Publish… | needs native-speaker review |
| `announcements.withdraw` | Kuraho… | Withdraw… | needs native-speaker review |
| `announcements.confirmPublish.facility` | Utangaze iri tangazo ku barwayi? | Publish this announcement to patients? | needs native-speaker review |
| `announcements.confirmPublish.platform` | Utangaze iri tangazo ku bigo byose? | Publish this announcement to every facility? | needs native-speaker review |
| `announcements.confirmPublishBody` | Ntirizongera guhindurwa rimaze gutangazwa. Ushobora kurikuraho nyuma. | It can't be edited after publishing. You can withdraw it later. | needs native-speaker review |
| `announcements.confirmWithdraw` | Ukureho iri tangazo? | Withdraw this announcement? | needs native-speaker review |
| `announcements.confirmWithdrawBody` | Ubutumwa butaroherezwa burahagarikwa, kandi ibiri mu butumwa bigashyirwaho ko byakuweho. | Messages not sent yet are cancelled, and inbox items are marked as withdrawn. | needs native-speaker review |
| `announcements.confirmPublishAction` | Tangaza ubu | Publish now | needs native-speaker review |
| `announcements.confirmWithdrawAction` | Kuraho | Withdraw | needs native-speaker review |
| `announcements.cancel` | Reka | Cancel | needs native-speaker review |
| `announcements.preview` | Uko rizagaragara | Preview | needs native-speaker review |
| `announcements.previewLanguage` | Reba mu | Preview in | needs native-speaker review |
| `announcements.previewRange` | Gahunda kuva {{from}} kugeza {{to}} | Visits from {{from}} to {{to}} | needs native-speaker review |
| `announcements.previewEmpty` | Andika umutwe n'ubutumwa urebe uko bizagaragara. | Write a title and message to see the preview. | needs native-speaker review |
| `announcements.loadingTitle` | Itangazo | Announcement | needs native-speaker review |

## staff-web feature: patients (namespace patients)

File: `apps/staff-web/src/features/patients/locales/rw.json`

| Key | Kinyarwanda (draft) | English source | Status |
|---|---|---|---|
| `notFound` | Iyi paji ntibonetse | Page not found | needs native-speaker review |
| `nav.merges` | Ubusabe bwo guhuza | Merge requests | needs native-speaker review |
| `nav.platformMerges` | Guhuza abarwayi | Patient merges | needs native-speaker review |
| `close` | Funga | Close | needs native-speaker review |
| `cancel` | Reka | Cancel | needs native-speaker review |
| `save` | Bika | Save | needs native-speaker review |
| `required` | Ibi birakenewe. | This is required. | needs native-speaker review |
| `age_one` | Umwaka {{count}} | {{count}} year | needs native-speaker review |
| `age_other` | Imyaka {{count}} | {{count}} years | needs native-speaker review |
| `ageEstimated_one` | Hafi umwaka {{count}} | about {{count}} year | needs native-speaker review |
| `ageEstimated_other` | Hafi imyaka {{count}} | about {{count}} years | needs native-speaker review |
| `sex.female` | Gore | Female | needs native-speaker review |
| `sex.male` | Gabo | Male | needs native-speaker review |
| `sex.other` | Ikindi | Other | needs native-speaker review |
| `identifierKinds.national_id` | Indangamuntu | National ID | needs native-speaker review |
| `identifierKinds.passport` | Pasiporo | Passport | needs native-speaker review |
| `identifierKinds.refugee_id` | Ikarita y'impunzi | Refugee ID | needs native-speaker review |
| `identifierKinds.birth_certificate` | Icyemezo cy'amavuko | Birth certificate | needs native-speaker review |
| `insurers.mutuelle` | Mituweli | Mutuelle de Santé | needs native-speaker review |
| `insurers.rssb` | RSSB (RAMA) | RSSB (RAMA) | needs native-speaker review |
| `insurers.mmi` | MMI | MMI | needs native-speaker review |
| `insurers.radiant` | Radiant | Radiant | needs native-speaker review |
| `fields.name` | Amazina | Names | needs native-speaker review |
| `fields.age` | Imyaka | Age | needs native-speaker review |
| `fields.sex` | Igitsina | Sex | needs native-speaker review |
| `fields.dateOfBirth` | Itariki y'amavuko | Date of birth | needs native-speaker review |
| `fields.phone` | Telefoni | Phone | needs native-speaker review |
| `fields.newPhone` | Nimero nshya ya telefoni | New phone number | needs native-speaker review |
| `fields.email` | Imeyili | Email | needs native-speaker review |
| `fields.address` | Aderesi | Address | needs native-speaker review |
| `fields.nationalId` | Indangamuntu | National ID | needs native-speaker review |
| `fields.fileNumber` | Nomero ya dosiye | File no. | needs native-speaker review |
| `fields.medilinkNumber` | Nomero ya MediLink | MediLink number | needs native-speaker review |
| `fields.insurance` | Ubwishingizi | Insurance | needs native-speaker review |
| `fields.insurer` | Umwishingizi | Insurer | needs native-speaker review |
| `fields.memberNumber` | Nomero y'umunyamuryango | Member number | needs native-speaker review |
| `fields.document` | Icyangombwa | Identity document | needs native-speaker review |
| `fields.documentNumber` | Nomero y'icyangombwa | Document number | needs native-speaker review |
| `fields.country` | Igihugu cyagitanze | Issuing country | needs native-speaker review |
| `fields.preferredName` | Izina akunda | Preferred name | needs native-speaker review |
| `fields.emergencyContact` | Uwo guhamagara mu byihutirwa | Emergency contact | needs native-speaker review |
| `fields.notes` | Ibisobanuro by'iyakira | Reception notes | needs native-speaker review |
| `search.title` | Abarwayi | Patients | needs native-speaker review |
| `search.label` | Shakisha umurwayi | Find a patient | needs native-speaker review |
| `search.placeholder` | Izina, telefoni, indangamuntu, dosiye cyangwa nomero ya MediLink | Name, phone, national ID, file or MediLink number | needs native-speaker review |
| `search.types.medilink_number` | Nomero ya MediLink | MediLink no. | needs native-speaker review |
| `search.types.national_id` | Indangamuntu | National ID | needs native-speaker review |
| `search.types.phone` | Telefoni | Phone | needs native-speaker review |
| `search.types.file_number` | Nomero ya dosiye | File no. | needs native-speaker review |
| `search.types.name` | Izina | Name | needs native-speaker review |
| `search.resultCount_one` | Umurwayi {{count}} wabonetse | {{count}} patient found | needs native-speaker review |
| `search.resultCount_other` | Abarwayi {{count}} babonetse | {{count}} patients found | needs native-speaker review |
| `search.results` | Ibyavuye mu ishakisha | Search results | needs native-speaker review |
| `search.noResults` | Nta murwayi wo muri iki kigo uhuye n'ibi. Reba uko wanditse, cyangwa ushakishe ukoresheje telefoni cyangwa indangamuntu. | No patient at this facility matches. Check the spelling, or search by phone or ID. | needs native-speaker review |
| `search.register` | Andika umurwayi mushya | Register walk-in | needs native-speaker review |
| `search.button` | Shakisha | Search | needs native-speaker review |
| `search.noResultsTitle` | Nta murwayi wabonetse | No patient found | needs native-speaker review |
| `search.startTitle` | Shaka umurwayi kugira ngo utangire | Find a patient to begin | needs native-speaker review |
| `search.startBody` | Shakisha ukoresheje izina, telefoni, indangamuntu, nimero ya dosiye cyangwa nimero ya MediLink. Kanda N kwandika umurwayi uje atateganyijwe. | Search by name, phone, national ID, file or MediLink number. Press N to register a walk-in. | needs native-speaker review |
| `search.startQueue` | Fungura umurongo w'uyu munsi | Open today's queue | needs native-speaker review |
| `external.title` | Asanzwe kuri MediLink | Already on MediLink | needs native-speaker review |
| `external.hint` | Uyu muntu yanditswe mu kindi kigo. Musabe nomero ye ya MediLink kugira ngo umwongere hano. | This person is registered at another facility. Ask for their MediLink number to add them here. | needs native-speaker review |
| `external.add` | Mwongere kuri iki kigo | Add to this facility | needs native-speaker review |
| `external.dialogTitle` | Ongera {{name}} kuri iki kigo | Add {{name}} to this facility | needs native-speaker review |
| `external.proofHint` | Emeza nomero ya MediLink iri ku ikarita cyangwa kuri telefoni y'umurwayi. | Confirm the MediLink number from the patient's card or phone. | needs native-speaker review |
| `register.title` | Andika umurwayi utabanje gufata gahunda | Register a walk-in | needs native-speaker review |
| `register.nameHint` | Amazina yose, nk'uko umurwayi ayavuga. | All names, as the patient says them. | needs native-speaker review |
| `register.ageMode` | Itariki y'amavuko cyangwa imyaka | Birth date or age | needs native-speaker review |
| `register.ageModes.dob` | Itariki y'amavuko | Date of birth | needs native-speaker review |
| `register.ageModes.years` | Imyaka | Age in years | needs native-speaker review |
| `register.ageModes.months` | Amezi | Age in months | needs native-speaker review |
| `register.phoneInvalid` | Andika nimero ya telefoni yo mu Rwanda nka 0788 123 456. | Enter a Rwandan mobile number like 0788 123 456. | needs native-speaker review |
| `register.noInsurance` | Nta bwishingizi | No insurance | needs native-speaker review |
| `register.more` | Ibindi bisobanuro (indangamuntu, dosiye) | More details (ID, file number) | needs native-speaker review |
| `register.less` | Ibisobanuro bike | Fewer details | needs native-speaker review |
| `register.countryHint` | Inyuguti ebyiri, urugero UG | Two letters, e.g. UG | needs native-speaker review |
| `register.consentScript` | Soma mu ijwi riranguruye: "MediLink ibika amakuru y'ubuzima bwawe kugira ngo ibigo ujyamo bigufashe. Abakozi bakuvura ni bo bonyine bayabona, kandi ushobora kureba uwayafunguye." | Read aloud: "MediLink keeps your health records so the facilities you visit can care for you. Only staff caring for you can see them, and you can see who opened them." | needs native-speaker review |
| `register.consent` | Umurwayi yemeye kuvurwa | The patient agreed to care consent | needs native-speaker review |
| `register.possibleDuplicate` | Uyu murwayi ashobora kuba asanzwe yanditswe hano. | This patient may already be registered here. | needs native-speaker review |
| `register.confirmNotDuplicate` | Nagenzuye abasa na we: ni undi muntu | I checked the matches: this is a different person | needs native-speaker review |
| `register.findThem` | Mushakire mu ishakisha | Find them in search | needs native-speaker review |
| `register.submit` | Andika | Register | needs native-speaker review |
| `register.suggestions` | Abashobora kuba ari we | Possible matches | needs native-speaker review |
| `register.suggestionsHint` | Abasa na we bagaragara hano iyo amazina n'imyaka, cyangwa telefoni, byujujwe. | Matches appear here once names and an age, or a phone number, are filled in. | needs native-speaker review |
| `register.noMatches` | Nta murwayi usa na we uri hano. | No similar patients here. | needs native-speaker review |
| `register.levels.exact_identifier` | Icyangombwa kimwe | Same document | needs native-speaker review |
| `register.levels.strong` | Birashoboka cyane ko ari we | Very likely the same person | needs native-speaker review |
| `register.levels.possible` | Ashobora kuba ari we | Possibly the same person | needs native-speaker review |
| `register.elsewhere_one` | Umurwayi {{count}} usa na we ari mu kindi kigo. Saba indangamuntu cyangwa nomero ya MediLink. | {{count}} similar patient at another facility. Ask for an ID or MediLink number. | needs native-speaker review |
| `register.elsewhere_other` | Abarwayi {{count}} basa na we bari mu bindi bigo. Saba indangamuntu cyangwa nomero ya MediLink. | {{count}} similar patients at other facilities. Ask for an ID or MediLink number. | needs native-speaker review |
| `register.strongHint` | Fungura uwo usa na we ugenzure mbere yo kongera kwandika. | Open the match to check before registering again. | needs native-speaker review |
| `register.done` | {{name}} yanditswe | {{name}} is registered | needs native-speaker review |
| `register.number` | Nomero ya MediLink: | MediLink number: | needs native-speaker review |
| `register.openRecord` | Fungura dosiye | Open record | needs native-speaker review |
| `register.another` | Andika undi | Register another | needs native-speaker review |
| `register.sections.person` | Umuntu | Person | needs native-speaker review |
| `register.sections.contact` | Aho abarizwa n'ubwishingizi | Contact and insurance | needs native-speaker review |
| `record.photoHint` | Umurwayi yashyizeho ifoto kugira ngo mumumenye. Buri gihe iyirebwe biranditswa. | The patient added a photo to help you recognise them. Each view is logged. | needs native-speaker review |
| `record.showPhoto` | Erekana ifoto | Show photo | needs native-speaker review |
| `record.photoAlt` | Ifoto ya {{name}} | Photo of {{name}} | needs native-speaker review |
| `record.photoUnavailable` | Ifoto ntiboneka ubu. | The photo is not available right now. | needs native-speaker review |
| `record.merged` | Yahujwe | Merged | needs native-speaker review |
| `record.staffMember` | Umukozi | Staff member | needs native-speaker review |
| `record.hasAccount` | Afite konti ya MediLink | Has a MediLink account | needs native-speaker review |
| `record.openSurvivor` | Iyi dosiye yahujwe. Fungura dosiye isigaye. | This record was merged. Open the remaining record. | needs native-speaker review |
| `record.sections` | Ibice bya dosiye y'umurwayi | Patient record sections | needs native-speaker review |
| `record.tabs.details` | Amakuru | Details | needs native-speaker review |
| `record.tabs.identifiers` | Ibyangombwa | Identifiers | needs native-speaker review |
| `record.tabs.insurance` | Ubwishingizi | Insurance | needs native-speaker review |
| `record.tabs.health` | Ubuzima | Health profile | needs native-speaker review |
| `record.tabs.consents` | Uruhushya | Consents | needs native-speaker review |
| `record.edit` | Hindura amakuru | Edit details | needs native-speaker review |
| `record.reportDuplicate` | Menyesha dosiye ebyiri | Report duplicate | needs native-speaker review |
| `reveal.show` | Erekana | Show | needs native-speaker review |
| `reveal.hide` | Hisha | Hide | needs native-speaker review |
| `reveal.showing` | Birerekanwa… | Showing… | needs native-speaker review |
| `reveal.description` | Agaciro kose kandikwa mu mateka y'abafunguye dosiye y'umurwayi hamwe n'impamvu yawe. | The full value is recorded in the patient's access history with your reason. | needs native-speaker review |
| `reveal.reason` | Impamvu | Reason | needs native-speaker review |
| `reveal.reasonText` | Sobanura impamvu | Explain the reason | needs native-speaker review |
| `reveal.reasons.identity_check` | Kugenzura umwirondoro | Identity check | needs native-speaker review |
| `reveal.reasons.insurance_claim` | Ubwishingizi | Insurance claim | needs native-speaker review |
| `reveal.reasons.patient_request` | Umurwayi yabisabye | The patient asked | needs native-speaker review |
| `reveal.reasons.other` | Ikindi | Other | needs native-speaker review |
| `reveal.titlePhone` | Erekana nimero ya telefoni | Show phone number | needs native-speaker review |
| `reveal.titleIdentifier` | Erekana icyangombwa | Show identity document | needs native-speaker review |
| `identifiers.none` | Nta cyangombwa kirandikwa. | No identity document yet. | needs native-speaker review |
| `identifiers.checked` | Cyagenzuwe | Checked | needs native-speaker review |
| `identifiers.add` | Ongeraho icyangombwa | Add a document | needs native-speaker review |
| `identifiers.seen` | Nabonye icyangombwa | I saw the document | needs native-speaker review |
| `insurance.status.unverified` | Ntiragenzurwa | Not checked | needs native-speaker review |
| `insurance.status.verified` | Yagenzuwe | Verified | needs native-speaker review |
| `insurance.status.rejected` | Yanzwe | Rejected | needs native-speaker review |
| `insurance.expired` | Yarangiye | Expired | needs native-speaker review |
| `insurance.inactive` | Ntikoreshwa | Not in use | needs native-speaker review |
| `insurance.none` | Nta karita y'ubwishingizi. | No insurance card. | needs native-speaker review |
| `insurance.lastVerified` | Yagenzuwe kuri {{facility}} ku wa {{date}} | Checked at {{facility}} on {{date}} | needs native-speaker review |
| `insurance.verify` | Emeza ko yagenzuwe | Mark verified | needs native-speaker review |
| `insurance.reject` | Yanga | Reject | needs native-speaker review |
| `insurance.rejectTitle` | Yanga iyi karita | Reject this card | needs native-speaker review |
| `insurance.rejectConsequences` | Ikarita izagaragara nk'iyanzwe kugeza yongeye kugenzurwa. | The card will show as rejected until someone checks it again. | needs native-speaker review |
| `insurance.reason` | Impamvu | Reason | needs native-speaker review |
| `insurance.add` | Ongeraho ikarita | Add a card | needs native-speaker review |
| `insurance.card.front` | Imbere y'ikarita | Card front | needs native-speaker review |
| `insurance.card.back` | Inyuma y'ikarita | Card back | needs native-speaker review |
| `insurance.card.added` | Ifoto yongeweho | Photo added | needs native-speaker review |
| `insurance.card.missing` | Nta foto iriho | No photo yet | needs native-speaker review |
| `insurance.card.add` | Ongeraho ifoto | Add photo | needs native-speaker review |
| `insurance.card.view` | Reba | View | needs native-speaker review |
| `health.noKnownAllergies` | Nta allergie izwi | No known allergies | needs native-speaker review |
| `health.allergies` | Allergie | Allergies | needs native-speaker review |
| `health.conditions` | Indwara | Conditions | needs native-speaker review |
| `health.medications` | Imiti | Medicines | needs native-speaker review |
| `health.none` | Nta na kimwe cyanditswe. | None recorded. | needs native-speaker review |
| `health.status.unverified` | Ntiragenzurwa | Unverified | needs native-speaker review |
| `health.status.verified` | Yagenzuwe | Verified | needs native-speaker review |
| `health.status.refuted` | Yahakanywe | Refuted | needs native-speaker review |
| `health.confirm` | Emeza | Confirm | needs native-speaker review |
| `health.add.allergies` | Ongeraho allergie | Add an allergy | needs native-speaker review |
| `health.add.conditions` | Ongeraho indwara | Add a condition | needs native-speaker review |
| `health.add.medications` | Ongeraho umuti | Add a medicine | needs native-speaker review |
| `health.addButton` | Ongeraho | Add | needs native-speaker review |
| `consents.hasCare` | Uruhushya rwo kuvurwa rwanditswe. | Care consent recorded. | needs native-speaker review |
| `consents.noCare` | Nta ruhushya rwo kuvurwa ruranditswe. | No care consent yet. | needs native-speaker review |
| `consents.scriptRead` | Nasomye inyandiko y'uruhushya kandi umurwayi yarwemeye | I read the consent text and the patient agreed | needs native-speaker review |
| `consents.record` | Andika uruhushya | Record consent | needs native-speaker review |
| `claims.title` | Gusaba dosiye | Record claim | needs native-speaker review |
| `claims.hint` | Umurwayi arashaka guhuza iyi dosiye na konti ye ya MediLink. Banza ugenzure icyangombwa. | The patient wants to link this record to their MediLink account. Check an identity document first. | needs native-speaker review |
| `claims.reference` | Nomero y'ubusabe | Claim reference | needs native-speaker review |
| `claims.documentMatches` | Icyangombwa gihuye n'iyi dosiye | The identity document matches this record | needs native-speaker review |
| `claims.confirm` | Emeza ubusabe | Confirm claim | needs native-speaker review |
| `claims.done` | Dosiye ubu ihujwe na konti y'umurwayi. | The record is now linked to the patient's account. | needs native-speaker review |
| `merges.filter` | Shungura ukurikije uko bihagaze | Filter by status | needs native-speaker review |
| `merges.all` | Byose | All | needs native-speaker review |
| `merges.none` | Nta busabe bwo guhuza. | No merge requests. | needs native-speaker review |
| `merges.status.requested` | Birategereje | Waiting | needs native-speaker review |
| `merges.status.executed` | Byahujwe | Merged | needs native-speaker review |
| `merges.status.rejected` | Byanzwe | Rejected | needs native-speaker review |
| `merges.status.cancelled` | Byahagaritswe | Cancelled | needs native-speaker review |
| `merges.status.undone` | Byasubijwe inyuma | Undone | needs native-speaker review |
| `merges.scope.facility` | Iki kigo | This facility | needs native-speaker review |
| `merges.scope.cross_facility` | Ibigo byinshi | Several facilities | needs native-speaker review |
| `merges.scope.claim` | Gusaba dosiye | Claim | needs native-speaker review |
| `merges.escalated` | byoherejwe ku itsinda rya platform | sent to the platform team | needs native-speaker review |
| `merges.panelTitle` | Ubusabe bwo guhuza | Merge request | needs native-speaker review |
| `merges.surviving` | Igumaho | Keep | needs native-speaker review |
| `merges.merged` | Ihuzwa nayo | Merge into it | needs native-speaker review |
| `merges.preview.identifiers` | Ibyangombwa | Identity documents | needs native-speaker review |
| `merges.preview.insurance_profiles` | Amakarita y'ubwishingizi | Insurance cards | needs native-speaker review |
| `merges.preview.health_items` | Amakuru y'ubuzima | Health items | needs native-speaker review |
| `merges.preview.account_links` | Konti zihujwe | Account links | needs native-speaker review |
| `merges.preview.other_facilities` | Ibindi bigo | Other facilities | needs native-speaker review |
| `merges.conflicts` | Ibyangombwa bitandukanye by'ubwoko bumwe: {{kinds}}. Izi dosiye ntizishobora guhuzwa. | Different documents of the same kind: {{kinds}}. These records can't be merged. | needs native-speaker review |
| `merges.reason` | Impamvu | Reason | needs native-speaker review |
| `merges.approve` | Emeza uhuze | Approve and merge | needs native-speaker review |
| `merges.reject` | Yanga | Reject | needs native-speaker review |
| `merges.cancel` | Hagarika ubusabe | Cancel request | needs native-speaker review |
| `merges.escalate` | Ohereza ku itsinda rya platform | Send to platform team | needs native-speaker review |
| `merges.undo` | Subiza inyuma | Undo merge | needs native-speaker review |
| `merges.request` | Saba guhuza | Request merge | needs native-speaker review |
| `merges.requestHint` | Hitamo indi dosiye ya {{name}}. Undi muntu ni we uzafata icyemezo. | Choose the other record of {{name}}. Another approver decides. | needs native-speaker review |
| `merges.findOther` | Shakisha indi dosiye | Find the other record | needs native-speaker review |
| `merges.duplicateRecord` | Dosiye yikubye | Duplicate record | needs native-speaker review |
| `merges.confirm.approve.title` | Guhuza izi dosiye? | Merge these records? | needs native-speaker review |
| `merges.confirm.approve.consequences` | Ibyangombwa, ubwishingizi, amakuru y'ubuzima na nomero ya dosiye bijya kuri dosiye isigaye. Ushobora kubisubiza inyuma nyuma. | Documents, insurance, health items and the file number move to the kept record. You can undo it later. | needs native-speaker review |
| `merges.confirm.reject.title` | Kwanga ubu busabe? | Reject this request? | needs native-speaker review |
| `merges.confirm.reject.consequences` | Dosiye zikomeza gutandukana. | The records stay separate. | needs native-speaker review |
| `merges.confirm.cancel.title` | Guhagarika ubusabe bwawe? | Cancel your request? | needs native-speaker review |
| `merges.confirm.cancel.consequences` | Ubusabe burafungwa nta cyemezo gifashwe. | The request is closed without a decision. | needs native-speaker review |
| `merges.confirm.escalate.title` | Kohereza ku itsinda rya platform? | Send to the platform team? | needs native-speaker review |
| `merges.confirm.escalate.consequences` | Nta wundi hano ushobora kubwemeza, itsinda rya platform ni ryo rizafata icyemezo. | No one else here can approve it, so the platform team will decide. | needs native-speaker review |
| `merges.confirm.undo.title` | Gusubiza inyuma uku guhuza? | Undo this merge? | needs native-speaker review |
| `merges.confirm.undo.consequences` | Ibyimuwe bisubira muri dosiye za mbere, keretse niba byarahindutse. | Moved items go back to the original records, unless they changed since. | needs native-speaker review |
| `palette.searchFor` | Shakisha abarwayi “{{query}}” | Search patients for “{{query}}” | needs native-speaker review |
| `palette.results` | Abarwayi | Patients | needs native-speaker review |
| `palette.file` | Dosiye {{number}} | File {{number}} | needs native-speaker review |
| `picker.mode` | Shakisha cyangwa wandike umurwayi | Find or register the patient | needs native-speaker review |
| `picker.find` | Shakisha umurwayi | Find a patient | needs native-speaker review |
| `picker.new` | Umurwayi mushya | New patient | needs native-speaker review |
| `picker.noMatch` | Nta murwayi wabonetse. Mwandike nk’umurwayi mushya. | No patient found. Register them as a new patient. | needs native-speaker review |
| `picker.choose` | Hitamo | Choose | needs native-speaker review |
| `accessReason.heading` | Dosiye y'umurwayi | Patient record | needs native-speaker review |
| `accessReason.title` | Kuki ufunguye iyi dosiye? | Why are you opening this record? | needs native-speaker review |
| `accessReason.description` | Uyu murwayi nta gusura aherutse hano, cyangwa akora hano. Impamvu yawe yandikwa mu mateka y'abafunguye dosiye ye. | This patient has no recent visit here, or works here. Your reason is recorded in their access history. | needs native-speaker review |
| `accessReason.reason` | Impamvu | Reason | needs native-speaker review |
| `accessReason.reasons.care_continuity` | Gukomeza kumuvura | Continuing their care | needs native-speaker review |
| `accessReason.reasons.results_review` | Kureba ibisubizo | Reviewing results | needs native-speaker review |
| `accessReason.reasons.admin_request` | Icyifuzo cy'ubuyobozi | Administrative request | needs native-speaker review |
| `accessReason.reasons.other` | Ikindi | Other | needs native-speaker review |
| `accessReason.reasonText` | Sobanura impamvu | Explain the reason | needs native-speaker review |
| `accessReason.open` | Fungura dosiye | Open record | needs native-speaker review |
| `contact.title` | Uwo kuvugisha | Contact person | needs native-speaker review |
| `contact.hint` | Ku murwayi udafite telefone: umuvandimwe cyangwa umujyanama w'ubuzima uhabwa ubutumwa bwo kwibutsa, umurwayi abyemeye. | For a patient without a phone: a relative or a community health worker who gets reminders and alerts, with the patient's consent. | needs native-speaker review |
| `contact.name` | Izina | Name | needs native-speaker review |
| `contact.phone` | Telefone | Phone | needs native-speaker review |
| `contact.newPhone` | Telefone nshya (siga ubusa ngo igume) | New phone (leave empty to keep it) | needs native-speaker review |
| `contact.relationship` | Isano | Relationship | needs native-speaker review |
| `contact.relationshipHint` | Urugero: umukobwa, umuturanyi, umujyanama w'ubuzima | For example: daughter, neighbour, community health worker | needs native-speaker review |
| `careSchedule.tab` | Gahunda y'ubuvuzi | Care schedule | needs native-speaker review |
| `careSchedule.title` | Inkingo n'isuzuma ry'ababyeyi batwite biteganyijwe | Planned vaccinations and antenatal visits | needs native-speaker review |
| `careSchedule.intro` | Umurwayi yibutswa umunsi ubanziriza n'icyo gitondo. Ubutumwa ntibuvuga icyo gahunda igamije; icyitonderwa kigaragara gusa muri porogaramu y'umurwayi. | The patient gets a reminder the day before and on the morning. The reminder never says what the visit is for; the note shows only in the patient's app. | needs native-speaker review |
| `careSchedule.empty` | Nta gahunda iteganyijwe. | Nothing planned. | needs native-speaker review |
| `careSchedule.failed` | Ntibyakunze kubona gahunda y'ubuvuzi. | We couldn't load the care schedule. | needs native-speaker review |
| `careSchedule.add` | Teganya itariki | Plan a date | needs native-speaker review |
| `careSchedule.kind` | Iki | What | needs native-speaker review |
| `careSchedule.kinds.vaccination` | Urukingo | Vaccination | needs native-speaker review |
| `careSchedule.kinds.antenatal` | Isuzuma ry'umubyeyi utwite | Antenatal visit | needs native-speaker review |
| `careSchedule.dueOn` | Itariki | Date | needs native-speaker review |
| `careSchedule.note` | Icyitonderwa (si ngombwa) | Note (optional) | needs native-speaker review |
| `careSchedule.noteHint` | Urugero: doze ya kabiri. Inyuguti 80 ntarengwa. | For example: second dose. Up to 80 characters. | needs native-speaker review |
| `careSchedule.save` | Ongeraho kuri gahunda | Add to the schedule | needs native-speaker review |
| `careSchedule.saved` | Byongeweho. Umurwayi azibutswa. | Added. The patient will get reminders. | needs native-speaker review |
| `careSchedule.cancel` | Hagarika itariki | Cancel date | needs native-speaker review |
| `careSchedule.cancelTitle` | Guhagarika iyi tariki iteganyijwe? | Cancel this planned date? | needs native-speaker review |
| `careSchedule.cancelConsequences` | Umurwayi ntazibutswa ku wa {{date}}. Kugira ngo uhindure itariki, yihagarike wongereho indi. | The patient gets no reminder for {{date}}. To move the date, cancel it and add the new one. | needs native-speaker review |

## staff-web feature: pharmacy (namespace pharmacy)

File: `apps/staff-web/src/features/pharmacy/locales/rw.json`

| Key | Kinyarwanda (draft) | English source | Status |
|---|---|---|---|
| `loading` | Biratangira | Loading | needs native-speaker review |
| `nav.availability` | Imiti iboneka | Medicine availability | needs native-speaker review |
| `nav.history` | Amateka yo gutanga imiti | Dispensing history | needs native-speaker review |
| `nav.verify` | Genzura urupapuro rw'imiti | Verify a prescription | needs native-speaker review |
| `nav.stock` | Ububiko | Stock | needs native-speaker review |
| `age_one` | Umwaka {{count}} | {{count}} year | needs native-speaker review |
| `age_other` | Imyaka {{count}} | {{count}} years | needs native-speaker review |
| `days_one` | Umunsi {{count}} | {{count}} day | needs native-speaker review |
| `days_other` | Iminsi {{count}} | {{count}} days | needs native-speaker review |
| `byDoctor` | Dr {{name}} | Dr {{name}} | needs native-speaker review |
| `validUntil` | ifite agaciro kugeza {{date}} | valid until {{date}} | needs native-speaker review |
| `reason` | Impamvu | Reason | needs native-speaker review |
| `reasonMin` | Tanga impamvu (inyuguti 5 cyangwa zirenga). | Give a reason (5 characters or more). | needs native-speaker review |
| `keep` | Bireke | Keep it | needs native-speaker review |
| `close` | Funga | Close | needs native-speaker review |
| `yes` | Yego | Yes | needs native-speaker review |
| `no` | Oya | No | needs native-speaker review |
| `frequency.once` | Rimwe | Once | needs native-speaker review |
| `frequency.od` | Rimwe ku munsi | Once a day | needs native-speaker review |
| `frequency.bd` | Kabiri ku munsi | Twice a day | needs native-speaker review |
| `frequency.tds` | Gatatu ku munsi | Three times a day | needs native-speaker review |
| `frequency.qds` | Kane ku munsi | Four times a day | needs native-speaker review |
| `frequency.nocte` | Nijoro | At night | needs native-speaker review |
| `frequency.prn` | Igihe bikenewe | When needed | needs native-speaker review |
| `route.oral` | Kunywa | By mouth | needs native-speaker review |
| `route.topical` | Gusiga ku ruhu | On the skin | needs native-speaker review |
| `route.inhaled` | Guhumeka | Inhaled | needs native-speaker review |
| `route.rectal` | Mu kibuno | Rectal | needs native-speaker review |
| `route.vaginal` | Mu gitsina | Vaginal | needs native-speaker review |
| `route.eye` | Mu jisho | In the eye | needs native-speaker review |
| `route.ear` | Mu gutwi | In the ear | needs native-speaker review |
| `route.nasal` | Mu zuru | In the nose | needs native-speaker review |
| `route.injection` | Urushinge | Injection | needs native-speaker review |
| `status.draft` | Itarangira | Draft | needs native-speaker review |
| `status.issued` | Yatanzwe | Issued | needs native-speaker review |
| `status.awaiting_payment` | Itegereje kwishyurwa | Waiting for payment | needs native-speaker review |
| `status.ready_to_dispense` | Yiteguye | Ready | needs native-speaker review |
| `status.partly_dispensed` | Yatanzwe igice | Partly given | needs native-speaker review |
| `status.dispensed` | Yatanzwe | Given | needs native-speaker review |
| `status.not_available` | Ntiboneka hano | Not available here | needs native-speaker review |
| `status.cancelled` | Yahagaritswe | Cancelled | needs native-speaker review |
| `status.expired` | Yarengeje igihe | Expired | needs native-speaker review |
| `itemStatus.draft` | Itarangira | Draft | needs native-speaker review |
| `itemStatus.issued` | Gutangwa | To give | needs native-speaker review |
| `itemStatus.partly_dispensed` | Yatanzwe igice | Partly given | needs native-speaker review |
| `itemStatus.dispensed` | Yatanzwe | Given | needs native-speaker review |
| `itemStatus.not_available` | Gura hanze | Buy outside | needs native-speaker review |
| `itemStatus.cancelled` | Yahagaritswe | Cancelled | needs native-speaker review |
| `itemStatus.expired` | Yarengeje igihe | Expired | needs native-speaker review |
| `flag.controlled` | Ugenzurwa | Controlled | needs native-speaker review |
| `flag.queried` | Ikibazo kuri muganga | Question to the doctor | needs native-speaker review |
| `flag.notInStock` | Ntuboneka hano | Not in stock here | needs native-speaker review |
| `flag.offCatalogue` | Ntuba mu rutonde | Not in the catalogue | needs native-speaker review |
| `flag.noSubstitution` | Nta gusimbuza | No substitution | needs native-speaker review |
| `flag.lowStock` | Ububiko buke hano | Low stock here | needs native-speaker review |
| `queue.title` | Farumasi | Pharmacy | needs native-speaker review |
| `queue.tabs` | Resept hakurikijwe uko zimeze | Prescriptions by state | needs native-speaker review |
| `queue.tab.ready` | Ziteguye | Ready | needs native-speaker review |
| `queue.tab.partly` | Zatanzwe igice | Partly given | needs native-speaker review |
| `queue.tab.queried` | Ibibazo | Questions | needs native-speaker review |
| `queue.search` | Shaka resept | Find a prescription | needs native-speaker review |
| `queue.searchHint` | Izina, nimero ya resept cyangwa tike | Name, prescription number or ticket | needs native-speaker review |
| `queue.issued` | Yatanzwe {{time}} | Issued {{time}} | needs native-speaker review |
| `queue.items_one` | Umuti {{count}} | {{count}} medicine | needs native-speaker review |
| `queue.items_other` | Imiti {{count}} | {{count}} medicines | needs native-speaker review |
| `queue.empty.ready` | Nta kintu gitegereje. Resept zigaragara iyo muganga asinye. | Nothing waiting. New prescriptions appear when a doctor signs. | needs native-speaker review |
| `queue.empty.partly` | Nta resept yatanzwe igice. | No prescription is partly given. | needs native-speaker review |
| `queue.empty.queried` | Nta kibazo gifunguye kuri muganga. | No open question to a doctor. | needs native-speaker review |
| `queue.noMatch` | Nta resept ihuye | No prescription matches | needs native-speaker review |
| `queue.noMatchBody` | Reba uko wanditse, cyangwa ushake ukoresheje nimero ya resept cyangwa tike. | Check the spelling, or search by prescription number or ticket. | needs native-speaker review |
| `identity.title` | Ni nde uri ku idirishya? | Who is at the counter? | needs native-speaker review |
| `identity.hint` | Emeza umuntu mbere yo gutanga ikintu. | Confirm the person before you give anything. | needs native-speaker review |
| `identity.ticket_name_dob` | Tike, izina n'itariki y'amavuko | Ticket, name and date of birth | needs native-speaker review |
| `identity.ticket_name_dobHint` | Wagenzuye byose uko ari bitatu n'umurwayi. | You checked all three with the patient. | needs native-speaker review |
| `identity.verification_code` | Kode ya resept | Prescription code | needs native-speaker review |
| `identity.verification_codeHint` | Umurwayi yerekana kode kuri telefoni cyangwa ku rupapuro. | The patient shows the code on their phone or paper. | needs native-speaker review |
| `identity.code` | Kode umurwayi yerekanye | Code shown by the patient | needs native-speaker review |
| `identity.codeRequired` | Andika kode umurwayi yerekanye. | Type the code the patient shows. | needs native-speaker review |
| `identity.required` | Banza wemeze umurwayi uwo ari we. | Confirm who the patient is first. | needs native-speaker review |
| `item.toGive` | gutangwa | to give | needs native-speaker review |
| `item.leftOf` | bisigaye · {{given}} kuri {{total}} byatanzwe | left · {{given}} of {{total}} given | needs native-speaker review |
| `item.quantity_one` | {{count}} | {{count}} unit | needs native-speaker review |
| `item.quantity_other` | {{count}} | {{count}} units | needs native-speaker review |
| `item.partly` | {{given}} kuri {{total}} byatanzwe | {{given}} of {{total}} given | needs native-speaker review |
| `outcome.full_one` | Tanga {{count}} | Give {{count}} | needs native-speaker review |
| `outcome.full_other` | Tanga byose ({{count}}) | Give all {{count}} | needs native-speaker review |
| `outcome.partial_one` | Tanga igice | Give part | needs native-speaker review |
| `outcome.partial_other` | Tanga igice | Give part | needs native-speaker review |
| `outcome.substituted_one` | Simbuza | Substitute | needs native-speaker review |
| `outcome.substituted_other` | Simbuza | Substitute | needs native-speaker review |
| `outcome.not_available_one` | Ntibihari | Not available | needs native-speaker review |
| `outcome.not_available_other` | Ntibihari | Not available | needs native-speaker review |
| `outcome.skip_one` | Si ubu | Not now | needs native-speaker review |
| `outcome.skip_other` | Si ubu | Not now | needs native-speaker review |
| `given.full_one` | {{count}} byatanzwe | {{count}} given | needs native-speaker review |
| `given.full_other` | {{count}} byatanzwe | {{count}} given | needs native-speaker review |
| `given.partial_one` | {{count}} byatanzwe (igice) | {{count}} given (part) | needs native-speaker review |
| `given.partial_other` | {{count}} byatanzwe (igice) | {{count}} given (part) | needs native-speaker review |
| `given.substituted_one` | {{count}} byatanzwe | {{count}} given | needs native-speaker review |
| `given.substituted_other` | {{count}} byatanzwe | {{count}} given | needs native-speaker review |
| `given.not_available_one` | ntibihari, gura hanze | not available, buy outside | needs native-speaker review |
| `given.not_available_other` | ntibihari, gura hanze | not available, buy outside | needs native-speaker review |
| `given.insteadOf` | mu mwanya wa {{name}}: {{reason}} | instead of {{name}}: {{reason}} | needs native-speaker review |
| `dispense.title` | Gutanga imiti | Give medicines | needs native-speaker review |
| `dispense.outcomeFor` | Ibyo utanga kuri {{name}} | What you give of {{name}} | needs native-speaker review |
| `dispense.quantity` | Umubare utanga ubu | How many you give now | needs native-speaker review |
| `dispense.partialRange` | Tanga hagati ya 1 na {{max}}. | Give between 1 and {{max}}. | needs native-speaker review |
| `dispense.substitute` | Umuti usimbura | Substitute | needs native-speaker review |
| `dispense.substituteHint` | Umuti n'urugero bimwe gusa. | Same ingredient and strength only. | needs native-speaker review |
| `dispense.chooseSubstitute` | Hitamo umuti usimbura | Choose a substitute | needs native-speaker review |
| `dispense.noSubstitute` | Nta muti ufite umuti n'urugero bimwe mu rutonde. | No product with the same ingredient and strength in the catalogue. | needs native-speaker review |
| `dispense.substituteReason` | Impamvu usimbuza | Why you substitute | needs native-speaker review |
| `dispense.controlled` | Nagenzuye amategeko y'imiti igenzurwa | I checked the rules for controlled medicines | needs native-speaker review |
| `dispense.controlledHint` | Umwirondoro, umubare n'iyandikwa mu gitabo. | Identity, quantity and the register entry. | needs native-speaker review |
| `dispense.controlledRequired` | Emeza igenzura ry'umuti ugenzurwa. | Confirm the controlled medicine check. | needs native-speaker review |
| `dispense.controlledChecked` | umuti ugenzurwa wagenzuwe | controlled medicine checked | needs native-speaker review |
| `dispense.chooseOne` | Hitamo ibyo utanga nibura ku muti umwe. | Choose what you give for at least one medicine. | needs native-speaker review |
| `dispense.sign` | Sinya utange | Sign and give | needs native-speaker review |
| `dispense.signed` | Byasinywe | Signed | needs native-speaker review |
| `dispense.signedBody` | Umurwayi abibona mu Miti yanjye. Ubu capa ibirango. | The patient sees this in My medicines. Print the labels next. | needs native-speaker review |
| `dispense.reloaded` | Undi muntu yahinduye iyi resept hagati aho. Yongeye gufungurwa: yigenzure wongere usinye. | Someone changed this prescription meanwhile. It was reloaded: check it and sign again. | needs native-speaker review |
| `dispense.nothingOpen` | Nta kintu gisigaye gutangwa kuri iyi resept. | Nothing left to give on this prescription. | needs native-speaker review |
| `dispense.history` | Ibyatanzwe kugeza ubu | Given so far | needs native-speaker review |
| `dispense.signedBy` | {{name}} · {{time}} | {{name}} · {{time}} | needs native-speaker review |
| `dispense.substituteRange` | Tanga {{max}} cyangwa munsi. | Give {{max}} or fewer. | needs native-speaker review |
| `dispense.substituteQuantity` | Ingano | How many | needs native-speaker review |
| `dispense.substituteQuantityHint` | Ntiwandike niba utanga {{count}} zose zisigaye. | Leave empty to give all {{count}} left. | needs native-speaker review |
| `query.title` | Ikibazo kuri muganga | Question to the doctor | needs native-speaker review |
| `query.openTitle` | Ikibazo gifunguye | Open question | needs native-speaker review |
| `query.openBody` | {{name}} yabajije: | {{name}} asked: | needs native-speaker review |
| `query.message` | Ikibazo cyawe | Your question | needs native-speaker review |
| `query.hint` | Muganga asubiza akoresheje inyongera. Ntuzigere uhindura umuti ubwawe. | The doctor answers with an addendum. Never change a medicine yourself. | needs native-speaker review |
| `query.required` | Andika ikibazo. | Write the question. | needs native-speaker review |
| `query.send` | Ohereza kuri muganga | Send to the doctor | needs native-speaker review |
| `query.waiting` | Dutegereje igisubizo cya muganga. | Waiting for the doctor's answer. | needs native-speaker review |
| `query.answered` | Muganga yasubije akoresheje inyongera. | The doctor answered with an addendum. | needs native-speaker review |
| `query.close` | Funga ikibazo | Close the question | needs native-speaker review |
| `query.fromPharmacy` | Ikibazo cya {{name}} (farumasi), {{time}} | Question from {{name}} (pharmacy), {{time}} | needs native-speaker review |
| `query.answeredWait` | Byasubijwe. Umufarumasiye azafunga ikibazo. | Answered. The pharmacist will close the question. | needs native-speaker review |
| `query.answerWith` | Subiza ukoresheje | Answer with | needs native-speaker review |
| `query.newAddendum` | Inyongera nshya | A new addendum | needs native-speaker review |
| `query.existing` | Inyongera: {{reason}} ({{time}}) | Addendum: {{reason}} ({{time}}) | needs native-speaker review |
| `query.reason` | Impamvu y'inyongera | Addendum reason | needs native-speaker review |
| `query.reasonRequired` | Andika impamvu. | Give the reason. | needs native-speaker review |
| `query.body` | Igisubizo cyawe | Your answer | needs native-speaker review |
| `query.bodyHint` | Kibikwa nk'inyongera yasinywe kuri iri suzuma. | Saved as a signed addendum on this consultation. | needs native-speaker review |
| `query.bodyRequired` | Andika igisubizo. | Write the answer. | needs native-speaker review |
| `query.answer` | Ohereza igisubizo | Send the answer | needs native-speaker review |
| `availability.title` | Imiti iboneka | Medicine availability | needs native-speaker review |
| `availability.search` | Shaka umuti | Find a medicine | needs native-speaker review |
| `availability.summary_one` | Umuti {{count}} washize | {{count}} medicine out of stock | needs native-speaker review |
| `availability.summary_other` | Imiti {{count}} yashize | {{count}} medicines out of stock | needs native-speaker review |
| `availability.in` | Urahari | In stock | needs native-speaker review |
| `availability.out` | Washize | Out of stock | needs native-speaker review |
| `availability.since` | Washize kuva {{date}} | Out since {{date}} | needs native-speaker review |
| `availability.none` | Nta muti uhuye. | No medicine matches. | needs native-speaker review |
| `availability.followsStock` | Bikurikira ibarura ry'ububiko. Byakire cyangwa ubihindure ku rupapuro rw'Ububiko. | Follows its stock count. Receive or adjust it on the Stock page. | needs native-speaker review |
| `labels.title` | Ibirango by'imiti | Dosing labels | needs native-speaker review |
| `labels.print` | Capa ibirango | Print labels | needs native-speaker review |
| `labels.language` | Ururimi rw'ibirango | Label language | needs native-speaker review |
| `labels.languages.rw` | Ikinyarwanda | Kinyarwanda | needs native-speaker review |
| `labels.languages.en` | Icyongereza | English | needs native-speaker review |
| `labels.languages.fr` | Igifaransa | Français | needs native-speaker review |
| `labels.none` | Nta birango biraboneka: nta kintu cyatanzwe. | No labels yet: nothing has been given. | needs native-speaker review |
| `labels.schedule` | Igihe cyo kuwunywa | When to take it | needs native-speaker review |
| `labels.times.morning` | Mu gitondo | Morning | needs native-speaker review |
| `labels.times.noon` | Saa sita | Noon | needs native-speaker review |
| `labels.times.evening` | Ku mugoroba | Evening | needs native-speaker review |
| `labels.times.night` | Nijoro | Night | needs native-speaker review |
| `labels.whenNeeded` | Igihe ubikeneye | When needed | needs native-speaker review |
| `labels.once` | Rimwe gusa | Once only | needs native-speaker review |
| `alert.allergy` | Aleriji: {{substance}} | Allergy: {{substance}} | needs native-speaker review |
| `alert.dose` | Birenze umubare usanzwe ({{max}}) | More than the usual quantity ({{max}}) | needs native-speaker review |
| `alert.duplicate` | Umuti umwe kabiri | Same medicine twice | needs native-speaker review |
| `alert.overridden` | impamvu yatanzwe: {{reason}} | reason given: {{reason}} | needs native-speaker review |
| `alert.reason` | Impamvu uwandika uko byagenda kose | Why you prescribe it anyway | needs native-speaker review |
| `alert.saveReason` | Bika impamvu | Save reason | needs native-speaker review |
| `prescription.title` | Resept | Prescription | needs native-speaker review |
| `prescription.empty` | Nta muti urajyamo. | No medicine yet. | needs native-speaker review |
| `prescription.none` | Nta muti wanditswe. | No medicine prescribed. | needs native-speaker review |
| `prescription.add` | Ongeramo umuti | Add a medicine | needs native-speaker review |
| `prescription.save` | Shyira kuri resept | Add to prescription | needs native-speaker review |
| `prescription.replace` | Mu mwanya wa {{name}} | Instead of {{name}} | needs native-speaker review |
| `prescription.drug` | Umuti | Medicine | needs native-speaker review |
| `prescription.drugHint` | Andika inyuguti 2 cyangwa zirenga z'izina. | Type 2 letters or more of the name. | needs native-speaker review |
| `prescription.drugRequired` | Hitamo umuti. | Choose a medicine. | needs native-speaker review |
| `prescription.changeDrug` | Hindura | Change | needs native-speaker review |
| `prescription.useTyped` | Koresha "{{name}}" (ntuba mu rutonde) | Use "{{name}}" (not in the catalogue) | needs native-speaker review |
| `prescription.offCatalogue` | "{{name}}" ntuba mu rutonde. Umufarumasiye azawubona uko wanditswe. | "{{name}}" is not in the catalogue. The pharmacist will see it as typed. | needs native-speaker review |
| `prescription.dose` | Urugero | Dose | needs native-speaker review |
| `prescription.doseHint` | Urugero: ikinini 1, ml 5 | For example 1 tablet, 5 ml | needs native-speaker review |
| `prescription.doseRequired` | Tanga urugero. | Give the dose. | needs native-speaker review |
| `prescription.frequency` | Inshuro | How often | needs native-speaker review |
| `prescription.route` | Uburyo | Route | needs native-speaker review |
| `prescription.days` | Iminsi | Days | needs native-speaker review |
| `prescription.quantity` | Umubare wo gutanga | Quantity to give | needs native-speaker review |
| `prescription.quantityHint_one` | {{count}} hakurikijwe urugero, inshuro n'iminsi | {{count}} from dose, how often and days | needs native-speaker review |
| `prescription.quantityHint_other` | {{count}} hakurikijwe urugero, inshuro n'iminsi | {{count}} from dose, how often and days | needs native-speaker review |
| `prescription.quantityRequired` | Tanga umubare wo gutanga. | Give the quantity to give. | needs native-speaker review |
| `prescription.instructions` | Amabwiriza ku murwayi | Instructions for the patient | needs native-speaker review |
| `prescription.substitution` | Umufarumasiye ashobora gusimbuza | The pharmacist may substitute | needs native-speaker review |
| `prescription.substitutionHint` | Gusa n'umuti n'urugero bimwe. | Only with the same ingredient and strength. | needs native-speaker review |
| `prescription.remove` | Kuramo {{name}} | Remove {{name}} | needs native-speaker review |
| `prescription.cancel` | Hagarika | Cancel | needs native-speaker review |
| `prescription.change` | Hindura | Change | needs native-speaker review |
| `prescription.cancelTitle` | Hagarika {{name}}? | Cancel {{name}}? | needs native-speaker review |
| `prescription.cancelConsequences` | Farumasi ntizawutanga. Umurwayi azabona ko wahagaritswe. | The pharmacy will not give it. The patient sees it as cancelled. | needs native-speaker review |
| `prescription.changeTitle` | Hindura {{name}}? | Change {{name}}? | needs native-speaker review |
| `prescription.changeConsequences` | Uyu urahagarikwa n'impamvu yawe, hanyuma wongeremo mushya. | This one is cancelled with your reason, then you add the new one. | needs native-speaker review |
| `prescription.meal` | Bijyanye no kurya? | With food? | needs native-speaker review |
| `prescription.mealHint` | Bigaragara nk’ishusho ku kirango. | Shown as a picture on the label. | needs native-speaker review |
| `pages` | Amapaji | Pages | needs native-speaker review |
| `previous` | Ibibanza | Previous | needs native-speaker review |
| `next` | Ibikurikira | Next | needs native-speaker review |
| `today.title` | Farumasi | Pharmacy counter | needs native-speaker review |
| `today.openQueue` | Fungura umurongo wa farumasi | Open the pharmacy queue | needs native-speaker review |
| `today.numbers` | Uyu munsi kuri farumasi | Today at the pharmacy | needs native-speaker review |
| `today.ready` | Biteguye gutangwa | Ready to give | needs native-speaker review |
| `today.partly` | Byatanzwe igice | Partly given | needs native-speaker review |
| `today.questions_one` | Ibibazo ku baganga ({{count}} byasubijwe) | Questions to doctors ({{count}} answered) | needs native-speaker review |
| `today.questions_other` | Ibibazo ku baganga ({{count}} byasubijwe) | Questions to doctors ({{count}} answered) | needs native-speaker review |
| `today.dispensed_one` | Byatanzwe uyu munsi ({{count}} nanjye) | Dispensed today ({{count}} by me) | needs native-speaker review |
| `today.dispensed_other` | Byatanzwe uyu munsi ({{count}} nanjye) | Dispensed today ({{count}} by me) | needs native-speaker review |
| `today.outOfStock` | Imiti itabonetse | Medicines out of stock | needs native-speaker review |
| `today.next` | Ibikurikira gutangwa | Next to give | needs native-speaker review |
| `today.nothing` | Nta rupapuro rw'imiti rutegereje. Inshya ziza hano abaganga bamaze gusinya. | No prescription waits. New ones appear here as doctors sign. | needs native-speaker review |
| `today.items_one` | Umuti {{count}} | {{count}} medicine | needs native-speaker review |
| `today.items_other` | Imiti {{count}} | {{count}} medicines | needs native-speaker review |
| `today.lowStock_one` | Ububiko buke (icyiciro {{count}} kirarangira vuba) | Low on stock ({{count}} batch expiring soon) | needs native-speaker review |
| `today.lowStock_other` | Ububiko buke (ibyiciro {{count}} birarangira vuba) | Low on stock ({{count}} batches expiring soon) | needs native-speaker review |
| `history.title` | Amateka yo gutanga imiti | Dispensing history | needs native-speaker review |
| `history.period` | Igihe | Period | needs native-speaker review |
| `history.days.1` | Uyu munsi | Today | needs native-speaker review |
| `history.days.7` | Iminsi 7 | 7 days | needs native-speaker review |
| `history.days.30` | Iminsi 30 | 30 days | needs native-speaker review |
| `history.mine` | Ibyanjye gusa | Only mine | needs native-speaker review |
| `history.search` | Nimero y'urupapuro cyangwa izina | Prescription number or name | needs native-speaker review |
| `history.empty` | Nta muti watanzwe muri iki gihe | Nothing dispensed in this period | needs native-speaker review |
| `history.emptyBody` | Ibyatanzwe biza hano bimaze gusinywa. | Dispensings appear here once signed. | needs native-speaker review |
| `history.columns.when` | Igihe | When | needs native-speaker review |
| `history.columns.patient` | Umurwayi | Patient | needs native-speaker review |
| `history.columns.medicines` | Imiti | Medicines | needs native-speaker review |
| `history.columns.by` | Uwatanze | Given by | needs native-speaker review |
| `history.controlled` | Umuti ugenzurwa wemejwe | Controlled medicine confirmed | needs native-speaker review |
| `history.outcome.full` | Yatanzwe yose | Given in full | needs native-speaker review |
| `history.outcome.partial` | Yatanzwe igice | Given in part | needs native-speaker review |
| `history.outcome.substituted` | Yasimbujwe | Substituted | needs native-speaker review |
| `history.outcome.not_available` | Ntabonetse | Not available | needs native-speaker review |
| `verify.title` | Genzura urupapuro rw'imiti | Verify a prescription | needs native-speaker review |
| `verify.code` | Kode yo kugenzura | Verification code | needs native-speaker review |
| `verify.codeHint` | Yanditse munsi ya QR ku rupapuro | Printed under the QR code on the prescription | needs native-speaker review |
| `verify.check` | Genzura | Check | needs native-speaker review |
| `verify.notFound` | Nta nyandiko ifite iyi kode. Yigenzure n'umurwayi. | No document with this code. Check it with the patient. | needs native-speaker review |
| `verify.status.active` | Rwemewe | Valid | needs native-speaker review |
| `verify.status.dispensed` | Rwamaze gutangirwa imiti | Already dispensed | needs native-speaker review |
| `verify.status.cancelled` | Rwahagaritswe | Cancelled | needs native-speaker review |
| `verify.status.expired` | Rwarangiye | Expired | needs native-speaker review |
| `verify.notPrescription` | Si urupapuro rw'imiti | Not a prescription | needs native-speaker review |
| `verify.facility` | Rwatanzwe na | Issued by | needs native-speaker review |
| `verify.author` | Muganga warwanditse | Prescriber | needs native-speaker review |
| `verify.issued` | Rwatanzwe ku wa | Issued on | needs native-speaker review |
| `verify.validUntil` | Rugifite agaciro kugeza | Valid until | needs native-speaker review |
| `verify.born` | Itariki y'amavuko y'umurwayi | Patient's date of birth | needs native-speaker review |
| `verify.bornHint` | Ifungura imiti; irinda ubuzima bwite bw'umurwayi. | Opens the medicines; protects the patient's privacy. | needs native-speaker review |
| `verify.open` | Erekana imiti | Show medicines | needs native-speaker review |
| `verify.bornWrong` | Itariki y'amavuko ntihuye. | The date of birth does not match. | needs native-speaker review |
| `failed` | Ntibyashobotse. Ongera ugerageze. | Could not load. Try again. | needs native-speaker review |
| `favourites.title` | Imiti ukunze kwandika | Your frequent medicines | needs native-speaker review |
| `favourites.days_one` | Umunsi {{count}} | {{count}} day | needs native-speaker review |
| `favourites.days_other` | Iminsi {{count}} | {{count}} days | needs native-speaker review |
| `stock.title` | Ububiko | Stock | needs native-speaker review |
| `stock.tabs` | Uko ububiko bugaragara | Stock views | needs native-speaker review |
| `stock.tab.all` | Imiti yose | All medicines | needs native-speaker review |
| `stock.tab.short` | Mike cyangwa yashize | Low or out | needs native-speaker review |
| `stock.tab.expiring` | Izarangira vuba | Expiring soon | needs native-speaker review |
| `stock.tab.movements` | Ibyahindutse | Movements | needs native-speaker review |
| `stock.search` | Shaka umuti | Find a medicine | needs native-speaker review |
| `stock.none` | Nta muti urafite ububiko. | No medicine has stock yet. | needs native-speaker review |
| `stock.noneBody` | Akira icyiciro kugira ngo utangire kubara umuti. Indi miti igumana buto yo ku Kuboneka kw'imiti. | Receive a batch to start counting a medicine. Others keep the switch on Medicine availability. | needs native-speaker review |
| `stock.noneShort` | Nta muti muke cyangwa washize. | Nothing is low or out of stock. | needs native-speaker review |
| `stock.nextExpiry` | Irarangira {{date}} | Next expiry {{date}} | needs native-speaker review |
| `stock.noUsable` | Nta cyiciro gikoreshwa | No usable batch | needs native-speaker review |
| `stock.expiredUnits_one` | {{count}} yarangije igihe yo kuvanamo | {{count}} expired unit to remove | needs native-speaker review |
| `stock.expiredUnits_other` | {{count}} zarangije igihe zo kuvanamo | {{count}} expired units to remove | needs native-speaker review |
| `stock.units_one` | {{count}} | {{count}} unit | needs native-speaker review |
| `stock.units_other` | {{count}} | {{count}} units | needs native-speaker review |
| `stock.level.in_stock` | Irahari | In stock | needs native-speaker review |
| `stock.level.low` | Ububiko buke | Low stock | needs native-speaker review |
| `stock.level.out` | Yashize | Out of stock | needs native-speaker review |
| `stock.expired` | Yarangije igihe | Expired | needs native-speaker review |
| `stock.expiringNone` | Nta cyiciro kirangira mu minsi 60 iri imbere. | No batch expires in the next 60 days. | needs native-speaker review |
| `stock.expiringIntro` | Ibyiciro bifite imiti isigaye birangira mu minsi 60, ibyarangiye mbere. Bitange mbere, cyangwa ukure ibyarangiye ku gipangu. | Batches with units left that expire within 60 days, expired ones first. Give these first, or take expired ones off the shelf. | needs native-speaker review |
| `stock.columns.medicine` | Umuti | Medicine | needs native-speaker review |
| `stock.columns.batch` | Icyiciro | Batch | needs native-speaker review |
| `stock.columns.expiry` | Irangira | Expiry | needs native-speaker review |
| `stock.columns.units` | Umubare | Units | needs native-speaker review |
| `stock.columns.when` | Igihe | When | needs native-speaker review |
| `stock.columns.change` | Impinduka | Change | needs native-speaker review |
| `stock.columns.by` | Uwabikoze | By | needs native-speaker review |
| `stock.movements` | Ibyahindutse | Movements | needs native-speaker review |
| `stock.movementsNone` | Nta cyahindutse kugeza ubu. | No movement yet. | needs native-speaker review |
| `stock.kind.received` | Byakiriwe | Received | needs native-speaker review |
| `stock.kind.dispensed` | Byatanzwe | Given | needs native-speaker review |
| `stock.kind.adjusted` | Byahinduwe | Adjusted | needs native-speaker review |
| `stock.reason.count_correction` | Gukosora ibarura | Count correction | needs native-speaker review |
| `stock.reason.damaged` | Byangiritse | Damaged | needs native-speaker review |
| `stock.reason.expired` | Byarangije igihe | Expired | needs native-speaker review |
| `stock.prescription` | Resept | Prescription | needs native-speaker review |
| `stock.balanceAfter_one` | {{count}} isigaye mu cyiciro | {{count}} left in the batch | needs native-speaker review |
| `stock.balanceAfter_other` | {{count}} zisigaye mu cyiciro | {{count}} left in the batch | needs native-speaker review |
| `stock.receive.open` | Akira ububiko | Receive stock | needs native-speaker review |
| `stock.receive.title` | Akira ububiko | Receive stock | needs native-speaker review |
| `stock.receive.description` | Icyiciro kimwe icyarimwe, nk'uko cyanditse ku gakarito. | One batch at a time, as printed on the box. | needs native-speaker review |
| `stock.receive.save` | Ongera mu bubiko | Add to stock | needs native-speaker review |
| `stock.receive.drugRequired` | Hitamo umuti. | Choose a medicine. | needs native-speaker review |
| `stock.receive.batchRequired` | Tanga nimero y'icyiciro. | Give the batch number. | needs native-speaker review |
| `stock.receive.expiryRequired` | Tanga itariki birangiriraho. | Give the expiry date. | needs native-speaker review |
| `stock.receive.expiryPast` | Iki cyiciro cyarangije igihe. Ntugishyire ku gipangu. | This batch has already expired. Don't put it on the shelf. | needs native-speaker review |
| `stock.receive.quantityRequired` | Tanga umubare, 1 cyangwa urenga. | Give the number of units, 1 or more. | needs native-speaker review |
| `stock.receive.batch` | Nimero y'icyiciro | Batch number | needs native-speaker review |
| `stock.receive.expiry` | Itariki birangiriraho | Expiry date | needs native-speaker review |
| `stock.receive.quantity` | Umubare wakiriwe | Units received | needs native-speaker review |
| `stock.receive.quantityHint` | Ibinini, kapsule, amacupa: icyo utanga. | Tablets, capsules, bottles: the unit you give. | needs native-speaker review |
| `stock.receive.supplier` | Uwatanze | Supplier | needs native-speaker review |
| `stock.threshold` | Urugero rw'ububiko buke | Low-stock threshold | needs native-speaker review |
| `stock.thresholdHint` | "Ububiko buke" munsi y'uyu mubare. 0 birabihagarika. | "Low stock" below this number. 0 turns it off. | needs native-speaker review |
| `stock.thresholdInvalid` | Tanga umubare wuzuye, 0 cyangwa urenga. | Give a whole number, 0 or more. | needs native-speaker review |
| `stock.saveThreshold` | Bika | Save | needs native-speaker review |
| `stock.back` | Ububiko bwose | All stock | needs native-speaker review |
| `stock.batches` | Ibyiciro biri ku gipangu | Batches on the shelf | needs native-speaker review |
| `stock.noBatches` | Nta muti usigaye. Akira icyiciro kugira ngo wongere. | No units left. Receive a batch to restock. | needs native-speaker review |
| `stock.noSupplier` | Uwatanze ntiyavuzwe | No supplier given | needs native-speaker review |
| `stock.summary` | Incamake y'ububiko | Stock summary | needs native-speaker review |
| `stock.onHand` | Ishobora gukoreshwa | Usable units | needs native-speaker review |
| `stock.expiredToRemove_one` | {{count}} yarangije igihe iracyari ku gipangu. Hindura icyiciro cyayo ukoresheje impamvu Byarangije igihe. | {{count}} expired unit is still on the shelf. Adjust its batch with the reason Expired. | needs native-speaker review |
| `stock.expiredToRemove_other` | {{count}} zarangije igihe ziracyari ku gipangu. Hindura icyiciro cyazo ukoresheje impamvu Byarangije igihe. | {{count}} expired units are still on the shelf. Adjust their batch with the reason Expired. | needs native-speaker review |
| `stock.adjust.open` | Hindura | Adjust | needs native-speaker review |
| `stock.adjust.title` | Hindura icyiciro {{batch}} | Adjust batch {{batch}} | needs native-speaker review |
| `stock.adjust.description_one` | {{count}} iri muri iki cyiciro ubu. Buri mpinduka yandikwa n'izina ryawe. | {{count}} unit in this batch now. Every change is recorded with your name. | needs native-speaker review |
| `stock.adjust.description_other` | {{count}} ziri muri iki cyiciro ubu. Buri mpinduka yandikwa n'izina ryawe. | {{count}} units in this batch now. Every change is recorded with your name. | needs native-speaker review |
| `stock.adjust.save` | Bika impinduka | Save the change | needs native-speaker review |
| `stock.adjust.reason` | Impamvu | Reason | needs native-speaker review |
| `stock.adjust.counted` | Umubare wabaze | Units you counted | needs native-speaker review |
| `stock.adjust.countedHint` | Bara icyiciro kiri ku gipangu wandike umubare. | Count the batch on the shelf and type the number. | needs native-speaker review |
| `stock.adjust.countedRequired` | Andika umubare wabaze, 0 cyangwa urenga. | Type the number you counted, 0 or more. | needs native-speaker review |
| `stock.adjust.noChange` | Ni wo mubare usanzwe wanditse. | That is the number already recorded. | needs native-speaker review |
| `stock.adjust.difference` | Impinduka: {{change}} | Change: {{change}} | needs native-speaker review |
| `stock.adjust.removed` | Umubare wo kuvanamo | Units to take off | needs native-speaker review |
| `stock.adjust.removeRange` | Vanamo hagati ya 1 na {{max}}. | Take off between 1 and {{max}}. | needs native-speaker review |
| `stock.adjust.note` | Icyitonderwa | Note | needs native-speaker review |
| `meal.any` | Igihe icyo ari cyo cyose | Any time | needs native-speaker review |
| `meal.before_food` | Mbere yo kurya | Before food | needs native-speaker review |
| `meal.with_food` | Mu gihe urya | With food | needs native-speaker review |
| `meal.after_food` | Nyuma yo kurya | After food | needs native-speaker review |

## staff-web feature: platform (namespace platform)

File: `apps/staff-web/src/features/platform/locales/rw.json`

| Key | Kinyarwanda (draft) | English source | Status |
|---|---|---|---|
| `notFound` | Paji ntiyabonetse | Page not found | needs native-speaker review |
| `nav.platformOverview` | Incamake ya sisitemu | Platform overview | needs native-speaker review |
| `nav.platformApplications` | Ubusabe bw'ibigo | Facility applications | needs native-speaker review |
| `nav.platformMasterData` | Amakuru shingiro | Master data | needs native-speaker review |
| `nav.platformFeatureFlags` | Imikorere | Feature flags | needs native-speaker review |
| `table.search` | Shakisha | Search | needs native-speaker review |
| `table.clearAll` | Siba byose | Clear all | needs native-speaker review |
| `table.removeFilter` | Kuraho akayunguruzo | Remove filter | needs native-speaker review |
| `table.results_one` | Igisubizo {{count}} | {{count}} result | needs native-speaker review |
| `table.results_other` | Ibisubizo {{count}} | {{count}} results | needs native-speaker review |
| `table.rowsPerPage` | Imirongo kuri paji | Rows per page | needs native-speaker review |
| `table.previous` | Ibibanza | Previous | needs native-speaker review |
| `table.next` | Ibikurikira | Next | needs native-speaker review |
| `table.page` | Paji {{page}} kuri {{pages}} | Page {{page}} of {{pages}} | needs native-speaker review |
| `table.density` | Uburebure bw'imirongo | Row height | needs native-speaker review |
| `table.compact` | Ngufi | Compact | needs native-speaker review |
| `table.default` | Isanzwe | Default | needs native-speaker review |
| `table.comfortable` | Ndende | Comfortable | needs native-speaker review |
| `table.open` | Fungura | Open | needs native-speaker review |
| `table.empty` | Nta {{noun}} biraboneka. | No {{noun}} yet. | needs native-speaker review |
| `table.noResults` | Nta kibonetse. Kuraho akayunguruzo cyangwa uhindure ibyo ushakisha. | Nothing matches these filters. Remove a filter or change the search. | needs native-speaker review |
| `table.error` | Ntibyashobotse gufunguka. Reba interineti wongere ugerageze. | We couldn't load this. Check your connection and try again. | needs native-speaker review |
| `table.retry` | Ongera ugerageze | Try again | needs native-speaker review |
| `status.application.draft` | Bitarangiye | Draft | needs native-speaker review |
| `status.application.submitted` | Byoherejwe | Submitted | needs native-speaker review |
| `status.application.under_review` | Birimo gusuzumwa | Under review | needs native-speaker review |
| `status.application.changes_requested` | Hasabwe impinduka | Changes requested | needs native-speaker review |
| `status.application.approved` | Byemewe | Approved | needs native-speaker review |
| `status.application.rejected` | Byanzwe | Rejected | needs native-speaker review |
| `status.facility.approved` | Cyemewe | Approved | needs native-speaker review |
| `status.facility.setup` | Gitegurwa | Setup | needs native-speaker review |
| `status.facility.live` | Kirakora | Live | needs native-speaker review |
| `status.facility.suspended` | Cyahagaritswe | Suspended | needs native-speaker review |
| `status.facility.deactivated` | Cyafunzwe | Deactivated | needs native-speaker review |
| `status.licence.valid` | Rurakora | Valid | needs native-speaker review |
| `status.licence.expiring` | Rugiye kurangira | Expiring | needs native-speaker review |
| `status.licence.expired` | Rwarangiye | Expired | needs native-speaker review |
| `status.licence.missing` | Ntiruhari | Missing | needs native-speaker review |
| `ownership.public` | Icya Leta | Public | needs native-speaker review |
| `ownership.private` | Icyigenga | Private | needs native-speaker review |
| `ownership.faith_based` | Icy'idini | Faith-based | needs native-speaker review |
| `ownership.ngo` | Umuryango utegamiye kuri Leta | NGO | needs native-speaker review |
| `documentKind.moh_licence` | Uruhushya rwa MINISANTE | MoH operating licence | needs native-speaker review |
| `documentKind.rdb_registration` | Icyemezo cya RDB | RDB registration | needs native-speaker review |
| `documentKind.tin_certificate` | Icyemezo cya TIN | TIN certificate | needs native-speaker review |
| `documentKind.accreditation` | Icyemezo cy'ubuziranenge | Accreditation | needs native-speaker review |
| `documentKind.insurer_contract` | Amasezerano n'ubwishingizi | Insurer contract | needs native-speaker review |
| `documentKind.other` | Indi nyandiko | Other document | needs native-speaker review |
| `documentKind.facility_photo` | Ifoto y’ikigo | Facility photo | needs native-speaker review |
| `overview.title` | Incamake ya sisitemu | Platform overview | needs native-speaker review |
| `overview.oldestTitle` | Ubutegereje igihe kirekire | Waiting longest | needs native-speaker review |
| `overview.oldest` | Hari ubusabe butegereje kuva ku wa {{date}}. Bufungure. | An application has been waiting since {{date}}. Open it. | needs native-speaker review |
| `overview.applications` | Ubusabe | Applications | needs native-speaker review |
| `overview.licences` | Impushya | Licences | needs native-speaker review |
| `overview.expiring60` | Zirangira mu minsi 60 | Expiring within 60 days | needs native-speaker review |
| `overview.expiring30` | Zirangira mu minsi 30 | Expiring within 30 days | needs native-speaker review |
| `overview.expired` | Zarangiye | Expired | needs native-speaker review |
| `overview.facilities` | Ibigo | Facilities | needs native-speaker review |
| `overview.network` | Ibigo by’ubuvuzi ku karere | Facilities by district | needs native-speaker review |
| `overview.networkEmpty` | Nta kigo kirabaho. Uturere tuzagaragara hano uko ubusabe bwemezwa. | No facilities yet. Districts appear here as applications are approved. | needs native-speaker review |
| `overview.facilityCount_one` | Ikigo {{count}} | {{count}} facility | needs native-speaker review |
| `overview.facilityCount_other` | Ibigo {{count}} | {{count}} facilities | needs native-speaker review |
| `applications.title` | Ubusabe bw'ibigo | Facility applications | needs native-speaker review |
| `applications.noun` | busabe | applications | needs native-speaker review |
| `applications.all` | Byose | All | needs native-speaker review |
| `applications.facility` | Ikigo | Facility | needs native-speaker review |
| `applications.status` | Aho bigeze | Status | needs native-speaker review |
| `applications.applicant` | Usaba | Applicant | needs native-speaker review |
| `applications.applicantEmail` | Imeyili y'usaba | Applicant's email | needs native-speaker review |
| `applications.submitted` | Byoherejwe | Submitted | needs native-speaker review |
| `applications.lastActivity` | Igikorwa giheruka | Last activity | needs native-speaker review |
| `applications.reviewer` | Usuzuma | Reviewer | needs native-speaker review |
| `applications.review` | Suzuma | Review | needs native-speaker review |
| `applications.back` | Subira ku busabe | Back to applications | needs native-speaker review |
| `applications.byPlatform` | Byakozwe na sisitemu | Created by the platform | needs native-speaker review |
| `applications.create` | Andikisha ikigo | Register a facility | needs native-speaker review |
| `applications.createHint` | Ku bigo byasabye kuri telefoni cyangwa imbonankubone. Babwuzuza bakoresheje link iboherezwa kuri imeyili. | For facilities that applied by phone or in person. They complete it with the emailed link. | needs native-speaker review |
| `applications.createSubmit` | Kora ubusabe | Create the application | needs native-speaker review |
| `applications.createRequired` | Andika izina ry'ikigo, izina ry'usaba n'imeyili yemewe. | Enter the facility name, the applicant's name and a valid email. | needs native-speaker review |
| `applications.sendLink` | Oherereza usaba link yo kubwuzuza | Email the applicant a link to complete it | needs native-speaker review |
| `applications.adminIs` | Umuyobozi: {{name}} | Admin: {{name}} | needs native-speaker review |
| `applications.progress` | Aho bigeze | Progress | needs native-speaker review |
| `applications.documents_one` | Inyandiko {{count}} | {{count}} document | needs native-speaker review |
| `applications.documents_other` | Inyandiko {{count}} | {{count}} documents | needs native-speaker review |
| `applications.missing_one` | Habura ikintu {{count}} | {{count}} item missing | needs native-speaker review |
| `applications.missing_other` | Habura ibintu {{count}} | {{count}} items missing | needs native-speaker review |
| `review.start` | Tangira gusuzuma | Start review | needs native-speaker review |
| `review.requestChanges` | Saba impinduka | Request changes | needs native-speaker review |
| `review.requestChangesHint` | Andika igitekerezo kimwe kuri buri kintu usaba kigomba gukosora. Akibona ku gice kireba. | Write one comment per item the applicant must fix. They see them on the matching fields. | needs native-speaker review |
| `review.sendRequest` | Ohereza | Send the request | needs native-speaker review |
| `review.approve` | Emeza | Approve | needs native-speaker review |
| `review.reject` | Anga | Reject | needs native-speaker review |
| `review.acceptAllFirst` | Emera buri nyandiko mbere yo kwemeza. | Accept every document before approving. | needs native-speaker review |
| `review.details` | Ibisobanuro | Details | needs native-speaker review |
| `review.type` | Ubwoko | Type | needs native-speaker review |
| `review.ownership` | Nyir'ikigo | Ownership | needs native-speaker review |
| `review.organization` | Ikigo cyemewe n'amategeko | Organisation | needs native-speaker review |
| `review.contacts` | Aho babarizwa | Contacts | needs native-speaker review |
| `review.location` | Aho giherereye | Location | needs native-speaker review |
| `review.proposedAdmin` | Umuyobozi watanzwe | Proposed administrator | needs native-speaker review |
| `review.insurers` | Ubwishingizi bavuze | Insurers claimed | needs native-speaker review |
| `review.documents` | Inyandiko | Documents | needs native-speaker review |
| `review.noDocuments` | Nta nyandiko ziraboneka. | No documents yet. | needs native-speaker review |
| `review.expires` | rurangira ku wa {{date}} | expires {{date}} | needs native-speaker review |
| `review.view` | Reba | View | needs native-speaker review |
| `review.accept` | Emera | Accept | needs native-speaker review |
| `review.needsChange` | Ikeneye gukosorwa | Needs change | needs native-speaker review |
| `review.verdict.pending` | Ntiyasuzumwe | Not reviewed | needs native-speaker review |
| `review.verdict.accepted` | Yemewe | Accepted | needs native-speaker review |
| `review.verdict.needs_change` | Ikeneye gukosorwa | Needs change | needs native-speaker review |
| `review.duplicatesTitle` | Bishobora kuba byisubiramo | Possible duplicates | needs native-speaker review |
| `review.duplicate.same_licence_number` | Hari ubundi busabe cyangwa ikigo gifite nimero y'uruhushya imwe. | Another application or facility has the same licence number. | needs native-speaker review |
| `review.duplicate.same_applicant_email` | Usaba afite ubundi busabe butarangiye. | The applicant has another open application. | needs native-speaker review |
| `review.duplicate.same_name_in_district` | Hari ikigo gifite izina rimwe muri aka karere. | A facility with the same name exists in this district. | needs native-speaker review |
| `review.openOther` | Bufungure | Open it | needs native-speaker review |
| `review.notes` | Inyandiko z'imbere | Internal notes | needs native-speaker review |
| `review.notesHint` | Telefoni, gusura n'igenzura. Ntibigaragarira usaba. | Calls, visits and checks. Never shown to the applicant. | needs native-speaker review |
| `review.noNotes` | Nta nyandiko ziraboneka. | No notes yet. | needs native-speaker review |
| `review.noteType` | Ubwoko | Type | needs native-speaker review |
| `review.note` | Inyandiko | Note | needs native-speaker review |
| `review.addNote` | Ongeraho | Add note | needs native-speaker review |
| `review.noteKind.call` | Telefoni | Call | needs native-speaker review |
| `review.noteKind.visit` | Gusura | Visit | needs native-speaker review |
| `review.noteKind.document_check` | Kugenzura inyandiko | Document check | needs native-speaker review |
| `review.noteKind.other` | Ibindi | Other | needs native-speaker review |
| `review.history` | Amateka | History | needs native-speaker review |
| `review.event.status_change` | Aho bigeze byahindutse | Status changed | needs native-speaker review |
| `review.event.note` | Inyandiko | Note | needs native-speaker review |
| `review.event.item_comments` | Ibitekerezo | Comments | needs native-speaker review |
| `review.event.document_review` | Inyandiko yasuzumwe | Document reviewed | needs native-speaker review |
| `review.event.link_sent` | Link yoherejwe | Resume link sent | needs native-speaker review |
| `review.event.platform_edit` | Byahinduwe na sisitemu | Edited by the platform | needs native-speaker review |
| `review.actor.applicant` | Usaba | Applicant | needs native-speaker review |
| `review.actor.platform_admin` | Umuyobozi mukuru | Super admin | needs native-speaker review |
| `review.actor.system` | Sisitemu | System | needs native-speaker review |
| `review.generalComment` | Igitekerezo rusange | General comment | needs native-speaker review |
| `review.item` | Ikintu {{n}} | Item {{n}} | needs native-speaker review |
| `review.itemTarget` | Igikeneye guhinduka | What needs changing | needs native-speaker review |
| `review.itemComment` | Igitekerezo | Comment | needs native-speaker review |
| `review.addItem` | Ongeraho ikindi | Add another item | needs native-speaker review |
| `review.itemRequired` | Ongeraho nibura igitekerezo kimwe. | Add at least one comment. | needs native-speaker review |
| `review.target.facility.name` | Izina ry'ikigo | Facility name | needs native-speaker review |
| `review.target.facility.facility_type` | Ubwoko bw'ikigo | Type of facility | needs native-speaker review |
| `review.target.facility.ownership` | Nyir'ikigo | Ownership | needs native-speaker review |
| `review.target.facility.phone` | Telefoni y'ikigo | Facility phone | needs native-speaker review |
| `review.target.facility.email` | Imeyili y'ikigo | Facility email | needs native-speaker review |
| `review.target.location.village_code` | Umudugudu | Village | needs native-speaker review |
| `review.target.location.address` | Aderesi | Address | needs native-speaker review |
| `review.target.proposed_admin.name` | Amazina y'umuyobozi | Administrator's name | needs native-speaker review |
| `review.target.proposed_admin.email` | Imeyili y'umuyobozi | Administrator's email | needs native-speaker review |
| `review.target.documents.moh_licence` | Uruhushya rwa MINISANTE | MoH operating licence | needs native-speaker review |
| `review.target.documents.rdb_registration` | Icyemezo cya RDB | RDB registration | needs native-speaker review |
| `review.target.documents.tin_certificate` | Icyemezo cya TIN | TIN certificate | needs native-speaker review |
| `review.approveTitle` | Emeza iki kigo | Approve this facility | needs native-speaker review |
| `review.approveConsequences` | Ibi birema ikigo (kiri ku rwego Cyemewe) bikandika uruhushya rwacyo. Umuyobozi w'ikigo azatumirwa kugitegura. | This creates the organisation and the facility (status Approved) and records its licence. The facility administrator is invited to set it up. | needs native-speaker review |
| `review.approveRequired` | Andika aderesi, nimero y'uruhushya n'itariki rurangiriraho. | Enter the address, the licence number and its expiry date. | needs native-speaker review |
| `review.slug` | Aderesi kuri interineti | Web address | needs native-speaker review |
| `review.slugHint` | Inyuguti nto, imibare n'utuhuza, urugero clinique-ubuzima. | Lowercase letters, numbers and hyphens, e.g. clinique-ubuzima. | needs native-speaker review |
| `review.licenceNumber` | Nimero y'uruhushya rwa MINISANTE | MoH licence number | needs native-speaker review |
| `review.licenceExpiry` | Itariki uruhushya rurangiriraho | Licence expiry date | needs native-speaker review |
| `review.rejectTitle` | Anga ubu busabe | Reject this application | needs native-speaker review |
| `review.rejectConsequences` | Usaba amenyeshwa impamvu. Ntibisubirwaho; ashobora kongera gusaba. | The applicant is told the reason. This can't be undone; they can apply again. | needs native-speaker review |
| `review.levelOfCare` | Urwego rw’ubuvuzi | Level of care | needs native-speaker review |
| `review.levelFromType` | Bivuye ku bwoko bw’ikigo | From the facility type | needs native-speaker review |
| `review.level.primary` | Ibanze | Primary | needs native-speaker review |
| `review.level.secondary` | Icyiciro cya kabiri | Secondary | needs native-speaker review |
| `review.level.tertiary` | Icyiciro cya gatatu | Tertiary | needs native-speaker review |
| `review.mohCode` | Kode ya MINISANTE (FOSA ID) | MoH facility code (FOSA ID) | needs native-speaker review |
| `review.tin` | TIN | TIN | needs native-speaker review |
| `review.mapPin` | Akamenyetso ku ikarita | Map pin | needs native-speaker review |
| `review.language` | Ururimi | Language | needs native-speaker review |
| `review.agreements` | Amasezerano | Agreements | needs native-speaker review |
| `review.agreed` | Amabwiriza {{terms}} · gutunganya amakuru {{dpa}} | Terms {{terms}} · data processing {{dpa}} | needs native-speaker review |
| `review.ncsa` | Cyanditswe muri NCSA | Registered with the NCSA | needs native-speaker review |
| `review.yes` | Yego | Yes | needs native-speaker review |
| `review.no` | Oya | No | needs native-speaker review |
| `reason.code` | Impamvu | Reason | needs native-speaker review |
| `reason.choose` | Hitamo impamvu… | Choose a reason… | needs native-speaker review |
| `reason.text` | Ibisobanuro | Explanation | needs native-speaker review |
| `reason.required` | Hitamo impamvu. | Choose a reason. | needs native-speaker review |
| `reason.textRequired` | Sobanura impamvu. | Explain the reason. | needs native-speaker review |
| `viewer.zoomIn` | Ongera ubunini | Zoom in | needs native-speaker review |
| `viewer.zoomOut` | Gabanya ubunini | Zoom out | needs native-speaker review |
| `viewer.rotate` | Hindukiza | Rotate | needs native-speaker review |
| `viewer.previousPage` | Paji ibanza | Previous page | needs native-speaker review |
| `viewer.nextPage` | Paji ikurikira | Next page | needs native-speaker review |
| `viewer.page` | Paji {{page}} kuri {{pages}} | Page {{page}} of {{pages}} | needs native-speaker review |
| `viewer.download` | Kuramo | Download | needs native-speaker review |
| `viewer.loading` | Inyandiko irafunguka… | Opening the document… | needs native-speaker review |
| `viewer.error` | Ntibyashobotse gufungura iyi nyandiko. | We couldn't open this document. | needs native-speaker review |
| `facilities.title` | Ibigo | Facilities | needs native-speaker review |
| `facilities.noun` | bigo | facilities | needs native-speaker review |
| `facilities.name` | Izina | Name | needs native-speaker review |
| `facilities.district` | Akarere | District | needs native-speaker review |
| `facilities.licence` | Uruhushya | Licence | needs native-speaker review |
| `facilities.nextExpiry` | Kurangira gukurikira | Next expiry | needs native-speaker review |
| `facilities.back` | Subira ku bigo | Back to facilities | needs native-speaker review |
| `facilities.address` | Aderesi kuri interineti | Web address | needs native-speaker review |
| `facilities.application` | Ubusabe | Application | needs native-speaker review |
| `facilities.confirmSlug` | Andika {{slug}} kugira ngo wemeze | Type {{slug}} to confirm | needs native-speaker review |
| `facilities.tabs.overview` | Incamake | Overview | needs native-speaker review |
| `facilities.tabs.licences` | Impushya | Licences | needs native-speaker review |
| `facilities.tabs.history` | Amateka | History | needs native-speaker review |
| `facilities.tabs.flags` | Imikorere | Feature flags | needs native-speaker review |
| `facilities.actions.start-setup` | Tangira gutegura | Start setup | needs native-speaker review |
| `facilities.actions.go-live` | Tangira gukora | Go live | needs native-speaker review |
| `facilities.actions.suspend` | Hagarika | Suspend | needs native-speaker review |
| `facilities.actions.reactivate` | Ongera ukoreshe | Reactivate | needs native-speaker review |
| `facilities.actions.deactivate` | Funga burundu | Deactivate | needs native-speaker review |
| `facilities.consequences.start-setup` | {{name}} kijya mu gutegurwa kugira ngo umuyobozi wacyo agitegure. | {{name}} moves to setup so its administrator can configure it. | needs native-speaker review |
| `facilities.consequences.go-live` | {{name}} kigaragarira abarwayi kandi cyakira gahunda. Gikeneye uruhushya rwa MINISANTE rukora. | {{name}} becomes visible to patients and accepts bookings. It needs a valid MoH licence. | needs native-speaker review |
| `facilities.consequences.suspend` | {{name}} kiva mu bushakashatsi kandi ntikigakira gahunda nshya. Akazi k'uyu munsi gakomeza. | {{name}} disappears from search and stops taking new bookings. Today's work continues. | needs native-speaker review |
| `facilities.consequences.reactivate` | {{name}} kongera kugaragara kandi cyakira gahunda. | {{name}} is visible again and accepts bookings. | needs native-speaker review |
| `facilities.consequences.deactivate` | {{name}} gisigara gisomwa gusa. Ni burundu. | {{name}} becomes read-only. This is final. | needs native-speaker review |
| `facilities.identifiers` | Ibiranga ikigo bya Leta | Government identifiers | needs native-speaker review |
| `facilities.identifiersHint` | Kode y’ikigo muri Minisiteri y’Ubuzima (FOSA ID) na nimero y’imisoro ya RRA. Bigaragara ku rutonde rw’ibigo rwa Leta. | The Ministry of Health facility code (FOSA ID) and the RRA tax number. They appear in the facility list for the government. | needs native-speaker review |
| `facilities.saveIdentifiers` | Bika | Save | needs native-speaker review |
| `facilities.identifiersSaved` | Byabitswe. | Saved. | needs native-speaker review |
| `facilities.noCode` | Nta FOSA ID irahabwa | No FOSA ID yet | needs native-speaker review |
| `facilities.place` | Aho kiri | Place | needs native-speaker review |
| `facilities.inCharge` | Ushinzwe | In charge | needs native-speaker review |
| `facilities.noAdmin` | Nta muyobozi w’ikigo urashyirwaho | No facility admin yet | needs native-speaker review |
| `facilities.staff` | Abakozi | Staff | needs native-speaker review |
| `facilities.seeStaff` | Reba abakozi mu rutonde rw’abakoresha | See the staff in the user list | needs native-speaker review |
| `facilities.staffCount_one` | Umukozi {{count}} ukora | {{count}} active staff member | needs native-speaker review |
| `facilities.staffCount_other` | Abakozi {{count}} bakora | {{count}} active staff | needs native-speaker review |
| `facilities.doctorsChecked_one` | Uruhushya rwa muganga {{checked}} kuri {{count}} rwagenzuwe | {{checked}} of {{count}} doctor's licence checked | needs native-speaker review |
| `facilities.doctorsChecked_other` | Impushya z’abaganga {{checked}} kuri {{count}} zagenzuwe | {{checked}} of {{count}} doctors' licences checked | needs native-speaker review |
| `facilities.missingCode` | Nta FOSA ID | Without a FOSA ID | needs native-speaker review |
| `facilities.export` | Ohereza CSV | Export CSV | needs native-speaker review |
| `facilities.exportFailed` | Kohereza byanze. Ongera ugerageze. | The export failed. Try again. | needs native-speaker review |
| `facilities.photos` | Amafoto | Photos | needs native-speaker review |
| `facilities.identity` | Ibiranga ikigo | Identity | needs native-speaker review |
| `facilities.contact` | Aho babarizwa n’aho kiri | Contact and place | needs native-speaker review |
| `facilities.professionUnknown` | Umwuga ntiwatanzwe | Profession not given | needs native-speaker review |
| `licences.add` | Ongeraho uruhushya | Add licence | needs native-speaker review |
| `licences.renew` | Vugurura | Renew | needs native-speaker review |
| `licences.correct` | Kosora | Correct | needs native-speaker review |
| `licences.save` | Bika | Save | needs native-speaker review |
| `licences.superseded` | rwavuguruwe | renewed | needs native-speaker review |
| `licences.kindLabel` | Ubwoko | Type | needs native-speaker review |
| `licences.kind.moh_operating` | Uruhushya rwa MINISANTE | MoH operating licence | needs native-speaker review |
| `licences.kind.pharmacy` | Uruhushya rwa farumasi | Pharmacy licence | needs native-speaker review |
| `licences.kind.rdb_registration` | Icyemezo cya RDB | RDB registration | needs native-speaker review |
| `licences.kind.accreditation` | Icyemezo cy'ubuziranenge | Accreditation | needs native-speaker review |
| `licences.kind.other` | Ibindi | Other | needs native-speaker review |
| `flags.title` | Imikorere | Feature flags | needs native-speaker review |
| `flags.names.security.pin_unlock` | Gufungura ukoresheje PIN | PIN unlock | needs native-speaker review |
| `flags.on` | Irakora | On | needs native-speaker review |
| `flags.off` | Ntikora | Off | needs native-speaker review |
| `flags.onByDefault` | Ikora bisanzwe | On by default | needs native-speaker review |
| `flags.offByDefault` | Ntikora bisanzwe | Off by default | needs native-speaker review |
| `flags.usingDefault` | Ikoresha agaciro gasanzwe ka sisitemu. | Uses the platform default. | needs native-speaker review |
| `flags.overridden` | Yashyiriweho iki kigo. | Set for this facility. | needs native-speaker review |
| `flags.useDefault` | Koresha agaciro gasanzwe | Use the default | needs native-speaker review |
| `flags.overrides_one` | Ikigo {{count}} gifite icyo cyihariye | {{count}} facility has its own setting | needs native-speaker review |
| `flags.overrides_other` | Ibigo {{count}} bifite icyo byihariye | {{count}} facilities have their own setting | needs native-speaker review |
| `masterData.title` | Amakuru shingiro | Master data | needs native-speaker review |
| `masterData.back` | Subira ku makuru shingiro | Back to master data | needs native-speaker review |
| `masterData.count_one` | Ikintu {{count}} | {{count}} item | needs native-speaker review |
| `masterData.count_other` | Ibintu {{count}} | {{count}} items | needs native-speaker review |
| `masterData.missingRw_one` | {{count}} kidafite Ikinyarwanda | {{count}} without Kinyarwanda | needs native-speaker review |
| `masterData.missingRw_other` | {{count}} bidafite Ikinyarwanda | {{count}} without Kinyarwanda | needs native-speaker review |
| `masterData.kinds.locations` | Ahantu | Locations | needs native-speaker review |
| `masterData.kinds.facility-types` | Ubwoko bw'ibigo | Facility types | needs native-speaker review |
| `masterData.kinds.service-catalogue-items` | Serivisi | Services | needs native-speaker review |
| `masterData.kinds.insurers` | Ubwishingizi | Insurers | needs native-speaker review |
| `masterData.kinds.drugs` | Imiti | Drugs | needs native-speaker review |
| `masterData.kinds.diagnosis-codes` | Kode z'indwara (ICD-10) | Diagnosis codes (ICD-10) | needs native-speaker review |
| `masterData.kinds.symptoms` | Ibimenyetso | Symptoms | needs native-speaker review |
| `masterData.kinds.public-holidays` | Iminsi y'ikiruhuko | Public holidays | needs native-speaker review |
| `masterData.kinds.reason-codes` | Kode z'impamvu | Reason codes | needs native-speaker review |
| `masterData.code` | Kode | Code | needs native-speaker review |
| `masterData.name` | Izina | Name | needs native-speaker review |
| `masterData.active` | Kirakoreshwa | Active | needs native-speaker review |
| `masterData.retired` | Cyakuweho | Retired | needs native-speaker review |
| `masterData.translations` | Indimi | Translations | needs native-speaker review |
| `masterData.missing` | Birabura: {{langs}} | Missing: {{langs}} | needs native-speaker review |
| `masterData.missingLanguage` | Ururimi rubura | Missing translation | needs native-speaker review |
| `masterData.add` | Ongeraho | Add | needs native-speaker review |
| `masterData.edit` | Hindura | Edit | needs native-speaker review |
| `masterData.retire` | Kuraho | Retire | needs native-speaker review |
| `masterData.restore` | Garura | Restore | needs native-speaker review |
| `masterData.immutable` | Ntibishobora guhindurwa nyuma yo kurema. | Can't be changed after creation. | needs native-speaker review |
| `masterData.history` | Amateka y'impinduka | Change history | needs native-speaker review |
| `masterData.action.create` | Byaremwe | Created | needs native-speaker review |
| `masterData.action.update` | Byahinduwe | Updated | needs native-speaker review |
| `masterData.action.retire` | Byakuweho | Retired | needs native-speaker review |
| `masterData.action.restore` | Byagaruwe | Restored | needs native-speaker review |
| `masterData.action.import` | Byinjijwe | Imported | needs native-speaker review |
| `masterData.action.unchanged` | Ntibyahindutse | Unchanged | needs native-speaker review |
| `masterData.fields.name_i18n` | Izina | Name | needs native-speaker review |
| `masterData.fields.title_i18n` | Umutwe | Title | needs native-speaker review |
| `masterData.fields.label_i18n` | Inyito | Label | needs native-speaker review |
| `masterData.fields.plain_language_i18n` | Izina ryumvikana | Plain-language name | needs native-speaker review |
| `masterData.fields.code` | Kode | Code | needs native-speaker review |
| `masterData.fields.name` | Izina | Name | needs native-speaker review |
| `masterData.fields.level` | Urwego | Level | needs native-speaker review |
| `masterData.fields.parent_code` | Kode y'ababyeyi | Parent code | needs native-speaker review |
| `masterData.fields.scheme` | Ubwoko bw'ubwishingizi | Scheme | needs native-speaker review |
| `masterData.fields.follows_referral_pathway` | Ikurikiza inzira yo kohereza abarwayi | Follows the referral pathway | needs native-speaker review |
| `masterData.fields.generic_name` | Izina rusange | Generic name | needs native-speaker review |
| `masterData.fields.strength` | Ingano | Strength | needs native-speaker review |
| `masterData.fields.form` | Ishusho | Form | needs native-speaker review |
| `masterData.fields.default_route` | Inzira isanzwe | Default route | needs native-speaker review |
| `masterData.fields.drug_class` | Icyiciro | Drug class | needs native-speaker review |
| `masterData.fields.is_controlled` | Umuti ugenzurwa | Controlled drug | needs native-speaker review |
| `masterData.fields.is_essential_list` | Uri ku rutonde rw'imiti y'ingenzi | On the essential medicines list | needs native-speaker review |
| `masterData.fields.max_usual_quantity` | Ingano ntarengwa isanzwe | Usual maximum quantity | needs native-speaker review |
| `masterData.fields.is_sensitive` | Indwara y'ibanga | Sensitive diagnosis | needs native-speaker review |
| `masterData.fields.body_system` | Igice cy'umubiri | Body system | needs native-speaker review |
| `masterData.fields.icd_code` | Kode ya ICD-10 | ICD-10 code | needs native-speaker review |
| `masterData.fields.holiday_date` | Itariki | Date | needs native-speaker review |
| `masterData.fields.is_provisional` | Itariki itaratangazwa | Date not yet announced | needs native-speaker review |
| `masterData.fields.kind` | Icyiciro | Kind | needs native-speaker review |
| `masterData.fields.requires_text` | Bisaba ibisobanuro | Needs an explanation | needs native-speaker review |
| `masterData.fields.level_of_care` | Urwego rw'ubuvuzi | Level of care | needs native-speaker review |
| `masterData.fields.min_age_months` | Imyaka ntoya (amezi) | Minimum age (months) | needs native-speaker review |
| `masterData.fields.max_age_months` | Imyaka nini (amezi) | Maximum age (months) | needs native-speaker review |
| `masterData.fields.sex_restriction` | Igitsina | Sex restriction | needs native-speaker review |
| `masterData.fields.code_system` | Uburyo bwa kode | Code system | needs native-speaker review |
| `masterData.fields.description_i18n` | Ibisobanuro bibonwa na bose | Public description | needs native-speaker review |
| `masterData.import` | Injiza CSV | Import CSV | needs native-speaker review |
| `masterData.importHint` | Ohereza CSV ya UTF-8. Ubona impinduka mbere y'uko zikorwa. | Upload a UTF-8 CSV. You see a preview of the changes before anything is applied. | needs native-speaker review |
| `masterData.importTitle` | Igenzura ry'iyinjizwa | Import preview | needs native-speaker review |
| `masterData.mode` | Icyo gukorera imirongo isanzwe | What to do with existing rows | needs native-speaker review |
| `masterData.modes.upsert` | Ongeraho imirongo mishya, uvugurure isanzwe | Add new rows and update existing ones | needs native-speaker review |
| `masterData.modes.upsert_and_retire_missing` | Kandi ukureho imirongo idari muri dosiye | Also retire active rows that aren't in the file | needs native-speaker review |
| `masterData.csvFile` | Dosiye ya CSV | CSV file | needs native-speaker review |
| `masterData.csvHint` | CSV ya UTF-8, kugeza kuri MB 5. | UTF-8 CSV, up to 5 MB. | needs native-speaker review |
| `masterData.csvTooLarge` | Iyi dosiye irenze MB 5. | This file is larger than 5 MB. | needs native-speaker review |
| `masterData.csvType` | Ohereza dosiye ya .csv. | Upload a .csv file. | needs native-speaker review |
| `masterData.importStatus.validating` | Dosiye irimo kugenzurwa… | Checking the file… | needs native-speaker review |
| `masterData.importStatus.previewed` | Byiteguye gukoreshwa | Ready to apply | needs native-speaker review |
| `masterData.importStatus.invalid` | Dosiye ifite amakosa | The file has errors | needs native-speaker review |
| `masterData.importStatus.applying` | Birimo gukorwa… | Applying… | needs native-speaker review |
| `masterData.importStatus.applied` | Byakozwe | Applied | needs native-speaker review |
| `masterData.importStatus.failed` | Byanze | Failed | needs native-speaker review |
| `masterData.importStatus.expired` | Igenzura ryarashaje: ongera wohereze dosiye | Preview expired: upload the file again | needs native-speaker review |
| `masterData.summary.rows` | Imirongo | Rows | needs native-speaker review |
| `masterData.summary.create` | Mishya | New | needs native-speaker review |
| `masterData.summary.update` | Yahinduwe | Updated | needs native-speaker review |
| `masterData.summary.retire` | Yakuweho | Retired | needs native-speaker review |
| `masterData.summary.unchanged` | Itahindutse | Unchanged | needs native-speaker review |
| `masterData.summary.errors` | Amakosa | Errors | needs native-speaker review |
| `masterData.errorsTitle` | Kosora iyi mirongo wongere wohereze dosiye | Fix these lines and upload the file again | needs native-speaker review |
| `masterData.errorLine` | Umurongo {{line}} ({{field}}): {{message}} | Line {{line}} ({{field}}): {{message}} | needs native-speaker review |
| `masterData.samples` | Ingero z'impinduka | Examples of changes | needs native-speaker review |
| `masterData.confirm` | Kora impinduka | Apply the changes | needs native-speaker review |
| `masterData.descriptionHint` | Icyo iyi serivisi ari cyo, mu magambo yoroshye. Bigaragara ku rupapuro rwa serivisi. | What the service is, in plain words. Shown on the public service page. | needs native-speaker review |
| `masterData.level` | Urwego | Level | needs native-speaker review |
| `masterData.parent` | Kode y’umubyeyi | Parent code | needs native-speaker review |
| `upload.drop` | Kurura dosiye hano, cyangwa | Drag a file here, or | needs native-speaker review |
| `upload.browse` | Hitamo dosiye | Choose a file | needs native-speaker review |
| `upload.remove` | Kuraho | Remove | needs native-speaker review |
| `upload.uploading` | Biroherezwa… | Uploading… | needs native-speaker review |
| `form.newTitle` | Andikisha ikigo | Register a facility | needs native-speaker review |
| `form.editTitle` | Hindura {{name}} | Edit {{name}} | needs native-speaker review |
| `form.back` | Subira ku busabe | Back to applications | needs native-speaker review |
| `form.facility` | Ikigo | Facility | needs native-speaker review |
| `form.facilityName` | Izina ry’ikigo | Facility name | needs native-speaker review |
| `form.choose` | Hitamo… | Choose… | needs native-speaker review |
| `form.phone` | Telefoni | Phone | needs native-speaker review |
| `form.email` | Imeyili | Email | needs native-speaker review |
| `form.location` | Aho giherereye | Location | needs native-speaker review |
| `form.locationHint` | Umudugudu, aderesi n’umuryango ku ikarita (abarwayi bayikoresha bashaka inzira). | The village, the street address and the entrance on the map (patients use it for directions). | needs native-speaker review |
| `form.address` | Aderesi | Street address | needs native-speaker review |
| `form.mapLabel` | Ikarita: kanda ushyireho ikigo | Map: tap to place the facility | needs native-speaker review |
| `form.pinLabel` | Umuryango w’ikigo (kurura ugahindure) | Facility entrance (drag to move) | needs native-speaker review |
| `form.latitude` | Latitude | Latitude | needs native-speaker review |
| `form.longitude` | Longitude | Longitude | needs native-speaker review |
| `form.levels.province` | Intara | Province | needs native-speaker review |
| `form.levels.district` | Akarere | District | needs native-speaker review |
| `form.levels.sector` | Umurenge | Sector | needs native-speaker review |
| `form.levels.cell` | Akagari | Cell | needs native-speaker review |
| `form.levels.village` | Umudugudu | Village | needs native-speaker review |
| `form.applicant` | Usaba | Applicant | needs native-speaker review |
| `form.applicantHint` | Umuntu uvugira ikigo. Ni we uhabwa link. | The person who speaks for the facility. They receive the link. | needs native-speaker review |
| `form.name` | Amazina yose | Full name | needs native-speaker review |
| `form.position` | Umwanya | Position | needs native-speaker review |
| `form.admin` | Umuyobozi w’ikigo | Facility admin | needs native-speaker review |
| `form.adminHint` | Uzakoresha MediLink mu kigo. Ahabwa ubutumire iyo ikigo cyemejwe. | Who runs MediLink at the facility. They get an invitation when the facility is approved. | needs native-speaker review |
| `form.nextSteps` | Ibikurikira: usaba yohereza uruhushya n’inyandiko z’iyandikwa (cyangwa ukazongeraho ku rupapuro rw’ubusabe), akemera amabwiriza akohereza. | Next: the applicant uploads the licence and registration documents (or you add them on the application page), accepts the terms and submits. | needs native-speaker review |
| `form.save` | Bika | Save changes | needs native-speaker review |
| `form.editDetails` | Hindura amakuru | Edit details | needs native-speaker review |
| `form.required` | Uzuza aha. | Fill this in. | needs native-speaker review |
| `form.email_invalid` | Andika imeyili nyayo. | Enter a valid email address. | needs native-speaker review |
| `form.tin` | TIN igira imibare 9. | A TIN has 9 digits. | needs native-speaker review |
| `form.mohCode` | Koresha inyuguti, imibare na / . _ - gusa. | Use letters, digits and / . _ - only. | needs native-speaker review |
| `form.outsideRwanda` | Aho hantu hari hanze y’u Rwanda. | That location is outside Rwanda. | needs native-speaker review |
| `form.fix` | Hari aho ukwiye gukosora. | Some fields need attention. | needs native-speaker review |
| `form.addDocument` | Ongeraho inyandiko y’ikigo | Add a document for the facility | needs native-speaker review |
| `form.documentKind` | Inyandiko | Document | needs native-speaker review |
| `form.licenceNumber` | Nimero y’uruhushya | Licence number | needs native-speaker review |
| `form.expires` | Itariki izarangiriraho | Expiry date | needs native-speaker review |
| `form.chooseFile` | Hitamo dosiye | Choose a file | needs native-speaker review |
| `form.uploaded` | {{name}} yoherejwe. Irasuzumwa virusi mbere y’uko ifungurwa. | {{name}} uploaded. It is checked for viruses before anyone can open it. | needs native-speaker review |

## staff-web feature: queue (namespace queue)

File: `apps/staff-web/src/features/queue/locales/rw.json`

| Key | Kinyarwanda (draft) | English source | Status |
|---|---|---|---|
| `nav.reorders` | Igenzura ry’umurongo | Queue reviews | needs native-speaker review |
| `nav.triage` | Isuzuma ry’ibanze | Triage | needs native-speaker review |
| `nav.lab` | Laboratwari | Laboratory | needs native-speaker review |
| `lab.title` | Laboratwari | Laboratory | needs native-speaker review |
| `lab.lead` | Hamagara umurwayi ukurikiyeho, fata ibipimo, wandike ibisubizo. Umurwayi asubira kwa muganga iyo ibisubizo byose byabonetse. | Call the next patient, take the samples and enter the results. The patient goes back to the doctor when every result is in. | needs native-speaker review |
| `lab.open` | Fungura laboratwari | Open the lab | needs native-speaker review |
| `lab.current` | Umurwayi uri kumwe nawe | Patient with you | needs native-speaker review |
| `lab.start` | Tangira | Start | needs native-speaker review |
| `lab.inLab` | Muri laboratwari | At the lab | needs native-speaker review |
| `lab.nobody` | Nta muntu utegereje laboratwari. | Nobody is waiting for the lab. | needs native-speaker review |
| `lab.waiting` | Bategereje gufatwa ibipimo | Waiting for a sample | needs native-speaker review |
| `lab.inProgress` | Ibisubizo byo kwandika | Results to enter | needs native-speaker review |
| `lab.inProgressNone` | Nta gipimo gitegereje igisubizo. | No sample is waiting for a result. | needs native-speaker review |
| `lab.doneToday` | Byarangiye uyu munsi | Done today | needs native-speaker review |
| `lab.identity` | Genzura uwo murwayi uwo ari we | Check who the patient is | needs native-speaker review |
| `lab.fullName` | Amazina yose | Full name | needs native-speaker review |
| `lab.born` | Itariki y’amavuko | Date of birth | needs native-speaker review |
| `lab.medilinkNumber` | Nomero ya MediLink | MediLink number | needs native-speaker review |
| `lab.payment` | Kwishyura | Payment | needs native-speaker review |
| `lab.paid` | Yishyuye | Paid | needs native-speaker review |
| `lab.unpaid` | Ntiyishyuye | Not paid | needs native-speaker review |
| `lab.samples` | Ibipimo | Samples | needs native-speaker review |
| `lab.sample` | Igipimo cyafashwe | Sample taken | needs native-speaker review |
| `lab.orderedBy` | Byasabwe na {{name}} | Ordered by {{name}} | needs native-speaker review |
| `lab.request` | Icyo muganga asaba: | Doctor's request: | needs native-speaker review |
| `lab.loadingTests` | Turimo gushaka ibizamini… | Loading the tests… | needs native-speaker review |
| `lab.samplesDone` | Ibipimo bya {{name}} byafashwe. Andika ibisubizo nibimara kuboneka. | Samples taken for {{name}}. Enter the results when they are ready. | needs native-speaker review |
| `lab.enter` | Andika igisubizo | Enter the result | needs native-speaker review |
| `lab.choose` | Hitamo… | Choose… | needs native-speaker review |
| `lab.required` | Andika iki gisubizo. | Enter this result. | needs native-speaker review |
| `lab.comment` | Icyo ubwira muganga (si ngombwa) | Comment for the doctor (optional) | needs native-speaker review |
| `lab.save` | Bika igisubizo | Save result | needs native-speaker review |
| `lab.saved` | Igisubizo cyabitswe: {{test}}. | Result saved: {{test}}. | needs native-speaker review |
| `lab.backToDoctor` | Ibisubizo byose byabonetse. {{name}} asubiye kwa muganga. | Every result is in. {{name}} goes back to the doctor. | needs native-speaker review |
| `lab.today.waiting` | Bategereje gufatwa ibipimo | Waiting for a sample | needs native-speaker review |
| `lab.today.results` | Ibisubizo byo kwandika | Results to enter | needs native-speaker review |
| `lab.today.done` | Byarangiye uyu munsi | Done today | needs native-speaker review |
| `triage.title` | Isuzuma ry’ibanze | Triage | needs native-speaker review |
| `triage.lead` | Fata ibipimo, menya uko byihutirwa, hanyuma wohereze umurwayi kwa muganga. | Take vitals, decide how urgent it is, and send the patient to the doctor. | needs native-speaker review |
| `triage.open` | Fungura isuzuma ry’ibanze | Open triage | needs native-speaker review |
| `triage.current` | Umurwayi uri kumwe nawe | Patient with you | needs native-speaker review |
| `triage.start` | Tangira isuzuma | Start triage | needs native-speaker review |
| `triage.inTriage` | Ari mu isuzuma ry’ibanze | In triage | needs native-speaker review |
| `triage.nobody` | Nta muntu utegereje isuzuma ry’ibanze. | Nobody is waiting for triage. | needs native-speaker review |
| `triage.waiting` | Bategereje isuzuma ry’ibanze | Waiting for triage | needs native-speaker review |
| `triage.waitingCount_one` | {{count}} ategereje isuzuma ry’ibanze | {{count}} waiting for triage | needs native-speaker review |
| `triage.waitingCount_other` | {{count}} bategereje isuzuma ry’ibanze | {{count}} waiting for triage | needs native-speaker review |
| `triage.longest_one` | Uwategereje igihe kirekire: iminota {{count}} | Longest wait {{count}} min | needs native-speaker review |
| `triage.longest_other` | Uwategereje igihe kirekire: iminota {{count}} | Longest wait {{count}} min | needs native-speaker review |
| `triage.words` | Mu magambo ye | In their words | needs native-speaker review |
| `triage.noWords` | Nta cyanditswe ku kwakira. | Nothing written at check-in. | needs native-speaker review |
| `triage.symptoms` | Ibimenyetso | Symptoms | needs native-speaker review |
| `triage.allergies` | Allergies | Allergies | needs native-speaker review |
| `triage.noAllergies` | Nta na kimwe cyanditswe. Baza umurwayi. | None recorded. Ask the patient. | needs native-speaker review |
| `triage.vitals` | Ibipimo | Vitals | needs native-speaker review |
| `triage.decision` | Ohereza kwa muganga | Send to the doctor | needs native-speaker review |
| `triage.urgency` | Byihutirwa bingana iki? | How urgent? | needs native-speaker review |
| `triage.urgencies.normal` | Bisanzwe | Normal | needs native-speaker review |
| `triage.urgencies.priority` | Yihutishwa | Priority | needs native-speaker review |
| `triage.urgencies.emergency` | Byihutirwa | Emergency | needs native-speaker review |
| `triage.urgencyHints.normal` | Ategereza igihe cye. | Waits in turn. | needs native-speaker review |
| `triage.urgencyHints.priority` | Abonwa mbere y’umurongo usanzwe. | Seen before the normal queue. | needs native-speaker review |
| `triage.urgencyHints.emergency` | Ni we ukurikiraho. Muganga abibona mbere. | Seen next. The doctor sees it first. | needs native-speaker review |
| `triage.why` | Kuki yihutishwa? | Why priority? | needs native-speaker review |
| `triage.danger` | Ni iki giteye impungenge? | What is dangerous? | needs native-speaker review |
| `triage.dangerHint` | Urugero: kuribwa mu gatuza ari kubira ibyuya, SpO₂ 88%. | For example: chest pain with sweating, SpO₂ 88%. | needs native-speaker review |
| `triage.dangerRequired` | Vuga igituma byihutirwa. | Say what makes it an emergency. | needs native-speaker review |
| `triage.note` | Icyo muganga agomba kumenya | Note for the doctor | needs native-speaker review |
| `triage.noteHint` | Si ngombwa. Icyo muganga agomba kumenya mbere. | Optional. What the doctor should know first. | needs native-speaker review |
| `triage.noVitals` | Kuki nta bipimo? | Why no vitals? | needs native-speaker review |
| `triage.noVitalsHint` | Fata nibura igipimo kimwe, cyangwa uvuge impamvu bitashobotse. | Take at least one vital sign, or say why you could not. | needs native-speaker review |
| `triage.noVitalsRequired` | Andika igipimo hejuru, cyangwa uvuge impamvu nta na kimwe cyafashwe. | Record a vital sign above, or say why none could be taken. | needs native-speaker review |
| `triage.send` | Ohereza kwa muganga | Send to the doctor | needs native-speaker review |
| `triage.sent` | {{number}} ategereje muganga. | {{number}} is waiting for the doctor. | needs native-speaker review |
| `loading` | Umurongo urafunguka… | Loading the queue… | needs native-speaker review |
| `loadFailed` | Umurongo ntiwafungutse. Burongera kugerageza. | The queue could not load. It retries by itself. | needs native-speaker review |
| `failed` | Ntibyakunze. Reba interineti wongere ugerageze. | That did not work. Check your connection and try again. | needs native-speaker review |
| `close` | Funga | Close | needs native-speaker review |
| `cancel` | Reka | Cancel | needs native-speaker review |
| `confirm` | Emeza | Confirm | needs native-speaker review |
| `reason` | Impamvu | Reason | needs native-speaker review |
| `reasonText` | Sobanura | Explain | needs native-speaker review |
| `unknownService` | Serivisi | Service | needs native-speaker review |
| `age_one` | Umwaka {{count}} | {{count}} year | needs native-speaker review |
| `age_other` | Imyaka {{count}} | {{count}} years | needs native-speaker review |
| `minutes_one` | Iminota {{count}} | {{count}} min | needs native-speaker review |
| `minutes_other` | Iminota {{count}} | {{count}} min | needs native-speaker review |
| `minutesAgo_one` | Hashize iminota {{count}} | {{count}} min ago | needs native-speaker review |
| `minutesAgo_other` | Hashize iminota {{count}} | {{count}} min ago | needs native-speaker review |
| `sex.female` | Gore | Female | needs native-speaker review |
| `sex.male` | Gabo | Male | needs native-speaker review |
| `sex.other` | Ikindi | Other | needs native-speaker review |
| `states.waiting` | Arategereje | Waiting | needs native-speaker review |
| `states.called` | Yahamagawe | Called | needs native-speaker review |
| `states.in_service` | Ari kwa muganga | In consultation | needs native-speaker review |
| `states.no_response` | Ntiyitabye | No response | needs native-speaker review |
| `states.on_hold` | Ategereje ibisubizo | On hold | needs native-speaker review |
| `states.moved_to_next_stage` | Yakomeje | Moved on | needs native-speaker review |
| `states.transferred` | Yimuriwe | Transferred | needs native-speaker review |
| `states.cancelled` | Byahagaritswe | Cancelled | needs native-speaker review |
| `states.left_without_service` | Yagiye | Left | needs native-speaker review |
| `states.completed` | Byarangiye | Completed | needs native-speaker review |
| `stages.reception` | Kwakira | Reception | needs native-speaker review |
| `stages.payment` | Kwishyura | Payment | needs native-speaker review |
| `stages.triage` | Isuzuma ry’ibanze | Triage | needs native-speaker review |
| `stages.consultation` | Kwa muganga | Consultation | needs native-speaker review |
| `stages.lab` | Laboratwari | Laboratory | needs native-speaker review |
| `stages.pharmacy` | Farumasi | Pharmacy | needs native-speaker review |
| `flags.emergency` | Byihutirwa | Emergency | needs native-speaker review |
| `flags.priority` | Yihutishwa | Priority | needs native-speaker review |
| `flags.return` | Avuye mu bizamini | Back from tests | needs native-speaker review |
| `flags.stepped_out` | Yasohotse gato | Stepped out | needs native-speaker review |
| `flags.no_response` | Ntiyitabye | Missed call | needs native-speaker review |
| `flags.booked` | Yafashe gahunda {{time}} | Booked {{time}} | needs native-speaker review |
| `flags.lateWalkIn` | Yakererewe: nk'utafashe gahunda | Late: walk-in | needs native-speaker review |
| `flags.remote` | Ari kure, ntarahagera | Remote, not here yet | needs native-speaker review |
| `flags.redFlag` | Ikimenyetso cy'akaga | Danger sign | needs native-speaker review |
| `flags.unpaid` | Ntiyishyuye | Not paid | needs native-speaker review |
| `flags.insurance` | Ubwishingizi bwo kugenzura | Insurance to verify | needs native-speaker review |
| `flags.noPhone` | Nta telefone | No phone | needs native-speaker review |
| `priority.elderly` | Umusaza/Umukecuru | Elderly | needs native-speaker review |
| `priority.pregnant` | Atwite | Pregnant | needs native-speaker review |
| `priority.disability` | Ufite ubumuga | Disability | needs native-speaker review |
| `priority.very_sick` | Arembye | Very sick | needs native-speaker review |
| `duty.on_duty` | Ari mu kazi | On duty | needs native-speaker review |
| `duty.break` | Ari mu kiruhuko | On break | needs native-speaker review |
| `duty.emergency` | Ari mu byihutirwa | At an emergency | needs native-speaker review |
| `duty.off` | Ntari mu kazi | Off duty | needs native-speaker review |
| `status.break` | Muganga ari mu kiruhuko | Doctor on break | needs native-speaker review |
| `status.emergency` | Muganga ari mu byihutirwa | Doctor at an emergency | needs native-speaker review |
| `status.none_on_duty` | Nta muganga uri mu kazi | No doctor on duty | needs native-speaker review |
| `reasons.clinical_urgency` | Bikeneye kwihutishwa | Clinical urgency | needs native-speaker review |
| `reasons.staff_error` | Gukosora ikosa | Correcting a mistake | needs native-speaker review |
| `reasons.patient_request` | Umurwayi yabisabye | Patient's request | needs native-speaker review |
| `reasons.patient_left` | Umurwayi yagiye | Patient left | needs native-speaker review |
| `reasons.duplicate` | Tike ebyiri | Duplicate ticket | needs native-speaker review |
| `reasons.patient_was_present` | Umurwayi yari ahari | The patient was here | needs native-speaker review |
| `reasons.facility_delay` | Gutinda kw’ivuriro | Delay at the facility | needs native-speaker review |
| `reasons.other` | Ibindi | Other | needs native-speaker review |
| `actions.check_in` | Yanditswe | Checked in | needs native-speaker review |
| `actions.call` | Yahamagawe | Called | needs native-speaker review |
| `actions.recall` | Yongeye guhamagarwa | Called again | needs native-speaker review |
| `actions.start` | Yatangiye kwa muganga | Consultation started | needs native-speaker review |
| `actions.no_response` | Ntiyitabye | No response | needs native-speaker review |
| `actions.hold` | Ategereje ibisubizo | On hold | needs native-speaker review |
| `actions.return` | Yagarutse ku murongo | Back in the queue | needs native-speaker review |
| `actions.complete` | Byarangiye | Completed | needs native-speaker review |
| `actions.next_stage` | Yakomeje ku ntambwe ikurikira | Moved to the next stage | needs native-speaker review |
| `actions.triage` | Yasuzumwe mbere | Triaged | needs native-speaker review |
| `actions.opened` | Tike nshya | New ticket | needs native-speaker review |
| `actions.transfer` | Yimuriwe | Transferred | needs native-speaker review |
| `actions.cancel` | Byahagaritswe | Cancelled | needs native-speaker review |
| `actions.left` | Yagiye | Left | needs native-speaker review |
| `actions.step_out` | Yasohotse gato | Stepped out | needs native-speaker review |
| `actions.step_out_expired` | Yagarutse | Back from stepping out | needs native-speaker review |
| `actions.priority` | Kwihutishwa byahinduwe | Priority changed | needs native-speaker review |
| `actions.reorder` | Yimuwe ku murongo | Moved in the queue | needs native-speaker review |
| `actions.end_of_day` | Byafunzwe umunsi urangiye | Closed at end of day | needs native-speaker review |
| `actions.remote_join` | Yiyandikishije ari mu rugo | Joined from home | needs native-speaker review |
| `actions.remote_arrival_claimed` | Yavuze ko yahageze | Said they're here | needs native-speaker review |
| `actions.remote_arrival_confirmed` | Kuhagera byemejwe | Arrival confirmed | needs native-speaker review |
| `actions.pass_over` | Yasubijwe inyuma (ntarahagera) | Moved back (not arrived) | needs native-speaker review |
| `columns.ticket` | Tike | Ticket | needs native-speaker review |
| `columns.patient` | Umurwayi | Patient | needs native-speaker review |
| `columns.flags` | Ibimenyetso | Flags | needs native-speaker review |
| `columns.waiting` | Ategereje | Waiting | needs native-speaker review |
| `live.live` | Ako kanya · hashize amasegonda {{seconds}} | Live · {{seconds}} s ago | needs native-speaker review |
| `live.connected` | Ako kanya | Live | needs native-speaker review |
| `live.reconnecting` | Birongera guhuzwa | Reconnecting | needs native-speaker review |
| `live.offline_one` | Nta interineti · igikorwa {{count}} gitegereje | Offline · {{count}} action waiting | needs native-speaker review |
| `live.offline_other` | Nta interineti · ibikorwa {{count}} bitegereje | Offline · {{count}} actions waiting | needs native-speaker review |
| `board.title` | Umurongo | Queue | needs native-speaker review |
| `board.checkIn` | Andika umurwayi | Check in patient | needs native-speaker review |
| `board.services` | Serivisi | Services | needs native-speaker review |
| `board.allServices` | Serivisi zose | All services | needs native-speaker review |
| `board.nowServing` | Abari kwakirwa | Now serving | needs native-speaker review |
| `board.expected` | Abategerejwe | Expected | needs native-speaker review |
| `board.expectedEmptyTitle` | Nta gahunda zirahari | No bookings yet | needs native-speaker review |
| `board.expectedEmpty` | Abafashe gahunda y’uyu munsi bagaragara hano kugeza bageze. | Patients booked for today appear here until they arrive. | needs native-speaker review |
| `board.onSite` | Bari hano | On site | needs native-speaker review |
| `board.emptyTitle` | Nta wutegereje | Nobody is waiting | needs native-speaker review |
| `board.empty` | Andika umurwayi wa mbere w’uyu munsi. | Check in the first patient of the day. | needs native-speaker review |
| `board.nobodyWaiting` | Nta wutegereje hano. | Nobody waiting here. | needs native-speaker review |
| `board.waitingCount_one` | {{count}} arategereje | {{count}} waiting | needs native-speaker review |
| `board.waitingCount_other` | {{count}} barategereje | {{count}} waiting | needs native-speaker review |
| `board.newArrivalWait` | Ugeze ubu ategereza iminota {{min}}–{{max}} | New arrival waits {{min}}–{{max}} min | needs native-speaker review |
| `board.expectedCheckIn` | Andika ko yageze | Check in | needs native-speaker review |
| `board.expectedLate` | Yakererewe | Late | needs native-speaker review |
| `board.expectedAnyDoctor` | Muganga uwo ari we wese | Any doctor | needs native-speaker review |
| `board.expectedError` | Ntibyashobotse kubona gahunda z’uyu munsi. | Could not load today's bookings. | needs native-speaker review |
| `board.expectedCheckInError` | Ntibyashobotse kwandika ko uyu murwayi yageze. | Could not check in this booking. | needs native-speaker review |
| `board.expectedRetry` | Ongera ugerageze | Try again | needs native-speaker review |
| `board.missed` | Abatitabiriye uyu munsi | Missed today | needs native-speaker review |
| `board.missedHint` | Banditswe ko batitabiriye. Kuraho niba umurwayi yari ahari cyangwa gutinda kwaturutse kuri twe; igihano kivanwaho. | Marked as no-shows. Undo if the patient was here or the delay was ours; the strike is removed. | needs native-speaker review |
| `board.undoNoShow` | Kuraho ko atitabiriye | Undo no-show | needs native-speaker review |
| `board.undoNoShowHelp` | Gahunda irafungwa kandi igihano cy’umurwayi kikavanwaho. | The booking is closed and the patient's strike is removed. | needs native-speaker review |
| `board.undoNoShowError` | Ntibyashobotse gukuraho ko atitabiriye. | Could not undo this no-show. | needs native-speaker review |
| `board.remote_one` | Yiyandikishije ari mu rugo ({{count}}) | Joined from home ({{count}}) | needs native-speaker review |
| `board.remote_other` | Biyandikishije bari mu rugo ({{count}}) | Joined from home ({{count}}) | needs native-speaker review |
| `board.remoteHint` | Emeza igihe umurwayi ageze ku biro. Kugeza icyo gihe, umwanya we usubira inyuma iyo ageze hafi y'imbere. | Confirm when the patient is at the desk. Until then their place moves back near the front. | needs native-speaker review |
| `board.remoteClaimed` | Avuga ko yahageze | Says they're here | needs native-speaker review |
| `board.remoteConfirm` | Emeza ko yahageze | Confirm arrival | needs native-speaker review |
| `board.remoteError` | Ntibyakunze kwemeza ko yahageze. | Could not confirm the arrival. | needs native-speaker review |
| `board.expectedCheckedIn` | {{name}} yanditswe: {{ticket}} | {{name}} checked in: {{ticket}} | needs native-speaker review |
| `board.expectedLateWalkIn` | Yahageze igihe cyo gutegereza cyarenze, ashyirwa ku murongo nk'utafashe gahunda. Mumuhe ikindi gihe niba abishaka. | Arrived after the grace time, so queued as a walk-in. Offer a new time if they prefer. | needs native-speaker review |
| `board.findPatient` | Shaka umurwayi: izina, telefoni, indangamuntu cyangwa nimero ya dosiye | Find a patient: name, phone, national ID or file number | needs native-speaker review |
| `board.intakeDone` | Impamvu yatanzwe | Intake done | needs native-speaker review |
| `board.intakeMissing` | Nta mpamvu | No intake | needs native-speaker review |
| `panel.service` | Serivisi | Service | needs native-speaker review |
| `panel.stage` | Intambwe | Stage | needs native-speaker review |
| `panel.position` | Umwanya | Place | needs native-speaker review |
| `panel.arrived` | Yageze | Arrived | needs native-speaker review |
| `panel.ahead_one` | Umuntu {{count}} amuri imbere | {{count}} person ahead | needs native-speaker review |
| `panel.ahead_other` | Abantu {{count}} bamuri imbere | {{count}} people ahead | needs native-speaker review |
| `panel.priority` | Kwihutisha | Set priority | needs native-speaker review |
| `panel.priorityClass` | Impamvu yo kwihutisha | Priority | needs native-speaker review |
| `panel.reorder` | Kumwimura imbere | Move up | needs native-speaker review |
| `panel.reorderHint` | Buri kwimura kwandikwa ku izina ryawe kandi kugenzurwa n’umuyobozi. | Every move is recorded with your name and reviewed by the facility admin. | needs native-speaker review |
| `panel.moveBefore` | Mushyire imbere ya | Move in front of | needs native-speaker review |
| `panel.transfer` | Kwimurira | Transfer | needs native-speaker review |
| `panel.transferHint` | Umurwayi agumana isaha yageriyeho ku murongo mushya. | The patient keeps their arrival time in the new queue. | needs native-speaker review |
| `panel.stepOut` | Yasohotse iminota 15 | Stepped out 15 min | needs native-speaker review |
| `panel.left` | Yagiye | Mark as left | needs native-speaker review |
| `panel.timeline` | Ibyabaye | What happened | needs native-speaker review |
| `panel.remoteClaimed` | Umurwayi yakanze "Nahageze". Reba ko ari ku biro, hanyuma wemeze. | The patient tapped "I'm here". Check they are at the desk, then confirm. | needs native-speaker review |
| `panel.remoteNotArrived` | Yiyandikishije ari mu rugo kandi ntaremezwa. Emeza igihe umurwayi ageze ku biro. | Joined from home and not confirmed yet. Confirm when the patient is at the desk. | needs native-speaker review |
| `panel.patientWords` | Uko umurwayi abivuga | In the patient's words | needs native-speaker review |
| `panel.raiseEmergency` | Shyira mu byihutirwa | Raise to emergency | needs native-speaker review |
| `panel.raiseEmergencyHint` | Umurwayi ajya imbere ku murongo ubu. Vuga icyo wabonye, urugero "ububabare mu gatuza, ahumeka nabi". | The patient goes to the top of the queue now. Say what you saw, for example "chest pain, struggling to breathe". | needs native-speaker review |
| `panel.checkInsurance` | Genzura ubwishingizi: fotora ikarita, hanyuma wemeze | Check insurance: photo of the card, then verify | needs native-speaker review |
| `checkIn.title` | Andika umurwayi | Check in a patient | needs native-speaker review |
| `checkIn.back` | Subira inyuma | Back | needs native-speaker review |
| `checkIn.submit` | Andika | Check in | needs native-speaker review |
| `checkIn.emergency` | Byihutirwa | Emergency | needs native-speaker review |
| `checkIn.emergencyHint` | Ajya imbere ku murongo. Tanga impamvu. | Goes to the front of the queue. Give a reason. | needs native-speaker review |
| `checkIn.noPriority` | Nta kwihutishwa | No priority | needs native-speaker review |
| `checkIn.done` | Yanditswe | Checked in | needs native-speaker review |
| `checkIn.ticketFor` | Tike ya {{name}} | Ticket for {{name}} | needs native-speaker review |
| `checkIn.already` | {{name}} yamaze kwandikwa uyu munsi | {{name}} is already checked in today | needs native-speaker review |
| `checkIn.close` | Byarangiye | Done | needs native-speaker review |
| `mine.title` | Umurongo wanjye | My queue | needs native-speaker review |
| `mine.duty` | Uko meze | My status | needs native-speaker review |
| `mine.room` | Icyumba | Room | needs native-speaker review |
| `mine.breakUntil` | Agaruka saa {{time}} | Back at {{time}} | needs native-speaker review |
| `mine.current` | Umurwayi uriho | Current patient | needs native-speaker review |
| `mine.callNext` | Hamagara ukurikira | Call next | needs native-speaker review |
| `mine.spaceHint` | Cyangwa ukande Space. | Or press Space. | needs native-speaker review |
| `mine.setOnDuty` | Shyira ko uri mu kazi kugira ngo uhamagare abarwayi. | Set yourself on duty to call patients. | needs native-speaker review |
| `mine.nobodyTitle` | Nta wutegereje | Nobody waiting | needs native-speaker review |
| `mine.nobody` | Nta murwayi ukugutegereje ubu. | Nobody is waiting for you right now. | needs native-speaker review |
| `mine.start` | Tangira kumuvura | Start consultation | needs native-speaker review |
| `mine.recall` | Ongera umuhamagare | Call again | needs native-speaker review |
| `mine.noResponse` | Ntiyitabye | No response | needs native-speaker review |
| `mine.complete` | Soza | Complete visit | needs native-speaker review |
| `mine.toPharmacy` | Mwohereze kuri farumasi | Send to pharmacy | needs native-speaker review |
| `mine.toPayment` | Mwohereze kwishyura | Send to payment | needs native-speaker review |
| `mine.hold` | Ategereze ibisubizo | Wait for results | needs native-speaker review |
| `mine.waiting` | Abategereje | Waiting | needs native-speaker review |
| `mine.nextUp` | Ukurikiyeho | Next up | needs native-speaker review |
| `mine.openRecord` | Fungura dosiye | Open record | needs native-speaker review |
| `mine.finishAndNext` | Soza uhamagare ukurikira | Finish and call next | needs native-speaker review |
| `mine.more` | Ibindi | More | needs native-speaker review |
| `reorders.title` | Igenzura ry’umurongo | Queue reviews | needs native-speaker review |
| `reorders.onlyOpen` | Erekana gusa ibitaragenzurwa | Show only moves not yet reviewed | needs native-speaker review |
| `reorders.columns.when` | Ryari | When | needs native-speaker review |
| `reorders.columns.ticket` | Tike | Ticket | needs native-speaker review |
| `reorders.columns.who` | Uwamwimuye | Moved by | needs native-speaker review |
| `reorders.columns.reason` | Impamvu | Reason | needs native-speaker review |
| `reorders.columns.move` | Umwanya | Place | needs native-speaker review |
| `reorders.columns.review` | Igenzura | Review | needs native-speaker review |
| `reorders.positions` | {{from}} → {{to}} | {{from}} → {{to}} | needs native-speaker review |
| `reorders.reviewed` | Byagenzuwe | Reviewed | needs native-speaker review |
| `reorders.markReviewed` | Emeza ko byagenzuwe | Mark reviewed | needs native-speaker review |
| `reorders.emptyTitle` | Nta cyo kugenzura | Nothing to review | needs native-speaker review |
| `reorders.empty` | Kwimura kutubahirije uko bakurikirana kugaragara hano. | Moves that skip the normal order appear here. | needs native-speaker review |
| `reorders.tabs.open` | Ibyo kugenzura | To review | needs native-speaker review |
| `reorders.tabs.all` | Kwimura kose | All moves | needs native-speaker review |
| `displays.title` | Televiziyo z’aho bategerereza | Waiting-room screens | needs native-speaker review |
| `displays.add` | Ongeraho televiziyo | Add screen | needs native-speaker review |
| `displays.label` | Izina rya televiziyo | Screen name | needs native-speaker review |
| `displays.services` | Serivisi zigaragara | Services shown | needs native-speaker review |
| `displays.create` | Kora link | Create link | needs native-speaker review |
| `displays.created` | Link iriteguye | Screen link ready | needs native-speaker review |
| `displays.onceHint` | Yikoporore ubu: iyi link igaragara rimwe gusa. Yikureho niyo yamenyekana. | Copy it now: this link is shown only once. Revoke it if it leaks. | needs native-speaker review |
| `displays.copy` | Koporora link | Copy link | needs native-speaker review |
| `displays.copied` | Byakoporowe | Copied | needs native-speaker review |
| `displays.done` | Byarangiye | Done | needs native-speaker review |
| `displays.active` | Irakora | Active | needs native-speaker review |
| `displays.revoked` | Yakuweho | Revoked | needs native-speaker review |
| `displays.revoke` | Kuraho link | Revoke link | needs native-speaker review |
| `displays.lastSeen` | Yaherukaga kuboneka {{time}} | Last seen {{time}} | needs native-speaker review |
| `displays.neverSeen` | Ntirafungurwa | Not opened yet | needs native-speaker review |
| `displays.emptyTitle` | Nta televiziyo zirahari | No screens yet | needs native-speaker review |
| `displays.empty` | Ongeraho link kuri buri televiziyo. | Add a link for each waiting-room TV. | needs native-speaker review |
| `display.nowServing` | Ubu turi kwakira · Now serving | Now serving · Ubu turi kwakira | needs native-speaker review |
| `display.next` | Abakurikira · Next | Next · Abakurikira | needs native-speaker review |
| `display.enableSound` | Fungura ijwi | Turn on sound | needs native-speaker review |
| `display.spoken` | Itike {{number}} | Ticket {{number}} | needs native-speaker review |
| `display.spokenRoom` | Itike {{number}}, mwinjire muri {{room}} | Ticket {{number}}, please go to {{room}} | needs native-speaker review |
| `display.invalid` | Iyi link ya televiziyo ntikora. Saba ikigo indi nshya. | This screen link is not valid. Ask the facility for a new one. | needs native-speaker review |
| `display.footer` | Tega amatwi nimero yawe. Fata gahunda kuri interineti: medilink.rw | Listen for your number. Book online: medilink.rw | needs native-speaker review |
| `display.testSound` | Gerageza ijwi | Test sound | needs native-speaker review |
| `display.testRoom` | Icyumba 1 | Room 1 | needs native-speaker review |
| `today.title` | Bari hano ubu | On site now | needs native-speaker review |
| `today.summary` | {{waiting}} barategereje · {{serving}} bari kwa muganga | {{waiting}} waiting · {{serving}} with a doctor | needs native-speaker review |
| `today.open` | Fungura umurongo | Open queue | needs native-speaker review |
| `today.waiting` | barategereje | waiting | needs native-speaker review |
| `ops.title` | Ishusho y'ikigo | Facility command centre | needs native-speaker review |
| `ops.allReports` | Raporo zose | All reports | needs native-speaker review |
| `ops.vsLast` | ugereranyije na {{day}} ishize | vs last {{day}} | needs native-speaker review |
| `ops.patientsToday` | Abarwayi uyu munsi | Patients today | needs native-speaker review |
| `ops.medianWait` | Igihe cyo gutegereza muganga (hagati) | Median wait to be seen | needs native-speaker review |
| `ops.min` | min | min | needs native-speaker review |
| `ops.noShows` | Abatitabiriye gahunda | No-show rate | needs native-speaker review |
| `ops.noShowsLater` | Bizapimwa gufata gahunda kuri interineti nibitangira. | Measured once online booking opens. | needs native-speaker review |
| `ops.revenue` | Ayishyuwe uyu munsi | Collected today | needs native-speaker review |
| `ops.revenueLater` | Bizapimwa kwishyuza nibitangira. | Measured once billing is live. | needs native-speaker review |
| `ops.liveTitle` | Umutwaro w’umurongo kuri buri serivisi | Queue load by service | needs native-speaker review |
| `ops.quiet` | Nta muntu uri ku murongo ubu. | No one is in the queue right now. | needs native-speaker review |
| `ops.doctors_one` | Umuganga {{count}} uri mu kazi | {{count}} doctor on duty | needs native-speaker review |
| `ops.doctors_other` | Abaganga {{count}} bari mu kazi | {{count}} doctors on duty | needs native-speaker review |
| `ops.load.low` | Bigenda neza | Flowing | needs native-speaker review |
| `ops.load.medium` | Hari benshi | Busy | needs native-speaker review |
| `ops.load.high` | Huzuye cyane | Overloaded | needs native-speaker review |
| `ops.longest` | uwatinze cyane iminota {{min}} | longest {{min}} min | needs native-speaker review |
| `ops.waiting` | barategereje | waiting | needs native-speaker review |
| `ops.attention` | Bikeneye ko ubireba | Needs your attention | needs native-speaker review |
| `ops.allClear` | Byose ni byiza. Nta gitegereje icyemezo cyawe. | All clear. Nothing waits for your decision. | needs native-speaker review |
| `ops.reordersToReview_one` | Kwimura {{count}} gukeneye kugenzurwa | {{count}} queue move to review | needs native-speaker review |
| `ops.reordersToReview_other` | Kwimura {{count}} gukeneye kugenzurwa | {{count}} queue moves to review | needs native-speaker review |
| `ops.noDoctor_one` | Umurwayi {{count}} ategereje nta muganga uri mu kazi | {{count}} patient waiting with no doctor on duty | needs native-speaker review |
| `ops.noDoctor_other` | Abarwayi {{count}} bategereje nta muganga uri mu kazi | {{count}} patients waiting with no doctor on duty | needs native-speaker review |
| `ops.liveSummary_one` | {{waiting}} barategereje · umuganga {{count}} uri mu kazi | {{waiting}} waiting · {{count}} doctor on duty | needs native-speaker review |
| `ops.liveSummary_other` | {{waiting}} barategereje · abaganga {{count}} bari mu kazi | {{waiting}} waiting · {{count}} doctors on duty | needs native-speaker review |
| `ops.subtitle` | Urujya n'uruza rw'abarwayi, amafaranga n'abakozi b'uyu munsi. | Live patient flow, money and team for today. | needs native-speaker review |
| `ops.updated` | Byavuguruwe saa {{time}} | Updated {{time}} | needs native-speaker review |
| `ops.noShowsCaption` | {{count}} kuri {{expected}} bafashe gahunda | {{count}} of {{expected}} booked | needs native-speaker review |
| `ops.noBookings` | Nta gahunda z'uyu munsi | No bookings today | needs native-speaker review |
| `ops.paymentsCaption_one` | Ubwishyu {{count}} bwanditswe | {{count}} payment recorded | needs native-speaker review |
| `ops.paymentsCaption_other` | Ubwishyu {{count}} bwanditswe | {{count}} payments recorded | needs native-speaker review |
| `ops.rwf` | RWF | RWF | needs native-speaker review |
| `ops.approvalsPending_one` | Icyifuzo {{count}} gitegereje kwemezwa | {{count}} request waits for your approval | needs native-speaker review |
| `ops.approvalsPending_other` | Ibyifuzo {{count}} bitegereje kwemezwa | {{count}} requests wait for your approval | needs native-speaker review |
| `ops.shiftsToReview_one` | Isanduku {{count}} yafunzwe ikeneye kugenzurwa | {{count}} closed cash shift to review | needs native-speaker review |
| `ops.shiftsToReview_other` | Amasanduku {{count}} yafunzwe akeneye kugenzurwa | {{count}} closed cash shifts to review | needs native-speaker review |
| `ops.unsignedRecords_one` | Isuzuma {{count}} ritarasinywa | {{count}} consultation not signed yet | needs native-speaker review |
| `ops.unsignedRecords_other` | Amasuzuma {{count}} atarasinywa | {{count}} consultations not signed yet | needs native-speaker review |
| `ops.disputesOpen_one` | Ikirego {{count}} gifunguye | {{count}} open dispute | needs native-speaker review |
| `ops.disputesOpen_other` | Ibirego {{count}} bifunguye | {{count}} open disputes | needs native-speaker review |
| `ops.invitationsPending_one` | Ubutumire {{count}} butaremerwa | {{count}} invitation not accepted yet | needs native-speaker review |
| `ops.invitationsPending_other` | Ubutumire {{count}} butaremerwa | {{count}} invitations not accepted yet | needs native-speaker review |
| `ops.staffWithoutMfa_one` | Umukozi {{count}} udakoresha kwinjira mu ntambwe ebyiri | {{count}} staff member without two-step sign-in | needs native-speaker review |
| `ops.staffWithoutMfa_other` | Abakozi {{count}} badakoresha kwinjira mu ntambwe ebyiri | {{count}} staff members without two-step sign-in | needs native-speaker review |
| `ops.licenceExpiring_one` | Uruhushya rurangira mu munsi {{count}} | Facility licence expires in {{count}} day | needs native-speaker review |
| `ops.licenceExpiring_other` | Uruhushya rurangira mu minsi {{count}} | Facility licence expires in {{count}} days | needs native-speaker review |
| `ops.licenceExpired` | Uruhushya rw'ikigo rwararangiye | Facility licence has expired | needs native-speaker review |
| `ops.urgent` | Byihutirwa | Urgent | needs native-speaker review |
| `ops.review` | Kugenzura | Review | needs native-speaker review |
| `ops.bookings.title` | Gahunda z'uyu munsi | Bookings today | needs native-speaker review |
| `ops.bookings.expected` | Bategerejwe | Expected | needs native-speaker review |
| `ops.bookings.arrived` | Bahageze | Arrived | needs native-speaker review |
| `ops.bookings.noShow` | Ntibaje | No-show | needs native-speaker review |
| `ops.bookings.toCome` | Bataraza | Still to come | needs native-speaker review |
| `ops.bookings.empty` | Nta gahunda z'uyu munsi. | No bookings for today. | needs native-speaker review |
| `ops.bookings.open` | Fungura kalendari | Open calendar | needs native-speaker review |
| `ops.money.title` | Amafaranga y'uyu munsi | Money today | needs native-speaker review |
| `ops.money.collected` | Yakiriwe | Collected | needs native-speaker review |
| `ops.money.bills` | Fagitire zafunguwe | Bills opened | needs native-speaker review |
| `ops.money.open` | Ayasigaye kwishyurwa | Open balances | needs native-speaker review |
| `ops.money.view` | Fungura ubwishyu | Open payments | needs native-speaker review |
| `ops.team.title` | Abakozi bari mu kazi | Team on duty | needs native-speaker review |
| `ops.team.empty` | Nta n'umwe uratangira akazi. | No one has started duty yet. | needs native-speaker review |
| `ops.team.manage` | Gucunga abakozi | Manage staff | needs native-speaker review |
| `ops.team.state.on_duty` | Ari mu kazi | On duty | needs native-speaker review |
| `ops.team.state.break` | Ari mu karuhuko | On break | needs native-speaker review |
| `ops.team.state.emergency` | Ubutabazi | Emergency | needs native-speaker review |
| `ops.team.state.off` | Ntari mu kazi | Off | needs native-speaker review |
| `reports.title` | Raporo | Reports | needs native-speaker review |
| `reports.waitToBeSeen` | Igihe cyo gutegereza muganga (iminota) | Wait to be seen (minutes) | needs native-speaker review |
| `reports.median` | Hagati | Median | needs native-speaker review |
| `reports.p90` | 9 kuri 10 babonye muganga mbere ya | 9 in 10 seen within | needs native-speaker review |
| `reports.arrivals` | Igihe abarwayi baza (ibyumweru 4 bishize) | When patients arrive (last 4 weeks) | needs native-speaker review |
| `reports.less` | Bake | Fewer | needs native-speaker review |
| `reports.more` | Benshi | More | needs native-speaker review |
| `report.noNames` | Imibare gusa, nta mazina y’abarwayi | Totals only, no patient names | needs native-speaker review |
| `report.periodLabel` | Igihe cya raporo | Report period | needs native-speaker review |
| `report.range` | Igihe | Period | needs native-speaker review |
| `report.presets.7` | Iminsi 7 ishize | Last 7 days | needs native-speaker review |
| `report.presets.30` | Iminsi 30 ishize | Last 30 days | needs native-speaker review |
| `report.presets.90` | Iminsi 90 ishize | Last 90 days | needs native-speaker review |
| `report.presets.thisMonth` | Uku kwezi | This month | needs native-speaker review |
| `report.presets.lastMonth` | Ukwezi gushize | Last month | needs native-speaker review |
| `report.presets.custom` | Hitamo amatariki | Choose dates | needs native-speaker review |
| `report.from` | Kuva | From | needs native-speaker review |
| `report.to` | Kugeza | To | needs native-speaker review |
| `report.groupBy` | Erekana ku | Show by | needs native-speaker review |
| `report.groups.day` | Munsi | Day | needs native-speaker review |
| `report.groups.week` | Cyumweru | Week | needs native-speaker review |
| `report.groups.month` | Kwezi | Month | needs native-speaker review |
| `report.updating` | Birimo kuvugururwa… | Updating… | needs native-speaker review |
| `report.periodText` | Kuva {{from}} kugeza {{to}} | {{from}} to {{to}} | needs native-speaker review |
| `report.failed` | Raporo ntiyabonetse. Reba amatariki wongere ugerageze. | The report could not be loaded. Check the dates and try again. | needs native-speaker review |
| `report.weekOf` | Icyumweru cya {{date}} | Week of {{date}} | needs native-speaker review |
| `report.minutes_one` | Iminota {{count}} | {{count}} min | needs native-speaker review |
| `report.minutes_other` | Iminota {{count}} | {{count}} min | needs native-speaker review |
| `report.empty` | Nta kintu muri iki gihe. | Nothing in this period. | needs native-speaker review |
| `report.download` | CSV | CSV | needs native-speaker review |
| `report.downloadNamed` | Kuramo {{name}} nka CSV | Download {{name}} as CSV | needs native-speaker review |
| `report.downloadFailed` | Kuramo byanze. Ongera ugerageze. | The download failed. Try again. | needs native-speaker review |
| `report.kpi.patients` | Abarwayi | Patients | needs native-speaker review |
| `report.kpi.completed_one` | Uruzinduko {{count}} rwarangiye | {{count}} visit completed | needs native-speaker review |
| `report.kpi.completed_other` | Ingendo {{count}} zarangiye | {{count}} visits completed | needs native-speaker review |
| `report.kpi.consultWait` | Igihe cyo gutegereza muganga (hagati) | Median wait for the doctor | needs native-speaker review |
| `report.kpi.p90` | 9 kuri 10 mbere y’iminota {{minutes}} | 9 in 10 within {{minutes}} min | needs native-speaker review |
| `report.kpi.collected` | Amafaranga yakiriwe | Collected | needs native-speaker review |
| `report.kpi.billed` | {{amount}} byishyuzwa | {{amount}} billed | needs native-speaker review |
| `report.kpi.noShows` | Abatitabiriye gahunda | Booking no-shows | needs native-speaker review |
| `report.kpi.noShowCount_one` | {{count}} kuri gahunda {{expected}} | {{count}} of {{expected}} bookings | needs native-speaker review |
| `report.kpi.noShowCount_other` | {{count}} kuri gahunda {{expected}} | {{count}} of {{expected}} bookings | needs native-speaker review |
| `report.visits.title` | Abarwayi bakiriwe | Patients seen | needs native-speaker review |
| `report.visits.chart` | Abarwayi muri iki gihe | Patients over the period | needs native-speaker review |
| `report.visits.patients` | Abarwayi | Patients | needs native-speaker review |
| `report.visits.completed` | Byarangiye | Completed | needs native-speaker review |
| `report.visits.left` | Bagiye batavuwe | Left without service | needs native-speaker review |
| `report.visits.emergencies` | Ibyihutirwa | Emergencies | needs native-speaker review |
| `report.visits.expected` | Gahunda zari zitegerejwe | Bookings expected | needs native-speaker review |
| `report.visits.noShows` | Ntibaje | No-shows | needs native-speaker review |
| `report.sources.title` | Uko abarwayi baje | How patients came | needs native-speaker review |
| `report.source.walk_in` | Baje nta gahunda | Walk-in | needs native-speaker review |
| `report.source.online_booking` | Gahunda kuri interineti | Online booking | needs native-speaker review |
| `report.source.phone_booking` | Gahunda kuri telefoni | Phone booking | needs native-speaker review |
| `report.source.follow_up` | Gukurikiranwa | Follow-up | needs native-speaker review |
| `report.source.remote_join` | Binjiye ku murongo bari mu rugo | Joined the queue from home | needs native-speaker review |
| `report.source.referral` | Boherejwe | Referral | needs native-speaker review |
| `report.source.emergency` | Ibyihutirwa | Emergency | needs native-speaker review |
| `report.services.title` | Kuri serivisi | By service | needs native-speaker review |
| `report.waits.title` | Igihe cyo gutegereza kuri buri cyiciro | Waiting time by stage | needs native-speaker review |
| `report.waits.median` | Hagati | Median | needs native-speaker review |
| `report.waits.p90` | 9 kuri 10 | 9 in 10 | needs native-speaker review |
| `report.waits.tickets_one` | Itike {{count}} | {{count}} ticket | needs native-speaker review |
| `report.waits.tickets_other` | Amatike {{count}} | {{count}} tickets | needs native-speaker review |
| `report.diagnoses.title` | Indwara zibonetse cyane | Top diagnoses | needs native-speaker review |
| `report.diagnoses.intro_one` | ICD-10, bivuye ku nyandiko {{count}} yasinywe. | ICD-10, from {{count}} signed note. | needs native-speaker review |
| `report.diagnoses.intro_other` | ICD-10, bivuye ku nyandiko {{count}} zasinywe. | ICD-10, from {{count}} signed notes. | needs native-speaker review |
| `report.diagnoses.referrals` | Boherejwe ahandi | Referred out | needs native-speaker review |
| `report.diagnoses.sensitive` | Zihishwa, ntizivugwa | Sensitive, not named | needs native-speaker review |
| `report.diagnoses.referredTo` | Boherejwe: {{list}} | Referred to: {{list}} | needs native-speaker review |
| `report.lab.title` | Laboratwari | Laboratory | needs native-speaker review |
| `report.lab.resulted` | Ibizamini byakozwe | Tests done | needs native-speaker review |
| `report.lab.waiting` | Bitegereje | Still waiting | needs native-speaker review |
| `report.lab.turnaround` | Igihe cy’ibisubizo (hagati) | Median turnaround | needs native-speaker review |
| `report.lab.turnaroundP90` | 9 kuri 10 mbere ya | 9 in 10 within | needs native-speaker review |
| `report.lab.byTest` | Ibizamini byakozwe ku bwoko | Tests done by test | needs native-speaker review |
| `report.lab.test` | Ikizamini | Test | needs native-speaker review |
| `report.lab.count` | Byakozwe | Done | needs native-speaker review |
| `report.lab.abnormal` | Bidasanzwe | Abnormal | needs native-speaker review |
| `report.lab.median` | Igihe (hagati) | Median turnaround | needs native-speaker review |
| `report.money.title` | Amafaranga | Money | needs native-speaker review |
| `report.money.byMethod` | Ayakiriwe ku buryo bwo kwishyura | Collected by payment method | needs native-speaker review |
| `report.money.payments_one` | Ubwishyu {{count}} | {{count}} payment | needs native-speaker review |
| `report.money.payments_other` | Ubwishyu {{count}} | {{count}} payments | needs native-speaker review |
| `report.money.byInsurer` | Ingendo z’abafite ubwishingizi ku mwishingizi | Insured visits by insurer | needs native-speaker review |
| `report.money.insurer` | Umwishingizi | Insurer | needs native-speaker review |
| `report.money.bills` | Fagitire | Bills | needs native-speaker review |
| `report.money.insurerShare` | Igice cy’umwishingizi | Insurer share | needs native-speaker review |
| `report.money.patientShare` | Igice cy’umurwayi | Patient share | needs native-speaker review |
| `report.money.exemptions` | Abasonewe | Exemptions | needs native-speaker review |
| `report.money.voidedPayments` | Ubwishyu bwahagaritswe | Payments voided | needs native-speaker review |
| `report.money.voidedBills` | Fagitire zahagaritswe | Bills voided | needs native-speaker review |
| `report.money.refunds` | Amafaranga yasubijwe | Refunds paid | needs native-speaker review |
| `report.money.creditNotes_one` | Inyemezabwishyu {{count}} yo gusubiza | {{count}} credit note | needs native-speaker review |
| `report.money.creditNotes_other` | Inyemezabwishyu {{count}} zo gusubiza | {{count}} credit notes | needs native-speaker review |
| `report.stock.title` | Imiti iri mu bubiko bwa farumasi | Pharmacy stock | needs native-speaker review |
| `report.stock.out` | Iyashize ubu | Out of stock now | needs native-speaker review |
| `report.stock.low` | Iyenda gushira ubu | Low on stock now | needs native-speaker review |
| `report.stock.received` | Ibyakiriwe | Units received | needs native-speaker review |
| `report.stock.dispensed` | Ibyatanzwe | Units dispensed | needs native-speaker review |
| `report.stock.expiring` | Yarengeje igihe cyangwa izarengeza mu minsi {{days}} | Expired or expiring within {{days}} days | needs native-speaker review |
| `report.stock.medicine` | Umuti | Medicine | needs native-speaker review |
| `report.stock.batch` | Icyiciro | Batch | needs native-speaker review |
| `report.stock.expiry` | Itariki irangiriraho | Expiry | needs native-speaker review |
| `report.stock.units` | Ibisigaye | Units left | needs native-speaker review |
| `report.stock.expired` | yarengeje igihe | expired | needs native-speaker review |
| `flow.label` | Abarwayi muri buri cyiciro | Patients in each stage | needs native-speaker review |
| `flow.expected` | Abategerejwe | Expected | needs native-speaker review |
| `flow.waiting` | Bategereje | Waiting | needs native-speaker review |
| `flow.withDoctor` | Kwa muganga | With a doctor | needs native-speaker review |
| `flow.payment` | Kwishyura | Payment | needs native-speaker review |
| `flow.pharmacy` | Farumasi | Pharmacy | needs native-speaker review |
| `flow.none` | Nta n'umwe | No one | needs native-speaker review |
| `flow.booked` | Bafashe gahunda, ntibaraza | Booked, not here yet | needs native-speaker review |
| `flow.late_one` | {{count}} yakererewe | {{count}} late | needs native-speaker review |
| `flow.late_other` | {{count}} bakererewe | {{count}} late | needs native-speaker review |
| `flow.median_one` | Hagati: iminota {{count}} | Median {{count}} min | needs native-speaker review |
| `flow.median_other` | Hagati: iminota {{count}} | Median {{count}} min | needs native-speaker review |
| `flow.called_one` | {{count}} arahamagawe | {{count}} being called | needs native-speaker review |
| `flow.called_other` | {{count}} barahamagawe | {{count}} being called | needs native-speaker review |
| `flow.slow.waiting` | Gutegereza muganga ni ho bitinda ubu. | Waiting for a doctor is the slow step right now. | needs native-speaker review |
| `flow.slow.payment` | Kwishyura ni ho bitinda ubu. | Payment is the slow step right now. | needs native-speaker review |
| `flow.slow.pharmacy` | Farumasi ni ho bitinda ubu. | The pharmacy is the slow step right now. | needs native-speaker review |
| `flow.slowDetail_one` | Umuntu {{count}}, hagati: iminota {{minutes}} kuva ahageze. | {{count}} person, median {{minutes}} min since arriving. | needs native-speaker review |
| `flow.slowDetail_other` | Abantu {{count}}, hagati: iminota {{minutes}} kuva bahageze. | {{count}} people, median {{minutes}} min since arriving. | needs native-speaker review |
| `flow.people_one` | Umuntu {{count}} | {{count}} person | needs native-speaker review |
| `flow.people_other` | Abantu {{count}} | {{count}} people | needs native-speaker review |
| `code.title` | Kwakira hakoreshejwe kode ya gahunda | Check in by booking code | needs native-speaker review |
| `code.label` | Kode ya gahunda | Booking code | needs native-speaker review |
| `code.placeholder` | urugero K03M7Q | e.g. K03M7Q | needs native-speaker review |
| `code.find` | Shaka | Find | needs native-speaker review |
| `code.notFound` | Nta gahunda ifite iyi kode hano uyu munsi cyangwa nyuma. Genzura kode n'umurwayi, cyangwa umushake ku izina. | No booking with this code here for today or later. Check the code with the patient, or find them by name. | needs native-speaker review |
| `code.onDay` | Gahunda yo ku wa {{date}} | Booked for {{date}} | needs native-speaker review |
| `code.notToday` | Si uyu munsi | Not today | needs native-speaker review |
| `code.status.checked_in` | Yamaze kwakirwa | Already checked in | needs native-speaker review |
| `code.status.cancelled` | Yahagaritswe | Cancelled | needs native-speaker review |
| `code.status.late_cancelled` | Yahagaritswe atinze | Cancelled late | needs native-speaker review |
| `code.status.no_show` | Ntiyaje | Missed | needs native-speaker review |
| `code.status.superseded` | Yahinduwe | Changed | needs native-speaker review |
| `reception.title` | Kwakira abarwayi | Front desk | needs native-speaker review |
| `reception.openBoard` | Fungura ikibaho cy'umurongo | Open the queue board | needs native-speaker review |
| `reception.numbers` | Uyu munsi ku kwakira | Today at the front desk | needs native-speaker review |
| `reception.claims` | "Ndahari" byo kwemeza | "I'm here" to confirm | needs native-speaker review |
| `reception.missed` | Abataje uyu munsi | Missed today | needs native-speaker review |
| `reception.late_one` | Gahunda {{count}} yatinze | {{count}} booking running late | needs native-speaker review |
| `reception.late_other` | Gahunda {{count}} zatinze | {{count}} bookings running late | needs native-speaker review |
| `reception.collected` | Ayakiriwe mu isanduku yanjye (RWF) | Collected in my shift (RWF) | needs native-speaker review |
| `reception.noShift` | Nta sanduku ifunguye | No cash shift open | needs native-speaker review |
| `reception.noClaims` | Nta bahageze bo kwemeza. | No arrivals to confirm. | needs native-speaker review |
| `reception.openShift` | Fungura isanduku yawe mbere yo kwakira amafaranga | Open your cash shift before taking payments | needs native-speaker review |
| `reception.next` | Abakurikira kuza | Next arrivals | needs native-speaker review |
| `reception.more_one` | Abandi {{count}} ku kibaho | {{count}} more on the board | needs native-speaker review |
| `reception.more_other` | Abandi {{count}} ku kibaho | {{count}} more on the board | needs native-speaker review |
| `print.print` | Capa | Print | needs native-speaker review |
| `print.hint` | Imashini ya 80 mm; uyihitemo mu idirishya ryo gucapa. | 80 mm thermal printer; choose it in the print window. | needs native-speaker review |
| `print.noTicket` | Uru ruzinduko nta tike rufite. | This visit has no ticket. | needs native-speaker review |
| `print.yourNumber` | Nimero yawe | Your number | needs native-speaker review |
| `print.wait` | Igihe cyo gutegereza: iminota {{min}}–{{max}} | Expected wait: {{min}}–{{max}} min | needs native-speaker review |
| `print.watch` | Reba kuri ekarani kandi wumve nimero yawe. | Watch the screen and listen for your number. | needs native-speaker review |
| `print.appointment` | Gahunda yawe itaha | Your next visit | needs native-speaker review |
| `print.code` | Kode ya gahunda | Booking code | needs native-speaker review |
| `print.bring` | Uzane iyi karita, ikarita y'ubwishingizi n'imiti yawe. | Bring this card, your insurance card and your medicines. | needs native-speaker review |
| `print.slip` | Capa itike | Print ticket slip | needs native-speaker review |
| `print.card` | Capa ikarita ya gahunda | Print appointment card | needs native-speaker review |
| `print.nextCard` | Capa ikarita y’igihe cyo kugaruka | Print next-visit card | needs native-speaker review |
| `print.nextVisit` | Igihe uzagarukira | Your next visit | needs native-speaker review |
| `print.comeMorning` | Uzaze mu gitondo; ku kwakira bazaguha nimero. | Come in the morning; reception will give you a number. | needs native-speaker review |
| `print.noFollowUp` | Muganga ntiyashyizeho igihe uyu murwayi azagarukira. | The doctor has not set a next visit for this patient. | needs native-speaker review |

## staff-web feature: setup (namespace setup)

File: `apps/staff-web/src/features/setup/locales/rw.json`

| Key | Kinyarwanda (draft) | English source | Status |
|---|---|---|---|
| `nav.setup` | Intambwe zo gutangira | Setup checklist | needs native-speaker review |
| `nav.schedules` | Gahunda z'abaganga | Doctor schedules | needs native-speaker review |
| `nav.mySchedule` | Gahunda yanjye | My schedule | needs native-speaker review |
| `save` | Bika impinduka | Save changes | needs native-speaker review |
| `saved` | Byabitswe. | Saved. | needs native-speaker review |
| `cancel` | Reka | Cancel | needs native-speaker review |
| `close` | Funga | Close | needs native-speaker review |
| `edit` | Hindura | Edit | needs native-speaker review |
| `remove` | Kuraho | Remove | needs native-speaker review |
| `retry` | Ongera ugerageze | Try again | needs native-speaker review |
| `reload` | Fungura verisiyo nshya | Load the latest version | needs native-speaker review |
| `previous` | Ibibanza | Previous | needs native-speaker review |
| `next` | Ibikurikira | Next | needs native-speaker review |
| `failed` | Ntibyakunze. Reba interineti wongere ugerageze. | That did not work. Check your connection and try again. | needs native-speaker review |
| `loadFailed` | Uru rupapuro ntirwafungutse. | This page could not load. | needs native-speaker review |
| `conflictTitle` | Undi muntu yabihinduye | Someone else changed this | needs native-speaker review |
| `conflictBody` | Fungura verisiyo nshya, hanyuma wongere uhindure. | Load the latest version, then make your change again. | needs native-speaker review |
| `languages.rw` | Ikinyarwanda | Kinyarwanda | needs native-speaker review |
| `languages.en` | Icyongereza | English | needs native-speaker review |
| `languages.fr` | Igifaransa | French | needs native-speaker review |
| `status.setup` | Kiri gutegurwa | Setting up | needs native-speaker review |
| `status.live` | Kirakora | Live | needs native-speaker review |
| `status.approved` | Cyemejwe | Approved | needs native-speaker review |
| `status.suspended` | Cyahagaritswe | Suspended | needs native-speaker review |
| `facilityTypes.hospital` | Ibitaro | Hospital | needs native-speaker review |
| `facilityTypes.health_centre` | Ikigo nderabuzima | Health centre | needs native-speaker review |
| `facilityTypes.clinic` | Ivuriro | Clinic | needs native-speaker review |
| `facilityTypes.private_clinic` | Ivuriro ryigenga | Private clinic | needs native-speaker review |
| `facilityTypes.polyclinic` | Polikilinike | Polyclinic | needs native-speaker review |
| `facilityTypes.pharmacy` | Farumasi | Pharmacy | needs native-speaker review |
| `councils.rmdc` | Urugaga rw'abaganga n'abaganga b'amenyo (RMDC) | Medical and Dental Council (RMDC) | needs native-speaker review |
| `councils.ncnm` | Urugaga rw'abaforomo n'ababyaza (NCNM) | Nursing and Midwifery Council (NCNM) | needs native-speaker review |
| `councils.npc` | Urugaga rw'abafarumasiye (NPC) | Pharmacy Council (NPC) | needs native-speaker review |
| `councils.other` | Urundi rugaga | Other council | needs native-speaker review |
| `councils.rahpc` | Urugaga rw’abakora indi myuga y’ubuzima (RAHPC) | Allied Health Professions Council (RAHPC) | needs native-speaker review |
| `today.title` | Rangiza gutegura ikigo cyawe | Finish setting up your facility | needs native-speaker review |
| `today.open` | Fungura intambwe | Open checklist | needs native-speaker review |
| `today.leaveTitle` | Gusaba ikiruhuko | Leave requests | needs native-speaker review |
| `today.leaveCount_one` | Ubusabe {{count}} butegereje icyemezo cyawe | {{count}} request waits for your decision | needs native-speaker review |
| `today.leaveCount_other` | Ubusabe {{count}} butegereje icyemezo cyawe | {{count}} requests wait for your decision | needs native-speaker review |
| `today.review` | Reba ubusabe | Review requests | needs native-speaker review |
| `checklist.title` | Intambwe zo gutangira | Setup checklist | needs native-speaker review |
| `checklist.progress` | Intambwe {{done}} kuri {{total}} zarangiye | {{done}} of {{total}} steps done | needs native-speaker review |
| `checklist.nextStep` | Ikurikira: {{step}} | Next: {{step}} | needs native-speaker review |
| `checklist.allDone` | Intambwe zose zarangiye. Ushobora gutangira gukora. | Every step is done. You can go live. | needs native-speaker review |
| `checklist.continue` | Komeza | Continue setup | needs native-speaker review |
| `checklist.done` | Byarangiye | Done | needs native-speaker review |
| `checklist.todo` | Bitarakorwa | To do | needs native-speaker review |
| `checklist.setUp` | Tegura | Set up | needs native-speaker review |
| `checklist.review` | Reba | Review | needs native-speaker review |
| `checklist.goLiveTitle` | Tangira gukora | Go live | needs native-speaker review |
| `checklist.goLive` | Tangira gukora | Go live | needs native-speaker review |
| `checklist.readyBody` | Byose biteguye. Gutangira bituma abarwayi babona ikigo. | Everything is ready. Going live makes the facility visible to patients. | needs native-speaker review |
| `checklist.notReadyBody` | Banza urangize intambwe zanditse ngo “Bitarakorwa”. | Finish the steps marked “To do” first. | needs native-speaker review |
| `checklist.liveTitle` | Ikigo cyawe kirakora | Your facility is live | needs native-speaker review |
| `checklist.liveBody` | Abarwayi bashobora kukubona, gufata gahunda no kujya ku murongo. | Patients can find you, book visits and join queues. | needs native-speaker review |
| `checklist.items.profile` | Umwirondoro w'ikigo | Facility profile | needs native-speaker review |
| `checklist.items.departments` | Amashami | Departments | needs native-speaker review |
| `checklist.items.services` | Serivisi | Services | needs native-speaker review |
| `checklist.items.service_points` | Ibyumba n'ameza | Rooms and desks | needs native-speaker review |
| `checklist.items.opening_hours` | Amasaha yo gukora | Opening hours | needs native-speaker review |
| `checklist.items.staff` | Umuganga ufite uruhushya rwemejwe | A doctor with an attested licence | needs native-speaker review |
| `checklist.items.schedules` | Gahunda z'abaganga | Doctor schedules | needs native-speaker review |
| `checklist.items.tariff` | Ibiciro bya buri serivisi | Prices for every service | needs native-speaker review |
| `checklist.items.insurers` | Amabwiriza y'ubwishingizi | Insurer rules | needs native-speaker review |
| `checklist.items.licence` | Uruhushya rwo gukora rufite agaciro | Valid operating licence | needs native-speaker review |
| `checklist.hints.profile_one` | Aho mubarizwa, aderesi n'ahantu | Contact details, address and location | needs native-speaker review |
| `checklist.hints.profile_other` | Aho mubarizwa, aderesi n'ahantu | Contact details, address and location | needs native-speaker review |
| `checklist.hints.departments_one` | Ishami {{count}} | {{count}} department | needs native-speaker review |
| `checklist.hints.departments_other` | Amashami {{count}} | {{count}} departments | needs native-speaker review |
| `checklist.hints.services_one` | Serivisi {{count}} ikora | {{count}} active service | needs native-speaker review |
| `checklist.hints.services_other` | Serivisi {{count}} zikora | {{count}} active services | needs native-speaker review |
| `checklist.hints.service_points_one` | Icyumba cyangwa ameza {{count}} | {{count}} room or desk | needs native-speaker review |
| `checklist.hints.service_points_other` | Ibyumba n'ameza {{count}} | {{count}} rooms and desks | needs native-speaker review |
| `checklist.hints.opening_hours_one` | Hakora umunsi {{count}} mu cyumweru | Open {{count}} day a week | needs native-speaker review |
| `checklist.hints.opening_hours_other` | Hakora iminsi {{count}} mu cyumweru | Open {{count}} days a week | needs native-speaker review |
| `checklist.hints.staff_one` | Umuganga {{count}} wemejwe | {{count}} doctor attested | needs native-speaker review |
| `checklist.hints.staff_other` | Abaganga {{count}} bemejwe | {{count}} doctors attested | needs native-speaker review |
| `checklist.hints.schedules_one` | Buri serivisi ifatirwa gahunda ikenera igihe cy'icyumweru ({{count}} yateganyijwe) | Every bookable service needs a weekly session ({{count}} scheduled) | needs native-speaker review |
| `checklist.hints.schedules_other` | Buri serivisi ifatirwa gahunda ikenera igihe cy'icyumweru ({{count}} zateganyijwe) | Every bookable service needs a weekly session ({{count}} scheduled) | needs native-speaker review |
| `checklist.hints.tariff_one` | Serivisi {{count}} ifite igiciro | {{count}} service priced | needs native-speaker review |
| `checklist.hints.tariff_other` | Serivisi {{count}} zifite ibiciro | {{count}} services priced | needs native-speaker review |
| `checklist.hints.insurers_one` | Itegeko {{count}} ry'ubwishingizi, cyangwa “nta bwishingizi” mu kwishyuza | {{count}} insurer rule, or “no insurers” in billing rules | needs native-speaker review |
| `checklist.hints.insurers_other` | Amategeko {{count}} y'ubwishingizi, cyangwa “nta bwishingizi” mu kwishyuza | {{count}} insurer rules, or “no insurers” in billing rules | needs native-speaker review |
| `checklist.hints.licence_one` | Bigenzurwa ku ruhushya rwa MINISANTE | Checked from your MoH licence | needs native-speaker review |
| `checklist.hints.licence_other` | Bigenzurwa ku ruhushya rwa MINISANTE | Checked from your MoH licence | needs native-speaker review |
| `settings.title` | Igenamiterere | Settings | needs native-speaker review |
| `settings.checklistLink` | Intambwe zo gutangira | Setup checklist | needs native-speaker review |
| `settings.sections.profile.title` | Umwirondoro w'ikigo | Facility profile | needs native-speaker review |
| `settings.sections.profile.description` | Aho mubarizwa, ahantu, amafoto n'ibisobanuro. | Contact details, location, photos and description. | needs native-speaker review |
| `settings.sections.services.title` | Serivisi n'ibyumba | Services and rooms | needs native-speaker review |
| `settings.sections.services.description` | Amashami, serivisi n'inyuguti za tike, ibyumba n'ameza. | Departments, services with ticket prefixes, rooms and desks. | needs native-speaker review |
| `settings.sections.hours.title` | Amasaha yo gukora | Opening hours | needs native-speaker review |
| `settings.sections.hours.description` | Amasaha y'icyumweru, iminsi ifunze na kalendari abarwayi babona. | Weekly hours, closures and the calendar patients see. | needs native-speaker review |
| `settings.sections.schedules.title` | Gahunda z'abaganga | Doctor schedules | needs native-speaker review |
| `settings.sections.schedules.description` | Ibihe bya buri muganga mu cyumweru n'ibiruhuko. | Each doctor's weekly sessions and leave. | needs native-speaker review |
| `settings.sections.tariffs.title` | Ibiciro | Prices | needs native-speaker review |
| `settings.sections.tariffs.description` | Urutonde rw'ibiciro, n'impinduka zitangira ku itariki. | The price list, with changes from a date. | needs native-speaker review |
| `settings.sections.insurers.title` | Ubwishingizi | Insurers | needs native-speaker review |
| `settings.sections.insurers.description` | Ibyo buri bwishingizi bwishyura n'uruhare rw'umurwayi. | What each insurer covers and the patient's share. | needs native-speaker review |
| `settings.sections.rules.title` | Amabwiriza | Rules | needs native-speaker review |
| `settings.sections.rules.description` | Umurongo, gahunda, kwishyuza, inyandiko n'ibibutsa. | Queue, booking, billing, documents and reminders. | needs native-speaker review |
| `settings.sections.history.title` | Amateka y'impinduka | Change history | needs native-speaker review |
| `settings.sections.history.description` | Uwahinduye igenamiterere, n'igihe. | Who changed which setting, and when. | needs native-speaker review |
| `settings.sections.displays.title` | Televiziyo z’aho bategerereza | Waiting-room screens | needs native-speaker review |
| `settings.sections.displays.description` | Link za televiziyo yerekana nimero za tike. | Links for the TV that shows ticket numbers. | needs native-speaker review |
| `settings.groups.facility` | Ikigo cyawe | Your facility | needs native-speaker review |
| `settings.groups.care` | Ubuvuzi na gahunda | Care and scheduling | needs native-speaker review |
| `settings.groups.money` | Ibiciro n'ubwishingizi | Prices and insurance | needs native-speaker review |
| `settings.groups.policy` | Amategeko n'amateka | Rules and history | needs native-speaker review |
| `profile.identity` | Iyandikwa | Registration | needs native-speaker review |
| `profile.name` | Izina | Name | needs native-speaker review |
| `profile.type` | Ubwoko | Type | needs native-speaker review |
| `profile.status` | Imiterere | Status | needs native-speaker review |
| `profile.platformManaged` | Izina, ubwoko n'urwego rw'ubuvuzi biva ku busabe bwanyu bwemejwe. Saba ubufasha bwa MediLink kubihindura. | Name, type and level of care come from your approved application. Ask MediLink support to change them. | needs native-speaker review |
| `profile.contact` | Aho mubarizwa | Contact | needs native-speaker review |
| `profile.phone` | Telefoni | Phone | needs native-speaker review |
| `profile.email` | Imeyili | Email | needs native-speaker review |
| `profile.website` | Urubuga | Website | needs native-speaker review |
| `profile.address` | Aderesi | Street address | needs native-speaker review |
| `profile.location` | Ahantu ku ikarita | Location on the map | needs native-speaker review |
| `profile.latitude` | Latitude | Latitude | needs native-speaker review |
| `profile.longitude` | Longitude | Longitude | needs native-speaker review |
| `profile.useLocation` | Koresha aho ndi | Use my location | needs native-speaker review |
| `profile.locationUnavailable` | Aho uri ntihaboneka. Andika imibare y'ahantu. | Your location is not available. Type the coordinates instead. | needs native-speaker review |
| `profile.outsideRwanda` | Iyi mibare iri hanze y'u Rwanda. Yigenzure. | These coordinates are outside Rwanda. Check them. | needs native-speaker review |
| `profile.description` | Ibisobanuro | Description | needs native-speaker review |
| `profile.descriptionHint` | Interuro nke muri buri rurimi: ibyo muvura n'uko babageraho. | A few sentences in each language: what you treat and how to find you. | needs native-speaker review |
| `profile.photos` | Amafoto | Photos | needs native-speaker review |
| `profile.photosHint_one` | Ifoto {{count}} kuri 6. JPEG, PNG cyangwa WebP. Iya mbere ni yo igaragara mbere ku rupapuro rwanyu. | {{count}} of 6 photos. JPEG, PNG or WebP. The first is the cover on your public page. | needs native-speaker review |
| `profile.photosHint_other` | Amafoto {{count}} kuri 6. JPEG, PNG cyangwa WebP. Iya mbere ni yo igaragara mbere ku rupapuro rwanyu. | {{count}} of 6 photos. JPEG, PNG or WebP. The first is the cover on your public page. | needs native-speaker review |
| `profile.addPhoto` | Ongeraho ifoto | Add photo | needs native-speaker review |
| `profile.photoN` | Ifoto ya {{n}} | Photo {{n}} | needs native-speaker review |
| `profile.removePhotoN` | Kuraho ifoto ya {{n}} | Remove photo {{n}} | needs native-speaker review |
| `profile.viewPublic` | Reba urupapuro rubonwa na bose | View public page | needs native-speaker review |
| `profile.newTab` | (rifunguka mu idirishya rishya) | (opens in a new tab) | needs native-speaker review |
| `profile.levelOfCare` | Urwego rw'ubuvuzi | Level of care | needs native-speaker review |
| `profile.levels.primary` | Ubuvuzi bw'ibanze | Primary care | needs native-speaker review |
| `profile.levels.secondary` | Ubuvuzi bwisumbuye | Secondary care | needs native-speaker review |
| `profile.levels.tertiary` | Ubuvuzi bwo ku rwego rwo hejuru | Tertiary care | needs native-speaker review |
| `profile.levelUnknown` | Ntibyashyizweho | Not set | needs native-speaker review |
| `profile.cover` | Ifoto nyamukuru | Cover | needs native-speaker review |
| `profile.emergencyTitle` | Ubutabazi bwihuse | Emergency care | needs native-speaker review |
| `profile.emergency` | Serivisi y'ubutabazi bwihuse amasaha 24 | 24-hour emergency department | needs native-speaker review |
| `profile.emergencyHint` | Bikore gusa niba mwakira indembe ku manywa na nijoro. Ivuriro ryanyu rizagaragara mbere ku rupapuro rw'ubutabazi. | Turn on only if you receive emergencies day and night. Your facility is then listed first on the public Emergency page. | needs native-speaker review |
| `catalogue.services` | Serivisi | Services | needs native-speaker review |
| `catalogue.departments` | Amashami | Departments | needs native-speaker review |
| `catalogue.points` | Ibyumba n'ameza | Rooms and desks | needs native-speaker review |
| `catalogue.serviceCount_one` | Serivisi {{count}} ikora | {{count}} active service | needs native-speaker review |
| `catalogue.serviceCount_other` | Serivisi {{count}} zikora | {{count}} active services | needs native-speaker review |
| `catalogue.departmentCount_one` | Ishami {{count}} | {{count}} department | needs native-speaker review |
| `catalogue.departmentCount_other` | Amashami {{count}} | {{count}} departments | needs native-speaker review |
| `catalogue.pointCount_one` | Icyumba cyangwa ameza {{count}} | {{count}} room or desk | needs native-speaker review |
| `catalogue.pointCount_other` | Ibyumba n'ameza {{count}} | {{count}} rooms and desks | needs native-speaker review |
| `catalogue.addService` | Ongeraho serivisi | Add service | needs native-speaker review |
| `catalogue.addDepartment` | Ongeraho ishami | Add department | needs native-speaker review |
| `catalogue.addPoint` | Ongeraho icyumba cyangwa ameza | Add room or desk | needs native-speaker review |
| `catalogue.names` | Izina muri buri rurimi | Name in each language | needs native-speaker review |
| `catalogue.department` | Ishami | Department | needs native-speaker review |
| `catalogue.prefix` | Inyuguti ya tike | Ticket prefix | needs native-speaker review |
| `catalogue.prefixHint` | Inyuguti 1 kugeza kuri 3 | 1 to 3 letters | needs native-speaker review |
| `catalogue.duration` | Iminota kuri buri murwayi | Minutes per patient | needs native-speaker review |
| `catalogue.minutes_one` | Umunota {{count}} | {{count}} minute | needs native-speaker review |
| `catalogue.minutes_other` | Iminota {{count}} | {{count}} minutes | needs native-speaker review |
| `catalogue.bookable` | Ifatirwa gahunda kuri interineti | Bookable online | needs native-speaker review |
| `catalogue.walkIn` | Abaje batafashe gahunda | Walk-ins | needs native-speaker review |
| `catalogue.remoteJoin` | Kujya ku murongo uri mu rugo | Join the queue from home | needs native-speaker review |
| `catalogue.retire` | Hagarika serivisi | Retire service | needs native-speaker review |
| `catalogue.retired` | Yahagaritswe | Retired | needs native-speaker review |
| `catalogue.active` | Irakora | Active | needs native-speaker review |
| `catalogue.retireDepartmentHint` | Banza uhagarike serivisi zaryo. | Retire its services first. | needs native-speaker review |
| `catalogue.templatesEnded_one` | Yahagaritswe. Igihe {{count}} cy'icyumweru cyarangijwe. | Retired. {{count}} weekly session was ended. | needs native-speaker review |
| `catalogue.templatesEnded_other` | Yahagaritswe. Ibihe {{count}} by'icyumweru byarangijwe. | Retired. {{count}} weekly sessions were ended. | needs native-speaker review |
| `catalogue.pointName` | Izina | Name | needs native-speaker review |
| `catalogue.kind` | Ubwoko | Kind | needs native-speaker review |
| `catalogue.kinds.room` | Icyumba cyo kuvuriramo | Consultation room | needs native-speaker review |
| `catalogue.kinds.desk` | Ameza | Desk | needs native-speaker review |
| `catalogue.kinds.window` | Idirishya | Window | needs native-speaker review |
| `catalogue.kinds.lab` | Laboratwari | Laboratory | needs native-speaker review |
| `catalogue.kinds.other` | Ibindi | Other | needs native-speaker review |
| `catalogue.linkedServices` | Serivisi zitangirwa hano | Services seen here | needs native-speaker review |
| `catalogue.noServicesLinked` | Nta serivisi irahuzwa | No service linked yet | needs native-speaker review |
| `catalogue.noServicesTitle` | Nta serivisi irahari | No services yet | needs native-speaker review |
| `catalogue.noServices` | Ongeraho serivisi ya mbere abarwayi bashobora gufatira gahunda. | Add the first service patients can book or queue for. | needs native-speaker review |
| `catalogue.noDepartmentsTitle` | Nta shami rirahari | No departments yet | needs native-speaker review |
| `catalogue.noDepartments` | Amashami ahuza serivisi zanyu, urugero Ubuvuzi rusange cyangwa Ubuvuzi bw'abana. | Departments group your services, for example General OPD or Pediatrics. | needs native-speaker review |
| `catalogue.noPointsTitle` | Nta byumba cyangwa ameza birahari | No rooms or desks yet | needs native-speaker review |
| `catalogue.noPoints` | Ongeraho ibyumba n'ameza abarwayi bakirirwamo. | Add the rooms and desks where patients are seen or served. | needs native-speaker review |
| `hours.scope` | Amasaha ya | Hours for | needs native-speaker review |
| `hours.wholeFacility` | Ikigo cyose | Whole facility | needs native-speaker review |
| `hours.week` | Amasaha y'icyumweru | Weekly hours | needs native-speaker review |
| `hours.copyMonday` | Koporora kuwa mbere ku minsi y'akazi | Copy Monday to weekdays | needs native-speaker review |
| `hours.inherits` | Iyi serivisi ikurikiza amasaha y'ikigo kugeza ubitse ayayo. | This service follows the facility hours until you save its own. | needs native-speaker review |
| `hours.opens` | Hafungura | Opens | needs native-speaker review |
| `hours.closes` | Hafunga | Closes | needs native-speaker review |
| `hours.order` | Isaha yo kurangiza igomba kuba nyuma yo gutangira. | The end must be after the start. | needs native-speaker review |
| `hours.breakStarts` | Ikiruhuko gitangira | Break starts | needs native-speaker review |
| `hours.breakEnds` | Ikiruhuko kirangira | Break ends | needs native-speaker review |
| `hours.breakOrder` | Ikiruhuko kigomba kurangira nyuma yo gutangira. | The break must end after it starts. | needs native-speaker review |
| `hours.breakInside` | Ikiruhuko kigomba kuba mu masaha yo gukora. | The break must sit inside opening hours. | needs native-speaker review |
| `hours.openingFor` | Amasaha yo gukora, {{day}} | Opening hours, {{day}} | needs native-speaker review |
| `hours.breakFor` | Ikiruhuko, {{day}} | Break, {{day}} | needs native-speaker review |
| `hours.addBreak` | Ongeraho ikiruhuko | Add break | needs native-speaker review |
| `hours.removeBreak` | Kuraho ikiruhuko, {{day}} | Remove break, {{day}} | needs native-speaker review |
| `hours.closed` | Harafunze | Closed | needs native-speaker review |
| `hours.save` | Bika amasaha | Save hours | needs native-speaker review |
| `hours.preview` | Ibyumweru bine biri imbere | Next four weeks | needs native-speaker review |
| `hours.previewHint` | Amasaha ukuyemo iminsi ifunze, iminsi mikuru n'Umuganda. | Hours minus closures, public holidays and Umuganda. | needs native-speaker review |
| `hours.legendOpen` | Harafunguye | Open | needs native-speaker review |
| `hours.umuganda` | Umuganda | Umuganda | needs native-speaker review |
| `hours.events` | Iminsi ifunze n'iminsi idasanzwe | Closures and special days | needs native-speaker review |
| `hours.eventsHint` | Impinduka z'igihe gito ku masaha y'icyumweru. | One-off changes to the weekly hours. | needs native-speaker review |
| `hours.addEvent` | Ongeraho umunsi ufunze cyangwa udasanzwe | Add closure or special day | needs native-speaker review |
| `hours.noEventsTitle` | Nta munsi ufunze uteganyijwe | No closures planned | needs native-speaker review |
| `hours.noEvents` | Ongeraho umunsi ufunze w'amahugurwa, w'ibarura cyangwa umunsi mukuru mudakora. | Add a closure for a training day, an inventory day or a holiday you do not open on. | needs native-speaker review |
| `hours.kind` | Ibiba | What happens | needs native-speaker review |
| `hours.kinds.closure` | Harafunze | Closed | needs native-speaker review |
| `hours.kinds.special_day` | Amasaha adasanzwe | Special hours | needs native-speaker review |
| `hours.kinds.holiday_override` | Hakora ku munsi mukuru | Open on a holiday | needs native-speaker review |
| `hours.from` | Kuva | From | needs native-speaker review |
| `hours.to` | Kugeza | To | needs native-speaker review |
| `hours.reason` | Impamvu | Reason | needs native-speaker review |
| `hours.dateOrder` | Itariki yo kurangiza igomba kuba ku itariki yo gutangira cyangwa nyuma yayo. | The end date must be on or after the start date. | needs native-speaker review |
| `schedules.doctors` | Abaganga | Doctors | needs native-speaker review |
| `schedules.weeklyHours` | Amasaha mu cyumweru | Hours per week | needs native-speaker review |
| `schedules.sessions` | Ibihe by'icyumweru | Weekly sessions | needs native-speaker review |
| `schedules.leaveThisWeek` | Iminsi y'ikiruhuko muri iki cyumweru | Days off this week | needs native-speaker review |
| `schedules.weekOf` | Icyumweru cya {{name}} | Week of {{name}} | needs native-speaker review |
| `schedules.gridView` | Icyumweru | Week | needs native-speaker review |
| `schedules.tableView` | Urutonde | List | needs native-speaker review |
| `schedules.day` | Umunsi | Day | needs native-speaker review |
| `schedules.time` | Isaha | Time | needs native-speaker review |
| `schedules.session` | Igihe | Session | needs native-speaker review |
| `schedules.actions` | Ibikorwa | Actions | needs native-speaker review |
| `schedules.addOn` | Ongeraho igihe kuwa {{day}} | Add session on {{day}} | needs native-speaker review |
| `schedules.noSession` | Nta gihe | No session | needs native-speaker review |
| `schedules.newSession` | Igihe gishya cya {{name}} | New session for {{name}} | needs native-speaker review |
| `schedules.editSession` | Hindura igihe | Edit session | needs native-speaker review |
| `schedules.endSession` | Rangiza iki gihe | End this session | needs native-speaker review |
| `schedules.starts` | Gitangira | Starts | needs native-speaker review |
| `schedules.ends` | Kirangira | Ends | needs native-speaker review |
| `schedules.service` | Serivisi | Service | needs native-speaker review |
| `schedules.point` | Icyumba | Room | needs native-speaker review |
| `schedules.slot` | Iminota ya buri gahunda | Slot minutes | needs native-speaker review |
| `schedules.capacity` | Abarwayi kuri buri gahunda | Patients per slot | needs native-speaker review |
| `schedules.share` | Igice cya interineti % | Online share % | needs native-speaker review |
| `schedules.shareHint` | Igisigaye ni icy'abaje batafashe gahunda | The rest stays for walk-ins | needs native-speaker review |
| `schedules.overlap` | Ibi bihurirana n'ikindi gihe cy'uyu muganga. | This overlaps another session of the same doctor. | needs native-speaker review |
| `schedules.unattestedTitle` | Uruhushya ntirurahamywa | Licence not attested yet | needs native-speaker review |
| `schedules.unattested` | Banza uhamye uruhushya rw'uyu muganga mbere yo kongeraho ibihe. | Attest this doctor's licence before adding sessions. | needs native-speaker review |
| `schedules.goToStaff` | Jya ku bakozi | Go to Staff | needs native-speaker review |
| `schedules.busyElsewhereTitle` | Uyu muganga akora n'ahandi | This doctor also works elsewhere | needs native-speaker review |
| `schedules.busyElsewhere` | {{day}} {{start}}–{{end}} ku kindi kigo | {{day}} {{start}}–{{end}} at another facility | needs native-speaker review |
| `schedules.noDoctorsTitle` | Nta baganga barahari | No doctors yet | needs native-speaker review |
| `schedules.noDoctors` | Tumira umuganga, uhamye uruhushya rwe, hanyuma utegure ibihe bye. | Invite a doctor, then attest their licence to plan sessions. | needs native-speaker review |
| `schedules.inviteDoctor` | Tumira umuganga | Invite a doctor | needs native-speaker review |
| `schedules.exceptions` | Ibiruhuko n'ibihe by'inyongera | Leave and extra sessions | needs native-speaker review |
| `schedules.noExceptionsTitle` | Nta busabe bw'ikiruhuko | No leave requests | needs native-speaker review |
| `schedules.noExceptions` | Ubusabe bw'abaganga bugaragara hano ngo ubufatire icyemezo. | Requests from doctors appear here for your decision. | needs native-speaker review |
| `schedules.kinds.leave` | Ikiruhuko | Leave | needs native-speaker review |
| `schedules.kinds.training` | Amahugurwa | Training | needs native-speaker review |
| `schedules.kinds.extra_session` | Igihe cy'inyongera | Extra session | needs native-speaker review |
| `schedules.status.requested` | Birategereje | Waiting | needs native-speaker review |
| `schedules.status.approved` | Byemewe | Approved | needs native-speaker review |
| `schedules.status.rejected` | Byanzwe | Rejected | needs native-speaker review |
| `schedules.status.cancelled` | Byahagaritswe | Cancelled | needs native-speaker review |
| `schedules.approve` | Emeza | Approve | needs native-speaker review |
| `schedules.reject` | Anga | Reject | needs native-speaker review |
| `schedules.rejectTitle` | Kwanga ubusabe bw'ikiruhuko | Reject leave request | needs native-speaker review |
| `schedules.rejectReason` | Impamvu (umuganga arayibona) | Reason (the doctor sees it) | needs native-speaker review |
| `mine.title` | Gahunda yanjye | My schedule | needs native-speaker review |
| `mine.week` | Icyumweru cyanjye | My week | needs native-speaker review |
| `mine.requestLeave` | Saba ikiruhuko | Request leave | needs native-speaker review |
| `mine.requestHint` | Umuyobozi w'ikigo arabwemeza cyangwa akabwanga. | Your facility admin approves or rejects it. | needs native-speaker review |
| `mine.lastDay` | Umunsi wa nyuma w'ikiruhuko | Last day off | needs native-speaker review |
| `mine.send` | Ohereza ubusabe | Send request | needs native-speaker review |
| `mine.leave` | Ibiruhuko byanjye | My leave | needs native-speaker review |
| `mine.cancel` | Hagarika ubusabe | Cancel request | needs native-speaker review |
| `mine.noLeaveTitle` | Nta kiruhuko wasabye | No leave requested | needs native-speaker review |
| `mine.noLeave` | Ubusabe wohereje bugaragara hano hamwe n'icyemezo. | Requests you send appear here with their decision. | needs native-speaker review |
| `mine.noScheduleTitle` | Nta bihe birahari | No sessions yet | needs native-speaker review |
| `mine.noSchedule` | Umuyobozi ntarategura ibihe byawe. | Your facility admin has not planned your sessions yet. | needs native-speaker review |
| `tariffs.add` | Ongeraho igiciro | Add price | needs native-speaker review |
| `tariffs.all` | Byose | All | needs native-speaker review |
| `tariffs.item` | Ikintu | Item | needs native-speaker review |
| `tariffs.kind` | Ubwoko | Kind | needs native-speaker review |
| `tariffs.kinds.service` | Serivisi | Service | needs native-speaker review |
| `tariffs.kinds.procedure` | Igikorwa cy'ubuvuzi | Procedure | needs native-speaker review |
| `tariffs.kinds.medicine` | Umuti | Medicine | needs native-speaker review |
| `tariffs.kinds.other` | Ibindi | Other | needs native-speaker review |
| `tariffs.price` | Igiciro | Price | needs native-speaker review |
| `tariffs.since` | Kuva | Since | needs native-speaker review |
| `tariffs.change` | Hindura igiciro | Change price | needs native-speaker review |
| `tariffs.history` | Amateka y'ibiciro | Price history | needs native-speaker review |
| `tariffs.code` | Kode | Code | needs native-speaker review |
| `tariffs.codeHint` | Inyuguti, imibare, - . _ | Letters, numbers, - . _ | needs native-speaker review |
| `tariffs.name` | Izina | Name | needs native-speaker review |
| `tariffs.service` | Serivisi | Service | needs native-speaker review |
| `tariffs.validFrom` | Guhera | From | needs native-speaker review |
| `tariffs.changeTitle` | Hindura igiciro cya {{name}} | Change the price of {{name}} | needs native-speaker review |
| `tariffs.changeHint` | Igiciro kiriho: {{amount}} | Current price: {{amount}} | needs native-speaker review |
| `tariffs.newPrice` | Igiciro gishya | New price | needs native-speaker review |
| `tariffs.saveChange` | Bika igiciro gishya | Save new price | needs native-speaker review |
| `tariffs.historyTitle` | Amateka ya {{name}} | History of {{name}} | needs native-speaker review |
| `tariffs.current` | ubu | now | needs native-speaker review |
| `tariffs.emptyTitle` | Nta biciro birahari | No prices yet | needs native-speaker review |
| `tariffs.empty` | Ongeraho igiciro cya buri serivisi kugira ngo abarwayi babone ikiguzi mbere yo kuza. | Add a price for each service so patients see costs before they come. | needs native-speaker review |
| `insurers.add` | Ongeraho itegeko ry'ubwishingizi | Add insurer rule | needs native-speaker review |
| `insurers.insurer` | Ubwishingizi | Insurer | needs native-speaker review |
| `insurers.since` | Guhera {{date}} | From {{date}} | needs native-speaker review |
| `insurers.patientPays` | umurwayi yishyura | patient pays | needs native-speaker review |
| `insurers.insurerPays` | ubwishingizi bwishyura | insurer pays | needs native-speaker review |
| `insurers.allServices` | Serivisi zose zirishyurwa | All services covered | needs native-speaker review |
| `insurers.someServices_one` | Serivisi {{count}} irishyurwa | {{count}} service covered | needs native-speaker review |
| `insurers.someServices_other` | Serivisi {{count}} zirishyurwa | {{count}} services covered | needs native-speaker review |
| `insurers.coveredServices` | Serivisi zishyurwa | Covered services | needs native-speaker review |
| `insurers.referral` | Bisaba transfert | Needs a referral | needs native-speaker review |
| `insurers.ceiling` | Kugeza kuri {{amount}} ku nshuro | Up to {{amount}} per visit | needs native-speaker review |
| `insurers.ceilingLabel` | Ntarengwa ku nshuro | Maximum per visit | needs native-speaker review |
| `insurers.exclusions_one` | Ikintu {{count}} kitishyurwa | {{count}} item excluded | needs native-speaker review |
| `insurers.exclusions_other` | Ibintu {{count}} bitishyurwa | {{count}} items excluded | needs native-speaker review |
| `insurers.excluded` | Ibyo ubwishingizi butishyura | Items the insurer does not pay | needs native-speaker review |
| `insurers.share` | Uruhare rw'umurwayi % | Patient share % | needs native-speaker review |
| `insurers.shareHint` | 0 kugeza 100 | 0 to 100 | needs native-speaker review |
| `insurers.shareRange` | Andika umubare kuva kuri 0 kugeza 100. | Use a number from 0 to 100. | needs native-speaker review |
| `insurers.emptyTitle` | Nta mategeko y'ubwishingizi arahari | No insurer rules yet | needs native-speaker review |
| `insurers.empty` | Ongeraho ubwishingizi mwakira, cyangwa ukoreshe “nta bwishingizi” mu mabwiriza yo kwishyuza. | Add the insurers you accept, or switch on “no insurers” in the billing rules. | needs native-speaker review |
| `rules.sections.queue` | Umurongo | Queue | needs native-speaker review |
| `rules.sections.booking` | Gahunda | Booking | needs native-speaker review |
| `rules.sections.billing` | Kwishyuza | Billing | needs native-speaker review |
| `rules.sections.documents` | Inyandiko | Documents | needs native-speaker review |
| `rules.sections.notifications` | Ibibutsa | Reminders | needs native-speaker review |
| `rules.sections.branding` | Umutwe w'impapuro | Letterhead | needs native-speaker review |
| `rules.range` | Kuva kuri {{min}} kugeza {{max}} | From {{min}} to {{max}} | needs native-speaker review |
| `rules.billingStepUp` | Impinduka zo kwishyuza zigusaba kwemeza ko ari wowe. | Billing changes ask you to confirm it is you. | needs native-speaker review |
| `rules.choices.daily` | Buri munsi | Every day | needs native-speaker review |
| `rules.choices.never` | Nta na rimwe | Never | needs native-speaker review |
| `rules.fields.queue.ticket_reset` | Gutangira nimero za tike bundi bushya | Restart ticket numbers | needs native-speaker review |
| `rules.fields.queue.show_names_on_display` | Kwerekana amazina kuri televiziyo y'aho bategerereza | Show names on the waiting-room screen | needs native-speaker review |
| `rules.fields.queue.call_repeat_seconds` | Gusubiramo guhamagara nyuma ya (amasegonda) | Repeat a call after (seconds) | needs native-speaker review |
| `rules.fields.queue.priority_elderly_age` | Kwihutishwa guhera ku myaka | Priority from age | needs native-speaker review |
| `rules.fields.queue.triage_enabled` | Abarwayi babanza kubonana n’umuforomo w’isuzuma ry’ibanze mbere ya muganga | Patients see a triage nurse before the doctor | needs native-speaker review |
| `rules.fields.booking.enabled` | Gufata gahunda kuri interineti | Online booking | needs native-speaker review |
| `rules.fields.booking.lead_time_hours` | Gufata gahunda nibura (amasaha mbere) | Book at least (hours ahead) | needs native-speaker review |
| `rules.fields.booking.horizon_days` | Gufata gahunda kugeza (iminsi mbere) | Book up to (days ahead) | needs native-speaker review |
| `rules.fields.booking.cancel_until_hours` | Guhagarika kugeza (amasaha mbere) | Cancel up to (hours before) | needs native-speaker review |
| `rules.fields.booking.no_show_strikes` | Inshuro zo kutaza mbere yo guhagarika gahunda | Missed visits before booking is paused | needs native-speaker review |
| `rules.fields.billing.no_insurers` | Ntitwakira ubwishingizi | We accept no insurer | needs native-speaker review |
| `rules.fields.billing.pay_before_consultation` | Kwishyura mbere yo kubonana na muganga | Pay before the consultation | needs native-speaker review |
| `rules.fields.billing.allow_exemptions` | Kwemera gusonerwa | Allow fee exemptions | needs native-speaker review |
| `rules.fields.billing.receipt_prefix` | Inyuguti zibanza z'inyemezabwishyu | Receipt number prefix | needs native-speaker review |
| `rules.fields.documents.prescription_valid_days` | Urupapuro rw'imiti rumara (iminsi) | Prescriptions valid for (days) | needs native-speaker review |
| `rules.fields.documents.show_licence_numbers` | Gucapa nimero z'uruhushya ku nyandiko | Print licence numbers on documents | needs native-speaker review |
| `rules.fields.notifications.reminder_hours_before` | Kwibutsa abarwayi (amasaha mbere) | Remind patients (hours before) | needs native-speaker review |
| `rules.fields.notifications.sms_enabled` | Kohereza SMS zibutsa | Send SMS reminders | needs native-speaker review |
| `rules.brandingHint` | Amagambo yo hasi acapwa ku nyemezabwishyu, impapuro z'imiti n'amabaruwa. | The footer printed on receipts, prescriptions and letters. | needs native-speaker review |
| `rules.footer` | Amagambo yo hasi | Footer text | needs native-speaker review |
| `history.entity` | Erekana impinduka za | Show changes to | needs native-speaker review |
| `history.entities.all` | Byose | Everything | needs native-speaker review |
| `history.entities.facility` | Umwirondoro w'ikigo | Facility profile | needs native-speaker review |
| `history.entities.opening_hours` | Amasaha yo gukora | Opening hours | needs native-speaker review |
| `history.entities.settings` | Amabwiriza | Rules | needs native-speaker review |
| `history.entities.tariff` | Ibiciro | Prices | needs native-speaker review |
| `history.entities.service` | Serivisi | Services | needs native-speaker review |
| `history.columns.when` | Ryari | When | needs native-speaker review |
| `history.columns.who` | Nde | Who | needs native-speaker review |
| `history.columns.what` | Iki | What | needs native-speaker review |
| `history.columns.field` | Umwanya | Field | needs native-speaker review |
| `history.columns.before` | Mbere | Before | needs native-speaker review |
| `history.columns.after` | Nyuma | After | needs native-speaker review |
| `history.count_one` | Impinduka {{count}} | {{count}} change | needs native-speaker review |
| `history.count_other` | Impinduka {{count}} | {{count}} changes | needs native-speaker review |
| `history.emptyTitle` | Nta mpinduka irabaho | No changes yet | needs native-speaker review |
| `history.empty` | Impinduka zigaragara hano iyo hari ubitse igenamiterere. | Changes appear here as soon as someone saves a setting. | needs native-speaker review |
| `staff.title` | Abakozi | Staff | needs native-speaker review |
| `staff.invite` | Tumira umukozi | Invite staff | needs native-speaker review |
| `staff.inviteHint` | Ahabwa link kuri imeyili imara iminsi 7. | They get an email link valid for 7 days. | needs native-speaker review |
| `staff.activeMembers` | Abakozi bakora | Active members | needs native-speaker review |
| `staff.doctorsAttested` | Abaganga bemejwe | Doctors attested | needs native-speaker review |
| `staff.withMfa` | Kwinjira mu ntambwe ebyiri | Two-step sign-in on | needs native-speaker review |
| `staff.pendingInvites` | Ubutumire butegereje | Pending invitations | needs native-speaker review |
| `staff.members` | Abakozi | Members | needs native-speaker review |
| `staff.invitations` | Ubutumire | Invitations | needs native-speaker review |
| `staff.search` | Shakisha ukoresheje izina cyangwa imeyili | Search by name or email | needs native-speaker review |
| `staff.roles` | Inshingano | Roles | needs native-speaker review |
| `staff.allRoles` | Inshingano zose | All roles | needs native-speaker review |
| `staff.points` | Ibyumba n'ameza | Rooms and desks | needs native-speaker review |
| `staff.columns.person` | Umuntu | Person | needs native-speaker review |
| `staff.columns.roles` | Inshingano | Roles | needs native-speaker review |
| `staff.columns.mfa` | Intambwe ebyiri | Two-step | needs native-speaker review |
| `staff.columns.licence` | Uruhushya | Licence | needs native-speaker review |
| `staff.columns.status` | Imiterere | Status | needs native-speaker review |
| `staff.columns.lastActive` | Aheruka gukora | Last active | needs native-speaker review |
| `staff.mfaOn` | Irakora | On | needs native-speaker review |
| `staff.mfaOff` | Ntiraterwa | Not set up | needs native-speaker review |
| `staff.attested` | Rwemejwe | Attested | needs native-speaker review |
| `staff.notAttested` | Ntirwemejwe | Not attested | needs native-speaker review |
| `staff.active` | Arakora | Active | needs native-speaker review |
| `staff.deactivated` | Yahagaritswe | Deactivated | needs native-speaker review |
| `staff.noneTitle` | Nta muntu uhuye na byo | Nobody matches | needs native-speaker review |
| `staff.none` | Siba ibyo washakishije cyangwa akayunguruzo k'inshingano. | Clear the search or the role filter. | needs native-speaker review |
| `staff.noInvitesTitle` | Nta butumire | No invitations | needs native-speaker review |
| `staff.noInvites` | Tumira bagenzi bawe ukoresheje buto iri hejuru. | Invite colleagues with the button above. | needs native-speaker review |
| `staff.inviteStatus.pending` | Butegereje | Pending | needs native-speaker review |
| `staff.inviteStatus.accepted` | Bwemewe | Accepted | needs native-speaker review |
| `staff.inviteStatus.revoked` | Bwakuweho | Revoked | needs native-speaker review |
| `staff.inviteStatus.expired` | Bwarangiye | Expired | needs native-speaker review |
| `staff.expires` | burangira {{date}} | expires {{date}} | needs native-speaker review |
| `staff.resend` | Ongera wohereze | Resend | needs native-speaker review |
| `staff.revoke` | Kuraho | Revoke | needs native-speaker review |
| `staff.email` | Imeyili | Email | needs native-speaker review |
| `staff.send` | Ohereza ubutumire | Send invitation | needs native-speaker review |
| `staff.joined` | Yinjiye {{date}} | Joined {{date}} | needs native-speaker review |
| `staff.licence` | Uruhushya rw'umwuga | Professional licence | needs native-speaker review |
| `staff.attest` | Emeza uruhushya | Attest licence | needs native-speaker review |
| `staff.attestedOn` | Rwemejwe {{date}} | Attested on {{date}} | needs native-speaker review |
| `staff.account` | Konti | Account | needs native-speaker review |
| `staff.mfaReset` | Subiramo kwinjira mu ntambwe ebyiri | Reset two-step sign-in | needs native-speaker review |
| `staff.deactivate` | Hagarika | Deactivate | needs native-speaker review |
| `staff.reactivate` | Subizaho | Reactivate | needs native-speaker review |
| `staff.deactivateTitle` | Uhagarike {{name}}? | Deactivate {{name}}? | needs native-speaker review |
| `staff.deactivateHint` | Ahita asohorwa kandi ntaba agishobora gukora hano. Ushobora kumusubizaho nyuma. | They are signed out at once and can no longer work here. You can reactivate them later. | needs native-speaker review |
| `staff.reason` | Impamvu | Reason | needs native-speaker review |
| `staff.deactivatedBecause` | Yahagaritswe: {{reason}} | Deactivated: {{reason}} | needs native-speaker review |
| `staff.lastAdmin` | Ikigo gikenera nibura umuyobozi umwe. Banza uhe izo nshingano undi muntu. | The facility needs at least one admin. Give the role to someone else first. | needs native-speaker review |
| `staff.done.deactivate` | Yahagaritswe. | Deactivated. | needs native-speaker review |
| `staff.done.reactivate` | Yasubijweho. | Reactivated. | needs native-speaker review |
| `staff.done.attest-licence` | Uruhushya rwemejwe. | Licence attested. | needs native-speaker review |
| `staff.done.mfa-reset` | Kwinjira mu ntambwe ebyiri byasubiwemo. Azabitegura ubutaha yinjiye. | Two-step sign-in reset. They set it up again at their next login. | needs native-speaker review |
| `staff.done.refuse-licence` | Icyemezo cyakuweho; yamenyeshejwe impamvu. | Attestation removed; they were told why. | needs native-speaker review |
| `staff.neverSignedIn` | Ntarigera yinjira | Never signed in | needs native-speaker review |
| `staff.mfaGapTitle_one` | Umukozi {{count}} ukora ntakoresha kwinjira mu ntambwe ebyiri | {{count}} active member has no two-step sign-in | needs native-speaker review |
| `staff.mfaGapTitle_other` | Abakozi {{count}} bakora badakoresha kwinjira mu ntambwe ebyiri | {{count}} active members have no two-step sign-in | needs native-speaker review |
| `staff.mfaGapBody` | Amakuru y'ubuzima asaba intambwe ya kabiri. Fungura umukozi umusabe kuyishyiraho ubutaha yinjiye, cyangwa uyisubizeho niba yarataye telefone. | Health records need a second factor. Open the person and ask them to set it up at their next sign-in, or reset it if their phone was lost. | needs native-speaker review |
| `staff.inviteName` | Amazina ye | Their names | needs native-speaker review |
| `staff.invitePhone` | Telefoni y’akazi | Work phone | needs native-speaker review |
| `staff.optional` | Si ngombwa: byuzuza konti ye nshya | Optional: fills in their new account | needs native-speaker review |
| `staff.noPhone` | Nta telefoni yatanzwe | No phone given | needs native-speaker review |
| `staff.openScan` | Fungura kopi y’uruhushya | Open the licence scan | needs native-speaker review |
| `staff.noScan` | Nta kopi y’uruhushya iraboneka. | No licence scan yet. | needs native-speaker review |
| `staff.checkFirst` | Genzura kopi n’itariki rurangiriraho mu gitabo cy’urugaga, hanyuma wemeze. | Check the scan and its end date against the council's register, then attest. | needs native-speaker review |
| `staff.refuse` | Ntibishoboka kwemeza | Cannot confirm | needs native-speaker review |
| `staff.withdraw` | Kuraho icyemezo | Withdraw the attestation | needs native-speaker review |
| `staff.refuseTitle` | Ntibishoboka kwemeza uruhushya rwa {{name}} | Cannot confirm the licence of {{name}} | needs native-speaker review |
| `staff.refuseHint` | Ntashobora gushyirwa kuri gahunda cyangwa gusinya kugeza rugenzuwe bundi bushya. Abona impamvu yawe kuri imeyili. | They can't be scheduled or sign until it's checked again. They read your reason by email. | needs native-speaker review |
| `staff.refusedBecause` | Ntirwemejwe: {{reason}} | Not confirmed: {{reason}} | needs native-speaker review |
| `staff.cannotAttest.missing` | Musabe kubanza gushyiraho itariki rurangiriraho na kopi yarwo. | Ask them to add the licence end date and its scan first. | needs native-speaker review |
| `staff.cannotAttest.expired` | Uruhushya rwarangiye. Musabe kubanza kuruvugurura. | The licence has ended. Ask them to renew it first. | needs native-speaker review |
| `staff.work` | Akazi muri iki kigo | Work at this facility | needs native-speaker review |
| `staff.department` | Serivisi | Department | needs native-speaker review |
| `staff.noDepartment` | Nta serivisi | No department | needs native-speaker review |
| `staff.employment` | Amasezerano | Employment | needs native-speaker review |
| `staff.notSet` | Ntibyashyizweho | Not set | needs native-speaker review |
| `staff.saveWork` | Bika | Save | needs native-speaker review |
| `clinician.title` | Umwirondoro wanjye w’umwuga | My clinician profile | needs native-speaker review |
| `clinician.council` | Urugaga | Council | needs native-speaker review |
| `clinician.licence` | Nimero y'uruhushya | Licence number | needs native-speaker review |
| `clinician.specialty` | Ubuhanga bwihariye | Specialty | needs native-speaker review |
| `clinician.reattest` | Urugaga, nimero cyangwa kopi nshya y’uruhushya bigenzurwa bundi bushya n’umuyobozi w’ikigo. | A new council, licence number or scan means your facility admin checks it again. | needs native-speaker review |
| `clinician.licenceTitle` | Uruhushya rwo gukora umwuga | Practising licence | needs native-speaker review |
| `clinician.professionTitle` | Umwuga | Profession | needs native-speaker review |
| `clinician.profession` | Umwuga | Profession | needs native-speaker review |
| `clinician.sex` | Igitsina | Sex | needs native-speaker review |
| `clinician.female` | Gore | Female | needs native-speaker review |
| `clinician.male` | Gabo | Male | needs native-speaker review |
| `clinician.validUntil` | Rufite agaciro kugeza | Valid until | needs native-speaker review |
| `clinician.validUntilHint` | Itariki rurangiriraho iri ku cyemezo cyawe. | The end date on your practising certificate. | needs native-speaker review |
| `clinician.validUntilNow` | Ubu: kugeza {{date}} | Now: until {{date}} | needs native-speaker review |
| `clinician.scan` | Kopi cyangwa ifoto y’uruhushya | Scan or photo of the licence | needs native-speaker review |
| `clinician.scanHint` | PDF, JPEG, PNG cyangwa HEIC, kugeza kuri MB 10. Umuyobozi w’ikigo arufungura akarugenzura. | PDF, JPEG, PNG or HEIC, up to 10 MB. Your facility admin opens it to check. | needs native-speaker review |
| `clinician.qualifications` | Impamyabumenyi | Qualifications | needs native-speaker review |
| `clinician.degree` | Impamyabumenyi | Degree or diploma | needs native-speaker review |
| `clinician.institution` | Ishuri cyangwa kaminuza | School or university | needs native-speaker review |
| `clinician.year` | Umwaka | Year | needs native-speaker review |
| `clinician.addQualification` | Ongeraho impamyabumenyi | Add a qualification | needs native-speaker review |
| `clinician.removeQualification` | Kuraho {{degree}} | Remove {{degree}} | needs native-speaker review |
| `clinician.photo` | Ifoto | Photo | needs native-speaker review |
| `clinician.photoLabel` | Ifoto yawe | Your photo | needs native-speaker review |
| `clinician.photoHint` | Ifoto igaragara neza y’isura yawe, JPEG, PNG cyangwa HEIC, kugeza kuri MB 5. | A clear photo of your face, JPEG, PNG or HEIC, up to 5 MB. | needs native-speaker review |
| `invite.title` | Injira mu kigo kuri MediLink | Join a facility on MediLink | needs native-speaker review |
| `invite.invitedBy` | Watumiwe na {{name}} | Invited by {{name}} | needs native-speaker review |
| `invite.expires` | link irakora kugeza {{date}} | link valid until {{date}} | needs native-speaker review |
| `invite.invalidTitle` | Iyi link ntikora | This link does not work | needs native-speaker review |
| `invite.invalid` | Link y'ubutumire ntikora cyangwa yarangiye. Saba ikigo indi nshya. | The invitation link is not valid or has expired. Ask the facility for a new one. | needs native-speaker review |
| `invite.existingHint` | Usanzwe ufite konti y'umukozi kuri MediLink. Injira kugira ngo wemere. | You already have a MediLink staff account. Log in to accept. | needs native-speaker review |
| `invite.logInToAccept` | Injira wemere | Log in to accept | needs native-speaker review |
| `invite.accept` | Emera ubutumire | Accept invitation | needs native-speaker review |
| `invite.newHint` | Fungura konti yawe. Hanyuma utegure kwinjira mu ntambwe ebyiri. | Create your account. Next you set up two-step sign-in. | needs native-speaker review |
| `invite.fullName` | Amazina yose | Full name | needs native-speaker review |
| `invite.password` | Ijambobanga | Password | needs native-speaker review |
| `invite.passwordHint` | Nibura inyuguti 12 | At least 12 characters | needs native-speaker review |
| `invite.create` | Fungura konti | Create account | needs native-speaker review |
| `publicProfile.title` | Umwirondoro ugaragara | Public profile | needs native-speaker review |
| `publicProfile.intro` | Ibyo abarwayi basoma kuri wowe ku mapaji y'ikigo n'aya muganga. Nomero y'uruhushya rwawe ntigaragara. | What patients read about you on the facility and doctor pages. Your licence number is never shown. | needs native-speaker review |
| `publicProfile.visible` | Erekana umwirondoro wanjye abarwayi | Show my profile to patients | needs native-speaker review |
| `publicProfile.visibleHint` | Bifunze: abarwayi babona izina ryawe n'iminsi ukora, nta nyandiko iri hepfo. | Off: patients still see your name and days, without the text below. | needs native-speaker review |
| `publicProfile.on` | Biragaragara | Shown | needs native-speaker review |
| `publicProfile.off` | Byahishwe | Hidden | needs native-speaker review |
| `publicProfile.bioLanguage` | Ururimi rw'inyandiko | Language of the text | needs native-speaker review |
| `publicProfile.bio` | Ibyerekeye wowe | About you | needs native-speaker review |
| `publicProfile.bioHint` | Hasigaye inyuguti {{count}}. Amagambo yoroshye: ibyo uvura, abo wakira, uko ukora. | {{count}} characters left. Plain words: what you treat, who you see, how you work. | needs native-speaker review |
| `publicProfile.languages` | Indimi uvuga n'abarwayi | Languages you speak with patients | needs native-speaker review |
| `publicProfile.spoken.rw` | Ikinyarwanda | Kinyarwanda | needs native-speaker review |
| `publicProfile.spoken.en` | Icyongereza | English | needs native-speaker review |
| `publicProfile.spoken.fr` | Igifaransa | French | needs native-speaker review |
| `publicProfile.spoken.sw` | Igiswahili | Kiswahili | needs native-speaker review |
| `publicProfile.preview` | Ibyo abarwayi babona | What patients see | needs native-speaker review |
| `publicProfile.noBio` | Nta nyandiko iriho. | No text yet. | needs native-speaker review |
| `publicProfile.hidden` | Byahishwe abarwayi. | Hidden from patients. | needs native-speaker review |
| `publicProfile.needLicence` | Banza ubike uruhushya rwawe; umwirondoro ugaragara ukurikira. | Save your licence first; the public profile follows. | needs native-speaker review |
| `account.menu` | Amakuru yanjye | My details | needs native-speaker review |
| `account.title` | Amakuru yanjye | My details | needs native-speaker review |
| `account.email` | Imeyili | Email | needs native-speaker review |
| `account.emailHint` | Winjira ukoresheje iyi aderesi. Saba ubufasha bwa MediLink kuyihindura. | You sign in with this address. Ask MediLink support to change it. | needs native-speaker review |
| `account.fullName` | Amazina yose | Full name | needs native-speaker review |
| `account.phone` | Telefoni y’akazi | Work phone | needs native-speaker review |
| `account.phoneHint` | Nimero ya telefoni yo mu Rwanda, urugero 0788 123 456 | A Rwandan mobile number, for example 0788 123 456 | needs native-speaker review |
| `account.language` | Ururimi | Language | needs native-speaker review |
| `account.save` | Bika | Save | needs native-speaker review |
| `account.saved` | Byabitswe. | Saved. | needs native-speaker review |
| `licenceState.valid` | Uruhushya rufite agaciro | Licence valid | needs native-speaker review |
| `licenceState.expiring` | Uruhushya rugiye kurangira | Licence ends soon | needs native-speaker review |
| `licenceState.expired` | Uruhushya rwarangiye | Licence ended | needs native-speaker review |
| `licenceState.missing` | Amakuru y’uruhushya abura | Licence details missing | needs native-speaker review |
| `employment.full_time` | Igihe cyose | Full time | needs native-speaker review |
| `employment.part_time` | Igice cy’igihe | Part time | needs native-speaker review |
| `employment.visiting` | Usura | Visiting | needs native-speaker review |
| `employment.locum` | Usimbura | Locum | needs native-speaker review |
| `upload.drop` | Kurura dosiye hano, cyangwa | Drag a file here, or | needs native-speaker review |
| `upload.browse` | Hitamo dosiye | Choose a file | needs native-speaker review |
| `upload.camera` | Fata ifoto | Take a photo | needs native-speaker review |
| `upload.retry` | Ongera ugerageze | Try again | needs native-speaker review |
| `upload.remove` | Kuraho | Remove | needs native-speaker review |
| `upload.tooLarge` | Iyi dosiye ni nini cyane. | This file is too large. | needs native-speaker review |
| `upload.wrongType` | Ubu bwoko bwa dosiye ntibwemewe. | This type of file is not accepted. | needs native-speaker review |
| `upload.status.uploading` | Irimo koherezwa | Uploading | needs native-speaker review |
| `upload.status.pending` | Irimo gusuzumwa virusi | Checking for viruses | needs native-speaker review |
| `upload.status.clean` | Yiteguye | Ready | needs native-speaker review |
| `upload.status.infected` | Habonetse virusi | Virus found | needs native-speaker review |
| `upload.status.rejected` | Ntiyemewe | Not accepted | needs native-speaker review |
| `upload.status.failed` | Isuzuma ryanze | Check failed | needs native-speaker review |
| `upload.status.error` | Ntiyoherejwe | Not uploaded | needs native-speaker review |
| `professions.medical_doctor` | Muganga | Medical doctor | needs native-speaker review |
| `professions.dentist` | Muganga w’amenyo | Dentist | needs native-speaker review |
| `professions.nurse` | Umuforomo | Nurse | needs native-speaker review |
| `professions.midwife` | Umubyaza | Midwife | needs native-speaker review |
| `professions.pharmacist` | Umufarumasiye | Pharmacist | needs native-speaker review |
| `professions.lab_technologist` | Umutekinisiye wa laboratwari | Laboratory technologist | needs native-speaker review |
| `professions.radiographer` | Umutekinisiye w’amashusho y’umubiri | Radiographer | needs native-speaker review |
| `professions.anaesthetist` | Umuganga ushinzwe ikinya | Anaesthetist | needs native-speaker review |
| `professions.physiotherapist` | Umuvuzi ngororangingo | Physiotherapist | needs native-speaker review |
| `professions.clinical_psychologist` | Umuhanga mu by’imitekerereze | Clinical psychologist | needs native-speaker review |
| `professions.nutritionist` | Inzobere mu mirire | Nutritionist | needs native-speaker review |
| `professions.optometrist` | Umuhanga mu by’amaso | Optometrist | needs native-speaker review |
| `professions.other` | Ibindi | Other | needs native-speaker review |
| `specialties.general_practice` | Ubuvuzi rusange | General practice | needs native-speaker review |
| `specialties.family_medicine` | Ubuvuzi bw’umuryango | Family medicine | needs native-speaker review |
| `specialties.internal_medicine` | Indwara z’imbere mu mubiri | Internal medicine | needs native-speaker review |
| `specialties.paediatrics` | Ubuvuzi bw’abana | Paediatrics | needs native-speaker review |
| `specialties.obstetrics_gynaecology` | Ububyaza n’indwara z’abagore | Obstetrics and gynaecology | needs native-speaker review |
| `specialties.general_surgery` | Kubaga muri rusange | General surgery | needs native-speaker review |
| `specialties.orthopaedics` | Amagufwa | Orthopaedics | needs native-speaker review |
| `specialties.anaesthesiology` | Ikinya | Anaesthesiology | needs native-speaker review |
| `specialties.emergency_medicine` | Ubutabazi bwihuse | Emergency medicine | needs native-speaker review |
| `specialties.psychiatry` | Indwara zo mu mutwe | Psychiatry | needs native-speaker review |
| `specialties.dermatology` | Indwara z’uruhu | Dermatology | needs native-speaker review |
| `specialties.ophthalmology` | Indwara z’amaso | Ophthalmology | needs native-speaker review |
| `specialties.ent` | Amatwi, izuru n’umuhogo | Ear, nose and throat | needs native-speaker review |
| `specialties.cardiology` | Indwara z’umutima | Cardiology | needs native-speaker review |
| `specialties.neurology` | Indwara z’imitsi y’ubwonko | Neurology | needs native-speaker review |
| `specialties.radiology` | Amashusho y’umubiri | Radiology | needs native-speaker review |
| `specialties.pathology` | Isuzuma ry’indwara | Pathology | needs native-speaker review |
| `specialties.urology` | Imyanya y’inkari | Urology | needs native-speaker review |
| `specialties.dentistry` | Amenyo | Dentistry | needs native-speaker review |
| `specialties.public_health` | Ubuzima rusange | Public health | needs native-speaker review |
| `specialties.other` | Ibindi | Other | needs native-speaker review |

## patient-web feature: bills (namespace bills)

File: `apps/patient-web/src/features/bills/locales/rw.json`

| Key | Kinyarwanda (draft) | English source | Status |
|---|---|---|---|
| `title` | Inyemezabuguzi | Bills | needs native-speaker review |
| `whose` | Inyemezabuguzi za | Whose bills | needs native-speaker review |
| `everyone` | Bose | Everyone | needs native-speaker review |
| `failed` | Ntitwashoboye kubona inyemezabuguzi zawe. | We couldn't load your bills. | needs native-speaker review |
| `toPay` | Ugomba kwishyura | To pay | needs native-speaker review |
| `left` | {{amount}} zo kwishyura | {{amount}} to pay | needs native-speaker review |
| `empty` | Nta nyemezabuguzi uragira | No bills yet | needs native-speaker review |
| `back` | Inyemezabuguzi | Bills | needs native-speaker review |
| `notFound` | Inyemezabuguzi ntiyabonetse | Bill not found | needs native-speaker review |
| `total` | Igiteranyo | Total | needs native-speaker review |
| `insurer` | Ubwishingizi bwishyura | Insurance pays | needs native-speaker review |
| `share` | Uruhare rwawe | Your share | needs native-speaker review |
| `exempted` | Wasonewe | Exempted | needs native-speaker review |
| `credited` | Wasubijwe | Credited | needs native-speaker review |
| `paid` | Wishyuye | Paid | needs native-speaker review |
| `balance` | Ugisigaje kwishyura | Left to pay | needs native-speaker review |
| `lines` | Ibyo wahawe | Items | needs native-speaker review |
| `item` | Icyo wahawe | Item | needs native-speaker review |
| `quantity` | Umubare | Qty | needs native-speaker review |
| `payments` | Ubwishyu | Payments | needs native-speaker review |
| `receipt` | Inyemezabwishyu | Receipt | needs native-speaker review |
| `voided` | Byahagaritswe | Cancelled | needs native-speaker review |
| `status.open` | Kwishyura | To pay | needs native-speaker review |
| `status.partly_paid` | Wishyuye igice | Partly paid | needs native-speaker review |
| `status.paid` | Byishyuwe | Paid | needs native-speaker review |
| `status.voided` | Byahagaritswe | Cancelled | needs native-speaker review |
| `status.credited` | Wasubijwe | Credited | needs native-speaker review |
| `method.cash` | Amafaranga mu ntoki | Cash | needs native-speaker review |
| `method.mtn_momo` | MTN MoMo | MTN MoMo | needs native-speaker review |
| `method.airtel_money` | Airtel Money | Airtel Money | needs native-speaker review |
| `method.card` | Ikarita | Card | needs native-speaker review |

## patient-web feature: booking (namespace booking)

File: `apps/patient-web/src/features/booking/locales/rw.json`

| Key | Kinyarwanda (draft) | English source | Status |
|---|---|---|---|
| `verified` | Cyemejwe | Verified | needs native-speaker review |
| `openNow` | Kirakora ubu | Open now | needs native-speaker review |
| `closedNow` | Gifunze ubu | Closed now | needs native-speaker review |
| `referralTitle` | Mituweli n’iyoherezwa | Mutuelle and referrals | needs native-speaker review |
| `referralHint` | Mituweli ishobora kutishyura isura hano utoherejwe n’ikigo nderabuzima. Ushobora gufata gahunda uko byagenda kose. | Mutuelle may not cover a visit here without a transfer from a health centre. You can still book. | needs native-speaker review |
| `load.low` | Gutegereza bike | Short wait | needs native-speaker review |
| `load.medium` | Hari benshi | Busy | needs native-speaker review |
| `load.high` | Hari benshi cyane | Very busy | needs native-speaker review |
| `types.health_post` | Poste de santé | Health post | needs native-speaker review |
| `types.health_center` | Ikigo nderabuzima | Health centre | needs native-speaker review |
| `types.private_clinic` | Ivuriro ryigenga | Private clinic | needs native-speaker review |
| `types.polyclinic` | Polikilinike | Polyclinic | needs native-speaker review |
| `types.district_hospital` | Ibitaro by’akarere | District hospital | needs native-speaker review |
| `types.provincial_hospital` | Ibitaro by’intara | Provincial hospital | needs native-speaker review |
| `types.referral_hospital` | Ibitaro bikuru | Referral hospital | needs native-speaker review |
| `insurerNames.mutuelle` | Mituweli | Mutuelle | needs native-speaker review |
| `insurerNames.rama` | RAMA | RAMA | needs native-speaker review |
| `insurerNames.mmi` | MMI | MMI | needs native-speaker review |
| `insurerNames.private_other` | Ubwishingizi bwigenga | Private insurance | needs native-speaker review |
| `search.title` | Shaka ikigo | Find a facility | needs native-speaker review |
| `search.accepts` | Cyakira {{insurer}} | Accepts {{insurer}} | needs native-speaker review |
| `search.notAccepted` | Ntikakira {{insurer}} | {{insurer}} not accepted | needs native-speaker review |
| `search.km` | km {{km}} | {{km}} km | needs native-speaker review |
| `search.next` | Ikurikira: {{day}}, {{time}} | Next: {{day}}, {{time}} | needs native-speaker review |
| `search.walkInOnly` | Ngwino mu masaha y’akazi | Walk in during opening hours | needs native-speaker review |
| `search.book` | Hitamo isaha | Choose a time | needs native-speaker review |
| `search.view` | Reba ikigo | View facility | needs native-speaker review |
| `search.filters.open_now` | Gikora ubu | Open now | needs native-speaker review |
| `search.filters.available_today` | Kiboneka uyu munsi | Available today | needs native-speaker review |
| `search.useLocation` | Koresha aho ndi | Use my location | needs native-speaker review |
| `search.locationDenied` | Ntitwabonye aho uri. Hitamo akarere. | We couldn't get your location. Choose a district instead. | needs native-speaker review |
| `search.nearMe` | Hafi yanjye | Near me | needs native-speaker review |
| `search.active` | Ibyo wahisemo | Active filters | needs native-speaker review |
| `search.remove` | Kuraho {{label}} | Remove {{label}} | needs native-speaker review |
| `search.count_one` | Ikigo {{count}} | {{count}} facility | needs native-speaker review |
| `search.count_other` | Ibigo {{count}} | {{count}} facilities | needs native-speaker review |
| `search.failed` | Ntitwashoboye kuzana ibigo. | We couldn't load facilities. | needs native-speaker review |
| `search.noneTitle` | Nta kigo gihuye n’ibyo byose | No facility matches all of this | needs native-speaker review |
| `search.noneBody` | Kuraho kimwe mu byo wahisemo cyangwa uhitemo akandi karere. | Remove a filter or choose another district. | needs native-speaker review |
| `search.clear` | Siba ishakisha | Clear the search | needs native-speaker review |
| `facility.insurers` | Ubwishingizi bwakirwa: {{list}} | Insurance accepted: {{list}} | needs native-speaker review |
| `facility.book` | Fata gahunda | Book a time | needs native-speaker review |
| `facility.join` | Jya ku murongo w’uyu munsi | Join today's queue | needs native-speaker review |
| `facility.notFound` | Ntitwabonye iki kigo | We couldn't find this facility | needs native-speaker review |
| `facility.notFoundBody` | Gishobora kuba kitaraza kuri MediLink. Shaka ikindi kiri hafi. | It may not be on MediLink yet. Search for another one nearby. | needs native-speaker review |
| `facility.backToSearch` | Garuka ku ishakisha | Back to search | needs native-speaker review |
| `facility.services` | Serivisi n’ibiciro | Services and prices | needs native-speaker review |
| `facility.doctors` | Abaganga | Doctors | needs native-speaker review |
| `facility.days` | Iminsi bahaba | Days present | needs native-speaker review |
| `facility.hours` | Amasaha y’iki cyumweru | Opening hours this week | needs native-speaker review |
| `facility.closed` | Gifunze | Closed | needs native-speaker review |
| `facility.closures` | Gifunze ku wa {{list}} | Closed on {{list}} | needs native-speaker review |
| `facility.contact` | Aderesi n’aho wahamagara | Address and contact | needs native-speaker review |
| `facility.directions` | Inzira | Directions | needs native-speaker review |
| `facility.queueNow` | Umurongo ubu | Queue right now | needs native-speaker review |
| `facility.queueLive` | Ubu | Live | needs native-speaker review |
| `facility.queueWait` | Iminota {{min}}–{{max}} | {{min}}–{{max}} min | needs native-speaker review |
| `facility.queueWaiting_one` | Umuntu {{count}} ategereje | {{count}} person waiting | needs native-speaker review |
| `facility.queueWaiting_other` | Abantu {{count}} bategereje | {{count}} people waiting | needs native-speaker review |
| `facility.queueNoDoctor_one` | {{count}} ategereje · nta muganga uri ku kazi | {{count}} waiting · no doctor on duty yet | needs native-speaker review |
| `facility.queueNoDoctor_other` | {{count}} bategereje · nta muganga uri ku kazi | {{count}} waiting · no doctor on duty yet | needs native-speaker review |
| `facility.queueEmpty` | Nta muntu utegereje | No one waiting | needs native-speaker review |
| `facility.bookShort` | Fata gahunda | Book | needs native-speaker review |
| `flow.title` | Fata gahunda | Book a visit | needs native-speaker review |
| `flow.step` | Intambwe {{step}} kuri {{total}} | Step {{step}} of {{total}} | needs native-speaker review |
| `flow.steps.label` | Intambwe zo gufata gahunda | Booking steps | needs native-speaker review |
| `flow.steps.who` | Uwo ari we | Who | needs native-speaker review |
| `flow.steps.what` | Serivisi | Service | needs native-speaker review |
| `flow.steps.when` | Igihe | Time | needs native-speaker review |
| `flow.steps.reason` | Impamvu | Reason | needs native-speaker review |
| `flow.steps.review` | Kugenzura | Review | needs native-speaker review |
| `flow.summary` | Gahunda yawe | Your booking | needs native-speaker review |
| `flow.notChosen` | Ntibirahitwamo | Not chosen yet | needs native-speaker review |
| `flow.who` | Gahunda ni iy’uwuhe? | Who is the visit for? | needs native-speaker review |
| `flow.addPerson` | Ongeraho uwo mu muryango | Add a family member | needs native-speaker review |
| `flow.what` | Ukeneye iki? | What do you need? | needs native-speaker review |
| `flow.when` | Wifuza kuza ryari? | When would you like to come? | needs native-speaker review |
| `flow.reason` | Ni iki kikuzanye? | What brings you in? | needs native-speaker review |
| `flow.reasonHint` | Hitamo kugeza kuri 5. Bifasha muganga kwitegura; si isuzuma. | Choose up to 5. This helps the doctor prepare; it is not a diagnosis. | needs native-speaker review |
| `flow.symptoms` | Ibimenyetso | Symptoms | needs native-speaker review |
| `flow.more` | Hari ikindi? (si ngombwa) | Anything else? (optional) | needs native-speaker review |
| `flow.moreHint` | Abaganga bakuvura ni bo bonyine babibona. | Only the care team sees this. | needs native-speaker review |
| `flow.redFlagTitle` | Ibi bishobora kuba byihutirwa. | This can be an emergency. | needs native-speaker review |
| `flow.redFlagBody` | Niba bikomeye cyangwa birushaho kuba bibi, ntutegereze gahunda: jya ku bitaro bikwegereye cyangwa uhamagare 912. | If it is severe or getting worse, don't wait for a booking: go to the nearest emergency department or call 912. | needs native-speaker review |
| `flow.review` | Genzura ufate gahunda | Check and book | needs native-speaker review |
| `flow.forWho` | Ku wa | For | needs native-speaker review |
| `flow.where` | Aho | Where | needs native-speaker review |
| `flow.service` | Serivisi | Service | needs native-speaker review |
| `flow.whenLabel` | Ryari | When | needs native-speaker review |
| `flow.doctor` | Muganga | Doctor | needs native-speaker review |
| `flow.insurance` | Ubwishingizi | Insurance | needs native-speaker review |
| `flow.noInsurance` | Nziyishyurira | I'll pay myself | needs native-speaker review |
| `flow.notAccepted` | {{insurer}} ntiyakirwa hano. Ushobora gufata gahunda ukiyishyurira. | {{insurer}} is not accepted here. You can still book and pay yourself. | needs native-speaker review |
| `flow.cancelRule` | Ushobora gusiba cyangwa guhindura isaha ku buntu kugeza amasaha 2 mbere. | You can cancel or change the time for free until 2 hours before. | needs native-speaker review |
| `flow.confirm` | Emeza gahunda | Book this visit | needs native-speaker review |
| `flow.failed` | Ntitwashoboye gufata iyi gahunda. | We couldn't book this visit. | needs native-speaker review |
| `flow.joinTitle` | Ukeneye kuvurwa uyu munsi? | Need care today? | needs native-speaker review |
| `flow.joinBody` | Jya ku murongo w’uyu munsi uri hano ukurikirane igihe cyawe. Wiyandikishe ku bakira abarwayi nugera. | Join today's queue from here and follow your turn. Check in at reception when you arrive. | needs native-speaker review |
| `flow.pickedTitle` | Igihe wahisemo | The time you chose | needs native-speaker review |
| `flow.pickedKeep` | Komeza n’iki gihe | Continue with this time | needs native-speaker review |
| `flow.takenTitle` | Undi muntu amaze gufata iyi saha | Someone just took this time | needs native-speaker review |
| `flow.takenBody` | Aya masaha ari hafi yayo aracyari ubusa: | These times close to it are still free: | needs native-speaker review |
| `flow.takenNone` | Hitamo indi saha hepfo. | Choose another time below. | needs native-speaker review |
| `flow.earlier` | Iminsi ibanza | Earlier days | needs native-speaker review |
| `flow.later` | Iminsi ikurikira | Later days | needs native-speaker review |
| `flow.days` | Iminsi | Days | needs native-speaker review |
| `flow.free_one` | {{count}} irahari | {{count}} free | needs native-speaker review |
| `flow.free_other` | {{count}} zirahari | {{count}} free | needs native-speaker review |
| `flow.noTimes` | Nta saha ihari uyu munsi. | No free times this day. | needs native-speaker review |
| `flow.morning` | Mu gitondo | Morning | needs native-speaker review |
| `flow.afternoon` | Nyuma ya saa sita | Afternoon | needs native-speaker review |
| `flow.holding` | Turakubikiye iyi saha mu gihe cya {{time}} | We're holding this time for {{time}} | needs native-speaker review |
| `flow.holdingMinutes_one` | Turakubikiye iyi saha mu gihe cy’umunota {{count}}. | We're holding this time for about {{count}} minute. | needs native-speaker review |
| `flow.holdingMinutes_other` | Turakubikiye iyi saha mu gihe cy’iminota {{count}}. | We're holding this time for {{count}} minutes. | needs native-speaker review |
| `flow.expiredTitle` | Isaha wari wahisemo yarekuwe. | The time you chose was released. | needs native-speaker review |
| `flow.chooseAgain` | Ongera uhitemo isaha | Choose a time again | needs native-speaker review |
| `flow.doneTitle` | Gahunda yawe yafashwe | Your visit is booked | needs native-speaker review |
| `flow.doneBody` | {{facility}}, {{day}} saa {{time}}. Erekana kode ya gahunda ku bakira abarwayi. | {{facility}}, {{day}} at {{time}}. Show your booking code at reception. | needs native-speaker review |
| `flow.code` | Kode ya gahunda | Booking code | needs native-speaker review |
| `flow.addToCalendar` | Shyira ku ngengabihe yanjye | Add to my calendar | needs native-speaker review |
| `flow.directions` | Ikigo n’inzira | Facility and directions | needs native-speaker review |
| `flow.toVisits` | Reba gahunda zanjye | See my visits | needs native-speaker review |
| `flow.with` | na {{doctor}} | with {{doctor}} | needs native-speaker review |
| `flow.anyDoctor` | Umuganga uwo ari we wese | Any doctor | needs native-speaker review |
| `body.general` | Rusange | General | needs native-speaker review |
| `body.respiratory` | Guhumeka | Breathing | needs native-speaker review |
| `body.digestive` | Inda | Stomach | needs native-speaker review |
| `body.nervous` | Umutwe | Head | needs native-speaker review |
| `body.circulatory` | Umutima n’igituza | Heart and chest | needs native-speaker review |
| `body.skin` | Uruhu | Skin | needs native-speaker review |
| `body.musculoskeletal` | Ingingo n’umugongo | Joints and back | needs native-speaker review |
| `body.dental` | Amenyo | Teeth | needs native-speaker review |
| `body.eye` | Amaso | Eyes | needs native-speaker review |
| `body.urinary` | Inkari | Urine | needs native-speaker review |
| `upcoming.title` | Iziri imbere | Upcoming | needs native-speaker review |
| `upcoming.failed` | Ntitwashoboye kuzana gahunda zawe. | We couldn't load your bookings. | needs native-speaker review |
| `upcoming.none` | Nta gahunda iri imbere | No upcoming bookings | needs native-speaker review |
| `upcoming.noneBody` | Fata isaha ku kigo wirinde gutegereza igihe kirekire. | Book a time at a facility and skip the long wait. | needs native-speaker review |
| `upcoming.book` | Fata gahunda | Book a visit | needs native-speaker review |
| `upcoming.forWhom` | Ya {{name}} | For {{name}} | needs native-speaker review |
| `upcoming.facility` | Ikigo | Facility | needs native-speaker review |
| `upcoming.cancel` | Siba | Cancel | needs native-speaker review |
| `upcoming.cancelTitle` | Gusiba iyi gahunda? | Cancel this booking? | needs native-speaker review |
| `upcoming.cancelBody` | Gahunda {{code}} izasibwa, isaha ihabwe undi. | Booking {{code}} will be cancelled and the time freed for someone else. | needs native-speaker review |
| `upcoming.cancelLate` | Hasigaye amasaha ari munsi ya 2 (ku buntu kugeza {{time}}). Bizandikwa ko wasibye utinze. | It's less than 2 hours before the visit (free until {{time}}). It will be recorded as a late cancellation. | needs native-speaker review |
| `upcoming.keep` | Yigumishe | Keep it | needs native-speaker review |
| `upcoming.cancelConfirm` | Siba gahunda | Cancel booking | needs native-speaker review |
| `offer.title` | Umwanya wawe wahindutse | Your booking has changed | needs native-speaker review |
| `offer.moved` | Ikigo cyimuye gahunda yawe kuva {{from}} kugeza {{to}}. | The facility moved your visit from {{from}} to {{to}}. | needs native-speaker review |
| `offer.movedTo` | Ikigo cyimuriye gahunda yawe {{to}}. | The facility moved your visit to {{to}}. | needs native-speaker review |
| `offer.doctor` | Uzakirwa na {{doctor}}. | You will see {{doctor}}. | needs native-speaker review |
| `offer.autoAccept` | Nutasubiza bitarenze {{time}}, tuzakubikira igihe gishya. | If you don't answer by {{time}}, we keep the new time for you. | needs native-speaker review |
| `offer.answer` | Turagusaba gusubiza: ikigo gishobora no kuguhamagara. | Please answer: the facility may also call you. | needs native-speaker review |
| `offer.keep` | Emera igihe gishya | Keep the new time | needs native-speaker review |
| `offer.other` | Hitamo ikindi gihe | Choose another time | needs native-speaker review |
| `offer.cancel` | Hagarika uyu mwanya | Cancel this booking | needs native-speaker review |
| `offer.cancelBody` | Umwanya {{code}} urahagarikwa. Ntibibarwa nko guhagarika bitinze. | Booking {{code}} will be cancelled. It is not counted as a late cancellation. | needs native-speaker review |
| `offer.otherTitle` | Hitamo ikindi gihe | Choose another time | needs native-speaker review |
| `offer.loading` | Turashaka imyanya iboneka… | Loading free times… | needs native-speaker review |
| `offer.noTimes` | Nta mwanya uboneka muri iki cyumweru. Emera igihe gishya cyangwa uhagarike. | No free time this week. Keep the new time or cancel. | needs native-speaker review |
| `offer.day` | Umunsi | Day | needs native-speaker review |
| `offer.times` | Imyanya iboneka | Free times | needs native-speaker review |
| `feed.title` | Kwiyandikisha kuri kalendari | Calendar subscription | needs native-speaker review |
| `feed.body` | Shyira gahunda z'umuryango wawe kuri kalendari ya telefoni yawe. Igaragaza ikigo, serivisi, isaha na kode gusa. | Add your family's bookings to your phone's calendar. It shows the facility, service, time and booking code only. | needs native-speaker review |
| `feed.toggle` | Ihuza rya kalendari | Calendar link | needs native-speaker review |
| `feed.on` | Birakora | On | needs native-speaker review |
| `feed.off` | Ntibikora | Off | needs native-speaker review |
| `feed.link` | Ihuza ryawe bwite | Your private link | needs native-speaker review |
| `feed.once` | Rikoporore ubu: rigaragara rimwe gusa. Ufite iri huza wese abona amasaha ya gahunda zawe. | Copy it now: it is shown only once. Anyone with the link sees your booking times. | needs native-speaker review |
| `feed.copy` | Koporora ihuza | Copy link | needs native-speaker review |
| `feed.copied` | Ihuza ryakoporowe. | Link copied. | needs native-speaker review |
| `feed.open` | Fungura muri kalendari yanjye | Open in my calendar app | needs native-speaker review |
| `feed.since` | Birakora kuva {{day}}. Ushaka irindi huza, bizimye hanyuma ubyongere ubifungure. | On since {{day}}. To get a new link, turn it off and on again. | needs native-speaker review |
| `feed.failed` | Ntibishobotse guhindura ihuza rya kalendari. Ongera ugerageze. | We couldn't change the calendar link. Try again. | needs native-speaker review |

## patient-web feature: dashboard (namespace dashboard)

File: `apps/patient-web/src/features/dashboard/locales/rw.json`

| Key | Kinyarwanda (draft) | English source | Status |
|---|---|---|---|
| `close` | Funga | Close | needs native-speaker review |
| `cancel` | Reka | Cancel | needs native-speaker review |
| `retry` | Ongera ugerageze | Try again | needs native-speaker review |
| `findCare` | Shaka ubuvuzi | Find care | needs native-speaker review |
| `viewAll` | Reba byose | View all | needs native-speaker review |
| `viewDetails` | Reba ibisobanuro | View details | needs native-speaker review |
| `toast.close` | Funga ubutumwa | Dismiss message | needs native-speaker review |
| `nav.label` | MediLink | MediLink | needs native-speaker review |
| `nav.portal` | Urubuga rw'umurwayi | Patient portal | needs native-speaker review |
| `nav.main` | Menyu nyamukuru | Main menu | needs native-speaker review |
| `nav.account` | Menyu ya konti | Account menu | needs native-speaker review |
| `nav.breadcrumb` | Uri hano | You are here | needs native-speaker review |
| `nav.details` | Ibisobanuro | Details | needs native-speaker review |
| `nav.expand` | Fungura menyu | Open the menu | needs native-speaker review |
| `nav.collapse` | Gabanya menyu | Collapse the menu | needs native-speaker review |
| `nav.more` | Ibindi | More | needs native-speaker review |
| `nav.language` | Ururimi | Language | needs native-speaker review |
| `nav.groups.care` | Ubuvuzi | Care | needs native-speaker review |
| `nav.groups.health` | Ubuzima bwanjye | My health | needs native-speaker review |
| `nav.groups.account` | Konti | Account | needs native-speaker review |
| `nav.overview` | Ahabanza | Overview | needs native-speaker review |
| `nav.findCare` | Shaka ubuvuzi | Find care | needs native-speaker review |
| `nav.appointments` | Gahunda | Appointments | needs native-speaker review |
| `nav.queue` | Umurongo wanjye | My queue | needs native-speaker review |
| `nav.family` | Umuryango wanjye | My family | needs native-speaker review |
| `nav.records` | Amadosiye y'ubuzima | Medical records | needs native-speaker review |
| `nav.medications` | Imiti | Medications | needs native-speaker review |
| `nav.documents` | Inyandiko | Documents | needs native-speaker review |
| `nav.notifications` | Ubutumwa | Notifications | needs native-speaker review |
| `nav.help` | Ubufasha | Help & support | needs native-speaker review |
| `nav.settings` | Igenamiterere | Settings | needs native-speaker review |
| `nav.short.overview` | Ahabanza | Home | needs native-speaker review |
| `nav.short.findCare` | Ubuvuzi | Find care | needs native-speaker review |
| `nav.short.appointments` | Gahunda | Visits | needs native-speaker review |
| `nav.short.records` | Amadosiye | Records | needs native-speaker review |
| `nav.bills` | Inyemezabuguzi | Bills | needs native-speaker review |
| `nav.disputes` | Ibirego | Disputes | needs native-speaker review |
| `account.label` | Menyu ya konti ya {{name}} | Account menu for {{name}} | needs native-speaker review |
| `account.subtitle` | Konti y'umurwayi | Patient account | needs native-speaker review |
| `account.profile` | Umwirondoro wanjye | My profile | needs native-speaker review |
| `account.family` | Umuryango wanjye | My family | needs native-speaker review |
| `account.privacy` | Ibanga n'uburenganzira | Privacy and consent | needs native-speaker review |
| `account.settings` | Igenamiterere | Settings | needs native-speaker review |
| `account.viewProfile` | Reba umwirondoro wanjye | View my profile | needs native-speaker review |
| `search.open` | Shakisha | Search | needs native-speaker review |
| `search.title` | Shakisha muri MediLink | Search MediLink | needs native-speaker review |
| `search.placeholder` | Shakisha ubuvuzi, gahunda, inyandiko | Search care, appointments, documents | needs native-speaker review |
| `search.shortcut` | Ctrl K | Ctrl K | needs native-speaker review |
| `search.empty` | Nta cyabonetse | Nothing found | needs native-speaker review |
| `search.hints` | ↑ ↓ kwimuka · Enter gufungura · Esc gufunga | ↑ ↓ move · Enter open · Esc close | needs native-speaker review |
| `search.findCare` | Shaka ubuvuzi bwa “{{query}}” | Find care for “{{query}}” | needs native-speaker review |
| `search.groups.find` | Gushakisha | Search | needs native-speaker review |
| `search.groups.pages` | Impapuro | Pages | needs native-speaker review |
| `search.groups.appointments` | Gahunda zanjye | My appointments | needs native-speaker review |
| `search.groups.documents` | Inyandiko zanjye | My documents | needs native-speaker review |
| `search.groups.facilities` | Ibigo by'ubuvuzi | Facilities | needs native-speaker review |
| `search.groups.doctors` | Abaganga | Doctors | needs native-speaker review |
| `bell.title` | Ubutumwa | Notifications | needs native-speaker review |
| `bell.markAll` | Byose byasomwe | Mark all as read | needs native-speaker review |
| `bell.viewAll` | Reba ubutumwa bwose | View all notifications | needs native-speaker review |
| `bell.empty` | Nta butumwa bushya. | You're all caught up. | needs native-speaker review |
| `bell.failed` | Ntitwashoboye kubona ubutumwa bwawe. | We couldn't load your notifications. | needs native-speaker review |
| `bell.unread` | butarasomwa | unread | needs native-speaker review |
| `status.confirmed` | Byemejwe | Confirmed | needs native-speaker review |
| `status.checked_in` | Yakiriwe | Checked in | needs native-speaker review |
| `status.cancelled` | Byahagaritswe | Cancelled | needs native-speaker review |
| `status.late_cancelled` | Byahagaritswe bitinze | Cancelled late | needs native-speaker review |
| `status.no_show` | Ntiyaje | Missed | needs native-speaker review |
| `status.rescheduled` | Byimuwe | Rescheduled | needs native-speaker review |
| `status.answer` | Bitegereje igisubizo cyawe | Needs your answer | needs native-speaker review |
| `overview.greeting_morning` | Mwaramutse, {{name}} | Good morning, {{name}} | needs native-speaker review |
| `overview.greeting_afternoon` | Mwiriwe, {{name}} | Good afternoon, {{name}} | needs native-speaker review |
| `overview.greeting_evening` | Mwiriwe, {{name}} | Good evening, {{name}} | needs native-speaker review |
| `overview.subtitle` | Dore incamake y'ubuvuzi bwawe. | Here's your healthcare overview. | needs native-speaker review |
| `overview.verifyTitle` | Emeza imeyili yawe | Confirm your email | needs native-speaker review |
| `overview.verifyBody` | Umurongo woherejwe kuri {{email}} | Link sent to {{email}} | needs native-speaker review |
| `overview.nextAppointment` | Gahunda ikurikira | Next appointment | needs native-speaker review |
| `overview.currentVisit` | Uruzinduko rwa none | Current visit | needs native-speaker review |
| `overview.viewDetails` | Reba ibisobanuro | View details | needs native-speaker review |
| `overview.allTickets` | Umurongo wanjye | My queue | needs native-speaker review |
| `overview.moreTickets_one` | Indi tike {{count}} uyu munsi | {{count}} more ticket today | needs native-speaker review |
| `overview.moreTickets_other` | Izindi tike {{count}} uyu munsi | {{count}} more tickets today | needs native-speaker review |
| `overview.startTitle` | Ukeneye kuvurirwa he? | Where do you need care? | needs native-speaker review |
| `overview.startBody` | Shaka ikigo cy'ubuvuzi, urebe serivisi zihari cyangwa ufate gahunda y'uruzinduko rukurikira. | Find a healthcare facility, explore available services or book your next visit. | needs native-speaker review |
| `overview.explore` | Reba ibigo by'ubuvuzi | Explore facilities | needs native-speaker review |
| `overview.quick` | Ibikorwa byihuse | Quick actions | needs native-speaker review |
| `overview.actions.findCare` | Shaka ubuvuzi | Find care | needs native-speaker review |
| `overview.actions.findCareBody` | Ibigo biri hafi yawe | Facilities near you | needs native-speaker review |
| `overview.actions.book` | Fata gahunda | Book appointment | needs native-speaker review |
| `overview.actions.bookBody` | Hitamo isaha | Choose a time | needs native-speaker review |
| `overview.actions.records` | Amadosiye yanjye | My records | needs native-speaker review |
| `overview.actions.recordsBody` | Ingendo n'ibisubizo | Visits and results | needs native-speaker review |
| `overview.actions.family` | Umuryango wanjye | My family | needs native-speaker review |
| `overview.actions.familyBody` | Abo witaho | People you care for | needs native-speaker review |
| `overview.actions.documents` | Inyandiko | Documents | needs native-speaker review |
| `overview.actions.documentsBody` | Amabaruwa na raporo | Letters and reports | needs native-speaker review |
| `overview.upcoming` | Gahunda zitegerejwe | Upcoming appointments | needs native-speaker review |
| `overview.activity` | Ibiheruka | Recent activity | needs native-speaker review |
| `overview.activityFailed` | Ntitwashoboye kubona ibiheruka. | We couldn't load your recent activity. | needs native-speaker review |
| `overview.activityEmpty` | Nta kirakorwa | No activity yet | needs native-speaker review |
| `overview.activityEmptyBody` | Gahunda, ibisubizo n'inyandiko bizagaragara hano. | Bookings, results and documents will show up here. | needs native-speaker review |
| `overview.aside` | Ubuzima bwawe n'umuryango | Your health and family | needs native-speaker review |
| `overview.family` | Umuryango | Family | needs native-speaker review |
| `overview.manage` | Genzura | Manage | needs native-speaker review |
| `overview.familyEmpty` | Ongeraho umwana cyangwa undi muntu witaho. | Add a child or someone you care for. | needs native-speaker review |
| `overview.attention.title` | Ibikeneye ko ubyitaho | Needs your attention | needs native-speaker review |
| `overview.attention.allSet` | Nta kibazo | You're all set | needs native-speaker review |
| `overview.attention.allSetBody` | Nta kintu gikeneye igisubizo cyawe ubu. | Nothing needs an answer from you right now. | needs native-speaker review |
| `overview.glance.label` | Muri make | At a glance | needs native-speaker review |
| `overview.glance.upcoming` | Gahunda ziri imbere | Upcoming | needs native-speaker review |
| `overview.glance.next` | Ikurikira: {{when}} | Next: {{when}} | needs native-speaker review |
| `overview.glance.upcomingNone` | Nta gahunda wafashe | Nothing booked | needs native-speaker review |
| `overview.glance.medicines` | Imiti urimo gufata | Active medicines | needs native-speaker review |
| `overview.glance.from` | Yatanzwe na {{facility}} | From {{facility}} | needs native-speaker review |
| `overview.glance.medicinesNone` | Nta miti ubu | None right now | needs native-speaker review |
| `overview.glance.records` | Amakuru y'ubuvuzi | Medical records | needs native-speaker review |
| `overview.glance.lastVisit` | Uheruka kwivuza {{date}} | Last visit {{date}} | needs native-speaker review |
| `overview.glance.recordsNone` | Nta gusura kwabayeho | No visits yet | needs native-speaker review |
| `overview.glance.unread` | Ubutumwa butarasomwa | Unread messages | needs native-speaker review |
| `overview.glance.unreadHint` | Mu butumwa bwawe | In your notifications | needs native-speaker review |
| `overview.glance.unreadNone` | Wasomye byose | You're all caught up | needs native-speaker review |
| `overview.visits.title` | Uheruka kwivuza | Recent visits | needs native-speaker review |
| `overview.visits.empty` | Nta gusura kwabayeho | No visits yet | needs native-speaker review |
| `overview.visits.emptyBody` | Nyuma yo kwivuza, incamake yasinywe na muganga igaragara hano. | After a visit, the doctor's signed summary shows here. | needs native-speaker review |
| `overview.vitals.title` | Ibipimo biheruka | Latest measurements | needs native-speaker review |
| `overview.vitals.recorded` | Byafashwe ku wa {{date}} kuri {{facility}}. | Taken on {{date}} at {{facility}}. | needs native-speaker review |
| `overview.vitals.note` | Muganga wawe ashobora kugusobanurira icyo bisobanura. | Your doctor can explain what they mean for you. | needs native-speaker review |
| `overview.vitals.empty` | Nta bipimo biraboneka | No measurements yet | needs native-speaker review |
| `overview.vitals.emptyBody` | Ibipimo bifatwa iyo wivuje bigaragara hano. | Measurements taken at your visits show here. | needs native-speaker review |
| `overview.vitals.bp` | Umuvuduko w'amaraso | Blood pressure | needs native-speaker review |
| `overview.vitals.pulse` | Gutera k'umutima | Pulse | needs native-speaker review |
| `overview.vitals.temperature` | Ubushyuhe | Temperature | needs native-speaker review |
| `overview.vitals.spo2` | Umwuka mu maraso | Oxygen level | needs native-speaker review |
| `overview.vitals.weight` | Ibiro | Weight | needs native-speaker review |
| `overview.vitals.respiratory` | Guhumeka | Breathing rate | needs native-speaker review |
| `overview.medicines.title` | Imiti urimo gufata | Current medicines | needs native-speaker review |
| `overview.medicines.items_one` | Umuti {{count}} | {{count}} medicine | needs native-speaker review |
| `overview.medicines.items_other` | Imiti {{count}} | {{count}} medicines | needs native-speaker review |
| `overview.medicines.until` | Igeza ku wa {{date}} | Valid until {{date}} | needs native-speaker review |
| `overview.medicines.empty` | Nta miti urimo gufata | No active medicines | needs native-speaker review |
| `reminders.title` | Ibyibutswa | Reminders | needs native-speaker review |
| `reminders.answer` | Ikigo cyagusabye isaha nshya ya {{service}} | The facility proposed a new time for {{service}} | needs native-speaker review |
| `reminders.reply` | Subiza | Answer | needs native-speaker review |
| `reminders.soon` | {{service}} iregereje | {{service}} is coming up | needs native-speaker review |
| `reminders.arrive` | Bwira abakira abarwayi ko wahageze (tike {{ticket}}) | Tell reception you've arrived (ticket {{ticket}}) | needs native-speaker review |
| `reminders.open` | Fungura tike | Open ticket | needs native-speaker review |
| `reminders.result` | Igisubizo gishya kiriteguye | A new result is ready | needs native-speaker review |
| `reminders.readResult` | Gisome | Read it | needs native-speaker review |
| `reminders.planned` | {{what}} iregereje | {{what}} is coming up | needs native-speaker review |
| `reminders.bill` | Usigaje kwishyura {{amount}} | {{amount}} left to pay | needs native-speaker review |
| `reminders.seeBill` | Reba inyemezabuguzi | See the bill | needs native-speaker review |
| `reminders.disputeQuestion` | Ivuriro rifite icyo rikubaza ku kirego cyawe | The facility asked you about your dispute | needs native-speaker review |
| `reminders.disputeAnswer` | Ikirego cyawe cyasubijwe | Your dispute has an answer | needs native-speaker review |
| `reminders.openDispute` | Fungura | Open | needs native-speaker review |
| `comingUp.title` | Byateganyijwe n'ivuriro ryawe | Planned by your clinic | needs native-speaker review |
| `comingUp.intro` | Amatariki ivuriro ryawe ryateganyije. Tukwibutsa umunsi ubanziriza n'icyo gitondo. | Dates your clinic planned. We remind you the day before and on the morning. | needs native-speaker review |
| `comingUp.types.vaccination` | Urukingo | Vaccination | needs native-speaker review |
| `comingUp.types.antenatal` | Isuzuma ry'umubyeyi utwite | Antenatal visit | needs native-speaker review |
| `comingUp.types.follow_up` | Kugaruka kwa muganga | Return visit | needs native-speaker review |
| `comingUp.book` | Fata isaha | Book a time | needs native-speaker review |
| `comingUp.failed` | Ntibyakunze kubona amatariki ivuriro ryawe ryateganyije. | We couldn't load the dates your clinic planned. | needs native-speaker review |
| `appointments.title` | Gahunda zanjye | My appointments | needs native-speaker review |
| `appointments.subtitle` | Genzura gahunda zitegerejwe n'izashize. | Manage your upcoming and previous healthcare visits. | needs native-speaker review |
| `appointments.book` | Fata gahunda | Book appointment | needs native-speaker review |
| `appointments.views` | Gahunda zihe | Which appointments | needs native-speaker review |
| `appointments.count_one` | Gahunda {{count}} | {{count}} appointment | needs native-speaker review |
| `appointments.count_other` | Gahunda {{count}} | {{count}} appointments | needs native-speaker review |
| `appointments.tabs.upcoming` | Zitegerejwe | Upcoming | needs native-speaker review |
| `appointments.tabs.past` | Izashize | Past | needs native-speaker review |
| `appointments.tabs.cancelled` | Izahagaritswe | Cancelled | needs native-speaker review |
| `appointments.failed` | Ntitwashoboye kubona gahunda zawe. | We couldn't load your appointments. | needs native-speaker review |
| `appointments.empty.upcoming` | Nta gahunda itegerejwe | No upcoming appointments | needs native-speaker review |
| `appointments.empty.past` | Nta gahunda yashize | No past appointments | needs native-speaker review |
| `appointments.empty.cancelled` | Nta gahunda yahagaritswe | No cancelled appointments | needs native-speaker review |
| `appointments.emptyBody` | Shaka ikigo ufate isaha ikunogeye. | Find a facility and book a time that suits you. | needs native-speaker review |
| `appointments.for` | ya {{name}} | for {{name}} | needs native-speaker review |
| `appointments.view` | Reba gahunda | View appointment | needs native-speaker review |
| `appointments.more` | Ibindi bikorwa kuri {{service}} | More actions for {{service}} | needs native-speaker review |
| `appointments.manage` | Genzura | Manage | needs native-speaker review |
| `appointments.facilityPage` | Urupapuro rw'ikigo | Facility page | needs native-speaker review |
| `appointments.reschedule` | Hindura isaha | Reschedule | needs native-speaker review |
| `appointments.cancel` | Hagarika gahunda | Cancel appointment | needs native-speaker review |
| `appointments.cancelled` | Gahunda yawe yahagaritswe. | Your appointment has been cancelled. | needs native-speaker review |
| `appointments.rescheduled` | Gahunda yawe yimuriwe ku yindi saha. | Your appointment has been moved. | needs native-speaker review |
| `appointments.actionFailed` | Ntitwashoboye guhindura gahunda yawe. Ongera ugerageze. | We couldn't update your appointment. Please try again. | needs native-speaker review |
| `appointments.back` | Gahunda zose | All appointments | needs native-speaker review |
| `appointments.notFound` | Gahunda ntiyabonetse | Appointment not found | needs native-speaker review |
| `appointments.notFoundBody` | Ishobora kuba ari iya konti indi. | It may belong to another account. | needs native-speaker review |
| `appointments.info` | Gahunda | Appointment | needs native-speaker review |
| `appointments.date` | Itariki | Date | needs native-speaker review |
| `appointments.time` | Isaha | Time | needs native-speaker review |
| `appointments.doctor` | Umuganga | Doctor | needs native-speaker review |
| `appointments.patient` | Umurwayi | Patient | needs native-speaker review |
| `appointments.room` | Icyumba | Room | needs native-speaker review |
| `appointments.reason` | Ibyo watubwiye | What you told us | needs native-speaker review |
| `appointments.facility` | Ikigo | Facility | needs native-speaker review |
| `appointments.hoursToday` | Gikora uyu munsi | Open today | needs native-speaker review |
| `appointments.phone` | Telefoni | Phone | needs native-speaker review |
| `appointments.timeline` | Intambwe | Timeline | needs native-speaker review |
| `appointments.steps.booked` | Gahunda yafashwe | Booked | needs native-speaker review |
| `appointments.steps.day` | Umunsi w'uruzinduko | Visit day | needs native-speaker review |
| `appointments.steps.checkedIn` | Wakiriwe ku kwakira abarwayi | Checked in at reception | needs native-speaker review |
| `appointments.steps.cancelled` | Yahagaritswe | Cancelled | needs native-speaker review |
| `appointments.steps.missed` | Ntiwaje | Missed | needs native-speaker review |
| `appointments.steps.rescheduled` | Yimuriwe ku yindi saha | Moved to a new time | needs native-speaker review |
| `appointments.bring` | Icyo uzitwaza | What to bring | needs native-speaker review |
| `appointments.bringItems.id` | Indangamuntu yawe cyangwa nimero ya MediLink | Your ID card or MediLink number | needs native-speaker review |
| `appointments.bringItems.insurance` | Ikarita y'ubwishingizi bwawe | Your insurance card | needs native-speaker review |
| `appointments.bringItems.code` | Kode ya gahunda yawe {{code}} | Your booking code {{code}} | needs native-speaker review |
| `appointments.bringItems.papers` | Ibisubizo, impapuro z'imiti cyangwa amabaruwa yo kohereza biheruka | Recent results, prescriptions or referral letters | needs native-speaker review |
| `appointments.reference` | Kode ya gahunda | Booking reference | needs native-speaker review |
| `appointments.showCode` | Erekana iyi kode ku kwakira abarwayi. | Show this code at reception. | needs native-speaker review |
| `appointments.changeUntil` | Ushobora guhindura cyangwa guhagarika kugeza {{time}}. | You can change or cancel until {{time}}. | needs native-speaker review |
| `appointments.changeClosed` | Guhagarika ubu bibarwa nko guhagarika bitinze. | Cancelling now counts as late. | needs native-speaker review |
| `appointments.directions` | Inzira ijyayo | Get directions | needs native-speaker review |
| `reschedule.title` | Hitamo isaha nshya | Choose a new time | needs native-speaker review |
| `reschedule.body` | Amasaha ari ubusa ya {{service}} kuri {{facility}}. | Free times for {{service}} at {{facility}}. | needs native-speaker review |
| `reschedule.reviewTitle` | Suzuma isaha nshya | Review the new time | needs native-speaker review |
| `reschedule.earlier` | Mbere | Earlier | needs native-speaker review |
| `reschedule.later` | Nyuma | Later | needs native-speaker review |
| `reschedule.days` | Iminsi ifite amasaha ari ubusa | Days with free times | needs native-speaker review |
| `reschedule.times` | Amasaha ari ubusa | Free times | needs native-speaker review |
| `reschedule.none` | Nta saha iri ubusa iki cyumweru | No free times this week | needs native-speaker review |
| `reschedule.loadFailed` | Ntitwashoboye kubona amasaha ari ubusa. | We couldn't load free times. | needs native-speaker review |
| `reschedule.from` | Isaha ufite ubu | Current time | needs native-speaker review |
| `reschedule.to` | Isaha nshya | New time | needs native-speaker review |
| `reschedule.held` | Iyi saha turayikubikiye mu gihe cya | We're keeping this time for you for | needs native-speaker review |
| `reschedule.expired` | Igihe cyarangiye. Ongera uhitemo. | Time ran out. Choose again. | needs native-speaker review |
| `reschedule.oldFreed` | Isaha ufite ubu irekurwa gusa iyo inshya yemejwe. | Your current time is released only when the new one is confirmed. | needs native-speaker review |
| `reschedule.otherTime` | Hitamo indi saha | Choose another time | needs native-speaker review |
| `reschedule.confirm` | Emeza isaha nshya | Confirm new time | needs native-speaker review |
| `queue.title` | Umurongo wanjye | My queue | needs native-speaker review |
| `queue.subtitle` | Kurikirana tike z'uyu munsi n'aho ugeze ku murongo. | Follow today's tickets and see where you are in line. | needs native-speaker review |
| `queue.join` | Jya ku murongo | Join a queue | needs native-speaker review |
| `queue.today` | Uyu munsi | Today | needs native-speaker review |
| `queue.failed` | Ntitwashoboye kubona tike zawe. | We couldn't load your tickets. | needs native-speaker review |
| `queue.none` | Nturi ku murongo | Not in a queue | needs native-speaker review |
| `queue.noneBody` | Jya ku murongo w'ikigo kibyemera, cyangwa wiyandikishe ku kwakira abarwayi. | Join a queue from a facility that allows it, or check in at reception. | needs native-speaker review |
| `queue.remoteNote` | Abakira abarwayi bemeza ko wahageze. | Reception confirms your arrival. | needs native-speaker review |
| `queue.previous` | Ingendo zabanje | Previous visits | needs native-speaker review |
| `queue.previousTitle` | Tike zabanje ntiziragaragara hano | Past tickets aren't listed here yet | needs native-speaker review |
| `queue.previousBody` | Nyuma y'uruzinduko, dosiye umuganga yasinye igaragara mu Madosiye y'ubuzima. | After a visit, the doctor's signed record appears in Medical records. | needs native-speaker review |
| `queue.how.title` | Uko umurongo ukora | How the queue works | needs native-speaker review |
| `queue.how.join` | Jya ku murongo ukoresheje telefoni aho ikigo kibyemera, cyangwa ufate tike kuri resepsiyo. | Join from your phone where the facility allows it, or take a ticket at reception. | needs native-speaker review |
| `queue.how.follow` | Kurikira hano abantu bakuri imbere n'igihe ikigo kigereranya ko uzategereza. | Follow the people ahead of you and the facility's own wait estimate here. | needs native-speaker review |
| `queue.how.called` | Iyo igihe cyawe kigeze, iyi paji ikubwira aho ujya, ikanumvikanisha ijwi. | When it's your turn, this page tells you where to go, with a sound. | needs native-speaker review |
| `queue.back` | Umurongo wanjye | My queue | needs native-speaker review |
| `queue.ticket` | Tike | Ticket | needs native-speaker review |
| `queue.ahead` | Abakuri imbere | People ahead | needs native-speaker review |
| `queue.estimate` | Igihe cyo gutegereza | Estimated wait | needs native-speaker review |
| `queue.wait` | Iminota {{min}}–{{max}} | {{min}}–{{max}} min | needs native-speaker review |
| `queue.noEstimate.break` | Umuganga ari mu kiruhuko gito | Doctor on a short break | needs native-speaker review |
| `queue.noEstimate.emergency` | Byahagaze kubera ubutabazi | Paused for an emergency | needs native-speaker review |
| `queue.noEstimate.none_on_duty` | Nta muganga uri ku kazi | No doctor on duty yet | needs native-speaker review |
| `queue.noEstimate.none` | Ntibiraboneka | Not available yet | needs native-speaker review |
| `queue.updated` | Byavuguruwe saa {{time}} | Updated {{time}} | needs native-speaker review |
| `queue.arrival.confirmed` | Wakiriwe | Checked in | needs native-speaker review |
| `queue.arrival.claimed` | Bitegereje kwemezwa n'abakira abarwayi | Waiting for reception to confirm | needs native-speaker review |
| `queue.arrival.notYet` | Ntiwarakirwa | Not checked in yet | needs native-speaker review |
| `queue.viewLive` | Kurikirana umurongo | View live queue | needs native-speaker review |
| `queue.state.waiting` | Utegereje | Waiting | needs native-speaker review |
| `queue.state.called` | Igihe cyawe kirageze | Your turn | needs native-speaker review |
| `queue.state.in_service` | Uri kwa muganga | With the doctor | needs native-speaker review |
| `queue.state.no_response` | Wahamagawe ntiwitaba | Missed call | needs native-speaker review |
| `queue.state.on_hold` | Byahagaze | On hold | needs native-speaker review |
| `queue.state.moved_to_next_stage` | Intambwe ikurikira | Next step | needs native-speaker review |
| `queue.state.transferred` | Woherejwe ahandi | Transferred | needs native-speaker review |
| `queue.state.cancelled` | Byahagaritswe | Cancelled | needs native-speaker review |
| `queue.state.left_without_service` | Wagiye | Left | needs native-speaker review |
| `queue.state.completed` | Byarangiye | Completed | needs native-speaker review |
| `family.title` | Umuryango wanjye | My family | needs native-speaker review |
| `family.subtitle` | Genzura ubuvuzi bw'abantu bahujwe na konti yawe. | Manage healthcare for the people connected to your account. | needs native-speaker review |
| `family.add` | Ongeraho umuntu | Add family member | needs native-speaker review |
| `family.you` | Wowe | You | needs native-speaker review |
| `family.open` | Fungura umwirondoro | Open profile | needs native-speaker review |
| `family.age_one` | Umwaka {{count}} | {{count}} year | needs native-speaker review |
| `family.age_other` | Imyaka {{count}} | {{count}} years | needs native-speaker review |
| `family.access.guardian` | Umurera | Guardian | needs native-speaker review |
| `family.access.delegate` | Wahawe uburenganzira | Delegated | needs native-speaker review |
| `family.viewing` | Urareba umwirondoro wa {{name}} | You're viewing {{name}}'s profile | needs native-speaker review |
| `family.accessHint.guardian` | Ugenzura uyu mwirondoro nk'umurera. | You manage this profile as their guardian. | needs native-speaker review |
| `family.accessHint.delegate` | {{name}} yaguhaye uburenganzira bwo kumufasha mu buvuzi. | {{name}} gave you access to help with their care. | needs native-speaker review |
| `family.careFor` | Ubuvuzi bwa {{name}} | Care for {{name}} | needs native-speaker review |
| `family.links.appointments` | Gahunda zitegerejwe | Upcoming visits | needs native-speaker review |
| `family.links.records` | Ingendo zabanje | Visit history | needs native-speaker review |
| `family.links.medications` | Impapuro z'imiti | Prescriptions | needs native-speaker review |
| `family.links.documents` | Amabaruwa na raporo | Letters and reports | needs native-speaker review |
| `records.search` | Shakisha ukoresheje ikigo, umuganga cyangwa indwara | Search by facility, doctor or diagnosis | needs native-speaker review |
| `records.signed` | Yasinywe | Signed | needs native-speaker review |
| `records.noMatch` | Nta cyabonetse | No matches | needs native-speaker review |
| `records.emptyBody` | Amadosiye yawe y'ubuzima azagaragara hano igihe azaba abonetse. | Your medical records will appear here when they become available. | needs native-speaker review |
| `medications.title` | Imiti yanjye | My medications | needs native-speaker review |
| `documents.kinds` | Ubwoko bw'inyandiko | Document types | needs native-speaker review |
| `documents.all` | Zose | All | needs native-speaker review |
| `help.title` | Ubufasha | Help & support | needs native-speaker review |
| `help.subtitle` | Bona ibisubizo, vugana n'abatanga ubufasha kandi ukurikirane ibyo wasabye. | Find answers, contact support and follow your requests. | needs native-speaker review |
| `settings.subtitle` | Amakuru yawe, ururimi, ibanga, umutekano n'ubutumwa. | Your details, language, privacy, security and alerts. | needs native-speaker review |
| `settings.sections` | Ibice by'igenamiterere | Settings sections | needs native-speaker review |
| `settings.personal.title` | Amakuru bwite | Personal information | needs native-speaker review |
| `settings.personal.body` | Izina ryawe, aho ubarizwa n'ibikuranga biri ku mwirondoro wawe. | Your name, contact details and identifiers live on your profile. | needs native-speaker review |
| `settings.personal.name` | Izina | Name | needs native-speaker review |
| `settings.personal.email` | Imeyili | Email | needs native-speaker review |
| `settings.personal.verified` | Yemejwe | Verified | needs native-speaker review |
| `settings.personal.unverified` | Ntiyemejwe | Not confirmed | needs native-speaker review |
| `settings.personal.edit` | Hindura umwirondoro wanjye | Edit my profile | needs native-speaker review |
| `settings.display.title` | Ururimi n'imigaragarire | Language and display | needs native-speaker review |
| `settings.display.body` | Bihita bikora kandi bigumaho kuri iki gikoresho. | Applies at once and stays on this device. | needs native-speaker review |
| `settings.privacy.title` | Ibanga n'uburenganzira | Privacy and consent | needs native-speaker review |
| `settings.privacy.body` | Hitamo abashobora kubona amadosiye yawe kandi urebe abayafunguye. | Choose who can see your records and review who opened them. | needs native-speaker review |
| `settings.privacy.consent` | Ibanga n'uburenganzira | Privacy and consent | needs native-speaker review |
| `settings.privacy.delegates` | Abafite uburenganzira | People with access | needs native-speaker review |
| `settings.security.title` | Umutekano | Security | needs native-speaker review |
| `settings.security.body` | Rinda konti yawe. | Keep your account safe. | needs native-speaker review |
| `settings.security.password` | Andika ijambo ry'ibanga usanganywe, hanyuma irishya. Andi materefone na mudasobwa bizasohoka. | Enter your current password, then a new one. Other phones and browsers will be signed out. | needs native-speaker review |
| `settings.security.change` | Hindura ijambo ry'ibanga | Change password | needs native-speaker review |
| `settings.security.current` | Ijambo ry'ibanga usanganywe | Current password | needs native-speaker review |
| `settings.security.new` | Ijambo ry'ibanga rishya | New password | needs native-speaker review |
| `settings.security.done` | Ijambo ry'ibanga ryahinduwe. Andi materefone na mudasobwa byasohotse. | Password changed. Other phones and browsers are signed out. | needs native-speaker review |
| `settings.security.forgot` | Wibagiwe ijambo ry'ibanga usanganywe? | Forgot your current password? | needs native-speaker review |
| `settings.security.later` | Ibikoresho winjiriyemo no kwinjira mu ntambwe ebyiri bizongerwa hano. | Signed-in devices and two-step sign-in will be added here. | needs native-speaker review |
| `settings.alerts.title` | Ubutumwa wifuza | Notification preferences | needs native-speaker review |
| `settings.alerts.body` | Ubutumwa wakira, aho bukugeraho n'amasaha yo gutuza. | Which alerts you get, on which channel, and quiet hours. | needs native-speaker review |
| `settings.alerts.open` | Igenamiterere ry'ubutumwa | Notification preferences | needs native-speaker review |
| `settings.alerts.openShort` | Fungura | Open | needs native-speaker review |
| `settings.account.title` | Konti | Account | needs native-speaker review |
| `settings.account.body` | Sohoka kuri iki gikoresho cyangwa udusabe gufunga konti yawe. | Sign out on this device or ask us to close your account. | needs native-speaker review |
| `settings.account.close` | Saba gufunga konti yanjye | Ask to close my account | needs native-speaker review |

## patient-web feature: disputes (namespace disputes)

File: `apps/patient-web/src/features/disputes/locales/rw.json`

| Key | Kinyarwanda (draft) | English source | Status |
|---|---|---|---|
| `title` | Ibirego | Disputes | needs native-speaker review |
| `failed` | Ntitwashoboye kubona ibirego byawe. | We couldn't load your disputes. | needs native-speaker review |
| `empty` | Nta kirego | No disputes | needs native-speaker review |
| `notFound` | Ikirego ntikibonetse | Dispute not found | needs native-speaker review |
| `report` | Tanga ikibazo | Report a problem | needs native-speaker review |
| `subject.visit` | Uruzinduko | Visit | needs native-speaker review |
| `subject.ticket` | Itike y’umurongo | Queue ticket | needs native-speaker review |
| `subject.booking` | Gahunda | Booking | needs native-speaker review |
| `subject.no_show_strike` | Kutitabira | Missed visit | needs native-speaker review |
| `subject.prescription` | Urupapuro rw’imiti | Prescription | needs native-speaker review |
| `subject.bill` | Inyemezabuguzi | Bill | needs native-speaker review |
| `subject.document` | Inyandiko | Document | needs native-speaker review |
| `status.open` | Cyoherejwe | Sent | needs native-speaker review |
| `status.acknowledged` | Cyakiriwe | Received | needs native-speaker review |
| `status.under_review` | Kirasuzumwa | Under review | needs native-speaker review |
| `status.info_requested` | Igisubizo cyawe kirakenewe | Your reply needed | needs native-speaker review |
| `status.resolved` | Cyasubijwe | Answered | needs native-speaker review |
| `status.escalated` | Kiri kwa MediLink | With MediLink | needs native-speaker review |
| `status.final_decision` | Icyemezo cya nyuma | Final decision | needs native-speaker review |
| `status.closed` | Cyafunzwe | Closed | needs native-speaker review |
| `status.reopened` | Cyongeye gufungurwa | Reopened | needs native-speaker review |
| `outcome.no_show_reversed` | Kutitabira kwavanyweho | Missed visit removed | needs native-speaker review |
| `outcome.record_corrected` | Idosiye izakosorwa | Record to be corrected | needs native-speaker review |
| `outcome.correction_refused` | Gukosora byanzwe | Correction refused | needs native-speaker review |
| `outcome.refund` | Uzasubizwa amafaranga | Refund agreed | needs native-speaker review |
| `outcome.bill_correction` | Inyemezabuguzi izakosorwa | Bill to be corrected | needs native-speaker review |
| `outcome.rebooking` | Gahunda nshya yemejwe | New appointment agreed | needs native-speaker review |
| `outcome.rejected` | Ntibyemewe | Not upheld | needs native-speaker review |
| `new.title` | Tanga ikibazo | Report a problem | needs native-speaker review |
| `new.fromSubject` | Fungura inyemezabuguzi, urupapuro rw’imiti cyangwa inyandiko bireba, uhitemo Tanga ikibazo. | Open the bill, prescription or document concerned and choose Report a problem. | needs native-speaker review |
| `new.what` | Ni iki kitagenze neza? | What went wrong? | needs native-speaker review |
| `new.hint` | Nibura inyuguti {{min}}. | At least {{min}} characters. | needs native-speaker review |
| `new.send` | Ohereza | Send | needs native-speaker review |
| `facts.facility` | Ivuriro | Facility | needs native-speaker review |
| `facts.raised` | Cyoherejwe | Sent | needs native-speaker review |
| `facts.answerBy` | Igisubizo bitarenze | Answer by | needs native-speaker review |
| `facts.decisionBy` | Icyemezo bitarenze | Decision by | needs native-speaker review |
| `facts.what` | Ibyo wanditse | What you wrote | needs native-speaker review |
| `actions.accept` | Emera | Accept | needs native-speaker review |
| `actions.escalate` | Ntiwemera: ohereza kwa MediLink | Disagree: send to MediLink | needs native-speaker review |
| `actions.reopen` | Ongera ufungure | Reopen | needs native-speaker review |
| `done.accept` | Cyafunzwe. | Closed. | needs native-speaker review |
| `done.escalate` | Cyoherejwe kwa MediLink. | Sent to MediLink. | needs native-speaker review |
| `done.reopen` | Cyongeye gufungurwa. | Reopened. | needs native-speaker review |
| `done.statement` | Ibisobanuro byawe byongewe ku idosiye. | Statement added to your record. | needs native-speaker review |
| `done.message` | Ubutumwa bwoherejwe. | Message sent. | needs native-speaker review |
| `statement.label` | Ibisobanuro byawe | Your statement | needs native-speaker review |
| `statement.hint` | Bibikwa mu idosiye yawe iruhande rw’ibyo ivuriro ryanditse. | Kept with your record next to the facility's. | needs native-speaker review |
| `statement.send` | Ongeraho ibisobanuro | Add statement | needs native-speaker review |
| `statement.yours` | Ibisobanuro byawe | Your statement | needs native-speaker review |
| `thread.title` | Ubutumwa | Messages | needs native-speaker review |
| `thread.you` | Wowe | You | needs native-speaker review |
| `thread.reply` | Ubutumwa | Message | needs native-speaker review |
| `thread.send` | Ohereza | Send | needs native-speaker review |
| `thread.infoRequested` | Ivuriro ryakubajije ikibazo. | The facility asked you a question. | needs native-speaker review |

## patient-web feature: documents (namespace documents)

File: `apps/patient-web/src/features/documents/locales/rw.json`

| Key | Kinyarwanda (draft) | English source | Status |
|---|---|---|---|
| `title` | Inyandiko zanjye | My documents | needs native-speaker review |
| `intro` | Resept, ibyemezo by'uburwayi, amabaruwa yohereza n'ibizamini byasabwe mu ngendo zawe. Buri imwe ifite kode umuntu wese ashobora kugenzura. | Prescriptions, sick notes, referral letters and lab requests from your visits. Each one has a code anyone can check. | needs native-speaker review |
| `seeAll` | Reba byose | See all | needs native-speaker review |
| `whose` | Inyandiko za nde | Whose documents | needs native-speaker review |
| `everyone` | Bose | Everyone | needs native-speaker review |
| `downloadAll` | Kuramo zose (ZIP) | Download all (ZIP) | needs native-speaker review |
| `failed` | Ntibyakunze. Ongera ugerageze. | That didn't work. Try again. | needs native-speaker review |
| `empty` | Nta nyandiko irahari | No documents yet | needs native-speaker review |
| `emptyBody` | Muganga nasinya resept, urwandiko cyangwa icyemezo cy'uburwayi, kizagaragara hano. | When a doctor signs a prescription, letter or sick note for you, it appears here. | needs native-speaker review |
| `back` | Inyandiko zanjye | My documents | needs native-speaker review |
| `about` | Ibyerekeye iyi nyandiko | About this document | needs native-speaker review |
| `facts.number` | Nimero | Number | needs native-speaker review |
| `facts.facility` | Ikigo cy'ubuvuzi | Facility | needs native-speaker review |
| `facts.author` | Yanditswe na | Written by | needs native-speaker review |
| `facts.date` | Itariki | Date | needs native-speaker review |
| `facts.version` | Verisiyo | Version | needs native-speaker review |
| `notFound` | Ntitubona iyi nyandiko. | We can't find this document. | needs native-speaker review |
| `by` | na {{name}} | by {{name}} | needs native-speaker review |
| `codeLabel` | Kode yo kugenzura | Verification code | needs native-speaker review |
| `codeHint` | Iri munsi ya kode ya QR ku rupapuro. Nimero {{number}}. | Under the QR code on the paper. Number {{number}}. | needs native-speaker review |
| `download` | Kuramo | Download | needs native-speaker review |
| `preparing` | Iracyategurwa | Preparing | needs native-speaker review |
| `newVersion` | Iyi ni verisiyo ya {{n}}. Izacapwe mbere ntizikigezweho. | This is version {{n}}. Earlier printouts are out of date. | needs native-speaker review |
| `kind.prescription` | Resept | Prescription | needs native-speaker review |
| `kind.referral` | Urwandiko rwohereza umurwayi | Referral letter | needs native-speaker review |
| `kind.lab_request` | Gusaba ibizamini | Lab or imaging request | needs native-speaker review |
| `kind.sick_note` | Icyemezo cy'uburwayi | Sick note | needs native-speaker review |
| `status.active` | Iremewe | Valid | needs native-speaker review |
| `status.dispensed` | Yatanzwe | Dispensed | needs native-speaker review |
| `status.cancelled` | Yahagaritswe | Cancelled | needs native-speaker review |
| `status.expired` | Yarangiye | Expired | needs native-speaker review |
| `share.title` | Sangiza undi muntu | Share with someone | needs native-speaker review |
| `share.intro` | Kora ihuza ry'umukoresha, ishuri cyangwa undi muganga. Rifungura iyi nyandiko yonyine kandi rihagarara iyo igihe cyaryo kirangiye. | Make a link for an employer, a school or another doctor. It opens only this document and stops working when it expires. | needs native-speaker review |
| `share.lasts` | Ihuza rimara | The link lasts | needs native-speaker review |
| `share.days_one` | Umunsi {{count}} | {{count}} day | needs native-speaker review |
| `share.days_other` | Iminsi {{count}} | {{count}} days | needs native-speaker review |
| `share.make` | Kora ihuza | Make a link | needs native-speaker review |
| `share.made` | Ihuza ryawe | Your link | needs native-speaker review |
| `share.once` | Rikoporore ubu: turyerekana rimwe gusa. | Copy it now: we show it only once. | needs native-speaker review |
| `share.copy` | Koporora ihuza | Copy the link | needs native-speaker review |
| `share.copied` | Ryakoporowe | Copied | needs native-speaker review |
| `share.until` | Rikora kugeza {{date}} | Works until {{date}} | needs native-speaker review |
| `share.opened_one` | Ryafunguwe inshuro {{count}} | Opened {{count}} time | needs native-speaker review |
| `share.opened_other` | Ryafunguwe inshuro {{count}} | Opened {{count}} times | needs native-speaker review |
| `share.revoke` | Hagarika iri huza | Stop this link | needs native-speaker review |
| `verify.title` | Genzura inyandiko | Verify a document | needs native-speaker review |
| `verify.intro` | Andika kode iri munsi ya QR code. | Type the code printed under the QR code. | needs native-speaker review |
| `verify.code` | Kode yo kugenzura | Verification code | needs native-speaker review |
| `verify.codeHint` | Inyuguti n'imibare 10 | 10 letters and numbers | needs native-speaker review |
| `verify.check` | Genzura | Check | needs native-speaker review |
| `verify.notFound` | Nta nyandiko ifite iyi kode | No document has this code | needs native-speaker review |
| `verify.notFoundBody` | Ongera urebe kode. Inyandiko itabonetse ishobora kuba ari impimbano. | Check the code again. A document that is not found may be forged. | needs native-speaker review |
| `verify.limited` | Wagenzuye kenshi. Tegereza umunota umwe wongere ugerageze. | Too many checks. Wait a minute and try again. | needs native-speaker review |
| `verify.genuine` | Inyandiko nyayo ya MediLink | Genuine MediLink document | needs native-speaker review |
| `verify.notValid` | Iyi nyandiko ntikiremewe | This document is no longer valid | needs native-speaker review |
| `verify.kind` | Inyandiko | Document | needs native-speaker review |
| `verify.number` | Nimero | Number | needs native-speaker review |
| `verify.issued` | Yatanzwe | Issued | needs native-speaker review |
| `verify.validUntil` | Igihe izamara | Valid until | needs native-speaker review |
| `verify.facility` | Ivuriro | Facility | needs native-speaker review |
| `verify.author` | Byasinywe na | Signed by | needs native-speaker review |
| `verify.version` | Verisiyo ya {{n}}: indi nshya yasimbuye iyacapwe bwa mbere. | Version {{n}}: a newer version replaced the first printout. | needs native-speaker review |
| `verify.detailsIntro` | Kugira ngo urebe ibiyirimo, andika itariki y'amavuko y'umurwayi. | To see what it says, give the patient's date of birth. | needs native-speaker review |
| `verify.dob` | Itariki y'amavuko y'umurwayi | Patient's date of birth | needs native-speaker review |
| `verify.showDetails` | Erekana ibiyirimo | Show the content | needs native-speaker review |
| `verify.dobMismatch` | Iyo tariki y'amavuko ntihuye n'iyi nyandiko. | That date of birth doesn't match this document. | needs native-speaker review |
| `verify.for` | Ya {{name}} | For {{name}} | needs native-speaker review |
| `verify.codeRequired` | Andika kode iri ku nyandiko. | Enter the code on the document. | needs native-speaker review |
| `verify.dobRequired` | Andika itariki y’amavuko. | Enter the date of birth. | needs native-speaker review |
| `shared.title` | Inyandiko yasangijwe | Shared document | needs native-speaker review |
| `shared.gone` | Iri huza ntirigikora | This link no longer works | needs native-speaker review |
| `shared.goneBody` | Igihe cyaryo cyarangiye cyangwa umurwayi yarihagaritse. Musabe irindi huza. | It expired or the patient stopped it. Ask them for a new link. | needs native-speaker review |
| `shared.until` | Ihuza rikora kugeza {{date}}. | The link works until {{date}}. | needs native-speaker review |

## patient-web feature: facilityApplication (namespace facilityApplication)

File: `apps/patient-web/src/features/facilityApplication/locales/rw.json`

| Key | Kinyarwanda (draft) | English source | Status |
|---|---|---|---|
| `public.title` | MediLink ku bigo by'ubuvuzi | MediLink for health facilities | needs native-speaker review |
| `public.problem` | Gufata gahunda, umurongo ugaragara n’amadosiye muri sisitemu imwe. | Booking, a live queue and records in one system. | needs native-speaker review |
| `public.register` | Andikisha ikigo cyawe | Register your facility | needs native-speaker review |
| `public.continue` | Komeza ubusabe | Continue an application | needs native-speaker review |
| `public.sessionEnded` | Ubusabe bwawe bwabitswe. Twakoherereje link yo kubukomeza nyuma. | Your application is saved. We emailed you a link to continue it later. | needs native-speaker review |
| `public.howTitle` | Uko kwiyandikisha bigenda | How onboarding works | needs native-speaker review |
| `public.phases.apply.title` | Gusaba | Apply | needs native-speaker review |
| `public.phases.apply.body` | Tubwire ibijyanye n'ikigo, wohereze uruhushya n'impapuro zo kwiyandikisha. | Tell us about the facility and upload its licence and registration documents. | needs native-speaker review |
| `public.phases.verify.title` | Kugenzura | Verification | needs native-speaker review |
| `public.phases.verify.body` | Itsinda ryacu rigenzura inyandiko kandi rishobora gusaba impinduka. | Our team checks the documents and may ask for changes. | needs native-speaker review |
| `public.phases.setup.title` | Gutegura | Setup | needs native-speaker review |
| `public.phases.setup.body` | Umuyobozi wawe ashyiraho serivisi, gahunda n'abakozi. | Your administrator adds services, schedules and staff. | needs native-speaker review |
| `public.phases.live.title` | Gutangira | Live | needs native-speaker review |
| `public.phases.live.body` | Abarwayi barakubona kandi bagafata gahunda kuri interineti. | Patients can find you and book online. | needs native-speaker review |
| `public.faqTitle` | Ibibazo | Questions | needs native-speaker review |
| `public.faq.cost.q` | Bisaba amafaranga angahe? | What does it cost? | needs native-speaker review |
| `public.faq.cost.a` | Kwiyandikisha ni ubuntu mu gihe cy'igerageza. Ifatabuguzi ryose rizumvikanwaho nawe mbere y'uko ritangira. | Onboarding is free during the pilot. We will agree any subscription with you before it applies. | needs native-speaker review |
| `public.faq.documents.q` | Nkeneye izihe nyandiko? | Which documents do I need? | needs native-speaker review |
| `public.faq.documents.a` | Uruhushya rwa Minisiteri y'Ubuzima. Ibigo byigenga bikenera kandi icyemezo cya RDB na TIN. | Your Ministry of Health operating licence. Private facilities also need their RDB registration and TIN certificate. | needs native-speaker review |
| `public.faq.time.q` | Kugenzura bitwara igihe kingana iki? | How long does verification take? | needs native-speaker review |
| `public.faq.time.a` | Akenshi iminsi mike y'akazi nyuma yo kohereza ubusabe bwuzuye. | Usually a few working days after you submit a complete application. | needs native-speaker review |
| `public.faq.data.q` | Ni nde ushobora kubona amakuru y'abarwayi bacu? | Who can see our patients' data? | needs native-speaker review |
| `public.faq.data.a` | Abakozi bawe gusa n'abarwayi ubwabo. Amakuru aguma mu Rwanda kandi buri gusura kurandikwa. | Only your staff, and the patients themselves. Data stays in Rwanda and access is logged. | needs native-speaker review |
| `public.benefitsTitle` | Icyo bihindura kuri mwe | What changes for you | needs native-speaker review |
| `public.benefits.queue` | Abarwayi babona igihe cyo gutegereza mbere yo kuza | Patients see your wait before they come | needs native-speaker review |
| `public.benefits.day` | Gahunda n’abaje batayifite mu igenamigambi rimwe ry’umunsi | Bookings and walk-ins in one day plan | needs native-speaker review |
| `public.benefits.records` | Amadosiye, imiti yanditswe n’ubwishyu ahantu hamwe | Records, prescriptions and payments in one place | needs native-speaker review |
| `start.title` | Andikisha ikigo cyawe | Register your facility | needs native-speaker review |
| `start.intro` | Tangira n'amakuru make. Ushobora kubika ugakomeza nyuma: tukoherereza link kuri imeyili. | Start with a few details. You can save and continue later: we email you a link. | needs native-speaker review |
| `start.emailHint` | Link yo gukomeza ubusabe tuyohereza kuri iyi meyili. | We send the link to continue your application to this address. | needs native-speaker review |
| `start.submit` | Tangira ubusabe | Start the application | needs native-speaker review |
| `start.honeypot` | Ntugire icyo wandika hano | Leave this empty | needs native-speaker review |
| `resume.title` | Komeza ubusabe bwawe | Continue your application | needs native-speaker review |
| `resume.opening` | Turafungura ubusabe bwawe… | Opening your application… | needs native-speaker review |
| `resume.invalid` | Iyi link ntikora cyangwa yarashaje. Saba indi hasi. | This link is invalid or has expired. Ask for a new link below. | needs native-speaker review |
| `resume.linkTitle` | Komeza ubusabe | Continue an application | needs native-speaker review |
| `resume.linkBody` | Andika imeyili wakoresheje usaba. Niba hari ubusabe butarangiye, tukoherereza link yo kubukomeza. | Enter the email you applied with. If there is an open application, we send you a link to continue it. | needs native-speaker review |
| `resume.send` | Nyoherereza link | Send me a link | needs native-speaker review |
| `resume.linkSent` | Niba hari ubusabe butarangiye kuri iyi meyili, link iri mu nzira. Reba imeyili yawe. | If there is an open application for this address, a link is on its way. Check your email. | needs native-speaker review |
| `submitted.title` | Ubusabe bwoherejwe | Application submitted | needs native-speaker review |
| `submitted.status` | Aho bugeze: {{status}} | Status: {{status}} | needs native-speaker review |
| `submitted.sessionOver` | Ubusabe bwawe bwoherejwe. Tuzakwandikira ku bikurikiraho. | Your application was submitted. We will email you about the next steps. | needs native-speaker review |
| `submitted.next1` | Tugenzura inyandiko zawe, akenshi mu minsi mike y'akazi. | We check your documents, usually within a few working days. | needs native-speaker review |
| `submitted.next2` | Niba hari ikibura, tukoherereza link yo gukosora. | If something is missing, we email you a link to make changes. | needs native-speaker review |
| `submitted.next3` | Nibwemerwa, tuzatumira umuyobozi w'ikigo cyawe gutegura MediLink. | Once approved, we invite your facility administrator to set up MediLink. | needs native-speaker review |
| `submitted.home` | Subira ahabanza | Back to the home page | needs native-speaker review |
| `status.draft` | Bitarangiye | Draft | needs native-speaker review |
| `status.submitted` | Byoherejwe | Submitted | needs native-speaker review |
| `status.under_review` | Birimo gusuzumwa | Under review | needs native-speaker review |
| `status.changes_requested` | Hasabwe impinduka | Changes requested | needs native-speaker review |
| `status.approved` | Byemewe | Approved | needs native-speaker review |
| `status.rejected` | Ntibyemewe | Not approved | needs native-speaker review |
| `steps.facility` | Ikigo | Facility | needs native-speaker review |
| `steps.location` | Aho giherereye | Location | needs native-speaker review |
| `steps.documents` | Inyandiko | Documents | needs native-speaker review |
| `steps.admin` | Umuyobozi | Administrator | needs native-speaker review |
| `steps.review` | Genzura wohereze | Review and submit | needs native-speaker review |
| `wizard.title` | Ubusabe bwo kwiyandikisha | Facility application | needs native-speaker review |
| `wizard.stepsLabel` | Intambwe z'ubusabe | Application steps | needs native-speaker review |
| `wizard.completed` | byarangiye | completed | needs native-speaker review |
| `wizard.needsAttention` | bikeneye gukosorwa | needs attention | needs native-speaker review |
| `wizard.back` | Subira inyuma | Back | needs native-speaker review |
| `wizard.next` | Komeza | Next | needs native-speaker review |
| `wizard.continueLater` | Komeza nyuma | Continue later | needs native-speaker review |
| `wizard.changesRequested` | Itsinda ryacu ryasabye impinduka | Our team asked for changes | needs native-speaker review |
| `wizard.sessionOver` | Igihe cyawe kuri ubu busabe cyarangiye. Saba link nshya kugira ngo ukomeze. | Your session for this application has ended. Ask for a new link to continue. | needs native-speaker review |
| `save.saving` | Birabikwa… | Saving… | needs native-speaker review |
| `save.saved` | Byabitswe saa {{time}} | Saved {{time}} | needs native-speaker review |
| `save.retrying` | Ntibyabitswe, turongera tugerageza… | Not saved, retrying… | needs native-speaker review |
| `save.conflict` | Ubu busabe bwahinduwe ahandi. Twafunguye verisiyo iheruka; reba impinduka yawe iheruka. | This application changed somewhere else. We reloaded the latest version; check your last change. | needs native-speaker review |
| `fields.facilityName` | Izina ry'ikigo | Facility name | needs native-speaker review |
| `fields.facilityType` | Ubwoko bw'ikigo | Type of facility | needs native-speaker review |
| `fields.ownership` | Nyir'ikigo | Ownership | needs native-speaker review |
| `fields.organization` | Ikigo cyemewe n'amategeko | Organisation (legal name) | needs native-speaker review |
| `fields.facilityPhone` | Telefoni y'ikigo | Facility phone | needs native-speaker review |
| `fields.facilityEmail` | Imeyili y'ikigo | Facility email | needs native-speaker review |
| `fields.yourName` | Amazina yawe yose | Your full name | needs native-speaker review |
| `fields.email` | Imeyili | Email | needs native-speaker review |
| `fields.phone` | Telefoni | Phone | needs native-speaker review |
| `fields.position` | Umwanya ukoraho | Your position | needs native-speaker review |
| `fields.choose` | Hitamo… | Choose… | needs native-speaker review |
| `fields.optionalSuffix` | (si ngombwa) | (optional) | needs native-speaker review |
| `fields.yourPhone` | Telefoni yawe | Your phone | needs native-speaker review |
| `fields.mohCode` | Kode y’ikigo muri MINISANTE (FOSA ID) | MoH facility code (FOSA ID) | needs native-speaker review |
| `fields.mohCodeHint` | Niba Minisiteri y’Ubuzima yarahaye ikigo kode. | If the Ministry of Health already gave the facility a code. | needs native-speaker review |
| `fields.tin` | TIN | TIN | needs native-speaker review |
| `fields.tinHint` | Nimero y’imisoro ya RRA y’ikigo, imibare 9. | The facility's 9-digit RRA tax number. | needs native-speaker review |
| `fields.tinInvalid` | TIN igira imibare 9. | A TIN has 9 digits. | needs native-speaker review |
| `fields.mohCodeInvalid` | Koresha inyuguti, imibare na / . _ - gusa. | Use letters, digits and / . _ - only. | needs native-speaker review |
| `ownership.public` | Icya Leta | Public | needs native-speaker review |
| `ownership.private` | Icyigenga | Private | needs native-speaker review |
| `ownership.faith_based` | Icy'idini | Faith-based | needs native-speaker review |
| `ownership.ngo` | Umuryango utegamiye kuri Leta | NGO | needs native-speaker review |
| `location.province` | Intara | Province | needs native-speaker review |
| `location.district` | Akarere | District | needs native-speaker review |
| `location.sector` | Umurenge | Sector | needs native-speaker review |
| `location.cell` | Akagari | Cell | needs native-speaker review |
| `location.village` | Umudugudu | Village | needs native-speaker review |
| `location.address` | Aderesi | Street address | needs native-speaker review |
| `location.addressHint` | Urugero: KG 11 Ave 5, iruhande rw'isoko. | For example: KG 11 Ave 5, next to the market. | needs native-speaker review |
| `location.useMine` | Koresha aho ndi | Use my location | needs native-speaker review |
| `location.coords` | {{latitude}}, {{longitude}} | {{latitude}}, {{longitude}} | needs native-speaker review |
| `location.saved` | Aho uri habitswe. | Your location is saved. | needs native-speaker review |
| `location.outsideRwanda` | Aho hantu hari hanze y’u Rwanda. Shyira akamenyetso ku ikarita. | That location is outside Rwanda. Place the pin on the map instead. | needs native-speaker review |
| `location.geoDenied` | Ntitwabashije kubona aho uri. Shyira akamenyetso ku ikarita cyangwa wandike aho ikigo kiri. | We couldn't get your location. Place the pin on the map or type the coordinates. | needs native-speaker review |
| `location.geoUnavailable` | Mushakisha yawe ntishobora gutanga aho uri. Shyira akamenyetso ku ikarita cyangwa wandike aho ikigo kiri. | Your browser can't share a location. Place the pin on the map or type the coordinates. | needs native-speaker review |
| `location.pinTitle` | Akamenyetso ku ikarita | Map pin | needs native-speaker review |
| `location.pinHint` | Abarwayi bagakoresha bashaka inzira. Uri ku kigo, koresha aho uri; ahandi, kanda ku ikarita ku muryango cyangwa wandike imibare. | Patients use it for directions. At the facility, use your location; anywhere else, tap the map at the entrance or type the coordinates. | needs native-speaker review |
| `location.pinRequired` | Shyira ikigo ku ikarita mbere yo kohereza. | Place the facility on the map before you submit. | needs native-speaker review |
| `location.mapLabel` | Ikarita: kanda ushyireho ikigo | Map: tap to place the facility | needs native-speaker review |
| `location.mapAttribution` | © abagize OpenStreetMap | © OpenStreetMap contributors | needs native-speaker review |
| `location.pinLabel` | Umuryango w’ikigo (kurura ugahindure) | Facility entrance (drag to move) | needs native-speaker review |
| `location.latitude` | Latitude | Latitude | needs native-speaker review |
| `location.latitudeHint` | Urugero -1.944200 | For example -1.944200 | needs native-speaker review |
| `location.longitude` | Longitude | Longitude | needs native-speaker review |
| `location.longitudeHint` | Urugero 30.123400 | For example 30.123400 | needs native-speaker review |
| `documents.intro` | Ohereza amafoto agaragara neza cyangwa PDF. Buri dosiye igenzurwamo virusi mbere y'uko itsinda ryacu riyifungura. | Upload clear photos or PDFs. Each file is checked for viruses before our team can open it. | needs native-speaker review |
| `documents.chooseOwnership` | Hitamo nyir'ikigo ku ntambwe y'Ikigo kugira ngo ubone inyandiko zikenewe. | Choose the ownership on the Facility step to see which documents you need. | needs native-speaker review |
| `documents.kinds.moh_licence` | Uruhushya rwa MINISANTE | MoH operating licence | needs native-speaker review |
| `documents.kinds.rdb_registration` | Icyemezo cya RDB | RDB registration | needs native-speaker review |
| `documents.kinds.tin_certificate` | Icyemezo cya TIN | TIN certificate | needs native-speaker review |
| `documents.kinds.accreditation` | Icyemezo cy'ubuziranenge | Accreditation | needs native-speaker review |
| `documents.kinds.insurer_contract` | Amasezerano n'ubwishingizi | Insurer contract | needs native-speaker review |
| `documents.kinds.other` | Indi nyandiko | Other document | needs native-speaker review |
| `documents.kinds.facility_photo` | Ifoto y’ikigo | Facility photo | needs native-speaker review |
| `documents.number` | Nimero y'uruhushya | Licence number | needs native-speaker review |
| `documents.expires` | Itariki rurangiriraho | Expiry date | needs native-speaker review |
| `documents.numberRequired` | Ongeraho nimero n'itariki rurangiriraho, hanyuma wongere wohereze uruhushya. | Add the licence number and expiry date, then upload the licence again. | needs native-speaker review |
| `documents.insurers` | Ibigo by'ubwishingizi mukorana | Insurers you work with | needs native-speaker review |
| `documents.insurersHint` | Si ngombwa. Ongeraho amasezerano ya buri kigo niba uyafite. | Optional. Add a contract for each insurer if you have one. | needs native-speaker review |
| `documents.insurerContract` | Amasezerano na {{insurer}} | Contract with {{insurer}} | needs native-speaker review |
| `documents.photosTitle` | Amafoto y’ikigo | Photos of the facility | needs native-speaker review |
| `documents.photosHint` | Si ngombwa, kugeza ku mafoto {{count}} (hasigaye {{left}}): umuryango, icyapa, aho bategerereza. Nyuma yo kwemezwa agaragara ku mwirondoro w’ikigo cyawe. | Optional, up to {{count}} images ({{left}} left): the entrance, the sign, the waiting area. After approval they appear on your facility profile. | needs native-speaker review |
| `upload.drop` | Kurura dosiye hano, cyangwa | Drag a file here, or | needs native-speaker review |
| `upload.browse` | Hitamo dosiye | Choose a file | needs native-speaker review |
| `upload.camera` | Fata ifoto | Take a photo | needs native-speaker review |
| `upload.hint` | PDF, JPEG, PNG cyangwa HEIC, kugeza kuri MB 10. | PDF, JPEG, PNG or HEIC, up to 10 MB. | needs native-speaker review |
| `upload.retry` | Ongera ugerageze | Try again | needs native-speaker review |
| `upload.remove` | Kuraho | Remove | needs native-speaker review |
| `upload.tooLarge` | Iyi dosiye irenze MB 10. | This file is larger than 10 MB. | needs native-speaker review |
| `upload.wrongType` | Ohereza dosiye ya PDF, JPEG, PNG cyangwa HEIC. | Upload a PDF, JPEG, PNG or HEIC file. | needs native-speaker review |
| `upload.status.uploading` | Biroherezwa | Uploading | needs native-speaker review |
| `upload.status.pending` | Birimo kugenzurwa | Checking for viruses | needs native-speaker review |
| `upload.status.clean` | Byiteguye | Ready | needs native-speaker review |
| `upload.status.infected` | Habonetse virusi: ohereza indi dosiye | Virus found: upload another file | needs native-speaker review |
| `upload.status.rejected` | Byanzwe: ohereza indi dosiye | Refused: upload another file | needs native-speaker review |
| `upload.status.failed` | Kugenzura byanze: ongera wohereze | Check failed: upload again | needs native-speaker review |
| `upload.status.error` | Ntibyoherejwe | Not uploaded | needs native-speaker review |
| `upload.photoHint` | Amafoto ya JPEG, PNG cyangwa HEIC, kugeza kuri MB 10. | JPEG, PNG or HEIC images, up to 10 MB. | needs native-speaker review |
| `admin.intro` | Ni nde uzayobora MediLink ku kigo? Tuzamutumira ikigo nikimara kwemerwa. | Who will manage MediLink at the facility? We invite this person once the facility is approved. | needs native-speaker review |
| `admin.name` | Amazina y'umuyobozi | Administrator's full name | needs native-speaker review |
| `admin.email` | Imeyili y'umuyobozi | Administrator's email | needs native-speaker review |
| `admin.phone` | Telefoni y'umuyobozi | Administrator's phone | needs native-speaker review |
| `review.edit` | Hindura | Edit | needs native-speaker review |
| `review.agreements` | Amasezerano | Agreements | needs native-speaker review |
| `review.terms` | Nemera amabwiriza yo gukoresha MediLink ku bigo. | I accept the MediLink terms of use for facilities. | needs native-speaker review |
| `review.dpa` | Nemera amasezerano yo gutunganya amakuru mu izina ry'ikigo. | I accept the data processing agreement on behalf of the facility. | needs native-speaker review |
| `review.ncsa` | Nemeza ko ikigo cyiyandikishije muri NCSA nk'ugenzura amakuru, cyangwa kizabikora mbere yo gutangira. | I confirm the facility is registered with the National Cyber Security Authority as a data controller, or will be before going live. | needs native-speaker review |
| `review.termsRequired` | Emera amabwiriza yo gukoresha. | Accept the terms of use. | needs native-speaker review |
| `review.dpaRequired` | Emera amasezerano yo gutunganya amakuru. | Accept the data processing agreement. | needs native-speaker review |
| `review.ncsaRequired` | Emeza kwiyandikisha muri NCSA. | Confirm the NCSA registration. | needs native-speaker review |
| `review.submit` | Ohereza ubusabe | Submit the application | needs native-speaker review |
| `review.problemsTitle` | Mbere yo kohereza | Before you submit | needs native-speaker review |
| `review.stillMissing` | Biracyabura | Still missing | needs native-speaker review |
| `missing.facility.name` | izina ry'ikigo | facility name | needs native-speaker review |
| `missing.facility.facility_type` | ubwoko bw'ikigo | type of facility | needs native-speaker review |
| `missing.facility.ownership` | nyir'ikigo | ownership | needs native-speaker review |
| `missing.facility.phone` | telefoni y'ikigo | facility phone | needs native-speaker review |
| `missing.facility.email` | imeyili y'ikigo | facility email | needs native-speaker review |
| `missing.location.village_code` | umudugudu | village | needs native-speaker review |
| `missing.location.address` | aderesi | street address | needs native-speaker review |
| `missing.applicant.name` | amazina yawe | your name | needs native-speaker review |
| `missing.applicant.email` | imeyili yawe | your email | needs native-speaker review |
| `missing.applicant.phone` | telefoni yawe | your phone | needs native-speaker review |
| `missing.proposed_admin.name` | amazina y'umuyobozi | administrator's name | needs native-speaker review |
| `missing.proposed_admin.email` | imeyili y'umuyobozi | administrator's email | needs native-speaker review |
| `missing.proposed_admin.phone` | telefoni y'umuyobozi | administrator's phone | needs native-speaker review |
| `missing.documents.moh_licence` | uruhushya rwa MINISANTE rufite nimero n'itariki | MoH operating licence with number and expiry | needs native-speaker review |
| `missing.documents.rdb_registration` | icyemezo cya RDB | RDB registration | needs native-speaker review |
| `missing.documents.tin_certificate` | icyemezo cya TIN | TIN certificate | needs native-speaker review |
| `validation.required` | Iki gice kigomba kuzuzwa. | This is required. | needs native-speaker review |
| `validation.email` | Andika imeyili nka izina@urugero.com. | Enter an email address like name@example.com. | needs native-speaker review |

## patient-web feature: help (namespace help)

File: `apps/patient-web/src/features/help/locales/rw.json`

| Key | Kinyarwanda (draft) | English source | Status |
|---|---|---|---|
| `loading` | Biri gufunguka… | Loading… | needs native-speaker review |
| `loadFailed` | Ntibyashobotse kubifungura. Reba interineti wongere ugerageze. | We couldn't load this. Check your connection and try again. | needs native-speaker review |
| `retry` | Ongera ugerageze | Try again | needs native-speaker review |
| `search.label` | Shakisha ubufasha | Search help | needs native-speaker review |
| `search.placeholder` | Urugero: kongeramo umwana | For example: add a child | needs native-speaker review |
| `search.submit` | Shakisha | Search | needs native-speaker review |
| `search.results_one` | Inyandiko {{count}} | {{count}} article | needs native-speaker review |
| `search.results_other` | Inyandiko {{count}} | {{count}} articles | needs native-speaker review |
| `search.none` | Nta nyandiko ihuye n'ibyo washakishije. | No article matches your search. | needs native-speaker review |
| `search.noneBody` | Gerageza andi magambo, cyangwa uvugane n'ubufasha. | Try other words, or contact support. | needs native-speaker review |
| `categories.label` | Ingingo | Topics | needs native-speaker review |
| `categories.all` | Zose | All | needs native-speaker review |
| `categories.getting_started` | Gutangira | Getting started | needs native-speaker review |
| `categories.account_security` | Konti n'umutekano | Account and security | needs native-speaker review |
| `categories.booking_visits` | Gahunda no kujya kwivuza | Bookings and visits | needs native-speaker review |
| `categories.family_profile` | Umuryango n'umwirondoro | Family and profile | needs native-speaker review |
| `categories.notifications` | Kumenyeshwa | Notifications | needs native-speaker review |
| `categories.privacy` | Ibanga | Privacy | needs native-speaker review |
| `categories.facility_work` | Gukora ku ivuriro | Working at a facility | needs native-speaker review |
| `categories.other` | Ibindi | Other | needs native-speaker review |
| `articles` | Inyandiko z'ubufasha | Help articles | needs native-speaker review |
| `shownIn` | Byerekanywe mu {{language}}: ntibirandikwa mu rurimi rwawe. | Shown in {{language}}: not written in your language yet. | needs native-speaker review |
| `languages.rw` | Kinyarwanda | Kinyarwanda | needs native-speaker review |
| `languages.en` | Cyongereza | English | needs native-speaker review |
| `languages.fr` | Gifaransa | French | needs native-speaker review |
| `article.back` | Subira ku bufasha | Back to Help | needs native-speaker review |
| `article.notFound` | Inyandiko ntiyabonetse | Article not found | needs native-speaker review |
| `article.notFoundBody` | Ishobora kuba yarimuwe cyangwa yarakuweho. | It may have been moved or removed. | needs native-speaker review |
| `article.stillNeedHelp` | Uracyakeneye ubufasha? | Still need help? | needs native-speaker review |
| `contact.title` | Uracyakeneye ubufasha? | Still need help? | needs native-speaker review |
| `contact.body` | Baza ubufasha bwa MediLink ku bijyanye na porogaramu: konti, gahunda, kumenyeshwa cyangwa ibanga. | Ask MediLink support about the app: your account, bookings, notifications or privacy. | needs native-speaker review |
| `contact.contact` | Vugana n'ubufasha | Contact support | needs native-speaker review |
| `contact.requests` | Ibibazo byanjye | My requests | needs native-speaker review |
| `contact.open_one` | {{count}} gifunguye | {{count}} open | needs native-speaker review |
| `contact.open_other` | {{count}} bifunguye | {{count}} open | needs native-speaker review |
| `status.open` | Bitegereje MediLink | Waiting for MediLink | needs native-speaker review |
| `status.answered` | MediLink yasubije | Reply from MediLink | needs native-speaker review |
| `status.closed` | Byafunzwe | Closed | needs native-speaker review |
| `topics.account_access` | Kwinjira na konti yanjye | Logging in and my account | needs native-speaker review |
| `topics.booking_visits` | Gahunda no kujya kwivuza | Bookings and visits | needs native-speaker review |
| `topics.family_profile` | Umuryango n'umwirondoro | Family and profile | needs native-speaker review |
| `topics.notifications` | Kumenyeshwa | Notifications | needs native-speaker review |
| `topics.privacy` | Ibanga n'amakuru yanjye | Privacy and my data | needs native-speaker review |
| `topics.facility_setup` | Gutegura ivuriro | Facility setup | needs native-speaker review |
| `topics.technical` | Hari ikitakora | Something isn't working | needs native-speaker review |
| `topics.other` | Ikindi kintu | Something else | needs native-speaker review |
| `topics.health` | Ubuzima bwanjye cyangwa kuvurwa | My health or treatment | needs native-speaker review |
| `topicHints.account_access` | Ijambobanga, kode yo kwinjira, imeyili | Password, login code, email | needs native-speaker review |
| `topicHints.booking_visits` | Gufata gahunda, kuyihagarika, umurongo | Booking, cancelling, the queue | needs native-speaker review |
| `topicHints.family_profile` | Abana, abo mu muryango, amakuru yanjye | Children, family members, my details | needs native-speaker review |
| `topicHints.notifications` | Ubutumwa kuri telefoni, imeyili | Alerts on my phone, emails | needs native-speaker review |
| `topicHints.privacy` | Ababona amakuru yanjye, kuyasiba | Who sees my data, deleting it | needs native-speaker review |
| `topicHints.facility_setup` | Ibyumba, serivisi, abakozi | Rooms, services, staff | needs native-speaker review |
| `topicHints.technical` | Amakosa, urupapuro rudafunguka | Errors, a page that won't load | needs native-speaker review |
| `topicHints.other` | Ikindi kijyanye na porogaramu | Anything else about the app | needs native-speaker review |
| `topicHints.health` | Ibimenyetso, ibisubizo, imiti | Symptoms, results, medicines | needs native-speaker review |
| `requests.title` | Ibibazo byanjye | My requests | needs native-speaker review |
| `requests.empty` | Nta bibazo birahari | No requests yet | needs native-speaker review |
| `requests.emptyBody` | Iyo uvuganye n'ubufasha, ibibazo byawe bigaragara hano. | When you contact support, your requests appear here. | needs native-speaker review |
| `requests.new` | Vugana n'ubufasha | Contact support | needs native-speaker review |
| `requests.lastActivity` | Igikorwa giheruka {{time}} | Last activity {{time}} | needs native-speaker review |
| `requests.messages_one` | Ubutumwa {{count}} | {{count}} message | needs native-speaker review |
| `requests.messages_other` | Ubutumwa {{count}} | {{count}} messages | needs native-speaker review |
| `new.title` | Vugana n'ubufasha | Contact support | needs native-speaker review |
| `new.step1` | Ukeneye ubufasha kuki? | What do you need help with? | needs native-speaker review |
| `new.next` | Komeza | Next | needs native-speaker review |
| `new.back` | Subira inyuma | Back | needs native-speaker review |
| `new.health.title` | Ntidushobora gusubiza ibibazo by'ubuzima hano | We can't help with health questions here | needs native-speaker review |
| `new.health.body` | Ubufasha bwa MediLink bufasha gusa ku bijyanye na porogaramu. Ku bimenyetso, ibisubizo cyangwa imiti, vugana n'ivuriro ryawe: rizi dosiye yawe. | MediLink support only helps with the app. For symptoms, results or medicines, contact your facility: they know your record. | needs native-speaker review |
| `new.health.findCare` | Shaka aho kwivuza | Find care | needs native-speaker review |
| `new.health.emergency` | Mu gihe cy'ubutabazi, hamagara 912. | In an emergency, call 912. | needs native-speaker review |
| `new.step2` | Tubwire byinshi | Tell us more | needs native-speaker review |
| `new.subject` | Umutwe | Subject | needs native-speaker review |
| `new.subjectHint` | Amagambo make, urugero: sinshobora guhagarika gahunda yanjye | A few words, for example: I can't cancel my booking | needs native-speaker review |
| `new.body` | Byagenze bite? | What happened? | needs native-speaker review |
| `new.bodyHint` | Ntushyiremo amakuru y'ubuzima: ubufasha ntibubona dosiye yawe kandi ntibuyikeneye. | Don't include health details: support can't see your record and doesn't need it. | needs native-speaker review |
| `new.counter` | Inyuguti {{count}} kuri {{max}} | {{count}} of {{max}} characters | needs native-speaker review |
| `new.send` | Ohereza | Send | needs native-speaker review |
| `new.fixErrors` | Banza ukosore ibi mbere yo kohereza | Please fix these before sending | needs native-speaker review |
| `new.sent` | Ikibazo {{reference}} cyoherejwe. Dusubiza mu munsi umwe w'akazi. | Request {{reference}} sent. We usually answer within one working day. | needs native-speaker review |
| `thread.title` | Ikibazo {{reference}} | Request {{reference}} | needs native-speaker review |
| `thread.topic` | Ingingo: {{topic}} | Topic: {{topic}} | needs native-speaker review |
| `thread.you` | Wowe | You | needs native-speaker review |
| `thread.reply` | Igisubizo cyawe | Your reply | needs native-speaker review |
| `thread.send` | Ohereza igisubizo | Send reply | needs native-speaker review |
| `thread.close` | Funga ikibazo | Close request | needs native-speaker review |
| `thread.closeConfirm` | Ufunge iki kibazo? Ushobora gufungura ikindi niba ukeneye ubufasha. | Close this request? You can open a new one if you need help again. | needs native-speaker review |
| `thread.closeYes` | Gifunge | Close it | needs native-speaker review |
| `thread.cancel` | Reka | Cancel | needs native-speaker review |
| `thread.closedTitle` | Iki kibazo cyafunzwe | This request is closed | needs native-speaker review |
| `thread.closedBody` | Niba ugikeneye ubufasha, fungura ikindi kibazo. | If you still need help, open a new request. | needs native-speaker review |
| `thread.openNew` | Fungura ikindi kibazo | Open a new request | needs native-speaker review |
| `thread.notFound` | Ikibazo ntikibonetse | Request not found | needs native-speaker review |
| `thread.replySent` | Igisubizo cyoherejwe. | Reply sent. | needs native-speaker review |
| `thread.closedNotice` | Ikibazo cyafunzwe. | Request closed. | needs native-speaker review |

## patient-web feature: medicines (namespace medicines)

File: `apps/patient-web/src/features/medicines/locales/rw.json`

| Key | Kinyarwanda (draft) | English source | Status |
|---|---|---|---|
| `title` | Imiti yanjye | My medicines | needs native-speaker review |
| `intro` | Resept zo mu ngendo zawe n'ibyo farumasi yatanze. Erekana kode kuri farumasi iyo ari yo yose. | Prescriptions from your visits and what the pharmacy gave. Show the code at any pharmacy. | needs native-speaker review |
| `whose` | Imiti ya nde | Whose medicines | needs native-speaker review |
| `everyone` | Bose | Everyone | needs native-speaker review |
| `which` | Resept zihe | Which prescriptions | needs native-speaker review |
| `tab.active` | Iziriho | Active | needs native-speaker review |
| `tab.past` | Izashize | Past | needs native-speaker review |
| `failed` | Ntitwashoboye kuzana imiti yawe. | We couldn't load your medicines. | needs native-speaker review |
| `empty.active` | Nta resept iriho. | No active prescription. | needs native-speaker review |
| `empty.past` | Nta resept yashize. | No past prescription. | needs native-speaker review |
| `emptyBody` | Iyo muganga akwandikiye umuti, ugaragara hano. | When a doctor prescribes something, it appears here. | needs native-speaker review |
| `seeAll` | Reba byose | See all | needs native-speaker review |
| `count_one` | Umuti {{count}} | {{count}} medicine | needs native-speaker review |
| `count_other` | Imiti {{count}} | {{count}} medicines | needs native-speaker review |
| `issued` | yanditswe {{date}} | prescribed {{date}} | needs native-speaker review |
| `byDoctor` | Dr {{name}} | Dr {{name}} | needs native-speaker review |
| `back` | Imiti yanjye | My medicines | needs native-speaker review |
| `notFound` | Ntitwabonye iyi resept. | We couldn't find this prescription. | needs native-speaker review |
| `codeLabel` | Kode ya resept | Prescription code | needs native-speaker review |
| `codeHint` | Yerekane kuri farumasi. Ifite agaciro kugeza {{date}}. | Show it at the pharmacy. Valid until {{date}}. | needs native-speaker review |
| `days_one` | umunsi {{count}} | for {{count}} day | needs native-speaker review |
| `days_other` | iminsi {{count}} | for {{count}} days | needs native-speaker review |
| `facts.dose` | Ingano | Dose | needs native-speaker review |
| `facts.often` | Inshuro | How often | needs native-speaker review |
| `facts.long` | Igihe bimara | How long | needs native-speaker review |
| `facts.how` | Uko ufata umuti | How to take it | needs native-speaker review |
| `status.draft` | Iracyandikwa | Being written | needs native-speaker review |
| `status.issued` | Yanditswe | Prescribed | needs native-speaker review |
| `status.awaiting_payment` | Banza wishyure, hanyuma ufate | Pay first, then collect | needs native-speaker review |
| `status.ready_to_dispense` | Yiteguye kuri farumasi | Ready at the pharmacy | needs native-speaker review |
| `status.partly_dispensed` | Yatanzwe igice | Partly given | needs native-speaker review |
| `status.dispensed` | Yatanzwe | Given | needs native-speaker review |
| `status.not_available` | Ntiboneka hano | Not available here | needs native-speaker review |
| `status.cancelled` | Yahagaritswe | Cancelled | needs native-speaker review |
| `status.expired` | Yarengeje igihe | Expired | needs native-speaker review |
| `item.draft` | Uracyandikwa | Being written | needs native-speaker review |
| `item.issued` | Witeguye kuri farumasi | Ready at the pharmacy | needs native-speaker review |
| `item.partly` | Watanzwe igice: {{given}} kuri {{total}} | Partly given: {{given}} of {{total}} | needs native-speaker review |
| `item.dispensed` | Watanzwe | Given | needs native-speaker review |
| `item.not_available` | Ntuboneka hano: ugure hanze mbere ya {{date}} | Not available here: buy outside before {{date}} | needs native-speaker review |
| `item.cancelled` | Wahagaritswe na muganga | Cancelled by the doctor | needs native-speaker review |
| `item.expired` | Warengeje igihe | Expired | needs native-speaker review |
| `item.givenAs` | Watanzwe nka {{name}} (umuti umwe) | Given as {{name}} (same medicine) | needs native-speaker review |
| `frequency.once` | Rimwe | once | needs native-speaker review |
| `frequency.od` | Rimwe ku munsi | once a day | needs native-speaker review |
| `frequency.bd` | Kabiri ku munsi | twice a day | needs native-speaker review |
| `frequency.tds` | Gatatu ku munsi | three times a day | needs native-speaker review |
| `frequency.qds` | Kane ku munsi | four times a day | needs native-speaker review |
| `frequency.nocte` | Nijoro | at night | needs native-speaker review |
| `frequency.prn` | Igihe bikenewe | when needed | needs native-speaker review |
| `route.oral` | Kunywa | By mouth | needs native-speaker review |
| `route.topical` | Gusiga ku ruhu | On the skin | needs native-speaker review |
| `route.inhaled` | Guhumeka | Inhaled | needs native-speaker review |
| `route.rectal` | Mu kibuno | Rectal | needs native-speaker review |
| `route.vaginal` | Mu gitsina | Vaginal | needs native-speaker review |
| `route.eye` | Mu jisho | In the eye | needs native-speaker review |
| `route.ear` | Mu gutwi | In the ear | needs native-speaker review |
| `route.nasal` | Mu zuru | In the nose | needs native-speaker review |
| `route.injection` | Urushinge | Injection | needs native-speaker review |

## patient-web feature: notifications (namespace notifications)

File: `apps/patient-web/src/features/notifications/locales/rw.json`

| Key | Kinyarwanda (draft) | English source | Status |
|---|---|---|---|
| `offline` | Nta murandasi ufite. Ubutumwa bushya buzagaragara niwongera kugira murandasi. | You're offline. New notifications will show when you're back online. | needs native-speaker review |
| `loadError` | Ntibyashobotse gufungura ubutumwa bwawe | We couldn't load your notifications | needs native-speaker review |
| `loading` | Turimo gufungura ubutumwa | Loading notifications | needs native-speaker review |
| `on` | Birakora | On | needs native-speaker review |
| `off` | Ntibikora | Off | needs native-speaker review |
| `priority.critical` | Byihutirwa | Urgent | needs native-speaker review |
| `priority.important` | Ingenzi | Important | needs native-speaker review |
| `priority.routine` | Andi makuru | Other updates | needs native-speaker review |
| `languages.rw` | Ikinyarwanda | Ikinyarwanda | needs native-speaker review |
| `languages.en` | English | English | needs native-speaker review |
| `languages.fr` | Français | Français | needs native-speaker review |
| `channels.in_app` | Muri MediLink | In MediLink | needs native-speaker review |
| `channels.web_push` | Kumenyeshwa kuri iyi telefoni cyangwa mudasobwa | Alerts on this phone or computer | needs native-speaker review |
| `channels.email` | Imeyili | Email | needs native-speaker review |
| `bell.label_one` | Ubutumwa, {{count}} butarasomwa | Notifications, {{count}} unread | needs native-speaker review |
| `bell.label_other` | Ubutumwa, {{count}} butarasomwa | Notifications, {{count}} unread | needs native-speaker review |
| `bell.labelNone` | Ubutumwa, nta butarasomwa | Notifications, none unread | needs native-speaker review |
| `bell.newArrived_one` | Ubutumwa bushya. {{count}} butarasomwa. | New notification. {{count}} unread. | needs native-speaker review |
| `bell.newArrived_other` | Ubutumwa bushya. {{count}} butarasomwa. | New notification. {{count}} unread. | needs native-speaker review |
| `push.on` | Kumenyeshwa birakora kuri iyi mushakisha | Alerts are on for this browser | needs native-speaker review |
| `push.onBody` | Tuzakumenyesha igihe cyo kugenda, igihe uhamagawe n'igihe gahunda ihindutse. | We'll alert you when it's time to leave, when you're called and when a visit changes. | needs native-speaker review |
| `push.turnOff` | Hagarika kumenyeshwa hano | Turn off alerts here | needs native-speaker review |
| `push.why` | Menyeshwa igihe bikenewe | Get alerts when it matters | needs native-speaker review |
| `push.whyBody` | Tuzakubwira igihe cyo kugenda ku ivuriro n'igihe uhamagawe, nubwo MediLink ifunze. Mushakisha yawe izahita igusaba uruhushya. | We'll tell you when to leave for your visit and when you're called, even when MediLink is closed. Your browser will ask for permission next. | needs native-speaker review |
| `push.turnOn` | Fungura kumenyeshwa | Turn on alerts | needs native-speaker review |
| `push.denied` | Kumenyeshwa byahagaritswe kuri uru rubuga | Alerts are blocked for this site | needs native-speaker review |
| `push.deniedBody` | Kugira ngo ubifungure, jya mu igenamiterere rya mushakisha yawe kuri MediLink, wemere kumenyeshwa, hanyuma ugaruke kuri iyi paji. | To turn them on, open your browser's site settings for MediLink, allow notifications, then come back to this page. | needs native-speaker review |
| `push.ios` | Kuri iPhone, banza ushyire MediLink kuri ekarani y'ibanze | On iPhone, add MediLink to your Home Screen first | needs native-speaker review |
| `push.iosStep1` | Kanda buto yo Gusangiza muri Safari. | Tap the Share button in Safari. | needs native-speaker review |
| `push.iosStep2` | Hitamo “Shyira kuri ekarani y'ibanze”. | Choose “Add to Home Screen”. | needs native-speaker review |
| `push.iosStep3` | Fungura MediLink uhereye kuri ekarani y'ibanze, ufungure kumenyeshwa aho. | Open MediLink from the Home Screen and turn on alerts there. | needs native-speaker review |
| `push.unsupported` | Iyi mushakisha ntishobora kwerekana kumenyeshwa | This browser can't show alerts | needs native-speaker review |
| `push.unsupportedBody` | Uzakomeza kubona ubutumwa bwose hano no kuri imeyili. Chrome, Firefox na Edge birabishobora. | You'll still see every notification here and by email. Chrome, Firefox and Edge support alerts. | needs native-speaker review |
| `push.failed` | Ntibyashobotse gufungura cyangwa guhagarika kumenyeshwa. Ongera ugerageze. | We couldn't turn alerts on or off. Try again. | needs native-speaker review |
| `banner.title` | Fungura kumenyeshwa tukubwire igihe cyo kugenda | Turn on alerts so we can tell you when to leave | needs native-speaker review |
| `banner.body` | Telefoni yawe ikubwira igihe uhamagawe n'igihe gahunda ihindutse. | Your phone tells you when you're called and when a visit changes. | needs native-speaker review |
| `banner.notNow` | Ubu oya | Not now | needs native-speaker review |
| `inbox.title` | Ubutumwa | Notifications | needs native-speaker review |
| `inbox.unreadSummary_one` | Ubutumwa {{count}} butarasomwa. | {{count}} unread notification. | needs native-speaker review |
| `inbox.unreadSummary_other` | Ubutumwa {{count}} butarasomwa. | {{count}} unread notifications. | needs native-speaker review |
| `inbox.about` | Bireba {{name}} | About {{name}} | needs native-speaker review |
| `inbox.new` | Bushya | New | needs native-speaker review |
| `inbox.withdrawn` | Bwakuweho | Withdrawn | needs native-speaker review |
| `inbox.empty` | Nta butumwa buraza | No notifications yet | needs native-speaker review |
| `inbox.emptyBody` | Ibyibutsa bya gahunda, amakuru y'umurongo n'ubutumwa bw'amavuriro yawe bizagaragara hano. | Visit reminders, queue updates and messages from your health facilities will appear here. | needs native-speaker review |
| `inbox.markAll` | Byose byasomwe | Mark all as read | needs native-speaker review |
| `inbox.pages` | Impapuro | Pages | needs native-speaker review |
| `inbox.previous` | Ibibanza | Previous | needs native-speaker review |
| `inbox.next` | Ibikurikira | Next | needs native-speaker review |
| `inbox.page` | Urupapuro {{page}} kuri {{pages}} | Page {{page}} of {{pages}} | needs native-speaker review |
| `inbox.back` | Subira ku butumwa | Back to notifications | needs native-speaker review |
| `inbox.which` | Ubutumwa buhe | Which notifications | needs native-speaker review |
| `inbox.all` | Byose | All | needs native-speaker review |
| `inbox.unread` | Butarasomwa | Unread | needs native-speaker review |
| `inbox.caughtUp` | Wasomye byose. | You're all caught up. | needs native-speaker review |
| `inbox.today` | Uyu munsi | Today | needs native-speaker review |
| `inbox.yesterday` | Ejo hashize | Yesterday | needs native-speaker review |
| `detail.notFound` | Ubu butumwa ntibubonetse | Notification not found | needs native-speaker review |
| `detail.notFoundBody` | Bushobora kuba bwarakuweho, cyangwa ari ubw'indi konti. | It may have been removed, or it belongs to another account. | needs native-speaker review |
| `detail.open` | Fungura | Open | needs native-speaker review |
| `settings.link` | Igenamiterere | Settings | needs native-speaker review |
| `settings.title` | Igenamiterere ry'ubutumwa | Notification settings | needs native-speaker review |
| `settings.thisBrowser` | Kumenyeshwa kuri iyi mushakisha | Alerts on this browser | needs native-speaker review |
| `settings.browsers` | Mushakisha zimenyeshwa | Browsers that get alerts | needs native-speaker review |
| `settings.noBrowsers` | Nta mushakisha iramenyeshwa. | No browser gets alerts yet. | needs native-speaker review |
| `settings.since` | Kuva {{when}} | Since {{when}} | needs native-speaker review |
| `settings.remove` | Kuraho | Remove | needs native-speaker review |
| `settings.removeBrowser` | Kuraho {{name}} | Remove {{name}} | needs native-speaker review |
| `settings.conflictTitle` | Igenamiterere ryawe ryahinduriwe ahandi | Your settings changed somewhere else | needs native-speaker review |
| `settings.conflict` | Ibyo wahisemo biracyahari. Fungura verisiyo nshya, hanyuma wongere ubike. | Your choices are still here. Load the latest version, then save again. | needs native-speaker review |
| `settings.reload` | Fungura verisiyo nshya | Load the latest version | needs native-speaker review |
| `settings.saveFailed` | Ntibyashobotse kubika igenamiterere. Ongera ugerageze. | We couldn't save your settings. Try again. | needs native-speaker review |
| `settings.saved` | Igenamiterere ryabitswe. | Settings saved. | needs native-speaker review |
| `settings.languageTitle` | Ururimi | Language | needs native-speaker review |
| `settings.language` | Ururimi rw'ubutumwa | Language of notifications | needs native-speaker review |
| `settings.languageHint` | Rukoreshwa no kuri imeyili n'iyi porogaramu. | Also used for emails and this app. | needs native-speaker review |
| `settings.channelsTitle` | Uko tukumenyesha | How we tell you | needs native-speaker review |
| `settings.channelsHint` | Ubutumwa buhora bugaragara muri MediLink. Hitamo ahandi wifuza kubwakira. | Notifications always appear in MediLink. Choose where else you get them. | needs native-speaker review |
| `settings.lockedTitle` | Ubutumwa bwihutirwa buguma bukora ubu | Urgent alerts stay on for now | needs native-speaker review |
| `settings.locked` | Ufite itike ku murongo, bityo nibura uburyo bumwe bwo kukugeraho ku butumwa bwihutirwa bugomba kuguma bukora kugeza gahunda irangiye. | You have a ticket in a queue, so at least one way to reach you for urgent alerts must stay on until your visit ends. | needs native-speaker review |
| `settings.level` | Ubwoko | Type | needs native-speaker review |
| `settings.levelHint.critical` | Wahamagawe, gahunda y'uyu munsi yahagaritswe | You're called, a visit today is cancelled | needs native-speaker review |
| `settings.levelHint.important` | Igihe cyo kugenda, impinduka kuri gahunda | Time to leave, changes to a booking | needs native-speaker review |
| `settings.levelHint.routine` | Ibyibutsa n'amatangazo | Reminders and announcements | needs native-speaker review |
| `settings.cell` | {{level}}: {{channel}} | {{level}}: {{channel}} | needs native-speaker review |
| `settings.alwaysOn` | Buhora bukora | Always on | needs native-speaker review |
| `settings.quietTitle` | Amasaha y'ituze | Quiet hours | needs native-speaker review |
| `settings.quiet` | Nta kumenyeshwa cyangwa imeyili nijoro | No alerts or emails at night | needs native-speaker review |
| `settings.quietHint` | Ubutumwa bwihutirwa buracyaza. Amasaha ni aya Kigali. | Urgent alerts still come through. Times are Kigali time. | needs native-speaker review |
| `settings.quietStart` | Kuva | From | needs native-speaker review |
| `settings.quietEnd` | Kugeza | Until | needs native-speaker review |
| `settings.familyTitle` | Umuryango | Family | needs native-speaker review |
| `settings.familyAlerts` | Ubutumwa bureba {{name}} | Alerts about {{name}} | needs native-speaker review |
| `settings.relationship.guardian` | Uri umurezi we. | You are their guardian. | needs native-speaker review |
| `settings.relationship.delegate` | Yaguhaye uburenganzira. | They gave you access. | needs native-speaker review |
| `settings.save` | Bika igenamiterere | Save settings | needs native-speaker review |

## patient-web feature: profile (namespace profile)

File: `apps/patient-web/src/features/profile/locales/rw.json`

| Key | Kinyarwanda (draft) | English source | Status |
|---|---|---|---|
| `title` | Umwirondoro wanjye | My profile | needs native-speaker review |
| `notFound` | Ntitwabonye uyu mwirondoro. | We couldn't find this profile. | needs native-speaker review |
| `switch` | Hindura umwirondoro | Switch profile | needs native-speaker review |
| `breadcrumb` | Aho uri | Where you are | needs native-speaker review |
| `home` | Ahabanza | Home | needs native-speaker review |
| `backToProfile` | Subira ku mwirondoro | Back to profile | needs native-speaker review |
| `save` | Bika | Save | needs native-speaker review |
| `saved` | Byabitswe. | Saved. | needs native-speaker review |
| `cancel` | Reka | Cancel | needs native-speaker review |
| `close` | Funga | Close | needs native-speaker review |
| `error` | Habaye ikibazo. Reba internet yawe wongere ugerageze. | Something went wrong. Check your connection and try again. | needs native-speaker review |
| `relationship.self` | Wowe | You | needs native-speaker review |
| `relationship.guardian` | Umwana wawe | Your child | needs native-speaker review |
| `relationship.delegate` | Wasangijwe | Shared with you | needs native-speaker review |
| `medilinkNumber` | Nomero yawe ya MediLink | Your MediLink number | needs native-speaker review |
| `sectionsLabel` | Ibice by'umwirondoro | Profile sections | needs native-speaker review |
| `photo.title` | Ifoto | Profile photo | needs native-speaker review |
| `photo.who` | Uyibona ni wowe, abo usangira uyu mwirondoro, n'abakozi b'amavuriro ufitemo dosiye. Ibafasha kukumenya. | You, people you share this profile with, and staff at facilities where you have a file can see it. It helps them recognise you. | needs native-speaker review |
| `photo.add` | Ongeraho ifoto | Add a photo | needs native-speaker review |
| `photo.change` | Hindura ifoto | Change photo | needs native-speaker review |
| `photo.remove` | Kuraho | Remove | needs native-speaker review |
| `photo.alt` | Ifoto ya {{name}} | Photo of {{name}} | needs native-speaker review |
| `photo.tooBig` | Hitamo ifoto iri munsi ya MB 5. | Choose a photo smaller than 5 MB. | needs native-speaker review |
| `sections.details` | Amakuru yanjye | My details | needs native-speaker review |
| `sections.identifiers` | Ibyangombwa | Identity documents | needs native-speaker review |
| `sections.insurance` | Ubwishingizi | Insurance | needs native-speaker review |
| `sections.health` | Allergie n'ubuzima | Allergies and health | needs native-speaker review |
| `sections.history` | Abafunguye dosiye yanjye | Who opened my record | needs native-speaker review |
| `completion.title` | Uzuza umwirondoro wawe | Complete your profile | needs native-speaker review |
| `completion.details` | Amazina, itariki y'amavuko n'igitsina | Name, birth date and sex | needs native-speaker review |
| `completion.identifier` | Icyangombwa | An identity document | needs native-speaker review |
| `completion.emergency_contact` | Uwo guhamagara mu byihutirwa | Someone to call in an emergency | needs native-speaker review |
| `completion.care_consent` | Uruhushya rwo kuvurwa | Consent to care | needs native-speaker review |
| `completion.insurance` | Ikarita y'ubwishingizi | Insurance card | needs native-speaker review |
| `completion.allergies_reviewed` | Allergie zagenzuwe | Allergies checked | needs native-speaker review |
| `completion.done` | byakozwe | done | needs native-speaker review |
| `completion.todo` | bigikenewe | to do | needs native-speaker review |
| `completion.next` | Igikurikira: {{step}} | Next: {{step}} | needs native-speaker review |
| `completion.progress` | {{done}} kuri {{total}} byakozwe | {{done}} of {{total}} done | needs native-speaker review |
| `fields.fullName` | Amazina | Names | needs native-speaker review |
| `fields.dateOfBirth` | Itariki y'amavuko | Date of birth | needs native-speaker review |
| `fields.sex` | Igitsina | Sex | needs native-speaker review |
| `fields.phone` | Telefoni | Phone | needs native-speaker review |
| `fields.email` | Imeyili | Email | needs native-speaker review |
| `fields.address` | Aderesi | Address | needs native-speaker review |
| `fields.emergencyContact` | Uwo guhamagara mu byihutirwa | Emergency contact | needs native-speaker review |
| `fields.ecName` | Amazina ye | Their names | needs native-speaker review |
| `fields.ecPhone` | Telefoni ye | Their phone | needs native-speaker review |
| `fields.ecRelationship` | Icyo mupfana | How you know them | needs native-speaker review |
| `sex.female` | Gore | Female | needs native-speaker review |
| `sex.male` | Gabo | Male | needs native-speaker review |
| `sex.other` | Ikindi | Other | needs native-speaker review |
| `details.delegateNote` | Nyir'umwirondoro cyangwa umurera ni bo bonyine bahindura amazina, itariki y'amavuko n'igitsina. | Only the person or their guardian can change names, birth date and sex. | needs native-speaker review |
| `identifierKinds.national_id` | Indangamuntu | National ID | needs native-speaker review |
| `identifierKinds.passport` | Pasiporo | Passport | needs native-speaker review |
| `identifierKinds.refugee_id` | Ikarita y'impunzi | Refugee ID | needs native-speaker review |
| `identifierKinds.birth_certificate` | Icyemezo cy'amavuko | Birth certificate | needs native-speaker review |
| `identifiers.none` | Nta cyangombwa kirashyirwamo. | No identity document yet. | needs native-speaker review |
| `identifiers.checked` | Cyagenzuwe mu kigo nderabuzima | Checked at a facility | needs native-speaker review |
| `identifiers.add` | Ongeramo icyangombwa | Add an identity document | needs native-speaker review |
| `identifiers.kind` | Icyangombwa | Document | needs native-speaker review |
| `identifiers.number` | Nomero y'icyangombwa | Document number | needs native-speaker review |
| `identifiers.country` | Igihugu cyagitanze (inyuguti ebyiri) | Issuing country (two letters) | needs native-speaker review |
| `identifiers.claim` | Saba iyi dosiye | Claim this record | needs native-speaker review |
| `reveal.show` | Erekana | Show | needs native-speaker review |
| `reveal.hide` | Hisha | Hide | needs native-speaker review |
| `reveal.showing` | Birerekanwa… | Showing… | needs native-speaker review |
| `insurers.mutuelle` | Mituweli | Mutuelle de Santé | needs native-speaker review |
| `insurers.rssb` | RSSB (RAMA) | RSSB (RAMA) | needs native-speaker review |
| `insurers.mmi` | MMI | MMI | needs native-speaker review |
| `insurers.radiant` | Radiant | Radiant | needs native-speaker review |
| `insurance.none` | Nta karita y'ubwishingizi irashyirwamo. | No insurance card yet. | needs native-speaker review |
| `insurance.expired` | Yarangiye | Expired | needs native-speaker review |
| `insurance.status.unverified` | Ntiragenzurwa | Not checked yet | needs native-speaker review |
| `insurance.status.verified` | Yagenzuwe | Verified | needs native-speaker review |
| `insurance.status.rejected` | Yanzwe | Rejected | needs native-speaker review |
| `insurance.inactive` | Ntikoreshwa | Not in use | needs native-speaker review |
| `insurance.lastVerified` | Yakoreshejwe kuri {{facility}} ku wa {{date}}, iragenzurwa | Used at {{facility}} on {{date}}, verified | needs native-speaker review |
| `insurance.deactivate` | Reka gukoresha iyi karita | Stop using this card | needs native-speaker review |
| `insurance.add` | Ongeramo ikarita y'ubwishingizi | Add an insurance card | needs native-speaker review |
| `insurance.insurer` | Umwishingizi | Insurer | needs native-speaker review |
| `insurance.memberNumber` | Nomero y'umunyamuryango | Member number | needs native-speaker review |
| `health.askAllergies` | Hari allergie ufite? | Do you have any allergies? | needs native-speaker review |
| `health.noKnownAllergies` | Nta allergie nzi mfite | I have no known allergies | needs native-speaker review |
| `health.noKnownAllergiesSet` | Nta allergie izwi | No known allergies | needs native-speaker review |
| `health.allergies` | Allergie | Allergies | needs native-speaker review |
| `health.conditions` | Indwara zidakira | Long-term conditions | needs native-speaker review |
| `health.medications` | Imiti mfata | Medicines I take | needs native-speaker review |
| `health.none` | Nta kirashyirwamo. | Nothing added. | needs native-speaker review |
| `health.unverified` | Ntiragenzurwa | Unverified | needs native-speaker review |
| `health.remove` | Kuramo | Remove | needs native-speaker review |
| `health.add.allergies` | Ongeramo allergie | Add an allergy | needs native-speaker review |
| `health.add.conditions` | Ongeramo indwara | Add a condition | needs native-speaker review |
| `health.add.medications` | Ongeramo umuti | Add a medicine | needs native-speaker review |
| `health.addButton` | Ongeramo | Add | needs native-speaker review |
| `history.intro` | Igihe cyose umuntu afunguye cyangwa ahinduye dosiye yawe, bigaragara hano. | Every time someone opens or changes your record, it appears here. | needs native-speaker review |
| `history.none` | Nta muntu urafungura dosiye yawe. | No one has opened your record yet. | needs native-speaker review |
| `history.roles.receptionist` | Umwakirizi | Receptionist | needs native-speaker review |
| `history.roles.doctor` | Muganga | Doctor | needs native-speaker review |
| `history.roles.facility_admin` | Umuyobozi w'ikigo | Facility administrator | needs native-speaker review |
| `history.roles.pharmacist` | Umufarumasiye | Pharmacist | needs native-speaker review |
| `history.actors.staff` | Umukozi | Staff | needs native-speaker review |
| `history.actors.self` | Wowe | You | needs native-speaker review |
| `history.actors.linked_account` | Uwo musangiye | Someone you share with | needs native-speaker review |
| `history.actors.platform` | Itsinda rya MediLink | MediLink team | needs native-speaker review |
| `history.actors.system` | MediLink | MediLink | needs native-speaker review |
| `history.actions.patients.walk_in.registered` | yakwanditse | registered you | needs native-speaker review |
| `history.actions.patients.existing.added` | yakongeye mu kigo cye | added you to their facility | needs native-speaker review |
| `history.actions.patients.record.viewed` | yarebye amakuru yawe | viewed your details | needs native-speaker review |
| `history.actions.patients.record.updated` | yahinduye amakuru yawe | changed your details | needs native-speaker review |
| `history.actions.patients.identifier.added` | yongeyemo icyangombwa | added an identity document | needs native-speaker review |
| `history.actions.patients.identifier.superseded` | yasimbuje icyangombwa | replaced an identity document | needs native-speaker review |
| `history.actions.patients.identifier.verified` | yagenzuye icyangombwa cyawe | checked your identity document | needs native-speaker review |
| `history.actions.patients.identifier.revealed` | yarebye nomero yawe yose y'indangamuntu | looked at your full ID number | needs native-speaker review |
| `history.actions.patients.phone.revealed` | yarebye nimero yawe ya telefoni | looked at your phone number | needs native-speaker review |
| `history.actions.patients.delegation.created` | yakoze kode yo gusangiza | created a sharing code | needs native-speaker review |
| `history.actions.patients.delegation.accepted` | yemeye kubona umwirondoro wawe | accepted access to your profile | needs native-speaker review |
| `history.actions.patients.delegation.revoked` | yahagaritse kubona umwirondoro wawe | ended access to your profile | needs native-speaker review |
| `history.actions.patients.insurance.added` | yongeyemo ikarita y'ubwishingizi | added an insurance card | needs native-speaker review |
| `history.actions.patients.insurance.updated` | yahinduye ikarita y'ubwishingizi | changed an insurance card | needs native-speaker review |
| `history.actions.patients.insurance.verified` | yagenzuye ikarita yawe y'ubwishingizi | verified your insurance card | needs native-speaker review |
| `history.actions.patients.insurance.rejected` | yanze ikarita yawe y'ubwishingizi | rejected your insurance card | needs native-speaker review |
| `history.actions.patients.insurance.deactivated` | yahagaritse ikarita y'ubwishingizi | stopped using an insurance card | needs native-speaker review |
| `history.actions.patients.health_profile.viewed` | yarebye allergie n'ubuzima bwawe | viewed your allergies and health | needs native-speaker review |
| `history.actions.patients.health_item.added` | yongeyemo amakuru y'ubuzima | added a health item | needs native-speaker review |
| `history.actions.patients.health_item.reviewed` | yagenzuye amakuru y'ubuzima | checked a health item | needs native-speaker review |
| `history.actions.patients.consent.recorded` | yanditse uruhushya | recorded a consent | needs native-speaker review |
| `history.actions.patients.claim.completed` | yahuje dosiye na konti yawe | linked a record to your account | needs native-speaker review |
| `history.actions.patients.merge.executed` | yahuje dosiye zawe ebyiri | joined two of your records | needs native-speaker review |
| `history.actions.patients.merge.undone` | yatandukanyije dosiye ebyiri | separated two records | needs native-speaker review |
| `history.actions.other` | yakoresheje dosiye yawe | used your record | needs native-speaker review |
| `history.more` | Erekana ibya mbere | Show older entries | needs native-speaker review |
| `family.title` | Umuryango no gusangiza | Family and sharing | needs native-speaker review |
| `family.profiles` | Imyirondoro ucunga | Profiles you manage | needs native-speaker review |
| `family.access` | Ubona iki | Who can see what | needs native-speaker review |
| `family.noAccess` | Nta mwirondoro urasangiza. | You haven't shared any profile. | needs native-speaker review |
| `family.grantedRow` | {{holder}} ashobora kubona {{profile}} | {{holder}} can see {{profile}} | needs native-speaker review |
| `family.receivedRow` | Ushobora kubona {{profile}} | You can see {{profile}} | needs native-speaker review |
| `family.pendingRow` | Kode ya {{profile}}, ikora kugeza ku wa {{date}} | Code for {{profile}}, valid until {{date}} | needs native-speaker review |
| `family.revoke` | Hagarika uburenganzira | End access | needs native-speaker review |
| `family.leave` | Va | Leave | needs native-speaker review |
| `family.cancelInvite` | Hagarika kode | Cancel code | needs native-speaker review |
| `family.revokeTitle` | Guhagarika ubu burenganzira? | End this access? | needs native-speaker review |
| `family.revokeConsequences` | {{name}} ntazongera kubona uyu mwirondoro. | {{name}} will no longer see this profile. | needs native-speaker review |
| `family.add` | Ongeramo umuntu wo mu muryango | Add a family member | needs native-speaker review |
| `family.who` | Uwo wongeramo ni nde? | Who are you adding? | needs native-speaker review |
| `family.child` | Umwana wanjye (munsi y'imyaka 18) | My child (under 18) | needs native-speaker review |
| `family.adult` | Umuntu mukuru wabyemeye | An adult who agreed | needs native-speaker review |
| `family.attest` | Uyu muntu mukuru yemeye ko ncunga umwirondoro we | This adult agreed that I manage their profile | needs native-speaker review |
| `family.inviteTitle` | Sangiza umwirondoro | Share a profile | needs native-speaker review |
| `family.inviteHint` | Kora kode ikoreshwa rimwe ku muntu wo mu muryango. Ayinjiza muri konti ye ya MediLink. | Create a one-time code for a family member. They enter it in their MediLink account. | needs native-speaker review |
| `family.profileToShare` | Umwirondoro wo gusangiza | Profile to share | needs native-speaker review |
| `family.password` | Ijambo ry'ibanga ryawe | Your password | needs native-speaker review |
| `family.createCode` | Kora kode | Create a code | needs native-speaker review |
| `family.codeOnce` | Iha uwo muntu iyi kode. Ikora rimwe, mu minsi 7, kandi ntizongera kugaragara. | Give this code to the person. It works once, for 7 days, and won't be shown again. | needs native-speaker review |
| `family.code` | Kode yo gusangiza | Sharing code | needs native-speaker review |
| `family.copy` | Koporora | Copy | needs native-speaker review |
| `family.copied` | Byakoporowe | Copied | needs native-speaker review |
| `family.done` | Birarangiye | Done | needs native-speaker review |
| `family.acceptTitle` | Injiza kode wahawe | Enter a code someone gave you | needs native-speaker review |
| `family.accept` | Emera | Accept | needs native-speaker review |
| `family.accepted` | Ubu ushobora kubona umwirondoro wa {{name}}. | You can now see {{name}}'s profile. | needs native-speaker review |
| `privacy.title` | Ibanga n'uruhushya | Privacy and consent | needs native-speaker review |
| `privacy.account` | Konti yawe | Your account | needs native-speaker review |
| `privacy.research` | Koresha amakuru yanjye mu bushakashatsi ku buzima | Use my data for health research | needs native-speaker review |
| `privacy.researchHint` | Amakuru atagaragaza uwo ari we gusa, ku bushakashatsi bwemewe. Ushobora guhindura igihe cyose. | Only anonymised data, and only for approved studies. You can change this any time. | needs native-speaker review |
| `privacy.on` | Birafunguye | On | needs native-speaker review |
| `privacy.off` | Birafunze | Off | needs native-speaker review |
| `privacy.care` | Uruhushya rwo kuvurwa | Consent to care | needs native-speaker review |
| `privacy.careHint` | Ibigo nderabuzima birukenera kugira ngo bibike dosiye yawe y'ubuzima. | Facilities need this to keep your health record. | needs native-speaker review |
| `privacy.history` | Reba abafunguye dosiye yanjye | See who opened my record | needs native-speaker review |
| `privacy.later` | Gukuramo cyangwa gusiba amakuru yawe bizaboneka nyuma. | Downloading or deleting your data will be available later. | needs native-speaker review |
| `privacy.notifications` | Ubutumwa ku buvuzi bwanjye | Messages about my care | needs native-speaker review |
| `privacy.notificationsHint` | Kwibutswa n'amakuru ku gusura no ku gufata gahunda. | Reminders and updates about visits and bookings. | needs native-speaker review |
| `privacy.location` | Koresha aho ndi | Use my location | needs native-speaker review |
| `privacy.locationHint` | Shaka ibigo biri hafi yawe. | Find facilities near you. | needs native-speaker review |
| `claim.title` | Saba dosiye yanjye | Claim my record | needs native-speaker review |
| `claim.intro` | Niba ikigo nderabuzima cyarakwanditse utarafungura konti, huza iyo dosiye na konti yawe. | If a facility registered you before you had an account, link that record to your account. | needs native-speaker review |
| `claim.way` | Urashaka kuyishaka ute? | How do you want to find it? | needs native-speaker review |
| `claim.ways.medilink_number` | Nomero ya MediLink | MediLink number | needs native-speaker review |
| `claim.ways.national_id` | Indangamuntu | National ID | needs native-speaker review |
| `claim.ways.phone` | Telefoni n'amazina | Phone and names | needs native-speaker review |
| `claim.start` | Shaka dosiye yanjye | Find my record | needs native-speaker review |
| `claim.codeSent` | Twohereje kode y'imibare 6 kuri {{hint}}. | We sent a 6-digit code to {{hint}}. | needs native-speaker review |
| `claim.code` | Kode | Code | needs native-speaker review |
| `claim.confirm` | Emeza | Confirm | needs native-speaker review |
| `claim.receptionHint` | Erekana iyi nomero n'icyangombwa ku iyakira. Ikora iminsi 7. | Show this reference and an identity document at reception. It's valid for 7 days. | needs native-speaker review |
| `claim.reference` | Nomero y'ubusabe | Claim reference | needs native-speaker review |
| `claim.done` | Dosiye yawe ubu ihujwe na konti yawe. | Your record is now linked to your account. | needs native-speaker review |
| `claim.open` | Fungura umwirondoro wanjye | Open my profile | needs native-speaker review |
| `claim.waiting` | Dutegereje ko iyakira igenzura inyandiko yawe. Uru rupapuro rwivugurura ubwarwo. | Waiting for reception to check your document. This page updates by itself. | needs native-speaker review |
| `claim.ended` | Iki cyifuzo ntikigikora. Ongera utangire usabe dosiye yawe. | This claim is no longer open. Start again to claim your record. | needs native-speaker review |
| `claim.again` | Ongera utangire | Start again | needs native-speaker review |
| `numberHint` | Erekana iyi nimero ku kigo icyo ari cyo cyose kugira ngo babone dosiye yawe vuba. | Show this number at any facility so staff find your record quickly. | needs native-speaker review |
| `sectionHints.details` | Amazina, itariki y’amavuko, telefoni, uwo guhamagara mu byihutirwa | Name, birth date, phone, emergency contact | needs native-speaker review |
| `sectionHints.identifiers` | Indangamuntu, pasiporo cyangwa ikarita y’impunzi | National ID, passport or refugee ID | needs native-speaker review |
| `sectionHints.insurance` | Amakarita yawe y’ubwishingizi | Your insurance cards | needs native-speaker review |
| `sectionHints.health` | Allergie, indwara, imiti y’igihe kirekire | Allergies, conditions, long-term medicines | needs native-speaker review |
| `sectionHints.history` | Igihe cyose abakozi bafunguye dosiye yawe | Every time staff opened your record | needs native-speaker review |
| `homeFamily.title` | Umuryango | Family | needs native-speaker review |
| `homeFamily.manage` | Gucunga | Manage | needs native-speaker review |
| `homeFamily.empty` | Ongeraho umwana cyangwa uwo witaho, kugira ngo ukurikirane gahunda ze. | Add a child or someone you care for, to follow their visits too. | needs native-speaker review |
| `homeFamily.add` | Ongeraho uwo mu muryango | Add a family member | needs native-speaker review |

## patient-web feature: public (namespace public)

File: `apps/patient-web/src/features/public/locales/rw.json`

| Key | Kinyarwanda (draft) | English source | Status |
|---|---|---|---|
| `toConfirm` | Bizemezwa | To confirm | needs native-speaker review |
| `checker.eyebrow` | Isuzuma ry'ibimenyetso | Symptom checker | needs native-speaker review |
| `checker.title` | Ntuzi aho wajya? | Not sure where to go? | needs native-speaker review |
| `checker.intro` | Ibibazo bine, hanyuma ubuvuzi bukwiye hafi yawe. | Four questions, then the right care near you. | needs native-speaker review |
| `checker.loadFailed` | Ntitwashoboye kuzana ibibazo. Reba interineti wongere ugerageze. | We could not load the questions. Check your connection and try again. | needs native-speaker review |
| `checker.dangerTitle` | Mbere na mbere: hari kimwe muri ibi kiri kuba ubu? | First: is any of this happening now? | needs native-speaker review |
| `checker.dangerIntro` | Hitamo ibihari. Niba ntacyo, komeza. | Choose any that apply. If none do, go on. | needs native-speaker review |
| `checker.unconscious` | Guta ubwenge, kugagara, cyangwa kudakanguka | Fainting, a fit, or not waking up | needs native-speaker review |
| `checker.noneOfThese` | Nta na kimwe, komeza | None of these, continue | needs native-speaker review |
| `checker.whoTitle` | Ni nde urwaye? | Who is this for? | needs native-speaker review |
| `checker.age.infant` | Uruhinja (munsi y'umwaka) | A baby (under 1 year) | needs native-speaker review |
| `checker.age.child` | Umwana (imyaka 1 kugeza 12) | A child (1 to 12) | needs native-speaker review |
| `checker.age.teen` | Ingimbi cyangwa umwangavu (13 kugeza 17) | A teenager (13 to 17) | needs native-speaker review |
| `checker.age.adult` | Umuntu mukuru (18 kugeza 64) | An adult (18 to 64) | needs native-speaker review |
| `checker.age.older` | Umusaza cyangwa umukecuru (65 kuzamura) | An older person (65 or over) | needs native-speaker review |
| `checker.pregnant` | Aratwite | She is pregnant | needs native-speaker review |
| `checker.whatTitle` | Yumva ate? | What do they feel? | needs native-speaker review |
| `checker.whatHint` | Hitamo kugeza ku 8. | Choose up to 8. | needs native-speaker review |
| `checker.longTitle` | Bimaze igihe kingana iki? | For how long? | needs native-speaker review |
| `checker.duration.today` | Kuva uyu munsi | Since today | needs native-speaker review |
| `checker.duration.days` | Iminsi 2 kugeza 6 | 2 to 6 days | needs native-speaker review |
| `checker.duration.week` | Icyumweru cyangwa birenga | A week or more | needs native-speaker review |
| `checker.back` | Subira inyuma | Back | needs native-speaker review |
| `checker.next` | Komeza | Next | needs native-speaker review |
| `checker.seeAdvice` | Reba inama | See the advice | needs native-speaker review |
| `checker.failed` | Ntitwashoboye kubona inama ubu. Ongera ugerageze. | We could not get advice just now. Try again. | needs native-speaker review |
| `checker.answerEyebrow` | Inama yacu | Our suggestion | needs native-speaker review |
| `checker.urgency.today` | Bonana n'umuganga uyu munsi | See a clinician today | needs native-speaker review |
| `checker.urgency.soon` | Fata gahunda mu minsi mike | Book in the next few days | needs native-speaker review |
| `checker.urgency.self_care` | Iyiteho mu rugo ubu | Care at home for now | needs native-speaker review |
| `checker.service.general_consultation` | Isuzumwa risanzwe ku kigo nderabuzima cyangwa ivuriro. | A general consultation at a health centre or clinic. | needs native-speaker review |
| `checker.service.paediatric_consultation` | Isuzumwa ry'abana ku kigo nderabuzima cyangwa ivuriro. | A children's consultation at a health centre or clinic. | needs native-speaker review |
| `checker.service.antenatal_care` | Kwisuzumisha utwite, ku kigo gifite serivisi y'ababyeyi. | Antenatal care, at a health centre or clinic with maternity services. | needs native-speaker review |
| `checker.service.dental_care` | Muganga w'amenyo. | A dentist. | needs native-speaker review |
| `checker.service.eye_care` | Ivuriro ry'amaso. | An eye clinic. | needs native-speaker review |
| `checker.service.dermatology` | Muganga w'uruhu, cyangwa isuzumwa risanzwe mbere. | A skin doctor, or a general consultation first. | needs native-speaker review |
| `checker.reason.pregnancy_warning` | Mu gihe utwite, ibi bimenyetso bigomba kurebwa n'umubyaza cyangwa muganga uwo munsi. | In pregnancy, these signs should be checked by a midwife or doctor the same day. | needs native-speaker review |
| `checker.reason.infant_illness` | Impinja zirwara vuba; umuganga agomba kuzibona uyu munsi. | Babies get ill quickly; a clinician should see them today. | needs native-speaker review |
| `checker.reason.fever` | Umuriro ukeneye gupimwa malariya uwo munsi. | A fever needs a malaria test the same day. | needs native-speaker review |
| `checker.reason.fluid_loss` | Gucibwamo no kuruka bishobora gukamya umubiri vuba. | Diarrhoea with vomiting can dry the body out fast. | needs native-speaker review |
| `checker.reason.long_cough` | Inkorora imaze icyumweru cyangwa irenga igomba gusuzumwa, harimo n'igituntu. | A cough of a week or more should be checked, including for TB. | needs native-speaker review |
| `checker.reason.teeth` | Muganga w'amenyo yabona icyateye ububabare. | A dentist can see what is causing the pain. | needs native-speaker review |
| `checker.reason.eyes` | Ivuriro ry'amaso ryasuzuma ikibazo. | An eye clinic can check what is wrong. | needs native-speaker review |
| `checker.reason.skin` | Ibiheri ku ruhu akenshi si ibyihutirwa ariko bikwiye kurebwa. | A rash is usually not urgent but should be looked at. | needs native-speaker review |
| `checker.reason.urine` | Kubabara wihagarika akenshi ni indwara ikeneye kuvurwa. | Pain when passing urine is often an infection that needs treatment. | needs native-speaker review |
| `checker.reason.self_care` | Ruhuka, unywe amazi kandi ukurikirane. Nibikomera cyangwa bikamara icyumweru, fata gahunda. | Rest, drink water and watch how it goes. If it gets worse or lasts a week, book a visit. | needs native-speaker review |
| `checker.reason.see_clinician` | Umuganga yabireba mu minsi mike. | A clinician can look at this in the next few days. | needs native-speaker review |
| `checker.reason.safety_age` | Ku bana bato cyane n'abasaza, buri gihe tugira inama yo kujya kwa muganga. | For the very young and the elderly we always suggest a visit. | needs native-speaker review |
| `checker.reason.safety_duration` | Kubera ko bimaze icyumweru, umuganga agomba kubona uruhinja uyu munsi. | Because it has lasted a week, a clinician should see the baby today. | needs native-speaker review |
| `checker.findPlaces` | Reba aho wajya hafi yanjye | See facilities near me | needs native-speaker review |
| `checker.selfCareWhen` | Jya kwa muganga vuba niba ufite umuriro mwinshi, udashobora kunywa, cyangwa urushijeho kuremba. | Come in sooner if you get a high fever, cannot drink, or feel much worse. | needs native-speaker review |
| `checker.notSignedOff` | Aya mategeko arimo gusuzumwa n'abaganga mbere y'igerageza. | These rules are being reviewed by clinicians before the pilot. | needs native-speaker review |
| `checker.restart` | Ongera utangire | Start again | needs native-speaker review |
| `checker.disclaimer` | Iyi ni inama, si isuzuma rya muganga. Niba urembye cyane, jya ku bitaro byihutirwa bikwegereye cyangwa uhamagare 912. | This is guidance, not a diagnosis. If you feel very unwell, go to the nearest emergency department or call 912. | needs native-speaker review |
| `checker.emergencyTitle` | Shaka ubufasha ubu | Get help now | needs native-speaker review |
| `checker.emergencyBody` | Hamagara {{number}} cyangwa ujye ku bitaro byihutirwa bikwegereye. Ntutegereze gahunda. | Call {{number}} or go to the nearest emergency department. Do not wait for a booking. | needs native-speaker review |
| `checker.emergencyMore` | Icyo wakora mu gihe cy'ibyihutirwa | What to do in an emergency | needs native-speaker review |
| `checker.callNumber` | Hamagara {{number}} | Call {{number}} | needs native-speaker review |
| `about.eyebrow` | Ibyerekeye MediLink | About MediLink | needs native-speaker review |
| `about.title` | Ubuvuzi bukwiteguye | Care that knows you are coming | needs native-speaker review |
| `about.lead` | MediLink ihuza abarwayi mu Rwanda n'ibigo by'ubuvuzi byemejwe: shaka ubuvuzi bwemera ubwishingizi bwawe, fata gahunda cyangwa ujye ku murongo uri kuri telefoni, ugere aho igihe cyawe kigeze. | MediLink connects patients in Rwanda with verified health facilities: find care that takes your insurance, book or join the queue from your phone, and arrive when it is your turn. | needs native-speaker review |
| `about.points.patients.title` | Ku barwayi n'imiryango | For patients and families | needs native-speaker review |
| `about.points.patients.body` | Shaka ukurikije serivisi, ahantu n'ubwishingizi, urebe uko ikigo cyuzuye, kandi ubike gahunda zawe, imiti n'inyemezabwishyu ahantu hamwe. | Search by service, place and insurance, see how busy a facility is, and keep your visits, prescriptions and receipts in one place. | needs native-speaker review |
| `about.points.facilities.title` | Ku bigo by'ubuvuzi | For health facilities | needs native-speaker review |
| `about.points.facilities.body` | Kora ibyakira abarwayi, umurongo, isuzumwa, farumasi n'ubwishyu muri sisitemu imwe, abarwayi bakakubona. | Run reception, the queue, consultations, the pharmacy and billing in one system, and let patients find you. | needs native-speaker review |
| `about.points.verified.title` | Ibigo byemejwe gusa | Verified facilities only | needs native-speaker review |
| `about.points.verified.body` | Buri kigo kigenzurwa hakurikijwe uruhushya rwacyo mbere yo kugaragara kuri MediLink. | Every facility is checked against its licence before it appears on MediLink. | needs native-speaker review |
| `about.points.rwanda.title` | Amakuru yawe aguma mu Rwanda | Your data stays in Rwanda | needs native-speaker review |
| `about.points.rwanda.body` | Amakuru y'ubuzima arinzwe, abikwa mu Rwanda, kandi afungurwa n'abakuvura gusa. Ushobora kureba uwayafunguye. | Health information is encrypted, stored in Rwanda, and opened only by the staff caring for you. You can see who did. | needs native-speaker review |
| `about.whoTitle` | Abayobora MediLink | Who runs MediLink | needs native-speaker review |
| `about.whoBody` | MediLink Rwanda iyobowe na [To confirm]. Aderesi yacu, uko wadusanga n'ushinzwe kurinda amakuru biri hasi. | MediLink Rwanda is operated by [To confirm]. Our registered address, contact details and data protection officer are listed below. | needs native-speaker review |
| `about.contact.entity` | Uyiyobora | Operator | needs native-speaker review |
| `about.contact.address` | Aderesi | Address | needs native-speaker review |
| `about.contact.email` | Imeyili | Email | needs native-speaker review |
| `about.contact.phone` | Telefoni | Phone | needs native-speaker review |
| `about.contactValue.entity` | [To confirm] | [To confirm] | needs native-speaker review |
| `about.contactValue.address` | [To confirm] | [To confirm] | needs native-speaker review |
| `about.contactValue.email` | [To confirm] | [To confirm] | needs native-speaker review |
| `about.contactValue.phone` | [To confirm] | [To confirm] | needs native-speaker review |
| `about.forFacilities` | MediLink ku bigo by'ubuvuzi | MediLink for health facilities | needs native-speaker review |
| `about.privacy` | Uko turinda amakuru yawe | How we protect your data | needs native-speaker review |
| `emergency.eyebrow` | Ibyihutirwa | Emergency | needs native-speaker review |
| `emergency.title` | Mu gihe cy'ibyihutirwa, ntutegereze | In an emergency, do not wait | needs native-speaker review |
| `emergency.lead` | MediLink si iy'ibyihutirwa. Hamagara {{number}} cyangwa ujye ako kanya ku bitaro byihutirwa bikwegereye. | MediLink is not for emergencies. Call {{number}} or go straight to the nearest emergency department. | needs native-speaker review |
| `emergency.call` | Saba ubufasha | Call for help | needs native-speaker review |
| `emergency.signsTitle` | Ibimenyetso by'akaga | Danger signs | needs native-speaker review |
| `emergency.signs.chest` | Kubabara cyangwa kuremererwa mu gatuza | Chest pain or pressure | needs native-speaker review |
| `emergency.signs.breathing` | Guhumeka bigoranye | Trouble breathing | needs native-speaker review |
| `emergency.signs.bleeding` | Kuva amaraso menshi | Heavy bleeding | needs native-speaker review |
| `emergency.signs.unconscious` | Guta ubwenge, kugagara, cyangwa kudakanguka | Fainting, a fit, or not waking up | needs native-speaker review |
| `emergency.signs.stroke` | Gucika intege mu buryo butunguranye ku ruhande rumwe rw'umubiri cyangwa mu maso | Sudden weakness on one side of the body or face | needs native-speaker review |
| `emergency.signs.pregnancy` | Mu gihe utwite: kuva amaraso, kurwara umutwe cyane cyangwa kugagara | In pregnancy: bleeding, severe headache or fits | needs native-speaker review |
| `emergency.signs.baby` | Uruhinja rudashobora konka cyangwa kunywa, cyangwa ruruka byose | A baby that cannot drink or feed, or vomits everything | needs native-speaker review |
| `emergency.signs.injury` | Ubushye bukabije cyangwa gukomereka bikomeye | Severe burns or a serious injury | needs native-speaker review |
| `emergency.goTitle` | Ibitaro byihutirwa bikwegereye | Nearest emergency department | needs native-speaker review |
| `emergency.goBody` | Ibitaro by'akarere n'ibyo kohererezwamo bifite serivisi z'ibyihutirwa amanywa n'ijoro. Ibigo nderabuzima bishobora kugufasha no kukohereza. | District and referral hospitals have emergency departments open day and night. Health centres can stabilise and refer you. | needs native-speaker review |
| `emergency.notForTitle` | Icyo MediLink ikorera | What MediLink is for | needs native-speaker review |
| `emergency.notForBody` | Gufata gahunda, kujya ku murongo no kubika amakuru yawe. Ku byihutirwa byose, hamagara cyangwa ujyeyo ubu. | Booking visits, joining queues and keeping your records. For anything urgent, call or go now. | needs native-speaker review |
| `emergency.findNearest` | Shaka ikigo kikwegereye | Find the nearest facility | needs native-speaker review |
| `legal.eyebrow` | Amategeko | Legal | needs native-speaker review |
| `legal.draft` | Inyandiko itaranozwa: iri suzumwa n'umunyamategeko mbere yo gutangira. Ibice byanditseho "Bizemezwa" ntibirarangira. | Draft for review: this text is being checked by a lawyer before launch. Parts marked "To confirm" are not final. | needs native-speaker review |
| `legal.summaryTitle` | Muri make | In short | needs native-speaker review |
| `privacy.title` | Itangazo ry'ibanga | Privacy notice | needs native-speaker review |
| `privacy.summary` | Dukusanya gusa ibikenewe mu gutegura no kwandika ubuvuzi bwawe, tubirinda kandi tubibika mu Rwanda, tubyereka abakuvura gusa, kandi ushobora kubireba, kubikosora no kubikuramo. | We collect only what is needed to arrange and record your care, keep it encrypted and stored in Rwanda, show it only to the staff caring for you, and let you see, correct and download it. | needs native-speaker review |
| `privacy.sections.who.title` | Who is responsible | Who is responsible | needs native-speaker review |
| `privacy.sections.who.body` | The operator of MediLink ([To confirm]) and each health facility that cares for you are responsible for your data, under Law No. 058/2021 on the protection of personal data and privacy. | The operator of MediLink ([To confirm]) and each health facility that cares for you are responsible for your data, under Law No. 058/2021 on the protection of personal data and privacy. | needs native-speaker review |
| `privacy.sections.what.title` | What we collect | What we collect | needs native-speaker review |
| `privacy.sections.what.body` | Your name, contact details, date of birth, sex, identifiers such as your national ID or insurance number, your bookings and queue tickets, and the records health facilities write about your visits. | Your name, contact details, date of birth, sex, identifiers such as your national ID or insurance number, your bookings and queue tickets, and the records health facilities write about your visits. | needs native-speaker review |
| `privacy.sections.why.title` | Why we use it | Why we use it | needs native-speaker review |
| `privacy.sections.why.body` | To find and book care, run the queue, keep your health records, bill and claim insurance, send you reminders, and keep the service safe. We never sell your data or use it for advertising. | To find and book care, run the queue, keep your health records, bill and claim insurance, send you reminders, and keep the service safe. We never sell your data or use it for advertising. | needs native-speaker review |
| `privacy.sections.where.title` | Where it is kept | Where it is kept | needs native-speaker review |
| `privacy.sections.where.body` | On servers in Rwanda, encrypted in transit and at rest. Health records can be opened only by staff at a facility that is caring for you, and every opening is logged. | On servers in Rwanda, encrypted in transit and at rest. Health records can be opened only by staff at a facility that is caring for you, and every opening is logged. | needs native-speaker review |
| `privacy.sections.rights.title` | Your rights | Your rights | needs native-speaker review |
| `privacy.sections.rights.body` | You can see who opened your record, download your data, ask for corrections, and close your account. Facilities must keep medical records for the period the law requires. | You can see who opened your record, download your data, ask for corrections, and close your account. Facilities must keep medical records for the period the law requires. | needs native-speaker review |
| `privacy.sections.retention.title` | How long we keep it | How long we keep it | needs native-speaker review |
| `privacy.sections.retention.body` | Medical records are kept as long as the law requires ([To confirm]); other data is deleted or anonymised when no longer needed. | Medical records are kept as long as the law requires ([To confirm]); other data is deleted or anonymised when no longer needed. | needs native-speaker review |
| `privacy.sections.contact.title` | Contact | Contact | needs native-speaker review |
| `privacy.sections.contact.body` | Questions or complaints: our data protection officer at [To confirm]. You can also contact the National Cyber Security Authority. | Questions or complaints: our data protection officer at [To confirm]. You can also contact the National Cyber Security Authority. | needs native-speaker review |
| `terms.title` | Amabwiriza yo gukoresha | Terms of use | needs native-speaker review |
| `terms.summary` | MediLink igufasha gushaka, gufata gahunda no gukurikirana ubuvuzi. Ubuvuzi butangwa n'ikigo cy'ubuvuzi. MediLink si iy'ibyihutirwa kandi isuzuma ry'ibimenyetso ritanga inama, si isuzuma rya muganga. | MediLink helps you find, book and track care. The care itself is given by the health facility. MediLink is not for emergencies and its symptom checker gives guidance, not a diagnosis. | needs native-speaker review |
| `terms.sections.account.title` | Your account | Your account | needs native-speaker review |
| `terms.sections.account.body` | Keep your password private. You may manage profiles for your children and people you care for, and share access with others you trust. | Keep your password private. You may manage profiles for your children and people you care for, and share access with others you trust. | needs native-speaker review |
| `terms.sections.bookings.title` | Bookings and the queue | Bookings and the queue | needs native-speaker review |
| `terms.sections.bookings.body` | Arrive on time or cancel before the deadline. If you arrive late, you are checked in as a walk-in. Bookings you miss without cancelling count as no-shows, and repeated no-shows can limit new bookings for a while. | Arrive on time or cancel before the deadline. If you arrive late, you are checked in as a walk-in. Bookings you miss without cancelling count as no-shows, and repeated no-shows can limit new bookings for a while. | needs native-speaker review |
| `terms.sections.emergencies.title` | Not for emergencies | Not for emergencies | needs native-speaker review |
| `terms.sections.emergencies.body` | In an emergency call 912 or go to the nearest emergency department. | In an emergency call 912 or go to the nearest emergency department. | needs native-speaker review |
| `terms.sections.guidance.title` | Guidance, not diagnosis | Guidance, not diagnosis | needs native-speaker review |
| `terms.sections.guidance.body` | The symptom checker suggests how soon to seek care and which kind. It does not diagnose. Only a clinician can. | The symptom checker suggests how soon to seek care and which kind. It does not diagnose. Only a clinician can. | needs native-speaker review |
| `terms.sections.facilities.title` | Facilities and care | Facilities and care | needs native-speaker review |
| `terms.sections.facilities.body` | Health facilities are independent and responsible for the care they give, their prices and their records. | Health facilities are independent and responsible for the care they give, their prices and their records. | needs native-speaker review |
| `terms.sections.fairUse.title` | Fair use | Fair use | needs native-speaker review |
| `terms.sections.fairUse.body` | Do not misuse the service, impersonate others or try to access data that is not yours. | Do not misuse the service, impersonate others or try to access data that is not yours. | needs native-speaker review |
| `terms.sections.law.title` | Liability and law | Liability and law | needs native-speaker review |
| `terms.sections.law.body` | [To confirm] These terms are governed by the laws of Rwanda. | [To confirm] These terms are governed by the laws of Rwanda. | needs native-speaker review |
| `assistant.eyebrow` | Umufasha wa AI · igerageza | AI assistant · test | needs native-speaker review |
| `assistant.title` | Tubwire uko wiyumva | Tell us how you feel | needs native-speaker review |
| `assistant.intro` | Sobanura uko wiyumva mu magambo yawe. Umufasha akubaza ibibazo bike, hanyuma akakubwira icyo bishobora kuba n’aho wabona muganga. | Describe what you feel in your own words. The assistant asks a few questions, then tells you what it may be and where to see a doctor. | needs native-speaker review |
| `assistant.testTitle` | Iyi ni verisiyo y’igerageza | This is a test version | needs native-speaker review |
| `assistant.testBody` | Ntabwo ari isuzuma kandi si iy’ibyihutirwa. Mu igerageza, amagambo yawe yoherezwa kuri serivisi ya AI iri hanze y’u Rwanda: ntwandike izina ryawe, nimero ya telefoni cyangwa indangamuntu. | It is not a diagnosis and not for emergencies. For testing, your words are sent to an AI service outside Rwanda: do not type your name, phone number or ID. | needs native-speaker review |
| `assistant.kinyarwanda` | Ibisubizo mu Kinyarwanda biracyanozwa. Ushobora no kwandika mu Cyongereza cyangwa mu Gifaransa. | Answers in Kinyarwanda are still being improved. You can also write in English or French. | needs native-speaker review |
| `assistant.conversation` | Ikiganiro n’umufasha | Conversation with the assistant | needs native-speaker review |
| `assistant.greeting` | Muraho. Wumva umeze ute, kandi kuva ryari? | Hello. What are you feeling, and since when? | needs native-speaker review |
| `assistant.thinking` | Umufasha arimo kwandika | The assistant is writing | needs native-speaker review |
| `assistant.clarify` | Sinabashije kumenya ikimenyetso. Wasobanura uko wiyumva, urugero aho ubabara n’igihe byatangiriye? | I did not recognise a symptom yet. Can you describe what you feel, for example where it hurts and since when? | needs native-speaker review |
| `assistant.unavailable` | Umufasha ntaboneka ubu. | The assistant is not available right now. | needs native-speaker review |
| `assistant.failed` | Hari ikitagenze neza. Ongera ugerageze. | Something went wrong. Try again. | needs native-speaker review |
| `assistant.useChecker` | Koresha isuzuma ry’ibimenyetso aho | Use the symptom checker instead | needs native-speaker review |
| `assistant.restart` | Ongera utangire | Start again | needs native-speaker review |
| `assistant.quick` | Ibisubizo byihuse | Quick answers | needs native-speaker review |
| `assistant.answers.yes` | Yego | Yes | needs native-speaker review |
| `assistant.answers.no` | Oya | No | needs native-speaker review |
| `assistant.answers.notSure` | Simbizi neza | I am not sure | needs native-speaker review |
| `assistant.label` | Sobanura uko wiyumva | Describe how you feel | needs native-speaker review |
| `assistant.placeholder` | Urugero: mfite umuriro n’umutwe undya kuva ejo | For example: I have had a fever and a headache since yesterday | needs native-speaker review |
| `assistant.send` | Ohereza | Send | needs native-speaker review |
| `assistant.notName` | Ntushyiremo izina ryawe cyangwa indangamuntu. | Do not include your name or any ID. | needs native-speaker review |
| `assistant.urgency.today` | Jya kwa muganga uyu munsi | See a doctor today | needs native-speaker review |
| `assistant.urgency.soon` | Jya kwa muganga mu minsi mike | See a doctor in the next few days | needs native-speaker review |
| `assistant.possible` | Impamvu ishoboka: {{condition}} | Possible cause: {{condition}} | needs native-speaker review |
| `assistant.notDiagnosis` | Iri si isuzuma. Muganga ukusuzumye ni we wenyine ushobora kubimenya. | This is not a diagnosis. Only a doctor who examines you can tell what it is. | needs native-speaker review |
| `assistant.placesTitle` | Aho bagufasha | Facilities that can help | needs native-speaker review |
| `assistant.noPlaces` | Nta kigo kiri hafi gitanga iyi serivisi ubu. | No facility offers this service nearby yet. | needs native-speaker review |
| `assistant.morePlaces` | Reba ahandi hantu | See more facilities | needs native-speaker review |
| `assistant.tryIt` | Wahitamo kubisobanura mu magambo yawe? Gerageza umufasha wa AI (igerageza) | Prefer to describe it in your own words? Try the AI assistant (test) | needs native-speaker review |
| `assistant.launcher` | Fungura umufasha wa AI | Open the AI assistant | needs native-speaker review |
| `assistant.launcherShort` | Umufasha wa AI | AI assistant | needs native-speaker review |
| `assistant.panelTitle` | Umufasha w’ubuzima wa AI | AI health assistant | needs native-speaker review |
| `assistant.testBadge` | Igerageza | Test | needs native-speaker review |
| `assistant.close` | Funga umufasha | Close the assistant | needs native-speaker review |

## patient-web feature: records (namespace records)

File: `apps/patient-web/src/features/records/locales/rw.json`

| Key | Kinyarwanda (draft) | English source | Status |
|---|---|---|---|
| `title` | Amadosiye yanjye y'ubuzima | My health records | needs native-speaker review |
| `homeTitle` | Amadosiye y'ubuzima | Health records | needs native-speaker review |
| `seeAll` | Reba byose | See all | needs native-speaker review |
| `intro` | Ibyo muganga yanditse nyuma ya buri ruzinduko, mu magambo yoroshye. Amadosiye y'abo witaho nayo ari hano. | What your doctor wrote after each visit, in plain language. Records of the people you care for are here too. | needs native-speaker review |
| `whose` | Amadosiye ya nde | Whose records | needs native-speaker review |
| `everyone` | Bose | Everyone | needs native-speaker review |
| `loadFailed` | Ntitwashoboye kubona amadosiye yawe. | We couldn't load your records. | needs native-speaker review |
| `empty` | Nta dosiye irahari | No records yet | needs native-speaker review |
| `emptyBody` | Nyuma y'uruzinduko, dosiye yasinywe na muganga igaragara hano. | After a visit, the doctor's signed record appears here. | needs native-speaker review |
| `doctor` | Dr {{name}} | Dr {{name}} | needs native-speaker review |
| `provisional` | bitaremezwa | to be confirmed | needs native-speaker review |
| `back` | Amadosiye yose | All records | needs native-speaker review |
| `notFound` | Dosiye ntiyabonetse | Record not found | needs native-speaker review |
| `visitOn` | Uruzinduko rwo ku wa {{date}} | Visit on {{date}} | needs native-speaker review |
| `lateEntry` | yanditswe nyuma | written later | needs native-speaker review |
| `diagnosis` | Ibyo muganga yasanze | What the doctor found | needs native-speaker review |
| `instructions` | Icyo ugomba gukora | What to do | needs native-speaker review |
| `plan` | Gahunda y'ubuvuzi | Treatment plan | needs native-speaker review |
| `history` | Ibyo wabwiye muganga | What you told the doctor | needs native-speaker review |
| `vitals` | Ibipimo | Measurements | needs native-speaker review |
| `vitalsFields.temperature` | Ubushyuhe | Temperature | needs native-speaker review |
| `vitalsFields.bloodPressure` | Umuvuduko w'amaraso | Blood pressure | needs native-speaker review |
| `vitalsFields.pulse` | Gutera k'umutima | Pulse | needs native-speaker review |
| `vitalsFields.spo2` | Umwuka (SpO₂) | Oxygen (SpO₂) | needs native-speaker review |
| `vitalsFields.weight` | Ibiro | Weight | needs native-speaker review |
| `vitalsFields.height` | Uburebure | Height | needs native-speaker review |
| `addenda` | Byongewemo nyuma na muganga | Added later by the doctor | needs native-speaker review |
| `about` | Ibyerekeye uku kwivuza | About this visit | needs native-speaker review |
| `date` | Itariki | Date | needs native-speaker review |
| `facility` | Ikigo cy'ubuvuzi | Facility | needs native-speaker review |
| `doctorLabel` | Muganga | Doctor | needs native-speaker review |
| `signedOn` | Byasinywe | Signed | needs native-speaker review |
| `lab.title` | Ibisubizo by'ibizamini | Lab results | needs native-speaker review |
| `lab.failed` | Ntibyakunze kubona ibisubizo by'ibizamini byawe. | We couldn't load your lab results. | needs native-speaker review |
| `lab.intro` | Ibisubizo by'ibizamini byawe bigaragara hano muganga amaze kubisoma, hamwe n'ubutumwa bwe. | Your test results appear here once your doctor has read them, with their note. | needs native-speaker review |
| `lab.item` | Ikizamini | Test | needs native-speaker review |
| `lab.value` | Igisubizo | Result | needs native-speaker review |
| `lab.normal` | Ibisanzwe | Normal range | needs native-speaker review |
| `lab.note` | Muganga wawe aravuga: | Your doctor says: | needs native-speaker review |
| `lab.flags.low` | Biri munsi y'ibisanzwe | Below normal | needs native-speaker review |
| `lab.flags.high` | Biri hejuru y'ibisanzwe | Above normal | needs native-speaker review |
| `lab.flags.abnormal` | Ntibisanzwe | Not as expected | needs native-speaker review |
| `lab.choices.negative` | Nta bwandu | Negative | needs native-speaker review |
| `lab.choices.positive` | Afite ubwandu | Positive | needs native-speaker review |
| `lab.choices.invalid` | Ntibyasomwe | Could not be read | needs native-speaker review |
| `lab.choices.trace` | Bike cyane | Trace | needs native-speaker review |
| `lab.choices.none_seen` | Nta byabonetse | None seen | needs native-speaker review |
| `lab.choices.seen` | Byabonetse | Seen | needs native-speaker review |

## patient-web feature: site (namespace site)

File: `apps/patient-web/src/features/site/locales/rw.json`

| Key | Kinyarwanda (draft) | English source | Status |
|---|---|---|---|
| `breadcrumb` | Inzira y’urupapuro | Breadcrumb | needs native-speaker review |
| `loading` | Biratangira | Loading | needs native-speaker review |
| `error` | Habaye ikibazo mu kuzana amakuru. | Something went wrong while loading. | needs native-speaker review |
| `retry` | Ongera ugerageze | Try again | needs native-speaker review |
| `open` | Harafunguye | Open | needs native-speaker review |
| `closed` | Harafunze | Closed | needs native-speaker review |
| `noInsurers` | Ubwishingizi ntibwatangajwe | Insurance not listed | needs native-speaker review |
| `location` | Aho uri | Location | needs native-speaker review |
| `allRwanda` | U Rwanda rwose | All of Rwanda | needs native-speaker review |
| `searchLabel` | Shakisha ibigo, serivisi cyangwa ibimenyetso | Search facilities, services or symptoms | needs native-speaker review |
| `searchPlaceholder` | Shakisha serivisi cyangwa ibigo... | Search services or facilities... | needs native-speaker review |
| `call` | Hamagara {{number}} | Call {{number}} | needs native-speaker review |
| `devData` | Amakuru y’igerageza | Development data | needs native-speaker review |
| `toConfirm` | Bizemezwa | To confirm | needs native-speaker review |
| `lastUpdated` | Byavuguruwe {{date}} | Last updated {{date}} | needs native-speaker review |
| `draft` | Inyandiko itaremezwa n’abanyamategeko. Ibice byanditseho “Bizemezwa” si ibya nyuma. | Draft text awaiting legal review. Parts marked “To confirm” are not final. | needs native-speaker review |
| `home.label` | MediLink Rwanda | MediLink Rwanda | needs native-speaker review |
| `home.title` | Ubuvuzi, bworoshye. | Healthcare, made easier. | needs native-speaker review |
| `home.lead` | Shaka ibigo by’ubuvuzi, urebe igihe biboneka kandi utegure urugendo rwawe — byose ahantu hamwe. | Find healthcare facilities, check availability and plan your visit — all in one place. | needs native-speaker review |
| `home.how` | Uko MediLink ikora | How MediLink works | needs native-speaker review |
| `home.reassure` | Reba serivisi z’ubuvuzi utabanje gufungura konti. | Explore healthcare services without creating an account. | needs native-speaker review |
| `home.searchTitle` | Shaka ubuvuzi ukeneye | Find the care you need | needs native-speaker review |
| `home.searchLead` | Shakisha serivisi cyangwa ikigo cy’ubuvuzi kiri hafi yawe. | Search for a healthcare service or facility near you. | needs native-speaker review |
| `home.nearTitle` | Ibigo by’ubuvuzi biri hafi yawe | Healthcare facilities near you | needs native-speaker review |
| `home.nearEmpty` | Nta bigo byo kwerekana hano ubu | No facilities to show here yet | needs native-speaker review |
| `home.viewAll` | Reba ibigo byose | View all facilities | needs native-speaker review |
| `home.emergencyTitle` | Ukeneye ubutabazi bwihuse? | Need emergency care? | needs native-speaker review |
| `home.emergencyLead` | Shaka ibigo by’ubuvuzi bifite serivisi z’ubutabazi bwihuse. | Find healthcare facilities with emergency services. | needs native-speaker review |
| `home.emergencyAction` | Shaka ahatangirwa ubutabazi | Find emergency facilities | needs native-speaker review |
| `home.howTitle` | Uko MediLink ikora | How MediLink works | needs native-speaker review |
| `home.steps.find.title` | Shaka ubuvuzi | Find care | needs native-speaker review |
| `home.steps.find.body` | Shakisha ibigo na serivisi. | Search facilities and services. | needs native-speaker review |
| `home.steps.check.title` | Reba igihe biboneka | Check availability | needs native-speaker review |
| `home.steps.check.body` | Gereranya aho biri, igihe cyo gutegereza n’ubwishingizi. | Compare location, waiting time and insurance. | needs native-speaker review |
| `home.steps.join.title` | Jya ku murongo cyangwa ufate igihe | Join or book | needs native-speaker review |
| `home.steps.join.body` | Jya ku murongo w’uyu munsi cyangwa ufate igihe gihari. | Join today’s queue or reserve an available time. | needs native-speaker review |
| `home.steps.receive.title` | Ubuvuzi | Receive care | needs native-speaker review |
| `home.steps.receive.body` | Gera ku kigo, wiyandikishe kandi ukurikire isura yawe. | Arrive, check in and follow your visit. | needs native-speaker review |
| `home.accountTitle` | Urugendo rwawe rw’ubuvuzi, ahantu hamwe. | Your healthcare journey, in one place. | needs native-speaker review |
| `home.accountLead` | Fungura konti ucunge gahunda zawe, ukurikire umurongo wawe, ubone inyandiko z’isura yawe kandi umenye amakuru. | Create an account to manage appointments, follow your queue, access your visit documents and stay informed. | needs native-speaker review |
| `home.exploreFirst` | Banza urebe ubuvuzi | Explore healthcare first | needs native-speaker review |
| `home.readyTitle` | Witeguye gushaka ubuvuzi? | Ready to find healthcare? | needs native-speaker review |
| `home.away` | Kuri km {{km}} | {{km}} km away | needs native-speaker review |
| `home.distanceHint` | Kanda Hafi yanjye urebe intera ya buri kigo. | Tap Near me to see how far each one is. | needs native-speaker review |
| `home.sortedByDistance` | Ibikwegereye mbere, uhereye aho uri. | Closest first, from where you are. | needs native-speaker review |
| `home.showOnMap` | Reba ku ikarita | Show on map | needs native-speaker review |
| `home.view.list` | Amakarita | Cards | needs native-speaker review |
| `home.view.map` | Ikarita | Map | needs native-speaker review |
| `care.title` | Shaka ubuvuzi | Find healthcare | needs native-speaker review |
| `care.results` | Ibyabonetse | Results | needs native-speaker review |
| `care.emergencyFilter` | Ubutabazi (ibitaro) | Emergency (hospitals) | needs native-speaker review |
| `care.checkSymptoms` | Ahubwo, suzuma ibimenyetso | Check your symptoms instead | needs native-speaker review |
| `facilities.title` | Ibigo by’ubuvuzi | Healthcare facilities | needs native-speaker review |
| `facilities.type` | Ubwoko bw’ikigo | Facility type | needs native-speaker review |
| `facilities.service` | Serivisi | Service | needs native-speaker review |
| `facilities.anyService` | Serivisi zose | All services | needs native-speaker review |
| `facilities.loadMore` | Erekana ibindi | Load more | needs native-speaker review |
| `facilities.count_one` | Ikigo {{count}} | {{count}} facility | needs native-speaker review |
| `facilities.count_other` | Ibigo {{count}} | {{count}} facilities | needs native-speaker review |
| `facilities.none` | Nta bigo bihuye n’ibyatoranyijwe | No facilities match these filters | needs native-speaker review |
| `facilities.clear` | Kuraho ibyatoranyijwe | Clear filters | needs native-speaker review |
| `facility.notFound` | Iki kigo ntikibonetse | Facility not found | needs native-speaker review |
| `facility.notFoundReason` | Iyi link ishobora kuba ishaje, cyangwa iki kigo cyavuye kuri MediLink. | The link may be old, or the facility has left MediLink. | needs native-speaker review |
| `facility.back` | Subira ku bigo | Back to facilities | needs native-speaker review |
| `facility.verified` | Cyemejwe | Verified | needs native-speaker review |
| `facility.directions` | Inzira | Directions | needs native-speaker review |
| `facility.call` | Hamagara | Call | needs native-speaker review |
| `facility.today` | Uyu munsi | Today | needs native-speaker review |
| `facility.hoursToday` | Amasaha y’uyu munsi | Hours today | needs native-speaker review |
| `facility.closedToday` | Harafunze uyu munsi | Closed today | needs native-speaker review |
| `facility.liveWait` | Gutegereza ubu | Live wait | needs native-speaker review |
| `facility.waitUnknown` | Ntibyatangajwe | Not published | needs native-speaker review |
| `facility.queue` | Umurongo | Queue | needs native-speaker review |
| `facility.booking` | Gahunda | Appointments | needs native-speaker review |
| `facility.available` | Birashoboka | Available | needs native-speaker review |
| `facility.notAvailable` | Ntibitangwa | Not offered | needs native-speaker review |
| `facility.emergencyDept` | Ibitaro | Hospital | needs native-speaker review |
| `facility.emergencyNote` | Ibitaro byakira ubutabazi bwihuse. Hamagara {{number}} niba ubuzima buri mu kaga. | Hospitals receive emergencies. Call {{number}} if life is at risk. | needs native-speaker review |
| `facility.joinQueue` | Jya ku murongo | Join Queue | needs native-speaker review |
| `facility.bookAppointment` | Fata gahunda | Book Appointment | needs native-speaker review |
| `facility.tabs.services` | Serivisi | Services | needs native-speaker review |
| `facility.tabs.doctors` | Abaganga | Doctors | needs native-speaker review |
| `facility.about` | Ibyerekeye | About | needs native-speaker review |
| `facility.noDescription` | Ikigo ntikirashyiraho ibisobanuro. | The facility has not added a description yet. | needs native-speaker review |
| `facility.photos` | Amafoto | Photos | needs native-speaker review |
| `facility.photoAlt` | {{name}}, ifoto ya {{n}} kuri {{total}} | {{name}}, photo {{n}} of {{total}} | needs native-speaker review |
| `facility.openPhoto` | Fungura ifoto ya {{n}} kuri {{total}} | Open photo {{n}} of {{total}} | needs native-speaker review |
| `facility.previousPhoto` | Ifoto ibanza | Previous photo | needs native-speaker review |
| `facility.nextPhoto` | Ifoto ikurikira | Next photo | needs native-speaker review |
| `facility.contact` | Itumanaho | Contact | needs native-speaker review |
| `facility.address` | Aderesi | Address | needs native-speaker review |
| `facility.phone` | Telefoni | Phone | needs native-speaker review |
| `facility.email` | Imeyili | Email | needs native-speaker review |
| `facility.website` | Urubuga | Website | needs native-speaker review |
| `facility.notListed` | Ntibyatangajwe | Not listed | needs native-speaker review |
| `facility.walkIn` | Kuza utiyandikishije | Walk-in | needs native-speaker review |
| `facility.appointment` | Gahunda | Appointment | needs native-speaker review |
| `facility.remote` | Kwiyandikisha uri kure | Remote join | needs native-speaker review |
| `facility.waitingNow` | {{count}} bategereje | {{count}} waiting | needs native-speaker review |
| `facility.nextTime` | Igikurikira {{day}} {{time}} | Next {{day}} {{time}} | needs native-speaker review |
| `facility.noServices` | Nta serivisi zirashyirwaho | No services published yet | needs native-speaker review |
| `facility.noDoctors` | Nta baganga barashyirwaho | No doctors published yet | needs native-speaker review |
| `facility.doctorDays` | Ahaboneka {{days}} | Here {{days}} | needs native-speaker review |
| `facility.referral` | Abanyamuryango ba Mutuelle bakeneye urupapuro rwo kohereza kuri uru rwego. | Mutuelle members need a transfer letter at this level of care. | needs native-speaker review |
| `facility.week` | Iki cyumweru | This week | needs native-speaker review |
| `facility.closures` | Iminsi izafungwa | Upcoming closures | needs native-speaker review |
| `facility.noClosures` | Nta minsi yo gufunga yatangajwe | No closures announced | needs native-speaker review |
| `facility.bring.title` | Ibyo kuzana | What to bring | needs native-speaker review |
| `facility.bring.insurance` | Ikarita y’ubwishingizi | Your insurance card | needs native-speaker review |
| `facility.bring.id` | Indangamuntu cyangwa indi nyandiko iranga | National ID or another identity document | needs native-speaker review |
| `facility.bring.referral` | Urupapuro rwo kohereza (Mutuelle, ku bitaro) | Transfer letter (Mutuelle, at hospital level) | needs native-speaker review |
| `facility.bring.documents` | Ibisubizo cyangwa impapuro z’imiti byabanje, niba ubifite | Previous results or prescriptions, if you have them | needs native-speaker review |
| `facility.map` | Aho biri ku ikarita | Location on the map | needs native-speaker review |
| `facility.insurance` | Ubwishingizi bwemewe | Insurance accepted | needs native-speaker review |
| `facility.emergencyOpen` | Serivisi y'ubutabazi ikora ku manywa na nijoro. Hamagara {{number}} niba ubuzima buri mu kaga. | Emergency department open day and night. Call {{number}} if life is at risk. | needs native-speaker review |
| `doctors.title` | Abaganga | Doctors | needs native-speaker review |
| `doctors.searchName` | Shakisha izina ry’umuganga | Search by doctor name | needs native-speaker review |
| `doctors.specialty` | Serivisi | Service | needs native-speaker review |
| `doctors.anySpecialty` | Serivisi zose | All services | needs native-speaker review |
| `doctors.facility` | Ikigo | Facility | needs native-speaker review |
| `doctors.anyFacility` | Ibigo byose | All facilities | needs native-speaker review |
| `doctors.availability` | Igihe aboneka | Availability | needs native-speaker review |
| `doctors.anyDay` | Umunsi uwo ari wo wose | Any day | needs native-speaker review |
| `doctors.today` | Ahari uyu munsi | Here today | needs native-speaker review |
| `doctors.count_one` | Umuganga {{count}} | {{count}} doctor | needs native-speaker review |
| `doctors.count_other` | Abaganga {{count}} | {{count}} doctors | needs native-speaker review |
| `doctors.none` | Nta baganga bahuye n’ibyatoranyijwe | No doctors match these filters | needs native-speaker review |
| `doctors.viewProfile` | Reba umwirondoro | View profile | needs native-speaker review |
| `doctors.days` | Iminsi | Days | needs native-speaker review |
| `doctors.source` | Abaganga bagaragazwa bakurikije imyirondoro y’ibigo. | Doctors are listed from facility profiles. | needs native-speaker review |
| `doctors.places_one` | {{name}} n'ahandi {{count}} | {{name}} + {{count}} more | needs native-speaker review |
| `doctors.places_other` | {{name}} n'ahandi {{count}} | {{name}} + {{count}} more | needs native-speaker review |
| `doctor.notFound` | Uyu muganga ntabonetse | Doctor not found | needs native-speaker review |
| `doctor.notFoundReason` | Iyi link ishobora kuba ishaje, cyangwa uyu muganga ntagikora hano. | The link may be old, or the doctor no longer works here. | needs native-speaker review |
| `doctor.allDoctors` | Abaganga bose | All doctors | needs native-speaker review |
| `doctor.at` | Kuri {{facility}} | At {{facility}} | needs native-speaker review |
| `doctor.worksIn` | Serivisi | Services | needs native-speaker review |
| `doctor.presentDays` | Iminsi ari kuri iki kigo | Days at this facility | needs native-speaker review |
| `doctor.availability` | Igihe aboneka | Availability | needs native-speaker review |
| `doctor.free_one` | {{count}} kiboneka | {{count}} free | needs native-speaker review |
| `doctor.free_other` | {{count}} biboneka | {{count}} free | needs native-speaker review |
| `doctor.full` | Byuzuye | Full | needs native-speaker review |
| `doctor.away` | — | — | needs native-speaker review |
| `doctor.noTimes` | Nta gihe kiboneka uyu munsi | No free times this day | needs native-speaker review |
| `doctor.bookAt` | Fata gahunda: {{time}} | Book at {{time}} | needs native-speaker review |
| `doctor.book` | Fata gahunda kuri uyu muganga | Book with this doctor | needs native-speaker review |
| `doctor.pickDay` | Hitamo umunsi | Choose a day | needs native-speaker review |
| `doctor.privacy` | Hagaragazwa gusa ibihe biboneka, ntihagaragazwa abafashe gahunda. | Only free times are shown, never who has booked. | needs native-speaker review |
| `doctor.about` | Ibimwerekeye | About | needs native-speaker review |
| `doctor.languages` | Avuga | Speaks | needs native-speaker review |
| `doctor.spoken.rw` | Ikinyarwanda | Kinyarwanda | needs native-speaker review |
| `doctor.spoken.en` | Icyongereza | English | needs native-speaker review |
| `doctor.spoken.fr` | Igifaransa | French | needs native-speaker review |
| `doctor.spoken.sw` | Igiswahili | Kiswahili | needs native-speaker review |
| `services.title` | Menya serivisi z’ubuvuzi | Explore healthcare services | needs native-speaker review |
| `services.search` | Shakisha serivisi | Search services | needs native-speaker review |
| `services.none` | Nta serivisi zihuye n’ibyo washatse | No services match your search | needs native-speaker review |
| `services.categories.general` | Ubuvuzi rusange | General healthcare | needs native-speaker review |
| `services.categories.maternalChild` | Ubuzima bw’umubyeyi n’umwana | Maternal and child health | needs native-speaker review |
| `services.categories.laboratory` | Laboratwari | Laboratory services | needs native-speaker review |
| `services.categories.dental` | Ubuvuzi bw’amenyo | Dental care | needs native-speaker review |
| `services.categories.eye` | Ubuvuzi bw’amaso | Eye care | needs native-speaker review |
| `services.categories.imaging` | Amafoto y’ubuvuzi n’ibizamini | Imaging and diagnostics | needs native-speaker review |
| `services.categories.specialist` | Ubuvuzi bw’inzobere | Specialist care | needs native-speaker review |
| `services.categories.emergency` | Ubutabazi bwihuse | Emergency services | needs native-speaker review |
| `services.jump` | Jya ku cyiciro | Jump to a category | needs native-speaker review |
| `service.notFound` | Iyi serivisi ntibonetse | Service not found | needs native-speaker review |
| `service.notFoundReason` | Iyi link ishobora kuba ishaje, cyangwa izina ryarahindutse. | The link may be old, or the name has changed. | needs native-speaker review |
| `service.allServices` | Serivisi zose | All services | needs native-speaker review |
| `service.about` | Ibyerekeye iyi serivisi | About this service | needs native-speaker review |
| `service.aboutGeneric` | Serivisi itangwa n’ibigo biri kuri MediLink. Baza ikigo uko isura igenda. | A service offered by facilities on MediLink. Ask the facility what the visit involves. | needs native-speaker review |
| `service.offering` | Ibigo bitanga iyi serivisi | Facilities offering this service | needs native-speaker review |
| `service.noneOffering` | Nta kigo kirashyiraho iyi serivisi | No facility lists this service yet | needs native-speaker review |
| `service.find` | Shaka ibigo bitanga iyi serivisi | Find facilities offering this service | needs native-speaker review |
| `service.doctors` | Abaganga b’iyi serivisi | Doctors for this service | needs native-speaker review |
| `service.explain.general_consultation` | Kubonana na muganga cyangwa umuforomo ku kibazo gishya cy’ubuzima cyangwa kwisuzumisha. | A visit with a doctor or nurse for a new health problem or a check. | needs native-speaker review |
| `service.explain.paediatric_consultation` | Ubuvuzi bw’impinja n’abana kugeza ku myaka 14. | Care for babies and children up to 14 years. | needs native-speaker review |
| `service.explain.antenatal_care` | Kwisuzumisha buri gihe utwite, ku mubyeyi no ku mwana. | Regular checks during pregnancy for the mother and the baby. | needs native-speaker review |
| `service.explain.vaccination` | Inkingo z’abana n’abakuru, hakurikijwe gahunda y’igihugu. | Vaccines for children and adults, following the national schedule. | needs native-speaker review |
| `service.explain.dental_care` | Gusuzuma no kuvura amenyo n’ishinya. | Checks and treatment for teeth and gums. | needs native-speaker review |
| `service.explain.eye_care` | Gusuzuma amaso no kuvura indwara z’amaso. | Eye checks and treatment for eye problems. | needs native-speaker review |
| `service.explain.internal_medicine` | Gukurikirana indwara zidakira ku bantu bakuru, nka diyabete cyangwa umuvuduko w’amaraso. | Follow-up of long-term conditions in adults, such as diabetes or high blood pressure. | needs native-speaker review |
| `service.explain.gynaecology` | Ubuvuzi bw’ubuzima bw’imyororokere bw’abagore. | Care for women’s reproductive health. | needs native-speaker review |
| `service.explain.family_planning` | Inama n’uburyo bwo kuboneza urubyaro. | Advice and methods to plan when to have children. | needs native-speaker review |
| `service.explain.laboratory_tests` | Ibizamini by’amaraso, inkari n’ibindi bisabwa na muganga. | Blood, urine and other tests a clinician orders. | needs native-speaker review |
| `how.title` | Uko MediLink ikora | How MediLink works | needs native-speaker review |
| `how.steps.search.title` | Shakisha | Search | needs native-speaker review |
| `how.steps.search.body` | Ukurikije serivisi, ikigo cyangwa uko wumva umeze. | By service, facility or what you feel. | needs native-speaker review |
| `how.steps.join.title` | Jya ku murongo cyangwa ufate igihe | Join or book | needs native-speaker review |
| `how.steps.join.body` | Umurongo w’uyu munsi, cyangwa igihe kikunogeye. | Today's queue, or a time that suits you. | needs native-speaker review |
| `how.steps.follow.title` | Kurikira umwanya wawe | Follow your place | needs native-speaker review |
| `how.steps.follow.body` | Reba abakuri imbere n’igihe cyo kugenda. | See how many are ahead and when to leave. | needs native-speaker review |
| `how.steps.arrive.title` | Gera ku kigo igihe cyawe kigeze | Arrive when it's your turn | needs native-speaker review |
| `how.steps.arrive.body` | Abakira abantu bemeza ko wahageze. | Reception confirms you're there. | needs native-speaker review |
| `how.goodTitle` | Ni byiza kumenya | Good to know | needs native-speaker review |
| `how.good.noAccount` | Kureba ntibisaba konti. | No account needed to look. | needs native-speaker review |
| `how.good.walkIn` | Abaje batafashe gahunda baracyakirwa. | Walk-ins are still welcome. | needs native-speaker review |
| `how.good.noPhone` | Ntibisaba telefoni igezweho: uhabwa itike yanditse, nimero yawe igahamagarwa. | No smartphone needed: a printed ticket and your number called. | needs native-speaker review |
| `how.start` | Shaka ubuvuzi ubu | Find care now | needs native-speaker review |
| `emergency.title` | Ukeneye ubutabazi bwihuse? | Need emergency care? | needs native-speaker review |
| `emergency.lead` | Niba ubuzima buri mu kaga, ntutegereze gahunda. Saba ubufasha cyangwa ujye ku bitaro bikwegereye ubu. | If a life is in danger, do not wait for an appointment. Call for help or go to the nearest hospital now. | needs native-speaker review |
| `emergency.callNow` | Hamagara {{number}} ubu | Call {{number}} now | needs native-speaker review |
| `emergency.callNote` | Serivisi y’imbangukiragutabara y’igihugu (SAMU) | National ambulance service (SAMU) | needs native-speaker review |
| `emergency.nearest` | Ibitaro biri hafi yawe | Hospitals near you | needs native-speaker review |
| `emergency.nearestNote` | Ahakira indembe haza mbere. Koresha Hafi yanjye kugira ngo utondeke ukurikije intera. | Facilities that receive emergencies come first. Use Near me to sort by distance. | needs native-speaker review |
| `emergency.nearMe` | Hafi yanjye | Near me | needs native-speaker review |
| `emergency.none` | Nta bitaro byanditswe aha | No hospitals listed for this area | needs native-speaker review |
| `emergency.signsTitle` | Genda ubu niba umuntu afite | Go now if someone has | needs native-speaker review |
| `emergency.guidanceTitle` | Kubona ishami ry’ubutabazi rikwegereye | Finding the nearest emergency department | needs native-speaker review |
| `emergency.guidance.call` | Banza uhamagare {{number}} niba umuntu adashobora kugenda neza. | Call {{number}} first if the person cannot travel safely. | needs native-speaker review |
| `emergency.guidance.nearest` | Jya ku bitaro bikwegereye; ibigo nderabuzima bishobora kukohereza. | Go to the nearest hospital; health centres can refer you. | needs native-speaker review |
| `emergency.guidance.bring` | Zana indangamuntu n’ikarita y’ubwishingizi niba bishoboka, ariko ntubitegereze. | Bring the person’s ID and insurance card if you can, but do not wait for them. | needs native-speaker review |
| `emergency.loadFailed` | Ntibyashobotse kubona ibitaro biri hafi. Hamagara {{number}} cyangwa wongere ugerageze. | Couldn't load nearby hospitals. Call {{number}} or try again. | needs native-speaker review |
| `emergency.referral` | Ibitaro byoherezwamo abarwayi | Referral hospitals | needs native-speaker review |
| `emergency.department` | Ubutabazi amasaha 24 | 24-hour emergency | needs native-speaker review |
| `help.title` | Ubufasha | Help & Support | needs native-speaker review |
| `help.search` | Shakisha mu bufasha | Search help | needs native-speaker review |
| `help.none` | Nta bisubizo bihuye n’ibyo washatse | No answers match your search | needs native-speaker review |
| `help.articles` | Izindi nyandiko z’ubufasha | More help articles | needs native-speaker review |
| `help.contactTitle` | Uracyakeneye ubufasha? | Still need help? | needs native-speaker review |
| `help.contactAction` | Vugana n’ubufasha | Contact support | needs native-speaker review |
| `help.categories.finding.title` | Gushaka ubuvuzi | Finding healthcare | needs native-speaker review |
| `help.categories.finding.q1` | Nkeneye konti kugira ngo nshakishe? | Do I need an account to search? | needs native-speaker review |
| `help.categories.finding.a1` | Oya. Ushobora gushakisha ibigo, serivisi n’abaganga udafite konti. | No. You can search facilities, services and doctors without an account. | needs native-speaker review |
| `help.categories.finding.q2` | Igihe cyo gutegereza kibarwa gute? | How is the waiting time calculated? | needs native-speaker review |
| `help.categories.finding.a2` | Hashingiwe ku bategereje ubu n’igihe amasura aheruka yamaze kuri icyo kigo. Ni igereranya, rigaragara gusa iyo ikigo gitangaza amakuru y’ako kanya. | From the people waiting now and how long recent visits took at that facility. It is an estimate, shown only when the facility publishes live data. | needs native-speaker review |
| `help.categories.queue.title` | Kujya ku murongo | Joining a queue | needs native-speaker review |
| `help.categories.queue.q1` | Nshobora kujya ku murongo ndi mu rugo? | Can I join a queue from home? | needs native-speaker review |
| `help.categories.queue.a1` | Yego, ku bigo bibyemera, mbere y’isaha ntarengwa y’umunsi. Genda igihe porogaramu ikubwiye. | Yes, at facilities that allow it, before the daily cut-off time. Go when the app tells you to leave. | needs native-speaker review |
| `help.categories.queue.q2` | Bigenda bite iyo natinze? | What happens if I am late? | needs native-speaker review |
| `help.categories.queue.a2` | Umwanya wawe ushobora gusubira inyuma gato. Bwira abakira abantu iyo uhageze. | Your place can move back a few places. Tell reception when you arrive. | needs native-speaker review |
| `help.categories.booking.title` | Gufata gahunda | Booking appointments | needs native-speaker review |
| `help.categories.booking.q1` | Mfata igihe nte? | How do I book a time? | needs native-speaker review |
| `help.categories.booking.a1` | Fungura ikigo, hitamo serivisi n’igihe kiboneka, hanyuma wemeze. Ugomba kwinjira kugira ngo ufate gahunda. | Open a facility, choose a service and a free time, then confirm. You need to sign in to book. | needs native-speaker review |
| `help.categories.booking.q2` | Nshobora guhagarika gahunda? | Can I cancel? | needs native-speaker review |
| `help.categories.booking.a2` | Yego, mu masura yawe, kugeza ku gihe ntarengwa cy’ikigo. | Yes, from your visits, until the facility’s cancellation deadline. | needs native-speaker review |
| `help.categories.arrival.title` | Kugera no kwiyandikisha | Arrival and check-in | needs native-speaker review |
| `help.categories.arrival.q1` | Nkora iki iyo mpageze? | What do I do when I arrive? | needs native-speaker review |
| `help.categories.arrival.a1` | Jya ku bakira abantu ufite nimero y’itike cyangwa kode ya gahunda. Bemeza ko wahageze. | Go to reception with your ticket number or booking code. Reception confirms your arrival. | needs native-speaker review |
| `help.categories.arrival.q2` | Nta telefoni igezweho mfite. Nshobora kwakirwa? | I have no smartphone. Can I still be served? | needs native-speaker review |
| `help.categories.arrival.a2` | Yego. Abakira abantu barakwandika bakaguha itike yanditse; ikiganza cy’amashusho igaragaza nimero yawe ikanayivuga. | Yes. Reception registers you and gives you a printed ticket; the screen shows and calls your number. | needs native-speaker review |
| `help.categories.insurance.title` | Ubwishingizi | Insurance | needs native-speaker review |
| `help.categories.insurance.q1` | Ni ubuhe bwishingizi bwemewe? | Which insurers are accepted? | needs native-speaker review |
| `help.categories.insurance.a1` | Buri rupapuro rw’ikigo rugaragaza ubwishingizi cyemera kuri buri serivisi. | Each facility page lists the insurers it accepts for each service. | needs native-speaker review |
| `help.categories.insurance.q2` | Kuki nta biciro bigaragara? | Why are there no prices? | needs native-speaker review |
| `help.categories.insurance.a2` | Igiciro giterwa n’indwara, ibizamini n’imiti. Amafaranga agaragara kuri fagitire nyuma y’isura. | The cost depends on the illness, tests and medicines. Amounts appear on your bill after the visit. | needs native-speaker review |
| `help.categories.accounts.title` | Konti z’abarwayi | Patient accounts | needs native-speaker review |
| `help.categories.accounts.q1` | Nshobora kongeramo abana banjye? | Can I add my children? | needs native-speaker review |
| `help.categories.accounts.a1` | Yego. Ongeramo abagize umuryango mu mwirondoro wawe kandi ubafatire gahunda. | Yes. Add family members in your profile and book for them. | needs native-speaker review |
| `help.categories.accounts.q2` | Nahindura ijambo ry’ibanga nte? | How do I change my password? | needs native-speaker review |
| `help.categories.accounts.a2` | Kanda “Wibagiwe ijambo ry’ibanga” ku rupapuro rwo kwinjira uhabwe umurongo kuri imeli. | Use “Forgot password” on the sign-in page to get a reset link by email. | needs native-speaker review |
| `help.categories.documents.title` | Inyandiko n’amakuru | Documents and records | needs native-speaker review |
| `help.categories.documents.q1` | Impapuro z’imiti zanjye ziri he? | Where are my prescriptions? | needs native-speaker review |
| `help.categories.documents.a1` | Mu Nyandiko nyuma yo kwinjira. Buri imwe ifite kode na QR farumasi zishobora kugenzura. | In Documents after you sign in. Each one has a code and QR that pharmacies can verify. | needs native-speaker review |
| `help.categories.documents.q2` | Umuntu ashobora kugenzura ko inyandiko yanjye ari ukuri? | Can someone check my document is real? | needs native-speaker review |
| `help.categories.documents.a2` | Yego, akoresheje kode iri ku nyandiko kuri “Genzura inyandiko”. | Yes, with the code on the document at “Verify a document”. | needs native-speaker review |
| `help.categories.technical.title` | Ubufasha bwa tekiniki | Technical support | needs native-speaker review |
| `help.categories.technical.q1` | Urubuga ruratinda kuri telefoni yanjye. | The site is slow on my phone. | needs native-speaker review |
| `help.categories.technical.a1` | Fungura kuzigama interineti mu igenamiterere; impapuro zikora no ku murongo udakomeye nyuma yo gusura bwa mbere. | Turn on data saver in settings; pages also work after a first visit with a weak connection. | needs native-speaker review |
| `help.categories.technical.q2` | Sinakira imenyesha. | I do not receive alerts. | needs native-speaker review |
| `help.categories.technical.a2` | Emerera MediLink kohereza imenyesha muri mushakisha yawe kandi ufungure imenyesha mu igenamiterere. | Allow notifications for MediLink in your browser and turn alerts on in your settings. | needs native-speaker review |
| `help.top` | Ibibazo bibazwa cyane | Most asked | needs native-speaker review |
| `help.more` | Ibindi bibazo | More questions | needs native-speaker review |
| `help.results_one` | Igisubizo {{count}} | {{count}} answer | needs native-speaker review |
| `help.results_other` | Ibisubizo {{count}} | {{count}} answers | needs native-speaker review |
| `about.title` | Ibyerekeye MediLink | About MediLink | needs native-speaker review |
| `about.body` | MediLink ihuriza hamwe ibigo by’ubuvuzi byo mu Rwanda: aho biri, serivisi bitanga, ubwishingizi byemera n’igihe cyo gutegereza ubu. Abarwayi bajya ku murongo cyangwa bagafata igihe; ibigo bigategura umunsi wabyo muri sisitemu imwe. | MediLink puts Rwanda's health facilities in one place: where they are, what they offer, which insurance they take and how long the wait is now. Patients join a queue or book a time; facilities run their day from the same system. | needs native-speaker review |
| `about.facts.facilities` | Ibigo biri kuri MediLink | Facilities on MediLink | needs native-speaker review |
| `about.facts.languages.label` | Indimi | Languages | needs native-speaker review |
| `about.facts.languages.value` | Kinyarwanda, English, Français | Kinyarwanda, English, Français | needs native-speaker review |
| `about.facts.data.label` | Amakuru yawe | Your data | needs native-speaker review |
| `about.facts.data.value` | Abikwa mu Rwanda, hakurikijwe itegeko 058/2021 | Stored in Rwanda, under Law 058/2021 | needs native-speaker review |
| `about.facts.account.label` | Konti | Account | needs native-speaker review |
| `about.facts.account.value` | Ikenewe gusa kujya ku murongo cyangwa gufata igihe | Only to join a queue or book | needs native-speaker review |
| `contact.title` | Twandikire | Contact | needs native-speaker review |
| `contact.infoTitle` | Ubufasha | Support | needs native-speaker review |
| `contact.infoBody` | Ku kibazo cy’isura, banza uvugane n’ikigo. Ku bijyanye na MediLink ubwayo, koresha iyi fomu. | For a problem with a visit, contact the facility first. For MediLink itself, use this form. | needs native-speaker review |
| `contact.emergency` | Ku butabazi bwihuse hamagara {{number}}. Iyi fomu ntikurikiranwa amasaha yose. | For emergencies call {{number}}. This form is not watched around the clock. | needs native-speaker review |
| `contact.name` | Amazina | Name | needs native-speaker review |
| `contact.reach` | Imeli cyangwa telefoni | Email or phone | needs native-speaker review |
| `contact.reachHint` | Kugira ngo tugusubize. | So we can answer you. | needs native-speaker review |
| `contact.subject` | Impamvu | Subject | needs native-speaker review |
| `contact.message` | Ubutumwa | Message | needs native-speaker review |
| `contact.send` | Ohereza ubutumwa | Send message | needs native-speaker review |
| `contact.sending` | Biroherezwa | Sending | needs native-speaker review |
| `contact.sent` | Ubutumwa bwoherejwe. Tuzagusubiza vuba. | Message sent. We will answer soon. | needs native-speaker review |
| `contact.failed` | Ubutumwa ntibwashoboye koherezwa. Ongera ugerageze nyuma. | Your message could not be sent. Try again later. | needs native-speaker review |
| `contact.errors.name` | Andika amazina yawe | Enter your name | needs native-speaker review |
| `contact.errors.reach` | Andika imeli cyangwa nimero ya telefoni | Enter an email address or a phone number | needs native-speaker review |
| `contact.errors.subject` | Andika impamvu | Enter a subject | needs native-speaker review |
| `contact.errors.message` | Andika ubutumwa bwawe (nibura inyuguti 10) | Write your message (at least 10 characters) | needs native-speaker review |
| `contact.reference` | Nimero yawe: {{reference}}. Yibike niwongera kwandika. | Your reference: {{reference}}. Keep it if you write again. | needs native-speaker review |
| `accessibility.title` | Itangazo ku kugerwaho n’abantu bose | Accessibility statement | needs native-speaker review |
| `accessibility.sections.standard.title` | Igipimo dukurikiza | Our standard | needs native-speaker review |
| `accessibility.sections.standard.body` | WCAG 2.2 urwego AA ku mpapuro rusange no muri porogaramu y’abarwayi. | WCAG 2.2 AA on public pages and the patient app. | needs native-speaker review |
| `accessibility.sections.features.title` | Ibyo dukora | What we do | needs native-speaker review |
| `accessibility.sections.features.body` | Indimi eshatu, utubuto tunini, ingano y’inyuguti, clavier, ibisobanuro ku basoma n’amatwi, amabara agaragara neza, kugabanya imyitwarire. | Three languages, large touch targets, text size, keyboard use, screen-reader labels, strong contrast, reduced motion. | needs native-speaker review |
| `accessibility.sections.offline.title` | Hanze y’urubuga | Beyond the website | needs native-speaker review |
| `accessibility.sections.offline.body` | Nta telefoni: itike yanditse, ikiganza cy’amashusho aho bategerereza, ihamagarwa mu ijwi. | No phone: printed tickets, a waiting-room screen, spoken calls. | needs native-speaker review |
| `accessibility.sections.limits.title` | Imbogamizi zizwi | Known limits | needs native-speaker review |
| `accessibility.sections.limits.body` | Ibisobanuro bimwe biracyasuzumwa. Ikarita isaba gukoraho cyangwa imbeba; urutonde rutanga amakuru amwe. | Some translations are still under review. The map needs touch or a pointer; the list shows the same. | needs native-speaker review |
| `accessibility.sections.feedback.title` | Tubwire | Tell us | needs native-speaker review |
| `accessibility.sections.feedback.body` | Hari ikikugoye? Twandikire ku rupapuro rwo kutwandikira. | Hard to use? Tell us on the contact page. | needs native-speaker review |
| `onThisPage` | Kuri iyi paji | On this page | needs native-speaker review |
| `card.nextTime` | Igihe gikurikira: {{day}} {{time}} | Next time {{day}} {{time}} | needs native-speaker review |
| `card.open` | Irakora | Open | needs native-speaker review |
| `card.busy` | Hari benshi | Busy | needs native-speaker review |
| `card.closed` | Ifunze ubu | Closed now | needs native-speaker review |
| `card.accepted` | Yakira | Accepts | needs native-speaker review |
| `card.noInsurance` | Ubwishingizi: baza ku kwakira | Insurance: ask at the desk | needs native-speaker review |
| `card.details` | Ibisobanuro | Details | needs native-speaker review |
| `home2.title` | Bona ubuvuzi bukwiye, udategereje igihe kirekire. | Find the right care, without the long wait. | needs native-speaker review |
| `home2.lead` | Reba ibikora n'igihe cyo gutegereza. Injira cyangwa ufate isaha. | See who's open and the wait. Join or book. | needs native-speaker review |
| `home2.searchPlaceholder` | Serivisi, ikigo cyangwa ikimenyetso | Service, facility or symptom | needs native-speaker review |
| `home2.search` | Shakisha | Search | needs native-speaker review |
| `home2.chips.general` | Kwisuzumisha rusange | General consultation | needs native-speaker review |
| `home2.chips.maternal` | Ubuvuzi bw'ababyeyi | Maternal care | needs native-speaker review |
| `home2.chips.lab` | Ibizamini | Lab tests | needs native-speaker review |
| `home2.chips.dental` | Amenyo | Dental | needs native-speaker review |
| `home2.chips.symptoms` | Ntubizi neza? Reba ibimenyetso | Not sure? Check symptoms | needs native-speaker review |
| `home2.careTitle` | Ukeneye ubuhe buvuzi? | What care do you need? | needs native-speaker review |
| `home2.allServices` | Serivisi zose | All services | needs native-speaker review |
| `home2.facilityCount_one` | Ikigo {{count}} | {{count}} facility | needs native-speaker review |
| `home2.facilityCount_other` | Ibigo {{count}} | {{count}} facilities | needs native-speaker review |
| `home2.nearTitle` | Ibikora biri hafi yawe | Open near you | needs native-speaker review |
| `home2.stepLabel` | Intambwe ya {{n}} | Step {{n}} | needs native-speaker review |
| `home2.facilitiesTitle` | Icyumba cyo gutegereza gituje. | Run a calmer waiting room. | needs native-speaker review |
| `home2.facilitiesLead` | Abarwayi babona igihe cyo gutegereza mbere yo kuza. | Patients see your wait before they come. | needs native-speaker review |
| `home2.facilitiesAction` | MediLink ku bigo by'ubuvuzi | MediLink for facilities | needs native-speaker review |
| `home3.titleA` | Bona ubuvuzi bukwiye, | Find the right care, | needs native-speaker review |
| `home3.titleB` | udategereje igihe kirekire. | without the long wait. | needs native-speaker review |
| `home3.openNow_one` | Ikigo {{count}} gifunguye ubu | {{count}} facility open now | needs native-speaker review |
| `home3.openNow_other` | Ibigo {{count}} bifunguye ubu | {{count}} facilities open now | needs native-speaker review |
| `home3.waitingNow_one` | Umuntu {{count}} ategereje | {{count}} person waiting | needs native-speaker review |
| `home3.waitingNow_other` | Abantu {{count}} bategereje | {{count}} people waiting | needs native-speaker review |
| `home3.live` | Ako kanya | Live | needs native-speaker review |
| `home3.seePlaces` | Reba aho bitangirwa | See the facilities | needs native-speaker review |
| `home3.openTitle` | Ibigo bikwegereye | Facilities near you | needs native-speaker review |
| `home3.allClosed` | Ibigo byose bifunze ubu | All facilities are closed now | needs native-speaker review |
| `home3.nextOpeningToday` | ikizafungura mbere: {{name}}, {{time}} | next opening {{time}} at {{name}} | needs native-speaker review |
| `home3.nextOpening` | ikizafungura mbere: {{name}}, {{day}} {{time}} | next opening {{day}} {{time}} at {{name}} | needs native-speaker review |
| `home3.openLead` | Ibigo biri kuri MediLink n'igihe cyo gutegereza ako kanya. Kanda "Hafi yanjye" ubitondeke ukurikije intera. | Places on MediLink with their live wait. Tap Near me to sort by distance. | needs native-speaker review |
| `home3.kpi.open` | Bifunguye ubu | Open now | needs native-speaker review |
| `home3.kpi.openHint_one` | mu kigo {{count}} kiri kuri MediLink | of {{count}} facility on MediLink | needs native-speaker review |
| `home3.kpi.openHint_other` | mu bigo {{count}} biri kuri MediLink | of {{count}} facilities on MediLink | needs native-speaker review |
| `home3.kpi.waiting` | Abategereje | People waiting | needs native-speaker review |
| `home3.kpi.typical` | Igihe gisanzwe cyo gutegereza | Typical wait | needs native-speaker review |
| `home3.kpi.minutes_one` | Umunota {{count}} | {{count}} min | needs native-speaker review |
| `home3.kpi.minutes_other` | Iminota {{count}} | {{count}} min | needs native-speaker review |
| `home3.symptoms.title` | Ntuzi aho wajya? | Not sure where to go? | needs native-speaker review |
| `home3.symptoms.action` | Suzuma ibimenyetso byawe | Check your symptoms | needs native-speaker review |
| `home3.howLine` | Ni ubwa mbere uje? | New here? | needs native-speaker review |
| `filters.button` | Iyungurura | Filters | needs native-speaker review |
| `filters.show` | Reba ibyavuye mu ishakisha | Show results | needs native-speaker review |
| `filters.active` | Iyungurura rikora | Active filters | needs native-speaker review |
| `filters.remove` | Kuraho iyungurura: {{name}} | Remove filter: {{name}} | needs native-speaker review |
| `sort.open` | Ibikora mbere | Open first | needs native-speaker review |
| `sort.soonest` | Gutegereza bike | Shortest wait | needs native-speaker review |
| `sort.nearest` | Ibikwegereye | Nearest | needs native-speaker review |
| `meta.findCare` | Shaka ivuriro mu Rwanda ukurikije serivisi, aho riri n’ubwishingizi. Reba afunguye n’igihe cyo gutegereza. | Search facilities in Rwanda by service, place and insurance. See who is open and the wait now. | needs native-speaker review |
| `meta.facilities` | Amavuriro yose ari kuri MediLink: afunguye ubu, igihe cyo gutegereza, ubwishingizi yakira, amasaha n’inzira. | Every health facility on MediLink: open now, live waits, insurance accepted, hours and directions. | needs native-speaker review |
| `meta.doctors` | Abaganga bo ku mavuriro ya MediLink: serivisi batanga, iminsi bakora n’aho wafata gahunda. | Doctors at MediLink facilities: their service, the days they work and where to book. | needs native-speaker review |
| `meta.services` | Serivisi z’ubuzima kuri MediLink, kuva ku kwisuzumisha kugeza ku bizamini, n’amavuriro azitanga. | Health services on MediLink, from consultations to lab tests, and the facilities that offer them. | needs native-speaker review |
| `meta.how` | Shaka, jya ku murongo cyangwa ufate gahunda, kurikira igihe cyawe kuri telefoni, uze igihe cyawe cyegereje. | Search, join the queue or book, follow your turn on your phone, arrive when it is nearly time. | needs native-speaker review |
| `meta.emergency` | Ubutabazi bwihutirwa mu Rwanda: hamagara 912 (SAMU), ni ubuntu, amasaha 24. Ibitaro bifite serivisi y’ubutabazi. | Life-threatening emergency in Rwanda: call 912 for SAMU, free, 24 hours. Hospitals with an emergency department. | needs native-speaker review |
| `meta.help` | Ibisubizo ku makonti, gahunda, umurongo, ubwishingizi n’amadosiye yawe kuri MediLink. | Answers about accounts, bookings, the queue, insurance and your records on MediLink. | needs native-speaker review |
| `meta.about` | MediLink ihuza abarwayi bo mu Rwanda n’amavuriro: igihe cyo gutegereza, imirongo na gahunda ahantu hamwe. | MediLink connects patients in Rwanda with health facilities: live waits, queues and bookings in one place. | needs native-speaker review |
| `meta.contact` | Vugana n’itsinda rya MediLink ukoresheje imeri cyangwa telefoni. | Contact the MediLink team by email or phone. | needs native-speaker review |
| `meta.accessibility` | Uko MediLink ikora hamwe na porogaramu isoma ecran, mwandikisho, inyandiko nini na interineti itihuta. | How MediLink works with screen readers, keyboards, larger text and slow connections. | needs native-speaker review |
| `meta.privacy` | Ibyo MediLink ikusanya, impamvu, aho bibikwa n’uburenganzira bwawe hakurikijwe itegeko ryo kurinda amakuru mu Rwanda. | What MediLink collects, why, where it is stored and your rights under Rwanda's data protection law. | needs native-speaker review |
| `meta.terms` | Amabwiriza yo gukoresha MediLink ku barwayi no ku mavuriro. | The terms for using MediLink as a patient or a facility. | needs native-speaker review |
| `meta.forFacilities` | Shyira ivuriro ryawe kuri MediLink: umurongo uhita ugaragara, gahunda n’abaje batayifite mu igenamigambi rimwe. | Put your facility on MediLink: live queue, bookings and walk-ins in one day plan, records in one place. | needs native-speaker review |
| `meta.checkSymptoms` | Subiza ibibazo bike umenye serivisi n’ivuriro bijyanye n’ibimenyetso byawe. | Answer a few questions to find which service and facility fit your symptoms. | needs native-speaker review |
| `offline` | Nta interineti ufite. Urabona ibyaherukaga kugera. | You are offline. Showing what was last loaded. | needs native-speaker review |

## patient-web feature: tracker (namespace tracker)

File: `apps/patient-web/src/features/tracker/locales/rw.json`

| Key | Kinyarwanda (draft) | English source | Status |
|---|---|---|---|
| `title` | Umwanya wawe ku murongo | Your place in the queue | needs native-speaker review |
| `backHome` | Ahabanza | Home | needs native-speaker review |
| `loading` | Tike yawe irafunguka… | Loading your ticket… | needs native-speaker review |
| `offline` | Nta interineti ufite | You are offline | needs native-speaker review |
| `lastUpdated` | Byavuguruwe saa {{time}} | Last updated {{time}} | needs native-speaker review |
| `noVisitTitle` | Nta tike ufite uyu munsi | No ticket today | needs native-speaker review |
| `noVisit` | Uru ruzinduko rwarangiye cyangwa rwahagaritswe. | This visit has ended or was cancelled. | needs native-speaker review |
| `yourTicket` | Nimero ya tike yawe | Your ticket number | needs native-speaker review |
| `ahead_one` | Umuntu {{count}} akuri imbere | {{count}} person ahead of you | needs native-speaker review |
| `ahead_other` | Abantu {{count}} bakuri imbere | {{count}} people ahead of you | needs native-speaker review |
| `calledTo` | Jya muri {{room}} ubu | Go to {{room}} now | needs native-speaker review |
| `inService` | Uri kwa muganga | You are with the doctor | needs native-speaker review |
| `stagesTitle` | Uruzinduko rwawe | Your visit | needs native-speaker review |
| `stages.consultation` | Muganga | Doctor | needs native-speaker review |
| `stages.payment` | Kwishyura | Payment | needs native-speaker review |
| `stages.pharmacy` | Farumasi | Pharmacy | needs native-speaker review |
| `wait` | Hafi iminota {{min}}–{{max}} | About {{min}}–{{max}} min | needs native-speaker review |
| `leaveBy` | Va mu rugo saa {{time}} | Leave home by {{time}} | needs native-speaker review |
| `status.break` | Muganga ari mu kiruhuko kugeza saa {{time}} | The doctor is on a break until {{time}} | needs native-speaker review |
| `status.emergency` | Muganga ari mu byihutirwa. Bishobora gutinda. | The doctor is with an emergency. Delays are possible. | needs native-speaker review |
| `status.none_on_duty` | Nta muganga uratangira. | No doctor has started yet. | needs native-speaker review |
| `travelLabel` | Iminota kuva mu rugo ugera hano | Minutes from home to here | needs native-speaker review |
| `travelHint` | Tuzakubwira igihe cyo kuva mu rugo. | We tell you when to leave. | needs native-speaker review |
| `travelSave` | Bika | Save | needs native-speaker review |
| `cancel` | Reka umwanya wanjye | Cancel my place | needs native-speaker review |
| `cancelTitle` | Urareka umwanya wawe? | Cancel your place? | needs native-speaker review |
| `cancelBody` | Tike {{ticket}} izakurwa ku murongo. | Ticket {{ticket}} will be removed from the queue. | needs native-speaker review |
| `cancelConfirm` | Yego, reka | Yes, cancel | needs native-speaker review |
| `keep` | Guma ku murongo | Keep my place | needs native-speaker review |
| `close` | Funga | Close | needs native-speaker review |
| `failed` | Ntibyakunze. Ongera ugerageze. | That did not work. Try again. | needs native-speaker review |
| `called` | Ni wowe ugezweho | It's your turn | needs native-speaker review |
| `goTo` | Jya muri {{room}} | Go to {{room}} | needs native-speaker review |
| `coming` | Ndaje | I'm coming | needs native-speaker review |
| `homeTitle` | Uruzinduko rw'uyu munsi | Today's visit | needs native-speaker review |
| `open` | Fungura | Open | needs native-speaker review |
| `states.in_service` | Uri kwa muganga | With the doctor | needs native-speaker review |
| `states.on_hold` | Utegereje ibisubizo | Waiting for results | needs native-speaker review |
| `visits.title` | Gahunda zanjye | My visits | needs native-speaker review |
| `visits.today` | Uyu munsi | Today | needs native-speaker review |
| `visits.loadFailed` | Ntitwashoboye kuzana gahunda z’uyu munsi. | We couldn't load today's visits. | needs native-speaker review |
| `visits.noneToday` | Nta gahunda y’uyu munsi | No visit today | needs native-speaker review |
| `visits.noneTodayBody` | Abakira abarwayi bamaze kukwandika, tike yawe n’umwanya wawe ku murongo bigaragara hano. | When reception checks you in, your ticket and your place in the queue show here. | needs native-speaker review |
| `visits.findCare` | Shaka ubuvuzi | Find care | needs native-speaker review |
| `visits.history` | Gahunda zabanje | Earlier visits | needs native-speaker review |
| `visits.historyEmpty` | Amateka y’isura zawe atangirira hano | Your visit history starts here | needs native-speaker review |
| `visits.historyEmptyBody` | Nyuma ya buri sura, uzahasanga incamake, imiti yawe, inyandiko n’inyemezabwishyu. | After each visit you'll find the summary, your medicines, documents and the receipt here. | needs native-speaker review |
| `remote.title` | Wiyandikishije ku murongo uri mu rugo | You joined from home | needs native-speaker review |
| `remote.body` | Nugera ku kigo nderabuzima, kanda "Nahageze", hanyuma werekane iyi tike ku kwakira abarwayi. | When you reach the facility, tap "I'm here", then show this ticket at reception. | needs native-speaker review |
| `remote.here` | Nahageze | I'm here | needs native-speaker review |
| `remote.claimed` | Dutegereje ko abakira abarwayi bemeza ko wahageze. Erekana iyi tike ku biro byabo. | Waiting for reception to confirm you're here. Show this ticket at the desk. | needs native-speaker review |
| `remote.passOverTitle` | Uri hafi y'imbere | You're near the front | needs native-speaker review |
| `remote.passOver` | Gera ku kigo vuba wiyandikishe ku kwakira abarwayi. Nibatakwemeza mbere y'uko igihe cyawe kigera, umwanya wawe usubira inyuma. | Get to the facility and check in at reception soon. If reception hasn't confirmed you when your turn comes, your place moves back. | needs native-speaker review |
| `remote.passOverClaimed` | Erekana tike yawe ku kwakira abarwayi ubu. Kugeza bemeje ko wahageze, umwanya wawe ushobora gusubira inyuma. | Show your ticket at reception now. Until they confirm you're here, your place can move back. | needs native-speaker review |
| `remote.changed` | Tike yawe yahindutse. Twayivuguruye. Ongera ugerageze. | Your ticket changed. We refreshed it. Try again. | needs native-speaker review |
| `aheadShort_one` | umuntu uri imbere yawe | person ahead of you | needs native-speaker review |
| `aheadShort_other` | abantu bari imbere yawe | people ahead of you | needs native-speaker review |

