<script setup lang="ts">
const props = withDefaults(defineProps<{
  error?: Error | string | null
  retryable?: boolean
}>(), {
  retryable: true,
})

const emit = defineEmits<{
  (e: 'retry'): void
  (e: 'dismiss'): void
  (e: 'error', error: Error): void
}>()

const capturedError = ref<Error | string | null>(null)

const activeError = computed(() => props.error ?? capturedError.value)

const errorMessage = computed(() => {
  const err = activeError.value
  if (!err) return ''
  return typeof err === 'string' ? err : err.message
})

const hasError = computed(() => !!errorMessage.value)

onErrorCaptured((err) => {
  capturedError.value = err instanceof Error ? err : new Error(String(err))
  emit('error', err instanceof Error ? err : new Error(String(err)))
  return true
})

function reset() {
  capturedError.value = null
}

function retry() {
  reset()
  emit('retry')
}

function dismiss() {
  reset()
  emit('dismiss')
}

defineExpose({ reset })
</script>

<template>
  <div
    data-ai-error-boundary
    :data-has-error="hasError || undefined"
    role="alert"
    :aria-live="hasError ? 'assertive' : 'off'"
  >
    <slot v-if="!hasError" />
    <slot
      v-else
      :error="activeError"
      :message="errorMessage"
      :retry="retry"
      :dismiss="dismiss"
      :reset="reset"
    >
      <div data-ai-error-boundary-message>{{ errorMessage }}</div>
      <div data-ai-error-boundary-actions>
        <button
          v-if="retryable"
          type="button"
          data-ai-error-boundary-retry
          @click="retry"
        >
          Retry
        </button>
        <button
          type="button"
          data-ai-error-boundary-dismiss
          @click="dismiss"
        >
          Dismiss
        </button>
      </div>
    </slot>
  </div>
</template>
