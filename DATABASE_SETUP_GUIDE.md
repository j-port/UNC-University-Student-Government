# Database Setup Guide

## Overview

This guide explains the database setup structure for the UNC USG website.

## File Structure

### 1. `database_schema.sql` (926 lines)

**Purpose:** Complete production database schema  
**Use:** Run this file in Supabase SQL Editor to create all tables and policies

**Contains:**

-   ✅ 10 Tables: officers, organizations, committees, announcements, issuances, governance_documents, feedback, financial_transactions, site_content, page_content
-   ✅ Storage bucket: 'documents' with public access
-   ✅ 40+ Indexes for performance
-   ✅ Complete RLS policies (public read on published content, authenticated full CRUD)
-   ✅ Automated triggers for `updated_at` timestamps
-   ✅ Comprehensive documentation

**Usage:**

```sql
-- In Supabase SQL Editor, run:
-- File: database_schema.sql
```

### 2. `supabase_seed_data.sql` (260+ lines)

**Purpose:** Test/sample data for development  
**Use:** Run this AFTER database_schema.sql to populate with sample data

**Contains:**

-   8 Officers (Executive & Legislative)
-   6 Committees with heads
-   40+ Organizations (College Councils, Academic, Non-Academic, Greek Life)
-   Constitution articles (9 articles)
-   Bylaws (7 articles)
-   Site content (Hero stats, Core values, Achievements, Hero features)
-   Page content (About, Mission, Vision)
-   **5 Sample Announcements** (Events, Alerts, Accomplishments)
-   **3 Sample Issuances** (Resolution, Financial Report, Memorandum)
-   **3 Sample Feedback** submissions (various statuses)
-   **6 Sample Financial Transactions** (Revenue and expenses)

**Usage:**

```sql
-- After schema is created, run:
-- File: supabase_seed_data.sql
```

## Setup Instructions

### First Time Setup

1. **Create tables and policies:**

    - Open Supabase Dashboard → SQL Editor
    - Run `database_schema.sql`
    - Verify: 10 tables created, storage bucket exists

2. **Add sample data (optional for testing):**

    - Run `supabase_seed_data.sql`
    - Verify: Officers, committees, organizations populate

3. **Verify storage bucket:**
    - Go to Storage → Check 'documents' bucket exists
    - Policies: Public can read, authenticated can upload

### Development vs Production

**Development:**

-   Run both `database_schema.sql` AND `supabase_seed_data.sql`
-   Test with sample data before real content

**Production:**

-   Run ONLY `database_schema.sql`
-   Add real data through Admin interface

## Frontend Changes

### No More Mock Data ✅

The following files have been cleaned:

**Before:**

```jsx
// Had hardcoded sample arrays
const sampleAnnouncements = [...];
const sampleIssuances = [...];
const sampleTransactions = [...];

// Fallback to mock data
setAnnouncements(data?.length ? data : sampleAnnouncements);
```

**After:**

```jsx
// Clean empty states
setAnnouncements(data || []);
setIssuances(data || []);
setTransactions(data || []);
```

### Empty State Behavior

When database is empty:

-   **Bulletins page:** Shows "No announcements" / "No issuances"
-   **Transparency page:** Shows "No transactions" / "No reports"
-   **No confusing fake data**

## Table Descriptions

| Table                  | Purpose                                   | Key Fields                           |
| ---------------------- | ----------------------------------------- | ------------------------------------ |
| officers               | USG officers and their positions          | name, position, branch, image_url    |
| organizations          | Student organizations                     | name, type, college, abbreviation    |
| committees             | USG committees                            | name, head_name, member_count        |
| announcements          | Public announcements                      | title, content, category, status     |
| issuances              | Official documents (resolutions, reports) | title, type, file_url                |
| governance_documents   | Constitution & bylaws                     | type, article_number, content        |
| feedback               | TINIG DINIG system                        | email, message, status, is_anonymous |
| financial_transactions | Transparency reports                      | date, description, amount, category  |
| site_content           | Dynamic content sections                  | section, key, value, metadata        |
| page_content           | Full page management                      | page_slug, title, content            |

## Storage

**Bucket:** `documents`  
**Policies:**

-   ✅ Public can SELECT (download/view)
-   ✅ Authenticated users can INSERT (upload)
-   ✅ Authenticated users can UPDATE (modify)
-   ✅ Authenticated users can DELETE (remove)

**Accepted Formats:** PDF, DOC, DOCX, XLS, XLSX  
**Max Size:** 10MB per file

## RLS Policies Summary

### Public Access (SELECT only):

-   Published announcements
-   Published issuances
-   Public financial transactions
-   Site content
-   Page content
-   Officers
-   Organizations
-   Committees
-   Governance documents

### Admin Access (Full CRUD):

-   All tables (when authenticated)
-   Must be logged in via Admin interface

## Troubleshooting

### Issue: Empty pages showing nothing

**Solution:** This is correct behavior with no data. Add content via Admin interface or run seed data.

### Issue: Can't upload files

**Solution:**

1. Check storage bucket 'documents' exists
2. Verify you're logged in as admin
3. Check file size (<10MB) and format (PDF, DOC, DOCX, XLS, XLSX)

### Issue: RLS policies blocking access

**Solution:**

1. Re-run `database_schema.sql` to reset policies
2. Verify you're logged in for admin operations
3. Check Supabase Auth logs

## Migration from Old Setup

If you have old schema files:

-   ❌ `supabase_schema_setup.sql` - REPLACED by database_schema.sql
-   ❌ `supabase_feedback_setup.sql` - MERGED into database_schema.sql
-   ❌ `supabase_storage_setup.sql` - MERGED into database_schema.sql
-   ✅ `supabase_seed_data.sql` - Keep for testing
-   ✅ `supabase_announcements_seed.sql` - Keep if needed

**Action:** You can safely delete the old schema files. Everything is now in `database_schema.sql`.

## Next Steps

1. ✅ Run `database_schema.sql` in Supabase
2. ✅ (Optional) Run `supabase_seed_data.sql` for test data
3. ✅ Test frontend with empty database (should show clean empty states)
4. ✅ Log in to Admin panel and start adding real content
5. ✅ Verify financial reports sync between Admin and Transparency page

## File Organization

```
Root/
├── database_schema.sql          ← PRODUCTION SCHEMA (run first)
├── supabase_seed_data.sql       ← TEST DATA (run second, optional)
├── supabase_announcements_seed.sql  ← Additional sample announcements
├── DATABASE_SETUP_GUIDE.md      ← This file
└── frontend/
    └── src/
        └── pages/
            ├── Bulletins.jsx            ← No mock data ✅
            ├── Transparency.jsx         ← No mock data ✅
            └── AnnouncementDetail.jsx   ← New detail page ✅
```

## Summary

✅ **Schema Unified:** One file for all tables, indexes, policies, triggers  
✅ **Test Data Separated:** Sample data in dedicated file  
✅ **No Mock Data:** Frontend shows clean empty states  
✅ **Ready for Production:** Run one SQL file and you're live  
✅ **Easy Testing:** Add seed data when needed for development
