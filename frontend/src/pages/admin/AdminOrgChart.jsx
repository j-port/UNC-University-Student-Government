import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Edit, 
  Trash2,
  User,
  Building,
  Users,
  AlertCircle
} from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import LoadingSpinner from '../../components/LoadingSpinner'
import { useOfficers, useCommittees, useNotification } from '../../hooks'
import { Notification, FormModal, DragDropCard, SectionHeader } from '../../components/admin'

export default function AdminOrgChart() {
  // Custom hooks for data management
  const executiveOfficers = useOfficers('executive')
  const legislativeOfficers = useOfficers('legislative')
  const committeesHook = useCommittees()
  const { notification, showSuccess, showError, showInfo, dismiss } = useNotification()

  // UI State
  const [expandedSection, setExpandedSection] = useState('executive')
  const [showEditor, setShowEditor] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [editingSection, setEditingSection] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    email: '',
    image: '',
    head_name: '',
    member_count: 0,
    description: ''
  })

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Combined loading state
  const loading = executiveOfficers.loading || legislativeOfficers.loading || committeesHook.loading
  const error = executiveOfficers.error || legislativeOfficers.error || committeesHook.error

  // Helper to get the right hook based on section
  const getHookForSection = (section) => {
    if (section === 'executive') return executiveOfficers
    if (section === 'legislative') return legislativeOfficers
    if (section === 'committees') return committeesHook
  }

  const handleEdit = (section, item) => {
    setEditingSection(section)
    setEditingItem(item)
    setFormData({
      name: item.name || '',
      position: item.position || '',
      email: item.email || '',
      image: item.image_url || item.image || '',
      head_name: item.head_name || item.head || '',
      member_count: item.member_count || item.members || 0,
      description: item.description || ''
    })
    setShowEditor(true)
  }

  const handleDelete = async (section, id) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      const hook = getHookForSection(section)
      await hook.remove(id)
      showSuccess('Item deleted successfully!')
    } catch (err) {
      console.error('Error deleting:', err)
      showError(err.message || 'Failed to delete item')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const hook = getHookForSection(editingSection)
      
      if (editingSection === 'committees') {
        const committeeData = {
          name: formData.name,
          head_name: formData.head_name,
          member_count: parseInt(formData.member_count),
          description: formData.description || ''
        }

        if (editingItem) {
          await hook.update(editingItem.id, committeeData)
        } else {
          await hook.create(committeeData)
        }
      } else {
        // Executive or Legislative officer
        const officerData = {
          name: formData.name,
          position: formData.position,
          email: formData.email,
          image_url: formData.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
          branch: editingSection
        }

        if (editingItem) {
          await hook.update(editingItem.id, officerData)
        } else {
          await hook.create(officerData)
        }
      }

      showSuccess(`${editingItem ? 'Updated' : 'Created'} successfully!`)
      resetForm()
    } catch (err) {
      console.error('Error saving:', err)
      showError(err.message || 'Failed to save changes')
    }
  }

  const resetForm = () => {
    setFormData({ name: '', position: '', email: '', image: '', head_name: '', member_count: 0, description: '' })
    setEditingItem(null)
    setEditingSection('')
    setShowEditor(false)
  }

  const addNew = (section) => {
    setEditingSection(section)
    setEditingItem(null)
    setFormData({ name: '', position: '', email: '', image: '', head_name: '', member_count: 0, description: '' })
    setShowEditor(true)
  }

  const handleDragEnd = async (event, section) => {
    const { active, over } = event

    if (!over || active.id === over.id) return

    const hook = getHookForSection(section)
    const items = hook.officers || hook.committees
    
    const oldIndex = items.findIndex(item => item.id === active.id)
    const newIndex = items.findIndex(item => item.id === over.id)

    if (oldIndex === -1 || newIndex === -1) return

    try {
      const newOrder = arrayMove(items, oldIndex, newIndex)
      
      // Use hook's reorder method (optimistic update built-in)
      if (section === 'committees') {
        showInfo('Committee reordering not yet implemented')
      } else {
        await hook.reorder(newOrder)
        showSuccess('Order updated successfully!')
      }
    } catch (err) {
      console.error('Error updating order:', err)
      showError(err.message || 'Failed to update order')
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-md">
          <div className="flex items-center space-x-3 text-red-600 mb-2">
            <AlertCircle className="w-5 h-5" />
            <h3 className="font-semibold">Error Loading Data</h3>
          </div>
          <p className="text-school-grey-600 text-sm">{error}</p>
          <button
            onClick={() => {
              executiveOfficers.reload()
              legislativeOfficers.reload()
              committeesHook.reload()
            }}
            className="mt-4 px-4 py-2 bg-university-red text-white rounded-xl hover:bg-university-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-school-grey-800 dark:text-white">Organizational Chart</h1>
        <p className="text-school-grey-500 dark:text-gray-400">Manage USG officers and committees</p>
      </div>

      {/* Executive Branch */}
      <div className="space-y-4">
        <SectionHeader 
          title="Executive Branch" 
          icon={User} 
          isExpanded={expandedSection === 'executive'}
          onToggle={() => setExpandedSection(expandedSection === 'executive' ? '' : 'executive')}
          color="bg-university-red"
        />
        
        {expandedSection === 'executive' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-school-grey-100 dark:border-gray-700 p-6 transition-colors"
          >
            <div className="flex justify-end mb-4">
              <button
                onClick={() => addNew('executive')}
                className="flex items-center space-x-2 px-4 py-2 bg-university-red text-white rounded-xl hover:bg-university-red-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Officer</span>
              </button>
            </div>
            
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => handleDragEnd(event, 'executive')}
            >
              <SortableContext
                items={executiveOfficers.officers.map(m => m.id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {executiveOfficers.officers.map((member) => (
                    <DragDropCard
                      key={member.id}
                      item={member}
                      onEdit={() => handleEdit('executive', member)}
                      onDelete={() => handleDelete('executive', member.id)}
                      color="bg-university-red"
                    >
                      <img 
                        src={member.image_url || member.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'} 
                        alt={member.name}
                        className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                      />
                      <h3 className="font-semibold text-school-grey-800 dark:text-white">{member.name}</h3>
                      <p className="text-sm font-medium text-university-red">{member.position}</p>
                      <p className="text-xs text-school-grey-500 mt-1">{member.email}</p>
                    </DragDropCard>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </motion.div>
        )}
      </div>

      {/* Legislative Branch */}
      <div className="space-y-4">
        <SectionHeader 
          title="Legislative Branch" 
          icon={Building} 
          isExpanded={expandedSection === 'legislative'}
          onToggle={() => setExpandedSection(expandedSection === 'legislative' ? '' : 'legislative')}
          color="bg-blue-500"
        />
        
        {expandedSection === 'legislative' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-school-grey-100 dark:border-gray-700 p-6 transition-colors"
          >
            <div className="flex justify-end mb-4">
              <button
                onClick={() => addNew('legislative')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Officer</span>
              </button>
            </div>
            
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => handleDragEnd(event, 'legislative')}
            >
              <SortableContext
                items={legislativeOfficers.officers.map(m => m.id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {legislativeOfficers.officers.map((member) => (
                    <DragDropCard
                      key={member.id}
                      item={member}
                      onEdit={() => handleEdit('legislative', member)}
                      onDelete={() => handleDelete('legislative', member.id)}
                      color="bg-blue-500"
                    >
                      <img 
                        src={member.image_url || member.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'} 
                        alt={member.name}
                        className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                      />
                      <h3 className="font-semibold text-school-grey-800 dark:text-white">{member.name}</h3>
                      <p className="text-sm font-medium text-blue-600">{member.position}</p>
                      <p className="text-xs text-school-grey-500 mt-1">{member.email}</p>
                    </DragDropCard>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </motion.div>
        )}
      </div>

      {/* Committees */}
      <div className="space-y-4">
        <SectionHeader 
          title="Committees" 
          icon={Users} 
          isExpanded={expandedSection === 'committees'}
          onToggle={() => setExpandedSection(expandedSection === 'committees' ? '' : 'committees')}
          color="bg-green-500"
        />
        
        {expandedSection === 'committees' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-school-grey-100 dark:border-gray-700 p-6 transition-colors"
          >
            <div className="flex justify-end mb-4">
              <button
                onClick={() => addNew('committees')}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Committee</span>
              </button>
            </div>
            
            <div className="space-y-3">
              {committeesHook.committees.map((committee) => (
                <div key={committee.id} className="flex items-center justify-between bg-school-grey-50 dark:bg-gray-700 rounded-xl p-4 transition-colors">
                  <div>
                    <h3 className="font-semibold text-school-grey-800 dark:text-white">{committee.name}</h3>
                    <p className="text-sm text-school-grey-500">
                      Head: {committee.head_name || committee.head} • {committee.member_count || committee.members} members
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit('committees', committee)}
                      className="p-2 text-school-grey-500 hover:text-green-600 hover:bg-green-50 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete('committees', committee.id)}
                      className="p-2 text-school-grey-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Editor Modal */}
      <FormModal
        isOpen={showEditor}
        onClose={resetForm}
        title={`${editingItem ? 'Edit' : 'Add'} ${editingSection === 'committees' ? 'Committee' : 'Officer'}`}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {editingSection === 'committees' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-school-grey-700 mb-2">Committee Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-school-grey-50 border border-school-grey-200 rounded-xl focus:ring-2 focus:ring-university-red/20 focus:border-university-red"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-school-grey-700 mb-2">Committee Head</label>
                <input
                  type="text"
                  value={formData.head_name}
                  onChange={(e) => setFormData({ ...formData, head_name: e.target.value })}
                  className="w-full px-4 py-3 bg-school-grey-50 border border-school-grey-200 rounded-xl focus:ring-2 focus:ring-university-red/20 focus:border-university-red"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-school-grey-700 mb-2">Number of Members</label>
                <input
                  type="number"
                  value={formData.member_count}
                  onChange={(e) => setFormData({ ...formData, member_count: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-school-grey-50 border border-school-grey-200 rounded-xl focus:ring-2 focus:ring-university-red/20 focus:border-university-red"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-school-grey-700 dark:text-gray-300 mb-2">Description (Optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-3 bg-school-grey-50 dark:bg-gray-700 border border-school-grey-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-university-red/20 focus:border-university-red text-school-grey-800 dark:text-white dark:placeholder-gray-400 transition-colors"
                  placeholder="Brief description of the committee..."
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-school-grey-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-school-grey-50 border border-school-grey-200 rounded-xl focus:ring-2 focus:ring-university-red/20 focus:border-university-red"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-school-grey-700 mb-2">Position</label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-4 py-3 bg-school-grey-50 border border-school-grey-200 rounded-xl focus:ring-2 focus:ring-university-red/20 focus:border-university-red"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-school-grey-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-school-grey-50 border border-school-grey-200 rounded-xl focus:ring-2 focus:ring-university-red/20 focus:border-university-red"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-school-grey-700 mb-2">Photo URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full px-4 py-3 bg-school-grey-50 border border-school-grey-200 rounded-xl focus:ring-2 focus:ring-university-red/20 focus:border-university-red"
                />
              </div>
            </>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 bg-school-grey-100 dark:bg-gray-700 text-school-grey-700 dark:text-gray-300 rounded-xl hover:bg-school-grey-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-university-red text-white rounded-xl hover:bg-university-red-600 transition-colors"
            >
              Save
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
