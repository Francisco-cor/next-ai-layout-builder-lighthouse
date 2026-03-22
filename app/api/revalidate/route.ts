import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

// Called by the studio after each Sanity mutation to invalidate ISR cache
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  const slug = req.nextUrl.searchParams.get('slug')

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }
  if (!slug) {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 })
  }

  revalidatePath(`/${slug}`)
  return NextResponse.json({ revalidated: true, slug })
}
