import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AiRealtimeChat from '../../src/runtime/components/voice/RealtimeChat.vue'

describe('AiRealtimeChat', () => {
  it('shows connect button when disconnected', () => {
    const wrapper = mount(AiRealtimeChat, {
      props: { status: 'disconnected' },
    })
    expect(wrapper.find('[data-ai-realtime-connect]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Connect')
  })

  it('shows controls when connected', () => {
    const wrapper = mount(AiRealtimeChat, {
      props: { status: 'connected' },
    })
    expect(wrapper.find('[data-ai-realtime-capture]').exists()).toBe(true)
    expect(wrapper.find('[data-ai-realtime-disconnect]').exists()).toBe(true)
  })

  it('renders messages', () => {
    const wrapper = mount(AiRealtimeChat, {
      props: {
        status: 'connected',
        messages: [
          { id: '1', role: 'user', content: 'Hello' },
          { id: '2', role: 'assistant', content: 'Hi there' },
        ],
      },
    })
    expect(wrapper.findAll('[data-ai-realtime-message]')).toHaveLength(2)
  })

  it('emits connect when connect button clicked', async () => {
    const wrapper = mount(AiRealtimeChat, {
      props: { status: 'disconnected' },
    })
    await wrapper.find('[data-ai-realtime-connect]').trigger('click')
    expect(wrapper.emitted('connect')).toBeTruthy()
  })

  it('shows capturing state on mic button', () => {
    const wrapper = mount(AiRealtimeChat, {
      props: { status: 'connected', isCapturing: true },
    })
    const btn = wrapper.find('[data-ai-realtime-capture]')
    expect(btn.attributes('aria-pressed')).toBe('true')
    expect(btn.text()).toBe('Stop')
  })
})
