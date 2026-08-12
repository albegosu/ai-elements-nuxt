import { onMounted, onUnmounted, ref, unref, watch, type MaybeRef } from 'vue'

export interface UseSpeechRecognitionOptions {
  lang?: MaybeRef<string>
  continuous?: MaybeRef<boolean>
  interimResults?: MaybeRef<boolean>
  onResult?: (transcript: string, isFinal: boolean) => void
  onStart?: () => void
  onStop?: () => void
  onError?: (error: string) => void
}

/**
 * Vue wrapper around the Web Speech `SpeechRecognition` API. Shared by
 * {@link AiSpeechInput} and {@link AiSpeechButton}. SSR-safe: the recognizer is
 * created on mount (client only).
 */
export function useSpeechRecognition(options: UseSpeechRecognitionOptions = {}) {
  const isListening = ref(false)
  const transcript = ref('')
  const interimTranscript = ref('')
  const isSupported = ref(false)
  let recognition: SpeechRecognition | null = null

  function applySettings() {
    if (!recognition) return
    recognition.lang = unref(options.lang) ?? 'en-US'
    recognition.continuous = unref(options.continuous) ?? false
    recognition.interimResults = unref(options.interimResults) ?? true
  }

  onMounted(() => {
    const Ctor = typeof window !== 'undefined'
      ? window.SpeechRecognition ?? window.webkitSpeechRecognition
      : undefined
    isSupported.value = !!Ctor
    if (!Ctor) return

    recognition = new Ctor()
    applySettings()

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = ''
      let final = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript
        if (event.results[i].isFinal) final += t
        else interim += t
      }
      if (final) {
        transcript.value += final
        options.onResult?.(final, true)
      }
      interimTranscript.value = interim
      if (interim) options.onResult?.(interim, false)
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      options.onError?.(event.error)
      isListening.value = false
    }

    recognition.onend = () => {
      isListening.value = false
      options.onStop?.()
    }
  })

  watch(
    () => [unref(options.lang), unref(options.continuous), unref(options.interimResults)] as const,
    () => applySettings(),
  )

  onUnmounted(() => {
    if (recognition && isListening.value) recognition.stop()
    recognition = null
  })

  function start() {
    if (!recognition || isListening.value) return
    transcript.value = ''
    interimTranscript.value = ''
    try {
      recognition.start()
      isListening.value = true
      options.onStart?.()
    }
    catch {
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

  return { isListening, transcript, interimTranscript, isSupported, start, stop, toggle }
}
