<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { messages, addMessage, aiMessages, input } = useAiChatLocal()
const isStreaming = ref(false)
const status = ref<'ready' | 'streaming'>('ready')
let _stopRequested = false

const DEMO_RESPONSES = [
  'RAG (Retrieval-Augmented Generation) combines a retrieval system with a language model. When you send a query, it first retrieves relevant document chunks from a vector store, then passes those chunks as context to the LLM — so the model can generate grounded, up-to-date answers without hallucinating.',
  'RAG works in four steps: (1) embed your documents and store the vectors, (2) embed the user query at runtime, (3) retrieve the top-k closest chunks by cosine similarity, and (4) inject them into the prompt as context before calling the model.',
  'You can implement RAG with the AI SDK using any vector database — Pinecone, pgvector, Qdrant, or even in-memory for prototypes. The `embed` and `embedMany` helpers handle vectorization, and `cosineSimilarity` lets you rank retrieved chunks before passing them to `streamText`.',
]
let _responseIdx = 0

function handleSubmit(event?: { preventDefault?: () => void }) {
  event?.preventDefault?.()
  const text = input.value.trim()
  if (!text || isStreaming.value) return
  addMessage({ role: 'user', content: text, status: 'complete' })
  input.value = ''
  void _simulateStream()
}

function stop() {
  _stopRequested = true
}

async function _simulateStream() {
  const response = DEMO_RESPONSES[_responseIdx % DEMO_RESPONSES.length]!
  _responseIdx++
  _stopRequested = false
  isStreaming.value = true
  status.value = 'streaming'

  await new Promise(r => setTimeout(r, 100))
  if (_stopRequested) { isStreaming.value = false; status.value = 'ready'; return }

  const msgIndex = messages.value.length
  addMessage({ role: 'assistant', content: '', status: 'streaming' })

  const chunkSize = 5
  for (let i = chunkSize; i <= response.length + chunkSize; i += chunkSize) {
    if (_stopRequested) break
    messages.value[msgIndex] = { role: 'assistant', content: response.slice(0, Math.min(i, response.length)), status: 'streaming' }
    await new Promise(r => setTimeout(r, 40))
  }

  const finalContent = messages.value[msgIndex]?.content ?? ''
  messages.value[msgIndex] = { role: 'assistant', content: finalContent, status: 'complete' }
  isStreaming.value = false
  status.value = 'ready'
}
</script>

<template>
  <div>
    <DocsHeader
      title="Streaming Chat"
      description="Simulated streaming using useAiChatLocal — no API key or server required."
    />

    <div class="mx-auto max-w-xl">
      <div class="mb-6 flex min-h-[200px] flex-col gap-4">
        <AiMessage
          v-for="(msg, i) in aiMessages"
          :key="i"
          v-bind="msg"
          :status="i === aiMessages.length - 1 && isStreaming ? 'streaming' : msg.status"
        >
          <template #avatar="{ role }">
            <div
              class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium"
              :class="role === 'user' ? 'bg-zinc-200 text-zinc-600 dark:bg-zinc-700' : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'"
            >
              {{ role === 'user' ? 'U' : 'AI' }}
            </div>
          </template>

          <template #reasoning="{ reasoning, isStreaming: streaming }">
            <AiReasoning v-if="reasoning" :content="reasoning" :streaming="streaming">
              <template #default="{ content: text }">
                <div class="mb-2 rounded-lg border-l-2 border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-500 dark:border-zinc-600 dark:bg-zinc-800/50">
                  {{ text }}
                </div>
              </template>
            </AiReasoning>
          </template>

          <template #content="{ content, isStreaming: streaming }">
            <AiShimmer v-if="streaming && !content" :lines="2" class="max-w-xs" />
            <div v-else-if="content" class="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              {{ content }}<AiStreamingCursor v-if="streaming" />
            </div>
          </template>
        </AiMessage>
      </div>

      <AiPromptInput
          v-model="input"
          :loading="isStreaming"
          placeholder="Ask anything..."
          @submit="handleSubmit"
          @stop="stop"
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
              {{ isStreaming ? 'Stop' : 'Send' }}
            </button>
          </template>
        </AiPromptInput>

      <p class="mt-3 text-xs text-zinc-400">
        Status: <span class="font-medium">{{ status }}</span>
      </p>
    </div>
  </div>
</template>
