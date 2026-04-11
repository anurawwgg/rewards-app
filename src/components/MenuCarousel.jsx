import { useState, useEffect, useRef } from 'react'
import { useMenuItems } from '../hooks/useMenuItems'

const PLACEHOLDER_ITEMS = [
  { id: 'p1', name: 'Espresso', description: 'Rich and bold single shot', price: 120, image_url: null },
  { id: 'p2', name: 'Cappuccino', description: 'Espresso with steamed milk foam', price: 180, image_url: null },
  { id: 'p3', name: 'Cold Brew', description: 'Slow steeped for 12 hours', price: 200, image_url: null },
  { id: 'p4', name: 'Caramel Latte', description: 'Espresso with caramel and milk', price: 220, image_url: null },
  { id: 'p5', name: 'Matcha Latte', description: 'Ceremonial grade matcha', price: 210, image_url: null },
]

const CARD_WIDTH = 260
const GAP = 16
const CLONE_COUNT = 2

function buildExtended(items) {
  if (items.length === 0) return []
  const n = Math.min(CLONE_COUNT, items.length)
  return [
    ...items.slice(items.length - n),
    ...items,
    ...items.slice(0, n),
  ]
}

function scrollForIndex(el, idx) {
  return idx * (CARD_WIDTH + GAP) - (el.clientWidth - CARD_WIDTH) / 2
}

function centeredIndex(el) {
  return Math.round((el.scrollLeft + (el.clientWidth - CARD_WIDTH) / 2) / (CARD_WIDTH + GAP))
}

export default function MenuCarousel() {
  const { items, loading } = useMenuItems({ activeOnly: true })
  const [favourites, setFavourites] = useState(new Set())
  const scrollerRef = useRef(null)
  const debounceRef = useRef(null)
  const teleportRef = useRef(null)

  const displayItems = (!loading && items.length === 0) ? PLACEHOLDER_ITEMS : items
  const extended = buildExtended(displayItems)
  const realCount = displayItems.length

  teleportRef.current = () => {
    const el = scrollerRef.current
    if (!el || realCount === 0) return
    const n = Math.min(CLONE_COUNT, realCount)
    const idx = centeredIndex(el)
    if (idx < n) {
      el.scrollLeft = scrollForIndex(el, idx + realCount)
    } else if (idx >= n + realCount) {
      el.scrollLeft = scrollForIndex(el, idx - realCount)
    }
  }

  useEffect(() => {
    const el = scrollerRef.current
    if (!el || extended.length === 0) return
    const n = Math.min(CLONE_COUNT, realCount)
    requestAnimationFrame(() => {
      el.scrollLeft = scrollForIndex(el, n)
    })
  }, [extended.length]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleScroll() {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => teleportRef.current?.(), 120)
  }

  function toggleFav(id) {
    setFavourites(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div>
      {/* Section eyebrow + title */}
      <p
        className="font-label text-brand-600"
        style={{ fontSize: '0.6rem', letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '6px' }}
      >
        Klaffeine
      </p>
      <h2
        className="font-display text-brand-900 leading-none"
        style={{ fontSize: '28px', letterSpacing: '0.04em', marginBottom: '14px' }}
      >
        OUR BESTSELLERS
      </h2>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-5 h-5 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div style={{ marginLeft: '-16px', marginRight: '-16px' }}>
          <div
            ref={scrollerRef}
            className="no-scrollbar"
            onScroll={handleScroll}
            style={{
              display: 'flex',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              gap: `${GAP}px`,
              paddingTop: '4px',
              paddingBottom: '12px',
            }}
          >
            {extended.map((item, i) => (
              <MenuCard
                key={`${item.id}-${i}`}
                item={item}
                isFav={favourites.has(item.id)}
                onToggleFav={() => toggleFav(item.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function MenuCard({ item, isFav, onToggleFav }) {
  return (
    <div
      style={{
        width: `${CARD_WIDTH}px`,
        minWidth: `${CARD_WIDTH}px`,
        height: '320px',
        flexShrink: 0,
        scrollSnapAlign: 'center',
        borderRadius: 0,
        border: '1px solid #d9cfc0',
        backgroundColor: '#fdfaf5',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 1px 4px rgba(14,11,7,0.08)',
      }}
    >
      {/* Image — top half */}
      <div style={{ height: '160px', flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#f5efe3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Placeholder: caramel coffee cup icon */}
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#c4722a" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.4">
              <path d="M5 8h14l-1.5 9a2 2 0 0 1-2 1.5H8.5a2 2 0 0 1-2-1.5L5 8z" />
              <path d="M17 10h2a2 2 0 0 1 0 4h-2" />
              <path d="M7 8V6a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2" />
              <path d="M4 19h16" />
            </svg>
          </div>
        )}
        {/* Caramel accent bar at top */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', backgroundColor: '#c4722a' }} />
      </div>

      {/* Info — bottom half */}
      <div
        style={{
          flex: 1,
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <p
            style={{
              fontFamily: '"Bebas Neue", Impact, sans-serif',
              fontWeight: 400,
              fontSize: '18px',
              color: '#0e0b07',
              letterSpacing: '0.04em',
              marginBottom: '4px',
              lineHeight: 1.1,
            }}
          >
            {item.name}
          </p>
          <p
            style={{
              fontFamily: '"DM Serif Display", Georgia, serif',
              fontStyle: 'italic',
              fontSize: '12px',
              color: '#9a8070',
              lineHeight: '1.45',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {item.description}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
          <p style={{
            fontFamily: '"DM Mono", monospace',
            fontSize: '13px',
            fontWeight: 500,
            color: '#0e0b07',
            letterSpacing: '0.05em',
          }}>
            ₹{Number(item.price).toLocaleString('en-IN')}
          </p>
          <button
            onClick={onToggleFav}
            aria-label={isFav ? 'Remove from favourites' : 'Add to favourites'}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
              color: isFav ? '#c4722a' : '#d9cfc0',
              padding: '4px',
              lineHeight: 1,
              transition: 'color 0.15s',
            }}
          >
            {isFav ? '♥' : '♡'}
          </button>
        </div>
      </div>
    </div>
  )
}
