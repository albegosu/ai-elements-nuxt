<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { AiToolCall } from '../../types'
import { isAiToolApprovalRequested } from '../../types'

const props = withDefaults(defineProps<{
  toolCall: AiToolCall
  editable?: boolean
}>(), {
  editable: false,
})

const emit = defineEmits<{
  (e: 'approve', id: string, modifiedArgs?: Record<string, unknown>): void
  (e: 'deny', id: string, reason?: string): void
}>()

const editedArgs = ref<Record<string, unknown>>({ ...(props.toolCall.args ?? {}) })

const showApproval = computed(() => isAiToolApprovalRequested(props.toolCall.status))
const showAccepted = computed(
  () =>
    props.toolCall.approval?.approved === true
    && (props.toolCall.status === 'approval-responded'
      || props.toolCall.status === 'output-available'
      || props.toolCall.status === 'output-denied'),
)
const showRejected = computed(
  () =>
    props.toolCall.approval?.approved === false
    && (props.toolCall.status === 'approval-responded'
      || props.toolCall.status === 'output-denied'
      || props.toolCall.status === 'output-available'),
)
const hiddenDuringInput = computed(
  () =>
    props.toolCall.status === 'input-streaming'
    || props.toolCall.status === 'input-available'
    || props.toolCall.status === 'calling',
)

const approvalTargetId = computed(
  () => props.toolCall.approvalId ?? props.toolCall.approval?.id ?? props.toolCall.id,
)

watch(
  () => props.toolCall.args,
  (args) => {
    editedArgs.value = { ...(args ?? {}) }
  },
  { deep: true },
)

function approve() {
  emit(
    'approve',
    approvalTargetId.value,
    props.editable ? editedArgs.value : props.toolCall.args,
  )
}

function deny() {
  emit('deny', approvalTargetId.value)
}
</script>

<template>
  <div
    v-if="!hiddenDuringInput && (showApproval || showAccepted || showRejected || toolCall.approval)"
    data-ai-tool-approval
    :data-tool-name="toolCall.name"
    :data-status="toolCall.status"
    role="group"
    :aria-label="`Approve tool: ${toolCall.name}`"
  >
    <slot
      :tool-call="toolCall"
      :approve="approve"
      :deny="deny"
      :edited-args="editedArgs"
      :show-approval="showApproval"
      :show-accepted="showAccepted"
      :show-rejected="showRejected"
    >
      <slot name="header" :tool-call="toolCall">
        <div data-ai-tool-approval-header>{{ toolCall.name }}</div>
      </slot>

      <slot
        v-if="showApproval"
        name="request"
        :tool-call="toolCall"
        :approve="approve"
        :deny="deny"
      >
        <slot
          v-if="toolCall.args && Object.keys(toolCall.args).length"
          name="args"
          :args="editedArgs"
          :editable="editable"
          :tool-call="toolCall"
        >
          <pre data-ai-tool-approval-args>{{ JSON.stringify(editedArgs, null, 2) }}</pre>
        </slot>

        <slot name="actions" :approve="approve" :deny="deny" :tool-call="toolCall">
          <div data-ai-tool-approval-actions>
            <button type="button" data-ai-tool-approval-deny @click="deny">
              Deny
            </button>
            <button type="button" data-ai-tool-approval-approve @click="approve">
              Approve
            </button>
          </div>
        </slot>
      </slot>

      <slot v-if="showAccepted" name="accepted" :tool-call="toolCall" :approval="toolCall.approval">
        <div data-ai-tool-approval-accepted>Approved</div>
      </slot>

      <slot v-if="showRejected" name="rejected" :tool-call="toolCall" :approval="toolCall.approval">
        <div data-ai-tool-approval-rejected>Denied</div>
      </slot>
    </slot>
  </div>
</template>
