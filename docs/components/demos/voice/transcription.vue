<script setup lang="ts">
const segments = [
  { id: '1', text: 'Welcome to the AI research briefing for this morning.', startTime: 0, endTime: 4.2 },
  { id: '2', text: 'Today we\'ll cover recent advances in multimodal reasoning.', startTime: 4.5, endTime: 8.1 },
  { id: '3', text: 'Let\'s start with the latest benchmark results.', startTime: 8.5, endTime: 11 },
]
const time = ref(5)

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
</script>

<template>
  <div class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
    <div class="mb-3 flex items-center gap-2">
      <svg class="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
      </svg>
      <span class="text-xs font-medium text-zinc-500">Transcription</span>
    </div>

    <AiTranscription :segments="segments" :current-time="time" highlight-active @seek="time = $event">
      <template #default="{ segments: segs, 'active-id': activeId }">
        <div class="space-y-1">
          <div
            v-for="seg in segs"
            :key="seg.id"
            class="flex gap-3 rounded-lg p-2 transition-colors"
            :class="seg.id === activeId
              ? 'border-l-2 border-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
              : 'border-l-2 border-transparent'"
          >
            <span class="shrink-0 font-mono text-xs leading-6 text-zinc-400">{{ formatTime(seg.startTime) }}</span>
            <div>
              <span class="mb-0.5 block text-xs font-medium text-zinc-500">Speaker 1</span>
              <p class="text-sm text-zinc-700 dark:text-zinc-300">{{ seg.text }}</p>
            </div>
          </div>
        </div>
      </template>
    </AiTranscription>
  </div>
</template>
