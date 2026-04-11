import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useMenuItems({ activeOnly = true } = {}) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  async function fetchItems() {
    setLoading(true)
    let query = supabase
      .from('menu_items')
      .select('*')
      .order('sort_order', { ascending: true })
    if (activeOnly) query = query.eq('is_active', true)
    const { data } = await query
    setItems(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    let cancelled = false
    async function run() {
      let query = supabase
        .from('menu_items')
        .select('*')
        .order('sort_order', { ascending: true })
      if (activeOnly) query = query.eq('is_active', true)
      const { data } = await query
      if (!cancelled) {
        setItems(data ?? [])
        setLoading(false)
      }
    }
    run()
    return () => { cancelled = true }
  }, [activeOnly])

  return { items, loading, refetch: fetchItems }
}
