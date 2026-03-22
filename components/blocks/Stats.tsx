import type { StatsBlock } from '@/lib/graphql/__generated__/graphql'

interface StatsProps {
  block: StatsBlock
}

// Static render in public route — no JS count-up animation
export function Stats({ block }: StatsProps) {
  const { heading, stats } = block

  return (
    <section
      style={{
        padding: '5rem 2rem',
        backgroundColor: '#fff',
      }}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {heading && (
          <h2
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
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
        <dl
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.min(stats?.length ?? 3, 4)}, 1fr)`,
            gap: '2rem',
            textAlign: 'center',
          }}
        >
          {stats?.map((stat) => (
            <div key={stat._key}>
              <dt
                style={{
                  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                  fontWeight: 800,
                  color: '#4f46e5',
                  lineHeight: 1,
                  marginBottom: '0.5rem',
                }}
              >
                {stat.value}
              </dt>
              <dd
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: '#0f172a',
                  margin: 0,
                  marginBottom: stat.description ? '0.25rem' : 0,
                }}
              >
                {stat.label}
              </dd>
              {stat.description && (
                <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
                  {stat.description}
                </p>
              )}
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
