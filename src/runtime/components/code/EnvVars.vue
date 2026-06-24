<script setup lang="ts">
import { ref } from 'vue'
import type { AiEnvVar } from '../../types'

defineProps<{
  variables: AiEnvVar[]
}>()

const revealedKeys = ref<Record<string, boolean>>({})

function toggleReveal(key: string) {
  revealedKeys.value = {
    ...revealedKeys.value,
    [key]: !revealedKeys.value[key],
  }
}

function isRevealed(key: string): boolean {
  return !!revealedKeys.value[key]
}

function maskValue(variable: AiEnvVar): string {
  if (variable.type === 'secret' && !isRevealed(variable.key)) {
    return '••••••••'
  }
  return variable.value
}
</script>

<template>
  <div data-ai-env-vars role="table" aria-label="Environment variables">
    <slot :variables="variables" :mask-value="maskValue" :toggle-reveal="toggleReveal">
      <div
        v-for="variable in variables"
        :key="variable.key"
        data-ai-env-var
        :data-type="variable.type"
        :data-required="variable.required || undefined"
        role="row"
      >
        <slot name="variable" :variable="variable" :masked-value="maskValue(variable)" :toggle-reveal="() => toggleReveal(variable.key)" :revealed="isRevealed(variable.key)">
          <slot name="key" :variable="variable">
            <span data-ai-env-key role="rowheader">{{ variable.key }}</span>
          </slot>
          <slot name="value" :variable="variable" :masked-value="maskValue(variable)" :revealed="isRevealed(variable.key)">
            <span data-ai-env-value role="cell">{{ maskValue(variable) }}</span>
          </slot>
          <slot name="actions" :variable="variable" :toggle-reveal="() => toggleReveal(variable.key)">
            <button
              v-if="variable.type === 'secret'"
              type="button"
              data-ai-env-reveal
              @click="toggleReveal(variable.key)"
              :aria-label="isRevealed(variable.key) ? 'Hide value' : 'Reveal value'"
            >
              {{ isRevealed(variable.key) ? 'Hide' : 'Reveal' }}
            </button>
          </slot>
        </slot>
      </div>
    </slot>
  </div>
</template>
