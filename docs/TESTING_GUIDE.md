# Testing Guide

This document explains how to write and run tests for the UNC Student Government API backend.

## Overview

We use **Jest** as our testing framework with the following setup:

-   **Test Environment**: Node.js
-   **Assertion Library**: Jest's built-in matchers
-   **Test Utilities**: Custom helpers in `src/__tests__/helpers.js`
-   **Mocking**: Jest's mock functions

## Running Tests

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

Automatically re-run tests when files change:

```bash
npm run test:watch
```

### Run Tests with Coverage

Generate a coverage report:

```bash
npm run test:coverage
```

Coverage reports are saved to the `coverage/` directory and displayed in the terminal.

## Test Structure

### File Organization

```
backend/
├── src/
│   ├── __tests__/
│   │   ├── setup.js              # Global test configuration
│   │   ├── helpers.js            # Test utilities and mocks
│   │   ├── middleware/
│   │   │   ├── auth.test.js
│   │   │   ├── errorHandler.test.js
│   │   │   └── validation.test.js
│   │   ├── repositories/
│   │   │   ├── FeedbackRepository.test.js
│   │   │   └── ...
│   │   └── routes/
│   │       ├── feedback.test.js
│   │       └── ...
```

### Naming Conventions

-   Test files: `*.test.js` or `*.spec.js`
-   Place tests in `__tests__` directory or next to the file being tested
-   Mirror the structure of your source code

## Writing Tests

### Basic Test Structure

```javascript
import { describe, test, expect, beforeEach } from "@jest/globals";
import { functionToTest } from "../path/to/module.js";

describe("Module Name", () => {
    describe("functionToTest", () => {
        test("should do something specific", () => {
            const result = functionToTest(input);
            expect(result).toBe(expectedOutput);
        });
    });
});
```

### Using Test Helpers

We provide several helper functions in `src/__tests__/helpers.js`:

#### Mock Express Objects

```javascript
import { mockRequest, mockResponse, mockNext } from "../helpers.js";

test("should handle request", () => {
    const req = mockRequest({ body: { name: "Test" } });
    const res = mockResponse();
    const next = mockNext();

    yourMiddleware(req, res, next);

    expect(res.json).toHaveBeenCalledWith({ success: true });
});
```

#### Mock Users

```javascript
import { mockUser, mockAdminUser } from "../helpers.js";

test("should authenticate user", () => {
    const user = mockUser({ email: "test@unc.edu.ph" });
    // Use user in your test
});

test("should require admin", () => {
    const admin = mockAdminUser();
    req.user = admin;
    requireAdmin(req, res, next);
    expect(next).toHaveBeenCalled();
});
```

#### Mock Database Records

```javascript
import { mockRecord } from "../helpers.js";

test("should create feedback", () => {
    const feedback = mockRecord("feedback", {
        message: "Custom message",
    });
    // Use feedback in your test
});
```

### Testing Middleware

Example: Testing authentication middleware

```javascript
import { authenticate } from "../../middleware/auth.js";
import { mockRequest, mockResponse, mockNext, mockUser } from "../helpers.js";

jest.mock("../../lib/supabaseClient.js", () => ({
    supabase: {
        auth: {
            getUser: jest.fn(),
        },
    },
}));

import { supabase } from "../../lib/supabaseClient.js";

describe("authenticate middleware", () => {
    let req, res, next;

    beforeEach(() => {
        req = mockRequest();
        res = mockResponse();
        next = mockNext();
        jest.clearAllMocks();
    });

    test("should authenticate valid token", async () => {
        req.headers.authorization = "Bearer valid-token";
        supabase.auth.getUser.mockResolvedValue({
            data: { user: mockUser() },
            error: null,
        });

        await authenticate(req, res, next);

        expect(req.user).toBeDefined();
        expect(next).toHaveBeenCalledWith();
    });

    test("should reject invalid token", async () => {
        req.headers.authorization = "Bearer invalid";
        supabase.auth.getUser.mockResolvedValue({
            data: { user: null },
            error: { message: "Invalid" },
        });

        await authenticate(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
});
```

### Testing Error Handling

```javascript
import { errorHandler } from "../../middleware/errorHandler.js";
import { NotFoundError, ValidationError } from "../../utils/errors.js";

test("should handle NotFoundError", () => {
    const error = new NotFoundError("User");
    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "User not found",
    });
});

test("should handle ValidationError", () => {
    const error = new ValidationError("Invalid input", [
        { field: "email", message: "Invalid email" },
    ]);

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "Invalid input",
        details: expect.any(Array),
    });
});
```

