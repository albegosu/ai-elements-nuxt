<script setup lang="ts" generic="T = unknown">
import { computed, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  /** Alternative versions of a message (regenerations / branches). */
  branches: T[]
  /** Active branch index (v-model:index). */
  index?: number
}>(), {
  index: 0,
})

const emit = defineEmits<{
  (e: 'update:index', value: number): void
  (e: 'change', value: number, branch: T): void
}>()

const internal = ref(props.index)

watch(() => props.index, (val) => {
  if (val !== internal.value) internal.value = clamp(val)
})

const count = computed(() => props.branches?.length ?? 0)

function clamp(i: number): number {
  if (count.value === 0) return 0
  return Math.min(Math.max(i, 0), count.value - 1)
}

const active = computed(() => clamp(internal.value))
const current = computed<T | undefined>(() => props.branches?.[active.value])
const canPrev = computed(() => active.value > 0)
const canNext = computed(() => active.value < count.value - 1)

function go(i: number) {
  const next = clamp(i)
  if (next === internal.value) return
  internal.value = next
  emit('update:index', next)
  const branch = props.branches[next]
  emit('change', next, branch)
}

function next() {
  if (canNext.value) go(active.value + 1)
}

function previous() {
  if (canPrev.value) go(active.value - 1)
}
</script>

<template>
  <div
    data-ai-branch
    :data-index="active"
    :data-count="count"
  >
    <slot
      :current="current"
      :index="active"
      :count="count"
      :next="next"
      :previous="previous"
      :can-prev="canPrev"
      :can-next="canNext"
      :go="go"
    >
      <div v-if="count > 1" data-ai-branch-controls>
        <button
          type="button"
          :disabled="!canPrev"
          aria-label="Previous response"
          @click="previous"
        >‹</button>
        <span data-ai-branch-indicator>{{ active + 1 }} / {{ count }}</span>
        <button
          type="button"
          :disabled="!canNext"
          aria-label="Next response"
          @click="next"
        >›</button>
      </div>
    </slot>
  </div>
</template>
