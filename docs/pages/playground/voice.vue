<script setup lang="ts">
definePageMeta({ layout: 'default' })

const segments = [
  { id: '1', text: 'Hello, welcome to the demo.', startTime: 0, endTime: 2.5, speaker: 'Host' },
  { id: '2', text: 'How does retrieval augmented generation work?', startTime: 3, endTime: 6, speaker: 'Guest' },
  { id: '3', text: 'It combines a retrieval system with a language model.', startTime: 6.5, endTime: 10, speaker: 'Host' },
]

const voices = [
  { id: 'v1', name: 'Aria', language: 'en-US', gender: 'Female' },
  { id: 'v2', name: 'Marcus', language: 'en-US', gender: 'Male' },
  { id: 'v3', name: 'Sofia', language: 'es-ES', gender: 'Female' },
]

const selectedVoice = ref('v1')
const playbackTime = ref(1.5)

const nodes = [
  { id: 'n1', label: 'Query', x: 40, y: 80, status: 'completed' as const },
  { id: 'n2', label: 'Embed', x: 180, y: 80, status: 'completed' as const },
  { id: 'n3', label: 'Retrieve', x: 320, y: 80, status: 'running' as const },
  { id: 'n4', label: 'Generate', x: 460, y: 80, status: 'idle' as const },
]
</script>

<template>
  <div>
    <DocsHeader
      title="Voice & Workflow"
      description="Audio, transcription, voice selection, and workflow canvas components."
    />

    <div class="space-y-10">
      <!-- Voice section -->
      <section>
        <h2 class="mb-4 scroll-mt-24 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Voice</h2>

        <div class="grid gap-4 sm:grid-cols-2">
          <!-- Audio Player -->
          <div class="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
            <p class="mb-3 text-xs font-medium text-zinc-500 dark:text-zinc-400">Audio Player</p>
            <AiAudioPlayer src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" title="SoundHelix Sample">
              <template #default="{ toggle, isPlaying, progress, formatTime, currentTime, duration }">
                <div class="flex items-center gap-3">
                  <button
                    type="button"
                    class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
                    @click="toggle"
                  >
                    <svg v-if="!isPlaying" class="ml-0.5 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                    <svg v-else class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75A.75.75 0 007.25 3h-1.5zm7 0a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z" />
                    </svg>
                  </button>
                  <div class="flex-1">
                    <div
                      class="relative h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700"
                    >
                      <div
                        class="h-full rounded-full bg-zinc-900 transition-all dark:bg-zinc-100"
                        :style="{ width: `${progress}%` }"
                      />
                    </div>
                    <div class="mt-1.5 flex justify-between text-xs text-zinc-400">
                      <span>{{ formatTime(currentTime) }}</span>
                      <span>{{ formatTime(duration) }}</span>
                    </div>
                  </div>
                </div>
              </template>
            </AiAudioPlayer>
          </div>

          <!-- Transcription -->
          <div class="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
            <p class="mb-3 text-xs font-medium text-zinc-500 dark:text-zinc-400">Transcription</p>
            <AiTranscription :segments="segments" :current-time="playbackTime" highlight-active>
              <template #segment="{ segment, active, formatTime }">
                <div
                  class="rounded-md px-2 py-1.5 text-sm transition-colors"
                  :class="active
                    ? 'border-l-2 border-zinc-900 bg-zinc-100 pl-3 dark:border-zinc-100 dark:bg-zinc-800'
                    : 'text-zinc-500 dark:text-zinc-400'"
                >
                  <span class="mr-2 font-mono text-xs text-zinc-400">{{ formatTime(segment.startTime) }}</span>
                  <span :class="active ? 'font-medium text-zinc-900 dark:text-zinc-50' : ''">{{ segment.text }}</span>
                </div>
              </template>
            </AiTranscription>
          </div>

          <!-- Voice Selector -->
          <div class="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800 sm:col-span-2">
            <p class="mb-3 text-xs font-medium text-zinc-500 dark:text-zinc-400">Voice Selector</p>
            <AiVoiceSelector v-model="selectedVoice" :voices="voices">
              <template #default="{ voices: vs, selected, select }">
                <div class="grid gap-2 sm:grid-cols-3">
                  <button
                    v-for="v in vs"
                    :key="v.id"
                    type="button"
                    class="flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm transition"
                    :class="v.id === selected?.id
                      ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                      : 'border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800'"
                    @click="select(v.id)"
                  >
                    <div class="flex items-center gap-2">
                      <div
                        class="flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium"
                        :class="v.id === selected?.id ? 'bg-white/20 dark:bg-black/20' : 'bg-zinc-100 dark:bg-zinc-800'"
                      >
                        {{ v.name[0] }}
                      </div>
                      <span class="font-medium">{{ v.name }}</span>
                    </div>
                    <span class="text-xs opacity-60">{{ v.language }}</span>
                  </button>
                </div>
              </template>
            </AiVoiceSelector>
          </div>
        </div>
      </section>

      <!-- Workflow section -->
      <section>
        <h2 class="mb-4 scroll-mt-24 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Workflow</h2>
        <div class="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div class="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <span class="text-xs font-medium text-zinc-600 dark:text-zinc-400">RAG Pipeline</span>
            <span class="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Running</span>
          </div>
          <div class="flex items-center justify-center gap-0 p-8">
            <template v-for="(node, i) in nodes" :key="node.id">
              <!-- Node card -->
              <div class="flex flex-col items-center gap-2">
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors"
                  :class="{
                    'border-green-500 bg-green-500/10 text-green-500': node.status === 'completed',
                    'border-blue-500 bg-blue-500/10 text-blue-500': node.status === 'running',
                    'border-zinc-300 bg-zinc-100 text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-600': node.status === 'idle',
                  }"
                >
                  <!-- Completed checkmark -->
                  <svg v-if="node.status === 'completed'" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <!-- Running spinner -->
                  <svg v-else-if="node.status === 'running'" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <!-- Idle dot -->
                  <div v-else class="h-2 w-2 rounded-full bg-current" />
                </div>
                <span
                  class="text-xs font-medium"
                  :class="{
                    'text-green-600 dark:text-green-400': node.status === 'completed',
                    'text-blue-600 dark:text-blue-400': node.status === 'running',
                    'text-zinc-400 dark:text-zinc-600': node.status === 'idle',
                  }"
                >{{ node.label }}</span>
              </div>

              <!-- Connector line between nodes -->
              <div
                v-if="i < nodes.length - 1"
                class="mx-3 h-px w-12 shrink-0"
                :class="nodes[i + 1]!.status !== 'idle' ? 'bg-zinc-400 dark:bg-zinc-600' : 'bg-zinc-200 dark:bg-zinc-800'"
              />
            </template>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
