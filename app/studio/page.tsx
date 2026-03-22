import { sanityClient } from '@/sanity/lib/client'

interface PageSummary {
  _id: string
  title: string
  slug: { current: string }
  _updatedAt: string
}

export default async function StudioPage() {
  const pages = await sanityClient.fetch<PageSummary[]>(
    `*[_type == "page"] | order(_updatedAt desc) {
      _id, title, slug, _updatedAt
    }`
  )

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>
          Page Builder
        </h1>
        <a
          href="https://www.sanity.io/manage"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#4f46e5',
            color: '#fff',
            borderRadius: '6px',
            fontSize: '0.875rem',
            fontWeight: 500,
            textDecoration: 'none',
          }}
        >
          Open Sanity Studio ↗
        </a>
      </div>

      {pages.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#94a3b8' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📄</div>
          <p>No pages yet. Create your first page in Sanity Studio.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {pages.map((page) => (
            <a
              key={page._id}
              href={`/studio/editor/${page.slug.current}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.25rem',
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'border-color 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.borderColor = '#4f46e5'
                ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 1px 4px rgba(79,70,229,0.12)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.borderColor = '#e2e8f0'
                ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none'
              }}
            >
              <div>
                <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '2px' }}>
                  {page.title}
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                  /{page.slug.current}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <a
                  href={`/${page.slug.current}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{ fontSize: '0.8125rem', color: '#4f46e5', textDecoration: 'none' }}
                >
                  View ↗
                </a>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Edit →
                </span>
              </div>
            </a>
          ))}
        </div>
      )}

      <div style={{ marginTop: '3rem', padding: '1.25rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '0.75rem', fontSize: '0.875rem' }}>Week 2 checklist</div>
        {[
          ['✓', 'dnd-kit sortable list with useTransition (INP <100ms)'],
          ['✓', 'Optimistic field updates with revert on failure'],
          ['✓', 'Sanity live preview via .listen() websocket'],
          ['✓', 'Toast error notifications'],
          ['✓', 'Editor bundle isolated via dynamic() ssr:false'],
          ['⏳', 'AI content generation (Week 3 — SSE streaming)'],
        ].map(([icon, text]) => (
          <div key={text} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem', fontSize: '0.875rem' }}>
            <span>{icon}</span>
            <span style={{ color: icon === '✓' ? '#166534' : '#64748b' }}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
