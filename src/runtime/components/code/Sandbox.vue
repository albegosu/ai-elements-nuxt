<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
const props = withDefaults(defineProps<{
  code: string
  language?: string
  template?: string
  autoRun?: boolean
  title?: string
}>(), {
  language: 'html',
  autoRun: false,
})

const emit = defineEmits<{
  (e: 'run', code: string): void
  (e: 'error', error: string): void
}>()

const isRunning = ref(false)
const error = ref<string | null>(null)

const iframeHtml = computed(() => {
  if (props.template) {
    return props.template.replace('{{code}}', props.code)
  }
  if (props.language === 'html') return props.code
  if (props.language === 'javascript' || props.language === 'js') {
    return `<!DOCTYPE html><html><body><pre id="out"></pre><script>
try {
  const __log = [];
  const origLog = console.log;
  console.log = (...a) => { __log.push(a.map(String).join(' ')); origLog(...a); };
  ${props.code}
  document.getElementById('out').textContent = __log.join('\\n');
} catch(e) { document.getElementById('out').textContent = 'Error: ' + e.message; }
</` + `script></body></html>`
  }
  return `<pre>${props.code}</pre>`
})

function run() {
  isRunning.value = true
  error.value = null
  try {
    emit('run', props.code)
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e)
    error.value = message
    emit('error', message)
  } finally {
    setTimeout(() => { isRunning.value = false }, 100)
  }
}

onMounted(() => {
  if (props.autoRun) run()
})
</script>

<template>
  <div data-ai-sandbox role="region" :aria-label="title ?? 'Code sandbox'">
    <slot
      :code="code"
      :language="language"
      :run="run"
      :is-running="isRunning"
      :error="error"
      :iframe-html="iframeHtml"
    >
      <slot name="header" :title="title" :run="run" :is-running="isRunning">
        <div data-ai-sandbox-header>
          <slot name="title">{{ title ?? 'Sandbox' }}</slot>
          <button type="button" @click="run" :disabled="isRunning" data-ai-sandbox-run>
            {{ isRunning ? 'Running...' : 'Run' }}
          </button>
        </div>
      </slot>

      <slot name="editor" :code="code" :language="language">
        <pre data-ai-sandbox-code><code>{{ code }}</code></pre>
      </slot>

      <slot name="output" :iframe-html="iframeHtml" :error="error">
        <div data-ai-sandbox-output>
          <iframe
            :srcdoc="iframeHtml"
            sandbox="allow-scripts"
            data-ai-sandbox-frame
            title="Sandbox output"
          />
        </div>
      </slot>
    </slot>
  </div>
</template>
