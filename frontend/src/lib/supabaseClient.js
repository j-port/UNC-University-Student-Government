import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    realtime: {
        params: {
            eventsPerSecond: 10,
        },
    },
});
