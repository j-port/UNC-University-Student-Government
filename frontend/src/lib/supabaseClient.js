import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Supabase client - ONLY for authentication
 *
 * ⚠️ DEPRECATED for data operations!
 * All database operations should use the backend API instead.
 * Import from '../lib/api.js' for data operations.
 *
 * This client is only kept for:
 * - Authentication (login, logout, session management)
 * - Real-time subscriptions (if needed)
 *
 * DO NOT ADD NEW DATABASE OPERATIONS HERE!
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    realtime: {
        params: {
            eventsPerSecond: 10,
        },
    },
});

/**
 * ==========================================
 * DEPRECATED FUNCTIONS BELOW
 * ==========================================
 *
 * These functions are kept temporarily for backwards compatibility.
 * They will be removed in a future update.
 * Please migrate to using the backend API from '../lib/api.js'
 *
 * Migration examples:
 *
 * OLD: const { data, error } = await fetchAnnouncements();
 * NEW: const response = await announcementsAPI.getAll();
 *      if (!response.success) throw new Error(response.error);
 *      const data = response.data;
 *
 * OLD: const { data, error } = await fetchOfficers(branch);
 * NEW: const response = await officersAPI.getAll(branch);
 *      const data = response.data;
 */

// @deprecated Use financialTransactionsAPI.getAll() from api.js
export const fetchFinancialTransactions = async (
    searchTerm = "",
    limit = 50
) => {
    console.warn(
        "DEPRECATED: Use financialTransactionsAPI.getAll() from api.js instead"
    );
    let query = supabase
        .from("financial_transactions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

    if (searchTerm) {
        query = query.or(
            `description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`
        );
    }

    const { data, error } = await query;
    return { data, error };
};

// @deprecated Use announcementsAPI.getAll() from api.js
export const fetchAnnouncements = async (options = {}) => {
    console.warn(
        "DEPRECATED: Use announcementsAPI.getAll() from api.js instead"
    );
    const { limit = 10, status = null, category = null } = options;

    let query = supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });

    if (limit) query = query.limit(limit);
    if (status) query = query.eq("status", status);
    if (category) query = query.eq("category", category);

    const { data, error } = await query;
    return { data, error };
};

// @deprecated Use issuancesAPI.getAll() from api.js
export const fetchIssuances = async (limit = 10) => {
    console.warn("DEPRECATED: Use issuancesAPI.getAll() from api.js instead");
    const { data, error } = await supabase
        .from("issuances")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

    return { data, error };
};

// @deprecated Use feedbackAPI.create() from api.js
export const submitFeedback = async (feedbackData) => {
    console.warn("DEPRECATED: Use feedbackAPI.create() from api.js instead");
    const { data, error } = await supabase
        .from("feedback")
        .insert([feedbackData]);

    return { data, error };
};

// @deprecated Use officersAPI.getAll() from api.js
export const fetchOfficers = async (branch = null) => {
    console.warn("DEPRECATED: Use officersAPI.getAll() from api.js instead");
    let query = supabase
        .from("officers")
        .select("*")
        .eq("is_active", true)
        .order("order_index", { ascending: true });

    if (branch) {
        query = query.eq("branch", branch);
    }

    const { data, error } = await query;
    return { data, error };
};

// @deprecated Use organizationsAPI.getAll() from api.js
export const fetchOrganizations = async (type = null, college = null) => {
    console.warn(
        "DEPRECATED: Use organizationsAPI.getAll() from api.js instead"
    );
    let query = supabase
        .from("organizations")
        .select("*")
        .eq("is_active", true)
        .order("order_index", { ascending: true });

    if (type) query = query.eq("type", type);
    if (college) query = query.eq("college", college);

    const { data, error } = await query;
    return { data, error };
};

// @deprecated Use committeesAPI.getAll() from api.js
export const fetchCommittees = async () => {
    console.warn("DEPRECATED: Use committeesAPI.getAll() from api.js instead");
    const { data, error } = await supabase
        .from("committees")
        .select("*")
        .eq("is_active", true)
        .order("order_index", { ascending: true });

    return { data, error };
};

// @deprecated Use governanceDocsAPI.getAll() from api.js
export const fetchGovernanceDocuments = async (type = null) => {
    console.warn(
        "DEPRECATED: Use governanceDocsAPI.getAll() from api.js instead"
    );
    let query = supabase
        .from("governance_documents")
        .select("*")
        .eq("is_active", true)
        .order("order_index", { ascending: true });

    if (type) query = query.eq("type", type);

    const { data, error } = await query;
    return { data, error };
};

// @deprecated Use siteContentAPI.getAll() from api.js
export const fetchSiteContent = async (section = null) => {
    console.warn("DEPRECATED: Use siteContentAPI.getAll() from api.js instead");
    let query = supabase
        .from("site_content")
        .select("*")
        .eq("is_active", true)
        .order("order_index", { ascending: true });

    if (section) query = query.eq("section", section);

    const { data, error } = await query;
    return { data, error };
};

