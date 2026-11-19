import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

import '../app/config.dart';
import '../app/theme.dart';

/// Facility buildings, the same drawings as the website (upgrade 14 §4,
/// frontend/apps/patient-web/src/features/site/buildings.tsx): one flat drawing per facility
/// type on a quiet hillside; a 24-hour emergency department adds the red cross sign. In dark
/// mode the same drawing is shown at night (dark sky and walls, dim windows).
class FacilityBuilding extends StatelessWidget {
  const FacilityBuilding({super.key, required this.type, this.emergency = false, this.fit = BoxFit.cover});

  /// The drawing's sky, for extending it above the picture.
  static Color get sky => Palette.dark ? const Color(0xFF22272A) : const Color(0xFFE7F3ED);

  final String type;
  final bool emergency;
  final BoxFit fit;

  @override
  Widget build(BuildContext context) => ExcludeSemantics(
        child: SvgPicture.string(
          _svg(type, emergency, night: Palette.dark),
          fit: fit,
          alignment: Alignment.bottomCenter,
        ),
      );
}

/// A photo URL from the API, made absolute: search cards may give a path on the API host.
String absoluteImageUrl(String url) => url.startsWith('/') ? '${AppConfig.apiBaseUrl}$url' : url;

/// The facility's logo in a white circle (like a profile picture), placed before its name; or nothing when it has none (or it can't load).
class FacilityLogo extends StatelessWidget {
  const FacilityLogo({super.key, required this.url, this.size = 40, this.gap = 0});

  final String? url;
  final double size;

  /// Space between the logo and the name; left out with the logo when it can't load.
  final double gap;

  @override
  Widget build(BuildContext context) {
    final src = url;
    if (src == null || src.isEmpty) return const SizedBox.shrink();
    return Image.network(
      absoluteImageUrl(src),
      fit: BoxFit.contain,
      // The circle shows while the logo loads (the name doesn't jump) and once it has loaded.
      frameBuilder: (context, child, frame, sync) => Padding(
        padding: EdgeInsetsDirectional.only(end: gap),
        child: Container(
          width: size,
          height: size,
          decoration: BoxDecoration(
            color: Colors.white,
            shape: BoxShape.circle,
            border: Border.all(color: Palette.hairline),
          ),
          // Round, like a profile picture; the logo keeps its proportions inside the circle.
          child: ClipOval(
            child: Padding(padding: EdgeInsets.all(size * 0.08), child: child),
          ),
        ),
      ),
      // A broken logo: no empty circle and no gap, the name moves to the start.
      errorBuilder: (context, _, _) => const SizedBox.shrink(),
    );
  }
}

/// The facility's own cover photo when it has one; the drawing otherwise, and while the photo
/// loads or when it can't.
class FacilityCover extends StatelessWidget {
  const FacilityCover({super.key, required this.url, required this.type, this.emergency = false, this.fit = BoxFit.cover});

  final String? url;
  final String type;
  final bool emergency;

  /// How the drawing fits (the photo always covers).
  final BoxFit fit;

  @override
  Widget build(BuildContext context) {
    final drawing = FacilityBuilding(type: type, emergency: emergency, fit: fit);
    final src = url;
    if (src == null || src.isEmpty) return drawing;
    return ExcludeSemantics(
      child: Image.network(
        absoluteImageUrl(src),
        fit: BoxFit.cover,
        width: double.infinity,
        height: double.infinity,
        gaplessPlayback: true,
        frameBuilder: (context, child, frame, sync) => sync || frame != null ? child : drawing,
        errorBuilder: (context, _, _) => drawing,
      ),
    );
  }
}

// The drawing's colours by day and at night (set by _svg while it draws).
var _night = false;
String get _forest => _night ? '#2f6b53' : '#123d2b';
String get _forestRaised => _night ? '#285a46' : '#1a4d37';
String get _emerald => _night ? '#2a7d5d' : '#17694d';
String get _sky => _night ? '#22272a' : '#e7f3ed';
String get _window => _night ? '#4d5f57' : '#e7f3ed';
String get _surface => _night ? '#30373b' : '#ffffff';
String get _glass => _night ? '#41534b' : '#b9d6c4';
String get _danger => _night ? '#d64545' : '#b42318';

enum _Kind { referral, district, centre, poly, clinic }

_Kind _kind(String type) {
  if (type == 'referral_hospital') return _Kind.referral;
  if (type.contains('hospital')) return _Kind.district;
  if (type.startsWith('health_')) return _Kind.centre;
  if (type == 'polyclinic') return _Kind.poly;
  return _Kind.clinic;
}

String _windows(num x, num y, int n, {num w = 12, num h = 10, num gap = 8}) {
  final b = StringBuffer('<g fill="$_window">');
  for (var i = 0; i < n; i++) {
    b.write('<rect x="${x + i * (w + gap)}" y="$y" width="$w" height="$h" rx="1.5"/>');
  }
  return (b..write('</g>')).toString();
}

String _tree(num x, num y, [num r = 9]) => '<rect x="${x - 1.5}" y="$y" width="3" height="$r" fill="$_forest"/>'
    '<circle cx="$x" cy="${y - r * 0.2}" r="$r" fill="$_emerald"/>'
    '<circle cx="${x - r * 0.35}" cy="${y - r * 0.45}" r="${r * 0.45}" fill="$_surface" opacity="0.18"/>';

String _sign(num x, num y) => '<rect x="$x" y="$y" width="18" height="18" rx="3" fill="$_danger"/>'
    '<path d="M${x + 9} ${y + 4.5}v9M${x + 4.5} ${y + 9}h9" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>';

