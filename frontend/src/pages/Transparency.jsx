import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PageHeader from "../components/PageHeader";
import LoadingSpinner from "../components/LoadingSpinner";
import { financialTransactionsAPI, issuancesAPI } from "../lib/api";
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
    ChevronRight,
    FileText,
} from "lucide-react";

const categories = [
    "All",
    "Administrative",
    "Events",
    "Income",
    "Student Welfare",
    "Scholarships",
    "Grants",
    "Athletics",
];

export default function Transparency() {
    const [transactions, setTransactions] = useState([]);
    const [financialReports, setFinancialReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reportsLoading, setReportsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const loadTransactions = async () => {
            setLoading(true);
            const response = await financialTransactionsAPI.getAll(searchTerm);

            setTransactions(response.data || []);
            setLoading(false);
        };

        const debounce = setTimeout(loadTransactions, 300);
        return () => clearTimeout(debounce);
    }, [searchTerm]);

    useEffect(() => {
        const loadFinancialReports = async () => {
            setReportsLoading(true);
            try {
                const response = await issuancesAPI.getAll({
                    status: "published",
                });
                // Filter only Financial Report type
                const reports = (response.data || []).filter(
                    (item) => item.type === "Financial Report"
                );
                setFinancialReports(reports);
            } catch (error) {
                console.error("Error loading financial reports:", error);
            } finally {
                setReportsLoading(false);
            }
        };
        loadFinancialReports();
    }, []);

    // Filter transactions
    const filteredTransactions = transactions.filter((t) => {
        const matchesSearch =
            t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.reference_no?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
            selectedCategory === "All" || t.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Pagination
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    const paginatedTransactions = filteredTransactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Calculate summary
    const totalIncome = transactions
        .filter((t) => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
        .filter((t) => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const balance = totalIncome - totalExpenses;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
        }).format(Math.abs(amount));
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

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
                            className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm">
                                        Total Income
                                    </p>
                                    <p className="text-2xl font-bold mt-1">
                                        {formatCurrency(totalIncome)}
                                    </p>
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
                            className="card bg-gradient-to-br from-red-500 to-red-600 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-red-100 text-sm">
                                        Total Expenses
                                    </p>
                                    <p className="text-2xl font-bold mt-1">
                                        {formatCurrency(totalExpenses)}
                                    </p>
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
                            className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm">
                                        Current Balance
                                    </p>
                                    <p className="text-2xl font-bold mt-1">
                                        {formatCurrency(balance)}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                    <DollarSign className="w-6 h-6" />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                    {/* Financial Reports Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-school-grey-800">
                                Financial Reports
                            </h2>
                        </div>

                        {reportsLoading ? (
                            <div className="bg-white rounded-2xl shadow-card p-8 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-university-red mx-auto"></div>
                                <p className="mt-4 text-school-grey-600">
                                    Loading reports...
                                </p>
                            </div>
                        ) : financialReports.length === 0 ? (
                            <div className="bg-white rounded-2xl shadow-card p-8 text-center">
                                <FileText className="w-12 h-12 text-school-grey-300 mx-auto mb-3" />
                                <p className="text-school-grey-600">
                                    No financial reports available yet
                                </p>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {financialReports.map((report) => (
                                    <motion.a
                                        key={report.id}
                                        href={report.file_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ y: -4 }}
                                        className="bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all p-4 border border-school-grey-100 group">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-10 h-10 bg-university-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <FileText className="w-5 h-5 text-university-red" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-school-grey-800 group-hover:text-university-red transition-colors line-clamp-2">
                                                    {report.title}
                                                </h3>
                                                {report.description && (
                                                    <p className="text-xs text-school-grey-500 mt-1 line-clamp-2">
                                                        {report.description}
                                                    </p>
                                                )}
                                                <div className="flex items-center space-x-2 mt-2 text-xs text-school-grey-400">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>
                                                        {new Date(
                                                            report.published_at ||
                                                                report.created_at
                                                        ).toLocaleDateString(
                                                            "en-US",
                                                            {
                                                                month: "short",
                                                                year: "numeric",
                                                            }
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                            <Download className="w-4 h-4 text-school-grey-400 group-hover:text-university-red transition-colors flex-shrink-0" />
                                        </div>
                                    </motion.a>
                                ))}
                            </div>
                        )}
                    </motion.div>
                    {/* Search and Filters */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-card p-6 mb-8">
                        <div className="flex flex-col lg:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-school-grey-400" />
                                <input
                                    type="text"
                                    placeholder="Search transactions..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="input-field pl-12"
                                />
                            </div>

                            {/* Category Filter */}
                            <div className="relative">
                                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-school-grey-400" />
                                <select
                                    value={selectedCategory}
                                    onChange={(e) =>
                                        setSelectedCategory(e.target.value)
                                    }
                                    className="input-field pl-12 pr-10 appearance-none cursor-pointer min-w-[200px]">
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Export Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="btn-primary flex items-center justify-center">
                                <Download className="w-5 h-5 mr-2" />
                                Export
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Transactions Table */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-card overflow-hidden">
                        {loading ? (
                            <LoadingSpinner message="Loading transactions..." />
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-school-grey-50 border-b border-school-grey-200">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-school-grey-700">
                                                    Date
                                                </th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-school-grey-700">
                                                    Reference
                                                </th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-school-grey-700">
                                                    Description
                                                </th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-school-grey-700">
                                                    Category
                                                </th>
                                                <th className="px-6 py-4 text-right text-sm font-semibold text-school-grey-700">
                                                    Amount
                                                </th>
                                                <th className="px-6 py-4 text-center text-sm font-semibold text-school-grey-700">
                                                    Status
                                                </th>
                                                <th className="px-6 py-4 text-center text-sm font-semibold text-school-grey-700">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-school-grey-100">
                                            {paginatedTransactions.length ===
                                            0 ? (
                                                <tr>
                                                    <td
                                                        colSpan="7"
                                                        className="px-6 py-12 text-center">
                                                        <DollarSign className="w-16 h-16 text-school-grey-300 mx-auto mb-4" />
                                                        <h3 className="text-xl font-semibold text-school-grey-700 mb-2">
                                                            No Transactions Yet
                                                        </h3>
                                                        <p className="text-school-grey-500">
                                                            Financial
                                                            transactions are
                                                            currently not
                                                            available.
                                                        </p>
                                                    </td>
                                                </tr>
                                            ) : (
                                                paginatedTransactions.map(
                                                    (transaction, index) => (
                                                        <motion.tr
                                                            key={transaction.id}
                                                            initial={{
                                                                opacity: 0,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                            }}
                                                            transition={{
                                                                delay:
                                                                    index *
                                                                    0.05,
                                                            }}
                                                            className="hover:bg-school-grey-50 transition-colors">
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center text-sm text-school-grey-600">
                                                                    <Calendar className="w-4 h-4 mr-2 text-school-grey-400" />
                                                                    {formatDate(
                                                                        transaction.date
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className="text-sm font-mono text-school-grey-600">
                                                                    {
                                                                        transaction.reference_no
                                                                    }
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className="text-sm text-school-grey-800">
                                                                    {
                                                                        transaction.description
                                                                    }
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className="px-3 py-1 bg-school-grey-100 text-school-grey-700 text-xs font-medium rounded-full">
                                                                    {
                                                                        transaction.category
                                                                    }
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                                <span
                                                                    className={`text-sm font-semibold ${
                                                                        transaction.amount >
                                                                        0
                                                                            ? "text-green-600"
                                                                            : "text-red-600"
                                                                    }`}>
                                                                    {transaction.amount >
                                                                    0
                                                                        ? "+"
                                                                        : "-"}
                                                                    {formatCurrency(
                                                                        transaction.amount
                                                                    )}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                                <span
                                                                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                                                                        transaction.status ===
                                                                        "Completed"
                                                                            ? "bg-green-100 text-green-700"
                                                                            : "bg-yellow-100 text-yellow-700"
                                                                    }`}>
                                                                    {
                                                                        transaction.status
                                                                    }
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                                <motion.button
                                                                    whileHover={{
                                                                        scale: 1.1,
                                                                    }}
                                                                    whileTap={{
                                                                        scale: 0.9,
                                                                    }}
                                                                    className="p-2 text-school-grey-400 hover:text-university-red transition-colors">
                                                                    <Eye className="w-5 h-5" />
                                                                </motion.button>
                                                            </td>
                                                        </motion.tr>
                                                    )
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-between px-6 py-4 border-t border-school-grey-200">
                                        <p className="text-sm text-school-grey-600">
                                            Showing{" "}
                                            {(currentPage - 1) * itemsPerPage +
                                                1}{" "}
                                            to{" "}
                                            {Math.min(
                                                currentPage * itemsPerPage,
                                                filteredTransactions.length
                                            )}{" "}
                                            of {filteredTransactions.length}{" "}
                                            transactions
                                        </p>
                                        <div className="flex items-center space-x-2">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() =>
                                                    setCurrentPage((p) =>
                                                        Math.max(1, p - 1)
                                                    )
                                                }
                                                disabled={currentPage === 1}
                                                className="p-2 rounded-lg border border-school-grey-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-school-grey-50">
                                                <ChevronLeft className="w-5 h-5" />
                                            </motion.button>
                                            {[...Array(totalPages)].map(
                                                (_, i) => (
                                                    <motion.button
                                                        key={i}
                                                        whileHover={{
                                                            scale: 1.05,
                                                        }}
                                                        whileTap={{
                                                            scale: 0.95,
                                                        }}
                                                        onClick={() =>
                                                            setCurrentPage(
                                                                i + 1
                                                            )
                                                        }
                                                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                                                            currentPage ===
                                                            i + 1
                                                                ? "bg-university-red text-white"
                                                                : "border border-school-grey-200 hover:bg-school-grey-50"
                                                        }`}>
                                                        {i + 1}
                                                    </motion.button>
                                                )
                                            )}
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() =>
                                                    setCurrentPage((p) =>
                                                        Math.min(
                                                            totalPages,
                                                            p + 1
                                                        )
                                                    )
                                                }
                                                disabled={
                                                    currentPage === totalPages
                                                }
                                                className="p-2 rounded-lg border border-school-grey-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-school-grey-50">
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
                        className="text-center text-sm text-school-grey-500 mt-8">
                        All financial data is updated regularly. For inquiries,
                        please contact the USG Finance Committee.
                    </motion.p>
                </div>
            </section>
        </main>
    );
}
