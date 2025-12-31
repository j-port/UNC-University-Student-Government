import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Upload, 
  FileText, 
  Download, 
  Trash2, 
  Eye,
  Calendar,
  EyeOff,
  X
} from 'lucide-react'
import { formatDate } from '../../utils/formatters'
import { useNotification, useIssuances } from '../../hooks'
import { ISSUANCE_TYPES } from '../../utils/constants'
import { supabase } from '../../api'

export default function AdminReports() {
  const { issuances, loading, create, update, remove, toggleStatus } = useIssuances()
  const [showUpload, setShowUpload] = useState(false)
  const [showViewer, setShowViewer] = useState(false)
  const [viewerData, setViewerData] = useState(null)
  const [uploading, setUploading] = useState(false)
  const { notification, showSuccess, showError, dismiss } = useNotification()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Report',
    file: null
  })

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        showError('File size must be less than 10MB')
        return
      }
      setFormData(prev => ({ ...prev, file }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.file) {
      showError('Please select a file to upload')
      return
    }

    setUploading(true)
    try {
      // Upload file to Supabase Storage
      const fileExt = formData.file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `issuances/${fileName}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, formData.file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath)

      // Create issuance record
      await create({
        title: formData.title,
        description: formData.description,
        type: formData.type,
        file_url: publicUrl,
        file_name: formData.file.name,
        file_size: formData.file.size,
        status: 'published', // Auto-publish
        published_at: new Date().toISOString()
      })

      showSuccess('Report uploaded successfully!')
      setShowUpload(false)
      setFormData({ title: '', description: '', type: 'Report', file: null })
    } catch (err) {
      console.error('Upload error:', err)
      showError(err.message || 'Failed to upload report')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this report?')) return
    
    try {
      await remove(id)
      showSuccess('Report deleted successfully!')
    } catch (err) {
      showError('Failed to delete report')
    }
  }

  const handleToggleStatus = async (id) => {
    const issuance = issuances.find(item => item.id === id)
    if (!issuance) return

    const newStatus = issuance.status === 'published' ? 'draft' : 'published'
    const confirmed = window.confirm(
      `Are you sure you want to change this report to ${newStatus}?`
    )
    
    if (!confirmed) return

    try {
      await toggleStatus(id)
      showSuccess(`Status changed to ${newStatus}!`)
    } catch (err) {
      showError(err.message || 'Failed to update status')
    }
  }

  const handleView = (report) => {
    setViewerData(report)
    setShowViewer(true)
  }

  const handleDownload = async (fileUrl, fileName) => {
    try {
      // Create a temporary link to trigger download
      const link = document.createElement('a')
      link.href = fileUrl
      link.download = fileName
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      showSuccess('Download started!')
    } catch (err) {
      showError('Failed to download file')
    }
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown'
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(2)} MB`
  }

  const filteredIssuances = (issuances || []).filter(item => item !== null && item !== undefined)

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl ${
            notification.type === 'success' 
              ? 'bg-green-50 text-green-800' 
              : 'bg-red-50 text-red-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span>{notification.message}</span>
            <button onClick={dismiss} className="ml-4">
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-school-grey-800">Issuances & Reports</h1>
          <p className="text-school-grey-500">Upload and manage official documents and reports</p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-university-red text-white rounded-xl hover:bg-university-red-600 transition-colors shadow-lg shadow-university-red/30"
        >
          <Upload className="w-5 h-5" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Reports List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-university-red mx-auto"></div>
          <p className="mt-4 text-school-grey-600">Loading reports...</p>
        </div>
      ) : filteredIssuances.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-school-grey-100">
          <FileText className="w-16 h-16 text-school-grey-300 mx-auto mb-4" />
          <p className="text-school-grey-600">No reports uploaded yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredIssuances.map((report) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-school-grey-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="px-3 py-1 bg-university-red-50 text-university-red text-xs font-medium rounded-full">
                      {report.type}
                    </span>
                    <button
                      onClick={() => handleToggleStatus(report.id)}
                      className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                        report.status === 'published'
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {report.status === 'published' ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{report.status === 'published' ? 'Published' : 'Draft'}</span>
                    </button>
                    <span className="flex items-center text-school-grey-500 text-sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(report.published_at || report.created_at)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg text-school-grey-800">
                    {report.title}
                  </h3>
                  <button
                    onClick={() => handleView(report)}
                    className="flex items-center space-x-2 px-4 py-2 bg-school-grey-100 text-school-grey-700 rounded-lg hover:bg-university-red hover:text-white transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">View</span>
                  </button>
                  <p className="text-school-grey-400 text-xs mt-2">
                    {report.file_name} • {formatFileSize(report.file_size)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDownload(report.file_url, report.file_name)}
                    className="flex items-center space-x-2 px-4 py-2 bg-school-grey-100 text-school-grey-700 rounded-lg hover:bg-university-red hover:text-white transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-sm font-medium">Download</span>
                  </button>
                  <button
                    onClick={() => handleDelete(report.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-school-grey-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-school-grey-800">Upload Document</h2>
                <button
                  onClick={() => setShowUpload(false)}
                  className="text-school-grey-400 hover:text-school-grey-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-school-grey-700 mb-2">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 bg-school-grey-50 border border-school-grey-200 rounded-xl focus:ring-2 focus:ring-university-red/20 focus:border-university-red transition-all"
                  placeholder="e.g., Q4 2024 Financial Report"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-school-grey-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 bg-school-grey-50 border border-school-grey-200 rounded-xl focus:ring-2 focus:ring-university-red/20 focus:border-university-red transition-all resize-none h-24"
                  placeholder="Brief description of the document..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-school-grey-700 mb-2">
                  Document Type *
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-4 py-3 bg-school-grey-50 border border-school-grey-200 rounded-xl focus:ring-2 focus:ring-university-red/20 focus:border-university-red transition-all"
                >
                  {ISSUANCE_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-school-grey-700 mb-2">
                  Upload File * (Max 10MB)
                </label>
                <input
                  type="file"
                  required
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  className="w-full px-4 py-3 bg-school-grey-50 border border-school-grey-200 rounded-xl focus:ring-2 focus:ring-university-red/20 focus:border-university-red transition-all"
                />
                {formData.file && (
                  <p className="mt-2 text-sm text-school-grey-600">
                    Selected: {formData.file.name} ({formatFileSize(formData.file.size)})
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUpload(false)}
                  className="px-6 py-3 text-school-grey-700 hover:bg-school-grey-100 rounded-xl transition-colors"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-3 bg-university-red text-white rounded-xl hover:bg-university-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {showViewer && viewerData && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-6xl h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-school-grey-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-school-grey-800">{viewerData.title}</h2>
                <p className="text-sm text-school-grey-500 mt-1">{viewerData.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDownload(viewerData.file_url, viewerData.file_name)}
                  className="flex items-center space-x-2 px-4 py-2 bg-university-red text-white rounded-lg hover:bg-university-red-600 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => setShowViewer(false)}
                  className="p-2 text-school-grey-400 hover:text-school-grey-600 hover:bg-school-grey-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Document Viewer */}
            <div className="flex-1 overflow-hidden p-4">
              <iframe
                src={viewerData.file_url}
                className="w-full h-full rounded-lg border border-school-grey-200"
                title={viewerData.title}
              />
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-school-grey-100 flex items-center justify-between bg-school-grey-50">
              <div className="flex items-center space-x-4 text-sm text-school-grey-600">
                <span className="flex items-center">
                  <FileText className="w-4 h-4 mr-1" />
                  {viewerData.file_name}
                </span>
                <span>{formatFileSize(viewerData.file_size)}</span>
                <span className="px-2 py-1 bg-university-red-50 text-university-red rounded-full text-xs">
                  {viewerData.type}
                </span>
              </div>
              <button
                onClick={() => setShowViewer(false)}
                className="px-4 py-2 text-school-grey-700 hover:bg-school-grey-200 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
