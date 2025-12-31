import express from "express";
import { db } from "../db/index.js";

const router = express.Router();

// Get all organizations (with optional filters)
router.get("/", async (req, res) => {
    try {
        const { type, college } = req.query;
        const data = await db.organizations.getActive(type, college);
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create new organization
router.post("/", async (req, res) => {
    try {
        const data = await db.organizations.create(req.body);
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update organization
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const data = await db.organizations.update(id, req.body);
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
