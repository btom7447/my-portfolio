import type { CollectionConfig } from 'payload'

export const Certifications: CollectionConfig = {
  slug: 'certifications',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'institute', 'date', 'status'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'institute',
      type: 'text',
      required: true,
      admin: {
        description: 'Issuing organization (e.g. AWS, Google, Meta)',
      },
    },
    {
      name: 'link',
      type: 'text',
      admin: {
        description: 'URL to verify or view the certificate',
      },
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'monthOnly',
          displayFormat: 'MMM yyyy',
        },
        description: 'Date issued',
      },
    },
    {
      name: 'credentialId',
      type: 'text',
      admin: {
        description: 'Credential ID if applicable',
      },
    },
    {
      name: 'badge',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Certificate badge or logo',
      },
    },
    {
      name: 'status',
      type: 'select',
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
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
