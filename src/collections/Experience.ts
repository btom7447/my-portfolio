import type { CollectionConfig } from 'payload'

export const Experience: CollectionConfig = {
  slug: 'experience',
  admin: {
    useAsTitle: 'role',
    defaultColumns: ['role', 'company', 'period', 'workMode', 'status'],
  },
  fields: [
    {
      name: 'company',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'text',
      required: true,
      admin: {
        description: 'Job title (e.g. Senior Frontend Engineer)',
      },
    },
    {
      name: 'period',
      type: 'text',
      required: true,
      admin: {
        placeholder: 'Jan 2023 — Present',
      },
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'monthOnly',
          displayFormat: 'MMM yyyy',
        },
        description: 'Used for sorting — pick the month you started this role',
      },
    },
    {
      name: 'workMode',
      type: 'select',
      options: [
        { label: 'Remote', value: 'remote' },
        { label: 'Hybrid', value: 'hybrid' },
        { label: 'On-site', value: 'onsite' },
      ],
      admin: {
        description: 'Optional — shows a tag on the timeline card',
      },
    },
    {
      name: 'companyUrl',
      type: 'text',
      admin: {
        placeholder: 'https://company.com or LinkedIn URL',
      },
    },
    {
      name: 'description',
      type: 'textarea',
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
