<script setup lang="ts">
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

const isListening = ref(false)
const transcript = ref('')
const interimTranscript = ref('')
const isSupported = ref(false)
let recognition: SpeechRecognition | null = null

function applyRecognitionSettings() {
  if (!recognition) return
  recognition.lang = props.language
  recognition.continuous = props.continuous
  recognition.interimResults = props.interimResults
}

onMounted(() => {
  const SpeechRecognitionCtor =
    typeof window !== 'undefined'
      ? window.SpeechRecognition ?? window.webkitSpeechRecognition
      : undefined
  isSupported.value = !!SpeechRecognitionCtor

  if (SpeechRecognitionCtor) {
    recognition = new SpeechRecognitionCtor()
    applyRecognitionSettings()

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = ''
      let final = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          final += t
        } else {
          interim += t
        }
      }
      if (final) {
        transcript.value += final
        emit('result', final, true)
      }
      interimTranscript.value = interim
      if (interim) emit('result', interim, false)
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      emit('error', event.error)
      isListening.value = false
    }

    recognition.onend = () => {
      isListening.value = false
      emit('stop')
    }
  }
})

watch(
  () => [props.language, props.continuous, props.interimResults] as const,
  () => applyRecognitionSettings(),
)

onUnmounted(() => {
  if (recognition && isListening.value) {
    recognition.stop()
  }
  recognition = null
})

function start() {
  if (!recognition || isListening.value) return
  transcript.value = ''
  interimTranscript.value = ''
  try {
    recognition.start()
    isListening.value = true
    emit('start')
  } catch {
    isListening.value = false
  }
}

function stop() {
  if (!recognition || !isListening.value) return
  recognition.stop()
  isListening.value = false
}

function toggle() {
  if (isListening.value) stop()
  else start()
}

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
          @click="toggle"
          :disabled="!isSupported"
          :aria-label="isListening ? 'Stop listening' : 'Start listening'"
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
