<script setup lang="ts">
import { ref } from 'vue'

const policies = ref({
  search: 'auto-approve' as const,
  deleteFile: 'user-approval' as const,
  formatDisk: 'auto-deny' as const,
})

const pending = ref<{ toolName: string; args: Record<string, unknown> } | null>({
  toolName: 'deleteFile',
  args: { path: '/tmp/data.csv' },
})

function handleApprove() {
  pending.value = null
}

function handleDeny() {
  pending.value = null
}
</script>

<template>
  <AiApprovalPolicy
    :policies="policies"
    :pending="pending"
    @approve="handleApprove"
    @deny="handleDeny"
  />
</template>
