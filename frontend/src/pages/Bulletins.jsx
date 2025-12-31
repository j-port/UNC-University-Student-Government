import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import AnnouncementCard from '../components/AnnouncementCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { fetchAnnouncements, fetchIssuances } from '../api'
import { FileText, Megaphone, ArrowRight, Calendar, Download, X, Eye } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
}

export default function Bulletins() {
  const [announcements, setAnnouncements] = useState([])
  const [issuances, setIssuances] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('announcements')
  const [showViewer, setShowViewer] = useState(false)
  const [viewerData, setViewerData] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      
      try {
        const [announcementsResult, issuancesResult] = await Promise.all([
          fetchAnnouncements({ status: 'published', limit: null }),
          fetchIssuances(),
        ])
        
        setAnnouncements(announcementsResult.data || [])
        setIssuances(issuancesResult.data || [])
      } catch (error) {
        console.error('Error loading bulletins:', error)
        setAnnouncements([])
        setIssuances([])
      }
      
      setLoading(false)
    }
    
    loadData()
  }, [])

  const handleView = (issuance) => {
    setViewerData(issuance)
    setShowViewer(true)
  }

  const handleDownload = (fileUrl, fileName) => {
    const link = document.createElement('a')
    link.href = fileUrl
    link.download = fileName
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown'
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(2)} MB`
  }

  const tabs = [
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'issuances', label: 'Issuances & Reports', icon: FileText },
  ]

  return (
    <main>
      <PageHeader
        badge="Stay Updated"
        title="Bulletins"
        subtitle="Keep up with the latest announcements, accomplishments, and official issuances from your student government"
      />

      <section className="bg-school-grey-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-university-red text-white shadow-lg'
                    : 'bg-white text-school-grey-700 hover:bg-school-grey-100'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>

          {loading ? (
            <LoadingSpinner message="Loading bulletins..." />
          ) : (
            <>
              {/* Announcements Tab */}
              {activeTab === 'announcements' && (
                announcements.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-card p-12 text-center"
                  >
                    <Bell className="w-16 h-16 text-school-grey-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-school-grey-700 mb-2">No Announcements Yet</h3>
                    <p className="text-school-grey-500">Announcements are currently not available. Check back soon!</p>
                  </motion.div>
                ) : (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {announcements.map((announcement, index) => (
                      <AnnouncementCard
                        key={announcement.id}
                        announcement={announcement}
                        index={index}
                      />
                    ))}
                  </motion.div>
                )
              )}

              {/* Issuances Tab */}
              {activeTab === 'issuances' && (
                issuances.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-card p-12 text-center"
                  >
                    <FileText className="w-16 h-16 text-school-grey-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-school-grey-700 mb-2">No Issuances Yet</h3>
                    <p className="text-school-grey-500">Official documents and issuances are currently not available. Check back soon!</p>
                  </motion.div>
                ) : (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {issuances.map((issuance, index) => (
                    <motion.div
                      key={issuance.id}
                      variants={itemVariants}
                      whileHover={{ y: -5 }}
                      className="group bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all p-6 flex flex-col"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <span className="inline-block px-3 py-1 bg-university-red-50 text-university-red text-xs font-medium rounded-full">
                            {issuance.type}
                          </span>
                          <span className="flex items-center text-school-grey-500 text-sm">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(issuance.published_at || issuance.date || issuance.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <h3 className="font-display font-semibold text-lg text-school-grey-800 group-hover:text-university-red transition-colors mb-2">
                          {issuance.title}
                        </h3>
                        <p className="text-school-grey-600 text-sm mb-4">
                          {issuance.description}
                        </p>
                        {issuance.file_url && (
                          <p className="text-school-grey-400 text-xs">
                            {issuance.file_name} {issuance.file_size && `• ${formatFileSize(issuance.file_size)}`}
                          </p>
                        )}
                      </div>
                      <div className="mt-4">
                        <motion.button
                          onClick={() => handleView(issuance)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-school-grey-100 text-school-grey-700 rounded-lg hover:bg-university-red hover:text-white transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="text-sm font-medium">View</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                  </motion.div>
                )
              )}
            </>
          )}
        </div>

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
                {viewerData.file_size && <span>{formatFileSize(viewerData.file_size)}</span>}
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
      </section>
    </main>
  )
}
