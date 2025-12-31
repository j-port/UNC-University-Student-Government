import { supabase } from "./supabase";

/**
 * Fetch governance documents (constitution, bylaws, etc.)
 * @param {string|null} type - "constitution", "bylaws", etc.
 */
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

/**
 * Update a governance document
 */
export const updateGovernanceDocument = async (id, updates) => {
    const { data, error } = await supabase
        .from("governance_documents")
        .update(updates)
        .eq("id", id)
        .select();

    return { data, error };
};

/**
 * Create a new governance document
 */
export const createGovernanceDocument = async (docData) => {
    const { data, error } = await supabase
        .from("governance_documents")
        .insert([docData])
        .select();

    return { data, error };
};
