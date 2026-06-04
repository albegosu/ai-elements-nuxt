<template>
  <div class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
    <p class="mb-3 text-xs font-medium text-zinc-500">Connection</p>
    <svg width="200" height="80" class="overflow-visible">
      <AiConnection :source-x="20" :source-y="40" :target-x="180" :target-y="40" :active="true">
        <template #default="{ path: connPath, active }">
          <path
            :d="connPath || 'M 20 40 C 70 40, 130 40, 180 40'"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            :stroke-dasharray="active ? '6 3' : '4 4'"
            :class="active ? 'text-blue-500' : 'text-zinc-300 dark:text-zinc-600'"
          />
          <circle cx="20" cy="40" r="4" fill="currentColor" :class="active ? 'text-blue-500' : 'text-zinc-400'" />
          <circle cx="180" cy="40" r="4" fill="currentColor" :class="active ? 'text-blue-500' : 'text-zinc-400'" />
        </template>
      </AiConnection>
    </svg>
  </div>
</template>
