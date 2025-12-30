import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper functions for common database operations
export const fetchFinancialTransactions = async (searchTerm = '', limit = 50) => {
  let query = supabase
    .from('financial_transactions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (searchTerm) {
    query = query.or(`description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
  }

  const { data, error } = await query
  return { data, error }
}

export const fetchAnnouncements = async (limit = 10) => {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  
  return { data, error }
}

export const fetchIssuances = async (limit = 10) => {
  const { data, error } = await supabase
    .from('issuances')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  
  return { data, error }
}

export const submitFeedback = async (feedbackData) => {
  const { data, error } = await supabase
    .from('feedback')
    .insert([feedbackData])
  
  return { data, error }
}
