<script setup lang="ts">
definePageMeta({ layout: 'default' })

const codeExample = `import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

const result = await streamText({
  model: openai('gpt-4o'),
  prompt: 'What is RAG?',
  instructions: 'You are a helpful assistant.',
})`

const terminalLines = [
  { type: 'command' as const, content: 'pnpm add ai-elements-nuxt ai @ai-sdk/vue' },
  { type: 'output' as const, content: 'Packages: +148' },
  { type: 'output' as const, content: '✓ Done in 2.1s' },
]

const agentSteps = [
  { id: '1', type: 'thought' as const, content: 'Planning search strategy for the query…', status: 'completed' as const },
  { id: '2', type: 'action' as const, content: 'searchKnowledgeBase("RAG definition")', tool: 'searchKnowledgeBase', status: 'completed' as const },
  { id: '3', type: 'observation' as const, content: 'Found 3 relevant chunks with score > 0.85', status: 'running' as const },
]

const fileTreeNodes = [
  {
    path: 'src', name: 'src', type: 'directory' as const, expanded: true,
    children: [
      {
        path: 'src/server', name: 'server', type: 'directory' as const, expanded: true,
        children: [
          { path: 'src/server/chat.post.ts', name: 'chat.post.ts', type: 'file' as const },
        ],
      },
      {
        path: 'src/components', name: 'components', type: 'directory' as const, expanded: true,
        children: [
          { path: 'src/components/ChatView.vue', name: 'ChatView.vue', type: 'file' as const },
        ],
      },
    ],
  },
  { path: 'nuxt.config.ts', name: 'nuxt.config.ts', type: 'file' as const },
]

function fileColor(name: string) {
  if (name.endsWith('.vue')) return 'text-green-500 dark:text-green-400'
  if (name.endsWith('.ts')) return 'text-blue-500 dark:text-blue-400'
  return 'text-zinc-400'
}

const artifacts = [
  {
    id: 'chat',
    title: 'ChatView.vue',
    type: 'code' as const,
    language: 'vue',
    content: `<script setup lang="ts">
const { aiMessages, input, handleSubmit, isStreaming } = useAiChat({ api: '/api/chat' })
<\/script>

<template>
  <AiMessage v-for="(msg, i) in aiMessages" :key="i" v-bind="msg">
    <template #content="{ content, isStreaming: streaming }">
      {{ content }}<AiStreamingCursor v-if="streaming" />
    </template>
  </AiMessage>
  <AiPromptInput v-model="input" :loading="isStreaming" @submit="handleSubmit" />
</template>`,
  },
  {
    id: 'server',
    title: 'chat.post.ts',
    type: 'code' as const,
    language: 'typescript',
    content: `import { createChatHandler } from 'ai-elements-nuxt/server'
import { openai } from '@ai-sdk/openai'

export default createChatHandler({
  model: openai('gpt-4o'),
  instructions: 'You are a helpful assistant.',
})`,
  },
  {
    id: 'config',
    title: 'nuxt.config.ts',
    type: 'code' as const,
    language: 'typescript',
    content: `export default defineNuxtConfig({
  modules: ['ai-elements-nuxt'],
  aiElements: {
    defaultStyles: true,
  },
})`,
  },
]

const snippetCode = `import type { AiMessageProps } from 'ai-elements-nuxt/types'`

const commit = {
  hash: 'ba25499',
  message: 'feat: improve consumer DX with types export and dynamic chat body',
  author: 'albegosu',
  date: new Date('2024-06-04'),
  files: [
    { path: 'src/runtime/types/index.ts', status: 'modified' as const, additions: 24, deletions: 3 },
    { path: 'src/runtime/composables/useAiChat.ts', status: 'modified' as const, additions: 18, deletions: 5 },
    { path: 'src/module.ts', status: 'modified' as const, additions: 8, deletions: 2 },
    { path: 'README.md', status: 'modified' as const, additions: 45, deletions: 12 },
  ],
}

const envVars = [
  { key: 'OPENAI_API_KEY', value: 'sk-proj-xxxxxxxxxxxxxxxx', type: 'secret' as const, required: true, description: 'OpenAI API key for chat completions' },
  { key: 'AI_MODEL', value: 'gpt-4o', type: 'string' as const, required: false, description: 'Default model to use' },
  { key: 'MAX_TOKENS', value: '2048', type: 'number' as const, required: false, description: 'Maximum tokens per response' },
  { key: 'ENABLE_STREAMING', value: 'true', type: 'boolean' as const, required: false, description: 'Enable streaming responses' },
]

