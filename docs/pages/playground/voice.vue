<script setup lang="ts">
definePageMeta({ layout: 'default' })

const segments = [
  { id: '1', text: 'Hello, welcome to the demo.', startTime: 0, endTime: 2.5, speaker: 'Host' },
  { id: '2', text: 'How does retrieval augmented generation work?', startTime: 3, endTime: 6, speaker: 'Guest' },
]

const voices = [
  { id: 'v1', name: 'Aria', language: 'en-US', gender: 'Female' },
  { id: 'v2', name: 'Marcus', language: 'en-US', gender: 'Male' },
]

const selectedVoice = ref('v1')
const playbackTime = ref(1.5)

const nodes = [
  { id: 'n1', label: 'Query', x: 40, y: 60, status: 'completed' as const },
  { id: 'n2', label: 'Retrieve', x: 200, y: 60, status: 'running' as const },
  { id: 'n3', label: 'Generate', x: 360, y: 60, status: 'idle' as const },
]
</script>

<template>
  <div>
    <DocsHeader
      title="Voice & Workflow"
      description="Audio, transcription, voice selection, and workflow canvas components."
    />

    <div class="space-y-10">
      <section>
        <h2 class="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50">Voice</h2>
        <div class="grid gap-6 sm:grid-cols-2">
          <div class="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
            <AiAudioPlayer src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" title="Sample">
              <template #default="{ toggle, isPlaying, progress, formatTime, currentTime, duration }">
                <div class="flex items-center gap-3">
                  <button
                    type="button"
                    class="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700"
                    @click="toggle"
                  >
                    {{ isPlaying ? '⏸' : '▶' }}
                  </button>
                  <div class="flex-1">
                    <div class="h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                      <div class="h-full bg-blue-600 transition-all" :style="{ width: `${progress}%` }" />
                    </div>
                    <p class="mt-1 text-xs text-zinc-400">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</p>
                  </div>
                </div>
              </template>
            </AiAudioPlayer>
          </div>

          <div class="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
            <AiTranscription :segments="segments" :current-time="playbackTime" highlight-active>
              <template #segment="{ segment, active, formatTime }">
                <div
                  class="rounded-md px-2 py-1.5 text-sm"
                  :class="active ? 'border-l-2 border-blue-500 bg-blue-50/50 pl-3 dark:bg-blue-950/20' : ''"
                >
                  <span class="mr-2 font-mono text-xs text-zinc-400">{{ formatTime(segment.startTime) }}</span>
                  {{ segment.text }}
                </div>
              </template>
            </AiTranscription>
          </div>

          <div class="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800 sm:col-span-2">
            <AiVoiceSelector v-model="selectedVoice" :voices="voices">
              <template #voice="{ voice, selected, select }">
                <button
                  type="button"
                  class="mb-2 flex w-full items-center justify-between rounded-lg border px-3 py-2 text-sm"
                  :class="selected ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20' : 'border-zinc-200 dark:border-zinc-700'"
                  @click="select"
                >
                  {{ voice.name }}
                  <span class="text-xs text-zinc-400">{{ voice.language }}</span>
                </button>
              </template>
            </AiVoiceSelector>
          </div>
        </div>
      </section>

      <section>
        <h2 class="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50">Workflow</h2>
        <AiCanvas height="220px" class="relative overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <AiNode
            v-for="node in nodes"
            :key="node.id"
            v-bind="node"
          />
        </AiCanvas>
      </section>
    </div>
  </div>
</template>
