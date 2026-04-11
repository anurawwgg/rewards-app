import { useState } from 'react'
import AdminLogin from '../components/admin/AdminLogin'
import CustomerSearch from '../components/admin/CustomerSearch'
import RewardsList from '../components/admin/RewardsList'
import AdminMenuList from '../components/admin/AdminMenuList'

const TABS = ['Customers', 'Rewards', 'Menu']

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
      <header className="bg-brand-900 px-4 py-3 flex items-center justify-between sticky top-0 z-10 grain-overlay">
        <div>
          <h1 className="font-display text-2xl text-brand-100 leading-none tracking-wide">KLAFFEINE</h1>
          <p className="font-label text-brand-600 leading-none" style={{ fontSize: '0.55rem', letterSpacing: '0.35em', textTransform: 'uppercase', marginTop: '2px' }}>
            Operations
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="font-label text-brand-400 text-xs tracking-widest uppercase hover:text-brand-600 transition-colors"
        >
          Lock
        </button>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
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

        {activeTab === 'Customers' && <CustomerSearch />}
        {activeTab === 'Rewards' && <RewardsList />}
        {activeTab === 'Menu' && <AdminMenuList />}
      </div>
    </div>
  )
}
