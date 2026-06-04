<script setup lang="ts">
const toolCall = ref({
  id: '1',
  name: 'deleteFile',
  args: { path: '/tmp/data/cache.db', recursive: true },
  status: 'approval-requested' as const,
  approvalId: 'a1',
})
</script>

<template>
  <div class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
    <AiToolApproval :tool-call="toolCall">
      <template #default="{ toolCall: tc, approve, deny, showApproval }">
        <div class="space-y-3">
          <!-- Header -->
          <div class="flex items-center gap-2">
            <svg class="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
            <span class="text-sm font-medium text-zinc-700 dark:text-zinc-300">Tool requires approval</span>
          </div>

          <!-- Tool name -->
          <div class="flex items-center gap-2">
            <span class="text-xs font-medium text-zinc-500">Tool</span>
            <span class="rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">{{ tc.name }}</span>
          </div>

          <!-- Args -->
          <div>
            <p class="mb-1.5 text-xs font-medium text-zinc-500">Arguments</p>
            <pre class="rounded-lg bg-zinc-50 p-3 font-mono text-xs leading-relaxed text-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-400">{{ JSON.stringify(tc.args, null, 2) }}</pre>
          </div>

          <!-- Actions -->
          <div v-if="showApproval" class="flex items-center gap-2 pt-1">
            <button
              type="button"
              class="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              @click="deny"
            >
              Deny
            </button>
            <button
              type="button"
              class="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
              @click="approve"
            >
              Approve
            </button>
          </div>
        </div>
      </template>
    </AiToolApproval>
  </div>
</template>
