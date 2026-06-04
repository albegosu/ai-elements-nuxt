<script setup lang="ts">
const props = withDefaults(defineProps<{
  code: string
  language?: string
  filename?: string
  highlightLines?: number[]
  showLineNumbers?: boolean
}>(), {
  language: 'text',
  showLineNumbers: true,
})

const emit = defineEmits<{
  (e: 'copy'): void
}>()

const copied = ref(false)

const lines = computed(() => props.code.split('\n'))

function isHighlighted(lineNumber: number): boolean {
  return props.highlightLines?.includes(lineNumber) ?? false
}

async function copyCode() {
  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    emit('copy')
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // clipboard unavailable
  }
}
</script>

<template>
  <div
    data-ai-code-block
    :data-language="language"
    role="region"
    :aria-label="filename ? `Code: ${filename}` : 'Code block'"
  >
    <slot name="header" :filename="filename" :language="language" :copy="copyCode" :copied="copied">
      <div v-if="filename || language" data-ai-code-header>
        <slot name="filename" :filename="filename">
          <span v-if="filename" data-ai-code-filename>{{ filename }}</span>
        </slot>
        <slot name="language-badge" :language="language">
          <span v-if="language && language !== 'text'" data-ai-code-lang>{{ language }}</span>
        </slot>
        <slot name="copy-button" :copy="copyCode" :copied="copied">
          <button type="button" @click="copyCode" data-ai-code-copy :aria-label="copied ? 'Copied' : 'Copy code'">
            {{ copied ? 'Copied' : 'Copy' }}
          </button>
        </slot>
      </div>
    </slot>

    <slot :code="code" :lines="lines" :language="language">
      <pre data-ai-code-pre><code data-ai-code-content :data-language="language"><template
        v-for="(line, i) in lines"
        :key="i"
      ><span
          v-if="showLineNumbers"
          data-ai-code-line-number
        >{{ i + 1 }}</span><span
          data-ai-code-line
          :data-highlighted="isHighlighted(i + 1) || undefined"
        >{{ line }}</span>
</template></code></pre>
    </slot>
  </div>
</template>
