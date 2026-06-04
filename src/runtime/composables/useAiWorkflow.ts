import { ref, type Ref } from 'vue'
import type { AiWorkflowData, AiWorkflowEdge, AiWorkflowNode } from '../types'

export interface UseAiWorkflowOptions {
  /** Return false to block a new edge */
  canConnect?: (source: string, target: string) => boolean
}

/**
 * Reactive workflow graph state for {@link AiCanvas}, {@link AiNode}, and {@link AiEdge}.
 */
export function useAiWorkflow(
  initialData?: AiWorkflowData,
  options?: UseAiWorkflowOptions,
) {
  const nodes = ref<AiWorkflowNode[]>(initialData?.nodes ?? [])
  const edges = ref<AiWorkflowEdge[]>(initialData?.edges ?? [])
  const selectedNodes = ref<string[]>([])
  const selectedEdges = ref<string[]>([])

  function addNode(node: AiWorkflowNode) {
    nodes.value.push(node)
  }

  function removeNode(id: string) {
    nodes.value = nodes.value.filter(n => n.id !== id)
    edges.value = edges.value.filter(e => e.source !== id && e.target !== id)
    selectedNodes.value = selectedNodes.value.filter(s => s !== id)
  }

  function moveNode(id: string, position: { x: number; y: number }) {
    const node = nodes.value.find(n => n.id === id)
    if (node) {
      node.position = { ...position }
    }
  }

  function addEdge(edge: AiWorkflowEdge) {
    if (options?.canConnect && !options.canConnect(edge.source, edge.target)) {
      return false
    }
    if (edge.source === edge.target) return false
    if (edges.value.some(e => e.source === edge.source && e.target === edge.target)) {
      return false
    }
    edges.value.push(edge)
    return true
  }

  function removeEdge(id: string) {
    edges.value = edges.value.filter(e => e.id !== id)
    selectedEdges.value = selectedEdges.value.filter(s => s !== id)
  }

  function canConnect(source: string, target: string) {
    if (source === target) return false
    if (options?.canConnect && !options.canConnect(source, target)) return false
    return !edges.value.some(e => e.source === source && e.target === target)
  }

  function selectNode(id: string, additive = false) {
    if (additive) {
      if (selectedNodes.value.includes(id)) {
        selectedNodes.value = selectedNodes.value.filter(s => s !== id)
      } else {
        selectedNodes.value.push(id)
      }
    } else {
      selectedNodes.value = [id]
      selectedEdges.value = []
    }
  }

  function selectEdge(id: string, additive = false) {
    if (additive) {
      if (selectedEdges.value.includes(id)) {
        selectedEdges.value = selectedEdges.value.filter(s => s !== id)
      } else {
        selectedEdges.value.push(id)
      }
    } else {
      selectedEdges.value = [id]
      selectedNodes.value = []
    }
  }

  function clearSelection() {
    selectedNodes.value = []
    selectedEdges.value = []
  }

  function toJSON(): AiWorkflowData {
    return {
      nodes: nodes.value.map(n => ({ ...n, position: { ...n.position } })),
      edges: [...edges.value],
    }
  }

  function fromJSON(data: AiWorkflowData) {
    nodes.value = data.nodes.map(n => ({ ...n, position: { ...n.position } }))
    edges.value = [...data.edges]
    clearSelection()
  }

  return {
    nodes,
    edges,
    selectedNodes,
    selectedEdges,
    addNode,
    removeNode,
    moveNode,
    addEdge,
    removeEdge,
    canConnect,
    selectNode,
    selectEdge,
    clearSelection,
    toJSON,
    fromJSON,
  }
}

export type UseAiWorkflowReturn = {
  nodes: Ref<AiWorkflowNode[]>
  edges: Ref<AiWorkflowEdge[]>
  selectedNodes: Ref<string[]>
  selectedEdges: Ref<string[]>
  addNode: (node: AiWorkflowNode) => void
  removeNode: (id: string) => void
  moveNode: (id: string, position: { x: number; y: number }) => void
  addEdge: (edge: AiWorkflowEdge) => boolean
  removeEdge: (id: string) => void
  canConnect: (source: string, target: string) => boolean
  selectNode: (id: string, additive?: boolean) => void
  selectEdge: (id: string, additive?: boolean) => void
  clearSelection: () => void
  toJSON: () => AiWorkflowData
  fromJSON: (data: AiWorkflowData) => void
}
