import express from "express";
import { db } from "../db/index.js";

const router = express.Router();

// Get all committees
router.get("/", async (req, res) => {
    try {
        const data = await db.committees.getActive();
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create new committee
router.post("/", async (req, res) => {
    try {
        const data = await db.committees.create(req.body);
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update committee
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const data = await db.committees.update(id, req.body);
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
