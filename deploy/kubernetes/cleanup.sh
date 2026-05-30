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

# Cleanup consolidated backends
echo "Cleaning up backend and service-node..."
kubectl delete -f backend.yml
kubectl delete -f service-node.yml

# Cleanup all infrastructure
echo "Cleaning up all infrastructure..."
dbs=("gateway-consumer" "samudai-bot" "elastic" "telegram-bot")
for db in "${dbs[@]}"
do
    echo "Deleting $db"
    kubectl delete -f $db.yml
done
