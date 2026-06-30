<script setup lang="ts">
import { computed } from 'vue'
import type { AiMcpAppData } from '../../types/realtime'

const props = withDefaults(defineProps<{
  app: AiMcpAppData
  sandbox?: boolean
  height?: string
}>(), {
  sandbox: true,
  height: '400px',
})

const emit = defineEmits<{
  (e: 'ready'): void
  (e: 'error', error: string): void
}>()

const iframeSandbox = computed(() =>
  props.sandbox ? 'allow-scripts allow-same-origin' : undefined,
)

const isHtml = computed(() =>
  props.app.contentType === 'html' || (!props.app.contentType && props.app.content?.trim().startsWith('<')),
)

const srcDoc = computed(() => {
  if (!isHtml.value || !props.app.content) return undefined
  return props.app.content
})

function onLoad() {
  emit('ready')
}
</script>

<template>
  <div
    data-ai-mcp-app
    :data-status="app.status"
    :data-content-type="app.contentType"
  >
    <slot
      :app="app"
      :is-html="isHtml"
    >
      <slot name="header" :app="app">
        <div data-ai-mcp-app-header>
          <span data-ai-mcp-app-name>{{ app.name }}</span>
          <span data-ai-mcp-app-status :data-status="app.status">{{ app.status }}</span>
        </div>
      </slot>

      <slot v-if="app.status === 'loading'" name="loading">
        <div data-ai-mcp-app-loading role="status" aria-label="Loading app">
          Loading {{ app.name }}…
        </div>
      </slot>

      <slot v-else-if="app.status === 'error'" name="error" :error="app.error">
        <div data-ai-mcp-app-error role="alert">
          {{ app.error ?? 'Failed to load app' }}
        </div>
      </slot>

      <template v-else-if="app.status === 'ready' && app.content">
        <slot name="content" :app="app" :is-html="isHtml" :src-doc="srcDoc">
          <iframe
            v-if="isHtml"
            data-ai-mcp-app-frame
            :srcdoc="srcDoc"
            :sandbox="iframeSandbox"
            :style="{ height, width: '100%', border: 'none' }"
            title="MCP app content"
            @load="onLoad"
          />
          <pre v-else-if="app.contentType === 'json'" data-ai-mcp-app-json><code>{{ JSON.stringify(JSON.parse(app.content), null, 2) }}</code></pre>
          <div v-else data-ai-mcp-app-text>{{ app.content }}</div>
        </slot>
      </template>
    </slot>
  </div>
</template>
