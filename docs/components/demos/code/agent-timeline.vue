<script setup lang="ts">
import type { AiTimelineEntry } from '../../../../src/runtime/types/realtime'

const entries: AiTimelineEntry[] = [
  { id: '1', type: 'thought', content: 'Analyzing the user request...', status: 'completed', duration: 120 },
  { id: '2', type: 'action', content: 'Searching knowledge base', tool: 'search', status: 'completed', duration: 850 },
  { id: '3', type: 'observation', content: 'Found 3 relevant documents', status: 'completed', duration: 50 },
  { id: '4', type: 'action', content: 'Generating response', tool: 'generate', status: 'running', startTime: Date.now() - 400 },
]
</script>

<template>
  <AiAgentTimeline :entries="entries" title="Agent Run" :show-duration="true" />
</template>
