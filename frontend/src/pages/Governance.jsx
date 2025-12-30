import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { FileText, Scale, Users, ArrowRight, BookOpen, Gavel, Network } from 'lucide-react'

const governanceItems = [
  {
    icon: BookOpen,
    title: 'USG Constitution',
    description: 'The fundamental document that establishes the structure, powers, and duties of the University Student Government.',
    path: '/governance/constitution',
    color: 'bg-blue-500',
  },
  {
    icon: Gavel,
    title: 'By-Laws',
    description: 'Detailed rules and regulations governing the operations and procedures of the USG.',
    path: '/governance/bylaws',
    color: 'bg-purple-500',
  },
  {
    icon: Network,
    title: 'Organizational Chart',
    description: 'Visual representation of our leadership structure and the relationships between different offices.',
    path: '/governance/org-chart',
    color: 'bg-green-500',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

export default function Governance() {
  return (
    <main>
      <PageHeader
        badge="Governance Hub"
        title="Know Your Student Government"
        subtitle="Explore the foundational documents and structure that guide our mission to serve the student body."
      />

      {/* Main Content */}
      <section className="bg-school-grey-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {governanceItems.map((item) => (
              <motion.div key={item.title} variants={itemVariants}>
                <Link to={item.path}>
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="card h-full group cursor-pointer"
                  >
                    <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-display font-semibold text-xl text-school-grey-800 mb-3 group-hover:text-university-red transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-school-grey-600 mb-6">
                      {item.description}
                    </p>
                    <div className="flex items-center text-university-red font-medium group-hover:gap-2 transition-all">
                      <span>View Document</span>
                      <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card bg-gradient-to-br from-university-red to-university-red-700 text-white"
            >
              <h3 className="font-display font-bold text-2xl mb-4">Our Mission</h3>
              <p className="text-white/90 leading-relaxed">
                To serve as the voice of the student body, advocating for their rights, 
                welfare, and academic excellence while fostering a culture of transparency, 
                accountability, and service in all our endeavors.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card border-2 border-university-red"
            >
              <h3 className="font-display font-bold text-2xl text-university-red mb-4">Our Vision</h3>
              <p className="text-school-grey-700 leading-relaxed">
                A university community where every student is empowered, heard, and 
                represented—designing spaces for a better future through collaborative 
                governance and meaningful engagement.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  )
}
