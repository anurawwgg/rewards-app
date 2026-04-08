import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
  const navigate = useNavigate()
  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const syntheticEmail = `${mobile.trim()}@loyalty.app`
    const { error } = await supabase.auth.signInWithPassword({
      email: syntheticEmail,
      password,
    })

    setLoading(false)

    if (error) {
      setError('Invalid mobile number or password.')
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-brand-50 flex flex-col items-center justify-center px-4">
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
                Mobile Number
              </label>
              <input
                type="tel"
                value={mobile}
                onChange={e => setMobile(e.target.value)}
                placeholder="9876543210"
                required
                className="w-full px-3 py-2 border border-brand-300 rounded-lg bg-brand-50 text-brand-900 placeholder-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-900 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
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
              {loading ? 'Signing in…' : '☕ Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-brand-600 mt-4">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-brand-900 font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
