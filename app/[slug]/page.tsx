import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getClient } from '@/lib/graphql/client'
import { GET_PAGE_BY_SLUG, GET_ALL_PAGE_SLUGS } from '@/lib/graphql/queries/page'
import type {
  GetPageBySlugQuery,
  GetPageBySlugQueryVariables,
  GetAllPageSlugsQuery,
} from '@/lib/graphql/__generated__/graphql'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'

// ISR: rebuild every 60 seconds; stale pages still served from edge cache
export const revalidate = 60

interface PageProps {
  params: Promise<{ slug: string }>
}

// Build-time static generation — pre-renders all pages from Sanity
export async function generateStaticParams() {
  const { data } = await getClient().query<GetAllPageSlugsQuery>({
    query: GET_ALL_PAGE_SLUGS,
  })

  return (
    data.allPage
      ?.map(({ slug }) => ({ slug: slug.current }))
      .filter(Boolean) ?? []
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const { data } = await getClient().query<GetPageBySlugQuery, GetPageBySlugQueryVariables>({
    query: GET_PAGE_BY_SLUG,
    variables: { slug },
  })

  const page = data.allPage?.[0]
  if (!page) return {}

  return {
    title: page.title,
    description: page.seoDescription ?? undefined,
  }
}

export default async function SlugPage({ params }: PageProps) {
  const { slug } = await params

  const { data } = await getClient().query<GetPageBySlugQuery, GetPageBySlugQueryVariables>({
    query: GET_PAGE_BY_SLUG,
    variables: { slug },
  })

  const page = data.allPage?.[0]
  if (!page) notFound()

  const blocks = page.blocks ?? []

  return <BlockRenderer blocks={blocks} />
}
