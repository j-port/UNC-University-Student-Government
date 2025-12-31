import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, Check, MessageSquare, Clock, Eye, CheckCircle, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function NotificationPanel({ 
  notifications = [], 
  unreadCount = 0,
  onMarkAsRead,
  onMarkAllAsRead,
  onClear,
  onClearAll,
  isOpen,
  onClose 
}) {
  const navigate = useNavigate()

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return Clock
      case 'in_progress': return Eye
      case 'responded': return MessageSquare
      case 'resolved': return CheckCircle
      default: return MessageSquare
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30'
      case 'in_progress': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30'
      case 'responded': return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30'
      case 'resolved': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30'
      default: return 'text-school-grey-600 bg-school-grey-100 dark:text-gray-400 dark:bg-gray-700'
    }
  }

  const getCategoryColor = (category) => {
    const colors = {
      'Academic': 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20',
      'Facilities': 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20',
      'Financial': 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20',
      'Student Welfare': 'text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-900/20',
      'Governance': 'text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/20',
      'Suggestion': 'text-cyan-600 bg-cyan-50 dark:text-cyan-400 dark:bg-cyan-900/20',
      'Other': 'text-school-grey-600 bg-school-grey-50 dark:text-gray-400 dark:bg-gray-700'
    }
    return colors[category] || colors['Other']
  }

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diff = Math.floor((now - time) / 1000) // seconds

    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
    return time.toLocaleDateString()
  }

  const handleNotificationClick = (notification) => {
    onMarkAsRead(notification.id)
    navigate('/admin/feedback')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-16 right-4 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-school-grey-200 dark:border-gray-700 z-50 max-h-[600px] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-school-grey-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-university-red" />
                <h3 className="font-bold text-school-grey-800 dark:text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-university-red text-white text-xs font-bold rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {notifications.length > 0 && (
                  <>
                    <button
                      onClick={onMarkAllAsRead}
                      className="text-xs text-university-red hover:text-university-red-600 font-medium transition-colors"
                      title="Mark all as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={onClearAll}
                      className="text-xs text-school-grey-500 dark:text-gray-400 hover:text-school-grey-700 dark:hover:text-gray-200 font-medium transition-colors"
                      title="Clear all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
                <button
                  onClick={onClose}
                  className="p-1 text-school-grey-500 dark:text-gray-400 hover:text-school-grey-700 dark:hover:text-gray-200 hover:bg-school-grey-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <div className="w-16 h-16 bg-school-grey-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    <Bell className="w-8 h-8 text-school-grey-400 dark:text-gray-500" />
                  </div>
                  <p className="text-school-grey-500 dark:text-gray-400 text-sm text-center">
                    No notifications yet
                  </p>
                  <p className="text-school-grey-400 dark:text-gray-500 text-xs text-center mt-1">
                    You'll see new feedback and updates here
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-school-grey-100 dark:divide-gray-700">
                  {notifications.map((notification) => {
                    const StatusIcon = getStatusIcon(notification.status)
                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={`p-4 cursor-pointer transition-colors relative ${
                          notification.read
                            ? 'bg-white dark:bg-gray-800 hover:bg-school-grey-50 dark:hover:bg-gray-750'
                            : 'bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20'
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        {/* Unread indicator */}
                        {!notification.read && (
                          <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-university-red rounded-full" />
                        )}

                        <div className="flex items-start space-x-3 pl-3">
                          {/* Icon */}
                          <div className={`p-2 rounded-lg ${getStatusColor(notification.status)}`}>
                            <StatusIcon className="w-4 h-4" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <p className="font-semibold text-sm text-school-grey-800 dark:text-white">
                                {notification.title}
                              </p>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onClear(notification.id)
                                }}
                                className="p-1 text-school-grey-400 dark:text-gray-500 hover:text-university-red dark:hover:text-university-red transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                            
                            <p className="text-xs text-school-grey-600 dark:text-gray-400 mb-2 line-clamp-2">
                              {notification.message}
                            </p>

                            <div className="flex items-center gap-2 flex-wrap">
                              {notification.category && (
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getCategoryColor(notification.category)}`}>
                                  {notification.category}
                                </span>
                              )}
                              {notification.referenceNumber && (
                                <span className="text-xs text-school-grey-500 dark:text-gray-500 font-mono">
                                  {notification.referenceNumber}
                                </span>
                              )}
                              <span className="text-xs text-school-grey-400 dark:text-gray-500 ml-auto">
                                {formatTimeAgo(notification.timestamp)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
