<script setup lang="ts">
const input = ref('')
const selectedModel = ref('claude-sonnet-4-6')

const messages = ref([
  {
    role: 'user' as const,
    content: 'What is RAG?',
    status: 'complete' as const,
  },
  {
    role: 'assistant' as const,
    content: 'RAG (Retrieval-Augmented Generation) is a technique that combines information retrieval with text generation.',
    htmlContent: '<p><strong>RAG</strong> (Retrieval-Augmented Generation) is a technique that combines information retrieval with text generation.</p>',
    status: 'complete' as const,
    reasoning: 'The user is asking about RAG. I should provide a clear and concise definition covering both the retrieval and generation aspects.',
    sources: [
      { id: '1', title: 'RAG Paper (Lewis et al.)', url: 'https://arxiv.org/abs/2005.11401', score: 0.95 },
      { id: '2', title: 'LangChain RAG Guide', score: 0.87 },
    ],
    toolCalls: [
      { id: 'tc1', name: 'searchKnowledgeBase', args: { query: 'RAG definition' }, result: { found: 3 }, status: 'result' as const },
    ],
  },
  {
    role: 'assistant' as const,
    content: '',
    status: 'streaming' as const,
    reasoning: 'Processing the follow-up question...',
  },
])

const suggestions = [
  { id: '1', label: 'How does RAG work?', value: 'How does RAG work?' },
  { id: '2', label: 'RAG vs fine-tuning', value: 'What is the difference between RAG and fine-tuning?' },
  { id: '3', label: 'Implement RAG', value: 'How do I implement RAG in my project?' },
]

const threads = [
  { id: '1', title: 'What is RAG?', updatedAt: new Date(), messageCount: 3, active: true },
  { id: '2', title: 'Embedding strategies', updatedAt: new Date(Date.now() - 86400000), messageCount: 8 },
  { id: '3', title: 'Vector DB comparison', updatedAt: new Date(Date.now() - 172800000), messageCount: 12, archived: true },
]

const models = [
  { id: 'claude-sonnet-4-6', name: 'Claude Sonnet 4.6', provider: 'Anthropic', description: 'Fast & capable' },
  { id: 'claude-opus-4-6', name: 'Claude Opus 4.6', provider: 'Anthropic', description: 'Most capable' },
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', description: 'Multimodal' },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', provider: 'Google', description: 'Long context' },
]

const planSteps = [
  { id: '1', title: 'Parse user query', status: 'completed' as const },
  { id: '2', title: 'Search knowledge base', status: 'completed' as const, children: [
    { id: '2a', title: 'Vector search', status: 'completed' as const },
    { id: '2b', title: 'BM25 search', status: 'completed' as const },
  ]},
  { id: '3', title: 'Rerank results', status: 'in_progress' as const },
  { id: '4', title: 'Generate response', status: 'pending' as const },
]

const task = {
  id: 't1',
  title: 'Ingest documents',
  description: 'Processing uploaded PDF files',
  status: 'in_progress' as const,
  progress: 65,
  subtasks: [
    { id: 's1', title: 'Extract text', status: 'completed' as const },
    { id: 's2', title: 'Chunk content', status: 'completed' as const },
    { id: 's3', title: 'Generate embeddings', status: 'in_progress' as const },
    { id: 's4', title: 'Store in vector DB', status: 'pending' as const },
  ],
}

const checkpoint = {
  id: 'cp1',
  title: 'RAG pipeline initialized',
  description: 'All documents indexed and ready for queries',
  status: 'passed' as const,
  timestamp: new Date().toISOString(),
}

const confirmation = ref<{ id: string; title: string; description: string; confirmLabel: string; denyLabel: string; destructive: boolean } | null>({
  id: 'c1',
  title: 'Delete conversation?',
  description: 'This will permanently delete the conversation and all its messages.',
  confirmLabel: 'Delete',
  denyLabel: 'Keep',
  destructive: true,
})

