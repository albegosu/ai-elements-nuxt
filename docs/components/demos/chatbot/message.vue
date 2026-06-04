<template>
  <div class="flex max-w-md flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
    <!-- User message -->
    <AiMessage role="user" content="Can you explain how retrieval-augmented generation works?" status="complete">
      <template #avatar>
        <div class="flex items-start gap-3">
          <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">U</div>
          <div class="min-w-0">
            <p class="mb-1 text-xs font-medium text-zinc-500">You</p>
          </div>
        </div>
      </template>
      <template #content="{ content }">
        <div class="ml-10">
          <p class="rounded-lg bg-zinc-100 px-3 py-2 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">{{ content }}</p>
        </div>
      </template>
    </AiMessage>

    <!-- Assistant message -->
    <AiMessage role="assistant" content="RAG (Retrieval-Augmented Generation) combines a retrieval system with a language model. First, relevant documents are fetched from a knowledge base using semantic search. Then, these documents are passed as context to the LLM, which generates a grounded response based on the retrieved information." status="complete">
      <template #avatar>
        <div class="flex items-start gap-3">
          <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
            </svg>
          </div>
          <div class="min-w-0">
            <p class="mb-1 text-xs font-medium text-zinc-500">Assistant</p>
          </div>
        </div>
      </template>
      <template #content="{ content }">
        <div class="ml-10">
          <p class="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{{ content }}</p>
        </div>
      </template>
    </AiMessage>
  </div>
</template>
