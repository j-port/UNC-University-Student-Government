import { useState, useEffect, useCallback } from "react";
import {
    fetchCommittees,
    createCommittee,
    updateCommittee,
    deleteCommittee,
} from "../api";

/**
 * Custom hook for managing committees with CRUD operations
 * @returns {Object} Committees data and CRUD operations
 */
export const useCommittees = () => {
    const [committees, setCommittees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch committees
    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        const { data, error: fetchError } = await fetchCommittees();

        if (fetchError) {
            setError(fetchError.message || "Failed to fetch committees");
            setCommittees([]);
        } else {
            setCommittees(data || []);
        }

        setLoading(false);
    }, []);

    // Load on mount
    useEffect(() => {
        load();
    }, [load]);

    // Create new committee
    const create = useCallback(async (committeeData) => {
        const { data, error: createError } = await createCommittee(
            committeeData
        );

        if (createError) {
            throw new Error(
                createError.message || "Failed to create committee"
            );
        }

        // Add to local state
        if (data && data[0]) {
            setCommittees((prev) => [...prev, data[0]]);
        }

        return data;
    }, []);

    // Update existing committee
    const update = useCallback(async (id, updates) => {
        const { data, error: updateError } = await updateCommittee(id, updates);

        if (updateError) {
            throw new Error(
                updateError.message || "Failed to update committee"
            );
        }

        // Update in local state
        if (data && data[0]) {
            setCommittees((prev) =>
                prev.map((committee) =>
                    committee.id === id ? data[0] : committee
                )
            );
        }

        return data;
    }, []);

    // Delete committee
    const remove = useCallback(async (id) => {
        const { error: deleteError } = await deleteCommittee(id);

        if (deleteError) {
            throw new Error(
                deleteError.message || "Failed to delete committee"
            );
        }

        // Remove from local state
        setCommittees((prev) =>
            prev.filter((committee) => committee.id !== id)
        );
    }, []);

    return {
        committees,
        loading,
        error,
        create,
        update,
        remove,
        reload: load,
    };
};
