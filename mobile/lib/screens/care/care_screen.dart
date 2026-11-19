import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../ui/icons.dart';

import '../../app/format.dart' as fmt;
import '../../app/strings.dart';
import '../../app/theme.dart';
import '../../data/models.dart';
import '../../data/providers.dart';
import '../../ui/building.dart';
import '../../ui/feedback.dart';
import '../../ui/heartbeat_refresh.dart';
import '../../ui/insurers.dart';
import '../../ui/page_header.dart';
import '../../app/strings_more.dart';
import '../../data/location.dart';
import '../../data/profile.dart';
import 'facility_mini_card.dart';
import 'directions.dart';

class CareScreen extends ConsumerStatefulWidget {
  const CareScreen({super.key});

  @override
  ConsumerState<CareScreen> createState() => _CareScreenState();
}

class _CareScreenState extends ConsumerState<CareScreen> {
  SearchQuery _query = const SearchQuery();
  String _text = '';
  bool _showAll = false;
  Timer? _debounce;

  @override
  void dispose() {
    _debounce?.cancel();
    super.dispose();
  }

  void _typed(String v) {
    _debounce?.cancel();
    _debounce = Timer(const Duration(milliseconds: 350), () {
      if (mounted) {
        setState(() {
          _text = v;
          _showAll = false;
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final s = S.of(context);
    final here = ref.watch(locationProvider).point;
    // "rama kicukiro": the insurer goes as a filter, the other words as text.
    final typed = insurerInText(_text);
    final insurer = _query.insurerCode ?? typed.insurer;
    // Sorted by distance once the phone's location is known (rounded to ~1 km).
    final query = _query.copyWith(
      lat: here?.latitude,
      lng: here?.longitude,
      q: typed.rest,
      insurerCode: insurer,
      insuredOnly: insurer != null && !_showAll,
    );
    final results = ref.watch(facilitySearchProvider(query));

    return Scaffold(
      body: HeartbeatRefresh(
        onRefresh: () async {
          ref.invalidate(facilitySearchProvider(query));
          await ref.read(facilitySearchProvider(query).future).catchError((_) => <FacilitySummary>[]);
        },
        child: CustomScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          slivers: [
            SliverToBoxAdapter(
              child: BandHeader(
                title: s.care,
                trailing: IconButton(
                  tooltip: s.t('map'),
                  onPressed: () => context.go('/care/map'),
                  icon: const Icon(PhosphorIconsRegular.mapTrifold, color: Colors.white),
                ),
                bottom: TextField(
                  onChanged: _typed,
                  textInputAction: TextInputAction.search,
                  decoration: InputDecoration(
                    hintText: s.search,
                    prefixIcon: const Icon(PhosphorIconsRegular.magnifyingGlass),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(Space.radius),
                      borderSide: BorderSide.none,
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(Space.radius),
                      borderSide: BorderSide.none,
                    ),
                  ),
                ),
              ),
            ),
            // Filters stay pinned while the list scrolls.
            SliverPersistentHeader(
              pinned: true,
              delegate: _FilterHeader(
                child: _Filters(
                  query: _query,
                  onChanged: (q) => setState(() {
                    _query = q;
                    _showAll = false;
                  }),
                ),
              ),
            ),
            ...results.when(
              loading: () => [
                const SliverPadding(
                  padding: EdgeInsets.all(Space.lg),
                  sliver: SliverToBoxAdapter(child: _FacilitySkeletons()),
                ),
              ],
              error: (e, _) => [
                SliverToBoxAdapter(
                  child: ErrorState(error: e, onRetry: () => ref.invalidate(facilitySearchProvider(query))),
                ),
              ],
              data: (shown) {
                final scope = insurer == null
                    ? null
                    : SliverToBoxAdapter(
                        child: _InsurerScope(
                          name: insurerName(insurer, s),
                          showAll: _showAll,
                          onToggle: () => setState(() => _showAll = !_showAll),
                        ),
                      );
                if (shown.isEmpty) {
                  return [
                    ?scope,
                    SliverToBoxAdapter(
                      child: EmptyState(icon: PhosphorIconsRegular.magnifyingGlass, text: s.noResults),
                    ),
                  ];
                }
                return [
                  ?scope,
                  SliverPadding(
                    padding: const EdgeInsets.fromLTRB(Space.lg, Space.sm, Space.lg, Space.xxl),
                    sliver: SliverList.separated(
                      itemCount: shown.length,
                      separatorBuilder: (_, _) => const SizedBox(height: Space.lg),
                      itemBuilder: (context, i) => _Appear(
                        index: i,
                        child: FacilityCard(facility: shown[i]),
                      ),
                    ),
                  ),
                ];
              },
            ),
          ],
        ),
      ),
    );
  }
}

class _Filters extends ConsumerWidget {
  const _Filters({required this.query, required this.onChanged});

  final SearchQuery query;
  final ValueChanged<SearchQuery> onChanged;

  static const _insurers = ['mutuelle', 'rama', 'mmi', 'private_other'];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final s = S.of(context);
    final me = ref.watch(meProvider).value;
    final selfId = me?.profiles.where((p) => p.relationship == 'self').firstOrNull?.patientId;
    final mine = selfId == null
        ? null
        : ref.watch(insuranceProvider(selfId)).value?.map((c) => c.insurerCode).where((c) => c.isNotEmpty).firstOrNull;

    Widget chip(String label, bool on, SearchQuery next, IconData icon) => Padding(
      padding: const EdgeInsets.only(right: Space.sm),
      child: FilterChip(
        selected: on,
        onSelected: (_) {
          HapticFeedback.selectionClick();
          onChanged(next);
        },
        avatar: Icon(icon, size: 16, color: on ? Palette.brand : Palette.muted),
        showCheckmark: false,
        label: Text(label),
        selectedColor: Palette.brandSubtle,
        backgroundColor: Palette.surface,
        side: BorderSide(color: on ? Palette.brand : Palette.hairline),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(99)),
      ),
    );
    Widget insurerChip(String code, String label, IconData icon) => chip(
      label,
      query.insurerCode == code,
      query.copyWith(insurerCode: query.insurerCode == code ? null : code),
      icon,
    );
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.symmetric(horizontal: Space.lg, vertical: Space.sm),
      child: Row(
        children: [
          if (mine != null) insurerChip(mine, s.t('myInsurance'), PhosphorIconsRegular.shieldCheck),
          chip(s.openNow, query.openNow, query.copyWith(openNow: !query.openNow), PhosphorIconsRegular.clock),
          chip(
            s.today,
            query.availableToday,
            query.copyWith(availableToday: !query.availableToday),
            PhosphorIconsRegular.calendarCheck,
          ),
          chip(
            s.emergency,
            query.emergency,
            query.copyWith(emergency: !query.emergency),
            PhosphorIconsRegular.firstAid,
          ),
          for (final code in _insurers)
            if (code != mine) insurerChip(code, insurerName(code, s), PhosphorIconsRegular.shieldCheck),
        ],
      ),
    );
  }
}

