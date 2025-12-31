import { supabase } from "./supabase";

/**
 * Fetch announcements with optional limit
 */
export const fetchAnnouncements = async (limit = 10) => {
    const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

    return { data, error };
};

/**
 * Fetch issuances with optional limit
 */
export const fetchIssuances = async (limit = 10) => {
    const { data, error } = await supabase
        .from("issuances")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

    return { data, error };
};
