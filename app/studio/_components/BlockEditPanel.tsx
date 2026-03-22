'use client'
import type { PageBlock } from '@/lib/graphql/__generated__/graphql'
import { TextField } from './fields/TextField'
import { TextareaField } from './fields/TextareaField'
import { ColorPickerField } from './fields/ColorPickerField'
import { UrlField } from './fields/UrlField'

const BLOCK_LABELS: Record<string, string> = {
  heroBlock: 'Hero',
  richTextBlock: 'Rich Text',
  featureGridBlock: 'Feature Grid',
  testimonialsBlock: 'Testimonials',
  callToActionBlock: 'Call to Action',
  statsBlock: 'Stats',
}

interface BlockEditPanelProps {
  block: PageBlock
  onUpdate: (patch: Record<string, unknown>) => void
}

export function BlockEditPanel({ block, onUpdate }: BlockEditPanelProps) {
  const label = BLOCK_LABELS[block._type] ?? block._type

  return (
    <aside
      style={{
        width: '320px',
        flexShrink: 0,
        backgroundColor: '#fff',
        borderLeft: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '1rem 1.25rem',
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: '#f8fafc',
        }}
      >
        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '2px' }}>Editing block</div>
        <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9375rem' }}>{label}</div>
      </div>

      {/* Fields — scrollable */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {block._type === 'heroBlock' && (
          <>
            <TextField
              label="Title"
              value={(block as { title?: string }).title ?? ''}
              onChange={(v) => onUpdate({ title: v })}
              placeholder="Hero headline"
            />
            <TextareaField
              label="Subtitle"
              value={(block as { subtitle?: string }).subtitle ?? ''}
              onChange={(v) => onUpdate({ subtitle: v })}
              rows={3}
              placeholder="Supporting text"
            />
            <TextField
              label="CTA Label"
              value={(block as { cta?: { label?: string } }).cta?.label ?? ''}
              onChange={(v) => onUpdate({ cta: { ...(block as { cta?: object }).cta, label: v } })}
            />
            <UrlField
              label="CTA URL"
              value={(block as { cta?: { href?: string } }).cta?.href ?? ''}
              onChange={(v) => onUpdate({ cta: { ...(block as { cta?: object }).cta, href: v } })}
            />
          </>
        )}

        {block._type === 'richTextBlock' && (
          <div style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.6, padding: '0.5rem 0' }}>
            Rich text editing via Sanity Studio.
            <br /><br />
            The AI generation button appears here in Week 3 (SSE streaming).
          </div>
        )}

        {block._type === 'featureGridBlock' && (
          <>
            <TextField
              label="Section Heading"
              value={(block as { heading?: string }).heading ?? ''}
              onChange={(v) => onUpdate({ heading: v })}
              placeholder="Features section title"
            />
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>
              Feature items edited in Sanity Studio (array editing coming Week 3).
            </div>
          </>
        )}

        {block._type === 'testimonialsBlock' && (
          <>
            <TextField
              label="Section Heading"
              value={(block as { heading?: string }).heading ?? ''}
              onChange={(v) => onUpdate({ heading: v })}
              placeholder="What our customers say"
            />
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>
              Testimonial items edited in Sanity Studio.
            </div>
          </>
        )}

        {block._type === 'callToActionBlock' && (
          <>
            <TextField
              label="Heading"
              value={(block as { heading?: string }).heading ?? ''}
              onChange={(v) => onUpdate({ heading: v })}
              placeholder="Ready to get started?"
            />
            <TextareaField
              label="Subheading"
              value={(block as { subheading?: string }).subheading ?? ''}
              onChange={(v) => onUpdate({ subheading: v })}
              rows={2}
            />
            <TextField
              label="Button Label"
              value={(block as { buttonLabel?: string }).buttonLabel ?? ''}
              onChange={(v) => onUpdate({ buttonLabel: v })}
            />
            <UrlField
              label="Button URL"
              value={(block as { buttonHref?: string }).buttonHref ?? ''}
              onChange={(v) => onUpdate({ buttonHref: v })}
            />
            <ColorPickerField
              label="Background Color"
              value={(block as { backgroundColor?: string }).backgroundColor ?? '#4f46e5'}
              onChange={(v) => onUpdate({ backgroundColor: v })}
            />
            <ColorPickerField
              label="Text Color"
              value={(block as { textColor?: string }).textColor ?? '#ffffff'}
              onChange={(v) => onUpdate({ textColor: v })}
            />
          </>
        )}

        {block._type === 'statsBlock' && (
          <>
            <TextField
              label="Section Heading"
              value={(block as { heading?: string }).heading ?? ''}
              onChange={(v) => onUpdate({ heading: v })}
              placeholder="By the numbers"
            />
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>
              Individual stat values edited in Sanity Studio.
            </div>
          </>
        )}
      </div>
    </aside>
  )
}
