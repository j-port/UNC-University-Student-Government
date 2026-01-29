import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import LoadingSpinner from '../components/LoadingSpinner'
import USGLogo from '../assets/USG LOGO NO BG.png'
import { 
  Target, 
  Eye, 
  Heart, 
  Users, 
  Award, 
  Lightbulb,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react'
import { useSiteContent } from '../hooks/useSiteContent'
import { useAutomatedStats } from '../hooks/useAutomatedStats'

// Icon mapping for dynamic core values
const valueIconMap = {
  Service: Heart,
  Transparency: Eye,
  Unity: Users,
  Excellence: Award,
  Innovation: Lightbulb,
  Accountability: CheckCircle,
}

// Color mapping for core values
const valueColorMap = {
  Service: 'bg-red-500',
  Transparency: 'bg-blue-500',
  Unity: 'bg-green-500',
  Excellence: 'bg-purple-500',
  Innovation: 'bg-yellow-500',
  Accountability: 'bg-indigo-500',
}

// Fallback values if database is empty
const defaultValues = [
  { title: 'Service', description: 'Dedicated to serving the student body with passion and commitment.' },
  { title: 'Transparency', description: 'Open and honest in all our dealings and decision-making processes.' },
  { title: 'Unity', description: 'Fostering solidarity and collaboration among all students.' },
  { title: 'Excellence', description: 'Striving for the highest standards in everything we do.' },
  { title: 'Accountability', description: 'Taking responsibility for our actions and their outcomes.' },
]

const defaultAchievements = [
  'Successfully advocated for extended library hours',
  'Launched the TINIG DINIG feedback system',
  'Organized 50+ student events and activities',
  'Managed ₱2M+ student funds with full transparency',
  'Established scholarship programs for deserving students',
  'Created partnerships with local businesses for student discounts',
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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

export default function About() {
  const { content, loading } = useSiteContent()
  const automatedStats = useAutomatedStats()

  // Get dynamic content or use defaults
  const coreValues = content.coreValues?.length > 0
    ? content.coreValues.map(v => ({
        title: v.title,
        description: v.content || v.description,
        icon: valueIconMap[v.title] || Heart,
        color: valueColorMap[v.title] || 'bg-gray-500',
      }))
    : defaultValues.map(v => ({
        ...v,
        icon: valueIconMap[v.title] || Heart,
        color: valueColorMap[v.title] || 'bg-gray-500',
      }))

  const achievements = content.achievements?.length > 0
    ? content.achievements.map(a => a.content || a.title)
    : defaultAchievements

  const missionText = content.mission?.content || `To serve as the voice of the student body, advocating for their rights, 
  welfare, and academic excellence while fostering a culture of transparency, 
  accountability, and service in all our endeavors. We commit to creating 
  programs and initiatives that address the diverse needs of every student.`

  const visionText = content.vision?.content || `A university community where every student is empowered, heard, and 
  represented—designing spaces for a better future through collaborative 
  governance, meaningful engagement, and transformative leadership that 
  inspires positive change in society.`

  // Get page header content
  const pageTitle = content.header?.title || 'University Student Government'
  const pageSubtitle = content.header?.content || 'Designing Spaces for a Better Future - Your voice, our mission'

  // Calculate student count (you can make this dynamic too)
  const studentsRepresented = automatedStats.loading ? '15,000+' : '15,000+'

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </main>
    )
  }

  return (
    <main>
      <PageHeader
        badge="About Us"
        title={pageTitle}
        subtitle={pageSubtitle}
      />

      {/* Introduction Section */}
      <section className="bg-school-grey-50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-center lg:text-left"
            >
              <div className="inline-block mb-4 sm:mb-6">
                <img 
                  src={USGLogo} 
                  alt="USG Logo" 
                  className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-contain mx-auto lg:mx-0"
                />
              </div>
              <h2 className="section-title mb-3 sm:mb-4 text-2xl sm:text-3xl">Who We Are</h2>
              <p className="text-school-grey-600 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">
                The University Student Government (USG) is the highest governing body of the student population 
                at the University of Nueva Caceres. Established to represent, protect, and advance the rights 
                and welfare of every student, we serve as the bridge between the student body and the university administration.
              </p>
              <p className="text-school-grey-600 mb-6 leading-relaxed">
                Through democratic processes and transparent governance, we work tirelessly to create a vibrant, 
                inclusive, and empowering campus community where every student's voice is heard and valued.
              </p>
              <Link to="/governance">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary inline-flex items-center"
                >
                  Learn About Our Structure
                  <ArrowRight className="w-5 h-5 ml-2" />
                </motion.button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img 
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Students collaborating"
                className="rounded-2xl shadow-card-hover w-full h-64 sm:h-80 md:h-[400px] object-cover"
              />
              <div className="absolute -bottom-4 sm:-bottom-6 -left-4 sm:-left-6 bg-university-red text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg">
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold font-display">{studentsRepresented}</p>
                <p className="text-white/80 text-sm sm:text-base">Students Represented</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card bg-gradient-to-br from-university-red to-university-red-700 text-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <div className="relative">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                  <Target className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h3 className="font-display font-bold text-xl sm:text-2xl mb-3 sm:mb-4">Our Mission</h3>
                <p className="text-white/90 leading-relaxed text-sm sm:text-base">
                  {missionText}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="card border-2 border-university-red relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-university-red/5 rounded-full -mr-16 -mt-16" />
              <div className="relative">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-university-red-50 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                  <Eye className="w-6 h-6 sm:w-7 sm:h-7 text-university-red" />
                </div>
                <h3 className="font-display font-bold text-xl sm:text-2xl text-university-red mb-3 sm:mb-4">Our Vision</h3>
                <p className="text-school-grey-700 leading-relaxed text-sm sm:text-base">
                  {visionText}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-12 sm:py-16 bg-school-grey-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <span className="text-university-red font-medium text-sm sm:text-base">What Drives Us</span>
            <h2 className="section-title mt-2 text-2xl sm:text-3xl">Our Core Values</h2>
            <p className="section-subtitle max-w-2xl mx-auto text-sm sm:text-base">
              These principles guide every decision we make and every action we take in service of the student body.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            {coreValues.map((value) => (
              <motion.div
                key={value.title}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="card group"
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 ${value.color} rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
                  <value.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h3 className="font-display font-semibold text-base sm:text-lg text-school-grey-800 mb-2">
                  {value.title}
                </h3>
                <p className="text-school-grey-600 text-sm">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img 
                src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Student achievements"
                className="rounded-2xl shadow-card-hover w-full h-64 sm:h-80 md:h-[400px] object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-university-red font-medium text-sm sm:text-base">Our Impact</span>
              <h2 className="section-title mt-2 mb-4 sm:mb-6 text-2xl sm:text-3xl">Recent Achievements</h2>
              <div className="space-y-3 sm:space-y-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3"
                  >
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                    </div>
                    <p className="text-school-grey-700 text-sm sm:text-base">{achievement}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-university-red relative overflow-hidden">
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
              Be Part of the Change
            </h2>
            <p className="text-base sm:text-lg text-white/80 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Whether you want to share your ideas, join a committee, or simply stay informed, 
              there are many ways to get involved with your student government.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link to="/feedback" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto bg-white text-university-red px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Share Your Voice
                </motion.button>
              </Link>
              <Link to="/governance/org-chart" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto bg-white/10 text-white border-2 border-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-white/20 transition-all"
                >
                  Meet Our Leaders
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
