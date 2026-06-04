<script setup lang="ts">
const pkg = {
  name: 'ai-elements-nuxt',
  version: '0.3.0',
  description: 'Headless AI UI components for Nuxt — chat, streaming, tool calls, and more.',
  license: 'MIT',
  homepage: 'https://github.com/albegosu/ai-elements-nuxt',
  downloads: 24500,
  dependencies: {
    'ai': '^6.0.0',
    '@ai-sdk/vue': '^3.0.0',
    '@nuxt/kit': '^3.15.0',
  },
}
</script>

<template>
  <div class="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
    <AiPackageInfo :package="pkg">
      <template #header="{ pkg: p }">
        <div class="flex items-baseline gap-2">
          <span class="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{{ p.name }}</span>
          <span class="rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-xs text-zinc-500 dark:bg-zinc-800">v{{ p.version }}</span>
        </div>
      </template>
      <template #description="{ description }">
        <p class="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{{ description }}</p>
      </template>
      <template #meta="{ pkg: p }">
        <div class="mt-3 flex gap-3 text-xs text-zinc-500">
          <span>{{ p.license }}</span>
          <span>{{ p.downloads?.toLocaleString() }} downloads</span>
        </div>
      </template>
      <template #dependencies="{ dependencies }">
        <div class="mt-4 space-y-1 border-t border-zinc-100 pt-3 dark:border-zinc-800">
          <p class="text-xs font-medium text-zinc-500">Dependencies</p>
          <div v-for="(ver, name) in dependencies" :key="name" class="flex justify-between font-mono text-xs">
            <span class="text-zinc-700 dark:text-zinc-300">{{ name }}</span>
            <span class="text-zinc-400">{{ ver }}</span>
          </div>
        </div>
      </template>
    </AiPackageInfo>
  </div>
</template>
