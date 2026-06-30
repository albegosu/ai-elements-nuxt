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
          with tools, <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">stopWhen: isStepCount(n)</code>,
          and optional <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">requireConfirmation</code> per tool.
          Tool parameters use <a href="https://zod.dev" class="text-blue-600 dark:text-blue-400" target="_blank" rel="noopener">Zod</a> schemas — install with <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">pnpm add zod</code>.
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
      requireConfirmation: true,   // pauses for human approval
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
        <p class="mb-3">
          <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">useAiAgent</code> extends <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">useAiChat</code> with steps, plan, tasks, and a human-in-the-loop approval flow.
          <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">useAiTools</code> wires per-tool metadata and exposes <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">pendingApprovals</code> — already typed as <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">AiToolCall[]</code>, ready for <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">AiToolApproval</code>.
        </p>
        <div class="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <pre class="overflow-x-auto bg-zinc-950 p-4 text-[13px] text-zinc-100"><code>const agent = useAiAgent({ api: '/api/chat' })
const tools = useAiTools([
  { name: 'getWeather', icon: '🌤' },
  { name: 'deleteFile', requireConfirmation: true },
], agent)

const { aiMessages, steps, handleSubmit, input } = agent</code></pre>
        </div>
      </div>

      <div>
        <h2 class="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          UI: wiring tool approval
        </h2>
        <p class="mb-3">
          Use <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">tools.pendingApprovals</code> (from <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">useAiTools</code>) to drive <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">AiToolApproval</code> — it already carries the right <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">AiToolCall</code> shape including <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">approvalId</code>.
          Pass <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">tools.approveTool</code> / <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">tools.denyTool</code> directly — no manual ID extraction needed.
        </p>
        <div class="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <pre class="overflow-x-auto bg-zinc-950 p-4 text-[13px] text-zinc-100"><code>&lt;AiToolApproval
  v-if="tools.pendingApprovals.value[0]"
  :tool-call="tools.pendingApprovals.value[0]"
  @approve="tools.approveTool"
  @deny="tools.denyTool"
/&gt;

&lt;!-- Step timeline: AiAgent (also available as AiAgentSteps)
     renders the steps[] array from useAiAgent --&gt;
&lt;AiAgent :steps="steps" title="Agent run" /&gt;

&lt;AiMessage v-for="(msg, i) in aiMessages" :key="i" v-bind="msg" /&gt;
&lt;form @submit="handleSubmit"&gt;
  &lt;AiPromptInput v-model="input" /&gt;
&lt;/form&gt;</code></pre>
        </div>
        <div class="mt-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-900">
          <p class="text-xs text-zinc-600 dark:text-zinc-400">
            <strong class="text-zinc-900 dark:text-zinc-50">Naming note:</strong>
            <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">&lt;AiAgent&gt;</code> is a step-timeline display component — it renders the <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">steps</code> array from <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">useAiAgent</code>.
            It is also registered as <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">&lt;AiAgentSteps&gt;</code> if you prefer the more descriptive name.
            The composable <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">useAiAgent</code> manages the full execution state (streaming, tools, plan).
          </p>
        </div>
      </div>

      <div>
        <h2 class="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Other UI components
        </h2>
        <ul class="list-inside list-disc space-y-1">
          <li><code>AiTool</code> — per-tool lifecycle states (streaming args → result)</li>
          <li><code>AiApprovalPolicy</code> — declarative tool approval policies (auto-approve, auto-deny, user-approval)</li>
          <li><code>AiAgentTimeline</code> — rich timeline with duration, connectors, and nested children</li>
          <li><code>AiSandboxPreview</code> — sandbox stdout/stderr with artifacts (v7 sandbox sessions)</li>
          <li><code>AiPlan</code> / <code>AiTask</code> — manual plan/task state via <code>agent.setPlan</code> / <code>agent.setTasks</code></li>
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
