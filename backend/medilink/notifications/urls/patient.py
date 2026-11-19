from django.urls import path

from medilink.notifications import views

inbox = views.PATIENT_INBOX

urlpatterns = [
    path("notifications/", inbox["list"].as_view(), name="patient-notifications"),
    path(
        "notifications/unread-count/",
        inbox["count"].as_view(),
        name="patient-notifications-unread-count",
    ),
    path(
        "notifications/read-all/",
        inbox["read_all"].as_view(),
        name="patient-notifications-read-all",
    ),
    path(
        "notifications/<uuid:notification_id>/",
        inbox["detail"].as_view(),
        name="patient-notification",
    ),
    path(
        "notifications/<uuid:notification_id>/read/",
        inbox["read"].as_view(),
        name="patient-notification-read",
    ),
    path(
        "notification-preferences/",
        views.PatientPreferencesView.as_view(),
        name="patient-notification-preferences",
    ),
    path(
        "push-subscriptions/",
        views.PushSubscriptionsView.as_view(),
        name="patient-push-subscriptions",
    ),
    path("app-devices/", views.AppDevicesView.as_view(), name="patient-app-devices"),
    path(
        "push-subscriptions/<uuid:subscription_id>/",
        views.PushSubscriptionDetailView.as_view(),
        name="patient-push-subscription",
    ),
]
