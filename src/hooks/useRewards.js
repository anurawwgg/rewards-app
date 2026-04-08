import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

// activeOnly: true for customer view, false for admin view (all rewards)
export function useRewards({ activeOnly = true } = {}) {
  const [rewards, setRewards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function fetch() {
      setLoading(true)
      let query = supabase.from('rewards').select('*').order('points_required', { ascending: true })
      if (activeOnly) query = query.eq('is_active', true)

      const { data, error } = await query
      if (!cancelled) {
        setRewards(data ?? [])
        setError(error)
        setLoading(false)
      }
    }

    fetch()
    return () => { cancelled = true }
  }, [activeOnly])

  async function refresh() {
    let query = supabase.from('rewards').select('*').order('points_required', { ascending: true })
    if (activeOnly) query = query.eq('is_active', true)
    const { data } = await query
    setRewards(data ?? [])
  }

  return { rewards, loading, error, refresh }
}
