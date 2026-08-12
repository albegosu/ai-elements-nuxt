<script setup lang="ts">
import { ref } from 'vue'

const input = ref('')

function appendTranscript(transcript: string, isFinal: boolean) {
  if (isFinal) input.value += (input.value ? ' ' : '') + transcript
}
</script>

<template>
  <div class="w-full max-w-md">
    <div class="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-900">
      <AiSpeechButton @result="appendTranscript">
        <template #default="{ toggle, isListening, isSupported }">
          <button
            type="button"
            :disabled="!isSupported"
            class="flex size-9 items-center justify-center rounded-lg hover:bg-zinc-100 disabled:opacity-40 dark:hover:bg-zinc-800"
            :class="isListening ? 'text-red-500' : 'text-zinc-500'"
            :aria-label="isListening ? 'Stop dictation' : 'Start dictation'"
            @click="toggle"
          >
            <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
            </svg>
          </button>
        </template>
      </AiSpeechButton>
      <input
        v-model="input"
        type="text"
        placeholder="Dictate or type…"
        class="flex-1 bg-transparent text-sm text-zinc-800 outline-none placeholder:text-zinc-400 dark:text-zinc-200"
      >
    </div>
    <p class="mt-2 text-xs text-zinc-400">Uses the browser Web Speech API (Chrome/Safari).</p>
  </div>
</template>
