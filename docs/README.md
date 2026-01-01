# 📚 Documentation

This folder contains **ALL** documentation files for the UNC USG Website project. Everything has been consolidated here for easy access.

## 📄 Available Documentation

### Backend & API Documentation

**[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Swagger/OpenAPI documentation guide

-   How to add API documentation to routes
-   JSDoc annotation examples
-   Swagger UI usage
-   Authentication in API docs

**[MIDDLEWARE_GUIDE.md](./MIDDLEWARE_GUIDE.md)** - Backend middleware guide

-   Authentication and authorization (JWT)
-   Request validation with Zod
-   Rate limiting configuration
-   Error handling patterns
-   Code examples and best practices

**[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Testing framework guide

-   How to write and run tests with Jest
-   Repository test examples
-   Middleware testing patterns
-   Test utilities and mocks

### Database Documentation

**[DATABASE_SETUP.md](./DATABASE_SETUP.md)** - Database configuration and switching

-   How to switch between Supabase and PostgreSQL
-   Environment variable configuration
-   Connection setup for both databases
-   Repository pattern implementation

**[DATABASE_SETUP_GUIDE.md](./DATABASE_SETUP_GUIDE.md)** - Complete database setup guide

-   How to run the unified schema file
-   How to populate with seed data
-   Troubleshooting common database issues
-   Understanding table relationships
-   Supabase and PostgreSQL detailed setup

### Frontend Features

**[HOMEPAGE_CONTENT_GUIDE.md](./HOMEPAGE_CONTENT_GUIDE.md)** - Homepage content management

-   Step-by-step instructions for non-technical USG officers
-   Managing statistics, values, and features
-   Content writing tips and best practices
-   Quick reference table for common tasks

**[TINIG_DINIG_GUIDE.md](./TINIG_DINIG_GUIDE.md)** - Feedback system documentation

-   How the TINIG DINIG (student feedback) system works
-   Submission process and tracking
-   Admin management of feedback
-   Status updates and notifications

### System Architecture

**[NOTIFICATION_SYSTEM.md](./NOTIFICATION_SYSTEM.md)** - Notification system architecture

-   Real-time notification implementation
-   Toast notification system
-   Admin notification panel
-   WebSocket integration (if applicable)

**[NOTIFICATION_TROUBLESHOOTING.md](./NOTIFICATION_TROUBLESHOOTING.md)** - Notification debugging

-   Common notification issues and solutions
-   Debug checklist for notification problems
-   Testing notification functionality
-   Configuration troubleshooting

### Quick Reference

**[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Quick reference guide

-   Common tasks and commands
-   Frequently used API endpoints
-   Quick troubleshooting tips
-   Developer shortcuts

## 🗂️ Project Structure Overview

### Database Files (Root Directory)

-   **`database_schema.sql`** - Unified database schema for all tables
-   **`supabase_seed_data.sql`** - Sample data for development and testing (delete after adding real data)

### Key Directories

-   **`frontend/`** - React + Vite frontend application
-   **`backend/`** - Express.js backend API with authentication and validation
-   **`docs/`** - This folder with **ALL** documentation files (backend + frontend)

## 🎯 Quick Links

-   **Main README**: [../README.md](../README.md) - Project overview and quick start
-   **Backend README**: [../backend/README.md](../backend/README.md) - Backend configuration and API overview
-   **Changelog**: [../CHANGELOG.md](../CHANGELOG.md) - Version history
-   **API Documentation**: http://localhost:5000/api/docs - Interactive Swagger UI (when server running)

## 💡 Documentation Organization

All documentation has been consolidated into this single `docs/` folder for easier navigation:

-   **Backend documentation** (API, middleware, testing) - Previously scattered in backend/ folder
-   **Database documentation** (setup, configuration) - Complete guides for Supabase and PostgreSQL
-   **Frontend documentation** (homepage, feedback system) - User-facing feature guides
-   **System documentation** (notifications, troubleshooting) - Architecture and debugging guides

## 📝 Note for Developers

When adding new documentation:

1. Create the `.md` file in this `docs/` folder
2. Add it to the relevant section in this README
3. Update the main [project README](../README.md) documentation index
4. Use descriptive filenames (e.g., `FEATURE_NAME_GUIDE.md`)
5. Keep documentation up-to-date with code changes

---

_Last updated: January 2025_
