import { defineType, defineField } from 'sanity'

export const callToActionBlock = defineType({
  name: 'callToActionBlock',
  title: 'Call to Action',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'buttonLabel',
      title: 'Button Label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'buttonHref',
      title: 'Button URL',
      type: 'url',
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      options: {
        list: [
          { title: 'Indigo', value: '#4f46e5' },
          { title: 'Slate', value: '#1e293b' },
          { title: 'Emerald', value: '#059669' },
          { title: 'Rose', value: '#e11d48' },
        ],
      },
    }),
    defineField({
      name: 'textColor',
      title: 'Text Color',
      type: 'string',
      options: {
        list: [
          { title: 'White', value: '#ffffff' },
          { title: 'Dark', value: '#1e293b' },
        ],
      },
      initialValue: '#ffffff',
    }),
  ],
  preview: {
    select: { heading: 'heading' },
    prepare: ({ heading }) => ({ title: `CTA: ${heading}` }),
  },
})
