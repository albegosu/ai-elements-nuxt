<template>
  <AiSpeechInput>
    <template #default="{ toggle, isListening, isSupported }">
      <div class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <div class="flex flex-col items-center gap-3">
          <button
            type="button"
            class="flex h-14 w-14 items-center justify-center rounded-full border transition-colors"
            :class="isListening
              ? 'border-red-200 bg-red-50 text-red-500 dark:border-red-800 dark:bg-red-950 dark:text-red-400'
              : 'border-zinc-200 bg-zinc-50 text-zinc-500 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'"
            :disabled="!isSupported"
            @click="toggle"
          >
            <svg v-if="!isListening" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
            </svg>
            <svg v-else class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z" />
            </svg>
          </button>

          <div class="flex items-center gap-2">
            <span
              v-if="isListening"
              class="h-2 w-2 animate-pulse rounded-full bg-red-500"
            />
            <span class="text-sm text-zinc-500 dark:text-zinc-400">
              {{ isListening ? 'Listening…' : 'Press to speak' }}
            </span>
          </div>

          <span
            v-if="!isSupported"
            class="text-xs text-zinc-400 dark:text-zinc-500"
          >Speech recognition not supported</span>
        </div>
      </div>
    </template>
  </AiSpeechInput>
</template>
