<script setup lang="ts">
definePageMeta({ layout: 'default' })
</script>

<template>
  <div>
    <DocsHeader
      title="Building an Agent"
      description="Multi-step tool use, human approval, and agent UI with createAgentHandler."
    />

    <section class="space-y-8 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
      <div>
        <h2 class="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          createAgentHandler
        </h2>
        <p class="mb-3">
          Server utility wrapping <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">streamText</code>
          with tools, <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">stopWhen: stepCountIs(n)</code>,
          and optional <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">needsApproval</code> per tool.
        </p>
        <div class="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <pre class="overflow-x-auto bg-zinc-950 p-4 text-[13px] text-zinc-100"><code>import { createAgentHandler } from 'ai-elements-nuxt/server'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'

export default createAgentHandler({
  model: openai('gpt-4o'),
  maxSteps: 10,
  tools: {
    getWeather: {
      description: 'Get weather for a city',
      parameters: z.object({ city: z.string() }),
      execute: async ({ city }) => ({ temp: 72, city }),
    },
    deleteFile: {
      description: 'Delete a file',
      parameters: z.object({ path: z.string() }),
      requireConfirmation: true,
      execute: async ({ path }) => ({ deleted: path }),
    },
  },
})</code></pre>
        </div>
      </div>

      <div>
        <h2 class="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Client: useAiAgent + useAiTools
        </h2>
        <div class="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <pre class="overflow-x-auto bg-zinc-950 p-4 text-[13px] text-zinc-100"><code>const agent = useAiAgent({ api: '/api/chat' })
const tools = useAiTools([
  { name: 'getWeather', icon: '🌤' },
  { name: 'deleteFile', requireConfirmation: true },
], agent)

const { aiMessages, steps, pendingConfirmation, approve, deny } = agent</code></pre>
        </div>
      </div>

      <div>
        <h2 class="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          UI components
        </h2>
        <ul class="list-inside list-disc space-y-1">
          <li><code>AiAgent</code> — step timeline (thought / action / observation)</li>
          <li><code>AiTool</code> — per-tool lifecycle states</li>
          <li><code>AiToolApproval</code> — approve / deny with optional editable args</li>
          <li><code>AiPlan</code> / <code>AiTask</code> — manual plan/task state via <code>setPlan</code> / <code>setTasks</code></li>
        </ul>
      </div>

      <p>
        See the
        <NuxtLink to="/playground/agent" class="text-blue-600 dark:text-blue-400">Agent playground</NuxtLink>
        for a working mock UI.
      </p>
    </section>
  </div>
</template>
