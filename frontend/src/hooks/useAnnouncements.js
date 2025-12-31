import { useState, useEffect, useCallback } from "react";
import { fetchAnnouncements } from "../api/announcements";

/**
 * Custom hook for managing announcements
 * @returns {Object} Announcements state and methods
 */
export function useAnnouncements() {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Fetch all announcements from the API
     */
    const fetchAll = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await fetchAnnouncements();

            if (fetchError) {
                throw new Error(
                    fetchError.message || "Failed to fetch announcements"
                );
            }

            setAnnouncements(data || []);
        } catch (err) {
            // Suppress console error for expected "table not found" during development
            if (!err.message?.includes("Could not find the table")) {
                console.error("Error fetching announcements:", err);
            }
            setError(err.message);
            setAnnouncements([]); // Ensure empty array on error
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Create a new announcement (local only for now - needs API implementation)
     * @param {Object} announcementData - Announcement data
     */
    const create = useCallback(async (announcementData) => {
        try {
            const newItem = {
                id: Date.now(),
                ...announcementData,
                created_at: new Date().toISOString(),
                published_at:
                    announcementData.status === "published"
                        ? new Date().toISOString()
                        : null,
            };

            setAnnouncements((prev) => [newItem, ...prev]);
            return newItem;
        } catch (err) {
            console.error("Error creating announcement:", err);
            throw err;
        }
    }, []);

    /**
     * Update an existing announcement
     * @param {number} id - Announcement ID
     * @param {Object} updates - Updated data
     */
    const update = useCallback(
        async (id, updates) => {
            try {
                // Optimistic update
                const previousAnnouncements = [...announcements];
                setAnnouncements((prev) =>
                    prev.map((item) =>
                        item.id === id ? { ...item, ...updates } : item
                    )
                );

                // TODO: API call would go here
                // await updateAnnouncement(id, updates)
            } catch (err) {
                // Rollback on error
                setAnnouncements(previousAnnouncements);
                console.error("Error updating announcement:", err);
                throw err;
            }
        },
        [announcements]
    );

    /**
     * Delete an announcement
     * @param {number} id - Announcement ID
     */
    const remove = useCallback(
        async (id) => {
            try {
                // Optimistic update
                const previousAnnouncements = [...announcements];
                setAnnouncements((prev) =>
                    prev.filter((item) => item.id !== id)
                );

                // TODO: API call would go here
                // await deleteAnnouncement(id)
            } catch (err) {
                // Rollback on error
                setAnnouncements(previousAnnouncements);
                console.error("Error deleting announcement:", err);
                throw err;
            }
        },
        [announcements]
    );

    /**
     * Toggle announcement status between published and draft
     * @param {number} id - Announcement ID
     */
    const toggleStatus = useCallback(
        async (id) => {
            try {
                const announcement = announcements.find(
                    (item) => item.id === id
                );
                if (!announcement) return;

                const newStatus =
                    announcement.status === "published" ? "draft" : "published";
                const updates = {
                    status: newStatus,
                    published_at:
                        newStatus === "published"
                            ? new Date().toISOString()
                            : null,
                };

                await update(id, updates);
            } catch (err) {
                console.error("Error toggling status:", err);
                throw err;
            }
        },
        [announcements, update]
    );

    /**
     * Reload announcements data
     */
    const reload = useCallback(() => {
        fetchAll();
    }, [fetchAll]);

    // Initial fetch
    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    return {
        announcements,
        loading,
        error,
        create,
        update,
        remove,
        toggleStatus,
        reload,
    };
}
