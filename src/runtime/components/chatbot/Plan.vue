<script setup lang="ts">
import type { AiPlanStep } from '../../types'

defineProps<{
  steps: AiPlanStep[]
  title?: string
}>()

const completedCount = (steps: AiPlanStep[]): number =>
  steps.reduce((acc, s) => acc + (s.status === 'completed' ? 1 : 0) + (s.children ? completedCount(s.children) : 0), 0)

const totalCount = (steps: AiPlanStep[]): number =>
  steps.reduce((acc, _s) => acc + 1 + (_s.children ? totalCount(_s.children) : 0), 0)
</script>

<template>
  <div
    data-ai-plan
    role="list"
    aria-label="Plan"
  >
    <slot name="header" :title="title" :completed="completedCount(steps)" :total="totalCount(steps)">
      <div v-if="title" data-ai-plan-header>
        {{ title }}
        <span data-ai-plan-progress>{{ completedCount(steps) }}/{{ totalCount(steps) }}</span>
      </div>
    </slot>

    <slot :steps="steps">
      <div
        v-for="step in steps"
        :key="step.id"
        data-ai-plan-step
        :data-status="step.status"
        role="listitem"
      >
        <slot name="step" :step="step">
          <slot name="step-indicator" :status="step.status">
            <span data-ai-plan-indicator :data-status="step.status" />
          </slot>
          <div data-ai-plan-step-content>
            <slot name="step-title" :step="step">
              <span data-ai-plan-step-title>{{ step.title }}</span>
            </slot>
            <slot name="step-description" :step="step">
              <span v-if="step.description" data-ai-plan-step-desc>{{ step.description }}</span>
            </slot>
          </div>
        </slot>

        <div v-if="step.children?.length" data-ai-plan-children role="list">
          <div
            v-for="child in step.children"
            :key="child.id"
            data-ai-plan-step
            :data-status="child.status"
            role="listitem"
          >
            <slot name="step" :step="child">
              <slot name="step-indicator" :status="child.status">
                <span data-ai-plan-indicator :data-status="child.status" />
              </slot>
              <span data-ai-plan-step-title>{{ child.title }}</span>
            </slot>
          </div>
        </div>
      </div>
    </slot>
  </div>
</template>
