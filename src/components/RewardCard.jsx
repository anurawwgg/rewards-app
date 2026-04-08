export default function RewardCard({ reward, userPoints, onRedeem }) {
  const canAfford = userPoints >= reward.points_required

  return (
    <div className={`bg-brand-100 rounded-xl border shadow-sm overflow-hidden ${canAfford ? 'border-brand-300' : 'border-brand-200'}`}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-brand-900">{reward.name}</h3>
            {reward.description && (
              <p className="text-brand-600 text-sm mt-0.5">{reward.description}</p>
            )}
          </div>
          <div className="text-right shrink-0">
            <p className="text-brand-600 font-bold">{reward.points_required.toLocaleString('en-IN')}</p>
            <p className="text-brand-400 text-xs">pts</p>
          </div>
        </div>

        <button
          onClick={() => onRedeem(reward)}
          disabled={!canAfford}
          className={`mt-3 w-full py-2 rounded-full text-sm font-medium transition-colors ${
            canAfford
              ? 'bg-brand-600 text-brand-50 hover:bg-brand-900'
              : 'bg-brand-200 text-brand-400 cursor-not-allowed'
          }`}
        >
          {canAfford
            ? 'Redeem ✦'
            : `Need ${(reward.points_required - userPoints).toLocaleString('en-IN')} more pts`}
        </button>
      </div>
    </div>
  )
}
