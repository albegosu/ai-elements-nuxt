<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
const props = withDefaults(defineProps<{
  src: string
  alt?: string
  width?: string | number
  height?: string | number
  zoomable?: boolean
  caption?: string
}>(), {
  alt: '',
  zoomable: true,
})

const isZoomed = ref(false)
const isLoading = ref(true)
const hasError = ref(false)
const lightboxRef = ref<HTMLDivElement | null>(null)

function toggleZoom() {
  if (props.zoomable) isZoomed.value = !isZoomed.value
}

function handleLoad() { isLoading.value = false }
function handleError() { isLoading.value = false; hasError.value = true }

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isZoomed.value) {
    isZoomed.value = false
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', onKeydown)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', onKeydown)
  }
})
</script>

<template>
  <div
    data-ai-image
    :data-zoomed="isZoomed || undefined"
    :data-zoomable="zoomable || undefined"
  >
    <slot
      :src="src"
      :alt="alt"
      :is-zoomed="isZoomed"
      :is-loading="isLoading"
      :has-error="hasError"
      :toggle-zoom="toggleZoom"
    >
      <slot name="loading" v-if="isLoading">
        <div data-ai-image-loading>Loading...</div>
      </slot>

      <slot name="error" v-if="hasError">
        <div data-ai-image-error>Failed to load image</div>
      </slot>

      <img
        v-show="!hasError"
        :src="src"
        :alt="alt"
        :width="width"
        :height="height"
        data-ai-image-element
        :style="{ cursor: zoomable ? 'zoom-in' : undefined }"
        @click="toggleZoom"
        @load="handleLoad"
        @error="handleError"
      />

      <slot name="caption" :caption="caption" v-if="caption">
        <div data-ai-image-caption>{{ caption }}</div>
      </slot>
    </slot>

    <Teleport to="body" v-if="isZoomed">
      <slot name="lightbox" :src="src" :alt="alt" :close="toggleZoom">
        <div
          ref="lightboxRef"
          data-ai-image-lightbox
          role="dialog"
          aria-modal="true"
          :aria-label="alt || 'Image preview'"
          tabindex="-1"
          @click="toggleZoom"
          @keydown.escape="toggleZoom"
        >
          <img :src="src" :alt="alt" data-ai-image-lightbox-img @click.stop />
        </div>
      </slot>
    </Teleport>
  </div>
</template>
