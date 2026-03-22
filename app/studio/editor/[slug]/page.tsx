import dynamic from 'next/dynamic'
import { notFound } from 'next/navigation'
import { sanityClient } from '@/sanity/lib/client'
import { EditorErrorBoundary } from '@/app/studio/_components/EditorErrorBoundary'

// Dynamic import with no SSR — dnd-kit is browser-only.
// This is the bundle isolation guarantee: the PageEditor and all its
// dnd-kit dependencies are in a separate chunk that Next.js never
// includes in the public route bundle.
const PageEditor = dynamic(
  () => import('@/app/studio/_components/PageEditor').then((m) => m.PageEditor),
  { ssr: false, loading: () => <EditorSkeleton /> }
)

function EditorSkeleton() {
  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
      Loading editor…
    </div>
  )
}

interface Props {
  params: Promise<{ slug: string }>
}

export default async function EditorPage({ params }: Props) {
  const { slug } = await params

  // Fetch page data server-side for the initial render.
  // The studio is NOT ISR — we always want the latest Sanity data here.
  const page = await sanityClient.fetch<{
    _id: string
    title: string
    slug: { current: string }
    blocks: Array<{ _type: string; _key: string; [key: string]: unknown }>
  } | null>(
    `*[_type == "page" && slug.current == $slug][0]{
      _id,
      title,
      slug,
      blocks
    }`,
    { slug }
  )

  if (!page) notFound()

  return (
    <EditorErrorBoundary>
      <PageEditor
        pageId={page._id}
        slug={slug}
        title={page.title}
        initialBlocks={page.blocks ?? []}
      />
    </EditorErrorBoundary>
  )
}
