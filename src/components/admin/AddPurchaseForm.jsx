import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function AddPurchaseForm({ customer, onSuccess }) {
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const pointsPreview = amount ? Math.floor(parseFloat(amount) * 10) : 0

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccessMsg('')

    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Enter a valid purchase amount.')
      return
    }

    const pointsEarned = Math.floor(amountNum * 10)
    setLoading(true)

    // Insert purchase row
    const { error: insertError } = await supabase.from('purchases').insert({
      customer_id: customer.id,
      amount_spent: amountNum,
      points_earned: pointsEarned,
      description: description.trim() || null,
    })

    if (insertError) {
      setLoading(false)
      setError('Failed to save purchase. Please try again.')
      return
    }

    // Atomically add points to the customer's balance
    const { error: rpcError } = await supabase.rpc('add_points', {
      customer_id: customer.id,
      delta: pointsEarned,
    })

    setLoading(false)

    if (rpcError) {
      setError('Purchase saved but points update failed. Contact support.')
      return
    }

    setAmount('')
    setDescription('')
    setSuccessMsg(`✓ Added ₹${amountNum.toLocaleString('en-IN')} purchase — ${pointsEarned} pts credited to ${customer.name}`)
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mt-4">
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-600 mb-1">Amount (₹)</label>
          <input
            type="number"
            min="1"
            step="0.01"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="500"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          {amount && (
            <p className="text-xs text-brand-600 mt-1">= {pointsPreview} points</p>
          )}
        </div>
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="e.g. Grocery purchase"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      {successMsg && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          {successMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 disabled:opacity-60 transition-colors"
      >
        {loading ? 'Saving…' : 'Add Purchase & Credit Points'}
      </button>
    </form>
  )
}
