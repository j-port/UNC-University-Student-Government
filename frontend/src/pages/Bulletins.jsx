import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import AnnouncementCard from '../components/AnnouncementCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { fetchAnnouncements, fetchIssuances } from '../api'
import { FileText, Megaphone, ArrowRight, Calendar, Download } from 'lucide-react'

// Sample data (used when Supabase data is not available)
const sampleAnnouncements = [
  {
    id: 1,
    title: 'USG General Assembly 2024',
    description: 'Join us for the annual General Assembly where we discuss the plans and initiatives for the upcoming academic year.',
    date: '2024-12-15',
    category: 'Event',
    image_url: null,
  },
  {
    id: 2,
    title: 'New Student Scholarship Program',
    description: 'We are excited to announce a new scholarship program in partnership with the university administration.',
    date: '2024-12-10',
    category: 'Announcement',
  },
  {
    id: 3,
    title: 'Campus Cleanup Drive Success',
    description: 'Thank you to all volunteers who participated in our campus cleanup initiative last week!',
    date: '2024-12-05',
    category: 'Accomplishment',
  },
  {
    id: 4,
    title: 'Mental Health Awareness Week',
    description: 'Join us for a series of activities promoting mental health awareness and wellness.',
    date: '2024-12-01',
    category: 'Event',
  },
]

const sampleIssuances = [
  {
    id: 1,
    title: 'Resolution No. 2024-015',
    description: 'A resolution supporting the establishment of additional study spaces in the library.',
    date: '2024-12-12',
    type: 'Resolution',
  },
  {
    id: 2,
    title: 'Financial Report Q3 2024',
    description: 'Quarterly financial report detailing all USG expenditures and income.',
    date: '2024-12-01',
    type: 'Report',
  },
  {
    id: 3,
    title: 'Memorandum Circular No. 05',
    description: 'Guidelines for student organization accreditation renewal.',
    date: '2024-11-25',
    type: 'Memorandum',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export default function Bulletins() {
  const [announcements, setAnnouncements] = useState([])
  const [issuances, setIssuances] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('announcements')

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      
      const [announcementsResult, issuancesResult] = await Promise.all([
        fetchAnnouncements(),
        fetchIssuances(),
      ])
      
      // Use sample data if no data from Supabase
      setAnnouncements(announcementsResult.data?.length ? announcementsResult.data : sampleAnnouncements)
      setIssuances(issuancesResult.data?.length ? issuancesResult.data : sampleIssuances)
      
      setLoading(false)
    }
    
    loadData()
  }, [])

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
              )}

              {/* Issuances Tab */}
              {activeTab === 'issuances' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  {issuances.map((issuance, index) => (
                    <motion.div
                      key={issuance.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl shadow-card p-6 hover:shadow-card-hover transition-shadow group"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="px-3 py-1 bg-university-red-50 text-university-red text-xs font-medium rounded-full">
                              {issuance.type}
                            </span>
                            <span className="flex items-center text-school-grey-500 text-sm">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(issuance.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                          <h3 className="font-display font-semibold text-lg text-school-grey-800 group-hover:text-university-red transition-colors">
                            {issuance.title}
                          </h3>
                          <p className="text-school-grey-600 text-sm mt-1">
                            {issuance.description}
                          </p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center space-x-2 px-4 py-2 bg-school-grey-100 text-school-grey-700 rounded-lg hover:bg-university-red hover:text-white transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          <span className="text-sm font-medium">Download</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </>
          )}

          {/* View All Link */}
          <div className="text-center mt-12">
            <Link to={`/bulletins/${activeTab}`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary inline-flex items-center"
              >
                View All {activeTab === 'announcements' ? 'Announcements' : 'Issuances'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </motion.button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
