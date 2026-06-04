<script setup lang="ts">
import type { AiAttachment } from '../../types'
import { formatFileSize } from '../../utils'

withDefaults(defineProps<{
  attachments: AiAttachment[]
  layout?: 'grid' | 'inline' | 'list'
  removable?: boolean
}>(), {
  layout: 'grid',
  removable: false,
})

const emit = defineEmits<{
  (e: 'remove', attachment: AiAttachment): void
}>()
</script>

<template>
  <div
    data-ai-attachments
    :data-layout="layout"
    role="list"
    aria-label="Attachments"
  >
    <slot :attachments="attachments" :layout="layout">
      <div
        v-for="attachment in attachments"
        :key="attachment.id"
        data-ai-attachment
        :data-type="attachment.type"
        role="listitem"
      >
        <slot name="attachment" :attachment="attachment" :format-file-size="formatFileSize">
          <slot name="preview" :attachment="attachment">
            <img
              v-if="attachment.type === 'image' && attachment.previewUrl"
              :src="attachment.previewUrl"
              :alt="attachment.name"
            />
          </slot>

          <slot name="info" :attachment="attachment">
            <span data-ai-attachment-name>{{ attachment.name }}</span>
            <span v-if="attachment.size" data-ai-attachment-size>
              {{ formatFileSize(attachment.size) }}
            </span>
          </slot>

          <slot name="remove" :attachment="attachment" v-if="removable">
            <button
              type="button"
              @click="emit('remove', attachment)"
              :aria-label="`Remove ${attachment.name}`"
            >
              &times;
            </button>
          </slot>
        </slot>
      </div>
    </slot>
  </div>
</template>
