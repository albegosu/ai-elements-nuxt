<script setup lang="ts">
import { ref } from 'vue'
import type { AiToolCall } from '../../../../src/runtime/types'

const tools = {
  search: 'auto-approve' as const,
  deleteFile: 'user-approval' as const,
  formatDisk: 'auto-deny' as const,
}

const toolCalls = ref<AiToolCall[]>([
  {
    id: 'tc-1',
    name: 'deleteFile',
    status: 'approval-requested',
    args: { path: '/tmp/data.csv' },
    approvalId: 'approval-1',
  },
])

function handleApprove(id: string) {
  toolCalls.value = toolCalls.value.filter(tc => (tc.approvalId ?? tc.id) !== id)
}

function handleDeny(id: string) {
  toolCalls.value = toolCalls.value.filter(tc => (tc.approvalId ?? tc.id) !== id)
}
</script>

<template>
  <AiApprovalPolicy
    :tools="tools"
    :tool-calls="toolCalls"
    @approve="handleApprove"
    @deny="handleDeny"
  />
</template>
