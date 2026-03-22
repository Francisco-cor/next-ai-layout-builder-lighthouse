import { PortableText } from '@portabletext/react'
import type { RichTextBlock } from '@/lib/graphql/__generated__/graphql'

interface RichTextProps {
  block: RichTextBlock
}

export function RichText({ block }: RichTextProps) {
  return (
    <section
      style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: '4rem 2rem',
      }}
    >
      <div
        className="prose"
        style={{
          fontSize: '1.125rem',
          lineHeight: 1.75,
          color: '#1e293b',
        }}
      >
        {block.contentRaw ? (
          <PortableText value={block.contentRaw as Parameters<typeof PortableText>[0]['value']} />
        ) : (
          <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>No content yet.</p>
        )}
      </div>
    </section>
  )
}
