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
- `deploy/kubernetes/` — k8s manifests (`backend.yml`, `service-node.yml`, gateway/bot/dashboard, stateful deps) plus `deploy-*.sh` / `cleanup-*.sh` helpers and ingress/SSL bootstrap (`apply.sh`, `applyssl.sh`).
- `deploy/local/postgres-init/` — first-boot script that creates the per-module `*_local` Postgres databases for the local compose stack.
- `docker-compose.yml` (root) — brings up the whole stack locally (stateful deps + all apps). `.env.example` documents the variables.
- `docs/db-migration/` — interactive Go migration tool + Makefile for all Postgres modules (note: `docs` is git-ignored).

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
- Depends on `github.com/Samudai/samudai-pkg` for `db`, `logger`, APM. Go `1.24`; Dockerfile pins `golang:1.24-alpine` and builds with `backend/core` as its own context (no sibling COPY).
- Verify with `cd backend/core && go build ./... && go vet ./...`. `internal/app` has a test that builds the engine and asserts no duplicate-route panic.

## Merged Node service (`backend/service-node`)

One Express app hosting four former services under prefixes: `/activity-svc`, `/twitter-svc`, `/web3-svc`, `/x-svc` (reached via `SERVICE_ACTIVITY`, `SERVICE_TWITTER`, `SERVICE_WEB3` etc.). `src/app.ts` mounts each former service's router; `src/db/connections.ts` opens one Mongo socket pool and exposes per-service connections via `useDb('activity'|'twitter'|'web3')`; service-x keeps the native `mongodb` driver and its RabbitMQ publisher. Build with `npm install && npm run build` (`tsc`).

## Gateways

- `backend/gateway-consumer-node` (Node/TS, Express + socket.io) — main client API gateway; calls the monolith and `service-node` via `SERVICE_*` env URLs.
- The old `gateway-external` (Go) is now the `external` module inside `backend/core`, mounted at `/external`.

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
docker compose up -d postgres mongo redis rabbitmq    # stateful deps (postgres auto-creates the 8 *_local DBs)
(cd docs/db-migration && make migrateupall)           # apply SQL schema (one-time)
docker compose up -d                                  # build + run backend, service-node, gateway, frontend, bots
```

Gateway → `localhost:4000`, frontend → `localhost:3000`, backend → `localhost:8081`, service-node → `localhost:8082`. Smoke: `curl localhost:8081/health`, `curl localhost:8081/dao/...`.

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

### Database migrations

All Postgres migrations live under `docs/db-migration/`. Postgres modules: `dao dashboard discovery discussion job member project point`. Mongo modules (not migrated via this tool): `plugin twitter activity web3 discord`.

```bash
cd docs/db-migration
make postgres            # starts the postgres17 docker container
make createall           # create all <module>_local databases
make migrateupall        # run all migrations up
make migrateup<module>   # single module, e.g. migrateupdao
make sqlc                # regenerate sqlc code
```

Defaults baked into the Makefile (`POSTGRES_USER=piyushhbhutoria`, `POSTGRES_PASSWORD=password`, suffix `_local`) match the compose stack so migrations run unedited.

### Kubernetes / infra bootstrap

```bash
./deploy/kubernetes/apply.sh        # stateful deps + backend + service-node + gateway/bots
./deploy/kubernetes/applyssl.sh     # ingress + cert-manager
```

## CI / Docker builds

- `.github/workflows/backend.yaml` and `service-node.yaml` build/push `ghcr.io/samudai/backend` and `ghcr.io/samudai/service-node` on changes under `backend/core/**` and `backend/service-node/**`. `gateway-consumer.yaml`, `dashboard-samudai.yaml`, and the bot workflows cover the rest.
- `.github/workflows/docker-build-check.yaml` runs on every PR: it diffs changed files, walks to the nearest `Dockerfile`, and matrix-builds each affected image — **every image now builds with its own directory as context** (the old `service-plugin` / `gateway-external` root-context special case is gone).
- When adding a new backend capability, prefer a new module under `backend/core/services/<name>/` mounted in `internal/app/app.go` rather than a new microservice.

## Conventions worth knowing

- Go: `gofmt` / idiomatic Go. Controllers are thin HTTP adapters — business logic belongs in `internal/<name>/`. Top-level service packages are named `<name>svc` to avoid colliding with their own `internal/<name>` / `pkg/<name>` packages.
- TS: 2-space indent, semicolons, double quotes, trailing commas.
- Don't introduce a new cross-service shared utility in one module — add it to `samudai-pkg` (external module) instead.
- `docs/` is git-ignored; treat `docs/db-migration` as a workspace tool, not committed product artifacts.
