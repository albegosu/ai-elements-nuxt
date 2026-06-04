<script setup lang="ts">
const error = 'Failed to stream response — connection timed out after 30s.'
</script>

<template>
  <AiErrorBoundary :error="error">
    <template #default="{ message, retry }">
      <div class="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800/50 dark:bg-red-900/20">
        <div class="flex gap-3">
          <div class="flex size-8 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-800/40">
            <svg class="size-4 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <div class="flex-1 space-y-3">
            <div class="space-y-1">
              <h3 class="text-sm font-medium text-red-900 dark:text-red-100">Something went wrong</h3>
              <p class="text-sm text-red-700 dark:text-red-300/80">{{ message }}</p>
            </div>
            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-700 shadow-sm transition-colors hover:bg-red-50 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
              @click="retry"
            >
              <svg class="size-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.992 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Retry
            </button>
          </div>
        </div>
      </div>
    </template>
  </AiErrorBoundary>
</template>
