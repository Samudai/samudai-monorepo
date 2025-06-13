# PostgreSQL Configuration Variables
POSTGRES_USER ?= piyushhbhutoria
POSTGRES_PASSWORD ?= password
POSTGRES_HOST ?= localhost
POSTGRES_PORT ?= 5432
SSL_MODE ?= disable
POSTGRES_SUFFIX ?= _local
POSTGRES_CONTAINER ?= postgres17

# MongoDB Configuration Variables
MONGO_HOST ?= localhost
MONGO_PORT ?= 27017
MONGO_USER ?= mongoadmin
MONGO_PASSWORD ?= password
MONGO_DB_SUFFIX ?= _local
MONGO_CONTAINER_NAME ?= mongo

# Redis Configuration Variables
REDIS_HOST ?= localhost
REDIS_PORT ?= 6379
REDIS_PASSWORD ?= password
REDIS_CONTAINER_NAME ?= redis

# Module definitions
MODULES = dao dashboard discovery discussion job member project point
MONGO_MODULES = plugin twitter activity web3 discord

# Function to build database URL
define POSTGRES_URL
postgresql://$(POSTGRES_USER):$(POSTGRES_PASSWORD)@$(POSTGRES_HOST):$(POSTGRES_PORT)/$(1)$(POSTGRES_SUFFIX)?sslmode=$(SSL_MODE)
endef

# Function to build MongoDB connection string
define MONGO_URL
mongodb://$(MONGO_USER):$(MONGO_PASSWORD)@$(MONGO_HOST):$(MONGO_PORT)/$(1)$(MONGO_DB_SUFFIX)?authSource=admin
endef

# Function to build Redis connection string
define REDIS_URL
redis://:$(REDIS_PASSWORD)@$(REDIS_HOST):$(REDIS_PORT)/0
endef

# Docker PostgreSQL
postgres:
	docker run --name $(POSTGRES_CONTAINER) -p $(POSTGRES_PORT):5432 -e POSTGRES_USER=$(POSTGRES_USER) -e POSTGRES_PASSWORD=$(POSTGRES_PASSWORD) -d postgres:17-alpine

# Docker MongoDB
mongodb:
	docker run --name $(MONGO_CONTAINER_NAME) -p $(MONGO_PORT):27017 -e MONGO_INITDB_ROOT_USERNAME=$(MONGO_USER) -e MONGO_INITDB_ROOT_PASSWORD=$(MONGO_PASSWORD) -d mongo:8.0

# Docker Redis
redis:
	docker run --name $(REDIS_CONTAINER_NAME) -p $(REDIS_PORT):6379 -d redis:8-alpine --requirepass $(REDIS_PASSWORD)

# Database operations
createdbdao:
	docker exec $(POSTGRES_CONTAINER) createdb --username=$(POSTGRES_USER) --owner=$(POSTGRES_USER) dao$(POSTGRES_SUFFIX)

createdbdashboard:
	docker exec $(POSTGRES_CONTAINER) createdb --username=$(POSTGRES_USER) --owner=$(POSTGRES_USER) dashboard$(POSTGRES_SUFFIX)

createdbdiscovery:
	docker exec $(POSTGRES_CONTAINER) createdb --username=$(POSTGRES_USER) --owner=$(POSTGRES_USER) discovery$(POSTGRES_SUFFIX)

createdbdiscussion:
	docker exec $(POSTGRES_CONTAINER) createdb --username=$(POSTGRES_USER) --owner=$(POSTGRES_USER) discussion$(POSTGRES_SUFFIX)

createdbjob:
	docker exec $(POSTGRES_CONTAINER) createdb --username=$(POSTGRES_USER) --owner=$(POSTGRES_USER) job$(POSTGRES_SUFFIX)

createdbmember:
	docker exec $(POSTGRES_CONTAINER) createdb --username=$(POSTGRES_USER) --owner=$(POSTGRES_USER) member$(POSTGRES_SUFFIX)

createdbproject:
	docker exec $(POSTGRES_CONTAINER) createdb --username=$(POSTGRES_USER) --owner=$(POSTGRES_USER) project$(POSTGRES_SUFFIX)

# Service Point specific commands
createdbpoint:
	docker exec $(POSTGRES_CONTAINER) createdb --username=$(POSTGRES_USER) --owner=$(POSTGRES_USER) point$(POSTGRES_SUFFIX)

dropdbpoint:
	docker exec $(POSTGRES_CONTAINER) dropdb --username=$(POSTGRES_USER) point$(POSTGRES_SUFFIX)

migrateinitpoint:
	migrate create -ext sql -dir db/migrationPoint -seq point

migrateuppoint:
	docker run --rm --network container:$(POSTGRES_CONTAINER) -v "$(shell pwd):/workspace" -w /workspace migrate/migrate -path db/migrationPoint -database '$(call POSTGRES_URL,point)' -verbose up

migratedownpoint:
	docker run --rm --network container:$(POSTGRES_CONTAINER) -v "$(shell pwd):/workspace" -w /workspace migrate/migrate -path db/migrationPoint -database '$(call POSTGRES_URL,point)' -verbose down

