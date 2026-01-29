import { useState, useEffect, useCallback } from "react";
import { feedbackAPI } from "../lib/api";

/**
 * Custom hook for managing feedback data
 * @returns {Object} Feedback state and methods
 */
export function useFeedback() {
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Fetch all feedback from the database via backend API
     */
    const fetchFeedback = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await feedbackAPI.getAll();

            if (!response.success) {
                throw new Error(response.error || "Failed to fetch feedback");
            }

            const data = response.data;

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
                attachmentUrl: item.attachment_url,
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

                const response = await feedbackAPI.update(id, {
                    status: newStatus,
                });

                if (!response.success) {
                    // Rollback on error
                    setFeedback(previousFeedback);
                    throw new Error(
                        response.error || "Failed to update feedback"
                    );
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

                const response = await feedbackAPI.delete(id);

                if (!response.success) {
                    // Rollback on error
                    setFeedback(previousFeedback);
                    throw new Error(
                        response.error || "Failed to delete feedback"
                    );
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
        fetchFeedback,
    };
}
