<script setup lang="ts">
import { ref } from 'vue'
import type { AiRealtimeMessage } from '../../../../src/runtime/types/realtime'

const status = ref<'disconnected' | 'connecting' | 'connected'>('connected')
const isCapturing = ref(false)
const messages = ref<AiRealtimeMessage[]>([
  { id: '1', role: 'user', content: 'What is the weather today?' },
  { id: '2', role: 'assistant', content: 'It looks like a sunny day with temperatures around 24C.' },
])

function toggleCapture() {
  isCapturing.value = !isCapturing.value
}
</script>

<template>
  <AiRealtimeChat
    :status="status"
    :messages="messages"
    :is-capturing="isCapturing"
    @connect="status = 'connected'"
    @disconnect="status = 'disconnected'"
    @toggle-capture="toggleCapture"
  />
</template>
