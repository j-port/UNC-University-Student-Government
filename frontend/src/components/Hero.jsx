import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  ArrowRight, 
  Users, 
  FileText, 
  DollarSign, 
  MessageSquare, 
  Megaphone,
  Shield,
  Heart,
  Star,
  ChevronDown,
  Play
} from 'lucide-react'
import USGLogo from '../assets/USG LOGO NO BG.png'
import CampusBg from '../assets/USG COVER.jpg'
import { useRef } from 'react'
import { useSiteContent } from '../hooks/useSiteContent'

const defaultFeatures = [
  {
    icon: Users,
    title: 'Governance Hub',
    description: 'Access the USG Constitution, By-Laws, and organizational structure.',
    path: '/governance',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: FileText,
    title: 'Bulletins & News',
    description: 'Stay updated with announcements and official issuances.',
    path: '/bulletins',
    color: 'from-green-500 to-green-600',
  },
  {
    icon: DollarSign,
    title: 'Transparency Portal',
    description: 'View financial transactions and fund allocations.',
    path: '/transparency',
    color: 'from-purple-500 to-purple-600',
  },
]

const defaultStats = [
  { number: '10,000+', label: 'Students Served', icon: Users },
  { number: '50+', label: 'Programs & Events', icon: Star },
  { number: '100%', label: 'Transparency', icon: Shield },
  { number: '24/7', label: 'Support Available', icon: Heart },
]

// Icon mapping for dynamic content
const iconMap = {
  Users,
  FileText,
  DollarSign,
  MessageSquare,
  Megaphone,
  Shield,
  Heart,
  Star,
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

const floatAnimation = {
  y: [-10, 10, -10],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: 'easeInOut',
  },
}

