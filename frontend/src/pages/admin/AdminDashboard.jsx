import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  MessageSquare, 
  Users, 
  FileText, 
  Megaphone,
  TrendingUp,
  TrendingDown,
  Eye,
  Clock,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Calendar,
  RefreshCw,
  Activity,
  BarChart3
} from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import LoadingSpinner from '../../components/LoadingSpinner'

const formatTimeAgo = (date) => {
  const now = new Date()
  const then = new Date(date)
  const seconds = Math.floor((now - then) / 1000)
  
  if (seconds < 60) return 'Just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return then.toLocaleDateString()
}

const getStatusColor = (status) => {
  switch (status) {
    case 'pending': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
    case 'in_progress': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    case 'responded': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
    case 'resolved': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
  }
}

const getStatusIcon = (status) => {
  switch (status) {
    case 'pending': return Clock
    case 'in_progress': return Eye
    case 'responded': return MessageSquare
    case 'resolved': return CheckCircle
    default: return AlertCircle
  }
}

export default function AdminDashboard() {
  const [greeting, setGreeting] = useState('')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  
  // Real-time data states
  const [stats, setStats] = useState([])
  const [recentFeedback, setRecentFeedback] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [feedbackTrends, setFeedbackTrends] = useState({
    thisMonth: 0,
    lastMonth: 0,
    responseRate: 0,
    avgResponseTime: 0,
    satisfactionRate: 0
  })

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 18) setGreeting('Good afternoon')
    else setGreeting('Good evening')
    
    fetchDashboardData()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchDashboardData(true)
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const fetchDashboardData = async (silent = false) => {
    if (!silent) setLoading(true)
    else setRefreshing(true)
    
    try {
      // Fetch feedback data
      const { data: feedbackData, error: feedbackError } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (feedbackError) throw feedbackError

      // Fetch announcements data
      const { data: announcementsData, error: announcementsError } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (announcementsError) throw announcementsError

      // Calculate stats
      const totalFeedback = feedbackData?.length || 0
      const pendingFeedback = feedbackData?.filter(f => f.status === 'pending').length || 0
      const totalAnnouncements = announcementsData?.length || 0
      
      // Get this month and last month feedback counts
      const now = new Date()
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
      
      const thisMonthFeedback = feedbackData?.filter(f => 
        new Date(f.created_at) >= thisMonthStart
      ).length || 0
      
      const lastMonthFeedback = feedbackData?.filter(f => {
        const date = new Date(f.created_at)
        return date >= lastMonthStart && date <= lastMonthEnd
      }).length || 0
      
      const feedbackChange = lastMonthFeedback > 0 
        ? Math.round(((thisMonthFeedback - lastMonthFeedback) / lastMonthFeedback) * 100)
        : 0

      // Calculate response metrics
      const respondedFeedback = feedbackData?.filter(f => f.status === 'responded' || f.status === 'resolved').length || 0
      const responseRate = totalFeedback > 0 ? Math.round((respondedFeedback / totalFeedback) * 100) : 0
      
      // Calculate average response time (in days)
      const responseTimes = feedbackData
        ?.filter(f => f.response_date && f.created_at)
        .map(f => {
          const created = new Date(f.created_at)
          const responded = new Date(f.response_date)
          return Math.abs(responded - created) / (1000 * 60 * 60 * 24)
        }) || []
      
      const avgResponseTime = responseTimes.length > 0
        ? (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(1)
        : 0

      // Mock satisfaction rate (could be calculated from feedback ratings if available)
      const satisfactionRate = 89

      setStats([
        { 
          name: 'Total Feedback', 
          value: totalFeedback.toString(), 
          change: `${feedbackChange > 0 ? '+' : ''}${feedbackChange}%`, 
          trend: feedbackChange >= 0 ? 'up' : 'down',
          icon: MessageSquare, 
          color: 'bg-blue-500',
          path: '/admin/feedback'
        },
        { 
          name: 'Pending Review', 
          value: pendingFeedback.toString(), 
          change: `${pendingFeedback}`, 
          trend: pendingFeedback < 10 ? 'down' : 'up',
          icon: Clock, 
          color: 'bg-orange-500',
          path: '/admin/feedback'
        },
        { 
          name: 'Active Announcements', 
          value: totalAnnouncements.toString(), 
          change: 'Live', 
          trend: 'up',
          icon: Megaphone, 
          color: 'bg-green-500',
          path: '/admin/announcements'
        },
        { 
          name: 'Response Rate', 
          value: `${responseRate}%`, 
          change: 'This month', 
          trend: responseRate >= 80 ? 'up' : 'down',
          icon: CheckCircle, 
          color: 'bg-purple-500',
          path: '/admin/feedback'
        },
      ])

      setRecentFeedback(feedbackData?.slice(0, 5) || [])
      setAnnouncements(announcementsData?.slice(0, 3) || [])
      
      setFeedbackTrends({
        thisMonth: thisMonthFeedback,
        lastMonth: lastMonthFeedback,
        responseRate,
        avgResponseTime,
        satisfactionRate
      })

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    fetchDashboardData()
  }

  return (
    <div className="space-y-8">
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-university-red to-university-red-600 rounded-3xl p-8 text-white relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold">{greeting}, Admin! 👋</h1>
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>
              <p className="text-white/80 max-w-2xl mb-4">
                Welcome to the USG Admin Dashboard. Here's your real-time overview of feedback, announcements, 
                and website activity.
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4" />
                  <span>Live Updates</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Auto-refresh every 30s</span>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mb-24" />
          </motion.div>

          {/* Stats Grid with animated counters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={stat.path}>
                  <motion.div 
                    whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm transition-all border border-school-grey-100 dark:border-gray-700 group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <motion.div 
                        className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <stat.icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <div className={`flex items-center space-x-1 text-sm font-medium ${stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                        {stat.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        <span>{stat.change}</span>
                      </div>
                    </div>
                    <motion.h3 
                      key={stat.value}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="text-3xl font-bold text-school-grey-800 dark:text-white mb-1"
                    >
                      {stat.value}
                    </motion.h3>
                    <p className="text-school-grey-500 dark:text-gray-400 text-sm group-hover:text-university-red dark:group-hover:text-university-red transition-colors">
                      {stat.name}
                    </p>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Feedback */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-school-grey-100 dark:border-gray-700 transition-colors"
        >
          <div className="p-6 border-b border-school-grey-100 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-school-grey-800 dark:text-white">Recent TINIG DINIG Feedback</h2>
                <p className="text-sm text-school-grey-500 dark:text-gray-400">Latest submissions from students</p>
              </div>
            </div>
            <Link 
              to="/admin/feedback" 
              className="text-university-red font-medium text-sm hover:underline flex items-center space-x-1 group"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="divide-y divide-school-grey-100 dark:divide-gray-700">
            <AnimatePresence mode="popLayout">
              {recentFeedback.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-8 text-center"
                >
                  <div className="w-16 h-16 bg-school-grey-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-school-grey-400 dark:text-gray-500" />
                  </div>
                  <p className="text-school-grey-500 dark:text-gray-400">No feedback yet</p>
                </motion.div>
              ) : (
                recentFeedback.map((feedback, index) => {
                  const StatusIcon = getStatusIcon(feedback.status)
                  return (
                    <Link key={feedback.id} to="/admin/feedback">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 hover:bg-school-grey-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(feedback.status)}`}>
                                <StatusIcon className="w-3 h-3 inline mr-1" />
                                {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1).replace('_', ' ')}
                              </span>
                              <span className="text-xs text-school-grey-500 dark:text-gray-400 bg-school-grey-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                                {feedback.category}
                              </span>
                            </div>
                            <h3 className="font-medium text-school-grey-800 dark:text-white mb-1">{feedback.subject}</h3>
                            <p className="text-sm text-school-grey-500 dark:text-gray-400">{feedback.college || 'N/A'}</p>
                          </div>
                          <span className="text-xs text-school-grey-400 dark:text-gray-500">
                            {formatTimeAgo(feedback.created_at)}
                          </span>
                        </div>
                      </motion.div>
                    </Link>
                  )
                })
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-school-grey-100 dark:border-gray-700 p-6 transition-colors"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-university-red/10 rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-university-red" />
              </div>
              <h2 className="text-lg font-bold text-school-grey-800 dark:text-white">Quick Actions</h2>
            </div>
            <div className="space-y-3">
              <Link 
                to="/admin/announcements"
                className="flex items-center space-x-3 p-3 bg-university-red/5 dark:bg-university-red/10 text-university-red rounded-xl hover:bg-university-red/10 dark:hover:bg-university-red/20 transition-colors group"
              >
                <Megaphone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Post Announcement</span>
              </Link>
              <Link 
                to="/admin/orgchart"
                className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
              >
                <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Update Org Chart</span>
              </Link>
              <Link 
                to="/admin/reports"
                className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors group"
              >
                <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Upload Report</span>
              </Link>
              <Link 
                to="/admin/site-content"
                className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors group"
              >
                <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Edit Site Content</span>
              </Link>
            </div>
          </motion.div>

          {/* Latest Announcements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-school-grey-100 dark:border-gray-700 p-6 transition-colors"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                <Megaphone className="w-5 h-5 text-green-500" />
              </div>
              <h2 className="text-lg font-bold text-school-grey-800 dark:text-white">Latest Announcements</h2>
            </div>
            <div className="space-y-4">
              {announcements.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-school-grey-500 dark:text-gray-400 text-sm">No announcements yet</p>
                </div>
              ) : (
                announcements.map((announcement, index) => (
                  <Link key={announcement.id} to="/admin/announcements">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-3 p-3 bg-school-grey-50 dark:bg-gray-700 rounded-xl hover:bg-school-grey-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                    >
                      <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Megaphone className="w-4 h-4 text-green-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-school-grey-800 dark:text-white text-sm truncate">
                          {announcement.title}
                        </h3>
                        <p className="text-xs text-school-grey-500 dark:text-gray-400 mt-1">
                          {formatTimeAgo(announcement.created_at)}
                        </p>
                      </div>
                    </motion.div>
                  </Link>
                ))
              )}
            </div>
          </motion.div>

          {/* Feedback Stats with Charts */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-school-grey-800 to-school-grey-900 dark:from-gray-900 dark:to-black rounded-2xl p-6 text-white"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-bold">TINIG DINIG Stats</h2>
            </div>
            <div className="space-y-5">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/70 text-sm">Response Rate</span>
                  <motion.span 
                    className="font-bold text-lg"
                    key={feedbackTrends.responseRate}
                    initial={{ scale: 1.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    {feedbackTrends.responseRate}%
                  </motion.span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2.5 overflow-hidden">
                  <motion.div 
                    className="bg-gradient-to-r from-green-400 to-green-500 h-2.5 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${feedbackTrends.responseRate}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
              >
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-white/70" />
                  <span className="text-white/70 text-sm">Avg. Response Time</span>
                </div>
                <motion.span 
                  className="font-bold"
                  key={feedbackTrends.avgResponseTime}
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  {feedbackTrends.avgResponseTime} days
                </motion.span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
              >
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-white/70" />
                  <span className="text-white/70 text-sm">Satisfaction Rate</span>
                </div>
                <motion.span 
                  className="font-bold"
                  key={feedbackTrends.satisfactionRate}
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  {feedbackTrends.satisfactionRate}%
                </motion.span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="pt-4 border-t border-white/10"
              >
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-white/70">This Month</span>
                  <span className="font-bold text-green-400">{feedbackTrends.thisMonth} submissions</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">Last Month</span>
                  <span className="font-bold text-white/70">{feedbackTrends.lastMonth} submissions</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
        </>
      )}
    </div>
  )
}
