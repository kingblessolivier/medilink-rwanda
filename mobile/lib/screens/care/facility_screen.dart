import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../app/format.dart' as fmt;
import '../../app/strings.dart';
import '../../app/strings_more.dart';
import '../../app/theme.dart';
import '../../data/models.dart';
import '../../data/providers.dart';
import '../../ui/band.dart';
import '../../ui/building.dart';
import '../../ui/controls.dart';
import '../../ui/feedback.dart';
import '../../ui/grouped.dart';
import '../../ui/icons.dart';
import '../../ui/insurers.dart';
import 'directions.dart';

/// A facility: its building, where it is, what it offers, and Book.
class FacilityScreen extends ConsumerWidget {
  const FacilityScreen({super.key, required this.slug});

  final String slug;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final s = S.of(context);
    final theme = Theme.of(context);
    final facility = ref.watch(facilityProvider(slug));
    final summary = ref
        .watch(facilitySearchProvider(const SearchQuery()))
        .value
        ?.where((f) => f.slug == slug)
        .firstOrNull;
    final f = facility.value;
    final type = f?.type ?? summary?.type ?? '';
    final emergency = f?.emergency ?? summary?.emergency ?? false;

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            pinned: true,
            expandedHeight: 230,
            backgroundColor: Palette.forest,
            foregroundColor: Colors.white,
            systemOverlayStyle: SystemUiOverlayStyle.dark.copyWith(statusBarColor: Colors.transparent),
            leading: const HeaderBackButton(),
            title: CollapsedTitle(f?.name ?? summary?.name ?? ''),
            flexibleSpace: FlexibleSpaceBar(
              collapseMode: CollapseMode.parallax,
              background: Stack(
                fit: StackFit.expand,
                children: [
                  // The drawing's sky continues above it, so nothing is cropped at the top.
                  ColoredBox(color: FacilityBuilding.sky),
                  Hero(
                    tag: 'building-$slug',
                    child: FacilityCover(
                      url: f?.photos.firstOrNull ?? summary?.coverUrl,
                      type: type,
                      emergency: emergency,
                      fit: BoxFit.fitWidth,
                    ),
                  ),
                  const Positioned(left: 0, right: 0, bottom: -1, child: BandFoot()),
                ],
              ),
            ),
          ),
          ...facility.when(
            loading: () => [
              const SliverPadding(
                padding: EdgeInsets.all(Space.lg),
                sliver: SliverToBoxAdapter(child: SkeletonList(count: 3)),
              ),
            ],
            error: (e, _) => [
              SliverToBoxAdapter(child: ErrorState(error: e, onRetry: () => ref.invalidate(facilityProvider(slug)))),
            ],
            data: (f) => [
              SliverPadding(
                padding: const EdgeInsets.fromLTRB(Space.lg, Space.sm, Space.lg, Space.xxl),
                sliver: SliverList.list(
                  children: [
                    Wrap(
                      spacing: Space.sm,
                      runSpacing: Space.sm,
                      children: [
                        StatusPill.open(open: f.openNow, text: f.openNow ? s.openNow : s.closed),
                        if (f.emergency) StatusPill(text: s.emergency, tone: PillTone.danger, icon: PhosphorIconsFill.firstAid),
                      ],
                    ),
                    const SizedBox(height: Space.md),
                    Row(
                      children: [
                        FacilityLogo(url: f.logoUrl, size: 56, gap: Space.md),
                        Expanded(child: Text(f.name, style: theme.textTheme.headlineMedium)),
                      ],
                    ),
                    const SizedBox(height: Space.xs),
                    Text(f.address.isNotEmpty ? f.address : f.place, style: theme.textTheme.bodyMedium?.copyWith(color: Palette.muted)),
                    const SizedBox(height: Space.xl),
                    _Actions(facility: f),
                    const SizedBox(height: Space.xl),
                    GroupedSection(
                      label: s.t('insuranceAccepted'),
                      children: [
                        Padding(
                          padding: const EdgeInsets.all(Space.lg),
                          child: InsurerPills(codes: f.insurers, wrap: true),
                        ),
                      ],
                    ),
                    if (f.services.isNotEmpty)
                      GroupedSection(
                        label: s.services,
                        inset: Space.lg,
                        children: [for (final service in f.services) _ServiceRow(slug: slug, service: service)],
                      ),
                    if (f.doctors.isNotEmpty) ...[
                      SectionLabel(s.doctors),
                      SizedBox(
                        height: context.scaled(128),
                        child: ListView.separated(
                          scrollDirection: Axis.horizontal,
                          clipBehavior: Clip.none,
                          itemCount: f.doctors.length,
                          separatorBuilder: (_, _) => const SizedBox(width: Space.md),
                          itemBuilder: (context, i) => _DoctorCard(
                            doctor: f.doctors[i],
                            onTap: () => context.go('/care/$slug/doctor/${f.doctors[i].id}'),
                          ),
                        ),
                      ),
                      const SizedBox(height: Space.xl),
                    ],
                    if (f.hours.isNotEmpty)
                      GroupedSection(
                        label: s.hours,
                        children: [
                          Padding(
                            padding: const EdgeInsets.all(Space.lg),
                            child: Column(
                              children: [
                                for (final row in f.hours)
                                  Padding(
                                    padding: const EdgeInsets.symmetric(vertical: 3),
                                    child: Row(
                                      children: [
                                        Expanded(child: Text(row.isNotEmpty ? row.first : '')),
                                        Text(row.skip(1).join(' · '), style: theme.textTheme.bodySmall?.tabular),
                                      ],
                                    ),
                                  ),
                              ],
                            ),
                          ),
                        ],
                      ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
      bottomNavigationBar: f == null || !f.services.any((x) => x.bookable)
          ? null
          : BottomActionBar(
              child: FilledButton.icon(
                onPressed: () {
                  HapticFeedback.selectionClick();
                  context.go('/care/$slug/book');
                },
                icon: const Icon(PhosphorIconsRegular.calendarPlus),
                label: Text(s.book),
              ),
            ),
    );
  }
}

class _Actions extends StatelessWidget {
  const _Actions({required this.facility});
  final Facility facility;

  @override
  Widget build(BuildContext context) {
    final s = S.of(context);
    final actions = [
      (
        s.directions,
        PhosphorIconsRegular.navigationArrow,
        () => openDirections(name: facility.name, place: facility.place, lat: facility.lat, lng: facility.lng),
      ),
      if (facility.phone.isNotEmpty) (s.call, PhosphorIconsRegular.phone, () => call(facility.phone)),
    ];
    Widget button(String label, IconData icon, VoidCallback onTap) =>
        OutlinedButton.icon(onPressed: onTap, icon: Icon(icon, size: 20), label: Text(label, maxLines: 1));
    // Side by side; stacked when the text is large, so no word breaks.
    if (context.largeText) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          for (final (i, (label, icon, onTap)) in actions.indexed) ...[
            if (i > 0) const SizedBox(height: Space.sm),
            button(label, icon, onTap),
          ],
        ],
      );
    }
    return Row(
      children: [
        for (final (i, (label, icon, onTap)) in actions.indexed) ...[
          if (i > 0) const SizedBox(width: Space.md),
          Expanded(child: button(label, icon, onTap)),
        ],
      ],
    );
  }
}

