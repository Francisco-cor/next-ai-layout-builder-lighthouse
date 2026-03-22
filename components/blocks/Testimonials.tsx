import type { TestimonialsBlock } from '@/lib/graphql/__generated__/graphql'

interface TestimonialsProps {
  block: TestimonialsBlock
}

// No JS — CSS scroll snap carousel for the public route
export function Testimonials({ block }: TestimonialsProps) {
  const { heading, testimonials } = block

  return (
    <section
      style={{
        padding: '5rem 0',
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        overflow: 'hidden',
      }}
    >
      {heading && (
        <h2
          style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
            fontWeight: 700,
            textAlign: 'center',
            marginBottom: '3rem',
            padding: '0 2rem',
            letterSpacing: '-0.01em',
          }}
        >
          {heading}
        </h2>
      )}
      {/* CSS scroll snap — zero JS required */}
      <div
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          gap: '1.5rem',
          padding: '0.5rem 2rem 2rem',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {testimonials?.map((t) => (
          <article
            key={t._key}
            style={{
              flex: '0 0 min(400px, 85vw)',
              scrollSnapAlign: 'start',
              backgroundColor: '#1e293b',
              borderRadius: '12px',
              padding: '2rem',
              border: '1px solid #334155',
            }}
          >
            <blockquote
              style={{
                margin: 0,
                fontSize: '1.0625rem',
                lineHeight: 1.7,
                color: '#e2e8f0',
                marginBottom: '1.5rem',
                fontStyle: 'italic',
              }}
            >
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <footer style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div>
                <cite
                  style={{
                    fontStyle: 'normal',
                    fontWeight: 600,
                    color: '#f1f5f9',
                    display: 'block',
                  }}
                >
                  {t.author}
                </cite>
                {t.role && (
                  <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>{t.role}</span>
                )}
              </div>
            </footer>
          </article>
        ))}
      </div>
    </section>
  )
}
