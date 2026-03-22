import { defineType, defineField } from 'sanity'

export const featureGridBlock = defineType({
  name: 'featureGridBlock',
  title: 'Feature Grid',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Section Heading',
      type: 'string',
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'feature',
          fields: [
            defineField({ name: 'icon', title: 'Icon (emoji or SVG name)', type: 'string' }),
            defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
            defineField({ name: 'aiPrompt', title: 'AI Prompt (studio)', type: 'string' }),
          ],
          preview: { select: { title: 'title' }, prepare: ({ title }) => ({ title }) },
        },
      ],
      validation: (rule) => rule.max(6),
    }),
  ],
  preview: {
    select: { heading: 'heading' },
    prepare: ({ heading }) => ({ title: `Features: ${heading ?? 'Untitled'}` }),
  },
})
