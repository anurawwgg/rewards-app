import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRewards } from '../../hooks/useRewards'
import RewardForm from './RewardForm'

export default function RewardsList() {
  const { rewards, loading, refresh } = useRewards({ activeOnly: false })
  const [editing, setEditing] = useState(null)  // reward object or 'new'
  const [toggling, setToggling] = useState(null)

  async function toggleActive(reward) {
    setToggling(reward.id)
    await supabase
      .from('rewards')
      .update({ is_active: !reward.is_active })
      .eq('id', reward.id)
    await refresh()
    setToggling(null)
  }

  function handleFormDone() {
    setEditing(null)
    refresh()
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-6 h-6 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (editing) {
    return (
      <div>
        <h3 className="font-display text-sm font-semibold text-brand-900 mb-4">
          {editing === 'new' ? 'New Reward' : `Edit: ${editing.name}`}
        </h3>
        <RewardForm
          reward={editing === 'new' ? null : editing}
          onDone={handleFormDone}
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-brand-600">{rewards.length} reward{rewards.length !== 1 ? 's' : ''}</p>
        <button
          onClick={() => setEditing('new')}
          className="px-4 py-1.5 bg-brand-600 text-brand-50 text-sm font-medium rounded-full hover:bg-brand-900 transition-colors"
        >
          ☕ Add Reward
        </button>
      </div>

      {rewards.length === 0 && (
        <p className="text-center text-brand-400 py-8 text-sm">
          No rewards yet. Add one to get started.
        </p>
      )}

      <div className="space-y-2">
        {rewards.map(r => (
          <div
            key={r.id}
            className={`bg-brand-100 border rounded-xl px-4 py-3 flex items-center justify-between gap-3 shadow-sm ${
              r.is_active ? 'border-brand-300' : 'border-brand-200 opacity-60'
            }`}
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-brand-900 text-sm truncate">{r.name}</p>
                {!r.is_active && (
                  <span className="text-xs bg-brand-200 text-brand-600 px-2 py-0.5 rounded-full shrink-0">
                    Off
                  </span>
                )}
              </div>
              <p className="text-brand-400 text-xs mt-0.5">
                {r.points_required.toLocaleString('en-IN')} pts
                {r.description && ` · ${r.description}`}
              </p>
            </div>

            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => setEditing(r)}
                className="text-xs px-2.5 py-1 border border-brand-300 rounded-full text-brand-600 hover:bg-brand-200 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => toggleActive(r)}
                disabled={toggling === r.id}
                className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                  r.is_active
                    ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                    : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                }`}
              >
                {toggling === r.id ? '…' : r.is_active ? 'Disable' : 'Enable'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
