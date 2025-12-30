import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown } from 'lucide-react'
import USGLogo from '../assets/USG LOGO NO BG.png'

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { 
    name: 'Governance', 
    path: '/governance',
    submenu: [
      { name: 'Constitution', path: '/governance/constitution' },
      { name: 'By-Laws', path: '/governance/bylaws' },
      { name: 'Organizational Chart', path: '/governance/org-chart' },
    ]
  },
  { 
    name: 'Bulletins', 
    path: '/bulletins',
    submenu: [
      { name: 'Announcements', path: '/bulletins/announcements' },
      { name: 'Issuances & Reports', path: '/bulletins/issuances' },
    ]
  },
  { name: 'Transparency', path: '/transparency' },
  { name: 'TINIG DINIG', path: '/feedback', highlight: true },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
    setActiveDropdown(null)
  }, [location])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white shadow-lg' 
          : isHomePage 
            ? 'bg-gradient-to-b from-black/60 to-transparent' 
            : 'bg-white shadow-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 3 }}
              className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center p-1 ${
                scrolled || !isHomePage ? 'bg-white shadow-md' : 'bg-white/20 backdrop-blur-sm'
              }`}
            >
              <img src={USGLogo} alt="USG Logo" className="w-full h-full object-contain" />
            </motion.div>
            <div className="hidden md:block">
              <h1 className={`font-display font-bold text-sm lg:text-base transition-colors ${
                scrolled || !isHomePage ? 'text-school-grey-800' : 'text-white'
              }`}>
                University Student Government
              </h1>
              <p className={`text-xs transition-colors ${
                scrolled || !isHomePage ? 'text-school-grey-500' : 'text-white/70'
              }`}>University of Nueva Caceres</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <div 
                key={item.name}
                className="relative"
                onMouseEnter={() => item.submenu && setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {item.highlight ? (
                  <Link
                    to={item.path}
                    className="ml-2 px-4 py-2 bg-university-red text-white rounded-full font-medium text-sm hover:bg-university-red-600 transition-all shadow-md hover:shadow-lg"
                  >
                    {item.name}
                  </Link>
                ) : (
                <Link
                  to={item.path}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-1 transition-all duration-200 ${
                    location.pathname === item.path || location.pathname.startsWith(item.path + '/')
                      ? 'text-university-red bg-university-red-50/80'
                      : scrolled || !isHomePage 
                        ? 'text-school-grey-700 hover:text-university-red hover:bg-school-grey-50'
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="font-medium">{item.name}</span>
                  {item.submenu && <ChevronDown className="w-4 h-4" />}
                </Link>
                )}

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {item.submenu && activeDropdown === item.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-card-hover border border-school-grey-100 py-2 overflow-hidden"
                    >
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.path}
                          className="block px-4 py-2.5 text-school-grey-700 hover:text-university-red hover:bg-school-grey-50 transition-colors"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              scrolled || !isHomePage 
                ? 'text-school-grey-700 hover:bg-school-grey-100'
                : 'text-white hover:bg-white/20'
            }`}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white border-t border-school-grey-100 overflow-hidden shadow-lg"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 rounded-lg font-medium ${
                      item.highlight 
                        ? 'text-university-red bg-university-red-50 border border-university-red/20'
                        : location.pathname === item.path
                          ? 'text-university-red bg-university-red-50'
                          : 'text-school-grey-700 hover:bg-school-grey-50'
                    }`}
                  >
                    {item.name}
                  </Link>
                  {item.submenu && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.path}
                          onClick={() => setIsOpen(false)}
                          className="block px-4 py-2 text-sm text-school-grey-600 hover:text-university-red"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
