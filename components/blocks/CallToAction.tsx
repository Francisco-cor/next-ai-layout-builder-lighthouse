import type { CallToActionBlock } from '@/lib/graphql/__generated__/graphql'

interface CallToActionProps {
  block: CallToActionBlock
}

export function CallToAction({ block }: CallToActionProps) {
  const {
    heading,
    subheading,
    buttonLabel,
    buttonHref,
    backgroundColor = '#4f46e5',
    textColor = '#ffffff',
  } = block

  return (
    <section
      aria-label={heading}
      style={{
        backgroundColor: backgroundColor ?? '#4f46e5',
        color: textColor ?? '#ffffff',
        padding: '5rem 2rem',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <h2
          style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
            fontWeight: 700,
            marginBottom: subheading ? '1rem' : '2rem',
            letterSpacing: '-0.01em',
          }}
        >
          {heading}
        </h2>
        {subheading && (
          <p
            style={{
              fontSize: '1.125rem',
              opacity: 0.9,
              marginBottom: '2rem',
              lineHeight: 1.6,
            }}
          >
            {subheading}
          </p>
        )}
        {buttonHref && buttonLabel && (
          <a
            href={buttonHref}
            style={{
              display: 'inline-block',
              padding: '0.875rem 2.5rem',
              backgroundColor: 'rgba(255,255,255,0.15)',
              border: '2px solid currentColor',
              borderRadius: '8px',
              color: 'inherit',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '1rem',
            }}
          >
            {buttonLabel}
          </a>
        )}
      </div>
    </section>
  )
}
