import { jest } from "@jest/globals";

/**
 * Create a mock Express request object
 */
export const mockRequest = (overrides = {}) => {
    return {
        body: {},
        params: {},
        query: {},
        headers: {},
        user: null,
        ...overrides,
    };
};

/**
 * Create a mock Express response object
 */
export const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    res.sendStatus = jest.fn().mockReturnValue(res);
    return res;
};

/**
 * Create a mock Express next function
 */
export const mockNext = () => jest.fn();

/**
 * Create a mock Supabase user
 */
export const mockUser = (overrides = {}) => {
    return {
        id: "test-user-id",
        email: "test@unc.edu.ph",
        role: "authenticated",
        ...overrides,
    };
};

/**
 * Create a mock admin user
 */
export const mockAdminUser = (overrides = {}) => {
    return mockUser({
        email: "admin@unc.edu.ph",
        ...overrides,
    });
};

/**
 * Create a mock database record
 */
export const mockRecord = (tableName, overrides = {}) => {
    const baseRecord = {
        id: `test-${tableName}-id`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };

    const tableDefaults = {
        feedback: {
            name: "Test User",
            email: "test@example.com",
            category: "suggestion",
            message: "Test message",
            status: "pending",
            reference_number: "FB-123456",
        },
        announcements: {
            title: "Test Announcement",
            content: "Test content",
            category: "News",
            status: "published",
        },
        officers: {
            name: "Test Officer",
            position: "President",
            department: "Executive",
            order_index: 1,
        },
        organizations: {
            name: "Test Organization",
            description: "Test description",
            category: "Academic",
        },
        committees: {
            name: "Test Committee",
            description: "Test description",
            chair_name: "Test Chair",
        },
    };

    return {
        ...baseRecord,
        ...(tableDefaults[tableName] || {}),
        ...overrides,
    };
};

/**
 * Mock Supabase client
 */
export const mockSupabaseClient = () => {
    const mockData = [];
    const mockError = null;

    return {
        from: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
                eq: jest.fn().mockReturnValue({
                    single: jest
                        .fn()
                        .mockResolvedValue({
                            data: mockData[0],
                            error: mockError,
                        }),
                    data: mockData,
                    error: mockError,
                }),
                order: jest.fn().mockReturnValue({
                    data: mockData,
                    error: mockError,
                }),
                limit: jest.fn().mockReturnValue({
                    data: mockData,
                    error: mockError,
                }),
                data: mockData,
                error: mockError,
            }),
            insert: jest.fn().mockReturnValue({
                select: jest.fn().mockReturnValue({
                    single: jest
                        .fn()
                        .mockResolvedValue({
                            data: mockData[0],
                            error: mockError,
                        }),
                }),
            }),
            update: jest.fn().mockReturnValue({
                eq: jest.fn().mockReturnValue({
                    select: jest.fn().mockReturnValue({
                        single: jest
                            .fn()
                            .mockResolvedValue({
                                data: mockData[0],
                                error: mockError,
                            }),
                    }),
                }),
            }),
            delete: jest.fn().mockReturnValue({
                eq: jest.fn().mockResolvedValue({ error: mockError }),
            }),
        }),
        auth: {
            getUser: jest.fn().mockResolvedValue({
                data: { user: mockUser() },
                error: null,
            }),
        },
    };
};

/**
 * Wait for async operations
 */
export const waitFor = (ms) =>
    new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Assert that a function throws a specific error
 */
export const expectToThrow = async (fn, ErrorClass, message) => {
    try {
        await fn();
        throw new Error("Expected function to throw but it didn't");
    } catch (error) {
        if (ErrorClass) {
            expect(error).toBeInstanceOf(ErrorClass);
        }
        if (message) {
            expect(error.message).toContain(message);
        }
    }
};
