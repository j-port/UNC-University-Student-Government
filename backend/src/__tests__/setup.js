import { beforeAll, afterAll, beforeEach, afterEach } from "@jest/globals";

// Set test environment
process.env.NODE_ENV = "test";

// Set test database configuration
process.env.DB_TYPE = "supabase";
process.env.SUPABASE_URL =
    process.env.TEST_SUPABASE_URL || process.env.SUPABASE_URL;
process.env.SUPABASE_SERVICE_KEY =
    process.env.TEST_SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_KEY;

// Global setup
beforeAll(() => {
    console.log("🧪 Starting test suite...");
});

// Global teardown
afterAll(() => {
    console.log("✅ Test suite completed");
});

// Setup before each test
beforeEach(() => {
    // Clear any test data if needed
});

// Cleanup after each test
afterEach(() => {
    // Clean up test data if needed
});
