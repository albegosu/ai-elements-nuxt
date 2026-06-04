<script setup lang="ts">
const html = `<div style="font-family:system-ui;padding:16px">
  <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
    <div style="width:8px;height:8px;border-radius:50%;background:#22c55e"></div>
    <span style="font-size:13px;font-weight:600">StatusBadge.vue</span>
  </div>
  <div style="display:flex;gap:8px">
    <span style="padding:4px 10px;border-radius:6px;background:#f0fdf4;font-size:12px;color:#16a34a">Online</span>
    <span style="padding:4px 10px;border-radius:6px;background:#fefce8;font-size:12px;color:#ca8a04">Streaming</span>
  </div>
</div>`
</script>

<template>
  <div class="w-full max-w-sm overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
    <AiVuePreview :html="html" title="StatusBadge" height="120px">
      <template #header="{ title: t }">
        <div class="border-b border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
          {{ t }}
        </div>
      </template>
    </AiVuePreview>
  </div>
</template>
