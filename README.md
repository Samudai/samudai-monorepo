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
  bots; `frontend/.nvmrc` pins it) and **Go 1.24** (the `backend/core` monolith).

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
