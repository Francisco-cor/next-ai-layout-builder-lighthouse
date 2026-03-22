import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'AI Layout Builder',
    template: '%s | AI Layout Builder',
  },
  description: 'Block-based page builder with streaming AI and Lighthouse 98+',
}

// Required for Accessibility 100 — Lighthouse checks for viewport meta
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to Sanity image CDN — reduces LCP by ~100-200ms on cold connections */}
        <link rel="preconnect" href="https://cdn.sanity.io" />
      </head>
      <body>
        {/* Skip-to-content: required for Accessibility 100 */}
        <a
          href="#main-content"
          style={{
            position: 'absolute',
            left: '-9999px',
            top: 'auto',
            width: '1px',
            height: '1px',
            overflow: 'hidden',
          }}
          onFocus={(e) => {
            e.currentTarget.style.left = '0'
            e.currentTarget.style.width = 'auto'
            e.currentTarget.style.height = 'auto'
            e.currentTarget.style.padding = '0.5rem 1rem'
            e.currentTarget.style.backgroundColor = '#4f46e5'
            e.currentTarget.style.color = '#fff'
            e.currentTarget.style.zIndex = '9999'
          }}
          onBlur={(e) => {
            e.currentTarget.style.left = '-9999px'
          }}
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  )
}
