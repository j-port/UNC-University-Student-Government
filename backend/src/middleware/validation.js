import { z } from "zod";

/**
 * Validation schemas for all API endpoints
 */

// Feedback schemas
export const createFeedbackSchema = z.object({
    body: z.object({
        name: z.string().min(2, "Name must be at least 2 characters").max(100),
        email: z.string().email("Invalid email address"),
        category: z.enum(["suggestion", "complaint", "inquiry", "other"]),
        message: z
            .string()
            .min(10, "Message must be at least 10 characters")
            .max(1000, "Message too long"),
        anonymous: z.boolean().optional().default(false),
    }),
});

export const updateFeedbackStatusSchema = z.object({
    body: z.object({
        status: z.enum(["pending", "in_progress", "resolved", "closed"]),
        admin_response: z.string().max(1000).optional(),
    }),
    params: z.object({
        id: z.string().uuid("Invalid ID format"),
    }),
});

// Announcement schemas
export const createAnnouncementSchema = z.object({
    body: z.object({
        title: z.string().min(3).max(200),
        content: z.string().min(10),
        category: z.enum([
            "Event",
            "Accomplishment",
            "News",
            "Announcement",
            "Other",
        ]),
        status: z.enum(["draft", "published"]).default("draft"),
        image_url: z.string().url().optional(),
        event_date: z.string().datetime().optional(),
    }),
});

export const updateAnnouncementSchema = z.object({
    body: z.object({
        title: z.string().min(3).max(200).optional(),
        content: z.string().min(10).optional(),
        category: z
            .enum(["Event", "Accomplishment", "News", "Announcement", "Other"])
            .optional(),
        status: z.enum(["draft", "published"]).optional(),
        image_url: z.string().url().optional(),
        event_date: z.string().datetime().optional(),
    }),
    params: z.object({
        id: z.string().uuid("Invalid ID format"),
    }),
});

// Officer schemas
export const createOfficerSchema = z.object({
    body: z.object({
        name: z.string().min(2).max(100),
        position: z.string().min(2).max(100),
        department: z.string().max(100).optional(),
        image_url: z.string().url().optional(),
        email: z.string().email().optional(),
        bio: z.string().max(500).optional(),
        order_index: z.number().int().min(0).optional(),
    }),
});

export const updateOfficerSchema = z.object({
    body: z.object({
        name: z.string().min(2).max(100).optional(),
        position: z.string().min(2).max(100).optional(),
        department: z.string().max(100).optional(),
        image_url: z.string().url().optional(),
        email: z.string().email().optional(),
        bio: z.string().max(500).optional(),
        order_index: z.number().int().min(0).optional(),
    }),
    params: z.object({
        id: z.string().uuid("Invalid ID format"),
    }),
});

// Organization schemas
export const createOrganizationSchema = z.object({
    body: z.object({
        name: z.string().min(2).max(200),
        description: z.string().max(1000).optional(),
        logo_url: z.string().url().optional(),
        website_url: z.string().url().optional(),
        contact_email: z.string().email().optional(),
    }),
});

export const updateOrganizationSchema = z.object({
    body: z.object({
        name: z.string().min(2).max(200).optional(),
        description: z.string().max(1000).optional(),
        logo_url: z.string().url().optional(),
        website_url: z.string().url().optional(),
        contact_email: z.string().email().optional(),
    }),
    params: z.object({
        id: z.string().uuid("Invalid ID format"),
    }),
});

// Committee schemas
export const createCommitteeSchema = z.object({
    body: z.object({
        name: z.string().min(2).max(200),
        description: z.string().max(1000).optional(),
        chair_name: z.string().max(100).optional(),
        members: z.array(z.string()).optional(),
    }),
});

export const updateCommitteeSchema = z.object({
    body: z.object({
        name: z.string().min(2).max(200).optional(),
        description: z.string().max(1000).optional(),
        chair_name: z.string().max(100).optional(),
        members: z.array(z.string()).optional(),
    }),
    params: z.object({
        id: z.string().uuid("Invalid ID format"),
    }),
});

