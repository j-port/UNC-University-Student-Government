import { useState, useEffect } from "react";
import { statsAPI } from "../lib/api";

/**
 * Custom hook to fetch and calculate automated statistics from the backend API
 * This reduces manual admin work by auto-calculating counts from real data
 */
export function useAutomatedStats() {
    const [stats, setStats] = useState({
        eventsCount: 0,
        accomplishmentsCount: 0,
        totalBudget: 0,
        organizationsCount: 0,
        loading: true,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await statsAPI.getAutomated();
                if (!response.success) throw new Error(response.error);

                setStats({
                    ...response.data,
                    loading: false,
                });
            } catch (error) {
                console.error("Error fetching automated stats:", error);
                setStats((prev) => ({ ...prev, loading: false }));
            }
        };

        fetchStats();
    }, []);

    // Format budget for display (₱2.5M format)
    const formatBudget = (amount) => {
        if (amount >= 1000000) {
            return `₱${(amount / 1000000).toFixed(1)}M+`;
        } else if (amount >= 1000) {
            return `₱${(amount / 1000).toFixed(0)}K+`;
        }
        return `₱${amount}+`;
    };

    return {
        ...stats,
        formattedBudget: formatBudget(stats.totalBudget),
    };
}
