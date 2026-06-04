<script setup lang="ts">
definePageMeta({ layout: 'default' })
</script>

<template>
  <div>
    <DocsHeader
      title="Custom Transport & RAG"
      description="Dynamic request bodies, manual Chat setup, and enriching messages for retrieval apps."
    />

    <section class="space-y-8 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
      <div>
        <h2 class="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Dynamic body with useAiChat
        </h2>
        <p class="mb-3">
          Pass <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">body</code>,
          <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">headers</code>, or
          <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">credentials</code>
          to <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">useAiChat</code>.
          Values are forwarded to AI SDK <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">DefaultChatTransport</code>
          and merged into every chat request. Use a function when fields must stay reactive:
        </p>
        <div class="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <pre class="overflow-x-auto bg-zinc-950 p-4 text-[13px] text-zinc-100"><code>const conversationId = ref('abc')
const model = ref('gpt-4o')
const searchMode = ref(true)

const { aiMessages, input, handleSubmit, isStreaming } = useAiChat({
  api: '/api/chat',
  body: () => ({
    conversationId: conversationId.value,
    model: model.value,
    searchMode: searchMode.value,
  }),
})</code></pre>
        </div>
      </div>

      <div>
        <h2 class="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Manual Chat + DefaultChatTransport
        </h2>
        <p class="mb-3">
          For full control (custom transport class, <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">prepareSendMessagesRequest</code>,
          or sharing one <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">Chat</code> instance), instantiate the SDK directly
          and map messages with <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">toAiMessageProps</code>:
        </p>
        <div class="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <pre class="overflow-x-auto bg-zinc-950 p-4 text-[13px] text-zinc-100"><code>import { Chat } from '@ai-sdk/vue'
import { DefaultChatTransport } from 'ai'

const chat = new Chat({
  transport: new DefaultChatTransport({
    api: '/api/chat',
    prepareSendMessagesRequest: ({ messages, body }) => ({
      body: {
        ...body,
        messages,
        ragProfile: 'default',
      },
    }),
  }),
})

const aiMessages = computed(() =>
  chat.messages.map((msg, i) => {
    const isLast = i === chat.messages.length - 1
    const status = isLast && chat.status === 'streaming' ? 'streaming' : 'complete'
    return toAiMessageProps(msg, status)
  }),
)</code></pre>
        </div>
      </div>

      <div>
        <h2 class="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          RAG metadata on AiMessage
        </h2>
        <p class="mb-3">
          <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">toAiMessageProps</code>
          maps AI SDK <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">UIMessage</code>
          parts to <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">AiMessageProps</code>
          (content, reasoning, sources, toolCalls). For app-specific display fields, spread
          <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">metadata</code>
          or map domain sources into <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">AiSource[]</code>:
        </p>
        <div class="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <pre class="overflow-x-auto bg-zinc-950 p-4 text-[13px] text-zinc-100"><code>import type { AiMessageProps, AiSource } from 'ai-elements-nuxt/types'

function toDisplayMessage(msg: UIMessage, status: AiMessageProps['status']): AiMessageProps {
  const base = toAiMessageProps(msg, status)
  const ragSources = (msg.metadata?.sources ?? []) as Array&lt;{ id: string; title: string }&gt;

  return {
    ...base,
    sources: ragSources.map((s): AiSource =&gt; ({
      id: s.id,
      title: s.title,
      url: `/documents/${s.id}`,
    })),
    metadata: {
      ...base.metadata,
      searched: msg.metadata?.searched,
      latencyMs: msg.metadata?.latencyMs,
    },
  }
}</code></pre>
        </div>
        <p class="mt-3">
          Import types from
          <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">ai-elements-nuxt/types</code>
          in consumer apps (no Nuxt shim required).
        </p>
      </div>
    </section>
  </div>
</template>
