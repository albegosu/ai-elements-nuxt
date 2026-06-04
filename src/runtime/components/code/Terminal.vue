<script setup lang="ts">
import type { AiTerminalLine } from '../../types'

withDefaults(defineProps<{
  lines: AiTerminalLine[]
  title?: string
}>(), {
  title: 'Terminal',
})
</script>

<template>
  <div
    data-ai-terminal
    role="log"
    :aria-label="title"
  >
    <slot name="header" :title="title">
      <div data-ai-terminal-header>
        <slot name="controls">
          <span data-ai-terminal-dots>
            <span data-ai-terminal-dot data-color="red" />
            <span data-ai-terminal-dot data-color="yellow" />
            <span data-ai-terminal-dot data-color="green" />
          </span>
        </slot>
        <slot name="title" :title="title">
          <span data-ai-terminal-title>{{ title }}</span>
        </slot>
      </div>
    </slot>

    <div data-ai-terminal-body>
      <slot :lines="lines">
        <div
          v-for="(line, i) in lines"
          :key="i"
          data-ai-terminal-line
          :data-type="line.type"
        >
          <slot name="line" :line="line" :index="i">
            <span v-if="line.prefix" data-ai-terminal-prefix>{{ line.prefix }}</span>
            <span v-else-if="line.type === 'command'" data-ai-terminal-prefix>$</span>
            <span data-ai-terminal-content>{{ line.content }}</span>
          </slot>
        </div>
      </slot>
    </div>
  </div>
</template>
