<script setup lang="ts">
import { ref } from 'vue'

const active = ref(0)
const responses = [
  'RAG grounds answers in your own documents by retrieving relevant chunks at query time.',
  'Retrieval-Augmented Generation fetches context from a vector store, then lets the model answer using it.',
  'It pairs a retriever with an LLM so responses cite fresh, external knowledge instead of memorized data.',
]
</script>

<template>
  <div class="w-full max-w-md">
    <AiBranch :branches="responses" v-model:index="active">
      <template #default="{ current, index, count, next, previous, canPrev, canNext }">
        <div class="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p class="text-sm text-zinc-700 dark:text-zinc-300">{{ current }}</p>
          <div class="mt-3 flex items-center gap-2 border-t border-zinc-100 pt-3 dark:border-zinc-800">
            <button
              type="button"
              :disabled="!canPrev"
              class="flex size-7 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 disabled:opacity-30 dark:hover:bg-zinc-800"
              aria-label="Previous response"
              @click="previous"
            >‹</button>
            <span class="font-mono text-xs text-zinc-400">{{ index + 1 }} / {{ count }}</span>
            <button
              type="button"
              :disabled="!canNext"
              class="flex size-7 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 disabled:opacity-30 dark:hover:bg-zinc-800"
              aria-label="Next response"
              @click="next"
            >›</button>
          </div>
        </div>
      </template>
    </AiBranch>
  </div>
</template>
