import { AppError } from "../utils/errors.js";

/**
 * Global error handling middleware
 * Catches all errors and formats them consistently
 */
export const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    error.statusCode = err.statusCode || 500;

    // Log error for debugging
    if (process.env.NODE_ENV === "development") {
        console.error("Error:", {
            message: err.message,
            stack: err.stack,
            statusCode: error.statusCode,
        });
    } else {
        // In production, only log operational errors
        if (err.isOperational) {
            console.error("Operational Error:", err.message);
        } else {
            console.error("Programming Error:", err.stack);
        }
    }

    // Supabase/PostgreSQL specific errors
    if (err.code === "PGRST116" || err.code === "23505") {
        error.message = "Resource already exists";
        error.statusCode = 409;
    }

    if (err.code === "PGRST301" || err.code === "23503") {
        error.message = "Referenced resource not found";
        error.statusCode = 404;
    }

    // JWT errors
    if (err.name === "JsonWebTokenError") {
        error.message = "Invalid token";
        error.statusCode = 401;
    }

    if (err.name === "TokenExpiredError") {
        error.message = "Token expired";
        error.statusCode = 401;
    }

    // Zod validation errors
    if (err.name === "ZodError") {
        error.message = err.errors.map((e) => e.message).join(", ");
        error.statusCode = 400;
    }

    // Send error response
    res.status(error.statusCode).json({
        success: false,
        error: error.message,
        ...(process.env.NODE_ENV === "development" && {
            stack: err.stack,
            details: err,
        }),
    });
};

/**
 * Catch async errors without try-catch blocks
 * Usage: router.get('/', catchAsync(async (req, res) => { ... }))
 */
export const catchAsync = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

/**
 * Handle 404 - Route not found
 */
export const notFound = (req, res, next) => {
    const error = new AppError(`Cannot ${req.method} ${req.originalUrl}`, 404);
    next(error);
};
