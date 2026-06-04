<template>
  <AiSnippet code="pnpm add ai-elements-nuxt ai @ai-sdk/vue" language="bash" label="Install">
    <template #default="{ code: c, label: l, copy, copied }">
      <div class="inline-flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
        <span v-if="l" class="text-xs font-medium text-zinc-500">{{ l }}</span>
        <code class="font-mono text-sm text-zinc-800 dark:text-zinc-200">{{ c }}</code>
        <button
          type="button"
          class="rounded-md border border-zinc-200 px-2 py-1 text-xs text-zinc-500 transition hover:bg-white dark:border-zinc-700 dark:hover:bg-zinc-800"
          @click="copy"
        >
          {{ copied ? 'Copied' : 'Copy' }}
        </button>
      </div>
    </template>
  </AiSnippet>
</template>
