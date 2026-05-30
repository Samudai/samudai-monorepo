# Database migrations

Single source of truth for **runtime** database migrations, applied
automatically by the `migrate` service in `docker-compose.yml` (the official
[`golang-migrate`](https://github.com/golang-migrate/migrate) image) before the
`backend` starts.

```
migrations/
  postgres/<module>/NNNNNN_<name>.up.sql    # applied on `migrate ... up`
  postgres/<module>/NNNNNN_<name>.down.sql  # rollback
  mongo/                                    # reserved (see below)
```

## Postgres (all 8 modules — owned by the Go backend `backend/core`)

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

## Mongo (reserved)

`migrations/mongo/` is reserved for the Mongo databases the **Go backend** owns
(`discord`, `pointdiscord`, `plugin`) — these are eligible for golang-migrate's
mongodb driver. Authoring those migrations is a follow-up; the directory exists
so the runner can be extended without restructuring.

Mongo databases owned by the **Node** service (`twitter`, `activity`, `web3`,
`x`) are **not** migrated here — they are managed in code via Mongoose
(`autoIndex`).

> The interactive authoring tool / DBML / sqlc dumps live in `docs/db-migration`
> (git-ignored workspace tooling). The files here are the committed runtime copy.
