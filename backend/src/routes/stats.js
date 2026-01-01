import express from "express";
import { db } from "../db/index.js";
import { catchAsync } from "../middleware/errorHandler.js";

const router = express.Router();

/**
 * @swagger
 * /api/stats/automated:
 *   get:
 *     tags: [Statistics]
 *     summary: Get automated statistics
 *     description: Retrieve automatically calculated statistics from the database. Public endpoint.
 *     responses:
 *       200:
 *         description: Automated statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 */
// Get automated stats (public)
router.get(
    "/automated",
    catchAsync(async (req, res) => {
        const data = await db.getAutomatedStats();
        res.json({ success: true, data });
    })
);

export default router;
