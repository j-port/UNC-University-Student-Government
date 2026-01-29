# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added - Backend Modernization & Security (2025-01-31)

#### Backend Architecture Improvements

-   **Database Abstraction Layer** - Factory pattern for switching between Supabase and PostgreSQL
    -   Created `BaseRepository` abstract class for repository pattern
    -   Implemented `SupabaseRepository` and `PostgresRepository` concrete classes
    -   Database switching via `DB_TYPE` environment variable (no code changes needed)
    -   Consistent API across all 9 repository classes
-   **Security Middleware Stack**
    -   JWT authentication with Supabase integration
    -   Role-based authorization (requireAdmin, optionalAuth)
    -   Request validation using Zod schemas (20+ validators)
    -   Rate limiting (4 configurations: general, feedback, admin, auth)
    -   Centralized error handling with custom error classes
-   **API Documentation**
    -   Swagger/OpenAPI 3.0 integration
    -   Interactive API docs at `/api/docs`
    -   JSDoc annotations on all 11 routes
    -   Authentication testing support in Swagger UI
-   **Testing Framework**
    -   Jest testing framework configured
    -   8/8 repository tests passing
    -   Test utilities and mocks for all repositories
    -   ES modules support with proper configuration

#### API Endpoints Enhanced

All 11 routes updated with full middleware stack:

-   `/api/announcements` - Announcements CRUD with validation
-   `/api/committees` - Committee management
-   `/api/feedback` - Feedback submission with rate limiting
-   `/api/financialTransactions` - Financial transparency
-   `/api/governanceDocuments` - Document management
-   `/api/issuances` - Issuances and resolutions
-   `/api/notifications` - Admin notifications
-   `/api/officers` - Officer profiles
-   `/api/organizations` - Organization management
-   `/api/pageContent` - Dynamic page content
-   `/api/siteContent` - Site-wide content

#### Security Features

-   **JWT Authentication**: All protected routes require valid Supabase JWT tokens
-   **Admin Authorization**: Admin routes require `@unc.edu.ph` email domain
-   **Input Validation**: All requests validated with Zod schemas before processing
-   **Rate Limiting**:
    -   General API: 100 requests per 15 minutes
    -   Feedback: 5 requests per hour
    -   Admin: 200 requests per 15 minutes
    -   Auth: 5 requests per 15 minutes
-   **SQL Injection Protection**: Parameterized queries in PostgreSQL repository
-   **Error Handling**: Consistent error responses, stack traces hidden in production

#### Frontend Integration

-   Updated `api.js` to automatically include JWT tokens from Supabase session
-   Authentication flow: User logs in → Frontend gets JWT → API validates JWT → Request processed
-   All API calls now authenticated when user is logged in
-   Seamless integration between frontend and backend security

#### Documentation Updates

-   Comprehensive backend README with setup instructions
-   Middleware guide with code examples
-   API documentation guide for adding Swagger docs
-   Testing guide with best practices
-   Database setup guide for both Supabase and PostgreSQL
-   Documentation cleanup - removed 5 redundant temporary files
-   Updated main README with consolidated quick start guide
-   Created comprehensive documentation index

#### Developer Experience

-   Environment variable validation on startup
-   Detailed error messages in development mode
-   Morgan HTTP request logging
-   Jest watch mode for test-driven development
-   ES modules throughout (modern JavaScript)
-   Hot reload in development with nodemon

#### Bug Fixes

-   Fixed repository test mocks for consistent testing
-   Resolved frontend-backend authentication integration
-   Fixed API response format consistency
-   Corrected environment variable handling

### Added - Custom Hooks Refactoring & Announcements System (2025-01-31)

#### Custom Hooks Architecture

-   Created `useAnnouncements` hook for managing announcement state and operations
-   Created `useNotification` hook for displaying success/error notifications
-   Implemented optimistic UI updates for better user experience
-   Added comprehensive error handling with user-friendly messages
-   Established hooks pattern for future feature development

#### Announcements Management

-   Added `ANNOUNCEMENT_CATEGORIES` constant (Announcement, Event, Accomplishment, Alert)
-   Added `ANNOUNCEMENT_PRIORITIES` constant (low, medium, high)
-   Created announcements table in Supabase schema with full CRUD support
-   Implemented announcement status workflow (draft, published, archived)
-   Added indexes for optimized query performance
-   **Full Supabase integration with real-time CRUD operations**
-   **Public page shows only published announcements**
-   **Admin panel manages all announcements (draft + published)**
-   Created seed data script for testing (`supabase_announcements_seed.sql`)

#### API Integration

-   Implemented complete CRUD API functions for announcements
    -   `fetchAnnouncements` - Fetch with filters (status, limit)
    -   `createAnnouncement` - Create new announcement
    -   `updateAnnouncement` - Update existing announcement
    -   `deleteAnnouncement` - Delete announcement
-   Updated `useAnnouncements` hook to use real API calls
-   Replaced mock/local operations with Supabase integration
-   Added proper error handling and rollback on failures

#### UI/UX Improvements

-   Updated `AnnouncementCard` to handle both field naming conventions
-   Support for `content`/`description` and `created_at`/`date` field names
-   Graceful fallback to sample data when database empty
-   Optimistic UI updates for instant user feedback
-   Better loading states and error messages

#### Admin Pages Enhancement

-   Refactored `AdminAnnouncements` to use custom hooks
-   Fixed "categories is not defined" error with proper constants
-   Fixed "FEEDBACK_STATUSES is not iterable" error in `AdminFeedback`
-   Fixed API response destructuring in `useAnnouncements` hook
-   Added graceful error handling for missing Supabase tables
-   Suppressed console noise for expected "table not found" errors during development

#### Database Schema Updates

-   Updated `supabase_schema_setup.sql` with announcements table
-   Added Row Level Security (RLS) policies for announcements (public read for published, admin write)
-   Added database triggers for auto-updating timestamps
-   Made schema idempotent with `DROP IF EXISTS` statements for policies and triggers
-   Added comprehensive indexes for announcements (category, status, priority, dates)

#### Bug Fixes

-   Fixed announcements filter error when data is undefined/null
-   Fixed API response structure mismatch in hooks
-   Fixed object vs array spreading for constants
-   Added optional chaining for safe property access
-   Resolved browser caching issues with proper error handling

#### Documentation

-   Updated README.md with new project structure
-   Added Supabase setup documentation with table descriptions
-   Created CHANGELOG.md for tracking project changes
-   Documented custom hooks pattern and usage
-   Created `supabase_announcements_seed.sql` for sample data
-   Added `TESTING_ANNOUNCEMENTS.md` guide for QA testing

### Technical Improvements

-   Improved code organization with separation of concerns
-   Enhanced type safety with proper data validation
-   Better error handling throughout the application
-   More maintainable codebase with reusable hooks
-   Optimized database queries with strategic indexing

### Testing

-   Frontend builds successfully with no errors (1788 modules)
-   No TypeScript/JavaScript compilation errors
-   All imports and dependencies resolved correctly
-   Backend server runs without issues
-   Production build optimized and ready for deployment

---

## [Previous Releases]

### [1.0.0] - Initial Release

-   Basic USG website with public pages
-   TINIG DINIG feedback system
-   Transparency portal
-   Admin authentication
-   Organizational chart
-   Bulletins and announcements
-   Constitution and bylaws pages
