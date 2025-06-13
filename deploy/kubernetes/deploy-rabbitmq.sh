#!/bin/bash

cd "$(dirname "$0")"

echo "Deploying RabbitMQ..."

echo "Creating RabbitMQ secret..."
kubectl apply -f rabbitmq-secret.yml

echo "Creating RabbitMQ persistent volume claim..."
kubectl apply -f rabbitmq-pvc.yml

echo "Deploying RabbitMQ..."
kubectl apply -f rabbitmq-deployment.yml

echo "Creating RabbitMQ service..."
kubectl apply -f rabbitmq-service.yml

echo "Waiting for RabbitMQ deployment to be ready..."
kubectl wait --for=condition=available deployment/rabbitmq --timeout=300s

echo "RabbitMQ deployment complete!"

# Display RabbitMQ service details
echo "RabbitMQ service details:"
kubectl get service rabbitmq-service 
