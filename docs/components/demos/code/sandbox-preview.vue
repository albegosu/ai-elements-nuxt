<script setup lang="ts">
import { ref } from 'vue'
import type { AiSandboxState } from '../../../../src/runtime/types/realtime'

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
</script>

<template>
  <AiSandboxPreview :state="state" />
</template>
