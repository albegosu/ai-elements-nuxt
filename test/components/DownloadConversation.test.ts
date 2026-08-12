import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AiDownloadConversation from '../../src/runtime/components/chatbot/DownloadConversation.vue'
import { messagesToMarkdown } from '../../src/runtime/utils/exportMessages'

describe('messagesToMarkdown', () => {
  it('produces a heading per role', () => {
    const md = messagesToMarkdown([
      { role: 'user', content: 'Hi' },
      { role: 'assistant', content: 'Hello!' },
    ])
    expect(md).toContain('## User')
    expect(md).toContain('Hi')
    expect(md).toContain('## Assistant')
    expect(md).toContain('Hello!')
  })

  it('extracts text from UIMessage parts when content is absent', () => {
    const md = messagesToMarkdown([
      { role: 'assistant', parts: [
        { type: 'text', text: 'part one' },
        { type: 'reasoning', text: 'ignored' },
        { type: 'text', text: 'part two' },
      ] },
    ])
    expect(md).toContain('part one')
    expect(md).toContain('part two')
    expect(md).not.toContain('ignored')
  })

  it('returns empty string for no messages', () => {
    expect(messagesToMarkdown([])).toBe('')
  })
})

describe('AiDownloadConversation', () => {
  beforeEach(() => {
    globalThis.URL.createObjectURL = vi.fn(() => 'blob:mock')
    globalThis.URL.revokeObjectURL = vi.fn()
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders a button', () => {
    const wrapper = mount(AiDownloadConversation, {
      props: { messages: [{ role: 'user', content: 'Hi' }] },
    })
    expect(wrapper.attributes('data-ai-download-conversation')).toBeDefined()
    expect(wrapper.find('button').attributes('aria-label')).toContain('Markdown')
  })

  it('disables the button with no messages', () => {
    const wrapper = mount(AiDownloadConversation, { props: { messages: [] } })
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('emits download with the serialized markdown on click', async () => {
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    const wrapper = mount(AiDownloadConversation, {
      props: { messages: [{ role: 'user', content: 'Hi' }] },
    })
    await wrapper.find('button').trigger('click')
    expect(clickSpy).toHaveBeenCalled()
    expect(wrapper.emitted('download')?.[0]?.[0]).toContain('## User')
  })
})
