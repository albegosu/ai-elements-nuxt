import { computed, unref, type ComputedRef, type MaybeRef } from 'vue'
import type { AiToolCall } from '../types'
import { isAiToolApprovalRequested, isAiToolInProgress } from '../types'
import type { useAiAgent } from './useAiAgent'

export interface AiToolDefinition {
  name: string
  description?: string
  icon?: string
  /** Custom render hint for tool result UI (consumer renders in template) */
  render?: (args: Record<string, unknown>, result: unknown) => string
  requireConfirmation?: boolean
  onApprove?: (id: string) => void
  onDeny?: (id: string) => void
}

export type UseAiAgentReturn = ReturnType<typeof useAiAgent>

export interface UseAiToolsReturn {
  toolMap: ComputedRef<Map<string, AiToolDefinition>>
  activeTools: ComputedRef<AiToolCall[]>
  pendingApprovals: ComputedRef<AiToolCall[]>
  getToolMeta: (name: string) => AiToolDefinition | undefined
  approveTool: (id: string) => void
  denyTool: (id: string, reason?: string) => void
}

/**
 * Declarative client-side tool metadata wired to {@link useAiAgent}.
 */
export function useAiTools(
  tools: MaybeRef<AiToolDefinition[]>,
  agent: UseAiAgentReturn,
): UseAiToolsReturn {
  const toolMap = computed(() => {
    const map = new Map<string, AiToolDefinition>()
    for (const t of unref(tools)) {
      map.set(t.name, t)
    }
    return map
  })

  const allToolCalls = computed(() => {
    const calls: AiToolCall[] = []
    for (const msg of agent.aiMessages.value) {
      if (msg.toolCalls?.length) {
        calls.push(...msg.toolCalls)
      }
    }
    return calls
  })

  const activeTools = computed(() =>
    allToolCalls.value.filter(tc => isAiToolInProgress(tc.status)),
  )

  const pendingApprovals = computed(() =>
    allToolCalls.value.filter(tc => isAiToolApprovalRequested(tc.status)),
  )

  function getToolMeta(name: string) {
    return toolMap.value.get(name)
  }

  function approveTool(id: string) {
    const tc = allToolCalls.value.find(
      c => c.approvalId === id || c.id === id,
    )
    if (tc) {
      const def = getToolMeta(tc.name)
      def?.onApprove?.(id)
    }
    agent.approve(id)
  }

  function denyTool(id: string, reason?: string) {
    const tc = allToolCalls.value.find(
      c => c.approvalId === id || c.id === id,
    )
    if (tc) {
      const def = getToolMeta(tc.name)
      def?.onDeny?.(id)
    }
    agent.deny(id, reason)
  }

  return {
    toolMap,
    activeTools,
    pendingApprovals,
    getToolMeta,
    approveTool,
    denyTool,
  }
}
