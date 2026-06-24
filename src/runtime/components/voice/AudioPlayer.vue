<script setup lang="ts">
import { computed, ref } from 'vue'
withDefaults(defineProps<{
  src: string
  title?: string
  autoplay?: boolean
}>(), {
  autoplay: false,
})

const emit = defineEmits<{
  (e: 'play'): void
  (e: 'pause'): void
  (e: 'ended'): void
  (e: 'timeupdate', time: number): void
}>()

const audioRef = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const progress = computed(() => duration.value ? (currentTime.value / duration.value) * 100 : 0)

function play() {
  audioRef.value?.play()
  isPlaying.value = true
  emit('play')
}

function pause() {
  audioRef.value?.pause()
  isPlaying.value = false
  emit('pause')
}

function toggle() {
  if (isPlaying.value) pause()
  else play()
}

function seek(time: number) {
  if (audioRef.value) {
    audioRef.value.currentTime = time
    currentTime.value = time
  }
}

function handleTimeUpdate() {
  if (audioRef.value) {
    currentTime.value = audioRef.value.currentTime
    emit('timeupdate', currentTime.value)
  }
}

function handleLoadedMetadata() {
  if (audioRef.value) {
    duration.value = audioRef.value.duration
  }
}

function handleEnded() {
  isPlaying.value = false
  emit('ended')
}

function handlePlay() {
  isPlaying.value = true
  emit('play')
}

function handlePause() {
  isPlaying.value = false
  emit('pause')
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

defineExpose({ play, pause, seek, audioRef })
</script>

<template>
  <div
    data-ai-audio-player
    :data-playing="isPlaying || undefined"
    role="region"
    :aria-label="title ?? 'Audio player'"
  >
    <audio
      ref="audioRef"
      :src="src"
      :autoplay="autoplay"
      @timeupdate="handleTimeUpdate"
      @loadedmetadata="handleLoadedMetadata"
      @ended="handleEnded"
      @play="handlePlay"
      @pause="handlePause"
    />

    <slot
      :is-playing="isPlaying"
      :current-time="currentTime"
      :duration="duration"
      :progress="progress"
      :toggle="toggle"
      :play="play"
      :pause="pause"
      :seek="seek"
      :format-time="formatTime"
    >
      <slot name="play-button" :is-playing="isPlaying" :toggle="toggle">
        <button type="button" @click="toggle" :aria-label="isPlaying ? 'Pause' : 'Play'">
          {{ isPlaying ? '⏸' : '▶' }}
        </button>
      </slot>

      <slot name="progress" :progress="progress" :current-time="currentTime" :duration="duration" :seek="seek">
        <div data-ai-audio-progress role="progressbar" :aria-valuenow="progress" aria-valuemin="0" aria-valuemax="100">
          <div data-ai-audio-progress-bar :style="{ width: `${progress}%` }" />
        </div>
      </slot>

      <slot name="time" :current-time="currentTime" :duration="duration" :format-time="formatTime">
        <span data-ai-audio-time>{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
      </slot>
    </slot>
  </div>
</template>
