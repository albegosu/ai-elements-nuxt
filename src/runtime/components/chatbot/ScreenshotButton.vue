<script setup lang="ts">
import { useScreenshotCapture } from '../../composables/useScreenshotCapture'
import type { AiScreenshotCapture } from '../../types'

const props = withDefaults(defineProps<{
  disabled?: boolean
}>(), {
  disabled: false,
})

const emit = defineEmits<{
  (e: 'capture', payload: AiScreenshotCapture): void
  (e: 'error', error: Error): void
}>()

const { capture: runCapture, capturing, error } = useScreenshotCapture()

async function capture() {
  if (props.disabled || capturing.value) return
  const result = await runCapture()
  if (result) emit('capture', result)
  else if (error.value) emit('error', error.value)
}

defineExpose({ capture, capturing })
</script>

<template>
  <div data-ai-screenshot-button style="display: contents">
    <slot :capture="capture" :capturing="capturing" :disabled="disabled">
      <button
        type="button"
        :disabled="disabled || capturing"
        :data-capturing="capturing || undefined"
        aria-label="Capture screenshot"
        @click="capture"
      >
        <slot name="icon">📷</slot>
      </button>
    </slot>
  </div>
</template>
