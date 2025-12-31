import { motion } from 'framer-motion'
import Hero from '../components/Hero'
import { Link } from 'react-router-dom'
import { ArrowRight, Users, Award, TrendingUp, Heart } from 'lucide-react'
import { useSiteContent } from '../hooks/useSiteContent'
import { useAutomatedStats } from '../hooks/useAutomatedStats'
import LoadingSpinner from '../components/LoadingSpinner'

// Default fallback stats if database is empty
const defaultStats = [
  { icon: Users, value: '15,000+', label: 'Students Represented' },
  { icon: Award, value: '50+', label: 'Projects Completed' },
  { icon: TrendingUp, value: '₱2M+', label: 'Budget Managed' },
  { icon: Heart, value: '100%', label: 'Commitment to You' },
]

// Icon mapping for dynamic stats
const iconMap = {
  Users,
  Award,
  TrendingUp,
  Heart,
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

export default function Home() {
  const { content, loading, error } = useSiteContent()
  const automatedStats = useAutomatedStats()

  // Use dynamic stats from database, with automated counts merged in
  const stats = content.homeStats?.length > 0
    ? content.homeStats.map(stat => {
        // Auto-replace "Projects Completed" with accomplishments count
        if (stat.section_key === 'projects-completed' && !automatedStats.loading) {
          return {
            icon: iconMap[stat.icon] || Award,
            value: `${automatedStats.accomplishmentsCount}+`,
            label: stat.label,
          }
        }
        // Auto-replace "Budget Managed" with calculated total
        if (stat.section_key === 'budget-managed' && !automatedStats.loading) {
          return {
            icon: iconMap[stat.icon] || TrendingUp,
            value: automatedStats.formattedBudget,
            label: stat.label,
          }
        }
        return {
          icon: iconMap[stat.icon] || Users,
          value: stat.value,
          label: stat.label,
        }
      })
    : defaultStats

  // Get dynamic content or use defaults
  const coreValues = content.coreValues?.length > 0
    ? content.coreValues.map(v => v.title || v.content)
    : ['Transparency', 'Accountability', 'Service', 'Excellence', 'Unity']

  const aboutTitle = content.about?.title || "Your Voice, Our Mission"
  const aboutContent = content.about?.content || `The University Student Government serves as the official voice of the student body. 
We are committed to advocating for student welfare, fostering academic excellence, 
and creating a vibrant campus community.

Through transparency, accountability, and active engagement, we work tirelessly 
to ensure that every student's concerns are heard and addressed.`

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </main>
    )
  }

  return (
    <main>
      <Hero />
      
      {/* Stats Section */}
      <section className="bg-school-grey-50 py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="text-center"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-university-red-50 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-university-red" />
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-school-grey-800">
                  {stat.value}
                </h3>
                <p className="text-sm sm:text-base text-school-grey-600 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-university-red font-medium text-sm sm:text-base">About USG</span>
              <h2 className="section-title mt-2 mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl">
                {aboutTitle}
              </h2>
              {aboutContent.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-school-grey-600 mb-4 sm:mb-6 text-sm sm:text-base">
                  {paragraph}
                </p>
              ))}
              <Link to="/about" className="inline-block w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary inline-flex items-center justify-center w-full sm:w-auto"
                >
                  Learn More About Us
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </motion.button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative mt-8 lg:mt-0"
            >
              <img 
                src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Students in campus"
                className="rounded-2xl shadow-card-hover w-full h-64 sm:h-80 object-cover"
              />
              <div className="relative lg:absolute lg:-bottom-4 lg:-right-4 mt-4 lg:mt-0 bg-white rounded-2xl shadow-lg p-4 sm:p-6">
                <h3 className="font-display font-semibold text-lg sm:text-xl text-school-grey-800 mb-3 sm:mb-4">
                  Our Core Values
                </h3>
                <ul className="space-y-2">
                  {coreValues.map((value, index) => (
                    <motion.li
                      key={value}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-3"
                    >
                      <div className="w-2 h-2 bg-university-red rounded-full flex-shrink-0" />
                      <span className="text-school-grey-700 font-medium text-sm">{value}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-university-red relative overflow-hidden">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          className="absolute -top-20 -right-20 w-64 sm:w-96 h-64 sm:h-96 bg-white/10 rounded-full"
        />
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="absolute -bottom-32 -left-32 w-80 sm:w-[500px] h-80 sm:h-[500px] bg-white/5 rounded-full"
        />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
              Have Something to Say?
            </h2>
            <p className="text-base sm:text-lg text-white/80 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Your feedback shapes our initiatives. Share your thoughts, concerns, 
              or suggestions through TINIG DINIG - our dedicated communication channel.
            </p>
            <Link to="/feedback" className="inline-block w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-university-red px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold 
                         shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
              >
                Submit Feedback
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
