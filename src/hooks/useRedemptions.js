import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useRedemptions() {
  const { user } = useAuth()
  const [redemptions, setRedemptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) {
      setRedemptions([])
      setLoading(false)
      return
    }

    let cancelled = false

    async function fetch() {
      setLoading(true)
      const { data, error } = await supabase
        .from('redemptions')
        .select('*')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false })

      if (!cancelled) {
        setRedemptions(data ?? [])
        setError(error)
        setLoading(false)
      }
    }

    fetch()
    return () => { cancelled = true }
  }, [user])

  return { redemptions, loading, error }
}
