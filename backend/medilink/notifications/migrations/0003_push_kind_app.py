"""Phone app push: a push subscription is a browser (web push) or the phone app (FCM token)."""

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("notifications", "0002_s9_security_and_seed"),
    ]

    operations = [
        migrations.AddField(
            model_name="pushsubscription",
            name="kind",
            field=models.CharField(
                choices=[
                    ("web", "Browser (Web Push)"),
                    ("app", "Phone app (Firebase Cloud Messaging)"),
                ],
                default="web",
                max_length=3,
            ),
        ),
        migrations.AlterField(
            model_name="pushsubscription",
            name="p256dh",
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AlterField(
            model_name="pushsubscription",
            name="auth_secret",
            field=models.CharField(blank=True, max_length=40),
        ),
    ]
