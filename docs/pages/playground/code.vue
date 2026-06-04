<script setup lang="ts">
definePageMeta({ layout: 'default' })

const codeExample = `import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

const result = await streamText({
  model: openai('gpt-4o'),
  prompt: 'What is RAG?',
})`

const terminalLines = [
  { type: 'command' as const, content: 'pnpm add ai-elements-nuxt ai @ai-sdk/vue' },
  { type: 'output' as const, content: 'Packages: +148' },
  { type: 'output' as const, content: 'Done in 2.1s' },
]

const agentSteps = [
  { id: '1', type: 'thought' as const, content: 'Planning search strategy…', status: 'completed' as const },
  { id: '2', type: 'action' as const, content: 'search("RAG definition")', tool: 'search', status: 'running' as const },
]
</script>

<template>
  <div>
    <DocsHeader
      title="Code Components"
      description="Code blocks, terminals, agents, and dev tooling UI working together."
    />

    <div class="space-y-8">
      <section>
        <h2 class="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50">CodeBlock</h2>
        <div class="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <AiCodeBlock :code="codeExample" language="typescript" filename="index.ts" :highlight-lines="[4, 5, 6]" />
        </div>
      </section>

      <section>
        <h2 class="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50">Terminal</h2>
        <div class="max-w-lg overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <AiTerminal :lines="terminalLines" title="zsh" />
        </div>
      </section>

      <section>
        <h2 class="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50">Agent</h2>
        <AiAgent :steps="agentSteps" title="RAG Agent" />
      </section>
    </div>
  </div>
</template>
