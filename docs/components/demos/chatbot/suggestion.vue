<script setup lang="ts">
const suggestions = [
  { id: '1', label: 'How does RAG work?', value: 'How does RAG work?' },
  { id: '2', label: 'RAG vs fine-tuning', value: 'Compare RAG and fine-tuning approaches' },
  { id: '3', label: 'Best vector databases', value: 'What are the best vector databases for RAG?' },
]
</script>

<template>
  <div class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
    <p class="mb-3 text-xs font-medium text-zinc-500">Suggestions</p>
    <AiSuggestion :suggestions="suggestions">
      <template #default="{ suggestions: items, select }">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="s in items"
            :key="s.id"
            type="button"
            class="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 px-3 py-1.5 text-sm text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
            @click="select(s)"
          >
            <svg class="h-3.5 w-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
            </svg>
            {{ s.label }}
          </button>
        </div>
      </template>
    </AiSuggestion>
  </div>
</template>
