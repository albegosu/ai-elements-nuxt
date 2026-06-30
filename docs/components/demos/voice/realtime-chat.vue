<script setup lang="ts">
import { ref } from 'vue'
import type { AiRealtimeMessage, AiRealtimeStatus } from '../../../../src/runtime/types/realtime'

const status = ref<AiRealtimeStatus>('connected')
const isCapturing = ref(false)
const messages = ref<AiRealtimeMessage[]>([
  { id: '1', role: 'user', content: 'What is the weather today?' },
  { id: '2', role: 'assistant', content: 'It looks like a sunny day with temperatures around 24°C.' },
])

const statusLabel: Record<AiRealtimeStatus, string> = {
  disconnected: 'Disconnected',
  connecting: 'Connecting…',
  connected: 'Connected',
  error: 'Error',
}

const statusColor: Record<AiRealtimeStatus, string> = {
  disconnected: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
  connecting: 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400',
  connected: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400',
  error: 'bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400',
}
</script>

<template>
  <div
    class="realtime-chat-demo mx-auto max-w-md overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
  >
    <AiRealtimeChat
      :status="status"
      :messages="messages"
      :is-capturing="isCapturing"
      @connect="status = 'connected'"
      @disconnect="status = 'disconnected'"
      @start-capture="isCapturing = true"
      @stop-capture="isCapturing = false"
    >
      <template #header="{ status: connectionStatus }">
        <div class="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
          <div class="flex items-center gap-2">
            <div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
              </svg>
            </div>
            <span class="text-sm font-medium text-zinc-900 dark:text-zinc-100">Voice Chat</span>
          </div>
          <span
            class="rounded-md px-2 py-0.5 text-xs font-medium"
            :class="statusColor[connectionStatus]"
          >
            {{ statusLabel[connectionStatus] }}
          </span>
        </div>
      </template>

      <template #messages="{ messages: thread }">
        <div
          class="flex min-h-[180px] flex-col gap-3 overflow-y-auto px-4 py-4"
          role="log"
          aria-label="Conversation"
        >
          <div
            v-for="msg in thread"
            :key="msg.id"
            class="flex"
            :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
          >
            <p
              class="max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed"
              :class="msg.role === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'"
            >
              {{ msg.content }}
            </p>
          </div>
        </div>
      </template>

      <template #capture-button="{ isCapturing: capturing, toggleCapture }">
        <button
          type="button"
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors"
          :class="capturing
            ? 'border-red-200 bg-red-50 text-red-500 dark:border-red-800 dark:bg-red-950 dark:text-red-400'
            : 'border-zinc-200 bg-zinc-50 text-zinc-500 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'"
          :aria-pressed="capturing"
          @click="toggleCapture"
        >
          <svg v-if="!capturing" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
          </svg>
          <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z" />
          </svg>
        </button>
      </template>

      <template #disconnect-button>
        <button
          type="button"
          class="shrink-0 rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
          @click="status = 'disconnected'; isCapturing = false"
        >
          Disconnect
        </button>
      </template>
    </AiRealtimeChat>

    <p
      v-if="isCapturing"
      class="flex items-center justify-center gap-2 border-t border-zinc-200 py-2 text-xs text-red-500 dark:border-zinc-800 dark:text-red-400"
    >
      <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
      Listening…
    </p>
  </div>
</template>

<style scoped>
.realtime-chat-demo :deep([data-ai-realtime-controls]) {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-top: 1px solid var(--tw-border-opacity, 1) rgb(228 228 231);
  padding: 0.75rem 1rem;
}

:where(.dark) .realtime-chat-demo :deep([data-ai-realtime-controls]) {
  border-top-color: rgb(39 39 42);
}

.realtime-chat-demo :deep([data-ai-realtime-input-form]) {
  display: flex;
  min-width: 0;
  flex: 1;
  align-items: center;
  gap: 0.5rem;
}

.realtime-chat-demo :deep([data-ai-realtime-input]) {
  min-width: 0;
  flex: 1;
  border-radius: 0.5rem;
  border: 1px solid rgb(228 228 231);
  background: white;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  color: rgb(24 24 27);
}

.realtime-chat-demo :deep([data-ai-realtime-input]:focus) {
  border-color: rgb(59 130 246);
  outline: none;
  box-shadow: 0 0 0 1px rgb(59 130 246);
}

:where(.dark) .realtime-chat-demo :deep([data-ai-realtime-input]) {
  border-color: rgb(63 63 70);
  background: rgb(24 24 27);
  color: rgb(244 244 245);
}

.realtime-chat-demo :deep([data-ai-realtime-send]) {
  flex-shrink: 0;
  border-radius: 0.5rem;
  background: rgb(24 24 27);
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
}

.realtime-chat-demo :deep([data-ai-realtime-send]:disabled) {
  opacity: 0.4;
}

:where(.dark) .realtime-chat-demo :deep([data-ai-realtime-send]) {
  background: rgb(244 244 245);
  color: rgb(24 24 27);
}

.realtime-chat-demo :deep([data-ai-realtime-connect]) {
  width: 100%;
  border-radius: 0.5rem;
  background: rgb(37 99 235);
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
}

.realtime-chat-demo :deep([data-ai-realtime-connect]:disabled) {
  opacity: 0.5;
}
</style>
