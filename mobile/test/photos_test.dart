import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:medilink/app/config.dart';
import 'package:medilink/data/models.dart';
import 'package:medilink/data/profile.dart';
import 'package:medilink/ui/building.dart';
import 'package:medilink/ui/grouped.dart';

void main() {
  test('photos come through from the API (Cloudinary, Google sign-in, scanned)', () {
    final me = Me.fromJson({
      'id': 'u1',
      'full_name': 'Mukamana Jeanne',
      'profiles': [
        {'patient_id': 'p2', 'display_name': 'Eric', 'relationship': 'guardian'},
        {'patient_id': 'p1', 'display_name': 'Jeanne', 'relationship': 'self', 'avatar_url': 'https://res.cloudinary.com/x/me.jpg'},
      ],
    });
    expect(me.avatarUrl, 'https://res.cloudinary.com/x/me.jpg');
    expect(me.profiles.first.avatarUrl, isNull);

    final card = FacilitySummary.fromJson({'slug': 'kigali', 'cover_url': '/api/v1/public/facilities/kigali/photos/1/'});
    expect(card.coverUrl, startsWith('/api/'));
    expect(absoluteImageUrl(card.coverUrl!), '${AppConfig.apiBaseUrl}/api/v1/public/facilities/kigali/photos/1/');
    expect(card.logoUrl, isNull);
    final branded = FacilitySummary.fromJson({'slug': 'kigali', 'logo_url': 'https://res.cloudinary.com/x/logo'});
    expect(branded.logoUrl, 'https://res.cloudinary.com/x/logo');
    expect(absoluteImageUrl('https://res.cloudinary.com/a.jpg'), 'https://res.cloudinary.com/a.jpg');

    final facility = Facility.fromJson({
      'slug': 'kigali',
      'photos': ['https://res.cloudinary.com/cover.jpg'],
      'logo_url': 'https://res.cloudinary.com/logo.png',
      'doctors': [
        {'membership_id': 'm1', 'name': 'Dr Aline Mukamana', 'photo_url': 'https://res.cloudinary.com/d.jpg'},
      ],
    });
    expect(facility.photos, ['https://res.cloudinary.com/cover.jpg']);
    expect(facility.logoUrl, isNotNull);
    expect(facility.doctors.single.photoUrl, 'https://res.cloudinary.com/d.jpg');

    final detail = ProfileDetail.fromJson({'patient_id': 'p1', 'avatar_url': 'https://res.cloudinary.com/me.jpg'});
    expect(detail.avatarUrl, isNotNull);
    expect(detail.hasPhoto, isFalse);
  });

  testWidgets('no photo: the drawing and the initials', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: Column(
          children: [
            SizedBox(height: 120, width: 300, child: FacilityCover(url: null, type: 'health_center')),
            Avatar(name: 'Mukamana Jeanne'),
          ],
        ),
      ),
    );
    expect(find.byType(FacilityBuilding), findsOneWidget);
    expect(find.text('MJ'), findsOneWidget);
  });

  testWidgets('a logo that cannot load leaves no empty circle and no gap', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: Row(
          children: [
            FacilityLogo(url: 'https://res.cloudinary.com/x/broken.png', size: 40, gap: 12),
            Expanded(child: Text('Kigali')),
          ],
        ),
      ),
    );
    // While it loads: the circle and the gap keep their place.
    expect(tester.getSize(find.byType(FacilityLogo)), const Size(52, 40));

    // Tests answer every request with HTTP 400: the logo fails.
    await tester.runAsync(() => Future<void>.delayed(const Duration(milliseconds: 200)));
    await tester.pump();
    expect(tester.getSize(find.byType(FacilityLogo)).width, 0);
    expect(tester.getTopLeft(find.text('Kigali')).dx, 0);
  });
}
