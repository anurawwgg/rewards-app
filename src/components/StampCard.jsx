import { useState } from 'react'
import { supabase } from '../lib/supabase'

const STAMPS_NEEDED = 6

// Simple coffee cup SVG
function CoffeeCupIcon({ filled, size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 8h14l-1.5 9a2 2 0 0 1-2 1.5H8.5a2 2 0 0 1-2-1.5L5 8z" />
      <path d="M17 10h2a2 2 0 0 1 0 4h-2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M7 8V6a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2" />
      <path d="M4 19h16" strokeWidth="1.5" />
    </svg>
  )
}

// Ink:     #0e0b07
// Caramel: #c4722a
// Cream:   #f5efe3
// Steam:   #d9cfc0
// Off-white: #fdfaf5

export default function StampCard({ stampCount = 0, customerId, onClaim }) {
  const [claiming, setClaiming] = useState(false)
  const [claimError, setClaimError] = useState('')
  const [justClaimed, setJustClaimed] = useState(false)

  const stamped = Math.min(stampCount, STAMPS_NEEDED)
  const canClaim = stampCount >= STAMPS_NEEDED
  const remaining = STAMPS_NEEDED - stamped

  async function handleClaim() {
    setClaiming(true)
    setClaimError('')

    const { data, error } = await supabase.rpc('claim_stamp_reward', {
      p_customer_id: customerId,
    })

    setClaiming(false)

    if (error || data === 'insufficient_stamps') {
      setClaimError('Could not claim reward. Please try again.')
      return
    }

    setJustClaimed(true)
    setTimeout(() => setJustClaimed(false), 3000)
    onClaim?.()
  }

  return (
    <div
      style={{
        backgroundColor: '#fdfaf5',
        border: '1px solid #d9cfc0',
        borderRadius: 0,
        padding: '14px',
      }}
    >
      {/* Header */}
      <p
        style={{
          fontFamily: '"Bebas Neue", Impact, sans-serif',
          fontWeight: 400,
          fontSize: '18px',
          color: '#0e0b07',
          letterSpacing: '0.05em',
          marginBottom: '1px',
          lineHeight: 1,
        }}
      >
        YOUR COFFEE CARD
      </p>
      <p
        style={{
          fontFamily: '"DM Mono", monospace',
          fontSize: '10px',
          color: '#c4722a',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          marginBottom: '12px',
        }}
      >
        Buy 6, get the 7th free
      </p>

      {/* Stamp circles */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
        {Array.from({ length: STAMPS_NEEDED }).map((_, i) => {
          const isStamped = i < stamped
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 0,
                  border: isStamped ? '2px solid #0e0b07' : '2px solid #d9cfc0',
                  backgroundColor: isStamped ? '#0e0b07' : '#f5efe3',
                  color: isStamped ? '#f5efe3' : '#c4722a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'background-color 0.3s, color 0.3s',
                }}
              >
                <CoffeeCupIcon filled={isStamped} size={16} />
              </div>
            </div>
          )
        })}

        {/* 7th — FREE */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <div
            className={canClaim ? 'stamp-pulse' : ''}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 0,
              border: canClaim ? '2px solid #c4722a' : '2px solid #d9cfc0',
              backgroundColor: canClaim ? '#0e0b07' : '#f5efe3',
              color: canClaim ? '#f5efe3' : '#c4722a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'background-color 0.3s, color 0.3s',
            }}
          >
            <CoffeeCupIcon filled={canClaim} size={19} />
          </div>
          <span
            style={{
              fontFamily: '"DM Mono", monospace',
              fontSize: '9px',
              fontWeight: 500,
              color: '#e8b84b',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            FREE
          </span>
        </div>
      </div>

      {/* Progress text */}
      <p
        style={{
          fontFamily: '"DM Mono", monospace',
          fontSize: '10px',
          color: '#9a8070',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          marginTop: '10px',
        }}
      >
        {canClaim
          ? '✦ Claim your free coffee'
          : `${remaining} more coffee${remaining !== 1 ? 's' : ''} until your free one`}
      </p>

      {/* Claim button */}
      {canClaim && (
        <button
          onClick={handleClaim}
          disabled={claiming}
          style={{
            marginTop: '10px',
            width: '100%',
            padding: '8px 0',
            backgroundColor: claiming ? '#a85e20' : '#c4722a',
            color: '#0e0b07',
            border: 'none',
            borderRadius: 0,
            fontFamily: '"DM Mono", monospace',
            fontSize: '10px',
            fontWeight: 500,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            cursor: claiming ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.15s',
          }}
        >
          {claiming ? 'Claiming…' : 'Claim Free Coffee'}
        </button>
      )}

      {justClaimed && (
        <p
          style={{
            fontFamily: '"DM Mono", monospace',
            fontSize: '10px',
            color: '#2d6a4f',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginTop: '8px',
            textAlign: 'center',
          }}
        >
          ✓ Claimed. Enjoy.
        </p>
      )}

      {claimError && (
        <p style={{ fontFamily: '"DM Mono", monospace', fontSize: '10px', color: '#e53e3e', marginTop: '8px', letterSpacing: '0.1em' }}>
          {claimError}
        </p>
      )}
    </div>
  )
}
