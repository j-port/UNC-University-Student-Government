import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Mail, 
  MapPin, 
  Phone,
  Heart
} from 'lucide-react'
import USGLogo from '../assets/USG LOGO NO BG.png'

const footerLinks = {
  quickLinks: [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Governance Hub', path: '/governance' },
    { name: 'Bulletins', path: '/bulletins' },
    { name: 'Transparency Portal', path: '/transparency' },
  ],
  resources: [
    { name: 'Constitution', path: '/governance/constitution' },
    { name: 'By-Laws', path: '/governance/bylaws' },
    { name: 'Organizational Chart', path: '/governance/org-chart' },
    { name: 'Issuances & Reports', path: '/bulletins/issuances' },
  ],
  connect: [
    { name: 'TINIG DINIG', path: '/feedback' },
    { name: 'Contact Us', path: '/feedback' },
    { name: 'FAQs', path: '/faqs' },
  ]
}

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com/UNCUSG', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Mail, href: 'mailto:usg@unc.edu.ph', label: 'Email' },
]

export default function Footer() {
  return (
    <footer className="bg-school-grey-800 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center space-x-3 mb-6"
            >
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center p-1">
                <img src={USGLogo} alt="USG Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg">USG</h3>
                <p className="text-xs text-school-grey-400">University Student Government</p>
              </div>
            </motion.div>
            <p className="text-school-grey-400 text-sm mb-6">
              Designing Spaces for a Better Future. Your voice matters in shaping our university community.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-school-grey-700 rounded-lg flex items-center justify-center hover:bg-university-red transition-colors duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path}
                    className="text-school-grey-400 hover:text-university-red transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path}
                    className="text-school-grey-400 hover:text-university-red transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-university-red mt-0.5 flex-shrink-0" />
                <span className="text-school-grey-400 text-sm">
                  Student Center Building, 2nd Floor<br />
                  University Campus
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-university-red flex-shrink-0" />
                <span className="text-school-grey-400 text-sm">(123) 456-7890</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-university-red flex-shrink-0" />
                <a 
                  href="mailto:usg@university.edu"
                  className="text-school-grey-400 text-sm hover:text-university-red transition-colors"
                >
                  usg@university.edu
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-school-grey-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-school-grey-400 text-sm">
              © {new Date().getFullYear()} University Student Government. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <p className="text-school-grey-400 text-sm flex items-center">
                Made with <Heart className="w-4 h-4 text-university-red mx-1" /> for the students
              </p>
              <span className="text-school-grey-600">|</span>
              <Link 
                to="/admin/login" 
                className="text-school-grey-600 text-xs hover:text-school-grey-400 transition-colors"
              >
                Staff
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
