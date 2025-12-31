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
├── supabase_schema_setup.sql  # Complete database schema
├── supabase_feedback_setup.sql  # Feedback system schema
└── README.md
```

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

-   **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
-   **npm** or **yarn** package manager
-   **Git** - [Download here](https://git-scm.com/)
-   **Supabase account** - [Sign up here](https://supabase.com/)

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/j-port/UNC-University-Student-Government.git
cd UNC-University-Student-Government
```

2. **Install all dependencies:**

```bash
npm run install:all
```

Or install manually:

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file:

```bash
cp .env.example .env
```

4. Add your Supabase credentials to `.env`:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Start the development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file:

```bash
cp .env.example .env
```

4. Add your configuration to `.env`

5. Start the development server:

```bash
npm run dev
```

The backend API will be available at `http://localhost:5000`

### Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the main schema setup script (`supabase_schema_setup.sql`) in your Supabase SQL editor to create all tables
3. Optionally run the feedback setup script (`supabase_feedback_setup.sql`) if not included in main schema
4. Configure Row Level Security (RLS) policies (included in schema file)
5. Copy your project URL and anon key to the respective `.env` files

**Database Tables Created:**

-   `officers` - USG officers and organizational chart
-   `organizations` - Student organizations (FSOs, fraternities, etc.)
-   `committees` - USG committees
-   `announcements` - Bulletins, events, and announcements
-   `governance_documents` - Constitution and bylaws
-   `site_content` - Dynamic page content
-   `page_content` - Full page management

### Running the Full Application

You can run both frontend and backend simultaneously:

```bash
# Terminal 1 - Run frontend
npm run dev:frontend

# Terminal 2 - Run backend
npm run dev:backend
```

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
-   **Supabase** - Backend-as-a-Service (Database, Auth, Storage)
-   **CORS** - Cross-origin resource sharing

### Database

-   **PostgreSQL** (via Supabase) - Relational database
-   **Row Level Security** - Database-level security policies

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

-   ✅ Environment variables for sensitive data
-   ✅ Row Level Security (RLS) in Supabase
-   ✅ Admin authentication with email verification
-   ✅ Protected admin routes with AuthContext
-   ✅ CORS configuration for API security
-   ✅ Input validation and sanitization

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
