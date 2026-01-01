import express from "express";
import { db } from "../db/index.js";
import { catchAsync } from "../middleware/errorHandler.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validateRequest.js";
import {
    createAnnouncementSchema,
    updateAnnouncementSchema,
    idParamSchema,
} from "../middleware/validation.js";
import { NotFoundError } from "../utils/errors.js";

const router = express.Router();

// Get all announcements (public - shows only published)
router.get(
    "/",
    catchAsync(async (req, res) => {
        const data = await db.announcements.getAll();
        res.json({ success: true, data });
    })
);

// Get single announcement by ID
router.get(
    "/:id",
    validate(idParamSchema),
    catchAsync(async (req, res) => {
        const data = await db.announcements.findById(req.params.id);

        if (!data) {
            throw new NotFoundError("Announcement");
        }

        res.json({ success: true, data });
    })
);

// Create new announcement (admin only)
router.post(
    "/",
    authenticate,
    requireAdmin,
    validate(createAnnouncementSchema),
    catchAsync(async (req, res) => {
        const data = await db.announcements.create(req.body);
        res.status(201).json({ success: true, data });
    })
);

// Update announcement (admin only)
router.put(
    "/:id",
    authenticate,
    requireAdmin,
    validate(updateAnnouncementSchema),
    catchAsync(async (req, res) => {
        const data = await db.announcements.update(req.params.id, req.body);

        if (!data) {
            throw new NotFoundError("Announcement");
        }

        res.json({ success: true, data });
    })
);

// Delete announcement (admin only)
router.delete(
    "/:id",
    authenticate,
    requireAdmin,
    validate(idParamSchema),
    catchAsync(async (req, res) => {
        await db.announcements.delete(req.params.id);
        res.json({
            success: true,
            message: "Announcement deleted successfully",
        });
    })
);

export default router;
