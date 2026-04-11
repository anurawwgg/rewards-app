import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import AddPurchaseForm from './AddPurchaseForm'

export default function CustomerSearch() {
  const [query, setQuery] = useState('')
  const [customer, setCustomer] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [loading, setLoading] = useState(false)
  const [customerPoints, setCustomerPoints] = useState(null)

  async function handleSearch(e) {
    e.preventDefault()
    setNotFound(false)
    setCustomer(null)
    setLoading(true)

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('mobile_number', query.trim())
      .single()

    setLoading(false)

    if (data) {
      setCustomer(data)
      setCustomerPoints(data.total_points)
    } else {
      setNotFound(true)
    }
  }

  async function refreshCustomer() {
    if (!customer) return
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', customer.id)
      .single()
    if (data) setCustomerPoints(data.total_points)
  }

  return (
    <div className="space-y-5">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="tel"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by mobile number…"
          required
          className="flex-1 px-3 py-2 border border-brand-200 bg-brand-50 text-brand-900 placeholder-brand-300 text-sm focus:outline-none focus:border-brand-600 transition-colors"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 bg-brand-900 text-brand-100 font-label text-xs tracking-[0.3em] uppercase hover:bg-brand-800 disabled:opacity-60 transition-colors"
        >
          {loading ? '…' : 'Search'}
        </button>
      </form>

      {notFound && (
        <p className="text-xs text-red-400 border border-red-900 bg-red-950/40 px-3 py-2 font-label tracking-wider">
          No customer found with that mobile number.
        </p>
      )}

      {customer && (
        <div className="border border-brand-200 bg-brand-100">
          <div className="flex items-center justify-between px-4 py-4">
            <div>
              <p className="font-serif text-brand-900">{customer.name}</p>
              <p className="font-label text-brand-400 text-xs tracking-wider mt-0.5">{customer.mobile_number}</p>
            </div>
            <div className="text-right">
              <p className="font-display text-brand-600 text-3xl leading-none">
                {(customerPoints ?? customer.total_points).toLocaleString('en-IN')}
              </p>
              <p className="font-label text-brand-400 text-xs tracking-widest uppercase">points</p>
            </div>
          </div>

          <div className="border-t border-brand-200 px-4 py-4">
            <p className="font-label text-brand-400 text-xs tracking-[0.3em] uppercase mb-3">Add Purchase</p>
            <AddPurchaseForm customer={customer} onSuccess={refreshCustomer} />
          </div>
        </div>
      )}
    </div>
  )
}
