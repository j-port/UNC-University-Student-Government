import swaggerJsdoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "UNC Student Government API",
            version: "1.0.0",
            description:
                "API documentation for the UNC University Student Government website backend",
            contact: {
                name: "UNC Student Government",
                url: "https://github.com/j-port/UNC-University-Student-Government",
            },
        },
        servers: [
            {
                url: "http://localhost:5000/api",
                description: "Development server",
            },
            {
                url: "https://your-production-url.com/api",
                description: "Production server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Enter your Supabase JWT token",
                },
            },
            schemas: {
                Error: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean",
                            example: false,
                        },
                        error: {
                            type: "string",
                            example: "Error message",
                        },
                    },
                },
                ValidationError: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean",
                            example: false,
                        },
                        error: {
                            type: "string",
                            example: "Validation failed",
                        },
                        details: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    field: {
                                        type: "string",
                                    },
                                    message: {
                                        type: "string",
                                    },
                                },
                            },
                        },
                    },
                },
                Feedback: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            format: "uuid",
                        },
                        name: {
                            type: "string",
                        },
                        email: {
                            type: "string",
                            format: "email",
                        },
                        category: {
                            type: "string",
                            enum: [
                                "suggestion",
                                "complaint",
                                "inquiry",
                                "other",
                            ],
                        },
                        message: {
                            type: "string",
                        },
                        status: {
                            type: "string",
                            enum: [
                                "pending",
                                "in_progress",
                                "resolved",
                                "closed",
                            ],
                        },
                        reference_number: {
                            type: "string",
                        },
                        created_at: {
                            type: "string",
                            format: "date-time",
                        },
                    },
                },
                Announcement: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            format: "uuid",
                        },
                        title: {
                            type: "string",
                        },
                        content: {
                            type: "string",
                        },
                        category: {
                            type: "string",
                            enum: [
                                "Event",
                                "Accomplishment",
                                "News",
                                "Announcement",
                                "Other",
                            ],
                        },
                        status: {
                            type: "string",
                            enum: ["draft", "published"],
                        },
                        image_url: {
                            type: "string",
                            format: "uri",
                        },
                        event_date: {
                            type: "string",
                            format: "date-time",
                        },
                        created_at: {
                            type: "string",
                            format: "date-time",
                        },
                    },
                },
                Officer: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            format: "uuid",
                        },
                        name: {
                            type: "string",
                        },
                        position: {
                            type: "string",
                        },
                        department: {
                            type: "string",
                        },
                        image_url: {
                            type: "string",
                            format: "uri",
                        },
                        email: {
                            type: "string",
                            format: "email",
                        },
                        bio: {
                            type: "string",
                        },
                        order_index: {
                            type: "integer",
                        },
                    },
                },
            },
        },
        tags: [
            {
                name: "Health",
                description: "Health check endpoints",
            },
            {
                name: "Feedback",
                description: "Student feedback management",
            },
            {
                name: "Announcements",
                description: "News and announcements",
            },
            {
                name: "Officers",
                description: "Student government officers",
            },
            {
                name: "Organizations",
                description: "Student organizations",
            },
            {
                name: "Committees",
                description: "Student government committees",
            },
            {
                name: "Financial Transactions",
                description: "Financial transparency data (Admin only)",
            },
            {
                name: "Issuances",
                description: "Official issuances and documents",
            },
            {
                name: "Governance Documents",
                description: "Constitution, bylaws, and policies",
            },
            {
                name: "Site Content",
                description: "Dynamic site content (Admin only)",
            },
            {
                name: "Page Content",
                description: "Page content management",
            },
            {
                name: "Stats",
                description: "Statistics and metrics",
            },
        ],
    },
    apis: ["./src/routes/*.js", "./src/index.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
