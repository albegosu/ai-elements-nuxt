<script setup lang="ts">
definePageMeta({ layout: 'default' })
</script>

<template>
  <div>
    <DocsHeader
      title="Styling Guide"
      description="Style headless components with data-ai-* attributes, slots, and optional base CSS."
    />

    <section class="space-y-8 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
      <div>
        <h2 class="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          data-ai-* attributes
        </h2>
        <p class="mb-3">
          Components expose semantic hooks instead of bundled Tailwind. Example selectors:
        </p>
        <div class="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <pre class="overflow-x-auto bg-zinc-950 p-4 text-[13px] text-zinc-100"><code>[data-ai-message][data-role="user"] { align-self: flex-end; }
[data-ai-message][data-role="assistant"] { align-self: flex-start; }
[data-ai-tool][data-status="approval-requested"] { font-weight: 600; }
[data-ai-prompt-input][data-loading] { opacity: 0.8; }</code></pre>
        </div>
      </div>

      <div>
        <h2 class="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Optional base CSS
        </h2>
        <p>
          Enable <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">aiElements.defaultStyles: true</code>
          in <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">nuxt.config.ts</code>
          to load <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">ai-elements.css</code>
          (messages, tools, code blocks, workflow nodes, markdown tables).
        </p>
      </div>

      <div>
        <h2 class="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Slots
        </h2>
        <p class="mb-3">
          Override any section without reimplementing logic. <code>AiMessage</code> slots:
          <code>avatar</code>, <code>reasoning</code>, <code>tool-calls</code>, <code>content</code>, <code>sources</code>, <code>actions</code>.
        </p>
        <div class="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <pre class="overflow-x-auto bg-zinc-950 p-4 text-[13px] text-zinc-100"><code>&lt;AiMessage v-bind="msg"&gt;
  &lt;template #content="{ content, isStreaming }"&gt;
    &lt;div class="rounded-xl bg-zinc-100 px-4 py-2"&gt;
      {{ content }}&lt;AiStreamingCursor v-if="isStreaming" /&gt;
    &lt;/div&gt;
  &lt;/template&gt;
&lt;/AiMessage&gt;</code></pre>
        </div>
      </div>

      <div>
        <h2 class="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Tailwind in docs / apps
        </h2>
        <p>
          The docs site uses Tailwind on top of headless components. Your design system stays in your app — the module only provides structure and AI SDK glue.
        </p>
      </div>
    </section>
  </div>
</template>
