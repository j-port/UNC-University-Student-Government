import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Eye, 
  Trash2, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  MessageSquare,
  ChevronDown,
  Download,
  RefreshCw
} from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'

export default function AdminFeedback() {
  const [feedbackData, setFeedbackData] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [selectedFeedback, setSelectedFeedback] = useState(null)
  const [showModal, setShowModal] = useState(false)

  // Fetch feedback from Supabase
  useEffect(() => {
    fetchFeedback()
  }, [])

  const fetchFeedback = async () => {
    console.log('🔵 FETCH FEEDBACK STARTED')
    console.log('🔵 Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
    console.log('🔵 Supabase Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY)
    console.log('🔵 Supabase client:', supabase)
    try {
      setLoading(true)
      console.log('🔵 Loading set to true')
      
      // Check auth session
      const { data: { session } } = await supabase.auth.getSession()
      console.log('🔵 Current session:', session)
      console.log('🔵 User:', session?.user)
      
      console.log('🔵 About to query feedback table...')
      
      supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false })
        .then(result => {
          console.log('🔵 Query returned via .then()!', result)
          const { data, error } = result
          
          if (error) {
            console.error('Supabase error:', error)
            alert('Error fetching feedback: ' + error.message)
            setLoading(false)
            return
          }
          
          console.log('Raw data from Supabase:', data)
          console.log('Data length:', data?.length)
          
          if (!data || data.length === 0) {
            console.warn('No data returned from Supabase!')
            setFeedbackData([])
            setLoading(false)
            return
          }
          
          // Transform data to match component structure
          const transformedData = data.map(item => ({
            id: item.id,
            fullName: item.name,
            email: item.email,
            studentId: item.student_id,
            college: item.college,
            category: item.category,
            subject: item.subject || 'No Subject',
            message: item.message,
            status: item.status || 'pending',
            isAnonymous: item.is_anonymous || false,
            createdAt: item.created_at,
          }))
          
          console.log('Transformed data:', transformedData)
          setFeedbackData(transformedData)
          console.log('State should be updated now')
          setLoading(false)
        })
        .catch(error => {
          console.error('Error fetching feedback:', error)
          alert('Error: ' + error.message)
          setLoading(false)
        })
    } catch (error) {
      console.error('Catch block error:', error)
      setLoading(false)
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('feedback')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error

      // Update local state
      setFeedbackData(prev =>
        prev.map(item =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      )
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return

    try {
      const { error } = await supabase
        .from('feedback')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Update local state
      setFeedbackData(prev => prev.filter(item => item.id !== id))
    } catch (error) {
      console.error('Error deleting feedback:', error)
    }
  }

  const statusOptions = ['all', 'pending', 'in-progress', 'resolved']
  const categoryOptions = ['All Categories', 'Academic', 'Facilities', 'Financial', 'Events', 'Services', 'Suggestion', 'Complaint', 'Other']

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'in-progress': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'resolved': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
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

  const filteredFeedback = feedbackData.filter((item) => {
    const matchesSearch = (item.subject || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.message || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    const matchesCategory = categoryFilter === 'All Categories' || item.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  console.log('feedbackData:', feedbackData)
  console.log('filteredFeedback:', filteredFeedback)
  console.log('searchTerm:', searchTerm, 'statusFilter:', statusFilter, 'categoryFilter:', categoryFilter)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-university-red animate-spin mx-auto mb-4" />
          <p className="text-school-grey-600">Loading feedback...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-school-grey-800">TINIG DINIG Feedback</h1>
          <p className="text-school-grey-500">Manage and respond to student feedback</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-school-grey-100 text-school-grey-700 rounded-xl hover:bg-school-grey-200 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button 
            onClick={fetchFeedback}
            className="flex items-center space-x-2 px-4 py-2 bg-university-red text-white rounded-xl hover:bg-university-red-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: feedbackData.length, color: 'bg-school-grey-100 text-school-grey-700' },
          { label: 'Pending', value: feedbackData.filter(f => f.status === 'pending').length, color: 'bg-orange-100 text-orange-700' },
          { label: 'In Progress', value: feedbackData.filter(f => f.status === 'in-progress').length, color: 'bg-blue-100 text-blue-700' },
          { label: 'Resolved', value: feedbackData.filter(f => f.status === 'resolved').length, color: 'bg-green-100 text-green-700' },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.color} rounded-xl p-4 text-center`}>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-school-grey-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-school-grey-400" />
            <input
              type="text"
              placeholder="Search feedback..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-school-grey-50 border border-school-grey-200 rounded-xl focus:ring-2 focus:ring-university-red/20 focus:border-university-red transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none px-4 py-3 pr-10 bg-school-grey-50 border border-school-grey-200 rounded-xl focus:ring-2 focus:ring-university-red/20 focus:border-university-red transition-all"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-school-grey-400 pointer-events-none" />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="appearance-none px-4 py-3 pr-10 bg-school-grey-50 border border-school-grey-200 rounded-xl focus:ring-2 focus:ring-university-red/20 focus:border-university-red transition-all"
            >
              {categoryOptions.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-school-grey-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Feedback List */}
      <div className="bg-white rounded-2xl shadow-sm border border-school-grey-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-school-grey-50 border-b border-school-grey-100">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-school-grey-600">Subject</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-school-grey-600">Category</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-school-grey-600">Submitted By</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-school-grey-600">Date</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-school-grey-600">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-school-grey-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-school-grey-100">
              {filteredFeedback.map((item) => {
                const StatusIcon = getStatusIcon(item.status)
                return (
                  <motion.tr 
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-school-grey-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="font-medium text-school-grey-800 truncate">{item.subject}</p>
                        <p className="text-sm text-school-grey-500 truncate">{item.message.substring(0, 50)}...</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-school-grey-100 text-school-grey-700 rounded-full text-sm">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-school-grey-800">
                          {item.isAnonymous ? 'Anonymous' : item.fullName}
                        </p>
                        <p className="text-sm text-school-grey-500">{item.college}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-school-grey-600">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(item.status)}`}>
                        <StatusIcon className="w-3 h-3" />
                        <span>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => { setSelectedFeedback(item); setShowModal(true); }}
                          className="p-2 text-school-grey-500 hover:text-university-red hover:bg-university-red/10 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-school-grey-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredFeedback.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-school-grey-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-school-grey-600 mb-2">No feedback found</h3>
            <p className="text-school-grey-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Feedback Detail Modal */}
      {showModal && selectedFeedback && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-school-grey-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-school-grey-800">Feedback Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-school-grey-500 hover:text-school-grey-700 hover:bg-school-grey-100 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center space-x-1 px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(selectedFeedback.status)}`}>
                  {(() => { const Icon = getStatusIcon(selectedFeedback.status); return <Icon className="w-4 h-4" />; })()}
                  <span>{selectedFeedback.status.charAt(0).toUpperCase() + selectedFeedback.status.slice(1)}</span>
                </span>
                <span className="text-sm text-school-grey-500">{formatDate(selectedFeedback.createdAt)}</span>
              </div>

              {/* Subject */}
              <div>
                <h3 className="text-lg font-bold text-school-grey-800 mb-2">{selectedFeedback.subject}</h3>
                <span className="px-3 py-1 bg-school-grey-100 text-school-grey-700 rounded-full text-sm">
                  {selectedFeedback.category}
                </span>
              </div>

              {/* Message */}
              <div className="bg-school-grey-50 rounded-xl p-4">
                <p className="text-school-grey-700 leading-relaxed">{selectedFeedback.message}</p>
              </div>

              {/* Submitter Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-school-grey-500">Submitted By</label>
                  <p className="text-school-grey-800 font-medium">
                    {selectedFeedback.isAnonymous ? 'Anonymous' : selectedFeedback.fullName}
                  </p>
                </div>
                {!selectedFeedback.isAnonymous && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-school-grey-500">Email</label>
                      <p className="text-school-grey-800">{selectedFeedback.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-school-grey-500">Student ID</label>
                      <p className="text-school-grey-800">{selectedFeedback.studentId}</p>
                    </div>
                  </>
                )}
                <div>
                  <label className="text-sm font-medium text-school-grey-500">College</label>
                  <p className="text-school-grey-800">{selectedFeedback.college}</p>
                </div>
              </div>

              {/* Update Status */}
              <div>
                <label className="text-sm font-medium text-school-grey-500 block mb-2">Update Status</label>
                <div className="flex flex-wrap gap-2">
                  {['pending', 'in-progress', 'resolved'].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        updateStatus(selectedFeedback.id, status)
                        setSelectedFeedback({ ...selectedFeedback, status })
                      }}
                      className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                        selectedFeedback.status === status
                          ? 'bg-university-red text-white'
                          : 'bg-school-grey-100 text-school-grey-700 hover:bg-school-grey-200'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Response */}
              <div>
                <label className="text-sm font-medium text-school-grey-500 block mb-2">Add Response</label>
                <textarea
                  placeholder="Type your response to the student..."
                  className="w-full px-4 py-3 bg-school-grey-50 border border-school-grey-200 rounded-xl focus:ring-2 focus:ring-university-red/20 focus:border-university-red transition-all resize-none h-32"
                />
              </div>
            </div>

            <div className="p-6 border-t border-school-grey-100 flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-school-grey-100 text-school-grey-700 rounded-xl hover:bg-school-grey-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-university-red text-white rounded-xl hover:bg-university-red-600 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
