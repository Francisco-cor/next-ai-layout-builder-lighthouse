import { defineType, defineField } from 'sanity'

export const testimonialsBlock = defineType({
  name: 'testimonialsBlock',
  title: 'Testimonials',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Section Heading',
      type: 'string',
    }),
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'testimonial',
          fields: [
            defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 4, validation: (r) => r.required() }),
            defineField({ name: 'author', title: 'Author Name', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'role', title: 'Role / Company', type: 'string' }),
            defineField({ name: 'avatar', title: 'Avatar', type: 'image', options: { hotspot: true } }),
          ],
          preview: { select: { title: 'author', subtitle: 'role' }, prepare: ({ title, subtitle }) => ({ title, subtitle }) },
        },
      ],
    }),
  ],
  preview: {
    select: { heading: 'heading' },
    prepare: ({ heading }) => ({ title: `Testimonials: ${heading ?? 'Untitled'}` }),
  },
})
