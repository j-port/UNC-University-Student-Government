import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

/**
 * Toast notification component with different types
 * @param {Object} props
 * @param {Object} props.notification - Notification object with message and type
 * @param {Function} props.onDismiss - Callback when notification is dismissed
 */
export default function Notification({ notification, onDismiss }) {
    if (!notification) return null;

    const { message, type = 'success' } = notification;

    const styles = {
        success: {
            bg: 'bg-green-500',
            icon: CheckCircle,
        },
        error: {
            bg: 'bg-red-500',
            icon: AlertCircle,
        },
        info: {
            bg: 'bg-blue-500',
            icon: Info,
        },
        warning: {
            bg: 'bg-yellow-500',
            icon: AlertTriangle,
        },
    };

    const config = styles[type] || styles.success;
    const Icon = config.icon;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg ${config.bg} text-white flex items-center space-x-3`}
            >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{message}</span>
                {onDismiss && (
                    <button
                        onClick={onDismiss}
                        className="ml-2 hover:bg-white/20 rounded-lg p-1 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </motion.div>
        </AnimatePresence>
    );
}
