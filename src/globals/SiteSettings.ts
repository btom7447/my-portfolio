import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
  },
  fields: [
    // ── Branding ──
    {
      name: 'siteName',
      type: 'text',
      defaultValue: 'Portfolio',
      admin: {
        description: 'Used in page titles, footer, and SEO metadata',
      },
    },
    {
      name: 'siteDescription',
      type: 'textarea',
      defaultValue: 'Full-stack web and mobile developer portfolio',
      admin: {
        description: 'Default meta description for search engines',
      },
    },

    // ── Social Links ──
    {
      name: 'socialLinks',
      type: 'group',
      admin: {
        description: 'Displayed in the footer and contact page',
      },
      fields: [
        {
          name: 'github',
          type: 'text',
          admin: { placeholder: 'https://github.com/username' },
        },
        {
          name: 'linkedin',
          type: 'text',
          admin: { placeholder: 'https://linkedin.com/in/username' },
        },
        {
          name: 'twitter',
          type: 'text',
          admin: { placeholder: 'https://twitter.com/username' },
        },
        {
          name: 'facebook',
          type: 'text',
          admin: { placeholder: 'https://facebook.com/username' },
        },
        {
          name: 'instagram',
          type: 'text',
          admin: { placeholder: 'https://instagram.com/username' },
        },
        {
          name: 'email',
          type: 'email',
          admin: { placeholder: 'you@example.com' },
        },
      ],
    },

    // ── Files ──
    {
      name: 'resumeFile',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'PDF resume — download button on About page',
      },
    },

    // ── FAQ ──
    {
      name: 'faq',
      type: 'array',
      admin: {
        description: 'Frequently asked questions — displayed on the contact page',
      },
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
      defaultValue: [
        {
          question: 'What is your typical project timeline?',
          answer: 'It depends on the scope, but most projects take 4–8 weeks from kickoff to launch. I break work into weekly milestones so you always know where things stand. For MVPs, I can often ship a working v1 in 2–3 weeks.',
        },
        {
          question: 'Do you work with early-stage startups?',
          answer: 'Absolutely. I\'ve helped founders go from napkin sketch to live product. I\'m comfortable wearing multiple hats — architecture, frontend, backend, deployment — which is exactly what early-stage teams need.',
        },
        {
          question: 'What does your tech stack look like?',
          answer: 'I primarily build with Next.js, React Native, TypeScript, and Node.js on the backend. For databases I use Postgres (Neon/Supabase) or MongoDB depending on the use case. I deploy on Vercel, AWS, or Railway.',
        },
        {
          question: 'Can you work with our existing codebase?',
          answer: 'Yes. I regularly join projects mid-flight. I\'ll audit the codebase, understand the architecture, and start contributing within the first few days. I\'m comfortable with most modern JS/TS stacks.',
        },
        {
          question: 'What is your availability and how do you communicate?',
          answer: 'I\'m currently available for new projects. I work async-first and communicate via Slack, email, or whatever your team uses. I provide regular updates and am flexible across time zones.',
        },
        {
          question: 'Do you offer ongoing support after launch?',
          answer: 'Yes. I offer maintenance retainers for bug fixes, performance monitoring, and feature additions post-launch. I don\'t disappear after deployment — I treat your product like my own.',
        },
      ],
    },

    // ── Preferences ──
    {
      name: 'defaultTheme',
      type: 'select',
      defaultValue: 'system',
      options: [
        { label: 'System (auto)', value: 'system' },
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
      ],
      admin: {
        description: 'Default color theme for first-time visitors',
      },
    },
  ],
}
