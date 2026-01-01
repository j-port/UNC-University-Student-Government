import express from "express";
import { db } from "../db/index.js";
import { catchAsync } from "../middleware/errorHandler.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validateRequest.js";
import {
    createPageContentSchema,
    updatePageContentSchema,
    idParamSchema,
} from "../middleware/validation.js";
import { NotFoundError } from "../utils/errors.js";

const router = express.Router();

/**
 * @swagger
 * /api/page-content:
 *   get:
 *     tags: [Page Content]
 *     summary: Get all page content
 *     description: Retrieve all page content. Public endpoint.
 *     responses:
 *       200:
 *         description: List of page content
 */
// Get all page content (public)
router.get(
    "/",
    catchAsync(async (req, res) => {
        const data = await db.pageContent.getAll();
        res.json({ success: true, data });
    })
);

/**
 * @swagger
 * /api/page-content/{slug}:
 *   get:
 *     tags: [Page Content]
 *     summary: Get page content by slug
 *     description: Retrieve page content for a specific page slug. Public endpoint.
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Page slug
 *     responses:
 *       200:
 *         description: Page content details
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
// Get page content by slug (public)
router.get(
    "/:slug",
    catchAsync(async (req, res) => {
        const data = await db.pageContent.getBySlug(req.params.slug);

        if (!data) {
            throw new NotFoundError("Page content");
        }

        res.json({ success: true, data });
    })
);

/**
 * @swagger
 * /api/page-content:
 *   post:
 *     tags: [Page Content]
 *     summary: Create or update page content
 *     description: Upsert page content by slug. Admin only.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [slug, title, content]
 *             properties:
 *               slug:
 *                 type: string
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Page content upserted
 */
// Create or update page content (admin only)
router.post(
    "/",
    authenticate,
    requireAdmin,
    validate(createPageContentSchema),
    catchAsync(async (req, res) => {
        const data = await db.pageContent.upsert(req.body);
        res.json({ success: true, data });
    })
);

// Delete page content (admin only)
router.delete(
    "/:id",
    authenticate,
    requireAdmin,
    validate(idParamSchema),
    catchAsync(async (req, res) => {
        await db.pageContent.delete(req.params.id);
        res.json({
            success: true,
            message: "Page content deleted successfully",
        });
    })
);

export default router;
