import express from "express";
import { db } from "../db/index.js";
import { catchAsync } from "../middleware/errorHandler.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validateRequest.js";
import {
    createOfficerSchema,
    updateOfficerSchema,
    idParamSchema,
} from "../middleware/validation.js";
import { NotFoundError } from "../utils/errors.js";

const router = express.Router();

// Get all officers (public - with optional branch filter)
router.get(
    "/",
    catchAsync(async (req, res) => {
        const { branch } = req.query;
        const data = await db.officers.getActive(branch);
        res.json({ success: true, data });
    })
);

// Get single officer by ID
router.get(
    "/:id",
    validate(idParamSchema),
    catchAsync(async (req, res) => {
        const data = await db.officers.findById(req.params.id);

        if (!data) {
            throw new NotFoundError("Officer");
        }

        res.json({ success: true, data });
    })
);

// Create new officer (admin only)
router.post(
    "/",
    authenticate,
    requireAdmin,
    validate(createOfficerSchema),
    catchAsync(async (req, res) => {
        const data = await db.officers.create(req.body);
        res.status(201).json({ success: true, data });
    })
);

// Update officer (admin only)
router.put(
    "/:id",
    authenticate,
    requireAdmin,
    validate(updateOfficerSchema),
    catchAsync(async (req, res) => {
        const data = await db.officers.update(req.params.id, req.body);

        if (!data) {
            throw new NotFoundError("Officer");
        }

        res.json({ success: true, data });
    })
);

// Delete officer (admin only)
router.delete(
    "/:id",
    authenticate,
    requireAdmin,
    validate(idParamSchema),
    catchAsync(async (req, res) => {
        await db.officers.delete(req.params.id);
        res.json({ success: true, message: "Officer deleted successfully" });
    })
);

export default router;