# Drop operations
dropdbdao:
	docker exec $(POSTGRES_CONTAINER) dropdb --username=$(POSTGRES_USER) dao$(POSTGRES_SUFFIX)

dropdbdashboard:
	docker exec $(POSTGRES_CONTAINER) dropdb --username=$(POSTGRES_USER) dashboard$(POSTGRES_SUFFIX)

dropdbdiscovery:
	docker exec $(POSTGRES_CONTAINER) dropdb --username=$(POSTGRES_USER) discovery$(POSTGRES_SUFFIX)

dropdbdiscussion:
	docker exec $(POSTGRES_CONTAINER) dropdb --username=$(POSTGRES_USER) discussion$(POSTGRES_SUFFIX)

dropdbjob:
	docker exec $(POSTGRES_CONTAINER) dropdb --username=$(POSTGRES_USER) job$(POSTGRES_SUFFIX)

dropdbmember:
	docker exec $(POSTGRES_CONTAINER) dropdb --username=$(POSTGRES_USER) member$(POSTGRES_SUFFIX)

dropdbproject:
	docker exec $(POSTGRES_CONTAINER) dropdb --username=$(POSTGRES_USER) project$(POSTGRES_SUFFIX)

# Migration init operations
migrateinitdao:
	migrate create -ext sql -dir db/migrationDao -seq dao

migrateinitdashboard:
	migrate create -ext sql -dir db/migrationDashboard -seq dashboard

migrateinitdiscovery:
	migrate create -ext sql -dir db/migrationDiscovery -seq discovery

migrateinitdiscussion:
	migrate create -ext sql -dir db/migrationDiscussion -seq discussion

migrateinitjob:
	migrate create -ext sql -dir db/migrationJob -seq job

migrateinitmember:
	migrate create -ext sql -dir db/migrationMember -seq member

migrateinitproject:
	migrate create -ext sql -dir db/migrationProject -seq project

# Migration up operations using Docker
migrateupdao:
	docker run --rm --network container:$(POSTGRES_CONTAINER) -v "$(shell pwd):/workspace" -w /workspace migrate/migrate -path db/migrationDao -database '$(call POSTGRES_URL,dao)' -verbose up

migrateupdashboard:
	docker run --rm --network container:$(POSTGRES_CONTAINER) -v "$(shell pwd):/workspace" -w /workspace migrate/migrate -path db/migrationDashboard -database '$(call POSTGRES_URL,dashboard)' -verbose up

migrateupdiscovery:
	docker run --rm --network container:$(POSTGRES_CONTAINER) -v "$(shell pwd):/workspace" -w /workspace migrate/migrate -path db/migrationDiscovery -database '$(call POSTGRES_URL,discovery)' -verbose up

migrateupdiscussion:
	docker run --rm --network container:$(POSTGRES_CONTAINER) -v "$(shell pwd):/workspace" -w /workspace migrate/migrate -path db/migrationDiscussion -database '$(call POSTGRES_URL,discussion)' -verbose up

migrateupjob:
	docker run --rm --network container:$(POSTGRES_CONTAINER) -v "$(shell pwd):/workspace" -w /workspace migrate/migrate -path db/migrationJob -database '$(call POSTGRES_URL,job)' -verbose up

migrateupmember:
	docker run --rm --network container:$(POSTGRES_CONTAINER) -v "$(shell pwd):/workspace" -w /workspace migrate/migrate -path db/migrationMember -database '$(call POSTGRES_URL,member)' -verbose up

migrateupproject:
	docker run --rm --network container:$(POSTGRES_CONTAINER) -v "$(shell pwd):/workspace" -w /workspace migrate/migrate -path db/migrationProject -database '$(call POSTGRES_URL,project)' -verbose up

# Migration down operations using Docker
migratedowndao:
	docker run --rm --network container:$(POSTGRES_CONTAINER) -v "$(shell pwd):/workspace" -w /workspace migrate/migrate -path db/migrationDao -database '$(call POSTGRES_URL,dao)' -verbose down

migratedowndashboard:
	docker run --rm --network container:$(POSTGRES_CONTAINER) -v "$(shell pwd):/workspace" -w /workspace migrate/migrate -path db/migrationDashboard -database '$(call POSTGRES_URL,dashboard)' -verbose down

migratedowndiscovery:
	docker run --rm --network container:$(POSTGRES_CONTAINER) -v "$(shell pwd):/workspace" -w /workspace migrate/migrate -path db/migrationDiscovery -database '$(call POSTGRES_URL,discovery)' -verbose down

migratedowndiscussion:
	docker run --rm --network container:$(POSTGRES_CONTAINER) -v "$(shell pwd):/workspace" -w /workspace migrate/migrate -path db/migrationDiscussion -database '$(call POSTGRES_URL,discussion)' -verbose down

migratedownjob:
	docker run --rm --network container:$(POSTGRES_CONTAINER) -v "$(shell pwd):/workspace" -w /workspace migrate/migrate -path db/migrationJob -database '$(call POSTGRES_URL,job)' -verbose down

