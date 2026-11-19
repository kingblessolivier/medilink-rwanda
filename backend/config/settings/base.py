"""Base settings shared by every environment.

Environment-specific modules (dev, test, prod) import everything from here and override.
All configuration comes from environment variables (12-factor, django-environ); see .env.example.
"""

from __future__ import annotations

from pathlib import Path
from typing import Any
from urllib.parse import unquote, urlsplit

import environ
from corsheaders.defaults import default_headers
from django.core.exceptions import ImproperlyConfigured
from django.utils.csp import CSP

from medilink import __version__

BASE_DIR = Path(__file__).resolve().parent.parent.parent  # backend/

env = environ.Env()
if env.bool("DJANGO_READ_DOT_ENV", default=True) and (BASE_DIR / ".env").is_file():
    # Local development convenience. Real environment variables always win over the file.
    environ.Env.read_env(str(BASE_DIR / ".env"), overwrite=False)

API_VERSION = __version__

# --------------------------------------------------------------------------------------------
# Core
# --------------------------------------------------------------------------------------------
DEBUG = False
SECRET_KEY = env("DJANGO_SECRET_KEY", default="")
SECRET_KEY_FALLBACKS = env.list("DJANGO_SECRET_KEY_FALLBACKS", default=[])
ALLOWED_HOSTS = env.list("DJANGO_ALLOWED_HOSTS", default=[])

INSTALLED_APPS = [
    "medilink.core.admin_apps.MedilinkAdminConfig",  # django.contrib.admin, OTP-enforcing site
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "drf_spectacular",
    "corsheaders",
    "channels",
    "django_otp",
    "django_otp.plugins.otp_totp",
    "medilink.core",
    "medilink.accounts",
    "medilink.tenancy",
    "medilink.authz",
    "medilink.audit",
    "medilink.patients",
    # ---- Wave 1 apps: each sprint adds lines ONLY between its own markers -----------------
    # (shared-file protocol: docs/architecture/contracts/README.md)
    # [S1] platform onboarding, master data, uploads
    "django.contrib.postgres",  # trigram indexes and search (master data)
    "medilink.uploads",
    "medilink.images",  # images on Cloudinary (signed direct uploads)
    "medilink.masterdata",
    "medilink.onboarding",
    # [/S1]
    # [S3] patients and identity (extends medilink.patients)
    # [/S3]
    # [S9] notifications
    "medilink.notifications",
    # [/S9]
    # [S2] facility setup and staff
    "medilink.facilities",
    "medilink.scheduling",
    "medilink.billing",
    # [/S2]
    # [S10] help center and support requests (part 1)
    "medilink.support",
    "medilink.disputes",  # part 2a
    # [/S10]
    # [PT] public pages and rules-based symptom triage
    "medilink.triage",
    # [/PT]
    # [S11] super admin console (users, logs, command centre)
    "medilink.platform_admin",
    # [/S11]
    # [S4] visits and the live queue
    "medilink.visits",
    # [/S4]
    # [S6] clinical record and history
    "medilink.clinical",
    # [/S6]
    # [S7] pharmacy and documents
    "medilink.documents",
    "medilink.pharmacy",
    # [/S7]
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "medilink.core.middleware.RequestIDMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "medilink.accounts.middleware.AudienceSessionMiddleware",
    "django.middleware.locale.LocaleMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "medilink.core.csrf.ApiCsrfEnforcementMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django_otp.middleware.OTPMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "medilink.tenancy.middleware.TenantContextMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "django.middleware.csp.ContentSecurityPolicyMiddleware",
    "medilink.core.middleware.SecurityHeadersMiddleware",
]

ROOT_URLCONF = "config.urls"
WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.template.context_processors.csp",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    }
]


# --------------------------------------------------------------------------------------------
# Database (PostgreSQL 17, psycopg 3). Two roles:
#   DATABASE_URL        runtime role (medilink_app): NOSUPERUSER NOBYPASSRLS, owns nothing
#   DATABASE_OWNER_URL  owner role (medilink_owner): used only by migrations (manage.py sets
#                       MEDILINK_DB_ROLE=owner for schema commands)
# --------------------------------------------------------------------------------------------
def database_config(role: str | None = None) -> dict[str, Any]:
    use_owner = (role or env("MEDILINK_DB_ROLE", default="app")) == "owner"
    url_var = (
        "DATABASE_OWNER_URL"
        if use_owner and env("DATABASE_OWNER_URL", default="")
        else "DATABASE_URL"
    )
    config: dict[str, Any] = env.db_url(url_var)
    # The request transaction is opened by TenantContextMiddleware (it must wrap the RLS context).
    config["ATOMIC_REQUESTS"] = False
    config["CONN_MAX_AGE"] = env.int("DATABASE_CONN_MAX_AGE", default=0)
    config["CONN_HEALTH_CHECKS"] = True
    config.setdefault("OPTIONS", {}).setdefault("connect_timeout", 10)
    timeout_ms = env.int("DATABASE_STATEMENT_TIMEOUT_MS", default=0)
    if timeout_ms:
        config.setdefault("OPTIONS", {})["options"] = f"-c statement_timeout={timeout_ms}"
    return config


