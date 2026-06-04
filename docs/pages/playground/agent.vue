<script setup lang="ts">
definePageMeta({ layout: 'default' })

const agent = useAiAgent({ api: '/api/chat' })
const toolDefs = [
  { name: 'getWeather', description: 'Look up weather', icon: '🌤' },
  { name: 'searchDocs', description: 'Search documentation', icon: '🔍' },
]
const { pendingApprovals } = useAiTools(toolDefs, agent)

const {
  aiMessages,
  steps,
  pendingConfirmation,
  approve,
  deny,
  handleSubmit,
  input,
  isStreaming,
} = agent

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
  const fromMsg = aiMessages.value
    .flatMap(m => m.toolCalls ?? [])
    .find(tc => tc.status === 'approval-requested')
  if (fromMsg) return fromMsg
  return null
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

      <form @submit="handleSubmit">
        <AiPromptInput v-model="input" :loading="isStreaming" />
      </form>
    </div>

    <p
      v-if="pendingApprovals.length"
      class="mt-4 text-xs text-zinc-500"
    >
      Pending tool approvals: {{ pendingApprovals.map(t => t.name).join(', ') }}
    </p>
  </div>
</template>
