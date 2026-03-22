import Image from 'next/image'
import type { HeroBlock } from '@/lib/graphql/__generated__/graphql'
import { heroImageUrl } from '@/lib/sanity/image'

interface HeroProps {
  block: HeroBlock
}

/**
 * LCP candidate — optimized for Lighthouse 98+:
 *  • priority → fetchpriority="high" + rel=preload in <head>
 *  • sizes="100vw" → browser picks the right source, no 2000px image on mobile
 *  • heroImageUrl → Sanity CDN serves WebP via ?auto=format
 *  • RSC → HTML with image src arrives on first byte, no hydration wait
 */
export function Hero({ block }: HeroProps) {
  const { title, subtitle, image, cta } = block

  const imgSrc = image?.asset
    ? heroImageUrl(image.asset as Parameters<typeof heroImageUrl>[0])
    : null

  return (
    <section
      aria-label="Hero"
      style={{
        position: 'relative',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: '#0f172a',
        color: '#f8fafc',
      }}
    >
      {imgSrc && (
        <Image
          src={imgSrc}
          alt={image?.alt ?? title}
          fill
          priority                       // fetchpriority="high" + <link rel="preload">
          sizes="100vw"                  // hero is always full viewport width
          style={{ objectFit: 'cover', opacity: 0.4 }}
          // Next.js 15: quality is baked into the Sanity URL (?q=80), so default is fine
        />
      )}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '800px',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: '1.5rem',
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.375rem)',
              lineHeight: 1.6,
              color: '#cbd5e1',
              maxWidth: '600px',
              margin: '0 auto 2rem',
            }}
          >
            {subtitle}
          </p>
        )}
        {cta?.label && cta?.href && (
          <a
            href={cta.href}
            style={{
              display: 'inline-block',
              padding: '0.875rem 2rem',
              backgroundColor: '#4f46e5',
              color: '#fff',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            {cta.label}
          </a>
        )}
      </div>
    </section>
  )
}