DATABASES = {"default": database_config()}
DATABASE_APP_ROLE = env("DATABASE_APP_ROLE", default="medilink_app")
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# --------------------------------------------------------------------------------------------
# Cache, channels, Celery (Redis)
# --------------------------------------------------------------------------------------------
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.redis.RedisCache",
        "LOCATION": env("CACHE_URL", default="redis://127.0.0.1:6379/1"),
        "KEY_PREFIX": "medilink",
    }
}

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [env("CHANNEL_LAYER_URL", default="redis://127.0.0.1:6379/2")],
            "capacity": 1500,
            "expiry": 10,
        },
    }
}

# Celery: JSON only (never pickle), no result backend, time limits on every task (security 06 §8).
CELERY_BROKER_URL = env("CELERY_BROKER_URL", default="redis://127.0.0.1:6379/0")
CELERY_TASK_SERIALIZER = "json"
CELERY_RESULT_SERIALIZER = "json"
CELERY_EVENT_SERIALIZER = "json"
CELERY_ACCEPT_CONTENT = ["json"]
CELERY_RESULT_ACCEPT_CONTENT = ["json"]
CELERY_RESULT_BACKEND = None
CELERY_TASK_IGNORE_RESULT = True
CELERY_TASK_TIME_LIMIT = 60
CELERY_TASK_SOFT_TIME_LIMIT = 45
CELERY_TASK_ALWAYS_EAGER = env.bool("CELERY_TASK_ALWAYS_EAGER", default=False)
CELERY_TASK_EAGER_PROPAGATES = True
CELERY_BROKER_CONNECTION_RETRY_ON_STARTUP = True
CELERY_WORKER_HIJACK_ROOT_LOGGER = False
CELERY_TIMEZONE = "Africa/Kigali"  # beat crontabs (e.g. slots at 01:00) in Kigali time

# --------------------------------------------------------------------------------------------
# Authentication, passwords, MFA
# --------------------------------------------------------------------------------------------
AUTH_USER_MODEL = "accounts.User"
AUTHENTICATION_BACKENDS = ["medilink.accounts.backends.EmailBackend"]

PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.Argon2PasswordHasher",  # Argon2id
    "django.contrib.auth.hashers.PBKDF2PasswordHasher",  # only to upgrade legacy hashes
]
# NIST SP 800-63B-4: length + blocklists, no composition rules (security 03 §2).
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "medilink.accounts.validators.ContextualMinimumLengthValidator",
        # patients 8: decision 2026-11-05 (15 was too hard on phones); staff 12 with MFA
        "OPTIONS": {"staff_min_length": 12, "patient_min_length": 8},
    },
    {"NAME": "medilink.accounts.validators.MaximumLengthValidator", "OPTIONS": {"max_length": 256}},
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
        "OPTIONS": {"user_attributes": ("email", "full_name")},
    },
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "medilink.accounts.validators.BreachedPasswordValidator"},
    {"NAME": "medilink.accounts.validators.ContextWordsValidator"},
]
# Optional offline breached-password list: SHA-1 hashes, one per line (HIBP "HASH:count" format ok).
PASSWORD_BREACHED_HASHES_FILE = env("PASSWORD_BREACHED_HASHES_FILE", default="")
PASSWORD_RESET_TIMEOUT = 30 * 60  # 30 minutes, single use (security 03 §6)
EMAIL_VERIFICATION_TIMEOUT = 3 * 24 * 3600  # sign-up link: 3 days, single use (security 03 §6)
# Testing only: false lets a patient sign in straight after sign-up, with no email sent.
# Keep true in production (security 03 §6).
PATIENT_SIGNUP_EMAIL_VERIFICATION = env.bool("PATIENT_SIGNUP_EMAIL_VERIFICATION", default=True)
# Sign in with Google, patients only (upgrade 17). Empty = the button is hidden. The web client ID
# is also the Android app's serverClientId; extra audiences (e.g. a future iOS client) go in
# GOOGLE_OAUTH_CLIENT_IDS. Client IDs are public, not secrets.
# Values pasted into a host's variable editor often carry a trailing newline: strip them.
GOOGLE_OAUTH_WEB_CLIENT_ID = env("GOOGLE_OAUTH_WEB_CLIENT_ID", default="").strip()
GOOGLE_OAUTH_CLIENT_IDS = [
    cid.strip() for cid in env.list("GOOGLE_OAUTH_CLIENT_IDS", default=[]) if cid.strip()
]
GOOGLE_JWKS_URL = env("GOOGLE_JWKS_URL", default="https://www.googleapis.com/oauth2/v3/certs")

