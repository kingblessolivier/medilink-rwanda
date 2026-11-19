import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../app/strings.dart';
import 'api.dart';
import 'links.dart';
import 'reminders.dart';

/// The Firebase project the app receives push from. The values are given at build time
/// (`--dart-define-from-file`, see mobile/README.md); a build without them has no push and keeps
/// only the reminders it schedules itself.
class FirebaseConfig {
  static const apiKey = String.fromEnvironment('FIREBASE_API_KEY');
  static const appId = String.fromEnvironment('FIREBASE_APP_ID');
  static const senderId = String.fromEnvironment('FIREBASE_SENDER_ID');
  static const projectId = String.fromEnvironment('FIREBASE_PROJECT_ID');

  static bool get isSet => apiKey.isNotEmpty && appId.isNotEmpty && senderId.isNotEmpty && projectId.isNotEmpty;
}

/// The app page a push opens: its link (`action_path`), or the notifications list.
String pushRoute(Map<String, dynamic> data) =>
    appRouteFor(data['action_path'] as String?) ?? '/home/notifications';

// The server sends to the FCM registration token (HTTP v1 `message.token`, channels/fcm.py), so
// the token calls stay, though firebase_messaging 17 prefers its newer installation-id flow.
// ignore_for_file: deprecated_member_use

/// Push from the server through Firebase Cloud Messaging (booking confirmed or moved, your turn,
/// results, announcements). The visit reminders stay on the phone (reminders.dart); the server
/// does not push those.
class PhonePush {
  PhonePush._();
  static final instance = PhonePush._();

  static const _subscription = 'push.subscription';
  static const _token = 'push.token';
  static const _registeredAt = 'push.registered_at';

  /// Sent again once a day, so a phone the server dropped comes back.
  static const _refresh = Duration(days: 1);

  bool _ready = false;
  Api? _api;

  /// Opens an app page when a push is tapped (set by the app once the router exists).
  void Function(String route)? onOpen;

  /// The texts in the app's language (the alerts channel name).
  Strings Function()? strings;

  Future<void> init() async {
    if (_ready || !FirebaseConfig.isSet || defaultTargetPlatform != TargetPlatform.android) return;
    try {
      await Firebase.initializeApp(
        options: const FirebaseOptions(
          apiKey: FirebaseConfig.apiKey,
          appId: FirebaseConfig.appId,
          messagingSenderId: FirebaseConfig.senderId,
          projectId: FirebaseConfig.projectId,
        ),
      );
      _ready = true;
      final s = strings?.call();
      if (s != null) await VisitReminders.instance.ensureAlertsChannel(s);
      FirebaseMessaging.onMessage.listen(_showWhileOpen);
      FirebaseMessaging.onMessageOpenedApp.listen((m) => onOpen?.call(pushRoute(m.data)));
      FirebaseMessaging.instance.onTokenRefresh.listen((token) {
        final api = _api;
        if (api != null) _send(api, token);
      });
      final launch = await FirebaseMessaging.instance.getInitialMessage();
      if (launch != null) onOpen?.call(pushRoute(launch.data));
    } catch (e) {
      debugPrint('Push unavailable: $e');
    }
  }

  /// Android shows a push itself only while the app is closed or in the background.
  void _showWhileOpen(RemoteMessage message) {
    final n = message.notification;
    final s = strings?.call();
    if (n == null || s == null) return;
    VisitReminders.instance.showPush(
      title: n.title ?? '',
      body: n.body ?? '',
      route: pushRoute(message.data),
      s: s,
    );
  }

  /// Signed in and unlocked: the server learns where to push for this account (again when the
  /// token changes, and once a day).
  Future<void> register(Api api) async {
    _api = api;
    if (!_ready) return;
    try {
      await VisitReminders.instance.askPermissionOnce();
      final token = await FirebaseMessaging.instance.getToken();
      if (token == null) return;
      final prefs = await SharedPreferences.getInstance();
      final at = DateTime.tryParse(prefs.getString(_registeredAt) ?? '');
      final fresh = at != null && DateTime.now().difference(at) < _refresh;
      if (prefs.getString(_token) == token && prefs.getString(_subscription) != null && fresh) return;
      await _send(api, token);
    } catch (e) {
      debugPrint('Push not registered: $e');
    }
  }

  Future<void> _send(Api api, String token) async {
    try {
      final data = await api.post('/api/v1/patient/app-devices/', {'token': token, 'name': 'MediLink app'});
      final prefs = await SharedPreferences.getInstance();
      if (data is Map && data['id'] != null) await prefs.setString(_subscription, '${data['id']}');
      await prefs.setString(_token, token);
      await prefs.setString(_registeredAt, DateTime.now().toIso8601String());
    } on ApiException catch (e) {
      debugPrint('Push not registered: $e');
    }
  }

  /// Signing out: the server forgets this phone ([api] null when the session already ended), and
  /// the token is dropped, so a removal the server missed still ends push for this account.
  Future<void> unregister(Api? api) async {
    _api = null;
    try {
      final prefs = await SharedPreferences.getInstance();
      final id = prefs.getString(_subscription);
      await prefs.remove(_subscription);
      await prefs.remove(_token);
      await prefs.remove(_registeredAt);
      if (api != null && id != null) {
        try {
          await api.delete('/api/v1/patient/push-subscriptions/$id/');
        } on ApiException {
          // offline or already gone: the token is dropped below either way
        }
      }
      if (_ready) await FirebaseMessaging.instance.deleteToken();
    } catch (e) {
      debugPrint('Push not removed: $e');
    }
  }
}
