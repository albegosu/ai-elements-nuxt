import { describe, it, expect } from 'vitest'
import { useAiWorkflow } from '../../src/runtime/composables/useAiWorkflow'

describe('useAiWorkflow', () => {
  it('adds and moves nodes', () => {
    const wf = useAiWorkflow()
    wf.addNode({
      id: 'n1',
      type: 'task',
      label: 'Start',
      position: { x: 0, y: 0 },
    })
    expect(wf.nodes.value).toHaveLength(1)
    wf.moveNode('n1', { x: 100, y: 50 })
    expect(wf.nodes.value[0].position).toEqual({ x: 100, y: 50 })
  })

  it('addEdge respects canConnect', () => {
    const wf = useAiWorkflow(undefined, {
      canConnect: (s, _t) => s !== 'blocked',
    })
    wf.addNode({ id: 'a', type: 't', label: 'A', position: { x: 0, y: 0 } })
    wf.addNode({ id: 'blocked', type: 't', label: 'B', position: { x: 0, y: 0 } })
    expect(
      wf.addEdge({ id: 'e1', source: 'blocked', target: 'a' }),
    ).toBe(false)
    wf.addNode({ id: 'c', type: 't', label: 'C', position: { x: 0, y: 0 } })
    expect(
      wf.addEdge({ id: 'e2', source: 'a', target: 'c' }),
    ).toBe(true)
  })

  it('toJSON and fromJSON round-trip', () => {
    const wf = useAiWorkflow({
      nodes: [{ id: 'n1', type: 'x', label: 'N', position: { x: 1, y: 2 } }],
      edges: [{ id: 'e1', source: 'n1', target: 'n1' }],
    })
    const json = wf.toJSON()
    const wf2 = useAiWorkflow()
    wf2.fromJSON(json)
    expect(wf2.nodes.value[0].position).toEqual({ x: 1, y: 2 })
  })
})
