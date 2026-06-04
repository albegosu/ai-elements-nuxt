<script setup lang="ts">
definePageMeta({ layout: 'default' })
</script>

<template>
  <div>
    <ComponentDocPage category="chatbot" slug="conversation" />

    <section class="mb-10 scroll-mt-24 border-t border-zinc-200 pt-10 dark:border-zinc-800">
      <h2 class="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        Message list pattern
      </h2>
      <p class="mb-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        Use a scrollable container with <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">AiMessage</code>
        for the active thread. <code class="rounded bg-zinc-100 px-1 dark:bg-zinc-800">AiConversation</code>
        belongs in the sidebar; it does not render message content.
      </p>
      <div class="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
        <pre class="overflow-x-auto bg-zinc-950 p-4 text-[13px] text-zinc-100"><code>&lt;div class="chat-layout"&gt;
  &lt;AiConversation
    :threads="threads"
    :active-id="activeId"
    @select="onSelectThread"
  /&gt;

  &lt;div data-ai-message-list class="chat-thread" role="log"&gt;
    &lt;AiMessage
      v-for="(msg, i) in aiMessages"
      :key="i"
      v-bind="msg"
    /&gt;
  &lt;/div&gt;

  &lt;AiPromptInput v-model="input" @submit="handleSubmit" /&gt;
&lt;/div&gt;</code></pre>
      </div>
    </section>
  </div>
</template>
