<script setup lang="ts">
const items = [
  { id: '1', content: 'How does RAG work?', status: 'completed' as const, position: 1 },
  { id: '2', content: 'Compare vector databases', status: 'processing' as const, position: 2 },
  { id: '3', content: 'Explain fine-tuning tradeoffs', status: 'queued' as const, position: 3 },
]

const statusColors: Record<string, string> = {
  completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  queued: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
  failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}
</script>

<template>
  <div class="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
  <AiQueue :items="items">
    <template #default="{ items: queueItems }">
      <div class="space-y-0">
        <div class="flex items-center gap-2 pb-3 mb-3 border-b border-zinc-100 dark:border-zinc-800">
          <svg class="size-4 text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
          </svg>
          <span class="text-sm font-medium text-zinc-900 dark:text-zinc-100">Queue</span>
          <span class="rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">{{ queueItems.length }} items</span>
        </div>
        <div class="divide-y divide-zinc-100 rounded-lg border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
          <div
            v-for="item in queueItems"
            :key="item.id"
            class="flex items-center gap-3 px-3 py-2.5"
          >
            <span class="flex size-5 shrink-0 items-center justify-center rounded font-mono text-xs font-medium text-zinc-400 dark:text-zinc-500">{{ item.position }}</span>
            <span class="flex-1 text-sm text-zinc-700 dark:text-zinc-300">{{ item.content }}</span>
            <span class="shrink-0 rounded-md px-2 py-0.5 font-mono text-xs" :class="statusColors[item.status]">{{ item.status }}</span>
          </div>
        </div>
      </div>
    </template>
  </AiQueue>
  </div>
</template>
