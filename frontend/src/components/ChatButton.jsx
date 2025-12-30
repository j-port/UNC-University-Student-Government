import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MessageCircle, X, Send, Phone, Mail, HelpCircle } from 'lucide-react'

export default function ChatButton() {
  const [isOpen, setIsOpen] = useState(false)

  const quickLinks = [
    { icon: MessageCircle, label: 'Submit Feedback', path: '/feedback', color: 'bg-university-red' },
    { icon: HelpCircle, label: 'FAQs', path: '/faqs', color: 'bg-blue-500' },
    { icon: Phone, label: 'Contact Us', path: '/feedback', color: 'bg-green-500' },
    { icon: Mail, label: 'Email USG', href: 'mailto:usg@university.edu', color: 'bg-purple-500' },
  ]

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Quick Links Panel */}
      <motion.div
        initial={false}
        animate={isOpen ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 20 }}
        className={`absolute bottom-20 right-0 w-72 bg-white rounded-2xl shadow-card-hover overflow-hidden ${
          isOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-university-red p-4 text-white">
          <h3 className="font-display font-semibold text-lg">TINIG DINIG</h3>
          <p className="text-sm text-white/80">How can we help you today?</p>
        </div>

        {/* Quick Links */}
        <div className="p-4 space-y-2">
          {quickLinks.map((link, index) => {
            const Component = link.path ? Link : 'a'
            const props = link.path 
              ? { to: link.path } 
              : { href: link.href, target: '_blank', rel: 'noopener noreferrer' }
            
            return (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, x: 20 }}
                animate={isOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                transition={{ delay: isOpen ? index * 0.1 : 0 }}
              >
                <Component
                  {...props}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-school-grey-50 transition-colors group"
                >
                  <div className={`w-10 h-10 ${link.color} rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                    <link.icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-school-grey-700">{link.label}</span>
                </Component>
              </motion.div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="bg-school-grey-50 p-4 border-t border-school-grey-100">
          <p className="text-xs text-school-grey-500 text-center">
            Your voice matters! We typically respond within 24 hours.
          </p>
        </div>
      </motion.div>

      {/* Main Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          isOpen 
            ? 'bg-school-grey-800 rotate-0' 
            : 'bg-university-red hover:bg-university-red-700'
        }`}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? (
            <X className="w-7 h-7 text-white" />
          ) : (
            <MessageCircle className="w-7 h-7 text-white" />
          )}
        </motion.div>
      </motion.button>

      {/* Pulse Animation */}
      {!isOpen && (
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 w-16 h-16 rounded-full bg-university-red opacity-30 -z-10"
        />
      )}
    </div>
  )
}
