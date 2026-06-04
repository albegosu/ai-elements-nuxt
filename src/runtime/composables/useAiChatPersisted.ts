import { watch, onMounted, onScopeDispose, ref, type Ref } from 'vue'
import { useAiChat, type UseAiChatOptions, type UseAiChatSdkReturn } from './useAiChat'
import { useAiChatLocal, type UseAiChatLocalReturn } from './useAiChatLocal'
import type { AiMessageProps } from '../types'

export type UseAiChatPersistedLocalReturn = UseAiChatLocalReturn & {
  clearHistory: () => void
  restore: () => Promise<void>
  restored: Ref<boolean>
}

export type UseAiChatPersistedApiReturn = UseAiChatSdkReturn & {
  clearHistory: () => void
  restore: () => Promise<void>
}

export type AiChatStorage = 'localStorage' | 'sessionStorage' | 'custom'

export interface UseAiChatPersistedOptions extends UseAiChatOptions {
  /** Storage key */
  key?: string
  storage?: AiChatStorage
  /** Custom read/write when storage is 'custom' */
  load?: () => AiMessageProps[] | Promise<AiMessageProps[]>
  save?: (messages: AiMessageProps[]) => void | Promise<void>
  debounceMs?: number
}

function getStorage(type: AiChatStorage): Storage | null {
  if (typeof window === 'undefined') return null
  if (type === 'localStorage') return window.localStorage
  if (type === 'sessionStorage') return window.sessionStorage
  return null
}

function isValidMessageList(data: unknown): data is AiMessageProps[] {
  if (!Array.isArray(data)) return false
  return data.every(
    m =>
      m != null
      && typeof m === 'object'
      && 'role' in m
      && typeof (m as AiMessageProps).role === 'string',
  )
}

/**
 * {@link useAiChat} with optional message persistence (local-only, no `api`).
 */
export function useAiChatPersisted(
  options: UseAiChatPersistedOptions & { api: string },
): UseAiChatPersistedApiReturn
export function useAiChatPersisted(
  options?: UseAiChatPersistedOptions,
): UseAiChatPersistedLocalReturn
export function useAiChatPersisted(
  options?: UseAiChatPersistedOptions,
): UseAiChatPersistedApiReturn | UseAiChatPersistedLocalReturn {
  const {
    key = 'ai-elements-chat',
    storage = 'localStorage',
    load,
    save,
    debounceMs = 300,
    api,
    ...chatOptions
  } = options ?? {}

  if (api) {
    return {
      ...useAiChat({ api, ...chatOptions }),
      clearHistory: () => {},
      restore: async () => {},
    }
  }

  const chat = useAiChatLocal({
    initialMessages: chatOptions.initialMessages,
    suggestions: chatOptions.suggestions,
  })

  const restored = ref(false)
  let debounceTimer: ReturnType<typeof setTimeout> | undefined

  async function restore() {
    try {
      let raw: AiMessageProps[] | undefined
      if (storage === 'custom' && load) {
        raw = await load()
      } else {
        const store = getStorage(storage)
        const item = store?.getItem(key)
        if (item) {
          const parsed: unknown = JSON.parse(item)
          if (isValidMessageList(parsed)) raw = parsed
        }
      }
      if (raw?.length) {
        chat.messages.value = raw
      }
    } catch {
      // ignore corrupt storage
    } finally {
      restored.value = true
    }
  }

  function persist(messages: AiMessageProps[]) {
    try {
      if (storage === 'custom' && save) {
        void save(messages)
        return
      }
      const store = getStorage(storage)
      store?.setItem(key, JSON.stringify(messages))
    } catch {
      // quota exceeded, etc.
    }
  }

  onMounted(() => {
    void restore()
  })

  watch(
    () => chat.messages.value,
    (messages) => {
      if (!restored.value) return
      clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => {
        persist(messages)
      }, debounceMs)
    },
    { deep: true },
  )

  onScopeDispose(() => {
    clearTimeout(debounceTimer)
  })

  function clearHistory() {
    chat.clearMessages()
    try {
      if (storage === 'custom' && save) {
        void save([])
        return
      }
      getStorage(storage)?.removeItem(key)
    } catch {
      // ignore storage errors
    }
  }

  return {
    ...chat,
    clearHistory,
    restore,
    restored,
  }
}
