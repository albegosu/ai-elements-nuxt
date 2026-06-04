<script setup lang="ts">
const confirmation = {
  id: '1',
  title: 'Delete conversation?',
  description: 'This action is permanent and cannot be undone. All messages in this conversation will be lost.',
  confirmLabel: 'Delete',
  denyLabel: 'Cancel',
  destructive: true,
}
</script>

<template>
  <AiConfirmation :confirmation="confirmation">
    <template #default="{ confirmation: c, confirm, deny }">
      <div class="rounded-xl border border-red-200 bg-red-50 p-5 dark:border-red-800/50 dark:bg-red-900/20">
        <div class="flex gap-3">
          <div class="flex size-9 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-800/40">
            <svg class="size-5 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
          <div class="flex-1 space-y-3">
            <div class="space-y-1">
              <h3 class="text-sm font-medium text-red-900 dark:text-red-100">{{ c.title }}</h3>
              <p class="text-sm text-red-700 dark:text-red-300/80">{{ c.description }}</p>
            </div>
            <div class="flex items-center gap-2">
              <button
                type="button"
                class="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                @click="deny"
              >
                Cancel
              </button>
              <button
                type="button"
                class="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
                @click="confirm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </AiConfirmation>
</template>
