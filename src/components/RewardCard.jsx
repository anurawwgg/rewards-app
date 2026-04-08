export default function RewardCard({ reward, userPoints, onRedeem }) {
  const canAfford = userPoints >= reward.points_required

  return (
    <div className={`bg-white rounded-xl border shadow-sm overflow-hidden ${canAfford ? 'border-brand-200' : 'border-gray-100'}`}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-gray-800">{reward.name}</h3>
            {reward.description && (
              <p className="text-gray-500 text-sm mt-0.5">{reward.description}</p>
            )}
          </div>
          <div className="text-right shrink-0">
            <p className="text-brand-600 font-bold">{reward.points_required.toLocaleString('en-IN')}</p>
            <p className="text-gray-400 text-xs">pts</p>
          </div>
        </div>

        <button
          onClick={() => onRedeem(reward)}
          disabled={!canAfford}
          className={`mt-3 w-full py-2 rounded-lg text-sm font-medium transition-colors ${
            canAfford
              ? 'bg-brand-600 text-white hover:bg-brand-700'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {canAfford ? 'Redeem' : `Need ${(reward.points_required - userPoints).toLocaleString('en-IN')} more pts`}
        </button>
      </div>
    </div>
  )
}
