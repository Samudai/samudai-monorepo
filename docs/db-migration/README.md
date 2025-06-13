# DB-Migration

Database migration tool for Samudai project with PostgreSQL support. Features an interactive migration tool with comprehensive error handling and PostgreSQL database management.

## 🎯 Supported Databases

- **PostgreSQL**: Relational data (dao, dashboard, discovery, discussion, job, member, project, point)

## 🔧 Configuration

The Makefile and migration tool support configurable settings for PostgreSQL through environment variables:

### Environment Variables

#### PostgreSQL Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `SSL_MODE` | `disable` | SSL mode for connections |
| `POSTGRES_SUFFIX` | `_local` | Suffix for database names |
| `POSTGRES_USER` | `piyushhbhutoria` | PostgreSQL username |
| `POSTGRES_PASSWORD` | `password` | PostgreSQL password |
| `POSTGRES_HOST` | `localhost` | PostgreSQL host |
| `POSTGRES_PORT` | `5432` | PostgreSQL port |
| `POSTGRES_CONTAINER` | `postgres17` | Docker container name |

### Usage Examples

#### Create all databases

```bash
make postgres
make createall
```

#### Run all migrations

```bash
make migrateupall
```

#### Drop all databases

```bash
make dropall
```

#### Run migrations for a specific module

```bash
make migrateup{module}
```

#### Using default settings

```bash
make migrateupdao         # PostgreSQL dao module
# or
go run main.go            # All modules
```

#### Using custom settings

```bash
# Export environment variables for both Makefile and interactive tool
export DB_USER=myuser
export DB_PASSWORD=$POSTGRES_PASSWORD
# These are needed if you run `go run main.go` directly
export POSTGRES_USER=$DB_USER
export POSTGRES_PASSWORD=$DB_PASSWORD

# Run migrations
make migrateupdao
# or
go run main.go
```

### Database Naming Convention

Each module gets its own database named: `{module}{SUFFIX}`

#### PostgreSQL Examples (suffix `_local`)

- `dao_local`
- `dashboard_local`
- `discovery_local`
- `discussion_local`
- `job_local`
- `member_local`
- `project_local`
- `point_local`

## 🚀 Available Commands

### Docker Services Setup

- `make postgres` - Start PostgreSQL container
- `make mongodb` - Start MongoDB container
- `make redis` - Start Redis container
- `make rabbitmq` - Start RabbitMQ container

### Individual Module Commands

#### PostgreSQL Modules (dao, dashboard, discovery, discussion, job, member, project, point)

- `make createdb{module}` - Create PostgreSQL database for specific module
- `make dropdb{module}` - Drop PostgreSQL database for specific module
- `make migrateinit{module}` - Initialize SQL migration files for specific module
- `make migrateup{module}` - Run SQL migrations up for specific module
- `make migratedown{module}` - Run SQL migrations down for specific module

### Bulk Operations

- `make createall` - Create all PostgreSQL databases
- `make dropall` - Drop all PostgreSQL databases
- `make migrateupall` - Run all PostgreSQL migrations up
- `make migratedownall` - Run all PostgreSQL migrations down

### Other Commands

- `make sqlc` - Generate sqlc code
- `make help` - Show available commands and current configuration

## 🎯 Interactive Migration Tool

The enhanced `main.go` provides a comprehensive, user-friendly migration experience for PostgreSQL:

### Features

- **🔍 Prerequisites Checking**: Automatically verifies Docker and Make availability
- **📊 Progress Tracking**: Shows progress as `[1/8]`, `[2/8]`, etc. with database type icons
- **✅ Visual Feedback**: Uses emojis and clear status messages
- **📈 Statistics**: Displays final summary with success/failure counts
- **🔧 Configuration Display**: Shows current PostgreSQL settings on startup
- **🛠️ Error Recovery**: Interactive error handling with database-appropriate recovery options

### Usage

```bash
go run main.go
```

### Sample Output

