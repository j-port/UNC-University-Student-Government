import express from "express";
import { db } from "../db/index.js";
import { catchAsync } from "../middleware/errorHandler.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validateRequest.js";
import {
    createFinancialTransactionSchema,
    updateFinancialTransactionSchema,
    idParamSchema,
} from "../middleware/validation.js";
import { NotFoundError } from "../utils/errors.js";

const router = express.Router();

// Get all financial transactions (admin only - sensitive data)
router.get(
    "/",
    authenticate,
    requireAdmin,
    catchAsync(async (req, res) => {
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
    })
);

// Get single transaction (admin only)
router.get(
    "/:id",
    authenticate,
    requireAdmin,
    validate(idParamSchema),
    catchAsync(async (req, res) => {
        const transaction = await db.financialTransactions.findById(
            req.params.id
        );

        if (!transaction) {
            throw new NotFoundError("Financial transaction");
        }

        res.json({ success: true, data: transaction });
    })
);

// Create transaction (admin only)
router.post(
    "/",
    authenticate,
    requireAdmin,
    validate(createFinancialTransactionSchema),
    catchAsync(async (req, res) => {
        const transaction = await db.financialTransactions.create(req.body);
        res.status(201).json({ success: true, data: transaction });
    })
);

// Update transaction (admin only)
router.put(
    "/:id",
    authenticate,
    requireAdmin,
    validate(updateFinancialTransactionSchema),
    catchAsync(async (req, res) => {
        const transaction = await db.financialTransactions.update(
            req.params.id,
            req.body
        );

        if (!transaction) {
            throw new NotFoundError("Financial transaction");
        }

        res.json({ success: true, data: transaction });
    })
);

// Delete transaction (admin only)
router.delete(
    "/:id",
    authenticate,
    requireAdmin,
    validate(idParamSchema),
    catchAsync(async (req, res) => {
        await db.financialTransactions.delete(req.params.id);
        res.json({
            success: true,
            message: "Transaction deleted successfully",
        });
    })
);

export default router;
