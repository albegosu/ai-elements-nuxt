<script setup lang="ts">
import type { AiSource } from '../../types'

defineProps<{
  sources: AiSource[]
}>()
</script>

<template>
  <div
    data-ai-sources
    role="list"
    aria-label="Sources"
  >
    <slot :sources="sources">
      <div
        v-for="source in sources"
        :key="source.id"
        data-ai-source
        role="listitem"
      >
        <slot name="source" :source="source">
          <a
            v-if="source.url"
            :href="source.url"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ source.title }}
          </a>
          <span v-else>{{ source.title }}</span>
        </slot>
      </div>
    </slot>
  </div>
</template>
