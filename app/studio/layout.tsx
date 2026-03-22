'use client'

// This layout is intentionally 'use client'.
// It is completely isolated from the public bundle (app/[slug]/).
// The editor, dnd-kit, and all heavy studio dependencies live here —
// they never appear in the Lighthouse-scored public route.

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          backgroundColor: '#f8fafc',
          minHeight: '100dvh',
        }}
      >
        {children}
      </body>
    </html>
  )
}
