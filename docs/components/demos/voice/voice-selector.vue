<script setup lang="ts">
const voice = ref('v1')
const voices = [
  { id: 'v1', name: 'Aria', language: 'en-US' },
  { id: 'v2', name: 'Marcus', language: 'en-GB' },
  { id: 'v3', name: 'Lena', language: 'de-DE' },
]
</script>

<template>
  <AiVoiceSelector v-model="voice" :voices="voices">
    <template #default="{ voices: voiceList, selected, select }">
      <div class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <div class="mb-3 text-xs font-medium text-zinc-500">
          Voice
        </div>
        <div class="space-y-1">
          <button
            v-for="v in voiceList"
            :key="v.id"
            type="button"
            class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors"
            :class="selected?.id === v.id ? 'bg-zinc-100 dark:bg-zinc-800' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'"
            @click="select(v.id)"
          >
            <span class="text-sm font-medium text-zinc-700 dark:text-zinc-300">{{ v.name }}</span>
            <span class="ml-auto font-mono text-xs text-zinc-500">{{ v.language }}</span>
          </button>
        </div>
      </div>
    </template>
  </AiVoiceSelector>
</template>