/// "Only places that take RAMA · Show the others too", or the other way round.
class _InsurerScope extends StatelessWidget {
  const _InsurerScope({required this.name, required this.showAll, required this.onToggle});
  final String name;
  final bool showAll;
  final VoidCallback onToggle;

  @override
  Widget build(BuildContext context) {
    final s = S.of(context);
    final theme = Theme.of(context);
    return Padding(
      padding: const EdgeInsets.fromLTRB(Space.lg, Space.xs, Space.sm, 0),
      child: Row(
        children: [
          Icon(PhosphorIconsRegular.shieldCheck, size: 16, color: Palette.muted),
          const SizedBox(width: Space.sm),
          Expanded(
            child: Text(
              s.t(showAll ? 'insurerAll' : 'insurerOnly').replaceAll('{name}', name),
              style: theme.textTheme.bodySmall?.copyWith(color: Palette.muted),
            ),
          ),
          TextButton(onPressed: onToggle, child: Text(s.t(showAll ? 'insurerOnlyLink' : 'insurerAllLink'))),
        ],
      ),
    );
  }
}

class _FilterHeader extends SliverPersistentHeaderDelegate {
  _FilterHeader({required this.child});
  final Widget child;

  @override
  double get minExtent => 56;
  @override
  double get maxExtent => 56;

  @override
  Widget build(BuildContext context, double shrinkOffset, bool overlapsContent) => ColoredBox(
    color: Palette.page,
    child: Align(alignment: Alignment.centerLeft, child: child),
  );

  @override
  bool shouldRebuild(_FilterHeader oldDelegate) => oldDelegate.child != child;
}

/// List items fade and rise in, one after another.
class _Appear extends StatelessWidget {
  const _Appear({required this.index, required this.child});
  final int index;
  final Widget child;

