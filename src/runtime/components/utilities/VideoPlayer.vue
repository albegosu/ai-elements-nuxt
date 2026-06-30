<script setup lang="ts">
import { ref, computed } from 'vue'
import type { AiVideoData } from '../../types/realtime'

const props = withDefaults(defineProps<{
  video?: AiVideoData
  loading?: boolean
  error?: string
  autoplay?: boolean
  controls?: boolean
  loop?: boolean
  muted?: boolean
}>(), {
  loading: false,
  autoplay: false,
  controls: true,
  loop: false,
  muted: false,
})

const emit = defineEmits<{
  (e: 'play'): void
  (e: 'pause'): void
  (e: 'ended'): void
  (e: 'error', err: Event): void
}>()

const videoRef = ref<HTMLVideoElement | null>(null)
const isPlaying = ref(false)
const currentTime = ref(0)

const hasVideo = computed(() => !!props.video?.url)
const status = computed(() => {
  if (props.error) return 'error'
  if (props.loading) return 'loading'
  if (hasVideo.value) return 'ready'
  return 'empty'
})

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function onPlay() {
  isPlaying.value = true
  emit('play')
}

function onPause() {
  isPlaying.value = false
  emit('pause')
}

function onTimeUpdate() {
  if (videoRef.value) currentTime.value = videoRef.value.currentTime
}

function onEnded() {
  isPlaying.value = false
  emit('ended')
}

function onError(event: Event) {
  emit('error', event)
}

function play() { videoRef.value?.play() }
function pause() { videoRef.value?.pause() }

defineExpose({ videoRef, play, pause, isPlaying, currentTime })
</script>

<template>
  <div
    data-ai-video-player
    :data-status="status"
    :data-playing="isPlaying || undefined"
  >
    <slot
      :video="video"
      :status="status"
      :is-playing="isPlaying"
      :current-time="currentTime"
      :format-time="formatTime"
      :play="play"
      :pause="pause"
    >
      <slot v-if="status === 'loading'" name="loading">
        <div data-ai-video-loading role="status" aria-label="Generating video">
          <span data-ai-video-loading-text>Generating video…</span>
        </div>
      </slot>

      <slot v-else-if="status === 'error'" name="error" :error="error">
        <div data-ai-video-error role="alert">
          {{ error }}
        </div>
      </slot>

      <slot v-else-if="status === 'empty'" name="empty">
        <div data-ai-video-empty>
          No video available
        </div>
      </slot>

      <template v-else-if="video">
        <video
          ref="videoRef"
          data-ai-video-element
          :src="video.url"
          :poster="video.poster"
          :autoplay="autoplay"
          :controls="controls"
          :loop="loop"
          :muted="muted"
          :width="video.width"
          :height="video.height"
          @play="onPlay"
          @pause="onPause"
          @timeupdate="onTimeUpdate"
          @ended="onEnded"
          @error="onError"
        />
        <slot name="info" :video="video" :current-time="currentTime" :format-time="formatTime">
          <div v-if="video.duration" data-ai-video-info>
            {{ formatTime(currentTime) }} / {{ formatTime(video.duration) }}
          </div>
        </slot>
      </template>
    </slot>
  </div>
</template>
