'use client'
import { useBlockSubscription } from '@/hooks/useBlockSubscription'
import type { PageBlock } from '@/lib/graphql/__generated__/graphql'

// Mini renderers for the preview pane — simplified versions of the public components.
// These are ONLY in the studio bundle. No Image component (preview pane doesn't need LCP optimization).
function PreviewBlock({ block }: { block: PageBlock }) {
  const styles: React.CSSProperties = {
    padding: '1rem',
    borderBottom: '1px solid #e2e8f0',
    fontSize: '0.875rem',
  }

  switch (block._type) {
    case 'heroBlock': {
      const b = block as { title?: string; subtitle?: string }
      return (
        <div style={{ ...styles, backgroundColor: '#0f172a', color: '#f8fafc', padding: '2rem 1rem' }}>
          <div style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.5rem' }}>{b.title}</div>
          {b.subtitle && <div style={{ color: '#94a3b8', fontSize: '0.9375rem' }}>{b.subtitle}</div>}
        </div>
      )
    }
    case 'richTextBlock':
      return <div style={styles}><em style={{ color: '#94a3b8' }}>Rich text block</em></div>

    case 'featureGridBlock': {
      const b = block as { heading?: string; features?: Array<{ _key: string; title: string }> }
      return (
        <div style={{ ...styles, backgroundColor: '#f8fafc' }}>
          {b.heading && <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{b.heading}</div>}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {b.features?.map((f) => (
              <span key={f._key} style={{ padding: '0.25rem 0.75rem', backgroundColor: '#e0e7ff', borderRadius: '4px', fontSize: '0.8125rem', color: '#4338ca' }}>
                {f.title}
              </span>
            ))}
          </div>
        </div>
      )
    }

    case 'testimonialsBlock': {
      const b = block as { heading?: string }
      return (
        <div style={{ ...styles, backgroundColor: '#0f172a', color: '#f8fafc' }}>
          <div style={{ fontWeight: 700 }}>{b.heading ?? 'Testimonials'}</div>
        </div>
      )
    }

    case 'callToActionBlock': {
      const b = block as { heading?: string; buttonLabel?: string; backgroundColor?: string; textColor?: string }
      return (
        <div style={{ ...styles, backgroundColor: b.backgroundColor ?? '#4f46e5', color: b.textColor ?? '#fff', textAlign: 'center', padding: '1.5rem 1rem' }}>
          <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{b.heading}</div>
          {b.buttonLabel && (
            <span style={{ display: 'inline-block', padding: '0.375rem 1rem', border: '1px solid currentColor', borderRadius: '4px', fontSize: '0.8125rem' }}>
              {b.buttonLabel}
            </span>
          )}
        </div>
      )
    }

    case 'statsBlock': {
      const b = block as { heading?: string; stats?: Array<{ _key: string; value: string; label: string }> }
      return (
        <div style={styles}>
          {b.heading && <div style={{ fontWeight: 700, marginBottom: '0.75rem' }}>{b.heading}</div>}
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {b.stats?.map((s) => (
              <div key={s._key} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#4f46e5' }}>{s.value}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )
    }

    default:
      return <div style={styles}>{block._type}</div>
  }
}

interface LivePreviewProps {
  pageId: string
  optimisticBlocks: PageBlock[]
}

// The preview merges optimistic (local) state with live Sanity updates.
// Optimistic state takes priority — it's always ahead of Sanity writes.
export function LivePreview({ pageId, optimisticBlocks }: LivePreviewProps) {
  // Sanity .listen() pushes updates via EventSource (websocket-like)
  const liveBlocks = useBlockSubscription(pageId, optimisticBlocks)

  // Use optimistic if available (they're ahead of the wire), fall back to live
  const displayBlocks = optimisticBlocks.length > 0 ? optimisticBlocks : liveBlocks

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        backgroundColor: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '0.5rem 0.75rem',
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          fontSize: '0.75rem',
          color: '#64748b',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#22c55e',
            display: 'inline-block',
          }}
        />
        Live preview · changes appear instantly
      </div>
      <div>
        {displayBlocks.map((block) => (
          <PreviewBlock key={block._key} block={block} />
        ))}
        {displayBlocks.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
            No blocks yet. Add blocks in Sanity Studio.
          </div>
        )}
      </div>
    </div>
  )
}
