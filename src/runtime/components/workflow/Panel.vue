<script setup lang="ts">
const props = withDefaults(defineProps<{
  title?: string
  position?: 'left' | 'right'
  width?: string
  collapsible?: boolean
  collapsed?: boolean
}>(), {
  position: 'right',
  width: '280px',
  collapsible: true,
  collapsed: false,
})

const isCollapsed = ref(props.collapsed)

watch(() => props.collapsed, (val) => {
  if (val !== undefined) isCollapsed.value = val
})

function toggle() {
  isCollapsed.value = !isCollapsed.value
}
</script>

<template>
  <div
    data-ai-panel
    :data-position="position"
    :data-collapsed="isCollapsed || undefined"
    :style="{ width: isCollapsed ? 'auto' : width }"
    role="complementary"
    :aria-label="title ?? 'Panel'"
  >
    <slot name="header" :title="title" :collapsed="isCollapsed" :toggle="toggle" :collapsible="collapsible">
      <div v-if="title || collapsible" data-ai-panel-header>
        <slot name="title" :title="title">
          <span v-if="title && !isCollapsed" data-ai-panel-title>{{ title }}</span>
        </slot>
        <button
          v-if="collapsible"
          type="button"
          @click="toggle"
          :aria-label="isCollapsed ? 'Expand panel' : 'Collapse panel'"
          :aria-expanded="!isCollapsed"
        >
          {{ isCollapsed ? (position === 'left' ? '▶' : '◀') : (position === 'left' ? '◀' : '▶') }}
        </button>
      </div>
    </slot>

    <div v-show="!isCollapsed" data-ai-panel-body>
      <slot />
    </div>
  </div>
</template>
