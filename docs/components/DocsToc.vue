<script setup lang="ts">
const { items, githubPath } = useDocsToc()
const activeId = ref<string>('')

let observer: IntersectionObserver | null = null

function scrollToTop() {
  if (!import.meta.client) return
  const main = document.querySelector('main')
  main?.scrollTo({ top: 0, behavior: 'smooth' })
}

function setupObserver() {
  observer?.disconnect()
  if (!import.meta.client || !items.value.length) return

  const ids = items.value.flatMap(item => [
    item.id,
    ...(item.children?.map(c => c.id) ?? []),
  ])

  const elements = ids
    .map(id => document.getElementById(id))
    .filter((el): el is HTMLElement => el != null)

  if (!elements.length) return

  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      if (visible.length) {
        activeId.value = visible[0].target.id
      }
    },
    { rootMargin: '-80px 0px -60% 0px', threshold: 0 },
  )

  for (const el of elements) {
    observer.observe(el)
  }
}

watch(items, () => {
  nextTick(() => setupObserver())
}, { immediate: true, deep: true })

onUnmounted(() => observer?.disconnect())
</script>

<template>
  <aside
    v-if="items.length"
    class="hidden w-56 shrink-0 flex-col border-l border-zinc-200 dark:border-zinc-800 xl:flex"
  >
    <div class="docs-scroll sticky top-14 flex max-h-[calc(100vh-3.5rem)] flex-col overflow-y-auto px-4 py-6">
      <p class="mb-3 flex items-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
        On this page
      </p>

      <nav class="space-y-1 text-sm">
        <div
          v-for="item in items"
          :key="item.id"
        >
          <a
            :href="`#${item.id}`"
            class="block border-l-2 py-1 pl-3 transition"
            :class="activeId === item.id
              ? 'border-blue-600 font-medium text-blue-600 dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'"
          >
            {{ item.label }}
          </a>
          <ul
            v-if="item.children?.length"
            class="ml-3 mt-0.5 space-y-0.5 border-l border-zinc-200 pl-3 dark:border-zinc-800"
          >
            <li
              v-for="child in item.children"
              :key="child.id"
            >
              <a
                :href="`#${child.id}`"
                class="block py-0.5 font-mono text-xs transition"
                :class="activeId === child.id
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300'"
              >
                {{ child.label }}
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <div class="mt-6 space-y-2 border-t border-zinc-200 pt-4 dark:border-zinc-800">
        <a
          v-if="githubPath"
          :href="githubPath"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2 text-xs text-zinc-500 transition hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          <svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-4.17-.45-8.55-2.085-8.55-9.285 0-2.04.735-3.705 1.935-5.01-.195-.48-.84-2.385.195-4.965 0 0 1.575-.495 5.145 1.91 1.485-.42 3.075-.63 4.65-.63 1.575 0 3.165.21 4.65.63 3.57-2.43 5.145-1.91 5.145-1.91 1.035 2.58.39 4.485.195 4.965 1.2 1.305 1.935 2.97 1.935 5.01 0 7.23-4.395 8.835-8.55 9.285-.675.585-1.275 1.605-1.275 2.97 0 2.145.015 3.87.015 4.395 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          Edit on GitHub
        </a>
        <button
          type="button"
          class="flex w-full items-center gap-2 text-xs text-zinc-500 transition hover:text-zinc-700 dark:hover:text-zinc-300"
          @click="scrollToTop"
        >
          <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          </svg>
          Scroll to top
        </button>
      </div>
    </div>
  </aside>
</template>
