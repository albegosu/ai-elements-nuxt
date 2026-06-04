<script setup lang="ts">
import { categories } from '~/data/navigation'

definePageMeta({ layout: 'default' })
</script>

<template>
  <div>
    <DocsHeader
      title="Components"
      description="All headless AI Elements components for Nuxt. Each page includes a live preview, usage snippet, and props reference."
    />

    <div
      v-for="category in categories"
      :key="category.id"
      class="mb-10"
    >
      <h2 class="mb-1 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        {{ category.label }}
      </h2>
      <p class="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
        {{ category.description }}
      </p>
      <ul class="grid gap-2 sm:grid-cols-2">
        <li
          v-for="comp in category.components"
          :key="comp.slug"
        >
          <NuxtLink
            :to="`/components/${category.id}/${comp.slug}`"
            class="block rounded-lg border border-zinc-200 px-4 py-3 transition hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:border-zinc-600 dark:hover:bg-zinc-900"
          >
            <span class="font-medium text-zinc-900 dark:text-zinc-50">{{ comp.name }}</span>
            <span class="mt-1 block font-mono text-xs text-zinc-500">{{ comp.component }}</span>
            <span class="mt-1 block text-sm text-zinc-600 dark:text-zinc-400">{{ comp.description }}</span>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>
