<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'

const full = `<div class="card">
  <h3>Weather in Madrid</h3>
  <p class="temp">28°C · Sunny</p>
  <ul>
    <li>Humidity: 34%</li>
    <li>Wind: 12 km/h</li>
  </ul>
</div>`

const streamed = ref(full)
let timer: ReturnType<typeof setInterval> | null = null

function play() {
  if (timer) clearInterval(timer)
  streamed.value = ''
  let i = 0
  timer = setInterval(() => {
    i += 3
    streamed.value = full.slice(0, i)
    if (i >= full.length) {
      streamed.value = full
      if (timer) clearInterval(timer)
    }
  }, 40)
}

onBeforeUnmount(() => timer && clearInterval(timer))
</script>

<template>
  <div class="w-full space-y-3">
    <button
      type="button"
      class="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      @click="play"
    >
      Replay streaming
    </button>

    <AiJsxPreview
      :content="streamed"
      class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <template #default="{ html }">
        <div
          class="prose prose-sm prose-zinc dark:prose-invert [&_.card]:space-y-1 [&_.temp]:text-2xl [&_.temp]:font-semibold"
          v-html="html"
        />
      </template>
    </AiJsxPreview>
  </div>
</template>