String _plaque(num x, num y) => '<rect x="$x" y="$y" width="14" height="14" rx="7" fill="$_emerald"/>'
    '<path d="M${x + 7} ${y + 3.5}v7M${x + 3.5} ${y + 7}h7" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round"/>';

String _rect(num x, num y, num w, num h, String fill, {num rx = 0, double? opacity}) =>
    '<rect x="$x" y="$y" width="$w" height="$h"${rx > 0 ? ' rx="$rx"' : ''} fill="$fill"'
    '${opacity != null ? ' opacity="$opacity"' : ''}/>';

String _drawing(_Kind kind) => switch (kind) {
      _Kind.referral => [
          _rect(58, 66, 74, 52, _surface),
          _rect(188, 66, 74, 52, _surface),
          _rect(54, 60, 82, 7, _forest, rx: 2),
          _rect(184, 60, 82, 7, _forest, rx: 2),
          _windows(66, 76, 3, w: 14, gap: 9),
          _windows(66, 96, 3, w: 14, gap: 9),
          _windows(196, 76, 3, w: 14, gap: 9),
          _windows(196, 96, 3, w: 14, gap: 9),
          _rect(126, 30, 68, 88, _surface),
          _rect(121, 24, 78, 8, _forest, rx: 2),
          _windows(134, 40, 3, gap: 6),
          _windows(134, 58, 3, gap: 6),
          _windows(134, 76, 3, gap: 6),
          _rect(138, 92, 44, 5, _forest, rx: 2),
          _rect(148, 97, 24, 21, _emerald),
          _rect(159, 97, 2, 21, _surface, opacity: 0.6),
        ].join(),
      _Kind.district => [
          _rect(52, 34, 2.5, 84, _forest),
          '<path d="M54.5 36h18l-5 6 5 6h-18z" fill="$_emerald"/>',
          _rect(68, 58, 184, 60, _surface),
          _rect(63, 51, 194, 8, _forest, rx: 2),
          _windows(78, 68, 4, w: 14),
          _windows(196, 68, 2, w: 14),
          _windows(78, 92, 3, w: 14),
          _windows(196, 92, 2, w: 14),
          _rect(148, 86, 44, 5, _forest, rx: 2),
          _rect(156, 91, 28, 27, _emerald),
          _rect(169, 91, 2, 27, _surface, opacity: 0.6),
          _plaque(163, 66),
        ].join(),
      _Kind.centre => [
          _rect(88, 80, 144, 38, _surface),
          '<path d="M78 82 160 56l82 26z" fill="$_forest"/>',
          _rect(78, 80, 164, 5, _forestRaised),
          for (final x in [92, 120, 200, 228]) _rect(x, 85, 3, 33, _forestRaised),
          _windows(100, 92, 2, w: 14, h: 12, gap: 10),
          _windows(182, 92, 2, w: 14, h: 12, gap: 10),
          _rect(150, 90, 20, 28, _emerald),
          _plaque(153, 64),
        ].join(),
      _Kind.poly => [
          _rect(92, 46, 136, 72, _surface),
          _rect(88, 40, 144, 7, _forest, rx: 2),
          _rect(100, 56, 120, 14, _glass, rx: 2, opacity: 0.85),
          _rect(100, 78, 120, 14, _glass, rx: 2, opacity: 0.85),
          for (final x in [130, 160, 190]) _rect(x, 56, 2, 36, _surface, opacity: 0.8),
          _rect(92, 46, 10, 72, _forestRaised),
          _rect(150, 98, 30, 20, _emerald),
          _rect(146, 94, 38, 4, _forest, rx: 2),
        ].join(),
      _Kind.clinic => [
          _rect(116, 80, 88, 38, _surface),
          '<path d="M108 82 160 58l52 24z" fill="$_forest"/>',
          _windows(126, 90, 1, w: 18, h: 14),
          _windows(176, 90, 1, w: 18, h: 14),
          _rect(151, 92, 18, 26, _emerald),
          '<path d="M146 92h28l-4-6h-20z" fill="$_forestRaised"/>',
          _plaque(153, 68),
          '<circle cx="112" cy="114" r="6" fill="$_emerald"/>',
          '<circle cx="208" cy="114" r="6" fill="$_emerald"/>',
        ].join(),
    };

const _signAt = {
  _Kind.referral: (168, 36),
  _Kind.district: (226, 32),
  _Kind.centre: (204, 62),
  _Kind.poly: (204, 22),
  _Kind.clinic: (186, 62),
};

final _cache = <String, String>{};

String _svg(String type, bool emergency, {bool night = false}) => _cache.putIfAbsent('$type/$emergency/$night', () {
      _night = night;
      final kind = _kind(type);
      final (sx, sy) = _signAt[kind]!;
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 140">'
          '<rect width="320" height="140" fill="$_sky"/>'
          '<circle cx="268" cy="30" r="16" fill="$_surface" opacity="0.55"/>'
          '<path d="M0 100c56-14 112-8 168-14s112-6 152 4v50H0z" fill="$_emerald" opacity="0.16"/>'
          '${_tree(30, 104, 10)}${_tree(290, 106, 8)}'
          '${_drawing(kind)}'
          '${emergency ? _sign(sx, sy) : ''}'
          '<path d="M0 118c80-6 240-6 320 0v22H0z" fill="$_emerald" opacity="0.3"/>'
          '<path d="M155 118h10l14 22h-38z" fill="$_surface" opacity="0.7"/>'
          '</svg>';
    });
