# Quick Start: Applying Middleware to Routes

## Example: Announcements Route

Here's how to convert an old route to use the new middleware:

### Before (announcements.js)

```javascript
import express from "express";
import { db } from "../db/index.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const data = await db.announcements.findAll();
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const data = await db.announcements.create(req.body);
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
```

### After (with middleware)

```javascript
import express from "express";
import { db } from "../db/index.js";
import { catchAsync } from "../middleware/errorHandler.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validateRequest.js";
import {
    createAnnouncementSchema,
    updateAnnouncementSchema,
    idParamSchema,
} from "../middleware/validation.js";
import { NotFoundError } from "../utils/errors.js";

const router = express.Router();

// Public endpoint - no auth needed
router.get(
    "/",
    catchAsync(async (req, res) => {
        const data = await db.announcements.findAll({
            filters: { status: "published" },
        });
        res.json({ success: true, data });
    })
);

// Admin endpoint - create announcement
router.post(
    "/",
    authenticate,
    requireAdmin,
    validate(createAnnouncementSchema),
    catchAsync(async (req, res) => {
        const data = await db.announcements.create(req.body);
        res.status(201).json({ success: true, data });
    })
);

// Admin endpoint - update announcement
router.put(
    "/:id",
    authenticate,
    requireAdmin,
    validate(updateAnnouncementSchema),
    catchAsync(async (req, res) => {
        const data = await db.announcements.update(req.params.id, req.body);

        if (!data) {
            throw new NotFoundError("Announcement");
        }

        res.json({ success: true, data });
    })
);

// Admin endpoint - delete announcement
router.delete(
    "/:id",
    authenticate,
    requireAdmin,
    validate(idParamSchema),
    catchAsync(async (req, res) => {
        await db.announcements.delete(req.params.id);
        res.json({ success: true, message: "Announcement deleted" });
    })
);

export default router;
```

## Key Changes Checklist

For each route file:

### 1. Add Imports

```javascript
import { catchAsync } from "../middleware/errorHandler.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validateRequest.js";
import /* schemas */ "../middleware/validation.js";
import { NotFoundError } from "../utils/errors.js";
```

### 2. Replace try-catch with catchAsync

```javascript
// Before
router.get("/", async (req, res) => {
    try {
        // code
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// After
router.get(
    "/",
    catchAsync(async (req, res) => {
        // code - errors handled automatically
    })
);
```

### 3. Add Authentication to Admin Routes

```javascript
// Public routes - no auth
router.get("/public", catchAsync(async (req, res) => { ... }));

// Admin routes - add auth + requireAdmin
router.post("/", authenticate, requireAdmin, catchAsync(async (req, res) => { ... }));
router.put("/:id", authenticate, requireAdmin, catchAsync(async (req, res) => { ... }));
router.delete("/:id", authenticate, requireAdmin, catchAsync(async (req, res) => { ... }));
```

### 4. Add Validation

```javascript
router.post(
    "/",
    authenticate,
    requireAdmin,
    validate(createSomethingSchema),  // Add validation
    catchAsync(async (req, res) => { ... })
);
```

### 5. Use Custom Errors

```javascript
// Before
const data = await db.something.findById(id);
if (!data) {
    return res.status(404).json({ success: false, error: "Not found" });
}

// After
const data = await db.something.findById(id);
if (!data) {
    throw new NotFoundError("Resource name"); // Automatic 404 response
}
```

### 6. Return Proper Status Codes

```javascript
// GET - 200 (default)
res.json({ success: true, data });

// POST - 201 Created
res.status(201).json({ success: true, data });

// DELETE - 200 or 204
res.json({ success: true, message: "Deleted" });
```

## Routes Priority Order

Update routes in this order:

1. ✅ **feedback** (already done - use as template)
2. **announcements** (high traffic)
3. **officers** (admin updates)
4. **organizations** (admin updates)
5. **committees** (admin updates)
6. **financialTransactions** (sensitive data)
7. **issuances** (admin only)
8. **governanceDocuments** (admin only)
9. **siteContent** (admin only)
10. **pageContent** (admin only)
11. **stats** (usually public read-only)
12. **notifications** (check if needed)

## Testing Your Changes

After updating each route:

1. **Test public endpoints** (should work without token)

    ```bash
    curl http://localhost:5000/api/announcements
    ```

2. **Test protected endpoints without auth** (should return 401)

    ```bash
    curl -X POST http://localhost:5000/api/announcements \
      -H "Content-Type: application/json" \
      -d '{"title":"Test"}'
    # Should return: 401 Unauthorized
    ```

3. **Test protected endpoints with auth** (should work)

    ```bash
    curl -X POST http://localhost:5000/api/announcements \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer YOUR_TOKEN" \
      -d '{"title":"Test"}'
    ```

4. **Test validation** (should return 400 with details)
    ```bash
    curl -X POST http://localhost:5000/api/announcements \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer YOUR_TOKEN" \
      -d '{"title":""}' # Invalid - too short
    # Should return: 400 with validation errors
    ```

## Common Pitfalls

### ❌ Don't do this:

```javascript
// Wrong order - validate comes before auth
router.post("/", validate(schema), authenticate, catchAsync(...));

// Missing catchAsync
router.get("/", authenticate, async (req, res) => { ... });

// Using try-catch with catchAsync (redundant)
router.get("/", catchAsync(async (req, res) => {
    try { ... } catch { ... }  // Remove this
}));
```

### ✅ Do this:

```javascript
// Correct order: limiter -> auth -> validation -> handler
router.post(
    "/",
    rateLimiter, // 1. Rate limit first
    authenticate, // 2. Then authenticate
    requireAdmin, // 3. Then check authorization
    validate(schema), // 4. Then validate input
    catchAsync(handler) // 5. Finally handle request
);
```

## Need Help?

-   Check [feedback.js](./src/routes/feedback.js) for a complete example
-   Review [MIDDLEWARE_GUIDE.md](./MIDDLEWARE_GUIDE.md) for detailed docs
-   Look at schemas in [validation.js](./src/middleware/validation.js)
-   See error classes in [errors.js](./src/utils/errors.js)
