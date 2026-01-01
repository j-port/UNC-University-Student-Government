import { describe, test, expect, jest, beforeEach } from "@jest/globals";
import { SupabaseRepository } from "../../db/SupabaseRepository.js";

describe("SupabaseRepository", () => {
    let repository, mockClient, mockChain;

    beforeEach(() => {
        // Create a proper mock chain that returns itself for chaining
        mockChain = {
            select: jest.fn(),
            eq: jest.fn(),
            single: jest.fn(),
            order: jest.fn(),
            limit: jest.fn(),
            insert: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };

        // Make chain methods return the chain for proper chaining
        mockChain.select.mockReturnValue(mockChain);
        mockChain.eq.mockReturnValue(mockChain);
        mockChain.order.mockReturnValue(mockChain);
        mockChain.limit.mockReturnValue(mockChain);
        mockChain.insert.mockReturnValue(mockChain);
        mockChain.update.mockReturnValue(mockChain);
        mockChain.delete.mockReturnValue(mockChain);

        mockClient = {
            from: jest.fn(() => mockChain),
        };

        repository = new SupabaseRepository(mockClient, "test_table");
        jest.clearAllMocks();
    });

    describe("findAll", () => {
        test("should get all records", async () => {
            const mockData = [
                { id: "1", name: "Test 1" },
                { id: "2", name: "Test 2" },
            ];
            mockChain.select.mockResolvedValue({
                data: mockData,
                error: null,
            });

            const result = await repository.findAll();

            expect(mockClient.from).toHaveBeenCalledWith("test_table");
            expect(mockChain.select).toHaveBeenCalledWith("*");
            expect(result).toEqual(mockData);
        });

        test("should throw on error", async () => {
            mockChain.select.mockResolvedValue({
                data: null,
                error: new Error("Database error"),
            });

            await expect(repository.findAll()).rejects.toThrow(
                "Database error"
            );
        });
    });

    describe("findById", () => {
        test("should find record by ID", async () => {
            const mockData = { id: "123", name: "Test" };
            mockChain.single.mockResolvedValue({
                data: mockData,
                error: null,
            });

            const result = await repository.findById("123");

            expect(mockClient.from).toHaveBeenCalledWith("test_table");
            expect(mockChain.eq).toHaveBeenCalledWith("id", "123");
            expect(mockChain.single).toHaveBeenCalled();
            expect(result).toEqual(mockData);
        });

        test("should throw if not found", async () => {
            const error = new Error("Not found");
            error.code = "PGRST116";
            mockChain.single.mockResolvedValue({
                data: null,
                error,
            });

            await expect(repository.findById("nonexistent")).rejects.toThrow();
        });
    });

    describe("create", () => {
        test("should create a new record", async () => {
            const newData = { name: "New Test" };
            const createdData = { id: "123", ...newData };

            mockChain.select.mockResolvedValue({
                data: [createdData],
                error: null,
            });

            const result = await repository.create(newData);

            expect(mockClient.from).toHaveBeenCalledWith("test_table");
            expect(mockChain.insert).toHaveBeenCalledWith([newData]);
            expect(mockChain.select).toHaveBeenCalled();
            expect(result).toEqual(createdData);
        });
    });

    describe("update", () => {
        test("should update a record", async () => {
            const updateData = { name: "Updated" };
            const updatedRecord = { id: "123", ...updateData };

            mockChain.select.mockResolvedValue({
                data: [updatedRecord],
                error: null,
            });

            const result = await repository.update("123", updateData);

            expect(mockClient.from).toHaveBeenCalledWith("test_table");
            expect(mockChain.eq).toHaveBeenCalledWith("id", "123");
            expect(mockChain.update).toHaveBeenCalledWith(updateData);
            expect(mockChain.select).toHaveBeenCalled();
            expect(result).toEqual(updatedRecord);
        });

        test("should throw if record not found", async () => {
            mockChain.select.mockResolvedValue({
                data: [],
                error: null,
            });

            const result = await repository.update("nonexistent", {
                name: "Test",
            });

            expect(result).toBeUndefined();
        });
    });

    describe("delete", () => {
        test("should delete a record", async () => {
            mockChain.eq.mockResolvedValue({
                error: null,
            });

            await repository.delete("123");

            expect(mockClient.from).toHaveBeenCalledWith("test_table");
            expect(mockChain.delete).toHaveBeenCalled();
            expect(mockChain.eq).toHaveBeenCalledWith("id", "123");
        });
    });
});
