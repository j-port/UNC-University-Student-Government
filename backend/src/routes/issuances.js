import express from "express";
import { db } from "../db/index.js";
import { catchAsync } from "../middleware/errorHandler.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validateRequest.js";
import {
    createIssuanceSchema,
    updateIssuanceSchema,
    idParamSchema,
} from "../middleware/validation.js";
import { NotFoundError } from "../utils/errors.js";

const router = express.Router();

// Get all issuances (public)
router.get(
    "/",
    catchAsync(async (req, res) => {
        const { limit = 10, status } = req.query;

        const filters = {};
        if (status) filters.status = status;

        const issuances = await db.issuances.findAll({
            filters,
            orderBy: "created_at",
            orderDirection: "desc",
            limit: parseInt(limit),
        });

        res.json({ success: true, data: issuances });
    })
);

// Get single issuance (public)
router.get(
    "/:id",
    validate(idParamSchema),
    catchAsync(async (req, res) => {
        const issuance = await db.issuances.findById(req.params.id);

        if (!issuance) {
            throw new NotFoundError("Issuance");
        }

        res.json({ success: true, data: issuance });
    })
);

// Create issuance (admin only)
router.post(
    "/",
    authenticate,
    requireAdmin,
    validate(createIssuanceSchema),
    catchAsync(async (req, res) => {
        const issuance = await db.issuances.create(req.body);
        res.status(201).json({ success: true, data: issuance });
    })
);

// Update issuance (admin only)
router.put(
    "/:id",
    authenticate,
    requireAdmin,
    validate(updateIssuanceSchema),
    catchAsync(async (req, res) => {
        const issuance = await db.issuances.update(req.params.id, req.body);

        if (!issuance) {
            throw new NotFoundError("Issuance");
        }

        res.json({ success: true, data: issuance });
    })
);

// Delete issuance (admin only)
router.delete(
    "/:id",
    authenticate,
    requireAdmin,
    validate(idParamSchema),
    catchAsync(async (req, res) => {
        await db.issuances.delete(req.params.id);
        res.json({ success: true, message: "Issuance deleted successfully" });
    })
);

export default router;
