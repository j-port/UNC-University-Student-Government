import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Save,
    Plus,
    Trash2,
    Edit2,
    X,
    Users,
    Star,
    Shield,
    Heart,
    FileText,
    DollarSign,
    Award,
    TrendingUp,
    MessageSquare,
    Megaphone,
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import LoadingSpinner from "../../components/LoadingSpinner";

// Icon options for stats and features
const iconOptions = [
    { name: "Users", icon: Users },
    { name: "Star", icon: Star },
    { name: "Shield", icon: Shield },
    { name: "Heart", icon: Heart },
    { name: "FileText", icon: FileText },
    { name: "DollarSign", icon: DollarSign },
    { name: "Award", icon: Award },
    { name: "TrendingUp", icon: TrendingUp },
    { name: "MessageSquare", icon: MessageSquare },
    { name: "Megaphone", icon: Megaphone },
];

const sectionTypes = [
    {
        value: "heroStats",
        label: "📊 Hero Section Statistics",
        description: "Numbers displayed prominently at the top of the homepage (e.g., '10,000+ Students Served')",
        example: "Example: Students Served - 10,000+",
        recommended: 4,
    },
    {
        value: "homeStats",
        label: "📈 Home Page Statistics",
        description: "Key numbers shown in the statistics section below the hero (e.g., 'Projects Completed - 50+')",
        example: "Example: Budget Managed - ₱2M+",
        recommended: 4,
    },
    {
        value: "coreValues",
        label: "⭐ Core Values",
        description: "The fundamental principles and values that guide USG (e.g., 'Transparency', 'Accountability')",
        example: "Example: Service, Excellence, Unity",
        recommended: 5,
    },
    {
        value: "heroFeatures",
        label: "🎯 Quick Access Cards",
        description: "Clickable cards that link to important pages (e.g., 'Governance Hub', 'Bulletins')",
        example: "Example: Transparency Portal → /transparency",
        recommended: 3,
    },
    {
        value: "achievements",
        label: "🏆 Accomplishments",
        description: "Major achievements and milestones of USG (e.g., 'Enhanced Student Welfare')",
        example: "Example: Budget Transparency Initiative",
        recommended: 3,
    },
];

