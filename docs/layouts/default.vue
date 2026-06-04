<script setup lang="ts">
const route = useRoute()
const { clearToc } = useDocsToc()

watch(
  () => route.path,
  (path) => {
    if (!/^\/components\/[^/]+\/[^/]+$/.test(path)) {
      clearToc()
    }
  },
)
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <DocsSidebar />
    <div class="flex min-w-0 flex-1 flex-col overflow-hidden">
      <DocsNavbar />
      <div class="flex min-h-0 flex-1 overflow-hidden">
        <main class="docs-scroll min-w-0 flex-1 overflow-y-auto">
          <div class="mx-auto max-w-3xl px-8 py-10">
            <slot />
          </div>
        </main>
        <DocsToc />
      </div>
    </div>
  </div>
</template>
