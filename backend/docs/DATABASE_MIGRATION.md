# Database Migration Guide

This guide explains how to switch between Supabase and PostgreSQL databases in your application.

## Architecture Overview

The application uses a **Repository Pattern** with database abstraction:

```
Routes → Database → Repositories → (Supabase/Postgres)Repository → Database Client
```

### Key Components

1. **BaseRepository** - Abstract base class defining standard operations
2. **SupabaseRepository** - Supabase-specific implementation
3. **PostgresRepository** - PostgreSQL-specific implementation
4. **Database Factory** - Creates appropriate client based on configuration
5. **Database** - Main abstraction layer exposing all repositories

## Switching Databases

### Option 1: Using Supabase (Default)

1. Set your `.env` file:

```env
DB_TYPE=supabase
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key
```

2. That's it! The application will automatically use Supabase.

### Option 2: Using PostgreSQL

1. Install PostgreSQL locally or use a cloud provider

2. Run the database schema:

```bash
psql -U postgres -d unc_sg -f database_schema.sql
```

3. (Optional) Load seed data:

```bash
psql -U postgres -d unc_sg -f supabase_seed_data.sql
```

4. Update your `.env` file:

```env
DB_TYPE=postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=unc_sg
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_SSL=false
```

5. Install pg dependency if not already installed:

```bash
npm install pg
```

6. Restart your server - it will automatically connect to PostgreSQL!

## Benefits of This Architecture

-   **Zero Code Changes**: Switch databases by changing only the `.env` file
-   **Type Safety**: Both implementations follow the same interface
-   **Easy Testing**: Can use different databases for dev/test/prod
-   **Future-Proof**: Easy to add support for MySQL, MongoDB, etc.
-   **Clean Separation**: Business logic is completely decoupled from database implementation

## How It Works

1. `databaseFactory.js` reads `DB_TYPE` from environment
2. Creates appropriate database client (Supabase or PostgreSQL)
3. `Database` class initializes repositories with the client
4. Each repository extends the appropriate base class
5. Routes interact only with the `Database` abstraction layer

## Adding a New Database Type

To add support for another database (e.g., MySQL):

1. Create `MySQLRepository.js` extending `BaseRepository`
2. Implement all abstract methods using MySQL syntax
3. Add MySQL case to `databaseFactory.js`
4. Update `.env.example` with MySQL configuration options

That's it! No changes needed to routes or business logic.

## Troubleshooting

### Connection Issues

**Supabase:**

-   Verify SUPABASE_URL and SUPABASE_SERVICE_KEY are correct
-   Check network connectivity
-   Ensure service key (not anon key) is used for backend

**PostgreSQL:**

-   Verify PostgreSQL server is running
-   Check connection credentials
-   Test connection: `psql -h localhost -U postgres -d unc_sg`
-   For SSL issues, try setting POSTGRES_SSL=false for local development

### Migration Issues

If you encounter errors after switching:

1. Verify database schema is up to date
2. Check that all tables exist
3. Ensure seed data is loaded if needed
4. Review repository implementations for database-specific syntax

## Performance Considerations

-   **Supabase**: Built on PostgreSQL with auto-scaling and edge caching
-   **PostgreSQL**: Full control over performance tuning and indexing

Both options are production-ready. Choose based on your deployment preferences.
