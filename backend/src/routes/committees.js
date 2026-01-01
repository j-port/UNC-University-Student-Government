import express from "express";
import { db } from "../db/index.js";
import { catchAsync } from "../middleware/errorHandler.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validateRequest.js";
import {
    createCommitteeSchema,
    updateCommitteeSchema,
    idParamSchema,
} from "../middleware/validation.js";
import { NotFoundError } from "../utils/errors.js";

const router = express.Router();

// Get all committees (public)
router.get(
    "/",
    catchAsync(async (req, res) => {
        const data = await db.committees.getActive();
        res.json({ success: true, data });
    })
);

// Get single committee by ID
router.get(
    "/:id",
    validate(idParamSchema),
    catchAsync(async (req, res) => {
        const data = await db.committees.findById(req.params.id);

        if (!data) {
            throw new NotFoundError("Committee");
        }

        res.json({ success: true, data });
    })
);

// Create new committee (admin only)
router.post(
    "/",
    authenticate,
    requireAdmin,
    validate(createCommitteeSchema),
    catchAsync(async (req, res) => {
        const data = await db.committees.create(req.body);
        res.status(201).json({ success: true, data });
    })
);

// Update committee (admin only)
router.put(
    "/:id",
    authenticate,
    requireAdmin,
    validate(updateCommitteeSchema),
    catchAsync(async (req, res) => {
        const data = await db.committees.update(req.params.id, req.body);

        if (!data) {
            throw new NotFoundError("Committee");
        }

        res.json({ success: true, data });
    })
);

// Delete committee (admin only)
router.delete(
    "/:id",
    authenticate,
    requireAdmin,
    validate(idParamSchema),
    catchAsync(async (req, res) => {
        await db.committees.delete(req.params.id);
        res.json({ success: true, message: "Committee deleted successfully" });
    })
);

export default router;
