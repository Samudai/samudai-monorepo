# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

Polyglot monorepo with four top-level areas:

- `backend/` — all backend code, consolidated into a few deployables:
  - `backend/core/` — the **Go modular monolith** (one Go module `github.com/Samudai/backend`, one binary, one Gin engine). Absorbs every former Go microservice (dao, member, discord, project, point, plugin, dashboard, discovery, discussion, forms, job, analytics) **and** the old `gateway-external`.
  - `backend/service-node/` — the **merged Node/Express service** (former `service-activity`, `service-twitter`, `service-web3`, `service-x` mounted under per-service prefixes).
  - `backend/gateway-consumer-node/` — the Node/TS client API gateway (Express + socket.io).
- `frontend/` — React 18 + CRA app (react-app-rewired + Craco). Flattened from the old `dashboard/dashboard-samudai/`.
- `bots/` — Node/TypeScript bots (`samudai-bot` for Discord, `telegram-bot`).
- `deploy/local/postgres-init/` — first-boot script that creates the per-module `*_local` Postgres databases for the compose stack.
- `deploy/caddy/Caddyfile` — reverse proxy + automatic-HTTPS config used by the production compose overlay.
- `migrations/postgres/<module>/` — committed golang-migrate migrations (the runtime source of truth), applied automatically by the `migrate` compose service.
- `docker-compose.yml` (root) — the single containerization story. Brings up the whole stack locally; `docker-compose.prod.yml` overlays it for a single-VM production deploy. `.env.example` / `.env.prod.example` document the variables.
- `docs/db-migration/` — interactive Go migration-authoring tool + Makefile + DBML/sqlc dumps (note: `docs` is git-ignored; the committed runtime copy of the SQL lives in `migrations/`).

## Backend Go monolith (`backend/core`)

One module, one binary. Layout:

```
cmd/server/main.go                 # entrypoint -> internal/app.Run()
internal/app/app.go                # init DBs, build one gin.Engine, mount every module, RMQ, shutdown
shared/sqldb/sqldb.go              # per-module Postgres connections (DATABASE_URL_<MODULE>)
services/<name>/router.go          # package <name>svc, func Register(rg *gin.RouterGroup)
services/<name>/controllers/*.go   # HTTP handlers (package controllers)
services/<name>/internal/<name>/   # repository / business logic (SQL or Mongo)
services/<name>/pkg/<name>/        # exported types
services/{discord,point}/rabbitmq.go   # RabbitMQ consumers -> func StartRMQ()
services/external/                 # former gateway-external (third-party integrations)
```

Key facts:
- **Each module mounts under a per-service prefix** (`/dao`, `/member`, `/discord`, …, `external` under `/external`, plugin at `/` since its routes are already `/plugins/*`). Callers reach a module via `SERVICE_<X>=http://backend:8080/<prefix>` — the gateway/inter-service code is unchanged; only env values carry the prefix. This also resolves the original `/member`, `/role` route collisions between dao/member/discord.
- **Per-module SQL connections**: each former SQL service owned its own Postgres database, so `shared/sqldb` opens one `*sql.DB` per module from `DATABASE_URL_DAO`, `DATABASE_URL_MEMBER`, … (`sqldb.Dao()`, `sqldb.Member()`, …) instead of the single global `db.GetSQL()` from samudai-pkg. The 8 databases (dao, dashboard, discovery, discussion, job, member, project, point) are preserved.
- **Mongo & Redis are shared singletons** (`db.InitMongo()` / `db.InitRedis()` from samudai-pkg). Mongo modules pick their own database by name in code (`GetMongo().Database(discord.DatabaseDiscord)`).
- **RabbitMQ**: discord, point, and external each expose `StartRMQ()` (each blocks on `select{}`), launched as goroutines in `app.Run`.
- Depends on `github.com/Samudai/samudai-pkg` for `db`, `logger`, APM. Go `1.26`; Dockerfile pins `golang:1.26-alpine` and builds with `backend/core` as its own context (no sibling COPY).
- Verify with `cd backend/core && go build ./... && go vet ./...`. `internal/app` has a test that builds the engine and asserts no duplicate-route panic.

## Merged Node service (`backend/service-node`)

One Express app hosting four former services under prefixes: `/activity-svc`, `/twitter-svc`, `/web3-svc`, `/x-svc` (reached via `SERVICE_ACTIVITY`, `SERVICE_TWITTER`, `SERVICE_WEB3` etc.). `src/app.ts` mounts each former service's router; `src/db/connections.ts` opens one Mongo socket pool and exposes per-service connections via `useDb('activity'|'twitter'|'web3')`; service-x keeps the native `mongodb` driver and its RabbitMQ publisher. Build with `npm install && npm run build` (`tsc`).

## Gateways

- `backend/gateway-consumer-node` (Node/TS, Express + socket.io) — main client API gateway; calls the monolith and `service-node` via `SERVICE_*` env URLs.
- The old `gateway-external` (Go) is now the `external` module inside `backend/core`, mounted at `/external`. Internal callers reach it via `GATEWAY_EXTERNAL=http://backend:8080/external`; third-party inbound webhooks reach it publicly through Caddy at `ge.samudai.xyz`, which rewrites `/<path>` → `/external/<path>` (preserving the original webhook URLs).

