<template>
  <AiAudioPlayer src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" title="Research Briefing — Episode 12">
    <template #default="{ toggle, isPlaying, progress, currentTime, duration }">
      <div class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <div class="flex items-center gap-4">
          <button
            type="button"
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
            @click="toggle"
          >
            <svg v-if="!isPlaying" class="ml-0.5 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
            </svg>
            <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
            </svg>
          </button>

          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium text-zinc-700 dark:text-zinc-300">Research Briefing — Episode 12</p>
            <div class="mt-2 flex items-center gap-2">
              <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                <div
                  class="h-full rounded-full bg-blue-500 transition-all"
                  :style="{ width: `${progress ?? 0}%` }"
                />
              </div>
              <span class="shrink-0 font-mono text-xs text-zinc-400">
                {{ formatTime(currentTime ?? 0) }} / {{ formatTime(duration ?? 0) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </AiAudioPlayer>
</template>

<script setup lang="ts">
function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
</script>
