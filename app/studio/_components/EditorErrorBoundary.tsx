'use client'
import { Component, type ReactNode, type ErrorInfo } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

// Class component required — React error boundaries cannot be written as hooks.
export class EditorErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[EditorErrorBoundary] uncaught render error:', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            gap: '1rem',
            color: '#64748b',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <p style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>
            The editor encountered an unexpected error.
          </p>
          <p style={{ fontSize: '0.875rem', margin: 0 }}>
            {this.state.error.message}
          </p>
          <button
            onClick={() => this.setState({ error: null })}
            style={{
              marginTop: '0.5rem',
              padding: '0.5rem 1.25rem',
              backgroundColor: '#4f46e5',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.875rem',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
