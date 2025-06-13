#!/bin/bash

# Cleanup MongoDB from Kubernetes
echo "Cleaning up MongoDB from Kubernetes..."

# Delete MongoDB resources in reverse order
echo "Deleting MongoDB Service..."
kubectl delete -f mongodb-service.yml --ignore-not-found=true

echo "Deleting MongoDB Deployment..."
kubectl delete -f mongodb-deployment.yml --ignore-not-found=true

echo "Deleting MongoDB PVC..."
kubectl delete -f mongodb-pvc.yml --ignore-not-found=true

echo "Deleting MongoDB Secret..."
kubectl delete -f mongodb-secret.yml --ignore-not-found=true

echo "MongoDB cleanup completed!" 
