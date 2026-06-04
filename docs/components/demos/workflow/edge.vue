<template>
  <div class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
    <p class="mb-3 text-xs font-medium text-zinc-500">Edge</p>
    <svg width="240" height="80" class="overflow-visible">
      <defs>
        <marker id="edge-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" class="text-zinc-400 dark:text-zinc-500" />
        </marker>
      </defs>
      <AiEdge id="e1" :source-x="20" :source-y="40" :target-x="220" :target-y="40" label="data">
        <template #default="{ path: edgePath, labelPosition, label }">
          <path :d="edgePath || 'M 20 40 C 90 40, 150 40, 220 40'" fill="none" stroke="currentColor" stroke-width="1.5" class="text-zinc-300 dark:text-zinc-600" marker-end="url(#edge-arrow)" />
          <rect :x="labelPosition.x - 18" :y="labelPosition.y - 10" width="36" height="20" rx="4" fill="currentColor" class="text-zinc-100 dark:text-zinc-800" />
          <text :x="labelPosition.x" :y="labelPosition.y + 3" text-anchor="middle" class="fill-zinc-500 text-[10px] font-medium dark:fill-zinc-400">{{ label }}</text>
        </template>
      </AiEdge>
    </svg>
  </div>
</template>
