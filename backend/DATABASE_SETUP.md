# Database Setup Guide

This guide explains how to configure the backend to work with either **Supabase** or **PostgreSQL**.

## Architecture Overview

The backend uses a **Repository Pattern** for database abstraction, making it easy to switch between different database providers without changing your business logic.

```
Backend Architecture:
├── routes/              → API endpoints (unchanged regardless of database)
├── db/
│   ├── index.js         → Database facade (single entry point)
│   ├── BaseRepository.js → Abstract base class
│   ├── SupabaseRepository.js → Supabase implementation
│   ├── PostgresRepository.js → PostgreSQL implementation (future)
│   └── repositories/    → Domain-specific repositories
└── config/
    └── database.js      → Database connection configuration
```

---

## Current Setup: Supabase

### Configuration

**File:** `backend/src/config/database.js`

```javascript
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY // ⚠️ Use SERVICE_KEY, not ANON_KEY!
);
```

**Environment Variables:** `backend/.env`

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key-here
PORT=5000
```

### Why SERVICE_KEY instead of ANON_KEY?

-   **SERVICE_KEY** = Full database access (bypasses Row Level Security)
-   **ANON_KEY** = Read-only access (respects Row Level Security)

Your backend needs **full access** to create, update, and delete records.

### Getting Your Supabase Keys

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
    - **Project URL** → `SUPABASE_URL`
    - **service_role secret** → `SUPABASE_SERVICE_KEY`

---

## Switching to PostgreSQL

### Step 1: Install PostgreSQL Client

```bash
cd backend
npm install pg
```

### Step 2: Create PostgreSQL Repository

**File:** `backend/src/db/PostgresRepository.js`

```javascript
import { BaseRepository } from "./BaseRepository.js";

export class PostgresRepository extends BaseRepository {
    constructor(client, tableName) {
        super(client, tableName);
    }

    async findAll(options = {}) {
        const {
            filters = {},
            orderBy = "created_at",
            orderDirection = "DESC",
            limit,
        } = options;

        let query = `SELECT * FROM ${this.tableName} WHERE 1=1`;
        const values = [];
        let paramCount = 1;

        // Apply filters
        Object.entries(filters).forEach(([key, value]) => {
            query += ` AND ${key} = $${paramCount}`;
            values.push(value);
            paramCount++;
        });

        // Apply ordering
        query += ` ORDER BY ${orderBy} ${orderDirection}`;

        // Apply limit
        if (limit) {
            query += ` LIMIT $${paramCount}`;
            values.push(limit);
        }

        const result = await this.client.query(query, values);
        return result.rows;
    }

    async findById(id) {
        const result = await this.client.query(
            `SELECT * FROM ${this.tableName} WHERE id = $1`,
            [id]
        );
        return result.rows[0];
    }

    async create(data) {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");

        const query = `
            INSERT INTO ${this.tableName} (${keys.join(", ")})
            VALUES (${placeholders})
            RETURNING *
        `;

        const result = await this.client.query(query, values);
        return result.rows[0];
    }

    async update(id, data) {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const setClause = keys.map((key, i) => `${key} = $${i + 2}`).join(", ");

        const query = `
            UPDATE ${this.tableName}
            SET ${setClause}
            WHERE id = $1
            RETURNING *
        `;

        const result = await this.client.query(query, [id, ...values]);
        return result.rows[0];
    }

    async delete(id) {
        await this.client.query(`DELETE FROM ${this.tableName} WHERE id = $1`, [
            id,
        ]);
        return true;
    }
}
```

### Step 3: Update Database Configuration

**File:** `backend/src/config/database.js`

```javascript
import pg from "pg";
const { Pool } = pg;

export const postgresPool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});
```

**Environment Variables:** `backend/.env`

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=usg_database
DB_USER=postgres
DB_PASSWORD=your-password
DB_SSL=false
PORT=5000
```

### Step 4: Update Database Facade

**File:** `backend/src/db/index.js`

```javascript
// Choose your database implementation
const USE_POSTGRES = process.env.USE_POSTGRES === 'true';

if (USE_POSTGRES) {
    // PostgreSQL Setup
    import { postgresPool } from '../config/database.js';
    import { PostgresRepository } from './PostgresRepository.js';

    class Database {
        constructor() {
            this.feedback = new PostgresRepository(postgresPool, 'feedback');
            this.announcements = new PostgresRepository(postgresPool, 'announcements');
            this.officers = new PostgresRepository(postgresPool, 'officers');
            this.organizations = new PostgresRepository(postgresPool, 'organizations');
            this.committees = new PostgresRepository(postgresPool, 'committees');
            this.governanceDocuments = new PostgresRepository(postgresPool, 'governance_documents');
            this.siteContent = new PostgresRepository(postgresPool, 'site_content');
            this.pageContent = new PostgresRepository(postgresPool, 'page_content');
            this.financialTransactions = new PostgresRepository(postgresPool, 'financial_transactions');
            this.issuances = new PostgresRepository(postgresPool, 'issuances');
        }
    }

    export default new Database();
} else {
    // Supabase Setup (current)
    import { supabase } from '../config/database.js';
    import { SupabaseRepository } from './SupabaseRepository.js';
    import { FeedbackRepository } from './repositories/FeedbackRepository.js';
    // ... other imports

    class Database {
        constructor() {
            this.feedback = new FeedbackRepository(supabase);
            this.announcements = new SupabaseRepository(supabase, 'announcements');
            // ... other repositories
        }
    }

    export default new Database();
}
```

### Step 5: Enable PostgreSQL

Add to `backend/.env`:

```env
USE_POSTGRES=true
```

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

### Test Supabase Connection

```javascript
// backend/src/config/database.js
import { supabase } from "./database.js";

const testConnection = async () => {
    try {
        const { data, error } = await supabase.from("feedback").select("count");
        if (error) throw error;
        console.log("✅ Supabase connected successfully");
    } catch (error) {
        console.error("❌ Supabase connection failed:", error.message);
    }
};

testConnection();
```

### Test PostgreSQL Connection

```javascript
// backend/src/config/database.js
import { postgresPool } from "./database.js";

const testConnection = async () => {
    try {
        const client = await postgresPool.connect();
        const result = await client.query("SELECT NOW()");
        console.log("✅ PostgreSQL connected successfully:", result.rows[0]);
        client.release();
    } catch (error) {
        console.error("❌ PostgreSQL connection failed:", error.message);
    }
};

testConnection();
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
    DB_HOST=your-db-host.com
    DB_PORT=5432
    DB_NAME=usg_production
    DB_USER=postgres
    DB_PASSWORD=secure-password
    DB_SSL=true
    PORT=5000
    ```

3. Use connection pooling for better performance (already configured)

---

## Summary

-   ✅ Current setup uses **Supabase** with SERVICE_KEY
-   ✅ Architecture supports switching to **PostgreSQL** without changing routes
-   ✅ All database operations go through **Repository Pattern**
-   ✅ Frontend uses `api.js` to communicate with backend
-   ✅ Easy to add new tables/routes following the same pattern

For questions or issues, refer to the code in `backend/src/db/` directory.
