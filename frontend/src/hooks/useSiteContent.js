import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";

/**
 * Custom hook for managing dynamic site content
 * Fetches content from site_content and page_content tables
 * @returns {Object} Site content state and methods
 */
export function useSiteContent() {
    const [content, setContent] = useState({
        heroStats: [],
        homeStats: [],
        coreValues: [],
        achievements: [],
        heroFeatures: [],
        about: null,
        header: null,
        mission: null,
        vision: null,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Fetch all site content
     */
    const fetchContent = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch site_content (stats, values, achievements, features)
            const { data: siteData, error: siteError } = await supabase
                .from("site_content")
                .select("*")
                .eq("active", true)
                .order("display_order", { ascending: true });

            if (siteError) throw siteError;

            // Fetch page_content (about, mission, vision)
            const { data: pageData, error: pageError } = await supabase
                .from("page_content")
                .select("*")
                .in("page", ["about", "home"])
                .eq("active", true);

            if (pageError) throw pageError;

            // Transform site_content data by section
            const contentBySectionType = {
                heroStats: [],
                homeStats: [],
                coreValues: [],
                achievements: [],
                heroFeatures: [],
            };

            siteData?.forEach((item) => {
                const section = item.section_type;
                if (contentBySectionType.hasOwnProperty(section)) {
                    contentBySectionType[section].push({
                        id: item.id,
                        key: item.section_key,
                        title: item.title,
                        content: item.content,
                        icon: item.metadata?.icon || null,
                        value: item.metadata?.value || null,
                        label: item.metadata?.label || null,
                        description: item.metadata?.description || null,
                        path: item.metadata?.path || null,
                        color: item.metadata?.color || null,
                        order: item.display_order,
                    });
                }
            });

            // Transform page_content data
            const pageContentMap = {};
            pageData?.forEach((item) => {
                const key = item.section_key;
                pageContentMap[key] = {
                    id: item.id,
                    title: item.title,
                    content: item.content,
                };
            });

            setContent({
                ...contentBySectionType,
                about: pageContentMap.about || null,
                header: pageContentMap.header || null,
                mission: pageContentMap.mission || null,
                vision: pageContentMap.vision || null,
            });
        } catch (err) {
            console.error("Error fetching site content:", err);
            setError(err.message);

            // Set default fallback content
            setContent({
                heroStats: [],
                homeStats: [],
                coreValues: [],
                achievements: [],
                heroFeatures: [],
                about: null,
                header: null,
                mission: null,
                vision: null,
            });
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch on mount
    useEffect(() => {
        fetchContent();
    }, [fetchContent]);

    /**
     * Refresh content
     */
    const refresh = useCallback(() => {
        fetchContent();
    }, [fetchContent]);

    return {
        content,
        loading,
        error,
        refresh,
    };
}
