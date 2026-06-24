<script setup lang="ts">
import { computed } from 'vue'
import type { AiAgentStep } from '../../types'

const props = defineProps<{
  steps: AiAgentStep[]
  title?: string
}>()

const activeStep = computed(() =>
  props.steps.find(s => s.status === 'running') ?? props.steps.find(s => s.status === 'pending'),
)
</script>

<template>
  <div
    data-ai-agent
    role="log"
    :aria-label="title ?? 'Agent execution'"
  >
    <slot name="header" :title="title" :step-count="steps.length" :active-step="activeStep">
      <div v-if="title" data-ai-agent-header>
        <slot name="title" :title="title">{{ title }}</slot>
      </div>
    </slot>

    <div data-ai-agent-steps>
      <slot :steps="steps">
        <div
          v-for="(step, i) in steps"
          :key="step.id"
          data-ai-agent-step
          :data-type="step.type"
          :data-status="step.status"
          role="article"
        >
          <slot name="step" :step="step" :index="i" :is-last="i === steps.length - 1">
            <slot name="step-indicator" :step="step">
              <span data-ai-agent-indicator :data-type="step.type" :data-status="step.status" />
            </slot>

            <div data-ai-agent-step-content>
              <slot name="step-type" :step="step">
                <span data-ai-agent-step-type>
                  {{ step.type }}
                  <template v-if="step.tool"> ({{ step.tool }})</template>
                </span>
              </slot>
              <slot name="step-content" :step="step">
                <div data-ai-agent-step-body>{{ step.content }}</div>
              </slot>
            </div>
          </slot>
        </div>
      </slot>
    </div>
  </div>
</template>
