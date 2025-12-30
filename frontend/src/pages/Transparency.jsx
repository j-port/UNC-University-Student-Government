import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import PageHeader from '../components/PageHeader'
import LoadingSpinner from '../components/LoadingSpinner'
import { fetchFinancialTransactions } from '../lib/supabaseClient'
import { 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

// Sample data (used when Supabase data is not available)
const sampleTransactions = [
  {
    id: 1,
    date: '2024-12-15',
    description: 'Office Supplies Purchase',
    category: 'Administrative',
    amount: -2500,
    reference_no: 'TXN-2024-001',
    status: 'Completed',
  },
  {
    id: 2,
    date: '2024-12-12',
    description: 'General Assembly Event Expenses',
    category: 'Events',
    amount: -15000,
    reference_no: 'TXN-2024-002',
    status: 'Completed',
  },
  {
    id: 3,
    date: '2024-12-10',
    description: 'Student Fee Collection - December',
    category: 'Income',
    amount: 250000,
    reference_no: 'TXN-2024-003',
    status: 'Completed',
  },
  {
    id: 4,
    date: '2024-12-08',
    description: 'Mental Health Week Materials',
    category: 'Student Welfare',
    amount: -8500,
    reference_no: 'TXN-2024-004',
    status: 'Completed',
  },
  {
    id: 5,
    date: '2024-12-05',
    description: 'Scholarship Fund Allocation',
    category: 'Scholarships',
    amount: -50000,
    reference_no: 'TXN-2024-005',
    status: 'Pending',
  },
  {
    id: 6,
    date: '2024-12-01',
    description: 'Organization Grants Disbursement',
    category: 'Grants',
    amount: -35000,
    reference_no: 'TXN-2024-006',
    status: 'Completed',
  },
  {
    id: 7,
    date: '2024-11-28',
    description: 'Sports Equipment Purchase',
    category: 'Athletics',
    amount: -12000,
    reference_no: 'TXN-2024-007',
    status: 'Completed',
  },
  {
    id: 8,
    date: '2024-11-25',
    description: 'University Partnership Fund',
    category: 'Income',
    amount: 75000,
    reference_no: 'TXN-2024-008',
    status: 'Completed',
  },
]

const categories = ['All', 'Administrative', 'Events', 'Income', 'Student Welfare', 'Scholarships', 'Grants', 'Athletics']

export default function Transparency() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    const loadTransactions = async () => {
      setLoading(true)
      const { data, error } = await fetchFinancialTransactions(searchTerm)
      
      // Use sample data if no data from Supabase
      setTransactions(data?.length ? data : sampleTransactions)
      setLoading(false)
    }

    const debounce = setTimeout(loadTransactions, 300)
    return () => clearTimeout(debounce)
  }, [searchTerm])

  // Filter transactions
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.reference_no?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Calculate summary
  const totalIncome = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0)
  const balance = totalIncome - totalExpenses

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(Math.abs(amount))
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <main>
      <PageHeader
        badge="Accountability"
        title="Transparency Portal"
        subtitle="View how your student fees are being managed and utilized for the benefit of the student body"
      />

      <section className="bg-school-grey-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Summary Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card bg-gradient-to-br from-green-500 to-green-600 text-white"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Total Income</p>
                  <p className="text-2xl font-bold mt-1">{formatCurrency(totalIncome)}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card bg-gradient-to-br from-red-500 to-red-600 text-white"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">Total Expenses</p>
                  <p className="text-2xl font-bold mt-1">{formatCurrency(totalExpenses)}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <TrendingDown className="w-6 h-6" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Current Balance</p>
                  <p className="text-2xl font-bold mt-1">{formatCurrency(balance)}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-card p-6 mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-school-grey-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-12"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-school-grey-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input-field pl-12 pr-10 appearance-none cursor-pointer min-w-[200px]"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Export Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary flex items-center justify-center"
              >
                <Download className="w-5 h-5 mr-2" />
                Export
              </motion.button>
            </div>
          </motion.div>

          {/* Transactions Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-card overflow-hidden"
          >
            {loading ? (
              <LoadingSpinner message="Loading transactions..." />
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-school-grey-50 border-b border-school-grey-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-school-grey-700">Date</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-school-grey-700">Reference</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-school-grey-700">Description</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-school-grey-700">Category</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-school-grey-700">Amount</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-school-grey-700">Status</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-school-grey-700">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-school-grey-100">
                      {paginatedTransactions.map((transaction, index) => (
                        <motion.tr
                          key={transaction.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-school-grey-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-school-grey-600">
                              <Calendar className="w-4 h-4 mr-2 text-school-grey-400" />
                              {formatDate(transaction.date)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-mono text-school-grey-600">
                              {transaction.reference_no}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-school-grey-800">
                              {transaction.description}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-3 py-1 bg-school-grey-100 text-school-grey-700 text-xs font-medium rounded-full">
                              {transaction.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <span className={`text-sm font-semibold ${
                              transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.amount > 0 ? '+' : '-'}{formatCurrency(transaction.amount)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                              transaction.status === 'Completed'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {transaction.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 text-school-grey-400 hover:text-university-red transition-colors"
                            >
                              <Eye className="w-5 h-5" />
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-6 py-4 border-t border-school-grey-200">
                    <p className="text-sm text-school-grey-600">
                      Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
                    </p>
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-school-grey-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-school-grey-50"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </motion.button>
                      {[...Array(totalPages)].map((_, i) => (
                        <motion.button
                          key={i}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                            currentPage === i + 1
                              ? 'bg-university-red text-white'
                              : 'border border-school-grey-200 hover:bg-school-grey-50'
                          }`}
                        >
                          {i + 1}
                        </motion.button>
                      ))}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-school-grey-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-school-grey-50"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>

          {/* Disclaimer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-school-grey-500 mt-8"
          >
            All financial data is updated regularly. For inquiries, please contact the USG Finance Committee.
          </motion.p>
        </div>
      </section>
    </main>
  )
}
