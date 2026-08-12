<script setup lang="ts">
import { ref } from 'vue'
import type { AiScreenshotCapture } from '../../../../src/runtime/types'

const preview = ref<string | null>(null)
const message = ref('')

function onCapture(payload: AiScreenshotCapture) {
  preview.value = payload.dataUrl
  message.value = `Attached ${payload.file.name}`
}

function onError() {
  message.value = 'Capture cancelled or unsupported.'
}
</script>

<template>
  <div class="w-full max-w-md space-y-3">
    <div class="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-900">
      <AiScreenshotButton @capture="onCapture" @error="onError">
        <template #default="{ capture, capturing }">
          <button
            type="button"
            :disabled="capturing"
            class="flex size-9 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 disabled:opacity-50 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            aria-label="Attach screenshot"
            @click="capture"
          >
            <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
            </svg>
          </button>
        </template>
      </AiScreenshotButton>
      <input
        v-model="message"
        type="text"
        placeholder="Message with a screenshot…"
        class="flex-1 bg-transparent text-sm text-zinc-800 outline-none placeholder:text-zinc-400 dark:text-zinc-200"
      >
    </div>

    <img
      v-if="preview"
      :src="preview"
      alt="Captured screenshot"
      class="max-h-48 w-auto rounded-lg border border-zinc-200 dark:border-zinc-800"
    >
  </div>
</template>
