<script setup lang="ts">
import { computed } from 'vue'
import type { AiTimelineEntry } from '../../types/realtime'

const props = withDefaults(defineProps<{
  entries: AiTimelineEntry[]
  title?: string
  showDuration?: boolean
  collapsed?: boolean
}>(), {
  showDuration: true,
  collapsed: false,
})

const activeEntry = computed(() =>
  props.entries.find(e => e.status === 'running'),
)

const completedCount = computed(() =>
  props.entries.filter(e => e.status === 'completed').length,
)

const totalDuration = computed(() => {
  let total = 0
  for (const entry of props.entries) {
    if (entry.duration != null) total += entry.duration
    else if (entry.startTime != null && entry.endTime != null) total += entry.endTime - entry.startTime
  }
  return total
})

function formatDuration(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

function entryDuration(entry: AiTimelineEntry): number | undefined {
  if (entry.duration != null) return entry.duration
  if (entry.startTime != null && entry.endTime != null) return entry.endTime - entry.startTime
  return undefined
}
</script>

<template>
  <div
    data-ai-agent-timeline
    :data-collapsed="collapsed || undefined"
    role="log"
    :aria-label="title ?? 'Agent timeline'"
  >
    <slot
      :entries="entries"
      :active-entry="activeEntry"
      :completed-count="completedCount"
      :total-duration="totalDuration"
      :format-duration="formatDuration"
    >
      <slot name="header" :title="title" :completed-count="completedCount" :total-count="entries.length" :total-duration="totalDuration">
        <div v-if="title || showDuration" data-ai-timeline-header>
          <slot name="title" :title="title">
            <span v-if="title" data-ai-timeline-title>{{ title }}</span>
          </slot>
          <slot name="summary" :completed-count="completedCount" :total-count="entries.length" :total-duration="totalDuration">
            <span data-ai-timeline-summary>
              {{ completedCount }}/{{ entries.length }} steps
              <template v-if="showDuration && totalDuration > 0">
                · {{ formatDuration(totalDuration) }}
              </template>
            </span>
          </slot>
        </div>
      </slot>

      <div v-if="!collapsed" data-ai-timeline-entries>
        <div
          v-for="(entry, i) in entries"
          :key="entry.id"
          data-ai-timeline-entry
          :data-type="entry.type"
          :data-status="entry.status"
          role="article"
          :aria-current="entry.status === 'running' ? 'step' : undefined"
        >
          <slot name="entry" :entry="entry" :index="i" :is-last="i === entries.length - 1" :format-duration="formatDuration">
            <slot name="connector" :entry="entry" :index="i" :is-last="i === entries.length - 1">
              <div data-ai-timeline-connector>
                <span data-ai-timeline-dot :data-type="entry.type" :data-status="entry.status" />
                <span v-if="i < entries.length - 1" data-ai-timeline-line :data-status="entry.status" />
              </div>
            </slot>

            <div data-ai-timeline-entry-content>
              <slot name="entry-header" :entry="entry">
                <div data-ai-timeline-entry-header>
                  <span data-ai-timeline-entry-type>
                    {{ entry.type }}
                    <template v-if="entry.tool"> · {{ entry.tool }}</template>
                  </span>
                  <span v-if="showDuration && entryDuration(entry)" data-ai-timeline-entry-duration>
                    {{ formatDuration(entryDuration(entry)!) }}
                  </span>
                </div>
              </slot>

              <slot name="entry-body" :entry="entry">
                <div data-ai-timeline-entry-body>{{ entry.content }}</div>
              </slot>

              <slot v-if="entry.children?.length" name="children" :children="entry.children" :entry="entry">
                <div data-ai-timeline-children>
                  <div
                    v-for="child in entry.children"
                    :key="child.id"
                    data-ai-timeline-child
                    :data-type="child.type"
                    :data-status="child.status"
                  >
                    <slot name="child" :child="child" :parent="entry">
                      {{ child.content }}
                    </slot>
                  </div>
                </div>
              </slot>
            </div>
          </slot>
        </div>
      </div>
    </slot>
  </div>
</template>
