import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRewards } from '../../hooks/useRewards'
import RewardForm from './RewardForm'

export default function RewardsList() {
  const { rewards, loading, refresh } = useRewards({ activeOnly: false })
  const [editing, setEditing] = useState(null)
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

  if (loading) return <Spinner />

  if (editing) {
    return (
      <div>
        <p className="font-label text-brand-600 text-xs tracking-[0.4em] uppercase mb-4">
          {editing === 'new' ? 'New Reward' : `Edit: ${editing.name}`}
        </p>
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
        <p className="font-label text-brand-400 text-xs tracking-widest uppercase">
          {rewards.length} reward{rewards.length !== 1 ? 's' : ''}
        </p>
        <button
          onClick={() => setEditing('new')}
          className="px-4 py-2 bg-brand-600 text-brand-900 font-label text-xs tracking-[0.3em] uppercase hover:bg-brand-700 transition-colors"
        >
          Add Reward
        </button>
      </div>

      {rewards.length === 0 && (
        <p className="text-center text-brand-400 py-8 font-label text-xs tracking-widest uppercase">
          No rewards yet.
        </p>
      )}

      <div className="space-y-1.5">
        {rewards.map(r => (
          <div
            key={r.id}
            className={`bg-brand-100 border px-4 py-3 flex items-center justify-between gap-3 ${
              r.is_active ? 'border-brand-200' : 'border-brand-200 opacity-50'
            }`}
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-serif text-brand-900 text-sm truncate">{r.name}</p>
                {!r.is_active && (
                  <span className="font-label text-xs bg-brand-200 text-brand-400 px-2 py-0.5 tracking-widest uppercase shrink-0">
                    Off
                  </span>
                )}
              </div>
              <p className="font-label text-brand-400 text-xs tracking-wider mt-0.5">
                {r.points_required.toLocaleString('en-IN')} pts
                {r.description && ` · ${r.description}`}
              </p>
            </div>

            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => setEditing(r)}
                className="font-label text-xs px-2.5 py-1 border border-brand-200 text-brand-400 hover:text-brand-900 hover:bg-brand-200 tracking-widest uppercase transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => toggleActive(r)}
                disabled={toggling === r.id}
                className={`font-label text-xs px-2.5 py-1 tracking-widest uppercase transition-colors ${
                  r.is_active
                    ? 'border border-red-200 text-red-500 hover:bg-red-50'
                    : 'border border-green-200 text-green-600 hover:bg-green-50'
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

function Spinner() {
  return (
    <div className="flex justify-center py-8">
      <div className="w-5 h-5 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}
