# Backend Middleware Guide

## Overview

The backend now includes production-ready middleware for:
- ✅ Input validation (Zod schemas)
- ✅ Error handling (centralized with custom error classes)
- ✅ Authentication (JWT verification with Supabase)
- ✅ Rate limiting (prevent abuse)
- ✅ Request logging (Morgan)
- ✅ Environment validation (fail fast on startup)

## 🔐 Authentication

### Protecting Routes

```javascript
import { authenticate, requireAdmin } from "../middleware/auth.js";

// Public route - no auth needed
router.get("/public", async (req, res) => { ... });

// Authenticated route - requires valid token
router.get("/protected", authenticate, async (req, res) => {
    // Access user via req.user
    console.log(req.user.email);
});

// Admin-only route - requires UNC email
router.post("/admin-only", authenticate, requireAdmin, async (req, res) => {
    // Only users with @unc.edu.ph email can access
});
```

### Frontend Usage

When making requests to protected endpoints, include the JWT token:

```javascript
const response = await fetch('http://localhost:5000/api/feedback', {
    headers: {
        'Authorization': `Bearer ${supabaseToken}`
    }
});
```

## ✅ Input Validation

### Using Existing Schemas

```javascript
import { validate } from "../middleware/validateRequest.js";
import { createFeedbackSchema } from "../middleware/validation.js";

router.post("/", validate(createFeedbackSchema), async (req, res) => {
    // req.body is now validated and sanitized
    const data = await db.feedback.create(req.body);
    res.json({ success: true, data });
});
```

### Creating Custom Schemas

Add to `backend/src/middleware/validation.js`:

```javascript
import { z } from "zod";

export const customSchema = z.object({
    body: z.object({
        field1: z.string().min(3).max(100),
        field2: z.number().positive(),
        field3: z.enum(["option1", "option2"]),
    }),
    params: z.object({
        id: z.string().uuid(),
    }),
});
```

### Validation Error Response

When validation fails, clients receive:

```json
{
    "success": false,
    "error": "Validation failed",
    "details": [
        {
            "field": "body.email",
            "message": "Invalid email address"
        }
    ]
}
```

## 🚦 Rate Limiting

### Available Limiters

```javascript
import {
    generalLimiter,    // 100 req/15min (applied to all /api routes)
    feedbackLimiter,   // 5 req/hour (for form submissions)
    adminLimiter,      // 200 req/15min (for admin routes)
    authLimiter,       // 5 attempts/15min (for login)
} from "../middleware/rateLimiter.js";

// Apply to specific route
router.post("/submit", feedbackLimiter, async (req, res) => { ... });
```

### Rate Limit Response

When limit is exceeded:

```json
{
    "success": false,
    "error": "Too many requests, please try again later"
}
```

Headers include:
- `X-RateLimit-Limit`: Max requests allowed
- `X-RateLimit-Remaining`: Requests remaining
- `X-RateLimit-Reset`: When limit resets

## 🎯 Error Handling

### Using catchAsync

No more try-catch blocks! Wrap your async route handlers:

```javascript
import { catchAsync } from "../middleware/errorHandler.js";

router.get("/", catchAsync(async (req, res) => {
    const data = await db.something.getAll();
    // Errors are automatically caught and handled
    res.json({ success: true, data });
}));
```

### Throwing Custom Errors

```javascript
import {
    NotFoundError,
    ValidationError,
    UnauthorizedError,
    ForbiddenError,
    ConflictError,
} from "../utils/errors.js";

router.get("/:id", catchAsync(async (req, res) => {
    const data = await db.something.findById(req.params.id);
    
    if (!data) {
        throw new NotFoundError("Item"); // Returns 404
    }
    
    res.json({ success: true, data });
}));
```

### Error Response Format

All errors return consistent format:

```json
{
    "success": false,
    "error": "Error message here"
}
```

In development, includes stack trace:

```json
{
    "success": false,
    "error": "Error message",
    "stack": "Error stack trace...",
    "details": { /* full error object */ }
}
```

## 📊 Logging

### Development Mode

Every request is logged:
```
GET /api/feedback 200 45.123 ms - 1234
POST /api/feedback 201 12.456 ms - 567
```

### Production Mode

Only errors (4xx, 5xx) are logged:
```
POST /api/feedback 400 10.123 ms - 234
DELETE /api/feedback/123 500 5.678 ms - 89
```

## 🔧 Environment Validation

On startup, the server validates required environment variables:

### Success:
```
✅ Environment variables validated
   Database type: supabase
🚀 Server running on http://localhost:5000
📊 Environment: development
💾 Database: supabase
```

### Failure:
```
❌ Missing required environment variables:
   - SUPABASE_URL
   - SUPABASE_SERVICE_KEY

Please check your .env file and try again.
```

Server exits immediately with clear error message.

## 📝 Example: Complete Protected Route

Here's a fully secured admin route with all middleware:

```javascript
import express from "express";
import { catchAsync } from "../middleware/errorHandler.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import { adminLimiter } from "../middleware/rateLimiter.js";
import { validate } from "../middleware/validateRequest.js";
import { createAnnouncementSchema } from "../middleware/validation.js";
import { NotFoundError } from "../utils/errors.js";

const router = express.Router();

router.post(
    "/",
    adminLimiter,              // Prevent abuse
    authenticate,              // Verify JWT token
    requireAdmin,              // Check UNC email
    validate(createAnnouncementSchema), // Validate input
    catchAsync(async (req, res) => {   // Handle errors
        const data = await db.announcements.create(req.body);
        res.status(201).json({ success: true, data });
    })
);

export default router;
```

## 🎨 Applying to Other Routes

To update other routes, follow the feedback.js example:

1. Import middleware at the top
2. Replace try-catch with `catchAsync`
3. Add authentication to admin routes
4. Add validation to routes with input
5. Add rate limiting to submission routes
6. Throw custom errors instead of generic ones

Example pattern:
```javascript
// Before
router.post("/", async (req, res) => {
    try {
        const data = await db.something.create(req.body);
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// After
router.post(
    "/",
    authenticate,
    requireAdmin,
    validate(createSchema),
    catchAsync(async (req, res) => {
        const data = await db.something.create(req.body);
        res.status(201).json({ success: true, data });
    })
);
```

## 🧪 Testing Protected Endpoints

### Get Supabase Token

```javascript
// In frontend AuthContext or testing script
const { data: { session } } = await supabase.auth.getSession();
const token = session.access_token;
```

### Make Authenticated Request

```bash
curl -X GET http://localhost:5000/api/feedback \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Test Rate Limiting

```bash
# Send 6 requests rapidly (limit is 5/hour for feedback)
for i in {1..6}; do
  curl -X POST http://localhost:5000/api/feedback \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"test@test.com","category":"suggestion","message":"Test message"}'
done
# 6th request should return 429 Too Many Requests
```

## 🚀 Production Checklist

Before deploying to production:

- [ ] Set `NODE_ENV=production` in environment
- [ ] Use strong `JWT_SECRET` (not the default)
- [ ] Configure CORS to allow only your frontend domain
- [ ] Set appropriate rate limits for your traffic
- [ ] Enable SSL/HTTPS
- [ ] Set up error monitoring (Sentry, LogRocket, etc.)
- [ ] Review and adjust rate limits based on usage
- [ ] Test all protected endpoints with authentication
- [ ] Verify admin routes are properly protected

## 📚 Further Improvements

Consider adding:
- Response caching (Redis)
- Request ID tracking
- Advanced logging (Winston)
- API documentation (Swagger)
- Performance monitoring
- Database query optimization
- Compression middleware
- Security headers (Helmet)