## Frontend (`frontend/`)

React app launched via `react-app-rewired` with `config-overrides.js` + Craco. Reaches the backend through `REACT_APP_GATEWAY` (gateway base URL, baked at build time).

```bash
cd frontend
npm install
npm start                    # dev
npm run build:development    # uses .development.env
npm run build:staging        # uses .staging.env
npm run build:prod           # uses .production.env (used by Docker image)
```

`build:*` targets require the matching `.{env}.env` file; Docker builds pass `--build-arg NODE_ENV=<env>`.

## Common commands

### Run the whole stack locally (docker-compose)

```bash
cp .env.example .env
docker compose up -d --build                          # build + run everything
```

Postgres auto-creates the 8 `*_local` DBs on first boot (`deploy/local/postgres-init`), then the one-shot `migrate` service applies the schema (`migrations/postgres/<module>`) before `backend` starts — no manual migration step.

Gateway → `localhost:4000`, frontend → `localhost:3000`, backend → `localhost:8081`, service-node → `localhost:8082`, RabbitMQ UI → `localhost:15672`. Smoke: `curl localhost:8081/health`, `curl localhost:8081/dao/...`.

### Run the Go backend locally (without Docker)

```bash
cd backend/core
go run ./cmd/server           # needs DATABASE_URL_* / MONGO_URL / REDIS_URL / MQ_* / PORT in env
go build ./... && go vet ./... && go test ./internal/app/
```

### Build & run a Node service/bot

```bash
cd backend/service-node        # or backend/gateway-consumer-node, bots/samudai-bot, bots/telegram-bot
npm install
npm run start:dev              # ts-node-dev src/index.ts   (gateway/bots use `npm run dev`)
npm run build && npm start     # tsc -> node dist/index.js
```

### Database migrations (unified on golang-migrate)

Runtime migrations live in `migrations/postgres/<module>/NNNNNN_*.{up,down}.sql` and are applied automatically by the one-shot `migrate` compose service (official `migrate/migrate` image) before `backend` starts. golang-migrate tracks `schema_migrations` per database, so re-runs are idempotent. To add a migration, drop the next sequential pair into the module's directory.

Migration ownership:

| Datastore | Owner | Managed by |
| --- | --- | --- |
| 8 Postgres DBs (`dao dashboard discovery discussion job member project point`) | Go backend `backend/core` | **golang-migrate** (`migrations/postgres/`) |
| Mongo: `discord`, `pointdiscord`, `plugin` | Go backend | golang-migrate-eligible; `migrations/mongo/` reserved, authoring is a follow-up |
| Mongo: `twitter`, `activity`, `web3`, `x` | Node `service-node` | **Mongoose** `autoIndex` (in code, not migrated) |

Node apps hold no SQL connections — Postgres is owned entirely by the Go backend. The interactive authoring tool / Makefile / DBML / sqlc dumps remain under git-ignored `docs/db-migration` (defaults `POSTGRES_USER=piyushhbhutoria`, suffix `_local` match compose); the committed `migrations/` copy is what actually runs.

### Production deploy (single VM)

docker-compose is the only containerization story; production is the same stack with an overlay that uses the prebuilt `ghcr.io/samudai/*` images, adds restart policies, hides the data-store ports, and fronts the apps with Caddy (automatic HTTPS).

```bash
cp .env.prod.example .env   # real secrets
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --pull always
```

Routing/TLS for `app.samudai.xyz` (frontend), `gcn.samudai.xyz` (gateway), and `ge.samudai.xyz` (backend's `/external` module — third-party webhooks) is in `deploy/caddy/Caddyfile`; point DNS at the VM.

## CI / Docker builds

- `.github/workflows/backend.yaml` and `service-node.yaml` build/push `ghcr.io/samudai/backend` and `ghcr.io/samudai/service-node` on changes under `backend/core/**` and `backend/service-node/**`. `gateway-consumer.yaml`, `dashboard-samudai.yaml`, and the bot workflows cover the rest.
- `.github/workflows/docker-build-check.yaml` runs on every PR: it diffs changed files, walks to the nearest `Dockerfile`, and matrix-builds each affected image — **every image now builds with its own directory as context** (the old `service-plugin` / `gateway-external` root-context special case is gone).
- When adding a new backend capability, prefer a new module under `backend/core/services/<name>/` mounted in `internal/app/app.go` rather than a new microservice.

## Conventions worth knowing

- Go: `gofmt` / idiomatic Go. Controllers are thin HTTP adapters — business logic belongs in `internal/<name>/`. Top-level service packages are named `<name>svc` to avoid colliding with their own `internal/<name>` / `pkg/<name>` packages.
- TS: 2-space indent, semicolons, double quotes, trailing commas.
- Don't introduce a new cross-service shared utility in one module — add it to `samudai-pkg` (external module) instead.
- `docs/` is git-ignored; treat `docs/db-migration` as a workspace tool, not committed product artifacts.
