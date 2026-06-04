export interface NavGuide {
  slug: string
  title: string
  description: string
}

export const guides: NavGuide[] = [
  {
    slug: 'getting-started',
    title: 'Getting Started',
    description: 'Install, configure, and your first streaming chat',
  },
  {
    slug: 'building-a-chat',
    title: 'Building a Chat',
    description: 'Server routes, useAiChat, persistence, and UX patterns',
  },
  {
    slug: 'building-an-agent',
    title: 'Building an Agent',
    description: 'Tools, approval gates, and multi-step agents',
  },
  {
    slug: 'styling',
    title: 'Styling Guide',
    description: 'data-ai-* hooks, Tailwind, and slot customization',
  },
  {
    slug: 'composables',
    title: 'Composables',
    description: 'API reference for all chat and agent composables',
  },
]
