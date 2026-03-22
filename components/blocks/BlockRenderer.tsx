import type { PageBlock } from '@/lib/graphql/__generated__/graphql'
import { Hero } from './Hero'
import { RichText } from './RichText'
import { FeatureGrid } from './FeatureGrid'
import { Testimonials } from './Testimonials'
import { CallToAction } from './CallToAction'
import { Stats } from './Stats'

interface BlockRendererProps {
  blocks: PageBlock[]
}

export function BlockRenderer({ blocks }: BlockRendererProps) {
  return (
    <main>
      {blocks.map((block) => {
        switch (block._type) {
          case 'heroBlock':
            return <Hero key={block._key} block={block} />
          case 'richTextBlock':
            return <RichText key={block._key} block={block} />
          case 'featureGridBlock':
            return <FeatureGrid key={block._key} block={block} />
          case 'testimonialsBlock':
            return <Testimonials key={block._key} block={block} />
          case 'callToActionBlock':
            return <CallToAction key={block._key} block={block} />
          case 'statsBlock':
            return <Stats key={block._key} block={block} />
          default:
            return null
        }
      })}
    </main>
  )
}