const contextItems = [
  { id: 'ctx1', type: 'system' as const, title: 'System prompt', tokenCount: 450 },
  { id: 'ctx2', type: 'document' as const, title: 'RAG_paper.pdf — Chunk 3', tokenCount: 1200 },
  { id: 'ctx3', type: 'document' as const, title: 'langchain_guide.md — Chunk 1', tokenCount: 890 },
  { id: 'ctx4', type: 'memory' as const, title: 'User preference: concise answers', tokenCount: 45 },
]

const queueItems = [
  { id: 'q1', content: 'How does RAG work?', status: 'completed' as const, position: 1 },
  { id: 'q2', content: 'Compare vector databases', status: 'processing' as const, position: 2 },
  { id: 'q3', content: 'Show me a code example', status: 'queued' as const, position: 3 },
]

const citations = [
  { id: 'cit1', sourceId: '1', sourceTitle: 'RAG Paper (Lewis et al.)', text: 'RAG combines retrieval with generation...', url: 'https://arxiv.org/abs/2005.11401', index: 1 },
  { id: 'cit2', sourceId: '2', sourceTitle: 'LangChain Guide', text: 'The retrieval step uses vector similarity...', index: 2 },
]

const activeThread = ref('1')

function handleSubmit(value: string) {
  messages.value.push({ role: 'user', content: value, status: 'complete' })
  input.value = ''
}

function handleSuggestion(suggestion: { value: string }) {
  handleSubmit(suggestion.value)
}

function handleConfirm(id: string) {
  console.log('Confirmed:', id)
  confirmation.value = null
}

function handleDeny(id: string) {
  console.log('Denied:', id)
  confirmation.value = null
}
</script>

