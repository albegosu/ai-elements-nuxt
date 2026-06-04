import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AiReasoning from '../../src/runtime/components/chatbot/Reasoning.vue'

describe('AiReasoning', () => {
  it('uses unique content ids per instance', () => {
    const a = mount(AiReasoning, { props: { content: 'A' } })
    const b = mount(AiReasoning, { props: { content: 'B' } })
    const idA = a.find('[id]').attributes('id')
    const idB = b.find('[id]').attributes('id')
    expect(idA).toBeTruthy()
    expect(idB).toBeTruthy()
    expect(idA).not.toBe(idB)
  })

  it('expands when streaming', async () => {
    const wrapper = mount(AiReasoning, {
      props: { content: 'Thinking', streaming: true, collapsed: true },
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[role="region"]').isVisible()).toBe(true)
  })
})
