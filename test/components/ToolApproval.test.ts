import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AiToolApproval from '../../src/runtime/components/chatbot/ToolApproval.vue'

describe('AiToolApproval', () => {
  it('shows actions when approval-requested', () => {
    const wrapper = mount(AiToolApproval, {
      props: {
        toolCall: {
          id: 'tc1',
          name: 'deleteFile',
          status: 'approval-requested',
          approvalId: 'approval-1',
          args: { path: '/tmp' },
        },
      },
    })
    expect(wrapper.text()).toContain('deleteFile')
    expect(wrapper.find('[data-ai-tool-approval-approve]').exists()).toBe(true)
  })

  it('hides during input-available', () => {
    const wrapper = mount(AiToolApproval, {
      props: {
        toolCall: {
          id: 'tc1',
          name: 'search',
          status: 'input-available',
        },
      },
    })
    expect(wrapper.find('[data-ai-tool-approval]').exists()).toBe(false)
  })

  it('emits approve with approvalId', async () => {
    const wrapper = mount(AiToolApproval, {
      props: {
        toolCall: {
          id: 'tc1',
          name: 'run',
          status: 'approval-requested',
          approvalId: 'approval-99',
        },
      },
    })
    await wrapper.find('[data-ai-tool-approval-approve]').trigger('click')
    expect(wrapper.emitted('approve')?.[0]).toEqual(['approval-99', undefined])
  })
})
