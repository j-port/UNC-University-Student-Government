# Database Setup Guide

This guide explains how to configure the backend to work with either **Supabase** or **PostgreSQL**.

## Architecture Overview

The backend uses a **Repository Pattern** with a **Factory Pattern** for database abstraction, making it easy to switch between different database providers without changing your business logic.

```
Backend Architecture:
├── routes/              → API endpoints (unchanged regardless of database)
├── db/
│   ├── index.js         → Database facade (single entry point)
│   ├── BaseRepository.js → Abstract base class
│   ├── SupabaseRepository.js → Supabase implementation
│   ├── PostgresRepository.js → PostgreSQL implementation
│   └── repositories/    → Domain-specific repositories
└── config/
    └── databaseFactory.js → Creates appropriate database client
```

---

## Quick Start: Switching Databases

**It's this simple!** Just change one environment variable in `backend/.env`:

### Option 1: Use Supabase (Default)

```env
DB_TYPE=supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key-here
PORT=5000
```

### Option 2: Use PostgreSQL

```env
DB_TYPE=postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=unc_sg
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-password
POSTGRES_SSL=false
PORT=5000
```

**That's it!** Restart your server and it will automatically use the correct database.

---

## How It Works

The backend uses a **Factory Pattern** to automatically create the right database client:

1. **databaseFactory.js** reads `DB_TYPE` from environment
2. Creates either a Supabase client or PostgreSQL pool
3. Returns the appropriate repository class (SupabaseRepository or PostgresRepository)
4. **index.js** initializes all repositories with the correct client

**No code changes needed!** The architecture handles everything automatically.

---

## Setting Up Supabase

### Getting Your Supabase Keys

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
    - **Project URL** → `SUPABASE_URL`
    - **service_role secret** → `SUPABASE_SERVICE_KEY`

### Why SERVICE_KEY?

-   **SERVICE_KEY** = Full database access (bypasses Row Level Security)
-   **ANON_KEY** = Read-only access (respects Row Level Security)

Your backend needs **full access** to create, update, and delete records.

---

## Setting Up PostgreSQL

### Step 1: Install PostgreSQL

