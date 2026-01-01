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

/**
 * @swagger
 * /announcements:
 *   get:
 *     tags: [Announcements]
 *     summary: Get all published announcements
 *     description: Retrieve all announcements with published status (public access)
 *     responses:
 *       200:
 *         description: List of published announcements
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
 *                     $ref: '#/components/schemas/Announcement'
 */
// Get all announcements (public - shows only published)
router.get(
    "/",
    catchAsync(async (req, res) => {
        const data = await db.announcements.getAll();
        res.json({ success: true, data });
    })
);

/**
 * @swagger
 * /announcements/{id}:
 *   get:
 *     tags: [Announcements]
 *     summary: Get announcement by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Announcement ID
 *     responses:
 *       200:
 *         description: Announcement details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Announcement'
 *       404:
 *         $ref: '#/components/schemas/Error'
 */

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

/**
 * @swagger
 * /announcements:
 *   post:
 *     tags: [Announcements]
 *     summary: Create a new announcement
 *     description: Create a new announcement (admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 example: Student Assembly Meeting
 *               content:
 *                 type: string
 *                 example: Join us for the monthly student assembly
 *               category:
 *                 type: string
 *                 enum: [Event, Accomplishment, News, Announcement, Other]
 *                 example: Event
 *               status:
 *                 type: string
 *                 enum: [draft, published]
 *                 example: published
 *               image_url:
 *                 type: string
 *                 format: uri
 *               event_date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Announcement created successfully
 *       400:
 *         $ref: '#/components/schemas/ValidationError'
 *       401:
 *         $ref: '#/components/schemas/Error'
 *       403:
 *         $ref: '#/components/schemas/Error'
 */

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

/**
 * @swagger
 * /announcements/{id}:
 *   put:
 *     tags: [Announcements]
 *     summary: Update an announcement
 *     description: Update announcement details (admin only)
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
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [Event, Accomplishment, News, Announcement, Other]
 *               status:
 *                 type: string
 *                 enum: [draft, published]
 *               image_url:
 *                 type: string
 *               event_date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Announcement updated successfully
 *       400:
 *         $ref: '#/components/schemas/ValidationError'
 *       401:
 *         $ref: '#/components/schemas/Error'
 *       403:
 *         $ref: '#/components/schemas/Error'
 *       404:
 *         $ref: '#/components/schemas/Error'
 */

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

/**
 * @swagger
 * /announcements/{id}:
 *   delete:
 *     tags: [Announcements]
 *     summary: Delete an announcement
 *     description: Delete an announcement (admin only)
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
 *         description: Announcement deleted successfully
 *       401:
 *         $ref: '#/components/schemas/Error'
 *       403:
 *         $ref: '#/components/schemas/Error'
 */

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
