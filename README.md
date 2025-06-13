# Samudai

Samudai is a monorepo for a collaborative platform designed to empower DAOs, projects, and contributors. It includes a dashboard, backend services, bots, and supporting documentation for seamless community and project management.

## Monorepo Structure

```
samudai-monorepo/
  bots/                # Bot applications (Discord, Telegram)
  dashboard/           # Frontend web application
  services/            # Backend microservices
  deploy/              # Deployment configurations (Kubernetes, etc.)
  docs/                # Documentation and database migration files
```

### Services Overview

The platform is built using a microservices architecture with the following key services:

- **gateway-consumer-node** - Main API gateway for client requests
- **gateway-external** - External API gateway for third-party integrations
- **service-dao** - DAO management and member operations
- **service-project** - Project lifecycle and task management
- **service-member** - User profile and member management
- **service-job** - Job posting and application handling
- **service-discovery** - Content discovery and recommendation
- **service-discussion** - Forum and discussion management
- **service-dashboard** - Dashboard analytics and metrics
- **service-discord** - Discord bot integration
- **service-plugin** - Third-party plugin management (GitHub, Notion, etc.)
- **service-point** - Reward and point system
- **service-analytics** - Data analytics and reporting
- **service-activity** - Activity tracking and notifications
- **service-twitter/service-x** - Twitter/X social media integration
- **service-web3** - Blockchain and Web3 functionality
- **service-forms** - Form management and processing

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

- Update the `.production.env` at `dashboard/dashboard-samudai/.production.env` and build the docker image

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
cd dashboard/dashboard-samudai
npm install
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
