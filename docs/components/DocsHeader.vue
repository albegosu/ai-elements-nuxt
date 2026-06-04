<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  component?: string
}>()
</script>

<template>
  <header class="mb-8 border-b border-zinc-200 pb-8 dark:border-zinc-800">
    <p
      v-if="component"
      class="mb-2 font-mono text-sm text-zinc-500"
    >
      {{ component }}
    </p>
    <h1 class="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
      {{ title }}
    </h1>
    <p
      v-if="description"
      class="mt-3 max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400"
    >
      {{ description }}
    </p>
  </header>
</template>
