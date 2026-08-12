<script setup lang="ts">
import { toRef } from 'vue'
import { useSpeechRecognition } from '../../composables/useSpeechRecognition'

const props = withDefaults(defineProps<{
  language?: string
  continuous?: boolean
  interimResults?: boolean
}>(), {
  language: 'en-US',
  continuous: false,
  interimResults: true,
})

const emit = defineEmits<{
  (e: 'result', transcript: string, isFinal: boolean): void
  (e: 'start'): void
  (e: 'stop'): void
  (e: 'error', error: string): void
}>()

const {
  isListening,
  transcript,
  interimTranscript,
  isSupported,
  start,
  stop,
  toggle,
} = useSpeechRecognition({
  lang: toRef(props, 'language'),
  continuous: toRef(props, 'continuous'),
  interimResults: toRef(props, 'interimResults'),
  onResult: (t, isFinal) => emit('result', t, isFinal),
  onStart: () => emit('start'),
  onStop: () => emit('stop'),
  onError: e => emit('error', e),
})

defineExpose({ start, stop, toggle })
</script>

<template>
  <div
    data-ai-speech-input
    :data-listening="isListening || undefined"
    :data-supported="isSupported || undefined"
  >
    <slot
      :is-listening="isListening"
      :is-supported="isSupported"
      :transcript="transcript"
      :interim-transcript="interimTranscript"
      :toggle="toggle"
      :start="start"
      :stop="stop"
    >
      <slot name="button" :is-listening="isListening" :toggle="toggle" :is-supported="isSupported">
        <button
          type="button"
          :disabled="!isSupported"
          :aria-label="isListening ? 'Stop listening' : 'Start listening'"
          @click="toggle"
        >
          {{ isListening ? '⏹ Stop' : '🎤 Speak' }}
        </button>
      </slot>

      <slot name="transcript" :transcript="transcript" :interim="interimTranscript" :is-listening="isListening">
        <div v-if="transcript || interimTranscript" data-ai-speech-transcript>
          <span>{{ transcript }}</span>
          <span v-if="interimTranscript" data-ai-speech-interim>{{ interimTranscript }}</span>
        </div>
      </slot>

      <slot name="unsupported" v-if="!isSupported">
        <div data-ai-speech-unsupported>Speech recognition is not supported in this browser.</div>
      </slot>
    </slot>
  </div>
</template>
