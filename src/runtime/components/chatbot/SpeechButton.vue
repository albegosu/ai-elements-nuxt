<script setup lang="ts">
import { toRef } from 'vue'
import { useSpeechRecognition } from '../../composables/useSpeechRecognition'

const props = withDefaults(defineProps<{
  language?: string
  continuous?: boolean
  interimResults?: boolean
  disabled?: boolean
}>(), {
  language: 'en-US',
  continuous: false,
  interimResults: true,
  disabled: false,
})

const emit = defineEmits<{
  (e: 'result', transcript: string, isFinal: boolean): void
  (e: 'start'): void
  (e: 'stop'): void
  (e: 'error', error: string): void
}>()

const { isListening, isSupported, toggle } = useSpeechRecognition({
  lang: toRef(props, 'language'),
  continuous: toRef(props, 'continuous'),
  interimResults: toRef(props, 'interimResults'),
  onResult: (t, isFinal) => emit('result', t, isFinal),
  onStart: () => emit('start'),
  onStop: () => emit('stop'),
  onError: e => emit('error', e),
})

defineExpose({ toggle, isListening, isSupported })
</script>

<template>
  <div data-ai-speech-button style="display: contents">
    <slot :is-listening="isListening" :is-supported="isSupported" :toggle="toggle" :disabled="disabled">
      <button
        type="button"
        :disabled="disabled || !isSupported"
        :data-listening="isListening || undefined"
        :aria-label="isListening ? 'Stop dictation' : 'Start dictation'"
        @click="toggle"
      >
        <slot name="icon" :is-listening="isListening">{{ isListening ? '⏹' : '🎤' }}</slot>
      </button>
    </slot>
  </div>
</template>
