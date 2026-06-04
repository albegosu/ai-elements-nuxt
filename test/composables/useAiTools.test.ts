import { describe, it, expect } from 'vitest'
import { useAiTools } from '../../src/runtime/composables/useAiTools'
import { useAiAgent } from '../../src/runtime/composables/useAiAgent'

describe('useAiTools', () => {
  it('builds toolMap from definitions', () => {
    const agent = useAiAgent()
    const { toolMap, getToolMeta } = useAiTools(
      [{ name: 'search', description: 'Search the web' }],
      agent,
    )
    expect(toolMap.value.get('search')?.description).toBe('Search the web')
    expect(getToolMeta('search')?.name).toBe('search')
  })

  it('approveTool delegates to agent.approve', () => {
    const agent = useAiAgent()
    const { approveTool } = useAiTools([{ name: 'run' }], agent)
    agent.requestConfirmation({ id: 'a1', title: 'Run?' })
    approveTool('a1')
    expect(agent.pendingConfirmation.value).toBeNull()
  })

  it('pendingApprovals is empty initially', () => {
    const agent = useAiAgent()
    const { pendingApprovals } = useAiTools([], agent)
    expect(pendingApprovals.value).toEqual([])
  })
})
