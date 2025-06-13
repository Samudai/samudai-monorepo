#!/bin/bash

# Deploy PostgreSQL to Kubernetes
echo "Deploying PostgreSQL to Kubernetes..."

# Apply PostgreSQL resources in order
echo "Creating PostgreSQL Secret..."
kubectl apply -f postgres-secret.yml

echo "Creating PostgreSQL PVC..."
kubectl apply -f postgres-pvc.yml

echo "Creating PostgreSQL Deployment..."
kubectl apply -f postgres-deployment.yml

echo "Creating PostgreSQL Service..."
kubectl apply -f postgres-service.yml

# Wait for deployment to be ready
echo "Waiting for PostgreSQL deployment to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/postgres

# Check deployment status
echo "PostgreSQL deployment status:"
kubectl get pods -l app=postgres
kubectl get svc postgres-service

echo "PostgreSQL deployment completed successfully!"
echo "PostgreSQL is accessible at: postgres-service.default.svc.cluster.local:5432" 
