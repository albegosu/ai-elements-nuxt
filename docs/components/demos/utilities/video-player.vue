<script setup lang="ts">
import type { AiVideoData } from '../../../../src/runtime/types/realtime'

const video: AiVideoData = {
  url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm',
  mimeType: 'video/webm',
  width: 640,
  height: 360,
  duration: 6,
}
</script>

<template>
  <AiVideoPlayer :video="video" :controls="true" :muted="true" />
</template>
