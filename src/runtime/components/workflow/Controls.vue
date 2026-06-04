<script setup lang="ts">
defineProps<{
  zoom?: number
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}>()

const emit = defineEmits<{
  (e: 'zoom-in'): void
  (e: 'zoom-out'): void
  (e: 'reset'): void
  (e: 'fit-view'): void
}>()
</script>

<template>
  <div
    data-ai-controls
    :data-position="position ?? 'bottom-left'"
    role="toolbar"
    aria-label="Canvas controls"
  >
    <slot :zoom="zoom" :zoom-in="() => emit('zoom-in')" :zoom-out="() => emit('zoom-out')" :reset="() => emit('reset')" :fit-view="() => emit('fit-view')">
      <slot name="zoom-in" :zoom-in="() => emit('zoom-in')">
        <button type="button" @click="emit('zoom-in')" aria-label="Zoom in">+</button>
      </slot>
      <slot name="zoom-display" :zoom="zoom">
        <span v-if="zoom" data-ai-controls-zoom>{{ Math.round(zoom * 100) }}%</span>
      </slot>
      <slot name="zoom-out" :zoom-out="() => emit('zoom-out')">
        <button type="button" @click="emit('zoom-out')" aria-label="Zoom out">−</button>
      </slot>
      <slot name="reset" :reset="() => emit('reset')">
        <button type="button" @click="emit('reset')" aria-label="Reset view">⟲</button>
      </slot>
      <slot name="fit-view" :fit-view="() => emit('fit-view')">
        <button type="button" @click="emit('fit-view')" aria-label="Fit view">⤢</button>
      </slot>
    </slot>
  </div>
</template>
