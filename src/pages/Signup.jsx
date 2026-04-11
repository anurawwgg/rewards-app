import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', mobile: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function update(field) {
    return e => setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    const mobile = form.mobile.trim()
    if (!/^\d{10}$/.test(mobile)) {
      setError('Enter a valid 10-digit mobile number.')
      return
    }

    setLoading(true)
    const syntheticEmail = `${mobile}@loyalty.app`

    const { error } = await supabase.auth.signUp({
      email: syntheticEmail,
      password: form.password,
      options: {
        data: {
          name: form.name.trim(),
          mobile_number: mobile,
        },
      },
    })

    setLoading(false)

    if (error) {
      if (error.message.includes('already registered')) {
        setError('This mobile number is already registered. Please log in.')
      } else {
        setError(error.message)
      }
    } else {
      navigate('/dashboard')
    }
  }

  const inputClass = 'w-full px-3 py-2.5 border border-brand-200 bg-brand-900 text-brand-100 placeholder-brand-400 text-sm focus:outline-none focus:border-brand-600 transition-colors'

  return (
    <div className="min-h-screen bg-brand-900 flex flex-col items-center justify-center px-4 py-8 grain-overlay">

      {/* Radial glow */}
      <div style={{
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(196,114,42,0.10) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="w-full max-w-sm relative z-10">
        {/* Hero */}
        <div className="mb-8">
          <p className="font-label text-brand-600 text-xs tracking-[0.4em] uppercase mb-3">Join the Club</p>
          <h1 className="font-display text-7xl text-brand-100 leading-none">KLAFFEINE</h1>
          <p className="font-serif italic text-brand-300 text-sm mt-3 leading-snug">
            The coffee the world didn&apos;t know it was waiting for.
          </p>
        </div>

        {/* Form */}
        <div className="border border-brand-800 bg-brand-800 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-label text-brand-200 text-xs tracking-widest uppercase mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={update('name')}
                placeholder="Priya Sharma"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="block font-label text-brand-200 text-xs tracking-widest uppercase mb-1.5">
                Mobile Number
              </label>
              <input
                type="tel"
                value={form.mobile}
                onChange={update('mobile')}
                placeholder="9876543210"
                required
                maxLength={10}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block font-label text-brand-200 text-xs tracking-widest uppercase mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={update('password')}
                placeholder="••••••••"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="block font-label text-brand-200 text-xs tracking-widest uppercase mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                value={form.confirm}
                onChange={update('confirm')}
                placeholder="••••••••"
                required
                className={inputClass}
              />
            </div>

            {error && (
              <p className="text-xs text-red-400 border border-red-900 bg-red-950/40 px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-600 text-brand-900 font-label text-xs tracking-[0.3em] uppercase font-medium hover:bg-brand-700 disabled:opacity-60 transition-colors"
            >
              {loading ? 'Creating account…' : 'Join Klaffeine'}
            </button>
          </form>
        </div>

        <p className="text-brand-400 text-xs mt-4 font-label tracking-wider">
          Already a member?{' '}
          <Link to="/login" className="text-brand-600 hover:text-brand-500 uppercase tracking-widest">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
