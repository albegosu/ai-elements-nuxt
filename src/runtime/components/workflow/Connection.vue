<script setup lang="ts">
const props = withDefaults(defineProps<{
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
  active?: boolean
  validTarget?: boolean
}>(), {
  active: false,
  validTarget: true,
})

const pathD = computed(() => {
  const { sourceX, sourceY, targetX, targetY } = props
  const midX = (sourceX + targetX) / 2
  return `M ${sourceX} ${sourceY} C ${midX} ${sourceY}, ${midX} ${targetY}, ${targetX} ${targetY}`
})
</script>

<template>
  <g
    data-ai-connection
    :data-active="active || undefined"
    :data-valid="validTarget || undefined"
    :data-invalid="validTarget === false || undefined"
  >
    <slot
      :source-x="sourceX"
      :source-y="sourceY"
      :target-x="targetX"
      :target-y="targetY"
      :path="pathD"
      :active="active"
      :valid-target="validTarget"
    >
      <path
        :d="pathD"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        :stroke-dasharray="active ? '4 4' : undefined"
        :opacity="validTarget ? 0.6 : 0.35"
      />
      <circle
        :cx="targetX"
        :cy="targetY"
        r="5"
        fill="currentColor"
        :opacity="validTarget ? 0.7 : 0.35"
        data-ai-connection-target
      />
    </slot>
  </g>
</template>
