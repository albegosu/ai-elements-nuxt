<script setup lang="ts">
import { categories } from '~/data/navigation'

definePageMeta({ layout: 'default' })

const totalComponents = categories.reduce((n, c) => n + c.components.length, 0)

const categoryIcons: Record<string, string> = {
  chatbot: 'M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z',
  code: 'M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5',
  voice: 'M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z',
  workflow: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z',
  utilities: 'M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l5.653-4.655m0 0a6.01 6.01 0 01-.738-1.776 6.011 6.011 0 01-.205-2.974l.642-2.763a.75.75 0 01.357-.442l2.523-1.407a.75.75 0 01.867.076l2.356 2.023a.75.75 0 01.076.867l-1.407 2.523a.75.75 0 01-.442.357l-2.763.642a6.01 6.01 0 01-2.974-.205 6.01 6.01 0 01-1.776-.738z',
}
</script>

<template>
  <div>
    <!-- Hero -->
    <div class="pb-10">
      <div class="flex items-center gap-3">
        <span class="rounded-full bg-zinc-900 px-3 py-1 text-xs font-medium text-white dark:bg-zinc-100 dark:text-zinc-900">
          v1.2.0
        </span>
        <span class="rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
          {{ totalComponents }} components
        </span>
      </div>

      <h1 class="mt-6 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
        AI Elements for Nuxt
      </h1>
      <p class="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
        Headless Vue components for AI-native apps. Conversations, tools, code blocks, voice, and workflows.
        Style them with Tailwind or your own design system via
        <code class="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-sm dark:bg-zinc-800">data-ai-*</code> hooks.
        Coding agents: use
        <a
          href="https://github.com/albegosu/ai-elements-nuxt/blob/main/AGENTS.md"
          class="text-blue-600 underline dark:text-blue-400"
          target="_blank"
          rel="noopener noreferrer"
        >AGENTS.md</a>
        as the implementation guide.
      </p>

      <div class="mt-8 flex flex-wrap gap-3 text-sm">
        <NuxtLink
          to="/guides/getting-started"
          class="inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-5 py-2.5 font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          Read guides
        </NuxtLink>
        <NuxtLink
          to="/playground"
          class="inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-5 py-2.5 font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          Open playground
        </NuxtLink>
        <NuxtLink
          to="/components"
          class="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Browse components
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </NuxtLink>
        <a
          href="https://www.npmjs.com/package/ai-elements-nuxt"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-5 py-2.5 font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          npm
          <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        </a>
        <a
          href="https://github.com/albegosu/ai-elements-nuxt"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-5 py-2.5 font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
          </svg>
          GitHub
        </a>
        <a
          href="https://elements.ai-sdk.dev/components"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-5 py-2.5 font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          React reference
          <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        </a>
      </div>
    </div>

    <!-- Categories -->
    <section class="border-t border-zinc-200 pt-10 dark:border-zinc-800">
      <h2 class="mb-6 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        Categories
      </h2>
      <div class="grid gap-4 sm:grid-cols-2">
        <NuxtLink
          v-for="category in categories"
          :key="category.id"
          :to="`/components/${category.id}/${category.components[0]?.slug}`"
          class="group flex gap-4 rounded-xl border border-zinc-200 p-5 transition hover:border-zinc-400 hover:shadow-sm dark:border-zinc-800 dark:hover:border-zinc-600"
        >
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500 transition group-hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:group-hover:bg-zinc-700">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" :d="categoryIcons[category.id] ?? ''" />
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-zinc-900 dark:text-zinc-50">
              {{ category.label }}
            </h3>
            <p class="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {{ category.description }}
            </p>
            <p class="mt-2 text-xs font-medium text-zinc-500">
              {{ category.components.length }} components
              <svg class="mb-px ml-0.5 inline h-3 w-3 transition group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </p>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- Quick Start -->
    <section class="mt-12">
      <h2 class="mb-6 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        Quick start
      </h2>

      <div class="space-y-4">
        <div class="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div class="flex items-center gap-2 border-b border-zinc-200 bg-zinc-50 px-4 py-2.5 dark:border-zinc-800 dark:bg-zinc-900">
            <span class="text-xs font-medium text-zinc-500">1. Install</span>
          </div>
          <pre class="overflow-x-auto bg-zinc-950 p-4 text-[13px] leading-relaxed text-zinc-100"><code>pnpm add ai-elements-nuxt ai @ai-sdk/vue</code></pre>
        </div>

        <div class="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div class="flex items-center gap-2 border-b border-zinc-200 bg-zinc-50 px-4 py-2.5 dark:border-zinc-800 dark:bg-zinc-900">
            <span class="text-xs font-medium text-zinc-500">2. Configure</span>
            <span class="rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">nuxt.config.ts</span>
          </div>
          <pre class="overflow-x-auto bg-zinc-950 p-4 text-[13px] leading-relaxed text-zinc-100"><code>export default defineNuxtConfig({
  modules: ['ai-elements-nuxt'],
  aiElements: { defaultStyles: true },
})</code></pre>
        </div>

        <div class="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div class="flex items-center gap-2 border-b border-zinc-200 bg-zinc-50 px-4 py-2.5 dark:border-zinc-800 dark:bg-zinc-900">
            <span class="text-xs font-medium text-zinc-500">3. Use</span>
            <span class="rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">app.vue</span>
          </div>
          <pre class="overflow-x-auto bg-zinc-950 p-4 text-[13px] leading-relaxed text-zinc-100"><code>&lt;script setup&gt;
const { aiMessages, input, handleSubmit } = useAiChat({ api: '/api/chat' })
&lt;/script&gt;

&lt;template&gt;
  &lt;AiMessage v-for="msg in aiMessages" :key="msg.id" v-bind="msg" /&gt;
  &lt;form @submit="handleSubmit"&gt;
    &lt;AiPromptInput v-model="input" /&gt;
  &lt;/form&gt;
&lt;/template&gt;</code></pre>
        </div>
      </div>
    </section>

    <!-- Philosophy -->
    <section class="mt-12 border-t border-zinc-200 pt-10 dark:border-zinc-800">
      <h2 class="mb-6 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        Philosophy
      </h2>
      <div class="grid gap-4 sm:grid-cols-3">
        <div class="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
          <div class="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
            <svg class="h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
            </svg>
          </div>
          <h3 class="font-semibold text-zinc-900 dark:text-zinc-50">Headless</h3>
          <p class="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">
            Slot-driven components with <code class="font-mono text-xs">data-ai-*</code> attributes. No forced design system.
          </p>
        </div>
        <div class="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
          <div class="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
            <svg class="h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
            </svg>
          </div>
          <h3 class="font-semibold text-zinc-900 dark:text-zinc-50">Compatible</h3>
          <p class="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">
            Follows AI SDK <code class="font-mono text-xs">UIMessage.parts</code> contract. Works with any provider.
          </p>
        </div>
        <div class="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
          <div class="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
            <svg class="h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
            </svg>
          </div>
          <h3 class="font-semibold text-zinc-900 dark:text-zinc-50">Nuxt-native</h3>
          <p class="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">
            Module auto-imports, Nitro server helpers, and full TypeScript support out of the box.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
