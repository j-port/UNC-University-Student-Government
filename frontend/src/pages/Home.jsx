import { motion } from 'framer-motion'
import Hero from '../components/Hero'
import { Link } from 'react-router-dom'
import { ArrowRight, Users, Award, TrendingUp, Heart } from 'lucide-react'

const stats = [
  { icon: Users, value: '15,000+', label: 'Students Represented' },
  { icon: Award, value: '50+', label: 'Projects Completed' },
  { icon: TrendingUp, value: '₱2M+', label: 'Budget Managed' },
  { icon: Heart, value: '100%', label: 'Commitment to You' },
]

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
  return (
    <main>
      <Hero />
      
      {/* Stats Section */}
      <section className="bg-school-grey-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="text-center"
              >
                <div className="w-16 h-16 bg-university-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-university-red" />
                </div>
                <h3 className="font-display text-3xl font-bold text-school-grey-800">
                  {stat.value}
                </h3>
                <p className="text-school-grey-600 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-university-red font-medium">About USG</span>
              <h2 className="section-title mt-2 mb-6">
                Your Voice, Our Mission
              </h2>
              <p className="text-school-grey-600 mb-6">
                The University Student Government serves as the official voice of the student body. 
                We are committed to advocating for student welfare, fostering academic excellence, 
                and creating a vibrant campus community.
              </p>
              <p className="text-school-grey-600 mb-8">
                Through transparency, accountability, and active engagement, we work tirelessly 
                to ensure that every student's concerns are heard and addressed.
              </p>
              <Link to="/about">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary inline-flex items-center"
                >
                  Learn More About Us
                  <ArrowRight className="w-5 h-5 ml-2" />
                </motion.button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <img 
                src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Students in campus"
                className="rounded-2xl shadow-card-hover w-full h-80 object-cover"
              />
              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-display font-semibold text-xl text-school-grey-800 mb-4">
                  Our Core Values
                </h3>
                <ul className="space-y-2">
                  {['Transparency', 'Accountability', 'Service', 'Excellence', 'Unity'].map((value, index) => (
                    <motion.li
                      key={value}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-3"
                    >
                      <div className="w-2 h-2 bg-university-red rounded-full" />
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
      <section className="py-20 bg-university-red relative overflow-hidden">
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
              Have Something to Say?
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Your feedback shapes our initiatives. Share your thoughts, concerns, 
              or suggestions through TINIG DINIG - our dedicated communication channel.
            </p>
            <Link to="/feedback">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-university-red px-8 py-4 rounded-xl font-semibold 
                         shadow-lg hover:shadow-xl transition-all duration-300"
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
