import { supabase } from "./supabase";

/**
 * Fetch announcements with optional limit and filters
 * @param {Object} options - Query options
 * @param {number} options.limit - Maximum number of results
 * @param {string} options.status - Filter by status (published, draft, archived)
 */
export const fetchAnnouncements = async ({
    limit = 10,
    status = null,
} = {}) => {
    // Debug: Check if user is authenticated
    const {
        data: { session },
    } = await supabase.auth.getSession();
    console.log(
        "Fetching announcements - Authenticated:",
        !!session?.user,
        "Email:",
        session?.user?.email
    );

    let query = supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });

    if (status) {
        query = query.eq("status", status);
    }

    if (limit) {
        query = query.limit(limit);
    }

    const { data, error } = await query;
    return { data, error };
};

/**
 * Fetch a single announcement by ID
 * @param {string} id - Announcement ID
 */
export const fetchAnnouncementById = async (id) => {
    const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .eq("id", id)
        .single();

    return { data, error };
};

/**
 * Create a new announcement
 * @param {Object} announcementData - Announcement data
 */
export const createAnnouncement = async (announcementData) => {
    const { data, error } = await supabase
        .from("announcements")
        .insert(announcementData)
        .select();

    // Return first item if array, or data if single object
    return { data: Array.isArray(data) ? data[0] : data, error };
};

/**
 * Update an existing announcement
 * @param {string} id - Announcement ID
 * @param {Object} updates - Fields to update
 */
export const updateAnnouncement = async (id, updates) => {
    const { data, error } = await supabase
        .from("announcements")
        .update(updates)
        .eq("id", id)
        .select();

    // Return first item if array, or data if single object
    return { data: Array.isArray(data) ? data[0] : data, error };
};

/**
 * Delete an announcement
 * @param {string} id - Announcement ID
 */
export const deleteAnnouncement = async (id) => {
    const { data, error } = await supabase
        .from("announcements")
        .delete()
        .eq("id", id);

    return { data, error };
};

/**
 * Fetch issuances with optional limit and filters
 * @param {Object} options - Query options
 * @param {number} options.limit - Maximum number of results
 * @param {string} options.status - Filter by status (published, draft, archived)
 */
export const fetchIssuances = async ({ limit = 10, status = null } = {}) => {
    let query = supabase
        .from("issuances")
        .select("*")
        .order("created_at", { ascending: false });

    if (status) {
        query = query.eq("status", status);
    }

    if (limit) {
        query = query.limit(limit);
    }

    const { data, error } = await query;
    return { data, error };
};

/**
 * Create a new issuance
 * @param {Object} issuanceData - Issuance data
 */
export const createIssuance = async (issuanceData) => {
    const { data, error } = await supabase
        .from("issuances")
        .insert(issuanceData)
        .select();

    return { data: Array.isArray(data) ? data[0] : data, error };
};

/**
 * Update an existing issuance
 * @param {string} id - Issuance ID
 * @param {Object} updates - Updated data
 */
export const updateIssuance = async (id, updates) => {
    const { data, error } = await supabase
        .from("issuances")
        .update(updates)
        .eq("id", id)
        .select();

    return { data: Array.isArray(data) ? data[0] : data, error };
};

/**
 * Delete an issuance
 * @param {string} id - Issuance ID
 */
export const deleteIssuance = async (id) => {
    const { data, error } = await supabase
        .from("issuances")
        .delete()
        .eq("id", id);

    return { data, error };
};
