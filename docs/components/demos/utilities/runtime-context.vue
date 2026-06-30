<script setup lang="ts">
import type { AiRuntimeContextEntry } from '../../../../src/runtime/types/realtime'

const entries: AiRuntimeContextEntry[] = [
  { key: 'model', value: 'gpt-4o', type: 'runtime' },
  { key: 'temperature', value: 0.7, type: 'runtime' },
  { key: 'search', value: { enabled: true, maxResults: 5 }, type: 'tool', scope: 'agent' },
  { key: 'calculator', value: { enabled: true }, type: 'tool', scope: 'global' },
  { key: 'deleteFile', value: 'user-approval', type: 'approval' },
  { key: 'runCode', value: 'auto-approve', type: 'approval' },
]
</script>

<template>
  <AiRuntimeContext :entries="entries" title="Debug Context" />
</template>
