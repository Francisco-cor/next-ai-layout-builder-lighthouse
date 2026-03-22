'use client'
import { useEffect, useState } from 'react'
import type { PageBlock } from '@/lib/graphql/__generated__/graphql'

// Live preview via Sanity's EventSource-based listen() API.
// Opens a persistent connection — any document change pushes the new blocks.
export function useBlockSubscription(
  pageId: string,
  initialBlocks: PageBlock[]
): PageBlock[] {
  const [liveBlocks, setLiveBlocks] = useState<PageBlock[]>(initialBlocks)

  useEffect(() => {
    // Dynamic import keeps @sanity/client out of the initial JS parse
    let subscription: { unsubscribe: () => void } | null = null

    import('@/sanity/lib/client').then(({ sanityClient }) => {
      subscription = sanityClient
        .listen<{ blocks?: PageBlock[] }>(
          `*[_type == "page" && _id == $id][0]`,
          { id: pageId },
          { includeResult: true, visibility: 'query', events: ['mutation'] }
        )
        .subscribe((update) => {
          if (update.result?.blocks) {
            setLiveBlocks(update.result.blocks)
          }
        })
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [pageId])

  return liveBlocks
}
