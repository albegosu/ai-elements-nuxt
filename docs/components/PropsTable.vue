<script setup lang="ts">
export interface PropRow {
  name: string
  type: string
  default?: string
  description?: string
  required?: boolean
}

const { rows } = defineProps<{
  rows: PropRow[]
}>()
</script>

<template>
  <div class="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
    <table class="w-full text-left text-sm">
      <thead class="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
        <tr>
          <th class="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
            Prop
          </th>
          <th class="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
            Type
          </th>
          <th class="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
            Default
          </th>
          <th class="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
            Description
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-zinc-200 dark:divide-zinc-800">
        <tr
          v-for="row in rows"
          :id="`prop-${row.name}`"
          :key="row.name"
          class="scroll-mt-24 bg-white dark:bg-zinc-950"
        >
          <td class="px-4 py-3 font-mono text-xs text-zinc-900 dark:text-zinc-100">
            <span>{{ row.name }}</span>
            <span
              v-if="row.required"
              class="ml-1 text-red-500"
            >*</span>
          </td>
          <td class="px-4 py-3 font-mono text-xs text-zinc-600 dark:text-zinc-400">
            {{ row.type }}
          </td>
          <td class="px-4 py-3 font-mono text-xs text-zinc-500">
            {{ row.default ?? '—' }}
          </td>
          <td class="px-4 py-3 text-zinc-600 dark:text-zinc-400">
            {{ row.description ?? '—' }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
