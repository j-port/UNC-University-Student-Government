import { BaseRepository } from "./BaseRepository.js";

/**
 * PostgreSQL implementation of the repository pattern
 * This class handles native PostgreSQL query syntax using pg library
 */
export class PostgresRepository extends BaseRepository {
    constructor(client, tableName) {
        super(client, tableName);
    }

    async findAll(options = {}) {
        const {
            filters = {},
            orderBy,
            orderDirection = "asc",
            limit,
        } = options;

        let query = `SELECT * FROM ${this.tableName}`;
        const values = [];
        let paramIndex = 1;

        // Apply filters
        const filterConditions = Object.entries(filters)
            .filter(([_, value]) => value !== undefined && value !== null)
            .map(([key, value]) => {
                values.push(value);
                return `${key} = $${paramIndex++}`;
            });

        if (filterConditions.length > 0) {
            query += ` WHERE ${filterConditions.join(" AND ")}`;
        }

        // Apply ordering
        if (orderBy) {
            query += ` ORDER BY ${orderBy} ${orderDirection.toUpperCase()}`;
        }

        // Apply limit
        if (limit) {
            query += ` LIMIT ${limit}`;
        }

        const result = await this.client.query(query, values);
        return result.rows;
    }

    async findById(id) {
        const query = `SELECT * FROM ${this.tableName} WHERE id = $1`;
        const result = await this.client.query(query, [id]);

        if (result.rows.length === 0) {
            throw new Error(`Record with id ${id} not found`);
        }

        return result.rows[0];
    }

    async findOne(filters = {}) {
        const values = [];
        let paramIndex = 1;

        const filterConditions = Object.entries(filters)
            .filter(([_, value]) => value !== undefined && value !== null)
            .map(([key, value]) => {
                values.push(value);
                return `${key} = $${paramIndex++}`;
            });

        const query = `SELECT * FROM ${
            this.tableName
        } WHERE ${filterConditions.join(" AND ")} LIMIT 1`;
        const result = await this.client.query(query, values);

        if (result.rows.length === 0) {
            throw new Error(`Record not found`);
        }

        return result.rows[0];
    }

    async create(data) {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");

        const query = `
            INSERT INTO ${this.tableName} (${keys.join(", ")})
            VALUES (${placeholders})
            RETURNING *
        `;

        const result = await this.client.query(query, values);
        return result.rows[0];
    }

    async update(id, data) {
        const keys = Object.keys(data);
        const values = Object.values(data);

        const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");

        const query = `
            UPDATE ${this.tableName}
            SET ${setClause}
            WHERE id = $${keys.length + 1}
            RETURNING *
        `;

        const result = await this.client.query(query, [...values, id]);

        if (result.rows.length === 0) {
            throw new Error(`Record with id ${id} not found`);
        }

        return result.rows[0];
    }

    async delete(id) {
        const query = `DELETE FROM ${this.tableName} WHERE id = $1`;
        await this.client.query(query, [id]);
        return { success: true };
    }

    async count(filters = {}) {
        const values = [];
        let paramIndex = 1;

        let query = `SELECT COUNT(*) FROM ${this.tableName}`;

        const filterConditions = Object.entries(filters)
            .filter(([_, value]) => value !== undefined && value !== null)
            .map(([key, value]) => {
                values.push(value);
                return `${key} = $${paramIndex++}`;
            });

        if (filterConditions.length > 0) {
            query += ` WHERE ${filterConditions.join(" AND ")}`;
        }

        const result = await this.client.query(query, values);
        return parseInt(result.rows[0].count);
    }

    async sum(column, filters = {}) {
        const values = [];
        let paramIndex = 1;

        let query = `SELECT COALESCE(SUM(${column}), 0) as total FROM ${this.tableName}`;

        const filterConditions = Object.entries(filters)
            .filter(([_, value]) => value !== undefined && value !== null)
            .map(([key, value]) => {
                values.push(value);
                return `${key} = $${paramIndex++}`;
            });

        if (filterConditions.length > 0) {
            query += ` WHERE ${filterConditions.join(" AND ")}`;
        }

        const result = await this.client.query(query, values);
        return parseFloat(result.rows[0].total);
    }
}
