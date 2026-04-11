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

    const { error: rpcError } = await supabase.rpc('add_points', {
      customer_id: customer.id,
      delta: pointsEarned,
    })

    if (rpcError) {
      setLoading(false)
      setError('Purchase saved but points update failed. Contact support.')
      return
    }

    // Increment stamp count by 1
    await supabase.rpc('add_stamp', { p_customer_id: customer.id })

    setLoading(false)
    setAmount('')
    setDescription('')
    setSuccessMsg(`✓ ₹${amountNum.toLocaleString('en-IN')} — ${pointsEarned} pts credited to ${customer.name}`)
    onSuccess()
  }

  const inputClass = 'w-full px-3 py-2 border border-brand-200 bg-brand-50 text-brand-900 placeholder-brand-300 text-sm focus:outline-none focus:border-brand-600 transition-colors'
  const labelClass = 'block font-label text-brand-400 text-xs tracking-widest uppercase mb-1'

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-3">
        <div className="flex-1">
          <label className={labelClass}>Amount (₹)</label>
          <input
            type="number"
            min="1"
            step="0.01"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="500"
            required
            className={inputClass}
          />
          {amount && (
            <p className="font-label text-brand-600 text-xs tracking-wider mt-1">= {pointsPreview} pts</p>
          )}
        </div>
        <div className="flex-1">
          <label className={labelClass}>Description</label>
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="e.g. Cappuccino"
            className={inputClass}
          />
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-400 border border-red-900 bg-red-950/40 px-3 py-2 font-label tracking-wider">{error}</p>
      )}
      {successMsg && (
        <p className="text-xs text-green-600 border border-green-200 bg-green-50 px-3 py-2 font-label tracking-wider">{successMsg}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-brand-600 text-brand-900 font-label text-xs tracking-[0.3em] uppercase hover:bg-brand-700 disabled:opacity-60 transition-colors"
      >
        {loading ? 'Saving…' : 'Credit Points'}
      </button>
    </form>
  )
}
