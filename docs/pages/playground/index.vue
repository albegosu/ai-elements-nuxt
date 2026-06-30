<script setup lang="ts">
definePageMeta({ layout: 'default' })

const input = ref('')
const selectedModel = ref('claude-sonnet-4-6')
const activeThreadId = ref('t2')

const threads = ref([
  { id: 't1', title: 'Nuxt setup guide', lastMessage: 'How do I add streaming?', updatedAt: '2h ago', messageCount: 6 },
  { id: 't2', title: 'What is RAG?', lastMessage: 'RAG combines retrieval with generation…', updatedAt: '12m ago', messageCount: 3 },
  { id: 't3', title: 'Tool approval flow', lastMessage: 'requireConfirmation: true', updatedAt: 'Yesterday', messageCount: 9 },
])

const messages = ref([
  {
    role: 'user' as const,
    content: 'What is RAG?',
    status: 'complete' as const,
  },
  {
    role: 'assistant' as const,
    content: 'RAG (Retrieval-Augmented Generation) is a technique that combines information retrieval with text generation to produce more accurate and grounded responses.',
    htmlContent: '<p><strong>RAG</strong> (Retrieval-Augmented Generation) is a technique that combines information retrieval with text generation to produce more accurate and grounded responses.</p>',
    status: 'complete' as const,
    reasoning: 'The user is asking about RAG. I should provide a clear and concise definition.',
    sources: [
      { id: '1', title: 'RAG Paper (Lewis et al.)', url: 'https://arxiv.org/abs/2005.11401', score: 0.95 },
      { id: '2', title: 'LangChain RAG Guide', score: 0.87 },
    ],
    toolCalls: [
      { id: 'tc1', name: 'searchKnowledgeBase', args: { query: 'RAG definition' }, result: { found: 3 }, status: 'result' as const },
    ],
  },
])

const suggestions = [
  { id: '1', label: 'How does RAG work?', value: 'How does RAG work?' },
  { id: '2', label: 'RAG vs fine-tuning', value: 'What is the difference between RAG and fine-tuning?' },
  { id: '3', label: 'Implement RAG', value: 'How do I implement RAG in my project?' },
]

const models = [
  { id: 'claude-sonnet-4-6', name: 'Claude Sonnet 4.6', provider: 'Anthropic', description: 'Fast & capable' },
  { id: 'claude-opus-4-6', name: 'Claude Opus 4.6', provider: 'Anthropic', description: 'Most capable' },
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', description: 'Multimodal' },
]

function handleSubmit(value: string) {
  messages.value.push({ role: 'user', content: value, status: 'complete' })
  input.value = ''
}

function handleSuggestion(suggestion: { value: string }) {
  handleSubmit(suggestion.value)
}

function selectThread(thread: { id: string }) {
  activeThreadId.value = thread.id
}
</script>

