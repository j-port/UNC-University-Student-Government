import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
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
import { useFeedback, useNotification } from '../../hooks'
import { formatDate } from '../../utils/formatters'
import { FEEDBACK_CATEGORIES, FEEDBACK_STATUSES } from '../../utils/constants'
import { Notification, FormModal } from '../../components/admin'

export default function AdminFeedback() {
  // Custom hooks
  const { feedback: feedbackData, loading, error, updateStatus, remove, reload } = useFeedback()
  const { notification, showSuccess, showError, dismiss } = useNotification()
  
  // UI State
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [selectedFeedback, setSelectedFeedback] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateStatus(id, newStatus)
      showSuccess('Status updated successfully!')
    } catch (error) {
      showError(error.message || 'Failed to update status')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return

    try {
      await remove(id)
      showSuccess('Feedback deleted successfully!')
      if (selectedFeedback?.id === id) {
        setShowModal(false)
        setSelectedFeedback(null)
      }
    } catch (error) {
      showError(error.message || 'Failed to delete feedback')
    }
  }

  const statusOptions = ['all', ...Object.values(FEEDBACK_STATUSES)]
  const categoryOptions = ['All Categories', ...FEEDBACK_CATEGORIES.map(c => c.label)]

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-university-red animate-spin mx-auto mb-4" />
          <p className="text-school-grey-600 dark:text-gray-400">Loading feedback...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-school-grey-800 dark:text-white">TINIG DINIG Feedback</h1>
          <p className="text-school-grey-500 dark:text-gray-400">Manage and respond to student feedback</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-school-grey-100 dark:bg-gray-700 text-school-grey-700 dark:text-gray-200 rounded-xl hover:bg-school-grey-200 dark:hover:bg-gray-600 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button 
            onClick={reload}
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
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-school-grey-100 dark:border-gray-700 p-4 transition-colors">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-school-grey-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search feedback..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-school-grey-50 dark:bg-gray-700 border border-school-grey-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-university-red/20 focus:border-university-red transition-all text-school-grey-800 dark:text-white placeholder-school-grey-400 dark:placeholder-gray-500"
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
              className="appearance-none px-4 py-3 pr-10 bg-school-grey-50 dark:bg-gray-700 border border-school-grey-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-university-red/20 focus:border-university-red text-school-grey-800 dark:text-white transition-all"
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
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-school-grey-100 dark:border-gray-700 overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-school-grey-50 dark:bg-gray-700 border-b border-school-grey-100 dark:border-gray-600">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-school-grey-600 dark:text-gray-300">Subject</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-school-grey-600 dark:text-gray-300">Category</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-school-grey-600 dark:text-gray-300">Submitted By</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-school-grey-600 dark:text-gray-300">Date</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-school-grey-600 dark:text-gray-300">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-school-grey-600 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-school-grey-100 dark:divide-gray-700">
              {filteredFeedback.map((item) => {
                const StatusIcon = getStatusIcon(item.status)
                return (
                  <motion.tr 
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-school-grey-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="font-medium text-school-grey-800 dark:text-white truncate">{item.subject}</p>
                        <p className="text-sm text-school-grey-500 dark:text-gray-400 truncate">{item.message.substring(0, 50)}...</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-school-grey-100 dark:bg-gray-700 text-school-grey-700 dark:text-gray-300 rounded-full text-sm">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-school-grey-800 dark:text-white">
                          {item.isAnonymous ? 'Anonymous' : item.fullName}
                        </p>
                        <p className="text-sm text-school-grey-500 dark:text-gray-400">{item.college}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-school-grey-600 dark:text-gray-400">
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
            <MessageSquare className="w-12 h-12 text-school-grey-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-school-grey-600 dark:text-gray-300 mb-2">No feedback found</h3>
            <p className="text-school-grey-500 dark:text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Feedback Detail Modal */}
      <FormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Feedback Details"
      >
        {selectedFeedback && (
          <div className="space-y-6">
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
              <h3 className="text-lg font-bold text-school-grey-800 dark:text-white mb-2">{selectedFeedback.subject}</h3>
              <span className="px-3 py-1 bg-school-grey-100 dark:bg-gray-700 text-school-grey-700 dark:text-gray-300 rounded-full text-sm">
                {selectedFeedback.category}
              </span>
            </div>

            {/* Message */}
            <div className="bg-school-grey-50 dark:bg-gray-700 rounded-xl p-4">
              <p className="text-school-grey-700 dark:text-gray-300 leading-relaxed">{selectedFeedback.message}</p>
            </div>

            {/* Submitter Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-school-grey-500 dark:text-gray-400">Submitted By</label>
                <p className="text-school-grey-800 dark:text-white font-medium">
                  {selectedFeedback.isAnonymous ? 'Anonymous' : selectedFeedback.fullName}
                </p>
              </div>
              {!selectedFeedback.isAnonymous && (
                <>
                  <div>
                    <label className="text-sm font-medium text-school-grey-500 dark:text-gray-400">Email</label>
                    <p className="text-school-grey-800 dark:text-white">{selectedFeedback.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-school-grey-500 dark:text-gray-400">Student ID</label>
                    <p className="text-school-grey-800 dark:text-white">{selectedFeedback.studentId}</p>
                  </div>
                </>
              )}
              <div>
                <label className="text-sm font-medium text-school-grey-500 dark:text-gray-400">College</label>
                <p className="text-school-grey-800 dark:text-white">{selectedFeedback.college}</p>
              </div>
            </div>

            {/* Update Status */}
            <div>
              <label className="text-sm font-medium text-school-grey-500 block mb-2">Update Status</label>
              <div className="flex flex-wrap gap-2">
                {Object.values(FEEDBACK_STATUSES).map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      handleStatusChange(selectedFeedback.id, status)
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

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-school-grey-100 dark:bg-gray-700 text-school-grey-700 dark:text-gray-300 rounded-xl hover:bg-school-grey-200 dark:hover:bg-gray-600 transition-colors"
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
          </div>
        )}
      </FormModal>

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <Notification notification={notification} onDismiss={dismiss} />
        )}
      </AnimatePresence>
    </div>
  )
}
