import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AiAgent from '../../src/runtime/components/code/Agent.vue'

describe('AiAgent', () => {
  it('renders agent steps', () => {
    const wrapper = mount(AiAgent, {
      props: {
        title: 'Agent',
        steps: [
          { id: '1', type: 'thought', content: 'Planning', status: 'completed' },
          { id: '2', type: 'action', content: 'Search', tool: 'search', status: 'running' },
        ],
      },
    })
    expect(wrapper.text()).toContain('Planning')
    expect(wrapper.text()).toContain('search')
  })
})
