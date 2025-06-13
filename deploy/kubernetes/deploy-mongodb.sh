#!/bin/bash

# Deploy MongoDB to Kubernetes
echo "Deploying MongoDB to Kubernetes..."

# Apply MongoDB resources in order
echo "Creating MongoDB Secret..."
kubectl apply -f mongodb-secret.yml

echo "Creating MongoDB PVC..."
kubectl apply -f mongodb-pvc.yml

echo "Creating MongoDB Deployment..."
kubectl apply -f mongodb-deployment.yml

echo "Creating MongoDB Service..."
kubectl apply -f mongodb-service.yml

# Wait for deployment to be ready
echo "Waiting for MongoDB deployment to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/mongodb

# Check deployment status
echo "MongoDB deployment status:"
kubectl get pods -l app=mongodb
kubectl get svc mongodb-service

echo "MongoDB deployment completed successfully!"
echo "MongoDB is accessible at: mongodb-service.default.svc.cluster.local:27017" 
