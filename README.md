# Samudai

Samudai is a monorepo for a collaborative platform designed to empower DAOs, projects, and contributors. It includes a dashboard, backend services, and supporting documentation for seamless community and project management.

## Monorepo Structure

```
samudai-monorepo/
  dashboard/           # Frontend web application
  services/            # Backend microservices (gateway, analytics, dao, etc.)
  deploy/              # Deployment configurations (Kubernetes, etc.)
  docs/                # Documentation and database migration files
```

## Getting Started

### Prerequisites

- Node.js (for dashboard)
- Go (for backend services)
- Docker & Kubernetes (for deployment, optional)
- Postgres 17
- Redis 7
- MongoDB 8
- RabbitMQ 3.12
- Elasticsearch (for APM)

### Run the backend services

- update .github/workflows with the correct values for databases and other secrets

- deploy/kubernetes/apply.sh will deploy the databases and other services (MongoDB, PostgreSQL, Redis, RabbitMQ)
- deploy/kubernetes/applyssl.sh will deploy the ingress and cert-manager
- run elasticsearch and apm server

```bash
./deploy/kubernetes/apply.sh
./deploy/kubernetes/applyssl.sh
./deploy/elastic-agent-managed-kubernetes.yaml
```

- update the database configs and run the migrations

```bash
go run cmd/migrations/main.go
```

### Run the dashboard

- update the .production.env at dashboard/dashboard-samudai/.production.env and build the docker image

#### Using Docker

```bash
docker build -t samudai/dashboard-samudai:latest . --build-arg NODE_ENV=prod
```

- run the docker image

```bash
docker run -d -p 3000:3000 samudai/dashboard-samudai:latest
```

#### Running Locally

```bash
npm run dev
```

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Create a Pull Request

## License

[Apache 2.0](LICENCE)
