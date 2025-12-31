import express from "express";
import { db } from "../db/index.js";

const router = express.Router();

// Get all announcements
router.get("/", async (req, res) => {
    try {
        const data = await db.announcements.getAll();
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create new announcement
router.post("/", async (req, res) => {
    try {
        const data = await db.announcements.create(req.body);
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
