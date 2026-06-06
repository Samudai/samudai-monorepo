# Contributing to Samudai

Thank you for your interest in contributing! This is a polyglot monorepo — please read this guide before opening a PR so your change lands cleanly.

## Repository overview

| Area | What lives here |
|------|----------------|
| `backend/service-go/` | Go modular monolith (one binary, one Gin engine). Add new server-side capabilities here as a module under `services/<name>/`. |
| `backend/gateway-external/` | Standalone Go gateway for third-party integrations (webhooks + Discord bot calls). Own module; reuses service-go's types via a vendored `replace`. |
| `backend/service-node/` | Merged Node/Express service (activity, twitter, web3, x). |
| `backend/gateway-consumer/` | Node/TS client API gateway (Express + socket.io). |
| `backend/service-notification/` | Node/TS real-time notifications service (Socket.IO + Redis). |
| `frontend/` | React 19 + Vite app. |
| `bots/` | Discord and Telegram bots (Node/TS). |
| `migrations/postgres/<module>/` | golang-migrate SQL migrations — the runtime source of truth. |
| `deploy/` | docker-compose files, Caddy config, Postgres init scripts. |

## Getting started

```bash
git clone https://github.com/Samudai/samudai-monorepo.git
cd samudai-monorepo
cp .env.example .env          # fill in secrets
docker compose up -d --build  # builds and runs the full stack
```

Postgres databases are created automatically on first boot. The one-shot `migrate` service applies all SQL migrations before the backend starts.

| Service | Local URL |
|---------|-----------|
| Frontend | http://localhost:3000 |
| Gateway | http://localhost:4000 |
| Backend (Go) | http://localhost:8081 |
| service-node | http://localhost:8082 |
| service-notification | http://localhost:8083 |
| RabbitMQ UI | http://localhost:15672 |

## Running services individually

**Go backend**
```bash
cd backend/service-go
go run ./cmd/server           # needs DATABASE_URL_* / MONGO_URL / REDIS_URL / MQ_* / PORT in env
go build ./... && go vet ./...
go test ./internal/app/
```

**Node services / bots**
```bash
cd backend/service-node       # or gateway-consumer, bots/samudai-bot, bots/telegram-bot
npm install
npm run start:dev
```

**Frontend**
```bash
cd frontend
npm install
npm start                     # Vite dev server on port 3000
```

## How to contribute

1. Fork the repository and create your branch from `master`.
2. Make focused, well-scoped changes — one concern per PR.
3. Verify your change compiles and passes existing tests.
4. Commit with clear, descriptive messages.
5. Open a pull request and fill in the description template.

## Adding new backend functionality

Prefer a new module inside the Go monolith over a new microservice:

1. Create `backend/service-go/services/<name>/` with `router.go`, `controllers/`, and `internal/<name>/`.
2. Mount the router in `backend/service-go/internal/app/app.go`.
3. Add SQL migrations to `migrations/postgres/<name>/` if a new Postgres database is needed.
4. Expose the module via a `SERVICE_<NAME>` env variable in `.env.example`.

Only add a new standalone service when the workload is genuinely incompatible with the monolith (e.g., different runtime, heavy I/O isolation).

## Database migrations

Runtime migrations live in `migrations/postgres/<module>/NNNNNN_*.{up,down}.sql` and are applied automatically by the `migrate` compose service.

To add a migration:
1. Drop the next sequential numbered pair (`NNNNNN_description.up.sql` / `.down.sql`) into `migrations/postgres/<module>/`.
2. Test locally by restarting the compose stack or running the migrate container directly.
3. Never edit or delete already-applied migrations — add a new one instead.

The interactive authoring tool and DBML/sqlc dumps live under `docs/db-migration/` (git-ignored). The committed `migrations/` copy is what actually runs.

## Code style

**Go**
- `gofmt` for formatting; follow idiomatic Go conventions.
- Controllers are thin HTTP adapters — business logic belongs in `internal/<name>/`.
- Top-level service packages are named `<name>svc` to avoid collisions with their own sub-packages.
- Cross-service shared utilities belong in `samudai-pkg` (external module), not within a single service.

**TypeScript / Node**
- 2-space indent, semicolons, double quotes, trailing commas.
- Match the patterns established in the service you're modifying.

**Frontend (React + Vite)**
- Use `import.meta.env.REACT_APP_*` for environment variables — do not use `process.env.*`.
- SCSS globals (`vars.scss`, `mixins.scss`) are injected globally; do not re-import them per-component.
- Large builds may need `NODE_OPTIONS=--max-old-space-size=4096`.

## Pull request guidelines

- Keep PRs focused — large PRs are harder to review and slower to merge.
- Ensure `go build ./... && go vet ./...` passes for any Go changes.
- Ensure `npm run build` passes for any Node/frontend changes.
- Reference related issues in your PR description.
- Address review comments promptly.

## Reporting issues

Use the [GitHub Issues](../../issues) page to report bugs or request features. Please include:
- Steps to reproduce
- Expected vs. actual behavior
- Relevant logs or screenshots

## Questions

Open a GitHub Discussion or reach out to the maintainers at piyush.bhutoria98@gmail.com.
