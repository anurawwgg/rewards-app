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

  return (
    <div className="min-h-screen bg-brand-50 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">☕</div>
          <h1 className="font-display text-3xl font-bold text-brand-900">Bean &amp; Brew Rewards</h1>
          <p className="text-brand-600 mt-2 text-sm italic">Every sip earns a reward</p>
        </div>

        <div className="bg-brand-100 rounded-2xl shadow-sm border border-brand-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-900 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={update('name')}
                placeholder="Priya Sharma"
                required
                className="w-full px-3 py-2 border border-brand-300 rounded-lg bg-brand-50 text-brand-900 placeholder-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-900 mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                value={form.mobile}
                onChange={update('mobile')}
                placeholder="9876543210"
                required
                maxLength={10}
                className="w-full px-3 py-2 border border-brand-300 rounded-lg bg-brand-50 text-brand-900 placeholder-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-900 mb-1">
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={update('password')}
                placeholder="••••••••"
                required
                className="w-full px-3 py-2 border border-brand-300 rounded-lg bg-brand-50 text-brand-900 placeholder-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-900 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={form.confirm}
                onChange={update('confirm')}
                placeholder="••••••••"
                required
                className="w-full px-3 py-2 border border-brand-300 rounded-lg bg-brand-50 text-brand-900 placeholder-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent"
              />
            </div>

            {error && (
              <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-brand-600 text-brand-50 font-medium rounded-full hover:bg-brand-900 disabled:opacity-60 transition-colors"
            >
              {loading ? 'Creating account…' : '☕ Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-brand-600 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-900 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
