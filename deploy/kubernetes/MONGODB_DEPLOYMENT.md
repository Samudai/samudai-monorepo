# MongoDB Deployment in Kubernetes

This document describes the MongoDB deployment setup for the production environment.

## Overview

MongoDB has been migrated from external MongoDB Atlas to a self-hosted MongoDB instance running in Kubernetes. This provides better control, reduced costs, and improved performance for applications running in the same cluster.

## Services Using MongoDB

The following services have been configured to use the internal MongoDB:

1. `service-discord.yml` - Default database
2. `service-plugin.yml` - Default database
3. `service-activity.yml` - Database: `activity`
4. `service-x.yml` - Default database
5. `service-forms.yml` - Default database
6. `service-web3.yml` - Database: `web3`
7. `service-twitter.yml` - Database: `twitter`

## Files Created

### 1. `mongodb-secret.yml`

Contains MongoDB credentials (username and password) stored as Kubernetes secrets.

- Username: `admin` (base64: `YWRtaW4=`)
- Password: `your-secure-password` (base64: `eW91ci1zZWN1cmUtcGFzc3dvcmQ=`)

**⚠️ Important**: Change the default password before deploying to production!

### 2. `mongodb-pvc.yml`

PersistentVolumeClaim for MongoDB data storage (10Gi).

### 3. `mongodb-deployment.yml`

MongoDB deployment configuration with:

- MongoDB 8.0 image
- Persistent storage mounted at `/data/db`
- Resource limits and requests
- Health checks (liveness and readiness probes)
- Security configuration with authentication

### 4. `mongodb-service.yml`

Kubernetes service to expose MongoDB within the cluster:

- Service name: `mongodb-service`
- Port: 27017
- Type: ClusterIP (internal access only)

### 5. `deploy-mongodb.sh`

Deployment script that applies all MongoDB resources in the correct order.

### 6. `cleanup-mongodb.sh`

Cleanup script to remove all MongoDB resources from the cluster.

## Deployment

### Deploy MongoDB

```bash
chmod +x deploy-mongodb.sh
./deploy-mongodb.sh
```

### Cleanup MongoDB

```bash
chmod +x cleanup-mongodb.sh
./cleanup-mongodb.sh
```

## Configuration Changes

All services have been updated to use environment variables for MongoDB credentials:

```yaml
mongo-database-url: mongodb://$(MONGO_INITDB_ROOT_USERNAME):$(MONGO_INITDB_ROOT_PASSWORD)@mongodb-service.default.svc.cluster.local:27017/[DATABASE_NAME]?authSource=admin
```

Where `[DATABASE_NAME]` is specific to each service that requires a separate database.

## Connection Details

- **Internal DNS**: `mongodb-service.default.svc.cluster.local`
- **Port**: `27017`
- **Username**: Environment variable: `$(MONGO_INITDB_ROOT_USERNAME)`
- **Password**: Environment variable: `$(MONGO_INITDB_ROOT_PASSWORD)`
- **Auth Database**: `admin`

## Security Considerations

1. **Environment Variables**: MongoDB credentials are now passed via environment variables
2. **Network Security**: MongoDB is only accessible within the cluster (ClusterIP service)
3. **Storage**: Data is persisted using PersistentVolumeClaim
4. **Authentication**: MongoDB is configured with authentication enabled

## Monitoring

After deployment, you can monitor MongoDB with:

```bash
# Check pod status
kubectl get pods -l app=mongodb

# Check service
kubectl get svc mongodb-service

# View logs
kubectl logs -l app=mongodb

# Connect to MongoDB (for debugging)
kubectl exec -it deployment/mongodb -- mongo -u admin -p your-secure-password --authSource=admin
```

## Backup Considerations

- Set up regular backups of the MongoDB data
- Consider using MongoDB's built-in backup tools
- Ensure PVC backup strategy is in place

## Migration Notes

- Previous MongoDB Atlas connection has been replaced with internal MongoDB service
- All services have been updated to use environment variables for credentials
- Each service maintains its specific database name if it had one
- Monitor performance after migration
