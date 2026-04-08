import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-50 flex flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl mb-2">☕</p>
      <p className="font-display text-6xl font-bold text-brand-200">404</p>
      <h1 className="font-display text-xl font-semibold text-brand-900 mt-3">Page not found</h1>
      <p className="text-brand-600 text-sm mt-1">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link
        to="/dashboard"
        className="mt-6 px-6 py-2.5 bg-brand-600 text-brand-50 text-sm font-medium rounded-full hover:bg-brand-900 transition-colors"
      >
        Back to Dashboard
      </Link>
    </div>
  )
}
