import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function usePurchases() {
  const { user } = useAuth()
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) {
      setPurchases([])
      setLoading(false)
      return
    }

    let cancelled = false

    async function fetch() {
      setLoading(true)
      const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false })

      if (!cancelled) {
        setPurchases(data ?? [])
        setError(error)
        setLoading(false)
      }
    }

    fetch()
    return () => { cancelled = true }
  }, [user])

  return { purchases, loading, error }
}
