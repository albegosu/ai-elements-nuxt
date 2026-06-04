<template>
  <AiMarkdown
    :content="content"
    class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
  >
    <template #default="{ html }">
      <div class="prose prose-sm prose-zinc dark:prose-invert prose-headings:font-medium prose-code:rounded prose-code:bg-zinc-100 prose-code:px-1 prose-code:py-0.5 prose-code:text-zinc-700 prose-code:before:content-[''] prose-code:after:content-[''] dark:prose-code:bg-zinc-800 dark:prose-code:text-zinc-300" v-html="html" />
    </template>
  </AiMarkdown>
</template>

<script setup lang="ts">
const content = `## Retrieval-Augmented Generation

RAG combines **retrieval systems** with language models to produce grounded responses.

The pipeline works in three stages:

1. **Indexing** — documents are chunked and embedded into a vector store
2. **Retrieval** — a query embedding finds the top-k most similar chunks
3. **Generation** — retrieved context is passed to the LLM via \`system\` prompt

Use \`similarity_threshold: 0.8\` to filter low-relevance matches.`
</script>
