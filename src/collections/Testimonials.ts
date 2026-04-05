import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'authorName',
    defaultColumns: ['authorName', 'authorCompany', 'featured', 'status', 'order'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      admin: {
        description: 'The testimonial text',
      },
    },
    {
      name: 'authorName',
      type: 'text',
      required: true,
    },
    {
      name: 'authorRole',
      type: 'text',
      required: true,
      admin: {
        placeholder: 'Senior PM',
      },
    },
    {
      name: 'authorCompany',
      type: 'text',
      required: true,
      admin: {
        placeholder: 'Company Name',
      },
    },
    {
      name: 'authorAvatar',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional — falls back to initials if empty',
      },
    },
    {
      name: 'linkedinProfileUrl',
      type: 'text',
      required: true,
      admin: {
        placeholder: 'https://linkedin.com/in/their-handle',
        description: 'LinkedIn profile for verification badge',
      },
    },
    {
      name: 'linkedinRecommendationUrl',
      type: 'text',
      admin: {
        placeholder: 'https://linkedin.com/in/your-profile/details/recommendations',
        description: 'Direct link to LinkedIn recommendation (optional)',
      },
    },
    {
      name: 'projectRelated',
      type: 'relationship',
      relationTo: 'projects',
      admin: {
        description: 'Link testimonial to a specific project (shows on case study page)',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show on homepage',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'published',
      options: [
        { label: 'Published', value: 'published' },
        { label: 'Draft', value: 'draft' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first',
      },
    },
  ],
}
