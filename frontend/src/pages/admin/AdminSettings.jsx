import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Save, Moon, Sun, Volume2, VolumeX, Bell, BellOff, User, Mail, Shield, Lock, Eye, EyeOff, ChevronDown } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabaseClient'

export default function AdminSettings() {
  const { user } = useAuth()
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('admin-dark-mode')
    return saved === 'true'
  })
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [showPasswordSection, setShowPasswordSection] = useState(false)

  // Apply dark mode to document
  useEffect(() => {
    console.log('Dark mode changed to:', darkMode)
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('admin-dark-mode', 'true')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('admin-dark-mode', 'false')
    }
    
    // Dispatch custom event so other components can react
    window.dispatchEvent(new CustomEvent('darkModeChanged', { detail: { darkMode } }))
  }, [darkMode])

  const handleSaveSettings = () => {
    // Save to localStorage or backend
    localStorage.setItem('admin-settings', JSON.stringify({
      darkMode,
      soundEnabled,
      notifications
    }))
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const handlePasswordChange = async () => {
    setPasswordError('')
    setPasswordSuccess(false)

    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('All password fields are required')
      return
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters')
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match')
      return
    }

    try {
      // Update password using Supabase Auth
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      })
      
      if (error) throw error
      
      setPasswordSuccess(true)
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setTimeout(() => setPasswordSuccess(false), 3000)
    } catch (error) {
      setPasswordError(error.message || 'Failed to change password')
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-school-grey-800 dark:text-white mb-2">Settings</h1>
        <p className="text-school-grey-600 dark:text-gray-400">Manage your admin preferences and account settings</p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Account Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 transition-colors"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-university-red-50 dark:bg-university-red-900/30 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-university-red" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-school-grey-800 dark:text-white">Account Information</h2>
              <p className="text-sm text-school-grey-500 dark:text-gray-400">Your admin account details</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-school-grey-50 dark:bg-gray-700 rounded-xl">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-school-grey-600 dark:text-gray-300" />
                <div>
                  <p className="text-sm font-medium text-school-grey-800 dark:text-white">Email Address</p>
                  <p className="text-sm text-school-grey-600 dark:text-gray-400">{user?.email || 'admin@unc.edu.ph'}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-school-grey-50 dark:bg-gray-700 rounded-xl">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-school-grey-600 dark:text-gray-300" />
                <div>
                  <p className="text-sm font-medium text-school-grey-800 dark:text-white">Role</p>
                  <p className="text-sm text-school-grey-600 dark:text-gray-400">Administrator</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-xl">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>Version:</strong> 1.0.0 • University Student Government Admin Portal
              </p>
            </div>
          </div>
        </motion.div>

        {/* Change Password */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 transition-colors"
        >
          <button
            onClick={() => setShowPasswordSection(!showPasswordSection)}
            className="w-full flex items-center justify-between group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-university-red-50 dark:bg-university-red-900/30 rounded-xl flex items-center justify-center group-hover:bg-university-red-100 dark:group-hover:bg-university-red-900/50 transition-colors">
                <Lock className="w-5 h-5 text-university-red" />
              </div>
              <div className="text-left">
                <h2 className="text-xl font-bold text-school-grey-800 dark:text-white">Change Password</h2>
                <p className="text-sm text-school-grey-500 dark:text-gray-400">Update your account password</p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: showPasswordSection ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-6 h-6 text-school-grey-400 dark:text-gray-500 group-hover:text-university-red dark:group-hover:text-university-red transition-colors" />
            </motion.div>
          </button>

          <AnimatePresence>
            {showPasswordSection && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="space-y-4 mt-6">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-medium text-school-grey-700 dark:text-gray-300 mb-2">
                      Current Password
                    </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-school-grey-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-university-red focus:border-transparent pr-12 text-school-grey-800 dark:text-white placeholder-school-grey-400 dark:placeholder-gray-500 transition-colors"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-school-grey-400 dark:text-gray-500 hover:text-school-grey-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-school-grey-700 dark:text-gray-300 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-school-grey-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-university-red focus:border-transparent pr-12 text-school-grey-800 dark:text-white placeholder-school-grey-400 dark:placeholder-gray-500 transition-colors"
                  placeholder="Enter new password (min. 8 characters)"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-school-grey-400 dark:text-gray-500 hover:text-school-grey-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-school-grey-700 dark:text-gray-300 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-school-grey-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-university-red focus:border-transparent pr-12 text-school-grey-800 dark:text-white placeholder-school-grey-400 dark:placeholder-gray-500 transition-colors"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-school-grey-400 dark:text-gray-500 hover:text-school-grey-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

                  {/* Error Message */}
                  {passwordError && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
                      {passwordError}
                    </div>
                  )}

                  {/* Success Message */}
                  {passwordSuccess && (
                    <div className="p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl text-sm text-green-600 dark:text-green-400">
                      Password changed successfully!
                    </div>
                  )}

                  {/* Change Password Button */}
                  <button
                    onClick={handlePasswordChange}
                    className="w-full px-4 py-3 bg-university-red hover:bg-university-red-600 text-white rounded-xl font-medium transition-colors shadow-lg hover:shadow-xl"
                  >
                    Change Password
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Appearance & Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 transition-colors"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-university-red-50 dark:bg-university-red-900/30 rounded-xl flex items-center justify-center">
              <Sun className="w-5 h-5 text-university-red" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-school-grey-800 dark:text-white">Appearance & Preferences</h2>
              <p className="text-sm text-school-grey-500 dark:text-gray-400">Customize your admin experience</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Dark Mode */}
            <div className="flex items-center justify-between p-4 bg-school-grey-50 dark:bg-gray-700 rounded-xl">
              <div className="flex items-center space-x-3">
                {darkMode ? <Moon className="w-5 h-5 text-school-grey-600 dark:text-gray-300" /> : <Sun className="w-5 h-5 text-school-grey-600 dark:text-gray-300" />}
                <div>
                  <p className="font-medium text-school-grey-800 dark:text-white">Dark Mode</p>
                  <p className="text-sm text-school-grey-500 dark:text-gray-400">Toggle dark theme for the admin panel</p>
                </div>
              </div>
              <button
                onClick={() => {
                  console.log('Toggle clicked! Current darkMode:', darkMode)
                  setDarkMode(!darkMode)
                }}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  darkMode ? 'bg-university-red' : 'bg-school-grey-300 dark:bg-gray-600'
                }`}
              >
                <motion.div
                  animate={{ x: darkMode ? 28 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md"
                />
              </button>
            </div>

            {/* Sound Effects */}
            <div className="flex items-center justify-between p-4 bg-school-grey-50 dark:bg-gray-700 rounded-xl">
              <div className="flex items-center space-x-3">
                {soundEnabled ? <Volume2 className="w-5 h-5 text-school-grey-600 dark:text-gray-300" /> : <VolumeX className="w-5 h-5 text-school-grey-600 dark:text-gray-300" />}
                <div>
                  <p className="font-medium text-school-grey-800 dark:text-white">Sound Effects</p>
                  <p className="text-sm text-school-grey-500 dark:text-gray-400">Play sounds for notifications and actions</p>
                </div>
              </div>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  soundEnabled ? 'bg-university-red' : 'bg-school-grey-300 dark:bg-gray-600'
                }`}
              >
                <motion.div
                  animate={{ x: soundEnabled ? 28 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md"
                />
              </button>
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between p-4 bg-school-grey-50 dark:bg-gray-700 rounded-xl">
              <div className="flex items-center space-x-3">
                {notifications ? <Bell className="w-5 h-5 text-school-grey-600 dark:text-gray-300" /> : <BellOff className="w-5 h-5 text-school-grey-600 dark:text-gray-300" />}
                <div>
                  <p className="font-medium text-school-grey-800 dark:text-white">Push Notifications</p>
                  <p className="text-sm text-school-grey-500 dark:text-gray-400">Receive notifications for important updates</p>
                </div>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  notifications ? 'bg-university-red' : 'bg-school-grey-300 dark:bg-gray-600'
                }`}
              >
                <motion.div
                  animate={{ x: notifications ? 28 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md"
                />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-end"
        >
          <button
            onClick={handleSaveSettings}
            className="flex items-center space-x-2 px-6 py-3 bg-university-red hover:bg-university-red-600 text-white rounded-xl font-medium transition-colors shadow-lg"
          >
            <Save className="w-5 h-5" />
            <span>Save Preferences</span>
          </button>
        </motion.div>

        {/* Success Message */}
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg"
          >
            Settings saved successfully!
          </motion.div>
        )}
      </div>
    </div>
  )
}
