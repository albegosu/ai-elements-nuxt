<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { AiArtifactData } from '../../types'
import { sanitizeRenderedHtml } from '../../utils/sanitizeHtml'

const props = defineProps<{
  artifacts: AiArtifactData[]
}>()

const activeId = ref<string | undefined>(props.artifacts[0]?.id)

const activeArtifact = computed(() =>
  props.artifacts.find(a => a.id === activeId.value)
)

watch(
  () => props.artifacts,
  (artifacts) => {
    if (!artifacts.length) {
      activeId.value = undefined
      return
    }
    if (!artifacts.some(a => a.id === activeId.value)) {
      activeId.value = artifacts[0].id
    }
  },
  { deep: true },
)

function setActive(id: string) {
  activeId.value = id
}
</script>

<template>
  <div data-ai-artifact role="region" aria-label="Artifacts">
    <slot
      :artifacts="artifacts"
      :active="activeArtifact"
      :active-id="activeId"
      :set-active="setActive"
    >
      <slot name="tabs" :artifacts="artifacts" :active-id="activeId" :set-active="setActive">
        <div data-ai-artifact-tabs role="tablist" v-if="artifacts.length > 1">
          <button
            v-for="artifact in artifacts"
            :key="artifact.id"
            type="button"
            role="tab"
            :aria-selected="artifact.id === activeId"
            data-ai-artifact-tab
            :data-active="artifact.id === activeId || undefined"
            @click="setActive(artifact.id)"
          >
            <slot name="tab" :artifact="artifact" :active="artifact.id === activeId">
              {{ artifact.title }}
            </slot>
          </button>
        </div>
      </slot>

      <div data-ai-artifact-content role="tabpanel">
        <slot name="content" :artifact="activeArtifact" v-if="activeArtifact">
          <pre v-if="activeArtifact.type === 'code'"><code>{{ activeArtifact.content }}</code></pre>
          <div
            v-else-if="activeArtifact.type === 'html'"
            v-html="sanitizeRenderedHtml(activeArtifact.content)"
          />
          <div v-else>{{ activeArtifact.content }}</div>
        </slot>
      </div>
    </slot>
  </div>
</template>
