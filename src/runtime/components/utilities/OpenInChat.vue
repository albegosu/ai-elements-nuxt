<script setup lang="ts">
defineProps<{
  content: string
  label?: string
  icon?: string
}>()

const emit = defineEmits<{
  (e: 'open', content: string): void
}>()
</script>

<template>
  <button
    type="button"
    data-ai-open-in-chat
    :aria-label="label ?? 'Open in chat'"
    @click="emit('open', content)"
  >
    <slot :content="content" :label="label">
      <slot name="icon" :icon="icon">
        <span data-ai-open-in-chat-icon>{{ icon ?? '💬' }}</span>
      </slot>
      <slot name="label" :label="label">
        <span v-if="label" data-ai-open-in-chat-label>{{ label }}</span>
      </slot>
    </slot>
  </button>
</template>
