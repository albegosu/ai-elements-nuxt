import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AiAgentTimeline from '../../src/runtime/components/code/AgentTimeline.vue'
import type { AiTimelineEntry } from '../../src/runtime/types/realtime'

const entries: AiTimelineEntry[] = [
  { id: '1', type: 'thought', content: 'Analyzing...', status: 'completed', duration: 150 },
  { id: '2', type: 'action', content: 'Calling search', tool: 'search', status: 'running', startTime: 1000 },
  { id: '3', type: 'observation', content: 'Found 3 results', status: 'pending' },
]

describe('AiAgentTimeline', () => {
  it('renders all entries', () => {
    const wrapper = mount(AiAgentTimeline, {
      props: { entries },
    })
    expect(wrapper.findAll('[data-ai-timeline-entry]')).toHaveLength(3)
  })

  it('marks running entry with aria-current', () => {
    const wrapper = mount(AiAgentTimeline, {
      props: { entries },
    })
    const running = wrapper.findAll('[data-ai-timeline-entry]')[1]
    expect(running.attributes('aria-current')).toBe('step')
  })

  it('shows step count summary', () => {
    const wrapper = mount(AiAgentTimeline, {
      props: { entries, title: 'Agent Run' },
    })
    expect(wrapper.text()).toContain('1/3 steps')
  })

  it('formats duration correctly', () => {
    const wrapper = mount(AiAgentTimeline, {
      props: { entries, showDuration: true },
    })
    expect(wrapper.text()).toContain('150ms')
  })

  it('hides entries when collapsed', () => {
    const wrapper = mount(AiAgentTimeline, {
      props: { entries, collapsed: true },
    })
    expect(wrapper.find('[data-ai-timeline-entries]').exists()).toBe(false)
  })
})
