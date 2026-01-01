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

// Get all site content (public - with optional section filter)
router.get(
    "/",
    catchAsync(async (req, res) => {
        const { section } = req.query;
        const data = await db.siteContent.getAll(section);
        res.json({ success: true, data });
    })
);

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
