import { ref, computed, watch, onScopeDispose } from 'vue'
import { lastAssistantMessageIsCompleteWithApprovalResponses } from 'ai'
import type {
  AiAgentStep,
  AiConfirmationData,
  AiPlanStep,
  AiTaskData,
  AiToolCall,
} from '../types'
import {
  isAiToolApprovalRequested,
  isAiToolComplete,
  isAiToolFailed,
  isAiToolInProgress,
} from '../types'
import { useAiChat, type UseAiChatOptions } from './useAiChat'

export interface UseAiAgentOptions extends UseAiChatOptions {
  onAgentToolCall?: (toolCall: AiToolCall) => void
  onConfirmation?: (confirmation: AiConfirmationData) => Promise<boolean>
}

function toolStepStatus(tc: AiToolCall): AiAgentStep['status'] {
  if (isAiToolComplete(tc.status)) return 'completed'
  if (isAiToolFailed(tc.status)) return 'failed'
  if (isAiToolInProgress(tc.status)) return 'running'
  return 'pending'
}

function toolStepContent(tc: AiToolCall): string {
  if (isAiToolComplete(tc.status) && tc.result != null) {
    return typeof tc.result === 'string' ? tc.result : JSON.stringify(tc.result)
  }
  if (tc.status === 'output-denied') return 'Denied'
  if (isAiToolApprovalRequested(tc.status)) return `Awaiting approval: ${tc.name}`
  return `Calling ${tc.name}`
}

/**
 * Agent execution state on top of {@link useAiChat}.
 * Derives steps, plan, tasks, and human-in-the-loop confirmations from streamed messages.
 */
export function useAiAgent(options?: UseAiAgentOptions) {
  const { onAgentToolCall, onConfirmation, sendAutomaticallyWhen, ...chatOptions } = options ?? {}

  const chat = useAiChat({
    ...chatOptions,
    sendAutomaticallyWhen:
      sendAutomaticallyWhen
      ?? (({ messages }) => lastAssistantMessageIsCompleteWithApprovalResponses({ messages })),
  })

  const steps = ref<AiAgentStep[]>([])
  const plan = ref<AiPlanStep[]>([])
  const tasks = ref<AiTaskData[]>([])
  const pendingConfirmation = ref<AiConfirmationData | null>(null)

  const isRunning = computed(
    () => chat.isStreaming.value || chat.status.value === 'submitted',
  )

  function upsertStep(step: AiAgentStep) {
    const idx = steps.value.findIndex(s => s.id === step.id)
    if (idx >= 0) {
      steps.value.splice(idx, 1, step)
    } else {
      steps.value.push(step)
    }
  }

  watch(
    () => chat.aiMessages.value,
    (messages) => {
      const assistantMessages = messages.filter(m => m.role === 'assistant')

      for (const msg of assistantMessages) {
        const msgKey = (msg.metadata as { id?: string } | undefined)?.id ?? msg.content?.slice(0, 32) ?? 'assistant'

        if (msg.toolCalls?.length) {
          for (const tc of msg.toolCalls) {
            onAgentToolCall?.(tc)

            if (isAiToolApprovalRequested(tc.status) && tc.approvalId) {
              const conf: AiConfirmationData = {
                id: tc.approvalId,
                title: `Approve ${tc.name}?`,
                description: tc.args ? JSON.stringify(tc.args, null, 2) : undefined,
              }
              if (pendingConfirmation.value?.id !== tc.approvalId) {
                pendingConfirmation.value = conf
                if (onConfirmation) {
                  void onConfirmation(conf).then((approved) => {
                    if (approved) approve(tc.approvalId!)
                    else deny(tc.approvalId!)
                  })
                }
              }
            }

            upsertStep({
              id: tc.id,
              type: isAiToolComplete(tc.status) ? 'observation' : 'action',
              content: toolStepContent(tc),
              tool: tc.name,
              status: toolStepStatus(tc),
            })
          }
        }

        if (msg.reasoning) {
          const thoughtId = `thought-${msgKey}`
          upsertStep({
            id: thoughtId,
            type: 'thought',
            content: msg.reasoning,
            status: msg.status === 'streaming' ? 'running' : 'completed',
          })
        }
      }
    },
    { deep: true },
  )

  function setPlan(newPlan: AiPlanStep[]) {
    plan.value = newPlan
  }

  function setTasks(newTasks: AiTaskData[]) {
    tasks.value = newTasks
  }

  function requestConfirmation(confirmation: AiConfirmationData) {
    pendingConfirmation.value = confirmation
    if (onConfirmation) {
      void onConfirmation(confirmation).then((approved) => {
        if (approved) approve(confirmation.id)
        else deny(confirmation.id)
      })
    }
  }

  function approve(id: string) {
    if (pendingConfirmation.value?.id === id) {
      pendingConfirmation.value = null
    }
    if (chat.chat) {
      chat.addToolApprovalResponse({ id, approved: true })
    }
    else if (import.meta.dev) {
      console.warn('[ai-elements] approve() called but no api endpoint is configured — tool approvals are no-ops in local mode. Pass api: \'/api/chat\' to useAiAgent.')
    }
    upsertStep({
      id: `approve-${id}`,
      type: 'result',
      content: 'Approved',
      status: 'completed',
    })
  }

  function deny(id: string, reason?: string) {
    if (pendingConfirmation.value?.id === id) {
      pendingConfirmation.value = null
    }
    if (chat.chat) {
      chat.addToolApprovalResponse({ id, approved: false, reason })
    }
    else if (import.meta.dev) {
      console.warn('[ai-elements] deny() called but no api endpoint is configured — tool approvals are no-ops in local mode. Pass api: \'/api/chat\' to useAiAgent.')
    }
    upsertStep({
      id: `deny-${id}`,
      type: 'result',
      content: reason ? `Denied: ${reason}` : 'Denied',
      status: 'failed',
    })
  }

  function clearAgentState() {
    steps.value = []
    plan.value = []
    tasks.value = []
    pendingConfirmation.value = null
  }

  onScopeDispose(() => {
    clearAgentState()
  })

  return {
    ...chat,
    steps,
    plan,
    tasks,
    pendingConfirmation,
    isRunning,
    setPlan,
    setTasks,
    requestConfirmation,
    approve,
    deny,
    clearAgentState,
  }
}
