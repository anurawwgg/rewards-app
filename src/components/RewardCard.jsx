export default function RewardCard({ reward, userPoints, onRedeem }) {
  const canAfford = userPoints >= reward.points_required

  return (
    <div className={`bg-brand-100 border ${canAfford ? 'border-brand-600' : 'border-brand-200'}`}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-serif text-brand-900 text-sm">{reward.name}</h3>
            {reward.description && (
              <p className="font-label text-brand-400 text-xs tracking-wide mt-0.5">{reward.description}</p>
            )}
          </div>
          <div className="text-right shrink-0">
            <p className="font-display text-brand-600 text-xl leading-none">
              {reward.points_required.toLocaleString('en-IN')}
            </p>
            <p className="font-label text-brand-400 text-xs tracking-widest uppercase">pts</p>
          </div>
        </div>

        <button
          onClick={() => onRedeem(reward)}
          disabled={!canAfford}
          className={`mt-3 w-full py-2 font-label text-xs tracking-[0.3em] uppercase transition-colors ${
            canAfford
              ? 'bg-brand-600 text-brand-900 hover:bg-brand-700'
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
