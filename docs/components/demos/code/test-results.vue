<script setup lang="ts">
const tests = [
  { name: 'streams text response chunks', status: 'passed' as const, duration: 142, suite: 'useChat' },
  { name: 'handles tool call roundtrip', status: 'passed' as const, duration: 238, suite: 'useChat' },
  { name: 'aborts on unmount cleanup', status: 'passed' as const, duration: 56, suite: 'useChat' },
  { name: 'retries on 429 rate limit', status: 'failed' as const, duration: 5012, suite: 'useChat', error: 'Timeout: expected retry after backoff but no second attempt was made' },
  { name: 'preserves messages on provider switch', status: 'skipped' as const, suite: 'useChat' },
]
</script>

<template>
  <div class="w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
    <AiTestResults :tests="tests">
      <template #summary="{ summary }">
        <div class="mb-4 flex flex-wrap gap-3 rounded-lg bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-800/50">
          <span class="text-zinc-600 dark:text-zinc-400">{{ summary.total }} tests</span>
          <span class="text-green-600">{{ summary.passed }} passed</span>
          <span v-if="summary.failed" class="text-red-500">{{ summary.failed }} failed</span>
          <span v-if="summary.skipped" class="text-zinc-400">{{ summary.skipped }} skipped</span>
        </div>
      </template>
      <template #test="{ test }">
        <div class="flex items-center gap-2 py-1 text-sm">
          <span
            :class="{
              'text-green-600': test.status === 'passed',
              'text-red-500': test.status === 'failed',
              'text-zinc-400': test.status === 'skipped',
            }"
          >
            {{ test.status === 'passed' ? '✓' : test.status === 'failed' ? '✗' : '○' }}
          </span>
          <span :class="test.status === 'failed' ? 'text-red-600' : 'text-zinc-700 dark:text-zinc-300'">{{ test.name }}</span>
          <span v-if="test.duration" class="ml-auto font-mono text-xs text-zinc-400">{{ test.duration }}ms</span>
        </div>
      </template>
      <template #test-error="{ test }">
        <p class="mb-2 ml-5 rounded-md bg-red-50 px-2 py-1 text-xs text-red-600 dark:bg-red-950/30 dark:text-red-400">
          {{ test.error }}
        </p>
      </template>
    </AiTestResults>
  </div>
</template>
