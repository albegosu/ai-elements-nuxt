<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { closeUnclosedTags, sanitizeMarkup } from '../../utils/sanitizeHtml'

const props = withDefaults(defineProps<{
  /** Markup string to render (may be incomplete while streaming). */
  content?: string
  /** Auto-close tags cut off mid-stream. Disable for already-complete markup. */
  streaming?: boolean
  /** Override the default markup sanitizer. */
  sanitize?: (html: string) => string
}>(), {
  content: '',
  streaming: true,
})

/** Last render that produced non-empty markup — used as a flicker-free fallback. */
const lastValid = ref('')

const html = computed(() => {
  const raw = props.content ?? ''
  const closed = props.streaming ? closeUnclosedTags(raw) : raw
  const sanitizer = props.sanitize ?? sanitizeMarkup
  return sanitizer(closed)
})

watch(html, (value) => {
  if (value.trim()) lastValid.value = value
}, { immediate: true })

/** Fall back to the last valid render when the current one is empty mid-stream. */
const rendered = computed(() => (html.value.trim() ? html.value : lastValid.value))
</script>

<template>
  <div
    data-ai-jsx-preview
    :data-streaming="streaming || undefined"
    role="region"
    aria-label="Rendered preview"
  >
    <slot :html="rendered" :content="content">
      <div v-html="rendered" />
    </slot>
  </div>
</template>