<template>
  <div style="max-width: 1200px; margin: 0 auto; padding: 24px; font-family: system-ui, sans-serif;">
    <h1 style="margin-bottom: 8px;">AI Elements Nuxt — Playground</h1>
    <p style="color: #666; margin-bottom: 8px;">All 17 chatbot components rendered headless</p>
    <nav style="margin-bottom: 32px; display: flex; gap: 16px; font-size: 14px;">
      <NuxtLink to="/streaming">Streaming (AI SDK)</NuxtLink>
      <NuxtLink to="/code">Code</NuxtLink>
      <NuxtLink to="/voice-workflow">Voice & Workflow</NuxtLink>
    </nav>

    <div style="display: grid; grid-template-columns: 280px 1fr; gap: 24px;">
      <!-- Sidebar -->
      <div>
        <!-- Model Selector -->
        <section style="margin-bottom: 24px;">
          <h3 style="font-size: 12px; text-transform: uppercase; color: #999; margin-bottom: 8px;">Model</h3>
          <AiModelSelector v-model="selectedModel" :models="models">
            <template #trigger="{ selected, toggle }">
              <button
                @click="toggle"
                style="width: 100%; text-align: left; padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px; background: white; cursor: pointer;"
              >
                {{ selected?.name ?? 'Select...' }}
                <span style="float: right; color: #999;">▼</span>
              </button>
            </template>
            <template #default="{ groupedModels, select, selectedId }">
              <div style="border: 1px solid #ddd; border-radius: 6px; margin-top: 4px; background: white; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                <template v-for="(models2, provider) in groupedModels" :key="provider">
                  <div style="padding: 4px 12px; font-size: 11px; color: #999; text-transform: uppercase;">{{ provider }}</div>
                  <button
                    v-for="m in models2"
                    :key="m.id"
                    @click="select(m)"
                    style="display: block; width: 100%; text-align: left; padding: 6px 12px; border: none; background: transparent; cursor: pointer;"
                    :style="{ fontWeight: m.id === selectedId ? 'bold' : 'normal' }"
                  >
                    {{ m.name }} <span style="color: #999; font-size: 12px;">{{ m.description }}</span>
                  </button>
                </template>
              </div>
            </template>
          </AiModelSelector>
        </section>

        <!-- Conversations -->
        <section>
          <h3 style="font-size: 12px; text-transform: uppercase; color: #999; margin-bottom: 8px;">Threads</h3>
          <AiConversation :threads="threads" :active-id="activeThread" @select="t => activeThread = t.id" @create="() => {}">
            <template #header />
            <template #thread="{ thread, active, select }">
              <button
                @click="select"
                style="display: block; width: 100%; text-align: left; padding: 8px 12px; border: none; border-radius: 6px; cursor: pointer; margin-bottom: 4px;"
                :style="{ background: active ? '#e8f0fe' : '#f5f5f5', fontWeight: active ? '600' : '400' }"
              >
                {{ thread.title }}
                <span style="float: right; font-size: 12px; color: #999;">{{ thread.messageCount }}</span>
              </button>
            </template>
          </AiConversation>
        </section>

        <!-- Context -->
        <section style="margin-top: 24px;">
          <h3 style="font-size: 12px; text-transform: uppercase; color: #999; margin-bottom: 8px;">Context</h3>
          <AiContext :items="contextItems" :collapsed="false">
            <template #trigger />
            <template #item="{ item }">
              <div style="padding: 4px 0; font-size: 13px; display: flex; justify-content: space-between;">
                <span>
                  <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 6px;"
                    :style="{ background: item.type === 'system' ? '#9333ea' : item.type === 'document' ? '#2563eb' : '#16a34a' }"
                  />
                  {{ item.title }}
                </span>
                <span style="color: #999; font-size: 11px;">{{ item.tokenCount }}t</span>
              </div>
            </template>
          </AiContext>
        </section>
      </div>

      <!-- Main -->
      <div>
        <!-- Messages -->
        <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px;">
          <AiMessage
            v-for="(msg, i) in messages"
            :key="i"
            v-bind="msg"
          >
            <template #avatar="{ role }">
              <div style="font-size: 20px; margin-bottom: 4px;">
                {{ role === 'user' ? '👤' : '🤖' }}
              </div>
            </template>

            <template #reasoning="{ reasoning, isStreaming: streaming }">
              <AiReasoning :content="reasoning" :streaming="streaming">
                <template #trigger="{ toggle, collapsed, streaming: s }">
                  <button
                    @click="toggle"
                    style="font-size: 12px; color: #888; cursor: pointer; background: none; border: 1px solid #ddd; padding: 2px 8px; border-radius: 4px; margin-bottom: 8px;"
                  >
                    {{ s ? '⏳ Thinking...' : collapsed ? '▶ Show reasoning' : '▼ Hide reasoning' }}
                  </button>
                </template>
                <template #default="{ content: reasoningText }">
                  <div style="font-size: 13px; color: #666; background: #f8f8f8; padding: 8px 12px; border-radius: 4px; margin-bottom: 8px; border-left: 3px solid #ddd;">
                    {{ reasoningText }}
                  </div>
                </template>
              </AiReasoning>
            </template>

            <template #tool-calls="{ toolCalls }">
              <AiTool v-for="tc in toolCalls" :key="tc.id" :tool-call="tc">
                <template #header="{ toolCall: tc2 }">
                  <div style="font-size: 12px; background: #f0f0f0; padding: 4px 8px; border-radius: 4px; margin-bottom: 4px;">
                    🔧 {{ tc2.name }}
                  </div>
                </template>
                <template #result="{ result }">
                  <div style="font-size: 12px; color: #666;">Result: {{ JSON.stringify(result) }}</div>
                </template>
              </AiTool>
            </template>

            <template #content="{ htmlContent: html, content: text, isStreaming: streaming }">
              <div v-if="streaming" style="color: #999;">
                <AiShimmer :lines="2" />
              </div>
              <div v-else-if="html" v-html="html" />
              <div v-else>{{ text }}</div>
            </template>

            <template #sources="{ sources }">
              <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee;">
                <AiSources :sources="sources">
                  <template #source="{ source }">
                    <a
                      v-if="source.url"
                      :href="source.url"
                      target="_blank"
                      style="font-size: 12px; color: #0066cc; margin-right: 8px;"
                    >
                      📄 {{ source.title }}
                      <AiInlineCitation
                        :citation="{ id: source.id, sourceId: source.id, sourceTitle: source.title, text: '', index: citations.findIndex(c => c.sourceId === source.id) + 1 }"
                        @click="() => {}"
                      >
                        <template #badge="{ index }">
                          <sup style="color: #0066cc; cursor: pointer;">[{{ index }}]</sup>
                        </template>
                        <template #tooltip="{ citation: c }">
                          <div style="position: absolute; background: #333; color: white; padding: 6px 10px; border-radius: 4px; font-size: 11px; max-width: 200px; z-index: 10;">
                            {{ c.sourceTitle }}
                          </div>
                        </template>
                      </AiInlineCitation>
                    </a>
                    <span v-else style="font-size: 12px; color: #666; margin-right: 8px;">
                      📄 {{ source.title }}
                    </span>
                  </template>
                </AiSources>
              </div>
            </template>
          </AiMessage>
        </div>

        <!-- Plan -->
        <section style="margin-bottom: 24px; padding: 16px; background: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
          <h3 style="font-size: 12px; text-transform: uppercase; color: #999; margin-bottom: 12px;">Plan</h3>
          <AiPlan :steps="planSteps" title="RAG Pipeline Execution">
            <template #header="{ title: t, completed, total }">
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <strong>{{ t }}</strong>
                <span style="font-size: 13px; color: #666;">{{ completed }}/{{ total }} done</span>
              </div>
            </template>
            <template #step="{ step }">
              <div style="display: flex; align-items: center; gap: 8px; padding: 4px 0;">
                <span style="width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px;"
                  :style="{
                    background: step.status === 'completed' ? '#16a34a' : step.status === 'in_progress' ? '#2563eb' : '#e5e7eb',
                    color: step.status === 'pending' ? '#666' : 'white'
                  }"
                >
                  {{ step.status === 'completed' ? '✓' : step.status === 'in_progress' ? '▶' : '○' }}
                </span>
                <span :style="{ textDecoration: step.status === 'completed' ? 'line-through' : 'none', color: step.status === 'completed' ? '#999' : '#333' }">
                  {{ step.title }}
                </span>
              </div>
            </template>
          </AiPlan>
        </section>

        <!-- Task -->
        <section style="margin-bottom: 24px; padding: 16px; background: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
          <h3 style="font-size: 12px; text-transform: uppercase; color: #999; margin-bottom: 12px;">Task</h3>
          <AiTask :task="task">
            <template #header="{ task: t }">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <span style="width: 8px; height: 8px; border-radius: 50; background: #2563eb; animation: pulse 1.5s infinite;" />
                <strong>{{ t.title }}</strong>
              </div>
            </template>
            <template #description="{ task: t }">
              <div style="font-size: 13px; color: #666; margin-bottom: 8px;">{{ t.description }}</div>
            </template>
            <template #progress="{ progress }">
              <div style="height: 6px; background: #e5e7eb; border-radius: 3px; margin-bottom: 12px;">
                <div style="height: 100%; border-radius: 3px; background: #2563eb; transition: width 0.3s;" :style="{ width: `${progress}%` }" />
              </div>
            </template>
            <template #subtask="{ subtask }">
              <div style="display: flex; align-items: center; gap: 6px; padding: 2px 0; font-size: 13px;">
                <span>{{ subtask.status === 'completed' ? '✅' : subtask.status === 'in_progress' ? '🔄' : '⬜' }}</span>
                <span :style="{ color: subtask.status === 'completed' ? '#999' : '#333' }">{{ subtask.title }}</span>
              </div>
            </template>
          </AiTask>
        </section>

        <!-- Checkpoint -->
        <section style="margin-bottom: 24px;">
          <AiCheckpoint :checkpoint="checkpoint">
            <template #default="{ checkpoint: cp }">
              <div style="display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;">
                <span style="font-size: 20px;">✅</span>
                <div>
                  <div style="font-weight: 600;">{{ cp.title }}</div>
                  <div style="font-size: 13px; color: #666;">{{ cp.description }}</div>
                </div>
              </div>
            </template>
          </AiCheckpoint>
        </section>

        <!-- Confirmation -->
        <section v-if="confirmation" style="margin-bottom: 24px;">
          <AiConfirmation :confirmation="confirmation" @confirm="handleConfirm" @deny="handleDeny">
            <template #default="{ confirmation: c, confirm, deny }">
              <div style="padding: 16px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px;">
                <div style="font-weight: 600; margin-bottom: 4px;">{{ c.title }}</div>
                <div style="font-size: 13px; color: #666; margin-bottom: 12px;">{{ c.description }}</div>
                <div style="display: flex; gap: 8px;">
                  <button @click="deny" style="padding: 6px 16px; border: 1px solid #ddd; border-radius: 4px; background: white; cursor: pointer;">{{ c.denyLabel }}</button>
                  <button @click="confirm" style="padding: 6px 16px; border: none; border-radius: 4px; background: #dc2626; color: white; cursor: pointer;">{{ c.confirmLabel }}</button>
                </div>
              </div>
            </template>
          </AiConfirmation>
        </section>

        <!-- Queue -->
        <section style="margin-bottom: 24px;">
          <h3 style="font-size: 12px; text-transform: uppercase; color: #999; margin-bottom: 8px;">Queue</h3>
          <AiQueue :items="queueItems">
            <template #item="{ item }">
              <div style="display: flex; align-items: center; gap: 12px; padding: 8px 12px; background: #f5f5f5; border-radius: 6px; margin-bottom: 4px;">
                <span style="font-size: 12px; color: #999; min-width: 24px;">#{{ item.position }}</span>
                <span style="flex: 1; font-size: 13px;">{{ item.content }}</span>
                <span style="font-size: 11px; padding: 2px 8px; border-radius: 10px;"
                  :style="{
                    background: item.status === 'completed' ? '#dcfce7' : item.status === 'processing' ? '#dbeafe' : '#f3f4f6',
                    color: item.status === 'completed' ? '#16a34a' : item.status === 'processing' ? '#2563eb' : '#666'
                  }"
                >
                  {{ item.status }}
                </span>
              </div>
            </template>
          </AiQueue>
        </section>

        <!-- Suggestions -->
        <AiSuggestion :suggestions="suggestions" @select="handleSuggestion">
          <template #default="{ suggestions: s, select }">
            <div style="display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap;">
              <button
                v-for="suggestion in s"
                :key="suggestion.id"
                @click="select(suggestion)"
                style="padding: 6px 14px; border: 1px solid #ddd; border-radius: 20px; background: white; cursor: pointer; font-size: 13px;"
              >
                💡 {{ suggestion.label }}
              </button>
            </div>
          </template>
        </AiSuggestion>

        <!-- Input -->
        <AiPromptInput
          v-model="input"
          placeholder="Ask something..."
          @submit="handleSubmit"
        >
          <template #input="{ value, placeholder: ph, handleInput, handleKeydown }">
            <textarea
              :value="value"
              :placeholder="ph"
              @input="handleInput"
              @keydown="handleKeydown"
              rows="2"
              style="flex: 1; padding: 10px 14px; border: 1px solid #ddd; border-radius: 8px; resize: none; font-family: inherit; font-size: 14px;"
            />
          </template>
          <template #actions="{ canSubmit, submit }">
            <button
              :disabled="!canSubmit"
              @click="submit"
              style="padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500;"
              :style="{ opacity: canSubmit ? 1 : 0.5 }"
            >
              Send
            </button>
          </template>
        </AiPromptInput>
      </div>
    </div>
  </div>
</template>
