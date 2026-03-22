import { defineType, defineField } from 'sanity'

export const pageSchema = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'blocks',
      title: 'Page Blocks',
      type: 'array',
      of: [
        { type: 'heroBlock' },
        { type: 'richTextBlock' },
        { type: 'featureGridBlock' },
        { type: 'testimonialsBlock' },
        { type: 'callToActionBlock' },
        { type: 'statsBlock' },
      ],
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'slug.current' },
    prepare: ({ title, subtitle }) => ({ title, subtitle: `/${subtitle}` }),
  },
})
