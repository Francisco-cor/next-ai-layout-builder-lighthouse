import type { StatsBlock } from '@/lib/graphql/__generated__/graphql'

interface StatsProps {
  block: StatsBlock
}

export function Stats({ block }: StatsProps) {
  const { heading, stats } = block

  return (
    <section
      aria-label={heading ?? 'Statistics'}
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
            // Fixed height: grid never reflows when content loads → CLS=0
            minHeight: '6rem',
          }}
        >
          {stats?.map((stat) => (
            <div key={stat._key} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <dt
                style={{
                  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                  fontWeight: 800,
                  color: '#4f46e5',
                  lineHeight: 1,
                  order: 1,
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
                  order: 2,
                }}
              >
                {stat.label}
              </dd>
              {stat.description && (
                <dd style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0, order: 3 }}>
                  {stat.description}
                </dd>
              )}
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
