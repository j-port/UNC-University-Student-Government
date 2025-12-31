import { useState, useEffect, useCallback } from "react";
import { notificationsAPI } from "../lib/api";

/**
 * Custom hook for managing real-time notifications via backend API
 * Tracks new feedback and important status changes
 */
export function useNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [lastChecked, setLastChecked] = useState(() => {
        const stored = localStorage.getItem("admin-last-checked");
        return stored ? new Date(stored) : new Date();
    });

    // Fetch notifications (new feedback since last check)
    const fetchNotifications = useCallback(async () => {
        try {
            // Get feedback created after last check
            const response = await notificationsAPI.getNewFeedback(
                lastChecked.toISOString()
            );
            if (!response.success) throw new Error(response.error);

            const newFeedback = response.data;
            const notificationList = [];

            // Add new feedback notifications
            newFeedback?.forEach((item) => {
                notificationList.push({
                    id: `feedback-${item.id}`,
                    type: "new_feedback",
                    title: "New Feedback Received",
                    message: `${item.name || "Anonymous"} submitted feedback: ${
                        item.subject
                    }`,
                    category: item.category,
                    status: item.status,
                    referenceNumber: item.reference_number,
                    feedbackId: item.id,
                    timestamp: item.created_at,
                    read: false,
                });
            });

            // Get feedback with status changes (for demo, we'll focus on new feedback)
            // In production, you'd track status changes in a separate table

            setNotifications((prev) => {
                const existing = prev.filter((n) => n.read);
                return [...notificationList, ...existing];
            });

            setUnreadCount(notificationList.length);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    }, [lastChecked]);

    // Mark notification as read
    const markAsRead = useCallback((notificationId) => {
        setNotifications((prev) =>
            prev.map((n) =>
                n.id === notificationId ? { ...n, read: true } : n
            )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
    }, []);

    // Mark all as read
    const markAllAsRead = useCallback(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
        const now = new Date();
        setLastChecked(now);
        localStorage.setItem("admin-last-checked", now.toISOString());
    }, []);

    // Clear old notifications
    const clearNotification = useCallback(
        (notificationId) => {
            setNotifications((prev) =>
                prev.filter((n) => n.id !== notificationId)
            );
            setUnreadCount((prev) => {
                const notification = notifications.find(
                    (n) => n.id === notificationId
                );
                return notification && !notification.read
                    ? Math.max(0, prev - 1)
                    : prev;
            });
        },
        [notifications]
    );

    // Clear all notifications
    const clearAll = useCallback(() => {
        setNotifications([]);
        setUnreadCount(0);
    }, []);

    // Fetch notifications on mount and set up polling
    useEffect(() => {
        fetchNotifications();

        // Poll for new notifications every 30 seconds
        const interval = setInterval(() => {
            fetchNotifications();
        }, 30000);

        return () => {
            clearInterval(interval);
        };
    }, [fetchNotifications]);

    // Request notification permission on mount
    useEffect(() => {
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission();
        }
    }, []);

    return {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearNotification,
        clearAll,
        refresh: fetchNotifications,
    };
}
