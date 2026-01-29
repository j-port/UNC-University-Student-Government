import { ZodError } from "zod";
import { ValidationError } from "../utils/errors.js";

/**
 * Validation middleware factory
 * Validates request data against a Zod schema
 */
export const validate = (schema) => {
    return (req, res, next) => {
        try {
            // Validate the request data
            const validated = schema.parse({
                body: req.body,
                params: req.params,
                query: req.query,
            });

            // Replace request data with validated data
            req.body = validated.body || req.body;
            req.params = validated.params || req.params;
            req.query = validated.query || req.query;

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                // Format Zod errors nicely
                const errors = error.errors.map((err) => ({
                    field: err.path.join("."),
                    message: err.message,
                }));

                return res.status(400).json({
                    success: false,
                    error: "Validation failed",
                    details: errors,
                });
            }
            next(error);
        }
    };
};
