import { useState, useEffect, useCallback } from "react";
import { issuancesAPI } from "../lib/api";

/**
 * Custom hook for managing issuances
 * @returns {Object} Issuances state and methods
 */
export function useIssuances() {
    const [issuances, setIssuances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Fetch all issuances from the API
     * @param {boolean} silent - If true, don't show loading state (for background refreshes)
     */
    const fetchAll = useCallback(async (silent = false) => {
        try {
            if (!silent) {
                setLoading(true);
                setError(null);
            }

            const response = await issuancesAPI.getAll();

            if (!response.success) {
                throw new Error(response.error || "Failed to fetch issuances");
            }

            setIssuances(response.data || []);
        } catch (err) {
            if (!err.message?.includes("Could not find the table")) {
                console.error("Error fetching issuances:", err);
            }
            if (!silent) {
                setError(err.message);
            }
            setIssuances([]);
        } finally {
            if (!silent) {
                setLoading(false);
            }
        }
    }, []);

    // Fetch on mount
    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    /**
     * Create a new issuance
     * @param {Object} issuanceData - Issuance data
     */
    const create = useCallback(
        async (issuanceData) => {
            try {
                const response = await issuancesAPI.create(issuanceData);

                if (!response.success) {
                    throw new Error(
                        response.error || "Failed to create issuance"
                    );
                }

                // Silently refetch all data to get the new item
                await fetchAll(true);
            } catch (err) {
                console.error("Error creating issuance:", err);
                throw err;
            }
        },
        [fetchAll]
    );

    /**
     * Update an existing issuance
     * @param {string} id - Issuance ID
     * @param {Object} updates - Updated data
     */
    const update = useCallback(
        async (id, updates) => {
            try {
                // Optimistic update
                const previousIssuances = [...issuances];
                setIssuances((prev) =>
                    prev
                        .filter((item) => item !== null)
                        .map((item) =>
                            item.id === id ? { ...item, ...updates } : item
                        )
                );

                const response = await issuancesAPI.update(id, updates);

                if (!response.success) {
                    // Rollback on error
                    setIssuances(previousIssuances);
                    throw new Error(
                        response.error || "Failed to update issuance"
                    );
                }

                // Silently refetch to get accurate data without showing loading state
                await fetchAll(true);
            } catch (err) {
                console.error("Error updating issuance:", err);
                throw err;
            }
        },
        [issuances, fetchAll]
    );

    /**
     * Delete an issuance
     * @param {string} id - Issuance ID
     */
    const remove = useCallback(
        async (id) => {
            try {
                // Optimistic delete
                const previousIssuances = [...issuances];
                setIssuances((prev) => prev.filter((item) => item.id !== id));

                const response = await issuancesAPI.delete(id);

                if (!response.success) {
                    // Rollback on error
                    setIssuances(previousIssuances);
                    throw new Error(
                        response.error || "Failed to delete issuance"
                    );
                }
            } catch (err) {
                console.error("Error deleting issuance:", err);
                throw err;
            }
        },
        [issuances]
    );

    /**
     * Toggle issuance status between published and draft
     * @param {string} id - Issuance ID
     */
    const toggleStatus = useCallback(
        async (id) => {
            try {
                const issuance = issuances.find((item) => item.id === id);
                if (!issuance) return;

                const newStatus =
                    issuance.status === "published" ? "draft" : "published";
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
        [issuances, update]
    );

    return {
        issuances,
        loading,
        error,
        fetchAll,
        create,
        update,
        remove,
        toggleStatus,
    };
}
