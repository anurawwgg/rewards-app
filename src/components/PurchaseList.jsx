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
      <p className="text-center text-brand-400 py-8 font-label text-xs tracking-widest uppercase">
        No purchases yet.
      </p>
    )
  }

  return (
    <div className="space-y-1.5">
      {purchases.map(p => (
        <div
          key={p.id}
          className="flex items-center justify-between bg-brand-100 border border-brand-200 px-4 py-3"
        >
          <div>
            <p className="font-serif text-brand-900 text-sm">{p.description || 'Purchase'}</p>
            <p className="font-label text-brand-400 text-xs tracking-wider mt-0.5">
              ₹{Number(p.amount_spent).toLocaleString('en-IN')} · {formatDate(p.created_at)}
            </p>
          </div>
          <div className="text-right">
            <p className="font-display text-brand-600 text-lg leading-none">+{p.points_earned}</p>
            <p className="font-label text-brand-400 text-xs tracking-wider">pts</p>
          </div>
        </div>
      ))}
    </div>
  )
}