Download from [postgresql.org](https://www.postgresql.org/download/) or use Docker:

```bash
docker run --name postgres -e POSTGRES_PASSWORD=mypassword -p 5432:5432 -d postgres
```

### Step 2: Install pg Client (if not already installed)

```bash
cd backend
npm install pg
```

### Step 3: Create Database and Schema

```bash
# Create database
createdb unc_sg

# Import schema
psql -d unc_sg -f database_schema.sql

# (Optional) Import seed data
psql -d unc_sg -f supabase_seed_data.sql
```

### Step 4: Configure Environment

Set `DB_TYPE=postgres` in your `.env` file with PostgreSQL credentials.

### Step 5: Restart Server

```bash
npm start
```

Your backend now uses PostgreSQL!

---

## Database Schema Migration

If switching from Supabase to PostgreSQL, you need to migrate your schema.

### Export from Supabase

```bash
# Using Supabase CLI
supabase db dump -f schema.sql

# Or via psql
pg_dump -h db.your-project.supabase.co -U postgres -d postgres --schema-only > schema.sql
```

### Import to PostgreSQL

```bash
psql -h localhost -U postgres -d usg_database -f schema.sql
```

### Required Tables

Your database needs these tables:

-   `feedback`
-   `announcements`
-   `officers`
-   `organizations`
-   `committees`
-   `governance_documents`
-   `site_content`
-   `page_content`
-   `financial_transactions`
-   `issuances`

---

## Adding New Repositories

### 1. Create Repository Class (Optional)

If you need custom queries, extend the base repository:

**File:** `backend/src/db/repositories/EventRepository.js`

```javascript
import { SupabaseRepository } from "../SupabaseRepository.js";

export class EventRepository extends SupabaseRepository {
    constructor(client) {
        super(client, "events");
    }

    // Custom method: Get upcoming events
    async findUpcoming(limit = 10) {
        const today = new Date().toISOString();
        return this.findAll({
            filters: { status: "active" },
            orderBy: "event_date",
            orderDirection: "asc",
            limit,
        });
    }

    // Custom method: Get events by category
    async findByCategory(category) {
        return this.findAll({
            filters: { category },
        });
    }
}
```

### 2. Register in Database Facade

**File:** `backend/src/db/index.js`

```javascript
import { EventRepository } from "./repositories/EventRepository.js";

class Database {
    constructor() {
        this.feedback = new FeedbackRepository(supabase);
        this.announcements = new SupabaseRepository(supabase, "announcements");
        // ... other repositories

        // Add new repository
        this.events = new EventRepository(supabase);
    }
}
```

### 3. Create API Routes

**File:** `backend/src/routes/events.js`

```javascript
import express from "express";
import db from "../db/index.js";

const router = express.Router();

// GET all events
router.get("/", async (req, res) => {
    try {
        const events = await db.events.findAll();
        res.json({ success: true, data: events });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET upcoming events
router.get("/upcoming", async (req, res) => {
    try {
        const events = await db.events.findUpcoming(10);
        res.json({ success: true, data: events });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST create event
router.post("/", async (req, res) => {
    try {
        const event = await db.events.create(req.body);
        res.status(201).json({ success: true, data: event });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

export default router;
```

### 4. Register Routes in Server

**File:** `backend/src/index.js`

```javascript
import eventRoutes from "./routes/events.js";

// Register routes
app.use("/api/events", eventRoutes);
```

### 5. Add Frontend API Client

**File:** `frontend/src/lib/api.js`

```javascript
export const eventsAPI = {
    getAll: () => apiRequest("/events"),

    getUpcoming: () => apiRequest("/events/upcoming"),

    create: (eventData) =>
        apiRequest("/events", {
            method: "POST",
            body: JSON.stringify(eventData),
        }),

    update: (id, updates) =>
        apiRequest(`/events/${id}`, {
            method: "PUT",
            body: JSON.stringify(updates),
        }),

    delete: (id) =>
        apiRequest(`/events/${id}`, {
            method: "DELETE",
        }),
};
```

---

## Benefits of This Architecture

✅ **Database Agnostic**: Switch databases by changing one file  
✅ **Testable**: Easy to mock repositories for unit tests  
✅ **Maintainable**: Business logic separated from database logic  
✅ **Scalable**: Add new tables without touching existing code  
✅ **Secure**: Database credentials only in backend, never exposed to frontend  
✅ **Type Safe**: Consistent interface across all repositories

---

## Testing Database Connection

The backend automatically tests the connection on startup. Check your console for:

```
✅ Database connected successfully: supabase
```

or

```
✅ Database connected successfully: postgres
```

### Manual Connection Test

You can test by making a simple API request:

```bash
# Test feedback endpoint
curl http://localhost:5000/api/feedback

# Should return: { "success": true, "data": [...] }
```

---

## Common Issues

### Issue: "ECONNREFUSED" when connecting to backend

**Solution:** Make sure backend is running:

```bash
cd backend
node src/index.js
```

### Issue: "Invalid API key" with Supabase

**Solution:** Check you're using `SUPABASE_SERVICE_KEY`, not `SUPABASE_ANON_KEY`

### Issue: "relation does not exist" with PostgreSQL

**Solution:** Import your database schema:

```bash
psql -h localhost -U postgres -d usg_database -f schema.sql
```

### Issue: CORS errors from frontend

**Solution:** Backend already has CORS configured in `index.js`. Make sure `VITE_API_URL` in frontend `.env` matches your backend URL:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Production Deployment

### For Supabase (Current Setup)

1. Keep `USE_POSTGRES=false` or omit it
2. Set environment variables:
    ```env
    SUPABASE_URL=https://your-project.supabase.co
    SUPABASE_SERVICE_KEY=your-production-service-key
    PORT=5000
    ```

### For PostgreSQL

1. Set `USE_POSTGRES=true`
2. Configure production database:

    ```env
    DB_HOST=your
    ```

```env
DB_TYPE=supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-production-service-key
PORT=5000
NODE_ENV=production
```

### For PostgreSQL

```env
DB_TYPE=postgres
POSTGRES_HOST=your-db-host.com
POSTGRES_PORT=5432
POSTGRES_DB=unc_sg_production
POSTGRES_USER=postgres
POSTGRES_PASSWORD=secure-password
POSTGRES_SSL=true
PORT=5000
NODE_ENV=production
```

Connection pooling is already configured for optimal performance.Switch databases by changing **one environment variable** (`DB_TYPE`)

-   ✅ **PostgresRepository** already created - no manual setup needed
-   ✅ **Factory pattern** automatically creates correct client
-   ✅ All database operations go through **Repository Pattern**
-   ✅ Frontend code never changes regardless of database
-   ✅ Routes remain identical for both Supabase and PostgreSQL

## Additional Resources

-   See [DATABASE_MIGRATION.md](./DATABASE_MIGRATION.md) for detailed migration guide
-   Check `.env.example` for all configuration options
-   Review `backend/src/config/databaseFactory.js` to understand the factory pattern
-   Look at `backend/src/db/PostgresRepository.js` for PostgreSQL implementatio