export default function AdminSiteContent() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [siteContent, setSiteContent] = useState([]);
    const [pageContent, setPageContent] = useState([]);
    const [activeTab, setActiveTab] = useState("site");
    const [editingItem, setEditingItem] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [notification, setNotification] = useState(null);

    // Fetch all content
    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            setLoading(true);

            // Fetch site content
            const { data: siteData, error: siteError } = await supabase
                .from("site_content")
                .select("*")
                .order("section_type", { ascending: true })
                .order("display_order", { ascending: true });

            if (siteError) throw siteError;

            // Fetch page content
            const { data: pageData, error: pageError } = await supabase
                .from("page_content")
                .select("*")
                .order("page", { ascending: true });

            if (pageError) throw pageError;

            setSiteContent(siteData || []);
            setPageContent(pageData || []);
        } catch (error) {
            console.error("Error fetching content:", error);
            showNotification("Failed to load content", "error");
        } finally {
            setLoading(false);
        }
    };

    const showNotification = (message, type = "success") => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    // Save site content item
    const saveSiteContentItem = async (item) => {
        try {
            setSaving(true);

            if (item.id) {
                // Update existing
                const { error } = await supabase
                    .from("site_content")
                    .update({
                        section_type: item.section_type,
                        section_key: item.section_key,
                        title: item.title,
                        content: item.content,
                        metadata: item.metadata,
                        display_order: item.display_order,
                        active: item.active,
                    })
                    .eq("id", item.id);

                if (error) throw error;
                showNotification("Content updated successfully");
            } else {
                // Create new
                const { error } = await supabase.from("site_content").insert([
                    {
                        section_type: item.section_type,
                        section_key: item.section_key,
                        title: item.title,
                        content: item.content,
                        metadata: item.metadata,
                        display_order: item.display_order,
                        active: item.active,
                    },
                ]);

                if (error) throw error;
                showNotification("Content created successfully");
            }

            fetchContent();
            setEditingItem(null);
            setShowAddModal(false);
        } catch (error) {
            console.error("Error saving content:", error);
            showNotification("Failed to save content", "error");
        } finally {
            setSaving(false);
        }
    };

    // Save page content item
    const savePageContentItem = async (item) => {
        try {
            setSaving(true);

            if (item.id) {
                // Update existing
                const { error } = await supabase
                    .from("page_content")
                    .update({
                        page: item.page,
                        section_key: item.section_key,
                        title: item.title,
                        content: item.content,
                        active: item.active,
                    })
                    .eq("id", item.id);

                if (error) throw error;
                showNotification("Page content updated successfully");
            } else {
                // Create new
                const { error } = await supabase.from("page_content").insert([
                    {
                        page: item.page,
                        section_key: item.section_key,
                        title: item.title,
                        content: item.content,
                        active: item.active,
                    },
                ]);

                if (error) throw error;
                showNotification("Page content created successfully");
            }

            fetchContent();
            setEditingItem(null);
            setShowAddModal(false);
        } catch (error) {
            console.error("Error saving page content:", error);
            showNotification("Failed to save page content", "error");
        } finally {
            setSaving(false);
        }
    };

    // Delete site content item
    const deleteSiteContentItem = async (id) => {
        if (!confirm("Are you sure you want to delete this item?")) return;

        try {
            const { error } = await supabase
                .from("site_content")
                .delete()
                .eq("id", id);

            if (error) throw error;
            showNotification("Content deleted successfully");
            fetchContent();
        } catch (error) {
            console.error("Error deleting content:", error);
            showNotification("Failed to delete content", "error");
        }
    };

    // Delete page content item
    const deletePageContentItem = async (id) => {
        if (!confirm("Are you sure you want to delete this item?")) return;

        try {
            const { error } = await supabase
                .from("page_content")
                .delete()
                .eq("id", id);

            if (error) throw error;
            showNotification("Page content deleted successfully");
            fetchContent();
        } catch (error) {
            console.error("Error deleting page content:", error);
            showNotification("Failed to delete page content", "error");
        }
    };

    // Group site content by section type
    const groupedContent = siteContent.reduce((acc, item) => {
        if (!acc[item.section_type]) {
            acc[item.section_type] = [];
        }
        acc[item.section_type].push(item);
        return acc;
    }, {});

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-university-red to-university-red-600 rounded-3xl p-8 text-white">
                <h1 className="text-3xl font-bold mb-2">📝 Homepage Content Editor</h1>
                <p className="text-white/90 mb-4 max-w-3xl">
                    Welcome! This page lets you update what visitors see on the USG website homepage. 
                    No coding knowledge needed - just fill in the forms and your changes will appear instantly!
                </p>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <h3 className="font-semibold mb-2 flex items-center space-x-2">
                        <span>💡</span>
                        <span>Quick Guide:</span>
                    </h3>
                    <ul className="space-y-1 text-sm text-white/80">
                        <li>• <strong>Statistics:</strong> Update numbers like "10,000+ Students" or "₱2M+ Budget"</li>
                        <li>• <strong>Core Values:</strong> Edit USG principles like "Transparency" or "Excellence"</li>
                        <li>• <strong>Quick Access Cards:</strong> Change clickable cards that link to pages</li>
                        <li>• <strong>Page Text:</strong> Update the "About USG" description and mission statement</li>
                    </ul>
                </div>
            </div>

            {/* Notification */}
            {notification && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`p-4 rounded-xl ${notification.type === "error"
                            ? "bg-red-50 text-red-800 border border-red-200"
                            : "bg-green-50 text-green-800 border border-green-200"
                        }`}>
                    {notification.message}
                </motion.div>
            )}

            {/* Tabs */}
            <div className="flex space-x-4 border-b border-school-grey-200">
                <button
                    onClick={() => setActiveTab("site")}
                    className={`pb-4 px-2 font-medium transition-colors ${activeTab === "site"
                            ? "text-university-red border-b-2 border-university-red"
                            : "text-school-grey-600 hover:text-school-grey-800"
                        }`}>
                    Site Content
                </button>
                <button
                    onClick={() => setActiveTab("page")}
                    className={`pb-4 px-2 font-medium transition-colors ${activeTab === "page"
                            ? "text-university-red border-b-2 border-university-red"
                            : "text-school-grey-600 hover:text-school-grey-800"
                        }`}>
                    Page Content
                </button>
            </div>

            {/* Site Content Tab */}
            {activeTab === "site" && (
                <div className="space-y-8">
                    {/* Add New Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={() => {
                                setEditingItem({
                                    section_type: "heroStats",
                                    section_key: "",
                                    title: "",
                                    content: "",
                                    metadata: {},
                                    display_order: 0,
                                    active: true,
                                });
                                setShowAddModal(true);
                            }}
                            className="btn-primary inline-flex items-center space-x-2">
                            <Plus className="w-5 h-5" />
                            <span>Add Content</span>
                        </button>
                    </div>

                    {/* Content by Section */}
                    {sectionTypes.map((section) => {
                        const itemsInSection = groupedContent[section.value] || [];
                        const itemCount = itemsInSection.length;
                        
                        return (
                            <div
                                key={section.value}
                                className="bg-white rounded-2xl p-6 shadow-sm border border-school-grey-100">
                                <div className="mb-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h2 className="text-xl font-bold text-school-grey-800 mb-1">
                                                {section.label}
                                            </h2>
                                            <p className="text-sm text-school-grey-600 mb-2">
                                                {section.description}
                                            </p>
                                            <p className="text-xs text-school-grey-500 italic">
                                                {section.example}
                                            </p>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            itemCount === section.recommended
                                                ? 'bg-green-100 text-green-700'
                                                : itemCount > section.recommended
                                                ? 'bg-orange-100 text-orange-700'
                                                : 'bg-blue-100 text-blue-700'
                                        }`}>
                                            {itemCount} / {section.recommended} items
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {itemsInSection.length > 0 ? (
                                        itemsInSection.map((item) => (
                                            <SiteContentItem
                                                key={item.id}
                                                item={item}
                                                onEdit={setEditingItem}
                                                onDelete={deleteSiteContentItem}
                                            />
                                        ))
                                    ) : (
                                        <div className="text-center py-12 bg-school-grey-50 rounded-xl border-2 border-dashed border-school-grey-200">
                                            <div className="text-school-grey-400 mb-3">
                                                <FileText className="w-12 h-12 mx-auto opacity-50" />
                                            </div>
                                            <p className="text-school-grey-600 font-medium mb-1">
                                                No content added yet
                                            </p>
                                            <p className="text-sm text-school-grey-500 mb-4">
                                                Click "Add Content" above and select "{section.label}" to get started
                                            </p>
                                            <button
                                                onClick={() => {
                                                    setEditingItem({
                                                        section_type: section.value,
                                                        section_key: "",
                                                        title: "",
                                                        content: "",
                                                        metadata: {},
                                                        display_order: itemCount + 1,
                                                        active: true,
                                                    });
                                                    setShowAddModal(true);
                                                }}
                                                className="btn-primary inline-flex items-center space-x-2 text-sm">
                                                <Plus className="w-4 h-4" />
                                                <span>Add {section.label}</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Page Content Tab */}
            {activeTab === "page" && (
                <div className="space-y-6">
                    {/* Info Banner */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <h3 className="font-semibold text-blue-900 mb-2 flex items-center space-x-2">
                            <span>ℹ️</span>
                            <span>About Page Content</span>
                        </h3>
                        <p className="text-sm text-blue-800">
                            This section contains longer text content for pages like "About USG", "Mission", and "Vision". 
                            These appear as paragraphs on your website pages.
                        </p>
                    </div>

                    {/* Add New Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={() => {
                                setEditingItem({
                                    page: "home",
                                    section_key: "",
                                    title: "",
                                    content: "",
                                    active: true,
                                });
                                setShowAddModal(true);
                            }}
                            className="btn-primary inline-flex items-center space-x-2">
                            <Plus className="w-5 h-5" />
                            <span>Add Page Text</span>
                        </button>
                    </div>

                    {pageContent.length > 0 ? (
                        pageContent.map((item) => (
                            <PageContentItem
                                key={item.id}
                                item={item}
                                onEdit={setEditingItem}
                                onDelete={deletePageContentItem}
                            />
                        ))
                    ) : (
                        <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-school-grey-200">
                            <div className="text-school-grey-400 mb-4">
                                <FileText className="w-16 h-16 mx-auto opacity-50" />
                            </div>
                            <p className="text-school-grey-600 font-medium text-lg mb-2">
                                No page text content yet
                            </p>
                            <p className="text-sm text-school-grey-500 mb-6 max-w-md mx-auto">
                                Add text content for pages like "About USG", "Mission Statement", and "Vision". 
                                This is where you write longer descriptions and explanations.
                            </p>
                            <button
                                onClick={() => {
                                    setEditingItem({
                                        page: "home",
                                        section_key: "about",
                                        title: "About USG",
                                        content: "",
                                        active: true,
                                    });
                                    setShowAddModal(true);
                                }}
                                className="btn-primary inline-flex items-center space-x-2">
                                <Plus className="w-5 h-5" />
                                <span>Add Your First Page Text</span>
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Edit/Add Modal */}
            {editingItem && (
                <EditModal
                    item={editingItem}
                    isNew={showAddModal}
                    isSiteContent={activeTab === "site"}
                    onSave={
                        activeTab === "site"
                            ? saveSiteContentItem
                            : savePageContentItem
                    }
                    onCancel={() => {
                        setEditingItem(null);
                        setShowAddModal(false);
                    }}
                    saving={saving}
                />
            )}
        </div>
    );
}

// Site Content Item Component
function SiteContentItem({ item, onEdit, onDelete }) {
    const IconComponent = iconOptions.find(
        (opt) => opt.name === item.metadata?.icon
    )?.icon;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between p-4 bg-school-grey-50 rounded-xl hover:bg-school-grey-100 transition-colors">
            <div className="flex items-center space-x-4 flex-1">
                {IconComponent && (
                    <div className="w-10 h-10 bg-university-red-50 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-university-red" />
                    </div>
                )}
                <div className="flex-1">
                    <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-school-grey-800">
                            {item.title || item.content}
                        </h3>
                        {!item.active && (
                            <span className="px-2 py-0.5 bg-school-grey-200 text-school-grey-600 text-xs rounded-full">
                                Inactive
                            </span>
                        )}
                    </div>
                    {item.metadata?.value && (
                        <p className="text-sm text-school-grey-600">
                            Value: {item.metadata.value}
                        </p>
                    )}
                    {item.metadata?.label && (
                        <p className="text-sm text-school-grey-600">
                            Label: {item.metadata.label}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <button
                    onClick={() => onEdit(item)}
                    className="p-2 hover:bg-white rounded-lg transition-colors">
                    <Edit2 className="w-4 h-4 text-school-grey-600" />
                </button>
                <button
                    onClick={() => onDelete(item.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4 text-red-600" />
                </button>
            </div>
        </motion.div>
    );
}

// Page Content Item Component
function PageContentItem({ item, onEdit, onDelete }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-school-grey-100">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-bold text-school-grey-800">
                            {item.title}
                        </h3>
                        <span className="px-2 py-0.5 bg-university-red-50 text-university-red text-xs rounded-full">
                            {item.page}
                        </span>
                        {!item.active && (
                            <span className="px-2 py-0.5 bg-school-grey-200 text-school-grey-600 text-xs rounded-full">
                                Inactive
                            </span>
                        )}
                    </div>
                    <p className="text-school-grey-600 text-sm mb-2">
                        Key: {item.section_key}
                    </p>
                    <p className="text-school-grey-700 line-clamp-3">
                        {item.content}
                    </p>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                    <button
                        onClick={() => onEdit(item)}
                        className="p-2 hover:bg-school-grey-50 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4 text-school-grey-600" />
                    </button>
                    <button
                        onClick={() => onDelete(item.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

// Edit Modal Component
function EditModal({ item, isNew, isSiteContent, onSave, onCancel, saving }) {
    const [formData, setFormData] = useState(item);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const updateMetadata = (key, value) => {
        setFormData({
            ...formData,
            metadata: {
                ...formData.metadata,
                [key]: value,
            },
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-school-grey-800">
                        {isNew ? "Add" : "Edit"}{" "}
                        {isSiteContent ? "Site" : "Page"} Content
                    </h2>
                    <button
                        onClick={onCancel}
                        className="p-2 hover:bg-school-grey-100 rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {isSiteContent ? (
                        <>
                            {/* Section Type */}
                            <div>
                                <label className="block text-sm font-medium text-school-grey-700 mb-2">
                                    Section Type
                                </label>
                                <select
                                    value={formData.section_type}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            section_type: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 border border-school-grey-200 rounded-xl focus:ring-2 focus:ring-university-red focus:border-transparent"
                                    required>
                                    {sectionTypes.map((type) => (
                                        <option
                                            key={type.value}
                                            value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Section Key */}
                            <div>
                                <label className="block text-sm font-medium text-school-grey-700 mb-2">
                                    Section Key (unique identifier)
                                </label>
                                <input
                                    type="text"
                                    value={formData.section_key}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            section_key: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 border border-school-grey-200 rounded-xl focus:ring-2 focus:ring-university-red focus:border-transparent"
                                    placeholder="e.g., students-served"
                                    required
                                />
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-school-grey-700 mb-2">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            title: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 border border-school-grey-200 rounded-xl focus:ring-2 focus:ring-university-red focus:border-transparent"
                                    placeholder="e.g., Transparency"
                                />
                            </div>

                            {/* Content */}
                            <div>
                                <label className="block text-sm font-medium text-school-grey-700 mb-2">
                                    Content
                                </label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            content: e.target.value,
                                        })
                                    }
                                    rows={3}
                                    className="w-full px-4 py-2 border border-school-grey-200 rounded-xl focus:ring-2 focus:ring-university-red focus:border-transparent"
                                    placeholder="Content text"
                                />
                            </div>

                            {/* Metadata - Icon */}
                            {[
                                "heroStats",
                                "homeStats",
                                "heroFeatures",
                            ].includes(formData.section_type) && (
                                    <div>
                                        <label className="block text-sm font-medium text-school-grey-700 mb-2">
                                            Icon
                                        </label>
                                        <select
                                            value={formData.metadata?.icon || ""}
                                            onChange={(e) =>
                                                updateMetadata(
                                                    "icon",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-4 py-2 border border-school-grey-200 rounded-xl focus:ring-2 focus:ring-university-red focus:border-transparent">
                                            <option value="">Select an icon</option>
                                            {iconOptions.map((icon) => (
                                                <option
                                                    key={icon.name}
                                                    value={icon.name}>
                                                    {icon.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                            {/* Metadata - Value (for stats) */}
                            {["heroStats", "homeStats"].includes(
                                formData.section_type
                            ) && (
                                    <div>
                                        <label className="block text-sm font-medium text-school-grey-700 mb-2">
                                            Value (e.g., "10,000+" or "100%")
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.metadata?.value || ""}
                                            onChange={(e) =>
                                                updateMetadata(
                                                    "value",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-4 py-2 border border-school-grey-200 rounded-xl focus:ring-2 focus:ring-university-red focus:border-transparent"
                                            placeholder="e.g., 10,000+"
                                        />
                                    </div>
                                )}

                            {/* Metadata - Label */}
                            {["heroStats", "homeStats"].includes(
                                formData.section_type
                            ) && (
                                    <div>
                                        <label className="block text-sm font-medium text-school-grey-700 mb-2">
                                            Label
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.metadata?.label || ""}
                                            onChange={(e) =>
                                                updateMetadata(
                                                    "label",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-4 py-2 border border-school-grey-200 rounded-xl focus:ring-2 focus:ring-university-red focus:border-transparent"
                                            placeholder="e.g., Students Served"
                                        />
                                    </div>
                                )}

                            {/* Metadata - Description (for features) */}
                            {formData.section_type === "heroFeatures" && (
                                <div>
                                    <label className="block text-sm font-medium text-school-grey-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={
                                            formData.metadata?.description || ""
                                        }
                                        onChange={(e) =>
                                            updateMetadata(
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        rows={2}
                                        className="w-full px-4 py-2 border border-school-grey-200 rounded-xl focus:ring-2 focus:ring-university-red focus:border-transparent"
                                        placeholder="Feature description"
                                    />
                                </div>
                            )}

                            {/* Metadata - Path (for features) */}
                            {formData.section_type === "heroFeatures" && (
                                <div>
                                    <label className="block text-sm font-medium text-school-grey-700 mb-2">
                                        Path (link URL)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.metadata?.path || ""}
                                        onChange={(e) =>
                                            updateMetadata(
                                                "path",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-4 py-2 border border-school-grey-200 rounded-xl focus:ring-2 focus:ring-university-red focus:border-transparent"
                                        placeholder="e.g., /governance"
                                    />
                                </div>
                            )}

                            {/* Metadata - Color (for features) */}
                            {formData.section_type === "heroFeatures" && (
                                <div>
                                    <label className="block text-sm font-medium text-school-grey-700 mb-2">
                                        Color (Tailwind gradient)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.metadata?.color || ""}
                                        onChange={(e) =>
                                            updateMetadata(
                                                "color",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-4 py-2 border border-school-grey-200 rounded-xl focus:ring-2 focus:ring-university-red focus:border-transparent"
                                        placeholder="e.g., from-blue-500 to-blue-600"
                                    />
                                </div>
                            )}

                            {/* Display Order */}
                            <div>
                                <label className="block text-sm font-medium text-school-grey-700 mb-2">
                                    Display Order
                                </label>
                                <input
                                    type="number"
                                    value={formData.display_order}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            display_order: parseInt(
                                                e.target.value
                                            ),
                                        })
                                    }
                                    className="w-full px-4 py-2 border border-school-grey-200 rounded-xl focus:ring-2 focus:ring-university-red focus:border-transparent"
                                    min="0"
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Page */}
                            <div>
                                <label className="block text-sm font-medium text-school-grey-700 mb-2">
                                    Page
                                </label>
                                <select
                                    value={formData.page}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            page: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 border border-school-grey-200 rounded-xl focus:ring-2 focus:ring-university-red focus:border-transparent"
                                    required>
                                    <option value="home">Home</option>
                                    <option value="about">About</option>
                                </select>
                            </div>

                            {/* Section Key */}
                            <div>
                                <label className="block text-sm font-medium text-school-grey-700 mb-2">
                                    Section Key
                                </label>
                                <input
                                    type="text"
                                    value={formData.section_key}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            section_key: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 border border-school-grey-200 rounded-xl focus:ring-2 focus:ring-university-red focus:border-transparent"
                                    placeholder="e.g., about, mission, vision"
                                    required
                                />
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-school-grey-700 mb-2">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            title: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 border border-school-grey-200 rounded-xl focus:ring-2 focus:ring-university-red focus:border-transparent"
                                    placeholder="Section title"
                                    required
                                />
                            </div>

                            {/* Content */}
                            <div>
                                <label className="block text-sm font-medium text-school-grey-700 mb-2">
                                    Content
                                </label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            content: e.target.value,
                                        })
                                    }
                                    rows={6}
                                    className="w-full px-4 py-2 border border-school-grey-200 rounded-xl focus:ring-2 focus:ring-university-red focus:border-transparent"
                                    placeholder="Content text (use double line breaks for paragraphs)"
                                    required
                                />
                            </div>
                        </>
                    )}

                    {/* Active Toggle */}
                    <div className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            id="active"
                            checked={formData.active}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    active: e.target.checked,
                                })
                            }
                            className="w-4 h-4 text-university-red rounded"
                        />
                        <label
                            htmlFor="active"
                            className="text-sm font-medium text-school-grey-700">
                            Active (visible on site)
                        </label>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-end space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-2 border border-school-grey-200 rounded-xl hover:bg-school-grey-50 transition-colors"
                            disabled={saving}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="btn-primary inline-flex items-center space-x-2">
                            {saving ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    <span>Save</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
