<script setup lang="ts">
import type { AiTimelineEntry } from '../../../../src/runtime/types/realtime'

const entries: AiTimelineEntry[] = [
  {
    id: '1',
    type: 'thought',
    content: 'Analyzing the user request and planning a retrieval strategy.',
    status: 'completed',
    duration: 120,
  },
  {
    id: '2',
    type: 'action',
    content: 'Searching knowledge base for relevant documents.',
    tool: 'search',
    status: 'completed',
    duration: 850,
    children: [
      { id: '2a', type: 'observation', content: 'Query: "edge computing 2025"', status: 'completed' },
      { id: '2b', type: 'observation', content: 'Retrieved 12 chunks · top score 0.91', status: 'completed' },
    ],
  },
  {
    id: '3',
    type: 'observation',
    content: 'Found 3 relevant documents above the relevance threshold.',
    status: 'completed',
    duration: 50,
  },
  {
    id: '4',
    type: 'action',
    content: 'Generating response from retrieved context.',
    tool: 'generate',
    status: 'running',
    startTime: Date.now() - 400,
  },
]
</script>

<template>
  <div class="w-full max-w-lg">
    <AiAgentTimeline :entries="entries" title="Agent Run" :show-duration="true" />
  </div>
</template>
