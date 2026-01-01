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

/**
 * @swagger
 * /api/financial-transactions:
 *   get:
 *     tags: [Financial Transactions]
 *     summary: Get all financial transactions
 *     description: Retrieve all financial transactions with optional search and pagination. Admin only.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in description or category
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Maximum number of results
 *     responses:
 *       200:
 *         description: List of financial transactions
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
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

/**
 * @swagger
 * /api/financial-transactions/{id}:
 *   get:
 *     tags: [Financial Transactions]
 *     summary: Get financial transaction by ID
 *     description: Retrieve a specific financial transaction. Admin only.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Financial transaction details
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
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

/**
 * @swagger
 * /api/financial-transactions:
 *   post:
 *     tags: [Financial Transactions]
 *     summary: Create financial transaction
 *     description: Create a new financial transaction. Admin only.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount, category, description, transaction_date]
 *             properties:
 *               amount:
 *                 type: number
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               transaction_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Transaction created
 */
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

/**
 * @swagger
 * /api/financial-transactions/{id}:
 *   put:
 *     tags: [Financial Transactions]
 *     summary: Update financial transaction
 *     description: Update an existing financial transaction. Admin only.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Transaction updated
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
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
