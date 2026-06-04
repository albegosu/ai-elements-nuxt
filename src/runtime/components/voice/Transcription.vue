<script setup lang="ts">
const props = defineProps<{
  segments: { id: string; text: string; startTime: number; endTime: number; speaker?: string; confidence?: number }[]
  currentTime?: number
  highlightActive?: boolean
}>()

const emit = defineEmits<{
  (e: 'seek', time: number): void
}>()

const activeSegmentId = computed(() => {
  if (props.currentTime == null) return null
  const seg = props.segments.find(s => props.currentTime! >= s.startTime && props.currentTime! < s.endTime)
  return seg?.id ?? null
})

function formatTimestamp(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}
</script>

<template>
  <div data-ai-transcription role="log" aria-label="Transcription">
    <slot :segments="segments" :active-id="activeSegmentId">
      <div
        v-for="segment in segments"
        :key="segment.id"
        data-ai-transcription-segment
        :data-active="(highlightActive && segment.id === activeSegmentId) || undefined"
        :data-speaker="segment.speaker"
        @click="emit('seek', segment.startTime)"
        style="cursor: pointer;"
      >
        <slot name="segment" :segment="segment" :active="segment.id === activeSegmentId" :format-time="formatTimestamp">
          <slot name="timestamp" :start="segment.startTime" :end="segment.endTime">
            <span data-ai-transcription-time>{{ formatTimestamp(segment.startTime) }}</span>
          </slot>
          <slot name="speaker" :speaker="segment.speaker">
            <span v-if="segment.speaker" data-ai-transcription-speaker>{{ segment.speaker }}</span>
          </slot>
          <slot name="text" :text="segment.text" :confidence="segment.confidence">
            <span data-ai-transcription-text>{{ segment.text }}</span>
          </slot>
        </slot>
      </div>
    </slot>
  </div>
</template>
