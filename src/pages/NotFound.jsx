import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-brand-300">404</p>
      <h1 className="text-xl font-semibold text-gray-700 mt-3">Page not found</h1>
      <p className="text-gray-400 text-sm mt-1">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link
        to="/dashboard"
        className="mt-6 px-5 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors"
      >
        Back to Dashboard
      </Link>
    </div>
  )
}
