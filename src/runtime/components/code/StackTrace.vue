<script setup lang="ts">
import { ref, watch } from 'vue'
import type { AiStackFrame } from '../../types'

const props = withDefaults(defineProps<{
  error: string
  errorType?: string
  frames: AiStackFrame[]
  collapsed?: boolean
}>(), {
  collapsed: false,
})

const isCollapsed = ref(props.collapsed)

watch(() => props.collapsed, (val) => { isCollapsed.value = val })

function toggle() { isCollapsed.value = !isCollapsed.value }
</script>

<template>
  <div
    data-ai-stack-trace
    role="alert"
    aria-label="Error stack trace"
  >
    <slot name="error" :error="error" :error-type="errorType" :toggle="toggle" :collapsed="isCollapsed">
      <button
        type="button"
        data-ai-stack-error
        :aria-expanded="!isCollapsed"
        @click="toggle"
      >
        <span v-if="errorType" data-ai-stack-error-type>{{ errorType }}: </span>
        <span data-ai-stack-error-message>{{ error }}</span>
      </button>
    </slot>

    <div v-show="!isCollapsed" data-ai-stack-frames role="list">
      <slot :frames="frames">
        <div
          v-for="(frame, i) in frames"
          :key="i"
          data-ai-stack-frame
          :data-app="frame.isApp || undefined"
          role="listitem"
        >
          <slot name="frame" :frame="frame" :index="i">
            <span v-if="frame.function" data-ai-stack-fn>{{ frame.function }}</span>
            <span data-ai-stack-location>
              {{ frame.file }}<template v-if="frame.line">:{{ frame.line }}</template><template v-if="frame.column">:{{ frame.column }}</template>
            </span>
          </slot>
        </div>
      </slot>
    </div>
  </div>
</template>
