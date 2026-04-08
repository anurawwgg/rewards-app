import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useProfile } from '../hooks/useProfile'
import { usePurchases } from '../hooks/usePurchases'
import { useRewards } from '../hooks/useRewards'
import { useRedemptions } from '../hooks/useRedemptions'
import PointsCard from '../components/PointsCard'
import PurchaseList from '../components/PurchaseList'
import RewardCard from '../components/RewardCard'
import RedeemModal from '../components/RedeemModal'

const TABS = ['Rewards', 'History', 'Redeemed']

export default function Dashboard() {
  const { signOut } = useAuth()
  const { profile, loading: profileLoading, refresh: refreshProfile } = useProfile()
  const { purchases, loading: purchasesLoading } = usePurchases()
  const { rewards, loading: rewardsLoading } = useRewards({ activeOnly: true })
  const { redemptions, loading: redemptionsLoading } = useRedemptions()
  const [activeTab, setActiveTab] = useState('Rewards')
  const [redeemTarget, setRedeemTarget] = useState(null)

  async function handleRedeemSuccess() {
    setRedeemTarget(null)
    await refreshProfile()
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-lg font-bold text-brand-700">Loyalty Rewards</h1>
        <button
          onClick={signOut}
          className="text-sm text-gray-500 hover:text-gray-700 font-medium"
        >
          Sign out
        </button>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Points card */}
        <PointsCard
          points={profile?.total_points ?? 0}
          name={profile?.name}
        />

        {/* Tab nav */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'Rewards' && (
          <div>
            {rewardsLoading ? (
              <Spinner />
            ) : rewards.length === 0 ? (
              <p className="text-center text-gray-400 py-8 text-sm">
                No rewards available right now.
              </p>
            ) : (
              <div className="space-y-3">
                {rewards.map(r => (
                  <RewardCard
                    key={r.id}
                    reward={r}
                    userPoints={profile?.total_points ?? 0}
                    onRedeem={setRedeemTarget}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'History' && (
          <div>
            {purchasesLoading ? <Spinner /> : <PurchaseList purchases={purchases} />}
          </div>
        )}

        {activeTab === 'Redeemed' && (
          <div>
            {redemptionsLoading ? (
              <Spinner />
            ) : redemptions.length === 0 ? (
              <p className="text-center text-gray-400 py-8 text-sm">
                You haven&apos;t redeemed any rewards yet.
              </p>
            ) : (
              <div className="space-y-2">
                {redemptions.map(r => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm"
                  >
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{r.reward_name}</p>
                      <p className="text-gray-400 text-xs mt-0.5">
                        {new Date(r.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-red-500 font-bold text-sm">−{r.points_spent}</p>
                      <p className="text-gray-400 text-xs">pts</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {redeemTarget && (
        <RedeemModal
          reward={redeemTarget}
          onClose={() => setRedeemTarget(null)}
          onSuccess={handleRedeemSuccess}
        />
      )}
    </div>
  )
}

function Spinner() {
  return (
    <div className="flex justify-center py-8">
      <div className="w-6 h-6 border-4 border-brand-400 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}
