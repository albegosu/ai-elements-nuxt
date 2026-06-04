<script setup lang="ts">
const citation = {
  id: '1',
  sourceId: 's1',
  sourceTitle: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks',
  text: 'Lewis et al., 2020 — NeurIPS',
  index: 1,
}
</script>

<template>
  <div class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
    <p class="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
      RAG combines retrieval with generation to ground LLM outputs in factual sources, significantly reducing hallucination in knowledge-intensive tasks<AiInlineCitation :citation="citation">
        <template #default="{ citation: c, hovered }">
          <sup
            class="relative ml-0.5 inline-flex cursor-pointer items-center justify-center rounded bg-blue-100 px-1 font-mono text-[10px] font-medium text-blue-700 transition-colors hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:hover:bg-blue-800/60"
          >{{ c.index }}</sup>
        </template>
        <template #tooltip="{ citation: c }">
          <div class="absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 rounded-lg border border-zinc-200 bg-white p-3 shadow-lg dark:border-zinc-700 dark:bg-zinc-800" style="width: 280px">
            <div class="space-y-1">
              <p class="text-xs font-medium text-zinc-900 dark:text-zinc-100">{{ c.sourceTitle }}</p>
              <p class="text-xs text-zinc-500 dark:text-zinc-400">{{ c.text }}</p>
            </div>
          </div>
        </template>
      </AiInlineCitation>.
    </p>
  </div>
</template>
