<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useUniqueId } from '../../utils/useUniqueId'

const contentId = useUniqueId('ai-reasoning-content')

const props = withDefaults(defineProps<{
  content?: string
  collapsed?: boolean
  streaming?: boolean
  /** Auto-collapse once streaming ends. */
  autoClose?: boolean
  /** Customize the trigger label. Receives `{ streaming, duration }` (seconds). */
  getThinkingMessage?: (opts: { streaming: boolean, duration: number }) => string
}>(), {
  collapsed: true,
  streaming: false,
  autoClose: true,
})

const isCollapsed = ref(props.collapsed)
/** Seconds spent thinking, measured once streaming ends. */
const duration = ref(0)
let startedAt: number | null = null

watch(() => props.collapsed, (val) => {
  isCollapsed.value = val
})

watch(() => props.streaming, (val, prev) => {
  if (val) {
    startedAt = Date.now()
    duration.value = 0
    isCollapsed.value = false
  }
  else if (prev) {
    if (startedAt !== null) {
      duration.value = Math.max(1, Math.round((Date.now() - startedAt) / 1000))
      startedAt = null
    }
    if (props.autoClose) isCollapsed.value = true
  }
})

const defaultMessage = computed(() => {
  if (props.streaming) return 'Thinking...'
  if (duration.value > 0) {
    return `Thought for ${duration.value} second${duration.value === 1 ? '' : 's'}`
  }
  return 'Show reasoning'
})

const thinkingMessage = computed(() =>
  props.getThinkingMessage
    ? props.getThinkingMessage({ streaming: props.streaming, duration: duration.value })
    : defaultMessage.value,
)

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
      :duration="duration"
      :message="thinkingMessage"
    >
      <button
        type="button"
        :aria-expanded="!isCollapsed"
        :aria-controls="contentId"
        @click="toggle"
      >
        <slot name="trigger-label" :collapsed="isCollapsed" :streaming="streaming" :duration="duration" :message="thinkingMessage">
          {{ thinkingMessage }}
        </slot>
      </button>
    </slot>

    <div
      v-show="!isCollapsed"
      :id="contentId"
      role="region"
      aria-label="Model reasoning"
    >
      <slot :content="content" :streaming="streaming" :duration="duration">
        <div v-if="content">{{ content }}</div>
      </slot>
    </div>
  </div>
</template>
