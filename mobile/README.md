# MediLink patient app (Android)

The patient dashboard as an Android app, built with Flutter. Design and decisions:
[docs/upgrade/15-mobile-app.md](../docs/upgrade/15-mobile-app.md).

## Run and build

Flutter 3.44 (stable), Java 17 (Android Studio's `jbr`), Android SDK 36.

```sh
cd mobile
flutter pub get
flutter run                     # a connected phone or an emulator
flutter analyze && flutter test
```

The API address is set at build time (default: the Railway staging API):

```sh
flutter build apk --release --dart-define=API_BASE_URL=https://<api host> \
  --dart-define=WEB_BASE_URL=https://<website>
```

The APK is written to `build/app/outputs/flutter-apk/app-release.apk`. Copy it to `mobile/apk/`
(ignored by git) as `medilink-<version>.apk` to share it. Raise `version:` in `pubspec.yaml`
(`1.0.1+2`: name + build number) for every APK you share, or phones refuse the update.

## Push notifications

Push from the server (booking confirmed or moved, your turn, results, announcements) comes
through Firebase Cloud Messaging, project `medilink-rwanda-58d06`, Android app `rw.medilink`.
Give the project's values at build time from a file kept out of git (made from the console's
`google-services.json`):

```sh
flutter build apk --release --split-per-abi \
  --dart-define-from-file=C:/Users/<you>/.medilink/firebase.json
```

```json
{"FIREBASE_API_KEY": "…", "FIREBASE_APP_ID": "1:…:android:…",
 "FIREBASE_SENDER_ID": "…", "FIREBASE_PROJECT_ID": "medilink-rwanda-58d06"}
```

A build without them has no push; the visit reminders the phone schedules itself still work. The
server needs `FIREBASE_SERVICE_ACCOUNT` (docs/operations/railway.md).

## Signing

Release builds are signed with the key named in `android/key.properties` (ignored by git):

```properties
storeFile=C:/Users/<you>/.medilink/medilink-release.jks
storePassword=…
keyAlias=medilink
keyPassword=…
```

Keep a backup of the keystore and `key.properties` outside this machine (password manager or the
team's key store). **Losing them means installed apps cannot be updated**: people would have to
uninstall and reinstall. Without `key.properties` the release build falls back to the debug key.

## How it talks to the API

Patient session in a header, never a cookie (security 03 §5): every request sends
`X-MediLink-Client: app`; patient calls add `Authorization: Bearer <session key>`; a new key comes
back in `X-Session-Token`. The key is kept in the Android Keystore (`flutter_secure_storage`).

## Layout

| Folder | Content |
|---|---|
| `lib/app/` | Config, theme (palette, type), strings (rw, en), date formats, routes |
| `lib/data/` | API client, session and PIN, secure storage, models, data providers |
| `lib/ui/` | Forest band, building drawings, skeletons, heartbeat refresh, icons |
| `lib/screens/` | Sign-in, PIN, Home, Care, Visits, Me |
| `assets/fonts/` | Figtree, Inter, Phosphor icons (licences next to them) |

Kinyarwanda text in `lib/app/strings.dart` reuses the website's wording where it exists; the rest
needs a native-speaker review before release.
