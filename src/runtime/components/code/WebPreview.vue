<script setup lang="ts">
const props = withDefaults(defineProps<{
  url?: string
  html?: string
  title?: string
  sandbox?: string
  width?: string
  height?: string
}>(), {
  sandbox: 'allow-scripts',
  width: '100%',
  height: '400px',
})

const iframeRef = ref<HTMLIFrameElement | null>(null)
const isLoading = ref(true)

const srcDoc = computed(() => props.html ?? undefined)
const src = computed(() => props.html ? undefined : props.url)

watch(
  () => [props.url, props.html] as const,
  () => {
    isLoading.value = true
  },
)

function handleLoad() {
  isLoading.value = false
}

function refresh() {
  isLoading.value = true
  const iframe = iframeRef.value
  if (iframe) {
    if (src.value) {
      iframe.src = src.value
    } else if (srcDoc.value) {
      iframe.srcdoc = srcDoc.value
    }
  }
}

defineExpose({ refresh, iframeRef })
</script>

<template>
  <div data-ai-web-preview role="region" :aria-label="title ?? 'Web preview'">
    <slot name="header" :title="title" :refresh="refresh" :loading="isLoading">
      <div v-if="title" data-ai-web-preview-header>
        <slot name="title" :title="title">
          <span>{{ title }}</span>
        </slot>
        <slot name="toolbar" :refresh="refresh" :loading="isLoading">
          <button type="button" @click="refresh" :disabled="isLoading" aria-label="Refresh">↻</button>
        </slot>
      </div>
    </slot>

    <slot :url="url" :html="html" :loading="isLoading">
      <slot name="loading" v-if="isLoading">
        <div data-ai-web-preview-loading>Loading...</div>
      </slot>
      <iframe
        ref="iframeRef"
        data-ai-web-preview-frame
        :src="src"
        :srcdoc="srcDoc"
        :sandbox="sandbox"
        :style="{ width, height }"
        :title="title ?? 'Preview'"
        @load="handleLoad"
      />
    </slot>
  </div>
</template>
