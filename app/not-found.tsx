export default function NotFound() {
  return (
    <main
      id="main-content"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <h1 style={{ fontSize: '6rem', fontWeight: 800, color: '#e2e8f0', lineHeight: 1, margin: 0 }}>
        404
      </h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#0f172a', margin: '1rem 0 0.5rem' }}>
        Page not found
      </h2>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>
        This page doesn&apos;t exist or has been moved.
      </p>
      <a
        href="/"
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#4f46e5',
          color: '#fff',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 500,
        }}
      >
        Back to home
      </a>
    </main>
  )
}