// @deprecated Use pageContentAPI.getBySlug() from api.js
export const fetchPageContent = async (slug) => {
    console.warn(
        "DEPRECATED: Use pageContentAPI.getBySlug() from api.js instead"
    );
    const { data, error } = await supabase
        .from("page_content")
        .select("*")
        .eq("page_slug", slug)
        .single();

    return { data, error };
};

// All CRUD operations below are deprecated
// @deprecated Use respective API from api.js
export const updateOfficer = async (id, updates) => {
    console.warn("DEPRECATED: Use officersAPI.update() from api.js instead");
    const { data, error } = await supabase
        .from("officers")
        .update(updates)
        .eq("id", id)
        .select();

    return { data: data?.[0], error };
};

// @deprecated Use announcementsAPI from api.js
export const createAnnouncement = async (announcementData) => {
    console.warn(
        "DEPRECATED: Use announcementsAPI.create() from api.js instead"
    );
    const { data, error } = await supabase
        .from("announcements")
        .insert([announcementData])
        .select();

    return { data: data?.[0], error };
};

// @deprecated Use announcementsAPI from api.js
export const updateAnnouncement = async (id, updates) => {
    console.warn(
        "DEPRECATED: Use announcementsAPI.update() from api.js instead"
    );
    const { data, error } = await supabase
        .from("announcements")
        .update(updates)
        .eq("id", id)
        .select();

    return { data: data?.[0], error };
};

// @deprecated Use announcementsAPI from api.js
export const deleteAnnouncement = async (id) => {
    console.warn(
        "DEPRECATED: Use announcementsAPI.delete() from api.js instead"
    );
    const { error } = await supabase
        .from("announcements")
        .delete()
        .eq("id", id);
    return { error };
};

// Officer operations
// @deprecated Use officersAPI.create() from api.js
export const createOfficer = async (officerData) => {
    const { data, error } = await supabase
        .from("officers")
        .insert([officerData])
        .select();

    return { data, error };
};

export const deleteOfficer = async (id) => {
    const { data, error } = await supabase
        .from("officers")
        .delete()
        .eq("id", id);

    return { data, error };
};

export const updateOfficersOrder = async (officers) => {
    // Batch update order_index for multiple officers
    // We need to send the full officer object to avoid overwriting other fields
    const updates = officers.map((officer, index) => ({
        id: officer.id,
        name: officer.name,
        position: officer.position,
        branch: officer.branch,
        email: officer.email,
        phone: officer.phone,
        image_url: officer.image_url,
        college: officer.college,
        is_active: officer.is_active,
        order_index: index,
    }));

    const { data, error } = await supabase
        .from("officers")
        .upsert(updates, { onConflict: "id" })
        .select();

    return { data, error };
};

export const updateCommittee = async (id, updates) => {
    const { data, error } = await supabase
        .from("committees")
        .update(updates)
        .eq("id", id)
        .select();

    return { data, error };
};

export const createCommittee = async (committeeData) => {
    const { data, error } = await supabase
        .from("committees")
        .insert([committeeData])
        .select();

    return { data, error };
};

export const deleteCommittee = async (id) => {
    const { data, error } = await supabase
        .from("committees")
        .delete()
        .eq("id", id);

    return { data, error };
};

export const updateOrganization = async (id, updates) => {
    const { data, error } = await supabase
        .from("organizations")
        .update(updates)
        .eq("id", id)
        .select();

    return { data, error };
};

export const createOrganization = async (orgData) => {
    const { data, error } = await supabase
        .from("organizations")
        .insert([orgData])
        .select();

    return { data, error };
};

export const updateGovernanceDocument = async (id, updates) => {
    const { data, error } = await supabase
        .from("governance_documents")
        .update(updates)
        .eq("id", id)
        .select();

    return { data, error };
};

export const createGovernanceDocument = async (docData) => {
    const { data, error } = await supabase
        .from("governance_documents")
        .insert([docData])
        .select();

    return { data, error };
};

export const updateSiteContent = async (
    section,
    key,
    value,
    metadata = null
) => {
    const { data, error } = await supabase
        .from("site_content")
        .upsert([{ section, key, value, metadata }], {
            onConflict: "section,key",
        })
        .select();

    return { data, error };
};

export const updatePageContent = async (slug, updates) => {
    const { data, error } = await supabase
        .from("page_content")
        .upsert([{ page_slug: slug, ...updates }], { onConflict: "page_slug" })
        .select();

    return { data, error };
};

// Issuances CRUD operations
export const createIssuance = async (issuanceData) => {
    const { data, error } = await supabase
        .from("issuances")
        .insert([issuanceData])
        .select();

    return { data, error };
};

export const updateIssuance = async (id, updates) => {
    const { data, error } = await supabase
        .from("issuances")
        .update(updates)
        .eq("id", id)
        .select();

    return { data, error };
};

export const deleteIssuance = async (id) => {
    const { data, error } = await supabase
        .from("issuances")
        .delete()
        .eq("id", id);

    return { data, error };
};
