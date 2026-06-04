<script setup lang="ts">
const frames = [
  { file: 'server/api/chat.post.ts', line: 18, column: 12, function: 'handler', isApp: true },
  { file: 'src/utils/stream.ts', line: 42, column: 5, function: 'createStreamResponse', isApp: true },
  { file: 'node_modules/ai/dist/index.mjs', line: 1247, function: 'streamText', isApp: false },
  { file: 'node_modules/@ai-sdk/openai/dist/index.mjs', line: 89, function: 'OpenAIProvider.chat', isApp: false },
]
</script>

<template>
  <div class="w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
    <AiStackTrace
      error-type="TypeError"
      error="Cannot read properties of undefined (reading 'messages')"
      :frames="frames"
      :collapsed="false"
    >
      <template #error="{ error: err, errorType: et }">
        <div class="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 dark:border-red-900/50 dark:bg-red-950/30">
          <span class="font-mono text-sm font-medium text-red-700 dark:text-red-400">{{ et }}</span>
          <span class="text-sm text-red-600 dark:text-red-300">: {{ err }}</span>
        </div>
      </template>
      <template #frame="{ frame }">
        <div
          class="border-l-2 py-1 pl-3 font-mono text-xs"
          :class="frame.isApp ? 'border-blue-500 text-zinc-700 dark:text-zinc-300' : 'border-transparent text-zinc-400'"
        >
          <span v-if="frame.function" class="mr-2">{{ frame.function }}</span>
          <span class="opacity-70">{{ frame.file }}:{{ frame.line }}</span>
        </div>
      </template>
    </AiStackTrace>
  </div>
</template>