### Testing Validation

```javascript
import { validate } from "../../middleware/validateRequest.js";
import { createFeedbackSchema } from "../../middleware/validation.js";

test("should validate correct data", () => {
    req.body = {
        name: "John Doe",
        email: "john@example.com",
        category: "suggestion",
        message: "Test message",
    };

    const middleware = validate(createFeedbackSchema);
    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith();
});

test("should reject invalid data", () => {
    req.body = {
        name: "",
        email: "invalid",
    };

    const middleware = validate(createFeedbackSchema);
    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
});
```

### Testing Repositories

Example: Testing FeedbackRepository

```javascript
import { FeedbackRepository } from "../../db/repositories/FeedbackRepository.js";
import { mockSupabaseClient } from "../helpers.js";

describe("FeedbackRepository", () => {
    let repository, mockClient;

    beforeEach(() => {
        mockClient = mockSupabaseClient();
        repository = new FeedbackRepository(mockClient);
    });

    test("should get all feedback", async () => {
        const mockData = [
            { id: "1", message: "Test 1" },
            { id: "2", message: "Test 2" },
        ];

        mockClient.from().select().mockResolvedValue({
            data: mockData,
            error: null,
        });

        const result = await repository.getAll();

        expect(result).toEqual(mockData);
        expect(mockClient.from).toHaveBeenCalledWith("feedback");
    });

    test("should create feedback with reference", async () => {
        const feedbackData = {
            name: "Test",
            email: "test@example.com",
            message: "Test message",
        };

        const result = await repository.createWithReference(feedbackData);

        expect(result).toHaveProperty("reference_number");
        expect(result.reference_number).toMatch(/^FB-\d{6}$/);
    });
});
```

### Testing Routes (Integration Tests)

Example: Testing feedback routes

```javascript
import request from "supertest";
import express from "express";
import feedbackRoutes from "../../routes/feedback.js";

const app = express();
app.use(express.json());
app.use("/api/feedback", feedbackRoutes);

describe("Feedback Routes", () => {
    test("POST /api/feedback should create feedback", async () => {
        const response = await request(app)
            .post("/api/feedback")
            .send({
                name: "Test User",
                email: "test@example.com",
                category: "suggestion",
                message: "Test message",
            })
            .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty("reference_number");
    });

    test("POST /api/feedback should reject invalid data", async () => {
        const response = await request(app)
            .post("/api/feedback")
            .send({
                name: "",
                email: "invalid-email",
            })
            .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toBeDefined();
    });

    test("GET /api/feedback should require authentication", async () => {
        const response = await request(app).get("/api/feedback").expect(401);

        expect(response.body.success).toBe(false);
    });

    test("GET /api/feedback should work with valid token", async () => {
        const response = await request(app)
            .get("/api/feedback")
            .set("Authorization", "Bearer valid-token")
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeInstanceOf(Array);
    });
});
```

## Mocking

### Mocking Modules

```javascript
// Mock the entire module
jest.mock("../../lib/supabaseClient.js", () => ({
    supabase: {
        auth: {
            getUser: jest.fn(),
        },
    },
}));
```

### Mocking Functions

```javascript
const mockFunction = jest.fn();
mockFunction.mockReturnValue("mocked value");
mockFunction.mockResolvedValue("async value");
mockFunction.mockRejectedValue(new Error("error"));
```

### Spy on Functions

```javascript
const consoleSpy = jest.spyOn(console, "error");
consoleSpy.mockImplementation(() => {});

// After test
consoleSpy.mockRestore();
```

## Common Matchers

### Equality

```javascript
expect(value).toBe(5); // Strict equality
expect(value).toEqual({ name: "Test" }); // Deep equality
expect(value).not.toBe(10);
```

### Truthiness

```javascript
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();
expect(value).toBeDefined();
```

### Numbers

```javascript
expect(value).toBeGreaterThan(10);
expect(value).toBeLessThan(20);
expect(value).toBeCloseTo(10.5, 1);
```

### Strings

```javascript
expect(string).toMatch(/pattern/);
expect(string).toContain("substring");
```

### Arrays

```javascript
expect(array).toContain("item");
expect(array).toHaveLength(3);
expect(array).toEqual(expect.arrayContaining([1, 2]));
```

