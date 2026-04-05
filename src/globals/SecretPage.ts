import type { GlobalConfig } from 'payload'

export const SecretPage: GlobalConfig = {
  slug: 'secret-page',
  label: 'Secret Page',
  admin: {
    group: 'Pages',
    description: 'Content for the hidden /secret terminal page',
  },
  fields: [
    {
      name: 'sections',
      type: 'array',
      label: 'Terminal Sections',
      admin: {
        description: 'Each section becomes a "cat" command in the terminal. The command file path is auto-generated from the heading.',
      },
      fields: [
        {
          name: 'command',
          type: 'text',
          required: true,
          admin: {
            description: 'The terminal command shown (e.g. "cat abandoned-side-project/README.md")',
          },
        },
        {
          name: 'heading',
          type: 'text',
          required: true,
          admin: {
            description: 'Comment-style heading (e.g. "// the side project I abandoned")',
          },
        },
        {
          name: 'body',
          type: 'textarea',
          required: true,
        },
      ],
      defaultValue: [
        {
          command: 'cat abandoned-side-project/README.md',
          heading: '// the side project I abandoned',
          body: 'A habit tracker that was supposed to be "the one." Got 80% done, realized I was solving a problem I didn\'t actually have. The code is still sitting in a private repo. Every few months I open it, stare at it, and close the tab.',
        },
        {
          command: 'cat 4am-production-bug/postmortem.md',
          heading: '// the production bug that kept me up at 4am',
          body: 'A race condition in a payment flow. Two webhooks hitting the same endpoint within milliseconds, both passing validation, both trying to credit the same account. Turns out "it works on my machine" hits different when real money is moving.',
        },
        {
          command: 'cat tech-regrets/state-management.log',
          heading: '// the tech choice I\'d change',
          body: 'Picked a trendy state management library for a project that really just needed React context and a couple of reducers. Spent more time fighting the abstraction than building features. Lesson: boring tools that you understand beat exciting tools that you don\'t.',
        },
        {
          command: 'cat currently-learning/now.txt',
          heading: '// what I\'m actually learning right now',
          body: 'Always something new.',
        },
        {
          command: 'cat honest-confession.txt',
          heading: '// honest confession',
          body: 'I google CSS flexbox alignment at least once a week. I\'ve been writing CSS for years. I will never memorize it. And I\'ve accepted that.',
        },
      ],
    },
    {
      name: 'exitMessage',
      type: 'text',
      defaultValue: "don't tell anyone you were here",
      admin: {
        description: 'Final echo message before the exit prompt',
      },
    },
  ],
}
