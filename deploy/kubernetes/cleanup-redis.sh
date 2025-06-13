#!/bin/bash

echo "Cleaning up Redis..."
kubectl delete -f redis-service.yml
kubectl delete -f redis-deployment.yml
kubectl delete -f redis-pvc.yml
kubectl delete -f redis-secret.yml
echo "Redis cleanup complete!" 
