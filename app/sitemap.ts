import type { MetadataRoute } from 'next'
import { sanityClient } from '@/sanity/lib/client'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://localhost:3000'

  const pages = await sanityClient.fetch<Array<{ slug: { current: string }; _updatedAt: string }>>(
    `*[_type == "page"]{ slug, _updatedAt }`
  )

  const pageUrls = pages.map(({ slug, _updatedAt }) => ({
    url: `${baseUrl}/${slug.current}`,
    lastModified: new Date(_updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...pageUrls,
  ]
}
