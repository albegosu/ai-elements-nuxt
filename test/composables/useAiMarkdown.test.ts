import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { useAiMarkdown } from '../../src/runtime/composables/useAiMarkdown'

describe('useAiMarkdown', () => {
  it('parses headings and lists', () => {
    const { html } = useAiMarkdown(ref('# Title\n\n- one\n- two'))
    expect(html.value).toContain('<h1>')
    expect(html.value).toContain('data-ai-markdown-list')
    expect(html.value).toContain('<li>')
  })

  it('parses fenced code blocks', () => {
    const { html } = useAiMarkdown(ref('```ts\nconst x = 1\n```'))
    expect(html.value).toContain('data-ai-markdown-code')
    expect(html.value).toContain('const x = 1')
  })

  it('blocks javascript: links', () => {
    const { html } = useAiMarkdown(ref('[click](javascript:alert(1))'))
    expect(html.value).not.toContain('javascript:')
    expect(html.value).toContain('click')
  })

  it('allows https links', () => {
    const { html } = useAiMarkdown(ref('[site](https://example.com)'))
    expect(html.value).toContain('href="https://example.com"')
  })

  it('parses GFM tables via marked', () => {
    const md = '| A | B |\n|---|---|\n| 1 | 2 |'
    const { html } = useAiMarkdown(ref(md))
    expect(html.value).toContain('data-ai-markdown-table')
    expect(html.value).toContain('<table')
  })

  it('parses strikethrough', () => {
    const { html } = useAiMarkdown(ref('~~removed~~'))
    expect(html.value).toMatch(/<del>|~~/)
  })

  it('parses task lists', () => {
    const { html } = useAiMarkdown(ref('- [x] done\n- [ ] todo'))
    expect(html.value).toContain('checkbox')
  })
})
