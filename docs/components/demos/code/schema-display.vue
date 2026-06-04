<script setup lang="ts">
const fields = [
  { name: 'model', type: 'string', required: true, description: 'The model identifier (e.g. "gpt-4o")' },
  { name: 'messages', type: 'Message[]', required: true, description: 'Array of conversation messages' },
  { name: 'temperature', type: 'number', description: 'Sampling temperature between 0 and 2' },
  {
    name: 'toolConfig',
    type: 'object',
    description: 'Configuration for tool calling',
    children: [
      { name: 'tools', type: 'Tool[]', required: true },
      { name: 'toolChoice', type: '"auto" | "required" | "none"' },
    ],
  },
  { name: 'stream', type: 'boolean', description: 'Enable streaming responses' },
]
</script>

<template>
  <div class="w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
    <p class="mb-3 font-mono text-sm font-medium text-zinc-900 dark:text-zinc-50">ChatCompletionRequest</p>
    <AiSchemaDisplay :fields="fields">
      <template #field="{ field, depth }">
        <div class="flex items-start gap-2 py-1 text-sm" :style="{ paddingLeft: `${depth * 16}px` }">
          <code class="text-blue-600 dark:text-blue-400">{{ field.name }}</code>
          <span class="font-mono text-xs text-zinc-400">{{ field.type }}</span>
          <span v-if="field.required" class="text-[10px] font-medium text-red-500">required</span>
          <span v-if="field.description" class="ml-auto text-xs text-zinc-400">{{ field.description }}</span>
        </div>
      </template>
    </AiSchemaDisplay>
  </div>
</template>
