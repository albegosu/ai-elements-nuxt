import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AiPlan from '../../src/runtime/components/chatbot/Plan.vue'

describe('AiPlan', () => {
  it('shows progress for nested steps', () => {
    const wrapper = mount(AiPlan, {
      props: {
        title: 'Plan',
        steps: [
          { id: '1', title: 'Done', status: 'completed' },
          { id: '2', title: 'Child', status: 'completed', children: [
            { id: '2a', title: 'Sub', status: 'completed' },
          ]},
          { id: '3', title: 'Todo', status: 'pending' },
        ],
      },
    })
    expect(wrapper.text()).toContain('3/4')
  })
})
