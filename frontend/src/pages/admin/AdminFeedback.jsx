import { useState, useEffect } from 'react'
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
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Activity
} from 'lucide-react'
import { useFeedback, useNotification } from '../../hooks'
import { formatDate } from '../../utils/formatters'
import { FEEDBACK_CATEGORIES, FEEDBACK_STATUSES } from '../../utils/constants'
import { Notification, FormModal } from '../../components/admin'
import { supabase } from '../../lib/supabaseClient'

export default function AdminFeedback() {
  // Custom hooks
  const { feedback: feedbackData, loading, error, updateStatus, remove, reload, fetchFeedback } = useFeedback()
  const { notification, showSuccess, showError, dismiss } = useNotification()
  
  // UI State
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [collegeFilter, setCollegeFilter] = useState('all')
  const [dateFromFilter, setDateFromFilter] = useState('')
  const [dateToFilter, setDateToFilter] = useState('')
  const [selectedFeedback, setSelectedFeedback] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [responseText, setResponseText] = useState('')
  const [savingResponse, setSavingResponse] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [selectedItems, setSelectedItems] = useState([])
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [previousStats, setPreviousStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
  })

  // Track stats changes
  useEffect(() => {
    if (feedbackData.length > 0) {
      setPreviousStats({
        total: feedbackData.length,
        pending: feedbackData.filter(f => f.status === 'pending').length,
        inProgress: feedbackData.filter(f => f.status === 'in_progress').length,
        resolved: feedbackData.filter(f => f.status === 'resolved').length
      })
    }
  }, [feedbackData])

  const handleManualRefresh = async () => {
    setRefreshing(true)
    try {
      await fetchFeedback()
      setLastUpdate(new Date())
      showSuccess('Feedback list refreshed!')
    } catch (error) {
      showError('Failed to refresh data')
    } finally {
      setTimeout(() => setRefreshing(false), 500)
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateStatus(id, newStatus)
      showSuccess('Status updated successfully!')
      // Refresh data to sync across the app
      await fetchFeedback()
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
      // Refresh data to sync
      await fetchFeedback()
    } catch (error) {
      showError(error.message || 'Failed to delete feedback')
    }
  }

  const handleSaveResponse = async () => {
    if (!selectedFeedback) return
    
    setSavingResponse(true)
    try {
      // Update the status first if needed
      if (selectedFeedback.status !== 'responded') {
        await updateStatus(selectedFeedback.id, 'responded')
      }
      
      // Save the response
      const { error } = await supabase
        .from('feedback')
        .update({ response: responseText })
        .eq('id', selectedFeedback.id)
      
      if (error) throw error
      
      showSuccess('Response saved successfully!')
      setShowModal(false)
      setSelectedFeedback(null)
      setResponseText('')
      
      // Smart refresh - only refetch data without page reload
      await fetchFeedback()
    } catch (error) {
      showError(error.message || 'Failed to save response')
    } finally {
      setSavingResponse(false)
    }
  }

  const statusOptions = ['all', ...Object.values(FEEDBACK_STATUSES)]
  const categoryOptions = ['all', ...FEEDBACK_CATEGORIES.map(c => c.value)]

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800'
      case 'in_progress': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800'
      case 'responded': return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800'
      case 'resolved': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
      default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
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

  // Calculate stats with changes
  const currentStats = {
    total: feedbackData.length,
    pending: feedbackData.filter(f => f.status === 'pending').length,
    inProgress: feedbackData.filter(f => f.status === 'in_progress').length,
    resolved: feedbackData.filter(f => f.status === 'resolved').length
  }

  const statsChange = {
    total: currentStats.total - previousStats.total,
    pending: currentStats.pending - previousStats.pending,
    inProgress: currentStats.inProgress - previousStats.inProgress,
    resolved: currentStats.resolved - previousStats.resolved
  }

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000)
    if (seconds < 60) return 'Just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  // Enhanced filtering logic
  const filteredFeedback = feedbackData.filter(item => {
    // Text search - search across multiple fields
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      const matchesSearch = 
        (item.name || '').toLowerCase().includes(search) ||
        (item.email || '').toLowerCase().includes(search) ||
        (item.subject || '').toLowerCase().includes(search) ||
        (item.message || '').toLowerCase().includes(search) ||
        (item.reference_number || '').toLowerCase().includes(search) ||
        (item.college || '').toLowerCase().includes(search) ||
        (item.student_id || '').toLowerCase().includes(search)
      
      if (!matchesSearch) return false
    }

    // Status filter
    if (statusFilter !== 'all' && item.status !== statusFilter) return false

    // Category filter
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false

    // College filter
    if (collegeFilter !== 'all' && item.college !== collegeFilter) return false

    // Date range filter
    if (dateFromFilter) {
      const itemDate = new Date(item.created_at)
      const fromDate = new Date(dateFromFilter)
      if (itemDate < fromDate) return false
    }

    if (dateToFilter) {
      const itemDate = new Date(item.created_at)
      const toDate = new Date(dateToFilter)
      toDate.setHours(23, 59, 59, 999) // End of day
      if (itemDate > toDate) return false
    }

    return true
  })

  // Get unique colleges from feedback data
  const colleges = [...new Set(feedbackData.map(f => f.college).filter(Boolean))].sort()

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setCategoryFilter('all')
    setCollegeFilter('all')
    setDateFromFilter('')
    setDateToFilter('')
  }

  const hasActiveFilters = searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' || 
                          collegeFilter !== 'all' || dateFromFilter || dateToFilter

  // Bulk action handlers
  const toggleSelectAll = () => {
    if (selectedItems.length === filteredFeedback.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredFeedback.map(item => item.id))
    }
  }

  const toggleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handleBulkStatusChange = async (newStatus) => {
    if (selectedItems.length === 0) return
    
    try {
      await Promise.all(selectedItems.map(id => updateStatus(id, newStatus)))
      showSuccess(`Updated ${selectedItems.length} item(s) to ${newStatus}`)
      setSelectedItems([])
      await fetchFeedback()
    } catch (error) {
      showError('Failed to update some items')
    }
  }

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return
    
    if (!window.confirm(`Are you sure you want to delete ${selectedItems.length} item(s)?`)) return

    try {
      await Promise.all(selectedItems.map(id => remove(id)))
      showSuccess(`Deleted ${selectedItems.length} item(s)`)
      setSelectedItems([])
      await fetchFeedback()
    } catch (error) {
      showError('Failed to delete some items')
    }
  }

  // Export to CSV
  const exportToCSV = () => {
    const dataToExport = selectedItems.length > 0 
      ? feedbackData.filter(item => selectedItems.includes(item.id))
      : filteredFeedback

    if (dataToExport.length === 0) {
      showError('No data to export')
      return
    }

    // CSV Headers
    const headers = ['Reference Number', 'Date', 'Student Name', 'Email', 'Student ID', 'College', 'Category', 'Subject', 'Message', 'Status', 'Admin Response']
    
    // CSV Rows
    const rows = dataToExport.map(item => [
      item.referenceNumber || '',
      formatDate(item.createdAt),
      item.isAnonymous ? 'Anonymous' : item.fullName || '',
      item.email || '',
      item.studentId || '',
      item.college || '',
      item.category || '',
      `"${(item.subject || '').replace(/"/g, '""')}"`, // Escape quotes
      `"${(item.message || '').replace(/"/g, '""')}"`,
      item.status || '',
      `"${(item.response || '').replace(/"/g, '""')}"`
    ])

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `feedback-export-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    showSuccess(`Exported ${dataToExport.length} item(s) to CSV`)
  }

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
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2">
            <h1 className="text-xl sm:text-2xl font-bold text-school-grey-800 dark:text-white mb-2 sm:mb-0">TINIG DINIG Feedback</h1>
            {refreshing && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm w-fit">
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>Syncing...</span>
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-school-grey-500 dark:text-gray-400">
            <span className="hidden sm:inline">Manage and respond to student feedback</span>
            <div className="flex items-center space-x-1">
              <Activity className="w-4 h-4" />
              <span>Updated: {formatTimeAgo(lastUpdate)}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button 
            onClick={exportToCSV}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export {selectedItems.length > 0 ? `(${selectedItems.length})` : ''}</span>
          </button>
          <button 
            onClick={handleManualRefresh}
            disabled={refreshing}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-university-red text-white rounded-xl hover:bg-university-red-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Filter Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { 
            label: 'Total', 
            value: currentStats.total, 
            change: statsChange.total,
            color: 'bg-school-grey-100 text-school-grey-700 dark:bg-gray-700 dark:text-gray-300',
            activeColor: 'bg-school-grey-700 text-white dark:bg-gray-600',
            filterValue: 'all',
            icon: MessageSquare
          },
          { 
            label: 'Pending', 
            value: currentStats.pending, 
            change: statsChange.pending,
            color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
            activeColor: 'bg-orange-600 text-white dark:bg-orange-700',
            filterValue: 'pending',
            icon: Clock
          },
          { 
            label: 'In Progress', 
            value: currentStats.inProgress, 
            change: statsChange.inProgress,
            color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
            activeColor: 'bg-blue-600 text-white dark:bg-blue-700',
            filterValue: 'in_progress',
            icon: Eye
          },
          { 
            label: 'Resolved', 
            value: currentStats.resolved, 
            change: statsChange.resolved,
            color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
            activeColor: 'bg-green-600 text-white dark:bg-green-700',
            filterValue: 'resolved',
            icon: CheckCircle
          },
        ].map((stat) => {
          const isActive = statusFilter === stat.filterValue
          return (
          <motion.button
            key={stat.label} 
            onClick={() => setStatusFilter(stat.filterValue)}
            className={`${
              isActive ? stat.activeColor : stat.color
            } rounded-xl p-4 relative overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
              isActive ? 'border-current' : 'border-transparent'
            }`}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-5 h-5 ${isActive ? 'opacity-100' : 'opacity-50'}`} />
              {stat.change !== 0 && (
                <div className={`flex items-center space-x-1 text-xs font-medium ${
                  isActive 
                    ? 'text-white/90' 
                    : stat.change > 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                }`}>
                  {stat.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  <span>{Math.abs(stat.change)}</span>
                </div>
              )}
            </div>
            <motion.div 
              key={stat.value}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="text-3xl font-bold mb-1"
            >
              {stat.value}
            </motion.div>
            <div className={`text-sm font-medium ${isActive ? 'opacity-100' : 'opacity-90'}`}>{stat.label}</div>
            {isActive && (
              <motion.div
                layoutId="activeFilter"
                className="absolute bottom-0 left-0 right-0 h-1 bg-white/40"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        )})
      }
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-school-grey-100 dark:border-gray-700 p-3 md:p-4 transition-colors">
        <div className="flex flex-col gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-school-grey-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search by name, email, student ID, reference number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-school-grey-50 dark:bg-gray-700 border border-school-grey-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-university-red/20 focus:border-university-red transition-all text-school-grey-800 dark:text-white placeholder-school-grey-400 dark:placeholder-gray-500"
            />
          </div>

          {/* Basic Filters Row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Category Filter */}
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="appearance-none w-full px-3 md:px-4 py-3 pr-10 bg-school-grey-50 dark:bg-gray-700 border border-school-grey-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-university-red/20 focus:border-university-red text-school-grey-800 dark:text-white transition-all text-sm"
              >
                <option value="all">All Categories</option>
                {FEEDBACK_CATEGORIES.map((category) => (
                  <option key={category.value} value={category.value}>{category.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-school-grey-400 dark:text-gray-500 pointer-events-none" />
            </div>

            {/* Advanced Filters Toggle */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-school-grey-100 dark:bg-gray-700 text-school-grey-700 dark:text-gray-200 rounded-xl hover:bg-school-grey-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
            >
              <span>{showAdvancedFilters ? 'Hide' : 'Show'} Advanced</span>
              <motion.div
                animate={{ rotate: showAdvancedFilters ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </button>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showAdvancedFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-school-grey-200 dark:border-gray-700">
                  {/* College Filter */}
                  <div className="relative">
                    <select
                      value={collegeFilter}
                      onChange={(e) => setCollegeFilter(e.target.value)}
                      className="appearance-none w-full px-3 md:px-4 py-3 pr-10 bg-school-grey-50 dark:bg-gray-700 border border-school-grey-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-university-red/20 focus:border-university-red text-school-grey-800 dark:text-white transition-all text-sm"
                    >
                      <option value="all">All Colleges</option>
                      {colleges.map((college) => (
                        <option key={college} value={college}>{college}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-school-grey-400 dark:text-gray-500 pointer-events-none" />
                  </div>

                  {/* Date From */}
                  <div>
                    <label className="block text-xs text-school-grey-600 dark:text-gray-400 mb-1 ml-1">From Date</label>
                    <input
                      type="date"
                      value={dateFromFilter}
                      onChange={(e) => setDateFromFilter(e.target.value)}
                      className="w-full px-3 md:px-4 py-3 bg-school-grey-50 dark:bg-gray-700 border border-school-grey-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-university-red/20 focus:border-university-red text-school-grey-800 dark:text-white transition-all text-sm"
                    />
                  </div>

                  {/* Date To */}
                  <div className="md:col-span-2">
                    <label className="block text-xs text-school-grey-600 dark:text-gray-400 mb-1 ml-1">To Date</label>
                    <input
                      type="date"
                      value={dateToFilter}
                      onChange={(e) => setDateToFilter(e.target.value)}
                      className="w-full px-3 md:px-4 py-3 bg-school-grey-50 dark:bg-gray-700 border border-school-grey-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-university-red/20 focus:border-university-red text-school-grey-800 dark:text-white transition-all text-sm"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results count and clear filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-3 pt-3 border-t border-school-grey-200 dark:border-gray-700">
          <p className="text-xs sm:text-sm text-school-grey-600 dark:text-gray-400">
            Showing <span className="font-semibold text-school-grey-800 dark:text-white">{filteredFeedback.length}</span> of <span className="font-semibold text-school-grey-800 dark:text-white">{feedbackData.length}</span> items
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs sm:text-sm text-university-red hover:underline text-left sm:text-right font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {selectedItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-university-red text-white rounded-2xl p-4 shadow-lg"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">{selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleBulkStatusChange(e.target.value)
                      e.target.value = ''
                    }
                  }}
                  className="px-3 py-2 bg-white text-school-grey-800 rounded-lg text-sm font-medium cursor-pointer"
                  defaultValue=""
                >
                  <option value="" disabled>Change Status</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="responded">Responded</option>
                  <option value="resolved">Resolved</option>
                </select>
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-2 bg-white text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                >
                  Delete Selected
                </button>
                <button
                  onClick={() => setSelectedItems([])}
                  className="px-3 py-2 bg-white/20 text-white rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback List - Table view (hidden on mobile) */}
      <div className="hidden md:block bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-school-grey-100 dark:border-gray-700 overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-school-grey-50 dark:bg-gray-700 border-b border-school-grey-100 dark:border-gray-600">
              <tr>
                <th className="text-left px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === filteredFeedback.length && filteredFeedback.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 text-university-red border-school-grey-300 rounded focus:ring-university-red cursor-pointer"
                  />
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-school-grey-600 dark:text-gray-300">Reference</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-school-grey-600 dark:text-gray-300">Subject</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-school-grey-600 dark:text-gray-300">Category</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-school-grey-600 dark:text-gray-300">Submitted By</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-school-grey-600 dark:text-gray-300">Date</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-school-grey-600 dark:text-gray-300">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-school-grey-600 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-school-grey-100 dark:divide-gray-700">
              <AnimatePresence mode="popLayout">
                {filteredFeedback.length === 0 ? (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan="8" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <MessageSquare className="w-12 h-12 text-school-grey-300 dark:text-gray-600 mb-3" />
                        <p className="text-school-grey-600 dark:text-gray-400 font-medium">No feedback found</p>
                        <p className="text-sm text-school-grey-500 dark:text-gray-500 mt-1">
                          {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' 
                            ? 'Try adjusting your filters' 
                            : 'Feedback submissions will appear here'}
                        </p>
                      </div>
                    </td>
                  </motion.tr>
                ) : (
                  filteredFeedback.map((item, index) => {
                    const StatusIcon = getStatusIcon(item.status)
                    return (
                      <motion.tr 
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.03 }}
                        className="hover:bg-school-grey-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={() => toggleSelectItem(item.id)}
                            className="w-4 h-4 text-university-red border-school-grey-300 rounded focus:ring-university-red cursor-pointer"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-mono text-xs text-school-grey-600 dark:text-gray-400 bg-school-grey-100 dark:bg-gray-700 px-2 py-1 rounded">
                            {item.referenceNumber}
                          </span>
                        </td>
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
                            <span>{item.status.charAt(0).toUpperCase() + item.status.slice(1).replace('_', ' ')}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => { setSelectedFeedback(item); setResponseText(item.response || ''); setShowModal(true); }}
                              className="p-2 text-school-grey-500 dark:text-gray-400 hover:text-university-red hover:bg-university-red/10 dark:hover:bg-university-red/20 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-2 text-school-grey-500 dark:text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Feedback List - Mobile Card view */}
      <div className="md:hidden space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredFeedback.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center border border-school-grey-100 dark:border-gray-700"
            >
              <MessageSquare className="w-12 h-12 text-school-grey-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-school-grey-600 dark:text-gray-400 font-medium mb-1">No feedback found</p>
              <p className="text-sm text-school-grey-500 dark:text-gray-500">
                {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' 
                  ? 'Try adjusting your filters' 
                  : 'Feedback submissions will appear here'}
              </p>
            </motion.div>
          ) : (
            filteredFeedback.map((item, index) => {
              const StatusIcon = getStatusIcon(item.status)
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.03 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-school-grey-100 dark:border-gray-700 space-y-3"
                >
                  {/* Reference Number */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-school-grey-600 dark:text-gray-400 bg-school-grey-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {item.referenceNumber}
                    </span>
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium flex-shrink-0 border ${getStatusColor(item.status)}`}>
                      <StatusIcon className="w-3 h-3" />
                    </span>
                  </div>

                  {/* Header with status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-school-grey-800 dark:text-white mb-1 line-clamp-2">{item.subject}</h3>
                      <p className="text-sm text-school-grey-500 dark:text-gray-400 line-clamp-2">{item.message}</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-school-grey-500 dark:text-gray-400 text-xs mb-0.5">Category</p>
                      <span className="inline-block px-2 py-1 bg-school-grey-100 dark:bg-gray-700 text-school-grey-700 dark:text-gray-300 rounded-lg text-xs">
                        {item.category}
                      </span>
                    </div>
                    <div>
                      <p className="text-school-grey-500 dark:text-gray-400 text-xs mb-0.5">Submitted by</p>
                      <p className="font-medium text-school-grey-800 dark:text-white text-xs truncate">
                        {item.isAnonymous ? 'Anonymous' : item.fullName}
                      </p>
                    </div>
                    <div>
                      <p className="text-school-grey-500 dark:text-gray-400 text-xs mb-0.5">College</p>
                      <p className="text-school-grey-800 dark:text-white text-xs truncate">{item.college}</p>
                    </div>
                    <div>
                      <p className="text-school-grey-500 dark:text-gray-400 text-xs mb-0.5">Date</p>
                      <p className="text-school-grey-800 dark:text-white text-xs">{formatDate(item.createdAt)}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-school-grey-100 dark:border-gray-700">
                    <button
                      onClick={() => { 
                        setSelectedFeedback(item); 
                        setResponseText(item.response || '');
                        setShowModal(true); 
                      }}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 text-university-red bg-university-red/10 dark:bg-university-red/20 rounded-xl hover:bg-university-red/20 dark:hover:bg-university-red/30 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="font-medium text-sm">View Details</span>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-red-600 bg-red-50 dark:bg-red-900/30 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )
            })
          )}
        </AnimatePresence>
      </div>

      {/* Feedback Detail Modal */}
      <FormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Feedback Details"
      >
        {selectedFeedback && (
          <div className="space-y-4 md:space-y-6">
            {/* Reference Number */}
            <div className="flex items-center justify-between p-3 bg-school-grey-50 dark:bg-gray-700 rounded-xl">
              <div>
                <label className="text-xs font-medium text-school-grey-500 dark:text-gray-400 block mb-1">Reference Number</label>
                <span className="font-mono text-sm text-school-grey-800 dark:text-white font-semibold">{selectedFeedback.referenceNumber}</span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedFeedback.referenceNumber)
                  alert('Reference number copied to clipboard!')
                }}
                className="px-3 py-1.5 bg-university-red text-white rounded-lg hover:bg-university-red-600 transition-colors text-xs font-medium"
              >
                Copy
              </button>
            </div>

            {/* Status */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <span className={`inline-flex items-center space-x-1 px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(selectedFeedback.status)} w-fit`}>
                {(() => { const Icon = getStatusIcon(selectedFeedback.status); return <Icon className="w-4 h-4" />; })()}
                <span>{selectedFeedback.status.charAt(0).toUpperCase() + selectedFeedback.status.slice(1).replace('_', ' ')}</span>
              </span>
              <span className="text-sm text-school-grey-500 dark:text-gray-400">{formatDate(selectedFeedback.createdAt)}</span>
            </div>

            {/* Subject */}
            <div>
              <h3 className="text-base md:text-lg font-bold text-school-grey-800 dark:text-white mb-2">{selectedFeedback.subject}</h3>
              <span className="inline-block px-3 py-1 bg-school-grey-100 dark:bg-gray-700 text-school-grey-700 dark:text-gray-300 rounded-full text-sm">
                {selectedFeedback.category}
              </span>
            </div>

            {/* Message */}
            <div className="bg-school-grey-50 dark:bg-gray-700 rounded-xl p-3 md:p-4 max-h-60 overflow-y-auto">
              <p className="text-sm md:text-base text-school-grey-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{selectedFeedback.message}</p>
            </div>

            {/* Submitter Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="text-xs md:text-sm font-medium text-school-grey-500 dark:text-gray-400 block mb-1">Submitted By</label>
                <p className="text-sm md:text-base text-school-grey-800 dark:text-white font-medium">
                  {selectedFeedback.isAnonymous ? 'Anonymous' : selectedFeedback.fullName}
                </p>
              </div>
              {!selectedFeedback.isAnonymous && (
                <>
                  <div>
                    <label className="text-xs md:text-sm font-medium text-school-grey-500 dark:text-gray-400 block mb-1">Email</label>
                    <p className="text-sm md:text-base text-school-grey-800 dark:text-white break-all">{selectedFeedback.email}</p>
                  </div>
                  <div>
                    <label className="text-xs md:text-sm font-medium text-school-grey-500 dark:text-gray-400 block mb-1">Student ID</label>
                    <p className="text-sm md:text-base text-school-grey-800 dark:text-white">{selectedFeedback.studentId}</p>
                  </div>
                </>
              )}
              <div>
                <label className="text-xs md:text-sm font-medium text-school-grey-500 dark:text-gray-400 block mb-1">College</label>
                <p className="text-sm md:text-base text-school-grey-800 dark:text-white">{selectedFeedback.college}</p>
              </div>
            </div>

            {/* Update Status */}
            <div>
              <label className="text-xs md:text-sm font-medium text-school-grey-500 dark:text-gray-400 block mb-2">Update Status</label>
              <div className="grid grid-cols-2 md:flex md:flex-wrap gap-2">
                {Object.values(FEEDBACK_STATUSES).map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      handleStatusChange(selectedFeedback.id, status)
                      setSelectedFeedback({ ...selectedFeedback, status })
                    }}
                    className={`px-3 md:px-4 py-2 rounded-xl font-medium transition-colors text-sm ${
                      selectedFeedback.status === status
                        ? 'bg-university-red text-white'
                        : 'bg-school-grey-100 dark:bg-gray-700 text-school-grey-700 dark:text-gray-300 hover:bg-school-grey-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Response */}
            <div>
              <label className="text-xs md:text-sm font-medium text-school-grey-500 dark:text-gray-400 block mb-2">Add Response</label>
              {selectedFeedback.response && (
                <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">Current Response:</p>
                  <p className="text-sm text-blue-800 dark:text-blue-300">{selectedFeedback.response}</p>
                </div>
              )}
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Type your response to the student..."
                className="w-full px-3 md:px-4 py-3 bg-school-grey-50 dark:bg-gray-700 border border-school-grey-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-university-red/20 focus:border-university-red transition-all resize-none h-32 text-sm md:text-base text-school-grey-800 dark:text-white placeholder-school-grey-400 dark:placeholder-gray-500"
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 pt-4 border-t border-school-grey-200 dark:border-gray-700">
              <button
                onClick={() => {
                  setShowModal(false)
                  setResponseText('')
                }}
                className="w-full sm:w-auto px-6 py-2.5 bg-school-grey-100 dark:bg-gray-700 text-school-grey-700 dark:text-gray-300 rounded-xl hover:bg-school-grey-200 dark:hover:bg-gray-600 transition-colors font-medium"
                disabled={savingResponse}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveResponse}
                disabled={savingResponse}
                className="w-full sm:w-auto px-6 py-2.5 bg-university-red text-white rounded-xl hover:bg-university-red-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {savingResponse ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  'Save Changes'
                )}
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
