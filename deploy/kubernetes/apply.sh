#!/bin/bash

cd "$(dirname "$0")"

# Deploy MongoDB first
echo "Deploying MongoDB..."
./deploy-mongodb.sh

# Deploy PostgreSQL
echo "Deploying PostgreSQL..."
./deploy-postgres.sh

# Deploy Redis
echo "Deploying Redis..."
./deploy-redis.sh

# Deploy RabbitMQ
echo "Deploying RabbitMQ..."
./deploy-rabbitmq.sh

# Wait for databases to be ready
echo "Waiting for databases to be ready..."
kubectl wait --for=condition=available deployment/mongodb --timeout=300s
kubectl wait --for=condition=available deployment/postgres --timeout=300s
kubectl wait --for=condition=available deployment/redis --timeout=300s
kubectl wait --for=condition=available deployment/rabbitmq --timeout=300s

# Deploy all services
echo "Deploying services..."

dbs=("activity" "dao" "dashboard" "discord" "discovery" "discussion" "forms" "job" "member" "plugin" "project" "twitter" "web3")
for db in "${dbs[@]}"
do
    echo "Creating $db"
    kubectl apply -f service-$db.yml
done

# Deploy infrastructure
echo "Deploying infrastructure..."
dbs=("gateway-consumer" "gateway-external" "samudai-bot" "elastic" "telegram-bot")
for db in "${dbs[@]}"
do
    echo "Creating $db"
    kubectl apply -f $db.yml
done

# Start Kubernetes Dashboard
read -p "Do you want to install and launch the Kubernetes Dashboard? (y/n): " answer
echo ""
if [[ $answer == "y" || $answer == "Y" ]]; then
    echo "Installing Kubernetes Dashboard..."
    kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml
    echo "Creating admin service account and cluster role binding..."
    kubectl create serviceaccount dashboard-admin-sa || true
    kubectl create clusterrolebinding dashboard-admin-sa --clusterrole=cluster-admin --serviceaccount=default:dashboard-admin-sa || true
    echo "Starting kubectl proxy in the background..."
    nohup kubectl proxy > /dev/null 2>&1 &
    echo ""
    echo "Kubernetes Dashboard is being set up."
    echo "Access it at: http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/"
    echo "To log in, run the following command to get your token:"
    echo "kubectl create token dashboard-admin-sa"
    echo "Copy and paste the token into the Dashboard login page."
else
    echo "Skipping Kubernetes Dashboard setup."
fi

echo "Deployment complete!"

