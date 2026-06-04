<script setup lang="ts">
const variables = [
  { key: 'OPENAI_API_KEY', value: 'sk-proj-abc...xyz', type: 'secret' as const, required: true },
  { key: 'ANTHROPIC_API_KEY', value: 'sk-ant-api03-...', type: 'secret' as const },
  { key: 'NUXT_PUBLIC_APP_URL', value: 'https://my-app.vercel.app', type: 'string' as const, required: true },
  { key: 'AI_MAX_TOKENS', value: '4096', type: 'number' as const },
]
</script>

<template>
  <div class="w-full max-w-lg divide-y divide-zinc-100 overflow-hidden rounded-xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
    <AiEnvVars :variables="variables">
      <template #variable="{ variable: v, maskedValue, toggleReveal, revealed }">
        <div class="flex items-center gap-3 px-4 py-3 text-sm">
          <code class="min-w-[160px] text-xs text-blue-600 dark:text-blue-400">{{ v.key }}</code>
          <code class="flex-1 truncate text-xs text-zinc-500">{{ maskedValue }}</code>
          <button
            v-if="v.type === 'secret'"
            type="button"
            class="rounded-md border border-zinc-200 px-2 py-0.5 text-xs text-zinc-500 hover:bg-zinc-50 dark:border-zinc-700"
            @click="toggleReveal"
          >
            {{ revealed ? 'Hide' : 'Show' }}
          </button>
          <span v-if="v.required" class="text-[10px] font-medium text-red-500">req</span>
        </div>
      </template>
    </AiEnvVars>
  </div>
</template>
