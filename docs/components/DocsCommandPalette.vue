<script setup lang="ts">
import { filterSearchIndex } from '~/data/search-index'
import type { DocsSearchItem } from '~/data/search-index'

const open = defineModel<boolean>({ required: true })

const router = useRouter()
const query = ref('')
const selectedIndex = ref(0)
const inputRef = ref<HTMLInputElement | null>(null)

const results = computed(() => filterSearchIndex(query.value))

function onGlobalKeyDown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    open.value = !open.value
  }
}

onMounted(() => {
  window.addEventListener('keydown', onGlobalKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onGlobalKeyDown)
})

watch(open, (isOpen) => {
  if (isOpen) {
    query.value = ''
    selectedIndex.value = 0
    nextTick(() => inputRef.value?.focus())
  }
})

watch(query, () => {
  selectedIndex.value = 0
})

watch(results, () => {
  if (selectedIndex.value >= results.value.length) {
    selectedIndex.value = Math.max(0, results.value.length - 1)
  }
})

function close() {
  open.value = false
}

function go(item: DocsSearchItem) {
  close()
  router.push(item.to)
}

function onInputKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.preventDefault()
    close()
    return
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    selectedIndex.value = Math.min(selectedIndex.value + 1, results.value.length - 1)
    return
  }
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
    return
  }
  if (e.key === 'Enter' && results.value[selectedIndex.value]) {
    e.preventDefault()
    go(results.value[selectedIndex.value])
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[100] flex items-start justify-center bg-zinc-950/50 p-4 pt-[calc(3.5rem+10vh)] backdrop-blur-sm sm:p-6"
      @click.self="close"
    >
      <div
        class="w-full max-w-lg overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
        role="dialog"
        aria-modal="true"
        aria-label="Search documentation"
      >
        <div class="flex items-center gap-3 border-b border-zinc-200 px-4 dark:border-zinc-800">
          <svg class="h-4 w-4 shrink-0 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            ref="inputRef"
            v-model="query"
            type="search"
            placeholder="Search components, pages..."
            class="min-w-0 flex-1 bg-transparent py-3.5 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100"
            @keydown="onInputKeydown"
          >
          <kbd class="hidden shrink-0 rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500 sm:inline dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
            esc
          </kbd>
        </div>

        <ul
          v-if="results.length"
          class="max-h-72 overflow-y-auto docs-scroll py-2"
        >
          <li
            v-for="(item, index) in results"
            :key="item.id"
          >
            <button
              type="button"
              class="flex w-full flex-col gap-0.5 px-4 py-2.5 text-left transition"
              :class="index === selectedIndex
                ? 'bg-zinc-100 dark:bg-zinc-800'
                : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/60'"
              @click="go(item)"
              @mouseenter="selectedIndex = index"
            >
              <span class="text-sm font-medium text-zinc-900 dark:text-zinc-100">{{ item.title }}</span>
              <span class="text-xs text-zinc-500 dark:text-zinc-500">
                {{ item.group }}<template v-if="item.subtitle"> · {{ item.subtitle }}</template>
              </span>
            </button>
          </li>
        </ul>
        <p
          v-else
          class="px-4 py-8 text-center text-sm text-zinc-500"
        >
          No results for “{{ query }}”
        </p>
      </div>
    </div>
  </Teleport>
</template>
