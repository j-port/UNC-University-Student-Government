import { supabase } from "./supabase";

/**
 * Fetch organizations with optional filters
 * @param {string|null} type - Organization type
 * @param {string|null} college - College filter
 */
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

/**
 * Update an organization
 */
export const updateOrganization = async (id, updates) => {
    const { data, error } = await supabase
        .from("organizations")
        .update(updates)
        .eq("id", id)
        .select();

    return { data, error };
};

/**
 * Create a new organization
 */
export const createOrganization = async (orgData) => {
    const { data, error } = await supabase
        .from("organizations")
        .insert([orgData])
        .select();

    return { data, error };
};
