<script setup lang="ts">
const colorMode = useColorMode()
const route = useRoute()
const commandOpen = ref(false)
const screenOpen = ref(false)

const githubUrl = 'https://github.com/albegosu/ai-elements-nuxt'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Components', to: '/components' },
  { label: 'Playground', to: '/playground' },
]

const navLinkClass =
  'rounded-md px-3 py-1.5 text-sm text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
const navLinkActiveClass =
  '!bg-zinc-100 !font-medium !text-zinc-900 dark:!bg-zinc-800 dark:!text-zinc-50'

watch(() => route.path, () => {
  screenOpen.value = false
})

watch(screenOpen, (open) => {
  if (import.meta.client) {
    document.body.style.overflow = open ? 'hidden' : ''
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <header class="sticky top-0 z-50 h-14 shrink-0 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80">
    <div class="flex h-14 w-full items-center">
      <div class="flex min-w-0 flex-1 justify-center">
        <nav
          class="hidden w-full max-w-3xl items-center justify-center gap-0.5 px-8 md:flex"
          aria-label="Main"
        >
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            :class="navLinkClass"
            :active-class="navLinkActiveClass"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>
      </div>

      <div class="flex shrink-0 items-center gap-2 pr-4 sm:gap-3 sm:pr-6">
        <DocsNavSearchButton
          compact
          @click="commandOpen = true"
        />
        <DocsThemeSwitch />
        <a
          :href="githubUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
          aria-label="GitHub repository"
        >
          <DocsGithubIcon />
        </a>
        <button
          type="button"
          class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-zinc-100 md:hidden dark:text-zinc-400 dark:hover:bg-zinc-800"
          :class="{ 'bg-zinc-100 dark:bg-zinc-800': screenOpen }"
          aria-label="Open menu"
          :aria-expanded="screenOpen"
          @click="screenOpen = !screenOpen"
        >
          <svg
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
          >
            <path
              v-if="!screenOpen"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>

    <DocsCommandPalette v-model="commandOpen" />

    <Teleport to="body">
      <div
        v-if="screenOpen"
        class="fixed inset-0 top-14 z-40 bg-zinc-950/50 md:hidden"
        @click="screenOpen = false"
      />
      <nav
        v-if="screenOpen"
        class="docs-scroll fixed inset-x-0 top-14 z-50 border-b border-zinc-200 bg-white px-6 py-4 md:hidden dark:border-zinc-800 dark:bg-zinc-950"
        aria-label="Mobile"
      >
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          :class="[navLinkClass, 'mb-1 block']"
          :active-class="navLinkActiveClass"
          @click="screenOpen = false"
        >
          {{ link.label }}
        </NuxtLink>
        <button
          type="button"
          :class="[navLinkClass, 'mt-2 block w-full text-left']"
          @click="commandOpen = true; screenOpen = false"
        >
          Search…
        </button>
        <button
          type="button"
          :class="[navLinkClass, 'block w-full text-left']"
          @click="colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'"
        >
          {{ colorMode.value === 'dark' ? 'Light mode' : 'Dark mode' }}
        </button>
      </nav>
    </Teleport>
  </header>
</template>
