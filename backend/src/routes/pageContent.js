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

// Get all page content (public)
router.get(
    "/",
    catchAsync(async (req, res) => {
        const data = await db.pageContent.getAll();
        res.json({ success: true, data });
    })
);

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
