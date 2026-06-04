<script setup lang="ts">
const code = `const models = ['gpt-4o', 'claude-sonnet', 'gemini-pro']
const picked = models[Math.floor(Math.random() * models.length)]
console.log('Selected:', picked)`
</script>

<template>
  <div class="w-full max-w-sm overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
    <AiSandbox :code="code" language="javascript" title="Model Selector" :auto-run="true">
      <template #header="{ title: t, run, isRunning }">
        <div class="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900">
          <span class="text-sm font-medium text-zinc-700 dark:text-zinc-300">{{ t }}</span>
          <button
            type="button"
            class="rounded-md bg-zinc-900 px-3 py-1 text-xs font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
            :disabled="isRunning"
            @click="run"
          >
            {{ isRunning ? 'Running…' : 'Run' }}
          </button>
        </div>
      </template>
    </AiSandbox>
  </div>
</template>
