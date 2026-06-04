<script setup lang="ts">
import type { AiQueueItem } from '../../types'

defineProps<{
  items: AiQueueItem[]
}>()

const emit = defineEmits<{
  (e: 'cancel', item: AiQueueItem): void
  (e: 'retry', item: AiQueueItem): void
}>()
</script>

<template>
  <div
    data-ai-queue
    role="list"
    aria-label="Message queue"
  >
    <slot :items="items">
      <div
        v-for="item in items"
        :key="item.id"
        data-ai-queue-item
        :data-status="item.status"
        role="listitem"
      >
        <slot
          name="item"
          :item="item"
          :cancel="() => emit('cancel', item)"
          :retry="() => emit('retry', item)"
        >
          <slot name="position" :position="item.position">
            <span v-if="item.position != null" data-ai-queue-position>#{{ item.position }}</span>
          </slot>

          <slot name="content" :item="item">
            <span data-ai-queue-content>{{ item.content }}</span>
          </slot>

          <slot name="status" :status="item.status">
            <span data-ai-queue-status :data-status="item.status">{{ item.status }}</span>
          </slot>

          <slot
            name="actions"
            :item="item"
            :cancel="() => emit('cancel', item)"
            :retry="() => emit('retry', item)"
          >
            <button
              v-if="item.status === 'queued'"
              type="button"
              @click="emit('cancel', item)"
              aria-label="Cancel"
            >
              Cancel
            </button>
            <button
              v-if="item.status === 'failed'"
              type="button"
              @click="emit('retry', item)"
              aria-label="Retry"
            >
              Retry
            </button>
          </slot>
        </slot>
      </div>
    </slot>
  </div>
</template>
