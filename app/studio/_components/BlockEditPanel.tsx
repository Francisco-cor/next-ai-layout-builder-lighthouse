'use client'
import { useCallback } from 'react'
import type { PageBlock } from '@/lib/graphql/__generated__/graphql'
import { TextField } from './fields/TextField'
import { TextareaField } from './fields/TextareaField'
import { ColorPickerField } from './fields/ColorPickerField'
import { UrlField } from './fields/UrlField'
import { AIGenerateButton } from './AIGenerateButton'

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

  // Build AI context from current block fields for a richer prompt
  const getContext = useCallback((): Record<string, string> => {
    const b = block as Record<string, unknown>
    return {
      title: String(b.title ?? b.heading ?? ''),
      subtitle: String(b.subtitle ?? b.subheading ?? ''),
      blockType: block._type,
    }
  }, [block])

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
          flexShrink: 0,
        }}
      >
        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '2px' }}>Editing block</div>
        <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9375rem' }}>{label}</div>
      </div>

      {/* Fields — scrollable */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        {/* ── Hero ─────────────────────────────────────────────────────── */}
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
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
              <AIGenerateButton
                blockType="heroBlock"
                context={getContext()}
                label="AI — Generate headline"
                placeholder="AI will generate a title, subtitle, and CTA for your hero section…"
                minHeight="4.5rem"
                onAccept={(text) => {
                  // Parse structured output: TITLE: / SUBTITLE: / CTA:
                  const titleMatch = text.match(/TITLE:\s*(.+)/i)
                  const subtitleMatch = text.match(/SUBTITLE:\s*(.+)/i)
                  const ctaMatch = text.match(/CTA:\s*(.+)/i)
                  const patch: Record<string, unknown> = {}
                  if (titleMatch?.[1]) patch.title = titleMatch[1].trim()
                  if (subtitleMatch?.[1]) patch.subtitle = subtitleMatch[1].trim()
                  if (ctaMatch?.[1]) {
                    const existing = (block as { cta?: object }).cta ?? {}
                    patch.cta = { ...existing, label: ctaMatch[1].trim() }
                  }
                  if (Object.keys(patch).length > 0) onUpdate(patch)
                }}
              />
            </div>
          </>
        )}

        {/* ── Rich Text ─────────────────────────────────────────────────── */}
        {block._type === 'richTextBlock' && (
          <>
            <div style={{ fontSize: '0.8125rem', color: '#64748b', lineHeight: 1.6, padding: '0.25rem 0' }}>
              Full rich text editing via Sanity Studio.
            </div>
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
              <AIGenerateButton
                blockType="richTextBlock"
                context={getContext()}
                label="AI — Generate body copy"
                placeholder="AI will write 2-3 paragraphs of professional copy for this section. Takes up to 2 seconds — reverts to this placeholder if the connection is slow."
                minHeight="7rem"
                onAccept={(text) => {
                  // Store as plain text in aiPrompt for now — Portable Text requires
                  // the Sanity Studio editor for full rich text authoring.
                  onUpdate({ aiPrompt: text })
                }}
              />
            </div>
          </>
        )}

        {/* ── Feature Grid ──────────────────────────────────────────────── */}
        {block._type === 'featureGridBlock' && (
          <>
            <TextField
              label="Section Heading"
              value={(block as { heading?: string }).heading ?? ''}
              onChange={(v) => onUpdate({ heading: v })}
              placeholder="Features section title"
            />
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
              <AIGenerateButton
                blockType="featureGridBlock"
                context={getContext()}
                label="AI — Generate features"
                placeholder="AI will generate 3 product features with icons, titles, and descriptions…"
                minHeight="5.5rem"
                onAccept={(text) => {
                  // Parse structured output and update heading as a preview
                  // Full feature array editing requires Sanity Studio (array type)
                  onUpdate({ aiPrompt: text })
                }}
              />
            </div>
          </>
        )}

        {/* ── Testimonials ──────────────────────────────────────────────── */}
        {block._type === 'testimonialsBlock' && (
          <>
            <TextField
              label="Section Heading"
              value={(block as { heading?: string }).heading ?? ''}
              onChange={(v) => onUpdate({ heading: v })}
              placeholder="What our customers say"
            />
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
              <AIGenerateButton
                blockType="testimonialsBlock"
                context={getContext()}
                label="AI — Generate testimonial"
                placeholder="AI will write an authentic customer testimonial with author details…"
                minHeight="5.5rem"
                onAccept={(text) => {
                  onUpdate({ aiPrompt: text })
                }}
              />
            </div>
          </>
        )}

        {/* ── CTA ───────────────────────────────────────────────────────── */}
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
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
              <AIGenerateButton
                blockType="callToActionBlock"
                context={getContext()}
                label="AI — Generate CTA copy"
                placeholder="AI will write a heading, subheading, and button text for this CTA banner…"
                minHeight="4.5rem"
                onAccept={(text) => {
                  const headingMatch = text.match(/HEADING:\s*(.+)/i)
                  const subheadingMatch = text.match(/SUBHEADING:\s*(.+)/i)
                  const buttonMatch = text.match(/BUTTON:\s*(.+)/i)
                  const patch: Record<string, unknown> = {}
                  if (headingMatch?.[1]) patch.heading = headingMatch[1].trim()
                  if (subheadingMatch?.[1]) patch.subheading = subheadingMatch[1].trim()
                  if (buttonMatch?.[1]) patch.buttonLabel = buttonMatch[1].trim()
                  if (Object.keys(patch).length > 0) onUpdate(patch)
                }}
              />
            </div>
          </>
        )}

        {/* ── Stats ─────────────────────────────────────────────────────── */}
        {block._type === 'statsBlock' && (
          <>
            <TextField
              label="Section Heading"
              value={(block as { heading?: string }).heading ?? ''}
              onChange={(v) => onUpdate({ heading: v })}
              placeholder="By the numbers"
            />
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
              <AIGenerateButton
                blockType="statsBlock"
                context={getContext()}
                label="AI — Generate statistics"
                placeholder="AI will generate 4 compelling statistics with values and labels…"
                minHeight="4.5rem"
                onAccept={(text) => {
                  onUpdate({ aiPrompt: text })
                }}
              />
            </div>
          </>
        )}
      </div>
    </aside>
  )
}
