<script setup lang="ts">
import { onMounted, ref } from 'vue'
const props = defineProps<{
  modelValue?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', deviceId: string): void
}>()

const devices = ref<{ deviceId: string; label: string }[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

async function loadDevices() {
  isLoading.value = true
  error.value = null
  let stream: MediaStream | null = null
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const allDevices = await navigator.mediaDevices.enumerateDevices()
    devices.value = allDevices
      .filter(d => d.kind === 'audioinput')
      .map(d => ({ deviceId: d.deviceId, label: d.label || `Microphone ${d.deviceId.slice(0, 5)}` }))
    if (!props.modelValue && devices.value[0]) {
      emit('update:modelValue', devices.value[0].deviceId)
    }
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Failed to access microphone'
  } finally {
    stream?.getTracks().forEach(track => track.stop())
    isLoading.value = false
  }
}

onMounted(loadDevices)

function select(deviceId: string) {
  emit('update:modelValue', deviceId)
}
</script>

<template>
  <div data-ai-mic-selector role="region" aria-label="Microphone selector">
    <slot
      :devices="devices"
      :selected="modelValue"
      :select="select"
      :loading="isLoading"
      :error="error"
      :refresh="loadDevices"
    >
      <slot name="error" :error="error" v-if="error">
        <div data-ai-mic-error role="alert">{{ error }}</div>
      </slot>

      <slot name="loading" v-if="isLoading">
        <div data-ai-mic-loading>Loading devices...</div>
      </slot>

      <template v-if="!isLoading && !error">
        <select
          :value="modelValue"
          @change="select(($event.target as HTMLSelectElement).value)"
          aria-label="Select microphone"
        >
          <option v-for="device in devices" :key="device.deviceId" :value="device.deviceId">
            {{ device.label }}
          </option>
        </select>
      </template>
    </slot>
  </div>
</template>
