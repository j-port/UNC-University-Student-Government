import { useState, useEffect, useCallback } from "react";
import { committeesAPI } from "../lib/api";

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
        const response = await committeesAPI.getAll();

        if (!response.success) {
            setError(response.error || "Failed to fetch committees");
            setCommittees([]);
        } else {
            setCommittees(response.data || []);
        }

        setLoading(false);
    }, []);

    // Load on mount
    useEffect(() => {
        load();
    }, [load]);

    // Create new committee
    const create = useCallback(async (committeeData) => {
        const response = await committeesAPI.create(committeeData);

        if (!response.success) {
            throw new Error(response.error || "Failed to create committee");
        }

        // Add to local state
        if (response.data) {
            setCommittees((prev) => [...prev, response.data]);
        }

        return response.data;
    }, []);

    // Update existing committee
    const update = useCallback(async (id, updates) => {
        const response = await committeesAPI.update(id, updates);

        if (!response.success) {
            throw new Error(response.error || "Failed to update committee");
        }

        // Update in local state
        if (response.data) {
            setCommittees((prev) =>
                prev.map((committee) =>
                    committee.id === id ? response.data : committee
                )
            );
        }

        return response.data;
    }, []);

    // Delete committee
    const remove = useCallback(async (id) => {
        const response = await committeesAPI.delete(id);

        if (!response.success) {
            throw new Error(response.error || "Failed to delete committee");
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
