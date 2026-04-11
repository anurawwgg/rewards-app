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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-900/80 px-4">
      <div className="bg-brand-100 border border-brand-200 w-full max-w-sm p-6">
        {/* Eyebrow */}
        <p className="font-label text-brand-600 text-center mb-3" style={{ fontSize: '0.6rem', letterSpacing: '0.4em', textTransform: 'uppercase' }}>
          Confirm Redemption
        </p>

        <h2 className="font-display text-3xl text-brand-900 text-center leading-none">
          {reward.name}
        </h2>
        <p className="font-serif italic text-brand-400 text-sm mt-2 text-center">
          {reward.points_required.toLocaleString('en-IN')} points
        </p>
        <p className="font-label text-brand-400 text-xs tracking-wider text-center mt-3">
          Show this screen to the barista. Cannot be undone.
        </p>

        {error && (
          <p className="mt-4 text-xs text-red-400 border border-red-900 bg-red-950/40 px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex gap-2 mt-5">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 border border-brand-200 font-label text-xs tracking-widest uppercase text-brand-400 hover:text-brand-900 hover:bg-brand-200 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 py-2.5 bg-brand-600 text-brand-900 font-label text-xs tracking-widest uppercase hover:bg-brand-700 disabled:opacity-60 transition-colors"
          >
            {loading ? 'Redeeming…' : 'Confirm ✦'}
          </button>
        </div>
      </div>
    </div>
  )
}
