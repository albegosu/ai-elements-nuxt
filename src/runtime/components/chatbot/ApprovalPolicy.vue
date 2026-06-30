<script setup lang="ts">
import { computed } from 'vue'
import type { AiToolCall } from '../../types'
import { isAiToolApprovalRequested } from '../../types'
import type { AiApprovalPolicyType, AiApprovalPolicies } from '../../types/realtime'

const props = withDefaults(defineProps<{
  tools: AiApprovalPolicies
  toolCalls?: AiToolCall[]
}>(), {
  toolCalls: () => [],
})

const emit = defineEmits<{
  (e: 'approve', id: string, toolName: string): void
  (e: 'deny', id: string, toolName: string, reason?: string): void
}>()

const pendingApprovals = computed(() =>
  props.toolCalls.filter(tc => isAiToolApprovalRequested(tc.status)),
)

function getPolicy(toolName: string): AiApprovalPolicyType {
  const policy = props.tools[toolName]
  if (!policy) return 'user-approval'
  if (typeof policy === 'string') return policy
  return 'user-approval'
}

function isAutoApproved(toolName: string): boolean {
  return getPolicy(toolName) === 'auto-approve'
}

function isAutoDenied(toolName: string): boolean {
  return getPolicy(toolName) === 'auto-deny'
}

function needsUserApproval(toolName: string): boolean {
  return getPolicy(toolName) === 'user-approval'
}

function approve(tc: AiToolCall) {
  emit('approve', tc.approvalId ?? tc.id, tc.name)
}

function deny(tc: AiToolCall, reason?: string) {
  emit('deny', tc.approvalId ?? tc.id, tc.name, reason)
}

const userPending = computed(() =>
  pendingApprovals.value.filter(tc => needsUserApproval(tc.name)),
)

const policyMap = computed(() => {
  const map: Record<string, AiApprovalPolicyType> = {}
  for (const name of Object.keys(props.tools)) {
    map[name] = getPolicy(name)
  }
  return map
})
</script>

<template>
  <div
    data-ai-approval-policy
    role="region"
    aria-label="Tool approval policies"
  >
    <slot
      :pending-approvals="pendingApprovals"
      :user-pending="userPending"
      :policy-map="policyMap"
      :approve="approve"
      :deny="deny"
      :get-policy="getPolicy"
      :is-auto-approved="isAutoApproved"
      :is-auto-denied="isAutoDenied"
      :needs-user-approval="needsUserApproval"
    >
      <div v-if="userPending.length" data-ai-approval-policy-pending>
        <div
          v-for="tc in userPending"
          :key="tc.id"
          data-ai-approval-policy-item
          :data-tool-name="tc.name"
          role="group"
          :aria-label="`Approve ${tc.name}?`"
        >
          <slot name="approval" :tool-call="tc" :approve="() => approve(tc)" :deny="(reason?: string) => deny(tc, reason)" :policy="getPolicy(tc.name)">
            <div data-ai-approval-policy-header>
              <slot name="tool-name" :tool-call="tc">
                <span data-ai-approval-policy-name>{{ tc.name }}</span>
              </slot>
              <slot name="policy-badge" :policy="getPolicy(tc.name)">
                <span data-ai-approval-policy-badge>{{ getPolicy(tc.name) }}</span>
              </slot>
            </div>

            <slot v-if="tc.args" name="args" :args="tc.args" :tool-call="tc">
              <pre data-ai-approval-policy-args>{{ JSON.stringify(tc.args, null, 2) }}</pre>
            </slot>

            <slot name="actions" :approve="() => approve(tc)" :deny="(reason?: string) => deny(tc, reason)" :tool-call="tc">
              <div data-ai-approval-policy-actions>
                <button type="button" data-ai-approval-policy-deny @click="deny(tc)">
                  Deny
                </button>
                <button type="button" data-ai-approval-policy-approve @click="approve(tc)">
                  Approve
                </button>
              </div>
            </slot>
          </slot>
        </div>
      </div>

      <slot v-if="!userPending.length" name="empty">
        <div data-ai-approval-policy-empty>No pending approvals</div>
      </slot>
    </slot>
  </div>
</template>
