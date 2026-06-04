<script setup lang="ts">
const expanded = ref(true)

function linkHostname(url?: string) {
  if (!url) return ''
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

const steps = [
  {
    id: '1',
    label: 'Analyzing user query',
    status: 'complete' as const,
    description: 'Parsing intent and extracting key entities from the question.',
  },
  {
    id: '2',
    label: 'Searching knowledge base',
    status: 'complete' as const,
    description: 'Retrieved 4 relevant documents from vector store.',
    searchResults: [
      { id: 's1', title: 'RAG: Retrieval-Augmented Generation for Knowledge-Intensive Tasks', url: 'https://arxiv.org/abs/2005.11401' },
      { id: 's2', title: 'Building RAG Applications with LangChain', url: 'https://www.github.com/langchain-ai/langchain' },
      { id: 's3', title: 'Embeddings and Vector Search Explained', url: 'https://www.pinecone.io/learn/vector-search' },
    ],
  },
  {
    id: '3',
    label: 'Generating visual diagram',
    status: 'active' as const,
    description: 'Creating a system architecture overview.',
    images: [
      { id: 'img1', src: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop', alt: 'Architecture diagram' },
    ],
  },
  {
    id: '4',
    label: 'Synthesizing final answer',
    status: 'pending' as const,
  },
]
</script>

<template>
  <div class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
    <AiChainOfThought :steps="steps" title="Reasoning">
      <template #header="{ title: headerTitle, stepCount }">
        <button
          type="button"
          class="mb-4 flex w-full items-center gap-2 text-left"
          @click="expanded = !expanded"
        >
          <svg class="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
          </svg>
          <span class="text-sm font-medium text-zinc-700 dark:text-zinc-300">{{ headerTitle }}</span>
          <span class="rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">{{ stepCount }} steps</span>
          <svg
            class="ml-auto h-4 w-4 text-zinc-400 transition-transform"
            :class="{ 'rotate-180': !expanded }"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
      </template>

      <template v-if="expanded" #default="{ steps: allSteps }">
        <li
          v-for="(step, i) in allSteps"
          :key="step.id"
          class="relative flex gap-3"
          :class="{ 'pb-5': i < allSteps.length - 1 }"
        >
          <!-- Timeline line -->
          <div class="flex flex-col items-center">
            <div
              class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
              :class="{
                'bg-zinc-900 dark:bg-zinc-100': step.status === 'complete',
                'border-2 border-zinc-400 bg-white dark:border-zinc-500 dark:bg-zinc-900': step.status === 'active',
                'border-2 border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900': step.status === 'pending',
              }"
            >
              <svg v-if="step.status === 'complete'" class="h-3 w-3 text-white dark:text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              <div v-if="step.status === 'active'" class="h-1.5 w-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
            </div>
            <div
              v-if="i < allSteps.length - 1"
              class="mt-1 w-px flex-1 bg-zinc-200 dark:bg-zinc-700"
            />
          </div>

          <!-- Content -->
          <div class="min-w-0 flex-1 pt-0.5">
            <p class="text-sm font-medium text-zinc-700 dark:text-zinc-300">{{ step.label }}</p>
            <p v-if="step.description" class="mt-0.5 text-xs text-zinc-500">{{ step.description }}</p>

            <!-- Source pills -->
            <div v-if="step.searchResults?.length" class="mt-2 flex flex-wrap gap-1.5">
              <a
                v-for="result in step.searchResults"
                :key="result.id"
                :href="result.url"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
              >
                <svg class="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                </svg>
                {{ linkHostname(result.url) }}
              </a>
            </div>

            <!-- Image -->
            <div v-if="step.images?.length" class="mt-2">
              <img
                v-for="img in step.images"
                :key="img.id"
                :src="img.src"
                :alt="img.alt ?? ''"
                class="h-24 w-full rounded-lg border border-zinc-200 object-cover dark:border-zinc-700"
              />
            </div>
          </div>
        </li>
      </template>
    </AiChainOfThought>
  </div>
</template>
