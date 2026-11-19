#!/bin/sh
# Start command of the `api` service on Railway (railway.json).
#
# Emails, push, reminders, the listing refresh and every other background job run in Celery. While
# the project has no separate `worker` and `beat` services (docs/operations/railway.md §1), the
# worker runs here with beat inside it, so those jobs still run. The API has one replica, so there
# is one beat. Set EMBEDDED_WORKER=0 on `api` once the `worker` and `beat` services exist.
set -e

if [ "${EMBEDDED_WORKER:-1}" != "0" ]; then
  (
    while true; do
      celery -A config worker --beat -l info --concurrency 2 \
        --schedule /tmp/celerybeat-schedule || true
      echo "railway_start: celery stopped, restarting in 5 s" >&2
      sleep 5
    done
  ) &
fi

exec uvicorn config.asgi:application --host 0.0.0.0 --port "${PORT:-8000}" \
  --proxy-headers --no-server-header --workers 2
