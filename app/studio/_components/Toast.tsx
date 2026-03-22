'use client'
import type { Toast as ToastType } from '@/hooks/useToast'

interface ToastContainerProps {
  toasts: ToastType[]
  onDismiss: (id: string) => void
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        maxWidth: '360px',
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="alert"
          style={{
            padding: '0.875rem 1.25rem',
            borderRadius: '8px',
            backgroundColor: toast.type === 'error' ? '#fef2f2' : '#f0fdf4',
            border: `1px solid ${toast.type === 'error' ? '#fecaca' : '#bbf7d0'}`,
            color: toast.type === 'error' ? '#991b1b' : '#166534',
            fontSize: '0.875rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            animation: 'slideIn 0.2s ease',
          }}
        >
          <span style={{ flex: 1 }}>{toast.message}</span>
          <button
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              color: 'inherit',
              opacity: 0.6,
              padding: 0,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
      ))}
      <style>{`@keyframes slideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  )
}
