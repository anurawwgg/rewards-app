export default function PointsCard({ points, name }) {
  return (
    <div className="bg-brand-900 rounded-2xl p-6 text-brand-50 shadow-lg">
      <p className="text-brand-300 text-xs font-semibold uppercase tracking-widest" style={{ fontVariant: 'small-caps' }}>
        Bean &amp; Brew
      </p>
      <p className="font-display text-6xl font-bold mt-2 text-brand-50">
        {points.toLocaleString('en-IN')}
      </p>
      <p className="text-brand-300 text-sm mt-1 tracking-wide">points</p>
      <div className="mt-5 pt-4 border-t border-brand-700 flex items-center justify-between">
        {name && (
          <p className="text-brand-200 text-sm">
            Welcome back, <span className="font-semibold text-brand-50">{name}</span>
          </p>
        )}
        <p className="text-brand-600 text-xl ml-auto">☕</p>
      </div>
    </div>
  )
}
