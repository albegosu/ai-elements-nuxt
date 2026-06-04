<script setup lang="ts">
import type { AiPackageData } from '../../types'

defineProps<{
  package: AiPackageData
}>()
</script>

<template>
  <div data-ai-package role="article" :aria-label="`Package: ${package.name}`">
    <slot :pkg="package">
      <slot name="header" :pkg="package">
        <div data-ai-package-header>
          <slot name="name" :package-name="package.name" :version="package.version">
            <span data-ai-package-name>{{ package.name }}</span>
            <span data-ai-package-version>@{{ package.version }}</span>
          </slot>
        </div>
      </slot>

      <slot name="description" :description="package.description">
        <div v-if="package.description" data-ai-package-desc>{{ package.description }}</div>
      </slot>

      <slot name="meta" :pkg="package">
        <div data-ai-package-meta>
          <span v-if="package.license" data-ai-package-license>{{ package.license }}</span>
          <span v-if="package.downloads" data-ai-package-downloads>{{ package.downloads.toLocaleString() }} downloads</span>
        </div>
      </slot>

      <slot name="links" :pkg="package">
        <div data-ai-package-links>
          <a v-if="package.homepage" :href="package.homepage" target="_blank" rel="noopener" data-ai-package-link>Homepage</a>
          <a v-if="package.repository" :href="package.repository" target="_blank" rel="noopener" data-ai-package-link>Repository</a>
        </div>
      </slot>

      <slot name="dependencies" :dependencies="package.dependencies" v-if="package.dependencies && Object.keys(package.dependencies).length">
        <div data-ai-package-deps>
          <div data-ai-package-deps-title>Dependencies</div>
          <div v-for="(version, name) in package.dependencies" :key="name" data-ai-package-dep>
            <span data-ai-package-dep-name>{{ name }}</span>
            <span data-ai-package-dep-version>{{ version }}</span>
          </div>
        </div>
      </slot>
    </slot>
  </div>
</template>
