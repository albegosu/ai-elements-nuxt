<script setup lang="ts">
const lines = [
  { type: 'command' as const, content: 'npx nuxi init my-ai-app' },
  { type: 'output' as const, content: '✔ Which package manager would you like to use?' },
  { type: 'output' as const, content: '  pnpm' },
  { type: 'output' as const, content: '✔ Installing dependencies...' },
  { type: 'command' as const, content: 'cd my-ai-app && pnpm add ai-elements-nuxt ai @ai-sdk/openai' },
  { type: 'output' as const, content: 'Packages: +148' },
  { type: 'output' as const, content: 'Done in 3.2s' },
  { type: 'info' as const, content: 'Ready to build', prefix: 'ℹ' },
]
</script>

<template>
  <div class="w-full max-w-lg overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
    <AiTerminal :lines="lines" title="zsh">
      <template #header="{ title: t }">
        <div class="flex items-center gap-2 border-b border-zinc-800 bg-zinc-900 px-4 py-2.5">
          <span class="flex gap-1.5">
            <span class="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <span class="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
            <span class="h-2.5 w-2.5 rounded-full bg-green-500/80" />
          </span>
          <span class="text-xs text-zinc-500">{{ t }}</span>
        </div>
      </template>
      <template #line="{ line }">
        <div
          class="px-4 py-0.5 font-mono text-[13px]"
          :class="{
            'text-zinc-100': line.type === 'command',
            'text-green-400': line.type === 'info',
            'text-zinc-500': line.type === 'output',
            'text-red-400': line.type === 'error',
          }"
        >
          <span v-if="line.prefix || line.type === 'command'" class="mr-2 text-green-500">
            {{ line.prefix ?? (line.type === 'command' ? '$' : '') }}
          </span>
          {{ line.content }}
        </div>
      </template>
    </AiTerminal>
    <div class="h-2 bg-zinc-950" />
  </div>
</template>
