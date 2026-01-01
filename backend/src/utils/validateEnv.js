import dotenv from "dotenv";
dotenv.config();

/**
 * Validate required environment variables on startup
 * Fail fast with clear error messages
 */
const requiredEnvVars = ["DB_TYPE", "PORT"];

// Add database-specific required vars
if (process.env.DB_TYPE === "supabase") {
    requiredEnvVars.push("SUPABASE_URL", "SUPABASE_SERVICE_KEY");
} else if (process.env.DB_TYPE === "postgres") {
    requiredEnvVars.push(
        "POSTGRES_HOST",
        "POSTGRES_PORT",
        "POSTGRES_DB",
        "POSTGRES_USER",
        "POSTGRES_PASSWORD"
    );
}

export function validateEnvironment() {
    const missing = [];

    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            missing.push(envVar);
        }
    }

    if (missing.length > 0) {
        console.error("❌ Missing required environment variables:");
        missing.forEach((v) => console.error(`   - ${v}`));
        console.error("\nPlease check your .env file and try again.");
        process.exit(1);
    }

    // Validate DB_TYPE value
    if (!["supabase", "postgres"].includes(process.env.DB_TYPE)) {
        console.error(
            `❌ Invalid DB_TYPE: ${process.env.DB_TYPE}. Must be 'supabase' or 'postgres'`
        );
        process.exit(1);
    }

    console.log("✅ Environment variables validated");
    console.log(`   Database type: ${process.env.DB_TYPE}`);
}
