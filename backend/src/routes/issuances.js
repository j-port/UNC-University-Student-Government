import express from "express";
import { db } from "../db/index.js";

const router = express.Router();

// Get all issuances
router.get("/", async (req, res) => {
    try {
        const { limit = 10, status } = req.query;
        
        const filters = {};
        if (status) filters.status = status;
        
        const issuances = await db.issuances.findAll({
            filters,
            orderBy: "created_at",
            orderDirection: "desc",
            limit: parseInt(limit)
        });
        
        res.json({ success: true, data: issuances });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get single issuance
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const issuance = await db.issuances.findById(id);
        res.json({ success: true, data: issuance });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create issuance
router.post("/", async (req, res) => {
    try {
        const issuance = await db.issuances.create(req.body);
        res.json({ success: true, data: issuance });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update issuance
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const issuance = await db.issuances.update(id, req.body);
        res.json({ success: true, data: issuance });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete issuance
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await db.issuances.delete(id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
