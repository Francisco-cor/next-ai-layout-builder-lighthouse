import { heroBlock } from './blocks/hero'
import { richTextBlock } from './blocks/richText'
import { featureGridBlock } from './blocks/featureGrid'
import { testimonialsBlock } from './blocks/testimonials'
import { callToActionBlock } from './blocks/callToAction'
import { statsBlock } from './blocks/stats'
import { pageSchema } from './page'

export const schemaTypes = [
  pageSchema,
  heroBlock,
  richTextBlock,
  featureGridBlock,
  testimonialsBlock,
  callToActionBlock,
  statsBlock,
]
