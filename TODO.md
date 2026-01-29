# 🚧 UNC Student Government Website - TODO & Missing Features

> **Last Updated:** January 1, 2026  
> **Project Status:** Feature Complete (Development) → Needs Production Preparation  
> **Overall Completion:** 70%

This document outlines all missing features, incomplete implementations, and tasks that need to be completed before production deployment. Developers should prioritize items based on the urgency levels indicated.

---

## 📋 Table of Contents

1. [Critical - Production Requirements](#-critical---production-requirements)
2. [High Priority - Core Features](#-high-priority---core-features)
3. [Medium Priority - Enhancements](#-medium-priority---enhancements)
4. [Low Priority - Nice to Have](#-low-priority---nice-to-have)
5. [Frontend Static Content Issues](#-frontend-static-content-issues)
6. [Backend Improvements](#-backend-improvements)
7. [Testing & Quality Assurance](#-testing--quality-assurance)
8. [Documentation Updates](#-documentation-updates)

---

## 🔴 Critical - Production Requirements

### 1. Production Environment Configuration

**Priority:** CRITICAL  
**Estimated Time:** 2-3 days  
**Assignee:** DevOps Team / Backend Developer

#### Backend Configuration

```bash
# Environment Variables to Set
NODE_ENV=production
JWT_SECRET=<generate-strong-secret-minimum-32-characters>
CORS_ORIGIN=https://yourdomain.com  # Replace with actual frontend URL
PORT=5000

# Database Configuration
DB_TYPE=supabase  # or postgres
SUPABASE_URL=<production-supabase-url>
SUPABASE_SERVICE_KEY=<production-service-key>
# OR for PostgreSQL
POSTGRES_HOST=<production-host>
POSTGRES_DB=<production-db>
POSTGRES_USER=<production-user>
POSTGRES_PASSWORD=<strong-password>
POSTGRES_SSL=true
```

#### Frontend Configuration

```bash
# .env.production
VITE_API_URL=https://api.yourdomain.com/api  # Production backend URL
VITE_SUPABASE_URL=<production-supabase-url>
VITE_SUPABASE_ANON_KEY=<production-anon-key>
```

#### Tasks

-   [ ] Generate strong JWT secret (use: `openssl rand -base64 32`)
-   [ ] Configure CORS to allow only production domain
-   [ ] Set up production database (Supabase/PostgreSQL)
-   [ ] Configure SSL/TLS certificates
-   [ ] Set up environment variables on hosting platform
-   [ ] Test environment variable loading
-   [ ] Enable production logging level
-   [ ] Configure rate limiting for production traffic

**Files to Modify:**

-   `backend/.env`
-   `frontend/.env.production`
-   `backend/src/index.js` (CORS configuration)

---

### 2. Security Hardening

**Priority:** CRITICAL  
**Estimated Time:** 1-2 days  
**Assignee:** Backend Developer

#### Security Headers (Helmet)

```bash
npm install helmet --save
```

**Implementation:**

```javascript
// backend/src/index.js
import helmet from "helmet";

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", "data:", "https:"],
            },
        },
    })
);
```

#### Tasks

-   [ ] Install and configure Helmet.js
-   [ ] Add security headers (CSP, HSTS, X-Frame-Options)
-   [ ] Implement request size limits (already done: 10mb)
-   [ ] Add XSS protection middleware
-   [ ] Configure HTTPS redirect in production
-   [ ] Review and adjust rate limiting thresholds
-   [ ] Add IP-based blocking for repeated abuse
-   [ ] Implement CAPTCHA for feedback form (prevent spam)

**Files to Create/Modify:**

-   `backend/src/middleware/security.js` (new)
-   `backend/src/index.js`
-   `frontend/src/pages/Feedback.jsx`

---

### 3. Error Monitoring & Logging

**Priority:** CRITICAL  
**Estimated Time:** 2 days  
**Assignee:** Backend Developer

#### Recommended Services

-   **Sentry** - Error tracking
-   **LogRocket** - Frontend monitoring
-   **DataDog** / **New Relic** - APM (Application Performance Monitoring)

#### Implementation

```bash
# Backend
npm install @sentry/node @sentry/tracing --save

# Frontend
npm install @sentry/react @sentry/tracing --save
```

**Backend Setup:**

```javascript
// backend/src/config/sentry.js
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";

export function initSentry(app) {
    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        environment: process.env.NODE_ENV,
        tracesSampleRate: 1.0,
    });

    app.use(Sentry.Handlers.requestHandler());
    app.use(Sentry.Handlers.tracingHandler());
}
```

#### Tasks

-   [ ] Create Sentry account and get DSN
-   [ ] Integrate Sentry into backend
-   [ ] Integrate Sentry into frontend
-   [ ] Set up error alerting (email/Slack)
-   [ ] Configure log aggregation service
-   [ ] Set up performance monitoring
-   [ ] Create error handling dashboard
-   [ ] Test error reporting in staging

**Files to Create:**

-   `backend/src/config/sentry.js`
-   `frontend/src/config/sentry.js`

---

## 🟠 High Priority - Core Features

### 4. File Upload System

**Priority:** HIGH  
**Estimated Time:** 3-5 days  
**Assignee:** Full Stack Developer

#### Current Status

Multiple features reference file URLs but upload functionality is NOT implemented:

-   Feedback attachments (`attachment_url`)
-   Officer profile images (`image_url`)
-   Governance documents (`file_url`, `file_name`)
-   Financial transaction receipts (`receipt_url`)

#### Option 1: Supabase Storage (Recommended)

**Why:** Already using Supabase, free tier generous, built-in CDN

```bash
# No installation needed - Supabase client already installed
```

**Backend Implementation:**

```javascript
// backend/src/routes/upload.js
import express from "express";
import multer from "multer";
import { authenticate } from "../middleware/auth.js";
import { supabase } from "../config/supabaseClient.js";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "application/pdf",
        ];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type"));
        }
    },
});

router.post(
    "/upload",
    authenticate,
    upload.single("file"),
    async (req, res) => {
        const file = req.file;
        const bucket = req.body.bucket || "general"; // general, officers, documents, receipts

        const fileName = `${Date.now()}-${file.originalname}`;

        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
            });

        if (error) throw error;

        const { data: urlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(fileName);

        res.json({ success: true, url: urlData.publicUrl });
    }
);
```

**Frontend Implementation:**

```jsx
// frontend/src/components/FileUpload.jsx
import { useState } from "react";
import { Upload, X, FileIcon } from "lucide-react";

export default function FileUpload({
    onUpload,
    accept = "image/*",
    maxSize = 5,
}) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate size
        if (file.size > maxSize * 1024 * 1024) {
            alert(`File too large. Max size: ${maxSize}MB`);
            return;
        }

        // Create preview for images
        if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (e) => setPreview(e.target.result);
            reader.readAsDataURL(file);
        }

        // Upload file
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );
            const data = await response.json();
            onUpload(data.url);
        } catch (error) {
            console.error("Upload error:", error);
            alert("Upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-2">
            <label className="block">
                <input
                    type="file"
                    accept={accept}
                    onChange={handleFileChange}
                    className="hidden"
                />
                <div className="btn-secondary cursor-pointer inline-flex items-center space-x-2">
                    <Upload className="w-4 h-4" />
                    <span>{uploading ? "Uploading..." : "Choose File"}</span>
                </div>
            </label>
            {preview && (
                <div className="relative inline-block">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded"
                    />
                    <button
                        onClick={() => setPreview(null)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
```

#### Tasks

-   [ ] Create Supabase Storage buckets:
    -   `officers` (public, 5MB limit, images only)
    -   `documents` (public, 10MB limit, PDFs)
    -   `receipts` (admin-only, 10MB limit, images/PDFs)
    -   `feedback-attachments` (private, 5MB limit, images/PDFs)
-   [ ] Install `multer` for file handling: `npm install multer`
-   [ ] Create upload endpoint (`/api/upload`)
-   [ ] Implement file validation (size, type, malware scan)
-   [ ] Create `FileUpload` component (frontend)
-   [ ] Integrate file upload into:
    -   [ ] Feedback form
    -   [ ] Admin Officer management
    -   [ ] Admin Governance Documents
    -   [ ] Admin Financial Transactions
-   [ ] Add file deletion endpoint
-   [ ] Implement storage quota monitoring
-   [ ] Add image optimization (Sharp/Cloudinary)
-   [ ] Create file preview functionality

**Files to Create:**

-   `backend/src/routes/upload.js`
-   `backend/src/middleware/fileValidation.js`
-   `frontend/src/components/FileUpload.jsx`
-   `frontend/src/utils/fileHelpers.js`

**Files to Modify:**

-   `backend/src/index.js` (add upload route)
-   `frontend/src/pages/Feedback.jsx`
-   `frontend/src/pages/admin/AdminOrgChart.jsx`
-   `frontend/src/pages/admin/AdminReports.jsx`

---

### 5. Email Notification System

**Priority:** HIGH  
**Estimated Time:** 3-4 days  
**Assignee:** Backend Developer

#### Current Status

NO email functionality implemented. Users don't receive:

-   Feedback submission confirmations
-   Feedback status update notifications
-   Reference number emails

#### Recommended Service

**Resend** (recommended) or **SendGrid** or **AWS SES**

```bash
npm install resend --save
```

**Implementation:**

```javascript
// backend/src/services/emailService.js
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const emailService = {
    async sendFeedbackConfirmation(feedback) {
        await resend.emails.send({
            from: "UNC USG <noreply@yourdomain.com>",
            to: feedback.email,
            subject: `Feedback Received - ${feedback.reference_number}`,
            html: `
                <h2>Thank you for your feedback!</h2>
                <p>Your feedback has been received and assigned reference number:</p>
                <h3>${feedback.reference_number}</h3>
                <p>Use this number to track your feedback status.</p>
                <p><strong>Subject:</strong> ${feedback.subject}</p>
                <p><strong>Category:</strong> ${feedback.category}</p>
                <p>Track your feedback: https://yourdomain.com/feedback</p>
            `,
        });
    },

    async sendStatusUpdate(feedback, oldStatus, newStatus) {
        await resend.emails.send({
            from: "UNC USG <noreply@yourdomain.com>",
            to: feedback.email,
            subject: `Feedback Status Updated - ${feedback.reference_number}`,
            html: `
                <h2>Your Feedback Status Has Been Updated</h2>
                <p><strong>Reference:</strong> ${feedback.reference_number}</p>
                <p><strong>Status:</strong> ${oldStatus} → ${newStatus}</p>
                ${
                    feedback.admin_response
                        ? `<p><strong>Response:</strong> ${feedback.admin_response}</p>`
                        : ""
                }
            `,
        });
    },

    async notifyAdminNewFeedback(feedback) {
        const adminEmail =
            process.env.ADMIN_NOTIFICATION_EMAIL || "admin@unc.edu.ph";
        await resend.emails.send({
            from: "UNC USG <noreply@yourdomain.com>",
            to: adminEmail,
            subject: `New Feedback Submission - ${feedback.category}`,
            html: `
                <h2>New Feedback Received</h2>
                <p><strong>Reference:</strong> ${feedback.reference_number}</p>
                <p><strong>From:</strong> ${feedback.name} (${feedback.email})</p>
                <p><strong>Category:</strong> ${feedback.category}</p>
                <p><strong>Subject:</strong> ${feedback.subject}</p>
                <p>View in admin panel: https://yourdomain.com/admin/feedback</p>
            `,
        });
    },
};
```

#### Tasks

-   [ ] Create Resend account (or SendGrid/SES)
-   [ ] Get API key and add to `.env`
-   [ ] Create email templates
-   [ ] Implement email service class
-   [ ] Integrate emails into feedback submission
-   [ ] Integrate emails into status updates
-   [ ] Add admin email notifications
-   [ ] Create unsubscribe functionality
-   [ ] Test email deliverability
-   [ ] Set up email queue (Bull + Redis) for reliability
-   [ ] Add retry logic for failed emails
-   [ ] Create email logs table

**Files to Create:**

-   `backend/src/services/emailService.js`
-   `backend/src/templates/emails/` (folder for HTML templates)

**Files to Modify:**

-   `backend/src/routes/feedback.js`
-   `backend/.env` (add RESEND_API_KEY)

---

### 6. Search & Pagination Implementation

**Priority:** HIGH  
**Estimated Time:** 2-3 days  
**Assignee:** Full Stack Developer

#### Current Issues

-   All endpoints return ALL records (no pagination)
-   No full-text search functionality
-   Performance issues with large datasets
-   Frontend doesn't have advanced search

#### Backend Implementation

```javascript
// backend/src/middleware/pagination.js
export const paginate = (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    req.pagination = { page, limit, offset };
    next();
};

// backend/src/repositories/SupabaseRepository.js
async findAll(options = {}) {
    const {
        filters = {},
        orderBy = 'created_at',
        order = 'desc',
        limit = 20,
        offset = 0,
        search = null,
        searchFields = []
    } = options;

    let query = this.client.from(this.tableName).select('*', { count: 'exact' });

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
    });

    // Apply search
    if (search && searchFields.length > 0) {
        const searchConditions = searchFields.map(field =>
            `${field}.ilike.%${search}%`
        ).join(',');
        query = query.or(searchConditions);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    // Apply ordering
    query = query.order(orderBy, { ascending: order === 'asc' });

    const { data, error, count } = await query;

    if (error) throw error;

    return {
        data,
        pagination: {
            total: count,
            page: Math.floor(offset / limit) + 1,
            limit,
            totalPages: Math.ceil(count / limit)
        }
    };
}
```

#### Frontend Implementation

```jsx
// frontend/src/components/Pagination.jsx
export default function Pagination({ currentPage, totalPages, onPageChange }) {
    return (
        <div className="flex items-center justify-center space-x-2 mt-8">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn-secondary disabled:opacity-50">
                <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-school-grey-700">
                Page {currentPage} of {totalPages}
            </span>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="btn-secondary disabled:opacity-50">
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
}
```

#### Tasks

-   [ ] Add pagination to all repository methods
-   [ ] Create pagination middleware
-   [ ] Update all API endpoints to support pagination
-   [ ] Add search query parameters to endpoints
-   [ ] Implement full-text search (PostgreSQL FTS)
-   [ ] Create Pagination component (frontend)
-   [ ] Add pagination to:
    -   [ ] Bulletins/Announcements page
    -   [ ] Admin Feedback page
    -   [ ] Admin Announcements page
    -   [ ] Transparency page
    -   [ ] Admin Financial Transactions
-   [ ] Add advanced filters UI
-   [ ] Implement sort functionality

**Files to Create:**

-   `backend/src/middleware/pagination.js`
-   `frontend/src/components/Pagination.jsx`
-   `frontend/src/components/SearchBar.jsx`

**Files to Modify:**

-   All repository files
-   All route files
-   Frontend list pages

---

## 🟡 Medium Priority - Enhancements

### 7. Admin Features Completion

**Priority:** MEDIUM  
**Estimated Time:** 4-5 days  
**Assignee:** Frontend Developer

#### AdminSettings Page

**Current Status:** Page exists but only has logout button

```jsx
// frontend/src/pages/admin/AdminSettings.jsx
// TODO: Implement these sections:

<section>
  <h3>Profile Settings</h3>
  {/* Change name, email */}
</section>

<section>
  <h3>Password Change</h3>
  {/* Change password form */}
</section>

<section>
  <h3>Notification Preferences</h3>
  {/* Email notification toggles */}
</section>

<section>
  <h3>System Settings</h3>
  {/* Rate limits, API keys (super admin only) */}
</section>
```

#### AdminReports Page

**Current Status:** Basic layout, missing export functionality

#### Tasks

-   [ ] Complete AdminSettings page
-   [ ] Add profile editing
-   [ ] Implement password change
-   [ ] Add notification preferences
-   [ ] Implement PDF export (use `jspdf` or `pdfmake`)
-   [ ] Add CSV export functionality
-   [ ] Create report generation UI
-   [ ] Add date range pickers
-   [ ] Implement chart visualizations (Chart.js or Recharts)
-   [ ] Add filtering options to reports

**Files to Modify:**

-   `frontend/src/pages/admin/AdminSettings.jsx`
-   `frontend/src/pages/admin/AdminReports.jsx`

---

### 8. Testing Coverage

**Priority:** MEDIUM  
**Estimated Time:** 5-7 days  
**Assignee:** QA Developer / Full Stack

#### Current Status

-   ✅ Repository tests (8/8 passing)
-   ❌ Integration tests (missing)
-   ❌ Frontend tests (missing)
-   ❌ E2E tests (missing)

#### Tasks

**Backend Testing:**

-   [ ] Write integration tests for all 11 routes
-   [ ] Test authentication flows
-   [ ] Test error handling
-   [ ] Test rate limiting
-   [ ] Test file uploads
-   [ ] Test email sending
-   [ ] Achieve 80%+ code coverage

**Frontend Testing:**

-   [ ] Install React Testing Library
-   [ ] Write component tests for:
    -   [ ] Navbar
    -   [ ] Footer
    -   [ ] Hero
    -   [ ] Forms (Feedback, Admin forms)
    -   [ ] Modals
-   [ ] Test custom hooks
-   [ ] Test API integration

**E2E Testing:**

-   [ ] Install Playwright or Cypress
-   [ ] Write E2E tests for:
    -   [ ] User journey: Home → Feedback submission
    -   [ ] Admin journey: Login → Manage feedback
    -   [ ] Authentication flows
    -   [ ] CRUD operations

**Files to Create:**

-   `backend/src/__tests__/integration/` (folder)
-   `frontend/src/__tests__/` (folder)
-   `e2e/` (folder at root)

---

## 🟢 Low Priority - Nice to Have

### 9. Performance Optimizations

**Priority:** LOW  
**Estimated Time:** 3-4 days

#### Tasks

-   [ ] Implement Redis caching
-   [ ] Add database query optimization
-   [ ] Enable compression middleware (gzip)
-   [ ] Implement code splitting (React)
-   [ ] Add lazy loading for routes
-   [ ] Optimize images (Sharp/Cloudinary)
-   [ ] Add service worker for offline support
-   [ ] Implement CDN for static assets

---

### 10. Additional Features

**Priority:** LOW  
**Estimated Time:** Variable

#### Real-time Features

-   [ ] WebSocket integration for live updates
-   [ ] Real-time notification system
-   [ ] Live chat support widget

#### User Features

-   [ ] Student user profiles
-   [ ] Feedback voting system
-   [ ] Comment system for announcements
-   [ ] Event calendar integration
-   [ ] Newsletter subscription

#### Admin Features

-   [ ] Bulk operations (delete/update multiple)
-   [ ] Content scheduling (publish at specific time)
-   [ ] Audit logs (track all admin actions)
-   [ ] Advanced role-based access control

---

## 🎨 Frontend Static Content Issues

### Critical Static Content (Needs to be Dynamic)

#### 1. Constitution Page (`frontend/src/pages/Constitution.jsx`)

**Current Status:** ❌ **COMPLETELY STATIC** - All content hardcoded

**Problem:**

```jsx
const articles = [
    { number: "I", title: "Name and Domicile", content: "..." },
    { number: "II", title: "Declaration of Principles", content: "..." },
    // ... all hardcoded
];
```

**Solution Required:**

```jsx
// Should fetch from API:
// GET /api/governanceDocuments?type=constitution

useEffect(() => {
    const fetchConstitution = async () => {
        const response = await governanceDocumentsAPI.getAll({
            type: "constitution",
            status: "published",
        });
        setArticles(response.data);
    };
    fetchConstitution();
}, []);
```

**Tasks:**

-   [ ] Create database table structure for constitution articles
-   [ ] Add API endpoint to fetch constitution
-   [ ] Create admin interface to edit constitution
-   [ ] Update Constitution.jsx to fetch from API
-   [ ] Add rich text editor for article content

---

#### 2. Bylaws Page (`frontend/src/pages/Bylaws.jsx`)

**Current Status:** ❌ **COMPLETELY STATIC** - All bylaws hardcoded

**Problem:**

```jsx
const bylaws = [
  { number: '1', title: 'Meetings and Quorum', sections: [...] },
  { number: '2', title: 'Order of Business', sections: [...] },
  // ... all hardcoded
];
```

**Solution Required:** Same as Constitution - fetch from API

**Tasks:**

-   [ ] Add bylaws to governanceDocuments with type='bylaws'
-   [ ] Update Bylaws.jsx to fetch from API
-   [ ] Create admin interface to edit bylaws

---

#### 3. About Page - Partial Static Content

**Current Status:** ⚠️ **PARTIALLY DYNAMIC**

**What's Dynamic (✅):**

-   Core values (from database via `useSiteContent`)
-   Statistics (from database via `useAutomatedStats`)
-   Hero images (from database)

**What's Still Static (❌):**

```jsx
// About page line 51-54
const defaultAchievements = [
    "Successfully advocated for extended library hours",
    "Implemented comprehensive student feedback system",
    "Organized campus-wide wellness programs",
];

// About page mission/vision text (lines 220-250)
<p>
    To serve as the official representative voice of the student body...
    {/* Hardcoded text */}
</p>;
```

**Tasks:**

-   [ ] Move achievements to database (site_content table)
-   [ ] Move mission/vision to database (page_content table)
-   [ ] Update About.jsx to fetch all content dynamically

---

#### 4. Governance Page - Static Cards

**Current Status:** ❌ **STATIC** - Navigation items hardcoded

**Problem:**

```jsx
const governanceItems = [
    {
        icon: BookOpen,
        title: "USG Constitution",
        description: "The fundamental document...",
        path: "/governance/constitution",
        color: "bg-blue-500",
    },
    // ... hardcoded items
];
```

**Why This Matters:** If you add new governance documents, they won't appear here.

**Tasks:**

-   [ ] Consider if this should be dynamic (LOW priority)
-   [ ] OR keep static if governance structure is fixed

---

#### 5. Home Page - Fully Dynamic (✅ Already Done)

**Status:** ✅ **FULLY DYNAMIC**

All content loaded from database:

-   Hero stats
-   Home stats (with auto-calculated values)
-   Core values
-   About section
-   Features

**No Action Needed** - This is implemented correctly!

---

### Static Images & Placeholders

#### Image URLs Using Unsplash (Should Use Local/Supabase)

**Files with Unsplash images:**

-   `frontend/src/pages/About.jsx` (lines 182, 290)
    ```jsx
    src = "https://images.unsplash.com/photo-...";
    ```

**Tasks:**

-   [ ] Replace Unsplash URLs with actual UNC photos
-   [ ] Upload real photos to Supabase Storage
-   [ ] OR make image URLs dynamic from database

---

## 🔧 Backend Improvements

### Database Optimization

**Priority:** MEDIUM  
**Estimated Time:** 2 days

#### Tasks

-   [ ] Add missing database indexes:
    ```sql
    CREATE INDEX idx_feedback_status ON feedback(status);
    CREATE INDEX idx_feedback_created ON feedback(created_at DESC);
    CREATE INDEX idx_announcements_published ON announcements(status, created_at DESC);
    CREATE INDEX idx_transactions_date ON financial_transactions(date DESC);
    ```
-   [ ] Implement database connection pooling
-   [ ] Add query performance monitoring
-   [ ] Create database backup strategy
-   [ ] Optimize slow queries

---

### API Documentation Completion

**Priority:** MEDIUM  
**Estimated Time:** 1 day

#### Current Status

Swagger docs exist but could be improved

#### Tasks

-   [ ] Add request/response examples to all endpoints
-   [ ] Document all error codes
-   [ ] Add authentication flow documentation
-   [ ] Create Postman collection
-   [ ] Add API versioning strategy

---

## ✅ Testing & Quality Assurance

### Manual Testing Checklist

Before production deployment, test:

#### Public Features

-   [ ] Homepage loads correctly
-   [ ] All navigation links work
-   [ ] Bulletins page displays announcements
-   [ ] Feedback form submission works
-   [ ] Feedback tracking works
-   [ ] Transparency page loads financial data
-   [ ] About page displays correctly
-   [ ] Constitution/Bylaws are readable
-   [ ] Org Chart displays officers
-   [ ] Mobile responsive on all pages

#### Admin Features

-   [ ] Admin login works
-   [ ] Dashboard displays stats
-   [ ] Can create/edit/delete announcements
-   [ ] Can respond to feedback
-   [ ] Can update feedback status
-   [ ] Can manage officers
-   [ ] Can manage site content
-   [ ] Can view reports

#### Security

-   [ ] Non-admin cannot access admin routes
-   [ ] Invalid tokens are rejected
-   [ ] Rate limiting works
-   [ ] CORS blocks unauthorized origins
-   [ ] SQL injection attempts blocked
-   [ ] XSS attempts sanitized

---

## 📚 Documentation Updates

### Documentation That Needs Updates

#### Tasks

-   [ ] Update README with production setup
-   [ ] Add deployment guide (Vercel + Railway/Render)
-   [ ] Document environment variables
-   [ ] Create API documentation for third-party devs
-   [ ] Add troubleshooting guide
-   [ ] Document backup and disaster recovery
-   [ ] Create runbook for common operations
-   [ ] Add architecture diagrams

**Files to Create (These don't exist yet - part of the TODO):**

-   `docs/DEPLOYMENT_GUIDE.md` - Step-by-step deployment instructions
-   `docs/PRODUCTION_CHECKLIST.md` - Pre-launch verification checklist
-   `docs/API_REFERENCE.md` - Complete API reference for third-party developers
-   `docs/TROUBLESHOOTING.md` - Common issues and solutions

---

## 📊 Progress Tracking

### Completion Status by Category

| Category          | Tasks   | Completed | Progress |
| ----------------- | ------- | --------- | -------- |
| Production Config | 8       | 0         | 0%       |
| Security          | 8       | 0         | 0%       |
| Monitoring        | 8       | 0         | 0%       |
| File Upload       | 15      | 0         | 0%       |
| Email System      | 12      | 0         | 0%       |
| Search/Pagination | 15      | 0         | 0%       |
| Admin Features    | 10      | 3         | 30%      |
| Testing           | 20      | 8         | 40%      |
| Static Content    | 8       | 0         | 0%       |
| Performance       | 8       | 0         | 0%       |
| **Total**         | **112** | **11**    | **10%**  |

---

## 🚀 Recommended Implementation Order

### Week 1: Production Preparation

1. Production environment configuration
2. Security hardening (Helmet, HTTPS)
3. Error monitoring setup (Sentry)

### Week 2: Critical Features

1. File upload system
2. Email notifications
3. Search & pagination

### Week 3: Testing & Polish

1. Integration tests
2. Frontend tests
3. Fix static content issues

### Week 4: Enhancement & Launch

1. Admin features completion
2. Performance optimization
3. Final testing & deployment

---

## 👥 Team Assignments (Suggested)

### Backend Developer

-   Production configuration
-   File upload system
-   Email system
-   Search & pagination (backend)
-   Integration tests
-   Security hardening

### Frontend Developer

-   Static content → dynamic
-   Admin features completion
-   Frontend tests
-   File upload UI
-   Search & pagination UI

### Full Stack Developer

-   Email system integration
-   Advanced features
-   Performance optimization
-   E2E testing

### DevOps Engineer

-   Monitoring setup
-   CI/CD pipeline
-   Database optimization
-   Deployment automation

---

## 📝 Notes for New Developers

### Quick Start for Contributing

1. **Read the documentation first:**

    - [README.md](README.md) - Project overview
    - [docs/README.md](docs/README.md) - Documentation index
    - [backend/README.md](backend/README.md) - Backend setup
    - [docs/MIDDLEWARE_GUIDE.md](docs/MIDDLEWARE_GUIDE.md) - Security implementation

2. **Set up your environment:**

    ```bash
    # Clone and install
    git clone https://github.com/j-port/UNC-University-Student-Government.git
    cd UNC-University-Student-Government

    # Backend
    cd backend
    npm install
    cp .env.example .env  # Configure your .env
    npm run dev

    # Frontend (new terminal)
    cd frontend
    npm install
    cp .env.example .env  # Configure your .env
    npm run dev
    ```

3. **Before starting a task:**

    - Check if someone is already working on it
    - Read related documentation
    - Look at existing code patterns
    - Ask questions in team chat

4. **Code standards:**

    - Follow existing code style
    - Write tests for new features
    - Update documentation
    - Use meaningful commit messages

5. **Testing your changes:**
    - Test locally before committing
    - Run existing tests: `npm test`
    - Test on mobile devices
    - Check browser console for errors

---

## 🆘 Getting Help

-   **API Documentation:** See [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)
-   **Database Setup:** See [docs/DATABASE_SETUP_GUIDE.md](docs/DATABASE_SETUP_GUIDE.md)
-   **Middleware & Security:** See [docs/MIDDLEWARE_GUIDE.md](docs/MIDDLEWARE_GUIDE.md)
-   **Testing Guide:** See [docs/TESTING_GUIDE.md](docs/TESTING_GUIDE.md)
-   **Notifications:** See [docs/NOTIFICATION_SYSTEM.md](docs/NOTIFICATION_SYSTEM.md)
-   **Quick Reference:** See [docs/QUICK_REFERENCE.md](docs/QUICK_REFERENCE.md)
-   **Team Chat:** [Insert your team communication channel]
-   **Project Manager:** [Insert contact]

> **Note:** `TROUBLESHOOTING.md`, `DEPLOYMENT_GUIDE.md`, and `API_REFERENCE.md` are listed in the documentation tasks above and need to be created.

---

**Last Updated:** January 1, 2026  
**Maintained By:** Development Team  
**Questions?** Contact the project maintainer

---

> 💡 **Tip:** Keep this document updated as tasks are completed. Check off items and update progress regularly!
