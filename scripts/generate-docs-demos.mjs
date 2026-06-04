#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const demosRoot = path.join(__dirname, '../docs/components/demos')

/** @type {Record<string, Record<string, string>>} */
const demos = {
  chatbot: {
    message: `<template>
  <div class="flex max-w-md flex-col gap-3">
    <AiMessage role="user" content="What is RAG?" status="complete">
      <template #content="{ content }">
        <p class="rounded-lg bg-zinc-200 px-3 py-2 text-sm dark:bg-zinc-800">{{ content }}</p>
      </template>
    </AiMessage>
    <AiMessage role="assistant" content="RAG combines retrieval with generation." status="complete">
      <template #content="{ content }">
        <p class="text-sm text-zinc-700 dark:text-zinc-300">{{ content }}</p>
      </template>
    </AiMessage>
  </div>
</template>`,
    'prompt-input': `<script setup lang="ts">
const input = ref('')
</script>
<template>
  <AiPromptInput v-model="input" placeholder="Ask anything..." class="max-w-md">
    <template #actions="{ submit, canSubmit }">
      <button
        type="button"
        class="rounded-md bg-zinc-900 px-3 py-1.5 text-sm text-white disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900"
        :disabled="!canSubmit"
        @click="submit"
      >
        Send
      </button>
    </template>
  </AiPromptInput>
</template>`,
    conversation: `<script setup lang="ts">
const active = ref('1')
const threads = [
  { id: '1', title: 'What is RAG?', updatedAt: new Date(), messageCount: 3, active: true },
  { id: '2', title: 'Embeddings', updatedAt: new Date(), messageCount: 8 },
]
</script>
<template>
  <AiConversation :threads="threads" :active-id="active" @select="t => active = t.id">
    <template #thread="{ thread, active: isActive, select }">
      <button
        type="button"
        class="mb-1 w-full rounded-md px-3 py-2 text-left text-sm"
        :class="isActive ? 'bg-zinc-200 font-medium dark:bg-zinc-800' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/50'"
        @click="select"
      >
        {{ thread.title }}
      </button>
    </template>
  </AiConversation>
</template>`,
    reasoning: `<template>
  <AiReasoning content="Searching knowledge base for relevant documents..." :collapsed="false" />
</template>`,
    shimmer: `<template>
  <AiShimmer :lines="3" class="max-w-sm" />
</template>`,
    sources: `<script setup lang="ts">
const sources = [
  { id: '1', title: 'RAG Paper', url: 'https://arxiv.org/abs/2005.11401', score: 0.95 },
  { id: '2', title: 'LangChain Guide', score: 0.87 },
]
</script>
<template>
  <AiSources :sources="sources">
    <template #source="{ source }">
      <a :href="source.url" class="block text-sm text-blue-600 hover:underline">{{ source.title }}</a>
    </template>
  </AiSources>
</template>`,
    tool: `<script setup lang="ts">
const toolCall = { id: '1', name: 'searchKnowledgeBase', args: { query: 'RAG' }, result: { found: 3 }, status: 'output-available' as const }
</script>
<template>
  <AiTool :tool-call="toolCall">
    <template #header>
      <span class="font-mono text-sm">searchKnowledgeBase</span>
    </template>
  </AiTool>
</template>`,
    suggestion: `<script setup lang="ts">
const suggestions = [
  { id: '1', label: 'How does RAG work?', value: 'How does RAG work?' },
  { id: '2', label: 'RAG vs fine-tuning', value: 'Compare RAG and fine-tuning' },
]
</script>
<template>
  <AiSuggestion :suggestions="suggestions">
    <template #suggestion="{ suggestion, select }">
      <button type="button" class="rounded-full border border-zinc-300 px-3 py-1 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800" @click="select">
        {{ suggestion.label }}
      </button>
    </template>
  </AiSuggestion>
</template>`,
    plan: `<script setup lang="ts">
const steps = [
  { id: '1', title: 'Parse query', status: 'completed' as const },
  { id: '2', title: 'Retrieve docs', status: 'in_progress' as const },
  { id: '3', title: 'Generate answer', status: 'pending' as const },
]
</script>
<template>
  <AiPlan :steps="steps" title="Agent plan" />
</template>`,
    task: `<script setup lang="ts">
const task = { id: '1', title: 'Ingest PDFs', status: 'in_progress' as const, progress: 65, subtasks: [
  { id: 'a', title: 'Extract text', status: 'completed' as const },
  { id: 'b', title: 'Embed chunks', status: 'in_progress' as const },
]}
</script>
<template>
  <AiTask :task="task" />
</template>`,
    checkpoint: `<script setup lang="ts">
const checkpoint = { id: '1', title: 'Index ready', status: 'passed' as const, timestamp: new Date().toISOString() }
</script>
<template>
  <AiCheckpoint :checkpoint="checkpoint" />
</template>`,
    confirmation: `<script setup lang="ts">
const confirmation = { id: '1', title: 'Delete conversation?', description: 'This cannot be undone.', confirmLabel: 'Delete', denyLabel: 'Cancel', destructive: true }
</script>
<template>
  <AiConfirmation :confirmation="confirmation">
    <template #actions="{ confirm, deny }">
      <div class="flex gap-2">
        <button type="button" class="rounded-md border px-3 py-1.5 text-sm" @click="deny">Cancel</button>
        <button type="button" class="rounded-md bg-red-600 px-3 py-1.5 text-sm text-white" @click="confirm">Delete</button>
      </div>
    </template>
  </AiConfirmation>
</template>`,
    context: `<script setup lang="ts">
const items = [
  { id: '1', type: 'system' as const, title: 'System prompt', tokenCount: 450 },
  { id: '2', type: 'document' as const, title: 'doc.pdf chunk 3', tokenCount: 1200 },
]
</script>
<template>
  <AiContext :items="items" :collapsed="false" />
</template>`,
    queue: `<script setup lang="ts">
const items = [
  { id: '1', content: 'How does RAG work?', status: 'completed' as const, position: 1 },
  { id: '2', content: 'Compare vector DBs', status: 'processing' as const, position: 2 },
]
</script>
<template>
  <AiQueue :items="items" />
</template>`,
    'model-selector': `<script setup lang="ts">
const model = ref('claude-sonnet')
const models = [
  { id: 'claude-sonnet', name: 'Claude Sonnet', provider: 'Anthropic' },
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI' },
]
</script>
<template>
  <AiModelSelector v-model="model" :models="models">
    <template #trigger="{ selected }">
      <button type="button" class="rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700">
        {{ selected?.name ?? 'Select model' }}
      </button>
    </template>
  </AiModelSelector>
</template>`,
    'inline-citation': `<script setup lang="ts">
const citation = { id: '1', sourceId: 's1', sourceTitle: 'RAG Paper', text: '...', index: 1 }
</script>
<template>
  <p class="text-sm">RAG combines retrieval with generation <AiInlineCitation :citation="citation" /></p>
</template>`,
    attachments: `<script setup lang="ts">
const attachments = [
  { id: '1', name: 'diagram.png', type: 'image' as const, previewUrl: 'https://placehold.co/80x80' },
  { id: '2', name: 'notes.pdf', type: 'document' as const },
]
</script>
<template>
  <AiAttachments :attachments="attachments" layout="grid" />
</template>`,
    'chain-of-thought': `<script setup lang="ts">
const steps = [
  { id: '1', label: 'Understand query', status: 'complete' as const },
  { id: '2', label: 'Search documents', status: 'active' as const },
  { id: '3', label: 'Synthesize answer', status: 'pending' as const },
]
</script>
<template>
  <AiChainOfThought :steps="steps" title="Reasoning" />
</template>`,
    'streaming-cursor': `<template>
  <span class="text-sm">Generating response<AiStreamingCursor /></span>
</template>`,
    'tool-approval': `<script setup lang="ts">
const toolCall = { id: '1', name: 'deleteFile', args: { path: '/tmp/data' }, status: 'approval-requested' as const, approvalId: 'a1' }
</script>
<template>
  <AiToolApproval :tool-call="toolCall">
    <template #actions="{ approve, deny }">
      <div class="flex gap-2">
        <button type="button" class="rounded-md border px-3 py-1.5 text-sm" @click="deny">Deny</button>
        <button type="button" class="rounded-md bg-zinc-900 px-3 py-1.5 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900" @click="approve">Approve</button>
      </div>
    </template>
  </AiToolApproval>
</template>`,
    'error-boundary': `<script setup lang="ts">
const error = 'Failed to stream response'
</script>
<template>
  <AiErrorBoundary :error="error">
    <template #default>
      <p class="text-sm text-red-600">{{ error }}</p>
    </template>
  </AiErrorBoundary>
</template>`,
  },
  code: {
    'code-block': `<script setup lang="ts">
const code = \`const answer = await streamText({
  model: anthropic('claude-sonnet'),
  prompt: 'Hello',
})\`
</script>
<template>
  <AiCodeBlock :code="code" language="typescript" filename="chat.ts" />
</template>`,
    terminal: `<script setup lang="ts">
const lines = [
  { type: 'command' as const, content: 'pnpm add ai' },
  { type: 'output' as const, content: 'Done in 2s' },
]
</script>
<template>
  <AiTerminal :lines="lines" />
</template>`,
    agent: `<script setup lang="ts">
const steps = [
  { id: '1', type: 'thought' as const, content: 'Planning search...', status: 'completed' as const },
  { id: '2', type: 'action' as const, content: 'search()', tool: 'search', status: 'running' as const },
]
</script>
<template>
  <AiAgent :steps="steps" />
</template>`,
    artifact: `<script setup lang="ts">
const artifacts = [{ id: '1', title: 'index.ts', type: 'code' as const, content: 'export {}', language: 'typescript' }]
</script>
<template>
  <AiArtifact :artifacts="artifacts" />
</template>`,
    'file-tree': `<script setup lang="ts">
const nodes = [{ name: 'src', type: 'directory' as const, path: 'src', expanded: true, children: [
  { name: 'app.vue', type: 'file' as const, path: 'src/app.vue', selected: true },
]}]
</script>
<template>
  <AiFileTree :nodes="nodes" />
</template>`,
    'stack-trace': `<script setup lang="ts">
const frames = [{ file: 'api/chat.post.ts', line: 42, function: 'handler', isApp: true }]
</script>
<template>
  <AiStackTrace error="TypeError: Cannot read property" :frames="frames" />
</template>`,
    snippet: `<template>
  <AiSnippet code="pnpm add ai-elements-nuxt" language="bash" label="install" />
</template>`,
    commit: `<script setup lang="ts">
const commit = { hash: 'a9fefb5', message: 'feat: add docs', author: 'dev', date: new Date().toISOString(), files: [
  { path: 'docs/app.vue', status: 'added' as const, additions: 10, deletions: 0 },
]}
</script>
<template>
  <AiCommit :commit="commit" />
</template>`,
    'env-vars': `<script setup lang="ts">
const variables = [
  { key: 'AI_GATEWAY_API_KEY', value: 'sk-***', secret: true },
  { key: 'NUXT_PUBLIC_APP_URL', value: 'http://localhost:3000' },
]
</script>
<template>
  <AiEnvVars :variables="variables" />
</template>`,
    'package-info': `<script setup lang="ts">
const pkg = { name: 'ai', version: '6.0.0', description: 'AI SDK', dependencies: { '@ai-sdk/vue': '^3.0.0' } }
</script>
<template>
  <AiPackageInfo :package="pkg" />
</template>`,
    'schema-display': `<script setup lang="ts">
const fields = [{ name: 'query', type: 'string', required: true }, { name: 'topK', type: 'number', default: '5' }]
</script>
<template>
  <AiSchemaDisplay :fields="fields" title="SearchRequest" />
</template>`,
    'test-results': `<script setup lang="ts">
const tests = [
  { id: '1', name: 'streams response', status: 'passed' as const, duration: 120 },
  { id: '2', name: 'handles errors', status: 'failed' as const, duration: 45, error: 'timeout' },
]
</script>
<template>
  <AiTestResults :tests="tests" />
</template>`,
    sandbox: `<template>
  <AiSandbox code="<p>Hello RAG</p>" language="html" title="Preview" />
</template>`,
    'vue-preview': `<template>
  <AiVuePreview html="<div class='p-4'><strong>Vue preview</strong></div>" title="Component" />
</template>`,
    'web-preview': `<template>
  <AiWebPreview html="<div style='padding:16px'>Web preview</div>" title="Preview" height="200px" />
</template>`,
  },
  voice: {
    'audio-player': `<template>
  <AiAudioPlayer src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" title="Sample">
    <template #default="{ toggle, isPlaying }">
      <button type="button" class="rounded-full border border-zinc-300 px-4 py-2 text-sm" @click="toggle">
        {{ isPlaying ? 'Pause' : 'Play' }}
      </button>
    </template>
  </AiAudioPlayer>
</template>`,
    'speech-input': `<template>
  <AiSpeechInput>
    <template #default="{ toggle, isListening, isSupported }">
      <button type="button" class="rounded-full border px-4 py-2 text-sm" :disabled="!isSupported" @click="toggle">
        {{ isListening ? 'Stop' : 'Speak' }}
      </button>
    </template>
  </AiSpeechInput>
</template>`,
    transcription: `<script setup lang="ts">
const segments = [
  { id: '1', text: 'Hello world', startTime: 0, endTime: 2 },
  { id: '2', text: 'How can I help?', startTime: 2.5, endTime: 4 },
]
const time = ref(1)
</script>
<template>
  <AiTranscription :segments="segments" :current-time="time" highlight-active />
</template>`,
    'voice-selector': `<script setup lang="ts">
const voice = ref('v1')
const voices = [{ id: 'v1', name: 'Aria', language: 'en-US' }, { id: 'v2', name: 'Marcus', language: 'en-US' }]
</script>
<template>
  <AiVoiceSelector v-model="voice" :voices="voices" />
</template>`,
    'mic-selector': `<script setup lang="ts">
const device = ref('')
</script>
<template>
  <AiMicSelector v-model="device" />
</template>`,
    persona: `<template>
  <AiPersona name="Research Assistant" description="Searches academic papers" :active="true" />
</template>`,
  },
  workflow: {
    canvas: `<template>
  <AiCanvas height="240px" class="relative overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
    <AiNode id="n1" label="Query" :x="40" :y="80" status="completed" />
    <AiNode id="n2" label="Retrieve" :x="200" :y="80" status="running" />
  </AiCanvas>
</template>`,
    node: `<template>
  <div class="relative h-24">
    <AiNode id="demo" label="Embed Query" :x="20" :y="20" status="running" />
  </div>
</template>`,
    edge: `<template>
  <svg width="200" height="100" class="overflow-visible">
    <AiEdge id="e1" :source-x="10" :source-y="50" :target-x="180" :target-y="50" label="flow" />
  </svg>
</template>`,
    connection: `<template>
  <svg width="160" height="80" class="overflow-visible">
    <AiConnection :source-x="10" :source-y="40" :target-x="140" :target-y="40" :active="true" />
  </svg>
</template>`,
    controls: `<template>
  <AiControls :zoom="1" position="bottom-right" />
</template>`,
    panel: `<template>
  <AiPanel title="Node details" position="right" class="max-w-xs">
    <p class="text-sm text-zinc-600">Configure retrieval settings.</p>
  </AiPanel>
</template>`,
    toolbar: `<template>
  <AiToolbar>
    <button type="button" class="rounded px-2 py-1 text-sm hover:bg-zinc-200 dark:hover:bg-zinc-800">Add</button>
    <button type="button" class="rounded px-2 py-1 text-sm hover:bg-zinc-200 dark:hover:bg-zinc-800">Run</button>
  </AiToolbar>
</template>`,
  },
  utilities: {
    markdown: `<template>
  <AiMarkdown content="# Hello\\n\\nSupports **bold** and \`code\`." class="prose prose-sm dark:prose-invert" />
</template>`,
    image: `<template>
  <AiImage src="https://placehold.co/400x200" alt="Architecture diagram" :zoomable="true" />
</template>`,
    'open-in-chat': `<template>
  <AiOpenInChat content="Explain this snippet" label="Ask in chat" />
</template>`,
  },
}

for (const [category, slugDemos] of Object.entries(demos)) {
  const dir = path.join(demosRoot, category)
  fs.mkdirSync(dir, { recursive: true })
  for (const [slug, body] of Object.entries(slugDemos)) {
    fs.writeFileSync(path.join(dir, `${slug}.vue`), body.trim() + '\n')
  }
}

console.log('Generated demo components.')
