import { supabase } from "./supabase";

/**
 * Fetch officers by branch
 * @param {string|null} branch - "executive", "legislative", or null for all
 */
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

/**
 * Update an existing officer
 */
export const updateOfficer = async (id, updates) => {
    const { data, error } = await supabase
        .from("officers")
        .update(updates)
        .eq("id", id)
        .select();

    return { data, error };
};

/**
 * Create a new officer
 */
export const createOfficer = async (officerData) => {
    const { data, error } = await supabase
        .from("officers")
        .insert([officerData])
        .select();

    return { data, error };
};

/**
 * Delete an officer
 */
export const deleteOfficer = async (id) => {
    const { data, error } = await supabase
        .from("officers")
        .delete()
        .eq("id", id);

    return { data, error };
};

/**
 * Batch update officer order (for drag-and-drop)
 */
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
