import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:quick_actions/quick_actions.dart';
import 'package:url_launcher/url_launcher.dart';

import 'app/config.dart';
import 'app/router.dart';
import 'app/strings.dart';
import 'app/theme.dart';
import 'data/appearance.dart';
import 'data/models.dart';
import 'data/providers.dart';
import 'data/push.dart';
import 'data/reminders.dart';
import 'data/session.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setEnabledSystemUIMode(SystemUiMode.edgeToEdge);
  // Failed loads show Retry; no silent automatic retries (they would repeat 401s and offline calls).
  runApp(ProviderScope(retry: (_, _) => null, child: const MediLinkApp()));
}

class MediLinkApp extends ConsumerStatefulWidget {
  const MediLinkApp({super.key});

  @override
  ConsumerState<MediLinkApp> createState() => _MediLinkAppState();
}

class _MediLinkAppState extends ConsumerState<MediLinkApp> with WidgetsBindingObserver {
  DateTime? _backgroundedAt;
  String? _shortcutsLanguage;
  final _quickActions = const QuickActions();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _quickActions.initialize(_onShortcut);
    Palette.dark = _wantsDark(ref.read(appearanceProvider));
    // Me → Settings → Appearance: like the phone, light or dark.
    ref.listenManual(appearanceProvider, (_, next) => _applyDark(_wantsDark(next)));
    // Visit reminders on the phone follow the upcoming visits while signed in; push from the
    // server comes while signed in. Tapping either opens its page.
    VisitReminders.instance.onOpen = _go;
    PhonePush.instance
      ..onOpen = _go
      ..strings = () => Strings.forCode(ref.read(languageProvider));
    VisitReminders.instance.init().then((_) => PhonePush.instance.init()).then((_) {
      if (!mounted) return;
      ref.listenManual(authProvider, (_, phase) => _followVisits(phase), fireImmediately: true);
      ref.listenManual(languageProvider, (_, code) {
        _syncReminders();
        VisitReminders.instance.ensureAlertsChannel(Strings.forCode(code));
      });
    });
  }

  ProviderSubscription<AsyncValue<Cached<List<Booking>>>>? _visits;
  List<Booking>? _lastVisits;

  void _followVisits(AuthPhase phase) {
    if (phase == AuthPhase.signedOut) {
      _visits?.close();
      _visits = null;
      _lastVisits = null;
      VisitReminders.instance.clear();
    } else if (phase == AuthPhase.ready && _visits == null) {
      PhonePush.instance.register(ref.read(apiProvider));
      _visits = ref.listenManual(bookingsProvider('upcoming'), (_, next) {
        final visits = next.value?.data;
        if (visits == null) return;
        _lastVisits = visits;
        _syncReminders();
      }, fireImmediately: true);
    }
  }

  void _syncReminders() {
    final visits = _lastVisits;
    if (visits == null) return;
    VisitReminders.instance.sync(visits, Strings.forCode(ref.read(languageProvider)));
  }

  /// Opens [route] now, or after the PIN when the app is locked.
  void _go(String route) {
    if (ref.read(authProvider) == AuthPhase.ready) {
      ref.read(routerProvider).go(route);
    } else {
      ref.read(pendingRouteProvider.notifier).set(route);
    }
  }

  bool _wantsDark(Appearance appearance) => switch (appearance) {
        Appearance.light => false,
        Appearance.dark => true,
        Appearance.system => WidgetsBinding.instance.platformDispatcher.platformBrightness == Brightness.dark,
      };

  /// By default dark mode follows the phone, like the staff website.
  @override
  void didChangePlatformBrightness() => _applyDark(_wantsDark(ref.read(appearanceProvider)));

  /// Screens read [Palette] in build, so every element rebuilds once (state, scroll and the open
  /// page stay as they are).
  void _applyDark(bool dark) {
    if (dark == Palette.dark || !mounted) return;
    Palette.dark = dark;
    setState(() {});
    void rebuild(Element element) {
      element.markNeedsBuild();
      element.visitChildren(rebuild);
    }

    (context as Element).visitChildren(rebuild);
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  /// Auto-lock: back from the background after 2 minutes asks for the PIN again.
  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.paused || state == AppLifecycleState.hidden) {
      _backgroundedAt ??= DateTime.now();
    } else if (state == AppLifecycleState.resumed) {
      final since = _backgroundedAt;
      _backgroundedAt = null;
      if (since != null && DateTime.now().difference(since) >= AppConfig.autoLockAfter) {
        ref.read(authProvider.notifier).lock();
      } else if (since != null && _visits != null) {
        // a visit moved or cancelled by the facility: the phone's reminders follow
        ref.invalidate(bookingsProvider('upcoming'));
      }
    }
  }

  /// Holding the app icon: My ticket · Book · Find care · Emergency 912 (upgrade 15 §3).
  /// Emergency calls straight away, without the PIN.
  void _onShortcut(String type) {
    if (type == 'emergency') {
      launchUrl(Uri.parse('tel:${AppConfig.emergencyNumber}'));
      return;
    }
    final route = switch (type) {
      'ticket' => '/visits',
      'book' || 'care' => '/care',
      _ => '/home',
    };
    if (ref.read(authProvider) == AuthPhase.ready) {
      ref.read(routerProvider).go(route);
    } else {
      ref.read(pendingRouteProvider.notifier).set(route);
    }
  }

  void _updateShortcuts(Strings s) {
    if (_shortcutsLanguage == s.code) return;
    _shortcutsLanguage = s.code;
    _quickActions.setShortcutItems([
      ShortcutItem(type: 'ticket', localizedTitle: s.ticket, icon: 'ic_shortcut_ticket'),
      ShortcutItem(type: 'book', localizedTitle: s.book, icon: 'ic_shortcut_book'),
      ShortcutItem(type: 'care', localizedTitle: s.findCare, icon: 'ic_shortcut_care'),
      ShortcutItem(
        type: 'emergency',
        localizedTitle: '${s.emergency} ${AppConfig.emergencyNumber}',
        icon: 'ic_shortcut_emergency',
      ),
    ]);
  }

  @override
  Widget build(BuildContext context) {
    final router = ref.watch(routerProvider);
    final strings = Strings.forCode(ref.watch(languageProvider));
    _updateShortcuts(strings);
    return MaterialApp.router(
      title: 'MediLink',
      debugShowCheckedModeBanner: false,
      theme: buildTheme(),
      routerConfig: router,
      // Material widgets (date and time pickers) have no Kinyarwanda: they use English then; in
      // French they follow. The app's own text follows S.
      locale: Locale(strings.code == 'fr' ? 'fr' : 'en'),
      supportedLocales: const [Locale('en'), Locale('fr')],
      localizationsDelegates: GlobalMaterialLocalizations.delegates,
      builder: (context, child) => S(strings: strings, child: child ?? const SizedBox.shrink()),
    );
  }
}
