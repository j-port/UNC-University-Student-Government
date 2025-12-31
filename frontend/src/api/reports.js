import { supabase } from "./supabase";

/**
 * Fetch financial transactions with search
 * @param {string} searchTerm - Search term for description or category
 * @param {number} limit - Maximum number of results
 */
export const fetchFinancialTransactions = async (
    searchTerm = "",
    limit = 50
) => {
    let query = supabase
        .from("financial_transactions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

    if (searchTerm) {
        query = query.or(
            `description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`
        );
    }

    const { data, error } = await query;
    return { data, error };
};
