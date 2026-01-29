import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase is configured
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey;

if (!isSupabaseConfigured) {
    console.warn(
        "Supabase environment variables not configured. Authentication features will be disabled."
    );
}

/**
 * Supabase client - For authentication and real-time subscriptions only
 *
 * All database operations should use the backend API from '../lib/api.js'
 *
 * This client should ONLY be used for:
 * - Authentication (login, logout, session management)
 * - Real-time subscriptions (if needed)
 *
 * For data operations, import and use the appropriate API from '../lib/api.js':
 * - announcementsAPI
 * - officersAPI
 * - committeesAPI
 * - organizationsAPI
 * - governanceDocsAPI
 * - siteContentAPI
 * - pageContentAPI
 * - financialTransactionsAPI
 * - issuancesAPI
 * - feedbackAPI
 */

// Create a mock client if Supabase is not configured to prevent crashes
const createMockClient = () => ({
    auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({
            data: { subscription: { unsubscribe: () => {} } },
        }),
        signInWithPassword: async () => ({
            data: null,
            error: new Error("Supabase not configured"),
        }),
        signOut: async () => ({ error: null }),
    },
});

export const supabase = isSupabaseConfigured
    ? createClient(supabaseUrl, supabaseAnonKey, {
          realtime: {
              params: {
                  eventsPerSecond: 10,
              },
          },
      })
    : createMockClient();
