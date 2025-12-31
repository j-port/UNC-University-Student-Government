import { supabase } from "./supabase";

/**
 * Fetch all active committees
 */
export const fetchCommittees = async () => {
    const { data, error } = await supabase
        .from("committees")
        .select("*")
        .eq("is_active", true)
        .order("order_index", { ascending: true });

    return { data, error };
};

/**
 * Update an existing committee
 */
export const updateCommittee = async (id, updates) => {
    const { data, error } = await supabase
        .from("committees")
        .update(updates)
        .eq("id", id)
        .select();

    return { data, error };
};

/**
 * Create a new committee
 */
export const createCommittee = async (committeeData) => {
    const { data, error } = await supabase
        .from("committees")
        .insert([committeeData])
        .select();

    return { data, error };
};

/**
 * Delete a committee
 */
export const deleteCommittee = async (id) => {
    const { data, error } = await supabase
        .from("committees")
        .delete()
        .eq("id", id);

    return { data, error };
};
