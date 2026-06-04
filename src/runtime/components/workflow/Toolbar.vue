<script setup lang="ts">
withDefaults(defineProps<{
  position?: 'top' | 'bottom'
  orientation?: 'horizontal' | 'vertical'
}>(), {
  position: 'top',
  orientation: 'horizontal',
})

const emit = defineEmits<{
  (e: 'action', action: string): void
}>()
</script>

<template>
  <div
    data-ai-toolbar
    :data-position="position"
    :data-orientation="orientation"
    role="toolbar"
    aria-label="Workflow toolbar"
  >
    <slot :emit-action="(a: string) => emit('action', a)">
      <slot name="actions" :emit-action="(a: string) => emit('action', a)" />
    </slot>
  </div>
</template>
