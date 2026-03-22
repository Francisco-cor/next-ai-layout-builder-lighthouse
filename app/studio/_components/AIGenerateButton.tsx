'use client'
import { useCallback } from 'react'
import { useAIGenerate, type GenerateState } from '@/hooks/useAIGenerate'
import { StreamingText } from './StreamingText'

interface AIGenerateButtonProps {
  blockType: string
  context?: Record<string, string>
  /** Called when generation completes — caller decides what to do with the text */
  onAccept: (text: string) => void
  /** Placeholder text shown in idle state (sets the fixed height baseline) */
  placeholder: string
  /** Fixed container height — must be the same for all states to keep CLS = 0 */
  minHeight?: string
  label?: string
}

function StateButton({
  state,
  onGenerate,
  onCancel,
  onRegenerate,
}: {
  state: GenerateState
  onGenerate: () => void
  onCancel: () => void
  onRegenerate: () => void
}) {
  const baseStyle: React.CSSProperties = {
    padding: '0.375rem 0.875rem',
    borderRadius: '6px',
    fontSize: '0.8125rem',
    fontWeight: 500,
    cursor: 'pointer',
    border: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.375rem',
    transition: 'background-color 0.15s',
  }

  if (state === 'idle') {
    return (
      <button
        onClick={onGenerate}
        style={{ ...baseStyle, backgroundColor: '#eef2ff', color: '#4338ca' }}
        title="Generate content with AI (Claude)"
      >
        ✦ Generate with AI
      </button>
    )
  }

  if (state === 'streaming') {
    return (
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>Generating…</span>
        <button
          onClick={onCancel}
          style={{ ...baseStyle, backgroundColor: '#fef2f2', color: '#991b1b' }}
        >
          Cancel
        </button>
      </div>
    )
  }

  // complete
  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <button
        onClick={onRegenerate}
        style={{ ...baseStyle, backgroundColor: '#f1f5f9', color: '#475569' }}
      >
        ↺ Regenerate
      </button>
    </div>
  )
}

export function AIGenerateButton({
  blockType,
  context,
  onAccept,
  placeholder,
  minHeight = '5rem',
  label,
}: AIGenerateButtonProps) {
  const { state, streamedText, showCursor, generate, cancel } = useAIGenerate({
    blockType,
    context,
    onComplete: onAccept,
  })

  const handleRegenerate = useCallback(() => {
    generate()
  }, [generate])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {label && (
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#475569',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {label}
        </span>
      )}

      {/* Fixed-dimension text area — same minHeight in ALL states = CLS 0 */}
      <div
        style={{
          padding: '0.75rem',
          backgroundColor: state === 'idle' ? '#f8fafc' : '#fff',
          border: `1px solid ${state === 'streaming' ? '#c7d2fe' : '#e2e8f0'}`,
          borderRadius: '8px',
          transition: 'border-color 0.2s, background-color 0.2s',
        }}
      >
        <StreamingText
          text={streamedText}
          state={state}
          placeholder={placeholder}
          minHeight={minHeight}
          showCursor={showCursor}
        />
      </div>

      <StateButton
        state={state}
        onGenerate={generate}
        onCancel={cancel}
        onRegenerate={handleRegenerate}
      />
    </div>
  )
}
