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
      props: { content: 'Thinking', streaming: false, collapsed: true },
    })
    await wrapper.setProps({ streaming: true })
    expect(wrapper.find('[role="region"]').isVisible()).toBe(true)
  })

  it('shows the default thinking message while streaming', async () => {
    const wrapper = mount(AiReasoning, { props: { streaming: false } })
    expect(wrapper.text()).toContain('Show reasoning')
    await wrapper.setProps({ streaming: true })
    expect(wrapper.text()).toContain('Thinking...')
  })

  it('reports a duration and auto-closes when streaming ends', async () => {
    const wrapper = mount(AiReasoning, { props: { content: 'X', streaming: false, autoClose: true } })
    await wrapper.setProps({ streaming: true })
    expect(wrapper.attributes('data-collapsed')).toBeUndefined()
    await wrapper.setProps({ streaming: false })
    // collapses on stop
    expect(wrapper.attributes('data-collapsed')).toBe('true')
    // "Thought for N second(s)"
    expect(wrapper.text()).toMatch(/Thought for \d+ seconds?/)
  })

  it('uses a custom getThinkingMessage', async () => {
    const wrapper = mount(AiReasoning, {
      props: {
        streaming: true,
        getThinkingMessage: ({ streaming }: { streaming: boolean, duration: number }) =>
          streaming ? 'Reticulating splines' : 'Done',
      },
    })
    expect(wrapper.text()).toContain('Reticulating splines')
  })
})
