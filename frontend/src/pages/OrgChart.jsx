import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageHeader from '../components/PageHeader'
import { Link } from 'react-router-dom'
import USGLogo from '../assets/USG LOGO NO BG.png'
import { 
  ArrowLeft, 
  Download, 
  User, 
  Users, 
  ChevronDown,
  ChevronRight,
  Building,
  BookOpen,
  Music,
  Trophy,
  Palette,
  Globe,
  Heart,
  Briefcase,
  GraduationCap,
  Scale
} from 'lucide-react'

// Executive Branch Data
const executiveBranch = {
  title: 'Executive Branch',
  color: 'from-university-red to-university-red-700',
  icon: Building,
  members: [
    { position: 'USG President', name: 'Juan Dela Cruz', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' },
    { position: 'USG Vice President', name: 'Maria Santos', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face' },
    { position: 'Executive Secretary', name: 'Pedro Reyes', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face' },
    { position: 'Deputy Secretary', name: 'Ana Garcia', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face' },
  ]
}

// Legislative Branch Data
const legislativeBranch = {
  title: 'Legislative Branch (Student Council)',
  color: 'from-blue-500 to-blue-600',
  icon: Scale,
  members: [
    { position: 'Council President', name: 'Jose Lopez', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' },
    { position: 'Council Vice President', name: 'Rosa Martinez', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face' },
    { position: 'Majority Floor Leader', name: 'Carlos Aquino', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face' },
    { position: 'Minority Floor Leader', name: 'Elena Ramos', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face' },
  ]
}

// Council Departments
const councilDepartments = [
  {
    name: 'Finance Committee',
    head: 'Sofia Mendoza',
    color: 'bg-emerald-500',
    icon: Briefcase,
    description: 'Manages USG budget and financial transactions'
  },
  {
    name: 'Academic Affairs',
    head: 'David Tan',
    color: 'bg-blue-500',
    icon: GraduationCap,
    description: 'Handles academic concerns and policies'
  },
  {
    name: 'Student Welfare',
    head: 'Grace Lee',
    color: 'bg-pink-500',
    icon: Heart,
    description: 'Addresses student welfare and wellness'
  },
  {
    name: 'Events & Activities',
    head: 'Mark Gonzales',
    color: 'bg-orange-500',
    icon: Trophy,
    description: 'Organizes campus events and activities'
  },
  {
    name: 'Communications',
    head: 'Isabel Reyes',
    color: 'bg-purple-500',
    icon: Globe,
    description: 'Manages public relations and media'
  },
  {
    name: 'Cultural Affairs',
    head: 'Miguel Torres',
    color: 'bg-yellow-500',
    icon: Palette,
    description: 'Promotes arts and cultural activities'
  },
]

// College Student Councils
const collegeCouncils = [
  { name: 'CAS-SC', fullName: 'College of Arts and Sciences Student Council', color: 'bg-red-500' },
  { name: 'CBA-SC', fullName: 'College of Business and Accountancy Student Council', color: 'bg-blue-500' },
  { name: 'CCS-SC', fullName: 'College of Computer Studies Student Council', color: 'bg-green-500' },
  { name: 'CCJE-SC', fullName: 'College of Criminal Justice Education Student Council', color: 'bg-yellow-500' },
  { name: 'CED-SC', fullName: 'College of Education Student Council', color: 'bg-purple-500' },
  { name: 'CEA-SC', fullName: 'College of Engineering and Architecture Student Council', color: 'bg-orange-500' },
  { name: 'COL-SC', fullName: 'College of Law Student Council', color: 'bg-indigo-500' },
  { name: 'CON-SC', fullName: 'College of Nursing Student Council', color: 'bg-pink-500' },
]

// FSOs - Academic Organizations
const academicOrgs = [
  { name: 'Computer Science Society', abbrev: 'CSS', college: 'CCS' },
  { name: 'Information Technology Guild', abbrev: 'ITG', college: 'CCS' },
  { name: 'Junior Philippine Institute of Accountants', abbrev: 'JPIA', college: 'CBA' },
  { name: 'Junior Marketing Association', abbrev: 'JMA', college: 'CBA' },
  { name: 'Future Educators Society', abbrev: 'FES', college: 'CED' },
  { name: 'Engineering Students Society', abbrev: 'ESS', college: 'CEA' },
  { name: 'Architecture Students League', abbrev: 'ASL', college: 'CEA' },
  { name: 'Nursing Students Association', abbrev: 'NSA', college: 'CON' },
  { name: 'Criminology Students Organization', abbrev: 'CSO', college: 'CCJE' },
  { name: 'Political Science Society', abbrev: 'PSS', college: 'CAS' },
  { name: 'Psychology Students Alliance', abbrev: 'PSA', college: 'CAS' },
  { name: 'Legal Aid Society', abbrev: 'LAS', college: 'COL' },
]

// FSOs - Non-Academic Organizations
const nonAcademicOrgs = [
  { name: 'University Chorale', type: 'Performing Arts', icon: Music },
  { name: 'Theater Arts Guild', type: 'Performing Arts', icon: Palette },
  { name: 'University Dance Troupe', type: 'Performing Arts', icon: Music },
  { name: 'Photography Club', type: 'Special Interest', icon: Palette },
  { name: 'Debate Society', type: 'Academic', icon: BookOpen },
  { name: 'Environmental Club', type: 'Advocacy', icon: Globe },
  { name: 'Red Cross Youth', type: 'Service', icon: Heart },
  { name: 'Rotaract Club', type: 'Service', icon: Heart },
  { name: 'University Athletes Association', type: 'Sports', icon: Trophy },
  { name: 'Chess Club', type: 'Sports', icon: Trophy },
  { name: 'E-Sports Organization', type: 'Sports', icon: Trophy },
  { name: 'Campus Ministry', type: 'Religious', icon: Heart },
]

// Fraternities and Sororities
const fraternities = [
  { name: 'Alpha Sigma Phi', type: 'Fraternity', founded: '1985' },
  { name: 'Beta Kappa Sigma', type: 'Fraternity', founded: '1990' },
  { name: 'Gamma Delta Epsilon', type: 'Fraternity', founded: '1988' },
  { name: 'Delta Sigma Pi', type: 'Fraternity', founded: '1992' },
  { name: 'Alpha Delta Sorority', type: 'Sorority', founded: '1987' },
  { name: 'Beta Gamma Sorority', type: 'Sorority', founded: '1991' },
  { name: 'Sigma Kappa Phi', type: 'Sorority', founded: '1989' },
  { name: 'Tau Gamma Rho', type: 'Co-ed', founded: '1995' },
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
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4 },
  },
}

// Expandable Section Component
function ExpandableSection({ title, icon: Icon, color, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl shadow-card overflow-hidden"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-6 flex items-center justify-between bg-gradient-to-r ${color} text-white`}
      >
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Icon className="w-6 h-6" />
          </div>
          <h2 className="font-display text-xl font-bold">{title}</h2>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function OrgChart() {
  return (
    <main>
      <PageHeader
        badge="Organizational Structure"
        title="USG Organizational Chart"
        subtitle="Meet the leaders and organizations that serve the student body"
      />

      <section className="bg-school-grey-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Navigation & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <Link 
              to="/governance"
              className="inline-flex items-center text-school-grey-600 hover:text-university-red transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Governance Hub
            </Link>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary inline-flex items-center"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Full Chart
            </motion.button>
          </div>

          {/* USG Logo Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <img 
              src={USGLogo} 
              alt="USG Logo" 
              className="w-32 h-32 object-contain mx-auto mb-4"
            />
            <h2 className="font-display text-2xl font-bold text-school-grey-800">
              University Student Government
            </h2>
            <p className="text-school-grey-600">A.Y. 2024-2025</p>
          </motion.div>

          <div className="space-y-6">
            {/* Executive Branch */}
            <ExpandableSection 
              title={executiveBranch.title} 
              icon={executiveBranch.icon}
              color={executiveBranch.color}
              defaultOpen={true}
            >
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {executiveBranch.members.map((member, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ y: -4 }}
                    className="bg-school-grey-50 rounded-xl p-4 text-center group cursor-pointer hover:bg-university-red-50 transition-colors"
                  >
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-20 h-20 rounded-full mx-auto mb-3 object-cover border-4 border-white shadow-md group-hover:border-university-red transition-colors"
                    />
                    <h3 className="font-semibold text-school-grey-800 text-sm">
                      {member.name}
                    </h3>
                    <p className="text-xs mt-1 font-medium text-university-red">
                      {member.position}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </ExpandableSection>

            {/* Legislative Branch */}
            <ExpandableSection 
              title={legislativeBranch.title} 
              icon={legislativeBranch.icon}
              color={legislativeBranch.color}
              defaultOpen={true}
            >
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {legislativeBranch.members.map((member, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ y: -4 }}
                    className="bg-school-grey-50 rounded-xl p-4 text-center group cursor-pointer hover:bg-blue-50 transition-colors"
                  >
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-20 h-20 rounded-full mx-auto mb-3 object-cover border-4 border-white shadow-md group-hover:border-blue-500 transition-colors"
                    />
                    <h3 className="font-semibold text-school-grey-800 text-sm">
                      {member.name}
                    </h3>
                    <p className="text-xs mt-1 font-medium text-blue-600">
                      {member.position}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </ExpandableSection>

            {/* Council Departments */}
            <ExpandableSection 
              title="Council Departments & Committees" 
              icon={Briefcase}
              color="from-emerald-500 to-emerald-600"
            >
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {councilDepartments.map((dept, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-school-grey-50 rounded-xl p-4 flex items-start space-x-3 hover:shadow-md transition-shadow"
                  >
                    <div className={`w-12 h-12 ${dept.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <dept.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-school-grey-800">{dept.name}</h4>
                      <p className="text-sm text-school-grey-600">{dept.description}</p>
                      <p className="text-xs text-university-red mt-1">Chair: {dept.head}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ExpandableSection>

            {/* College Student Councils */}
            <ExpandableSection 
              title="College Student Councils" 
              icon={GraduationCap}
              color="from-purple-500 to-purple-600"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {collegeCouncils.map((council, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    className="bg-school-grey-50 rounded-xl p-4 text-center hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className={`w-12 h-12 ${council.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                      <span className="text-white font-bold text-xs">{council.name.split('-')[0]}</span>
                    </div>
                    <h4 className="font-semibold text-school-grey-800 text-sm">{council.name}</h4>
                    <p className="text-xs text-school-grey-500 mt-1 line-clamp-2">{council.fullName}</p>
                  </motion.div>
                ))}
              </div>
            </ExpandableSection>

            {/* Academic Organizations (FSOs) */}
            <ExpandableSection 
              title="Federated Student Organizations (Academic)" 
              icon={BookOpen}
              color="from-orange-500 to-orange-600"
            >
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {academicOrgs.map((org, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center space-x-3 p-3 bg-school-grey-50 rounded-lg hover:bg-orange-50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-orange-600 font-bold text-xs">{org.abbrev}</span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-medium text-school-grey-800 text-sm truncate">{org.name}</h4>
                      <p className="text-xs text-school-grey-500">{org.college}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ExpandableSection>

            {/* Non-Academic Organizations */}
            <ExpandableSection 
              title="Non-Academic Organizations" 
              icon={Palette}
              color="from-pink-500 to-pink-600"
            >
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {nonAcademicOrgs.map((org, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center space-x-3 p-3 bg-school-grey-50 rounded-lg hover:bg-pink-50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <org.icon className="w-5 h-5 text-pink-600" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-medium text-school-grey-800 text-sm truncate">{org.name}</h4>
                      <p className="text-xs text-school-grey-500">{org.type}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ExpandableSection>

            {/* Fraternities & Sororities */}
            <ExpandableSection 
              title="Fraternities & Sororities" 
              icon={Users}
              color="from-indigo-500 to-indigo-600"
            >
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {fraternities.map((frat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -4 }}
                    className="bg-school-grey-50 rounded-xl p-4 text-center hover:shadow-md transition-all"
                  >
                    <div className={`w-14 h-14 ${
                      frat.type === 'Fraternity' ? 'bg-indigo-500' : 
                      frat.type === 'Sorority' ? 'bg-pink-500' : 'bg-purple-500'
                    } rounded-full flex items-center justify-center mx-auto mb-3`}>
                      <Users className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="font-semibold text-school-grey-800 text-sm">{frat.name}</h4>
                    <p className="text-xs text-school-grey-500 mt-1">{frat.type}</p>
                    <p className="text-xs text-university-red">Est. {frat.founded}</p>
                  </motion.div>
                ))}
              </div>
            </ExpandableSection>
          </div>

          {/* Legend */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 bg-white rounded-xl p-6 shadow-card"
          >
            <h3 className="font-display font-semibold text-lg text-school-grey-800 mb-4">
              Organization Hierarchy
            </h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gradient-to-r from-university-red to-university-red-700 rounded" />
                <span className="text-sm text-school-grey-700">Executive Branch</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded" />
                <span className="text-sm text-school-grey-700">Legislative Branch</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded" />
                <span className="text-sm text-school-grey-700">College Councils</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded" />
                <span className="text-sm text-school-grey-700">Academic FSOs</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gradient-to-r from-pink-500 to-pink-600 rounded" />
                <span className="text-sm text-school-grey-700">Non-Academic Orgs</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded" />
                <span className="text-sm text-school-grey-700">Greek Organizations</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
