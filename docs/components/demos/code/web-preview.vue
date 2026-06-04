<script setup lang="ts">
const html = `<div style="font-family:system-ui;padding:24px;max-width:360px">
  <span style="display:inline-block;background:#f0fdf4;color:#16a34a;font-size:12px;padding:2px 8px;border-radius:6px;margin-bottom:12px">Live</span>
  <h3 style="margin:0 0 6px;font-size:16px;font-weight:600">AI Chat Widget</h3>
  <p style="margin:0;font-size:14px;color:#71717a;line-height:1.5">Streaming responses with tool-call support.</p>
</div>`
</script>

<template>
  <div class="w-full max-w-sm overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
    <AiWebPreview :html="html" title="localhost:3000" height="200px">
      <template #header="{ title: t, refresh }">
        <div class="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900">
          <span class="font-mono text-xs text-zinc-500">{{ t }}</span>
          <button type="button" class="text-zinc-400 hover:text-zinc-600" @click="refresh">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.992 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </button>
        </div>
      </template>
    </AiWebPreview>
  </div>
</template>
