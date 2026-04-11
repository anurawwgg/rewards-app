import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useProfile } from '../hooks/useProfile'
import { usePurchases } from '../hooks/usePurchases'
import { useRewards } from '../hooks/useRewards'
import { useRedemptions } from '../hooks/useRedemptions'
import PointsCard from '../components/PointsCard'
import StampCard from '../components/StampCard'
import MenuCarousel from '../components/MenuCarousel'
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
      <div className="min-h-screen bg-brand-50 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-50">
      {/* Header */}
      <header className="bg-brand-900 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <h1 className="font-display text-2xl text-brand-100 leading-none tracking-wide">KLAFFEINE</h1>
        <button
          onClick={signOut}
          className="font-label text-brand-400 text-xs tracking-widest uppercase hover:text-brand-600 transition-colors"
        >
          Sign out
        </button>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* Points card */}
        <PointsCard
          points={profile?.total_points ?? 0}
          name={profile?.name}
        />

        {/* Stamp card */}
        {profile && (
          <StampCard
            stampCount={profile.stamp_count ?? 0}
            customerId={profile.id}
            onClaim={refreshProfile}
          />
        )}

        {/* Menu carousel */}
        <MenuCarousel />

        {/* Section eyebrow */}
        <div className="pt-2">
          <p className="font-label text-brand-600" style={{ fontSize: '0.6rem', letterSpacing: '0.4em', textTransform: 'uppercase' }}>
            Your Account
          </p>
        </div>

        {/* Tab nav */}
        <div className="flex border border-brand-200">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 font-label text-xs tracking-widest uppercase transition-colors ${
                activeTab === tab
                  ? 'bg-brand-900 text-brand-100'
                  : 'text-brand-400 hover:text-brand-900 hover:bg-brand-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-brand-200" />
          <span className="font-label text-brand-300" style={{ fontSize: '0.55rem', letterSpacing: '0.4em' }}>✦</span>
          <div className="flex-1 h-px bg-brand-200" />
        </div>

        {/* Tab content */}
        {activeTab === 'Rewards' && (
          <div>
            {rewardsLoading ? (
              <Spinner />
            ) : rewards.length === 0 ? (
              <p className="text-center text-brand-400 py-8 font-label text-xs tracking-widest uppercase">
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
              <p className="text-center text-brand-400 py-8 font-label text-xs tracking-widest uppercase">
                No redemptions yet.
              </p>
            ) : (
              <div className="space-y-2">
                {redemptions.map(r => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between bg-brand-100 border border-brand-200 px-4 py-3"
                  >
                    <div>
                      <p className="font-serif text-brand-900 text-sm">{r.reward_name}</p>
                      <p className="font-label text-brand-400 text-xs tracking-wider mt-0.5">
                        {new Date(r.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-brand-600 text-lg leading-none">−{r.points_spent}</p>
                      <p className="font-label text-brand-400 text-xs tracking-wider">pts</p>
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
      <div className="w-5 h-5 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}
