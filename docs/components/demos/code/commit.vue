<script setup lang="ts">
const commit = {
  hash: 'f4a8e2c1d9b3',
  message: 'feat(chat): add streaming support with tool call handling',
  author: 'Sarah Chen',
  date: '2025-06-02T14:32:00Z',
  files: [
    { path: 'server/api/chat.post.ts', status: 'modified' as const, additions: 34, deletions: 12 },
    { path: 'src/composables/useChat.ts', status: 'added' as const, additions: 87, deletions: 0 },
    { path: 'src/components/ChatStream.vue', status: 'added' as const, additions: 52, deletions: 0 },
    { path: 'src/utils/legacy-fetch.ts', status: 'deleted' as const, additions: 0, deletions: 41 },
  ],
}
</script>

<template>
  <div class="w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
    <AiCommit :commit="commit" :expanded="true">
      <template #header="{ commit: c, totalAdditions, totalDeletions }">
        <div class="flex flex-wrap items-center gap-2 border-b border-zinc-100 pb-3 dark:border-zinc-800">
          <code class="rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-xs text-zinc-600 dark:bg-zinc-800">{{ c.hash.slice(0, 7) }}</code>
          <span class="flex-1 text-sm font-medium text-zinc-900 dark:text-zinc-50">{{ c.message }}</span>
          <span class="text-xs text-zinc-400">{{ c.author }}</span>
          <span class="font-mono text-xs">
            <span class="text-green-600">+{{ totalAdditions }}</span>
            <span class="ml-1 text-red-500">-{{ totalDeletions }}</span>
          </span>
        </div>
      </template>
      <template #file="{ file }">
        <div class="flex items-center gap-2 py-1.5 font-mono text-xs">
          <span
            class="w-4 text-center font-bold"
            :class="{
              'text-green-600': file.status === 'added',
              'text-red-500': file.status === 'deleted',
              'text-yellow-600': file.status === 'modified',
            }"
          >
            {{ file.status === 'added' ? 'A' : file.status === 'deleted' ? 'D' : 'M' }}
          </span>
          <span class="flex-1 text-zinc-700 dark:text-zinc-300">{{ file.path }}</span>
          <span v-if="file.additions" class="text-green-600">+{{ file.additions }}</span>
          <span v-if="file.deletions" class="text-red-500">-{{ file.deletions }}</span>
        </div>
      </template>
    </AiCommit>
  </div>
</template>
