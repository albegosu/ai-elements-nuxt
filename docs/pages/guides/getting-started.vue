<script setup lang="ts">
definePageMeta({ layout: 'default' })
</script>

<template>
  <div>
    <DocsHeader
      title="Getting Started"
      description="Install ai-elements-nuxt and ship a streaming chat in minutes."
    />

    <section class="prose-zinc space-y-8 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
      <h2 class="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        1. Install
      </h2>

      <div>
        <p class="mb-2 font-medium text-zinc-700 dark:text-zinc-300">Core (always required)</p>
        <div class="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <pre class="overflow-x-auto bg-zinc-950 p-4 text-[13px] text-zinc-100"><code>pnpm add ai-elements-nuxt ai @ai-sdk/vue</code></pre>
        </div>
        <p class="mt-2 text-xs text-zinc-500">
          Available on
          <a
            href="https://www.npmjs.com/package/ai-elements-nuxt"
            class="text-blue-600 dark:text-blue-400"
            target="_blank"
            rel="noopener"
          >npm</a>
          as <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">ai-elements-nuxt</code>.
        </p>
      </div>

      <div>
        <p class="mb-2 font-medium text-zinc-700 dark:text-zinc-300">Choose a model provider <span class="font-normal text-zinc-500">(at least one required for production)</span></p>
        <div class="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <pre class="overflow-x-auto bg-zinc-950 p-4 text-[13px] text-zinc-100"><code>pnpm add @ai-sdk/openai        # OpenAI / GPT-4o
# pnpm add @ai-sdk/anthropic   # Anthropic / Claude
# pnpm add @ai-sdk/google      # Google / Gemini
# pnpm add @ai-sdk/mistral     # Mistral</code></pre>
        </div>
        <p class="mt-2 text-zinc-500">
          Full provider list →
          <a href="https://ai-sdk.dev/providers/ai-sdk-providers" class="text-blue-600 dark:text-blue-400" target="_blank" rel="noopener">ai-sdk.dev/providers</a>
        </p>
      </div>

      <div>
        <p class="mb-2 font-medium text-zinc-700 dark:text-zinc-300">Agents only</p>
        <div class="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <pre class="overflow-x-auto bg-zinc-950 p-4 text-[13px] text-zinc-100"><code>pnpm add zod   # for tool parameter schemas</code></pre>
        </div>
      </div>

      <div class="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900">
        <p class="mb-2 font-medium text-zinc-700 dark:text-zinc-300">Set your API key</p>
        <div class="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <pre class="overflow-x-auto bg-zinc-950 p-4 text-[13px] text-zinc-100"><code># .env
OPENAI_API_KEY=sk-...</code></pre>
        </div>
        <p class="mt-2 text-xs text-zinc-500">
          Nuxt reads <code>.env</code> automatically — <code>process.env.OPENAI_API_KEY</code> is available in server routes.
          See the <a href="https://ai-sdk.dev/providers/ai-sdk-providers/openai" class="text-blue-600 dark:text-blue-400" target="_blank" rel="noopener">AI SDK provider docs</a> for each provider's env variable name.
        </p>
      </div>

      <div>
        <p class="mb-2 font-medium text-zinc-700 dark:text-zinc-300">Install from GitHub (optional)</p>
        <p class="mb-2 text-xs text-zinc-500">
          Use the latest commit from the repository instead of the npm release:
        </p>
        <div class="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <pre class="overflow-x-auto bg-zinc-950 p-4 text-[13px] text-zinc-100"><code>pnpm add github:albegosu/ai-elements-nuxt</code></pre>
        </div>
        <p class="mt-2 text-xs text-zinc-500">
          With strict pnpm build settings, allow lifecycle scripts in <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">pnpm-workspace.yaml</code>:
          <code class="block mt-1 rounded bg-zinc-100 px-2 py-1 dark:bg-zinc-800">allowBuilds: { ai-elements-nuxt: true }</code>
        </p>
      </div>

      <h2 class="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        2. Register the module
      </h2>
      <div class="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
        <pre class="overflow-x-auto bg-zinc-950 p-4 text-[13px] text-zinc-100"><code>// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['ai-elements-nuxt'],
  aiElements: { defaultStyles: true },
})</code></pre>
      </div>

      <h2 class="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        3. Add a chat API route
      </h2>
      <p>Create <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">server/api/chat.post.ts</code>:</p>
      <div class="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
        <pre class="overflow-x-auto bg-zinc-950 p-4 text-[13px] text-zinc-100"><code>// Start with mock (no API key needed):
