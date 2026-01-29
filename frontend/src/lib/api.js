import { supabase } from "./supabaseClient";

const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Generic API request handler with authentication
const apiRequest = async (endpoint, options = {}) => {
    try {
        // Get current session token
        const {
            data: { session },
        } = await supabase.auth.getSession();

        const headers = {
            "Content-Type": "application/json",
            ...options.headers,
        };

        // Add Authorization header if user is authenticated
        if (session?.access_token) {
            headers.Authorization = `Bearer ${session.access_token}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers,
            ...options,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "API request failed");
        }

        return data;
    } catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        throw error;
    }
};

// Safe API request that returns a default value on failure (for public read operations)
const safeApiRequest = async (endpoint, defaultValue = { success: true, data: [] }) => {
    try {
        return await apiRequest(endpoint);
    } catch (error) {
        console.warn(`API request failed for ${endpoint}, returning default value`);
        return defaultValue;
    }
};

// Feedback API
export const feedbackAPI = {
    getAll: () => apiRequest("/feedback"),

    create: (feedbackData) =>
        apiRequest("/feedback", {
            method: "POST",
            body: JSON.stringify(feedbackData),
        }),

    update: (id, updates) =>
        apiRequest(`/feedback/${id}`, {
            method: "PUT",
            body: JSON.stringify(updates),
        }),

    delete: (id) =>
        apiRequest(`/feedback/${id}`, {
            method: "DELETE",
        }),

    track: (referenceNumber) =>
        apiRequest(`/feedback/track/${referenceNumber}`),
};

// Announcements API
export const announcementsAPI = {
    getAll: () => safeApiRequest("/announcements"),

    create: (announcementData) =>
        apiRequest("/announcements", {
            method: "POST",
            body: JSON.stringify(announcementData),
        }),

    update: (id, updates) =>
        apiRequest(`/announcements/${id}`, {
            method: "PUT",
            body: JSON.stringify(updates),
        }),

    delete: (id) =>
        apiRequest(`/announcements/${id}`, {
            method: "DELETE",
        }),
};

// Officers API
export const officersAPI = {
    getAll: (branch = null) => {
        const query = branch ? `?branch=${branch}` : "";
        return safeApiRequest(`/officers${query}`);
    },

    create: (officerData) =>
        apiRequest("/officers", {
            method: "POST",
            body: JSON.stringify(officerData),
        }),

    update: (id, updates) =>
        apiRequest(`/officers/${id}`, {
            method: "PUT",
            body: JSON.stringify(updates),
        }),

    delete: (id) =>
        apiRequest(`/officers/${id}`, {
            method: "DELETE",
        }),
};

// Organizations API
export const organizationsAPI = {
    getAll: (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.type) params.append("type", filters.type);
        if (filters.college) params.append("college", filters.college);
        const query = params.toString() ? `?${params.toString()}` : "";
        return safeApiRequest(`/organizations${query}`);
    },

    create: (orgData) =>
        apiRequest("/organizations", {
            method: "POST",
            body: JSON.stringify(orgData),
        }),

    update: (id, updates) =>
        apiRequest(`/organizations/${id}`, {
            method: "PUT",
            body: JSON.stringify(updates),
        }),

    delete: (id) =>
        apiRequest(`/organizations/${id}`, {
            method: "DELETE",
        }),
};

// Committees API
export const committeesAPI = {
    getAll: () => safeApiRequest("/committees"),

    create: (committeeData) =>
        apiRequest("/committees", {
            method: "POST",
            body: JSON.stringify(committeeData),
        }),

    update: (id, updates) =>
        apiRequest(`/committees/${id}`, {
            method: "PUT",
            body: JSON.stringify(updates),
        }),

    delete: (id) =>
        apiRequest(`/committees/${id}`, {
            method: "DELETE",
        }),
};

// Governance Documents API
export const governanceDocsAPI = {
    getAll: (type = null) => {
        const query = type ? `?type=${type}` : "";
        return safeApiRequest(`/governance-documents${query}`);
    },

    create: (docData) =>
        apiRequest("/governance-documents", {
            method: "POST",
            body: JSON.stringify(docData),
        }),

    update: (id, updates) =>
        apiRequest(`/governance-documents/${id}`, {
            method: "PUT",
            body: JSON.stringify(updates),
        }),

    delete: (id) =>
        apiRequest(`/governance-documents/${id}`, {
            method: "DELETE",
        }),
};

// Site Content API
export const siteContentAPI = {
    getAll: (section = null) => {
        const query = section ? `?section=${section}` : "";
        return safeApiRequest(`/site-content${query}`);
    },

    upsert: (contentData) =>
        apiRequest("/site-content", {
            method: "POST",
            body: JSON.stringify(contentData),
        }),

    delete: (id) =>
        apiRequest(`/site-content/${id}`, {
            method: "DELETE",
        }),
};

// Page Content API
export const pageContentAPI = {
    getAll: () => safeApiRequest("/page-content"),

    getBySlug: (slug) => safeApiRequest(`/page-content/${slug}`, { success: true, data: null }),

    upsert: (contentData) =>
        apiRequest("/page-content", {
            method: "POST",
            body: JSON.stringify(contentData),
        }),

    delete: (id) =>
        apiRequest(`/page-content/${id}`, {
            method: "DELETE",
        }),
};

// Stats API
export const statsAPI = {
    getAutomated: () => safeApiRequest("/stats/automated", { success: true, data: { accomplishmentsCount: 0, totalBudget: 0 } }),
};

// Notifications API
export const notificationsAPI = {
    getNewFeedback: (since) => {
        const query = since ? `?since=${encodeURIComponent(since)}` : "";
        return apiRequest(`/notifications${query}`);
    },
};

// Financial Transactions API
export const financialTransactionsAPI = {
    getAll: (search = "", limit = 50) => {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (limit) params.append("limit", limit);
        const query = params.toString() ? `?${params.toString()}` : "";
        return apiRequest(`/financial-transactions${query}`);
    },

    getById: (id) => apiRequest(`/financial-transactions/${id}`),

    create: (transactionData) =>
        apiRequest("/financial-transactions", {
            method: "POST",
            body: JSON.stringify(transactionData),
        }),

    update: (id, updates) =>
        apiRequest(`/financial-transactions/${id}`, {
            method: "PUT",
            body: JSON.stringify(updates),
        }),

    delete: (id) =>
        apiRequest(`/financial-transactions/${id}`, {
            method: "DELETE",
        }),
};

// Issuances API
export const issuancesAPI = {
    getAll: (limit = 10, status = null) => {
        const params = new URLSearchParams();
        if (limit) params.append("limit", limit);
        if (status) params.append("status", status);
        const query = params.toString() ? `?${params.toString()}` : "";
        return safeApiRequest(`/issuances${query}`);
    },

    getById: (id) => safeApiRequest(`/issuances/${id}`, { success: true, data: null }),

    create: (issuanceData) =>
        apiRequest("/issuances", {
            method: "POST",
            body: JSON.stringify(issuanceData),
        }),

    update: (id, updates) =>
        apiRequest(`/issuances/${id}`, {
            method: "PUT",
            body: JSON.stringify(updates),
        }),

    delete: (id) =>
        apiRequest(`/issuances/${id}`, {
            method: "DELETE",
        }),
};

// Health check
export const healthCheck = () => apiRequest("/health");
