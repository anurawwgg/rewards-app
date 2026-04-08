import { useState } from 'react'

export default function AdminLogin({ onAuthenticated }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD
    if (password === correctPassword) {
      sessionStorage.setItem('admin_authed', '1')
      onAuthenticated()
    } else {
      setError('Incorrect password.')
      setPassword('')
    }
  }

  return (
    <div className="min-h-screen bg-brand-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">☕</div>
          <h1 className="font-display text-2xl font-bold text-brand-900">Barista Dashboard</h1>
          <p className="text-brand-600 text-sm mt-1">Enter the admin password to continue</p>
        </div>

        <div className="bg-brand-100 rounded-2xl shadow-sm border border-brand-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-900 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoFocus
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
              className="w-full py-2.5 bg-brand-900 text-brand-50 font-medium rounded-full hover:bg-brand-600 transition-colors"
            >
              Unlock
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
