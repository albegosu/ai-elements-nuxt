# AGENTS.md — ai-elements-nuxt

Instructions for AI coding agents building Nuxt/Vue apps with this library.

## Install

```bash
pnpm add ai-elements-nuxt ai @ai-sdk/vue
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['ai-elements-nuxt'],
  aiElements: { defaultStyles: true }, // optional
})
```

Peer deps: `nuxt` ^3, `ai` ^6, `@ai-sdk/vue` ^3 (optional but required for streaming).

---

## Recipe 1: Scaffold a streaming chat page

### 1. Server route — `server/api/chat.post.ts`

```ts
import { createMockChatHandler } from 'ai-elements-nuxt/server'
// Production:
// import { createChatHandler } from 'ai-elements-nuxt/server'
// import { openai } from '@ai-sdk/openai'
// export default createChatHandler({ model: openai('gpt-4o') })

export default createMockChatHandler()
```

### 2. Page — `pages/chat.vue` (or `app.vue`)

```vue
<script setup lang="ts">
const { aiMessages, input, handleSubmit, isStreaming } = useAiChat({ api: '/api/chat' })
</script>

<template>
  <AiMessage v-for="(msg, i) in aiMessages" :key="i" v-bind="msg">
    <template #content="{ content, isStreaming: streaming }">
      <AiStreamingCursor v-if="streaming && content" :active="true" />
      {{ content }}
    </template>
  </AiMessage>
  <form @submit="handleSubmit">
    <AiPromptInput v-model="input" :loading="isStreaming" />
  </form>
</template>
```

---

## Recipe 2: Wire tool approval flow

Use when the model calls tools that need human approval before execution.

### Server — tools with confirmation

Define tools in `createAgentHandler` with `requireConfirmation: true` for sensitive actions (see Recipe 3).

### Client — `pages/agent.vue`

```vue
<script setup lang="ts">
const agent = useAiAgent({ api: '/api/chat' })
const { aiMessages, steps, pendingConfirmation, approve, deny, handleSubmit, input, isStreaming } = agent
</script>

<template>
  <AiAgent :steps="steps" title="Agent run" />
  <AiToolApproval
    v-if="pendingConfirmation"
    :tool-call="{
      id: pendingConfirmation.id,
      name: 'tool',
      status: 'approval-requested',
      approvalId: pendingConfirmation.id,
    }"
    @approve="approve(pendingConfirmation!.id)"
    @deny="deny(pendingConfirmation!.id)"
  />
  <AiMessage v-for="(msg, i) in aiMessages" :key="i" v-bind="msg" />
  <form @submit="handleSubmit">
    <AiPromptInput v-model="input" :loading="isStreaming" />
  </form>
</template>
```

`useAiAgent` calls `addToolApprovalResponse` after `approve` / `deny` and uses `lastAssistantMessageIsCompleteWithApprovalResponses` to resume the stream.

---

## Recipe 3: Build an agent with tools

### 1. Server — `server/api/chat.post.ts`

```ts
import { createAgentHandler } from 'ai-elements-nuxt/server'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'

export default createAgentHandler({
  model: openai('gpt-4o'),
  system: 'You are a helpful assistant with tools.',
  maxSteps: 10,
  tools: {
    getWeather: {
      description: 'Get weather for a city',
      parameters: z.object({ city: z.string() }),
      execute: async ({ city }) => ({ city, temp: 72, unit: 'F' }),
    },
    deleteFile: {
      description: 'Delete a file path',
      parameters: z.object({ path: z.string() }),
      requireConfirmation: true,
      execute: async ({ path }) => ({ deleted: path }),
    },
  },
})
```

For demos without API keys, keep `createMockChatHandler()` and simulate tool UI client-side with `useAiChatLocal` + manual `toolCalls` on messages.

### 2. Client — declarative tool UI

```vue
<script setup lang="ts">
const agent = useAiAgent({ api: '/api/chat' })
const toolDefs = [
  { name: 'getWeather', description: 'Weather lookup', icon: '🌤' },
  { name: 'deleteFile', description: 'Delete file', requireConfirmation: true },
]
const { getToolMeta, pendingApprovals, activeTools } = useAiTools(toolDefs, agent)
const { aiMessages, steps, handleSubmit, input, isStreaming } = agent
</script>

<template>
  <AiAgent :steps="steps" />
  <AiMessage v-for="(msg, i) in aiMessages" :key="i" v-bind="msg">
    <template #tool-calls="{ toolCalls }">
      <AiTool v-for="tc in toolCalls" :key="tc.id" :tool-call="tc" />
    </template>
  </AiMessage>
  <form @submit="handleSubmit">
    <AiPromptInput v-model="input" :loading="isStreaming" />
  </form>
</template>
```

---

## Reference

- Component docs: run `pnpm dev` → http://localhost:3000
- Guides: `/guides/getting-started`, `/guides/building-a-chat`, `/guides/building-an-agent`, `/guides/styling`
- Cursor rules: `.cursor/rules/ai-elements.mdc`
- Types: `#ai-elements` alias → `src/runtime/types`

## Conventions

- Prefix: `Ai` + PascalCase filename → `AiPromptInput`
- Message mapping: AI SDK `UIMessage` → `AiMessageProps` via `toAiMessageProps`
- Styling: `[data-ai-*]` selectors, not forced Tailwind inside the library
