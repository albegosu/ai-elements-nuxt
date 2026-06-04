import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AiTool from '../../src/runtime/components/chatbot/Tool.vue'

const baseToolCall = {
  id: 'tc1',
  name: 'search',
  status: 'input-available' as const,
}

describe('AiTool', () => {
  it('shows loading state when in progress', () => {
    const wrapper = mount(AiTool, { props: { toolCall: baseToolCall } })
    expect(wrapper.attributes('data-status')).toBe('input-available')
    expect(wrapper.text()).toContain('Calling...')
  })

  it('shows result slot content', () => {
    const wrapper = mount(AiTool, {
      props: {
        toolCall: { ...baseToolCall, status: 'output-available', result: { ok: true } },
      },
    })
    expect(wrapper.attributes('data-status')).toBe('output-available')
  })

  it('shows approval-requested state', () => {
    const wrapper = mount(AiTool, {
      props: {
        toolCall: { ...baseToolCall, status: 'approval-requested', approvalId: 'a1' },
      },
    })
    expect(wrapper.text()).toContain('Awaiting approval')
  })

  it('shows error', () => {
    const wrapper = mount(AiTool, {
      props: {
        toolCall: { ...baseToolCall, status: 'output-error', error: 'Failed' },
      },
    })
    expect(wrapper.text()).toContain('Failed')
  })
})
