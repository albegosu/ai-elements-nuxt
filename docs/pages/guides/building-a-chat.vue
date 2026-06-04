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

      <div>
        <h2 class="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Error states
        </h2>
        <p class="mb-3">
          <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">useAiChat</code> returns <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">error</code> and <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">clearError</code>.
          When <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">isStreaming</code> is false and <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">error</code> is set, the last generation failed — show a retry UI.
        </p>
        <div class="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <pre class="overflow-x-auto bg-zinc-950 p-4 text-[13px] text-zinc-100"><code>&lt;script setup lang="ts"&gt;
const { aiMessages, input, handleSubmit, isStreaming, error, clearError } = useAiChat({
  api: '/api/chat',
})
&lt;/script&gt;

&lt;template&gt;
  &lt;AiMessage v-for="(msg, i) in aiMessages" :key="i" v-bind="msg" /&gt;

  &lt;!-- Stream or tool failure --&gt;
  &lt;AiErrorBoundary
    v-if="error &amp;&amp; !isStreaming"
    :error="error"
    @retry="clearError"
  /&gt;

  &lt;form @submit="handleSubmit"&gt;
    &lt;AiPromptInput v-model="input" :loading="isStreaming" :disabled="!!error" /&gt;
  &lt;/form&gt;
&lt;/template&gt;</code></pre>
        </div>
        <p class="mt-3 text-xs text-zinc-500">
          <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">clearError()</code> resets the error and re-enables the input.
          For agents, tool failures surface through the step's <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">status: 'failed'</code> — handle them in the <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">AiAgent</code> step timeline.
        </p>
      </div>
    </section>
  </div>
</template>
