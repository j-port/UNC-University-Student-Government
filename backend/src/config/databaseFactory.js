import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import pkg from "pg";
const { Pool } = pkg;

dotenv.config();

/**
 * Database client factory
 * Returns the appropriate database client based on environment configuration
 */
export function createDatabaseClient() {
    const dbType = process.env.DB_TYPE || "supabase";

    switch (dbType.toLowerCase()) {
        case "supabase":
            return {
                type: "supabase",
                client: createClient(
                    process.env.SUPABASE_URL,
                    process.env.SUPABASE_SERVICE_KEY
                ),
            };

        case "postgres":
        case "postgresql":
            return {
                type: "postgres",
                client: new Pool({
                    host: process.env.POSTGRES_HOST || "localhost",
                    port: process.env.POSTGRES_PORT || 5432,
                    database: process.env.POSTGRES_DB || "unc_sg",
                    user: process.env.POSTGRES_USER || "postgres",
                    password: process.env.POSTGRES_PASSWORD,
                    ssl:
                        process.env.POSTGRES_SSL === "true"
                            ? { rejectUnauthorized: false }
                            : false,
                }),
            };

        default:
            throw new Error(
                `Unsupported database type: ${dbType}. Use "supabase" or "postgres"`
            );
    }
}

/**
 * Get repository class based on database type
 */
export async function getRepositoryClass(dbType) {
    if (dbType === "supabase") {
        const { SupabaseRepository } = await import(
            "../db/SupabaseRepository.js"
        );
        return SupabaseRepository;
    } else if (dbType === "postgres") {
        const { PostgresRepository } = await import(
            "../db/PostgresRepository.js"
        );
        return PostgresRepository;
    }
    throw new Error(`Unsupported database type: ${dbType}`);
}
