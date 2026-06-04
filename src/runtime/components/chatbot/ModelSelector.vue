<script setup lang="ts">
import type { AiModelOption } from '../../types'

const props = withDefaults(defineProps<{
  models: AiModelOption[]
  modelValue?: string
  groupByProvider?: boolean
}>(), {
  groupByProvider: true,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const isOpen = ref(false)
const search = ref('')

const selectedModel = computed(() =>
  props.models.find(m => m.id === props.modelValue)
)

const filteredModels = computed(() => {
  if (!search.value) return props.models
  const q = search.value.toLowerCase()
  return props.models.filter(m =>
    m.name.toLowerCase().includes(q) ||
    m.provider.toLowerCase().includes(q)
  )
})

const groupedModels = computed(() => {
  if (!props.groupByProvider) return { '': filteredModels.value }
  const groups: Record<string, AiModelOption[]> = {}
  for (const model of filteredModels.value) {
    if (!groups[model.provider]) groups[model.provider] = []
    groups[model.provider].push(model)
  }
  return groups
})

function select(model: AiModelOption) {
  emit('update:modelValue', model.id)
  isOpen.value = false
  search.value = ''
}

function toggle() {
  isOpen.value = !isOpen.value
  if (!isOpen.value) search.value = ''
}

const selectorRef = ref<HTMLElement | null>(null)

function handleClickOutside(event: MouseEvent) {
  if (!isOpen.value) return
  const el = selectorRef.value
  if (el && !el.contains(event.target as Node)) {
    isOpen.value = false
    search.value = ''
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<template>
  <div
    ref="selectorRef"
    data-ai-model-selector
    :data-open="isOpen || undefined"
  >
    <slot
      name="trigger"
      :selected="selectedModel"
      :toggle="toggle"
      :is-open="isOpen"
    >
      <button type="button" @click="toggle" aria-haspopup="listbox" :aria-expanded="isOpen">
        <slot name="selected" :model="selectedModel">
          {{ selectedModel?.name ?? 'Select model' }}
        </slot>
      </button>
    </slot>

    <div
      v-show="isOpen"
      data-ai-model-selector-dropdown
      role="listbox"
      aria-label="Select model"
    >
      <slot name="search" :search="search" :update-search="(v: string) => search = v">
        <input
          v-model="search"
          type="text"
          placeholder="Search models..."
          aria-label="Search models"
        />
      </slot>

      <slot
        :grouped-models="groupedModels"
        :filtered-models="filteredModels"
        :select="select"
        :selected-id="modelValue"
      >
        <template v-for="(models, provider) in groupedModels" :key="provider">
          <div v-if="provider" data-ai-model-group>
            <slot name="group-header" :provider="provider">
              <div data-ai-model-group-label>{{ provider }}</div>
            </slot>
          </div>
          <button
            v-for="model in models"
            :key="model.id"
            type="button"
            data-ai-model-option
            :data-selected="model.id === modelValue || undefined"
            role="option"
            :aria-selected="model.id === modelValue"
            @click="select(model)"
          >
            <slot
              name="option"
              :model="model"
              :selected="model.id === modelValue"
              :select="() => select(model)"
            >
              <span>{{ model.name }}</span>
              <span v-if="model.description" data-ai-model-description>{{ model.description }}</span>
            </slot>
          </button>
        </template>
      </slot>

      <slot name="empty" v-if="!filteredModels.length">
        <div data-ai-model-empty>No models found</div>
      </slot>
    </div>
  </div>
</template>
