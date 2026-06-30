<script setup lang="ts">
import { ref, computed } from 'vue'
import type { AiRealtimeStatus } from '../../types/realtime'

const props = withDefaults(defineProps<{
  status: AiRealtimeStatus
  messages?: Array<{ id: string; role: string; content: string }>
  isCapturing?: boolean
  isPlaying?: boolean
  title?: string
}>(), {
  messages: () => [],
  isCapturing: false,
  isPlaying: false,
})

const emit = defineEmits<{
  (e: 'connect'): void
  (e: 'disconnect'): void
  (e: 'send', text: string): void
  (e: 'start-capture'): void
  (e: 'stop-capture'): void
  (e: 'stop-playback'): void
}>()

const input = ref('')

const isConnected = computed(() => props.status === 'connected')
const isConnecting = computed(() => props.status === 'connecting')
const hasError = computed(() => props.status === 'error')

function handleSend() {
  const text = input.value.trim()
  if (!text) return
  emit('send', text)
  input.value = ''
}

function toggleCapture() {
  if (props.isCapturing) {
    emit('stop-capture')
  }
  else {
    emit('start-capture')
  }
}
</script>

<template>
  <div
    data-ai-realtime-chat
    :data-status="status"
    :data-capturing="isCapturing || undefined"
    :data-playing="isPlaying || undefined"
    role="region"
    :aria-label="title ?? 'Realtime chat'"
  >
    <slot
      :status="status"
      :messages="messages"
      :is-connected="isConnected"
      :is-capturing="isCapturing"
      :is-playing="isPlaying"
      :input="input"
      :send="handleSend"
      :toggle-capture="toggleCapture"
    >
      <slot name="header" :status="status" :is-connected="isConnected">
        <div data-ai-realtime-header>
          <slot name="title">
            <span data-ai-realtime-title>{{ title ?? 'Voice Chat' }}</span>
          </slot>
          <slot name="status-indicator" :status="status">
            <span data-ai-realtime-status :data-status="status">
              {{ status }}
            </span>
          </slot>
        </div>
      </slot>

      <slot name="messages" :messages="messages">
        <div data-ai-realtime-messages role="log" aria-label="Conversation">
          <div
            v-for="msg in messages"
            :key="msg.id"
            data-ai-realtime-message
            :data-role="msg.role"
          >
            <slot name="message" :message="msg">
              {{ msg.content }}
            </slot>
          </div>
        </div>
      </slot>

      <slot name="controls" :status="status" :is-capturing="isCapturing" :is-playing="isPlaying" :toggle-capture="toggleCapture">
        <div data-ai-realtime-controls>
          <template v-if="!isConnected">
            <slot name="connect-button" :is-connecting="isConnecting" :has-error="hasError">
              <button
                type="button"
                data-ai-realtime-connect
                :disabled="isConnecting"
                @click="$emit('connect')"
              >
                {{ isConnecting ? 'Connecting...' : 'Connect' }}
              </button>
            </slot>
          </template>

          <template v-else>
            <slot name="capture-button" :is-capturing="isCapturing" :toggle-capture="toggleCapture">
              <button
                type="button"
                data-ai-realtime-capture
                :data-active="isCapturing || undefined"
                :aria-pressed="isCapturing"
                @click="toggleCapture"
              >
                {{ isCapturing ? 'Stop' : 'Speak' }}
              </button>
            </slot>

            <slot name="text-input" :input="input" :send="handleSend">
              <form data-ai-realtime-input-form @submit.prevent="handleSend">
                <input
                  v-model="input"
                  type="text"
                  data-ai-realtime-input
                  placeholder="Type a message..."
                  :disabled="!isConnected"
                >
                <button type="submit" data-ai-realtime-send :disabled="!input.trim()">
                  Send
                </button>
              </form>
            </slot>

            <slot name="disconnect-button">
              <button
                type="button"
                data-ai-realtime-disconnect
                @click="$emit('disconnect')"
              >
                Disconnect
              </button>
            </slot>
          </template>
        </div>
      </slot>
    </slot>
  </div>
</template>
