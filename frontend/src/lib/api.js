const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Generic API request handler
const apiRequest = async (endpoint, options = {}) => {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
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
    getAll: () => apiRequest("/announcements"),

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
        return apiRequest(`/officers${query}`);
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
        return apiRequest(`/organizations${query}`);
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
    getAll: () => apiRequest("/committees"),

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
        return apiRequest(`/governance-documents${query}`);
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
        return apiRequest(`/site-content${query}`);
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
    getAll: () => apiRequest("/page-content"),

    getBySlug: (slug) => apiRequest(`/page-content/${slug}`),

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
    getAutomated: () => apiRequest("/stats/automated"),
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
        return apiRequest(`/issuances${query}`);
    },

    getById: (id) => apiRequest(`/issuances/${id}`),

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
