<script setup lang="ts">
definePageMeta({ layout: 'default' })
</script>

<template>
  <div>
    <DocsHeader
      title="Building a Chat"
      description="End-to-end patterns for streaming chat with the AI SDK and headless UI."
    />

    <section class="space-y-8 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
      <div>
        <h2 class="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Server handler
        </h2>
        <p class="mb-3">
          <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">createChatHandler</code>
          accepts a <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">LanguageModel</code>,
          streams UI messages compatible with <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">useAiChat</code>,
          and enables reasoning/sources by default.
        </p>
        <div class="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <pre class="overflow-x-auto bg-zinc-950 p-4 text-[13px] text-zinc-100"><code>import { createChatHandler } from 'ai-elements-nuxt/server'
import { openai } from '@ai-sdk/openai'

export default createChatHandler({
  model: openai('gpt-4o'),
  system: 'You are a helpful assistant.',
})</code></pre>
        </div>
      </div>

      <div>
        <h2 class="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          useAiChat
        </h2>
        <ul class="list-inside list-disc space-y-1">
          <li><code>api: '/api/chat'</code> — connects to AI SDK <code>Chat</code> + transport</li>
          <li><code>body</code> / <code>headers</code> — dynamic request fields (see <NuxtLink to="/guides/custom-transport" class="underline">Custom Transport &amp; RAG</NuxtLink>)</li>
          <li><code>aiMessages</code> — mapped props for <code>AiMessage</code></li>
          <li><code>addToolApprovalResponse</code> / <code>addToolOutput</code> — tool lifecycle</li>
          <li>Omit <code>api</code> for local-only demos via <code>useAiChatLocal</code></li>
        </ul>
      </div>

      <div>
        <h2 class="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Persistence
        </h2>
        <div class="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <pre class="overflow-x-auto bg-zinc-950 p-4 text-[13px] text-zinc-100"><code>const chat = useAiChatPersisted({
  key: 'my-app-chat',
  storage: 'localStorage',
})
// chat.clearHistory(), chat.restored</code></pre>
        </div>
      </div>

      <div>
        <h2 class="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Markdown messages
        </h2>
        <p class="mb-3">
          Use <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">useAiMarkdown</code>
          or <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">AiMarkdown</code>
          for assistant HTML (GFM via <code>marked</code>).
        </p>
      </div>
    </section>
  </div>
</template>
