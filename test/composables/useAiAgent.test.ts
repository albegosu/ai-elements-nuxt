import { describe, it, expect } from 'vitest'
import { useAiAgent } from '../../src/runtime/composables/useAiAgent'

describe('useAiAgent', () => {
  it('starts with empty agent state', () => {
    const agent = useAiAgent()
    expect(agent.steps.value).toEqual([])
    expect(agent.plan.value).toEqual([])
    expect(agent.tasks.value).toEqual([])
    expect(agent.pendingConfirmation.value).toBeNull()
  })

  it('approve and deny clear pending confirmation', () => {
    const agent = useAiAgent()
    agent.requestConfirmation({
      id: 'c1',
      title: 'Delete?',
      description: 'Confirm delete',
    })
    expect(agent.pendingConfirmation.value?.id).toBe('c1')
    agent.approve('c1')
    expect(agent.pendingConfirmation.value).toBeNull()
    expect(agent.steps.value.some(s => s.content === 'Approved')).toBe(true)

    agent.requestConfirmation({
      id: 'c2',
      title: 'Run tool?',
    })
    agent.deny('c2')
    expect(agent.pendingConfirmation.value).toBeNull()
    expect(agent.steps.value.some(s => s.content === 'Denied')).toBe(true)
  })

  it('upserts tool steps instead of duplicating', () => {
    const agent = useAiAgent()
    agent.steps.value = [{
      id: 'tc1',
      type: 'action',
      content: 'old',
      status: 'running',
    }]
    agent.steps.value.splice(0, 1, {
      id: 'tc1',
      type: 'action',
      content: 'new',
      status: 'completed',
    })
    expect(agent.steps.value.filter(s => s.id === 'tc1')).toHaveLength(1)
    expect(agent.steps.value[0].content).toBe('new')
  })

  it('setPlan and setTasks update refs', () => {
    const agent = useAiAgent()
    agent.setPlan([{ id: '1', title: 'Step 1', status: 'pending' }])
    agent.setTasks([{ id: 't1', title: 'Task', status: 'pending' }])
    expect(agent.plan.value).toHaveLength(1)
    expect(agent.tasks.value).toHaveLength(1)
  })
})
