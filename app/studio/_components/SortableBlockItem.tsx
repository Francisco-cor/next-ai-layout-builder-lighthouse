'use client'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { PageBlock } from '@/lib/graphql/__generated__/graphql'

const BLOCK_LABELS: Record<string, string> = {
  heroBlock: 'Hero',
  richTextBlock: 'Rich Text',
  featureGridBlock: 'Feature Grid',
  testimonialsBlock: 'Testimonials',
  callToActionBlock: 'Call to Action',
  statsBlock: 'Stats',
}

const BLOCK_ICONS: Record<string, string> = {
  heroBlock: '🖼',
  richTextBlock: '📝',
  featureGridBlock: '⚡',
  testimonialsBlock: '💬',
  callToActionBlock: '🎯',
  statsBlock: '📊',
}

interface SortableBlockItemProps {
  block: PageBlock
  isSelected: boolean
  isDragging: boolean
  onSelect: () => void
}

export function SortableBlockItem({ block, isSelected, isDragging, onSelect }: SortableBlockItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: block._key,
  })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
      aria-pressed={isSelected}
      aria-label={`${BLOCK_LABELS[block._type] ?? block._type} block`}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          border: `2px solid ${isSelected ? '#4f46e5' : '#e2e8f0'}`,
          backgroundColor: isSelected ? '#eef2ff' : '#fff',
          cursor: 'pointer',
          userSelect: 'none',
          transition: 'border-color 0.15s, background-color 0.15s',
        }}
      >
        {/* Drag handle */}
        <div
          {...listeners}
          {...attributes}
          style={{
            cursor: 'grab',
            color: '#94a3b8',
            fontSize: '1.125rem',
            padding: '2px 4px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
          }}
          title="Drag to reorder"
          onClick={(e) => e.stopPropagation()}
          aria-label="Drag handle"
        >
          ⠿
        </div>

        <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>
          {BLOCK_ICONS[block._type] ?? '▪'}
        </span>

        <span
          style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: isSelected ? '#4338ca' : '#374151',
            flex: 1,
          }}
        >
          {BLOCK_LABELS[block._type] ?? block._type}
        </span>

        {isSelected && (
          <span style={{ fontSize: '0.75rem', color: '#4f46e5', fontWeight: 500 }}>
            Editing
          </span>
        )}
      </div>
    </div>
  )
}
