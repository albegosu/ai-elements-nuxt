<script setup lang="ts">
import { computed } from 'vue'
import type { AiConfirmationData } from '../../types'
import { useUniqueId } from '../../utils/useUniqueId'

const descriptionId = useUniqueId('ai-confirmation-desc')

const props = withDefaults(defineProps<{
  confirmation: AiConfirmationData
}>(), {})

const emit = defineEmits<{
  (e: 'confirm', id: string): void
  (e: 'deny', id: string): void
}>()

const confirmLabel = computed(() => props.confirmation.confirmLabel ?? 'Confirm')
const denyLabel = computed(() => props.confirmation.denyLabel ?? 'Cancel')
</script>

<template>
  <div
    data-ai-confirmation
    :data-destructive="confirmation.destructive || undefined"
    role="alertdialog"
    :aria-label="confirmation.title"
    :aria-describedby="confirmation.description ? descriptionId : undefined"
  >
    <slot
      :confirmation="confirmation"
      :confirm="() => emit('confirm', confirmation.id)"
      :deny="() => emit('deny', confirmation.id)"
    >
      <slot name="title" :confirmation="confirmation">
        <div data-ai-confirmation-title>{{ confirmation.title }}</div>
      </slot>

      <slot name="description" :confirmation="confirmation">
        <div v-if="confirmation.description" :id="descriptionId" data-ai-confirmation-desc>
          {{ confirmation.description }}
        </div>
      </slot>

      <slot
        name="actions"
        :confirm="() => emit('confirm', confirmation.id)"
        :deny="() => emit('deny', confirmation.id)"
        :confirm-label="confirmLabel"
        :deny-label="denyLabel"
        :destructive="confirmation.destructive"
      >
        <div data-ai-confirmation-actions>
          <button
            type="button"
            data-ai-confirmation-deny
            @click="emit('deny', confirmation.id)"
          >
            {{ denyLabel }}
          </button>
          <button
            type="button"
            data-ai-confirmation-confirm
            :data-destructive="confirmation.destructive || undefined"
            @click="emit('confirm', confirmation.id)"
          >
            {{ confirmLabel }}
          </button>
        </div>
      </slot>
    </slot>
  </div>
</template>
