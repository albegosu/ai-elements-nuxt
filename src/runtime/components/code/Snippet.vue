<script setup lang="ts">
import { ref } from 'vue'
const props = withDefaults(defineProps<{
  code: string
  language?: string
  label?: string
}>(), {
  language: 'text',
})

const emit = defineEmits<{
  (e: 'copy'): void
}>()

const copied = ref(false)

async function copyCode() {
  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    emit('copy')
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // clipboard unavailable
  }
}
</script>

<template>
  <div data-ai-snippet :data-language="language">
    <slot :code="code" :language="language" :label="label" :copy="copyCode" :copied="copied">
      <slot name="label" :label="label">
        <span v-if="label" data-ai-snippet-label>{{ label }}</span>
      </slot>
      <code data-ai-snippet-code>{{ code }}</code>
      <slot name="copy-button" :copy="copyCode" :copied="copied">
        <button type="button" @click="copyCode" data-ai-snippet-copy>
          {{ copied ? 'Copied' : 'Copy' }}
        </button>
      </slot>
    </slot>
  </div>
</template>
