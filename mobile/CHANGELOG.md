# Changelog

All notable changes to the MediLink patient app (`mobile/`) are documented here.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow
`pubspec.yaml` (`name+build`).

## [Unreleased]

### 1.3.0 (2026-11-19)

- Added: visit reminders on the phone. For each confirmed visit the app schedules notifications 24
  hours, 2 hours and 15 minutes before, and "It's time for your visit" at the start, with the
  facility, the time and who the visit is for. They come without a connection and after the phone
  restarts; tapping one opens the booking. The app asks once for permission to notify (Android
  13+). Reminders follow the upcoming visits (booked, moved, cancelled; checked again when the app
  comes back) and are removed on sign-out. When the phone allows exact alarms they come on the
  minute; otherwise Android may send them a little late.

### 1.2.4 (2026-11-19)

- Fixed: a facility logo that can't load no longer leaves an empty white circle before the name
  on the Care cards, the Home "Near you" cards and the facility page; the name moves to the start.

### 1.2.3 (2026-11-18)

- Changed: the facility logo is round, like a profile picture, at the start of the facility's
  name; the photo stays the cover where the drawing was.

### 1.2.2 (2026-11-18)

- Added: the facility's logo next to its name on the Care cards, the Home "Near you" cards and
  the facility page; the uploaded photo stays the cover.

### 1.2.1 (2026-11-18)

- Added: search by insurance on Care. Filter chips for Mutuelle, RAMA, MMI and Private, plus
  "My insurance" from your own card; typing an insurer ("rama kicukiro") works too. A line above
  the results says whether only those places are shown, with a link to show the others.
- Changed: the search box now searches on the server (name, place and services), not only the
  names already loaded.

### 1.2.0 (2026-11-18)

- Added: real photos. Facility cards and the facility page show the facility's own cover photo
  (the drawing stays for facilities without one, and while a photo loads), with its logo next to
  the name; doctors show their photo on the facility and doctor pages.
- Added: the profile photo goes to Cloudinary like on the website, and the photo set on the
  website or brought from Google sign-in shows on Me, My profile and Family. Removing it removes
  both kinds of photo. Without Cloudinary on the server the photo goes through the scanned upload
  as before.

### 1.1.3 (2026-11-08)

- Fixed: the "+" steps on the profile to-do (details, ID, emergency contact, consent,
  insurance, allergies) did nothing; each opens the form for that step. The allergies step also
  offers "I have no known allergies".

### 1.1.2 (2026-11-07)

Everything the patient dashboard on the website shows, the app shows too:

- Added: Me → **Bills**: what is left to pay, bills with a balance first; each bill with its
  items (insurance and your share), payments and receipt numbers.
- Added: Me → **Disputes**: Report a problem from a bill or a prescription, follow the
  facility's answer, reply, accept, disagree (sent to MediLink) or reopen once, and add your
  statement after a refused correction.
- Added: tap a record for the visit: diagnoses in plain words, what to do, vitals and later
  additions.
- Added: tap a prescription for the code to show at the pharmacy and each medicine in words
  (dose, how often, how long, what was given, instructions).