# Images on Cloudinary (medilink.images): facility photos and logos, clinician and patient avatars,
# uploaded by the browser with a signature from the API. The secret stays on the server.
CLOUDINARY = {
    "cloud_name": env("CLOUDINARY_CLOUD_NAME", default=""),
    "api_key": env("CLOUDINARY_API_KEY", default=""),
    "api_secret": env("CLOUDINARY_API_SECRET", default=""),
    "upload_preset": env("CLOUDINARY_UPLOAD_PRESET", default="medilink_signed"),
    "root_folder": env("CLOUDINARY_ROOT_FOLDER", default="medilink"),
}
# CLOUDINARY_URL (cloudinary://<api_key>:<api_secret>@<cloud_name>, the console's one-line form)
# fills whatever the three variables above leave empty.
_cloudinary_url = urlsplit(env("CLOUDINARY_URL", default="").strip())
if _cloudinary_url.scheme == "cloudinary":
    for _key, _value in (
        ("cloud_name", _cloudinary_url.hostname),
        ("api_key", unquote(_cloudinary_url.username or "")),
        ("api_secret", unquote(_cloudinary_url.password or "")),
    ):
        if not CLOUDINARY[_key] and _value:
            CLOUDINARY[_key] = _value

OTP_TOTP_ISSUER = env("MFA_TOTP_ISSUER", default="MediLink Rwanda")
# TOTP secrets are encrypted at rest (medilink.accounts.totp_crypto): "1:<base64url 32 bytes>,…"
MFA_SECRET_KEYS = env("MFA_SECRET_KEYS", default="")
MFA_SECRET_ACTIVE_KEY_ID = env("MFA_SECRET_ACTIVE_KEY_ID", default="")
MFA_PENDING_TIMEOUT = 10 * 60  # password OK -> second factor must follow within 10 minutes
MFA_MAX_FAILURES = 5
MFA_LOCK_SECONDS = 15 * 60
# Development only: staff log in without the second factor. Refused unless DEBUG (medilink.E003)
# and reported by `check --deploy` (medilink.E004). Never set in staging or production.
DEV_SKIP_STAFF_MFA = False
MFA_RECOVERY_CODE_COUNT = 10

# Login protection (security 03 §6): progressive delay after 5 failures, 15 min lock after 10.
AUTH_LOCKOUT = {
    "DELAY_AFTER": 5,
    "LOCK_AFTER": 10,
    "LOCK_SECONDS": 15 * 60,
    "MAX_DELAY_SECONDS": 60,
    "WINDOW_SECONDS": 15 * 60,
}


# --------------------------------------------------------------------------------------------
# Sessions: one server-side session per audience, selected by URL prefix (ADR 0006).
# --------------------------------------------------------------------------------------------
def session_audiences(cookie_prefix: str) -> dict[str, dict[str, Any]]:
    return {
        "staff": {
            "COOKIE_NAME": env("STAFF_SESSION_COOKIE_NAME", default=f"{cookie_prefix}ml_staff"),
            # S1-D13: locked (not ended) after LOCK_AFTER idle seconds; ended after IDLE_TIMEOUT.
            "LOCK_AFTER": env.int("STAFF_SESSION_LOCK_AFTER", default=15 * 60),
            "IDLE_TIMEOUT": env.int("STAFF_SESSION_IDLE_TIMEOUT", default=4 * 3600),
            "ABSOLUTE_TIMEOUT": env.int("STAFF_SESSION_ABSOLUTE_TIMEOUT", default=12 * 3600),
            "PATH_PREFIXES": ["/api/v1/staff/", "/api/v1/platform/", "/ws/v1/staff/"],
        },
        "patient": {
            "COOKIE_NAME": env("PATIENT_SESSION_COOKIE_NAME", default=f"{cookie_prefix}ml_patient"),
            "IDLE_TIMEOUT": env.int("PATIENT_SESSION_IDLE_TIMEOUT", default=12 * 3600),
            "ABSOLUTE_TIMEOUT": env.int("PATIENT_SESSION_ABSOLUTE_TIMEOUT", default=30 * 86400),
            # Mobile app sessions (header transport, upgrade 15): the app locks itself with a PIN,
            # so its session lasts until the absolute timeout. 0 turns the app transport off.
            "APP_IDLE_TIMEOUT": env.int("PATIENT_APP_SESSION_IDLE_TIMEOUT", default=30 * 86400),
            "PATH_PREFIXES": ["/api/v1/patient/", "/ws/v1/patient/"],
        },
        "admin": {
            "COOKIE_NAME": env("ADMIN_SESSION_COOKIE_NAME", default=f"{cookie_prefix}ml_admin"),
            "IDLE_TIMEOUT": 15 * 60,
            "ABSOLUTE_TIMEOUT": 12 * 3600,
            "PATH_PREFIXES": [f"/{ADMIN_URL}"],
        },
    }


