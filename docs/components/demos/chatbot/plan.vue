<script setup lang="ts">
const steps = [
  { id: '1', title: 'Parse user query', status: 'completed' as const },
  {
    id: '2',
    title: 'Retrieve relevant documents',
    status: 'completed' as const,
    children: [
      { id: '2a', title: 'Search vector store', status: 'completed' as const },
      { id: '2b', title: 'Rank by relevance', status: 'completed' as const },
    ],
  },
  { id: '3', title: 'Synthesize answer', status: 'in_progress' as const },
  { id: '4', title: 'Format response', status: 'pending' as const },
]
</script>

<template>
  <div class="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
  <AiPlan :steps="steps" title="Agent Plan">
    <template #header="{ title, completed, total }">
      <div class="flex items-center justify-between pb-3 mb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div class="flex items-center gap-2">
          <svg class="size-4 text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
          <span class="text-sm font-medium text-zinc-900 dark:text-zinc-100">{{ title }}</span>
        </div>
        <span class="rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">{{ completed }}/{{ total }} done</span>
      </div>
    </template>

    <template #step="{ step }">
      <div class="flex items-center gap-2.5">
        <span
          class="size-2 shrink-0 rounded-full"
          :class="{
            'bg-emerald-500': step.status === 'completed',
            'bg-blue-500': step.status === 'in_progress',
            'bg-zinc-300 dark:bg-zinc-600': step.status === 'pending',
          }"
        />
        <span
          class="text-sm"
          :class="{
            'text-zinc-400 line-through dark:text-zinc-500': step.status === 'completed',
            'font-medium text-zinc-900 dark:text-zinc-100': step.status === 'in_progress',
            'text-zinc-500 dark:text-zinc-400': step.status === 'pending',
          }"
        >{{ step.title }}</span>
      </div>
    </template>
  </AiPlan>
  </div>
</template>
