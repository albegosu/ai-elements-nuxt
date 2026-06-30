<script setup lang="ts">
const route = useRoute()
const { clearToc, setToc, buildTocFromHeadings, pageSourceFromPath } = useDocsToc()

function refreshPageToc(path: string) {
  if (!import.meta.client) return

  const source = pageSourceFromPath(path)
  if (!source) {
    clearToc()
    return
  }

  nextTick(() => {
    nextTick(() => {
      const toc = buildTocFromHeadings()
      if (toc.length) {
        setToc(toc, source)
      } else {
        clearToc()
      }
    })
  })
}

watch(
  () => route.path,
  (path) => {
    if (COMPONENT_DOC_PATH.test(path)) return

    if (AUTO_TOC_PATH.test(path)) {
      refreshPageToc(path)
      return
    }

    clearToc()
  },
  { immediate: true },
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
