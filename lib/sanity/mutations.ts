import { sanityClient } from '@/sanity/lib/client'
import type { PageBlock } from '@/lib/graphql/__generated__/graphql'

// Patch a single field in a specific block within a page document.
// Uses Sanity's array-by-key accessor: blocks[_key=="abc"].fieldName
export async function patchBlockField(
  pageId: string,
  blockKey: string,
  patch: Record<string, unknown>
): Promise<void> {
  const fieldPatches: Record<string, unknown> = {}
  for (const [field, value] of Object.entries(patch)) {
    fieldPatches[`blocks[_key=="${blockKey}"].${field}`] = value
  }

  await sanityClient
    .patch(pageId)
    .set(fieldPatches)
    .commit({ visibility: 'async' })
}

// Persist a new block order after drag-and-drop reorder.
// Sends the full blocks array — Sanity replaces it atomically.
export async function patchBlockOrder(
  pageId: string,
  orderedBlocks: PageBlock[]
): Promise<void> {
  // Strip React-managed fields; keep only what Sanity expects
  const sanitized = orderedBlocks.map(({ _type, _key, ...rest }) => ({
    _type,
    _key,
    ...rest,
  }))

  await sanityClient
    .patch(pageId)
    .set({ blocks: sanitized })
    .commit({ visibility: 'async' })
}

// revalidatePage has been moved to lib/sanity/server-actions.ts as a Server Action.
// Import it from there — it uses revalidatePath directly (no secret needed on client).
