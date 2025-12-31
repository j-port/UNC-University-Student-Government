import express from "express";
import { db } from "../db/index.js";

const router = express.Router();

// Get all financial transactions with optional search
router.get("/", async (req, res) => {
    try {
        const { search, limit = 50 } = req.query;

        let transactions;
        if (search) {
            // Search in description or category
            transactions = await db.financialTransactions.findByCondition(
                "description",
                "ilike",
                `%${search}%`
            );
            // Also search in category - combine results
            const categoryResults =
                await db.financialTransactions.findByCondition(
                    "category",
                    "ilike",
                    `%${search}%`
                );
            // Merge and deduplicate
            const combined = [...transactions, ...categoryResults];
            const uniqueIds = new Set();
            transactions = combined.filter((item) => {
                if (uniqueIds.has(item.id)) return false;
                uniqueIds.add(item.id);
                return true;
            });
        } else {
            transactions = await db.financialTransactions.findAll({
                orderBy: "created_at",
                orderDirection: "desc",
                limit: parseInt(limit),
            });
        }

        res.json({ success: true, data: transactions });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get single transaction
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await db.financialTransactions.findById(id);
        res.json({ success: true, data: transaction });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create transaction
router.post("/", async (req, res) => {
    try {
        const transaction = await db.financialTransactions.create(req.body);
        res.json({ success: true, data: transaction });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update transaction
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await db.financialTransactions.update(id, req.body);
        res.json({ success: true, data: transaction });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete transaction
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await db.financialTransactions.delete(id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
