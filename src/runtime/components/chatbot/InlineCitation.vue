<script setup lang="ts">
import type { AiCitation } from '../../types'
import { useUniqueId } from '../../utils/useUniqueId'

const props = withDefaults(defineProps<{
  citation: AiCitation
  interactive?: boolean
}>(), {
  interactive: true,
})

const emit = defineEmits<{
  (e: 'click', citation: AiCitation): void
}>()

const tooltipId = useUniqueId('ai-citation-tooltip')
const isVisible = ref(false)

function show() {
  isVisible.value = true
}

function hide() {
  isVisible.value = false
}

function activate() {
  if (props.interactive) emit('click', props.citation)
}

function onKeydown(event: KeyboardEvent) {
  if (!props.interactive) return
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    activate()
  }
}
</script>

<template>
  <span
    data-ai-citation
    :data-index="citation.index"
    :data-interactive="interactive || undefined"
    @mouseenter="show"
    @mouseleave="hide"
    @focus="show"
    @blur="hide"
    @click="activate"
    @keydown="onKeydown"
    :role="interactive ? 'button' : undefined"
    :tabindex="interactive ? 0 : undefined"
    :aria-label="`Citation ${citation.index}: ${citation.sourceTitle}`"
    :aria-describedby="isVisible ? tooltipId : undefined"
  >
    <slot :citation="citation" :hovered="isVisible">
      <slot name="badge" :index="citation.index">
        <sup data-ai-citation-badge>[{{ citation.index }}]</sup>
      </slot>
    </slot>

    <slot name="tooltip" v-if="isVisible" :citation="citation">
      <div :id="tooltipId" data-ai-citation-tooltip role="tooltip">
        <slot name="tooltip-content" :citation="citation">
          <div data-ai-citation-source>{{ citation.sourceTitle }}</div>
          <div v-if="citation.text" data-ai-citation-text>{{ citation.text }}</div>
        </slot>
      </div>
    </slot>
  </span>
</template>
