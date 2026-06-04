<script setup lang="ts">
import type { AiToolCall, AiToolUIPartState } from '../../types'
import {
  isAiToolApprovalRequested,
  isAiToolComplete,
  isAiToolFailed,
  isAiToolInProgress,
} from '../../types'

const props = defineProps<{
  toolCall: AiToolCall
}>()

const statusLabel: Record<AiToolUIPartState, string> = {
  'input-streaming': 'Pending',
  'input-available': 'Running',
  'approval-requested': 'Awaiting Approval',
  'approval-responded': 'Responded',
  'output-available': 'Completed',
  'output-denied': 'Denied',
  'output-error': 'Error',
  calling: 'Running',
  result: 'Completed',
  error: 'Error',
}

const isInProgress = computed(() => isAiToolInProgress(props.toolCall.status))
const isComplete = computed(() => isAiToolComplete(props.toolCall.status))
const isFailed = computed(() => isAiToolFailed(props.toolCall.status))
const isApprovalRequested = computed(() => isAiToolApprovalRequested(props.toolCall.status))
const isApprovalResponded = computed(() => props.toolCall.status === 'approval-responded')
const isDenied = computed(() => props.toolCall.status === 'output-denied')
const label = computed(() => statusLabel[props.toolCall.status] ?? props.toolCall.status)
</script>

<template>
  <div
    data-ai-tool
    :data-tool-name="toolCall.name"
    :data-status="toolCall.status"
    role="status"
    :aria-label="`Tool: ${toolCall.name}`"
  >
    <slot
      :tool-call="toolCall"
      :status-label="label"
      :is-in-progress="isInProgress"
      :is-complete="isComplete"
      :is-failed="isFailed"
      :is-approval-requested="isApprovalRequested"
      :is-approval-responded="isApprovalResponded"
      :is-denied="isDenied"
      :is-calling="isInProgress"
      :has-result="isComplete"
      :has-error="isFailed"
    >
      <slot
        name="header"
        :tool-call="toolCall"
        :status-label="label"
        :is-in-progress="isInProgress"
      >
        <div data-ai-tool-header>
          <span data-ai-tool-name>{{ toolCall.name }}</span>
          <span data-ai-tool-status :data-status="toolCall.status">{{ label }}</span>
        </div>
      </slot>

      <slot
        v-if="isApprovalRequested"
        name="approval-requested"
        :tool-call="toolCall"
      >
        <div data-ai-tool-approval-pending>Awaiting approval</div>
      </slot>

      <slot
        v-if="isApprovalResponded"
        name="approval-responded"
        :tool-call="toolCall"
        :approval="toolCall.approval"
      />

      <slot
        v-if="isInProgress && !isApprovalRequested"
        name="loading"
        :tool-call="toolCall"
      >
        <div data-ai-tool-loading>Calling...</div>
      </slot>

      <slot
        v-if="isComplete"
        name="result"
        :result="toolCall.result"
        :tool-call="toolCall"
      />

      <slot
        v-if="isDenied"
        name="output-denied"
        :tool-call="toolCall"
        :approval="toolCall.approval"
      >
        <div data-ai-tool-denied role="status">Denied</div>
      </slot>

      <slot
        v-if="isFailed"
        name="error"
        :error="toolCall.error"
        :tool-call="toolCall"
      >
        <div data-ai-tool-error role="alert">
          {{ toolCall.error }}
        </div>
      </slot>

      <slot
        v-if="toolCall.args && Object.keys(toolCall.args).length"
        name="args"
        :args="toolCall.args"
        :tool-call="toolCall"
      />
    </slot>
  </div>
</template>
