import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AiApprovalPolicy from '../../src/runtime/components/chatbot/ApprovalPolicy.vue'

describe('AiApprovalPolicy', () => {
  it('shows pending user-approval tool calls', () => {
    const wrapper = mount(AiApprovalPolicy, {
      props: {
        tools: { deleteFile: 'user-approval', search: 'auto-approve' },
        toolCalls: [
          { id: 'tc1', name: 'deleteFile', status: 'approval-requested', approvalId: 'a1' },
        ],
      },
    })
    expect(wrapper.find('[data-ai-approval-policy-item]').exists()).toBe(true)
    expect(wrapper.text()).toContain('deleteFile')
  })

  it('shows empty state when no pending approvals', () => {
    const wrapper = mount(AiApprovalPolicy, {
      props: {
        tools: { search: 'auto-approve' },
        toolCalls: [],
      },
    })
    expect(wrapper.find('[data-ai-approval-policy-empty]').exists()).toBe(true)
  })

  it('emits approve with approval id and tool name', async () => {
    const wrapper = mount(AiApprovalPolicy, {
      props: {
        tools: { deleteFile: 'user-approval' },
        toolCalls: [
          { id: 'tc1', name: 'deleteFile', status: 'approval-requested', approvalId: 'a1' },
        ],
      },
    })
    await wrapper.find('[data-ai-approval-policy-approve]').trigger('click')
    expect(wrapper.emitted('approve')?.[0]).toEqual(['a1', 'deleteFile'])
  })

  it('emits deny with approval id and tool name', async () => {
    const wrapper = mount(AiApprovalPolicy, {
      props: {
        tools: { deleteFile: 'user-approval' },
        toolCalls: [
          { id: 'tc1', name: 'deleteFile', status: 'approval-requested', approvalId: 'a1' },
        ],
      },
    })
    await wrapper.find('[data-ai-approval-policy-deny]').trigger('click')
    expect(wrapper.emitted('deny')?.[0]).toEqual(['a1', 'deleteFile', undefined])
  })
})
