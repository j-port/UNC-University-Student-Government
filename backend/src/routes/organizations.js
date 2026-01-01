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

/**
 * @swagger
 * /organizations:
 *   get:
 *     tags: [Organizations]
 *     summary: Get all active organizations
 *     description: Retrieve all active student organizations (public access)
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by organization type
 *       - in: query
 *         name: college
 *         schema:
 *           type: string
 *         description: Filter by college
 *     responses:
 *       200:
 *         description: List of organizations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
// Get all organizations (public - with optional filters)
router.get(
    "/",
    catchAsync(async (req, res) => {
        const { type, college } = req.query;
        const data = await db.organizations.getActive(type, college);
        res.json({ success: true, data });
    })
);

/**
 * @swagger
 * /organizations/{id}:
 *   get:
 *     tags: [Organizations]
 *     summary: Get organization by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Organization details
 *       404:
 *         $ref: '#/components/schemas/Error'
 *   post:
 *     tags: [Organizations]
 *     summary: Create a new organization
 *     description: Add a new student organization (admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Computer Science Society
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               logo_url:
 *                 type: string
 *     responses:
 *       201:
 *         description: Organization created
 *       400:
 *         $ref: '#/components/schemas/ValidationError'
 *       401:
 *         $ref: '#/components/schemas/Error'
 *       403:
 *         $ref: '#/components/schemas/Error'
 */

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
