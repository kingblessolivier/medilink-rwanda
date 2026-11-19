import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../app/format.dart' as fmt;
import '../../app/strings.dart';
import '../../app/theme.dart';
import '../../data/models.dart';
import '../../ui/building.dart';
import '../../ui/feedback.dart';
import '../../ui/icons.dart';
import '../../ui/insurers.dart';

/// A facility as a compact card (Home "Near you", the map): its building, name, distance,
/// open or closed, the queue right now, and the insurers it accepts.
class FacilityMiniCard extends StatelessWidget {
  const FacilityMiniCard({super.key, required this.facility, this.onTap, this.raised = false, this.hero = false});

  final FacilitySummary facility;
  final VoidCallback? onTap;

  /// Over the map: floating depth.
  final bool raised;

  /// Whether the drawing flies into the facility page. Off on Home and the map: Home opens the
  /// facility in the Care tab (another navigator), and the map sits over Home, whose cards
  /// would otherwise fly into the map's.
  final bool hero;

  @override
  Widget build(BuildContext context) {
    final s = S.of(context);
    final theme = Theme.of(context);
    final f = facility;
    final wait = f.waitRange == null ? null : fmt.waitRange(f.waitRange!.min, f.waitRange!.max, s);
    final building = FacilityCover(url: f.coverUrl, type: f.type, emergency: f.emergency);
    return SoftCard(
      raised: raised,
      onTap: onTap ?? () => context.go('/care/${f.slug}'),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Stack(
              fit: StackFit.expand,
              children: [
                hero ? Hero(tag: 'building-${f.slug}', child: building) : building,
                Positioned(
                  left: Space.md,
                  top: Space.md,
                  child: StatusPill.open(open: f.openNow, text: f.openNow ? s.openNow : s.closed, onImage: true),
                ),
                if (f.distanceKm != null)
                  Positioned(
                    right: Space.md,
                    top: Space.md,
                    child: StatusPill(text: '${f.distanceKm!.toStringAsFixed(1)} km', tone: PillTone.brand, onImage: true),
                  ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(Space.lg, Space.md, Space.lg, Space.lg),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    FacilityLogo(url: f.logoUrl, size: 32, gap: Space.sm),
                    Expanded(
                      child: Text(f.name, style: theme.textTheme.titleMedium, maxLines: 2, overflow: TextOverflow.ellipsis),
                    ),
                  ],
                ),
                Text(f.place, style: theme.textTheme.bodySmall, maxLines: 1, overflow: TextOverflow.ellipsis),
                const SizedBox(height: Space.sm),
                Row(
                  children: [
                    Icon(PhosphorIconsRegular.usersThree, size: 16, color: f.waiting == null ? Palette.muted : Palette.ochreText),
                    const SizedBox(width: Space.xs),
                    Flexible(
                      child: Text(
                        f.waiting == null ? '—' : '${f.waiting} ${s.waiting}',
                        style: theme.textTheme.labelMedium
                            ?.copyWith(color: f.waiting == null ? Palette.muted : Palette.ochreText, fontWeight: FontWeight.w600)
                            .tabular,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
                if (wait != null) ...[
                  const SizedBox(height: 2),
                  Row(
                    children: [
                      Icon(PhosphorIconsRegular.clock, size: 16, color: Palette.muted),
                      const SizedBox(width: Space.xs),
                      Flexible(
                        child: Text(
                          '~$wait',
                          style: theme.textTheme.labelMedium?.tabular,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                ],
                const SizedBox(height: Space.sm),
                SizedBox(height: context.scaled(22), child: InsurerPills(codes: f.insurers, max: 2)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// Open or closed, readable on the drawing.
class OpenBadge extends StatelessWidget {
  const OpenBadge({super.key, required this.open});

  final bool open;

  @override
  Widget build(BuildContext context) {
    final s = S.of(context);
    return StatusPill.open(open: open, text: open ? s.openNow : s.closed, onImage: true);
  }
}
