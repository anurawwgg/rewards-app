import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function RedeemModal({ reward, onClose, onSuccess }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleConfirm() {
    setLoading(true)
    setError('')

    const { data, error } = await supabase.rpc('redeem_reward', {
      p_customer_id: user.id,
      p_reward_id: reward.id,
      p_reward_name: reward.name,
      p_points_cost: reward.points_required,
    })

    setLoading(false)

    if (error) {
      setError('Something went wrong. Please try again.')
      return
    }

    if (data === 'insufficient_points') {
      setError('You no longer have enough points for this reward.')
      return
    }

    onSuccess()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <h2 className="text-lg font-bold text-gray-800">Confirm Redemption</h2>
        <p className="text-gray-500 text-sm mt-1">
          Redeem <span className="font-semibold text-gray-800">{reward.name}</span> for{' '}
          <span className="font-semibold text-brand-600">{reward.points_required.toLocaleString('en-IN')} points</span>?
        </p>
        <p className="text-xs text-gray-400 mt-2">
          This cannot be undone. Show this confirmation to the cashier.
        </p>

        {error && (
          <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex gap-3 mt-5">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-60"
          >
            {loading ? 'Redeeming…' : 'Yes, Redeem'}
          </button>
        </div>
      </div>
    </div>
  )
}
