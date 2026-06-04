# AGENTS.md — ai-elements-nuxt

Generic instructions for AI coding agents implementing Nuxt 3 / Vue 3 apps with **ai-elements-nuxt**: a headless UI layer on top of the [Vercel AI SDK](https://ai-sdk.dev) (`ai` ^6, `@ai-sdk/vue` ^3).

**Hosted docs:** https://albegosu.github.io/ai-elements-nuxt/

Copy this file into consumer repos or link agents to it when building chat, agent, or RAG interfaces.

---

## What this library provides

| Layer | Responsibility |
|-------|----------------|
| **Components** (`Ai*`) | Headless UI: slots + `data-ai-*` hooks (52 components) |
| **Composables** | `useAiChat`, `useAiAgent`, persistence, workflow, markdown |
| **Utils** | `toAiMessageProps` — map `UIMessage` → `AiMessageProps` |
| **Server** | `createChatHandler`, `createAgentHandler`, `createMockChatHandler` |

The library does **not** ship a full design system. Style with your CSS/Tailwind using `[data-ai-message]`, `[data-role]`, etc.

---

## Install

### From npm

Published as [`ai-elements-nuxt`](https://www.npmjs.com/package/ai-elements-nuxt):

```bash
pnpm add ai-elements-nuxt ai @ai-sdk/vue
```

### From GitHub

For the latest commit from the repository (not the npm release):

```bash
pnpm add github:albegosu/ai-elements-nuxt
```

If pnpm blocks lifecycle scripts, allow the module build:

```yaml
# pnpm-workspace.yaml (consumer monorepo root)
allowBuilds:
  ai-elements-nuxt: true
```

### Nuxt config

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['ai-elements-nuxt'],
  aiElements: {
    defaultStyles: true, // optional base CSS for [data-ai-*]
  },
})
```

**Peer dependencies:** `nuxt` ^3, `ai` ^6, `@ai-sdk/vue` ^3 (required for streaming chat).

---

## Types (TypeScript in consumer apps)

| Import path | When to use |
|-------------|-------------|
| `ai-elements-nuxt/types` | Explicit types in `.ts` files, shared DTOs, RAG mappers |
| `#ai-elements` | Nuxt module alias (same runtime types; use inside the Nuxt app) |
| Auto-import | `toAiMessageProps`, composables, `Ai*` components — no import needed in `.vue` when the module is enabled |

```ts
import type { AiMessageProps, AiSource, AiToolCall } from 'ai-elements-nuxt/types'
```

`AiMessageProps` includes optional `metadata?: Record<string, unknown>` for app-specific RAG fields.

---

## Components (auto-imported)

- Prefix: **`Ai`** + PascalCase (`Message.vue` → `AiMessage`).
- **Do not** manually import `Ai*` in Nuxt apps with the module enabled.
- Categories: **chatbot**, **code**, **voice**, **workflow**, **utilities**.

### `AiMessage` (central piece)

Bind props from `aiMessages` or build manually:

```vue
<AiMessage v-for="(msg, i) in aiMessages" :key="i" v-bind="msg">
  <template #content="{ content, isStreaming }">
    <AiStreamingCursor v-if="isStreaming && content" :active="true" />
    {{ content }}
  </template>
  <template #tool-calls="{ toolCalls }">
    <AiTool v-for="tc in toolCalls" :key="tc.id" :tool-call="tc" />
  </template>
  <template #sources="{ sources }">
    <AiSources :sources="sources" />
  </template>
</AiMessage>
```

Common slots: `avatar`, `reasoning`, `tool-calls`, `attachments`, `content`, `sources`, `actions`, `metadata`.

### `AiConversation` is a thread list (sidebar)

`AiConversation` manages **conversation threads** (`threads`, `activeId`, `@select`) — not the scrollable message area.

```vue
<!-- Sidebar -->
<AiConversation :threads="threads" :active-id="activeId" @select="onSelectThread" />

<!-- Message area (your layout) -->
<div data-ai-message-list class="chat-thread" role="log">
  <AiMessage v-for="(msg, i) in aiMessages" :key="i" v-bind="msg" />
</div>
<AiPromptInput v-model="input" @submit="handleSubmit" />
```

### `AiPromptInput` — single-line or commands

Default is a `<textarea>`. For a single-line terminal input or slash commands, use slot `#input` and bind `:handle-keydown` from slot props (component-level `@keydown` does not run when `#input` is overridden).

### `AiModelSelector`

- Default slot exposes `select` for full custom lists.
- `#option` slot: `{ model, selected, select }`.
- Dropdown closes on click-outside.

---

## Composables

| Composable | Use when |
|------------|----------|
| `useAiChat({ api })` | Streaming chat via AI SDK `Chat` + `DefaultChatTransport` |
| `useAiChat({ api, body: () => ({...}) })` | Same, with dynamic request body (RAG, model, session id) |
| `useAiChat()` (no `api`) | Local-only messages (demos, custom backends) |
| `useAiChatPersisted({ key })` | Persist local chat to storage |
| `useAiAgent({ api })` | Tools, steps, plan, tasks, human-in-the-loop approval |
| `useAiTools(toolDefs, agent)` | Per-tool UI metadata wired to `useAiAgent` |
| `useAiWorkflow(initialData?)` | Workflow graph state |
| `useAiMarkdown(content)` | Markdown → sanitized HTML |
| `useAiCompletion(options)` | Non-chat text generation |

