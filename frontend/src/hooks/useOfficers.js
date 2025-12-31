import { useState, useEffect, useCallback } from "react";
import { officersAPI } from "../lib/api";

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
        const response = await officersAPI.getAll(branch);

        if (!response.success) {
            setError(response.error || "Failed to fetch officers");
            setOfficers([]);
        } else {
            setOfficers(response.data || []);
        }

        setLoading(false);
    }, [branch]);

    // Load on mount and when branch changes
    useEffect(() => {
        load();
    }, [load]);

    // Create new officer
    const create = useCallback(async (officerData) => {
        const response = await officersAPI.create(officerData);

        if (!response.success) {
            throw new Error(response.error || "Failed to create officer");
        }

        // Add to local state
        if (response.data) {
            setOfficers((prev) => [...prev, response.data]);
        }

        return response.data;
    }, []);

    // Update existing officer
    const update = useCallback(async (id, updates) => {
        const response = await officersAPI.update(id, updates);

        if (!response.success) {
            throw new Error(response.error || "Failed to update officer");
        }

        // Update in local state
        if (response.data) {
            setOfficers((prev) =>
                prev.map((officer) =>
                    officer.id === id ? response.data : officer
                )
            );
        }

        return response.data;
    }, []);

    // Delete officer
    const remove = useCallback(async (id) => {
        const response = await officersAPI.delete(id);

        if (!response.success) {
            throw new Error(response.error || "Failed to delete officer");
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

            try {
                // Update each officer's order_index individually
                for (let i = 0; i < reorderedOfficers.length; i++) {
                    const officer = reorderedOfficers[i];
                    const response = await officersAPI.update(officer.id, {
                        order_index: i,
                    });
                    if (!response.success) {
                        throw new Error(response.error);
                    }
                }
            } catch (err) {
                // Rollback on error
                setOfficers(previousOfficers);
                throw new Error(err.message || "Failed to reorder officers");
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
