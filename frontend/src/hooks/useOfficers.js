import { useState, useEffect, useCallback } from "react";
import {
    fetchOfficers,
    createOfficer,
    updateOfficer,
    deleteOfficer,
    updateOfficersOrder,
} from "../api";

/**
 * Custom hook for managing officers with CRUD operations
 * @param {string} branch - "executive", "legislative", or null for all
 * @returns {Object} Officers data and CRUD operations
 */
export const useOfficers = (branch = null) => {
    const [officers, setOfficers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch officers
    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        const { data, error: fetchError } = await fetchOfficers(branch);

        if (fetchError) {
            setError(fetchError.message || "Failed to fetch officers");
            setOfficers([]);
        } else {
            setOfficers(data || []);
        }

        setLoading(false);
    }, [branch]);

    // Load on mount and when branch changes
    useEffect(() => {
        load();
    }, [load]);

    // Create new officer
    const create = useCallback(async (officerData) => {
        const { data, error: createError } = await createOfficer(officerData);

        if (createError) {
            throw new Error(createError.message || "Failed to create officer");
        }

        // Add to local state
        if (data && data[0]) {
            setOfficers((prev) => [...prev, data[0]]);
        }

        return data;
    }, []);

    // Update existing officer
    const update = useCallback(async (id, updates) => {
        const { data, error: updateError } = await updateOfficer(id, updates);

        if (updateError) {
            throw new Error(updateError.message || "Failed to update officer");
        }

        // Update in local state
        if (data && data[0]) {
            setOfficers((prev) =>
                prev.map((officer) => (officer.id === id ? data[0] : officer))
            );
        }

        return data;
    }, []);

    // Delete officer
    const remove = useCallback(async (id) => {
        const { error: deleteError } = await deleteOfficer(id);

        if (deleteError) {
            throw new Error(deleteError.message || "Failed to delete officer");
        }

        // Remove from local state
        setOfficers((prev) => prev.filter((officer) => officer.id !== id));
    }, []);

    // Reorder officers (drag-and-drop)
    const reorder = useCallback(
        async (reorderedOfficers) => {
            // Optimistic update
            const previousOfficers = officers;
            setOfficers(reorderedOfficers);

            const { error: reorderError } = await updateOfficersOrder(
                reorderedOfficers
            );

            if (reorderError) {
                // Rollback on error
                setOfficers(previousOfficers);
                throw new Error(
                    reorderError.message || "Failed to reorder officers"
                );
            }
        },
        [officers]
    );

    return {
        officers,
        loading,
        error,
        create,
        update,
        remove,
        reorder,
        reload: load,
    };
};