### Objects

```javascript
expect(object).toHaveProperty("key");
expect(object).toHaveProperty("key", "value");
expect(object).toMatchObject({ name: "Test" });
```

### Functions

```javascript
expect(fn).toHaveBeenCalled();
expect(fn).toHaveBeenCalledTimes(2);
expect(fn).toHaveBeenCalledWith(arg1, arg2);
expect(fn).toHaveReturned();
expect(fn).toHaveReturnedWith("value");
```

### Errors

```javascript
expect(() => throwError()).toThrow();
expect(() => throwError()).toThrow(Error);
expect(() => throwError()).toThrow("error message");
```

## Best Practices

### 1. Use Descriptive Test Names

```javascript
// ❌ Bad
test("test 1", () => {});

// ✅ Good
test("should create feedback with valid data", () => {});
test("should throw ValidationError when email is invalid", () => {});
```

### 2. Follow AAA Pattern

**Arrange** - Set up test data
**Act** - Execute the code
**Assert** - Verify the result

```javascript
test("should update feedback status", async () => {
    // Arrange
    const feedbackId = "123";
    const newStatus = "resolved";

    // Act
    const result = await repository.update(feedbackId, { status: newStatus });

    // Assert
    expect(result.status).toBe(newStatus);
});
```

### 3. Test One Thing at a Time

```javascript
// ❌ Bad - Tests multiple things
test("should handle feedback", () => {
    expect(createFeedback()).toBeDefined();
    expect(getFeedback()).toHaveLength(1);
    expect(updateFeedback()).toBe(true);
});

// ✅ Good - Separate tests
test("should create feedback", () => {});
test("should get feedback", () => {});
test("should update feedback", () => {});
```

### 4. Clean Up After Tests

```javascript
beforeEach(() => {
    jest.clearAllMocks();
});

afterEach(() => {
    jest.restoreAllMocks();
});
```

### 5. Use beforeEach for Setup

```javascript
describe("FeedbackRepository", () => {
    let repository, mockClient;

    beforeEach(() => {
        mockClient = mockSupabaseClient();
        repository = new FeedbackRepository(mockClient);
    });

    test("test 1", () => {
        // repository is ready to use
    });
});
```

### 6. Mock External Dependencies

```javascript
// Always mock database calls, API requests, file system, etc.
jest.mock("../../lib/supabaseClient.js");
```

### 7. Test Edge Cases

```javascript
test("should handle empty array", () => {});
test("should handle null input", () => {});
test("should handle very long strings", () => {});
test("should handle missing required fields", () => {});
```

### 8. Use Test Coverage

Aim for:

-   **80%+** line coverage
-   **70%+** branch coverage
-   **100%** for critical paths (auth, validation, error handling)

## Debugging Tests

### Run Single Test File

```bash
npm test -- auth.test.js
```

### Run Tests Matching Pattern

```bash
npm test -- --testNamePattern="authenticate"
```

### Debug with Console Logs

```javascript
test("debug test", () => {
    console.log("Debug:", someValue);
    expect(someValue).toBe(expected);
});
```

### Use Jest's Verbose Mode

```bash
npm test -- --verbose
```

## Continuous Integration

### Pre-commit Hook

Add to `.husky/pre-commit`:

```bash
npm test
```

### GitHub Actions

```yaml
- name: Run tests
  run: npm test

- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
      files: ./coverage/lcov.info
```

## Common Issues

### Module Import Errors

Use `--experimental-vm-modules` flag (already configured in package.json):

```json
"test": "node --experimental-vm-modules node_modules/jest/bin/jest.js"
```

### Async Test Timeouts

Increase timeout:

```javascript
jest.setTimeout(10000); // 10 seconds
```

### Mock Not Working

Ensure mock is defined before import:

```javascript
// ✅ Correct order
jest.mock("./module.js");
import { function } from "./module.js";

// ❌ Wrong order
import { function } from "./module.js";
jest.mock("./module.js");
```

## Resources

-   [Jest Documentation](https://jestjs.io/docs/getting-started)
-   [Testing Best Practices](https://testingjavascript.com/)
-   [Supertest Documentation](https://github.com/visionmedia/supertest)
-   [Zod Documentation](https://zod.dev/)

## Next Steps

1. Write tests for repositories
2. Write integration tests for routes
3. Set up CI/CD pipeline
4. Add code coverage badges
5. Implement snapshot testing for complex objects