export default function Hero() {
  const { content } = useSiteContent()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  
  // Disable parallax on mobile for better UX
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const backgroundY = useTransform(scrollYProgress, [0, 1], isMobile ? ['0%', '0%'] : ['0%', '50%'])
  const textY = useTransform(scrollYProgress, [0, 1], isMobile ? ['0%', '0%'] : ['0%', '100%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], isMobile ? [1, 1] : [1, 0])

  // Use dynamic stats from database or fall back to defaults
  const stats = content.heroStats?.length > 0
    ? content.heroStats.map(stat => ({
        number: stat.value,
        label: stat.label,
        icon: iconMap[stat.icon] || Users,
      }))
    : defaultStats

  // Use dynamic features from database or fall back to defaults
  const features = content.heroFeatures?.length > 0
    ? content.heroFeatures.map(feature => ({
        icon: iconMap[feature.icon] || Users,
        title: feature.title,
        description: feature.description,
        path: feature.path,
        color: feature.color || 'from-blue-500 to-blue-600',
      }))
    : defaultFeatures

  return (
    <>
      {/* Hero Section with Campus Background */}
      <section ref={ref} className="relative min-h-screen overflow-hidden">
        {/* Parallax Background */}
        <motion.div 
          style={{ y: backgroundY }}
          className="absolute inset-0"
        >
          <img 
            src={CampusBg} 
            alt="University of Nueva Caceres Campus" 
            className="w-full h-[120%] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-university-red/30 to-transparent" />
        </motion.div>

        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, 20],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Main Content */}
        <motion.div 
          style={{ y: textY, opacity }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-16 sm:pb-20 min-h-screen flex flex-col justify-center"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md text-white px-5 py-2.5 rounded-full mb-6 border border-white/20"
            >
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Academic Year 2024-2025 • Now Active</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              variants={itemVariants}
              className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight"
            >
              Designing Spaces for a
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-university-red-300 to-university-red-500">
                Better Future
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-6 sm:mb-10 leading-relaxed px-2"
            >
              The University Student Government of UNC is committed to amplifying student voices, 
              ensuring transparency, and building a thriving campus community for all Navegantes.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 w-full px-2"
            >
              <Link to="/feedback" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(225, 29, 72, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-university-red to-university-red-600 text-white font-semibold rounded-full overflow-hidden shadow-lg shadow-university-red/30"
                >
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base">TINIG DINIG - Share Your Voice</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-university-red-600 to-university-red-700"
                    initial={{ x: '100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </Link>
              <Link to="/about" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-md text-white font-semibold rounded-full border border-white/30 hover:bg-white/20 transition-colors flex items-center justify-center space-x-2"
                >
                  <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">Learn About USG</span>
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto px-2"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10"
                >
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-university-red-300 mx-auto mb-1 sm:mb-2" />
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{stat.number}</div>
                  <div className="text-xs sm:text-sm text-white/60">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex flex-col items-center text-white/60"
            >
              <span className="text-sm mb-2">Scroll to explore</span>
              <ChevronDown className="w-6 h-6" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* TINIG DINIG Highlight Section */}
      <section className="relative py-20 bg-gradient-to-br from-university-red via-university-red-600 to-university-red-700 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-20 -right-20 w-64 h-64 border border-white/10 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-32 -left-32 w-96 h-96 border border-white/10 rounded-full"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center space-x-2 bg-white/20 text-white px-4 py-2 rounded-full mb-6">
                <Megaphone className="w-5 h-5" />
                <span className="text-sm font-semibold">Featured Program</span>
              </div>
              
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                TINIG DINIG
              </h2>
              <p className="text-xl text-white/90 mb-4">
                <span className="font-semibold">"Your Voice, Our Action"</span>
              </p>
              <p className="text-lg text-white/80 mb-8 leading-relaxed">
                TINIG DINIG is the official feedback mechanism of the USG where every Navegante 
                can share their concerns, suggestions, and ideas. We believe that every voice matters, 
                and together, we can create meaningful change in our university.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  'Submit concerns anonymously or with your identity',
                  'Track the status of your feedback',
                  'Direct line to USG officers and committees',
                  'Response guaranteed within 5 working days',
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-white/90">{item}</span>
                  </motion.div>
                ))}
              </div>

              <Link to="/feedback">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-university-red font-bold rounded-full shadow-xl hover:shadow-2xl transition-shadow flex items-center space-x-2"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Share Your Feedback Now</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </motion.div>

            {/* Right Content - Feedback Preview */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative">
                {/* Mock Feedback Card */}
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="bg-white rounded-3xl shadow-2xl p-8"
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-university-red to-university-red-600 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-school-grey-800">Quick Feedback Form</h3>
                      <p className="text-sm text-school-grey-500">Takes less than 2 minutes</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-school-grey-50 rounded-xl p-4">
                      <label className="text-sm font-medium text-school-grey-600 block mb-2">Category</label>
                      <div className="flex flex-wrap gap-2">
                        {['Academic', 'Facilities', 'Events', 'Services'].map((cat) => (
                          <span key={cat} className="px-3 py-1 bg-white rounded-full text-sm text-school-grey-600 border">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-school-grey-50 rounded-xl p-4">
                      <label className="text-sm font-medium text-school-grey-600 block mb-2">Your Message</label>
                      <div className="h-20 bg-white rounded-lg border-2 border-dashed border-school-grey-200 flex items-center justify-center">
                        <span className="text-school-grey-400">Type your feedback here...</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="flex items-center space-x-2 text-sm text-school-grey-600">
                        <input type="checkbox" className="rounded text-university-red" />
                        <span>Submit anonymously</span>
                      </label>
                      <div className="px-4 py-2 bg-university-red text-white rounded-full text-sm font-medium">
                        Submit →
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Floating Badge */}
                <motion.div
                  animate={{ rotate: [-5, 5, -5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
                >
                  100% Confidential
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-school-grey-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-school-grey-800 mb-4">
              Explore USG Services
            </h2>
            <p className="text-lg text-school-grey-600 max-w-2xl mx-auto">
              Your student government provides various services to ensure transparency 
              and keep you informed about university affairs.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={feature.path}>
                  <motion.div
                    whileHover={{ y: -10 }}
                    className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 h-full"
                  >
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-school-grey-800 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-school-grey-600 mb-4">
                      {feature.description}
                    </p>
                    <div className="flex items-center text-university-red font-semibold group-hover:gap-2 transition-all">
                      <span>Explore</span>
                      <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links / Announcements Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Latest Announcements */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-school-grey-800">Latest Announcements</h2>
                <Link to="/bulletins" className="text-university-red font-medium hover:underline">
                  View All →
                </Link>
              </div>
              
              <div className="space-y-4">
                {[
                  { title: 'USG General Assembly 2025', date: 'January 15, 2025', type: 'Event' },
                  { title: 'New Student ID Claiming Schedule', date: 'January 10, 2025', type: 'Notice' },
                  { title: 'Scholarship Application Now Open', date: 'January 5, 2025', type: 'Announcement' },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 5 }}
                    className="bg-school-grey-50 rounded-2xl p-5 cursor-pointer hover:bg-school-grey-100 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-semibold text-university-red bg-university-red/10 px-2 py-1 rounded-full">
                          {item.type}
                        </span>
                        <h3 className="font-semibold text-school-grey-800 mt-2">{item.title}</h3>
                        <p className="text-sm text-school-grey-500 mt-1">{item.date}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-school-grey-400" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Access */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-school-grey-800 mb-8">Quick Access</h2>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: FileText, title: 'Constitution', path: '/governance/constitution', color: 'bg-blue-100 text-blue-600' },
                  { icon: Users, title: 'Org Chart', path: '/governance/orgchart', color: 'bg-green-100 text-green-600' },
                  { icon: DollarSign, title: 'Financial Reports', path: '/transparency', color: 'bg-purple-100 text-purple-600' },
                  { icon: MessageSquare, title: 'TINIG DINIG', path: '/feedback', color: 'bg-orange-100 text-orange-600' },
                ].map((item, index) => (
                  <Link key={index} to={item.path}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white border-2 border-school-grey-100 rounded-2xl p-6 text-center hover:border-university-red/30 hover:shadow-lg transition-all"
                    >
                      <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                        <item.icon className="w-7 h-7" />
                      </div>
                      <h3 className="font-semibold text-school-grey-800">{item.title}</h3>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-school-grey-800 to-school-grey-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Have Questions or Concerns?
            </h2>
            <p className="text-lg text-white/70 mb-8">
              We're here to listen. Your feedback helps us serve you better.
            </p>
            <Link to="/feedback">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-university-red text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-shadow"
              >
                Start TINIG DINIG Now
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
