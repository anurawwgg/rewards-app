import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

// reward = null means "add new", reward = {...} means "edit existing"
export default function RewardForm({ reward, onDone }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    points_required: '',
    is_active: true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (reward) {
      setForm({
        name: reward.name,
        description: reward.description ?? '',
        points_required: String(reward.points_required),
        is_active: reward.is_active,
      })
    }
  }, [reward])

  function update(field) {
    return e => setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const points = parseInt(form.points_required, 10)
    if (isNaN(points) || points <= 0) {
      setError('Points required must be a positive whole number.')
      return
    }

    setLoading(true)
    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      points_required: points,
      is_active: form.is_active,
    }

    let err
    if (reward) {
      ;({ error: err } = await supabase.from('rewards').update(payload).eq('id', reward.id))
    } else {
      ;({ error: err } = await supabase.from('rewards').insert(payload))
    }

    setLoading(false)

    if (err) {
      setError('Failed to save reward. Please try again.')
    } else {
      onDone()
    }
  }

  const inputClass = 'w-full px-3 py-2 border border-brand-300 rounded-lg bg-brand-50 text-brand-900 placeholder-brand-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-brand-600 mb-1">Reward Name</label>
        <input
          type="text"
          value={form.name}
          onChange={update('name')}
          placeholder="Free Coffee"
          required
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-brand-600 mb-1">Description (optional)</label>
        <input
          type="text"
          value={form.description}
          onChange={update('description')}
          placeholder="One free cup of filter coffee"
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-brand-600 mb-1">Points Required</label>
        <input
          type="number"
          min="1"
          step="1"
          value={form.points_required}
          onChange={update('points_required')}
          placeholder="500"
          required
          className={inputClass}
        />
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={form.is_active}
          onChange={e => setForm(prev => ({ ...prev, is_active: e.target.checked }))}
          className="rounded border-brand-300 text-brand-600 focus:ring-brand-600"
        />
        <span className="text-sm text-brand-700">Active (visible to customers)</span>
      </label>

      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onDone}
          disabled={loading}
          className="flex-1 py-2 border border-brand-300 rounded-full text-sm font-medium text-brand-700 hover:bg-brand-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-2 bg-brand-600 text-brand-50 text-sm font-medium rounded-full hover:bg-brand-900 disabled:opacity-60 transition-colors"
        >
          {loading ? 'Saving…' : reward ? 'Save Changes' : 'Add Reward'}
        </button>
      </div>
    </form>
  )
}
