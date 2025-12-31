import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Calendar,
  Tag
} from 'lucide-react'
import { useAnnouncements, useNotification } from '../../hooks'
import { formatDate } from '../../utils/formatters'
import { FormModal, Notification } from '../../components/admin'
import LoadingSpinner from '../../components/LoadingSpinner'
import { ANNOUNCEMENT_CATEGORIES, ANNOUNCEMENT_PRIORITIES } from '../../utils/constants'

export default function AdminAnnouncements() {
  // Custom hooks
  const { announcements, loading, error, create, update, remove, toggleStatus: toggleAnnouncementStatus } = useAnnouncements()
  const { notification, showSuccess, showError, dismiss } = useNotification()
  
  // UI State
  const [searchTerm, setSearchTerm] = useState('')
  const [showEditor, setShowEditor] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Announcement',
    priority: 'medium',
    status: 'draft',
    image: null,
  })

  const filteredAnnouncements = (announcements || [])
    .filter(item => item !== null && item !== undefined)
    .filter(item => item.title?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingItem) {
        await update(editingItem.id, formData)
        showSuccess('Announcement updated successfully!')
      } else {
        await create(formData)
        showSuccess('Announcement created successfully!')
      }
      resetForm()
    } catch (err) {
      showError(err.message || 'Failed to save announcement')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: 'Announcement',
      priority: 'medium',
      status: 'draft',
      image: null,
    })
    setEditingItem(null)
    setShowEditor(false)
  }

  const handleEdit = (item) => {
    setFormData({
      title: item.title,
      content: item.content,
      category: item.category,
      priority: item.priority,
      status: item.status,
      image: item.image,
    })
    setEditingItem(item)
    setShowEditor(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return
    
    try {
      await remove(id)
      showSuccess('Announcement deleted successfully!')
    } catch (err) {
      showError(err.message || 'Failed to delete announcement')
    }
  }

  const toggleStatus = async (id) => {
    const announcement = announcements.find(item => item.id === id)
    if (!announcement) return

    const newStatus = announcement.status === 'published' ? 'draft' : 'published'
    const confirmed = window.confirm(
      `Are you sure you want to change this announcement to ${newStatus}?`
    )
    
    if (!confirmed) return

    try {
      await toggleAnnouncementStatus(id)
      showSuccess(`Status changed to ${newStatus}!`)
    } catch (err) {
      showError(err.message || 'Failed to update status')
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'low': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-school-grey-800">Announcements</h1>
          <p className="text-school-grey-500">Create and manage announcements</p>
        </div>
        <button
          onClick={() => setShowEditor(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-university-red text-white rounded-xl hover:bg-university-red-600 transition-colors shadow-lg shadow-university-red/30"
        >
          <Plus className="w-5 h-5" />
          <span>New Announcement</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-school-grey-100 p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-school-grey-400" />
          <input
            type="text"
            placeholder="Search announcements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-school-grey-50 border border-school-grey-200 rounded-xl focus:ring-2 focus:ring-university-red/20 focus:border-university-red transition-all"
          />
        </div>
      </div>

      {/* Announcements Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAnnouncements.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-school-grey-100 overflow-hidden"
          >
            {/* Image */}
            {item.image && (
              <div className="aspect-video bg-school-grey-100">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              </div>
            )}

            {/* Content */}
            <div className="p-5">
              {/* Meta */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-school-grey-100 text-school-grey-600 rounded-full text-xs font-medium">
                    {item.category}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                    {item.priority}
                  </span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {item.status}
                </span>
              </div>

              {/* Title & Content */}
              <h3 className="font-bold text-school-grey-800 mb-2">{item.title}</h3>
              <p className="text-sm text-school-grey-600 line-clamp-3 mb-4">{item.content}</p>

              {/* Date */}
              <div className="flex items-center text-xs text-school-grey-500 mb-4">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(item.published_at || item.publishedAt || item.created_at || item.createdAt) || 'Not published'}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-school-grey-100">
                <button
                  onClick={() => toggleStatus(item.id)}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    item.status === 'published'
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {item.status === 'published' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  <span>{item.status === 'published' ? 'Published' : 'Draft'}</span>
                </button>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 text-school-grey-500 hover:text-university-red hover:bg-university-red/10 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-school-grey-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredAnnouncements.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-school-grey-100">
          <div className="w-16 h-16 bg-school-grey-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Tag className="w-8 h-8 text-school-grey-400" />
          </div>
          <h3 className="text-lg font-medium text-school-grey-600 mb-2">No announcements found</h3>
          <p className="text-school-grey-500">Create your first announcement to get started</p>
        </div>
      )}

      {/* Editor Modal */}
      <FormModal
        isOpen={showEditor}
        onClose={resetForm}
        title={editingItem ? 'Edit Announcement' : 'New Announcement'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-school-grey-700 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Announcement title"
              className="w-full px-4 py-3 bg-school-grey-50 border border-school-grey-200 rounded-xl focus:ring-2 focus:ring-university-red/20 focus:border-university-red transition-all"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-school-grey-700 mb-2">Content</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write your announcement..."
              className="w-full px-4 py-3 bg-school-grey-50 border border-school-grey-200 rounded-xl focus:ring-2 focus:ring-university-red/20 focus:border-university-red transition-all resize-none h-40"
              required
            />
          </div>

          {/* Category & Priority */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-school-grey-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-school-grey-50 border border-school-grey-200 rounded-xl focus:ring-2 focus:ring-university-red/20 focus:border-university-red transition-all"
              >
                {ANNOUNCEMENT_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-school-grey-700 mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-3 bg-school-grey-50 border border-school-grey-200 rounded-xl focus:ring-2 focus:ring-university-red/20 focus:border-university-red transition-all"
              >
                {ANNOUNCEMENT_PRIORITIES.map(pri => (
                  <option key={pri} value={pri}>{pri.charAt(0).toUpperCase() + pri.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-school-grey-700 mb-2">Image URL (optional)</label>
            <input
              type="url"
              value={formData.image || ''}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 bg-school-grey-50 border border-school-grey-200 rounded-xl focus:ring-2 focus:ring-university-red/20 focus:border-university-red transition-all"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-school-grey-700 mb-2">Status</label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="draft"
                  checked={formData.status === 'draft'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="text-university-red focus:ring-university-red"
                />
                <span className="text-school-grey-700">Save as Draft</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="published"
                  checked={formData.status === 'published'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="text-university-red focus:ring-university-red"
                />
                <span className="text-school-grey-700">Publish Now</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 bg-school-grey-100 text-school-grey-700 rounded-xl hover:bg-school-grey-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-university-red text-white rounded-xl hover:bg-university-red-600 transition-colors"
            >
              {editingItem ? 'Save Changes' : 'Create Announcement'}
            </button>
          </div>
        </form>
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
