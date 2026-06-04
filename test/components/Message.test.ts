import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AiMessage from '../../src/runtime/components/chatbot/Message.vue'

describe('AiMessage', () => {
  it('renders user message content', () => {
    const wrapper = mount(AiMessage, {
      props: {
        role: 'user',
        content: 'Hello',
        status: 'complete',
      },
    })
    expect(wrapper.text()).toContain('Hello')
    expect(wrapper.attributes('data-ai-message')).toBeDefined()
    expect(wrapper.attributes('data-role')).toBe('user')
  })

  it('sets streaming data attribute', () => {
    const wrapper = mount(AiMessage, {
      props: {
        role: 'assistant',
        content: '',
        status: 'streaming',
      },
    })
    expect(wrapper.attributes('data-streaming')).toBeDefined()
  })

  it('renders custom content slot', () => {
    const wrapper = mount(AiMessage, {
      props: { role: 'assistant', content: 'hidden', status: 'complete' },
      slots: { content: '<span class="custom">Custom</span>' },
    })
    expect(wrapper.find('.custom').exists()).toBe(true)
  })
})
