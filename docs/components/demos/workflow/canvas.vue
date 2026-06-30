<script setup lang="ts">
type NodeStatus = 'idle' | 'running' | 'completed' | 'error'

interface WorkflowNode {
  id: string
  label: string
  x: number
  y: number
  type: string
  status: NodeStatus
}

const canvasRef = ref<{
  zoomIn: () => void
  zoomOut: () => void
  resetView: () => void
  fitView: (positions: Array<{ x: number; y: number }>) => void
} | null>(null)

const zoom = ref(1)

const NODE_W = 112
const NODE_H = 48

const nodes = reactive<WorkflowNode[]>([
  { id: 'n1', label: 'User Query', x: 32, y: 96, type: 'input', status: 'completed' },
  { id: 'n2', label: 'Embed Query', x: 220, y: 36, type: 'process', status: 'completed' },
  { id: 'n3', label: 'Vector Search', x: 220, y: 156, type: 'process', status: 'running' },
  { id: 'n4', label: 'Rerank', x: 420, y: 96, type: 'process', status: 'idle' },
  { id: 'n5', label: 'Generate', x: 620, y: 96, type: 'output', status: 'idle' },
])

const edges = [
  { id: 'e1', from: 'n1', to: 'n2', animated: false },
  { id: 'e2', from: 'n1', to: 'n3', animated: false },
  { id: 'e3', from: 'n2', to: 'n4', animated: false },
  { id: 'e4', from: 'n3', to: 'n4', animated: true },
  { id: 'e5', from: 'n4', to: 'n5', animated: false },
]

function nodeById(id: string) {
  return nodes.find(node => node.id === id)!
}

function edgeEndpoints(fromId: string, toId: string) {
  const from = nodeById(fromId)
  const to = nodeById(toId)
  return {
    sourceX: from.x + NODE_W,
    sourceY: from.y + NODE_H / 2,
    targetX: to.x,
    targetY: to.y + NODE_H / 2,
  }
}

function handleNodeMove(id: string, x: number, y: number) {
  const node = nodes.find(item => item.id === id)
  if (node) {
    node.x = x
    node.y = y
  }
}

function handleZoomIn() {
  canvasRef.value?.zoomIn()
}

function handleZoomOut() {
  canvasRef.value?.zoomOut()
}

function handleReset() {
  canvasRef.value?.resetView()
}

function handleFitView() {
  canvasRef.value?.fitView(nodes.map(node => ({ x: node.x, y: node.y })))
}

const statusLabel: Record<NodeStatus, string> = {
  idle: 'idle',
  running: 'running',
  completed: 'done',
  error: 'error',
}
</script>

<template>
  <div class="relative w-full">
    <AiCanvas
      ref="canvasRef"
      height="360px"
      snap-to-grid
      :zoom="zoom"
      class="relative w-full overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
      @zoom="zoom = $event"
    >
      <template #default="{ zoom: canvasZoom, panX, panY }">
        <svg
          class="pointer-events-none absolute inset-0 h-full w-full text-zinc-400 dark:text-zinc-500"
          style="overflow: visible"
        >
          <AiEdge
            v-for="edge in edges"
            :id="edge.id"
            :key="edge.id"
            v-bind="edgeEndpoints(edge.from, edge.to)"
            type="bezier"
            :animated="edge.animated"
          />
        </svg>

        <AiNode
          v-for="node in nodes"
          :key="node.id"
          v-bind="node"
          :zoom="canvasZoom"
          :pan-x="panX"
          :pan-y="panY"
          @move="handleNodeMove"
        >
          <template #default="{ label, status, type }">
            <div
              class="min-w-[7rem] select-none rounded-lg border bg-white shadow-sm dark:bg-zinc-900"
              :class="{
                'border-emerald-500/50': status === 'completed',
                'border-blue-500 shadow-[0_0_0_3px_rgba(59,130,246,0.15)]': status === 'running',
                'border-zinc-200 dark:border-zinc-700': status === 'idle' || status === 'error',
              }"
            >
              <div class="flex items-center gap-2 border-b border-zinc-100 px-3 py-2 dark:border-zinc-800">
                <span
                  class="h-2 w-2 rounded-full"
                  :class="{
                    'bg-emerald-500': status === 'completed',
                    'animate-pulse bg-blue-500': status === 'running',
                    'bg-zinc-300 dark:bg-zinc-600': status === 'idle',
                    'bg-red-500': status === 'error',
                  }"
                />
                <span class="text-xs font-medium text-zinc-800 dark:text-zinc-200">{{ label }}</span>
              </div>
              <div class="flex items-center justify-between px-3 py-1.5">
                <span class="text-[10px] uppercase tracking-wide text-zinc-400">{{ type }}</span>
                <span class="font-mono text-[10px] text-zinc-500">{{ statusLabel[status] }}</span>
              </div>
            </div>
          </template>
        </AiNode>
      </template>
    </AiCanvas>

    <div class="pointer-events-none absolute inset-0">
      <p class="absolute left-3 top-3 rounded-md bg-white/80 px-2 py-1 text-[11px] text-zinc-500 backdrop-blur-sm dark:bg-zinc-900/80 dark:text-zinc-400">
        Scroll to zoom · Shift+drag to pan · Drag nodes to reposition
      </p>

      <AiControls
        :zoom="zoom"
        position="bottom-right"
        class="pointer-events-auto absolute bottom-3 right-3"
        @zoom-in="handleZoomIn"
        @zoom-out="handleZoomOut"
        @reset="handleReset"
        @fit-view="handleFitView"
      >
        <template #default>
          <div class="inline-flex items-center gap-1 rounded-xl border border-zinc-200 bg-white/95 p-1 shadow-sm backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-900/95">
            <button
              type="button"
              class="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              aria-label="Zoom out"
              @click="handleZoomOut()"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
              </svg>
            </button>

            <span class="w-12 text-center font-mono text-xs text-zinc-600 dark:text-zinc-400">
              {{ Math.round(zoom * 100) }}%
            </span>

            <button
              type="button"
              class="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              aria-label="Zoom in"
              @click="handleZoomIn()"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>

            <div class="mx-0.5 h-5 w-px bg-zinc-200 dark:bg-zinc-700" />

            <button
              type="button"
              class="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              aria-label="Reset view"
              @click="handleReset()"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
              </svg>
            </button>

            <button
              type="button"
              class="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              aria-label="Fit view"
              @click="handleFitView()"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
            </button>
          </div>
        </template>
      </AiControls>
    </div>
  </div>
</template>
