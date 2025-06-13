#!/bin/bash

# Cleanup PostgreSQL from Kubernetes
echo "Cleaning up PostgreSQL from Kubernetes..."

# Delete PostgreSQL resources in reverse order
echo "Deleting PostgreSQL Service..."
kubectl delete -f postgres-service.yml --ignore-not-found=true

echo "Deleting PostgreSQL Deployment..."
kubectl delete -f postgres-deployment.yml --ignore-not-found=true

echo "Deleting PostgreSQL PVC..."
kubectl delete -f postgres-pvc.yml --ignore-not-found=true

echo "Deleting PostgreSQL Secret..."
kubectl delete -f postgres-secret.yml --ignore-not-found=true

echo "PostgreSQL cleanup completed!" 
