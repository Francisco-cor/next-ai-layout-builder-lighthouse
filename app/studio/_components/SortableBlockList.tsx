'use client'
import { useState, useTransition } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import type { PageBlock } from '@/lib/graphql/__generated__/graphql'
import { SortableBlockItem } from './SortableBlockItem'

interface SortableBlockListProps {
  blocks: PageBlock[]
  selectedKey: string | null
  onSelect: (key: string) => void
  onReorder: (from: number, to: number) => void
  onReorderCommit: (newBlocks: PageBlock[]) => void
}

export function SortableBlockList({
  blocks,
  selectedKey,
  onSelect,
  onReorder,
  onReorderCommit,
}: SortableBlockListProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  // useTransition: the drag-end state update is deferred as non-urgent.
  // React handles the pointer-up event synchronously (≤100ms INP budget),
  // then schedules the re-render in the transition phase without blocking input.
  const [isPending, startTransition] = useTransition()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Require 8px of movement before activating — prevents accidental drags
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(String(active.id))
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null)
    if (!over || active.id === over.id) return

    const oldIndex = blocks.findIndex((b) => b._key === String(active.id))
    const newIndex = blocks.findIndex((b) => b._key === String(over.id))
    if (oldIndex === -1 || newIndex === -1) return

    // The re-render is non-urgent — wrap in startTransition so React
    // does NOT block the pointer-up event handler (key to INP <100ms)
    startTransition(() => {
      onReorder(oldIndex, newIndex)
    })

    // Commit to Sanity async — never on the critical path
    const reordered = arrayMove(blocks, oldIndex, newIndex)
    onReorderCommit(reordered)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={blocks.map((b) => b._key)}
        strategy={verticalListSortingStrategy}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            opacity: isPending ? 0.7 : 1,
            transition: 'opacity 0.1s',
          }}
        >
          {blocks.map((block) => (
            <SortableBlockItem
              key={block._key}
              block={block}
              isSelected={selectedKey === block._key}
              isDragging={activeId === block._key}
              onSelect={() => onSelect(block._key)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
