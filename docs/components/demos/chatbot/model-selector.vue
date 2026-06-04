<script setup lang="ts">
const model = ref('claude-sonnet')
const models = [
  { id: 'claude-sonnet', name: 'Claude Sonnet', provider: 'Anthropic', description: 'Balanced speed and intelligence' },
  { id: 'claude-opus', name: 'Claude Opus', provider: 'Anthropic', description: 'Most capable reasoning' },
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', description: 'Fast multimodal model' },
]
const isOpen = ref(true)
</script>

<template>
  <AiModelSelector v-model="model" :models="models">
    <template #trigger="{ selected, toggle }">
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
        @click="toggle"
      >
        <svg class="size-4 text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
        </svg>
        <span class="font-medium text-zinc-900 dark:text-zinc-100">{{ selected?.name ?? 'Select model' }}</span>
        <span v-if="selected" class="rounded-md bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">{{ selected.provider }}</span>
        <svg class="size-4 text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
    </template>

    <template #search>
      <span />
    </template>

    <template #default="{ groupedModels, select, selectedId }">
      <div class="mt-2 w-72 divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-white shadow-lg dark:divide-zinc-800 dark:border-zinc-700 dark:bg-zinc-900">
        <template v-for="(groupModels, provider) in groupedModels" :key="provider">
          <div class="p-2">
            <div v-if="provider" class="px-2 pb-1.5 pt-1 text-xs font-medium text-zinc-500">{{ provider }}</div>
            <button
              v-for="m in groupModels"
              :key="m.id"
              type="button"
              class="flex w-full items-start gap-2.5 rounded-lg px-2 py-2 text-left transition-colors"
              :class="m.id === selectedId ? 'bg-zinc-100 dark:bg-zinc-800' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'"
              @click="select(m)"
            >
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium text-zinc-900 dark:text-zinc-100">{{ m.name }}</span>
                  <svg v-if="m.id === selectedId" class="size-3.5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <p v-if="m.description" class="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{{ m.description }}</p>
              </div>
            </button>
          </div>
        </template>
      </div>
    </template>
  </AiModelSelector>
</template>
