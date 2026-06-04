<script setup lang="ts">
const expandedTools = ref<Record<string, boolean>>({})

function toggleTool(id: string) {
  expandedTools.value = { ...expandedTools.value, [id]: !expandedTools.value[id] }
}

const tools = [
  { id: 'search', name: 'web_search', description: 'Search the web for current information using a query string' },
  { id: 'extract', name: 'extract_content', description: 'Extract and summarize content from a given URL' },
  { id: 'cite', name: 'create_citation', description: 'Generate a formatted citation from source metadata' },
]

const steps = [
  { id: '1', type: 'thought' as const, content: 'The user wants a summary of recent developments in edge computing. I should search for the latest news and technical articles.', status: 'completed' as const },
  { id: '2', type: 'action' as const, content: 'web_search("edge computing developments 2025")', tool: 'web_search', status: 'completed' as const },
  { id: '3', type: 'observation' as const, content: 'Found 12 relevant results including articles from Vercel, Cloudflare, and Deno blogs.', status: 'running' as const },
]
</script>

<template>
  <div class="space-y-4">
    <!-- Agent info card -->
    <div class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div class="flex items-start gap-3">
        <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
          <svg class="h-5 w-5 text-zinc-600 dark:text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
          </svg>
        </div>
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <span class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Research Assistant</span>
            <span class="rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">openai/gpt-5.2-pro</span>
          </div>
          <div class="mt-2.5 rounded-lg bg-zinc-50 p-3 text-sm text-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-400">
            You are a research assistant. Search the web, extract relevant content, and provide well-cited summaries.
          </div>
        </div>
      </div>

      <!-- Tools -->
      <div class="mt-4">
        <span class="text-xs font-medium text-zinc-500">Tools</span>
        <div class="mt-1.5 space-y-1">
          <div v-for="tool in tools" :key="tool.id">
            <button
              class="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
              @click="toggleTool(tool.id)"
            >
              <svg
                class="h-3.5 w-3.5 shrink-0 text-zinc-400 transition-transform duration-150"
                :class="{ 'rotate-90': expandedTools[tool.id] }"
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
              <span class="font-mono text-xs text-zinc-700 dark:text-zinc-300">{{ tool.name }}</span>
            </button>
            <div v-if="expandedTools[tool.id]" class="ml-8 mt-0.5 pb-1 text-xs text-zinc-500">
              {{ tool.description }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Agent steps -->
    <AiAgent :steps="steps" />
  </div>
</template>
