import { allComponents } from './navigation'
import { guides } from './guides'

export interface DocsSearchItem {
  id: string
  title: string
  subtitle?: string
  to: string
  group: string
}

const pageItems: DocsSearchItem[] = [
  { id: 'home', title: 'Home', subtitle: 'Documentation home', to: '/', group: 'Pages' },
  { id: 'components', title: 'Components', subtitle: 'Browse all components', to: '/components', group: 'Pages' },
  { id: 'playground', title: 'Chat Demo', subtitle: 'Interactive chat playground', to: '/playground', group: 'Playground' },
  { id: 'playground-agent', title: 'Agent Demo', subtitle: 'Agent tools and approval UI', to: '/playground/agent', group: 'Playground' },
  { id: 'playground-streaming', title: 'Streaming', subtitle: 'Streaming demo', to: '/playground/streaming', group: 'Playground' },
  { id: 'playground-code', title: 'Code playground', subtitle: 'Code components demo', to: '/playground/code', group: 'Playground' },
  { id: 'playground-voice', title: 'Voice & Workflow', subtitle: 'Voice and workflow demos', to: '/playground/voice', group: 'Playground' },
]

const guideItems: DocsSearchItem[] = guides.map(g => ({
  id: `guide-${g.slug}`,
  title: g.title,
  subtitle: g.description,
  to: `/guides/${g.slug}`,
  group: 'Guides',
}))

const componentItems: DocsSearchItem[] = allComponents.map(c => ({
  id: `component-${c.category}-${c.slug}`,
  title: c.name,
  subtitle: c.description,
  to: `/components/${c.category}/${c.slug}`,
  group: c.categoryLabel,
}))

export const docsSearchIndex: DocsSearchItem[] = [...pageItems, ...guideItems, ...componentItems]

export function filterSearchIndex(query: string, limit = 12): DocsSearchItem[] {
  const q = query.trim().toLowerCase()
  if (!q) return docsSearchIndex.slice(0, limit)

  return docsSearchIndex
    .filter((item) => {
      const haystack = `${item.title} ${item.subtitle ?? ''} ${item.group}`.toLowerCase()
      return haystack.includes(q)
    })
    .slice(0, limit)
}
