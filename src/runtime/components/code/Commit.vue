<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { AiCommitData, AiCommitFile } from '../../types'

const props = withDefaults(defineProps<{
  commit: AiCommitData
  expanded?: boolean
}>(), {
  expanded: false,
})

const isExpanded = ref(props.expanded)

watch(() => props.expanded, (val) => { isExpanded.value = val })

function toggle() { isExpanded.value = !isExpanded.value }

const totalAdditions = computed(() => props.commit.files.reduce((s, f) => s + (f.additions ?? 0), 0))
const totalDeletions = computed(() => props.commit.files.reduce((s, f) => s + (f.deletions ?? 0), 0))

function statusIcon(status: AiCommitFile['status']) {
  return { added: 'A', modified: 'M', deleted: 'D', renamed: 'R' }[status]
}
</script>

<template>
  <div data-ai-commit role="article" :aria-label="`Commit ${commit.hash.slice(0, 7)}`">
    <slot :commit="commit" :toggle="toggle" :expanded="isExpanded" :total-additions="totalAdditions" :total-deletions="totalDeletions">
      <slot name="header" :commit="commit" :toggle="toggle" :expanded="isExpanded">
        <button
          type="button"
          data-ai-commit-header
          :aria-expanded="isExpanded"
          @click="toggle"
        >
          <slot name="hash" :hash="commit.hash">
            <code data-ai-commit-hash>{{ commit.hash.slice(0, 7) }}</code>
          </slot>
          <slot name="message" :message="commit.message">
            <span data-ai-commit-message>{{ commit.message }}</span>
          </slot>
          <slot name="meta" :commit="commit">
            <span v-if="commit.author" data-ai-commit-author>{{ commit.author }}</span>
          </slot>
          <slot name="stats" :additions="totalAdditions" :deletions="totalDeletions">
            <span data-ai-commit-stats>
              <span data-ai-commit-add>+{{ totalAdditions }}</span>
              <span data-ai-commit-del>-{{ totalDeletions }}</span>
            </span>
          </slot>
        </button>
      </slot>

      <div v-show="isExpanded" data-ai-commit-files role="list">
        <slot name="files" :files="commit.files">
          <div
            v-for="file in commit.files"
            :key="file.path"
            data-ai-commit-file
            :data-status="file.status"
            role="listitem"
          >
            <slot name="file" :file="file">
              <span data-ai-commit-file-status>{{ statusIcon(file.status) }}</span>
              <span data-ai-commit-file-path>{{ file.path }}</span>
              <span v-if="file.additions || file.deletions" data-ai-commit-file-stats>
                <span v-if="file.additions" data-ai-commit-add>+{{ file.additions }}</span>
                <span v-if="file.deletions" data-ai-commit-del>-{{ file.deletions }}</span>
              </span>
            </slot>
          </div>
        </slot>
      </div>
    </slot>
  </div>
</template>
