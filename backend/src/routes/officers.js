import express from "express";
import { db } from "../db/index.js";

const router = express.Router();

// Get all officers (with optional branch filter)
router.get("/", async (req, res) => {
    try {
        const { branch } = req.query;
        const data = await db.officers.getActive(branch);
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create new officer
router.post("/", async (req, res) => {
    try {
        const data = await db.officers.create(req.body);
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update officer
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const data = await db.officers.update(id, req.body);
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete officer
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await db.officers.delete(id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
