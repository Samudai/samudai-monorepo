#!/bin/bash

cd "$(dirname "$0")"

# Cleanup MongoDB
echo "Cleaning up MongoDB..."
./cleanup-mongodb.sh

# Cleanup PostgreSQL
echo "Cleaning up PostgreSQL..."
./cleanup-postgres.sh

# Cleanup Redis
echo "Cleaning up Redis..."
./cleanup-redis.sh

# Cleanup RabbitMQ
echo "Cleaning up RabbitMQ..."
./cleanup-rabbitmq.sh

# Cleanup all services
echo "Cleaning up all services..."  
dbs=("activity" "dao" "dashboard" "discord" "discovery" "discussion" "forms" "job" "member" "plugin" "project" "twitter" "web3")
for db in "${dbs[@]}"
do
    echo "Deleting $db"
    kubectl delete -f service-$db.yml
done

# Cleanup all infrastructure
echo "Cleaning up all infrastructure..."
dbs=("gateway-consumer" "gateway-external" "samudai-bot" "elastic" "telegram-bot")
for db in "${dbs[@]}"
do
    echo "Deleting $db"
    kubectl delete -f $db.yml
done
