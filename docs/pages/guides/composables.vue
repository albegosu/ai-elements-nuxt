<script setup lang="ts">
definePageMeta({ layout: 'default' })

const items = [
  {
    name: 'useAiChat(options?)',
    desc: 'With api: wraps @ai-sdk/vue Chat. Without api: local-only messages. Returns aiMessages, input, handleSubmit, isStreaming, tool helpers.',
    snippet: `const chat = useAiChat({ api: '/api/chat' })`,
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
    name: 'useAiMarkdown(content, options?)',
    desc: 'Markdown to sanitized HTML (marked + GFM). Override parse or use exported simpleParse.',
    snippet: `const { html } = useAiMarkdown(() => markdownSource)`,
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
