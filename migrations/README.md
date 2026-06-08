# Database migrations

Single source of truth for **runtime** database migrations, applied
automatically by the `migrate` service in `docker-compose.yml` (the official
[`golang-migrate`](https://github.com/golang-migrate/migrate) image) before
`service-go` starts.

```
migrations/
  postgres/<module>/NNNNNN_<name>.up.sql    # applied on `migrate ... up`
  postgres/<module>/NNNNNN_<name>.down.sql  # rollback
  mongo/                                    # reserved (see below)
```

## Postgres (all 8 modules — owned by the Go backend `backend/service-go`)

`dao dashboard discovery discussion job member project point`

Each module is its own database (`<module>_local` in compose) with its own
`schema_migrations` version table. golang-migrate is idempotent: re-running
`up` is a no-op once a version is applied.

### Adding a migration

Create the next sequential pair under `migrations/postgres/<module>/`, e.g.
`000002_add_foo.up.sql` / `000002_add_foo.down.sql`. The `migrate` service picks
them up on the next `docker compose up`. Locally you can also run a single
module against the compose Postgres:

```bash
docker run --rm -v "$PWD/migrations/postgres:/m" --network host migrate/migrate \
  -path /m/dao -database "postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@localhost:5432/dao_local?sslmode=disable" up
```

## Mongo (not migrated — indexes ensured in code)

`migrations/mongo/` is unused/reserved. Mongo is schemaless — collections
auto-create on first insert and need no `CREATE`-style migration — so the Go
backend does **not** use golang-migrate for Mongo. Instead each Mongo-owning
service ensures its secondary indexes idempotently at startup via
`<name>svc.EnsureIndexes(ctx)` (e.g. `backend/service-go/services/discord/indexes.go`),
called from `internal/app/app.go`, mirroring the Node services' Mongoose
`autoIndex`. The point activity DBs (`point*-activity`, `point-guild-metrics`,
`point-memberID`) and plugin per-product DBs use dynamic, runtime-named
collections, so they are intentionally left unindexed there.

Mongo databases owned by the **Node** service (`twitter`, `activity`, `web3`,
`x`) are likewise managed in code via Mongoose (`autoIndex`).

> The interactive authoring tool / DBML / sqlc dumps live in `docs/db-migration`
> (git-ignored workspace tooling). The files here are the committed runtime copy.
