<script setup lang="ts">
const props = withDefaults(defineProps<{
  /** Vue SFC source or HTML template string */
  code?: string
  /** Pre-rendered HTML output (skips client compile) */
  html?: string
  title?: string
  height?: string
}>(), {
  height: '400px',
})

const previewRef = ref<HTMLDivElement | null>(null)
const error = ref<string | null>(null)
const renderedHtml = ref(props.html ?? '')

watch(() => [props.code, props.html], () => {
  error.value = null
  if (props.html) {
    renderedHtml.value = props.html
    return
  }
  if (!props.code) {
    renderedHtml.value = ''
    return
  }
  // Simple template preview: render code as preformatted or basic HTML wrapper
  renderedHtml.value = props.code.includes('<')
    ? props.code
    : `<pre data-ai-vue-preview-raw>${escapeHtml(props.code)}</pre>`
}, { immediate: true })

function escapeHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function refresh() {
  error.value = null
  if (props.html) {
    renderedHtml.value = props.html
    return
  }
  if (!props.code) {
    renderedHtml.value = ''
    return
  }
  renderedHtml.value = props.code.includes('<')
    ? props.code
    : `<pre data-ai-vue-preview-raw>${escapeHtml(props.code)}</pre>`
}

defineExpose({ refresh, previewRef, error })
</script>

<template>
  <div
    data-ai-vue-preview
    role="region"
    :aria-label="title ?? 'Vue preview'"
  >
    <slot name="header" :title="title" :error="error" :refresh="refresh">
      <div v-if="title || error" data-ai-vue-preview-header>
        <span v-if="title" data-ai-vue-preview-title>{{ title }}</span>
        <span v-if="error" data-ai-vue-preview-error role="alert">{{ error }}</span>
      </div>
    </slot>

    <div
      ref="previewRef"
      data-ai-vue-preview-body
      :style="{ height, overflow: 'auto' }"
    >
      <slot :html="renderedHtml" :error="error">
        <div v-if="renderedHtml" v-html="renderedHtml" />
        <slot v-else name="empty">
          <p data-ai-vue-preview-empty>No preview content</p>
        </slot>
      </slot>
    </div>
  </div>
</template>
