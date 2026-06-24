<script setup lang="ts">
import { ref } from 'vue'
const props = withDefaults(defineProps<{
  id: string
  label: string
  x: number
  y: number
  type?: string
  status?: 'idle' | 'running' | 'completed' | 'error'
  selected?: boolean
  draggable?: boolean
  inputs?: string[]
  outputs?: string[]
  /** Canvas zoom for coordinate conversion when dragging */
  zoom?: number
  panX?: number
  panY?: number
}>(), {
  type: 'default',
  status: 'idle',
  selected: false,
  draggable: true,
  zoom: 1,
  panX: 0,
  panY: 0,
})

const emit = defineEmits<{
  (e: 'select', id: string, event?: MouseEvent): void
  (e: 'move', id: string, x: number, y: number): void
  (e: 'connect-start', nodeId: string, port: string, type: 'input' | 'output'): void
}>()

const nodeRef = ref<HTMLDivElement | null>(null)
const isDragging = ref(false)

function toCanvasCoords(clientX: number, clientY: number) {
  const canvas = nodeRef.value?.closest('[data-ai-canvas]') as HTMLElement | null
  const rect = canvas?.getBoundingClientRect()
  if (!rect) {
    return { x: props.x, y: props.y }
  }
  const zoom = props.zoom || 1
  return {
    x: (clientX - rect.left - props.panX) / zoom,
    y: (clientY - rect.top - props.panY) / zoom,
  }
}

function handleMouseDown(event: MouseEvent) {
  if (!props.draggable) return
  event.stopPropagation()
  isDragging.value = true
  emit('select', props.id, event)

  const handleMove = (e: MouseEvent) => {
    if (!isDragging.value) return
    const { x, y } = toCanvasCoords(e.clientX, e.clientY)
    emit('move', props.id, x, y)
  }
  const handleUp = () => {
    isDragging.value = false
    window.removeEventListener('mousemove', handleMove)
    window.removeEventListener('mouseup', handleUp)
  }
  window.addEventListener('mousemove', handleMove)
  window.addEventListener('mouseup', handleUp)
}

defineExpose({ nodeRef })
</script>

<template>
  <div
    ref="nodeRef"
    data-ai-node
    :data-type="type"
    :data-status="status"
    :data-selected="selected || undefined"
    :data-dragging="isDragging || undefined"
    :style="{ position: 'absolute', left: `${x}px`, top: `${y}px` }"
    role="treeitem"
    :aria-label="`Node: ${label}`"
    :aria-selected="selected"
    @mousedown="handleMouseDown"
  >
    <slot :id="id" :label="label" :type="type" :status="status" :selected="selected">
      <slot name="inputs" :inputs="inputs">
        <div v-if="inputs?.length" data-ai-node-inputs>
          <button
            v-for="input in inputs"
            :key="input"
            type="button"
            data-ai-node-port
            data-port-type="input"
            :aria-label="`Input ${input}`"
            @mousedown.stop="emit('connect-start', id, input, 'input')"
          />
        </div>
      </slot>

      <slot name="header" :label="label" :type="type" :status="status">
        <div data-ai-node-header>
          <slot name="status-indicator" :status="status">
            <span data-ai-node-status :data-status="status" />
          </slot>
          <span data-ai-node-label>{{ label }}</span>
        </div>
      </slot>

      <slot name="body" :id="id" :type="type" />

      <slot name="outputs" :outputs="outputs">
        <div v-if="outputs?.length" data-ai-node-outputs>
          <button
            v-for="output in outputs"
            :key="output"
            type="button"
            data-ai-node-port
            data-port-type="output"
            :aria-label="`Output ${output}`"
            @mousedown.stop="emit('connect-start', id, output, 'output')"
          />
        </div>
      </slot>

      <slot name="resize" :id="id" />
    </slot>
  </div>
</template>
