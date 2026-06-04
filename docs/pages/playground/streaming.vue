<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { aiMessages, input, handleSubmit, status, stop, isStreaming } = useAiChat({
  api: '/api/chat',
})
</script>

<template>
  <div>
    <DocsHeader
      title="Streaming Chat"
      description="Real streaming using useAiChat + mock /api/chat — no API key required."
    />

    <div class="mx-auto max-w-xl">
      <div class="mb-6 flex min-h-[200px] flex-col gap-4">
        <AiMessage
          v-for="(msg, i) in aiMessages"
          :key="i"
          v-bind="msg"
          :status="i === aiMessages.length - 1 && isStreaming ? 'streaming' : msg.status"
        >
          <template #avatar="{ role }">
            <div
              class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium"
              :class="role === 'user' ? 'bg-zinc-200 text-zinc-600 dark:bg-zinc-700' : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'"
            >
              {{ role === 'user' ? 'U' : 'AI' }}
            </div>
          </template>

          <template #reasoning="{ reasoning, isStreaming: streaming }">
            <AiReasoning v-if="reasoning" :content="reasoning" :streaming="streaming">
              <template #default="{ content: text }">
                <div class="mb-2 rounded-lg border-l-2 border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-500 dark:border-zinc-600 dark:bg-zinc-800/50">
                  {{ text }}
                </div>
              </template>
            </AiReasoning>
          </template>

          <template #content="{ content, isStreaming: streaming }">
            <AiShimmer v-if="streaming && !content" :lines="2" class="max-w-xs" />
            <div v-else-if="content" class="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              {{ content }}<AiStreamingCursor v-if="streaming" />
            </div>
          </template>
        </AiMessage>
      </div>

      <form @submit="handleSubmit">
        <AiPromptInput
          v-model="input"
          :loading="isStreaming"
          placeholder="Ask anything..."
          @stop="stop"
        >
          <template #input="{ value, placeholder: ph, handleInput, handleKeydown }">
            <textarea
              :value="value"
              :placeholder="ph"
              rows="2"
              class="flex-1 resize-none rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
              @input="handleInput"
              @keydown="handleKeydown"
            />
          </template>
          <template #actions="{ canSubmit, submit }">
            <button
              type="button"
              :disabled="!canSubmit"
              class="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900"
              @click="submit"
            >
              {{ isStreaming ? 'Stop' : 'Send' }}
            </button>
          </template>
        </AiPromptInput>
      </form>

      <p class="mt-3 text-xs text-zinc-400">
        Status: <span class="font-medium">{{ status }}</span>
      </p>
    </div>
  </div>
</template>
