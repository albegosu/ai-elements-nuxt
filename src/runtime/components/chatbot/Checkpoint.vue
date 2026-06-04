<script setup lang="ts">
import type { AiCheckpointData } from '../../types'

const props = defineProps<{
  checkpoint: AiCheckpointData
}>()

const isPending = computed(() => props.checkpoint.status === 'pending')
const isReached = computed(() => props.checkpoint.status === 'reached')
const isPassed = computed(() => props.checkpoint.status === 'passed')
const isFailed = computed(() => props.checkpoint.status === 'failed')
</script>

<template>
  <div
    data-ai-checkpoint
    :data-status="checkpoint.status"
    role="status"
    :aria-label="`Checkpoint: ${checkpoint.title}`"
  >
    <slot
      :checkpoint="checkpoint"
      :is-pending="isPending"
      :is-reached="isReached"
      :is-passed="isPassed"
      :is-failed="isFailed"
    >
      <slot name="indicator" :status="checkpoint.status">
        <span data-ai-checkpoint-indicator :data-status="checkpoint.status" />
      </slot>

      <div data-ai-checkpoint-content>
        <slot name="title" :checkpoint="checkpoint">
          <span data-ai-checkpoint-title>{{ checkpoint.title }}</span>
        </slot>
        <slot name="description" :checkpoint="checkpoint">
          <span v-if="checkpoint.description" data-ai-checkpoint-desc>
            {{ checkpoint.description }}
          </span>
        </slot>
        <slot name="timestamp" :checkpoint="checkpoint">
          <time v-if="checkpoint.timestamp" data-ai-checkpoint-time>
            {{ checkpoint.timestamp }}
          </time>
        </slot>
      </div>
    </slot>
  </div>
</template>
