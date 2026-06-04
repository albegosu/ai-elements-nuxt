import { ref, computed } from 'vue'
import type { AiMessageProps, AiSuggestion } from '../types'

/**
 * Local-only chat state (no AI SDK). Useful for demos and custom backends.
 * API surface matches {@link useAiChat} when `api` is omitted.
 */
export function useAiChatLocal(options?: {
  initialMessages?: AiMessageProps[]
  suggestions?: AiSuggestion[]
}) {
  const messages = ref<AiMessageProps[]>(options?.initialMessages ?? [])
  const suggestions = ref<AiSuggestion[]>(options?.suggestions ?? [])
  const isStreaming = ref(false)
  const input = ref('')
  const status = ref<'ready' | 'submitted' | 'streaming' | 'error'>('ready')
  const error = ref<Error | undefined>(undefined)

  const aiMessages = computed(() => messages.value)

  function addMessage(message: AiMessageProps) {
    messages.value.push(message)
  }

  function clearMessages() {
    messages.value = []
  }

  function setSuggestions(newSuggestions: AiSuggestion[]) {
    suggestions.value = newSuggestions
  }

  function handleSubmit(event?: { preventDefault?: () => void }) {
    event?.preventDefault?.()
    const text = input.value.trim()
    if (!text) return
    addMessage({ role: 'user', content: text, status: 'complete' })
    input.value = ''
  }

  function sendMessage(text: string) {
    const trimmed = text.trim()
    if (!trimmed) return
    addMessage({ role: 'user', content: trimmed, status: 'complete' })
  }

  function stop() {
    isStreaming.value = false
    status.value = 'ready'
  }

  function regenerate() {
    // no-op for local-only state
  }

  function clearError() {
    error.value = undefined
    if (status.value === 'error') {
      status.value = 'ready'
    }
  }

  async function addToolApprovalResponse(_params: {
    id: string
    approved: boolean
    reason?: string
  }) {}

  async function addToolOutput(_params: {
    tool: string
    toolCallId: string
    output?: unknown
    errorText?: string
    state?: 'output-available' | 'output-error'
  }) {}

  async function resumeStream(_opts?: unknown) {}

  return {
    chat: undefined,
    messages,
    aiMessages,
    input,
    status,
    error,
    isStreaming,
    suggestions,
    handleSubmit,
    sendMessage,
    stop,
    setSuggestions,
    regenerate,
    clearError,
    addToolApprovalResponse,
    addToolOutput,
    resumeStream,
    addMessage,
    clearMessages,
  }
}

export type UseAiChatLocalReturn = ReturnType<typeof useAiChatLocal>