```
🚀 Database Migration Tool
=========================
🔄 Supporting PostgreSQL

🔧 Database Configuration:
  📊 PostgreSQL:
     User: piyushhbhutoria
     Host: localhost:5432
     SSL Mode: disable
     DB Suffix: _local
     Container: postgres17

📊 Processing 8 modules...

[1/8] 📊 Processing dao (postgres)...
✅ Migration successful for dao (postgres)

[2/8] 📊 Processing dashboard (postgres)...
✅ Migration successful for dashboard (postgres)

...

📈 Migration Summary:
   ✅ Total Successful: 8
   ❌ Total Failed: 0
   📊 Total: 8

🎉 All migrations completed successfully!
```

### Error Handling & Recovery

When migrations fail, the tool provides interactive recovery options:

1. **Database Reset Option**: Drops and recreates the database
2. **Force Migration Option**: Uses Docker-based force migration for dirty states

#### Example Error Recovery Flow

```
❌ Migration failed for dao (postgres)
Error details: migration version 2 is dirty

🔄 Reset database for dao? (y/n): y
🗑️  Resetting database for dao (postgres)...
✅ Database dao reset successfully
✅ Migration successful after reset for dao (postgres)
```

## 📁 Project Structure

```
DB-Migration/
├── db/
│   └── postgres/
│       ├── dao/                # PostgreSQL Dao module migrations
│       ├── dashboard/          # PostgreSQL Dashboard module migrations
│       ├── discovery/          # PostgreSQL Discovery module migrations
│       ├── discussion/         # PostgreSQL Discussion module migrations
│       ├── job/                # PostgreSQL Job module migrations
│       ├── member/             # PostgreSQL Member module migrations
│       ├── point/              # PostgreSQL Point module migrations
│       └── project/            # PostgreSQL Project module migrations
├── DBML/                       # Database markup language files
├── sql/                        # Additional SQL scripts
├── main.go                     # Interactive migration tool
├── Makefile                    # Build and migration commands
└── README.md                   # This file
```

## 🎯 Quick Start

1. **Start PostgreSQL container:**

   ```bash
   make postgres
   ```

2. **Create all databases:**

   ```bash
   make createall
   ```

3. **Run all migrations (choose one):**

   ```bash
   # Option 1: Use the interactive tool (recommended)
   go run main.go
   
   # Option 2: Use bulk Makefile commands
   make migrateupall
   ```

4. **Check available commands:**

   ```bash
   make help
   ```

## 🛠️ Development Workflow

### Adding a New PostgreSQL Module

1. Create migration directory: `db/postgres/{modulename}/`
2. Add module to `getModules()` function in `main.go`
3. Add corresponding Makefile targets
4. Initialize migrations: `make migrateinit{modulename}`

### Handling Migration Issues

1. **Use the interactive tool first**: `go run main.go`
2. **For specific modules**: `make migrateup{module}`
3. **For debugging**: Check Docker container logs and database state
4. **For force fixes**: Use the tool's force migration option

### Best Practices

- Always use the interactive tool for development
- Test migrations on a copy of production data
- Use environment variables for different environments
- Keep migration files small and focused
- Review DBML files for schema consistency

## 🔍 Troubleshooting

### Common Issues

1. **Docker containers not running**:
   - PostgreSQL: `make postgres`
2. **Permission denied**: Check Docker permissions and container status
3. **PostgreSQL migration dirty state**: Use the interactive tool's force migration option
4. **File mounting issues**: Ensure proper volume mounting for migration files

### Getting Help

```bash
# Check container status
docker ps | grep postgres

# View container logs
docker logs postgres17

# Test PostgreSQL connection
docker exec postgres17 psql -U piyushhbhutoria -d dao_local -c "SELECT version();"

# Show available make targets
make help
```

## 📊 Database Schema Documentation

### PostgreSQL Modules

- **dao**: Data access objects and core business logic
- **dashboard**: Dashboard configurations and widgets
- **discovery**: Content discovery and recommendation engine
- **discussion**: Discussion forums and threads
- **job**: Job postings and application management
- **member**: User membership and profile management
- **point**: Point system and rewards management
- **project**: Project management and collaboration
