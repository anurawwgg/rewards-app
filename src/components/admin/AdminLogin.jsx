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
    <div className="min-h-screen bg-brand-900 flex items-center justify-center px-4 grain-overlay">

      <div style={{
        position: 'absolute',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(196,114,42,0.10) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="w-full max-w-sm relative z-10">
        <div className="mb-8">
          <p className="font-label text-brand-600 text-xs tracking-[0.4em] uppercase mb-3">Operations Access</p>
          <h1 className="font-display text-6xl text-brand-100 leading-none">KLAFFEINE</h1>
          <p className="font-serif italic text-brand-400 text-sm mt-2">Admin Dashboard</p>
        </div>

        <div className="bg-brand-800 border border-brand-800 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-label text-brand-200 text-xs tracking-widest uppercase mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoFocus
                className="w-full px-3 py-2.5 border border-brand-200 bg-brand-900 text-brand-100 placeholder-brand-400 text-sm focus:outline-none focus:border-brand-600 transition-colors"
              />
            </div>

            {error && (
              <p className="text-xs text-red-400 border border-red-900 bg-red-950/40 px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-brand-600 text-brand-900 font-label text-xs tracking-[0.3em] uppercase font-medium hover:bg-brand-700 transition-colors"
            >
              Unlock
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
