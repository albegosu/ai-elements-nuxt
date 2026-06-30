<script setup lang="ts">
import { ref } from 'vue'
import type { AiToolCall } from '../../../../src/runtime/types'
import type { AiApprovalPolicyType } from '../../../../src/runtime/types/realtime'

const tools = {
  search: 'auto-approve' as const,
  deleteFile: 'user-approval' as const,
  formatDisk: 'auto-deny' as const,
}

const policyStyles: Record<AiApprovalPolicyType, { label: string, badge: string }> = {
  'auto-approve': {
    label: 'Auto-approve',
    badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  },
  'auto-deny': {
    label: 'Auto-deny',
    badge: 'bg-red-500/10 text-red-600 dark:text-red-400',
  },
  'user-approval': {
    label: 'User approval',
    badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  },
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
  <div class="w-full max-w-lg space-y-4">
    <div class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <p class="mb-3 text-xs font-medium uppercase tracking-wide text-zinc-500">
        Policy map
      </p>
      <div class="space-y-2">
        <div
          v-for="(policy, name) in tools"
          :key="name"
          class="flex items-center justify-between gap-3"
        >
          <span class="font-mono text-xs text-zinc-600 dark:text-zinc-400">{{ name }}</span>
          <span
            class="rounded-full px-2 py-0.5 text-xs font-medium"
            :class="policyStyles[policy].badge"
          >
            {{ policyStyles[policy].label }}
          </span>
        </div>
      </div>
    </div>

    <div class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <AiApprovalPolicy
        :tools="tools"
        :tool-calls="toolCalls"
        @approve="handleApprove"
        @deny="handleDeny"
      >
        <template #approval="{ toolCall: tc, approve, deny, policy }">
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <svg class="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
              <span class="text-sm font-medium text-zinc-700 dark:text-zinc-300">Pending approval</span>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <span class="text-xs font-medium text-zinc-500">Tool</span>
              <span class="rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">{{ tc.name }}</span>
              <span
                class="rounded-full px-2 py-0.5 text-xs font-medium"
                :class="policyStyles[policy].badge"
              >
                {{ policyStyles[policy].label }}
              </span>
            </div>

            <div v-if="tc.args">
              <p class="mb-1.5 text-xs font-medium text-zinc-500">Arguments</p>
              <pre class="rounded-lg bg-zinc-50 p-3 font-mono text-xs leading-relaxed text-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-400">{{ JSON.stringify(tc.args, null, 2) }}</pre>
            </div>

            <div class="flex items-center gap-2 pt-1">
              <button
                type="button"
                class="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                @click="deny()"
              >
                Deny
              </button>
              <button
                type="button"
                class="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                @click="approve()"
              >
                Approve
              </button>
            </div>
          </div>
        </template>

        <template #empty>
          <div class="flex flex-col items-center gap-2 py-2 text-center">
            <svg class="h-8 w-8 text-emerald-500/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <p class="text-sm font-medium text-zinc-700 dark:text-zinc-300">No pending approvals</p>
            <p class="text-xs text-zinc-500">Auto-approve and auto-deny tools are handled without user input.</p>
          </div>
        </template>
      </AiApprovalPolicy>
    </div>
  </div>
</template>