const tests = [
  { name: 'initializes without API key', status: 'passed' as const, duration: 12, suite: 'useAiChat' },
  { name: 'handles submit and clears input', status: 'passed' as const, duration: 8, suite: 'useAiChat' },
  { name: 'converts UIMessage to AiMessageProps', status: 'passed' as const, duration: 5, suite: 'mapMessageParts' },
  { name: 'renders content slot correctly', status: 'passed' as const, duration: 18, suite: 'AiMessage' },
  { name: 'restores persisted messages on mount', status: 'failed' as const, duration: 24, suite: 'useAiChatPersisted', error: 'Expected 3 messages, received 0' },
  { name: 'sanitizes XSS in markdown output', status: 'passed' as const, duration: 3, suite: 'useAiMarkdown' },
]

const stackFrames = [
  { file: 'src/runtime/utils/mapMessageParts.ts', line: 42, column: 12, function: 'toAiMessageProps', code: "return { id: msg.id, role: msg.role, content: msg.content ?? '' }" },
  { file: 'src/runtime/composables/useAiChat.ts', line: 87, function: 'computed' },
  { file: 'node_modules/@ai-sdk/vue/dist/index.js', line: 234, function: 'Chat.messages.get' },
]
</script>

<template>
  <div>
    <DocsHeader
      title="Code Components"
      description="Code blocks, terminals, artifacts, and dev tooling UI working together."
    />

    <div class="space-y-8">
      <!-- CodeBlock -->
      <section>
        <h2 class="mb-3 scroll-mt-24 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">CodeBlock</h2>
        <div class="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <AiCodeBlock :code="codeExample" language="typescript" filename="server/api/chat.post.ts" :highlight-lines="[4, 5, 6]" />
        </div>
      </section>

      <!-- Terminal + FileTree -->
      <div class="grid gap-5 sm:grid-cols-2">
        <section>
          <h2 class="mb-3 scroll-mt-24 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Terminal</h2>
          <div class="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
            <AiTerminal :lines="terminalLines" title="zsh">
              <template #line="{ line }">
                <div class="flex items-start gap-2 px-4 py-0.5">
                  <span v-if="line.type === 'command'" class="shrink-0 select-none font-mono text-xs text-emerald-400">$</span>
                  <span class="font-mono text-xs" :class="line.type === 'command' ? 'text-zinc-100' : 'text-zinc-500'">{{ line.content }}</span>
                </div>
              </template>
            </AiTerminal>
          </div>
        </section>

        <section>
          <h2 class="mb-3 scroll-mt-24 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">File Tree</h2>
          <div class="rounded-xl border border-zinc-200 bg-zinc-950 px-2 py-3 font-mono text-sm dark:border-zinc-800">
            <AiFileTree :nodes="fileTreeNodes">
              <template #icon="{ node }">
                <svg v-if="node.type === 'directory'" class="h-3.5 w-3.5 shrink-0 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                </svg>
                <svg v-else class="h-3.5 w-3.5 shrink-0" :class="fileColor(node.name)" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </template>
              <template #name="{ node }">
                <span class="text-xs" :class="node.type === 'directory' ? 'font-medium text-zinc-200' : fileColor(node.name)">{{ node.name }}</span>
              </template>
            </AiFileTree>
          </div>
        </section>
      </div>

      <!-- Artifact -->
      <section>
        <h2 class="mb-3 scroll-mt-24 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Artifact</h2>
        <div class="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <AiArtifact :artifacts="artifacts" />
        </div>
      </section>

      <!-- Snippet + Commit -->
      <div class="grid gap-5 sm:grid-cols-2">
        <section>
          <h2 class="mb-3 scroll-mt-24 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Snippet</h2>
          <AiSnippet :code="snippetCode" language="typescript" label="types import" />
        </section>

        <section>
          <h2 class="mb-3 scroll-mt-24 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Commit</h2>
          <div class="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
            <AiCommit :commit="commit" :expanded="true" />
          </div>
        </section>
      </div>

      <!-- EnvVars + TestResults -->
      <div class="grid gap-5 sm:grid-cols-2">
        <section>
          <h2 class="mb-3 scroll-mt-24 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Env Vars</h2>
          <div class="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
            <AiEnvVars :variables="envVars" />
          </div>
        </section>

        <section>
          <h2 class="mb-3 scroll-mt-24 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Test Results</h2>
          <div class="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
            <AiTestResults :tests="tests" />
          </div>
        </section>
      </div>

      <!-- StackTrace -->
      <section>
        <h2 class="mb-3 scroll-mt-24 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Stack Trace</h2>
        <div class="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <AiStackTrace
            error="Cannot read properties of undefined (reading 'id')"
            error-type="TypeError"
            :frames="stackFrames"
          />
        </div>
      </section>

      <!-- Agent -->
      <section>
        <h2 class="mb-3 scroll-mt-24 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Agent</h2>
        <div class="overflow-hidden rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
          <AiAgent :steps="agentSteps" title="RAG Agent" />
        </div>
      </section>
    </div>
  </div>
</template>
