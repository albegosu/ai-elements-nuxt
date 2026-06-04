<script setup lang="ts">
definePageMeta({ layout: 'default' })
</script>

<template>
  <div>
    <DocsHeader
      title="Getting Started"
      description="Install ai-elements-nuxt and ship a streaming chat in minutes."
    />

    <section class="prose-zinc space-y-6 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
      <h2 class="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        1. Install
      </h2>
      <div class="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
        <pre class="overflow-x-auto bg-zinc-950 p-4 text-[13px] text-zinc-100"><code>pnpm add ai-elements-nuxt ai @ai-sdk/vue

# Or from GitHub if not on npm yet:
# pnpm add github:albegosu/ai-elements-nuxt</code></pre>
      </div>
      <p class="mt-2">
        Types for TypeScript:
        <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">import type { AiMessageProps } from 'ai-elements-nuxt/types'</code>.
        Agents: see
        <a href="https://github.com/albegosu/ai-elements-nuxt/blob/main/AGENTS.md" class="text-blue-600 dark:text-blue-400" target="_blank" rel="noopener">AGENTS.md</a>.
      </p>

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
        <pre class="overflow-x-auto bg-zinc-950 p-4 text-[13px] text-zinc-100"><code>import { createMockChatHandler } from 'ai-elements-nuxt/server'

export default createMockChatHandler()</code></pre>
      </div>
      <p>
        For production, swap in
        <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">createChatHandler({ model: openai('gpt-4o') })</code>
        with your provider package.
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
    </section>
  </div>
</template>
