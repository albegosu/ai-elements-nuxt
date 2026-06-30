<script setup lang="ts">
const route = useRoute()
const { items, githubPath } = useDocsToc()
const activeId = ref<string>('')

const SCROLL_OFFSET = 96 // matches scroll-mt-24

let observer: IntersectionObserver | null = null

function getMainElement(): HTMLElement | null {
  if (!import.meta.client) return null
  return document.querySelector('main')
}

function scrollToSection(id: string) {
  const main = getMainElement()
  const el = document.getElementById(id)
  if (!main || !el) return

  const offset = el.getBoundingClientRect().top - main.getBoundingClientRect().top + main.scrollTop - SCROLL_OFFSET
  main.scrollTo({ top: Math.max(0, offset), behavior: 'smooth' })
}

function onTocLinkClick(id: string, event: MouseEvent) {
  event.preventDefault()
  scrollToSection(id)
  history.replaceState(null, '', `#${id}`)
}

function scrollToTop() {
  getMainElement()?.scrollTo({ top: 0, behavior: 'smooth' })
}

function scrollToHashIfPresent() {
  if (!import.meta.client || !route.hash) return
  nextTick(() => scrollToSection(route.hash.slice(1)))
}

function setupObserver() {
  observer?.disconnect()
  if (!import.meta.client || !items.value.length) return

  const main = getMainElement()
  if (!main) return

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
    {
      root: main,
      rootMargin: `-${SCROLL_OFFSET}px 0px -60% 0px`,
      threshold: 0,
    },
  )

  for (const el of elements) {
    observer.observe(el)
  }
}

watch(items, (nextItems) => {
  activeId.value = nextItems[0]?.id ?? ''
  nextTick(() => {
    setupObserver()
    scrollToHashIfPresent()
  })
}, { immediate: true, deep: true })

watch(() => route.path, () => {
  activeId.value = items.value[0]?.id ?? ''
})

onUnmounted(() => observer?.disconnect())
</script>

<template>
  <aside
    v-if="items.length"
    class="hidden w-56 shrink-0 self-stretch flex-col border-l border-zinc-200 dark:border-zinc-800 lg:flex"
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
            @click="onTocLinkClick(item.id, $event)"
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
                @click="onTocLinkClick(child.id, $event)"
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
          <DocsGithubIcon class="!h-3.5 !w-3.5" />
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
