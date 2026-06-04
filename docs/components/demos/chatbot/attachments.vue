<script setup lang="ts">
const attachments = [
  { id: '1', name: 'architecture.png', type: 'image' as const, previewUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&h=200&fit=crop' },
  { id: '2', name: 'dashboard.jpg', type: 'image' as const, previewUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=200&fit=crop' },
  { id: '3', name: 'report.pdf', type: 'document' as const, size: 245000 },
  { id: '4', name: 'demo.mp4', type: 'video' as const, size: 12400000 },
]
</script>

<template>
  <div class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
    <p class="mb-3 text-xs font-medium text-zinc-500">Attachments</p>
    <AiAttachments :attachments="attachments" layout="grid">
      <template #default="{ attachments: items }">
        <div class="grid grid-cols-4 gap-3">
          <div
            v-for="item in items"
            :key="item.id"
            class="group relative h-24 w-24 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/50"
          >
            <img
              v-if="item.type === 'image' && item.previewUrl"
              :src="item.previewUrl"
              :alt="item.name"
              class="h-full w-full object-cover"
            />
            <div v-else class="flex h-full w-full flex-col items-center justify-center gap-1.5 p-2">
              <!-- File icon -->
              <svg v-if="item.type === 'document'" class="h-6 w-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
              <!-- Video icon -->
              <svg v-else-if="item.type === 'video'" class="h-6 w-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
              <span class="max-w-full truncate text-[10px] text-zinc-500">{{ item.name }}</span>
            </div>
          </div>
        </div>
      </template>
    </AiAttachments>
  </div>
</template>
