import Image from 'next/image'
import type { HeroBlock } from '@/lib/graphql/__generated__/graphql'

interface HeroProps {
  block: HeroBlock
}

export function Hero({ block }: HeroProps) {
  const { title, subtitle, image, cta } = block

  return (
    <section
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
      {image?.asset?.url && (
        <Image
          src={image.asset.url}
          alt={image.alt ?? title}
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover', opacity: 0.4 }}
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
              marginBottom: '2rem',
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
              transition: 'background-color 0.2s',
            }}
          >
            {cta.label}
          </a>
        )}
      </div>
    </section>
  )
}
