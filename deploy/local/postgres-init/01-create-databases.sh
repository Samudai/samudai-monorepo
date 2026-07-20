#!/bin/sh
# Runs once on first Postgres boot (mounted into /docker-entrypoint-initdb.d/).
# Creates the per-module databases the Go backend expects, matching the names
# used by docs/db-migration (<module>_local). Schema migrations are applied
# separately: `cd docs/db-migration && make migrateupall`.
set -e

MODULES="dao dashboard discovery discussion job member project point"

for module in $MODULES; do
  db="${module}_local"
  echo "creating database ${db}"
  createdb --username "$POSTGRES_USER" --owner "$POSTGRES_USER" "$db" || \
    echo "database ${db} already exists, skipping"
done
