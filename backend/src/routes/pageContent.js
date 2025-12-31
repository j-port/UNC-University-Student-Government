import express from "express";
import { db } from "../db/index.js";

const router = express.Router();

// Get all page content
router.get("/", async (req, res) => {
    try {
        const data = await db.pageContent.getAll();
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get page content by slug
router.get("/:slug", async (req, res) => {
    try {
        const { slug } = req.params;
        const data = await db.pageContent.getBySlug(slug);
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create or update page content
router.post("/", async (req, res) => {
    try {
        const data = await db.pageContent.upsert(req.body);
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete page content
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await db.pageContent.delete(id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
