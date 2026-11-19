import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../app/format.dart' as fmt;
import '../../app/strings.dart';
import '../../app/strings_more.dart';
import '../../app/theme.dart';
import '../../data/api.dart';
import '../../data/links.dart';
import '../../data/models.dart';
import '../../data/providers.dart';
import '../../data/session.dart';
import '../../ui/feedback.dart';
import '../../ui/heartbeat_refresh.dart';
import '../../ui/icons.dart';

class AppNotification {
  AppNotification.fromJson(Json j)
      : id = j['id'] as String,
        title = j['title'] as String? ?? '',
        body = j['body'] as String? ?? '',
        priority = j['priority'] as String? ?? 'routine',
        actionPath = j['action_path'] as String?,
        read = j['is_read'] as bool? ?? false,
        withdrawn = j['is_withdrawn'] as bool? ?? false,
        createdAt = DateTime.tryParse(j['created_at'] as String? ?? '')?.toLocal() ?? DateTime.now();
  final String id, title, body, priority;
  final String? actionPath;
  final bool read, withdrawn;
  final DateTime createdAt;

  /// The app page for the notification's link (lib/data/links.dart).
  String? get appRoute => appRouteFor(actionPath);
}

final notificationsProvider = FutureProvider.autoDispose<List<AppNotification>>((ref) async {
  final data = await ref.read(apiProvider).get('/api/v1/patient/notifications/');
  return resultsOf(data).map(AppNotification.fromJson).where((n) => !n.withdrawn).toList();
});

class NotificationsScreen extends ConsumerWidget {
  const NotificationsScreen({super.key});

  Future<void> _readAll(WidgetRef ref) async {
    try {
      await ref.read(apiProvider).post('/api/v1/patient/notifications/read-all/');
    } on ApiException {
      return;
    }
    ref
      ..invalidate(notificationsProvider)
      ..invalidate(unreadProvider);
  }

  Future<void> _open(BuildContext context, WidgetRef ref, AppNotification n) async {
    if (!n.read) {
      ref.read(apiProvider).post('/api/v1/patient/notifications/${n.id}/read/').then((_) {
        ref
          ..invalidate(notificationsProvider)
          ..invalidate(unreadProvider);
      }, onError: (Object _) {});
    }
    final route = n.appRoute;
    if (route != null) {
      context.go(route);
      return;
    }
    await showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      builder: (context) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(Space.xl, 0, Space.xl, Space.xl),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(n.title, style: Theme.of(context).textTheme.titleLarge),
              const SizedBox(height: Space.sm),
              Text(n.body, style: Theme.of(context).textTheme.bodyLarge),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final s = S.of(context);
    final list = ref.watch(notificationsProvider);
    final anyUnread = list.value?.any((n) => !n.read) ?? false;
    return Scaffold(
      appBar: AppBar(
        title: Text(s.notifications),
        actions: [
          if (anyUnread)
            TextButton(
              onPressed: () => _readAll(ref),
              child: Text(s.t('markAllRead')),
            ),
        ],
      ),
      body: HeartbeatRefresh(
        onRefresh: () async {
          ref.invalidate(notificationsProvider);
          await ref.read(notificationsProvider.future).catchError((_) => <AppNotification>[]);
        },
        child: ListView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(Space.lg),
          children: [
            list.when(
              loading: () => const SkeletonList(),
              error: (e, _) => ErrorState(error: e, onRetry: () => ref.invalidate(notificationsProvider)),
              data: (items) => items.isEmpty
                  ? EmptyState(icon: PhosphorIconsRegular.bell, text: s.t('noNotifications'))
                  : Card(
                      child: Column(
                        children: [
                          for (final (i, n) in items.indexed) ...[
                            if (i > 0) const Divider(indent: 64),
                            _Row(notification: n, onTap: () => _open(context, ref, n)),
                          ],
                        ],
                      ),
                    ),
            ),
          ],
        ),
      ),
    );
  }
}

class _Row extends StatelessWidget {
  const _Row({required this.notification, required this.onTap});

  final AppNotification notification;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final s = S.of(context);
    final theme = Theme.of(context);
    final n = notification;
    final critical = n.priority == 'critical';
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.all(Space.lg),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: critical ? Palette.dangerSubtle : Palette.brandSubtle,
                shape: BoxShape.circle,
              ),
              child: Icon(
                critical ? PhosphorIconsFill.warningCircle : PhosphorIconsRegular.bell,
                size: 18,
                color: critical ? Palette.danger : Palette.brand,
              ),
            ),
            const SizedBox(width: Space.md),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    n.title,
                    style: theme.textTheme.titleSmall?.copyWith(fontWeight: n.read ? FontWeight.w500 : FontWeight.w700),
                  ),
                  const SizedBox(height: 2),
                  Text(n.body, style: theme.textTheme.bodySmall, maxLines: 2, overflow: TextOverflow.ellipsis),
                  const SizedBox(height: 4),
                  Text(
                    '${fmt.day(n.createdAt, s)} · ${fmt.time(n.createdAt)}',
                    style: theme.textTheme.labelSmall,
                  ),
                ],
              ),
            ),
            if (!n.read)
              Container(
                margin: const EdgeInsets.only(left: Space.sm, top: 6),
                width: 8,
                height: 8,
                decoration: BoxDecoration(color: Palette.brand, shape: BoxShape.circle),
              ),
          ],
        ),
      ),
    );
  }
}
