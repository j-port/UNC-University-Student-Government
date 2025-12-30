import { useState } from 'react'
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
  Users
} from 'lucide-react'

// Sample org data
const orgData = {
  executive: [
    { id: 1, name: 'Juan Dela Cruz', position: 'President', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', email: 'president@unc.edu.ph' },
    { id: 2, name: 'Maria Santos', position: 'Vice President', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', email: 'vp@unc.edu.ph' },
    { id: 3, name: 'Pedro Garcia', position: 'Secretary General', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', email: 'secretary@unc.edu.ph' },
    { id: 4, name: 'Ana Reyes', position: 'Treasurer', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', email: 'treasurer@unc.edu.ph' },
  ],
  legislative: [
    { id: 5, name: 'Carlos Mendoza', position: 'Speaker', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', email: 'speaker@unc.edu.ph' },
    { id: 6, name: 'Sofia Lim', position: 'Deputy Speaker', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', email: 'deputy.speaker@unc.edu.ph' },
  ],
  committees: [
    { id: 7, name: 'Academic Affairs Committee', head: 'Jose Cruz', members: 5 },
    { id: 8, name: 'Student Welfare Committee', head: 'Elena Bautista', members: 4 },
    { id: 9, name: 'Finance Committee', head: 'Mark Tan', members: 3 },
    { id: 10, name: 'Events Committee', head: 'Grace Lee', members: 6 },
  ],
}

export default function AdminOrgChart() {
  const [data, setData] = useState(orgData)
  const [expandedSection, setExpandedSection] = useState('executive')
  const [showEditor, setShowEditor] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [editingSection, setEditingSection] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    email: '',
    image: '',
    head: '',
    members: 0,
  })

  const handleEdit = (section, item) => {
    setEditingSection(section)
    setEditingItem(item)
    setFormData({
      name: item.name || '',
      position: item.position || '',
      email: item.email || '',
      image: item.image || '',
      head: item.head || '',
      members: item.members || 0,
    })
    setShowEditor(true)
  }

  const handleDelete = (section, id) => {
    if (confirm('Are you sure you want to remove this member?')) {
      setData({
        ...data,
        [section]: data[section].filter(item => item.id !== id)
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingItem) {
      setData({
        ...data,
        [editingSection]: data[editingSection].map(item =>
          item.id === editingItem.id ? { ...item, ...formData } : item
        )
      })
    } else {
      const newItem = {
        id: Date.now(),
        ...formData,
      }
      setData({
        ...data,
        [editingSection]: [...data[editingSection], newItem]
      })
    }
    
    resetForm()
  }

  const resetForm = () => {
    setFormData({ name: '', position: '', email: '', image: '', head: '', members: 0 })
    setEditingItem(null)
    setEditingSection('')
    setShowEditor(false)
  }

  const addNew = (section) => {
    setEditingSection(section)
    setEditingItem(null)
    setFormData({ name: '', position: '', email: '', image: '', head: '', members: 0 })
    setShowEditor(true)
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
            <div className="flex justify-end mb-4">
              <button
                onClick={() => addNew('executive')}
                className="flex items-center space-x-2 px-4 py-2 bg-university-red text-white rounded-xl hover:bg-university-red-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Officer</span>
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.executive.map((member) => (
                <div key={member.id} className="bg-school-grey-50 rounded-xl p-4 text-center">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                  />
                  <h3 className="font-semibold text-school-grey-800">{member.name}</h3>
                  <p className="text-sm text-university-red font-medium">{member.position}</p>
                  <p className="text-xs text-school-grey-500 mt-1">{member.email}</p>
                  
                  <div className="flex justify-center space-x-2 mt-3">
                    <button
                      onClick={() => handleEdit('executive', member)}
                      className="p-2 text-school-grey-500 hover:text-university-red hover:bg-university-red/10 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete('executive', member.id)}
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
            <div className="flex justify-end mb-4">
              <button
                onClick={() => addNew('legislative')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Officer</span>
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.legislative.map((member) => (
                <div key={member.id} className="bg-school-grey-50 rounded-xl p-4 text-center">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                  />
                  <h3 className="font-semibold text-school-grey-800">{member.name}</h3>
                  <p className="text-sm text-blue-600 font-medium">{member.position}</p>
                  <p className="text-xs text-school-grey-500 mt-1">{member.email}</p>
                  
                  <div className="flex justify-center space-x-2 mt-3">
                    <button
                      onClick={() => handleEdit('legislative', member)}
                      className="p-2 text-school-grey-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete('legislative', member.id)}
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
                      Head: {committee.head} • {committee.members} members
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
                      value={formData.head}
                      onChange={(e) => setFormData({ ...formData, head: e.target.value })}
                      className="w-full px-4 py-3 bg-school-grey-50 border border-school-grey-200 rounded-xl focus:ring-2 focus:ring-university-red/20 focus:border-university-red"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-school-grey-700 mb-2">Number of Members</label>
                    <input
                      type="number"
                      value={formData.members}
                      onChange={(e) => setFormData({ ...formData, members: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-school-grey-50 border border-school-grey-200 rounded-xl focus:ring-2 focus:ring-university-red/20 focus:border-university-red"
                      min="1"
                      required
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
    </div>
  )
}
