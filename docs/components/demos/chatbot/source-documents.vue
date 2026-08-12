<script setup lang="ts">
import { ref } from 'vue'
import type { AiSourceDocument } from '../../../../src/runtime/types'

const documents = ref<AiSourceDocument[]>([
  { id: '1', title: 'architecture.md', type: 'doc' },
  { id: '2', title: 'api-spec.pdf', type: 'pdf' },
  { id: '3', title: 'https://ai-sdk.dev/elements', type: 'url' },
])

function remove(doc: AiSourceDocument) {
  documents.value = documents.value.filter(d => d.id !== doc.id)
}
</script>

<template>
  <div class="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
    <AiSourceDocuments :documents="documents" @remove="remove">
      <template #default="{ documents: docs }">
        <div class="flex flex-wrap gap-2">
          <span
            v-for="doc in docs"
            :key="doc.id"
            class="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
          >
            <span class="font-mono uppercase text-zinc-400">{{ doc.type }}</span>
            <span class="max-w-40 truncate">{{ doc.title }}</span>
            <button
              type="button"
              class="text-zinc-400 hover:text-red-500"
              :aria-label="`Remove ${doc.title}`"
              @click="remove(doc)"
            >×</button>
          </span>
        </div>
      </template>
    </AiSourceDocuments>
    <p v-if="!documents.length" class="text-xs text-zinc-400">All documents removed.</p>
  </div>
</template>
