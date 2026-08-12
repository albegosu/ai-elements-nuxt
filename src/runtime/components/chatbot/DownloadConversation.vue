<script setup lang="ts">
import { computed } from 'vue'
import { messagesToMarkdown, downloadTextFile, type AiMessageLike } from '../../utils/exportMessages'

const props = withDefaults(defineProps<{
  messages: AiMessageLike[]
  filename?: string
}>(), {
  filename: 'conversation.md',
})

const emit = defineEmits<{
  (e: 'download', markdown: string): void
}>()

const markdown = computed(() => messagesToMarkdown(props.messages ?? []))
const empty = computed(() => markdown.value.length === 0)

function download() {
  if (empty.value) return
  downloadTextFile(markdown.value, props.filename)
  emit('download', markdown.value)
}

defineExpose({ download, markdown })
</script>

<template>
  <div data-ai-download-conversation style="display: contents">
    <slot :download="download" :disabled="empty" :markdown="markdown">
      <button
        type="button"
        :disabled="empty"
        aria-label="Download conversation as Markdown"
        @click="download"
      >
        <slot name="label">Download</slot>
      </button>
    </slot>
  </div>
</template>
