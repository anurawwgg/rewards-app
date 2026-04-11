import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-900 flex flex-col items-center justify-center px-4 text-center grain-overlay">
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

      <div className="relative z-10">
        <p className="font-label text-brand-600" style={{ fontSize: '0.6rem', letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '12px' }}>
          Error
        </p>
        <p className="font-display text-brand-800 leading-none" style={{ fontSize: 'clamp(80px, 20vw, 140px)' }}>404</p>
        <h1 className="font-serif italic text-brand-300 text-lg mt-2">Page not found.</h1>
        <p className="font-label text-brand-400 text-xs tracking-widest mt-2">
          This page doesn&apos;t exist.
        </p>
        <Link
          to="/dashboard"
          className="inline-block mt-8 px-8 py-3 bg-brand-600 text-brand-900 font-label text-xs tracking-[0.3em] uppercase hover:bg-brand-700 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
