'use client'
import { useState, useCallback } from 'react'
import { useOptimisticBlocks } from '@/hooks/useOptimisticBlocks'
import { useToast } from '@/hooks/useToast'
import { patchBlockField, patchBlockOrder } from '@/lib/sanity/mutations'
import { revalidatePage } from '@/lib/sanity/server-actions'
import { SortableBlockList } from './SortableBlockList'
import { BlockEditPanel } from './BlockEditPanel'
import { LivePreview } from './LivePreview'
import { ToastContainer } from './Toast'
import type { PageBlock } from '@/lib/graphql/__generated__/graphql'

interface PageEditorProps {
  pageId: string
  slug: string
  title: string
  initialBlocks: PageBlock[]
}

export function PageEditor({ pageId, slug, title, initialBlocks }: PageEditorProps) {
  const { blocks, reorder, updateField, revert, getSnapshot } = useOptimisticBlocks(initialBlocks)
  const { toasts, showToast, dismissToast } = useToast()
  const [selectedKey, setSelectedKey] = useState<string | null>(
    initialBlocks[0]?._key ?? null
  )

  const selectedBlock = blocks.find((b) => b._key === selectedKey) ?? null

  // Called from SortableBlockList after a drag ends.
  // The UI has already updated (via onReorder) — this commits to Sanity.
  const handleReorderCommit = useCallback(
    async (newBlocks: PageBlock[]) => {
      const snapshot = getSnapshot()
      try {
        await patchBlockOrder(pageId, newBlocks)
        await revalidatePage(slug)
      } catch {
        revert(snapshot)
        showToast('Failed to save block order. Reverted to previous state.')
      }
    },
    [pageId, slug, getSnapshot, revert, showToast]
  )

  // Called from BlockEditPanel on every field change.
  // Optimistic update fires immediately; Sanity write is background.
  const handleFieldUpdate = useCallback(
    async (key: string, patch: Record<string, unknown>) => {
      const snapshot = getSnapshot()
      updateField(key, patch)  // instant UI update

      try {
        await patchBlockField(pageId, key, patch)
        await revalidatePage(slug)
      } catch {
        revert(snapshot)
        showToast('Failed to save changes. Your edits have been reverted.')
      }
    },
    [pageId, slug, getSnapshot, updateField, revert, showToast]
  )

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', flexDirection: 'column' }}>
      {/* Header */}
      <header
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#fff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexShrink: 0,
        }}
      >
        <a
          href="/studio"
          style={{ color: '#64748b', fontSize: '0.875rem', textDecoration: 'none' }}
          aria-label="Back to pages"
        >
          ← Pages
        </a>
        <h1 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#0f172a', flex: 1 }}>
          {title}
        </h1>
        <a
          href={`/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '0.375rem 0.875rem',
            backgroundColor: '#f1f5f9',
            borderRadius: '6px',
            fontSize: '0.8125rem',
            color: '#475569',
            textDecoration: 'none',
            fontWeight: 500,
          }}
        >
          View live ↗
        </a>
      </header>

      {/* Three-panel layout: block list | preview | edit panel */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left: sortable block list */}
        <aside
          style={{
            width: '260px',
            flexShrink: 0,
            borderRight: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc',
            overflowY: 'auto',
            padding: '1rem',
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Blocks
          </div>
          <SortableBlockList
            blocks={blocks}
            selectedKey={selectedKey}
            onSelect={setSelectedKey}
            onReorder={reorder}
            onReorderCommit={handleReorderCommit}
          />
        </aside>

        {/* Center: live preview */}
        <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', backgroundColor: '#f1f5f9' }}>
          <LivePreview pageId={pageId} optimisticBlocks={blocks} />
        </div>

        {/* Right: block edit panel */}
        {selectedBlock ? (
          <BlockEditPanel
            block={selectedBlock}
            onUpdate={(patch) => handleFieldUpdate(selectedBlock._key, patch)}
          />
        ) : (
          <div
            style={{
              width: '320px',
              flexShrink: 0,
              borderLeft: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              fontSize: '0.875rem',
              backgroundColor: '#fff',
            }}
          >
            Select a block to edit
          </div>
        )}
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}