ADMIN_ENABLED = env.bool("ADMIN_ENABLED", default=False)
ADMIN_URL = env("ADMIN_URL", default="ops-admin/")
SESSION_ENGINE = "medilink.accounts.session_store"
SESSION_AUDIENCES = session_audiences(cookie_prefix="__Host-")
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = "Lax"
SESSION_COOKIE_PATH = "/"
SESSION_COOKIE_DOMAIN = None  # host-only
SESSION_COOKIE_NAME = SESSION_AUDIENCES["admin"]["COOKIE_NAME"]  # unused fallback

# CSRF: the SPA fetches the token from GET /api/v1/csrf/ and sends X-CSRFToken (ADR 0006).
CSRF_COOKIE_NAME = env("CSRF_COOKIE_NAME", default="__Host-ml_csrf")
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_HTTPONLY = True
CSRF_COOKIE_SAMESITE = "Lax"
CSRF_USE_SESSIONS = False  # cookie-based, so the token works for every audience
CSRF_FAILURE_VIEW = "medilink.core.views.csrf_failure"


# --------------------------------------------------------------------------------------------
# Cross-origin: frontends are hosted separately (ADR 0006). Explicit allowlists, no wildcard.
# --------------------------------------------------------------------------------------------
def origin_settings(
    default_origins: list[str], *, require_https: bool = False
) -> tuple[list[str], list[str], list[str]]:
    cors = env.list("CORS_ALLOWED_ORIGINS", default=default_origins)
    csrf = env.list("CSRF_TRUSTED_ORIGINS", default=cors)
    ws = env.list("WS_ALLOWED_ORIGINS", default=cors)
    for origin in (*cors, *csrf, *ws):
        if "*" in origin or not origin.startswith(("http://", "https://")):
            raise ImproperlyConfigured(f"Invalid origin {origin!r}: explicit origins only.")
        if require_https and not origin.startswith("https://"):
            raise ImproperlyConfigured(f"Origin {origin!r} must use https in production.")
    return cors, csrf, ws


CORS_ALLOWED_ORIGINS, CSRF_TRUSTED_ORIGINS, WS_ALLOWED_ORIGINS = origin_settings([])
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOW_CREDENTIALS = True
CORS_URLS_REGEX = r"^/api/.*$"
CORS_ALLOW_HEADERS = (*default_headers, "accept-language", "x-request-id", "idempotency-key")
CORS_EXPOSE_HEADERS = ["X-Request-ID", "Retry-After"]
CORS_PREFLIGHT_MAX_AGE = 600

# Links in emails point at the frontends.
STAFF_APP_URL = env("STAFF_APP_URL", default="http://localhost:5173")
PATIENT_APP_URL = env("PATIENT_APP_URL", default="http://localhost:5174")

# --------------------------------------------------------------------------------------------
# Security headers (security 06 §2). Production adds HTTPS/HSTS in prod.py.
# --------------------------------------------------------------------------------------------
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_REFERRER_POLICY = "same-origin"
SECURE_CROSS_ORIGIN_OPENER_POLICY = "same-origin"
X_FRAME_OPTIONS = "DENY"
SECURE_CSP = {
    "default-src": [CSP.SELF],
    "script-src": [CSP.SELF, CSP.NONCE],
    "style-src": [CSP.SELF, CSP.NONCE],
    "img-src": [CSP.SELF, "data:"],
    "font-src": [CSP.SELF],
    "connect-src": [CSP.SELF],
    "frame-ancestors": [CSP.NONE],
    "base-uri": [CSP.SELF],
    "form-action": [CSP.SELF],
    "object-src": [CSP.NONE],
}
PERMISSIONS_POLICY = "camera=(), geolocation=(), microphone=(), payment=(), usb=()"

DATA_UPLOAD_MAX_MEMORY_SIZE = 2_621_440
FILE_UPLOAD_MAX_MEMORY_SIZE = 2_621_440
DATA_UPLOAD_MAX_NUMBER_FIELDS = 500

# Paths that never touch the database (no request transaction / RLS context needed).
TENANT_CONTEXT_EXEMPT_PATHS = ("/api/v1/health/", "/api/v1/csrf/", "/static/")

