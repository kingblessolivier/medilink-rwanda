# syntax=docker/dockerfile:1.7
# MediLink API image: multi-stage, slim, non-root, hash-checked dependencies.
#   docker build -t medilink-api backend/
# Runs the ASGI app (HTTP + WebSockets) with uvicorn. Configuration comes only from the environment
# (see .env.example); migrations run as a separate job with DATABASE_OWNER_URL:
#   docker run --rm --env-file prod.env medilink-api python manage.py migrate
# The base image is pinned by digest (multi-arch index), so a rebuild can't pick up a different
# image under the same tag. Dependabot (docker ecosystem) proposes digest updates.
ARG PYTHON_IMAGE=python:3.14-slim@sha256:cd89c30eda26ee911a4611b18680086e0ea42e6f5f8cbe653d07fa7958c9cec8

FROM ${PYTHON_IMAGE} AS builder
ENV PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PYTHONDONTWRITEBYTECODE=1
WORKDIR /build
COPY requirements/prod.txt requirements/prod.txt
RUN python -m venv /opt/venv \
 && /opt/venv/bin/pip install --require-hashes --no-deps -r requirements/prod.txt \
 && /opt/venv/bin/pip check

FROM ${PYTHON_IMAGE} AS runtime
ENV PATH="/opt/venv/bin:${PATH}" \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DJANGO_SETTINGS_MODULE=config.settings.prod \
    DJANGO_READ_DOT_ENV=false
RUN groupadd --system --gid 10001 medilink \
 && useradd --system --uid 10001 --gid medilink --home-dir /app --no-create-home \
      --shell /usr/sbin/nologin medilink
WORKDIR /app
COPY --from=builder /opt/venv /opt/venv
# Application code is owned by root and read-only for the runtime user.
COPY manage.py ./
COPY config ./config
COPY medilink ./medilink
COPY scripts/railway_bootstrap_db.py ./scripts/railway_bootstrap_db.py
USER 10001:10001
EXPOSE 8000
# Set FORWARDED_ALLOW_IPS to the reverse proxy address so X-Forwarded-* headers are trusted.
CMD ["uvicorn", "config.asgi:application", "--host", "0.0.0.0", "--port", "8000", \
     "--proxy-headers", "--no-server-header", "--workers", "2"]
