// Studio shell — Week 1 placeholder.
// The actual dnd-kit editor UI is Week 2 work.
// Separating this route NOW ensures the bundle split is established
// before any editor code is written.

export default function StudioPage() {
  return (
    <div
      style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '4rem 2rem',
        textAlign: 'center',
      }}
    >
      <h1
        style={{
          fontSize: '2rem',
          fontWeight: 700,
          color: '#0f172a',
          marginBottom: '1rem',
        }}
      >
        Page Builder Studio
      </h1>
      <p
        style={{
          fontSize: '1.125rem',
          color: '#64748b',
          marginBottom: '2rem',
          lineHeight: 1.6,
        }}
      >
        Week 1 complete. Schema ✓ · GraphQL ✓ · ISR ✓ · Bundle isolation ✓
        <br />
        The drag-and-drop editor arrives in Week 2.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          textAlign: 'left',
          marginTop: '3rem',
        }}
      >
        {[
          { label: 'Sanity Schema', status: '✓', detail: '6 block types committed' },
          { label: 'GraphQL Layer', status: '✓', detail: 'Apollo + codegen types' },
          { label: 'ISR Pages', status: '✓', detail: 'revalidate: 60s' },
          { label: 'Bundle Split', status: '✓', detail: 'Studio ≠ public bundle' },
          { label: 'LCP Target', status: '⏳', detail: '<1.8s with real data' },
          { label: 'Drag & Drop', status: '⏳', detail: 'Week 2 — dnd-kit' },
        ].map(({ label, status, detail }) => (
          <div
            key={label}
            style={{
              padding: '1.25rem',
              backgroundColor: '#fff',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
            }}
          >
            <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{status}</div>
            <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem' }}>{label}</div>
            <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>{detail}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
