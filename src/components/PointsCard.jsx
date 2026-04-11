export default function PointsCard({ points, name }) {
  return (
    <div
      className="grain-overlay bg-brand-900 text-brand-100 shadow-xl"
      style={{
        padding: '24px',
        background: 'linear-gradient(135deg, #0e0b07 0%, #2b1a0e 100%)',
      }}
    >
      {/* Caramel radial glow */}
      <div style={{
        position: 'absolute',
        top: '-20px',
        right: '-20px',
        width: '180px',
        height: '180px',
        background: 'radial-gradient(circle, rgba(196,114,42,0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Eyebrow */}
        <p className="font-label text-brand-600 leading-none" style={{ fontSize: '0.6rem', letterSpacing: '0.4em', textTransform: 'uppercase' }}>
          Klaffeine Rewards
        </p>

        {/* Points number */}
        <p className="font-display text-brand-100 leading-none" style={{ fontSize: 'clamp(56px, 15vw, 80px)', marginTop: '4px' }}>
          {points.toLocaleString('en-IN')}
        </p>
        <p className="font-label text-brand-400" style={{ fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginTop: '2px' }}>
          Points
        </p>

        {/* Divider + name */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(217,207,192,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {name && (
            <p className="font-serif text-brand-300 text-sm">
              Welcome back, <span className="text-brand-100 not-italic font-semibold">{name}</span>
            </p>
          )}
          <p className="font-label text-brand-600 ml-auto" style={{ fontSize: '0.6rem', letterSpacing: '0.3em' }}>
            MEMBER
          </p>
        </div>
      </div>
    </div>
  )
}