class _ServiceRow extends StatelessWidget {
  const _ServiceRow({required this.slug, required this.service});
  final String slug;
  final FacilityService service;

  @override
  Widget build(BuildContext context) {
    final s = S.of(context);
    final next = service.nextSlotAt;
    return GroupedRow(
      title: s.pick(service.name),
      subtitle: next == null && service.waiting == null
          ? null
          : [
              if (service.waiting != null) '${service.waiting} ${s.waiting}',
              if (next != null) '${fmt.day(next, s)} ${fmt.time(next)}',
            ].join(' · '),
      onTap: service.bookable ? () => context.go('/care/$slug/book?service=${service.id}') : null,
    );
  }
}

class _DoctorCard extends StatelessWidget {
  const _DoctorCard({required this.doctor, required this.onTap});
  final Doctor doctor;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return SizedBox(
      width: 156,
      child: SoftCard(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(Space.md),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Avatar(name: doctor.name, initials: doctor.initials, photoUrl: doctor.photoUrl),
              const Spacer(),
              Text(doctor.name, style: theme.textTheme.titleSmall, maxLines: 2, overflow: TextOverflow.ellipsis),
              Text(doctor.specialty, style: theme.textTheme.bodySmall, maxLines: 1, overflow: TextOverflow.ellipsis),
            ],
          ),
        ),
      ),
    );
  }
}
