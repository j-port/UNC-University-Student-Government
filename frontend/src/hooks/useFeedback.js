import { useState, useEffect, useCallback } from "react";
import { supabase } from "../api";

/**
 * Custom hook for managing feedback data
 * @returns {Object} Feedback state and methods
 */
export function useFeedback() {
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Fetch all feedback from the database
     */
    const fetchFeedback = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from("feedback")
                .select("*")
                .order("created_at", { ascending: false });

            if (fetchError) throw fetchError;

            // Transform data to match component structure
            const transformedData = (data || []).map((item) => ({
                id: item.id,
                referenceNumber:
                    item.reference_number ||
                    `TNG-${new Date(item.created_at)
                        .toISOString()
                        .slice(0, 10)
                        .replace(/-/g, "")}-${item.id}`,
                fullName: item.name,
                email: item.email,
                studentId: item.student_id,
                college: item.college,
                category: item.category,
                subject: item.subject || "No Subject",
                message: item.message,
                status: item.status || "pending",
                isAnonymous: item.is_anonymous || false,
                createdAt: item.created_at,
            }));

            setFeedback(transformedData);
        } catch (err) {
            console.error("Error fetching feedback:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Update feedback status
     * @param {string} id - Feedback ID
     * @param {string} newStatus - New status value
     */
    const updateStatus = useCallback(
        async (id, newStatus) => {
            try {
                // Optimistic update
                const previousFeedback = [...feedback];
                setFeedback((prev) =>
                    prev.map((item) =>
                        item.id === id ? { ...item, status: newStatus } : item
                    )
                );

                const { error: updateError } = await supabase
                    .from("feedback")
                    .update({ status: newStatus })
                    .eq("id", id);

                if (updateError) {
                    // Rollback on error
                    setFeedback(previousFeedback);
                    throw updateError;
                }
            } catch (err) {
                console.error("Error updating feedback status:", err);
                throw err;
            }
        },
        [feedback]
    );

    /**
     * Delete feedback
     * @param {string} id - Feedback ID
     */
    const remove = useCallback(
        async (id) => {
            try {
                // Optimistic update
                const previousFeedback = [...feedback];
                setFeedback((prev) => prev.filter((item) => item.id !== id));

                const { error: deleteError } = await supabase
                    .from("feedback")
                    .delete()
                    .eq("id", id);

                if (deleteError) {
                    // Rollback on error
                    setFeedback(previousFeedback);
                    throw deleteError;
                }
            } catch (err) {
                console.error("Error deleting feedback:", err);
                throw err;
            }
        },
        [feedback]
    );

    /**
     * Reload feedback data
     */
    const reload = useCallback(() => {
        fetchFeedback();
    }, [fetchFeedback]);

    // Initial fetch
    useEffect(() => {
        fetchFeedback();
    }, [fetchFeedback]);

    return {
        feedback,
        loading,
        error,
        updateStatus,
        remove,
        reload,
    };
}