# --------------------------------------------------------------------------------------------
# Django REST framework + OpenAPI
# --------------------------------------------------------------------------------------------
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "medilink.accounts.authentication.StaffSessionAuthentication",
        "medilink.accounts.authentication.PatientSessionAuthentication",
    ],
    # Deny by default: every view must declare its own permission policy (security 04 §2).
    "DEFAULT_PERMISSION_CLASSES": ["medilink.authz.permissions.DenyAll"],
    "DEFAULT_RENDERER_CLASSES": ["rest_framework.renderers.JSONRenderer"],
    "DEFAULT_PARSER_CLASSES": ["rest_framework.parsers.JSONParser"],
    "DEFAULT_PAGINATION_CLASS": "medilink.core.pagination.DefaultPagination",
    "PAGE_SIZE": 25,
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "EXCEPTION_HANDLER": "medilink.core.exceptions.api_exception_handler",
    "DEFAULT_THROTTLE_CLASSES": ["medilink.core.throttling.BurstRateThrottle"],
    "DEFAULT_THROTTLE_RATES": {
        "burst": env("THROTTLE_RATE_BURST", default="600/min"),
        "auth": env("THROTTLE_RATE_AUTH", default="60/min"),
        "mfa": env("THROTTLE_RATE_MFA", default="30/min"),
        "register": env("THROTTLE_RATE_REGISTER", default="20/hour"),
        "password_reset": env("THROTTLE_RATE_PASSWORD_RESET", default="10/hour"),
        # ---- Sprint throttle scopes: ONLY between the sprint's markers ----
        # [S1]
        # [/S1]
        # [S3]
        # [/S3]
        # [S9]
        # [/S9]
        # [S2]
        # [/S2]
        # [S10]
        # [/S10]
    },
    # Number of trusted reverse proxies in front of the app (X-Forwarded-For handling).
    "NUM_PROXIES": env.int("NUM_PROXIES", default=0),
    "TEST_REQUEST_DEFAULT_FORMAT": "json",
    "DATETIME_FORMAT": "iso-8601",
}

