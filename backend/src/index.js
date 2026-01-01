import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

// Import utilities
import { validateEnvironment } from "./utils/validateEnv.js";
import {
    errorHandler,
    notFound,
    catchAsync,
} from "./middleware/errorHandler.js";
import { generalLimiter } from "./middleware/rateLimiter.js";

// Import routes
import feedbackRoutes from "./routes/feedback.js";
import announcementRoutes from "./routes/announcements.js";
import officerRoutes from "./routes/officers.js";
import organizationRoutes from "./routes/organizations.js";
import committeeRoutes from "./routes/committees.js";
import governanceDocumentRoutes from "./routes/governanceDocuments.js";
import siteContentRoutes from "./routes/siteContent.js";
import pageContentRoutes from "./routes/pageContent.js";
import statsRoutes from "./routes/stats.js";
import notificationRoutes from "./routes/notifications.js";
import financialTransactionRoutes from "./routes/financialTransactions.js";
import issuanceRoutes from "./routes/issuances.js";

dotenv.config();

// Validate environment variables before starting
validateEnvironment();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" })); // Limit request body size
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging middleware (only in development)
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
} else {
    // In production, log only errors
    app.use(
        morgan("combined", {
            skip: (req, res) => res.statusCode < 400,
        })
    );
}

// Apply rate limiting to all routes
app.use("/api", generalLimiter);

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        message: "USG API is running",
        timestamp: new Date().toISOString(),
        database: process.env.DB_TYPE,
    });
});

// Mount routes
app.use("/api/feedback", feedbackRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/officers", officerRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/committees", committeeRoutes);
app.use("/api/governance-documents", governanceDocumentRoutes);
app.use("/api/site-content", siteContentRoutes);
app.use("/api/page-content", pageContentRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/financial-transactions", financialTransactionRoutes);
app.use("/api/issuances", issuanceRoutes);

// 404 handler - must be after all routes
app.use(notFound);

// Global error handler - must be last
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`💾 Database: ${process.env.DB_TYPE}`);
});
