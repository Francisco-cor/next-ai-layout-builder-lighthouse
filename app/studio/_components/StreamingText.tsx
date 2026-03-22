'use client'

interface StreamingTextProps {
  /** Current text content (empty string in idle state) */
  text: string
  state: 'idle' | 'streaming' | 'complete'
  /** Shown in idle — must match dimensions of generated content to prevent CLS */
  placeholder: string
  /**
   * Fixed minimum height for the container.
   * MUST be the same for placeholder and streamed content — this is what keeps CLS = 0.
   * Measure your typical generated output and set this value accordingly.
   */
  minHeight: string
  showCursor: boolean
}

/**
 * Renders generated text token-by-token with a blinking cursor.
 *
 * CLS = 0 guarantee: the container has a fixed minHeight in ALL states.
 * The placeholder uses italic grey text to fill the same space — no layout shift
 * when transitioning from idle → streaming → complete.
 *
 * Cursor: only shown when showCursor=true (delayed 200ms from first token)
 * to avoid a flash for sub-200ms responses.
 */
export function StreamingText({
  text,
  state,
  placeholder,
  minHeight,
  showCursor,
}: StreamingTextProps) {
  return (
    <div
      style={{
        minHeight,
        fontSize: '0.9375rem',
        lineHeight: 1.65,
        color: state === 'idle' ? '#94a3b8' : '#1e293b',
        transition: 'color 0.15s ease',
        position: 'relative',
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap',
      }}
    >
      {state === 'idle' ? (
        <span style={{ fontStyle: 'italic' }}>{placeholder}</span>
      ) : (
        <>
          {text}
          {showCursor && (
            <span
              aria-hidden="true"
              style={{
                display: 'inline-block',
                width: '2px',
                height: '1.1em',
                backgroundColor: '#4f46e5',
                marginLeft: '2px',
                verticalAlign: 'text-bottom',
                animation: 'ai-cursor-blink 1s step-end infinite',
              }}
            />
          )}
        </>
      )}
      <style>{`
        @keyframes ai-cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
