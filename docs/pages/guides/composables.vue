<script setup lang="ts">
definePageMeta({ layout: 'default' })

const items = [
  {
    name: 'useAiChat(options?)',
    desc: 'With api: wraps @ai-sdk/vue Chat + DefaultChatTransport. Supports body, headers, credentials (plain or () => ({ ... })) for dynamic requests. Without api: local-only messages.',
    snippet: `const chat = useAiChat({
  api: '/api/chat',
  body: () => ({ conversationId: id.value, model: model.value }),
})`,
  },
  {
    name: 'useAiChatLocal(options?)',
    desc: 'Local message array for demos and custom backends. Same surface shape as useAiChat without network.',
    snippet: `const chat = useAiChatLocal({ initialMessages: [] })`,
  },
  {
    name: 'useAiChatPersisted(options?)',
    desc: 'Persists local-only chats to localStorage/sessionStorage. With api, persistence hooks are no-ops.',
    snippet: `const chat = useAiChatPersisted({ key: 'chat', storage: 'localStorage' })`,
  },
  {
    name: 'useAiAgent(options?)',
    desc: 'Agent steps, plan, tasks, pendingConfirmation, approve/deny on top of useAiChat.',
    snippet: `const agent = useAiAgent({ api: '/api/chat' })`,
  },
  {
    name: 'useAiTools(defs, agent)',
    desc: 'Declarative per-tool metadata; pendingApprovals, getToolMeta, approveTool/denyTool.',
    snippet: `const tools = useAiTools([{ name: 'search' }], agent)`,
  },
  {
    name: 'useAiWorkflow(data?, options?)',
    desc: 'Graph state: nodes, edges, selection, add/remove/move, canConnect, toJSON/fromJSON.',
    snippet: `const wf = useAiWorkflow({ nodes: [], edges: [] })`,
  },
  {
    name: 'useAiCompletion(options?)',
    desc: 'Thin wrapper around @ai-sdk/vue useCompletion.',
    snippet: `const { completion, complete } = useAiCompletion({ api: '/api/completion' })`,
  },
  {
    name: 'useAiRealtime(options)',
    desc: 'Vue composable wrapping AI SDK v7 AbstractRealtimeSession. Manages connection lifecycle, audio capture/playback, and message state with Vue reactivity. Auto-cleanup on scope dispose.',
    snippet: `const { status, messages, isCapturing, isPlaying, connect, disconnect, toggleCapture } = useAiRealtime({
  model: realtimeModel,
  token: sessionToken,
})`,
  },
  {
    name: 'useAiMarkdown(content, options?)',
    desc: 'Markdown to sanitized HTML (GFM via marked, sanitized). Pass { parse: simpleParse } for a lightweight fallback that skips tables — useful during streaming when marked\'s buffering causes layout shifts. simpleParse is auto-imported in Nuxt.',
    snippet: `// Default (GFM + tables via marked):
const { html } = useAiMarkdown(() => markdownSource)

// Lightweight fallback during streaming (no tables, no marked):
const { html } = useAiMarkdown(() => markdownSource, { parse: simpleParse })`,
  },
]
</script>

<template>
  <div>
    <DocsHeader
      title="Composables"
      description="API reference for chat, agent, workflow, and markdown composables."
    />

    <section class="space-y-10 text-sm text-zinc-600 dark:text-zinc-400">
      <p class="leading-relaxed">
        Utilities
        <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">toAiMessageProps</code>
        and
        <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">mapMessageParts</code>
        are auto-imported. For RAG and custom transports see
        <NuxtLink to="/guides/custom-transport" class="text-blue-600 dark:text-blue-400">Custom Transport &amp; RAG</NuxtLink>.
      </p>
      <article v-for="item in items" :key="item.name">
        <h2 class="mb-1 font-mono text-base font-semibold text-zinc-900 dark:text-zinc-50">
          {{ item.name }}
        </h2>
        <p class="mb-3 leading-relaxed">
          {{ item.desc }}
        </p>
        <div class="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <pre class="overflow-x-auto bg-zinc-950 p-4 text-[13px] leading-relaxed text-zinc-100"><code>{{ item.snippet }}</code></pre>
        </div>
      </article>
    </section>
  </div>
</template>
