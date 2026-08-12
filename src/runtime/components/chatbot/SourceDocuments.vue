<script setup lang="ts">
import { computed } from 'vue'
import type { AiSourceDocument } from '../../types'

const props = withDefaults(defineProps<{
  documents: AiSourceDocument[]
  removable?: boolean
}>(), {
  removable: true,
})

const emit = defineEmits<{
  (e: 'remove', document: AiSourceDocument): void
}>()

const items = computed(() => props.documents ?? [])
</script>

<template>
  <div
    v-if="items.length"
    data-ai-source-documents
    role="list"
    aria-label="Source documents"
  >
    <slot :documents="items">
      <div
        v-for="doc in items"
        :key="doc.id"
        data-ai-source-document
        :data-type="doc.type || undefined"
        role="listitem"
      >
        <slot name="document" :document="doc" :remove="() => emit('remove', doc)">
          <span data-ai-source-document-title>{{ doc.title }}</span>
          <button
            v-if="removable"
            type="button"
            :aria-label="`Remove ${doc.title}`"
            @click="emit('remove', doc)"
          >×</button>
        </slot>
      </div>
    </slot>
  </div>
</template>
