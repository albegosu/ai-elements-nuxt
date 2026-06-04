<script setup lang="ts">
const { aiMessages, input, handleSubmit, status, stop, isStreaming } = useAiChat({
  api: '/api/chat',
})
</script>

<template>
  <div class="page">
    <h1>Streaming Chat (AI SDK)</h1>
    <p class="hint">
      Uses <code>useAiChat</code> + mock <code>/api/chat</code> — no API key required.
    </p>

    <div class="messages">
      <AiMessage
        v-for="(msg, i) in aiMessages"
        :key="i"
        v-bind="msg"
        :status="i === aiMessages.length - 1 && isStreaming ? 'streaming' : msg.status"
      >
        <template #reasoning="{ reasoning, isStreaming: streaming }">
          <AiReasoning v-if="reasoning" :content="reasoning" :streaming="streaming" />
        </template>
        <template #content="{ content, isStreaming: streaming }">
          <AiShimmer v-if="streaming && !content" :lines="2" />
          <div v-else-if="content">{{ content }}</div>
        </template>
      </AiMessage>
    </div>

    <form class="input-row" @submit="handleSubmit">
      <AiPromptInput
        v-model="input"
        :loading="isStreaming"
        placeholder="Ask anything..."
        @stop="stop"
      />
    </form>

    <p class="status">
      Status: <strong>{{ status }}</strong>
    </p>

    <nav>
      <NuxtLink to="/">← Chatbot demo</NuxtLink>
    </nav>
  </div>
</template>

<style scoped>
.page {
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem;
  font-family: system-ui, sans-serif;
}
.hint {
  color: #666;
  font-size: 0.9rem;
}
.messages {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 200px;
  margin: 1.5rem 0;
}
.input-row {
  margin-top: 1rem;
}
.status {
  font-size: 0.85rem;
  color: #888;
  margin-top: 0.5rem;
}
nav {
  margin-top: 2rem;
}
</style>
