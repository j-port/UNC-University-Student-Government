# UNC University Student Government Website

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF.svg)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)

A modern, comprehensive web platform for the **University of Nueva Caceres Student Government**, featuring transparency portals, feedback systems, administrative tools, and real-time announcements. Built with React, Vite, Express.js, and Supabase.

## ✨ Key Features

-   🏠 **Landing Page** - Dynamic hero section showcasing campus life and student government initiatives
-   📢 **TINIG DINIG System** - Interactive feedback portal for student voices and concerns
-   📊 **Transparency Portal** - Access to budgets, expenditures, and financial reports
-   👥 **Organizational Chart** - Visual representation of USG structure and officials
-   📰 **Bulletins & Announcements** - Real-time updates and important notices
-   📜 **Governance Documents** - Constitution, bylaws, and official policies
-   🔐 **Admin Dashboard** - Comprehensive management system for administrators
-   💬 **ChatButton Integration** - Real-time chat support for students
-   📱 **Fully Responsive** - Optimized for desktop, tablet, and mobile devices
-   🎨 **Modern UI/UX** - Beautiful animations with Framer Motion and Tailwind CSS

## 🏗️ Project Structure

```
UNC-USG_WEBSITE/
├── frontend/          # React + Vite frontend application
│   ├── src/
│   │   ├── api/         # API service functions
│   │   ├── assets/      # Images, logos, etc.
│   │   ├── components/  # Reusable React components
│   │   │   └── admin/  # Admin-specific components
│   │   ├── contexts/    # React contexts (Auth, etc.)
│   │   ├── hooks/       # Custom React hooks
│   │   ├── layouts/     # Layout components
│   │   ├── lib/         # Utilities and configs
│   │   ├── pages/       # Page components
│   │   │   └── admin/  # Admin pages
│   │   ├── utils/       # Utility functions and constants
│   │   └── App.jsx      # Main app component
│   ├── public/       # Static files
│   ├── package.json
│   └── vite.config.js
│
├── backend/          # Express.js backend API
│   ├── src/
│   │   └── index.js  # Main server file
│   ├── package.json
│   └── .env
│
├── database_schema.sql                # ⭐ Complete unified database schema
├── supabase_seed_data.sql            # Sample/test data (delete after adding real content)
├── DATABASE_SETUP_GUIDE.md            # 📚 Database setup documentation
├── CHANGELOG.md                       # Version history
└── README.md                          # This file
```

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

