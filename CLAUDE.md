# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

Polyglot monorepo with four top-level areas:

- `backend/` — all backend code, consolidated into a few deployables:
  - `backend/service-go/` — the **Go modular monolith** (one Go module `github.com/Samudai/backend`, one binary, one Gin engine). Absorbs every former Go microservice (dao, member, discord, project, point, plugin, dashboard, discovery, discussion, forms, job).
  - `backend/gateway-external/` — the **standalone external-integrations gateway** (Go, its own module `github.com/Samudai/gateway-external`, own binary/container). Third-party inbound webhooks (GitHub App, Snapshot, Telegram) + the Discord bot's server-side calls. Holds no datastore; every op is an HTTP call to `service-go`. Reuses `service-go`'s exported `pkg/*` types via a `replace github.com/Samudai/backend => ../service-go` directive, so its image builds with `backend/` as the context (the sibling `service-go` module must be present; `backend/.dockerignore` trims the rest).
  - `backend/service-node/` — the **merged Node service** (former `service-activity`, `service-twitter`, `service-web3`, `service-x` mounted under per-service prefixes).
  - `backend/gateway-consumer/` — the Node/TS client API gateway (Express + socket.io).
  - `backend/service-notification/` — the Node/TS **real-time notifications service** (Socket.IO + Redis, no SQL/Mongo). The dashboard connects to it **directly** (not through the gateway) for both the websocket and the `/notification/*` REST calls; it has its own public host `notifications.samudai.xyz`.
- `frontend/` — React 19 app built with **Vite** (`vite.config.ts` + `@vitejs/plugin-react`).
- `bots/` — Node/TypeScript bots (`samudai-bot` for Discord, `telegram-bot`).
- `deploy/local/postgres-init/` — first-boot script that creates the per-module `*_local` Postgres databases for the compose stack.
- `deploy/caddy/Caddyfile` — reverse proxy + automatic-HTTPS config used by the production compose overlay.
- `migrations/postgres/<module>/` — committed golang-migrate migrations (the runtime source of truth), applied automatically by the `migrate` compose service.
- `docker-compose.yml` (root) — the single containerization story. Brings up the whole stack locally; `docker-compose.prod.yml` overlays it for a single-VM production deploy. `.env.example` / `.env.prod.example` document the variables.

