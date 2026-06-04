import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

describe('ai-elements-nuxt module', () => {
  it('defines a valid Nuxt module in source', () => {
    const source = readFileSync(resolve(__dirname, '../src/module.ts'), 'utf-8')
    expect(source).toContain("name: 'ai-elements-nuxt'")
    expect(source).toContain("configKey: 'aiElements'")
    expect(source).toContain('defaultStyles: false')
    expect(source).toContain('setup(options, nuxt)')
  })

  it('registers five component categories in source', () => {
    const source = readFileSync(resolve(__dirname, '../src/module.ts'), 'utf-8')
    for (const category of ['chatbot', 'code', 'voice', 'workflow', 'utilities']) {
      expect(source).toContain(category)
    }
  })

  it('auto-imports composables and utils', () => {
    const source = readFileSync(resolve(__dirname, '../src/module.ts'), 'utf-8')
    expect(source).toContain('addImportsDir')
    expect(source).toContain('./runtime/composables')
    expect(source).toContain('./runtime/utils')
    expect(source).toContain('#ai-elements')
  })

  it('ships built server entry for consumers', () => {
    const serverIndex = resolve(__dirname, '../dist/runtime/server/index.js')
    expect(existsSync(serverIndex)).toBe(true)
  })

  it('dist includes all source composables when dist exists', () => {
    const composables = [
      'useAiChat.js',
      'useAiChatLocal.js',
      'useAiCompletion.js',
      'useAiAgent.js',
      'useAiChatPersisted.js',
      'useAiMarkdown.js',
      'useAiTools.js',
      'useAiWorkflow.js',
    ]
    for (const file of composables) {
      const path = resolve(__dirname, '../dist/runtime/composables', file)
      if (existsSync(resolve(__dirname, '../dist'))) {
        expect(existsSync(path), `missing dist composable ${file}`).toBe(true)
      }
    }
  })
})
