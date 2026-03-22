import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

// Lazy builder — instantiated once on first use
let _builder: ReturnType<typeof imageUrlBuilder> | null = null

function getBuilder() {
  if (!_builder) {
    // Inline config avoids importing the full sanityClient (tree-shakes better for RSC)
    _builder = imageUrlBuilder({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '',
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
    })
  }
  return _builder
}

/**
 * Returns a Sanity image URL with:
 * - auto=format  → WebP on supporting browsers (served from Sanity CDN)
 * - fit=max      → never upscale
 * - q=80         → good quality/size ratio
 */
export function sanityImage(source: SanityImageSource) {
  return getBuilder().image(source).auto('format').fit('max').quality(80)
}

/**
 * Hero image: full-width, up to 1920px wide.
 * The ?auto=format converts to WebP automatically via Sanity's image pipeline.
 */
export function heroImageUrl(source: SanityImageSource): string {
  return sanityImage(source).width(1920).url()
}

/**
 * Avatar thumbnail: 80×80 face crop for testimonials.
 */
export function avatarImageUrl(source: SanityImageSource): string {
  return sanityImage(source).width(80).height(80).crop('focalpoint').url()
}
