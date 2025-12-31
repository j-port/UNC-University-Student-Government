import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageHeader from '../components/PageHeader'
import { submitFeedback } from '../api'
import { supabase } from '../lib/supabaseClient'
import { 
  Send, 
  User, 
  Mail, 
  Phone,
  MapPin,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Building,
  FileText,
  Shield,
  Search,
  Clock,
  Eye,
  MessageSquare
} from 'lucide-react'

const colleges = [
  'College of Arts and Sciences',
  'College of Business and Accountancy',
  'College of Computer Studies',
  'College of Criminal Justice Education',
  'College of Education',
  'College of Engineering and Architecture',
  'College of Law',
  'College of Nursing',
  'Graduate School',
]

const categories = [
  { value: 'academic', label: 'Academic Concerns' },
  { value: 'facilities', label: 'Facilities & Infrastructure' },
  { value: 'student-services', label: 'Student Services' },
  { value: 'events', label: 'Events & Activities' },
  { value: 'policy', label: 'Policy & Governance' },
  { value: 'financial', label: 'Financial Matters' },
  { value: 'safety', label: 'Safety & Security' },
  { value: 'suggestion', label: 'Suggestions & Ideas' },
  { value: 'compliment', label: 'Compliments & Recognition' },
  { value: 'other', label: 'Other Concerns' },
]

const contactInfo = [
  { icon: Mail, label: 'Email', value: 'usg@unc.edu.ph' },
  { icon: Phone, label: 'Phone', value: '(054) 123-4567' },
  { icon: MapPin, label: 'Office', value: 'USG Office, Student Center, UNC Main Campus' },
]

const officeHours = [
  { day: 'Monday - Friday', time: '8:00 AM - 5:00 PM' },
  { day: 'Saturday', time: '9:00 AM - 12:00 PM' },
  { day: 'Sunday', time: 'Closed' },
]

const processSteps = [
  { 
    number: '1', 
    title: 'Immediate Acknowledgment', 
    description: "You'll receive a confirmation with a reference number" 
  },
  { 
    number: '2', 
    title: 'Review & Assessment', 
    description: "We'll review your concern within 24 hours" 
  },
  { 
    number: '3', 
    title: 'Response & Action', 
    description: "You'll get a response within 2-3 business days" 
  },
]

