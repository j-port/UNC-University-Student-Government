import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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
  Calendar
} from 'lucide-react'

const stats = [
  { 
    name: 'Total Feedback', 
    value: '156', 
    change: '+12%', 
    trend: 'up',
    icon: MessageSquare, 
    color: 'bg-blue-500',
    path: '/admin/feedback'
  },
  { 
    name: 'Pending Review', 
    value: '23', 
    change: '-5%', 
    trend: 'down',
    icon: Clock, 
    color: 'bg-orange-500',
    path: '/admin/feedback'
  },
  { 
    name: 'Announcements', 
    value: '45', 
    change: '+8%', 
    trend: 'up',
    icon: Megaphone, 
    color: 'bg-green-500',
    path: '/admin/announcements'
  },
  { 
    name: 'Documents', 
    value: '89', 
    change: '+15%', 
    trend: 'up',
    icon: FileText, 
    color: 'bg-purple-500',
    path: '/admin/documents'
  },
]

const recentFeedback = [
  { 
    id: 1, 
    subject: 'Classroom Air Conditioning Issue',
    category: 'Facilities',
    status: 'pending',
    date: '2 hours ago',
    college: 'College of Engineering'
  },
  { 
    id: 2, 
    subject: 'Request for Extended Library Hours',
    category: 'Academic',
    status: 'in-progress',
    date: '5 hours ago',
    college: 'College of Arts and Sciences'
  },
  { 
    id: 3, 
    subject: 'Scholarship Inquiry',
    category: 'Financial',
    status: 'resolved',
    date: '1 day ago',
    college: 'College of Nursing'
  },
  { 
    id: 4, 
    subject: 'Wi-Fi Connectivity Problems',
    category: 'Facilities',
    status: 'pending',
    date: '1 day ago',
    college: 'College of Computer Studies'
  },
]

const upcomingEvents = [
  { name: 'USG General Assembly', date: 'Jan 15, 2025', type: 'Meeting' },
  { name: 'Budget Review Session', date: 'Jan 18, 2025', type: 'Finance' },
  { name: 'Student Leaders Summit', date: 'Jan 22, 2025', type: 'Event' },
]

const getStatusColor = (status) => {
  switch (status) {
    case 'pending': return 'bg-orange-100 text-orange-700'
    case 'in-progress': return 'bg-blue-100 text-blue-700'
    case 'resolved': return 'bg-green-100 text-green-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

const getStatusIcon = (status) => {
  switch (status) {
    case 'pending': return Clock
    case 'in-progress': return Eye
    case 'resolved': return CheckCircle
    default: return AlertCircle
  }
}

export default function AdminDashboard() {
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 18) setGreeting('Good afternoon')
    else setGreeting('Good evening')
  }, [])

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-university-red to-university-red-600 rounded-3xl p-8 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">{greeting}, Admin! 👋</h1>
        <p className="text-white/80 max-w-2xl">
          Welcome to the USG Admin Dashboard. Here you can manage feedback, announcements, 
          organizational chart, and all other content on the USG website.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={stat.path}>
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow border border-school-grey-100">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center space-x-1 text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-orange-600'}`}>
                    {stat.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span>{stat.change}</span>
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-school-grey-800 mb-1">{stat.value}</h3>
                <p className="text-school-grey-500 text-sm">{stat.name}</p>
              </div>
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
          className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-school-grey-100"
        >
          <div className="p-6 border-b border-school-grey-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-school-grey-800">Recent TINIG DINIG Feedback</h2>
              <p className="text-sm text-school-grey-500">Latest submissions from students</p>
            </div>
            <Link 
              to="/admin/feedback" 
              className="text-university-red font-medium text-sm hover:underline flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="divide-y divide-school-grey-100">
            {recentFeedback.map((feedback) => {
              const StatusIcon = getStatusIcon(feedback.status)
              return (
                <div 
                  key={feedback.id} 
                  className="p-4 hover:bg-school-grey-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(feedback.status)}`}>
                          <StatusIcon className="w-3 h-3 inline mr-1" />
                          {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
                        </span>
                        <span className="text-xs text-school-grey-500 bg-school-grey-100 px-2 py-1 rounded-full">
                          {feedback.category}
                        </span>
                      </div>
                      <h3 className="font-medium text-school-grey-800 mb-1">{feedback.subject}</h3>
                      <p className="text-sm text-school-grey-500">{feedback.college}</p>
                    </div>
                    <span className="text-xs text-school-grey-400">{feedback.date}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-school-grey-100 p-6"
          >
            <h2 className="text-lg font-bold text-school-grey-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link 
                to="/admin/announcements"
                className="flex items-center space-x-3 p-3 bg-university-red/5 text-university-red rounded-xl hover:bg-university-red/10 transition-colors"
              >
                <Megaphone className="w-5 h-5" />
                <span className="font-medium">Post Announcement</span>
              </Link>
              <Link 
                to="/admin/orgchart"
                className="flex items-center space-x-3 p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
              >
                <Users className="w-5 h-5" />
                <span className="font-medium">Update Org Chart</span>
              </Link>
              <Link 
                to="/admin/reports"
                className="flex items-center space-x-3 p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors"
              >
                <FileText className="w-5 h-5" />
                <span className="font-medium">Upload Report</span>
              </Link>
              <Link 
                to="/admin/site-content"
                className="flex items-center space-x-3 p-3 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition-colors"
              >
                <FileText className="w-5 h-5" />
                <span className="font-medium">Edit Site Content</span>
              </Link>
            </div>
          </motion.div>

          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-school-grey-100 p-6"
          >
            <h2 className="text-lg font-bold text-school-grey-800 mb-4">Upcoming Events</h2>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-school-grey-100 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-school-grey-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-school-grey-800 text-sm">{event.name}</h3>
                    <p className="text-xs text-school-grey-500">{event.date} • {event.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Feedback Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-school-grey-800 to-school-grey-900 rounded-2xl p-6 text-white"
          >
            <h2 className="text-lg font-bold mb-4">TINIG DINIG Stats</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/70">Response Rate</span>
                <span className="font-bold">95%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-green-400 h-2 rounded-full" style={{ width: '95%' }} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Avg. Response Time</span>
                <span className="font-bold">2.5 days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Satisfaction Rate</span>
                <span className="font-bold">89%</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
