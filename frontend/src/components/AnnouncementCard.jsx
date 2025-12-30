import { motion } from 'framer-motion'
import { Calendar, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

export default function AnnouncementCard({ announcement, index = 0 }) {
  const { id, title, description, date, category, image_url } = announcement

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

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.1 }}
      className="group"
    >
      <motion.div
        whileHover={{ y: -5 }}
        className="card h-full overflow-hidden"
      >
        {/* Image */}
        {image_url && (
          <div className="relative h-48 -mx-6 -mt-6 mb-4 overflow-hidden">
            <img
              src={image_url}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        )}

        {/* Content */}
        <div className="flex flex-col h-full">
          {/* Category & Date */}
          <div className="flex items-center justify-between mb-3">
            {category && (
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(category)}`}>
                {category}
              </span>
            )}
            {date && (
              <div className="flex items-center text-school-grey-500 text-sm">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(date)}
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="font-display font-semibold text-lg text-school-grey-800 mb-2 group-hover:text-university-red transition-colors">
            {title}
          </h3>

          {/* Description */}
          <p className="text-school-grey-600 text-sm flex-grow line-clamp-3">
            {description}
          </p>

          {/* Read More Link */}
          <div className="mt-4 pt-4 border-t border-school-grey-100">
            <Link
              to={`/bulletins/announcement/${id}`}
              className="inline-flex items-center text-university-red font-medium text-sm group-hover:gap-2 transition-all"
            >
              <span>Read more</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
