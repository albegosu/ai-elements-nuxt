<script setup lang="ts">
import type { AiTestResult, AiTestSummary } from '../../types'

const props = defineProps<{
  tests: AiTestResult[]
  summary?: AiTestSummary
}>()

const computedSummary = computed<AiTestSummary>(() => {
  if (props.summary) return props.summary
  const passed = props.tests.filter(t => t.status === 'passed').length
  const failed = props.tests.filter(t => t.status === 'failed').length
  const skipped = props.tests.filter(t => t.status === 'skipped').length
  const duration = props.tests.reduce((s, t) => s + (t.duration ?? 0), 0)
  return { total: props.tests.length, passed, failed, skipped, duration }
})

const groupedBySuite = computed(() => {
  const groups: Record<string, AiTestResult[]> = {}
  for (const test of props.tests) {
    const suite = test.suite ?? ''
    if (!groups[suite]) groups[suite] = []
    groups[suite].push(test)
  }
  return groups
})
</script>

<template>
  <div data-ai-test-results role="region" aria-label="Test results">
    <slot name="summary" :summary="computedSummary">
      <div data-ai-test-summary>
        <span data-ai-test-total>{{ computedSummary.total }} tests</span>
        <span data-ai-test-passed>{{ computedSummary.passed }} passed</span>
        <span v-if="computedSummary.failed" data-ai-test-failed>{{ computedSummary.failed }} failed</span>
        <span v-if="computedSummary.skipped" data-ai-test-skipped>{{ computedSummary.skipped }} skipped</span>
        <span v-if="computedSummary.duration" data-ai-test-duration>{{ computedSummary.duration }}ms</span>
      </div>
    </slot>

    <slot :tests="tests" :grouped="groupedBySuite" :summary="computedSummary">
      <template v-for="(suiteTests, suite) in groupedBySuite" :key="suite">
        <slot name="suite" :suite="suite" :tests="suiteTests">
          <div v-if="suite" data-ai-test-suite>{{ suite }}</div>
        </slot>

        <div data-ai-test-suite-list role="list">
        <div
          v-for="(test, testIndex) in suiteTests"
          :key="`${suite}-${test.name}-${testIndex}`"
          data-ai-test-item
          :data-status="test.status"
          role="listitem"
        >
          <slot name="test" :test="test">
            <slot name="test-icon" :status="test.status">
              <span data-ai-test-icon :data-status="test.status">
                {{ test.status === 'passed' ? '✓' : test.status === 'failed' ? '✗' : test.status === 'skipped' ? '○' : '…' }}
              </span>
            </slot>
            <span data-ai-test-name>{{ test.name }}</span>
            <span v-if="test.duration" data-ai-test-time>{{ test.duration }}ms</span>
          </slot>

          <slot name="test-error" :test="test" v-if="test.error">
            <div data-ai-test-error>{{ test.error }}</div>
          </slot>
        </div>
        </div>
      </template>
    </slot>
  </div>
</template>
