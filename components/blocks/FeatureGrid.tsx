import type { FeatureGridBlock } from '@/lib/graphql/__generated__/graphql'

interface FeatureGridProps {
  block: FeatureGridBlock
}

export function FeatureGrid({ block }: FeatureGridProps) {
  const { heading, features } = block

  return (
    <section
      aria-label={heading ?? 'Features'}
      style={{
        padding: '5rem 2rem',
        backgroundColor: '#f8fafc',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {heading && (
          <h2
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
              fontWeight: 700,
              textAlign: 'center',
              marginBottom: '3rem',
              color: '#0f172a',
              letterSpacing: '-0.01em',
            }}
          >
            {heading}
          </h2>
        )}
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
          }}
          aria-label="Feature list"
        >
          {features?.map((feature) => (
            <li
              key={feature._key}
              style={{
                // Fixed min-height: prevents CLS when features load
                minHeight: '180px',
                padding: '2rem',
                backgroundColor: '#fff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              {feature.icon && (
                <div
                  aria-hidden="true"
                  style={{ fontSize: '2rem', lineHeight: 1, marginBottom: '0.5rem' }}
                >
                  {feature.icon}
                </div>
              )}
              <h3
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: '#0f172a',
                  margin: 0,
                }}
              >
                {feature.title}
              </h3>
              {feature.description && (
                <p style={{ color: '#64748b', lineHeight: 1.6, fontSize: '0.9375rem', margin: 0 }}>
                  {feature.description}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
