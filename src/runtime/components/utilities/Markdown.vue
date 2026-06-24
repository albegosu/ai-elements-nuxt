<script setup lang="ts">
import { computed } from 'vue'
import { useAiMarkdown } from '../../composables/useAiMarkdown'

const props = withDefaults(defineProps<{
  content?: string
}>(), {
  content: '',
})

const contentRef = computed(() => props.content)
const { html } = useAiMarkdown(contentRef)
</script>

<template>
  <div
    data-ai-markdown
    role="document"
    aria-label="Markdown content"
  >
    <slot :html="html" :content="content">
      <div v-html="html" />
    </slot>
  </div>
</template>
