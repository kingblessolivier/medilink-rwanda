import 'package:flutter_test/flutter_test.dart';
import 'package:medilink/app/strings.dart';
import 'package:medilink/app/strings_more.dart';
import 'package:medilink/data/models.dart';
import 'package:medilink/data/reminders.dart';

Booking visit(String id, DateTime startsAt, {String status = 'confirmed', String patient = ''}) => Booking.fromJson({
      'id': id,
      'status': status,
      'facility_name': 'Gisozi Clinic',
      'patient_display_name': patient,
      'starts_at': startsAt.toUtc().toIso8601String(),
    });

void main() {
  final now = DateTime(2026, 11, 19, 9);

  test('24 hours, 2 hours, 15 minutes before and at the start, soonest first', () {
    final start = DateTime(2026, 11, 21, 8);
    final planned = planReminders([visit('b1', start)], now);
    expect(planned.map((r) => r.moment), ReminderMoment.values);
    expect(planned.map((r) => r.at), [
      DateTime(2026, 11, 20, 8),
      DateTime(2026, 11, 21, 6),
      DateTime(2026, 11, 21, 7, 45),
      start,
    ]);
  });

  test('only moments still to come, only confirmed visits', () {
    final soon = visit('b1', now.add(const Duration(minutes: 30)));
    final cancelled = visit('b2', now.add(const Duration(days: 2)), status: 'cancelled');
    final planned = planReminders([soon, cancelled], now);
    expect(planned.map((r) => r.moment), [ReminderMoment.soon, ReminderMoment.now]);
    expect(planned.every((r) => r.booking.id == 'b1'), isTrue);
  });

  test('at most $maxPlanned reminders, the soonest kept', () {
    final many = [for (var i = 1; i <= 40; i++) visit('b$i', now.add(Duration(days: i)))];
    final planned = planReminders(many, now);
    expect(planned, hasLength(maxPlanned));
    expect(planned.first.booking.id, 'b1');
  });

  test('texts in every language, with the place, the time and who the visit is for', () {
    final r = planReminders([visit('b1', DateTime(2026, 11, 19, 10, 30), patient: 'Eric')], now).last;
    expect(r.moment, ReminderMoment.now);
    expect(reminderTitle(r, Strings.en), "It's time for your visit");
    expect(reminderBody(r, Strings.en), 'Eric · Gisozi Clinic · at 10:30');
    expect(reminderTitle(r, Strings.rw), 'Igihe kirageze');
    expect(reminderBody(r, Strings.fr), 'Eric · Gisozi Clinic · à 10:30');
    for (final s in [Strings.en, Strings.rw, Strings.fr]) {
      for (final m in ReminderMoment.values) {
        expect(s.t('remind.${m.name}'), isNot('remind.${m.name}'), reason: '${s.code} ${m.name}');
      }
    }
  });
}
