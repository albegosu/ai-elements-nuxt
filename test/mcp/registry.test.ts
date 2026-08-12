import { describe, it, expect } from 'vitest'
import {
  CATEGORIES,
  getRegistry,
  listComponents,
  getComponent,
  searchComponents,
  listComposables,
} from '../../src/mcp/registry.mjs'

describe('mcp registry accessors', () => {
  it('lists every component', () => {
    expect(listComponents().length).toBe(getRegistry().componentCount)
  })

  it('filters by category', () => {
    const voice = listComponents({ category: 'voice' })
    expect(voice.length).toBeGreaterThan(0)
    expect(voice.every(c => c.category === 'voice')).toBe(true)
  })

  it('gets a component by slug and by Ai* name', () => {
    expect(getComponent('branch')?.name).toBe('AiBranch')
    expect(getComponent('AiBranch')?.slug).toBe('branch')
    expect(getComponent('does-not-exist')).toBeNull()
    expect(getComponent()).toBeNull()
  })

  it('returns full metadata from getComponent', () => {
    const c = getComponent('AiPromptInput')
    expect(c?.props?.length).toBeGreaterThan(0)
    expect(Array.isArray(c?.slots)).toBe(true)
    expect(typeof c?.code).toBe('string')
  })

  it('searches by free text', () => {
    expect(searchComponents('screenshot').map(c => c.name)).toContain('AiScreenshotButton')
    expect(searchComponents('')).toEqual([])
  })

  it('lists composables', () => {
    const comps = listComposables()
    expect(comps).toContain('useSpeechRecognition')
    expect(comps.length).toBe(getRegistry().composableCount)
  })

  it('exposes the category set', () => {
    expect(CATEGORIES).toEqual(['chatbot', 'code', 'voice', 'workflow', 'utilities'])
  })
})
