import type { FeatureGridBlock } from '@/lib/graphql/__generated__/graphql'

interface FeatureGridProps {
  block: FeatureGridBlock
}

export function FeatureGrid({ block }: FeatureGridProps) {
  const { heading, features } = block

  return (
    <section
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
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
          }}
        >
          {features?.map((feature) => (
            <div
              key={feature._key}
              style={{
                padding: '2rem',
                backgroundColor: '#fff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              }}
            >
              {feature.icon && (
                <div
                  style={{
                    fontSize: '2rem',
                    marginBottom: '1rem',
                    lineHeight: 1,
                  }}
                >
                  {feature.icon}
                </div>
              )}
              <h3
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: '#0f172a',
                  marginBottom: '0.5rem',
                }}
              >
                {feature.title}
              </h3>
              {feature.description && (
                <p style={{ color: '#64748b', lineHeight: 1.6, fontSize: '0.9375rem' }}>
                  {feature.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
