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

/**
 * @swagger
 * /officers:
 *   get:
 *     tags: [Officers]
 *     summary: Get all active officers
 *     description: Retrieve all active student government officers (public access)
 *     parameters:
 *       - in: query
 *         name: branch
 *         schema:
 *           type: string
 *         description: Filter by branch (executive, legislative, judicial)
 *     responses:
 *       200:
 *         description: List of officers
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
 *                     $ref: '#/components/schemas/Officer'
 */
// Get all officers (public - with optional branch filter)
router.get(
    "/",
    catchAsync(async (req, res) => {
        const { branch } = req.query;
        const data = await db.officers.getActive(branch);
        res.json({ success: true, data });
    })
);

/**
 * @swagger
 * /officers/{id}:
 *   get:
 *     tags: [Officers]
 *     summary: Get officer by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Officer details
 *       404:
 *         $ref: '#/components/schemas/Error'
 */

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

/**
 * @swagger
 * /officers:
 *   post:
 *     tags: [Officers]
 *     summary: Create a new officer
 *     description: Add a new student government officer (admin only)
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
 *               - position
 *               - department
 *             properties:
 *               name:
 *                 type: string
 *                 example: Juan Dela Cruz
 *               position:
 *                 type: string
 *                 example: President
 *               department:
 *                 type: string
 *                 example: Executive
 *               image_url:
 *                 type: string
 *                 format: uri
 *               email:
 *                 type: string
 *                 format: email
 *               bio:
 *                 type: string
 *               order_index:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Officer created successfully
 *       400:
 *         $ref: '#/components/schemas/ValidationError'
 *       401:
 *         $ref: '#/components/schemas/Error'
 *       403:
 *         $ref: '#/components/schemas/Error'
 */

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

/**
 * @swagger
 * /officers/{id}:
 *   put:
 *     tags: [Officers]
 *     summary: Update an officer
 *     description: Update officer details (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               position:
 *                 type: string
 *               department:
 *                 type: string
 *               image_url:
 *                 type: string
 *               email:
 *                 type: string
 *               bio:
 *                 type: string
 *               order_index:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Officer updated successfully
 *       400:
 *         $ref: '#/components/schemas/ValidationError'
 *       401:
 *         $ref: '#/components/schemas/Error'
 *       403:
 *         $ref: '#/components/schemas/Error'
 *       404:
 *         $ref: '#/components/schemas/Error'
 *   delete:
 *     tags: [Officers]
 *     summary: Delete an officer
 *     description: Delete an officer (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Officer deleted successfully
 *       401:
 *         $ref: '#/components/schemas/Error'
 *       403:
 *         $ref: '#/components/schemas/Error'
 */

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
