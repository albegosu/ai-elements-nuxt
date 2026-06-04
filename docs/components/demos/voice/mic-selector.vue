<script setup lang="ts">
const device = ref('')
</script>

<template>
  <AiMicSelector v-model="device">
    <template #default="{ devices, selected, select }">
      <div class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <div class="mb-3 flex items-center gap-2">
          <svg class="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
          </svg>
          <span class="text-xs font-medium text-zinc-500">Microphone</span>
        </div>

        <select
          :value="selected"
          class="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
          @change="select(($event.target as HTMLSelectElement).value)"
        >
          <option v-if="!devices?.length" value="">
            No devices (grant permission in browser)
          </option>
          <option v-for="d in devices" :key="d.deviceId" :value="d.deviceId">
            {{ d.label }}
          </option>
        </select>
      </div>
    </template>
  </AiMicSelector>
</template>
