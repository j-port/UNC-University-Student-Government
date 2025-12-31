// DYNAMIC VERSION OF ORGCHART.JSX
// Replace the contents of OrgChart.jsx with this file
// Instructions: Copy this entire file and overwrite frontend/src/pages/OrgChart.jsx

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "../components/PageHeader";
import LoadingSpinner from "../components/LoadingSpinner";
import {
    fetchOfficers,
    fetchOrganizations,
    fetchCommittees,
} from "../lib/supabaseClient";
import { Link } from "react-router-dom";
import USGLogo from "../assets/USG LOGO NO BG.png";
import {
    ArrowLeft,
    Download,
    User,
    Users,
    ChevronDown,
    Building,
    BookOpen,
    Music,
    Trophy,
    Palette,
    Globe,
    Heart,
    Briefcase,
    GraduationCap,
    Scale,
} from "lucide-react";

// Icon mapping for dynamic rendering
const iconMap = {
    Building,
    Users,
    Scale,
    Briefcase,
    GraduationCap,
    Heart,
    Trophy,
    Globe,
    Palette,
    BookOpen,
    Music,
    User,
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.4 },
    },
};

// Expandable Section Component
function ExpandableSection({
    title,
    icon: Icon,
    color,
    children,
    defaultOpen = false,
}) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-card overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full p-6 flex items-center justify-between bg-gradient-to-r ${color} text-white`}>
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <Icon className="w-6 h-6" />
                    </div>
                    <h2 className="font-display text-xl font-bold">{title}</h2>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}>
                    <ChevronDown className="w-6 h-6" />
                </motion.div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden">
                        <div className="p-6">{children}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default function OrgChart() {
    const [executiveOfficers, setExecutiveOfficers] = useState([]);
    const [legislativeOfficers, setLegislativeOfficers] = useState([]);
    const [committees, setCommittees] = useState([]);
    const [collegeCouncils, setCollegeCouncils] = useState([]);
    const [academicOrgs, setAcademicOrgs] = useState([]);
    const [nonAcademicOrgs, setNonAcademicOrgs] = useState([]);
    const [fraternities, setFraternities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [execResult, legResult, committeesResult, orgsResult] =
                    await Promise.all([
                        fetchOfficers("executive"),
                        fetchOfficers("legislative"),
                        fetchCommittees(),
                        fetchOrganizations(),
                    ]);

                setExecutiveOfficers(execResult.data || []);
                setLegislativeOfficers(legResult.data || []);
                setCommittees(committeesResult.data || []);

                const allOrgs = orgsResult.data || [];
                setCollegeCouncils(
                    allOrgs.filter((org) => org.type === "college-council")
                );
                setAcademicOrgs(
                    allOrgs.filter((org) => org.type === "academic")
                );
                setNonAcademicOrgs(
                    allOrgs.filter((org) => org.type === "non-academic")
                );
                setFraternities(
                    allOrgs.filter((org) =>
                        ["fraternity", "sorority", "co-ed"].includes(org.type)
                    )
                );
            } catch (error) {
                console.error("Error loading org chart data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) {
        return (
            <main>
                <PageHeader
                    badge="Organization"
                    title="USG Organizational Chart"
                    subtitle="The structure and leadership of your student government"
                />
                <section className="bg-school-grey-50 py-12">
                    <LoadingSpinner message="Loading organizational chart..." />
                </section>
            </main>
        );
    }

    return (
        <main>
            <PageHeader
                badge="Organization"
                title="USG Organizational Chart"
                subtitle="The structure and leadership of your student government"
            />

            <section className="bg-school-grey-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Navigation & Download */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                        <Link
                            to="/governance"
                            className="inline-flex items-center text-school-grey-600 hover:text-university-red transition-colors">
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Back to Governance Hub
                        </Link>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-primary inline-flex items-center">
                            <Download className="w-5 h-5 mr-2" />
                            Download Chart
                        </motion.button>
                    </div>

                    {/* USG Logo */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex justify-center mb-12">
                        <div className="bg-white p-8 rounded-2xl shadow-card">
                            <img
                                src={USGLogo}
                                alt="USG Logo"
                                className="w-32 h-32 object-contain"
                            />
                        </div>
                    </motion.div>

                    <div className="space-y-6">
                        {/* Executive Branch */}
                        <ExpandableSection
                            title="Executive Branch"
                            icon={Building}
                            color="from-university-red to-university-red-700"
                            defaultOpen={true}>
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {executiveOfficers.map((officer) => (
                                    <motion.div
                                        key={officer.id}
                                        variants={itemVariants}
                                        className="bg-school-grey-50 rounded-xl p-6 text-center">
                                        {officer.image_url && (
                                            <img
                                                src={officer.image_url}
                                                alt={officer.name}
                                                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                                            />
                                        )}
                                        {!officer.image_url && (
                                            <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-university-red/10 flex items-center justify-center">
                                                <User className="w-12 h-12 text-university-red" />
                                            </div>
                                        )}
                                        <h3 className="font-display font-semibold text-school-grey-800 mb-1">
                                            {officer.name}
                                        </h3>
                                        <p className="text-sm text-university-red font-medium mb-2">
                                            {officer.position}
                                        </p>
                                        {officer.email && (
                                            <p className="text-xs text-school-grey-500">
                                                {officer.email}
                                            </p>
                                        )}
                                    </motion.div>
                                ))}
                            </motion.div>
                        </ExpandableSection>

                        {/* Legislative Branch */}
                        <ExpandableSection
                            title="Legislative Branch (Student Council)"
                            icon={Scale}
                            color="from-blue-500 to-blue-600"
                            defaultOpen={true}>
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {legislativeOfficers.map((officer) => (
                                    <motion.div
                                        key={officer.id}
                                        variants={itemVariants}
                                        className="bg-school-grey-50 rounded-xl p-6 text-center">
                                        {officer.image_url && (
                                            <img
                                                src={officer.image_url}
                                                alt={officer.name}
                                                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                                            />
                                        )}
                                        {!officer.image_url && (
                                            <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-blue-500/10 flex items-center justify-center">
                                                <User className="w-12 h-12 text-blue-500" />
                                            </div>
                                        )}
                                        <h3 className="font-display font-semibold text-school-grey-800 mb-1">
                                            {officer.name}
                                        </h3>
                                        <p className="text-sm text-blue-600 font-medium mb-2">
                                            {officer.position}
                                        </p>
                                        {officer.email && (
                                            <p className="text-xs text-school-grey-500">
                                                {officer.email}
                                            </p>
                                        )}
                                    </motion.div>
                                ))}
                            </motion.div>
                        </ExpandableSection>

                        {/* Council Departments */}
                        <ExpandableSection
                            title="Council Departments"
                            icon={Briefcase}
                            color="from-purple-500 to-purple-600">
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {committees.map((committee) => {
                                    const IconComponent =
                                        iconMap[committee.icon] || Briefcase;
                                    return (
                                        <motion.div
                                            key={committee.id}
                                            variants={itemVariants}
                                            className="bg-school-grey-50 rounded-xl p-6">
                                            <div
                                                className={`w-12 h-12 ${committee.color} rounded-xl flex items-center justify-center mb-4`}>
                                                <IconComponent className="w-6 h-6 text-white" />
                                            </div>
                                            <h3 className="font-display font-semibold text-school-grey-800 mb-2">
                                                {committee.name}
                                            </h3>
                                            <p className="text-sm text-school-grey-600 mb-3">
                                                {committee.description}
                                            </p>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-school-grey-500">
                                                    Head:
                                                </span>
                                                <span className="font-medium text-school-grey-800">
                                                    {committee.head_name}
                                                </span>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        </ExpandableSection>

                        {/* College Student Councils */}
                        <ExpandableSection
                            title="College Student Councils"
                            icon={GraduationCap}
                            color="from-green-500 to-green-600">
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {collegeCouncils.map((council) => (
                                    <motion.div
                                        key={council.id}
                                        variants={itemVariants}
                                        className={`${council.color} text-white rounded-xl p-4 text-center`}>
                                        <h3 className="font-display font-bold text-lg mb-1">
                                            {council.abbreviation}
                                        </h3>
                                        <p className="text-xs opacity-90">
                                            {council.name}
                                        </p>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </ExpandableSection>

                        {/* Academic Organizations */}
                        <ExpandableSection
                            title="Federally Recognized Student Organizations - Academic"
                            icon={BookOpen}
                            color="from-orange-500 to-orange-600">
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {academicOrgs.map((org) => (
                                    <motion.div
                                        key={org.id}
                                        variants={itemVariants}
                                        className="bg-school-grey-50 rounded-xl p-4 flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold text-school-grey-800">
                                                {org.name}
                                            </h3>
                                            {org.abbreviation && (
                                                <p className="text-sm text-school-grey-500">
                                                    ({org.abbreviation})
                                                </p>
                                            )}
                                            {org.college && (
                                                <p className="text-xs text-orange-600 mt-1">
                                                    {org.college}
                                                </p>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </ExpandableSection>

                        {/* Non-Academic Organizations */}
                        <ExpandableSection
                            title="FSOs - Non-Academic Organizations"
                            icon={Users}
                            color="from-teal-500 to-teal-600">
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {nonAcademicOrgs.map((org) => {
                                    const IconComponent =
                                        iconMap[org.icon] || Users;
                                    return (
                                        <motion.div
                                            key={org.id}
                                            variants={itemVariants}
                                            className="bg-school-grey-50 rounded-xl p-4 flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <IconComponent className="w-5 h-5 text-teal-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-school-grey-800 text-sm">
                                                    {org.name}
                                                </h3>
                                                {org.description && (
                                                    <p className="text-xs text-school-grey-500">
                                                        {org.description}
                                                    </p>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        </ExpandableSection>

                        {/* Fraternities & Sororities */}
                        <ExpandableSection
                            title="Fraternities & Sororities"
                            icon={Users}
                            color="from-pink-500 to-pink-600">
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {fraternities.map((org) => (
                                    <motion.div
                                        key={org.id}
                                        variants={itemVariants}
                                        className="bg-school-grey-50 rounded-xl p-4">
                                        <h3 className="font-semibold text-school-grey-800 mb-1">
                                            {org.name}
                                        </h3>
                                        <div className="flex items-center justify-between text-sm">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium ${
                                                    org.type === "fraternity"
                                                        ? "bg-blue-100 text-blue-700"
                                                        : org.type ===
                                                          "sorority"
                                                        ? "bg-pink-100 text-pink-700"
                                                        : "bg-purple-100 text-purple-700"
                                                }`}>
                                                {org.type}
                                            </span>
                                            {org.founded_year && (
                                                <span className="text-school-grey-500">
                                                    Est. {org.founded_year}
                                                </span>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </ExpandableSection>
                    </div>
                </div>
            </section>
        </main>
    );
}