<template>
  <div>
    <DocsHeader
      title="Playground"
      description="Interactive demo showing multiple AI Elements components working together in a realistic chat interface."
    />

    <h2 class="mb-4 scroll-mt-24 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
      Full chat interface
    </h2>

    <div class="grid grid-cols-[200px_1fr] gap-0 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
      <!-- Conversation sidebar -->
      <div class="flex flex-col border-r border-zinc-200 dark:border-zinc-800">
        <AiConversation
          :threads="threads"
          :active-id="activeThreadId"
          @select="selectThread"
          @create="threads.unshift({ id: `t${Date.now()}`, title: 'New conversation', lastMessage: '', updatedAt: 'now', messageCount: 0 })"
        >
          <template #header="{ create }">
            <div class="flex items-center justify-between border-b border-zinc-200 px-3 py-2.5 dark:border-zinc-800">
              <span class="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Chats</span>
              <button
                type="button"
                class="flex h-5 w-5 items-center justify-center rounded text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
                @click="create"
              >
                <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button>
            </div>
          </template>
          <template #thread="{ thread, active, select }">
            <button
              type="button"
              class="w-full px-3 py-2 text-left transition"
              :class="active ? 'bg-zinc-100 dark:bg-zinc-800' : 'hover:bg-zinc-50 dark:hover:bg-zinc-900'"
              @click="select()"
            >
              <p class="truncate text-xs font-medium" :class="active ? 'text-zinc-900 dark:text-zinc-50' : 'text-zinc-600 dark:text-zinc-400'">{{ thread.title }}</p>
              <p v-if="thread.lastMessage" class="mt-0.5 truncate text-xs text-zinc-400 dark:text-zinc-600">{{ thread.lastMessage }}</p>
              <p class="mt-0.5 text-[11px] text-zinc-400 dark:text-zinc-600">{{ thread.updatedAt }}</p>
            </button>
          </template>
        </AiConversation>

        <!-- Model selector at the bottom of sidebar -->
        <div class="mt-auto border-t border-zinc-200 p-3 dark:border-zinc-800">
          <p class="mb-1.5 text-[11px] font-medium text-zinc-400">Model</p>
          <AiModelSelector v-model="selectedModel" :models="models">
            <template #trigger="{ selected, toggle }">
              <button
                type="button"
                class="flex w-full items-center justify-between rounded-lg border border-zinc-200 px-2 py-1.5 text-left transition hover:border-zinc-300 dark:border-zinc-700"
                @click="toggle"
              >
                <span class="truncate text-xs text-zinc-700 dark:text-zinc-300">{{ selected?.name ?? 'Select…' }}</span>
                <svg class="ml-1 h-3 w-3 shrink-0 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
            </template>
            <template #default="{ groupedModels, select, selectedId }">
              <div class="absolute bottom-full mb-1 w-48 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
                <template v-for="(models2, provider) in groupedModels" :key="provider">
                  <div class="px-3 py-1.5 text-xs font-medium text-zinc-400">{{ provider }}</div>
                  <button
                    v-for="m in models2"
                    :key="m.id"
                    type="button"
                    class="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs hover:bg-zinc-50 dark:hover:bg-zinc-800"
                    :class="{ 'bg-zinc-50 font-medium dark:bg-zinc-800': m.id === selectedId }"
                    @click="select(m)"
                  >{{ m.name }}</button>
                </template>
              </div>
            </template>
          </AiModelSelector>
        </div>
      </div>

      <!-- Main -->
      <div class="flex flex-col p-5">
        <div class="flex flex-col gap-4 pb-4">
          <AiMessage v-for="(msg, i) in messages" :key="i" v-bind="msg">
            <template #avatar="{ role }">
              <div
                class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium"
                :class="role === 'user' ? 'bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'"
              >
                {{ role === 'user' ? 'U' : 'AI' }}
              </div>
            </template>

            <template #reasoning="{ reasoning, isStreaming: streaming }">
              <AiReasoning :content="reasoning" :streaming="streaming">
                <template #trigger="{ toggle, collapsed }">
                  <button
                    type="button"
                    class="mb-2 flex items-center gap-1.5 text-xs text-zinc-400 transition hover:text-zinc-600"
                    @click="toggle"
                  >
                    <svg class="h-3.5 w-3.5 transition-transform" :class="{ '-rotate-90': collapsed }" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                    {{ collapsed ? 'Show reasoning' : 'Hide reasoning' }}
                  </button>
                </template>
                <template #default="{ content: reasoningText }">
                  <div class="mb-3 rounded-lg border-l-2 border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-500 dark:border-zinc-600 dark:bg-zinc-800/50">
                    {{ reasoningText }}
                  </div>
                </template>
              </AiReasoning>
            </template>

            <template #tool-calls="{ toolCalls }">
              <AiTool v-for="tc in toolCalls" :key="tc.id" :tool-call="tc">
                <template #header="{ toolCall: tc2 }">
                  <div class="mb-2 flex items-center gap-2">
                    <svg class="h-3.5 w-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l5.653-4.655m0 0a6.01 6.01 0 01-.738-1.776 6.011 6.011 0 01-.205-2.974l.642-2.763a.75.75 0 01.357-.442l2.523-1.407a.75.75 0 01.867.076l2.356 2.023a.75.75 0 01.076.867l-1.407 2.523a.75.75 0 01-.442.357l-2.763.642a6.01 6.01 0 01-2.974-.205 6.01 6.01 0 01-1.776-.738z" />
                    </svg>
                    <span class="font-mono text-xs text-zinc-500">{{ tc2.name }}</span>
                  </div>
                </template>
              </AiTool>
            </template>

            <template #content="{ htmlContent: html, content: text, isStreaming: streaming }">
              <div v-if="streaming && !text">
                <AiShimmer :lines="2" />
              </div>
              <div v-else-if="html" class="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300" v-html="html" />
              <div v-else class="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{{ text }}</div>
            </template>

            <template #sources="{ sources }">
              <div class="mt-3 border-t border-zinc-100 pt-3 dark:border-zinc-800">
                <AiSources :sources="sources">
                  <template #source="{ source }">
                    <a
                      v-if="source.url"
                      :href="source.url"
                      target="_blank"
                      class="mr-2 inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
                    >
                      {{ source.title }}
                    </a>
                    <span v-else class="mr-2 inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                      {{ source.title }}
                    </span>
                  </template>
                </AiSources>
              </div>
            </template>
          </AiMessage>
        </div>

        <AiSuggestion :suggestions="suggestions" @select="handleSuggestion">
          <template #default="{ suggestions: s, select }">
            <div class="mb-4 flex flex-wrap gap-2">
              <button
                v-for="suggestion in s"
                :key="suggestion.id"
                type="button"
                class="rounded-full border border-zinc-200 px-3 py-1.5 text-sm text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
                @click="select(suggestion)"
              >
                {{ suggestion.label }}
              </button>
            </div>
          </template>
        </AiSuggestion>

        <AiPromptInput
          v-model="input"
          placeholder="Ask something..."
          @submit="handleSubmit"
        >
          <template #input="{ value, placeholder: ph, handleInput, handleKeydown }">
            <textarea
              :value="value"
              :placeholder="ph"
              rows="2"
              class="flex-1 resize-none rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
              @input="handleInput"
              @keydown="handleKeydown"
            />
          </template>
          <template #actions="{ canSubmit, submit }">
            <button
              type="button"
              :disabled="!canSubmit"
              class="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900"
              @click="submit"
            >
              Send
            </button>
          </template>
        </AiPromptInput>
      </div>
    </div>
  </div>
</template>
