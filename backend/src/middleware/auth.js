import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";
import { UnauthorizedError, ForbiddenError } from "../utils/errors.js";

// Create Supabase client for JWT verification
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

/**
 * Verify JWT token from Supabase
 * Attaches user info to req.user
 */
export const authenticate = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedError("No token provided");
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token with Supabase
        const {
            data: { user },
            error,
        } = await supabase.auth.getUser(token);

        if (error || !user) {
            throw new UnauthorizedError("Invalid or expired token");
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

/**
 * Require admin access (UNC email)
 * Must be used after authenticate middleware
 */
export const requireAdmin = (req, res, next) => {
    try {
        if (!req.user) {
            throw new UnauthorizedError("Authentication required");
        }

        // Check if user email ends with @unc.edu.ph
        const isAdmin = req.user.email?.endsWith("@unc.edu.ph");

        if (!isAdmin) {
            throw new ForbiddenError(
                "Admin access required. Only UNC emails are allowed."
            );
        }

        next();
    } catch (error) {
        next(error);
    }
};

/**
 * Optional authentication
 * Attaches user if token is valid, but doesn't block if no token
 */
export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.substring(7);
            const {
                data: { user },
            } = await supabase.auth.getUser(token);

            if (user) {
                req.user = user;
            }
        }

        next();
    } catch (error) {
        // Don't block request if token is invalid for optional auth
        next();
    }
};
