<template>
  <AiImage
    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop"
    alt="Mountain landscape with clouds"
    :zoomable="true"
  >
    <template #default="{ src, alt, toggleZoom }">
      <div class="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div class="p-2">
          <img
            :src="src"
            :alt="alt"
            class="w-full cursor-zoom-in rounded-lg object-cover"
            @click="toggleZoom"
          >
        </div>
        <div class="border-t border-zinc-100 px-4 py-2.5 dark:border-zinc-800">
          <div class="flex items-center gap-2">
            <svg class="h-3.5 w-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
            </svg>
            <span class="text-xs text-zinc-500 dark:text-zinc-400">Mountain landscape with clouds</span>
          </div>
        </div>
      </div>
    </template>
  </AiImage>
</template>
