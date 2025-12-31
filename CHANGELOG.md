# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

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