SCHEMA_ENABLED = env.bool("SCHEMA_ENABLED", default=False)
SPECTACULAR_SETTINGS = {
    "TITLE": "MediLink Rwanda API",
    "DESCRIPTION": (
        "REST API for MediLink Rwanda. Audiences: /api/v1/staff (staff session cookie), "
        "/api/v1/patient (patient session cookie), /api/v1/auth (audience-neutral). "
        "Errors use the envelope {error: {code, message, fields, request_id}}."
    ),
    "VERSION": API_VERSION,
    "SERVE_INCLUDE_SCHEMA": False,
    "SCHEMA_PATH_PREFIX": r"/api/v1",
    "COMPONENT_SPLIT_REQUEST": True,
    "SERVE_PERMISSIONS": ["medilink.authz.permissions.PublicEndpoint"],
    "SERVE_AUTHENTICATION": [],
    "ENUM_NAME_OVERRIDES": {
        "UserKindEnum": "medilink.platform_admin.serializers.USER_KINDS",
        "LanguageEnum": "medilink.accounts.models.Language",
        "LoginStatusEnum": "medilink.accounts.serializers.LOGIN_STATUS_CHOICES",
        "RoleCodeEnum": "medilink.tenancy.models.RoleCode",
        "TriageUrgencyEnum": "medilink.visits.models.TRIAGE_URGENCIES",
        "LabResultKindEnum": "medilink.clinical.serializers_lab.RESULT_KINDS",
        "PatientSexEnum": "medilink.patients.models.Sex",
        # [S1]
        "ApplicationStatusEnum": "medilink.onboarding.models.ApplicationStatus",
        "FacilityStatusEnum": "medilink.tenancy.models.FacilityStatus",
        "UploadStatusEnum": "medilink.uploads.models.ScanStatus",
        "ImportStatusEnum": "medilink.masterdata.models.ImportStatus",
        "DocumentKindEnum": "medilink.onboarding.models.DocumentKind",
        "ApplicationEventKindEnum": "medilink.onboarding.models.EventKind",
        "LicenceKindEnum": "medilink.onboarding.models.LicenceKind",
        "LicenceStateEnum": "medilink.onboarding.serializers.LICENCE_STATES",
        # [/S1]
        # [S3]
        "IdentifierKindEnum": "medilink.patients.models.IdentifierKind",
        "HealthItemKindEnum": "medilink.patients.serializers.HEALTH_KINDS",
        "StaffConsentKindEnum": "medilink.patients.serializers.STAFF_CONSENT_KINDS",
        "PatientRelationshipEnum": "medilink.patients.models.Relationship",
        "DependentRelationshipEnum": "medilink.patients.views_patient.DEPENDENT_RELATIONSHIPS",
        "PrincipalRelationshipEnum": "medilink.patients.models.PrincipalRelationship",
        "ReasonCodeEnum": "medilink.patients.serializers.REVEAL_REASON_CODES",
        "AccessReasonCodeEnum": "medilink.patients.serializers.ACCESS_REASON_CODES",
        # [/S3]
        # [S9]
        "NotificationPriorityEnum": "medilink.notifications.models.Priority",
        "AnnouncementPriorityEnum": "medilink.notifications.serializers.ANNOUNCEMENT_PRIORITIES",
        "AnnouncementAudienceEnum": "medilink.notifications.models.AnnouncementAudience",
        "AnnouncementStatusEnum": "medilink.notifications.models.AnnouncementStatus",
        "DeliveryAttemptStatusEnum": "medilink.notifications.models.AttemptStatus",
        "TemplateVariantEnum": "medilink.notifications.models.Variant",
        "TemplateSourceEnum": "medilink.notifications.models.TemplateSource",
        # [/S9]
        # [S2]
        "CalendarEventKindEnum": "medilink.facilities.models.CalendarEventKind",
        "ServicePointKindEnum": "medilink.facilities.models.ServicePointKind",
        "ScheduleExceptionKindEnum": "medilink.scheduling.models.ExceptionKind",
        "TariffKindEnum": "medilink.billing.models.TariffKind",
        "CouncilEnum": "medilink.accounts.models.Council",
        "ServiceSexRestrictionEnum": "medilink.facilities.models.SexRestriction",
        # [/S2]
        # [S10]
        "HelpAudienceEnum": "medilink.support.models.Audience",
        "HelpArticleCategoryEnum": "medilink.support.models.ArticleCategory",
        "HelpArticleStatusEnum": "medilink.support.models.ArticleStatus",
        "SupportTopicEnum": "medilink.support.models.Topic",
        "SupportRequestStatusEnum": "medilink.support.models.RequestStatus",
        "SupportPriorityEnum": "medilink.support.models.RequestPriority",
        "SupportCloseReasonEnum": "medilink.support.models.CloseReason",
        "SupportStaffCloseReasonEnum": "medilink.support.serializers.SUPPORT_CLOSE_REASONS",
        "SupportAuthorKindEnum": "medilink.support.models.AuthorKind",
        "DisputeOutcomeEnum": "medilink.disputes.models.Outcome",
        "DisputeStatusEnum": "medilink.disputes.models.DisputeStatus",
        "DisputeTypeEnum": "medilink.disputes.models.DisputeType",
        "DisputeSubjectTypeEnum": "medilink.disputes.models.SubjectType",
        "DisputeChannelEnum": "medilink.disputes.models.Channel",
        "DisputeActionStatusEnum": "medilink.disputes.models.ActionStatus",
        "DisputeAuthorRoleEnum": "medilink.disputes.models.AuthorRole",
        "DisputeVisibilityEnum": "medilink.disputes.models.Visibility",
        "DisputeHandlerLevelEnum": "medilink.disputes.models.HandlerLevel",
        # [/S10]
        # [S4]
        "TicketStateEnum": "medilink.visits.models.TicketState",
        "StageEnum": "medilink.visits.models.Stage",
        "DutyStateEnum": "medilink.visits.models.DutyState",
        "VisitSourceEnum": "medilink.visits.models.VisitSource",
        "VisitStatusEnum": "medilink.visits.models.VisitStatus",
        "PriorityClassEnum": "medilink.visits.models.PriorityClass",
        # [/S4]
        # [S5]
        "BookingStatusEnum": "medilink.scheduling.models.BookingStatus",
        "BookingSourceEnum": "medilink.scheduling.models.BookingSource",
        "LevelOfCareEnum": "medilink.masterdata.models.LevelOfCare",
        "QueueLoadEnum": [("low", "low"), ("medium", "medium"), ("high", "high")],
        "DisruptionKindEnum": "medilink.scheduling.models.DisruptionKind",
        "DisruptionActionEnum": "medilink.scheduling.models.DisruptionAction",
        "DisruptionStatusEnum": "medilink.scheduling.models.DisruptionStatus",
        "PatientResponseEnum": "medilink.scheduling.models.PatientResponse",
        "FollowUpModeEnum": "medilink.scheduling.models.FollowUpMode",
        "FollowUpStatusEnum": "medilink.scheduling.models.FollowUpStatus",
        # W7 (upgrade 13): the care schedule
        "CareScheduleKindEnum": "medilink.scheduling.models.CareScheduleKind",
        "CareScheduleStatusEnum": "medilink.scheduling.models.CareScheduleStatus",
        "ComingUpTypeEnum": [
            ("vaccination", "vaccination"),
            ("antenatal", "antenatal"),
            ("follow_up", "follow_up"),
        ],
        # S5b adds `mode` and `action` fields: pin the S1 enums to their existing names
        "ModeEnum": "medilink.masterdata.models.ImportMode",
        "ActionEnum": "medilink.masterdata.models.ChangeAction",
        # [/S5]
        # [S6]
        "ConsultationStatusEnum": "medilink.clinical.models.ConsultationStatus",
        "DiagnosisRankEnum": "medilink.clinical.models.DiagnosisRank",
        "CertaintyEnum": "medilink.clinical.models.Certainty",
        # AccessReasonCodeEnum and ReasonCodeEnum: named in the [S3] block (same codes)
        # S6b
        "BreakGlassReasonEnum": "medilink.clinical.models.BreakGlassReason",
        "HistoryEntryKindEnum": "medilink.clinical.models.HistoryKind",
        "HealthAttributeKindEnum": "medilink.clinical.models.AttributeKind",
        "ClinicalDocumentTypeEnum": "medilink.clinical.models.DocumentType",
        "ResultStatusEnum": "medilink.clinical.models.ResultStatus",
        "BreakGlassReviewOutcomeEnum": "medilink.clinical.models.ReviewOutcome",
        "PatientImportStatusEnum": "medilink.clinical.models.ImportStatus",
        "PatientImportRowStatusEnum": "medilink.clinical.models.ImportRowStatus",
        # [/S6]
        # [S7]
        "PrescriptionStatusEnum": "medilink.pharmacy.models.PrescriptionStatus",
        "PrescriptionItemStatusEnum": "medilink.pharmacy.models.ItemStatus",
        "FrequencyCodeEnum": "medilink.pharmacy.models.Frequency",
        "RouteEnum": "medilink.pharmacy.models.Route",
        "ClinicalDocumentKindEnum": "medilink.documents.models.DocumentKind",
        "ReferralUrgencyEnum": "medilink.documents.models.Urgency",
        # keeps the public triage name stable now that referrals also have an urgency
        "UrgencyEnum": "medilink.triage.rules.URGENCY_ORDER",
        "VerificationStatusEnum": "medilink.documents.models.VerificationStatus",
        "IdentityCheckMethodEnum": "medilink.pharmacy.models.IdentityMethod",
        "DispenseOutcomeEnum": "medilink.pharmacy.models.DispenseOutcome",
        # query statuses (open, answered, closed) share SupportRequestStatusEnum ([S10])
        # S6 alert enums, named explicitly now that S7 reuses them in prescription alerts
        "AlertKindEnum": [("allergy", "allergy"), ("duplicate", "duplicate"), ("dose", "dose")],
        "AlertSeverityEnum": [("high", "high"), ("medium", "medium")],
        # [/S7]
        # [S8]
        "BillStatusEnum": "medilink.billing.models.BillStatus",
        "PaymentMethodEnum": "medilink.billing.models.PaymentMethod",
        "PaymentStatusEnum": "medilink.billing.models.PaymentStatus",
        "ReceiptStatusEnum": "medilink.billing.models.ReceiptStatus",
        "ShiftStatusEnum": "medilink.billing.models.ShiftStatus",
        "ApprovalKindEnum": "medilink.billing.models.ApprovalKind",
        "ExemptionReasonEnum": "medilink.billing.models.ExemptionReason",
        "VerificationResultEnum": "medilink.billing.models.VerificationResult",
        "ApprovalStatusEnum": "medilink.billing.models.ApprovalStatus",
        # S8 adds `method` fields: pin the S1 step-up enum to its existing name
        "MethodEnum": [("password_totp", "password_totp")],
        "BillInsuranceStatusEnum": [
            ("none", "none"),
            ("unverified", "unverified"),
            ("verified", "verified"),
            ("rejected", "rejected"),
        ],
        # [/S8]
    },
}