migratedownmember:
	docker run --rm --network container:$(POSTGRES_CONTAINER) -v "$(shell pwd):/workspace" -w /workspace migrate/migrate -path db/migrationMember -database '$(call POSTGRES_URL,member)' -verbose down

migratedownproject:
	docker run --rm --network container:$(POSTGRES_CONTAINER) -v "$(shell pwd):/workspace" -w /workspace migrate/migrate -path db/migrationProject -database '$(call POSTGRES_URL,project)' -verbose down

# Convenience targets for all modules
createall: createdbdao createdbdashboard createdbdiscovery createdbdiscussion createdbjob createdbmember createdbproject createdbpoint

dropall: dropdbdao dropdbdashboard dropdbdiscovery dropdbdiscussion dropdbjob dropdbmember dropdbproject dropdbpoint

migrateupall: migrateupdao migrateupdashboard migrateupdiscovery migrateupdiscussion migrateupjob migrateupmember migrateupproject migrateuppoint

migratedownall: migratedowndao migratedowndashboard migratedowndiscovery migratedowndiscussion migratedownjob migratedownmember migratedownproject migratedownpoint

# Special case for sqlc (not module-specific)
sqlc:
	sqlc generate

# RabbitMQ Configuration Variables
RABBITMQ_USER ?= rabbitmq
RABBITMQ_PASSWORD ?= password
RABBITMQ_HOST ?= localhost
RABBITMQ_PORT ?= 5672
RABBITMQ_MANAGEMENT_PORT ?= 15672
RABBITMQ_CONTAINER_NAME ?= rabbitmq

# Function to build RabbitMQ connection string
define RABBITMQ_URL
amqp://$(RABBITMQ_USER):$(RABBITMQ_PASSWORD)@$(RABBITMQ_HOST):$(RABBITMQ_PORT)/
endef

# Docker RabbitMQ
rabbitmq:
	docker run --name $(RABBITMQ_CONTAINER_NAME) \
		-p $(RABBITMQ_PORT):5672 \
		-p $(RABBITMQ_MANAGEMENT_PORT):15672 \
		-e RABBITMQ_DEFAULT_USER=$(RABBITMQ_USER) \
		-e RABBITMQ_DEFAULT_PASS=$(RABBITMQ_PASSWORD) \
		-d rabbitmq:3-management-alpine

# Stop and remove RabbitMQ container
rabbitmq-down:
	docker stop $(RABBITMQ_CONTAINER_NAME) || true
	docker rm $(RABBITMQ_CONTAINER_NAME) || true

# Help target
help:
	@echo "Available targets:"
	@echo "  postgres          - Start PostgreSQL container"
	@echo "  mongodb           - Start MongoDB container"
	@echo "  createdb<module>  - Create database for module ($(MODULES) $(MONGO_MODULES))"
	@echo "  dropdb<module>    - Drop database for module"
	@echo "  migrateup<module> - Run migrations up for module"
	@echo "  migratedown<module> - Run migrations down for module"
	@echo "  migrateinit<module> - Initialize migration files for module"
	@echo "  createall         - Create all databases (PostgreSQL)"
	@echo "  dropall           - Drop all databases"
	@echo "  migrateupall      - Run all migrations up"
	@echo "  migratedownall    - Run all migrations down"
	@echo "  sqlc              - Generate sqlc code"
	@echo ""
	@echo "Example usage:"
	@echo "  make createdbdao"
	@echo "  make migrateupdashboard"
	@echo "  make migrateupall"
	@echo ""
	@echo "PostgreSQL Configuration:"
	@echo "  POSTGRES_USER=$(POSTGRES_USER)"
	@echo "  POSTGRES_PASSWORD=$(POSTGRES_PASSWORD)"
	@echo "  POSTGRES_HOST=$(POSTGRES_HOST)"
	@echo "  POSTGRES_PORT=$(POSTGRES_PORT)"
	@echo "  POSTGRES_SUFFIX=$(POSTGRES_SUFFIX)"
	@echo ""
	@echo "MongoDB Configuration:"
	@echo "  MONGO_USER=$(MONGO_USER)"
	@echo "  MONGO_PASSWORD=$(MONGO_PASSWORD)"
	@echo "  MONGO_HOST=$(MONGO_HOST)"
	@echo "  MONGO_PORT=$(MONGO_PORT)"
	@echo "  MONGO_DB_SUFFIX=$(MONGO_DB_SUFFIX)"

.PHONY: postgres sqlc help createall dropall migrateupall migratedownall createdbdao createdbdashboard createdbdiscovery createdbdiscussion createdbjob createdbmember createdbproject createdbpoint dropdbdao dropdbdashboard dropdbdiscovery dropdbdiscussion dropdbjob dropdbmember dropdbproject dropdbpoint migrateupdao migrateupdashboard migrateupdiscovery migrateupdiscussion migrateupjob migrateupmember migrateupproject migrateuppoint migratedowndao migratedowndashboard migratedowndiscovery migratedowndiscussion migratedownjob migratedownmember migratedownproject migratedownpoint migrateinitdao migrateinitdashboard migrateinitdiscovery migrateinitdiscussion migrateinitjob migrateinitmember migrateinitproject migrateinitpoint rabbitmq rabbitmq-down
    