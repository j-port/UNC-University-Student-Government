import express from "express";
import { db } from "../db/index.js";

const router = express.Router();

// Get automated stats
router.get("/automated", async (req, res) => {
    try {
        const data = await db.getAutomatedStats();
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
