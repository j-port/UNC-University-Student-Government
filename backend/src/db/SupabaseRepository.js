import { BaseRepository } from "./BaseRepository.js";

/**
 * Supabase implementation of the repository pattern
 * This class handles Supabase-specific query syntax
 */
export class SupabaseRepository extends BaseRepository {
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

        let query = this.client.from(this.tableName).select("*");

        // Apply filters
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                query = query.eq(key, value);
            }
        });

        // Apply ordering
        if (orderBy) {
            query = query.order(orderBy, {
                ascending: orderDirection === "asc",
            });
        }

        // Apply limit
        if (limit) {
            query = query.limit(limit);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data;
    }

    async findById(id) {
        const { data, error } = await this.client
            .from(this.tableName)
            .select("*")
            .eq("id", id)
            .single();

        if (error) throw error;
        return data;
    }

    async findOne(filters = {}) {
        let query = this.client.from(this.tableName).select("*");

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                query = query.eq(key, value);
            }
        });

        const { data, error } = await query.single();
        if (error) throw error;
        return data;
    }

    async create(data) {
        const { data: result, error } = await this.client
            .from(this.tableName)
            .insert([data])
            .select();

        if (error) throw error;
        return result[0];
    }

    async update(id, data) {
        const { data: result, error } = await this.client
            .from(this.tableName)
            .update(data)
            .eq("id", id)
            .select();

        if (error) throw error;
        return result[0];
    }

    async delete(id) {
        const { error } = await this.client
            .from(this.tableName)
            .delete()
            .eq("id", id);

        if (error) throw error;
        return { success: true };
    }

    async count(filters = {}) {
        let query = this.client
            .from(this.tableName)
            .select("*", { count: "exact", head: true });

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                query = query.eq(key, value);
            }
        });

        const { count, error } = await query;
        if (error) throw error;
        return count;
    }

    async sum(column, filters = {}) {
        let query = this.client.from(this.tableName).select(column);

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                query = query.eq(key, value);
            }
        });

        const { data, error } = await query;
        if (error) throw error;

        return (
            data?.reduce((sum, item) => sum + Math.abs(item[column] || 0), 0) ||
            0
        );
    }

    async findByCondition(column, operator, value) {
        let query = this.client.from(this.tableName).select("*");

        switch (operator) {
            case "gte":
                query = query.gte(column, value);
                break;
            case "lte":
                query = query.lte(column, value);
                break;
            case "gt":
                query = query.gt(column, value);
                break;
            case "lt":
                query = query.lt(column, value);
                break;
            default:
                query = query.eq(column, value);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data;
    }
}
