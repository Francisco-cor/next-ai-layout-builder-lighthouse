'use server'
import { revalidatePath } from 'next/cache'

// Server Action — runs on the server, safe to use REVALIDATE_SECRET here.
// Called by the studio after each Sanity mutation; never exposes the secret to the client.
export async function revalidatePage(slug: string): Promise<void> {
  revalidatePath(`/${slug}`)
}
