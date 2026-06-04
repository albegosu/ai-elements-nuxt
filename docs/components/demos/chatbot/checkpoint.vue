<script setup lang="ts">
const checkpoint = {
  id: '1',
  title: 'Index ready',
  description: 'All documents have been processed and the vector index is now available for queries.',
  status: 'passed' as const,
  timestamp: new Date().toISOString(),
}

const formattedTime = computed(() => {
  const d = new Date(checkpoint.timestamp)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
})
</script>

<template>
  <AiCheckpoint :checkpoint="checkpoint">
    <template #default="{ checkpoint: cp }">
      <div class="flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800/50 dark:bg-emerald-900/20">
        <div class="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-800/40">
          <svg class="size-4 text-emerald-600 dark:text-emerald-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <div class="flex-1 space-y-1">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-emerald-900 dark:text-emerald-100">{{ cp.title }}</span>
            <span class="font-mono text-xs text-emerald-600 dark:text-emerald-400">{{ formattedTime }}</span>
          </div>
          <p class="text-sm text-emerald-700 dark:text-emerald-300/80">{{ cp.description }}</p>
        </div>
      </div>
    </template>
  </AiCheckpoint>
</template>
