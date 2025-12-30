import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Upload, 
  FileText, 
  Download, 
  Trash2, 
  Eye,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown
} from 'lucide-react'

const reportsData = [
  {
    id: 1,
    title: 'Q4 2024 Financial Report',
    type: 'Financial',
    date: '2024-12-30',
    size: '2.4 MB',
    status: 'published',
  },
  {
    id: 2,
    title: 'Student Activity Fund Utilization - December',
    type: 'Expense',
    date: '2024-12-28',
    size: '1.2 MB',
    status: 'published',
  },
  {
    id: 3,
    title: 'Annual Budget Report 2024',
    type: 'Budget',
    date: '2024-12-15',
    size: '5.8 MB',
    status: 'published',
  },
]

const summaryData = {
  totalBudget: '₱500,000.00',
  spent: '₱325,450.00',
  remaining: '₱174,550.00',
  utilizationRate: '65%',
}

export default function AdminReports() {
  const [reports, setReports] = useState(reportsData)
  const [showUpload, setShowUpload] = useState(false)

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this report?')) {
      setReports(reports.filter(r => r.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-school-grey-800">Financial Reports</h1>
          <p className="text-school-grey-500">Upload and manage financial transparency documents</p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-university-red text-white rounded-xl hover:bg-university-red-600 transition-colors shadow-lg shadow-university-red/30"
        >
          <Upload className="w-5 h-5" />
          <span>Upload Report</span>
        </button>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 border border-school-grey-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-school-grey-500 mb-1">Total Budget</p>
          <p className="text-2xl font-bold text-school-grey-800">{summaryData.totalBudget}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-school-grey-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-sm text-school-grey-500 mb-1">Total Spent</p>
          <p className="text-2xl font-bold text-school-grey-800">{summaryData.spent}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-school-grey-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-school-grey-500 mb-1">Remaining</p>
          <p className="text-2xl font-bold text-school-grey-800">{summaryData.remaining}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-school-grey-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-school-grey-500 mb-1">Utilization</p>
          <p className="text-2xl font-bold text-school-grey-800">{summaryData.utilizationRate}</p>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-2xl border border-school-grey-100 overflow-hidden">
        <div className="p-6 border-b border-school-grey-100">
          <h2 className="text-lg font-bold text-school-grey-800">Uploaded Reports</h2>
        </div>

        <div className="divide-y divide-school-grey-100">
          {reports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 hover:bg-school-grey-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-university-red/10 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-university-red" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-school-grey-800">{report.title}</h3>
                    <div className="flex items-center space-x-3 text-sm text-school-grey-500">
                      <span className="px-2 py-0.5 bg-school-grey-100 rounded-full">{report.type}</span>
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {report.date}
                      </span>
                      <span>{report.size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-school-grey-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-school-grey-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(report.id)}
                    className="p-2 text-school-grey-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl max-w-md w-full p-6"
          >
            <h2 className="text-xl font-bold text-school-grey-800 mb-6">Upload Report</h2>
            
            <div className="border-2 border-dashed border-school-grey-200 rounded-xl p-8 text-center mb-6">
              <Upload className="w-12 h-12 text-school-grey-400 mx-auto mb-4" />
              <p className="text-school-grey-600 mb-2">Drag and drop your file here</p>
              <p className="text-sm text-school-grey-400">or click to browse</p>
              <input type="file" className="hidden" />
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-school-grey-700 mb-2">Report Title</label>
                <input
                  type="text"
                  placeholder="Enter report title"
                  className="w-full px-4 py-3 bg-school-grey-50 border border-school-grey-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-school-grey-700 mb-2">Type</label>
                <select className="w-full px-4 py-3 bg-school-grey-50 border border-school-grey-200 rounded-xl">
                  <option>Financial</option>
                  <option>Budget</option>
                  <option>Expense</option>
                  <option>Annual</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowUpload(false)}
                className="px-6 py-3 bg-school-grey-100 text-school-grey-700 rounded-xl hover:bg-school-grey-200"
              >
                Cancel
              </button>
              <button className="px-6 py-3 bg-university-red text-white rounded-xl hover:bg-university-red-600">
                Upload
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
