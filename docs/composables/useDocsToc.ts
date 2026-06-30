export interface DocsTocItem {
  id: string
  label: string
  children?: { id: string; label: string }[]
}

export type DocsTocSource =
  | { type: 'component'; category: string; slug: string }
  | { type: 'page'; file: string }

export const COMPONENT_DOC_PATH = /^\/components\/[^/]+\/[^/]+$/
export const AUTO_TOC_PATH = /^(?:\/components|\/guides\/[^/]+|\/playground(?:\/[^/]+)?)$/

const GITHUB_REPO = 'https://github.com/albegosu/ai-elements-nuxt'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function githubPathFromSource(source: DocsTocSource): string {
  switch (source.type) {
    case 'component':
      return `${GITHUB_REPO}/blob/main/docs/pages/components/${source.category}/${source.slug}.vue`
    case 'page':
      return `${GITHUB_REPO}/blob/main/docs/pages/${source.file}`
  }
}

export function pageSourceFromPath(path: string): DocsTocSource | undefined {
  if (path === '/components') {
    return { type: 'page', file: 'components/index.vue' }
  }

  const guide = path.match(/^\/guides\/([^/]+)$/)
  if (guide) {
    return { type: 'page', file: `guides/${guide[1]}.vue` }
  }

  if (path === '/playground') {
    return { type: 'page', file: 'playground/index.vue' }
  }

  const playground = path.match(/^\/playground\/([^/]+)$/)
  if (playground) {
    return { type: 'page', file: `playground/${playground[1]}.vue` }
  }

  return undefined
}

export function buildTocFromHeadings(): DocsTocItem[] {
  if (!import.meta.client) return []

  const main = document.querySelector('main')
  if (!main) return []

  const items: DocsTocItem[] = []

  for (const heading of main.querySelectorAll('h2, [data-docs-toc]')) {
    const label = heading.getAttribute('data-docs-toc') ?? heading.textContent?.trim()
    if (!label) continue

    if (!heading.id) {
      let id = slugify(label)
      let suffix = 1
      while (document.getElementById(id) && document.getElementById(id) !== heading) {
        id = `${slugify(label)}-${suffix++}`
      }
      heading.id = id
    }

    items.push({ id: heading.id, label })
  }

  return items
}

export function useDocsToc() {
  const items = useState<DocsTocItem[]>('docs-toc-items', () => [])
  const githubPath = useState<string | null>('docs-toc-github', () => null)

  function setToc(toc: DocsTocItem[], source?: DocsTocSource) {
    items.value = toc
    githubPath.value = source ? githubPathFromSource(source) : null
  }

  function clearToc() {
    items.value = []
    githubPath.value = null
  }

  return { items, githubPath, setToc, clearToc, buildTocFromHeadings, pageSourceFromPath }
}
