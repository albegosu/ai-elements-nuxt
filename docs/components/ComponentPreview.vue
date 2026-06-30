<script setup lang="ts">
defineProps<{
  title?: string
  code?: string
}>()

const activeTab = ref<'preview' | 'code'>('preview')
</script>

<template>
  <div class="rounded-xl border border-zinc-200 dark:border-zinc-800">
    <div class="flex items-center border-b border-zinc-200 px-4 dark:border-zinc-800">
      <button
        class="relative py-2.5 text-sm font-medium transition-colors"
        :class="activeTab === 'preview'
          ? 'text-blue-600 dark:text-blue-400'
          : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'"
        @click="activeTab = 'preview'"
      >
        Preview
        <span
          v-if="activeTab === 'preview'"
          class="absolute inset-x-0 -bottom-px h-0.5 bg-blue-600 dark:bg-blue-400"
        />
      </button>
      <button
        v-if="code"
        class="relative ml-4 py-2.5 text-sm font-medium transition-colors"
        :class="activeTab === 'code'
          ? 'text-blue-600 dark:text-blue-400'
          : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'"
        @click="activeTab = 'code'"
      >
        Code
        <span
          v-if="activeTab === 'code'"
          class="absolute inset-x-0 -bottom-px h-0.5 bg-blue-600 dark:bg-blue-400"
        />
      </button>
    </div>

    <div
      v-show="activeTab === 'preview'"
      class="overflow-hidden p-8"
    >
      <div class="flex w-full items-start justify-center">
        <slot />
      </div>
    </div>

    <DocsCodePanel
      v-if="code"
      v-show="activeTab === 'code'"
      :code="code"
    />
  </div>
</template>
