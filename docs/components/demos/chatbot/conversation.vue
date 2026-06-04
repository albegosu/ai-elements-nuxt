<script setup lang="ts">
const active = ref('1')
const threads = [
  { id: '1', title: 'How does RAG work?', updatedAt: new Date(), messageCount: 12 },
  { id: '2', title: 'Vector embeddings explained', updatedAt: new Date(Date.now() - 3600000), messageCount: 8 },
  { id: '3', title: 'Fine-tuning strategies', updatedAt: new Date(Date.now() - 86400000), messageCount: 5 },
]

function relativeTime(date: Date) {
  const diff = Date.now() - date.getTime()
  if (diff < 60000) return 'just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  return `${Math.floor(diff / 86400000)}d ago`
}
</script>

<template>
  <div class="w-full max-w-xs rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
  <AiConversation :threads="threads" :active-id="active" @select="t => active = t.id">
    <template #header="{ create }">
      <div class="flex items-center justify-between pb-3 mb-3 border-b border-zinc-100 dark:border-zinc-800">
        <span class="text-sm font-medium text-zinc-900 dark:text-zinc-100">Conversations</span>
        <button
          type="button"
          class="flex size-7 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          @click="create"
        >
          <svg class="size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>
    </template>

    <template #thread="{ thread, active: isActive, select }">
      <button
        type="button"
        class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors"
        :class="isActive
          ? 'border-l-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'"
        @click="select"
      >
        <div class="flex-1 min-w-0">
          <span
            class="block truncate text-sm"
            :class="isActive ? 'font-medium text-zinc-900 dark:text-zinc-100' : 'text-zinc-700 dark:text-zinc-300'"
          >{{ thread.title }}</span>
          <span class="text-xs text-zinc-400 dark:text-zinc-500">{{ relativeTime(thread.updatedAt) }}</span>
        </div>
        <span class="shrink-0 rounded-md bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">{{ thread.messageCount }}</span>
      </button>
    </template>
  </AiConversation>
  </div>
</template>
