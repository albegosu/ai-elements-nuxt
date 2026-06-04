<script setup lang="ts">
const code = `import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

export default defineEventHandler(async (event) => {
  const { messages } = await readBody(event)

  const result = streamText({
    model: openai('gpt-4o'),
    system: 'You are a helpful assistant.',
    messages,
    maxTokens: 2048,
    temperature: 0.7,
  })

  return result.toDataStreamResponse()
})`
</script>

<template>
  <div class="w-full max-w-lg overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
    <AiCodeBlock
      :code="code"
      language="typescript"
      filename="server/api/chat.post.ts"
      :highlight-lines="[7, 8, 9, 10, 11, 12, 13]"
    >
      <template #header="{ filename: fn, language: lang, copy, copied }">
        <div class="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 py-2.5">
          <div class="flex items-center gap-2 text-xs text-zinc-400">
            <span class="font-medium text-zinc-300">{{ fn }}</span>
            <span class="rounded-md bg-zinc-800 px-1.5 py-0.5 font-mono text-zinc-500">{{ lang }}</span>
          </div>
          <button
            type="button"
            class="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
            @click="copy"
          >
            {{ copied ? 'Copied' : 'Copy' }}
          </button>
        </div>
      </template>
      <template #default="{ lines: codeLines }">
        <pre class="overflow-x-auto bg-zinc-950 p-4 text-[13px] leading-relaxed text-zinc-300"><code><template v-for="(line, i) in codeLines" :key="i"><span class="mr-4 inline-block w-6 select-none text-right text-zinc-600">{{ i + 1 }}</span><span :class="{ 'bg-yellow-500/10': [7, 8, 9, 10, 11, 12, 13].includes(i + 1) }">{{ line }}
</span></template></code></pre>
      </template>
    </AiCodeBlock>
  </div>
</template>
