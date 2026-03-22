'use client'
import { useReducer, useCallback, useRef } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import type { PageBlock } from '@/lib/graphql/__generated__/graphql'

type Action =
  | { type: 'REORDER'; from: number; to: number }
  | { type: 'UPDATE_FIELD'; key: string; patch: Record<string, unknown> }
  | { type: 'REVERT'; snapshot: PageBlock[] }

function reducer(state: PageBlock[], action: Action): PageBlock[] {
  switch (action.type) {
    case 'REORDER':
      return arrayMove(state, action.from, action.to)
    case 'UPDATE_FIELD':
      return state.map((b) =>
        b._key === action.key ? ({ ...b, ...action.patch } as PageBlock) : b
      )
    case 'REVERT':
      return action.snapshot
    default:
      return state
  }
}

export function useOptimisticBlocks(initial: PageBlock[]) {
  const [blocks, dispatch] = useReducer(reducer, initial)
  // Keep a stable ref so async callbacks capture the latest snapshot
  const blocksRef = useRef(blocks)
  blocksRef.current = blocks

  const reorder = useCallback((from: number, to: number) => {
    dispatch({ type: 'REORDER', from, to })
  }, [])

  const updateField = useCallback(
    (key: string, patch: Record<string, unknown>) => {
      dispatch({ type: 'UPDATE_FIELD', key, patch })
    },
    []
  )

  const revert = useCallback((snapshot: PageBlock[]) => {
    dispatch({ type: 'REVERT', snapshot })
  }, [])

  const getSnapshot = useCallback(() => blocksRef.current, [])

  return { blocks, reorder, updateField, revert, getSnapshot }
}
