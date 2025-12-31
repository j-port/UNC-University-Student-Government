import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  X,
  ChevronDown,
  ChevronUp,
  User,
  Building,
  GraduationCap,
  Users,
  AlertCircle,
  GripVertical
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
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { 
  fetchOfficers, 
  fetchCommittees,
  createOfficer,
  updateOfficer,
  deleteOfficer,
  createCommittee,
  updateCommittee,
  deleteCommittee,
  updateOfficersOrder
} from '../../api'
import LoadingSpinner from '../../components/LoadingSpinner'

export default function AdminOrgChart() {
  const [data, setData] = useState({
    executive: [],
    legislative: [],
    committees: []
  })
  const [expandedSection, setExpandedSection] = useState('executive')
  const [showEditor, setShowEditor] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [notification, setNotification] = useState(null)
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

  // Load all data on mount
  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [execResult, legResult, committeeResult] = await Promise.all([
        fetchOfficers('executive'),
        fetchOfficers('legislative'),
        fetchCommittees()
      ])

      if (execResult.error) throw new Error(execResult.error)
      if (legResult.error) throw new Error(legResult.error)
      if (committeeResult.error) throw new Error(committeeResult.error)

      setData({
        executive: execResult.data || [],
        legislative: legResult.data || [],
        committees: committeeResult.data || []
      })
    } catch (err) {
      console.error('Error loading data:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
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
      let result
      if (section === 'committees') {
        result = await deleteCommittee(id)
      } else {
        result = await deleteOfficer(id)
      }

      if (result.error) throw new Error(result.error)

      // Update local state
      setData({
        ...data,
        [section]: data[section].filter(item => item.id !== id)
      })
      
      showNotification('Item deleted successfully!', 'success')
    } catch (err) {
      console.error('Error deleting:', err)
      const errorMsg = err.message || err.toString() || 'An unknown error occurred'
      showNotification(`Error: ${errorMsg}`, 'error')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      let result
      
      if (editingSection === 'committees') {
        const committeeData = {
          name: formData.name,
          head_name: formData.head_name,
          member_count: parseInt(formData.member_count),
          description: formData.description || ''
        }

        if (editingItem) {
          result = await updateCommittee(editingItem.id, committeeData)
        } else {
          result = await createCommittee(committeeData)
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
          result = await updateOfficer(editingItem.id, officerData)
        } else {
          result = await createOfficer(officerData)
        }
      }

      if (result.error) {
        // Extract error message from various formats
        const errorMsg = typeof result.error === 'string' 
          ? result.error 
          : result.error.message || JSON.stringify(result.error)
        throw new Error(errorMsg)
      }

      // Reload data
      await loadAllData()
      showNotification(`${editingItem ? 'Updated' : 'Created'} successfully!`, 'success')
      resetForm()
    } catch (err) {
      console.error('Error saving:', err)
      const errorMsg = err.message || err.toString() || 'An unknown error occurred'
      showNotification(`Error: ${errorMsg}`, 'error')
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

    const oldIndex = data[section].findIndex(item => item.id === active.id)
    const newIndex = data[section].findIndex(item => item.id === over.id)

    if (oldIndex === -1 || newIndex === -1) return

    try {
      // Optimistically update UI
      const newOrder = arrayMove(data[section], oldIndex, newIndex)
      setData({
        ...data,
        [section]: newOrder
      })

      // Update order_index in database
      const result = await updateOfficersOrder(newOrder)
      
      if (result.error) {
        // Revert on error
        await loadAllData()
        const errorMsg = result.error?.message || result.error?.hint || JSON.stringify(result.error) || 'Failed to update order'
        throw new Error(errorMsg)
      }

      showNotification('Order updated successfully!', 'success')
    } catch (err) {
      console.error('Error updating order:', err)
      const errorMsg = err.message || String(err) || 'Failed to update order'
      showNotification(`Error: ${errorMsg}`, 'error')
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
            onClick={loadAllData}
            className="mt-4 px-4 py-2 bg-university-red text-white rounded-xl hover:bg-university-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const SectionHeader = ({ title, icon: Icon, section, color }) => (
    <button
      onClick={() => setExpandedSection(expandedSection === section ? '' : section)}
      className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-school-grey-100 hover:border-university-red/30 transition-colors"
    >
      <div className="flex items-center space-x-3">
        <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className="font-semibold text-school-grey-800">{title}</span>
      </div>
      {expandedSection === section ? (
        <ChevronUp className="w-5 h-5 text-school-grey-400" />
      ) : (
        <ChevronDown className="w-5 h-5 text-school-grey-400" />
      )}
    </button>
  )

  // Sortable Officer Card Component
  const SortableOfficerCard = ({ member, section, color }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: member.id })

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    }

    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`bg-school-grey-50 rounded-xl p-4 text-center relative ${
          isDragging ? 'shadow-lg ring-2 ring-university-red' : ''
        }`}
      >
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 left-2 p-1 cursor-grab active:cursor-grabbing hover:bg-school-grey-200 rounded transition-colors"
        >
          <GripVertical className="w-4 h-4 text-school-grey-400" />
        </div>

        <img 
          src={member.image_url || member.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'} 
          alt={member.name}
          className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
        />
        <h3 className="font-semibold text-school-grey-800">{member.name}</h3>
        <p className={`text-sm font-medium ${color === 'bg-university-red' ? 'text-university-red' : 'text-blue-600'}`}>
          {member.position}
        </p>
        <p className="text-xs text-school-grey-500 mt-1">{member.email}</p>
        
        <div className="flex justify-center space-x-2 mt-3">
          <button
            onClick={() => handleEdit(section, member)}
            className={`p-2 text-school-grey-500 rounded-lg ${
              color === 'bg-university-red' 
                ? 'hover:text-university-red hover:bg-university-red/10' 
                : 'hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(section, member.id)}
            className="p-2 text-school-grey-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-school-grey-800">Organizational Chart</h1>
        <p className="text-school-grey-500">Manage USG officers and committees</p>
      </div>

      {/* Executive Branch */}
      <div className="space-y-4">
        <SectionHeader 
          title="Executive Branch" 
          icon={User} 
          section="executive" 
          color="bg-university-red"
        />
        
        {expandedSection === 'executive' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-2xl border border-school-grey-100 p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-school-grey-500">
                <GripVertical className="w-4 h-4 inline mr-1" />
                Drag to reorder
              </p>
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
                items={data.executive.map(m => m.id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {data.executive.map((member) => (
                    <SortableOfficerCard
                      key={member.id}
                      member={member}
                      section="executive"
                      color="bg-university-red"
                    />
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
          section="legislative" 
          color="bg-blue-500"
        />
        
        {expandedSection === 'legislative' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-white rounded-2xl border border-school-grey-100 p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-school-grey-500">
                <GripVertical className="w-4 h-4 inline mr-1" />
                Drag to reorder
              </p>
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
                items={data.legislative.map(m => m.id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {data.legislative.map((member) => (
                    <SortableOfficerCard
                      key={member.id}
                      member={member}
                      section="legislative"
                      color="bg-blue-500"
                    />
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
          section="committees" 
          color="bg-green-500"
        />
        
        {expandedSection === 'committees' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-white rounded-2xl border border-school-grey-100 p-6"
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
              {data.committees.map((committee) => (
                <div key={committee.id} className="flex items-center justify-between bg-school-grey-50 rounded-xl p-4">
                  <div>
                    <h3 className="font-semibold text-school-grey-800">{committee.name}</h3>
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
      {showEditor && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl max-w-md w-full"
          >
            <div className="p-6 border-b border-school-grey-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-school-grey-800">
                {editingItem ? 'Edit' : 'Add'} {editingSection === 'committees' ? 'Committee' : 'Officer'}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 text-school-grey-500 hover:text-school-grey-700 hover:bg-school-grey-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                    <label className="block text-sm font-medium text-school-grey-700 mb-2">Description (Optional)</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows="3"
                      className="w-full px-4 py-3 bg-school-grey-50 border border-school-grey-200 rounded-xl focus:ring-2 focus:ring-university-red/20 focus:border-university-red"
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
                  className="px-6 py-3 bg-school-grey-100 text-school-grey-700 rounded-xl hover:bg-school-grey-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-university-red text-white rounded-xl hover:bg-university-red-600 transition-colors flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg flex items-center space-x-3 ${
            notification.type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}
        >
          {notification.type === 'success' ? (
            <Save className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span className="font-medium">{notification.message}</span>
        </motion.div>
      )}
    </div>
  )
}
