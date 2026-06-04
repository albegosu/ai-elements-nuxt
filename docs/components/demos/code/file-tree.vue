<script setup lang="ts">
const nodes = [
  {
    name: 'src',
    type: 'directory' as const,
    path: 'src',
    expanded: true,
    children: [
      {
        name: 'components',
        type: 'directory' as const,
        path: 'src/components',
        expanded: true,
        children: [
          { name: 'ChatWindow.vue', type: 'file' as const, path: 'src/components/ChatWindow.vue', selected: true },
          { name: 'MessageBubble.vue', type: 'file' as const, path: 'src/components/MessageBubble.vue' },
          { name: 'PromptInput.vue', type: 'file' as const, path: 'src/components/PromptInput.vue' },
        ],
      },
      {
        name: 'pages',
        type: 'directory' as const,
        path: 'src/pages',
        children: [
          { name: 'index.vue', type: 'file' as const, path: 'src/pages/index.vue' },
          { name: 'chat.vue', type: 'file' as const, path: 'src/pages/chat.vue' },
        ],
      },
    ],
  },
  { name: 'package.json', type: 'file' as const, path: 'package.json' },
  { name: 'nuxt.config.ts', type: 'file' as const, path: 'nuxt.config.ts' },
]
</script>

<template>
  <div class="w-full max-w-xs rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
    <p class="mb-2 px-2 text-xs font-medium text-zinc-500">Project</p>
    <AiFileTree :nodes="nodes">
      <template #node="{ node, depth, toggle }">
        <button
          type="button"
          class="flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-sm transition hover:bg-zinc-50 dark:hover:bg-zinc-800"
          :class="{ 'bg-zinc-100 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50': node.selected }"
          :style="{ paddingLeft: `${depth * 12 + 8}px` }"
          @click="toggle"
        >
          <svg v-if="node.type === 'directory'" class="h-4 w-4 shrink-0 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
          </svg>
          <svg v-else class="h-4 w-4 shrink-0 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
          <span class="truncate text-zinc-700 dark:text-zinc-300">{{ node.name }}</span>
        </button>
      </template>
    </AiFileTree>
  </div>
</template>
