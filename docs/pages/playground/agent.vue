<script setup lang="ts">
definePageMeta({ layout: 'default' })

const agent = useAiAgent()
const toolDefs = [
  { name: 'getWeather', description: 'Look up weather', icon: '🌤' },
  { name: 'searchDocs', description: 'Search documentation', icon: '🔍' },
]
const { pendingApprovals } = useAiTools(toolDefs, agent)

const {
  messages,
  addMessage,
  aiMessages,
  steps,
  pendingConfirmation,
  approve,
  deny,
  input,
} = agent

const isStreaming = ref(false)

const AGENT_RESPONSES = [
  'I searched the documentation and found 3 relevant articles. Based on those results, here is a summary of the recommended approach for your use case.',
  'I looked up the weather and ran a quick search. Everything looks good — I can walk you through the next steps whenever you\'re ready.',
]
let _responseIdx = 0

async function handleSubmit(event?: { preventDefault?: () => void }) {
  event?.preventDefault?.()
  const text = input.value.trim()
  if (!text || isStreaming.value) return
  addMessage({ role: 'user', content: text, status: 'complete' })
  input.value = ''
  isStreaming.value = true

  steps.value.push({ id: `thought-${Date.now()}`, type: 'thought', content: 'Analyzing request…', status: 'running' })
  await new Promise(r => setTimeout(r, 600))
  steps.value[steps.value.length - 1]!.status = 'completed'

  steps.value.push({ id: `action-${Date.now()}`, type: 'action', content: `searchDocs("${text.slice(0, 28)}…")`, tool: 'searchDocs', status: 'running' })
  await new Promise(r => setTimeout(r, 700))
  steps.value[steps.value.length - 1]!.status = 'completed'

  const response = AGENT_RESPONSES[_responseIdx % AGENT_RESPONSES.length]!
  _responseIdx++
  const msgIndex = messages.value.length
  addMessage({ role: 'assistant', content: '', status: 'streaming' })

  const chunkSize = 5
  for (let i = chunkSize; i <= response.length + chunkSize; i += chunkSize) {
    messages.value[msgIndex] = { role: 'assistant', content: response.slice(0, Math.min(i, response.length)), status: 'streaming' }
    await new Promise(r => setTimeout(r, 40))
  }
  messages.value[msgIndex] = { role: 'assistant', content: response, status: 'complete' }
  isStreaming.value = false
}

const demoToolCall = computed(() => {
  if (pendingConfirmation.value) {
    return {
      id: pendingConfirmation.value.id,
      name: 'deleteFile',
      status: 'approval-requested' as const,
      approvalId: pendingConfirmation.value.id,
      args: { path: '/tmp/example.txt' },
    }
  }
  return aiMessages.value
    .flatMap(m => m.toolCalls ?? [])
    .find(tc => tc.status === 'approval-requested') ?? null
})

function simulateApproval() {
  agent.requestConfirmation({
    id: 'demo-approval-1',
    title: 'Approve deleteFile?',
    description: 'Deletes /tmp/example.txt',
  })
}
</script>

<template>
  <div>
    <DocsHeader
      title="Agent Demo"
      description="useAiAgent + useAiTools with streaming chat. Simulate tool approval below."
    />

    <div class="mb-4 flex flex-wrap gap-2">
      <button
        type="button"
        class="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium dark:border-zinc-700"
        @click="simulateApproval"
      >
        Simulate approval request
      </button>
    </div>

    <h2 class="mb-4 mt-10 scroll-mt-24 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
      Agent run
    </h2>

    <AiAgent
      v-if="steps.length"
      :steps="steps"
      title="Agent run"
      class="mb-6 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
    />

    <AiToolApproval
      v-if="demoToolCall"
      :tool-call="demoToolCall"
      class="mb-6"
      @approve="approve(demoToolCall!.approvalId ?? demoToolCall!.id)"
      @deny="deny(demoToolCall!.approvalId ?? demoToolCall!.id)"
    />

    <h2 class="mb-4 scroll-mt-24 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
      Chat
    </h2>

    <div class="mx-auto max-w-xl space-y-4">
      <AiMessage
        v-for="(msg, i) in aiMessages"
        :key="i"
        v-bind="msg"
      >
        <template #tool-calls="{ toolCalls }">
          <div v-if="toolCalls?.length" class="mb-2 space-y-2">
            <AiTool
              v-for="tc in toolCalls"
              :key="tc.id"
              :tool-call="tc"
            />
          </div>
        </template>
        <template #content="{ content, isStreaming: streaming }">
          <div v-if="content" class="text-sm">
            {{ content }}<AiStreamingCursor v-if="streaming" />
          </div>
        </template>
      </AiMessage>

      <AiPromptInput v-model="input" :loading="isStreaming" @submit="handleSubmit">
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

    <p
      v-if="pendingApprovals.length"
      class="mt-4 text-xs text-zinc-500"
    >
      Pending tool approvals: {{ pendingApprovals.map(t => t.name).join(', ') }}
    </p>
  </div>
</template>
