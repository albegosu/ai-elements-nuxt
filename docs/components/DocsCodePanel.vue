<script setup lang="ts">
const props = defineProps<{
  code: string
}>()

const copied = ref(false)

async function copyCode() {
  const code = props.code
  try {
    await navigator.clipboard.writeText(code)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // clipboard unavailable
  }
}
</script>

<template>
  <div class="min-w-0 border-t border-zinc-200 dark:border-zinc-800">
    <div class="flex items-center justify-end border-b border-zinc-800/50 bg-zinc-950 px-3 py-1.5">
      <button
        type="button"
        class="rounded-md px-2.5 py-1 text-xs font-medium text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
        @click="copyCode"
      >
        {{ copied ? 'Copied' : 'Copy' }}
      </button>
    </div>
    <div class="docs-scroll min-w-0 overflow-x-auto">
      <pre class="bg-zinc-950 p-4 text-[13px] leading-relaxed text-zinc-100"><code class="whitespace-pre">{{ code }}</code></pre>
    </div>
  </div>
</template>
