# Samudai

Samudai is a monorepo for a collaborative platform designed to empower DAOs, projects, and contributors. It includes a dashboard, backend services, bots, and supporting documentation for seamless community and project management.

## Monorepo Structure

```
samudai-monorepo/
  backend/             # Backend code (Go monolith, merged Node service, API gateway)
  frontend/            # Frontend web application (React)
  bots/                # Bot applications (Discord, Telegram)
  deploy/              # Deployment helpers (Caddy reverse proxy, local Postgres init)
  migrations/          # golang-migrate Postgres migrations (applied automatically)
  docker-compose.yml   # Full stack — local and (with the prod override) single-VM prod
```

### Backend Overview

The backend is consolidated into a few deployables:

- **backend/core** - Go modular monolith (one binary, one Gin engine). Hosts every domain module — dao, member, project, job, discovery, discussion, dashboard, discord, plugin, point, analytics, forms — plus third-party integrations (`external`, formerly `gateway-external`), each mounted under a per-service path prefix (`/dao`, `/member`, …).
- **backend/service-node** - Merged Node/Express service hosting the former activity, twitter, web3, and x services under per-service prefixes.
- **backend/gateway-consumer-node** - Main API gateway for client requests (Express + socket.io).

### Bots

- **samudai-bot** - Discord bot for community engagement
- **telegram-bot** - Telegram bot for notifications and interactions

## Getting Started

Everything runs containerized with Docker Compose — one command brings up the
whole stack (data stores, backend, service-node, gateway, frontend, bots).

### Prerequisites

- Docker (with the Compose plugin) — that's it. No local Go/Node/Postgres needed
  to run the stack.
- Only for developing an individual service outside Docker: **Node.js 22**
  (all Node apps — `frontend`, `service-node`, `gateway-consumer-node`, and both
  bots; `frontend/.nvmrc` pins it) and **Go 1.26** (the `backend/core` monolith).

### Run the full stack locally

```bash
cp .env.example .env          # local defaults work out of the box
docker compose up -d --build  # build + run everything
```

Database schema is applied automatically: a one-shot `migrate` service runs the
[golang-migrate](https://github.com/golang-migrate/migrate) Postgres migrations
in `migrations/postgres/<module>` before `backend` starts — no manual step.

| Service | URL |
| --- | --- |
| Gateway (client API) | http://localhost:4000 |
| Frontend (dashboard) | http://localhost:3000 |
| Backend (Go monolith) | http://localhost:8081 (e.g. `/health`, `/dao/...`) |
| service-node | http://localhost:8082 |
| RabbitMQ management | http://localhost:15672 |

Bots (`samudai-bot`, `telegram-bot`) start too but need valid Discord/Telegram
tokens in `.env` to do anything useful.

## Development

For day-to-day work it's usually fastest to run the data stores in Docker and
the service you're editing on the host (live reload, debugger, faster restarts).

```bash
# bring up just the dependencies the apps need
docker compose up -d postgres mongo redis rabbitmq migrate
```

Each app reads its config from a local `.env` (or shell environment). Point the
`SERVICE_*` / `DATABASE_URL_*` / `MONGO_URL` / `REDIS_URL` / `MQ_*` URLs at the
containers above (`localhost` ports as listed in the table) when running on the
host.

### Backend — Go monolith (`backend/core`)

```bash
cd backend/core
go run ./cmd/server                       # serves on $PORT (8080 by default)
go build ./... && go vet ./...            # compile + lint
go test ./internal/app/                   # asserts the engine mounts with no route collisions
```

Add a new capability as a module under `backend/core/services/<name>/` mounted in
`internal/app/app.go` — don't spin up a new microservice.

### Backend — Node services (`service-node`, `gateway-consumer-node`)

```bash
cd backend/service-node                   # or backend/gateway-consumer-node
npm install
npm run start:dev                         # ts-node-dev live reload (gateway uses: npm run dev)
npm run build && npm start                # tsc -> node dist/index.js
```

### Frontend (`frontend/`)

React 18 (CRA via react-app-rewired + Craco). Node 22 (`frontend/.nvmrc`). Talks
to the backend through `REACT_APP_GATEWAY` (the gateway base URL, baked in at
build time).

```bash
cd frontend
nvm use                                   # picks up Node 22 from .nvmrc
npm install
npm start                                 # dev server on http://localhost:3000

# production-style builds (each needs the matching .<env>.env file)
npm run build:development                 # uses .development.env
npm run build:staging                     # uses .staging.env
npm run build:prod                        # uses .production.env (used by the Docker image)
```

### Bots (`bots/samudai-bot`, `bots/telegram-bot`)

Node 22 + TypeScript. Each needs its platform token (`DISCORD_*` / `TELEGRAM_*`)
and the `SERVICE_*` URLs in its `.env` to reach the backend.

```bash
cd bots/samudai-bot                       # or bots/telegram-bot
npm install
npm run dev                               # ts-node-dev live reload
npm run build && npm start                # tsc -> node dist/index.js
```

### Deploy to production (single VM)

A small overlay swaps the locally-built images for the prebuilt CI images on
`ghcr.io`, adds restart policies, and fronts everything with [Caddy](https://caddyserver.com/)
(automatic HTTPS):

```bash
cp .env.prod.example .env     # fill in real secrets
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --pull always
```

Point DNS for `app.samudai.xyz` (frontend) and `gcn.samudai.xyz` (gateway) at
the VM; routing/TLS is configured in `deploy/caddy/Caddyfile`.

### Database migrations

Migrations live in `migrations/postgres/<module>/NNNNNN_*.{up,down}.sql` and are
applied automatically by the `migrate` service on every `docker compose up`
(idempotent via golang-migrate's `schema_migrations` tracking). To add one,
create the next sequential pair under the module's directory — see
[`migrations/README.md`](migrations/README.md).

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Create a Pull Request

## License

[Apache License](LICENSE)