- Added: tap a document to open it (a 5-minute link from the API, in the phone's viewer).
- Changed: notification links open the bill, dispute, record or prescription they are about.
- All new text in Kinyarwanda, English and French.

### 1.1.1 (2026-11-07)

- Added: Me → Settings → Appearance: Like the phone (default), Light or Dark. The choice is
  kept on the phone.
- Changed: dark mode uses neutral charcoal instead of dark green; green stays for buttons,
  links and accents.
- Changed: in dark mode the facility drawings are shown at night (dark sky and walls, dim
  windows) instead of the bright day drawing.

### 1.1.0 (2026-11-07)

Design polish (#260), no API or data changes:

- Added: dark mode. The app follows the phone's light or dark setting, like the staff website,
  with the website's dark colours (forest surfaces, light text, light-green buttons with dark
  text). The facility drawings and map tiles keep their colours.

- Changed: three depth levels only. Cards are white with a hairline and no shadow; only what
  floats over content (the card over the band, the map overlays, sheets) has one soft shadow.
  The grey "ledge" under the Home card, the ticket and the facility insurance card is gone.
- Changed: one type scale (display, title, headline, body, label, caption); Figtree for headings
  and big numbers, Inter for the rest; times, ticket numbers, waits, distances and counts use
  tabular figures.
- Changed: Me, Profile, Family, Notification settings, Settings, Records and the doctor and
  facility Services lists are inset grouped lists (muted label, one white group, hairlines).
- Changed: sub-pages (Profile, Family, Notification settings, Link my facility file, Records,
  Settings) have a light header with a large title that collapses into the bar; the other
  sub-pages get the same light bar. Main tabs keep the forest band, with one curve everywhere;
  the doctor and facility headers end in the same curve.
- Changed: the main action sits in a fixed bar at the bottom: Book, Book with this doctor,
  Confirm, Find my file, Add a member (replaces the floating button).
- Added: segmented control (Link my facility file, Add a member), one status pill (open, busy,
  closed, emergency, waiting: always a word), brand-green switches with a clear "off", and date
  and time fields that look like inputs.
- Fixed: Confirm (booking) shows white on green when it can be pressed and grey with "Choose at
  least one" when it cannot.
- Fixed: the facility name no longer sits white on the pale drawing; the drawing is no longer
  cropped (stray circle at the top right).
- Fixed: the doctor's days show the full day names, "Here" on their days and "Today" on today.
- Fixed: Family "Stop sharing" is a labelled action (it asks first, as before).
- Fixed: facility cards allow two lines for the name and put the wait on its own line.
- Fixed: Home ticket and next-visit cards no longer cut the facility name; the wait sits on its
  own line under it.
- Changed: Home quick actions are plain icons with one-line labels in a single card (no boxed
  tiles); "Near you" cards keep 16 px at both ends, the next card peeks, and the title and
  "See all" line up with the cards.
- Fixed: the OpenStreetMap credit stays visible on the map (top right, under the bar) and also
  shows on the Home map preview, as the licence asks.
- Fixed: back arrows on the doctor and facility pages are the app's own icon on a white circle.
- Changed: cards and quick actions shrink slightly while pressed (no ink ripple); rows tint
  softly; primary buttons darken. Toggles, chips and main buttons give a light tap.
- Changed: one page transition everywhere (the new page slides in a little and fades in).
- Changed: people ahead and wait times roll into place when they change (Home ticket, ticket
  page); a facility's drawing flies from the Care list into its page.
- Changed: every animation, including loading dots and the live dot, stops when the phone's
  "remove animations" setting is on.
- Added: French. Choose Français in Me → Settings or on the sign-in screen; dates, days and the
  date picker follow, and an account set to French opens the app in French. (Wording needs a
  native-speaker check.)
- Fixed: large text (1.3x, 1.6x) no longer cuts or overlaps: card heights, insurer pills and the
  doctor header grow with the text, quick actions go two by two, facility actions stack, a long
  sub-page title wraps, and "Stop sharing" moves under the name.
- Fixed: every tap target is at least 48 × 48 (notifications bell, family switcher, segments).
- Checked: all text colours reach 4.5:1 on their backgrounds (now a test).

### 1.0.8 (2026-11-06)

- Changed: rebuilt from `main` after the website and staff updates (#250, #255, #256). Same
  screens as 1.0.7; the new number lets phones with 1.0.7 install it as an update.

### 1.0.7 (2026-11-06)

- Added: "Continue with Google" under sign-in and sign-up (shown only when the server has it on).
  The first time, a sheet asks for the terms and privacy consent (research optional) before the
  account is created; an existing account with the same Gmail address is opened directly.
  Signing out also forgets the Google account on this phone, so the picker shows next time.
- Fixed: notifications whose link moved to the website's `/dashboard` pages opened nothing; they
  open the appointment, ticket, medications or documents again.

### 1.0.6 (2026-11-05)

Everything the website's patient dashboard does, in the app (no more "complete on the website"):

- Added: My profile (Me → My profile, or tap your photo): profile photo (camera or phone,
  removable; seen by you, people you share with and staff where you have a file), completion
  with what is missing, details (names, birth date, sex, phone, email, address), emergency
  contact, ID documents (masked), insurance cards (add; long-press to stop using) and health
  (allergies, conditions, medicines; "no known allergies"). Family members open the same page.
- Added: Notification settings (Me): channels per level, quiet hours, visit reminders, family
  alerts.
- Added: Link my facility file (Me): find a record a facility made, then confirm with the code
  sent to its contact, or a reference for reception.
- Added: Family → Sharing: make a one-time code to share a profile (password confirms), enter a
  code, stop sharing.

### 1.0.5 (2026-11-05)

- Changed: passwords need at least 8 characters (was 15).
- Added: Me → Settings → Change password (current password, new one twice; other phones and
  browsers are signed out).
- Fixed: errors now say what to fix (the server's field message, e.g. "password too short")
  instead of "some fields need attention".

### 1.0.4 (2026-11-05)

- Fixed: the symptom assistant asked yes/no questions with no way to answer them but typing.
  Yes / No / Not sure buttons now follow each question.
- Fixed: the assistant's answer said "the facilities below can help you" and showed none. It now
  lists facilities offering the suggested service (nearest first when location is on), with
  "More places". The possible cause shows only when the server allows naming it.
- Fixed: notifications came in Kinyarwanda while the app was in English. Changing the language in
  the app now saves it to the account (notification preferences), and signing in keeps the
  language picked on the phone.

### 1.0.3 (2026-11-05)

- Added: when the server has the sign-up email check off (test servers,
  `PATIENT_SIGNUP_EMAIL_VERIFICATION=false`), sign-up shows "Account ready" and the patient
  signs in straight away instead of waiting for an email.
- Fixed: booking failed with "some fields need attention" because the app sent no symptoms (the
  API needs 1–5). The confirm sheet now asks "What brings you in?" with symptom chips (red flags
  warn to call 912), plus an optional note.
- Added: doctor page. Tap a doctor on a facility: initials (no photo), specialty, "here today",
  the days they work as a Monday-first week, their services, bio and languages when public, and
  "Book with this doctor", which shows only their services and times (the filter can be removed).
- Fixed: selected chips (service, who it is for) showed white text on pale green.
- Added: accepted insurance on facilities. "Near you" and map cards show 2 insurers, Care cards
  3 (then "+N"), and the facility page lists them all under "Insurance accepted". Only whether it
  is accepted, never a price (U-01). Facilities with none say "No insurance listed yet".

### 1.0.2 (2026-11-05)

- Added: Home shows facilities ("Near you" once the patient allows approximate location, sorted
  by distance; the position is rounded to about 1 km before it is sent) as a swipeable row of
  cards with their building drawings, and a map preview. A full map (`/home/map`, `/care/map`,
  the map button on Care) shows facilities as pins; the cards at the bottom follow the pins.
- Changed: Home redesigned. Soft tinted shadows instead of grey elevation; the ticket card
  (number, people ahead in a ring, footer with place and wait), the next-visit card (date block)
  and a "where do you need care?" search card when nothing is planned; quick actions as icon
  tiles with full labels; a cleaner emergency row. Open/closed badges readable on the drawings.
- Fixed: with animations turned off, the loading skeleton crashed when it disappeared; screens
  with pull-to-refresh crashed when closed without being pulled.
- Added: `test_screens/` renders screens with sample data to PNG for design review
  (`flutter test test_screens --dart-define=SHOTS=<folder>`; not part of CI).

### 1.0.1 (2026-11-05)

- Fixed: going back to Home (or any tab) left the previous tab painted on top: its fade-out
  froze when the tab stopped animating. Hidden tabs are now offstage. Android back returns to
  Home before leaving the app.
- Changed: the real MediLink logo (pin, cross, zigzag) replaces the drawn cross on the splash,
  sign-in, PIN screen and header; launcher icon, themed icon and launch screen use it too.
- Added: in-app pages instead of website links: notifications (mark read, open the related
  page), symptom checker (chat with red flags first; rules checklist when the chat is off),
  family (members, profile, add a child or an adult you help), privacy (choices, who opened my
  record, privacy notice and terms), help (articles, search, support requests and replies),
  reset password.

### 1.0.0 (2026-11-05, upgrade 15)

- Added: the patient Android app (Flutter). Sign in, PIN and fingerprint unlock, auto-lock after
  2 minutes in the background.
- Added: Home with the forest band, today's ticket (live, refreshed every 15 s, strong vibration
  on "your turn") or the next visit, quick tiles, Emergency 912.
- Added: Care (facility cards with building drawings, filters, facility page, booking with a
  confirm sheet), Visits (today, upcoming, past; swipe and long-press actions), Me (records,
  medications, results, documents with screenshots blocked; settings).
- Added: offline copies of tickets, appointments and medications, encrypted on the phone;
  app-icon shortcuts (My ticket, Book, Find care, Emergency 912).