# --------------------------------------------------------------------------------------------
# Internationalisation: messages are localised, codes stable. Timestamps are UTC with Z.
# --------------------------------------------------------------------------------------------
LANGUAGE_CODE = "en"
LANGUAGES = [("rw", "Kinyarwanda"), ("en", "English"), ("fr", "Français")]
LOCALE_PATHS = [BASE_DIR / "locale"]
USE_I18N = True
USE_TZ = True
# Africa/Kigali everywhere (analysis 05 §2): local dates and times are Kigali; storage stays UTC
TIME_ZONE = "Africa/Kigali"

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"


# --------------------------------------------------------------------------------------------
# Email
# --------------------------------------------------------------------------------------------
def mailers_config(email_url: str) -> dict[str, dict[str, Any]]:
    """Django 6.1 MAILERS from one URL: smtp://, smtp+tls://, smtp+ssl://, console://, locmem://."""
    url = urlsplit(email_url)
    if url.scheme in {"console", "locmem"}:
        return {"default": {"BACKEND": f"django.core.mail.backends.{url.scheme}.EmailBackend"}}
    if url.scheme not in {"smtp", "smtp+tls", "smtp+ssl"}:
        raise ImproperlyConfigured(f"Unsupported EMAIL_URL scheme {url.scheme!r}.")
    return {
        "default": {
            # Django's SMTP backend + the MediLink HTML layout on plain-only messages
            "BACKEND": "medilink.core.mail.BrandedSMTPBackend",
            "OPTIONS": {
                "host": url.hostname or "localhost",
                "port": url.port or (465 if url.scheme == "smtp+ssl" else 25),
                "username": unquote(url.username or ""),
                "password": unquote(url.password or ""),
                "use_tls": url.scheme == "smtp+tls",
                "use_ssl": url.scheme == "smtp+ssl",
                "timeout": 10,
            },
        }
    }


