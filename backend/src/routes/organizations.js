import express from "express";
import { db } from "../db/index.js";
import { catchAsync } from "../middleware/errorHandler.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validateRequest.js";
import {
    createOrganizationSchema,
    updateOrganizationSchema,
    idParamSchema,
} from "../middleware/validation.js";
import { NotFoundError } from "../utils/errors.js";

const router = express.Router();

// Get all organizations (public - with optional filters)
router.get(
    "/",
    catchAsync(async (req, res) => {
        const { type, college } = req.query;
        const data = await db.organizations.getActive(type, college);
        res.json({ success: true, data });
    })
);

// Get single organization by ID
router.get(
    "/:id",
    validate(idParamSchema),
    catchAsync(async (req, res) => {
        const data = await db.organizations.findById(req.params.id);

        if (!data) {
            throw new NotFoundError("Organization");
        }

        res.json({ success: true, data });
    })
);

// Create new organization (admin only)
router.post(
    "/",
    authenticate,
    requireAdmin,
    validate(createOrganizationSchema),
    catchAsync(async (req, res) => {
        const data = await db.organizations.create(req.body);
        res.status(201).json({ success: true, data });
    })
);

// Update organization (admin only)
router.put(
    "/:id",
    authenticate,
    requireAdmin,
    validate(updateOrganizationSchema),
    catchAsync(async (req, res) => {
        const data = await db.organizations.update(req.params.id, req.body);

        if (!data) {
            throw new NotFoundError("Organization");
        }

        res.json({ success: true, data });
    })
);

// Delete organization (admin only)
router.delete(
    "/:id",
    authenticate,
    requireAdmin,
    validate(idParamSchema),
    catchAsync(async (req, res) => {
        await db.organizations.delete(req.params.id);
        res.json({
            success: true,
            message: "Organization deleted successfully",
        });
    })
);

export default router;
