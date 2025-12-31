import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

/**
 * Custom hook to fetch and calculate automated statistics from the database
 * This reduces manual admin work by auto-calculating counts from real data
 */
export function useAutomatedStats() {
  const [stats, setStats] = useState({
    eventsCount: 0,
    accomplishmentsCount: 0,
    totalBudget: 0,
    organizationsCount: 0,
    loading: true,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Count events from announcements
        const { count: eventsCount } = await supabase
          .from('announcements')
          .select('*', { count: 'exact', head: true })
          .eq('category', 'event')
          .eq('status', 'published')

        // Count accomplishments from announcements
        const { count: accomplishmentsCount } = await supabase
          .from('announcements')
          .select('*', { count: 'exact', head: true })
          .eq('category', 'accomplishment')
          .eq('status', 'published')

        // Sum total budget from financial transactions (absolute values)
        const { data: transactions } = await supabase
          .from('financial_transactions')
          .select('amount')

        const totalBudget = transactions?.reduce((sum, t) => sum + Math.abs(t.amount || 0), 0) || 0

        // Count active organizations
        const { count: organizationsCount } = await supabase
          .from('organizations')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true)

        setStats({
          eventsCount: eventsCount || 0,
          accomplishmentsCount: accomplishmentsCount || 0,
          totalBudget,
          organizationsCount: organizationsCount || 0,
          loading: false,
        })
      } catch (error) {
        console.error('Error fetching automated stats:', error)
        setStats(prev => ({ ...prev, loading: false }))
      }
    }

    fetchStats()
  }, [])

  // Format budget for display (₱2.5M format)
  const formatBudget = (amount) => {
    if (amount >= 1000000) {
      return `₱${(amount / 1000000).toFixed(1)}M+`
    } else if (amount >= 1000) {
      return `₱${(amount / 1000).toFixed(0)}K+`
    }
    return `₱${amount}+`
  }

  return {
    ...stats,
    formattedBudget: formatBudget(stats.totalBudget),
  }
}
