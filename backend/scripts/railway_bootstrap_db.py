"""Idempotent first-deploy bootstrap of the MediLink database roles on Railway Postgres.

Mirrors docker/postgres/init/01-roles.sh. Connects with BOOTSTRAP_DATABASE_URL (the Postgres
service's admin URL), creates medilink_owner / medilink_app with the passwords taken from
DATABASE_OWNER_URL / DATABASE_URL, and the medilink database. Safe to run on every deploy.
Skips silently when BOOTSTRAP_DATABASE_URL is unset.
"""

import os
import sys
from urllib.parse import unquote, urlparse

import psycopg
from psycopg import sql


def _creds(url: str) -> tuple[str, str, str]:
    u = urlparse(url)
    return unquote(u.username or ""), unquote(u.password or ""), u.path.lstrip("/")


def main() -> int:
    admin_url = os.environ.get("BOOTSTRAP_DATABASE_URL")
    if not admin_url:
        return 0
    owner, owner_pw, db = _creds(os.environ["DATABASE_OWNER_URL"])
    app, app_pw, _ = _creds(os.environ["DATABASE_URL"])

    with psycopg.connect(admin_url, autocommit=True) as conn:
        for role, pw, extra in (
            (owner, owner_pw, "CREATEDB"),
            (app, app_pw, "NOCREATEDB"),
        ):
            exists = conn.execute("SELECT 1 FROM pg_roles WHERE rolname = %s", (role,)).fetchone()
            verb = "ALTER" if exists else "CREATE"
            conn.execute(
                sql.SQL(
                    "{} ROLE {} LOGIN NOSUPERUSER NOBYPASSRLS NOCREATEROLE {} PASSWORD {}"
                ).format(
                    sql.SQL(verb), sql.Identifier(role), sql.SQL(extra), sql.Literal(pw)
                )
            )
        conn.execute(sql.SQL("GRANT {} TO {}").format(sql.Identifier(app), sql.Identifier(owner)))
        if not conn.execute("SELECT 1 FROM pg_database WHERE datname = %s", (db,)).fetchone():
            conn.execute(
                sql.SQL("CREATE DATABASE {} OWNER {}").format(
                    sql.Identifier(db), sql.Identifier(owner)
                )
            )

    db_url = urlparse(admin_url)._replace(path="/" + db).geturl()
    with psycopg.connect(db_url, autocommit=True) as conn:
        o, a = sql.Identifier(owner), sql.Identifier(app)
        for stmt in (
            "REVOKE CREATE ON SCHEMA public FROM PUBLIC",
            "ALTER SCHEMA public OWNER TO {o}",
            "GRANT USAGE ON SCHEMA public TO {a}",
            "ALTER DEFAULT PRIVILEGES FOR ROLE {o} IN SCHEMA public "
            "GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO {a}",
            "ALTER DEFAULT PRIVILEGES FOR ROLE {o} IN SCHEMA public "
            "GRANT USAGE, SELECT ON SEQUENCES TO {a}",
        ):
            conn.execute(sql.SQL(stmt).format(o=o, a=a))
    sys.stdout.write("MediLink database roles ready.\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
