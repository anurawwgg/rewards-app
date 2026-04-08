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
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="flex gap-3">
        <input
          type="tel"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by mobile number…"
          required
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-900 disabled:opacity-60"
        >
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>

      {notFound && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          No customer found with that mobile number.
        </p>
      )}

      {customer && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-800">{customer.name}</p>
              <p className="text-gray-500 text-sm">{customer.mobile_number}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-brand-600">
                {(customerPoints ?? customer.total_points).toLocaleString('en-IN')}
              </p>
              <p className="text-gray-400 text-xs">points</p>
            </div>
          </div>

          <hr className="my-4 border-gray-100" />
          <p className="text-sm font-medium text-gray-700">Add Purchase</p>
          <AddPurchaseForm customer={customer} onSuccess={refreshCustomer} />
        </div>
      )}
    </div>
  )
}
