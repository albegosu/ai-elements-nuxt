<script setup lang="ts">
import { computed } from 'vue'
import type { AiMessageProps } from '../../types'
import { sanitizeRenderedHtml } from '../../utils/sanitizeHtml'

const props = withDefaults(defineProps<AiMessageProps>(), {
  status: 'complete',
})

const safeHtmlContent = computed(() =>
  props.htmlContent ? sanitizeRenderedHtml(props.htmlContent) : undefined,
)

const isStreaming = computed(() => props.status === 'streaming')
const isPending = computed(() => props.status === 'pending')
const isComplete = computed(() => props.status === 'complete')
const isError = computed(() => props.status === 'error')
const hasSources = computed(() => !!props.sources?.length)
const hasToolCalls = computed(() => !!props.toolCalls?.length)
const hasAttachments = computed(() => !!props.attachments?.length)
const hasReasoning = computed(() => !!props.reasoning)
</script>

<template>
  <div
    data-ai-message
    :data-role="role"
    :data-status="status"
    :data-streaming="isStreaming || undefined"
    role="article"
    :aria-label="`${role} message`"
  >
    <slot
      name="avatar"
      :role="role"
      :status="status"
    />

    <slot
      name="reasoning"
      v-if="hasReasoning"
      :reasoning="reasoning"
      :is-streaming="isStreaming"
    />

    <slot
      name="tool-calls"
      v-if="hasToolCalls"
      :tool-calls="toolCalls"
    />

    <slot
      name="attachments"
      v-if="hasAttachments"
      :attachments="attachments"
    />

    <slot
      name="content"
      :content="content"
      :html-content="htmlContent"
      :is-streaming="isStreaming"
      :is-pending="isPending"
      :is-complete="isComplete"
      :is-error="isError"
      :role="role"
    >
      <div v-if="safeHtmlContent" v-html="safeHtmlContent" />
      <div v-else-if="content">{{ content }}</div>
    </slot>

    <slot
      name="sources"
      v-if="hasSources"
      :sources="sources"
    />

    <slot
      name="metadata"
      :metadata="metadata"
      :status="status"
      :role="role"
    />

    <slot
      name="actions"
      :role="role"
      :status="status"
      :content="content"
      :is-streaming="isStreaming"
    />
  </div>
</template>
