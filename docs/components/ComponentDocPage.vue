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
const { setToc } = useDocsToc()

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
  if (meta.value?.events?.length) {
    items.push({
      id: 'events',
      label: 'Events',
      children: meta.value.events.map(event => ({
        id: `event-${event.name}`,
        label: event.name,
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
      setToc(tocItems.value, { type: 'component', category: props.category, slug: props.slug })
    }
  },
  { immediate: true },
)

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
      v-if="meta?.events?.length"
      id="events"
      class="mb-10 scroll-mt-24"
    >
      <h2 class="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        Events
      </h2>
      <div class="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
        <table class="w-full text-left text-sm">
          <thead class="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
            <tr>
              <th class="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                Event
              </th>
              <th class="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                Payload
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-200 dark:divide-zinc-800">
            <tr
              v-for="event in meta.events"
              :id="`event-${event.name}`"
              :key="event.name"
              class="scroll-mt-24 bg-white dark:bg-zinc-950"
            >
              <td class="px-4 py-3 font-mono text-xs text-zinc-900 dark:text-zinc-100">
                @{{ event.name }}
              </td>
              <td class="px-4 py-3 font-mono text-xs text-zinc-600 dark:text-zinc-400">
                {{ event.payload ?? '—' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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
