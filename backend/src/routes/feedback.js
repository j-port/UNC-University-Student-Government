import express from "express";
import { db } from "../db/index.js";
import { catchAsync } from "../middleware/errorHandler.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import { feedbackLimiter } from "../middleware/rateLimiter.js";
import { validate } from "../middleware/validateRequest.js";
import {
    createFeedbackSchema,
    updateFeedbackStatusSchema,
    idParamSchema,
    referenceNumberParamSchema,
} from "../middleware/validation.js";
import { NotFoundError } from "../utils/errors.js";

const router = express.Router();

/**
 * @swagger
 * /feedback:
 *   get:
 *     tags: [Feedback]
 *     summary: Get all feedback submissions
 *     description: Retrieve all feedback submissions (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all feedback
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
 *                     $ref: '#/components/schemas/Feedback'
 *       401:
 *         $ref: '#/components/schemas/Error'
 *       403:
 *         $ref: '#/components/schemas/Error'
 */
// Get all feedback (admin only)
router.get(
    "/",
    authenticate,
    requireAdmin,
    catchAsync(async (req, res) => {
        const data = await db.feedback.getAll();
        res.json({ success: true, data });
    })
);

/**
 * @swagger
 * /feedback:
 *   post:
 *     tags: [Feedback]
 *     summary: Submit new feedback
 *     description: Create a new feedback submission (rate limited - 5 per hour)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - category
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 example: Juan Dela Cruz
 *               email:
 *                 type: string
 *                 format: email
 *                 example: juan.delacruz@unc.edu.ph
 *               category:
 *                 type: string
 *                 enum: [suggestion, complaint, inquiry, other]
 *                 example: suggestion
 *               message:
 *                 type: string
 *                 example: I would like to suggest improvements to the library hours
 *     responses:
 *       201:
 *         description: Feedback created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Feedback'
 *       400:
 *         $ref: '#/components/schemas/ValidationError'
 *       429:
 *         $ref: '#/components/schemas/Error'
 */
// Create new feedback (rate limited)
router.post(
    "/",
    feedbackLimiter,
    validate(createFeedbackSchema),
    catchAsync(async (req, res) => {
        const data = await db.feedback.createWithReference(req.body);
        res.status(201).json({ success: true, data });
    })
);

/**
 * @swagger
 * /feedback/{id}:
 *   put:
 *     tags: [Feedback]
 *     summary: Update feedback status
 *     description: Update the status of a feedback submission (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Feedback ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, resolved, closed]
 *                 example: in_progress
 *     responses:
 *       200:
 *         description: Feedback updated successfully
 *       400:
 *         $ref: '#/components/schemas/ValidationError'
 *       401:
 *         $ref: '#/components/schemas/Error'
 *       403:
 *         $ref: '#/components/schemas/Error'
 *       404:
 *         $ref: '#/components/schemas/Error'
 */
// Update feedback status (admin only)
router.put(
    "/:id",
    authenticate,
    requireAdmin,
    validate(updateFeedbackStatusSchema),
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const data = await db.feedback.update(id, req.body);

        if (!data) {
            throw new NotFoundError("Feedback");
        }

        res.json({ success: true, data });
    })
);

/**
 * @swagger
 * /feedback/{id}:
 *   delete:
 *     tags: [Feedback]
 *     summary: Delete feedback
 *     description: Delete a feedback submission (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Feedback ID
 *     responses:
 *       200:
 *         description: Feedback deleted successfully
 *       401:
 *         $ref: '#/components/schemas/Error'
 *       403:
 *         $ref: '#/components/schemas/Error'
 */
// Delete feedback (admin only)
router.delete(
    "/:id",
    authenticate,
    requireAdmin,
    validate(idParamSchema),
    catchAsync(async (req, res) => {
        const { id } = req.params;
        await db.feedback.delete(id);
        res.json({ success: true, message: "Feedback deleted successfully" });
    })
);

/**
 * @swagger
 * /feedback/track/{referenceNumber}:
 *   get:
 *     tags: [Feedback]
 *     summary: Track feedback by reference number
 *     description: Get the status of a feedback submission using its reference number (public)
 *     parameters:
 *       - in: path
 *         name: referenceNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: Reference number (format FB-XXXXXX)
 *         example: FB-123456
 *     responses:
 *       200:
 *         description: Feedback details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Feedback'
 *       404:
 *         $ref: '#/components/schemas/Error'
 */
// Track feedback by reference number (public)
router.get(
    "/track/:referenceNumber",
    validate(referenceNumberParamSchema),
    catchAsync(async (req, res) => {
        const { referenceNumber } = req.params;
        const data = await db.feedback.findByReference(referenceNumber);

        if (!data) {
            throw new NotFoundError("Feedback with that reference number");
        }

        res.json({ success: true, data });
    })
);

export default router;
