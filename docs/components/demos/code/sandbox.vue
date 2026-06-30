<script setup lang="ts">
const code = `const models = ['gpt-4o', 'claude-sonnet', 'gemini-pro']
const picked = models[Math.floor(Math.random() * models.length)]
console.log('Selected:', picked)`
</script>

<template>
  <div class="w-full overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
    <AiSandbox :code="code" language="javascript" title="Model picker" :auto-run="true">
      <template #header="{ title: t, run, isRunning }">
        <div class="flex items-center justify-between gap-3 border-b border-zinc-800 bg-zinc-900 px-4 py-2.5">
          <div class="flex min-w-0 items-center gap-2">
            <span class="flex shrink-0 gap-1.5">
              <span class="h-2.5 w-2.5 rounded-full bg-red-500/80" />
              <span class="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
              <span class="h-2.5 w-2.5 rounded-full bg-green-500/80" />
            </span>
            <span class="truncate text-sm font-medium text-zinc-300">{{ t }}</span>
          </div>
          <button
            type="button"
            class="shrink-0 rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-200 transition hover:bg-zinc-700 disabled:opacity-50"
            :disabled="isRunning"
            @click="run"
          >
            {{ isRunning ? 'Running…' : 'Run' }}
          </button>
        </div>
      </template>

      <template #editor="{ code: c }">
        <pre class="overflow-x-auto border-b border-zinc-800 bg-zinc-950 p-4 text-[13px] leading-relaxed text-zinc-300"><code>{{ c }}</code></pre>
      </template>

      <template #output="{ iframeHtml, frameVersion }">
        <div class="bg-zinc-950">
          <p class="border-b border-zinc-800 px-4 py-1.5 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
            Output
          </p>
          <iframe
            :key="frameVersion"
            :srcdoc="iframeHtml"
            sandbox="allow-scripts"
            class="block h-14 w-full border-0"
            title="Sandbox output"
          />
        </div>
      </template>
    </AiSandbox>
  </div>
</template>
