<script setup lang="ts">
import { categories } from '~/data/navigation'
import { guides } from '~/data/guides'

const route = useRoute()

function isActive(path: string) {
  return route.path === path
}

function isCategoryActive(categoryId: string) {
  return route.path.startsWith(`/components/${categoryId}`)
}

const linkClass = 'block rounded-md px-2 py-1.5 text-[13px] text-zinc-600 transition hover:bg-zinc-900/5 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/8 dark:hover:text-zinc-100'
const linkActiveClass = 'bg-zinc-900/8 font-medium text-zinc-900 dark:bg-white/10 dark:text-zinc-50'
</script>

<template>
  <aside class="hidden h-screen w-64 shrink-0 flex-col border-r border-zinc-200/70 bg-white/65 backdrop-blur-xl backdrop-saturate-150 md:flex dark:border-zinc-800/60 dark:bg-zinc-950/55">
    <div class="flex h-14 shrink-0 flex-col justify-center border-b border-zinc-200/80 px-4 dark:border-zinc-800/80">
      <NuxtLink
        to="/"
        class="text-sm font-semibold leading-tight text-zinc-900 dark:text-zinc-50"
      >
        AI Elements Nuxt
      </NuxtLink>
      <p class="text-xs leading-tight text-zinc-500 dark:text-zinc-500">
        Component docs
      </p>
    </div>

    <nav class="docs-scroll min-h-0 flex-1 overflow-y-auto px-3 py-4">
      <NuxtLink
        to="/"
        :class="[linkClass, { [linkActiveClass]: isActive('/') }]"
      >
        Home
      </NuxtLink>
      <NuxtLink
        to="/components"
        :class="[linkClass, 'mt-0.5', { [linkActiveClass]: isActive('/components') }]"
      >
        Components
      </NuxtLink>

      <div class="mt-6 border-t border-zinc-200/70 pt-6 dark:border-zinc-800/50">
        <p
          class="px-2 text-[11px] font-bold uppercase tracking-widest text-zinc-500"
          :class="{ 'text-zinc-700 dark:text-zinc-300': route.path.startsWith('/guides') }"
        >
          Guides
        </p>
        <ul class="mt-2 space-y-0.5">
          <li
            v-for="guide in guides"
            :key="guide.slug"
          >
            <NuxtLink
              :to="`/guides/${guide.slug}`"
              :class="[linkClass, { [linkActiveClass]: isActive(`/guides/${guide.slug}`) }]"
            >
              {{ guide.title }}
            </NuxtLink>
          </li>
        </ul>
      </div>

      <div class="mt-6 border-t border-zinc-200/70 pt-6 dark:border-zinc-800/50">
        <p
          class="px-2 text-[11px] font-bold uppercase tracking-widest text-zinc-500"
          :class="{ 'text-zinc-700 dark:text-zinc-300': route.path.startsWith('/playground') }"
        >
          Playground
        </p>
        <ul class="mt-2 space-y-0.5">
          <li>
            <NuxtLink
              to="/playground"
              :class="[linkClass, { [linkActiveClass]: isActive('/playground') }]"
            >
              Chat Demo
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/playground/agent"
              :class="[linkClass, { [linkActiveClass]: isActive('/playground/agent') }]"
            >
              Agent Demo
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/playground/streaming"
              :class="[linkClass, { [linkActiveClass]: isActive('/playground/streaming') }]"
            >
              Streaming
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/playground/code"
              :class="[linkClass, { [linkActiveClass]: isActive('/playground/code') }]"
            >
              Code
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/playground/voice"
              :class="[linkClass, { [linkActiveClass]: isActive('/playground/voice') }]"
            >
              Voice & Workflow
            </NuxtLink>
          </li>
        </ul>
      </div>

      <div
        v-for="category in categories"
        :key="category.id"
        class="mt-6 border-t border-zinc-200/70 pt-6 dark:border-zinc-800/50"
      >
        <p
          class="px-2 text-[11px] font-bold uppercase tracking-widest text-zinc-500"
          :class="{ 'text-zinc-700 dark:text-zinc-300': isCategoryActive(category.id) }"
        >
          {{ category.label }}
        </p>
        <p class="mt-0.5 mb-2 px-2 text-xs leading-snug text-zinc-500 dark:text-zinc-600">
          {{ category.description }}
        </p>
        <ul class="space-y-0.5">
          <li
            v-for="comp in category.components"
            :key="comp.slug"
          >
            <NuxtLink
              :to="`/components/${category.id}/${comp.slug}`"
              :class="[linkClass, { [linkActiveClass]: isActive(`/components/${category.id}/${comp.slug}`) }]"
            >
              {{ comp.name }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </nav>
  </aside>
</template>
