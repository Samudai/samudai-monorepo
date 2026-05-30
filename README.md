# Samudai

Samudai is a monorepo for a collaborative platform designed to empower DAOs, projects, and contributors. It includes a dashboard, backend services, bots, and supporting documentation for seamless community and project management.

## Monorepo Structure

```
samudai-monorepo/
  backend/             # Backend code (Go monolith, merged Node service, API gateway)
  frontend/            # Frontend web application (React)
  bots/                # Bot applications (Discord, Telegram)
  deploy/              # Deployment configurations (Kubernetes, docker-compose)
  docs/                # Documentation and database migration files
  docker-compose.yml   # Full local stack
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

### Prerequisites

- Node.js (for dashboard and some services)
- Go (for backend services)
- Docker & Kubernetes (for deployment, optional)
- Postgres 17
- Redis 7
- MongoDB 8
- RabbitMQ 3.12
- Elasticsearch (for APM)

### Run the backend services

- Update `.github/workflows` with the correct values for databases and other secrets

- Deploy databases and other services (MongoDB, PostgreSQL, Redis, RabbitMQ):

```bash
./deploy/kubernetes/apply.sh
```

- Deploy ingress and cert-manager:

```bash
./deploy/kubernetes/applyssl.sh
```

- Run Elasticsearch and APM server:

```bash
kubectl apply -f ./deploy/kubernetes/elastic.yml
```

- Update the database configs and run the migrations:

```bash
go run cmd/migrations/main.go
```

- Run the Discord Bot - [Samudai Discord Bot](bots/samudai-bot)
- Run the Telegram Bot - [Samudai Telegram Bot](bots/telegram-bot)

### Run the dashboard

- Update the `.production.env` at `frontend/.production.env` and build the docker image

#### Using Docker

```bash
docker build -t samudai/dashboard-samudai:latest . --build-arg NODE_ENV=prod
```

- Run the docker image:

```bash
docker run -d -p 3000:3000 samudai/dashboard-samudai:latest
```

#### Running Locally

```bash
cd frontend
npm install
npm start
```

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Create a Pull Request

## License

[Apache License](LICENCE)
