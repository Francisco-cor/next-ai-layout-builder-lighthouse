import { z } from 'zod'

// Runtime schemas for Sanity block data.
// TypeScript types provide compile-time safety; these schemas catch malformed
// data from the CMS at runtime before it reaches the render layer.

const CtaSchema = z.object({
  label: z.string().nullable().optional(),
  href: z.string().nullable().optional(),
})

const SanityImageAssetSchema = z.object({
  _id: z.string(),
  url: z.string(),
  metadata: z
    .object({
      dimensions: z.object({
        width: z.number(),
        height: z.number(),
        aspectRatio: z.number(),
      }),
      lqip: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
})

const SanityImageSchema = z
  .object({
    asset: SanityImageAssetSchema.nullable().optional(),
    alt: z.string().nullable().optional(),
    hotspot: z
      .object({ x: z.number().nullable().optional(), y: z.number().nullable().optional() })
      .nullable()
      .optional(),
  })
  .nullable()
  .optional()

export const HeroBlockSchema = z.object({
  _type: z.literal('heroBlock'),
  _key: z.string(),
  title: z.string(),
  subtitle: z.string().nullable().optional(),
  image: SanityImageSchema,
  cta: CtaSchema.nullable().optional(),
})

export const RichTextBlockSchema = z.object({
  _type: z.literal('richTextBlock'),
  _key: z.string(),
  contentRaw: z.unknown().nullable().optional(),
})

export const FeatureGridBlockSchema = z.object({
  _type: z.literal('featureGridBlock'),
  _key: z.string(),
  heading: z.string().nullable().optional(),
  features: z
    .array(
      z.object({
        _key: z.string(),
        icon: z.string().nullable().optional(),
        title: z.string(),
        description: z.string().nullable().optional(),
      })
    )
    .nullable()
    .optional(),
})

export const TestimonialsBlockSchema = z.object({
  _type: z.literal('testimonialsBlock'),
  _key: z.string(),
  heading: z.string().nullable().optional(),
  testimonials: z
    .array(
      z.object({
        _key: z.string(),
        quote: z.string(),
        author: z.string(),
        role: z.string().nullable().optional(),
        avatar: SanityImageSchema,
      })
    )
    .nullable()
    .optional(),
})

export const CallToActionBlockSchema = z.object({
  _type: z.literal('callToActionBlock'),
  _key: z.string(),
  heading: z.string(),
  subheading: z.string().nullable().optional(),
  buttonLabel: z.string(),
  buttonHref: z.string().nullable().optional(),
  backgroundColor: z.string().nullable().optional(),
  textColor: z.string().nullable().optional(),
})

export const StatsBlockSchema = z.object({
  _type: z.literal('statsBlock'),
  _key: z.string(),
  heading: z.string().nullable().optional(),
  stats: z
    .array(
      z.object({
        _key: z.string(),
        value: z.string(),
        label: z.string(),
        description: z.string().nullable().optional(),
      })
    )
    .nullable()
    .optional(),
})

export const PageBlockSchema = z.discriminatedUnion('_type', [
  HeroBlockSchema,
  RichTextBlockSchema,
  FeatureGridBlockSchema,
  TestimonialsBlockSchema,
  CallToActionBlockSchema,
  StatsBlockSchema,
])

export const PageBlocksSchema = z.array(PageBlockSchema)
