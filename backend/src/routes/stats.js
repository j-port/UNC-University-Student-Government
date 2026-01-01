import express from "express";
import { db } from "../db/index.js";
import { catchAsync } from "../middleware/errorHandler.js";

const router = express.Router();

// Get automated stats (public)
router.get(
    "/automated",
    catchAsync(async (req, res) => {
        const data = await db.getAutomatedStats();
        res.json({ success: true, data });
    })
);

export default router;
