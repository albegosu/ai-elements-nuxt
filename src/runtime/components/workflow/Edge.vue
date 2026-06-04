<script setup lang="ts">
const props = withDefaults(defineProps<{
  id: string
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
  label?: string
  animated?: boolean
  selected?: boolean
  type?: 'bezier' | 'straight' | 'step'
}>(), {
  animated: false,
  selected: false,
  type: 'bezier',
})

const emit = defineEmits<{
  (e: 'select', id: string): void
  (e: 'remove', id: string): void
}>()

const path = computed(() => {
  const { sourceX: sx, sourceY: sy, targetX: tx, targetY: ty } = props
  if (props.type === 'straight') {
    return `M ${sx} ${sy} L ${tx} ${ty}`
  }
  if (props.type === 'step') {
    const midX = (sx + tx) / 2
    return `M ${sx} ${sy} H ${midX} V ${ty} H ${tx}`
  }
  const dx = Math.abs(tx - sx) * 0.5
  return `M ${sx} ${sy} C ${sx + dx} ${sy}, ${tx - dx} ${ty}, ${tx} ${ty}`
})

const labelPosition = computed(() => ({
  x: (props.sourceX + props.targetX) / 2,
  y: (props.sourceY + props.targetY) / 2,
}))

function handleKeydown(event: KeyboardEvent) {
  if (props.selected && (event.key === 'Delete' || event.key === 'Backspace')) {
    emit('remove', props.id)
  }
}
</script>

<template>
  <g
    data-ai-edge
    :data-animated="animated || undefined"
    :data-selected="selected || undefined"
    tabindex="0"
    @click.stop="emit('select', id)"
    @keydown="handleKeydown"
  >
    <slot :path="path" :label="label" :label-position="labelPosition">
      <path
        :d="path"
        data-ai-edge-path
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        :class="{ 'ai-edge-animated': animated }"
        :stroke-dasharray="animated ? '8 4' : undefined"
      />

      <path
        :d="path"
        data-ai-edge-hitbox
        fill="none"
        stroke="transparent"
        stroke-width="20"
        style="cursor: pointer;"
      />

      <slot name="label" :label="label" :position="labelPosition" v-if="label">
        <text
          :x="labelPosition.x"
          :y="labelPosition.y"
          data-ai-edge-label
          text-anchor="middle"
          dominant-baseline="middle"
        >
          {{ label }}
        </text>
      </slot>
    </slot>
  </g>
</template>

<style scoped>
.ai-edge-animated {
  animation: ai-edge-flow 1s linear infinite;
}

@keyframes ai-edge-flow {
  to {
    stroke-dashoffset: -24;
  }
}
</style>
