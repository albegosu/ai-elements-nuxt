<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  loading?: boolean
  maxLength?: number
  rows?: number
  autoResize?: boolean
}>(), {
  modelValue: '',
  placeholder: 'Type a message...',
  disabled: false,
  loading: false,
  rows: 1,
  autoResize: true,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'submit', value: string): void
  (e: 'stop'): void
}>()

const textareaRef = ref<HTMLTextAreaElement | null>(null)

const canSubmit = computed(() => {
  return props.modelValue.trim().length > 0 && !props.disabled
})

function handleInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
  if (props.autoResize) resize()
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    if (canSubmit.value && !props.loading) {
      emit('submit', props.modelValue)
    }
  }
}

function handleSubmit() {
  if (canSubmit.value && !props.loading) {
    emit('submit', props.modelValue)
  }
}

function handleStop() {
  emit('stop')
}

function resize() {
  const el = textareaRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${el.scrollHeight}px`
}

function focus() {
  textareaRef.value?.focus()
}

defineExpose({ focus, textareaRef })
</script>

<template>
  <div
    data-ai-prompt-input
    :data-loading="loading || undefined"
    :data-disabled="disabled || undefined"
    role="form"
    aria-label="Message input"
  >
    <slot name="prefix" />

    <slot name="attachments-area" />

    <slot
      name="input"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :loading="loading"
      :handle-input="handleInput"
      :handle-keydown="handleKeydown"
      :textarea-ref="textareaRef"
      :can-submit="canSubmit"
    >
      <textarea
        ref="textareaRef"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled || loading"
        :rows="rows"
        :maxlength="maxLength"
        @input="handleInput"
        @keydown="handleKeydown"
        aria-label="Message"
      />
    </slot>

    <slot
      name="actions"
      :can-submit="canSubmit"
      :loading="loading"
      :disabled="disabled"
      :submit="handleSubmit"
      :stop="handleStop"
    >
      <button
        v-if="loading"
        type="button"
        @click="handleStop"
        aria-label="Stop generating"
      >
        <slot name="stop-icon">Stop</slot>
      </button>
      <button
        v-else
        type="button"
        :disabled="!canSubmit"
        @click="handleSubmit"
        aria-label="Send message"
      >
        <slot name="send-icon">Send</slot>
      </button>
    </slot>

    <slot name="suffix" />
  </div>
</template>
