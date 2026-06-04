<script setup lang="ts">
const task = {
  id: '1',
  title: 'Ingest PDF documents',
  description: 'Processing and embedding uploaded documents into the vector store.',
  status: 'in_progress' as const,
  progress: 65,
  subtasks: [
    { id: 'a', title: 'Extract text content', status: 'completed' as const },
    { id: 'b', title: 'Chunk into segments', status: 'completed' as const },
    { id: 'c', title: 'Generate embeddings', status: 'in_progress' as const },
    { id: 'd', title: 'Store in vector DB', status: 'pending' as const },
  ],
}
</script>

<template>
  <div class="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
  <AiTask :task="task">
    <template #default="{ task: t, completedSubtasks }">
      <div class="space-y-4">
        <div class="flex items-start justify-between">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium text-zinc-900 dark:text-zinc-100">{{ t.title }}</span>
              <span class="rounded-md bg-blue-50 px-2 py-0.5 font-mono text-xs text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">{{ t.status }}</span>
            </div>
            <p class="text-sm text-zinc-500 dark:text-zinc-400">{{ t.description }}</p>
          </div>
          <span class="rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">{{ completedSubtasks }}/{{ t.subtasks?.length }}</span>
        </div>

        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-zinc-500">Progress</span>
            <span class="font-mono text-xs text-zinc-500">{{ t.progress }}%</span>
          </div>
          <div class="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
            <div class="h-full rounded-full bg-blue-500 transition-all" :style="{ width: `${t.progress}%` }" />
          </div>
        </div>

        <div class="space-y-1">
          <span class="text-xs font-medium text-zinc-500">Subtasks</span>
          <div class="divide-y divide-zinc-100 rounded-lg border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
            <div
              v-for="subtask in t.subtasks"
              :key="subtask.id"
              class="flex items-center gap-2.5 px-3 py-2"
            >
              <svg v-if="subtask.status === 'completed'" class="size-4 shrink-0 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <svg v-else-if="subtask.status === 'in_progress'" class="size-4 shrink-0 animate-spin text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              <svg v-else class="size-4 shrink-0 text-zinc-300 dark:text-zinc-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <span class="text-sm" :class="subtask.status === 'completed' ? 'text-zinc-400 dark:text-zinc-500' : 'text-zinc-700 dark:text-zinc-300'">{{ subtask.title }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </AiTask>
  </div>
</template>
