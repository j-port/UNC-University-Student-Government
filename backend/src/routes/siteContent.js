import express from "express";
import { db } from "../db/index.js";
import { catchAsync } from "../middleware/errorHandler.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validateRequest.js";
import {
    upsertSiteContentSchema,
    idParamSchema,
} from "../middleware/validation.js";

const router = express.Router();

/**
 * @swagger
 * /api/site-content:
 *   get:
 *     tags: [Site Content]
 *     summary: Get all site content
 *     description: Retrieve site content with optional section filter. Public endpoint.
 *     parameters:
 *       - in: query
 *         name: section
 *         schema:
 *           type: string
 *         description: Filter by section name
 *     responses:
 *       200:
 *         description: List of site content
 */
// Get all site content (public - with optional section filter)
router.get(
    "/",
    catchAsync(async (req, res) => {
        const { section } = req.query;
        const data = await db.siteContent.getAll(section);
        res.json({ success: true, data });
    })
);

/**
 * @swagger
 * /api/site-content:
 *   post:
 *     tags: [Site Content]
 *     summary: Create or update site content
 *     description: Upsert site content by section and key. Admin only.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [section, key, value]
 *             properties:
 *               section:
 *                 type: string
 *               key:
 *                 type: string
 *               value:
 *                 type: string
 *     responses:
 *       200:
 *         description: Site content upserted
 */
// Create or update site content (admin only)
router.post(
    "/",
    authenticate,
    requireAdmin,
    validate(upsertSiteContentSchema),
    catchAsync(async (req, res) => {
        const data = await db.siteContent.upsert(req.body);
        res.json({ success: true, data });
    })
);

// Delete site content (admin only)
router.delete(
    "/:id",
    authenticate,
    requireAdmin,
    validate(idParamSchema),
    catchAsync(async (req, res) => {
        await db.siteContent.delete(req.params.id);
        res.json({
            success: true,
            message: "Site content deleted successfully",
        });
    })
);

export default router;
