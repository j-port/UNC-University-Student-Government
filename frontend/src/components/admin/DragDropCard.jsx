import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Edit, Trash2, GripVertical } from 'lucide-react';

/**
 * Sortable card component for drag-and-drop officer management
 * @param {Object} props
 * @param {Object} props.item - Officer or committee data
 * @param {Function} props.onEdit - Edit callback
 * @param {Function} props.onDelete - Delete callback
 * @param {string} props.color - Background color class
 * @param {React.ReactNode} props.children - Custom content (optional)
 */
export default function DragDropCard({ item, onEdit, onDelete, color = 'bg-university-red', children }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: item.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative bg-white rounded-2xl border-2 ${
                isDragging ? 'border-university-red shadow-xl' : 'border-school-grey-100'
            } p-4 text-center transition-all hover:shadow-lg`}
        >
            {/* Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                className="absolute top-2 left-2 p-1 cursor-grab active:cursor-grabbing hover:bg-school-grey-200 rounded transition-colors"
            >
                <GripVertical className="w-4 h-4 text-school-grey-400" />
            </div>

            {/* Content */}
            {children || (
                <>
                    <img
                        src={item.image_url || item.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'}
                        alt={item.name}
                        className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                    />
                    <h3 className="font-semibold text-school-grey-800">{item.name}</h3>
                    <p className={`text-sm font-medium ${color === 'bg-university-red' ? 'text-university-red' : 'text-blue-600'}`}>
                        {item.position}
                    </p>
                    <p className="text-xs text-school-grey-500 mt-1">{item.email}</p>
                </>
            )}

            {/* Actions */}
            <div className="flex justify-center space-x-2 mt-3">
                <button
                    onClick={() => onEdit(item)}
                    className={`p-2 text-school-grey-500 rounded-lg ${
                        color === 'bg-university-red'
                            ? 'hover:text-university-red hover:bg-university-red/10'
                            : 'hover:text-blue-600 hover:bg-blue-50'
                    }`}
                >
                    <Edit className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onDelete(item.id)}
                    className="p-2 text-school-grey-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
