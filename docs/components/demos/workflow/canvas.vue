<template>
  <AiCanvas height="280px" snap-to-grid class="relative overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
    <template #default>
      <svg class="pointer-events-none absolute inset-0 h-full w-full" style="overflow: visible">
        <AiEdge
          id="e1"
          :source-x="148"
          :source-y="90"
          :target-x="218"
          :target-y="90"
          type="straight"
        />
        <AiEdge
          id="e2"
          :source-x="338"
          :source-y="90"
          :target-x="408"
          :target-y="90"
          type="straight"
          animated
        />
      </svg>

      <AiNode id="n1" label="Input" :x="40" :y="60" status="completed" />
      <AiNode id="n2" label="Process" :x="220" :y="60" status="running" />
      <AiNode id="n3" label="Output" :x="410" :y="60" status="idle" />
    </template>
  </AiCanvas>
</template>
