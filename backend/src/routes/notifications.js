import express from "express";
import { db } from "../db/index.js";

const router = express.Router();

// Get new feedback since last check
router.get("/", async (req, res) => {
    try {
        const { since } = req.query;
        const lastChecked =
            since || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(); // Default to 24 hours ago

        const data = await db.feedback.getNewFeedbackSince(lastChecked);
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
