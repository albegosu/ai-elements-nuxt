<script setup lang="ts">
const input = ref('')
const useWebSearch = ref(false)
const model = ref('gpt-4o')

const models = [
  { id: 'gpt-4o', name: 'GPT-4o' },
  { id: 'claude-opus', name: 'Claude 4 Opus' },
]
</script>

<template>
  <AiPromptInput
    v-model="input"
    placeholder="What would you like to know?"
    class="w-full max-w-2xl [&_[data-ai-prompt-input]]:relative [&_[data-ai-prompt-input]]:block [&_[data-ai-prompt-input]]:border-0 [&_[data-ai-prompt-input]]:bg-transparent [&_[data-ai-prompt-input]]:p-0"
  >
    <template #input="{ value, placeholder, disabled, loading, handleInput, handleKeydown, textareaRef }">
      <div class="w-full overflow-hidden rounded-2xl border border-zinc-700/60 bg-zinc-900/90 pr-14 shadow-sm dark:border-zinc-700/50">
        <textarea
          :ref="(el) => { if (textareaRef) textareaRef.value = el as HTMLTextAreaElement }"
          :value="value"
          :placeholder="placeholder"
          :disabled="disabled || loading"
          rows="3"
          class="min-h-[88px] w-full resize-none bg-transparent px-4 pb-2 pt-4 text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
          @input="handleInput"
          @keydown="handleKeydown"
        />
        <div class="flex items-center gap-1 px-3 pb-3">
          <button
            type="button"
            class="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
            aria-label="Add attachments"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm transition"
            :class="useWebSearch
              ? 'bg-zinc-700 text-zinc-100'
              : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'"
            @click="useWebSearch = !useWebSearch"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
            Search
          </button>
          <div class="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-zinc-300">
            <svg class="h-4 w-4 shrink-0 text-zinc-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.758a.795.795 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.814 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855-5.814-3.355L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.677a.79.79 0 0 0-.407-.668zm2.01-3.023-2.02-1.168a.077.077 0 0 1-.038-.057V6.075a4.499 4.499 0 0 1 7.375-3.453l-.142.08-4.778 2.758a.795.795 0 0 0-.393.681zm-9.61-2.47 5.843-3.37 2.02 1.168a.076.076 0 0 1 .038.057v5.583l-2.02-1.168a.077.077 0 0 1-.038-.057zM8.79 8.965l2.02-1.163 2.02 1.163v2.327l-2.02 1.163-2.02-1.163z" />
            </svg>
            <select
              v-model="model"
              class="max-w-[120px] cursor-pointer appearance-none truncate bg-transparent text-sm outline-none"
            >
              <option
                v-for="m in models"
                :key="m.id"
                :value="m.id"
              >
                {{ m.name }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </template>

    <template #actions="{ canSubmit, loading, submit }">
      <button
        type="button"
        class="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
        :disabled="!canSubmit || loading"
        aria-label="Submit"
        @click="submit"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6.75-6.75 6.75 6.75m-6.75 6V5.25" />
        </svg>
      </button>
    </template>
  </AiPromptInput>
</template>
