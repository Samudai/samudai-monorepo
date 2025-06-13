#!/bin/bash

cd "$(dirname "$0")"

echo "Deploying Redis..."

echo "Creating Redis secret..."
kubectl apply -f redis-secret.yml

echo "Creating Redis persistent volume claim..."
kubectl apply -f redis-pvc.yml

echo "Deploying Redis..."
kubectl apply -f redis-deployment.yml

echo "Creating Redis service..."
kubectl apply -f redis-service.yml

echo "Waiting for Redis deployment to be ready..."
kubectl wait --for=condition=available deployment/redis --timeout=300s

echo "Redis deployment complete!"

# Display Redis service details
echo "Redis service details:"
kubectl get service redis-service 
