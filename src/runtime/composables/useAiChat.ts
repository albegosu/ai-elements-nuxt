import { ref, computed, onScopeDispose, type ComputedRef, type Ref } from 'vue'
import { Chat } from '@ai-sdk/vue'
import {
  DefaultChatTransport,
  type ChatInit,
  type UIMessage,
} from 'ai'
import { toAiMessageProps } from '../utils/mapMessageParts'
import type { AiMessageProps, AiSuggestion } from '../types'
import { useAiChatLocal, type UseAiChatLocalReturn } from './useAiChatLocal'

/** Value, promise, or getter — matches AI SDK `DefaultChatTransport` resolvables. */
type AiChatResolvable<T> = T | Promise<T> | (() => T | Promise<T>)

export interface UseAiChatOptions extends Omit<ChatInit<UIMessage>, 'transport'> {
  /** API route for chat (e.g. `/api/chat`). When omitted, uses local-only state. */
  api?: string
  /** Extra JSON sent with each chat request (object or `() => ({ ... })` for dynamic fields). */
  body?: AiChatResolvable<object>
  /** HTTP headers sent with each chat request. */
  headers?: AiChatResolvable<Record<string, string> | Headers>
  /** Fetch credentials mode for the chat API. */
  credentials?: AiChatResolvable<RequestCredentials>
  suggestions?: AiSuggestion[]
  /** Initial messages for local-only mode (no `api`) */
  initialMessages?: AiMessageProps[]
}

export type UseAiChatSdkReturn = {
  chat: Chat<UIMessage>
  messages: ComputedRef<UIMessage[]>
  aiMessages: ComputedRef<AiMessageProps[]>
  input: Ref<string>
  status: ComputedRef<Chat<UIMessage>['status']>
  error: ComputedRef<Error | undefined>
  isStreaming: ComputedRef<boolean>
  suggestions: Ref<AiSuggestion[]>
  handleSubmit: () => void
  sendMessage: (text: string) => ReturnType<Chat<UIMessage>['sendMessage']>
  stop: () => ReturnType<Chat<UIMessage>['stop']>
  setSuggestions: (newSuggestions: AiSuggestion[]) => void
  regenerate: (opts?: { messageId?: string }) => ReturnType<Chat<UIMessage>['regenerate']>
  clearError: () => void
  addToolApprovalResponse: (params: {
    id: string
    approved: boolean
    reason?: string
  }) => ReturnType<Chat<UIMessage>['addToolApprovalResponse']>
  addToolOutput: (params: {
    tool: string
    toolCallId: string
    output?: unknown
    errorText?: string
    state?: 'output-available' | 'output-error'
  }) => ReturnType<Chat<UIMessage>['addToolOutput']>
  resumeStream: (opts?: Parameters<Chat<UIMessage>['resumeStream']>[0]) => ReturnType<Chat<UIMessage>['resumeStream']>
}

/**
 * Chat composable for Nuxt/Vue AI apps.
 * With `api`, wraps `@ai-sdk/vue` `Chat` + `DefaultChatTransport` and exposes `aiMessages`.
 * Without `api`, falls back to {@link useAiChatLocal}.
 */
export function useAiChat(options: UseAiChatOptions & { api: string }): UseAiChatSdkReturn
export function useAiChat(options?: UseAiChatOptions): UseAiChatLocalReturn
export function useAiChat(
  options?: UseAiChatOptions,
): UseAiChatSdkReturn | UseAiChatLocalReturn {
  if (!options?.api) {
    return useAiChatLocal({
      initialMessages: options?.initialMessages,
      suggestions: options?.suggestions,
    })
  }

  const {
    api,
    suggestions: initialSuggestions,
    body,
    headers,
    credentials,
    ...chatInit
  } = options

  let chat: Chat<UIMessage>
  const initError = ref<Error | undefined>(undefined)

  try {
    chat = new Chat({
      transport: new DefaultChatTransport({ api, body, headers, credentials }),
      ...chatInit,
    })
  } catch (err) {
    initError.value = err instanceof Error ? err : new Error(String(err))
    return {
      chat: undefined,
      messages: computed(() => [] as UIMessage[]),
      aiMessages: computed(() => [] as AiMessageProps[]),
      input: ref(''),
      status: computed(() => 'error' as const),
      error: initError,
      isStreaming: computed(() => false),
      suggestions: ref<AiSuggestion[]>(initialSuggestions ?? []),
      handleSubmit: () => {},
      sendMessage: async () => {},
      stop: async () => {},
      setSuggestions: () => {},
      regenerate: async () => {},
      clearError: () => { initError.value = undefined },
      addToolApprovalResponse: async () => {},
      addToolOutput: async () => {},
      resumeStream: async () => {},
    } as unknown as UseAiChatSdkReturn
  }

  const input = ref('')
  const suggestions = ref<AiSuggestion[]>(initialSuggestions ?? [])

  const messages = computed(() => chat.messages)

  const aiMessages = computed(() =>
    messages.value.map((msg: UIMessage, i: number) => {
      const isLast = i === messages.value.length - 1
      const status: AiMessageProps['status'] =
        isLast && (chat.status === 'streaming' || chat.status === 'submitted')
          ? 'streaming'
          : chat.status === 'error' && isLast
            ? 'error'
            : 'complete'
      return toAiMessageProps(msg, status)
    }),
  )

  const status = computed(() => chat.status)
  const error = computed(() => chat.error ?? initError.value)
  const isStreaming = computed(() => status.value === 'streaming' || status.value === 'submitted')

  onScopeDispose(() => {
    void chat.stop()
  })

  function handleSubmit(event?: { preventDefault?: () => void }) {
    event?.preventDefault?.()
    const text = input.value.trim()
    if (!text) return
    chat.sendMessage({ text })
    input.value = ''
  }

  function sendMessage(text: string) {
    return chat.sendMessage({ text })
  }

  function stop() {
    return chat.stop()
  }

  function setSuggestions(newSuggestions: AiSuggestion[]) {
    suggestions.value = newSuggestions
  }

  function addToolApprovalResponse(params: {
    id: string
    approved: boolean
    reason?: string
  }) {
    return chat.addToolApprovalResponse(params)
  }

  function addToolOutput(
    params: {
      tool: string
      toolCallId: string
      output?: unknown
      errorText?: string
      state?: 'output-available' | 'output-error'
    },
  ) {
    return chat.addToolOutput(params as Parameters<Chat<UIMessage>['addToolOutput']>[0])
  }

  function resumeStream(opts?: Parameters<Chat<UIMessage>['resumeStream']>[0]) {
    return chat.resumeStream(opts)
  }

  return {
    chat,
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
    regenerate: (opts?: { messageId?: string }) => chat.regenerate(opts),
    clearError: () => {
      const msgs = chat.messages
      if (
        chat.status === 'error'
        && msgs.length > 0
        && msgs[msgs.length - 1].role === 'assistant'
      ) {
        ;(chat as unknown as { setMessages?: (m: UIMessage[]) => void }).setMessages?.(msgs.slice(0, -1))
      }
      chat.clearError()
    },
    addToolApprovalResponse,
    addToolOutput,
    resumeStream,
  } as UseAiChatSdkReturn
}
