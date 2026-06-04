<script setup lang="ts">
import type { AiFileNode } from '../../types'

defineOptions({ name: 'AiFileTree' })

defineProps<{
  nodes: AiFileNode[]
  depth?: number
}>()

const emit = defineEmits<{
  (e: 'select', node: AiFileNode): void
  (e: 'toggle', node: AiFileNode): void
}>()

function handleToggle(node: AiFileNode) {
  if (node.type === 'directory') {
    node.expanded = !node.expanded
    emit('toggle', node)
  } else {
    emit('select', node)
  }
}
</script>

<template>
  <div
    data-ai-file-tree
    :data-depth="depth ?? 0"
    role="tree"
    :aria-label="depth ? undefined : 'File tree'"
  >
    <div
      v-for="node in nodes"
      :key="node.path"
      data-ai-file-node
      :data-type="node.type"
      :data-selected="node.selected || undefined"
      :data-expanded="node.expanded || undefined"
    >
      <slot name="node" :node="node" :depth="depth ?? 0" :toggle="() => handleToggle(node)">
        <button
          type="button"
          data-ai-file-node-button
          role="treeitem"
          :aria-expanded="node.type === 'directory' ? node.expanded : undefined"
          :aria-selected="node.selected"
          :style="{ paddingLeft: `${(depth ?? 0) * 16 + 8}px` }"
          @click="handleToggle(node)"
        >
          <slot name="icon" :node="node">
            <span data-ai-file-icon>
              {{ node.type === 'directory' ? (node.expanded ? '📂' : '📁') : '📄' }}
            </span>
          </slot>
          <slot name="name" :node="node">
            <span data-ai-file-name>{{ node.name }}</span>
          </slot>
        </button>
      </slot>

      <AiFileTree
        v-if="node.type === 'directory' && node.expanded && node.children?.length"
        :nodes="node.children"
        :depth="(depth ?? 0) + 1"
        @select="(n: AiFileNode) => emit('select', n)"
        @toggle="(n: AiFileNode) => emit('toggle', n)"
      />
    </div>
  </div>
</template>
