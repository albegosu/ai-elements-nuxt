<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{
  voices: { id: string; name: string; language?: string; gender?: string; preview?: string }[]
  modelValue?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', voiceId: string): void
  (e: 'preview', voiceId: string): void
}>()

const selectedVoice = computed(() =>
  props.voices.find(v => v.id === props.modelValue),
)

function select(voiceId: string) {
  emit('update:modelValue', voiceId)
}

function onKeydown(event: KeyboardEvent, voiceId: string) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    select(voiceId)
  }
}
</script>

<template>
  <div data-ai-voice-selector role="listbox" aria-label="Select voice">
    <slot :voices="voices" :selected="selectedVoice" :select="select">
      <button
        v-for="voice in voices"
        :key="voice.id"
        type="button"
        data-ai-voice-option
        :data-selected="voice.id === modelValue || undefined"
        role="option"
        :aria-selected="voice.id === modelValue"
        :tabindex="voice.id === modelValue ? 0 : -1"
        @click="select(voice.id)"
        @keydown="onKeydown($event, voice.id)"
      >
        <slot name="voice" :voice="voice" :selected="voice.id === modelValue" :select="() => select(voice.id)">
          <slot name="voice-name" :voice="voice">
            <span data-ai-voice-name>{{ voice.name }}</span>
          </slot>
          <slot name="voice-meta" :voice="voice">
            <span v-if="voice.language" data-ai-voice-lang>{{ voice.language }}</span>
            <span v-if="voice.gender" data-ai-voice-gender>{{ voice.gender }}</span>
          </slot>
          <slot name="voice-preview" :voice="voice" v-if="voice.preview">
            <button type="button" @click.stop="emit('preview', voice.id)" aria-label="Preview voice">
              ▶
            </button>
          </slot>
        </slot>
      </button>
    </slot>
  </div>
</template>
