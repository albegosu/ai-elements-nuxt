<script setup lang="ts">
const toolCall = {
  id: '1',
  name: 'searchKnowledgeBase',
  args: { query: 'RAG architecture', top_k: 5, filter: 'category:ml' },
  result: { found: 3, documents: ['doc_01', 'doc_02', 'doc_03'] },
  status: 'output-available' as const,
}
</script>

<template>
  <div class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
    <AiTool :tool-call="toolCall">
      <template #default="{ toolCall: tc, statusLabel, isComplete }">
        <div class="space-y-3">
          <!-- Header -->
          <div class="flex items-center gap-2">
            <svg class="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.049.58.025 1.193-.14 1.743" />
            </svg>
            <span class="rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">{{ tc.name }}</span>
            <div class="flex items-center gap-1.5">
              <span
                class="h-1.5 w-1.5 rounded-full"
                :class="isComplete ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-600'"
              />
              <span class="text-xs text-zinc-500">{{ statusLabel }}</span>
            </div>
          </div>

          <!-- Args -->
          <div>
            <p class="mb-1.5 text-xs font-medium text-zinc-500">Arguments</p>
            <pre class="rounded-lg bg-zinc-50 p-3 font-mono text-xs leading-relaxed text-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-400">{{ JSON.stringify(tc.args, null, 2) }}</pre>
          </div>

          <!-- Result -->
          <div v-if="isComplete && tc.result">
            <p class="mb-1.5 text-xs font-medium text-zinc-500">Result</p>
            <pre class="rounded-lg bg-zinc-50 p-3 font-mono text-xs leading-relaxed text-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-400">{{ JSON.stringify(tc.result, null, 2) }}</pre>
          </div>
        </div>
      </template>
    </AiTool>
  </div>
</template>
