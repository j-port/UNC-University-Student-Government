import { useState, useEffect, useCallback } from "react";
import {
    fetchAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
} from "../api/announcements";

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
     * @param {boolean} silent - If true, don't show loading state (for background refreshes)
     */
    const fetchAll = useCallback(async (silent = false) => {
        try {
            if (!silent) {
                setLoading(true);
                setError(null);
            }

            const { data, error: fetchError } = await fetchAnnouncements({
                limit: null,
            }); // Fetch all for admin

            if (fetchError) {
                throw new Error(
                    fetchError.message || "Failed to fetch announcements"
                );
            }

            console.log("Fetched announcements:", data?.length, "items");
            setAnnouncements(data || []);
        } catch (err) {
            // Suppress console error for expected "table not found" during development
            if (!err.message?.includes("Could not find the table")) {
                console.error("Error fetching announcements:", err);
            }
            if (!silent) {
                setError(err.message);
            }
            setAnnouncements([]); // Ensure empty array on error
        } finally {
            if (!silent) {
                setLoading(false);
            }
        }
    }, []);

    /**
     * Create a new announcement
     * @param {Object} announcementData - Announcement data
     */
    const create = useCallback(
        async (announcementData) => {
            try {
                const { error: createError } = await createAnnouncement(
                    announcementData
                );

                if (createError) {
                    throw new Error(
                        createError.message || "Failed to create announcement"
                    );
                }

                // Silently refetch all data to get the new item
                await fetchAll(true);
            } catch (err) {
                console.error("Error creating announcement:", err);
                throw err;
            }
        },
        [fetchAll]
    );

    /**
     * Update an existing announcement
     * @param {string} id - Announcement ID
     * @param {Object} updates - Updated data
     */
    const update = useCallback(
        async (id, updates) => {
            try {
                // Optimistic update
                const previousAnnouncements = [...announcements];
                setAnnouncements((prev) =>
                    prev
                        .filter((item) => item !== null)
                        .map((item) =>
                            item.id === id ? { ...item, ...updates } : item
                        )
                );

                console.log("Updating announcement:", { id, updates });
                const { error: updateError } = await updateAnnouncement(
                    id,
                    updates
                );

                if (updateError) {
                    console.error("Update error:", updateError);
                    // Rollback on error
                    setAnnouncements(previousAnnouncements);
                    throw new Error(
                        updateError.message || "Failed to update announcement"
                    );
                }

                console.log("Update successful, refetching...");
                // Silently refetch to get accurate data without showing loading state
                await fetchAll(true);
                console.log("Refetch complete");
            } catch (err) {
                console.error("Error updating announcement:", err);
                throw err;
            }
        },
        [announcements, fetchAll]
    );

    /**
     * Delete an announcement
     * @param {string} id - Announcement ID
     */
    const remove = useCallback(
        async (id) => {
            try {
                // Optimistic update
                const previousAnnouncements = [...announcements];
                setAnnouncements((prev) =>
                    prev.filter((item) => item.id !== id)
                );

                const { error: deleteError } = await deleteAnnouncement(id);

                if (deleteError) {
                    // Rollback on error
                    setAnnouncements(previousAnnouncements);
                    throw new Error(
                        deleteError.message || "Failed to delete announcement"
                    );
                }
            } catch (err) {
                console.error("Error deleting announcement:", err);
                throw err;
            }
        },
        [announcements]
    );

    /**
     * Toggle announcement status between published and draft
     * @param {string} id - Announcement ID
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

                console.log("Toggling status:", {
                    id,
                    currentStatus: announcement.status,
                    newStatus,
                    updates,
                });
                await update(id, updates);
                console.log("Status toggled successfully");
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
