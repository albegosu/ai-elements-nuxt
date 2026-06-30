import { ref, computed, onScopeDispose, type Ref, type ComputedRef } from 'vue'
import type { AiRealtimeStatus, AiRealtimeMessage } from '../types/realtime'

export interface UseAiRealtimeOptions {
  /** AI SDK realtime model instance. */
  model: unknown
  /** Auth token for the realtime session. */
  token: string | (() => string | Promise<string>)
  /** Session configuration passed to the realtime model. */
  sessionConfig?: Record<string, unknown>
  /** Audio sample rate (default: 24000). */
  sampleRate?: number
  /** Tool call handler. */
  onToolCall?: (args: { toolCall: { toolCallId: string; toolName: string; args: unknown } }) => Promise<unknown> | unknown
  /** Error handler. */
  onError?: (error: Error) => void
  /** Auto-connect on mount (default: false). */
  autoConnect?: boolean
}

export interface UseAiRealtimeReturn {
  status: Ref<AiRealtimeStatus>
  messages: Ref<AiRealtimeMessage[]>
  isConnected: ComputedRef<boolean>
  isCapturing: Ref<boolean>
  isPlaying: Ref<boolean>
  error: Ref<Error | undefined>
  connect: () => Promise<void>
  disconnect: () => void
  sendText: (text: string) => void
  startCapture: () => Promise<void>
  stopCapture: () => void
  stopPlayback: () => void
}

/**
 * Composable for AI SDK v7 realtime voice/text conversations.
 *
 * Wraps `AbstractRealtimeSession` from the AI SDK with Vue reactivity.
 * Requires a realtime-capable model (e.g. OpenAI Realtime, Google Realtime).
 */
export function useAiRealtime(options: UseAiRealtimeOptions): UseAiRealtimeReturn {
  const status = ref<AiRealtimeStatus>('disconnected')
  const messages = ref<AiRealtimeMessage[]>([])
  const isCapturing = ref(false)
  const isPlaying = ref(false)
  const error = ref<Error | undefined>()

  const isConnected = computed(() => status.value === 'connected')

  let session: {
    connect: () => Promise<void>
    disconnect: () => void
    sendTextMessage: (text: string) => void
    startAudioCapture: (stream: MediaStream) => void
    stopAudioCapture: () => void
    stopPlayback: () => void
    dispose: () => void
  } | null = null

  let mediaStream: MediaStream | null = null

  async function resolveToken(): Promise<string> {
    if (typeof options.token === 'function') {
      return await options.token()
    }
    return options.token
  }

  async function connect() {
    if (session) return

    try {
      status.value = 'connecting'
      error.value = undefined

      const ai = await import('ai')
      const RealtimeSession = (ai as Record<string, unknown>).RealtimeSession as new (opts: Record<string, unknown>) => typeof session & {
        state: { status: AiRealtimeStatus; messages: unknown[]; isCapturing: boolean; isPlaying: boolean }
      }

      if (!RealtimeSession) {
        throw new Error('RealtimeSession not available — ensure ai@^7.0.0 is installed')
      }

      const token = await resolveToken()

      session = new RealtimeSession({
        model: options.model,
        api: { token },
        sessionConfig: options.sessionConfig,
        sampleRate: options.sampleRate ?? 24000,
        onToolCall: options.onToolCall,
        onError: (err: Error) => {
          error.value = err
          status.value = 'error'
          options.onError?.(err)
        },
      })

      await session!.connect()
      status.value = 'connected'
    }
    catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      status.value = 'error'
      session = null
    }
  }

  function disconnect() {
    if (mediaStream) {
      mediaStream.getTracks().forEach(t => t.stop())
      mediaStream = null
    }
    session?.disconnect()
    session?.dispose()
    session = null
    status.value = 'disconnected'
    isCapturing.value = false
    isPlaying.value = false
  }

  function sendText(text: string) {
    if (!session) return
    session.sendTextMessage(text)
    messages.value = [
      ...messages.value,
      {
        id: `user-${Date.now()}`,
        role: 'user',
        content: text,
        timestamp: new Date(),
      },
    ]
  }

  async function startCapture() {
    if (!session) return

    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      session.startAudioCapture(mediaStream)
      isCapturing.value = true
    }
    catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
    }
  }

  function stopCapture() {
    if (mediaStream) {
      mediaStream.getTracks().forEach(t => t.stop())
      mediaStream = null
    }
    session?.stopAudioCapture()
    isCapturing.value = false
  }

  function stopPlayback() {
    session?.stopPlayback()
    isPlaying.value = false
  }

  if (options.autoConnect) {
    void connect()
  }

  onScopeDispose(() => {
    disconnect()
  })

  return {
    status,
    messages,
    isConnected,
    isCapturing,
    isPlaying,
    error,
    connect,
    disconnect,
    sendText,
    startCapture,
    stopCapture,
    stopPlayback,
  }
}