  @override
  Widget build(BuildContext context) => Motion.off(context)
      ? child
      : TweenAnimationBuilder<double>(
          tween: Tween(begin: 0, end: 1),
          duration: Duration(milliseconds: 260 + 50 * index.clamp(0, 6)),
          curve: Curves.easeOutCubic,
          builder: (context, t, child) => Opacity(
            opacity: t,
            child: Transform.translate(offset: Offset(0, 14 * (1 - t)), child: child),
          ),
          child: child,
        );
}

class _FacilitySkeletons extends StatelessWidget {
  const _FacilitySkeletons();

  @override
  Widget build(BuildContext context) => Column(
    children: [
      for (var i = 0; i < 3; i++) ...[
        const Card(
          clipBehavior: Clip.antiAlias,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              AspectRatio(
                aspectRatio: 16 / 7,
                child: Skeleton(height: double.infinity, radius: 0),
              ),
              Padding(
                padding: EdgeInsets.all(Space.lg),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Skeleton(width: 180, height: 16),
                    SizedBox(height: Space.sm),
                    Skeleton(width: 120, height: 12),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: Space.lg),
      ],
    ],
  );
}

/// A facility as a card with a drawing of its kind of building (upgrade 14 §4), not a product.
class FacilityCard extends StatelessWidget {
  const FacilityCard({super.key, required this.facility});

  final FacilitySummary facility;

  Future<void> _menu(BuildContext context) async {
    final s = S.of(context);
    HapticFeedback.mediumImpact();
    final choice = await showModalBottomSheet<String>(
      context: context,
      builder: (context) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(Space.xl, 0, Space.xl, Space.sm),
              child: Text(facility.name, style: Theme.of(context).textTheme.titleMedium),
            ),
            ListTile(
              leading: const Icon(PhosphorIconsRegular.calendarPlus),
              title: Text(s.book),
              onTap: () => Navigator.pop(context, 'book'),
            ),
            ListTile(
              leading: const Icon(PhosphorIconsRegular.navigationArrow),
              title: Text(s.directions),
              onTap: () => Navigator.pop(context, 'directions'),
            ),
          ],
        ),
      ),
    );
    if (!context.mounted) return;
    if (choice == 'book') context.go('/care/${facility.slug}/book');
    if (choice == 'directions') openDirections(name: facility.name, place: facility.place);
  }

  @override
  Widget build(BuildContext context) {
    final s = S.of(context);
    final theme = Theme.of(context);
    final wait = facility.waitRange == null ? null : fmt.waitRange(facility.waitRange!.min, facility.waitRange!.max, s);
    return SoftCard(
      onTap: () => context.go('/care/${facility.slug}'),
      onLongPress: () => _menu(context),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Stack(
            children: [
              AspectRatio(
                aspectRatio: 16 / 7,
                child: Hero(
                  tag: 'building-${facility.slug}',
                  child: FacilityCover(url: facility.coverUrl, type: facility.type, emergency: facility.emergency),
                ),
              ),
              Positioned(
                left: Space.md,
                top: Space.md,
                child: OpenBadge(open: facility.openNow),
              ),
            ],
          ),
          Padding(
            padding: const EdgeInsets.all(Space.lg),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    FacilityLogo(url: facility.logoUrl, size: 40, gap: Space.md),
                    Expanded(child: Text(facility.name, style: theme.textTheme.titleLarge)),
                  ],
                ),
                const SizedBox(height: Space.xs),
                Row(
                  children: [
                    Icon(PhosphorIconsRegular.mapPin, size: 16, color: Palette.muted),
                    const SizedBox(width: 4),
                    Expanded(
                      child: Text(
                        [
                          facility.place,
                          if (facility.distanceKm != null) '${facility.distanceKm!.toStringAsFixed(1)} km',
                        ].where((t) => t.isNotEmpty).join(' · '),
                        style: theme.textTheme.bodySmall,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: Space.md),
                SizedBox(
                  height: context.scaled(22),
                  child: InsurerPills(codes: facility.insurers),
                ),
                if (facility.waiting != null || wait != null) ...[
                  const SizedBox(height: Space.md),
                  Wrap(
                    spacing: Space.sm,
                    runSpacing: Space.xs,
                    crossAxisAlignment: WrapCrossAlignment.center,
                    children: [
                      if (facility.waiting != null)
                        StatusPill(text: '${facility.waiting} ${s.waiting}', tone: PillTone.ochre),
                      if (wait != null)
                        Text('~$wait', style: theme.textTheme.bodySmall?.copyWith(color: Palette.ochreText).tabular),
                    ],
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}
