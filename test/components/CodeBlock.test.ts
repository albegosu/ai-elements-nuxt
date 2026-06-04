import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AiCodeBlock from '../../src/runtime/components/code/CodeBlock.vue'

describe('AiCodeBlock', () => {
  it('renders code lines', () => {
    const wrapper = mount(AiCodeBlock, {
      props: { code: 'const x = 1', language: 'typescript' },
    })
    expect(wrapper.text()).toContain('const x = 1')
  })

  it('emits copy on copy button click', async () => {
    vi.stubGlobal('navigator', {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    })
    const wrapper = mount(AiCodeBlock, {
      props: { code: 'hello' },
    })
    await wrapper.find('[data-ai-code-copy]').trigger('click')
    expect(wrapper.emitted('copy')).toBeTruthy()
  })
})
