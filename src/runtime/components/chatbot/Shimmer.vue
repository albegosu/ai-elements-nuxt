<script setup lang="ts">
import { computed } from 'vue'
const props = withDefaults(defineProps<{
  active?: boolean
  lines?: number
}>(), {
  active: true,
  lines: 3,
})

/** Deterministic widths (SSR-safe) */
const lineWidths = computed(() =>
  Array.from({ length: props.lines }, (_, i) => `${55 + ((i * 17) % 35)}%`),
)
</script>

<template>
  <div
    v-if="active"
    data-ai-shimmer
    role="status"
    aria-label="Loading"
    aria-live="polite"
  >
    <slot :lines="lines" :line-widths="lineWidths">
      <div
        v-for="(width, i) in lineWidths"
        :key="i"
        data-ai-shimmer-line
        :style="{ width }"
      />
    </slot>
  </div>
</template>
