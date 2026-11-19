import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:local_auth/local_auth.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../app/config.dart';
import 'api.dart';
import 'models.dart';
import 'push.dart';
import 'secure_store.dart';

enum AuthPhase { starting, signedOut, setPin, locked, ready }

/// One Google sign-in attempt: the ID token is kept so the consent step can send it again.
class GoogleTicket {
  GoogleTicket(this.idToken);
  final String idToken;
  Me? me;
}

final secureStoreProvider = Provider<SecureStore>((ref) => SecureStore());

final languageProvider = NotifierProvider<LanguageController, String>(LanguageController.new);

class LanguageController extends Notifier<String> {
  static const _key = 'language';

  @override
  String build() {
    SharedPreferences.getInstance().then((prefs) {
      final saved = prefs.getString(_key);
      if (saved != null && saved != state) state = saved;
    });
    return 'rw';
  }

  Future<void> set(String code) async {
    final changed = code != state;
    state = code;
    (await SharedPreferences.getInstance()).setString(_key, code);
    final phase = ref.read(authProvider);
    if (changed && (phase == AuthPhase.ready || phase == AuthPhase.setPin)) await saveOnServer(code);
  }

  /// The language picked on this phone, or null if the patient never picked one.
  Future<String?> chosen() async => (await SharedPreferences.getInstance()).getString(_key);

  /// Notifications, emails and SMS are written in the account's language, so a change in the app
  /// is saved to the account too (notification preferences carry it, with their version).
  Future<void> saveOnServer(String code) async {
    const path = '/api/v1/patient/notification-preferences/';
    final api = ref.read(apiProvider);
    try {
      for (var attempt = 0; attempt < 2; attempt++) {
        final prefs = await api.get(path) as Json;
        if (prefs['language'] == code) return;
        try {
          await api.patch(path, {'version': prefs['version'] ?? 0, 'language': code});
          return;
        } on ApiException catch (e) {
          if (e.kind != ApiFailure.conflict) rethrow; // saved elsewhere meanwhile: read again
        }
      }
    } on ApiException catch (e) {
      debugPrint('Language not saved on the server: ${e.status}');
    }
  }
}

final apiProvider = Provider<Api>(
  (ref) => Api(
    ref.read(secureStoreProvider),
    onSessionEnded: () => ref.read(authProvider.notifier).sessionEnded(),
    language: () => ref.read(languageProvider),
  ),
);

final authProvider = NotifierProvider<AuthController, AuthPhase>(AuthController.new);

/// Sign-in, PIN and fingerprint. The server session is the patient session carried in a header;
/// the PIN only unlocks this phone (upgrade 15 §4).
class AuthController extends Notifier<AuthPhase> {
  final _localAuth = LocalAuthentication();
  int _failedPins = 0;

  SecureStore get _store => ref.read(secureStoreProvider);
  Api get _api => ref.read(apiProvider);

  @override
  AuthPhase build() {
    Future.microtask(_start);
    return AuthPhase.starting;
  }

  Future<void> _start() async {
    final started = DateTime.now();
    final key = await _store.loadSessionKey();
    final pin = key == null ? null : await _store.readPin();
    // Let the splash mark finish drawing (about half a second), never longer.
    final elapsed = DateTime.now().difference(started);
    const draw = Duration(milliseconds: 650);
    if (elapsed < draw) await Future<void>.delayed(draw - elapsed);
    state = key == null
        ? AuthPhase.signedOut
        : pin == null
            ? AuthPhase.setPin
            : AuthPhase.locked;
  }

  Future<Me> signIn(String email, String password) async {
    final data = await _api.post('/api/v1/patient/auth/login/', {'email': email, 'password': password});
    return _signedIn(data);
  }

  static const _googlePath = '/api/v1/patient/auth/google/';
  bool _googleReady = false;

  /// Whether the server has Sign in with Google on (upgrade 17); the button shows only then.
  Future<String?> googleClientId() async {
    try {
      final data = await _api.get(_googlePath) as Json;
      final id = '${data['client_id'] ?? ''}';
      return data['enabled'] == true && id.isNotEmpty ? id : null;
    } on ApiException {
      return null;
    }
  }

