import express from "express";
import { db } from "../db/index.js";
import { catchAsync } from "../middleware/errorHandler.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Get new feedback since last check (admin only)
router.get(
    "/",
    authenticate,
    requireAdmin,
    catchAsync(async (req, res) => {
        const { since } = req.query;
        const lastChecked =
            since || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(); // Default to 24 hours ago

        const data = await db.feedback.getNewFeedbackSince(lastChecked);
        res.json({ success: true, data });
    })
);

export default router;
