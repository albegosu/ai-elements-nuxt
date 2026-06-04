<script setup lang="ts">
const sources = [
  { id: '1', title: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks', url: 'https://arxiv.org/abs/2005.11401', score: 0.95 },
  { id: '2', title: 'LangChain: Building Applications with LLMs', url: 'https://docs.langchain.com/docs/', score: 0.87 },
  { id: '3', title: 'Vector Databases Explained', url: 'https://www.pinecone.io/learn/', score: 0.82 },
]
</script>

<template>
  <div class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
    <p class="mb-3 text-xs font-medium text-zinc-500">Sources</p>
    <AiSources :sources="sources">
      <template #default="{ sources: items }">
        <div class="divide-y divide-zinc-100 rounded-lg border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
          <a
            v-for="source in items"
            :key="source.id"
            :href="source.url"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-start gap-3 px-3 py-2.5 transition-colors first:rounded-t-lg last:rounded-b-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
          >
            <svg class="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
            </svg>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-zinc-700 dark:text-zinc-300">{{ source.title }}</p>
              <p v-if="source.url" class="mt-0.5 truncate font-mono text-xs text-zinc-500">{{ source.url }}</p>
            </div>
            <span
              v-if="source.score"
              class="shrink-0 rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
            >
              {{ (source.score * 100).toFixed(0) }}%
            </span>
          </a>
        </div>
      </template>
    </AiSources>
  </div>
</template>
