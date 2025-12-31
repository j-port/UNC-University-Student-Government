import express from "express";
import { db } from "../db/index.js";

const router = express.Router();

// Get all site content (with optional section filter)
router.get("/", async (req, res) => {
    try {
        const { section } = req.query;
        const data = await db.siteContent.getAll(section);
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create or update site content
router.post("/", async (req, res) => {
    try {
        console.log(
            "Upserting site content:",
            req.body.id ? `UPDATE ID: ${req.body.id}` : "CREATE NEW"
        );
        const data = await db.siteContent.upsert(req.body);
        console.log("Upsert result:", data);
        res.json({ success: true, data });
    } catch (error) {
        console.error("Upsert error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete site content
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await db.siteContent.delete(id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
