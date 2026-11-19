import 'package:flutter/foundation.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:timezone/timezone.dart' as tz;

import '../app/format.dart';
import '../app/strings.dart';
import '../app/strings_more.dart';
import 'models.dart';

/// Visit reminders on the phone (decision 2026-11-19): 24 hours, 2 hours and 15 minutes before
/// each confirmed visit, and "It's time" at the start. Scheduled on the phone itself (no
/// Firebase), so they come even without a connection; the server sends its own in-app, push and
/// email reminders too.
enum ReminderMoment {
  dayBefore(Duration(hours: 24)),
  twoHours(Duration(hours: 2)),
  soon(Duration(minutes: 15)),
  now(Duration.zero);

  const ReminderMoment(this.before);
  final Duration before;
}

class PlannedReminder {
  const PlannedReminder(this.at, this.moment, this.booking);
  final DateTime at;
  final ReminderMoment moment;
  final Booking booking;
}

/// Android keeps at most 500 alarms per app; a few weeks of visits fit well under this.
const maxPlanned = 64;

/// The reminders still to come for confirmed visits, soonest first.
List<PlannedReminder> planReminders(Iterable<Booking> bookings, DateTime now) {
  final planned = <PlannedReminder>[
    for (final booking in bookings)
      if (booking.status == 'confirmed')
        for (final moment in ReminderMoment.values)
          if (booking.startsAt.subtract(moment.before).isAfter(now))
            PlannedReminder(booking.startsAt.subtract(moment.before), moment, booking),
  ]..sort((a, b) => a.at.compareTo(b.at));
  return planned.take(maxPlanned).toList();
}

String reminderTitle(PlannedReminder r, Strings s) => s.t('remind.${r.moment.name}');

String reminderBody(PlannedReminder r, Strings s) {
  final when = s.t('remind.at').replaceAll('{time}', time(r.booking.startsAt));
  final name = r.booking.patientName.trim();
  return [if (name.isNotEmpty) name, r.booking.facilityName, when].join(' · ');
}

class VisitReminders {
  VisitReminders._();
  static final instance = VisitReminders._();

  static const _asked = 'reminders.asked';
  static const _channel = 'visit_reminders';
  static const _firstId = 1000;

  final _plugin = FlutterLocalNotificationsPlugin();
  bool _ready = false;

  /// Opens a booking when its reminder is tapped (set by the app once the router exists).
  void Function(String bookingId)? onOpen;

  Future<void> init() async {
    if (_ready || defaultTargetPlatform != TargetPlatform.android) return;
    try {
      await _plugin.initialize(
        settings: const InitializationSettings(android: AndroidInitializationSettings('@mipmap/ic_launcher')),
        onDidReceiveNotificationResponse: (response) => _open(response.payload),
      );
      _ready = true;
      final launch = await _plugin.getNotificationAppLaunchDetails();
      if (launch?.didNotificationLaunchApp ?? false) _open(launch!.notificationResponse?.payload);
    } catch (e) {
      debugPrint('Visit reminders unavailable: $e');
    }
  }

  void _open(String? bookingId) {
    if (bookingId != null && bookingId.isNotEmpty) onOpen?.call(bookingId);
  }

  AndroidFlutterLocalNotificationsPlugin? get _android =>
      _plugin.resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>();

  /// Replaces every scheduled reminder with those for [bookings]. Asks for the notification
  /// permission once (Android 13+), the first time there is a visit to remind of.
  Future<void> sync(List<Booking> bookings, Strings s) async {
    if (!_ready) return;
    try {
      final planned = planReminders(bookings, DateTime.now());
      await _plugin.cancelAllPendingNotifications();
      if (planned.isEmpty) return;
      final android = _android;
      var allowed = await android?.areNotificationsEnabled() ?? true;
      if (!allowed) {
        final prefs = await SharedPreferences.getInstance();
        if (prefs.getBool(_asked) ?? false) return;
        await prefs.setBool(_asked, true);
        allowed = await android?.requestNotificationsPermission() ?? false;
        if (!allowed) return;
      }
      // On time when the phone allows exact alarms; otherwise Android may send it a little late.
      final exact = await android?.canScheduleExactNotifications() ?? false;
      final details = NotificationDetails(
        android: AndroidNotificationDetails(
          _channel,
          s.t('remind.channel'),
          importance: Importance.high,
          priority: Priority.high,
          category: AndroidNotificationCategory.reminder,
        ),
      );
      for (var i = 0; i < planned.length; i++) {
        final r = planned[i];
        await _plugin.zonedSchedule(
          id: _firstId + i,
          scheduledDate: tz.TZDateTime.from(r.at.toUtc(), tz.UTC),
          notificationDetails: details,
          androidScheduleMode:
              exact ? AndroidScheduleMode.exactAllowWhileIdle : AndroidScheduleMode.inexactAllowWhileIdle,
          title: reminderTitle(r, s),
          body: reminderBody(r, s),
          payload: r.booking.id,
        );
      }
    } catch (e) {
      debugPrint('Visit reminders not scheduled: $e');
    }
  }

  /// Signed out: no reminders for this account stay on the phone.
  Future<void> clear() async {
    if (!_ready) return;
    try {
      await _plugin.cancelAll();
    } catch (e) {
      debugPrint('Visit reminders not cleared: $e');
    }
  }
}
