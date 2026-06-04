<template>
  <div class="relative h-28 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
    <AiNode id="demo" label="Embed Query" :x="0" :y="0" status="running">
      <template #default="{ label }">
        <div class="inline-flex flex-col rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
          <div class="flex items-center gap-2 border-b border-zinc-100 px-3 py-2 dark:border-zinc-700">
            <span class="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
            <span class="text-xs font-medium text-zinc-700 dark:text-zinc-300">{{ label }}</span>
            <span class="rounded-md bg-zinc-100 px-1.5 py-0.5 text-[10px] font-mono text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400">running</span>
          </div>
          <div class="flex items-center justify-between px-3 py-2">
            <div class="flex items-center gap-1.5">
              <span class="h-1.5 w-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
              <span class="text-[10px] text-zinc-400">input</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="text-[10px] text-zinc-400">output</span>
              <span class="h-1.5 w-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
            </div>
          </div>
        </div>
      </template>
    </AiNode>
  </div>
</template>