def brevo_config(api_key: str) -> dict[str, dict[str, Any]]:
    """Mail over Brevo's HTTPS API (medilink.core.mail.BrandedBrevoBackend)."""
    return {
        "default": {
            "BACKEND": "medilink.core.mail.BrandedBrevoBackend",
            "OPTIONS": {"api_key": api_key, "timeout": 10},
        }
    }


# Production (decision 2026-11-19): Brevo over HTTPS, because Railway blocks outgoing SMTP below
# its Pro plan. Set BREVO_API_KEY and a sender verified in Brevo (Senders, domains & IPs):
#   BREVO_API_KEY=xkeysib-...
#   DEFAULT_FROM_EMAIL=MediLink Rwanda <you@gmail.com>
# Without BREVO_API_KEY, EMAIL_URL picks an SMTP server (Mailpit in development, or Gmail where
# SMTP is allowed: smtp+tls://you%40gmail.com:<app password>@smtp.gmail.com:587).
BREVO_API_KEY = env("BREVO_API_KEY", default="").strip()
MAILERS = (
    brevo_config(BREVO_API_KEY)
    if BREVO_API_KEY
    else mailers_config(env("EMAIL_URL", default="smtp://127.0.0.1:1025").strip())
)
DEFAULT_FROM_EMAIL = env(
    "DEFAULT_FROM_EMAIL", default="MediLink Rwanda <no-reply@medilink.test>"
).strip()

# Daily audit anchor (medilink.audit.anchor): log | email | file
AUDIT_ANCHOR_SINK = env("AUDIT_ANCHOR_SINK", default="log")
AUDIT_ANCHOR_EMAIL = env("AUDIT_ANCHOR_EMAIL", default="")
AUDIT_ANCHOR_FILE = env("AUDIT_ANCHOR_FILE", default="")

# --------------------------------------------------------------------------------------------
# Logging: structured, request ID on every line, personal data scrubbed (security 08 §1).
# --------------------------------------------------------------------------------------------
LOG_LEVEL = env("LOG_LEVEL", default="INFO")
LOG_FORMAT = env("LOG_FORMAT", default="json")
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "filters": {
        "request_id": {"()": "medilink.core.logging.RequestIDFilter"},
        "redact": {"()": "medilink.core.logging.RedactPersonalDataFilter"},
    },
    "formatters": {
        "json": {"()": "medilink.core.logging.JSONFormatter"},
        "text": {"()": "medilink.core.logging.TextFormatter"},
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "filters": ["request_id", "redact"],
            "formatter": LOG_FORMAT,
        }
    },
    "root": {"handlers": ["console"], "level": LOG_LEVEL},
    "loggers": {
        "django.db.backends": {"level": "WARNING"},
        "celery": {"level": "INFO"},
    },
}

# --------------------------------------------------------------------------------------------
# AI symptom assistant (issue #159). Off unless switched on and given a key. Test phase only:
# NVIDIA's hosted API sends text abroad; production points NVIDIA_API_BASE at a NIM in Rwanda.
# --------------------------------------------------------------------------------------------
ASSISTANT_ENABLED = env.bool("ASSISTANT_ENABLED", default=False)
NVIDIA_API_KEY = env("NVIDIA_API_KEY", default="")
NVIDIA_API_BASE = env("NVIDIA_API_BASE", default="https://integrate.api.nvidia.com/v1")
# meta/llama-3.1-70b-instruct was retired on 2026-08-26; this one answers in about 2 s
NVIDIA_MODEL = env("NVIDIA_MODEL", default="nvidia/nemotron-3.5-lightning-30b-a3b")
NVIDIA_DISABLE_THINKING = env.bool("NVIDIA_DISABLE_THINKING", default=True)
NVIDIA_TIMEOUT_SECONDS = env.int("NVIDIA_TIMEOUT_SECONDS", default=30)
