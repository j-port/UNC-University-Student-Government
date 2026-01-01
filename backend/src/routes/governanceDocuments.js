import express from "express";
import { db } from "../db/index.js";
import { catchAsync } from "../middleware/errorHandler.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validateRequest.js";
import {
    createGovernanceDocumentSchema,
    updateGovernanceDocumentSchema,
    idParamSchema,
} from "../middleware/validation.js";
import { NotFoundError } from "../utils/errors.js";

const router = express.Router();

// Get all governance documents (public - with optional type filter)
router.get(
    "/",
    catchAsync(async (req, res) => {
        const { type } = req.query;
        const data = await db.governanceDocuments.getActive(type);
        res.json({ success: true, data });
    })
);

// Get single governance document (public)
router.get(
    "/:id",
    validate(idParamSchema),
    catchAsync(async (req, res) => {
        const data = await db.governanceDocuments.findById(req.params.id);

        if (!data) {
            throw new NotFoundError("Governance document");
        }

        res.json({ success: true, data });
    })
);

// Create new governance document (admin only)
router.post(
    "/",
    authenticate,
    requireAdmin,
    validate(createGovernanceDocumentSchema),
    catchAsync(async (req, res) => {
        const data = await db.governanceDocuments.create(req.body);
        res.status(201).json({ success: true, data });
    })
);

// Update governance document (admin only)
router.put(
    "/:id",
    authenticate,
    requireAdmin,
    validate(updateGovernanceDocumentSchema),
    catchAsync(async (req, res) => {
        const data = await db.governanceDocuments.update(
            req.params.id,
            req.body
        );

        if (!data) {
            throw new NotFoundError("Governance document");
        }

        res.json({ success: true, data });
    })
);

// Delete governance document (admin only)
router.delete(
    "/:id",
    authenticate,
    requireAdmin,
    validate(idParamSchema),
    catchAsync(async (req, res) => {
        await db.governanceDocuments.delete(req.params.id);
        res.json({
            success: true,
            message: "Governance document deleted successfully",
        });
    })
);

export default router;
