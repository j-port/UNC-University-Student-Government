import express from "express";
import { db } from "../db/index.js";
import { catchAsync } from "../middleware/errorHandler.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import { feedbackLimiter } from "../middleware/rateLimiter.js";
import { validate } from "../middleware/validateRequest.js";
import {
    createFeedbackSchema,
    updateFeedbackStatusSchema,
    idParamSchema,
    referenceNumberParamSchema,
} from "../middleware/validation.js";
import { NotFoundError } from "../utils/errors.js";

const router = express.Router();

// Get all feedback (admin only)
router.get(
    "/",
    authenticate,
    requireAdmin,
    catchAsync(async (req, res) => {
        const data = await db.feedback.getAll();
        res.json({ success: true, data });
    })
);

// Create new feedback (rate limited)
router.post(
    "/",
    feedbackLimiter,
    validate(createFeedbackSchema),
    catchAsync(async (req, res) => {
        const data = await db.feedback.createWithReference(req.body);
        res.status(201).json({ success: true, data });
    })
);

// Update feedback status (admin only)
router.put(
    "/:id",
    authenticate,
    requireAdmin,
    validate(updateFeedbackStatusSchema),
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const data = await db.feedback.update(id, req.body);

        if (!data) {
            throw new NotFoundError("Feedback");
        }

        res.json({ success: true, data });
    })
);

// Delete feedback (admin only)
router.delete(
    "/:id",
    authenticate,
    requireAdmin,
    validate(idParamSchema),
    catchAsync(async (req, res) => {
        const { id } = req.params;
        await db.feedback.delete(id);
        res.json({ success: true, message: "Feedback deleted successfully" });
    })
);

// Track feedback by reference number (public)
router.get(
    "/track/:referenceNumber",
    validate(referenceNumberParamSchema),
    catchAsync(async (req, res) => {
        const { referenceNumber } = req.params;
        const data = await db.feedback.findByReference(referenceNumber);

        if (!data) {
            throw new NotFoundError("Feedback with that reference number");
        }

        res.json({ success: true, data });
    })
);

export default router;
