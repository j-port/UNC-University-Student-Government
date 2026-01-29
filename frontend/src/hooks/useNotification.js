import { useState, useCallback } from "react";

/**
 * Custom hook for managing toast notifications
 * @param {number} duration - Duration in milliseconds before auto-dismiss (default: 3000)
 * @returns {Object} Notification state and control functions
 */
export const useNotification = (duration = 3000) => {
    const [notification, setNotification] = useState(null);

    // Show notification
    const showNotification = useCallback(
        (message, type = "success") => {
            setNotification({ message, type });

            // Auto-dismiss after duration
            if (duration > 0) {
                setTimeout(() => {
                    setNotification(null);
                }, duration);
            }
        },
        [duration]
    );

    // Show success notification
    const showSuccess = useCallback(
        (message) => {
            showNotification(message, "success");
        },
        [showNotification]
    );

    // Show error notification
    const showError = useCallback(
        (message) => {
            showNotification(message, "error");
        },
        [showNotification]
    );

    // Show info notification
    const showInfo = useCallback(
        (message) => {
            showNotification(message, "info");
        },
        [showNotification]
    );

    // Show warning notification
    const showWarning = useCallback(
        (message) => {
            showNotification(message, "warning");
        },
        [showNotification]
    );

    // Manually dismiss notification
    const dismiss = useCallback(() => {
        setNotification(null);
    }, []);

    return {
        notification,
        showNotification,
        showSuccess,
        showError,
        showInfo,
        showWarning,
        dismiss,
    };
};
