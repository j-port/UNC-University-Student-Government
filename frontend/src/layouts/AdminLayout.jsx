import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
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
  { name: 'Financial Reports', icon: DollarSign, path: '/admin/reports' },
  { name: 'Documents', icon: FileText, path: '/admin/documents' },
  { name: 'Settings', icon: Settings, path: '/admin/settings' },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, signOut, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

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
    <div className="min-h-screen bg-school-grey-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-school-grey-100">
            <div className="flex items-center space-x-3">
              <img src={USGLogo} alt="USG Logo" className="w-10 h-10" />
              <div>
                <h1 className="font-bold text-school-grey-800">USG Admin</h1>
                <p className="text-xs text-school-grey-500">Dashboard</p>
              </div>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-school-grey-500 hover:text-school-grey-700"
            >
              <X className="w-6 h-6" />
            </button>
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
                      : 'text-school-grey-600 hover:bg-school-grey-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Back to Site */}
          <div className="p-4 border-t border-school-grey-100">
            <Link
              to="/"
              className="flex items-center space-x-3 px-4 py-3 text-school-grey-600 hover:bg-school-grey-100 rounded-xl transition-all"
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Back to Website</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-72">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-school-grey-100">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-school-grey-600 hover:text-school-grey-800"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Page Title */}
            <h2 className="text-xl font-bold text-school-grey-800 hidden lg:block">
              {navItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
            </h2>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-school-grey-600 hover:text-school-grey-800 hover:bg-school-grey-100 rounded-full">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-university-red rounded-full" />
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-3 p-2 hover:bg-school-grey-100 rounded-xl transition-colors"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-university-red to-university-red-600 rounded-full flex items-center justify-center text-white font-bold">
                    A
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-school-grey-800">Admin</p>
                    <p className="text-xs text-school-grey-500">{user?.email || 'admin@unc.edu.ph'}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-school-grey-400" />
                </button>

                {/* Dropdown */}
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-school-grey-100 py-2"
                  >
                    <Link
                      to="/admin/settings"
                      className="flex items-center space-x-2 px-4 py-2 text-school-grey-600 hover:bg-school-grey-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </div>
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
