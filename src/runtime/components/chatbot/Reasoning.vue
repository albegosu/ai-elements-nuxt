<script setup lang="ts">
import { useUniqueId } from '../../utils/useUniqueId'

const contentId = useUniqueId('ai-reasoning-content')

const props = withDefaults(defineProps<{
  content?: string
  collapsed?: boolean
  streaming?: boolean
}>(), {
  collapsed: true,
  streaming: false,
})

const isCollapsed = ref(props.collapsed)

watch(() => props.collapsed, (val) => {
  isCollapsed.value = val
})

watch(() => props.streaming, (val) => {
  if (val) isCollapsed.value = false
})

function toggle() {
  isCollapsed.value = !isCollapsed.value
}
</script>

<template>
  <div
    data-ai-reasoning
    :data-collapsed="isCollapsed || undefined"
    :data-streaming="streaming || undefined"
  >
    <slot
      name="trigger"
      :collapsed="isCollapsed"
      :toggle="toggle"
      :streaming="streaming"
    >
      <button
        type="button"
        @click="toggle"
        :aria-expanded="!isCollapsed"
        :aria-controls="contentId"
      >
        <slot name="trigger-label" :collapsed="isCollapsed" :streaming="streaming">
          {{ streaming ? 'Thinking...' : 'Show reasoning' }}
        </slot>
      </button>
    </slot>

    <div
      v-show="!isCollapsed"
      :id="contentId"
      role="region"
      aria-label="Model reasoning"
    >
      <slot :content="content" :streaming="streaming">
        <div v-if="content">{{ content }}</div>
      </slot>
    </div>
  </div>
</template>
