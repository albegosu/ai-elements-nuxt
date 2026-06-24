<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { AiContextItem } from '../../types'
import { useUniqueId } from '../../utils/useUniqueId'

const listId = useUniqueId('ai-context-list')

const props = withDefaults(defineProps<{
  items: AiContextItem[]
  collapsed?: boolean
}>(), {
  collapsed: true,
})

const isCollapsed = ref(props.collapsed)

watch(() => props.collapsed, (val) => {
  isCollapsed.value = val
})

function toggle() {
  isCollapsed.value = !isCollapsed.value
}

const totalTokens = computed(() =>
  props.items.reduce((acc, item) => acc + (item.tokenCount ?? 0), 0)
)
</script>

<template>
  <div
    data-ai-context
    :data-collapsed="isCollapsed || undefined"
  >
    <slot
      name="trigger"
      :collapsed="isCollapsed"
      :toggle="toggle"
      :item-count="items.length"
      :total-tokens="totalTokens"
    >
      <button
        type="button"
        @click="toggle"
        :aria-expanded="!isCollapsed"
        :aria-controls="listId"
      >
        <slot name="trigger-label" :count="items.length" :tokens="totalTokens">
          Context ({{ items.length }} items, {{ totalTokens }} tokens)
        </slot>
      </button>
    </slot>

    <div
      v-show="!isCollapsed"
      :id="listId"
      data-ai-context-list
      role="list"
      aria-label="Context items"
    >
      <slot :items="items">
        <div
          v-for="item in items"
          :key="item.id"
          data-ai-context-item
          :data-type="item.type"
          role="listitem"
        >
          <slot name="item" :item="item">
            <slot name="item-type" :type="item.type">
              <span data-ai-context-type>{{ item.type }}</span>
            </slot>
            <slot name="item-title" :item="item">
              <span data-ai-context-title>{{ item.title }}</span>
            </slot>
            <slot name="item-tokens" :tokens="item.tokenCount">
              <span v-if="item.tokenCount" data-ai-context-tokens>
                {{ item.tokenCount }} tokens
              </span>
            </slot>
          </slot>
        </div>
      </slot>
    </div>
  </div>
</template>
