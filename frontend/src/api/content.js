import { supabase } from "./supabase";

/**
 * Fetch site content by section
 * @param {string|null} section - Content section filter
 */
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

/**
 * Update site content
 */
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

/**
 * Fetch page content by slug
 * @param {string} slug - Page slug identifier
 */
export const fetchPageContent = async (slug) => {
    const { data, error } = await supabase
        .from("page_content")
        .select("*")
        .eq("page_slug", slug)
        .single();

    return { data, error };
};

/**
 * Update page content
 */
export const updatePageContent = async (slug, updates) => {
    const { data, error } = await supabase
        .from("page_content")
        .upsert([{ page_slug: slug, ...updates }], { onConflict: "page_slug" })
        .select();

    return { data, error };
};
