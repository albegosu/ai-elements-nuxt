<script setup lang="ts">
defineProps<{
  compact?: boolean
}>()

defineEmits<{
  click: []
}>()
</script>

<template>
  <div
    class="docs-nav-search"
    :class="{ 'docs-nav-search--compact': compact }"
  >
    <button
      type="button"
      class="docs-search-btn"
      aria-label="Search"
      @click="$emit('click')"
    >
      <span class="docs-search-btn-container">
        <svg
          class="docs-search-icon"
          fill="none"
          viewBox="0 0 20 20"
          stroke="currentColor"
          stroke-width="1.6"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m14.386 14.386 4.088 4.088-4.088-4.088A7.533 7.533 0 1 1 3.733 3.733a7.533 7.533 0 0 1 10.653 10.653z"
          />
        </svg>
        <span class="docs-search-placeholder">Search</span>
      </span>
      <span class="docs-search-keys">
        <kbd class="docs-search-key docs-search-key--mod" />
        <kbd class="docs-search-key docs-search-key--letter">K</kbd>
      </span>
    </button>
  </div>
</template>
