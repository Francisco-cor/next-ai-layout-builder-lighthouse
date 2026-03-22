// Central design tokens — import from here instead of hardcoding hex values.
// Usage: import { theme } from '@/lib/theme'

export const theme = {
  colors: {
    primary: '#4f46e5',
    primaryHover: '#4338ca',
    white: '#ffffff',
    bodyText: '#0f172a',
    subtleText: '#64748b',
    mutedText: '#94a3b8',
    border: '#e2e8f0',
    borderLight: '#f1f5f9',
    surfaceBase: '#ffffff',
    surfaceSubtle: '#f8fafc',
    surfaceMuted: '#f1f5f9',
    danger: '#ef4444',
    dangerSubtle: '#fef2f2',
  },
  radii: {
    sm: '4px',
    md: '6px',
    lg: '8px',
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.8125rem',
    base: '0.875rem',
    md: '1rem',
  },
} as const

export type Theme = typeof theme
