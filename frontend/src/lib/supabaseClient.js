import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for common database operations
export const fetchFinancialTransactions = async (
    searchTerm = "",
    limit = 50
) => {
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

export const fetchAnnouncements = async (limit = 10) => {
    const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

    return { data, error };
};

export const fetchIssuances = async (limit = 10) => {
    const { data, error } = await supabase
        .from("issuances")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

    return { data, error };
};

export const submitFeedback = async (feedbackData) => {
    const { data, error } = await supabase
        .from("feedback")
        .insert([feedbackData]);

    return { data, error };
};

// Officers
export const fetchOfficers = async (branch = null) => {
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

// Organizations
export const fetchOrganizations = async (type = null, college = null) => {
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

// Committees
export const fetchCommittees = async () => {
    const { data, error } = await supabase
        .from("committees")
        .select("*")
        .eq("is_active", true)
        .order("order_index", { ascending: true });

    return { data, error };
};

// Governance Documents
export const fetchGovernanceDocuments = async (type = null) => {
    let query = supabase
        .from("governance_documents")
        .select("*")
        .eq("is_active", true)
        .order("order_index", { ascending: true });

    if (type) query = query.eq("type", type);

    const { data, error } = await query;
    return { data, error };
};

// Site Content
export const fetchSiteContent = async (section = null) => {
    let query = supabase
        .from("site_content")
        .select("*")
        .eq("is_active", true)
        .order("order_index", { ascending: true });

    if (section) query = query.eq("section", section);

    const { data, error } = await query;
    return { data, error };
};

// Page Content
export const fetchPageContent = async (slug) => {
    const { data, error } = await supabase
        .from("page_content")
        .select("*")
        .eq("page_slug", slug)
        .single();

    return { data, error };
};

// Admin functions for updating content
export const updateOfficer = async (id, updates) => {
    const { data, error } = await supabase
        .from("officers")
        .update(updates)
        .eq("id", id)
        .select();

    return { data, error };
};

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
