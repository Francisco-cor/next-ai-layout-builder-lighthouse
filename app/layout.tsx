import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'AI Layout Builder',
    template: '%s | AI Layout Builder',
  },
  description: 'Block-based page builder with streaming AI and Lighthouse 98+',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
