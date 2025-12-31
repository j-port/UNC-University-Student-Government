import express from "express";
import { db } from "../db/index.js";

const router = express.Router();

// Get all governance documents (with optional type filter)
router.get("/", async (req, res) => {
    try {
        const { type } = req.query;
        const data = await db.governanceDocuments.getActive(type);
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create new governance document
router.post("/", async (req, res) => {
    try {
        const data = await db.governanceDocuments.create(req.body);
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update governance document
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const data = await db.governanceDocuments.update(id, req.body);
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
