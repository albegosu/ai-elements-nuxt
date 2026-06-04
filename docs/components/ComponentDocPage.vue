<script setup lang="ts">
import type { PropRow } from '~/components/PropsTable.vue'
import type { DocsTocItem } from '~/composables/useDocsToc'
import { findComponent } from '~/data/navigation'
import { getComponentMeta } from '~/data/component-meta'

const props = defineProps<{
  category: string
  slug: string
}>()

const doc = computed(() => findComponent(props.category, props.slug))
const meta = computed(() => getComponentMeta(props.category, props.slug))
const { setToc, clearToc } = useDocsToc()

const demoModules = import.meta.glob('./demos/**/*.vue', { eager: false })
const demoSources = import.meta.glob('./demos/**/*.vue', { eager: false, query: '?raw', import: 'default' })

const DemoComponent = computed(() => {
  const key = `./demos/${props.category}/${props.slug}.vue`
  const loader = demoModules[key]
  if (!loader) return null
  return defineAsyncComponent(loader as () => Promise<{ default: Component }>)
})

const demoCode = ref('')

watchEffect(async () => {
  const key = `./demos/${props.category}/${props.slug}.vue`
  const loader = demoSources[key]
  if (loader) {
    demoCode.value = (await loader()) as string
  } else {
    demoCode.value = ''
  }
})

const propRows = computed<PropRow[]>(() => meta.value?.props ?? [])

const tocItems = computed<DocsTocItem[]>(() => {
  const items: DocsTocItem[] = [{ id: 'preview', label: 'Preview' }]
  if (meta.value?.code) {
    items.push({ id: 'usage', label: 'Usage' })
  }
  if (propRows.value.length) {
    items.push({
      id: 'props',
      label: 'Props',
      children: propRows.value.map(row => ({
        id: `prop-${row.name}`,
        label: row.name,
      })),
    })
  }
  if (meta.value?.slots?.length) {
    items.push({
      id: 'slots',
      label: 'Slots',
      children: meta.value.slots.map(slot => ({
        id: `slot-${slot}`,
        label: slot,
      })),
    })
  }
  return items
})

watch(
  [tocItems, () => props.category, () => props.slug],
  () => {
    if (doc.value) {
      setToc(tocItems.value, { category: props.category, slug: props.slug })
    }
  },
  { immediate: true },
)

onUnmounted(() => clearToc())

if (import.meta.server && !doc.value) {
  throw createError({ statusCode: 404, statusMessage: 'Component not found' })
}
</script>

<template>
  <div v-if="doc">
    <DocsHeader
      :title="doc.name"
      :description="doc.description"
      :component="doc.component"
    />

    <section
      id="preview"
      class="mb-10 scroll-mt-24"
    >
      <ComponentPreview :code="demoCode">
        <component
          :is="DemoComponent"
          v-if="DemoComponent"
        />
        <p
          v-else
          class="text-sm text-zinc-500"
        >
          Demo coming soon.
        </p>
      </ComponentPreview>
    </section>

    <section
      v-if="meta?.code"
      id="usage"
      class="mb-10 scroll-mt-24"
    >
      <h2 class="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        Usage
      </h2>
      <div class="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
        <DocsCodePanel :code="meta.code" />
      </div>
    </section>

    <section
      v-if="propRows.length"
      id="props"
      class="mb-10 scroll-mt-24"
    >
      <h2 class="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        Props
      </h2>
      <PropsTable :rows="propRows" />
    </section>

    <section
      v-if="meta?.slots?.length"
      id="slots"
      class="mb-10 scroll-mt-24"
    >
      <h2 class="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        Slots
      </h2>
      <ul class="list-inside list-disc space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
        <li
          v-for="slot in meta.slots"
          :id="`slot-${slot}`"
          :key="slot"
          class="scroll-mt-24"
        >
          <code class="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs dark:bg-zinc-800">{{ slot }}</code>
        </li>
      </ul>
    </section>
  </div>
</template>
