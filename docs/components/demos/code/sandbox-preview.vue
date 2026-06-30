<script setup lang="ts">
import { ref } from 'vue'
import type { AiSandboxLine, AiSandboxState } from '../../../../src/runtime/types/realtime'

const state = ref<AiSandboxState>({
  status: 'completed',
  command: 'npm run build',
  lines: [
    { id: '1', stream: 'stdout', content: '> project@1.0.0 build' },
    { id: '2', stream: 'stdout', content: '> vite build' },
    { id: '3', stream: 'stdout', content: '' },
    { id: '4', stream: 'stdout', content: 'vite v6.0.0 building for production...' },
    { id: '5', stream: 'stdout', content: 'dist/index.js   12.4 kB | gzip: 4.2 kB' },
    { id: '6', stream: 'stderr', content: 'warn: sourcemap generation is disabled' },
    { id: '7', stream: 'stdout', content: 'Build completed in 1.2s' },
  ],
  exitCode: 0,
  artifacts: [
    { id: 'a1', name: 'dist.zip', path: '/out/dist.zip', size: 4200 },
  ],
})

function lineClass(line: AiSandboxLine) {
  if (line.stream === 'stderr') return 'text-yellow-400'
  if (!line.content) return 'text-zinc-500'
  if (line.content.includes('completed')) return 'text-green-400'
  return 'text-zinc-300'
}
</script>

<template>
  <div class="w-full max-w-lg overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
    <AiSandboxPreview :state="state" :show-command="false">
      <template #header="{ state: s }">
        <div class="flex items-center justify-between gap-3 border-b border-zinc-800 bg-zinc-900 px-4 py-2.5">
          <div class="flex min-w-0 items-center gap-2">
            <span class="flex shrink-0 gap-1.5">
              <span class="h-2.5 w-2.5 rounded-full bg-red-500/80" />
              <span class="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
              <span class="h-2.5 w-2.5 rounded-full bg-green-500/80" />
            </span>
            <code class="truncate font-mono text-xs text-zinc-400">{{ s.command }}</code>
          </div>
          <span
            class="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide"
            :class="s.status === 'completed'
              ? 'bg-green-500/15 text-green-400'
              : s.status === 'running'
                ? 'bg-blue-500/15 text-blue-400'
                : 'bg-zinc-500/15 text-zinc-400'"
          >
            {{ s.status }}
          </span>
        </div>
      </template>

      <template #output="{ lines }">
        <div v-if="lines.length" class="bg-zinc-950 py-2">
          <div
            v-for="line in lines"
            :key="line.id"
            class="px-4 py-0.5 font-mono text-[13px] leading-relaxed"
            :class="lineClass(line)"
          >
            {{ line.content || '\u00A0' }}
          </div>
        </div>
      </template>

      <template #status="{ state: s }">
        <div
          v-if="s.status === 'completed' && s.exitCode != null"
          class="border-t border-zinc-800 bg-zinc-950 px-4 py-2 font-mono text-xs"
          :class="s.exitCode === 0 ? 'text-green-400' : 'text-red-400'"
        >
          Exit code: {{ s.exitCode }}
        </div>
      </template>

      <template #artifacts="{ artifacts, formatSize }">
        <div class="space-y-2 border-t border-zinc-800 bg-zinc-950 px-4 py-3">
          <p class="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
            Artifacts
          </p>
          <div class="space-y-1.5">
            <button
              v-for="artifact in artifacts"
              :key="artifact.id"
              type="button"
              class="flex w-full items-center gap-2 rounded-md border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-left text-sm transition-colors hover:border-zinc-600 hover:bg-zinc-800"
            >
              <svg class="h-4 w-4 shrink-0 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span class="truncate font-medium text-zinc-200">{{ artifact.name }}</span>
              <span v-if="artifact.size" class="ml-auto shrink-0 font-mono text-xs text-zinc-500">
                {{ formatSize(artifact.size) }}
              </span>
            </button>
          </div>
        </div>
      </template>
    </AiSandboxPreview>
  </div>
</template>
