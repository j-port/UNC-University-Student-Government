import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'

// Context
import { AuthProvider } from './contexts/AuthContext'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ChatButton from './components/ChatButton'

// Public Pages
import Home from './pages/Home'
import About from './pages/About'
import Governance from './pages/Governance'
import Constitution from './pages/Constitution'
import Bylaws from './pages/Bylaws'
import OrgChart from './pages/OrgChart'
import Bulletins from './pages/Bulletins'
import AnnouncementDetail from './pages/AnnouncementDetail'
import Transparency from './pages/Transparency'
import Feedback from './pages/Feedback'

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './layouts/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminFeedback from './pages/admin/AdminFeedback'
import AdminAnnouncements from './pages/admin/AdminAnnouncements'
import AdminOrgChart from './pages/admin/AdminOrgChart'
import AdminReports from './pages/admin/AdminReports'
import AdminSiteContent from './pages/admin/AdminSiteContent'

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
}

// Animated page wrapper
function AnimatedPage({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  )
}

// Scroll to top on route change
function ScrollToTop() {
  const location = useLocation()
  
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])
  
  return null
}

// Public Routes with animations
function PublicRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <AnimatedPage>
              <Home />
            </AnimatedPage>
          }
        />
        <Route
          path="/about"
          element={
            <AnimatedPage>
              <About />
            </AnimatedPage>
          }
        />
        <Route
          path="/governance"
          element={
            <AnimatedPage>
              <Governance />
            </AnimatedPage>
          }
        />
        <Route
          path="/governance/constitution"
          element={
            <AnimatedPage>
              <Constitution />
            </AnimatedPage>
          }
        />
        <Route
          path="/governance/bylaws"
          element={
            <AnimatedPage>
              <Bylaws />
            </AnimatedPage>
          }
        />
        <Route
          path="/governance/org-chart"
          element={
            <AnimatedPage>
              <OrgChart />
            </AnimatedPage>
          }
        />
        <Route
          path="/governance/orgchart"
          element={
            <AnimatedPage>
              <OrgChart />
            </AnimatedPage>
          }
        />
        <Route
          path="/bulletins"
          element={
            <AnimatedPage>
              <Bulletins />
            </AnimatedPage>
          }
        />
        <Route
          path="/bulletins/announcement/:id"
          element={
            <AnimatedPage>
              <AnnouncementDetail />
            </AnimatedPage>
          }
        />
        <Route
          path="/bulletins/announcements"
          element={
            <AnimatedPage>
              <Bulletins />
            </AnimatedPage>
          }
        />
        <Route
          path="/bulletins/issuances"
          element={
            <AnimatedPage>
              <Bulletins />
            </AnimatedPage>
          }
        />
        <Route
          path="/transparency"
          element={
            <AnimatedPage>
              <Transparency />
            </AnimatedPage>
          }
        />
        <Route
          path="/feedback"
          element={
            <AnimatedPage>
              <Feedback />
            </AnimatedPage>
          }
        />
      </Routes>
    </AnimatePresence>
  )
}

// Layout wrapper for public pages
function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <PublicRoutes />
      </main>
      <Footer />
      <ChatButton />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Admin Login - No Layout */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Admin Routes with Admin Layout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="feedback" element={<AdminFeedback />} />
            <Route path="announcements" element={<AdminAnnouncements />} />
            <Route path="orgchart" element={<AdminOrgChart />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="documents" element={<AdminReports />} />
            <Route path="site-content" element={<AdminSiteContent />} />
            <Route path="settings" element={<AdminDashboard />} />
          </Route>
          
          {/* Public Routes with Public Layout */}
          <Route path="/*" element={<PublicLayout />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
