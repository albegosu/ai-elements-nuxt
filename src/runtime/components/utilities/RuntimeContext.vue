<script setup lang="ts">
import { ref, computed } from 'vue'
import type { AiRuntimeContextEntry } from '../../types/realtime'

const props = withDefaults(defineProps<{
  entries: AiRuntimeContextEntry[]
  title?: string
  collapsed?: boolean
  filterType?: 'runtime' | 'tool' | 'approval'
}>(), {
  title: 'Runtime Context',
  collapsed: false,
})

const isCollapsed = ref(props.collapsed)

const filteredEntries = computed(() => {
  if (!props.filterType) return props.entries
  return props.entries.filter(e => e.type === props.filterType)
})

const groupedByType = computed(() => {
  const groups: Record<string, AiRuntimeContextEntry[]> = {}
  for (const entry of filteredEntries.value) {
    const key = entry.type
    if (!groups[key]) groups[key] = []
    groups[key].push(entry)
  }
  return groups
})

function formatValue(value: unknown): string {
  if (value === undefined) return 'undefined'
  if (value === null) return 'null'
  if (typeof value === 'string') return value
  return JSON.stringify(value, null, 2)
}

function toggle() {
  isCollapsed.value = !isCollapsed.value
}

defineExpose({ isCollapsed, toggle })
</script>

<template>
  <div
    data-ai-runtime-context
    :data-collapsed="isCollapsed || undefined"
    role="region"
    :aria-label="title"
  >
    <slot
      :entries="filteredEntries"
      :grouped="groupedByType"
      :is-collapsed="isCollapsed"
      :toggle="toggle"
      :format-value="formatValue"
    >
      <slot name="header" :title="title" :count="filteredEntries.length" :is-collapsed="isCollapsed" :toggle="toggle">
        <button
          type="button"
          data-ai-runtime-context-header
          :aria-expanded="!isCollapsed"
          @click="toggle"
        >
          <span data-ai-runtime-context-title>{{ title }}</span>
          <span data-ai-runtime-context-count>{{ filteredEntries.length }} entries</span>
        </button>
      </slot>

      <div v-if="!isCollapsed" data-ai-runtime-context-body>
        <div
          v-for="(groupEntries, type) in groupedByType"
          :key="type"
          data-ai-runtime-context-group
          :data-type="type"
        >
          <slot name="group-header" :type="type" :entries="groupEntries">
            <div data-ai-runtime-context-group-header>
              {{ type }} ({{ groupEntries.length }})
            </div>
          </slot>

          <div data-ai-runtime-context-group-entries>
            <div
              v-for="entry in groupEntries"
              :key="entry.key"
              data-ai-runtime-context-entry
              :data-type="entry.type"
            >
              <slot name="entry" :entry="entry" :format-value="formatValue">
                <div data-ai-runtime-context-entry-header>
                  <span data-ai-runtime-context-entry-key>{{ entry.key }}</span>
                  <span v-if="entry.scope" data-ai-runtime-context-entry-scope>{{ entry.scope }}</span>
                </div>
                <pre data-ai-runtime-context-entry-value><code>{{ formatValue(entry.value) }}</code></pre>
              </slot>
            </div>
          </div>
        </div>
      </div>
    </slot>
  </div>
</template>
