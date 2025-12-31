import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useNotifications } from '../hooks/useNotifications'
import NotificationPanel from '../components/admin/NotificationPanel'
import { 
  LayoutDashboard, 
  MessageSquare, 
  Users, 
  FileText, 
  Megaphone,
  DollarSign,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
  Home
} from 'lucide-react'
import USGLogo from '../assets/USG LOGO NO BG.png'

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { name: 'Feedback (TINIG DINIG)', icon: MessageSquare, path: '/admin/feedback' },
  { name: 'Announcements', icon: Megaphone, path: '/admin/announcements' },
  { name: 'Organizational Chart', icon: Users, path: '/admin/orgchart' },
  { name: 'Issuances & Reports', icon: DollarSign, path: '/admin/reports' },
  { name: 'Homepage Content', icon: FileText, path: '/admin/site-content' },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false)
  const { user, signOut, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  // Initialize notifications
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAll
  } = useNotifications()

  // Load dark mode preference immediately and listen for changes
  useEffect(() => {
    // Apply dark mode immediately on mount
    const applyDarkMode = () => {
      const darkMode = localStorage.getItem('admin-dark-mode') === 'true'
      console.log('AdminLayout applying dark mode:', darkMode)
      if (darkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }

    // Apply on mount
    applyDarkMode()

    // Listen for storage changes (when changed in another tab/window)
    const handleStorageChange = (e) => {
      if (e.key === 'admin-dark-mode') {
        console.log('Dark mode changed in another tab:', e.newValue)
        applyDarkMode()
      }
    }

    // Listen for custom dark mode event (when changed in same tab)
    const handleDarkModeChange = (e) => {
      console.log('Dark mode changed via custom event:', e.detail.darkMode)
      applyDarkMode()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('darkModeChanged', handleDarkModeChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('darkModeChanged', handleDarkModeChange)
    }
  }, [])

  // Redirect if not admin
  useEffect(() => {
    if (!user || !isAdmin) {
      // For demo purposes, allow access
      // In production, uncomment: navigate('/admin/login')
    }
  }, [user, isAdmin, navigate])

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/admin/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="min-h-screen bg-school-grey-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 right-0 lg:left-0 lg:right-auto z-50 h-full w-72 bg-white dark:bg-gray-800 shadow-xl transform transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-school-grey-100 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <img src={USGLogo} alt="USG Logo" className="w-10 h-10" />
              <div>
                <h1 className="font-bold text-school-grey-800 dark:text-white">USG Admin</h1>
                <p className="text-xs text-school-grey-500 dark:text-gray-400">Dashboard</p>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg text-school-grey-600 dark:text-gray-400 hover:bg-school-grey-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-university-red text-white shadow-lg shadow-university-red/30' 
                      : 'text-school-grey-600 dark:text-gray-300 hover:bg-school-grey-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Bottom Section */}
          <div className="p-4 border-t border-school-grey-100 dark:border-gray-700 space-y-1">
            <Link
              to="/admin/settings"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                location.pathname === '/admin/settings'
                  ? 'bg-university-red text-white shadow-lg shadow-university-red/30'
                  : 'text-school-grey-600 dark:text-gray-300 hover:bg-school-grey-100 dark:hover:bg-gray-700'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </Link>
            <Link
              to="/"
              className="flex items-center space-x-3 px-4 py-3 text-school-grey-600 dark:text-gray-300 hover:bg-school-grey-100 dark:hover:bg-gray-700 rounded-xl transition-all"
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Back to Website</span>
            </Link>
            <button
              onClick={() => {
                setSidebarOpen(false)
                handleSignOut()
              }}
              className="flex items-center space-x-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all w-full"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-72">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-school-grey-100 dark:border-gray-700 transition-colors">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Page Title */}
            <h2 className="text-xl font-bold text-school-grey-800 dark:text-white">
              {navItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
            </h2>

            {/* Right Side */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Notifications */}
              <div className="relative">
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setNotificationPanelOpen(!notificationPanelOpen)}
                  className="relative p-2 text-school-grey-600 dark:text-gray-300 hover:text-school-grey-800 dark:hover:text-white hover:bg-school-grey-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] bg-university-red text-white text-xs font-bold rounded-full flex items-center justify-center px-1"
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </motion.span>
                  )}
                </motion.button>

                {/* Notification Panel */}
                <NotificationPanel
                  notifications={notifications}
                  unreadCount={unreadCount}
                  onMarkAsRead={markAsRead}
                  onMarkAllAsRead={markAllAsRead}
                  onClear={clearNotification}
                  onClearAll={clearAll}
                  isOpen={notificationPanelOpen}
                  onClose={() => setNotificationPanelOpen(false)}
                />
              </div>

              {/* User Info */}
              <div className="flex items-center space-x-2 sm:space-x-3 p-2">
                <div className="w-9 h-9 bg-gradient-to-br from-university-red to-university-red-600 rounded-full flex items-center justify-center text-white font-bold">
                  A
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-school-grey-800 dark:text-white">Admin</p>
                  <p className="text-xs text-school-grey-500 dark:text-gray-400">{user?.email || 'admin@unc.edu.ph'}</p>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden sm:block w-px h-6 bg-school-grey-200 dark:bg-gray-600"></div>

              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-school-grey-600 dark:text-gray-300 hover:bg-school-grey-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </motion.button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
