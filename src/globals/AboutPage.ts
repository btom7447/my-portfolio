import type { GlobalConfig } from 'payload'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: 'About Page',
  access: {
    read: () => true,
  },
  fields: [
    // ── Hero section ──
    {
      name: 'name',
      type: 'text',
      required: true,
      defaultValue: 'Your Name',
      admin: {
        description: 'Displayed as "Hey, I\'m [name]"',
      },
    },
    {
      name: 'portrait',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Large portrait photo for the about hero',
      },
    },
    {
      name: 'intro',
      type: 'textarea',
      required: true,
      defaultValue:
        "I'm a full-stack engineer who builds for both web and mobile — a combination that's rarer than you'd think. I don't just write code; I build products that solve real problems for real people.\n\nMy path into engineering started with a curiosity for how things work and a love for building things from scratch. Since then, I've been obsessed with the craft of turning ideas into polished, functional products.\n\nI'm most energized when I'm working on a hard problem with a team that cares — and I bring that same energy whether I'm building an AI-powered SaaS or prototyping a mobile app.",
      admin: {
        description: 'Intro paragraphs — separate with blank lines',
      },
    },

    // ── Stats ──
    {
      name: 'stats',
      type: 'array',
      admin: {
        description: 'Key numbers displayed in a row',
      },
      defaultValue: [
        { value: '3+', label: 'Years building' },
        { value: '10+', label: 'Projects shipped' },
        { value: '2', label: 'Platforms (Web + Mobile)' },
        { value: '100%', label: 'Remote-ready' },
      ],
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },

    // ── Journey ──
    {
      name: 'journey',
      type: 'textarea',
      required: true,
      defaultValue:
        "I started out self-taught, driven by the thrill of building something from nothing and watching people use it. What kept me going wasn't tutorials or certificates — it was shipping real things.\n\nEarly on, I realized I didn't want to be \"just a frontend dev\" or \"just a backend dev.\" I wanted to understand the full picture — from the database schema to the pixel-perfect UI. That full-stack instinct led me to build across both web and mobile, which is now my biggest strength.\n\nThe turning point was my first production project that real users relied on. It showed me that shipping real products is a completely different skill from writing code, and I've been sharpening both ever since.",
      admin: {
        description: 'Your story — separate paragraphs with blank lines',
      },
    },

    // ── Values ──
    {
      name: 'values',
      type: 'array',
      admin: {
        description: 'What you bring to a team',
      },
      defaultValue: [
        {
          title: 'Ownership',
          description:
            "I treat every project like it's mine. I don't wait for tickets — I identify problems, propose solutions, and follow through until it's shipped.",
        },
        {
          title: 'Clarity over cleverness',
          description:
            "Readable code, clear communication, honest timelines. I'd rather over-communicate than leave stakeholders guessing.",
        },
        {
          title: 'User-first thinking',
          description:
            'Every technical decision starts with "how does this affect the person using it?" Performance, accessibility, and UX aren\'t afterthoughts.',
        },
        {
          title: 'Bias for action',
          description:
            'I ship fast, learn from feedback, and iterate. A solid v1 in production beats a perfect spec in a doc.',
        },
      ],
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },

    // ── Tech stack ──
    {
      name: 'techCategories',
      type: 'array',
      admin: {
        description: 'Tech stack grouped by category',
      },
      defaultValue: [
        { category: 'Frontend', techs: 'React\nNext.js\nTypeScript\nTailwind CSS\nFramer Motion' },
        { category: 'Backend', techs: 'Node.js\nExpress\nPostgreSQL\nMongoDB\nPython\nPayload CMS\nREST APIs' },
        { category: 'Mobile', techs: 'React Native\nExpo\nFlutter\nSwift\nKotlin' },
        { category: 'Tools', techs: 'Git\nFigma\nVercel\nDocker\nVS Code\nPaystack\nClaude Code' },
      ],
      fields: [
        { name: 'category', type: 'text', required: true },
        {
          name: 'techs',
          type: 'textarea',
          required: true,
          admin: { description: 'One technology per line' },
        },
      ],
    },

    // ── Process ──
    {
      name: 'processItems',
      type: 'array',
      admin: {
        description: 'How you approach work — each item has a bold title and description',
      },
      defaultValue: [
        {
          title: 'Understand first, build second.',
          description:
            "I start every project by understanding the problem deeply — who's it for, what's the core value, what does success look like? The best code is the code that solves the right problem.",
        },
        {
          title: 'Ship, then iterate.',
          description:
            'I prefer to launch a solid v1 and improve based on real feedback rather than polishing in the dark. Momentum matters.',
        },
        {
          title: 'Communicate like a teammate, not a contractor.',
          description:
            "I flag blockers early, share progress regularly, and push back constructively when I think there's a better path. No surprises.",
        },
        {
          title: 'Design is how it works.',
          description:
            "UI isn't decoration — it's the logic, the loading states, the error handling, the edge cases. I think in systems, not just screens.",
        },
      ],
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },

    // ── Beyond code ──
    {
      name: 'beyondCode',
      type: 'textarea',
      required: true,
      defaultValue:
        "Outside of work, you'll find me exploring new music, reading about product strategy, and experimenting with the latest dev tools. I'm always looking for inspiration in unexpected places.\n\nI'm deeply curious about how products shape behavior, startup culture, and what makes teams work well together. I believe the best engineers are the ones who understand people, not just code.",
      admin: {
        description: 'Personal interests — separate paragraphs with blank lines',
      },
    },
  ],
}
