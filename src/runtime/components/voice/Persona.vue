<script setup lang="ts">
defineProps<{
  name: string
  avatar?: string
  description?: string
  voice?: string
  active?: boolean
}>()

const emit = defineEmits<{
  (e: 'select'): void
}>()
</script>

<template>
  <div
    data-ai-persona
    :data-active="active || undefined"
    role="button"
    :aria-label="`Persona: ${name}`"
    :aria-pressed="active"
    tabindex="0"
    @click="emit('select')"
    @keydown.enter="emit('select')"
  >
    <slot :name-prop="name" :avatar="avatar" :description="description" :voice="voice" :active="active">
      <slot name="avatar" :avatar="avatar" :name-prop="name">
        <div v-if="avatar" data-ai-persona-avatar>
          <img :src="avatar" :alt="name" />
        </div>
        <div v-else data-ai-persona-avatar-fallback>
          {{ name.charAt(0).toUpperCase() }}
        </div>
      </slot>

      <div data-ai-persona-info>
        <slot name="name" :name-prop="name">
          <span data-ai-persona-name>{{ name }}</span>
        </slot>
        <slot name="description" :description="description">
          <span v-if="description" data-ai-persona-desc>{{ description }}</span>
        </slot>
        <slot name="voice-label" :voice="voice">
          <span v-if="voice" data-ai-persona-voice>🔊 {{ voice }}</span>
        </slot>
      </div>
    </slot>
  </div>
</template>
