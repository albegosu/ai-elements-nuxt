<script setup lang="ts">
import type { AiChainOfThoughtStep } from '../../types'

defineProps<{
  steps: AiChainOfThoughtStep[]
  title?: string
}>()
</script>

<template>
  <div
    data-ai-chain-of-thought
    role="log"
    :aria-label="title ?? 'Chain of thought'"
  >
    <slot name="header" :title="title" :step-count="steps.length">
      <div v-if="title" data-ai-cot-header>{{ title }}</div>
    </slot>

    <ol data-ai-cot-steps>
      <slot :steps="steps">
        <li
          v-for="(step, i) in steps"
          :key="step.id"
          data-ai-cot-step
          :data-status="step.status"
          role="article"
        >
          <slot name="step" :step="step" :index="i" :is-last="i === steps.length - 1">
            <slot name="step-indicator" :step="step">
              <span data-ai-cot-indicator :data-status="step.status" />
            </slot>

            <div data-ai-cot-step-body>
              <slot name="step-label" :step="step">
                <span data-ai-cot-label>{{ step.label }}</span>
              </slot>

              <slot name="step-description" :step="step">
                <p v-if="step.description" data-ai-cot-description>{{ step.description }}</p>
              </slot>

              <slot
                v-if="step.searchResults?.length"
                name="search-results"
                :results="step.searchResults"
                :step="step"
              >
                <ul data-ai-cot-search-results>
                  <li v-for="result in step.searchResults" :key="result.id">
                    <a v-if="result.url" :href="result.url" data-ai-cot-search-link>{{ result.title }}</a>
                    <span v-else>{{ result.title }}</span>
                  </li>
                </ul>
              </slot>

              <slot
                v-if="step.images?.length"
                name="images"
                :images="step.images"
                :step="step"
              >
                <div data-ai-cot-images>
                  <img
                    v-for="img in step.images"
                    :key="img.id"
                    :src="img.src"
                    :alt="img.alt ?? ''"
                    data-ai-cot-image
                  >
                </div>
              </slot>
            </div>
          </slot>
        </li>
      </slot>
    </ol>
  </div>
</template>