import { createMockChatHandler } from 'ai-elements-nuxt/server'
export default createMockChatHandler()

// Swap for production:
// import { createChatHandler } from 'ai-elements-nuxt/server'
// import { openai } from '@ai-sdk/openai'
// export default createChatHandler({ model: openai('gpt-4o') })</code></pre>
      </div>
      <p class="text-xs text-zinc-500">
        Need an agent with tools?
        <NuxtLink to="/guides/building-an-agent" class="text-blue-600 dark:text-blue-400">Building an Agent</NuxtLink>
        covers <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">createAgentHandler</code> + <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">zod</code> schemas.
      </p>

      <h2 class="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        4. Build the page
      </h2>
      <div class="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
        <pre class="overflow-x-auto bg-zinc-950 p-4 text-[13px] text-zinc-100"><code>&lt;script setup lang="ts"&gt;
const { aiMessages, input, handleSubmit, isStreaming } = useAiChat({ api: '/api/chat' })
&lt;/script&gt;

&lt;template&gt;
  &lt;AiMessage v-for="(msg, i) in aiMessages" :key="i" v-bind="msg" /&gt;
  &lt;form @submit="handleSubmit"&gt;
    &lt;AiPromptInput v-model="input" :loading="isStreaming" /&gt;
  &lt;/form&gt;
&lt;/template&gt;</code></pre>
      </div>

      <p>
        Try the live demo on
        <NuxtLink to="/playground/streaming" class="text-blue-600 dark:text-blue-400">Streaming playground</NuxtLink>.
      </p>

      <h2 class="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        What do you need?
      </h2>
      <div class="overflow-x-auto">
        <table class="w-full border-collapse text-xs">
          <thead>
            <tr class="border-b border-zinc-200 dark:border-zinc-700">
              <th class="pb-2 pr-4 text-left font-semibold text-zinc-900 dark:text-zinc-50">Goal</th>
              <th class="pb-2 pr-4 text-left font-semibold text-zinc-900 dark:text-zinc-50">Key components</th>
              <th class="pb-2 pr-4 text-left font-semibold text-zinc-900 dark:text-zinc-50">Composable</th>
              <th class="pb-2 text-left font-semibold text-zinc-900 dark:text-zinc-50">Server handler</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-100 dark:divide-zinc-800">
            <tr>
              <td class="py-2 pr-4 font-medium text-zinc-700 dark:text-zinc-300">Streaming chat</td>
              <td class="py-2 pr-4"><code>AiMessage</code>, <code>AiPromptInput</code></td>
              <td class="py-2 pr-4"><code>useAiChat</code></td>
              <td class="py-2"><code>createChatHandler</code></td>
            </tr>
            <tr>
              <td class="py-2 pr-4 font-medium text-zinc-700 dark:text-zinc-300">Agent with tools</td>
              <td class="py-2 pr-4">+ <code>AiAgent</code>, <code>AiTool</code>, <code>AiToolApproval</code></td>
              <td class="py-2 pr-4"><code>useAiAgent</code>, <code>useAiTools</code></td>
              <td class="py-2"><code>createAgentHandler</code></td>
            </tr>
            <tr>
              <td class="py-2 pr-4 font-medium text-zinc-700 dark:text-zinc-300">Persisted chat</td>
              <td class="py-2 pr-4">same as chat</td>
              <td class="py-2 pr-4"><code>useAiChatPersisted</code></td>
              <td class="py-2">same as chat</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
