<script setup lang="ts">
import { ref } from 'vue'
import type { AiSchemaField } from '../../types'

defineOptions({ name: 'AiSchemaDisplay' })

defineProps<{
  fields: AiSchemaField[]
  title?: string
  depth?: number
}>()

const collapsedFields = ref<Record<string, boolean>>({})

function fieldKey(name: string, depth?: number): string {
  return `${depth ?? 0}:${name}`
}

function toggleField(name: string, depth?: number) {
  const key = fieldKey(name, depth)
  collapsedFields.value = {
    ...collapsedFields.value,
    [key]: !collapsedFields.value[key],
  }
}

function isCollapsed(name: string, depth?: number): boolean {
  return !!collapsedFields.value[fieldKey(name, depth)]
}
</script>

<template>
  <div
    data-ai-schema
    :data-depth="depth ?? 0"
    role="tree"
    :aria-label="title ?? 'Schema'"
  >
    <slot name="header" :title="title" v-if="title && !(depth)">
      <div data-ai-schema-header>{{ title }}</div>
    </slot>

    <slot :fields="fields">
      <div
        v-for="field in fields"
        :key="field.name"
        data-ai-schema-field
        :data-required="field.required || undefined"
        :data-has-children="!!field.children?.length || undefined"
        role="treeitem"
        :aria-expanded="field.children?.length ? !isCollapsed(field.name, depth) : undefined"
      >
        <slot name="field" :field="field" :depth="depth ?? 0" :toggle="() => toggleField(field.name, depth)" :collapsed="isCollapsed(field.name, depth)">
          <button
            v-if="field.children?.length"
            type="button"
            data-ai-schema-field-header
            :style="{ paddingLeft: `${(depth ?? 0) * 16}px` }"
            :aria-expanded="!isCollapsed(field.name, depth)"
            @click="toggleField(field.name, depth)"
          >
            <span data-ai-schema-toggle>
              {{ isCollapsed(field.name, depth) ? '▶' : '▼' }}
            </span>
            <span data-ai-schema-name>{{ field.name }}</span>
            <span data-ai-schema-type>{{ field.type }}</span>
            <span v-if="field.required" data-ai-schema-required>*</span>
            <span v-if="field.description" data-ai-schema-desc>{{ field.description }}</span>
          </button>
          <div
            v-else
            data-ai-schema-field-header
            :style="{ paddingLeft: `${(depth ?? 0) * 16}px` }"
          >
            <span data-ai-schema-name>{{ field.name }}</span>
            <span data-ai-schema-type>{{ field.type }}</span>
            <span v-if="field.required" data-ai-schema-required>*</span>
            <span v-if="field.description" data-ai-schema-desc>{{ field.description }}</span>
          </div>
        </slot>

        <AiSchemaDisplay
          v-if="field.children?.length && !isCollapsed(field.name, depth)"
          :fields="field.children"
          :depth="(depth ?? 0) + 1"
        />
      </div>
    </slot>
  </div>
</template>
