import { motion } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * Reusable modal wrapper for forms
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is visible
 * @param {Function} props.onClose - Callback when modal is closed
 * @param {string} props.title - Modal title
 * @param {React.ReactNode} props.children - Form content
 */
export default function FormModal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/70">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-school-grey-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-school-grey-800 dark:text-white">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-school-grey-400 dark:text-gray-400 hover:text-school-grey-600 dark:hover:text-gray-200 hover:bg-school-grey-50 dark:hover:bg-gray-700 rounded-xl transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">{children}</div>
            </motion.div>
        </div>
    );
}