## Backend Go monolith (`backend/service-go`)

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
```

Key facts:
- **Each module mounts under a per-service prefix** (`/dao`, `/member`, `/discord`, …, plugin at `/` since its routes are already `/plugins/*`). Callers reach a module via `SERVICE_<X>=http://service-go:8080/<prefix>` — the gateway/inter-service code is unchanged; only env values carry the prefix. This also resolves the original `/member`, `/role` route collisions between dao/member/discord.
- **Per-module SQL connections**: each former SQL service owned its own Postgres database, so `shared/sqldb` opens one `*sql.DB` per module from `DATABASE_URL_DAO`, `DATABASE_URL_MEMBER`, … (`sqldb.Dao()`, `sqldb.Member()`, …) instead of the single global `db.GetSQL()` from samudai-pkg. The 8 databases (dao, dashboard, discovery, discussion, job, member, project, point) are preserved.
- **Mongo & Redis are shared singletons** (`db.InitMongo()` / `db.InitRedis()` from samudai-pkg). Mongo modules pick their own database by name in code (`GetMongo().Database(discord.DatabaseDiscord)`).
- **RabbitMQ**: discord and point each expose `StartRMQ()` (each blocks on `select{}`), launched as goroutines in `app.Run`.
- Depends on `github.com/Samudai/samudai-pkg` for `db`, `logger`, APM. Go `1.26`; Dockerfile pins `golang:1.26-alpine` and builds with `backend/service-go` as its own context (no sibling COPY).
- Verify with `cd backend/service-go && go build ./... && go vet ./...`. `internal/app` has a test (`TestNewEngine`) that builds the engine and asserts no duplicate-route panic.

## Merged Node service (`backend/service-node`)

One Express app hosting four former services under prefixes: `/activity-svc`, `/twitter-svc`, `/web3-svc`, `/x-svc` (reached via `SERVICE_ACTIVITY`, `SERVICE_TWITTER`, `SERVICE_WEB3` etc.). `src/app.ts` mounts each former service's router; `src/db/connections.ts` opens one Mongo socket pool and exposes per-service connections via `useDb('activity'|'twitter'|'web3')`; service-x keeps the native `mongodb` driver and its RabbitMQ publisher. Build with `npm install && npm run build` (`tsc`).

## Gateways

- `backend/gateway-consumer` (Node/TS, Express + socket.io) — main client API gateway; calls the monolith and `service-node` via `SERVICE_*` env URLs.
- `backend/gateway-external` (Go) — standalone external-integrations gateway. Internal callers reach it via `GATEWAY_EXTERNAL=http://gateway-external:8080` (routes served at the **root**, no `/external` prefix); third-party inbound webhooks reach it publicly through Caddy at `ge.samudai.xyz` (a plain `reverse_proxy`, no rewrite — the original webhook URLs work as-is). It is its own Go module (`github.com/Samudai/gateway-external`) with `replace github.com/Samudai/backend => ../service-go` for the monolith's exported `pkg/*` types. **No vendoring**: the image's Docker build context is `backend/` so the sibling `service-go` module is present at build time (`backend/.dockerignore` trims the unrelated services; the Dockerfile copies `service-go/` + `gateway-external/`). Layout: `cmd/server/main.go` (thin gin engine, no datastore init) + `router.go` (`package externalsvc`, `Register` + `StartRMQ`) + `controllers/ internal/ middlewares/ utils/`. A change to a reused `service-go` `pkg/*` type rebuilds this image automatically (its CI watches `backend/service-go/services/*/pkg/**`).

## Notifications service (`backend/service-notification`)

Standalone Node/TS Socket.IO server backed by **Redis only** (no SQL/Mongo, so no migrations). Listens on `8080`; mapped to host `${SERVICE_NOTIFICATION_PORT:-8083}` locally. Routes: `GET /health`, `GET /notification/get/:memberId`, `POST /notification/readnotification/:memberId/:notificationId`, plus the Socket.IO endpoint. Clients authenticate the socket handshake with `{ memberId }` and join a room named after their member id; notification events fan out across replicas via the `@socket.io/redis-adapter`. A `node-cron` job (daily 23:00) prunes read/orphaned notifications from Redis.

It calls back into other services with `axios`: `GATEWAY_URL` (the consumer gateway's `/api/*` routes → `http://gateway-consumer:8080`) and `GATEWAY_EXTERNAL_URL` (`/telegram/publishnotifications` → `http://gateway-external:8080`), signing requests with `JWT_KEY`. The dashboard reaches it directly via `REACT_APP_NOTIFICATIONS_URL` (local `http://localhost:8083`, prod `https://notifications.samudai.xyz`) — both the websocket and the REST calls — never through the gateway. Toolchain matches the other Node services: Node 22 / TypeScript 6 / Express 5 / socket.io 4.8 / ioredis 5.11; build with `npm install && npm run build`.

## Frontend (`frontend/`)

React 19 app built with **Vite** (`vite.config.ts`). Reaches the backend through `REACT_APP_GATEWAY` (gateway base URL, baked at build time). `REACT_APP_*` env vars are exposed via Vite's `envPrefix: 'REACT_APP_'`.

**Critical**: always read env vars as `import.meta.env.REACT_APP_*` — never `process.env.REACT_APP_*`. The `vite-plugin-node-polyfills` package shadows the `process` global, which defeats the `define` shim for `process.env`. The polyfill must stay (required for `crypto-browserify`), so `import.meta.env` is the only reliable path.

SCSS globals (`vars.scss`/`mixins.scss`) are injected via `css.preprocessorOptions.scss.additionalData`; path aliases from `vite-tsconfig-paths` (reads `tsconfig.paths.json`). Build output is `build/` (`build.outDir`).

```bash
cd frontend
npm install                  # clean install, no --force
npm start                    # vite dev server (port 3000)
npm run lint                 # eslint
npm run format               # prettier
npm run build:development    # env-cmd -f .development.env vite build
npm run build:prod           # uses .production.env (used by Docker image)
```

`build:*` targets require the matching `.{env}.env` file; Docker builds pass `--build-arg NODE_ENV=<env>`. Large `tsc`/build runs may need `NODE_OPTIONS=--max-old-space-size=4096` for heap headroom.

## Common commands

### Run the whole stack locally (docker-compose)

```bash
cp .env.example .env
docker compose up -d --build                          # build + run everything
```

Postgres auto-creates the 8 `*_local` DBs on first boot (`deploy/local/postgres-init`), then the one-shot `migrate` service applies the schema (`migrations/postgres/<module>`) before `service-go` starts — no manual migration step.

Gateway → `localhost:4000`, frontend → `localhost:3000`, service-go → `localhost:8081`, service-node → `localhost:8082`, service-notification → `localhost:8083`, gateway-external → `localhost:8084`, RabbitMQ UI → `localhost:15672`. Smoke: `curl localhost:8081/health`, `curl localhost:8081/dao/...`, `curl localhost:8083/health`, `curl localhost:8084/health`.

### Run the Go backend locally (without Docker)

```bash
cd backend/service-go
go run ./cmd/server           # needs DATABASE_URL_* / MONGO_URL / REDIS_URL / MQ_* / PORT in env
go build ./... && go vet ./...
go test ./internal/app/                              # run all Go tests (currently just TestNewEngine)
go test ./internal/app/ -run TestNewEngine -v        # run a single named test
```

### Build & run a Node service/bot

```bash
# service-node
cd backend/service-node && npm install && npm run start:dev

# gateway-consumer and bots use `npm run dev`
cd backend/gateway-consumer && npm install && npm run dev

# service-notification
cd backend/service-notification && npm install && npm run dev

# production (all Node services)
npm run build && npm start     # tsc -> node dist/index.js
```

### Database migrations (unified on golang-migrate)

Runtime migrations live in `migrations/postgres/<module>/NNNNNN_*.{up,down}.sql` and are applied automatically by the one-shot `migrate` compose service (official `migrate/migrate` image) before `service-go` starts. golang-migrate tracks `schema_migrations` per database, so re-runs are idempotent. To add a migration, drop the next sequential pair into the module's directory.

Migration ownership:

| Datastore | Owner | Managed by |
| --- | --- | --- |
| 8 Postgres DBs (`dao dashboard discovery discussion job member project point`) | Go backend `backend/service-go` | **golang-migrate** (`migrations/postgres/`) |
| Mongo (Go backend: `discord`, `pointdiscord`, `notion`, `github`, `github-test`, `forms`, …) | Go backend | **In-code `EnsureIndexes`** — each service's `<name>svc.EnsureIndexes(ctx)` (e.g. `services/discord/indexes.go`) creates its secondary indexes idempotently at startup from `internal/app/app.go`, mirroring Node's Mongoose `autoIndex`. Collections auto-create on insert, so no schema migration is needed; `migrations/mongo/` is unused/reserved. The point activity DBs (`point*-activity`, `point-guild-metrics`, `point-memberID`) use **dynamic per-entity collection names** (one per point_id/member/wallet/…) and the plugin per-product DBs are runtime-named, so they are intentionally not indexed here. |
| Mongo: `twitter`, `activity`, `web3`, `x` | Node `service-node` | **Mongoose** `autoIndex` (in code, not migrated) |

Node apps hold no SQL connections — Postgres is owned entirely by the Go backend. The interactive authoring tool / Makefile / DBML / sqlc dumps remain under git-ignored `docs/db-migration` (defaults `POSTGRES_USER=piyushhbhutoria`, suffix `_local` match compose); the committed `migrations/` copy is what actually runs.

### Production deploy (single VM)

docker-compose is the only containerization story; production is the same stack with an overlay that uses the prebuilt `ghcr.io/samudai/*` images, adds restart policies, hides the data-store ports, and fronts the apps with Caddy (automatic HTTPS).

```bash
cp .env.prod.example .env   # real secrets
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --pull always
```

Routing/TLS for `app.samudai.xyz` (frontend), `gcn.samudai.xyz` (gateway), `ge.samudai.xyz` (gateway-external — third-party webhooks), and `notifications.samudai.xyz` (service-notification — Socket.IO + REST) is in `deploy/caddy/Caddyfile`; point DNS at the VM.

## CI / Docker builds

- `.github/workflows/service-go.yaml`, `gateway-external.yaml`, and `service-node.yaml` build/push `ghcr.io/samudai/service-go`, `ghcr.io/samudai/gateway-external`, and `ghcr.io/samudai/service-node` on changes under `backend/service-go/**`, `backend/gateway-external/**`, and `backend/service-node/**`. `gateway-consumer.yaml`, `service-notification.yaml` (builds `ghcr.io/samudai/service-notification` on `backend/service-notification/**`), `dashboard-samudai.yaml`, and the bot workflows cover the rest.
- `.github/workflows/docker-build-check.yaml` runs on every PR: it diffs changed files, walks to the nearest `Dockerfile`, and matrix-builds each affected image — **every image builds with its own directory as context, except `gateway-external`**, which builds with `backend/` as its context so the sibling `service-go` module (its `replace` target) is available. The script special-cases that context and also build-checks `gateway-external` when a `backend/service-go/services/*/pkg/**` file changes.
- When adding a new backend capability, prefer a new module under `backend/service-go/services/<name>/` mounted in `internal/app/app.go` rather than a new microservice.

## Conventions worth knowing

- Go: `gofmt` / idiomatic Go. Controllers are thin HTTP adapters — business logic belongs in `internal/<name>/`. Top-level service packages are named `<name>svc` to avoid colliding with their own `internal/<name>` / `pkg/<name>` packages.
- TS: 2-space indent, semicolons, double quotes, trailing commas.
- Don't introduce a new cross-service shared utility in one module — add it to `samudai-pkg` (external module) instead.
- `docs/` is git-ignored; treat `docs/db-migration` as a workspace tool, not committed product artifacts.
