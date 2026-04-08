function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function PurchaseList({ purchases }) {
  if (purchases.length === 0) {
    return (
      <p className="text-center text-brand-400 py-8 text-sm">
        No purchases yet. Start shopping to earn points!
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {purchases.map(p => (
        <div
          key={p.id}
          className="flex items-center justify-between bg-brand-100 rounded-xl px-4 py-3 border border-brand-200 shadow-sm"
        >
          <div>
            <p className="font-medium text-brand-900 text-sm">{p.description || 'Purchase'}</p>
            <p className="text-brand-400 text-xs mt-0.5">
              ₹{Number(p.amount_spent).toLocaleString('en-IN')} · {formatDate(p.created_at)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-brand-600 font-bold text-sm">+{p.points_earned}</p>
            <p className="text-brand-400 text-xs">pts</p>
          </div>
        </div>
      ))}
    </div>
  )
}
