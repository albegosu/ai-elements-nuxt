export interface DocsTocItem {
  id: string
  label: string
  children?: { id: string; label: string }[]
}

const GITHUB_REPO = 'https://github.com/albegosu/ai-elements-nuxt'

export function useDocsToc() {
  const items = useState<DocsTocItem[]>('docs-toc-items', () => [])
  const githubPath = useState<string | null>('docs-toc-github', () => null)

  function setToc(toc: DocsTocItem[], source?: { category: string; slug: string }) {
    items.value = toc
    githubPath.value = source
      ? `${GITHUB_REPO}/blob/main/docs/pages/components/${source.category}/${source.slug}.vue`
      : null
  }

  function clearToc() {
    items.value = []
    githubPath.value = null
  }

  return { items, githubPath, setToc, clearToc }
}
