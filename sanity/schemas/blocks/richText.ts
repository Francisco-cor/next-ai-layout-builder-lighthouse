import { defineType, defineField } from 'sanity'

export const richTextBlock = defineType({
  name: 'richTextBlock',
  title: 'Rich Text',
  type: 'object',
  fields: [
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' },
            ],
          },
        },
        { type: 'image', options: { hotspot: true } },
      ],
    }),
    defineField({
      name: 'aiPrompt',
      title: 'AI Generation Prompt',
      type: 'string',
      description: 'Hint for AI content generation (studio only)',
    }),
  ],
  preview: {
    select: { content: 'content' },
    prepare: ({ content }) => ({
      title: `Rich Text: ${content?.[0]?.children?.[0]?.text?.slice(0, 40) ?? 'Empty'}`,
    }),
  },
})
