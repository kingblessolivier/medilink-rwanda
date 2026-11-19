from celery.schedules import crontab
from django.apps import AppConfig
from django.db.models.signals import post_migrate, post_save

BEAT_SCHEDULE = {
    "notifications.dispatch_due": {
        "task": "medilink.notifications.tasks.dispatch_due",
        "schedule": 10.0,
    },
    "notifications.unread_fallback": {
        "task": "medilink.notifications.tasks.unread_fallback",
        "schedule": 60.0,
    },
    # W7 (upgrade 13): reminders before booked visits, follow-up dates and the care schedule;
    # every minute so "it's time" goes out at the start (2026-11-19)
    "notifications.send_reminders": {
        "task": "medilink.notifications.tasks.send_reminders",
        "schedule": 60.0,
    },
    "notifications.cleanup": {
        "task": "medilink.notifications.tasks.cleanup",
        "schedule": crontab(hour=2, minute=30),
    },
}


class NotificationsConfig(AppConfig):
    name = "medilink.notifications"
    label = "notifications"
    verbose_name = "Notifications"

    def ready(self) -> None:
        from django.contrib.auth.signals import user_logged_in, user_logged_out

        from config.celery import app
        from medilink.audit.models import AuditEntry
        from medilink.notifications import channels, checks, observers, registry, templates

        registry.autodiscover()
        channels.load_default_adapters()
        checks.register()
        user_logged_in.connect(observers.on_user_logged_in, dispatch_uid="notifications.login")
        user_logged_out.connect(observers.on_user_logged_out, dispatch_uid="notifications.logout")
        post_save.connect(
            observers.on_audit_entry_saved,
            sender=AuditEntry,
            dispatch_uid="notifications.audit_entry",
        )
        post_migrate.connect(templates.sync_defaults, sender=self, weak=False)
        # Wave 6 part A (contract §11): domain signals to notify()
        from medilink.notifications import wiring

        wiring.connect()
        app.conf.beat_schedule = {**(app.conf.beat_schedule or {}), **BEAT_SCHEDULE}