export default function Feedback() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    studentId: '',
    college: '',
    category: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState({ type: '', message: '' })
  
  // Tracking state
  const [trackingNumber, setTrackingNumber] = useState('')
  const [trackingLoading, setTrackingLoading] = useState(false)
  const [trackedFeedback, setTrackedFeedback] = useState(null)
  const [trackingError, setTrackingError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleTrackFeedback = async (e) => {
    e.preventDefault()
    setTrackingLoading(true)
    setTrackingError('')
    setTrackedFeedback(null)

    try {
      const refNumber = trackingNumber.trim()
      
      // Query feedback by reference number
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .eq('reference_number', refNumber)
        .single()

      if (error) {
        // Fallback: try extracting ID from old format if reference_number field doesn't exist yet
        const parts = refNumber.split('-')
        if (parts.length === 3 && parts[0] === 'TNG') {
          const feedbackId = parts[2]
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('feedback')
            .select('*')
            .eq('id', feedbackId)
            .single()
          
          if (fallbackError) throw new Error('Feedback not found. Please check your reference number.')
          setTrackedFeedback(fallbackData)
          return
        }
        throw error
      }

      if (!data) {
        throw new Error('Feedback not found. Please check your reference number.')
      }

      setTrackedFeedback(data)
    } catch (error) {
      console.error('Tracking error:', error)
      setTrackingError(error.message || 'Failed to track feedback. Please check your reference number.')
    } finally {
      setTrackingLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' }
      case 'in_progress': return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' }
      case 'responded': return { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' }
      case 'resolved': return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' }
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' }
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return Clock
      case 'in_progress': return Eye
      case 'responded': return MessageSquare
      case 'resolved': return CheckCircle
      default: return AlertCircle
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus({ type: '', message: '' })

    try {
      // Generate reference number first
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
      const tempId = Date.now().toString().slice(-6) // Temporary ID for reference generation
      
      const { data, error } = await submitFeedback({
        name: formData.fullName,
        email: formData.email,
        student_id: formData.studentId,
        college: formData.college,
        category: formData.category,
        subject: formData.subject,
        message: formData.message,
        status: 'pending',
        is_anonymous: false,
        created_at: new Date().toISOString(),
      })

      if (error) {
        console.error('Submission error:', error)
        throw error
      }

      // Generate reference number with actual database ID
      const feedbackId = data && data[0] ? data[0].id : tempId
      const referenceNumber = `TNG-${dateStr}-${feedbackId}`

      // Update the record with the reference number
      if (data && data[0]) {
        await supabase
          .from('feedback')
          .update({ reference_number: referenceNumber })
          .eq('id', data[0].id)
      }

      setStatus({
        type: 'success',
        message: `Thank you for your feedback! Your reference number is ${referenceNumber}. We will review it and get back to you within 2-3 business days.`,
      })
      setFormData({
        fullName: '',
        email: '',
        studentId: '',
        college: '',
        category: '',
        subject: '',
        message: '',
      })
    } catch (error) {
      console.error('Error submitting feedback:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      setStatus({
        type: 'error',
        message: `Failed to submit feedback: ${error.message || 'Unknown error'}. Please try again or contact us directly at usg@unc.edu.ph`,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <PageHeader
        badge="TINIG DINIG"
        title="Submit Your Concern or Feedback"
        subtitle="TINIG DINIG is the official communication channel between the USG and the student body. We guarantee a response within 2-3 business days."
      />

      {/* Track Feedback Section */}
      <section className="bg-university-red-50 py-8 border-b border-university-red-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-school-grey-800 mb-2">Track Your Feedback</h2>
              <p className="text-school-grey-600">Enter your reference number to check the status of your submission</p>
            </div>

            <form onSubmit={handleTrackFeedback} className="bg-white rounded-2xl shadow-sm p-6 border border-school-grey-200">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-school-grey-400" />
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter reference number (e.g., TNG-20251231-42)"
                    className="w-full pl-12 pr-4 py-3 bg-school-grey-50 border border-school-grey-200 rounded-xl focus:ring-2 focus:ring-university-red/20 focus:border-university-red transition-all"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={trackingLoading}
                  className="px-6 py-3 bg-university-red text-white rounded-xl hover:bg-university-red-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {trackingLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      <span>Track</span>
                    </>
                  )}
                </button>
              </div>

              {/* Tracking Error */}
              {trackingError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-red-50 text-red-800 border border-red-200 rounded-xl flex items-start space-x-2"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{trackingError}</p>
                </motion.div>
              )}

              {/* Tracked Feedback Display */}
              <AnimatePresence>
                {trackedFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-6 pt-6 border-t border-school-grey-200 space-y-4"
                  >
                    {/* Status Badge */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-school-grey-800 mb-1">Feedback Status</h3>
                        <p className="text-sm text-school-grey-500">Submitted on {formatDate(trackedFeedback.created_at)}</p>
                      </div>
                      {(() => {
                        const colors = getStatusColor(trackedFeedback.status)
                        const StatusIcon = getStatusIcon(trackedFeedback.status)
                        return (
                          <span className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium border ${colors.bg} ${colors.text} ${colors.border}`}>
                            <StatusIcon className="w-4 h-4" />
                            <span>{trackedFeedback.status.charAt(0).toUpperCase() + trackedFeedback.status.slice(1).replace('_', ' ')}</span>
                          </span>
                        )
                      })()}
                    </div>

                    {/* Subject and Category */}
                    <div>
                      <h4 className="font-semibold text-school-grey-800 mb-1">{trackedFeedback.subject}</h4>
                      <span className="inline-block px-3 py-1 bg-school-grey-100 text-school-grey-700 rounded-full text-sm">
                        {trackedFeedback.category}
                      </span>
                    </div>

                    {/* Message */}
                    <div className="bg-school-grey-50 rounded-xl p-4">
                      <p className="text-sm text-school-grey-700 leading-relaxed">{trackedFeedback.message}</p>
                    </div>

                    {/* Status Updates */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <h5 className="font-semibold text-blue-900 mb-2 flex items-center space-x-2">
                        <MessageSquare className="w-4 h-4" />
                        <span>Status Updates</span>
                      </h5>
                      <div className="space-y-2 text-sm text-blue-800">
                        {trackedFeedback.status === 'pending' && (
                          <p>⏳ Your feedback is waiting to be reviewed by our team.</p>
                        )}
                        {trackedFeedback.status === 'in_progress' && (
                          <p>👀 Your feedback is currently being reviewed and addressed.</p>
                        )}
                        {trackedFeedback.status === 'responded' && (
                          <p>✉️ We have responded to your feedback. Please check the response below.</p>
                        )}
                        {trackedFeedback.status === 'resolved' && (
                          <p>✅ Your feedback has been resolved. Thank you for your input!</p>
                        )}
                      </div>
                    </div>

                    {/* Admin Response */}
                    {trackedFeedback.response && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-50 border border-green-200 rounded-xl p-4"
                      >
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="w-8 h-8 bg-university-red rounded-full flex items-center justify-center">
                            <MessageSquare className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h5 className="font-semibold text-green-900">Response from USG Admin</h5>
                            <p className="text-xs text-green-700">Official response to your feedback</p>
                          </div>
                        </div>
                        <div className="bg-white border border-green-300 rounded-lg p-3">
                          <p className="text-sm text-school-grey-700 leading-relaxed whitespace-pre-wrap">{trackedFeedback.response}</p>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </div>
      </section>

      <section className="bg-school-grey-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2"
            >
              <div className="card">
                {/* Status Message */}
                {status.message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-6 p-4 rounded-xl flex items-start space-x-3 ${
                      status.type === 'success'
                        ? 'bg-green-50 text-green-800 border border-green-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    {status.type === 'success' ? (
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    )}
                    <p className="text-sm">{status.message}</p>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Row 1: Name and Email */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-school-grey-700 mb-2">
                        Full Name <span className="text-university-red">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-school-grey-400" />
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="Juan Dela Cruz"
                          className="input-field pl-12"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-school-grey-700 mb-2">
                        Email Address <span className="text-university-red">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-school-grey-400" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="jdelacruz@unc.edu.ph"
                          className="input-field pl-12"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Student ID and College */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="studentId" className="block text-sm font-medium text-school-grey-700 mb-2">
                        Student ID <span className="text-university-red">*</span>
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-school-grey-400" />
                        <input
                          type="text"
                          id="studentId"
                          name="studentId"
                          value={formData.studentId}
                          onChange={handleChange}
                          placeholder="25-00000"
                          className="input-field pl-12"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="college" className="block text-sm font-medium text-school-grey-700 mb-2">
                        College/Department <span className="text-university-red">*</span>
                      </label>
                      <div className="relative">
                        <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-school-grey-400 z-10" />
                        <select
                          id="college"
                          name="college"
                          value={formData.college}
                          onChange={handleChange}
                          className="input-field pl-12 appearance-none cursor-pointer"
                          required
                        >
                          <option value="">Select your college</option>
                          {colleges.map((college) => (
                            <option key={college} value={college}>{college}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Category */}
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-school-grey-700 mb-2">
                      Category <span className="text-university-red">*</span>
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-school-grey-400 z-10" />
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="input-field pl-12 appearance-none cursor-pointer"
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Row 4: Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-school-grey-700 mb-2">
                      Subject <span className="text-university-red">*</span>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Brief subject of your concern"
                      className="input-field"
                      required
                    />
                  </div>

                  {/* Row 5: Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-school-grey-700 mb-2">
                      Message <span className="text-university-red">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      placeholder="Please provide detailed information about your concern or feedback..."
                      className="input-field resize-none"
                      required
                    />
                  </div>

                  {/* Privacy Notice */}
                  <div className="bg-school-grey-50 rounded-xl p-4 border border-school-grey-200">
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-school-grey-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-school-grey-800 text-sm">Privacy Notice</h4>
                        <p className="text-xs text-school-grey-600 mt-1">
                          Your information will be kept confidential and used solely for addressing your concern. 
                          We are committed to protecting your privacy while ensuring transparency in our processes.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className="w-full bg-university-red hover:bg-university-red-700 text-white py-4 rounded-xl font-semibold 
                             flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Submit Your Message
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* What to Expect */}
              <div className="card border-t-4 border-university-red">
                <h3 className="font-display font-semibold text-xl text-university-red mb-6">
                  What to Expect
                </h3>
                <div className="space-y-6">
                  {processSteps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-university-red rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {step.number}
                      </div>
                      <div>
                        <h4 className="font-semibold text-school-grey-800">{step.title}</h4>
                        <p className="text-sm text-school-grey-600">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Other Ways to Reach Us */}
              <div className="card">
                <h3 className="font-display font-semibold text-xl text-school-grey-800 mb-6">
                  Other Ways to Reach Us
                </h3>
                <div className="space-y-4">
                  {contactInfo.map((info) => (
                    <div key={info.label} className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-university-red-50 rounded-full flex items-center justify-center flex-shrink-0">
                        <info.icon className="w-5 h-5 text-university-red" />
                      </div>
                      <div>
                        <p className="text-sm text-school-grey-500">{info.label}</p>
                        <p className="font-medium text-school-grey-800">{info.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Office Hours */}
              <div className="bg-university-red rounded-2xl p-6 text-white">
                <h3 className="font-display font-semibold text-xl mb-4">
                  Office Hours
                </h3>
                <div className="space-y-3">
                  {officeHours.map((schedule, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-white/80">{schedule.day}</span>
                      <span className="font-medium">{schedule.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  )
}
