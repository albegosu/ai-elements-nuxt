# ai-elements-nuxt

[![CI](https://github.com/albegosu/ai-elements-nuxt/actions/workflows/ci.yml/badge.svg)](https://github.com/albegosu/ai-elements-nuxt/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/ai-elements-nuxt.svg)](LICENSE)
[![version](https://img.shields.io/npm/v/ai-elements-nuxt.svg)](https://www.npmjs.com/package/ai-elements-nuxt)

**Nuxt/Vue complement to [Vercel AI Elements](https://github.com/vercel/ai-elements)** — headless AI UI components for the [AI SDK](https://ai-sdk.dev) ecosystem.

[Documentation](https://albegosu.github.io/ai-elements-nuxt/) · [Contributing](.github/CONTRIBUTING.md) · [Code of Conduct](.github/CODE_OF_CONDUCT.md) · [Security](.github/SECURITY.md) · [Changelog](CHANGELOG.md)

> Not a replacement for AI Elements. This project extends the same UI patterns to Nuxt 3 and Vue 3 so you can build AI-native apps with your own design system.

## Install

```bash
pnpm add ai-elements-nuxt ai @ai-sdk/vue
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['ai-elements-nuxt'],
  aiElements: {
    defaultStyles: true, // optional base CSS for [data-ai-*] attributes
  },
})
```

## Quick start (streaming chat)

**1. Server route** (`server/api/chat.post.ts`):

```ts
import { createMockChatHandler } from 'ai-elements-nuxt/server'
// Or with a real model:
// import { createChatHandler } from 'ai-elements-nuxt/server'
// import { openai } from '@ai-sdk/openai'
// export default createChatHandler({ model: openai('gpt-4o') })

export default createMockChatHandler()
```

**2. Page**:

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

## Agentic apps

**Server** — multi-step tools with optional human approval:

```ts
import { createAgentHandler } from 'ai-elements-nuxt/server'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'

export default createAgentHandler({
  model: openai('gpt-4o'),
  maxSteps: 10,
  tools: {
    getWeather: {
      description: 'Get weather for a city',
      parameters: z.object({ city: z.string() }),
      execute: async ({ city }) => ({ temp: 72, city }),
    },
    deleteFile: {
      description: 'Delete a file',
      parameters: z.object({ path: z.string() }),
      requireConfirmation: true,
      execute: async ({ path }) => ({ deleted: path }),
    },
  },
})
```

**Client** — `useAiAgent` + `useAiTools`:

```vue
<script setup lang="ts">
const agent = useAiAgent({ api: '/api/chat' })
useAiTools([{ name: 'getWeather' }, { name: 'deleteFile', requireConfirmation: true }], agent)
const { aiMessages, steps, pendingConfirmation, approve, deny, handleSubmit, input } = agent
</script>

<template>
  <AiAgent :steps="steps" title="Agent run" />
  <AiToolApproval
    v-if="pendingConfirmation"
    :tool-call="{ id: pendingConfirmation.id, name: pendingConfirmation.title, status: 'approval-requested', approvalId: pendingConfirmation.id }"
    @approve="approve(pendingConfirmation.id)"
    @deny="deny(pendingConfirmation.id)"
  />
  <AiMessage v-for="(msg, i) in aiMessages" :key="i" v-bind="msg" />
  <form @submit="handleSubmit">
    <AiPromptInput v-model="input" />
  </form>
</template>
```

See [AGENTS.md](./AGENTS.md) for step-by-step recipes for coding agents.

## Markdown rendering

```vue
<script setup lang="ts">
const { html } = useAiMarkdown(() => markdownSource)
</script>

<template>
  <AiMarkdown :content="markdownSource" />
  <!-- or -->
  <div v-html="html" />
</template>
```

GFM (tables, task lists, strikethrough) is enabled by default via `marked`. Use exported `simpleParse` for a lightweight fallback.

## Components (52)

All components are auto-imported with the `Ai` prefix.

| Category | Components |
|----------|------------|
| **Chatbot** | Message, PromptInput, Conversation, Reasoning, ChainOfThought, Sources, Tool, ToolApproval, Suggestion, Attachments, Shimmer, StreamingCursor, Plan, Task, Checkpoint, Confirmation, Context, Queue, InlineCitation, ModelSelector, ErrorBoundary |
| **Code** | CodeBlock, Terminal, FileTree, StackTrace, Agent, Artifact, Commit, SchemaDisplay, PackageInfo, EnvVars, TestResults, Snippet, WebPreview, Sandbox, VuePreview |
| **Voice** | SpeechInput, Transcription, AudioPlayer, MicSelector, VoiceSelector, Persona |
| **Workflow** | Canvas, Node, Edge, Connection, Controls, Panel, Toolbar |
| **Utilities** | Image, OpenInChat, Markdown |

## Composables

| Composable | Description |
|------------|-------------|
| `useAiChat` | Wraps `@ai-sdk/vue` `Chat` when `api` is set; local state otherwise |
| `useAiChatLocal` | Local message state without AI SDK |
| `useAiChatPersisted` | `useAiChat` with localStorage/sessionStorage persistence |
| `useAiAgent` | Agent steps, plan, tasks, and confirmation flow on top of chat |
| `useAiTools` | Declarative per-tool UI metadata wired to `useAiAgent` |
| `useAiWorkflow` | Workflow graph nodes/edges state |
| `useAiCompletion` | Wraps `@ai-sdk/vue` `useCompletion` |
| `useAiMarkdown` | Markdown string → sanitized HTML (GFM via `marked`) |
| `mapMessageParts` / `toAiMessageProps` | Map AI SDK `UIMessage.parts` → `AiMessage` props |

## Server utilities

```ts
import {
  createChatHandler,
  createMockChatHandler,
  createAgentHandler,
} from 'ai-elements-nuxt/server'
```

## Development

```bash
git clone https://github.com/albegosu/ai-elements-nuxt.git
cd ai-elements-nuxt
pnpm install
pnpm dev
```

See [.github/CONTRIBUTING.md](.github/CONTRIBUTING.md) for the full contributor guide (lint, test, docs conventions).

## Documentation & playground

```bash
pnpm dev
```

Opens the docs site at `http://localhost:3000` (or the [hosted docs](https://albegosu.github.io/ai-elements-nuxt/)) with:
- **Guides**: getting started, building a chat, building an agent, styling, composables
- Component reference with Preview/Code tabs for all 52 components
- Playgrounds: chat, streaming, agent, code, voice & workflow

## Philosophy

- **Headless**: slot-driven, `data-ai-*` attributes, no forced design system
- **Compatible**: follows AI SDK `UIMessage.parts` contract
- **Nuxt-native**: module auto-imports, Nitro server helpers
- **Agent-ready**: `AGENTS.md` and `.cursor/rules/` for AI coding tools

## Credits

Inspired by and designed to complement [vercel/ai-elements](https://github.com/vercel/ai-elements) and the [AI SDK](https://ai-sdk.dev).

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](.github/CONTRIBUTING.md) and our [Code of Conduct](.github/CODE_OF_CONDUCT.md) before opening a pull request.

## License

MIT
