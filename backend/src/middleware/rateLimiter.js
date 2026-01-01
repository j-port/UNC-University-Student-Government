import rateLimit from "express-rate-limit";

/**
 * General API rate limiter
 * 100 requests per 15 minutes per IP
 */
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: {
        success: false,
        error: "Too many requests, please try again later",
    },
    standardHeaders: true, // Return rate limit info in headers
    legacyHeaders: false,
});

/**
 * Strict rate limiter for feedback/forms
 * 5 submissions per hour per IP
 */
export const feedbackLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 submissions per hour
    message: {
        success: false,
        error: "Too many submissions. Please wait before submitting again.",
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false, // Count all requests, even successful ones
});

/**
 * Admin route rate limiter
 * 200 requests per 15 minutes (higher limit for authenticated users)
 */
export const adminLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: {
        success: false,
        error: "Too many admin requests, please slow down",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Auth rate limiter (login attempts)
 * 5 attempts per 15 minutes per IP
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        error: "Too many login attempts. Please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // Only count failed attempts
});
