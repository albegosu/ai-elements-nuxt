<template>
  <div class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
    <AiReasoning
      content="The user is asking about RAG (Retrieval-Augmented Generation). I need to break this down into the core components: the retrieval system, the augmentation step, and the generation phase. Let me consider the key advantages over pure fine-tuning — namely, that RAG allows the model to access up-to-date information without retraining. I should also mention vector databases and embedding models as the foundation of the retrieval pipeline."
      :collapsed="true"
    >
      <template #trigger="{ collapsed, toggle }">
        <button
          type="button"
          class="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
          @click="toggle"
        >
          <svg class="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
          </svg>
          <span class="font-medium text-zinc-700 dark:text-zinc-300">Thinking</span>
          <svg
            class="h-4 w-4 text-zinc-400 transition-transform"
            :class="{ 'rotate-180': !collapsed }"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
      </template>

      <template #default="{ content }">
        <div class="mt-3 rounded-lg border-l-2 border-zinc-300 bg-zinc-50 p-3 dark:border-zinc-600 dark:bg-zinc-800/50">
          <p class="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{{ content }}</p>
        </div>
      </template>
    </AiReasoning>
  </div>
</template>
