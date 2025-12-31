/**
 * Format date string to human-readable format
 * @param {string} dateString - ISO date string
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date
 */
export const formatDate = (dateString, options = {}) => {
    if (!dateString) return "";

    const defaultOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
    };

    try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-US", {
            ...defaultOptions,
            ...options,
        }).format(date);
    } catch (error) {
        console.error("Error formatting date:", error);
        return dateString;
    }
};

/**
 * Format date to relative time (e.g., "2 days ago")
 * @param {string} dateString - ISO date string
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (dateString) => {
    if (!dateString) return "";

    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return "just now";
        if (diffInSeconds < 3600)
            return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400)
            return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInSeconds < 604800)
            return `${Math.floor(diffInSeconds / 86400)} days ago`;

        return formatDate(dateString);
    } catch (error) {
        console.error("Error formatting relative time:", error);
        return dateString;
    }
};

/**
 * Format currency (PHP)
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency
 */
export const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "₱0.00";

    return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
    }).format(amount);
};

/**
 * Format large numbers with abbreviations (K, M, B)
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
    if (num === null || num === undefined) return "0";

    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1) + "B";
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
};
