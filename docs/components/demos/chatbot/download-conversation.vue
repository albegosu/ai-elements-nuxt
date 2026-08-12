<script setup lang="ts">
const messages = [
  { role: 'user', content: 'What is retrieval-augmented generation?' },
  { role: 'assistant', content: 'RAG combines a retriever with a language model so answers are grounded in your own documents instead of the model\'s parametric memory.' },
  { role: 'user', content: 'When should I use it over fine-tuning?' },
  { role: 'assistant', content: 'Prefer RAG when knowledge changes often or must be cited; prefer fine-tuning to change style or behavior.' },
]
</script>

<template>
  <div class="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
    <div class="mb-3 space-y-2">
      <div
        v-for="(m, i) in messages"
        :key="i"
        class="text-sm"
        :class="m.role === 'user' ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 dark:text-zinc-400'"
      >
        <span class="font-medium capitalize">{{ m.role }}:</span> {{ m.content }}
      </div>
    </div>

    <AiDownloadConversation :messages="messages" filename="rag-chat.md">
      <template #default="{ download, disabled }">
        <button
          type="button"
          :disabled="disabled"
          class="inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          @click="download"
        >
          <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Download as Markdown
        </button>
      </template>
    </AiDownloadConversation>
  </div>
</template>