  /// Google's account picker; returns null when the person closed it. Then call [finishGoogle]:
  /// a first Google sign-in throws `consent_required` (ApiException.current holds email and
  /// full_name), so show the consents and call it again with `consent: true`.
  Future<GoogleTicket?> pickGoogleAccount(String clientId) async {
    final google = GoogleSignIn.instance;
    if (!_googleReady) {
      await google.initialize(serverClientId: clientId);
      _googleReady = true;
    }
    final GoogleSignInAccount account;
    try {
      account = await google.authenticate();
    } on GoogleSignInException catch (e) {
      if (e.code == GoogleSignInExceptionCode.canceled) return null;
      rethrow;
    }
    final token = account.authentication.idToken;
    if (token == null) throw ApiException(ApiFailure.server, message: 'No Google ID token');
    return GoogleTicket(token);
  }

  /// Sends the Google ID token, with the sign-up consents when [consent] is true.
  Future<Me> finishGoogle(GoogleTicket ticket, {bool consent = false, bool research = false}) async {
    final data = await _api.post(_googlePath, {
      'id_token': ticket.idToken,
      'preferred_language': ref.read(languageProvider),
      if (consent) ...{
        'accepted_terms_version': AppConfig.termsVersion,
        'accepted_privacy_version': AppConfig.privacyVersion,
        'research_consent': research,
      },
    });
    final me = await _signedIn(data);
    ticket.me = me;
    return me;
  }

  Future<Me> _signedIn(Object? data) async {
    if (_store.sessionKey == null) {
      throw ApiException(ApiFailure.server, message: 'No session key returned');
    }
    final me = Me.fromJson(data! as Json);
    final language = ref.read(languageProvider.notifier);
    final picked = await language.chosen();
    if (picked == null) {
      // first time on this phone: use the account's language
      await language.set(const ['en', 'fr'].contains(me.language) ? me.language : 'rw');
    } else if (picked != me.language) {
      // the patient picked a language here: the account follows, so messages match the app
      await language.saveOnServer(picked);
    }
    state = AuthPhase.setPin;
    return me;
  }

  /// Returns true when the account can sign in straight away (a test server sends no email).
  Future<bool> register({
    required String fullName,
    required String email,
    required String password,
  }) async {
    final data = await _api.post('/api/v1/patient/auth/register/', {
      'full_name': fullName,
      'email': email,
      'password': password,
      'preferred_language': ref.read(languageProvider),
      'accepted_terms_version': AppConfig.termsVersion,
      'accepted_privacy_version': AppConfig.privacyVersion,
      'research_consent': false,
    });
    return data is Map && data['email_verification'] == false;
  }

  Future<void> savePin(String pin, {required bool biometrics}) async {
    await _store.savePin(pin);
    await _store.setBiometrics(biometrics);
    _failedPins = 0;
    state = AuthPhase.ready;
  }

  /// Returns false on a wrong PIN; too many wrong PINs sign out.
  Future<bool> unlock(String pin) async {
    if (pin == await _store.readPin()) {
      _failedPins = 0;
      state = AuthPhase.ready;
      return true;
    }
    _failedPins++;
    if (_failedPins >= AppConfig.pinAttempts) await signOut();
    return false;
  }

  Future<bool> canUseBiometrics() async {
    try {
      return await _localAuth.isDeviceSupported() && await _localAuth.canCheckBiometrics;
    } on Exception {
      return false;
    }
  }

  Future<bool> biometricsEnabled() => _store.biometricsEnabled();

  Future<void> setBiometrics(bool on) => _store.setBiometrics(on);

  Future<bool> unlockWithBiometrics(String reason) async {
    try {
      final ok = await _localAuth.authenticate(localizedReason: reason, biometricOnly: true);
      if (ok) {
        _failedPins = 0;
        state = AuthPhase.ready;
      }
      return ok;
    } on Exception catch (e) {
      debugPrint('Biometric unlock failed: $e');
      return false;
    }
  }

  void lock() {
    if (state == AuthPhase.ready) state = AuthPhase.locked;
  }

  Future<void> signOut() async {
    await PhonePush.instance.unregister(_api); // while the session still works
    try {
      await _api.post('/api/v1/patient/auth/logout/');
    } on ApiException {
      // Offline or already ended: the phone forgets the session either way.
    }
    if (_googleReady) {
      // next Google sign-in shows the account picker again (another family member, say)
      await GoogleSignIn.instance.signOut().catchError((_) {});
    }
    await _store.wipe();
    state = AuthPhase.signedOut;
  }

  /// The server ended the session (expired, revoked, signed out elsewhere).
  Future<void> sessionEnded() async {
    await PhonePush.instance.unregister(null);
    await _store.wipe();
    state = AuthPhase.signedOut;
  }
}
