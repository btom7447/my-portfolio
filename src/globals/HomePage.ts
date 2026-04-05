import type { GlobalConfig } from 'payload'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Home Page',
  access: {
    read: () => true,
  },
  fields: [
    // ── Hero ──
    {
      name: 'headshot',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Small circular photo in the hero section',
      },
    },
    {
      name: 'heroHeadline',
      type: 'text',
      required: true,
      defaultValue: 'I build web & mobile experiences',
      admin: {
        description: 'Main heading — "web", "&", "mobile" auto-highlighted in accent',
      },
    },
    {
      name: 'heroSubtext',
      type: 'textarea',
      defaultValue:
        'Full-stack engineer turning ideas into polished, production-ready products — from first commit to launch day.',
    },
    {
      name: 'availableForWork',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Shows/hides the green "Available for work" badge',
      },
    },

    // ── About teaser ──
    {
      name: 'aboutTeaserHeadline',
      type: 'text',
      defaultValue: 'A developer who ships',
    },
    {
      name: 'aboutTeaserText',
      type: 'textarea',
      defaultValue:
        "I'm a full-stack engineer who builds for both web and mobile. From idea to deployment, I focus on clean architecture, polished interfaces, and products that actually work.",
    },

    // ── CTA section ──
    {
      name: 'ctaHeadline',
      type: 'text',
      defaultValue: "Let's build something together",
    },
    {
      name: 'ctaText',
      type: 'textarea',
      defaultValue: "Have a project in mind? I'd love to hear about it.",
    },

    // ── Clients / Logos ──
    {
      name: 'clientLogos',
      type: 'array',
      admin: {
        description: '"Trusted by" logo strip — leave empty to hide',
      },
      fields: [
        { name: 'name', type: 'text', required: true },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        { name: 'url', type: 'text', admin: { placeholder: 'https://company.com' } },
      ],
    },
  ],
}
