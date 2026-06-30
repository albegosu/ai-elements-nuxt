<script setup lang="ts">
import { computed } from 'vue'
import type { AiSandboxState, AiSandboxLine, AiSandboxArtifact } from '../../types/realtime'

const props = withDefaults(defineProps<{
  state: AiSandboxState
  showCommand?: boolean
  showArtifacts?: boolean
  maxLines?: number
}>(), {
  showCommand: true,
  showArtifacts: true,
})

const emit = defineEmits<{
  (e: 'run'): void
  (e: 'stop'): void
  (e: 'artifact-click', artifact: AiSandboxArtifact): void
}>()

const visibleLines = computed<AiSandboxLine[]>(() => {
  if (props.maxLines && props.state.lines.length > props.maxLines) {
    return props.state.lines.slice(-props.maxLines)
  }
  return props.state.lines
})

const hasArtifacts = computed(() =>
  props.showArtifacts && (props.state.artifacts?.length ?? 0) > 0,
)

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
</script>

<template>
  <div
    data-ai-sandbox-preview
    :data-status="state.status"
    role="log"
    aria-label="Sandbox output"
  >
    <slot
      :state="state"
      :visible-lines="visibleLines"
      :has-artifacts="hasArtifacts"
      :format-size="formatSize"
    >
      <slot name="header" :state="state">
        <div v-if="showCommand && state.command" data-ai-sandbox-header>
          <slot name="command" :command="state.command">
            <code data-ai-sandbox-command>{{ state.command }}</code>
          </slot>
          <slot name="actions" :state="state">
            <button
              v-if="state.status === 'idle'"
              type="button"
              data-ai-sandbox-run
              @click="emit('run')"
            >
              Run
            </button>
            <button
              v-if="state.status === 'running'"
              type="button"
              data-ai-sandbox-stop
              @click="emit('stop')"
            >
              Stop
            </button>
          </slot>
        </div>
      </slot>

      <slot name="output" :lines="visibleLines" :status="state.status">
        <div v-if="visibleLines.length" data-ai-sandbox-output role="log">
          <div
            v-for="line in visibleLines"
            :key="line.id"
            data-ai-sandbox-line
            :data-stream="line.stream"
          >
            <slot name="line" :line="line">
              <span data-ai-sandbox-line-content>{{ line.content }}</span>
            </slot>
          </div>
        </div>
      </slot>

      <slot name="status" :state="state">
        <div v-if="state.status === 'error' && state.error" data-ai-sandbox-error role="alert">
          {{ state.error }}
        </div>
        <div v-if="state.status === 'completed' && state.exitCode != null" data-ai-sandbox-exit>
          Exit code: {{ state.exitCode }}
        </div>
      </slot>

      <slot v-if="hasArtifacts" name="artifacts" :artifacts="state.artifacts!" :format-size="formatSize">
        <div data-ai-sandbox-artifacts role="list" aria-label="Artifacts">
          <div
            v-for="artifact in state.artifacts"
            :key="artifact.id"
            data-ai-sandbox-artifact
            role="listitem"
          >
            <slot name="artifact" :artifact="artifact" :format-size="formatSize">
              <button
                type="button"
                data-ai-sandbox-artifact-button
                @click="emit('artifact-click', artifact)"
              >
                <span data-ai-sandbox-artifact-name>{{ artifact.name }}</span>
                <span v-if="artifact.size" data-ai-sandbox-artifact-size>{{ formatSize(artifact.size) }}</span>
              </button>
            </slot>
          </div>
        </div>
      </slot>
    </slot>
  </div>
</template>
