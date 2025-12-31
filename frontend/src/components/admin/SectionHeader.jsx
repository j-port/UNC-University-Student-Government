import { ChevronDown, ChevronUp } from 'lucide-react';

/**
 * Collapsible section header for admin pages
 * @param {Object} props
 * @param {string} props.title - Section title
 * @param {React.Component} props.icon - Lucide icon component
 * @param {boolean} props.isExpanded - Whether section is expanded
 * @param {Function} props.onToggle - Toggle callback
 * @param {string} props.color - Background color class
 */
export default function SectionHeader({ title, icon: Icon, isExpanded, onToggle, color = 'bg-university-red' }) {
    return (
        <button
            onClick={onToggle}
            className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-school-grey-100 hover:border-university-red/30 transition-colors"
        >
            <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-school-grey-800">{title}</span>
            </div>
            {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-school-grey-400" />
            ) : (
                <ChevronDown className="w-5 h-5 text-school-grey-400" />
            )}
        </button>
    );
}
