import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'heroHeadline',
      type: 'text',
      required: true,
      defaultValue: 'Full-Stack Engineer — Web & Mobile',
    },
    {
      name: 'heroSubtext',
      type: 'textarea',
    },
    {
      name: 'resumeFile',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'socialLinks',
      type: 'group',
      fields: [
        {
          name: 'github',
          type: 'text',
        },
        {
          name: 'linkedin',
          type: 'text',
        },
        {
          name: 'twitter',
          type: 'text',
        },
      ],
    },
    {
      name: 'availableForWork',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Toggles hire badge on the site',
      },
    },
  ],
}
