<script setup lang="ts">
import type { AiSuggestion } from '../../types'

defineProps<{
  suggestions: AiSuggestion[]
}>()

const emit = defineEmits<{
  (e: 'select', suggestion: AiSuggestion): void
}>()
</script>

<template>
  <div
    data-ai-suggestions
    role="group"
    aria-label="Suggestions"
  >
    <slot :suggestions="suggestions" :select="(s: AiSuggestion) => emit('select', s)">
      <button
        v-for="suggestion in suggestions"
        :key="suggestion.id"
        type="button"
        data-ai-suggestion
        @click="emit('select', suggestion)"
      >
        <slot name="suggestion" :suggestion="suggestion">
          {{ suggestion.label }}
        </slot>
      </button>
    </slot>
  </div>
</template>
