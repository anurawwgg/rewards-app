export default function PointsCard({ points, name }) {
  return (
    <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl p-6 text-white shadow-md">
      <p className="text-brand-100 text-sm font-medium uppercase tracking-wide">Your Balance</p>
      <p className="text-5xl font-bold mt-2">{points.toLocaleString('en-IN')}</p>
      <p className="text-brand-200 text-sm mt-1">points</p>
      {name && (
        <p className="mt-4 text-brand-100 text-sm">
          Welcome back, <span className="font-semibold text-white">{name}</span>
        </p>
      )}
    </div>
  )
}
