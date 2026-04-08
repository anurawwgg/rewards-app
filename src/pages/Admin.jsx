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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-800 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-lg font-semibold">Admin Panel</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-300 hover:text-white font-medium"
        >
          Lock
        </button>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Tab nav */}
        <div className="flex gap-1 bg-gray-200 rounded-xl p-1">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
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
