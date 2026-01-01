/**
 * Base Repository class
 * Provides common database operations that can be extended by specific repositories
 */
export class BaseRepository {
    constructor(client, tableName) {
        this.client = client;
        this.tableName = tableName;
    }

    /**
     * Find all records with optional filtering and ordering
     */
    async findAll(options = {}) {
        throw new Error("findAll must be implemented by subclass");
    }

    /**
     * Find a single record by ID
     */
    async findById(id) {
        throw new Error("findById must be implemented by subclass");
    }

    /**
     * Create a new record
     */
    async create(data) {
        throw new Error("create must be implemented by subclass");
    }

    /**
     * Update a record by ID
     */
    async update(id, data) {
        throw new Error("update must be implemented by subclass");
    }

    /**
     * Delete a record by ID
     */
    async delete(id) {
        throw new Error("delete must be implemented by subclass");
    }
}
