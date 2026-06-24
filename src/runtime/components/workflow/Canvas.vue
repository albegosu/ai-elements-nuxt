<script setup lang="ts">
import { computed, ref, watch } from 'vue'
const props = withDefaults(defineProps<{
  width?: string
  height?: string
  zoom?: number
  panX?: number
  panY?: number
  minZoom?: number
  maxZoom?: number
  gridSize?: number
  showGrid?: boolean
  snapToGrid?: boolean
}>(), {
  width: '100%',
  height: '500px',
  zoom: 1,
  panX: 0,
  panY: 0,
  minZoom: 0.1,
  maxZoom: 3,
  gridSize: 20,
  showGrid: true,
  snapToGrid: false,
})

const emit = defineEmits<{
  (e: 'zoom', zoom: number): void
  (e: 'pan', x: number, y: number): void
  (e: 'click', x: number, y: number): void
  (e: 'select', ids: string[]): void
}>()

const canvasRef = ref<HTMLDivElement | null>(null)
const currentZoom = ref(props.zoom)
const currentPanX = ref(props.panX)
const currentPanY = ref(props.panY)
const isPanning = ref(false)
const panStart = ref({ x: 0, y: 0 })
let lastTouchDistance = 0

watch(() => props.zoom, (v) => { currentZoom.value = v })
watch(() => props.panX, (v) => { currentPanX.value = v })
watch(() => props.panY, (v) => { currentPanY.value = v })

const transform = computed(() =>
  `translate(${currentPanX.value}px, ${currentPanY.value}px) scale(${currentZoom.value})`,
)

function snap(value: number) {
  if (!props.snapToGrid || !props.gridSize) return value
  return Math.round(value / props.gridSize) * props.gridSize
}

function clientToCanvas(clientX: number, clientY: number) {
  const rect = canvasRef.value?.getBoundingClientRect()
  if (!rect) return { x: 0, y: 0 }
  const x = (clientX - rect.left - currentPanX.value) / currentZoom.value
  const y = (clientY - rect.top - currentPanY.value) / currentZoom.value
  return { x: snap(x), y: snap(y) }
}

function handleWheel(event: WheelEvent) {
  event.preventDefault()
  const delta = event.deltaY > 0 ? -0.1 : 0.1
  const newZoom = Math.min(props.maxZoom, Math.max(props.minZoom, currentZoom.value + delta))
  currentZoom.value = newZoom
  emit('zoom', newZoom)
}

function handleMouseDown(event: MouseEvent) {
  if (event.button === 1 || event.shiftKey) {
    isPanning.value = true
    panStart.value = { x: event.clientX - currentPanX.value, y: event.clientY - currentPanY.value }
  }
}

function handleMouseMove(event: MouseEvent) {
  if (!isPanning.value) return
  currentPanX.value = event.clientX - panStart.value.x
  currentPanY.value = event.clientY - panStart.value.y
  emit('pan', currentPanX.value, currentPanY.value)
}

function handleMouseUp() {
  isPanning.value = false
}

function handleClick(event: MouseEvent) {
  if (!isPanning.value) {
    const { x, y } = clientToCanvas(event.clientX, event.clientY)
    emit('click', x, y)
  }
}

function touchDistance(touches: TouchList) {
  if (touches.length < 2) return 0
  const dx = touches[0].clientX - touches[1].clientX
  const dy = touches[0].clientY - touches[1].clientY
  return Math.hypot(dx, dy)
}

function handleTouchStart(event: TouchEvent) {
  if (event.touches.length === 2) {
    lastTouchDistance = touchDistance(event.touches)
  } else if (event.touches.length === 1) {
    isPanning.value = true
    panStart.value = {
      x: event.touches[0].clientX - currentPanX.value,
      y: event.touches[0].clientY - currentPanY.value,
    }
  }
}

function handleTouchMove(event: TouchEvent) {
  if (event.touches.length === 2 && lastTouchDistance > 0) {
    event.preventDefault()
    const dist = touchDistance(event.touches)
    const scale = dist / lastTouchDistance
    const newZoom = Math.min(props.maxZoom, Math.max(props.minZoom, currentZoom.value * scale))
    currentZoom.value = newZoom
    emit('zoom', newZoom)
    lastTouchDistance = dist
  } else if (event.touches.length === 1 && isPanning.value) {
    currentPanX.value = event.touches[0].clientX - panStart.value.x
    currentPanY.value = event.touches[0].clientY - panStart.value.y
    emit('pan', currentPanX.value, currentPanY.value)
  }
}

function handleTouchEnd() {
  isPanning.value = false
  lastTouchDistance = 0
}

function zoomIn() {
  currentZoom.value = Math.min(props.maxZoom, currentZoom.value + 0.2)
  emit('zoom', currentZoom.value)
}

function zoomOut() {
  currentZoom.value = Math.max(props.minZoom, currentZoom.value - 0.2)
  emit('zoom', currentZoom.value)
}

function resetView() {
  currentZoom.value = 1
  currentPanX.value = 0
  currentPanY.value = 0
  emit('zoom', 1)
  emit('pan', 0, 0)
}

function fitView(nodePositions: Array<{ x: number; y: number }>) {
  if (!nodePositions.length || !canvasRef.value) return
  const rect = canvasRef.value.getBoundingClientRect()
  const xs = nodePositions.map(p => p.x)
  const ys = nodePositions.map(p => p.y)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)
  const padding = 40
  const w = maxX - minX + padding * 2 || 1
  const h = maxY - minY + padding * 2 || 1
  const scale = Math.min(props.maxZoom, Math.max(props.minZoom, Math.min(rect.width / w, rect.height / h)))
  currentZoom.value = scale
  currentPanX.value = padding - minX * scale
  currentPanY.value = padding - minY * scale
  emit('zoom', scale)
  emit('pan', currentPanX.value, currentPanY.value)
}

defineExpose({ zoomIn, zoomOut, resetView, fitView, canvasRef, clientToCanvas })
</script>

<template>
  <div
    ref="canvasRef"
    data-ai-canvas
    :data-panning="isPanning || undefined"
    :data-snap-grid="snapToGrid || undefined"
    role="application"
    aria-label="Workflow canvas"
    :style="{ width, height, position: 'relative', overflow: 'hidden', touchAction: 'none' }"
    @wheel.prevent="handleWheel"
    @mousedown="handleMouseDown"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
    @mouseleave="handleMouseUp"
    @click="handleClick"
    @touchstart.passive="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <slot name="minimap" :zoom="currentZoom" :pan-x="currentPanX" :pan-y="currentPanY" />

    <slot name="background" :zoom="currentZoom" :grid-size="gridSize" :show-grid="showGrid">
      <svg
        v-if="showGrid"
        data-ai-canvas-grid
        :style="{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }"
      >
        <defs>
          <pattern
            :id="'grid-' + gridSize"
            :width="gridSize * currentZoom"
            :height="gridSize * currentZoom"
            patternUnits="userSpaceOnUse"
            :x="currentPanX % (gridSize * currentZoom)"
            :y="currentPanY % (gridSize * currentZoom)"
          >
            <circle :cx="1" :cy="1" r="1" fill="currentColor" opacity="0.15" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" :fill="`url(#grid-${gridSize})`" />
      </svg>
    </slot>

    <div
      data-ai-canvas-viewport
      :style="{ transform, transformOrigin: '0 0', position: 'absolute', inset: 0 }"
    >
      <slot
        :zoom="currentZoom"
        :pan-x="currentPanX"
        :pan-y="currentPanY"
        :client-to-canvas="clientToCanvas"
      />
    </div>
  </div>
</template>