### `useAiChat` with dynamic body (RAG / multi-tenant)

Pass `body`, `headers`, or `credentials` — forwarded to `DefaultChatTransport` (plain value, Promise, or function):

```ts
const conversationId = ref('abc')
const model = ref('gpt-4o')

const { aiMessages, input, handleSubmit, isStreaming } = useAiChat({
  api: '/api/chat',
  body: () => ({
    conversationId: conversationId.value,
    model: model.value,
    searchMode: searchMode.value,
  }),
})
```

For `prepareSendMessagesRequest` or a custom transport class, use `Chat` + `DefaultChatTransport` directly and map with `toAiMessageProps` (see Recipe 4).

### Mapping messages

```ts
const props = toAiMessageProps(uiMessage, 'streaming' | 'complete' | 'error')
```

Enrich for RAG display:

```ts
function toDisplayMessage(msg: UIMessage, status: AiMessageProps['status']): AiMessageProps {
  const base = toAiMessageProps(msg, status)
  return {
    ...base,
    sources: mapDomainSources(msg.metadata?.sources),
    metadata: { ...base.metadata, latencyMs: msg.metadata?.latencyMs },
  }
}
```

---

## Server (Nitro)

Import from **`ai-elements-nuxt/server`** in `server/api/*.post.ts`.

| Helper | Purpose |
|--------|---------|
| `createChatHandler({ model, system? })` | `streamText` → UI message stream |
| `createAgentHandler({ model, tools, maxSteps?, system? })` | Multi-step agent; `requireConfirmation: true` on tools |
| `createMockChatHandler()` | Demo stream without API keys |

Default request body from the client: `{ messages: UIMessage[] }` plus any extra fields you send via `useAiChat` `body`.

---

## Recipe 1: Streaming chat

### Server — `server/api/chat.post.ts`

```ts
import { createMockChatHandler } from 'ai-elements-nuxt/server'
// Production:
// import { createChatHandler } from 'ai-elements-nuxt/server'
// import { openai } from '@ai-sdk/openai'
// export default createChatHandler({ model: openai('gpt-4o') })

export default createMockChatHandler()
```

### Page — `pages/chat.vue`

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

## Recipe 2: Tool approval (human-in-the-loop)

Server: `requireConfirmation: true` on sensitive tools in `createAgentHandler`.

Client:

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

`useAiAgent` calls `addToolApprovalResponse` after approve/deny and resumes when approvals are complete.

---

## Recipe 3: Agent with tools

### Server

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

### Client

```vue
<script setup lang="ts">
const agent = useAiAgent({ api: '/api/chat' })
const toolDefs = [
  { name: 'getWeather', description: 'Weather lookup', icon: '🌤' },
  { name: 'deleteFile', description: 'Delete file', requireConfirmation: true },
]
useAiTools(toolDefs, agent)
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

## Recipe 4: RAG / custom transport (advanced)

**Prefer** `useAiChat` + `body` when you only need extra JSON on each request.

**Use manual `Chat`** when you need `prepareSendMessagesRequest` or a custom transport:

```ts
import { Chat } from '@ai-sdk/vue'
import { DefaultChatTransport } from 'ai'

const chat = new Chat({
  transport: new DefaultChatTransport({
    api: '/api/chat',
    prepareSendMessagesRequest: ({ messages, body }) => ({
      body: { ...body, messages, ragProfile: 'default' },
    }),
  }),
})

const aiMessages = computed(() =>
  chat.messages.map((msg, i) => {
    const isLast = i === chat.messages.length - 1
    const status = isLast && chat.status === 'streaming' ? 'streaming' : 'complete'
    return toAiMessageProps(msg, status)
  }),
)
```

Guide: `/guides/custom-transport` on the docs site.

---

## Styling

- Hook: `[data-ai-message][data-role="user"]`, `[data-ai-tool][data-status="output-available"]`, etc.
- Optional: `aiElements: { defaultStyles: true }` loads `ai-elements.css`.
- Override slots instead of forking components.

---

## Do not

- Force Tailwind or a specific design inside the library consumer’s fork of components.
- Import `Ai*` manually when the Nuxt module auto-imports them.
- Use legacy `toolInvocations`-only shapes — use `UIMessage.parts` and `toAiMessageProps`.
- Put message lists inside `AiConversation` — use `AiConversation` for the sidebar only.
- Assume `ChatInit` accepts `body` — pass `body` to `useAiChat` or to `DefaultChatTransport`.

---

## Documentation map

| Topic | Path (docs site) |
|-------|------------------|
| Getting started | `/guides/getting-started` |
| Building a chat | `/guides/building-a-chat` |
| Custom transport & RAG | `/guides/custom-transport` |
| Building an agent | `/guides/building-an-agent` |
| Styling | `/guides/styling` |
| Composables | `/guides/composables` |
| Component reference | `/components/chatbot/message`, etc. |

**Local docs:** `pnpm dev` → http://localhost:3000

---

## Working on this repository (contributors)

See [.github/CONTRIBUTING.md](.github/CONTRIBUTING.md) for build, test, and docs conventions. Cursor users also have [.cursor/rules/ai-elements.mdc](.cursor/rules/ai-elements.mdc) as a short scoped reminder.
