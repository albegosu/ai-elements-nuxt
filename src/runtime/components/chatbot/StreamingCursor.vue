<script setup lang="ts">
withDefaults(defineProps<{
  active?: boolean
  character?: string
  blinkRate?: string
}>(), {
  active: true,
  character: '|',
  blinkRate: '1s',
})
</script>

<template>
  <span
    v-if="active"
    data-ai-cursor
    role="presentation"
    aria-hidden="true"
    :style="{ animationDuration: blinkRate }"
  >
    <slot :active="active" :character="character">
      {{ character }}
    </slot>
  </span>
</template>
