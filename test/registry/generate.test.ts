import { describe, it, expect } from 'vitest'
import registry from '../../registry/components.json'

const CATEGORIES = ['chatbot', 'code', 'voice', 'workflow', 'utilities']

describe('generated registry', () => {
  it('componentCount matches the array length', () => {
    expect(registry.componentCount).toBe(registry.components.length)
  })

  it('every component has the required shape', () => {
    for (const c of registry.components) {
      expect(c.name).toMatch(/^Ai[A-Z]/)
      expect(CATEGORIES).toContain(c.category)
      expect(typeof c.slug).toBe('string')
      expect(Array.isArray(c.props)).toBe(true)
      expect(Array.isArray(c.slots)).toBe(true)
      expect(Array.isArray(c.events)).toBe(true)
      expect(typeof c.code).toBe('string')
    }
  })

  it('slugs are unique', () => {
    const slugs = registry.components.map(c => `${c.category}/${c.slug}`)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('tracks composables and version metadata', () => {
    expect(registry.composableCount).toBe(registry.composables.length)
    expect(registry.composables).toContain('useAiChat')
    expect(typeof registry.version).toBe('string')
    expect(registry.package).toBe('ai-elements-nuxt')
  })
})
