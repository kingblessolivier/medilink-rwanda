import 'package:flutter_test/flutter_test.dart';
import 'package:medilink/app/strings.dart';
import 'package:medilink/app/strings_more.dart';
import 'package:medilink/data/push.dart';

void main() {
  const booking = '7b1c2d3e-0000-4000-8000-000000000000';

  test('a push opens the page its link points to', () {
    expect(pushRoute({'action_path': '/dashboard/appointments/$booking'}), '/visits/booking/$booking');
    expect(pushRoute({'action_path': '/dashboard/queue/$booking'}), '/visits/ticket/$booking');
    expect(pushRoute({'action_path': '/dashboard/results'}), '/me/results');
  });

  test('a push without a known link opens the notifications list', () {
    expect(pushRoute({}), '/home/notifications');
    expect(pushRoute({'action_path': '/dashboard/somewhere-new'}), '/home/notifications');
  });

  test('a build without Firebase values has no push', () {
    expect(FirebaseConfig.isSet, isFalse);
  });

  test('the alerts channel has a name in every language', () {
    for (final s in [Strings.en, Strings.rw, Strings.fr]) {
      expect(s.t('push.channel'), isNot('push.channel'), reason: s.code);
    }
  });
}
