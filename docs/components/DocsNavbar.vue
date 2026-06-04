<script setup lang="ts">
import { categories } from '~/data/navigation'
import { guides } from '~/data/guides'

const colorMode = useColorMode()
const route = useRoute()
const commandOpen = ref(false)
const screenOpen = ref(false)

function isActive(path: string) {
  return route.path === path
}

function isCategoryActive(id: string) {
  return route.path.startsWith(`/components/${id}`)
}

const mobileLinkClass = 'block rounded-md px-3 py-2 text-sm text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
const mobileLinkActiveClass = 'bg-zinc-100 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50'

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
      <Transition name="fade">
        <div
          v-if="screenOpen"
          class="fixed inset-0 top-14 z-40 bg-zinc-950/50 md:hidden"
          @click="screenOpen = false"
        />
      </Transition>
      <Transition name="slide">
        <nav
          v-if="screenOpen"
          class="fixed inset-y-0 right-0 top-14 z-50 flex w-72 flex-col overflow-hidden border-l border-zinc-200 bg-white shadow-2xl md:hidden dark:border-zinc-800 dark:bg-zinc-950"
          aria-label="Mobile navigation"
        >
          <!-- Top actions -->
          <div class="flex shrink-0 items-center gap-2 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <button
              type="button"
              class="flex flex-1 items-center gap-2 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400"
              @click="commandOpen = true; screenOpen = false"
            >
              <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              Search…
            </button>
            <button
              type="button"
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 dark:border-zinc-700 dark:text-zinc-400"
              :aria-label="colorMode.value === 'dark' ? 'Light mode' : 'Dark mode'"
              @click="colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'"
            >
              <svg v-if="colorMode.value === 'dark'" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
              <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            </button>
          </div>

          <!-- Scrollable nav -->
          <div class="docs-scroll flex-1 overflow-y-auto px-3 py-4">
            <NuxtLink
              to="/"
              :class="[mobileLinkClass, { [mobileLinkActiveClass]: isActive('/') }]"
              @click="screenOpen = false"
            >
              Home
            </NuxtLink>
            <NuxtLink
              to="/components"
              :class="[mobileLinkClass, 'mt-0.5', { [mobileLinkActiveClass]: isActive('/components') }]"
              @click="screenOpen = false"
            >
              Components
            </NuxtLink>

            <!-- Guides -->
            <div class="mt-5 border-t border-zinc-200/70 pt-5 dark:border-zinc-800/50">
              <p class="mb-2 px-3 text-[11px] font-bold uppercase tracking-widest text-zinc-400">Guides</p>
              <ul class="space-y-0.5">
                <li v-for="guide in guides" :key="guide.slug">
                  <NuxtLink
                    :to="`/guides/${guide.slug}`"
                    :class="[mobileLinkClass, { [mobileLinkActiveClass]: isActive(`/guides/${guide.slug}`) }]"
                    @click="screenOpen = false"
                  >
                    {{ guide.title }}
                  </NuxtLink>
                </li>
              </ul>
            </div>

            <!-- Playground -->
            <div class="mt-5 border-t border-zinc-200/70 pt-5 dark:border-zinc-800/50">
              <p class="mb-2 px-3 text-[11px] font-bold uppercase tracking-widest text-zinc-400">Playground</p>
              <ul class="space-y-0.5">
                <li v-for="link in [
                  { to: '/playground', label: 'Chat Demo' },
                  { to: '/playground/agent', label: 'Agent Demo' },
                  { to: '/playground/streaming', label: 'Streaming' },
                  { to: '/playground/code', label: 'Code' },
                  { to: '/playground/voice', label: 'Voice & Workflow' },
                ]" :key="link.to">
                  <NuxtLink
                    :to="link.to"
                    :class="[mobileLinkClass, { [mobileLinkActiveClass]: isActive(link.to) }]"
                    @click="screenOpen = false"
                  >
                    {{ link.label }}
                  </NuxtLink>
                </li>
              </ul>
            </div>

            <!-- Component categories -->
            <div
              v-for="cat in categories"
              :key="cat.id"
              class="mt-5 border-t border-zinc-200/70 pt-5 dark:border-zinc-800/50"
            >
              <p
                class="mb-2 px-3 text-[11px] font-bold uppercase tracking-widest"
                :class="isCategoryActive(cat.id) ? 'text-zinc-700 dark:text-zinc-300' : 'text-zinc-400'"
              >
                {{ cat.label }}
              </p>
              <ul class="space-y-0.5">
                <li v-for="comp in cat.components" :key="comp.slug">
                  <NuxtLink
                    :to="`/components/${cat.id}/${comp.slug}`"
                    :class="[mobileLinkClass, { [mobileLinkActiveClass]: isActive(`/components/${cat.id}/${comp.slug}`) }]"
                    @click="screenOpen = false"
                  >
                    {{ comp.name }}
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </Transition>
    </Teleport>
  </header>
</template>
