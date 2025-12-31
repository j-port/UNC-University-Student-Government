import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, ArrowLeft, Tag } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import LoadingSpinner from '../components/LoadingSpinner'
import { supabase } from '../lib/supabaseClient'

export default function AnnouncementDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [announcement, setAnnouncement] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const { data, error } = await supabase
          .from('announcements')
          .select('*')
          .eq('id', id)
          .eq('status', 'published')
          .single()

        if (error) throw error

        setAnnouncement(data)
      } catch (err) {
        console.error('Error fetching announcement:', err)
        setError('Announcement not found')
      } finally {
        setLoading(false)
      }
    }

    fetchAnnouncement()
  }, [id])

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getCategoryColor = (cat) => {
    const colors = {
      announcement: 'bg-blue-100 text-blue-700',
      accomplishment: 'bg-green-100 text-green-700',
      event: 'bg-purple-100 text-purple-700',
      news: 'bg-orange-100 text-orange-700',
      default: 'bg-school-grey-100 text-school-grey-700',
    }
    return colors[cat?.toLowerCase()] || colors.default
  }

  if (loading) {
    return (
      <main>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner message="Loading announcement..." />
        </div>
      </main>
    )
  }

  if (error || !announcement) {
    return (
      <main>
        <div className="min-h-screen flex items-center justify-center bg-school-grey-50">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-school-grey-800 mb-4">Announcement Not Found</h1>
            <p className="text-school-grey-600 mb-8">The announcement you're looking for doesn't exist or has been removed.</p>
            <Link
              to="/bulletins"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-university-red text-white rounded-lg hover:bg-university-red-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Bulletins</span>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main>
      <PageHeader
        badge="Announcement"
        title={announcement.title}
        subtitle={formatDate(announcement.published_at || announcement.created_at)}
      />

      <section className="bg-school-grey-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-card overflow-hidden"
          >
            {/* Featured Image */}
            {announcement.image_url && (
              <div className="w-full h-96 overflow-hidden">
                <img
                  src={announcement.image_url}
                  alt={announcement.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div className="p-8">
              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-school-grey-100">
                <div className="flex items-center text-school-grey-500">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span className="text-sm">{formatDate(announcement.published_at || announcement.created_at)}</span>
                </div>
                {announcement.category && (
                  <div className="flex items-center">
                    <Tag className="w-5 h-5 mr-2 text-school-grey-500" />
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(announcement.category)}`}>
                      {announcement.category}
                    </span>
                  </div>
                )}
              </div>

              {/* Description/Summary */}
              {announcement.description && (
                <div className="mb-6">
                  <p className="text-xl text-school-grey-700 font-medium leading-relaxed">
                    {announcement.description}
                  </p>
                </div>
              )}

              {/* Full Content */}
              {announcement.content && (
                <div className="prose prose-lg max-w-none">
                  <div 
                    className="text-school-grey-600 leading-relaxed whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: announcement.content.replace(/\n/g, '<br />') }}
                  />
                </div>
              )}

              {/* Back Button */}
              <div className="mt-8 pt-8 border-t border-school-grey-100">
                <Link
                  to="/bulletins"
                  className="inline-flex items-center space-x-2 text-university-red font-medium hover:gap-3 transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back to all bulletins</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
