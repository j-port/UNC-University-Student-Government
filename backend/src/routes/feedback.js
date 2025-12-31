import express from "express";
import { db } from "../db/index.js";

const router = express.Router();

// Get all feedback
router.get("/", async (req, res) => {
    try {
        const data = await db.feedback.getAll();
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create new feedback
router.post("/", async (req, res) => {
    try {
        const data = await db.feedback.createWithReference(req.body);
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update feedback
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const data = await db.feedback.update(id, req.body);
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete feedback
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await db.feedback.delete(id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Track feedback by reference number
router.get("/track/:referenceNumber", async (req, res) => {
    try {
        const { referenceNumber } = req.params;
        const data = await db.feedback.findByReference(referenceNumber);
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