-   **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
-   **npm** or **yarn** package manager
-   **Git** - [Download here](https://git-scm.com/)
-   **Supabase account** - [Sign up here](https://supabase.com/) _or use PostgreSQL directly_

### Quick Start

1. **Clone the repository:**

```bash
git clone https://github.com/j-port/UNC-University-Student-Government.git
cd UNC-University-Student-Government
```

2. **Install dependencies:**

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. **Configure environment:**

```bash
# Frontend (.env in frontend/)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:5000/api

# Backend (.env in backend/)
PORT=5000
NODE_ENV=development
DB_TYPE=supabase
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_role_key
```

4. **Start development servers:**

```bash
# Terminal 1 - Backend (port 5000)
cd backend
npm start

# Terminal 2 - Frontend (port 3000)
cd frontend
npm run dev
```

5. **Access the application:**
    - Frontend: http://localhost:3000
    - Backend API: http://localhost:5000/api
    - API Documentation: http://localhost:5000/api/docs

📚 **For detailed setup, see [docs/DATABASE_SETUP_GUIDE.md](docs/DATABASE_SETUP_GUIDE.md) and [backend/README.md](backend/README.md)**

## 📖 Documentation

All documentation is now organized in the **[docs/](docs/)** folder for easy access.

### Core Documentation

-   **[README.md](README.md)** - This file (project overview and quick start)
-   **[CHANGELOG.md](CHANGELOG.md)** - Version history and release notes
-   **[backend/README.md](backend/README.md)** - Backend setup and configuration

### Complete Documentation Index

-   **[docs/README.md](docs/README.md)** - Complete documentation index
-   **[docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)** - How to add Swagger/OpenAPI documentation
-   **[docs/DATABASE_SETUP.md](docs/DATABASE_SETUP.md)** - Database configuration and switching (Supabase/PostgreSQL)
-   **[docs/DATABASE_SETUP_GUIDE.md](docs/DATABASE_SETUP_GUIDE.md)** - Complete database setup guide
-   **[docs/MIDDLEWARE_GUIDE.md](docs/MIDDLEWARE_GUIDE.md)** - Authentication, validation, and error handling
-   **[docs/TESTING_GUIDE.md](docs/TESTING_GUIDE.md)** - Testing framework and best practices
-   **[docs/HOMEPAGE_CONTENT_GUIDE.md](docs/HOMEPAGE_CONTENT_GUIDE.md)** - Homepage content management
-   **[docs/TINIG_DINIG_GUIDE.md](docs/TINIG_DINIG_GUIDE.md)** - Feedback system documentation
-   **[docs/NOTIFICATION_SYSTEM.md](docs/NOTIFICATION_SYSTEM.md)** - Notification system architecture
-   **[docs/NOTIFICATION_TROUBLESHOOTING.md](docs/NOTIFICATION_TROUBLESHOOTING.md)** - Debug notification issues
-   **[docs/QUICK_REFERENCE.md](docs/QUICK_REFERENCE.md)** - Quick reference for common tasks

### Live Documentation

-   **[Swagger UI](http://localhost:5000/api/docs)** - Interactive API documentation (when backend server is running)

## 🔑 Admin Access

Access the admin dashboard to manage announcements, feedback, and reports:

-   **Access via footer:** Navigate to the "Staff" link in the footer
-   **Direct URL:** Visit `/admin/login`
-   **Demo credentials:**
    -   Email: `admin@unc.edu.ph`
    -   Password: `admin123`

⚠️ **Important:** Change default credentials in production!

## 🛠️ Tech Stack

### Frontend

-   **React 18** - Modern UI library
-   **Vite 5** - Lightning-fast build tool
-   **Tailwind CSS** - Utility-first CSS framework
-   **Framer Motion** - Animation library
-   **React Router v6** - Client-side routing
-   **Supabase Client** - Database and auth client

### Backend

-   **Node.js** - JavaScript runtime
-   **Express.js** - Web application framework
-   **JWT Authentication** - Token-based security
-   **Zod** - Request validation
-   **Swagger/OpenAPI** - API documentation
-   **Jest** - Testing framework
-   **Database Abstraction** - Support for Supabase and PostgreSQL

### Database

-   **PostgreSQL** (via Supabase or native) - Relational database
-   **Row Level Security** - Database-level security policies
-   **Flexible** - Switch between Supabase and PostgreSQL with environment variable

## 📝 Features in Detail

### Public Pages

-   **Home** - Landing page with hero section and key information
-   **About** - Information about the student government
-   **Transparency** - Financial reports and budget information
-   **Bulletins** - Latest announcements and news
-   **Feedback (TINIG DINIG)** - Submit concerns and feedback
-   **Organizational Chart** - Visual org structure with official details
-   **Constitution & Bylaws** - Governance documents
-   **Governance** - Policies and procedures

### Admin Pages

-   **Dashboard** - Overview and analytics
-   **Announcements Management** - Create, edit, and delete bulletins
-   **Feedback Management** - Review and respond to student feedback
-   **Org Chart Management** - Update officials and structure
-   **Reports** - Generate and view various reports

## 🔒 Security

-   ✅ JWT authentication with Supabase
-   ✅ Admin authorization (@unc.edu.ph email required)
-   ✅ Request validation with Zod schemas
-   ✅ Rate limiting (prevents abuse)
-   ✅ Row Level Security (RLS) in database
-   ✅ Environment variables for sensitive data
-   ✅ CORS configuration for API security
-   ✅ Centralized error handling

## 🚢 Deployment

### Frontend Deployment (Vercel/Netlify)

1. Build the production version:

```bash
cd frontend
npm run build
```

2. Deploy the `dist` folder to your hosting platform
3. Set environment variables in your hosting dashboard

### Backend Deployment (Heroku/Railway/Render)

1. Set up environment variables on your platform
2. Deploy from the `backend` directory
3. Update frontend API endpoints to match production URL

## 📦 Available Scripts

From root directory:

-   `npm run install:all` - Install all dependencies (frontend + backend)
-   `npm run dev:frontend` - Start frontend dev server
-   `npm run dev:backend` - Start backend dev server
-   `npm run build:frontend` - Build frontend for production
-   `npm run preview:frontend` - Preview production build

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Support

For support or questions:

-   Email: usg@unc.edu.ph
-   Visit us at the USG Office, University of Nueva Caceres

## 👥 Team

**University of Nueva Caceres Student Government**

-   Development Team
-   Student Government Officers
-   IT Committee

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

-   University of Nueva Caceres Administration
-   Student Government Officers
-   All students who provided feedback
-   Open source community

---

**Made with ❤️ by UNC Student Government**

_For students, by students._
