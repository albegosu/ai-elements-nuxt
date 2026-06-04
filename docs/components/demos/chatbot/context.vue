<script setup lang="ts">
const items = [
  { id: '1', type: 'system' as const, title: 'System prompt', tokenCount: 450 },
  { id: '2', type: 'document' as const, title: 'architecture-overview.md', tokenCount: 1200 },
  { id: '3', type: 'memory' as const, title: 'User preferences', tokenCount: 280 },
  { id: '4', type: 'document' as const, title: 'api-reference.pdf (chunk 3)', tokenCount: 860 },
]

const typeColors: Record<string, string> = {
  system: 'bg-purple-500',
  document: 'bg-blue-500',
  memory: 'bg-emerald-500',
}

const typeLabels: Record<string, string> = {
  system: 'System',
  document: 'Document',
  memory: 'Memory',
}
</script>

<template>
  <div class="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
  <AiContext :items="items" :collapsed="false">
    <template #trigger="{ toggle, totalTokens, itemCount }">
      <button
        type="button"
        class="flex w-full items-center justify-between rounded-t-xl border-b border-zinc-100 pb-3 dark:border-zinc-800"
        @click="toggle"
      >
        <div class="flex items-center gap-2">
          <svg class="size-4 text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
          </svg>
          <span class="text-sm font-medium text-zinc-900 dark:text-zinc-100">Context Window</span>
          <span class="rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">{{ itemCount }} items</span>
        </div>
        <span class="font-mono text-xs text-zinc-500">{{ totalTokens.toLocaleString() }} tokens</span>
      </button>
    </template>

    <template #item="{ item }">
      <div class="flex items-center justify-between px-3 py-2.5">
        <div class="flex items-center gap-2.5">
          <span class="size-2 shrink-0 rounded-full" :class="typeColors[item.type] || 'bg-zinc-400'" />
          <span class="text-xs font-medium text-zinc-500">{{ typeLabels[item.type] || item.type }}</span>
          <span class="text-sm text-zinc-700 dark:text-zinc-300">{{ item.title }}</span>
        </div>
        <span class="rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">{{ item.tokenCount }}</span>
      </div>
    </template>
  </AiContext>
  </div>
</template>
