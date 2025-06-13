# PostgreSQL Deployment in Kubernetes

This document describes the PostgreSQL deployment setup for the production environment.

## Overview

PostgreSQL is deployed as a stateful database within the Kubernetes cluster, providing data persistence and reliable service for applications that require relational database capabilities.

## Files Created

### 1. `postgres-secret.yml`

Contains PostgreSQL credentials stored as Kubernetes secrets:

- Username: `postgres` (base64: `cG9zdGdyZXM=`)
- Password: `postgres` (base64: `cG9zdGdyZXM=`)

**⚠️ Important**: Change the default password before deploying to production!

### 2. `postgres-pvc.yml`

PersistentVolumeClaim for PostgreSQL data storage:

- Storage: 1Gi (adjust based on your needs)
- Access Mode: ReadWriteOnce

### 3. `postgres-deployment.yml`

PostgreSQL deployment configuration with:

- PostgreSQL 17-alpine image
- Persistent storage mounted at `/var/lib/postgresql/data`
- Resource limits and requests:
  - Requests: 256Mi memory, 250m CPU
  - Limits: 1Gi memory, 500m CPU
- Environment variables from Secret

### 4. `postgres-service.yml`

Kubernetes service to expose PostgreSQL within the cluster:

- Service name: `postgres-service`
- Port: 5432
- Type: ClusterIP (internal access only)

### 5. `deploy-postgres.sh`

Deployment script that applies all PostgreSQL resources in the correct order.

### 6. `cleanup-postgres.sh`

Cleanup script to remove all PostgreSQL resources from the cluster.

## Deployment

### Deploy PostgreSQL

```bash
chmod +x deploy-postgres.sh
./deploy-postgres.sh
```

### Cleanup PostgreSQL

```bash
chmod +x cleanup-postgres.sh
./cleanup-postgres.sh
```

## Connection Details

- **Internal DNS**: `postgres-service.default.svc.cluster.local`
- **Port**: `5432`
- **Username**: Environment variable: `$(POSTGRES_USER)`
- **Password**: Environment variable: `$(POSTGRES_PASSWORD)`

## Security Considerations

1. **Environment Variables**: PostgreSQL credentials are passed via environment variables
2. **Network Security**: PostgreSQL is only accessible within the cluster (ClusterIP service)
3. **Storage**: Data is persisted using PersistentVolumeClaim
4. **Authentication**: PostgreSQL is configured with password authentication

## Monitoring

After deployment, you can monitor PostgreSQL with:

```bash
# Check pod status
kubectl get pods -l app=postgres

# Check service
kubectl get svc postgres-service

# View logs
kubectl logs -l app=postgres

# Connect to PostgreSQL (for debugging)
kubectl exec -it deployment/postgres -- psql -U postgres
```

## Backup Considerations

- Set up regular backups of the PostgreSQL data
- Consider using PostgreSQL's built-in backup tools (pg_dump)
- Ensure PVC backup strategy is in place

## Integration with Services

The PostgreSQL service is deployed before the application services in the `apply.sh` script to ensure database availability. Services can connect to PostgreSQL using the following connection string format:

```
postgresql://$(POSTGRES_USER):$(POSTGRES_PASSWORD)@postgres-service:5432/[DATABASE_NAME]
```

## Resource Management

The deployment is configured with resource limits to prevent the database from consuming excessive cluster resources:

- Memory Request: 256Mi
- Memory Limit: 1Gi
- CPU Request: 250m
- CPU Limit: 500m

Adjust these values based on your workload requirements.
