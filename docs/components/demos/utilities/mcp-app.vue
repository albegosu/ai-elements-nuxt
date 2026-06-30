<script setup lang="ts">
import type { AiMcpAppData } from '../../../../src/runtime/types/realtime'

const app: AiMcpAppData = {
  id: 'weather-1',
  name: 'Weather Widget',
  status: 'ready',
  contentType: 'html',
  content: `<div style="font-family: system-ui; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px;">
  <h3 style="margin: 0 0 8px">San Francisco</h3>
  <p style="font-size: 2em; margin: 0">22&deg;C</p>
  <p style="margin: 8px 0 0; opacity: 0.8">Partly cloudy</p>
</div>`,
}
</script>

<template>
  <AiMcpApp :app="app" height="200px" />
</template>
