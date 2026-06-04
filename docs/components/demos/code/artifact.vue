<script setup lang="ts">
const artifacts = [
  {
    id: '1',
    title: 'api-client.ts',
    type: 'code' as const,
    content: `import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'

export async function chat(messages: Message[]) {
  const result = streamText({
    model: openai('gpt-4o'),
    messages,
  })
  return result.toDataStreamResponse()
}`,
    language: 'typescript',
  },
  {
    id: '2',
    title: 'preview.html',
    type: 'html' as const,
    content: `<div style="padding:20px;font-family:system-ui">
  <h3 style="margin:0 0 8px;font-size:16px">Chat Response</h3>
  <p style="margin:0;font-size:14px;color:#52525b">Streaming AI responses with tool-call support.</p>
</div>`,
  },
]
</script>

<template>
  <div class="w-full max-w-lg overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
    <AiArtifact :artifacts="artifacts">
      <template #tabs="{ artifacts: items, activeId, setActive }">
        <div class="flex border-b border-zinc-200 dark:border-zinc-800" role="tablist">
          <button
            v-for="artifact in items"
            :key="artifact.id"
            type="button"
            role="tab"
            class="border-b-2 px-4 py-2 text-sm transition"
            :class="artifact.id === activeId ? 'border-blue-600 font-medium text-zinc-900 dark:text-zinc-50' : 'border-transparent text-zinc-500 hover:text-zinc-700'"
            @click="setActive(artifact.id)"
          >
            {{ artifact.title }}
          </button>
        </div>
      </template>
      <template #content="{ artifact }">
        <div v-if="artifact" class="max-h-48 overflow-auto bg-zinc-950 p-4">
          <pre v-if="artifact.type === 'code'" class="font-mono text-[13px] leading-relaxed text-zinc-300">{{ artifact.content }}</pre>
          <div v-else-if="artifact.type === 'html'" class="rounded-lg bg-white p-4" v-html="artifact.content" />
        </div>
      </template>
    </AiArtifact>
  </div>
</template>
