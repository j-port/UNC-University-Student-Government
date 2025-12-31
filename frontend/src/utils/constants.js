// Color constants
export const COLORS = {
    universityRed: "#8B0000",
    schoolGrey: {
        50: "#F9FAFB",
        100: "#F3F4F6",
        200: "#E5E7EB",
        300: "#D1D5DB",
        400: "#9CA3AF",
        500: "#6B7280",
        600: "#4B5563",
        700: "#374151",
        800: "#1F2937",
    },
};

// College list
export const COLLEGES = [
    "College of Arts and Sciences",
    "College of Business and Accountancy",
    "College of Computer Studies",
    "College of Criminal Justice Education",
    "College of Education",
    "College of Engineering and Architecture",
    "College of Law",
    "College of Nursing",
    "Graduate School",
];

// Organization types
export const ORGANIZATION_TYPES = {
    COUNCIL: "council",
    ACADEMIC: "academic",
    NON_ACADEMIC: "non-academic",
    FRATERNITY: "fraternity",
};

// Officer branches
export const OFFICER_BRANCHES = {
    EXECUTIVE: "executive",
    LEGISLATIVE: "legislative",
    COMMITTEE: "committee",
};

// Feedback categories
export const FEEDBACK_CATEGORIES = [
    { value: "academic", label: "Academic Concerns" },
    { value: "facilities", label: "Facilities & Infrastructure" },
    { value: "student-services", label: "Student Services" },
    { value: "events", label: "Events & Activities" },
    { value: "policy", label: "Policy & Governance" },
    { value: "financial", label: "Financial Matters" },
    { value: "safety", label: "Safety & Security" },
    { value: "suggestion", label: "Suggestions & Ideas" },
    { value: "compliment", label: "Compliments & Recognition" },
    { value: "other", label: "Other Concerns" },
];

// Feedback statuses
export const FEEDBACK_STATUSES = {
    PENDING: "pending",
    IN_PROGRESS: "in-progress",
    RESOLVED: "resolved",
    CLOSED: "closed",
};

// API endpoints (if using REST API instead of Supabase directly)
export const API_ENDPOINTS = {
    OFFICERS: "/api/officers",
    COMMITTEES: "/api/committees",
    ORGANIZATIONS: "/api/organizations",
    GOVERNANCE: "/api/governance",
    FEEDBACK: "/api/feedback",
    ANNOUNCEMENTS: "/api/announcements",
};

// Pagination
export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
};

// File upload limits
export const FILE_LIMITS = {
    MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
    MAX_DOCUMENT_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    ALLOWED_DOCUMENT_TYPES: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
};