// Financial Transaction schemas
export const createFinancialTransactionSchema = z.object({
    body: z.object({
        description: z.string().min(3).max(500),
        amount: z.number().positive("Amount must be positive"),
        transaction_type: z.enum(["income", "expense"]),
        category: z.string().max(100).optional(),
        transaction_date: z.string().datetime(),
        receipt_url: z.string().url().optional(),
    }),
});

export const updateFinancialTransactionSchema = z.object({
    body: z.object({
        description: z.string().min(3).max(500).optional(),
        amount: z.number().positive("Amount must be positive").optional(),
        transaction_type: z.enum(["income", "expense"]).optional(),
        category: z.string().max(100).optional(),
        transaction_date: z.string().datetime().optional(),
        receipt_url: z.string().url().optional(),
    }),
    params: z.object({
        id: z.string().uuid("Invalid ID format"),
    }),
});

// Governance Document schemas
export const createGovernanceDocumentSchema = z.object({
    body: z.object({
        title: z.string().min(3).max(200),
        document_type: z.enum([
            "constitution",
            "bylaws",
            "resolution",
            "policy",
            "other",
        ]),
        file_url: z.string().url(),
        description: z.string().max(500).optional(),
        effective_date: z.string().datetime().optional(),
    }),
});

export const updateGovernanceDocumentSchema = z.object({
    body: z.object({
        title: z.string().min(3).max(200).optional(),
        document_type: z
            .enum(["constitution", "bylaws", "resolution", "policy", "other"])
            .optional(),
        file_url: z.string().url().optional(),
        description: z.string().max(500).optional(),
        effective_date: z.string().datetime().optional(),
    }),
    params: z.object({
        id: z.string().uuid("Invalid ID format"),
    }),
});

// Issuance schemas
export const createIssuanceSchema = z.object({
    body: z.object({
        title: z.string().min(3).max(200),
        issuance_type: z.enum([
            "executive_order",
            "memorandum",
            "resolution",
            "proclamation",
            "other",
        ]),
        issuance_number: z.string().max(50),
        content: z.string().min(10),
        effective_date: z.string().datetime(),
        file_url: z.string().url().optional(),
    }),
});

export const updateIssuanceSchema = z.object({
    body: z.object({
        title: z.string().min(3).max(200).optional(),
        issuance_type: z
            .enum([
                "executive_order",
                "memorandum",
                "resolution",
                "proclamation",
                "other",
            ])
            .optional(),
        issuance_number: z.string().max(50).optional(),
        content: z.string().min(10).optional(),
        effective_date: z.string().datetime().optional(),
        file_url: z.string().url().optional(),
    }),
    params: z.object({
        id: z.string().uuid("Invalid ID format"),
    }),
});

// Site Content schemas
export const upsertSiteContentSchema = z.object({
    body: z.object({
        content_key: z.string().min(1).max(100),
        content_value: z.any(), // Can be string, object, array, etc.
    }),
});

// Page Content schemas
export const createPageContentSchema = z.object({
    body: z.object({
        page_name: z.string().min(1).max(100),
        section_name: z.string().min(1).max(100),
        content: z.any(),
        order_index: z.number().int().min(0).optional(),
    }),
});

export const updatePageContentSchema = z.object({
    body: z.object({
        page_name: z.string().min(1).max(100).optional(),
        section_name: z.string().min(1).max(100).optional(),
        content: z.any().optional(),
        order_index: z.number().int().min(0).optional(),
    }),
    params: z.object({
        id: z.string().uuid("Invalid ID format"),
    }),
});

// Common validation schemas
export const idParamSchema = z.object({
    params: z.object({
        id: z.string().uuid("Invalid ID format"),
    }),
});

export const referenceNumberParamSchema = z.object({
    params: z.object({
        referenceNumber: z.string().min(1),
    }),
});
