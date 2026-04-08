import { useState } from 'react'
import AdminLogin from '../components/admin/AdminLogin'
import CustomerSearch from '../components/admin/CustomerSearch'
import RewardsList from '../components/admin/RewardsList'

const TABS = ['Customers', 'Rewards']

function isAuthed() {
  return sessionStorage.getItem('admin_authed') === '1'
}

export default function Admin() {
  const [authed, setAuthed] = useState(isAuthed())
  const [activeTab, setActiveTab] = useState('Customers')

  function handleLogout() {
    sessionStorage.removeItem('admin_authed')
    setAuthed(false)
  }

  if (!authed) {
    return <AdminLogin onAuthenticated={() => setAuthed(true)} />
  }

  return (
    <div className="min-h-screen bg-brand-50">
      {/* Header */}
      <header className="bg-brand-900 text-brand-50 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <h1 className="font-display text-lg font-semibold text-brand-50">☕ Barista Dashboard</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-brand-300 hover:text-brand-50 font-medium transition-colors"
        >
          Lock
        </button>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Tab nav */}
        <div className="flex gap-1 bg-brand-100 rounded-xl p-1 border border-brand-200">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab
                  ? 'bg-brand-900 text-brand-50 shadow-sm'
                  : 'text-brand-600 hover:text-brand-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'Customers' && <CustomerSearch />}
        {activeTab === 'Rewards' && <RewardsList />}
      </div>
    </div>
  )
}
