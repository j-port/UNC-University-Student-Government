import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
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

const coreValues = [
  { 
    icon: Heart, 
    title: 'Service', 
    description: 'Dedicated to serving the student body with passion and commitment.',
    color: 'bg-red-500'
  },
  { 
    icon: Eye, 
    title: 'Transparency', 
    description: 'Open and honest in all our dealings and decision-making processes.',
    color: 'bg-blue-500'
  },
  { 
    icon: Users, 
    title: 'Unity', 
    description: 'Fostering solidarity and collaboration among all students.',
    color: 'bg-green-500'
  },
  { 
    icon: Award, 
    title: 'Excellence', 
    description: 'Striving for the highest standards in everything we do.',
    color: 'bg-purple-500'
  },
  { 
    icon: Lightbulb, 
    title: 'Innovation', 
    description: 'Embracing new ideas and creative solutions for student welfare.',
    color: 'bg-yellow-500'
  },
  { 
    icon: CheckCircle, 
    title: 'Accountability', 
    description: 'Taking responsibility for our actions and their outcomes.',
    color: 'bg-indigo-500'
  },
]

const achievements = [
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
  return (
    <main>
      <PageHeader
        badge="About Us"
        title="University Student Government"
        subtitle="Designing Spaces for a Better Future - Your voice, our mission"
      />

      {/* Introduction Section */}
      <section className="bg-school-grey-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-center lg:text-left"
            >
              <div className="inline-block mb-6">
                <img 
                  src={USGLogo} 
                  alt="USG Logo" 
                  className="w-48 h-48 object-contain mx-auto lg:mx-0"
                />
              </div>
              <h2 className="section-title mb-4">Who We Are</h2>
              <p className="text-school-grey-600 mb-4 leading-relaxed">
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
                className="rounded-2xl shadow-card-hover w-full h-[400px] object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-university-red text-white p-6 rounded-2xl shadow-lg">
                <p className="text-4xl font-bold font-display">15,000+</p>
                <p className="text-white/80">Students Represented</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card bg-gradient-to-br from-university-red to-university-red-700 text-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <div className="relative">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-display font-bold text-2xl mb-4">Our Mission</h3>
                <p className="text-white/90 leading-relaxed">
                  To serve as the voice of the student body, advocating for their rights, 
                  welfare, and academic excellence while fostering a culture of transparency, 
                  accountability, and service in all our endeavors. We commit to creating 
                  programs and initiatives that address the diverse needs of every student.
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
                <div className="w-14 h-14 bg-university-red-50 rounded-xl flex items-center justify-center mb-4">
                  <Eye className="w-7 h-7 text-university-red" />
                </div>
                <h3 className="font-display font-bold text-2xl text-university-red mb-4">Our Vision</h3>
                <p className="text-school-grey-700 leading-relaxed">
                  A university community where every student is empowered, heard, and 
                  represented—designing spaces for a better future through collaborative 
                  governance, meaningful engagement, and transformative leadership that 
                  inspires positive change in society.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-school-grey-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-university-red font-medium">What Drives Us</span>
            <h2 className="section-title mt-2">Our Core Values</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              These principles guide every decision we make and every action we take in service of the student body.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {coreValues.map((value) => (
              <motion.div
                key={value.title}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="card group"
              >
                <div className={`w-14 h-14 ${value.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <value.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-display font-semibold text-lg text-school-grey-800 mb-2">
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
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img 
                src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Student achievements"
                className="rounded-2xl shadow-card-hover w-full h-[400px] object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-university-red font-medium">Our Impact</span>
              <h2 className="section-title mt-2 mb-6">Recent Achievements</h2>
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3"
                  >
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Star className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-school-grey-700">{achievement}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-university-red relative overflow-hidden">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full"
        />
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-white/5 rounded-full"
        />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6">
              Be Part of the Change
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Whether you want to share your ideas, join a committee, or simply stay informed, 
              there are many ways to get involved with your student government.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/feedback">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-university-red px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Share Your Voice
                </motion.button>
              </Link>
              <Link to="/governance/org-chart">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/10 text-white border-2 border-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all"
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
