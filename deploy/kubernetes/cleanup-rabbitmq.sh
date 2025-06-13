#!/bin/bash

cd "$(dirname "$0")"

echo "Cleaning up RabbitMQ..."
kubectl delete -f rabbitmq-service.yml
kubectl delete -f rabbitmq-deployment.yml
kubectl delete -f rabbitmq-pvc.yml
kubectl delete -f rabbitmq-secret.yml
echo "RabbitMQ cleanup complete!" 
