import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AiConversation from '../../src/runtime/components/chatbot/Conversation.vue'

describe('AiConversation', () => {
  const threads = [
    { id: '1', title: 'Active', updatedAt: new Date(), active: true },
    { id: '2', title: 'Archived', updatedAt: new Date(), archived: true },
  ]

  it('hides archived threads by default', () => {
    const wrapper = mount(AiConversation, {
      props: { threads, activeId: '1' },
    })
    expect(wrapper.text()).toContain('Active')
    expect(wrapper.text()).not.toContain('Archived')
  })

  it('emits select on thread click', async () => {
    const wrapper = mount(AiConversation, {
      props: { threads: [threads[0]], activeId: '1' },
    })
    await wrapper.find('[data-ai-conversation-item] button').trigger('click')
    expect(wrapper.emitted('select')).toBeTruthy()
  })
})
