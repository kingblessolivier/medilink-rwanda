/// The app page for a notification's link; the inbox and push notifications both use it.
///
/// The API's paths are the website's; since upgrade 12 they start with /dashboard:
/// `/dashboard/appointments/{id}`, `/dashboard/queue/{id}`, `/dashboard/medications/{id}`,
/// `/dashboard/documents/{id}`.
String? appRouteFor(String? actionPath) {
  final path = actionPath ?? '';
  final booking = RegExp(r'/appointments/([0-9a-fA-F-]{8,})').firstMatch(path);
  if (booking != null) return '/visits/booking/${booking.group(1)}';
  final ticket = RegExp(r'/queue/([0-9a-fA-F-]{8,})').firstMatch(path);
  if (ticket != null) return '/visits/ticket/${ticket.group(1)}';
  // v1.1.2: the detail pages the dashboard links to
  final detail = RegExp(r'/dashboard/(medications|records|bills|disputes)/([0-9a-fA-F-]{8,})').firstMatch(path);
  if (detail != null) return '/me/${detail.group(1)}/${detail.group(2)}';
  if (path.contains('/bills')) return '/me/bills';
  if (path.contains('/disputes')) return '/me/disputes';
  if (path.contains('prescription') || path.contains('medication') || path.contains('medicine')) {
    return '/me/medications';
  }
  if (path.contains('document')) return '/me/documents';
  if (path.contains('consultation') || path.contains('/records')) return '/me/records';
  if (path.contains('result') || path.contains('lab')) return '/me/results';
  if (path.contains('booking') ||
      path.contains('appointment') ||
      path.contains('visit') ||
      path.contains('queue')) {
    return '/visits';
  }
  return null;
}
