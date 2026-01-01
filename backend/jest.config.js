export default {
    // Test environment
    testEnvironment: "node",

    // Root directory
    roots: ["<rootDir>/src"],

    // Test match patterns
    testMatch: [
        "**/__tests__/**/*.test.js",
        "**/__tests__/**/*.spec.js",
        "**/*.test.js",
        "**/*.spec.js",
    ],

    // Setup files
    setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.js"],

    // Coverage configuration
    collectCoverageFrom: [
        "src/**/*.js",
        "!src/__tests__/**",
        "!src/index.js",
        "!**/node_modules/**",
    ],

    coverageDirectory: "coverage",
    coverageReporters: ["text", "lcov", "html"],

    // Coverage thresholds (optional - uncomment when ready)
    // coverageThreshold: {
    //     global: {
    //         branches: 70,
    //         functions: 70,
    //         lines: 70,
    //         statements: 70,
    //     },
    // },

    // Module paths
    moduleDirectories: ["node_modules", "src"],

    // Transform files
    transform: {},

    // Ignore patterns
    testPathIgnorePatterns: ["/node_modules/"],

    // Verbose output
    verbose: true,

    // Clear mocks between tests
    clearMocks: true,

    // Restore mocks between tests
    restoreMocks: true,

    // Reset mocks between tests
    resetMocks: true,
};
