#!/usr/bin/env node
/**
 * Generates docs component pages and demo SFCs from navigation data.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const docsRoot = path.join(root, 'docs')

const categories = [
  {
    id: 'chatbot',
    components: [
      'attachments', 'chain-of-thought', 'checkpoint', 'confirmation', 'context',
      'conversation', 'error-boundary', 'inline-citation', 'message', 'model-selector',
      'plan', 'prompt-input', 'queue', 'reasoning', 'shimmer', 'sources',
      'streaming-cursor', 'suggestion', 'task', 'tool', 'tool-approval',
    ],
  },
  {
    id: 'code',
    components: [
      'agent', 'artifact', 'code-block', 'commit', 'env-vars', 'file-tree',
      'package-info', 'sandbox', 'schema-display', 'snippet', 'stack-trace',
      'terminal', 'test-results', 'vue-preview', 'web-preview',
    ],
  },
  {
    id: 'voice',
    components: ['audio-player', 'mic-selector', 'persona', 'speech-input', 'transcription', 'voice-selector'],
  },
  {
    id: 'workflow',
    components: ['canvas', 'connection', 'controls', 'edge', 'node', 'panel', 'toolbar'],
  },
  {
    id: 'utilities',
    components: ['image', 'markdown', 'open-in-chat'],
  },
]

const pageTemplate = (category, slug) => `<script setup lang="ts">
definePageMeta({ layout: 'default' })
</script>

<template>
  <ComponentDocPage category="${category}" slug="${slug}" />
</template>
`

for (const { id, components } of categories) {
  const dir = path.join(docsRoot, 'pages', 'components', id)
  fs.mkdirSync(dir, { recursive: true })
  for (const slug of components) {
    const file = path.join(dir, `${slug}.vue`)
    fs.writeFileSync(file, pageTemplate(id, slug))
  }
}

console.log('Generated component doc pages.')
